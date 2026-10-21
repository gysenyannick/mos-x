"use server";

import { revalidatePath } from "next/cache";
import { FROM_INTERN, esc, sendMail } from "@/lib/mail";
import { getKlant, getMomenten, saveKlant, saveMomenten } from "@/lib/klantenzone/store";
import { brusselNaarDate, fmtDag, fmtUur } from "@/lib/klantenzone/tijd";
import { VERZET_UREN } from "@/lib/klantenzone/types";

/**
 * De klant verzet zelf een afspraak naar een vrij moment.
 * Kan tot VERZET_UREN uur vooraf; het oude moment komt weer vrij.
 */
export async function verzetAfspraak(
  klantId: string, afspraakId: string, momentId: string,
): Promise<{ ok: boolean; fout?: string }> {
  const k = await getKlant(klantId);
  if (!k) return { ok: false, fout: "Dossier niet gevonden." };

  const a = k.afspraken.find((x) => x.id === afspraakId);
  if (!a) return { ok: false, fout: "Afspraak niet gevonden." };

  const grens = Date.now() + VERZET_UREN * 3_600_000;
  if (brusselNaarDate(a.start).getTime() < grens) {
    return { ok: false, fout: `Verzetten kan tot ${VERZET_UREN} uur vooraf. Stuur me een berichtje via WhatsApp.` };
  }

  const momenten = await getMomenten();
  const m = momenten.find((x) => x.id === momentId);
  if (!m || brusselNaarDate(m.start).getTime() < grens) {
    return { ok: false, fout: "Dit moment is net niet meer vrij. Kies een ander moment." };
  }

  const oud = a.start;
  a.start = m.start;
  a.duurMin = m.duurMin;
  // De startdatum schuift mee met de afspraak "Start werken"
  if (a.titel === "Start werken") k.start = { datum: m.start.slice(0, 10), precisie: "dag" };
  k.afspraken.sort((x, y) => x.start.localeCompare(y.start));
  k.log.unshift({
    datum: new Date().toISOString(),
    tekst: `Je hebt "${a.titel}" verzet naar ${fmtDag(m.start)} om ${fmtUur(m.start)}.`,
  });

  // Gekozen moment is bezet, het oude moment komt vrij
  const rest = momenten.filter((x) => x.id !== m.id);
  rest.push({ id: m.id + "o", start: oud, duurMin: m.duurMin });
  await saveMomenten(rest);
  await saveKlant(k);

  // Yannick verwittigen (als mail is ingesteld)
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const naam = `${k.voornaam} ${k.achternaam}`.trim();
    await sendMail(apiKey, {
      from: FROM_INTERN,
      to: [process.env.CONTACT_EMAIL ?? "info@mos-x.be"],
      subject: `📅 ${naam} heeft een afspraak verzet`,
      html: `<div style="font-family:Arial,sans-serif">
        <p><strong>${esc(naam)}</strong> heeft <strong>${esc(a.titel)}</strong> verzet.</p>
        <p>Was: ${esc(fmtDag(oud))} om ${esc(fmtUur(oud))}<br/>
        Nu: <strong>${esc(fmtDag(m.start))} om ${esc(fmtUur(m.start))}</strong></p>
        <p>Adres: ${esc(k.adres)}<br/>Telefoon: ${esc(k.telefoon)}</p>
        <p><a href="https://www.mos-x.be/beheer/${encodeURIComponent(k.id)}">Open dossier</a></p>
      </div>`,
    });
  }

  revalidatePath(`/klant/${k.id}`);
  revalidatePath(`/beheer/${k.id}`);
  return { ok: true };
}
