import { NextResponse } from "next/server";
import { FROM_INTERN, FROM_KLANT, esc, sendMail } from "@/lib/mail";
import { listKlanten, wijzigKlant } from "@/lib/klantenzone/store";
import { effectief } from "@/lib/klantenzone/auto";
import { onderhoudZinvol } from "@/lib/klantenzone/dak";
import { volgendeControle } from "@/lib/klantenzone/onderhoud";
import { dagenTot, fmtMaand } from "@/lib/klantenzone/tijd";

/**
 * Dagelijkse herinnering voor het onderhoud (Vercel Cron, zie vercel.json).
 * Een maand voor de aangeraden onderhoudsmaand krijgt de klant één mail met een
 * knop naar zijn klantenzone. Per onderhoudsdatum vertrekt er maar één mail.
 */
export const dynamic = "force-dynamic";

const VOORAF_DAGEN = 30;

export async function GET(req: Request) {
  const geheim = process.env.CRON_SECRET;
  const dev = process.env.NODE_ENV !== "production";
  if (!dev && (!geheim || req.headers.get("authorization") !== `Bearer ${geheim}`)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const apiKey = process.env.RESEND_API_KEY;
  const basis = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const proef = new URL(req.url).searchParams.get("proef") === "1"; // enkel tonen, niets versturen

  const verstuurd: string[] = [];
  for (const ruw of await listKlanten()) {
    const k = effectief(ruw);
    if (!onderhoudZinvol(k) || !k.email) continue;
    const controle = volgendeControle(k);
    if (!controle || k.herinnerdVoor === controle.datum) continue;
    const dagen = dagenTot(controle.datum);
    if (dagen > VOORAF_DAGEN || dagen < -60) continue;

    verstuurd.push(`${k.voornaam} ${k.achternaam} (${fmtMaand(controle.datum)})`);
    if (proef || !apiKey) continue;

    const link = `${basis}/klant/${k.id}?tab=dak`;
    const r = await sendMail(apiKey, {
      from: FROM_KLANT,
      to: [k.email],
      reply_to: "info@mos-x.be",
      subject: "Tijd voor het onderhoud van je dak",
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1A1A1A">
        <p>Dag ${esc(k.voornaam)},</p>
        <p>Het onderhoud van je dak is aangeraden in <strong>${esc(fmtMaand(controle.datum))}</strong>.
        Met een preventieve anti-mosbehandeling en een inspectie blijft je dak mooi, zonder dat het opnieuw grondig gereinigd moet worden.</p>
        <p>Wil je het laten doen? Met één klik plan je het in. Je krijgt eerst een prijs, je zit nergens aan vast.</p>
        <p><a href="${link}" style="display:inline-block;background:#9BCB6C;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Plan mijn onderhoud</a></p>
        <p>Groeten,<br>Yannick, MOS-X</p>
      </div>`,
    }, `herinnering-${k.id}-${controle.datum}`);
    if (!r.ok) { console.warn("Herinnering niet verstuurd:", r.error); continue; }

    await wijzigKlant(k.id, (x) => {
      x.herinnerdVoor = controle.datum;
      x.log.unshift({ datum: new Date().toISOString(), tekst: `Herinnering voor het onderhoud verstuurd (${fmtMaand(controle.datum)}).` });
    });
  }

  if (verstuurd.length && apiKey && !proef) {
    await sendMail(apiKey, {
      from: FROM_INTERN,
      to: [process.env.CONTACT_EMAIL ?? "info@mos-x.be"],
      subject: `Onderhoudsherinnering verstuurd naar ${verstuurd.length} ${verstuurd.length === 1 ? "klant" : "klanten"}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5"><p>Vandaag kregen deze klanten een herinnering voor hun onderhoud:</p><ul>${verstuurd.map((v) => `<li>${esc(v)}</li>`).join("")}</ul></div>`,
    });
  }

  return NextResponse.json({ ok: true, proef, aantal: verstuurd.length, klanten: verstuurd });
}
