"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, controleerWachtwoord, vereisBeheerder } from "@/lib/klantenzone/auth";
import {
  deleteKlant, getInstellingen, getKlant, getMomenten, herkoppelRefCode, koppelExternId, nieuwId, saveInstellingen,
  saveKlant, saveMomenten,
  verwijderBestand,
} from "@/lib/klantenzone/store";
import {
  FASES, FASE_LABEL, type Aanbeveling, type DocStatus, type Fase, type Klant, type Precisie, type Prioriteit,
  type Verwijzing, type WerkStatus,
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

/** "Dakreiniging en dakcoating" → twee geplande werken */
function werkenUitDienst(dienst: string) {
  const d = dienst.toLowerCase();
  const namen = [
    d.includes("reiniging") && !d.includes("gevel") && "Dakreiniging",
    d.includes("coating") && "Dakcoating",
    d.includes("gevel") && "Gevelreiniging",
    d.includes("dakzorg") && "Inspectie",
  ].filter((x): x is string => !!x);
  return namen.map((naam) => ({ id: nieuwId(6), naam, status: "gepland" as const }));
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
    fase: "gepland",
    afspraken: [], fotos: [], documenten: [],
    garantie: { mosvrijJaren: 2, coatingJaren: s(fd, "dienst").toLowerCase().includes("coating") ? 10 : 0 },
    werken: werkenUitDienst(s(fd, "dienst") || "Dakreiniging"),
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
  await herkoppelRefCode(k);
  if (k.externId) await koppelExternId(k.externId, k.id);
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

/* ── Dakpaspoort, behandelingen en onderhoud ──────────────────────────────── */

export async function bewaarPaspoort(id: string, fd: FormData) {
  const k = await laad(id);
  // Enkel wat de klant ziet; andere velden blijven ongemoeid
  k.paspoort = { ...k.paspoort, aandachtspunten: s(fd, "aandachtspunten") || undefined };
  k.volgendeControle = s(fd, "volgendeControle") || undefined;
  await saveKlant(k);
  ververs(id);
}

export async function voegBehandelingToe(id: string, fd: FormData) {
  const k = await laad(id);
  const datum = s(fd, "datum");
  const soort = s(fd, "soort");
  if (!datum || !soort) return;
  (k.behandelingen ??= []).push({
    id: nieuwId(6), datum, soort,
    producten: s(fd, "producten") || undefined,
    opmerking: s(fd, "opmerking") || undefined,
  });
  k.behandelingen.sort((a, b) => b.datum.localeCompare(a.datum));
  k.log.unshift({ datum: new Date().toISOString(), tekst: `${soort} toegevoegd aan je dakpaspoort.` });
  await saveKlant(k);
  ververs(id);
}

export async function verwijderBehandeling(id: string, behandelingId: string) {
  const k = await laad(id);
  k.behandelingen = (k.behandelingen ?? []).filter((x) => x.id !== behandelingId);
  await saveKlant(k);
  ververs(id);
}

/* ── Aanbevelingen (concrete vaststellingen) ───────────────────────────────── */

export async function voegAanbevelingToe(id: string, fd: FormData) {
  const k = await laad(id);
  const titel = s(fd, "titel");
  if (!titel) return;
  const nu = new Date().toISOString();
  (k.aanbevelingen ??= []).unshift({
    id: nieuwId(6), datum: nu, titel,
    tekst: s(fd, "tekst"),
    prioriteit: (s(fd, "prioriteit") || "aanbevolen") as Prioriteit,
    status: "open",
    fotoUrl: s(fd, "fotoUrl") || undefined,
  });
  k.log.unshift({ datum: nu, tekst: `Nieuwe aanbeveling van Yannick: ${titel}.` });
  await saveKlant(k);
  ververs(id);
}

export async function zetAanbevelingStatus(id: string, abId: string, status: Aanbeveling["status"]) {
  const k = await laad(id);
  const ab = (k.aanbevelingen ?? []).find((x) => x.id === abId);
  if (!ab) return;
  ab.status = status;
  if (status === "gedaan") k.log.unshift({ datum: new Date().toISOString(), tekst: `Uitgevoerd: ${ab.titel}.` });
  await saveKlant(k);
  ververs(id);
}

export async function verwijderAanbeveling(id: string, abId: string) {
  const k = await laad(id);
  k.aanbevelingen = (k.aanbevelingen ?? []).filter((x) => x.id !== abId);
  await saveKlant(k);
  ververs(id);
}

/* ── Dakzorg, aanvragen en doorverwijzingen ───────────────────────────────── */

export async function bewaarDakzorg(id: string, fd: FormData) {
  const k = await laad(id);
  const actief = s(fd, "actief") === "ja";
  if (actief && !k.dakzorg?.actief) {
    k.log.unshift({ datum: new Date().toISOString(), tekst: "Welkom bij MOS-X Dakzorg! Je dak wordt vanaf nu jaarlijks opgevolgd." });
  }
  k.dakzorg = { actief, sinds: s(fd, "sinds") || (actief ? new Date().toISOString().slice(0, 10) : undefined), prijs: s(fd, "prijs") || undefined };
  await saveKlant(k);
  ververs(id);
}

export async function zetAanvraagStatus(id: string, aanvraagId: string, status: "nieuw" | "behandeld") {
  const k = await laad(id);
  const a = (k.aanvragen ?? []).find((x) => x.id === aanvraagId);
  if (!a) return;
  a.status = status;
  await saveKlant(k);
  ververs(id);
}

export async function zetVerwijzingStatus(id: string, vId: string, status: Verwijzing["status"]) {
  const k = await laad(id);
  const v = (k.verwijzingen ?? []).find((x) => x.id === vId);
  if (!v) return;
  if (status === "klant" && v.status !== "klant") {
    k.log.unshift({ datum: new Date().toISOString(), tekst: `${v.naam.split(" ")[0]}, die je doorverwees, is klant geworden. Dankjewel!` });
  }
  v.status = status;
  await saveKlant(k);
  ververs(id);
}

export async function bewaarInstellingen(fd: FormData) {
  await vereisBeheerder();
  const i = await getInstellingen();
  const review = s(fd, "googleReviewUrl");
  await saveInstellingen({
    ...i,
    burenVoordeel: s(fd, "burenVoordeel") || undefined,
    googleReviewUrl: /^https:\/\/\S+$/.test(review) ? review : undefined,
  });
  revalidatePath("/beheer/instellingen");
}

/* ── Acties en kortingen (voor alle klanten) ──────────────────────────────── */

export async function voegActieToe(fd: FormData) {
  await vereisBeheerder();
  const titel = s(fd, "titel");
  if (!titel) return;
  const i = await getInstellingen();
  i.acties = [...(i.acties ?? []), { id: nieuwId(6), titel, tekst: s(fd, "tekst"), geldigTot: s(fd, "geldigTot") || undefined }];
  await saveInstellingen(i);
  revalidatePath("/beheer/instellingen");
}

export async function verwijderActie(actieId: string) {
  await vereisBeheerder();
  const i = await getInstellingen();
  i.acties = (i.acties ?? []).filter((a) => a.id !== actieId);
  await saveInstellingen(i);
  revalidatePath("/beheer/instellingen");
}

/* ── Werken in dit project ────────────────────────────────────────────────── */

export async function voegWerkToe(id: string, fd: FormData) {
  const k = await laad(id);
  const naam = s(fd, "naam");
  if (!naam) return;
  (k.werken ??= []).push({
    id: nieuwId(6), naam, status: "gepland",
    datum: s(fd, "datum") || undefined,
    omschrijving: s(fd, "omschrijving") || undefined,
  });
  await saveKlant(k);
  ververs(id);
}

export async function zetWerkStatus(id: string, werkId: string, status: WerkStatus) {
  const k = await laad(id);
  const w = (k.werken ?? []).find((x) => x.id === werkId);
  if (!w || w.status === status) return;
  const nu = new Date().toISOString();
  w.status = status;
  if (status === "bezig") k.log.unshift({ datum: nu, tekst: `Gestart: ${w.naam.toLowerCase()}.` });
  if (status === "klaar") {
    w.datum = w.datum && w.datum <= nu.slice(0, 10) ? w.datum : nu.slice(0, 10);
    k.log.unshift({ datum: nu, tekst: `Klaar: ${w.naam.toLowerCase()}.` });
    // Afgewerkt werk komt automatisch in de onderhoudshistoriek van het dakpaspoort
    if (!(k.behandelingen ?? []).some((b) => b.soort === w.naam && b.datum === w.datum)) {
      (k.behandelingen ??= []).unshift({ id: nieuwId(6), datum: w.datum, soort: w.naam, opmerking: w.omschrijving });
      k.behandelingen.sort((a, b) => b.datum.localeCompare(a.datum));
    }
  }
  await saveKlant(k);
  ververs(id);
}

export async function verwijderWerk(id: string, werkId: string) {
  const k = await laad(id);
  k.werken = (k.werken ?? []).filter((x) => x.id !== werkId);
  await saveKlant(k);
  ververs(id);
}

/* ── Opmerkingen op Mijn dak ──────────────────────────────────────────────── */

export async function voegOpmerkingToe(id: string, fd: FormData) {
  const k = await laad(id);
  const tekst = s(fd, "tekst");
  if (!tekst) return;
  // Antwoorden betekent: de vragen van de klant zijn gezien
  for (const o of k.opmerkingen ?? []) if (o.van === "klant") o.nieuw = false;
  (k.opmerkingen ??= []).push({ id: nieuwId(6), datum: new Date().toISOString(), van: "yannick", tekst, belangrijk: s(fd, "belangrijk") === "ja" || undefined });
  await saveKlant(k);
  ververs(id);
}

export async function opmerkingGezien(id: string) {
  const k = await laad(id);
  for (const o of k.opmerkingen ?? []) if (o.van === "klant") o.nieuw = false;
  await saveKlant(k);
  ververs(id);
}

export async function verwijderOpmerking(id: string, opmerkingId: string) {
  const k = await laad(id);
  k.opmerkingen = (k.opmerkingen ?? []).filter((o) => o.id !== opmerkingId);
  await saveKlant(k);
  ververs(id);
}
