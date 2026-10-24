"use server";

import { revalidatePath } from "next/cache";
import { FROM_INTERN, esc, sendMail } from "@/lib/mail";
import { sendToBeavr } from "@/lib/beavr";
import { stuurLinkOpnieuw } from "@/lib/klantenzone/meldingen";
import { getInstellingen, getMomenten, klantVoorRefCode, listKlanten, nieuwId, saveMomenten, wijzigKlant } from "@/lib/klantenzone/store";
import { PUNTEN, actieVoorKlant, controleerVerwijzing, interesseVoor, voegTransactieToe } from "@/lib/klantenzone/voordeel";
import { brusselNaarDate, fmtDag, fmtUur } from "@/lib/klantenzone/tijd";
import { AANVRAAG_LABEL, CHECKLIST, VERZET_UREN, aanvraagLoopt, type AanvraagSoort, type Klant } from "@/lib/klantenzone/types";

type Uitkomst = { ok: boolean; fout?: string; id?: string };

function ververs(id: string) {
  revalidatePath(`/klant/${id}`);
  revalidatePath(`/beheer/${id}`);
  revalidatePath("/beheer");
}

async function meldAanYannick(onderwerp: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  await sendMail(apiKey, {
    from: FROM_INTERN,
    to: [process.env.CONTACT_EMAIL ?? "info@mos-x.be"],
    subject: onderwerp,
    html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5">${html}</div>`,
  });
}

function klantBlok(k: Klant) {
  return `<p>${esc(`${k.voornaam} ${k.achternaam}`.trim())}<br/>${esc(k.adres)}<br/>${esc(k.telefoon)} · ${esc(k.email)}</p>
    <p><a href="https://www.mos-x.be/beheer/${encodeURIComponent(k.id)}">Open dossier</a></p>`;
}

/**
 * De klant verzet zelf een afspraak naar een vrij moment.
 * Kan tot VERZET_UREN uur vooraf; het oude moment komt weer vrij.
 */
export async function verzetAfspraak(klantId: string, afspraakId: string, momentId: string): Promise<Uitkomst> {
  const grens = Date.now() + VERZET_UREN * 3_600_000;
  const momenten = await getMomenten();
  const m = momenten.find((x) => x.id === momentId);
  if (!m || brusselNaarDate(m.start).getTime() < grens) {
    return { ok: false, fout: "Dit moment is net niet meer vrij. Kies een ander moment." };
  }

  const r = await wijzigKlant(klantId, (k): Uitkomst & { oud?: string; titel?: string } => {
    const a = k.afspraken.find((x) => x.id === afspraakId);
    if (!a) return { ok: false, fout: "Afspraak niet gevonden." };
    if (brusselNaarDate(a.start).getTime() < grens) {
      return { ok: false, fout: `Verzetten kan tot ${VERZET_UREN} uur vooraf. Stuur me een berichtje via WhatsApp.` };
    }
    const oud = a.start;
    a.start = m.start;
    a.duurMin = m.duurMin;
    // De startdatum schuift mee met de afspraak "Start werken"
    if (a.titel === "Start werken") k.start = { datum: m.start.slice(0, 10), precisie: "dag" };
    k.afspraken.sort((x, y) => x.start.localeCompare(y.start));
    k.log.unshift({ datum: new Date().toISOString(), tekst: `Je hebt "${a.titel}" verzet naar ${fmtDag(m.start)} om ${fmtUur(m.start)}.` });
    return { ok: true, oud, titel: a.titel };
  });
  if (!r) return { ok: false, fout: "Dossier niet gevonden." };
  if (!r.resultaat.ok || !r.resultaat.oud) return r.resultaat;
  const { klant: k, resultaat: { oud, titel = "" } } = r;

  // Gekozen moment is bezet, het oude moment komt vrij
  await saveMomenten([...momenten.filter((x) => x.id !== m.id), { id: m.id + "o", start: oud, duurMin: m.duurMin }]);

  const naam = `${k.voornaam} ${k.achternaam}`.trim();
  await meldAanYannick(`📅 ${naam} heeft een afspraak verzet`, `
    <p><strong>${esc(naam)}</strong> heeft <strong>${esc(titel)}</strong> verzet.</p>
    <p>Was: ${esc(fmtDag(oud))} om ${esc(fmtUur(oud))}<br/>Nu: <strong>${esc(fmtDag(m.start))} om ${esc(fmtUur(m.start))}</strong></p>
    ${klantBlok(k)}`);

  ververs(k.id);
  return { ok: true };
}

/* ── Aanvragen van de klant (onderhoud, aanbeveling, Dakzorg, schade) ─────── */

export async function doeAanvraag(
  klantId: string, soort: AanvraagSoort, tekst: string, aanbevelingId?: string, campagneId?: string,
): Promise<Uitkomst> {
  if (!(soort in AANVRAAG_LABEL)) return { ok: false, fout: "Onbekende aanvraag." };
  const schoon = tekst.trim().slice(0, 1000);
  // Een actie moet echt lopen en voor deze klant gelden; het maximum telt over alle klanten
  let actieTitel: string | undefined;
  if (campagneId) {
    const [i, alle] = await Promise.all([getInstellingen(), listKlanten()]);
    const c = (i.acties ?? []).find((x) => x.id === campagneId);
    const k0 = alle.find((x) => x.id === klantId);
    if (!c || !k0 || !actieVoorKlant(c, k0, interesseVoor(c, alle))) return { ok: false, fout: "Deze actie loopt niet (meer)." };
    actieTitel = c.titel;
  }

  const r = await wijzigKlant(klantId, (k): Uitkomst & { omschrijving?: string } => {
    // Onderhoud of Dakzorg al gevraagd en nog niet behandeld? Dan niet dubbel
    if ((soort === "onderhoud" || soort === "dakzorg") && (k.aanvragen ?? []).some((a) => aanvraagLoopt(a.status) && a.soort === soort)) {
      return { ok: true };
    }
    if (campagneId && (k.aanvragen ?? []).some((a) => a.campagneId === campagneId && aanvraagLoopt(a.status))) return { ok: true };
    let omschrijving = schoon;
    if (soort === "aanbeveling") {
      const ab = (k.aanbevelingen ?? []).find((x) => x.id === aanbevelingId);
      if (!ab) return { ok: false, fout: "Aanbeveling niet gevonden." };
      if (ab.status === "aangevraagd") return { ok: true };
      ab.status = "aangevraagd";
      omschrijving = `${ab.titel}${schoon ? ` · ${schoon}` : ""}`;
    }
    const nu = new Date().toISOString();
    if (actieTitel) omschrijving = `${actieTitel}${omschrijving ? ` · ${omschrijving}` : ""}`;
    const id = nieuwId(6);
    (k.aanvragen ??= []).unshift({ id, datum: nu, soort, tekst: omschrijving, status: "nieuw", campagneId, historiek: [{ datum: nu, status: "nieuw" }] });
    k.log.unshift({ datum: nu, tekst: `Je vroeg: ${AANVRAAG_LABEL[soort].toLowerCase()}. We nemen contact op.` });
    return { ok: true, omschrijving, id };
  });
  if (!r) return { ok: false, fout: "Dossier niet gevonden." };
  const { klant: k, resultaat } = r;
  if (!resultaat.ok || resultaat.omschrijving === undefined) return { ok: resultaat.ok, fout: resultaat.fout };
  const aanvraagId = (resultaat as { id?: string }).id;

  const omschrijving = resultaat.omschrijving;
  await Promise.all([
    meldAanYannick(`🔔 ${k.voornaam}: ${AANVRAAG_LABEL[soort]}`, `<p><strong>${esc(AANVRAAG_LABEL[soort])}</strong></p>
      ${omschrijving ? `<p>${esc(omschrijving)}</p>` : ""}${klantBlok(k)}`),
    sendToBeavr({
      name: `${k.voornaam} ${k.achternaam}`.trim(), email: k.email, phone: k.telefoon, address: k.adres,
      service: AANVRAAG_LABEL[soort], note: omschrijving,
      answers: { Aanvraag: "Klantenzone", Soort: AANVRAAG_LABEL[soort] },
      page: "https://www.mos-x.be/klantenzone",
    }),
  ]);

  ververs(k.id);
  return { ok: true, id: aanvraagId };
}

export async function nietNu(klantId: string, aanbevelingId: string): Promise<void> {
  await wijzigKlant(klantId, (k) => {
    const ab = k.aanbevelingen?.find((x) => x.id === aanbevelingId);
    if (ab?.status === "open") ab.status = "nietnu";
  });
  ververs(klantId);
}

/* ── Buurlink: iemand laat zijn gegevens na via mos-x.be/buur/<code> ──────── */

export async function meldBuurAan(code: string, _: unknown, fd: FormData): Promise<{ ok?: boolean; fout?: string }> {
  const aanbrenger = await klantVoorRefCode(code);
  if (!aanbrenger) return { fout: "Deze link werkt niet meer." };
  const v = (n: string) => String(fd.get(n) ?? "").trim().slice(0, 300);
  if (v("website")) return { ok: true }; // valstrik: bots vullen dit verborgen veld in
  const naam = v("naam"), telefoon = v("telefoon"), adres = v("adres"), bericht = v("bericht");
  if (!naam || !telefoon) return { fout: "Vul je naam en gsm-nummer in." };

  const vandaag = new Date().toISOString().slice(0, 10);
  const controle = controleerVerwijzing(aanbrenger, { telefoon, adres }, await listKlanten());
  if (controle.some((c) => c.startsWith("Blokkeert: zelfde"))) return { fout: "Je kan jezelf niet doorverwijzen. Vraag gerust rechtstreeks een prijs aan." };
  const r = await wijzigKlant(aanbrenger.id, (k) => {
    if ((k.verwijzingen ?? []).filter((x) => x.datum.slice(0, 10) === vandaag).length >= 10) return false;
    const nu = new Date().toISOString();
    (k.verwijzingen ??= []).unshift({ id: nieuwId(6), datum: nu, naam, telefoon, adres, bericht: bericht || undefined, status: "nieuw", controle: controle.length ? controle : undefined });
    k.log.unshift({ datum: nu, tekst: "Iemand uit je buurt vroeg een richtprijs aan via jouw link. Bedankt!" });
    return true;
  });
  if (!r) return { fout: "Deze link werkt niet meer." };
  if (!r.resultaat) return { fout: "Er kwamen vandaag al veel aanvragen via deze link. Bel of stuur ons gerust rechtstreeks een WhatsApp." };

  const k = r.klant;
  const door = `${k.voornaam} ${k.achternaam}`.trim();
  await Promise.all([
    meldAanYannick(`🏠 Nieuwe buur via ${k.voornaam}: ${naam}`, `<p><strong>${esc(naam)}</strong><br/>${esc(telefoon)}<br/>${esc(adres)}</p>
      ${bericht ? `<p>${esc(bericht)}</p>` : ""}<p>Aangebracht door: ${esc(door)} (${esc(k.adres)})</p>
      ${controle.length ? `<p><strong>Controle:</strong><br/>${controle.map(esc).join("<br/>")}</p>` : ""}
      <p><a href="https://www.mos-x.be/beheer/${encodeURIComponent(k.id)}">Open dossier van ${esc(k.voornaam)}</a></p>`),
    sendToBeavr({
      name: naam, phone: telefoon, address: adres, note: bericht,
      service: "Doorverwijzing buur",
      answers: { Aanvraag: "Buurlink klantenzone", "Aangebracht door": door, "Adres aanbrenger": k.adres },
      page: `https://www.mos-x.be/buur/${code}`,
    }),
  ]);

  ververs(k.id);
  return { ok: true };
}

/* ── Voorbereiding, review en voorkeuren ───────────────────────────────── */

/** De klant vinkt een punt van de voorbereiding aan of af. */
export async function zetChecklist(klantId: string, punt: string, aan: boolean): Promise<void> {
  if (!CHECKLIST.some((c) => c.id === punt)) return;
  const r = await wijzigKlant(klantId, (k) => {
    k.checklist ??= {};
    if (aan) k.checklist[punt] = new Date().toISOString();
    else delete k.checklist[punt];
  });
  if (r) ververs(klantId);
}

/** De klant klikt het reviewverzoek weg. */
export async function reviewWeg(klantId: string): Promise<void> {
  const r = await wijzigKlant(klantId, (k) => { (k.review ??= {}).weggeklikt = new Date().toISOString(); });
  if (r) ververs(klantId);
}

/** Rechtstreekse feedback aan MOS-X (los van Google, en zonder dat het een review vervangt). */
export async function reviewFeedback(klantId: string, tekst: string): Promise<Uitkomst> {
  const schoon = tekst.trim().slice(0, 2000);
  if (schoon.length < 2) return { ok: false, fout: "Schrijf eerst je feedback." };
  const r = await wijzigKlant(klantId, (k) => { ((k.review ??= {}).feedback ??= []).push({ datum: new Date().toISOString(), tekst: schoon }); });
  if (!r) return { ok: false, fout: "Dossier niet gevonden." };
  await meldAanYannick(`📝 Feedback van ${r.klant.voornaam}`, `<p>${esc(schoon)}</p>${klantBlok(r.klant)}`);
  ververs(klantId);
  return { ok: true };
}

/** Voorkeur voor acties en voorstellen per mail. Operationele berichten gaan altijd. */
export async function zetMarketing(klantId: string, aan: boolean): Promise<void> {
  const r = await wijzigKlant(klantId, (k) => {
    k.voorkeuren = { marketing: aan, sinds: new Date().toISOString(), bron: "Klantenzone: keuze van de klant" };
    k.log.unshift({ datum: k.voorkeuren.sinds, tekst: aan ? "Je koos voor mails met acties en voorstellen." : "Je koos voor geen mails met acties en voorstellen meer." });
  });
  if (r) ververs(klantId);
}

/* ── Opmerking van de klant op Mijn dak ───────────────────────────────────── */

/** De klant kiest of zijn voor- en na-foto op zijn uitnodigingslink staan. */
export async function zetDeelVoorNa(klantId: string, aan: boolean): Promise<void> {
  const r = await wijzigKlant(klantId, (k) => {
    k.deelVoorNa = aan || undefined;
    // Eenmalig punten, ook als de klant het later weer uitzet
    if (aan && PUNTEN.deelVoorNa > 0) voegTransactieToe(k, { id: nieuwId(8), datum: new Date().toISOString(), soort: "toegekend", bedrag: PUNTEN.deelVoorNa, omschrijving: "Je deelt je voor en na met je buren", sleutel: "deel-voorna", door: "systeem" });
  });
  if (r) ververs(klantId);
}

export async function plaatsOpmerking(klantId: string, tekst: string): Promise<Uitkomst> {
  const schoon = tekst.trim().slice(0, 1500);
  if (schoon.length < 2) return { ok: false, fout: "Schrijf eerst je opmerking." };
  const r = await wijzigKlant(klantId, (k) => {
    const vandaagTeller = (k.opmerkingen ?? []).filter((o) => o.van === "klant" && o.datum.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
    if (vandaagTeller >= 10) return false;
    (k.opmerkingen ??= []).push({ id: nieuwId(6), datum: new Date().toISOString(), van: "klant", tekst: schoon, nieuw: true });
    return true;
  });
  if (!r) return { ok: false, fout: "Dossier niet gevonden." };
  if (!r.resultaat) return { ok: false, fout: "Je stuurde vandaag al veel berichten. Stuur ons gerust een WhatsApp." };
  const k = r.klant;
  await meldAanYannick(`💬 Bericht van ${k.voornaam}`, `<p>${esc(schoon)}</p>${klantBlok(k)}`);
  ververs(k.id);
  return { ok: true };
}

/**
 * Een klant vraagt zijn persoonlijke link opnieuw aan via mos-x.be/klant.
 * Altijd hetzelfde antwoord, zodat niemand kan uitzoeken welke adressen klant zijn.
 * Hoogstens één mail per uur per klant (de sleutel van de melding bevat het uur).
 */
export async function vraagLinkAan(_vorige: { klaar: boolean } | null, fd: FormData): Promise<{ klaar: boolean }> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { klaar: false };
  const klanten = (await listKlanten()).filter((k) => !k.demo && k.email?.trim().toLowerCase() === email);
  for (const k of klanten) await stuurLinkOpnieuw(k).catch(() => undefined);
  return { klaar: true };
}
