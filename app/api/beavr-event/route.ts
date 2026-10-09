import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Doorgeefluik voor de metingen van de calculator naar Beavr.
 * Het adres van Beavr blijft zo op de server (BEAVR_INTAKE_URL bij Vercel) en komt niet in de browser.
 */
const EVENTS = new Set(["view", "start", "step", "lead"]);

export async function POST(req: NextRequest) {
  const url = process.env.BEAVR_INTAKE_URL;
  let b: { e?: string; n?: number; step?: string } = {};
  try {
    b = await req.json();
  } catch {
    // lege of ongeldige meting: negeren
  }
  if (url && b.e && EVENTS.has(b.e)) {
    try {
      await fetch(url.replace(/\/$/, "") + "/event", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://www.mos-x.be" },
        body: JSON.stringify({ e: b.e, n: Number(b.n) || undefined, step: String(b.step ?? "").slice(0, 60) }),
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // Beavr even niet bereikbaar: de meting gaat verloren, de bezoeker merkt niets
    }
  }
  return new Response(null, { status: 204 });
}
