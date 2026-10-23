import { plusDagen, plusJaren, vandaag } from "./tijd";
import type { Klant } from "./types";

/**
 * Garantie en onderhoud staan los van elkaar:
 * - De mosgarantie (standaard 2 jaar) geldt zonder voorwaarde van betalend onderhoud.
 * - Na 12 maanden is er een gratis fysieke controle binnen de garantie.
 * - Betalend preventief onderhoud wordt pas aangeraden als de mosgarantie afloopt
 *   (of op de datum die Yannick zelf instelt na een controle).
 */

/** Einde van de mosgarantie (YYYY-MM-DD), of null als die nog niet loopt. */
export function mosGarantieTot(k: Klant): string | null {
  const { mosvrijJaren, vanaf } = k.garantie;
  if (!vanaf || mosvrijJaren <= 0) return null;
  return plusJaren(vanaf, mosvrijJaren);
}

/** Loopt de mosgarantie vandaag nog? */
export function binnenMosGarantie(k: Klant, op = vandaag()): boolean {
  const tot = mosGarantieTot(k);
  return !!tot && op <= tot;
}

/** De gratis controle 12 maanden na de oplevering, en of die al gebeurde. */
export function controle12(k: Klant): { datum: string; gedaan?: string } | null {
  if (!k.garantie.vanaf) return null;
  const datum = plusJaren(k.garantie.vanaf, 1);
  const gedaan = (k.inspecties ?? []).find((i) => i.soort === "12maanden")?.datum;
  return { datum, gedaan };
}

/** Laatste fysieke controle (12-maandencontrole of dakcontrole). */
export function laatsteControle(k: Klant): string | null {
  return (k.inspecties ?? []).filter((i) => i.soort !== "plaatsbezoek").map((i) => i.datum).sort().pop() ?? null;
}

/** Laatste behandeling aan het dak. */
export function laatsteBehandeling(k: Klant): { datum: string; soort: string } | null {
  const b = [...(k.behandelingen ?? [])].sort((a, b) => b.datum.localeCompare(a.datum))[0];
  return b ? { datum: b.datum, soort: b.soort } : null;
}

/**
 * Wanneer is betalend preventief onderhoud aangeraden?
 * - Yannick vulde zelf een datum in (na een controle) → die.
 * - Anders het einde van de mosgarantie; zonder garantie 24 maanden na de laatste behandeling.
 */
export function volgendeControle(k: Klant): { datum: string; reden: string } | null {
  if (k.volgendeControle) return { datum: k.volgendeControle, reden: "Door Yannick aangeraden na een controle van je dak." };
  const tot = mosGarantieTot(k);
  if (tot) return { datum: tot, reden: "Wanneer je mosgarantie afloopt, houdt een preventieve behandeling je dak proper." };
  const laatste = laatsteBehandeling(k);
  if (!laatste) return null;
  return { datum: plusDagen(laatste.datum, 730), reden: "Twee jaar na de laatste behandeling krijgt mos meestal weer vat." };
}

/** Binnen hoeveel dagen is de controle? (negatief = al voorbij) */
export function controleBinnen(datum: string): number {
  return Math.round((new Date(`${datum}T12:00:00Z`).getTime() - new Date(`${vandaag()}T12:00:00Z`).getTime()) / 86_400_000);
}
