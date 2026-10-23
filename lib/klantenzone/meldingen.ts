import { FROM_KLANT, esc, sendMail } from "@/lib/mail";
import { wijzigKlant } from "./store";
import type { Klant } from "./types";

/**
 * Mails naar de klant, met twee soorten:
 * - operationeel (afspraken, foto's, documenten, garantie, controle): altijd, want nodig voor de dienst;
 * - marketing (acties, buurtacties, onderhoudsvoorstel, burenvoordeel): enkel als de klant dat niet uitzette,
 *   maximaal één per 7 dagen, en altijd met een afmeldlink.
 * Dezelfde sleutel wordt nooit twee keer verstuurd.
 */
export type MeldingSoort =
  | "afspraak" | "fotos" | "document" | "oplevering" | "garantie" | "controle" | "bericht" | "beloning" | "aanvraag"
  | "onderhoud" | "actie" | "buurtactie";

const MARKETING: MeldingSoort[] = ["onderhoud", "actie", "buurtactie"];
const MARKETING_PAUZE_DAGEN = 7;

export const basisUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mos-x.be";

/** Mag de klant marketing ontvangen? Standaard ja voor bestaande klanten (gelijkaardige diensten), tenzij afgemeld. */
export function magMarketing(k: Klant): boolean {
  return k.voorkeuren?.marketing !== false;
}

export async function meldKlant(
  k: Klant,
  m: { soort: MeldingSoort; sleutel: string; onderwerp: string; tekst: string; knop?: { label: string; tab: string } },
): Promise<"verstuurd" | "overgeslagen"> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !k.email) return "overgeslagen";
  const marketing = MARKETING.includes(m.soort);
  const log = k.meldingen ?? [];
  if (log.some((x) => x.sleutel === m.sleutel)) return "overgeslagen";
  if (marketing) {
    if (!magMarketing(k)) return "overgeslagen";
    const grens = Date.now() - MARKETING_PAUZE_DAGEN * 86_400_000;
    if (log.some((x) => x.marketing && new Date(x.datum).getTime() > grens)) return "overgeslagen";
  }

  // Eerst vastleggen (met slot), zodat twee gelijktijdige triggers niet allebei versturen
  const r = await wijzigKlant(k.id, (x) => {
    if ((x.meldingen ?? []).some((y) => y.sleutel === m.sleutel)) return false;
    (x.meldingen ??= []).unshift({ datum: new Date().toISOString(), soort: m.soort, sleutel: m.sleutel, marketing });
    x.meldingen = x.meldingen.slice(0, 200);
    return true;
  });
  if (!r?.resultaat) return "overgeslagen";

  const link = `${basisUrl()}/klant/${k.id}?tab=${m.knop?.tab ?? "overzicht"}`;
  const voet = marketing
    ? `<p style="font-size:12px;color:#888">Je krijgt deze mail als klant van MOS-X. Liever geen voorstellen of acties meer?
       <a href="${basisUrl()}/klant/${k.id}?tab=hulp#voorkeuren" style="color:#888">Pas je voorkeuren aan</a>.</p>`
    : "";
  const res = await sendMail(apiKey, {
    from: FROM_KLANT,
    to: [k.email],
    reply_to: "info@mos-x.be",
    subject: m.onderwerp,
    html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1A1A1A">
      <p>Dag ${esc(k.voornaam)},</p>
      <p style="white-space:pre-line">${esc(m.tekst)}</p>
      ${m.knop ? `<p><a href="${link}" style="display:inline-block;background:#9BCB6C;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold">${esc(m.knop.label)}</a></p>` : ""}
      <p>Yannick, MOS-X</p>${voet}</div>`,
  }, `melding-${k.id}-${m.sleutel}`);
  if (!res.ok) console.warn("Melding niet verstuurd:", m.soort, res.error);
  return res.ok ? "verstuurd" : "overgeslagen";
}
