"use server";

import { revalidatePath } from "next/cache";
import { FROM_INTERN, esc, sendMail } from "@/lib/mail";
import { sendToBeavr } from "@/lib/beavr";
import { getMomenten, klantVoorRefCode, nieuwId, saveMomenten, wijzigKlant } from "@/lib/klantenzone/store";
import { brusselNaarDate, fmtDag, fmtUur } from "@/lib/klantenzone/tijd";
import { AANVRAAG_LABEL, VERZET_UREN, type AanvraagSoort, type Klant } from "@/lib/klantenzone/types";

type Uitkomst = { ok: boolean; fout?: string };

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
  klantId: string, soort: AanvraagSoort, tekst: string, aanbevelingId?: string,
): Promise<Uitkomst> {
  if (!(soort in AANVRAAG_LABEL)) return { ok: false, fout: "Onbekende aanvraag." };
  const schoon = tekst.trim().slice(0, 1000);

  const r = await wijzigKlant(klantId, (k): Uitkomst & { omschrijving?: string } => {
    // Onderhoud of Dakzorg al gevraagd en nog niet behandeld? Dan niet dubbel
    if ((soort === "onderhoud" || soort === "dakzorg") && (k.aanvragen ?? []).some((a) => a.status === "nieuw" && a.soort === soort)) {
      return { ok: true };
    }
    let omschrijving = schoon;
    if (soort === "aanbeveling") {
      const ab = (k.aanbevelingen ?? []).find((x) => x.id === aanbevelingId);
      if (!ab) return { ok: false, fout: "Aanbeveling niet gevonden." };
      if (ab.status === "aangevraagd") return { ok: true };
      ab.status = "aangevraagd";
      omschrijving = `${ab.titel}${schoon ? ` · ${schoon}` : ""}`;
    }
    const nu = new Date().toISOString();
    (k.aanvragen ??= []).unshift({ id: nieuwId(6), datum: nu, soort, tekst: omschrijving, status: "nieuw" });
    k.log.unshift({ datum: nu, tekst: `Je vroeg: ${AANVRAAG_LABEL[soort].toLowerCase()}. Yannick neemt contact op.` });
    return { ok: true, omschrijving };
  });
  if (!r) return { ok: false, fout: "Dossier niet gevonden." };
  const { klant: k, resultaat } = r;
  if (!resultaat.ok || resultaat.omschrijving === undefined) return { ok: resultaat.ok, fout: resultaat.fout };

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
  return { ok: true };
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
  const r = await wijzigKlant(aanbrenger.id, (k) => {
    if ((k.verwijzingen ?? []).filter((x) => x.datum.slice(0, 10) === vandaag).length >= 10) return false;
    const nu = new Date().toISOString();
    (k.verwijzingen ??= []).unshift({ id: nieuwId(6), datum: nu, naam, telefoon, adres, bericht: bericht || undefined, status: "nieuw" });
    k.log.unshift({ datum: nu, tekst: "Iemand uit je buurt vroeg een richtprijs aan via jouw link. Bedankt!" });
    return true;
  });
  if (!r) return { fout: "Deze link werkt niet meer." };
  if (!r.resultaat) return { fout: "Er kwamen vandaag al veel aanvragen via deze link. Bel of WhatsApp Yannick gerust rechtstreeks." };

  const k = r.klant;
  const door = `${k.voornaam} ${k.achternaam}`.trim();
  await Promise.all([
    meldAanYannick(`🏠 Nieuwe buur via ${k.voornaam}: ${naam}`, `<p><strong>${esc(naam)}</strong><br/>${esc(telefoon)}<br/>${esc(adres)}</p>
      ${bericht ? `<p>${esc(bericht)}</p>` : ""}<p>Aangebracht door: ${esc(door)} (${esc(k.adres)})</p>
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

/* ── Opmerking van de klant op Mijn dak ───────────────────────────────────── */

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
  if (!r.resultaat) return { ok: false, fout: "Je stuurde vandaag al veel berichten. Stuur Yannick gerust een WhatsApp." };
  const k = r.klant;
  await meldAanYannick(`💬 Bericht van ${k.voornaam}`, `<p>${esc(schoon)}</p>${klantBlok(k)}`);
  ververs(k.id);
  return { ok: true };
}
