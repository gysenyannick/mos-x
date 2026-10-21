import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Toegang tot het beheerscherm (/beheer).
 *
 * Het wachtwoord staat als geheime instelling bij Vercel: ADMIN_PASSWORD.
 * Na het inloggen krijgt de browser een cookie die van dat wachtwoord is
 * afgeleid; wijzig je het wachtwoord, dan is iedereen meteen uitgelogd.
 * Lokaal zonder instelling is het wachtwoord "mosx-dev".
 */

export const ADMIN_COOKIE = "mx_beheer";

function wachtwoord(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (pw) return pw;
  return process.env.NODE_ENV !== "production" ? "mosx-dev" : null;
}

export function beheerActief(): boolean {
  return wachtwoord() !== null;
}

function sessieWaarde(pw: string): string {
  return createHmac("sha256", pw).update("mos-x-beheer-v1").digest("base64url");
}

function gelijk(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function controleerWachtwoord(invoer: string): string | null {
  const pw = wachtwoord();
  if (!pw || !gelijk(invoer, pw)) return null;
  return sessieWaarde(pw);
}

export async function isBeheerder(): Promise<boolean> {
  const pw = wachtwoord();
  if (!pw) return false;
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!c && gelijk(c, sessieWaarde(pw));
}

export async function vereisBeheerder(): Promise<void> {
  if (!(await isBeheerder())) throw new Error("Niet ingelogd");
}
