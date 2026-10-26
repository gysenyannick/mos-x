import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { DAKKLEUREN } from "@/lib/dakkleuren";
import { sendToBeavr } from "@/lib/beavr";
import { FROM_INTERN, FROM_KLANT, dakkleurInternHtml, dakkleurKlantHtml, idempotencyKey, sendMail } from "@/lib/mail";

/**
 * Dakkleur-tool: kleurt het dak op een foto in een Ardocolor-kleur via Google Gemini.
 *
 * Nodig in Vercel:
 *   GEMINI_API_KEY         → sleutel uit Google AI Studio (met betaalaccount)
 *   GEMINI_IMAGE_MODEL     → optioneel, standaard gemini-2.5-flash-image
 *
 * De foto wordt niet bewaard. Per IP en per dag is het aantal beurten beperkt,
 * plus een totaal per dag, zodat de kosten nooit ontsporen.
 *
 * De bezoeker laat eerst voornaam, e-mail en telefoon (WhatsApp) achter. Het
 * resultaat gaat per mail naar de klant, en als lead naar MOS-X met een
 * WhatsApp-knop om het door te sturen.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const PER_IP_PER_DAG = 6;
const TOTAAL_PER_DAG = 300;
const MAX_BASE64 = 4_000_000;

function redis() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

async function binnenLimiet(ip: string): Promise<boolean> {
  const r = redis();
  if (!r) return true;
  const dag = new Date().toISOString().slice(0, 10);
  const [perIp, totaal] = await Promise.all([r.incr(`mx:dakkleur:${dag}:${ip}`), r.incr(`mx:dakkleur:${dag}:totaal`)]);
  if (perIp === 1) await r.expire(`mx:dakkleur:${dag}:${ip}`, 172800);
  if (totaal === 1) await r.expire(`mx:dakkleur:${dag}:totaal`, 172800);
  return perIp <= PER_IP_PER_DAG && totaal <= TOTAAL_PER_DAG;
}

/** Belgisch of internationaal nummer naar het formaat van wa.me (enkel cijfers, met landcode). */
function waNummer(telefoon: string): string {
  let n = telefoon.replace(/[^\d+]/g, "");
  if (n.startsWith("+")) n = n.slice(1);
  else if (n.startsWith("00")) n = n.slice(2);
  else if (n.startsWith("0")) n = "32" + n.slice(1);
  return n.replace(/\D/g, "");
}

async function verstuurResultaat(o: { voornaam: string; email: string; telefoon: string; kleur: string; beeld: { mimeType: string; data: string }; eerste: boolean }): Promise<boolean> {
  const bijlage = { filename: `dak-${o.kleur.toLowerCase().replace(/\s+/g, "-")}.${o.beeld.mimeType.includes("png") ? "png" : "jpg"}`, content: o.beeld.data, content_id: "dakkleur" };

  if (o.eerste) {
    await sendToBeavr({
      name: o.voornaam, email: o.email, phone: o.telefoon,
      service: "Dakcoating",
      note: `Dakkleur-tool: koos ${o.kleur}`,
      answers: { Aanvraag: "Dakkleur-tool", Kleur: o.kleur },
      page: "https://www.mos-x.be/#dakkleur",
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const tekst = `Dag ${o.voornaam}, hier is je dak in ${o.kleur.toLowerCase()}, zoals je het via onze dakkleur-tool bekeek. Groetjes, MOS-X`;
  const waLink = `https://wa.me/${waNummer(o.telefoon)}?text=${encodeURIComponent(tekst)}`;

  const [intern, klant] = await Promise.all([
    sendMail(apiKey, {
      from: FROM_INTERN,
      to: [process.env.CONTACT_EMAIL ?? "info@mos-x.be"],
      reply_to: o.email,
      subject: `🎨 Dakkleur | ${o.voornaam} | ${o.kleur}`,
      html: dakkleurInternHtml({ ...o, waLink }),
      attachments: [bijlage],
    }, idempotencyKey("dakkleur-intern", o.email, o.kleur, o.beeld.data.slice(-48))),
    sendMail(apiKey, {
      from: FROM_KLANT,
      to: [o.email],
      subject: `Je dak in ${o.kleur.toLowerCase()} | MOS-X`,
      html: dakkleurKlantHtml({ voornaam: o.voornaam, kleur: o.kleur }),
      attachments: [bijlage],
    }, idempotencyKey("dakkleur-klant", o.email, o.kleur, o.beeld.data.slice(-48))),
  ]);
  if (!intern.ok) console.error("dakkleur: interne mail", intern.error);
  if (!klant.ok) console.warn("dakkleur: klantmail", klant.error);
  return klant.ok;
}

type GeminiPart = { text?: string; inlineData?: { mimeType: string; data: string }; inline_data?: { mime_type: string; data: string } };

export async function POST(req: Request) {
  const sleutel = process.env.GEMINI_API_KEY;
  if (!sleutel) return NextResponse.json({ fout: "De dakkleur-tool is nog niet actief." }, { status: 503 });

  let body: { foto?: string; kleur?: string; voornaam?: string; email?: string; telefoon?: string; eerste?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ fout: "Ongeldige aanvraag." }, { status: 400 });
  }

  const kleur = DAKKLEUREN.find((k) => k.id === body.kleur);
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(body.foto ?? "");
  if (!kleur || !match) return NextResponse.json({ fout: "Kies een foto en een kleur." }, { status: 400 });
  if (match[2].length > MAX_BASE64) return NextResponse.json({ fout: "Die foto is te groot." }, { status: 413 });

  const voornaam = (body.voornaam ?? "").trim().slice(0, 60);
  const email = (body.email ?? "").trim().slice(0, 120);
  const telefoon = (body.telefoon ?? "").trim().slice(0, 30);
  if (!voornaam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || telefoon.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ fout: "Vul je voornaam, e-mail en telefoonnummer in." }, { status: 400 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "onbekend").split(",")[0].trim();
  if (!(await binnenLimiet(ip))) {
    return NextResponse.json({ fout: "Je hebt vandaag al enkele voorbeelden gemaakt. Probeer morgen opnieuw of vraag een staal aan." }, { status: 429 });
  }

  const opdracht =
    `Edit this photo of a house. Recolor ONLY the pitched roof covering (the roof tiles or slates) as if it was professionally ` +
    `coated with a uniform matte roof coating in the colour "${kleur.en}", close to ${kleur.hex}. Keep the tile shapes, texture, ` +
    `shadows and daylight realistic. Keep everything else exactly identical: walls, windows, gutters, chimneys, solar panels, ` +
    `skylights, ridge details, sky, trees, people, cars, framing, perspective and image size. Do not add, remove or move anything. ` +
    `If no roof is visible, return the photo unchanged.`;

  const model = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";
  let antwoord: Response;
  try {
    antwoord = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": sleutel },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: opdracht }, { inlineData: { mimeType: match[1], data: match[2] } }] }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    });
  } catch {
    return NextResponse.json({ fout: "De AI is even niet bereikbaar. Probeer het zo opnieuw." }, { status: 502 });
  }

  if (!antwoord.ok) {
    console.error("dakkleur: Gemini", antwoord.status, (await antwoord.text()).slice(0, 500));
    return NextResponse.json({ fout: "Het lukte niet om je dak in te kleuren. Probeer een andere foto." }, { status: 502 });
  }

  const data = await antwoord.json();
  const delen: GeminiPart[] = data?.candidates?.[0]?.content?.parts ?? [];
  const beeld = delen.map((d) => d.inlineData ?? (d.inline_data && { mimeType: d.inline_data.mime_type, data: d.inline_data.data })).find(Boolean);
  if (!beeld) return NextResponse.json({ fout: "Het lukte niet om je dak in te kleuren. Probeer een foto waarop het dak goed zichtbaar is." }, { status: 502 });

  const gemaild = await verstuurResultaat({ voornaam, email, telefoon, kleur: kleur.naam, beeld, eerste: body.eerste === true }).catch((e) => {
    console.error("dakkleur: versturen", e);
    return false;
  });

  return NextResponse.json({ beeld: `data:${beeld.mimeType};base64,${beeld.data}`, gemaild });
}
