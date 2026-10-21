import { NextRequest } from "next/server";
import { getKlant } from "@/lib/klantenzone/store";
import { brusselNaarDate } from "@/lib/klantenzone/tijd";
import { AFSPRAAK_TIPS } from "@/lib/klantenzone/types";

export const runtime = "nodejs";

/** Afspraak als .ics-bestand, zodat de klant hem in zijn eigen agenda kan zetten. */
export async function GET(req: NextRequest) {
  const k = await getKlant(req.nextUrl.searchParams.get("k") ?? "");
  const a = k?.afspraken.find((x) => x.id === req.nextUrl.searchParams.get("a"));
  if (!k || !a) return new Response("Niet gevonden", { status: 404 });

  const start = brusselNaarDate(a.start);
  const einde = new Date(start.getTime() + a.duurMin * 60_000);
  const ics = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/[,;]/g, (m) => "\\" + m).replace(/\n/g, "\\n");

  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MOS-X//Klantenzone//NL",
    "BEGIN:VEVENT",
    `UID:${a.id}-${k.id}@mos-x.be`,
    `DTSTAMP:${ics(new Date())}`,
    `DTSTART:${ics(start)}`,
    `DTEND:${ics(einde)}`,
    `SUMMARY:${esc(`MOS-X: ${a.titel}`)}`,
    `LOCATION:${esc(k.adres)}`,
    `DESCRIPTION:${esc(`${a.info || AFSPRAAK_TIPS[a.titel] || ""}\n\nVragen? WhatsApp Yannick: +32 468 35 28 69`.trim())}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="mos-x-${a.start.slice(0, 10)}.ics"`,
    },
  });
}
