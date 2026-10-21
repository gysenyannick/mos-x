"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, controleerWachtwoord, vereisBeheerder } from "@/lib/klantenzone/auth";
import {
  deleteKlant, getKlant, getMomenten, nieuwId, saveKlant, saveMomenten, verwijderBestand,
} from "@/lib/klantenzone/store";
import {
  FASES, FASE_LABEL, type DocStatus, type Fase, type Klant, type Precisie,
} from "@/lib/klantenzone/types";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const n = (fd: FormData, k: string) => {
  const v = s(fd, k).replace(",", ".");
  return v === "" ? undefined : Number(v);
};

function ververs(id?: string) {
  revalidatePath("/beheer");
  if (id) {
    revalidatePath(`/beheer/${id}`);
    revalidatePath(`/klant/${id}`);
  }
}

async function laad(id: string): Promise<Klant> {
  await vereisBeheerder();
  const k = await getKlant(id);
  if (!k) throw new Error("Klant niet gevonden");
  return k;
}

/* ── Inloggen ─────────────────────────────────────────────────────────────── */

export async function login(_: unknown, fd: FormData): Promise<{ fout?: string }> {
  const sessie = controleerWachtwoord(s(fd, "wachtwoord"));
  if (!sessie) return { fout: "Verkeerd wachtwoord." };
  (await cookies()).set(ADMIN_COOKIE, sessie, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
    path: "/", maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/beheer");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/beheer");
}

/* ── Klanten ──────────────────────────────────────────────────────────────── */

export async function maakKlant(fd: FormData) {
  await vereisBeheerder();
  const nu = new Date().toISOString();
  const k: Klant = {
    id: nieuwId(),
    voornaam: s(fd, "voornaam"),
    achternaam: s(fd, "achternaam"),
    telefoon: s(fd, "telefoon"),
    email: s(fd, "email"),
    adres: s(fd, "adres"),
    dienst: s(fd, "dienst") || "Dakreiniging",
    fase: "aanvraag",
    afspraken: [], fotos: [], documenten: [],
    garantie: { mosvrijJaren: 2, coatingJaren: s(fd, "dienst").toLowerCase().includes("coating") ? 10 : 0 },
    log: [{ datum: nu, tekst: "Je dossier is aangemaakt." }],
    aangemaakt: nu, bijgewerkt: nu,
  };
  if (!k.voornaam) throw new Error("Voornaam is verplicht");
  await saveKlant(k);
  ververs();
  redirect(`/beheer/${k.id}`);
}

export async function bewaarKlant(id: string, fd: FormData) {
  const k = await laad(id);
  const nu = new Date().toISOString();

  k.voornaam = s(fd, "voornaam") || k.voornaam;
  k.achternaam = s(fd, "achternaam");
  k.telefoon = s(fd, "telefoon");
  k.email = s(fd, "email");
  k.adres = s(fd, "adres");
  k.dienst = s(fd, "dienst");
  k.bericht = s(fd, "bericht") || undefined;

  const fase = s(fd, "fase") as Fase;
  if (FASES.includes(fase) && fase !== k.fase) {
    k.fase = fase;
    k.log.unshift({ datum: nu, tekst: `Nieuwe stap: ${FASE_LABEL[fase]}.` });
    // Bij "klaar" start de garantie vandaag, als er nog geen datum staat
    if (fase === "klaar" && !k.garantie.vanaf) k.garantie.vanaf = nu.slice(0, 10);
  }

  const startDatum = s(fd, "startDatum");
  const precisie = (s(fd, "startPrecisie") || "dag") as Precisie;
  const oudStart = JSON.stringify(k.start ?? null);
  k.start = startDatum ? { datum: startDatum, precisie } : undefined;
  // Vaste startdag gewijzigd? Dan schuift de afspraak "Start werken" mee (zelfde uur)
  const startAfspraak = k.afspraken.find((a) => a.titel === "Start werken");
  if (k.start?.precisie === "dag" && startAfspraak && startAfspraak.start.slice(0, 10) !== k.start.datum) {
    startAfspraak.start = `${k.start.datum}${startAfspraak.start.slice(10)}`;
    k.afspraken.sort((a, b) => a.start.localeCompare(b.start));
  }
  if (JSON.stringify(k.start ?? null) !== oudStart && k.start) {
    k.log.unshift({
      datum: nu,
      tekst: precisie === "dag" ? "Je startdatum is vastgelegd." : "Je voorlopige startperiode is aangepast.",
    });
  }

  k.garantie = {
    mosvrijJaren: n(fd, "mosvrijJaren") ?? 0,
    coatingJaren: n(fd, "coatingJaren") ?? 0,
    vanaf: s(fd, "garantieVanaf") || undefined,
  };

  await saveKlant(k);
  ververs(id);
}

export async function verwijderKlant(id: string) {
  const k = await laad(id);
  await Promise.all([...k.fotos.map((f) => f.url), ...k.documenten.map((d) => d.url)].map(verwijderBestand));
  await deleteKlant(id);
  ververs();
  redirect("/beheer");
}

export async function nieuweLink(id: string) {
  const k = await laad(id);
  const oudId = k.id;
  k.id = nieuwId();
  await saveKlant(k);
  await deleteKlant(oudId);
  ververs(oudId);
  redirect(`/beheer/${k.id}`);
}

/* ── Afspraken ────────────────────────────────────────────────────────────── */

export async function voegAfspraakToe(id: string, fd: FormData) {
  const k = await laad(id);
  const datum = s(fd, "datum");
  const uur = s(fd, "uur") || "09:00";
  if (!datum) return;
  k.afspraken.push({
    id: nieuwId(6),
    start: `${datum}T${uur}`,
    duurMin: n(fd, "duurMin") ?? 60,
    titel: s(fd, "titel") || "Afspraak",
    info: s(fd, "info") || undefined,
  });
  k.afspraken.sort((a, b) => a.start.localeCompare(b.start));
  // "Start werken" legt meteen ook de startdatum vast: één datum, geen tegenspraak
  if (s(fd, "titel") === "Start werken") k.start = { datum, precisie: "dag" };
  k.log.unshift({ datum: new Date().toISOString(), tekst: `Nieuwe afspraak: ${s(fd, "titel") || "Afspraak"}.` });
  await saveKlant(k);
  ververs(id);
}

export async function verwijderAfspraak(id: string, afspraakId: string) {
  const k = await laad(id);
  k.afspraken = k.afspraken.filter((a) => a.id !== afspraakId);
  await saveKlant(k);
  ververs(id);
}

/* ── Notities (logboek voor de klant) ─────────────────────────────────────── */

export async function voegNotitieToe(id: string, fd: FormData) {
  const k = await laad(id);
  const tekst = s(fd, "tekst");
  if (!tekst) return;
  (k.notities ??= []).unshift({
    id: nieuwId(6),
    datum: new Date().toISOString(),
    titel: s(fd, "titel") || undefined,
    tekst,
  });
  await saveKlant(k);
  ververs(id);
}

export async function verwijderNotitie(id: string, notitieId: string) {
  const k = await laad(id);
  k.notities = (k.notities ?? []).filter((x) => x.id !== notitieId);
  await saveKlant(k);
  ververs(id);
}

/* ── Foto's en documenten (uploaden gebeurt via /api/klantenzone/upload) ── */

export async function verwijderFoto(id: string, fotoId: string) {
  const k = await laad(id);
  const f = k.fotos.find((x) => x.id === fotoId);
  if (f) await verwijderBestand(f.url);
  k.fotos = k.fotos.filter((x) => x.id !== fotoId);
  await saveKlant(k);
  ververs(id);
}

export async function verwijderDocument(id: string, docId: string) {
  const k = await laad(id);
  const d = k.documenten.find((x) => x.id === docId);
  if (d) await verwijderBestand(d.url);
  k.documenten = k.documenten.filter((x) => x.id !== docId);
  await saveKlant(k);
  ververs(id);
}

export async function zetDocumentStatus(id: string, docId: string, status: DocStatus) {
  const k = await laad(id);
  const d = k.documenten.find((x) => x.id === docId);
  if (!d) return;
  if (d.status !== status && status === "betaald") {
    k.log.unshift({ datum: new Date().toISOString(), tekst: `Betaling ontvangen: ${d.titel}. Bedankt!` });
  }
  d.status = status;
  await saveKlant(k);
  ververs(id);
}

/* ── Vrije momenten (om afspraken te verzetten) ───────────────────────────── */

export async function voegMomentToe(fd: FormData) {
  await vereisBeheerder();
  const datum = s(fd, "datum");
  const uren = s(fd, "uren").split(/[\s,;]+/).filter((u) => /^\d{1,2}[:u]\d{2}$/.test(u));
  if (!datum || uren.length === 0) return;
  const m = await getMomenten();
  for (const u of uren) {
    const uur = u.replace("u", ":").padStart(5, "0");
    const start = `${datum}T${uur}`;
    if (!m.some((x) => x.start === start)) m.push({ id: nieuwId(6), start, duurMin: n(fd, "duurMin") ?? 60 });
  }
  await saveMomenten(m);
  revalidatePath("/beheer/momenten");
}

export async function verwijderMoment(momentId: string) {
  await vereisBeheerder();
  await saveMomenten((await getMomenten()).filter((x) => x.id !== momentId));
  revalidatePath("/beheer/momenten");
}
