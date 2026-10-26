import { NextResponse } from "next/server";
import { deflateSync } from "zlib";
import { Redis } from "@upstash/redis";
import { DAKKLEUREN } from "@/lib/dakkleuren";
import { sendToBeavr } from "@/lib/beavr";
import { FROM_INTERN, FROM_KLANT, dakkleurInternHtml, dakkleurKlantHtml, idempotencyKey, sendMail } from "@/lib/mail";

/**
 * Dakkleur-tool: kleurt het dak op een foto in een Ardocolor-kleur via Google Gemini.
 *
 * Nodig in Vercel:
 *   GEMINI_API_KEY         → sleutel uit Google AI Studio (met betaalaccount)
 *   GEMINI_IMAGE_MODEL     → optioneel, standaard gemini-3-pro-image-preview
 *
 * De foto wordt niet bewaard. Per persoon en per verbinding is het aantal beurten beperkt,
 * plus een totaal per maand (budget ±€20), zodat de kosten nooit ontsporen.
 *
 * De bezoeker laat eerst voornaam, e-mail en telefoon (WhatsApp) achter. Het
 * resultaat gaat per mail naar de klant, en als lead naar MOS-X met een
 * WhatsApp-knop om het door te sturen.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

/** Budget: ongeveer €0,13 per voorbeeld, max ±€20 per maand. */
const PER_PERSOON = 3;
const PER_IP_PER_DAG = 6;
const TOTAAL_PER_MAAND = 150;
const MAX_BASE64 = 4_000_000;

function redis() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

/** Geeft de reden terug waarom er geen voorbeeld meer mag, of null als het mag. */
async function limiet(ip: string, email: string): Promise<"persoon" | "maand" | null> {
  const r = redis();
  if (!r) return null;
  const nu = new Date().toISOString();
  const tel = async (sleutel: string, seconden: number) => {
    const n = await r.incr(sleutel);
    if (n === 1) await r.expire(sleutel, seconden);
    return n;
  };
  const [persoon, perIp] = await Promise.all([
    tel(`mx:dakkleur:persoon:${email.toLowerCase()}`, 60 * 60 * 24 * 90),
    tel(`mx:dakkleur:${nu.slice(0, 10)}:${ip}`, 60 * 60 * 48),
  ]);
  if (persoon > PER_PERSOON || perIp > PER_IP_PER_DAG) return "persoon";
  // De maandteller telt alleen beurten die echt naar de AI gaan.
  if ((await tel(`mx:dakkleur:maand:${nu.slice(0, 7)}`, 60 * 60 * 24 * 40)) > TOTAAL_PER_MAAND) return "maand";
  return null;
}

/** Effen kleurstaal als PNG (base64), dat de AI als referentie voor de exacte kleur meekrijgt. */
function kleurstaal(hex: string, maat = 64): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const rij = Buffer.alloc(1 + maat * 3);
  for (let x = 0; x < maat; x++) rij.set([r, g, b], 1 + x * 3);
  const ruw = Buffer.concat(Array.from({ length: maat }, () => rij));
  const crcTabel = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf: Buffer) => {
    let c = 0xffffffff;
    for (const byte of buf) c = crcTabel[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const blok = (type: string, data: Buffer) => {
    const lengte = Buffer.alloc(4);
    lengte.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc(td));
    return Buffer.concat([lengte, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(maat, 0);
  ihdr.writeUInt32BE(maat, 4);
  ihdr.set([8, 2, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    blok("IHDR", ihdr),
    blok("IDAT", deflateSync(ruw)),
    blok("IEND", Buffer.alloc(0)),
  ]).toString("base64");
}

/** Breedte en hoogte uit een JPEG of PNG, zodat het resultaat dezelfde verhouding krijgt als de foto. */
function afmetingen(buf: Buffer): { w: number; h: number } | null {
  if (buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  let i = 2;
  while (i + 9 < buf.length && buf[i] === 0xff) {
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

/** De verhouding uit de lijst die Gemini kent, die het dichtst bij de foto ligt. */
function verhouding(maat: { w: number; h: number } | null): string | undefined {
  if (!maat) return undefined;
  const opties = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9"];
  const doel = maat.w / maat.h;
  return opties.reduce((best, o) => {
    const [a, b] = o.split(":").map(Number);
    const [c, d] = best.split(":").map(Number);
    return Math.abs(Math.log(a / b / doel)) < Math.abs(Math.log(c / d / doel)) ? o : best;
  });
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

type GeminiPart = { text?: string; thought?: boolean; inlineData?: { mimeType: string; data: string }; inline_data?: { mime_type: string; data: string } };

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
  const grens = await limiet(ip, email);
  if (grens === "persoon") {
    return NextResponse.json({ fout: `Je hebt al ${PER_PERSOON} voorbeelden gemaakt. Wil je nog een kleur zien? Vraag een gratis plaatsbezoek aan, dan tonen we je de echte stalen.` }, { status: 429 });
  }
  if (grens === "maand") {
    return NextResponse.json({ fout: "De dakkleur-tool is deze maand volzet. Vraag een gratis plaatsbezoek aan, dan tonen we je de echte stalen." }, { status: 429 });
  }

  const opdracht =
    `The first image is a flat colour sample of the exact target colour. The second image is a photo of a house.\n` +
    `Edit the photo so that ALL visible pitched roof covering (every roof tile or slate, on every roof plane) looks professionally ` +
    `coated with an opaque, uniform matte roof coating in ${kleur.en}, hex ${kleur.hex}. Match the colour sample: the roof must ` +
    `clearly read as this colour, and no trace of the original roof colour, moss or stains may remain.\n` +
    `Keep the tile shapes, joints, texture, shadows and daylight realistic, so lit areas are slightly lighter and shaded areas ` +
    `slightly darker than the sample.\n` +
    `Solar panels and roof windows are dark glass mounted on top of the roof: they are NOT roof covering. Never recolor them; ` +
    `every solar panel keeps its original dark blue-black glass look and stays exactly where it is.\n` +
    `Keep everything else pixel-identical: walls and facade cladding, windows, gutters, chimneys, ` +
    `ridge details, sky, trees, people, cars, framing, perspective and image size. ` +
    `Do not add, remove or move anything. If no roof is visible, return the photo unchanged.`;

  const model = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3-pro-image-preview";
  let antwoord: Response;
  try {
    antwoord = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": sleutel },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [
          { text: opdracht },
          { inlineData: { mimeType: "image/png", data: kleurstaal(kleur.hex) } },
          { inlineData: { mimeType: match[1], data: match[2] } },
        ] }],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: verhouding(afmetingen(Buffer.from(match[2], "base64"))) } },
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
  const beeld = delen.filter((d) => !d.thought).map((d) => d.inlineData ?? (d.inline_data && { mimeType: d.inline_data.mime_type, data: d.inline_data.data })).filter(Boolean).pop();
  if (!beeld) console.error("dakkleur: geen beeld", data?.candidates?.[0]?.finishReason, JSON.stringify(data?.promptFeedback ?? {}), delen.map((d) => d.text?.slice(0, 200) ?? Object.keys(d).join("+")).join(" | "));
  if (!beeld) return NextResponse.json({ fout: "Het lukte niet om je dak in te kleuren. Probeer een foto waarop het dak goed zichtbaar is." }, { status: 502 });

  const gemaild = await verstuurResultaat({ voornaam, email, telefoon, kleur: kleur.naam, beeld, eerste: body.eerste === true }).catch((e) => {
    console.error("dakkleur: versturen", e);
    return false;
  });

  return NextResponse.json({ beeld: `data:${beeld.mimeType};base64,${beeld.data}`, gemaild });
}
