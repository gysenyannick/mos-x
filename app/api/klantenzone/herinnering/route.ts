import { NextResponse } from "next/server";
import { FROM_INTERN, esc, sendMail } from "@/lib/mail";
import { listKlanten } from "@/lib/klantenzone/store";
import { effectief } from "@/lib/klantenzone/auto";
import { meldKlant } from "@/lib/klantenzone/meldingen";
import { binnenMosGarantie, controle12, controleBinnen, volgendeControle } from "@/lib/klantenzone/onderhoud";
import { fmtMaand } from "@/lib/klantenzone/tijd";

/**
 * Dagelijkse automatische meldingen (Vercel Cron, zie vercel.json). Elke melding heeft een vaste
 * sleutel en vertrekt dus maar één keer per klant:
 * - oplevering: de klant krijgt zijn foto's, garantie en dakdossier (operationeel);
 * - 12-maandencontrole komt eraan, een maand op voorhand (operationeel);
 * - onderhoudsvoorstel, een maand voor de aangeraden maand en nooit tijdens de mosgarantie (marketing:
 *   enkel als de klant dat niet uitzette, met afmeldlink).
 * ?proef=1 toont wat er zou vertrekken, zonder te versturen.
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const geheim = process.env.CRON_SECRET;
  const dev = process.env.NODE_ENV !== "production";
  if (!dev && (!geheim || req.headers.get("authorization") !== `Bearer ${geheim}`)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const proef = new URL(req.url).searchParams.get("proef") === "1";
  const lijst: string[] = [];

  for (const ruw of await listKlanten()) {
    const k = effectief(ruw);
    if (!k.email || k.demo) continue;
    const naam = `${k.voornaam} ${k.achternaam}`.trim();
    const stuur = async (soort: Parameters<typeof meldKlant>[1]) => {
      if ((k.meldingen ?? []).some((m) => m.sleutel === soort.sleutel)) return;
      lijst.push(`${naam}: ${soort.onderwerp}`);
      if (!proef) await meldKlant(k, soort);
    };

    if ((k.fase === "klaar" || k.fase === "nazorg") && k.garantie.vanaf) {
      await stuur({
        soort: "oplevering", sleutel: "oplevering",
        onderwerp: "Je dakwerken zijn afgerond",
        tekst: "Je dak is klaar. In je klantenzone vind je de voor- en nafoto's, je garantie en je dakdossier.",
        knop: { label: "Bekijk je dak", tab: "werken" },
      });
    }

    const c12 = controle12(k);
    if (c12 && !c12.gedaan && controleBinnen(c12.datum) <= 30 && controleBinnen(c12.datum) >= -30) {
      await stuur({
        soort: "controle", sleutel: `c12-${c12.datum}`,
        onderwerp: "Je gratis dakcontrole komt eraan",
        tekst: `Rond ${fmtMaand(c12.datum)} komt Yannick je dak gratis nakijken, 12 maanden na je werken. Je krijgt nog een voorstel van datum.`,
        knop: { label: "Bekijk je dakzorg", tab: "dakzorg" },
      });
    }

    const onderhoud = volgendeControle(k);
    if (onderhoud && !binnenMosGarantie(k, onderhoud.datum) && controleBinnen(onderhoud.datum) <= 30 && controleBinnen(onderhoud.datum) >= -60) {
      await stuur({
        soort: "onderhoud", sleutel: `onderhoud-${onderhoud.datum}`,
        onderwerp: "Tijd voor het onderhoud van je dak",
        tekst: `Het onderhoud van je dak is aangeraden in ${fmtMaand(onderhoud.datum)}. Met een preventieve anti-mosbehandeling en een inspectie blijft je dak proper. Je krijgt eerst een prijs, je zit nergens aan vast.`,
        knop: { label: "Plan mijn onderhoud", tab: "dakzorg" },
      });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (lijst.length && apiKey && !proef) {
    await sendMail(apiKey, {
      from: FROM_INTERN,
      to: [process.env.CONTACT_EMAIL ?? "info@mos-x.be"],
      subject: `Klantenzone: ${lijst.length} automatische ${lijst.length === 1 ? "melding" : "meldingen"} verstuurd`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5"><ul>${lijst.map((v) => `<li>${esc(v)}</li>`).join("")}</ul></div>`,
    });
  }
  return NextResponse.json({ ok: true, proef, aantal: lijst.length, meldingen: lijst });
}
