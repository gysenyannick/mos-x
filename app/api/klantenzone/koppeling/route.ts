import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "crypto";
import { getKlant, klantVoorExternId, koppelExternId, nieuwId, saveKlant, wijzigKlant } from "@/lib/klantenzone/store";
import { stuurWelkom } from "@/lib/klantenzone/meldingen";
import {
  DOC_LOG_ZIN, FASES, FOTO_FASE_LABEL, type DocStatus, type DocType, type Fase, type FotoFase, type Klant,
} from "@/lib/klantenzone/types";

export const runtime = "nodejs";

/**
 * Automatische koppeling, zodat Yannick niet alles zelf moet invullen.
 *
 * Een ander systeem (Beavr, Zapier, Make, ...) stuurt een POST naar
 *   https://www.mos-x.be/api/klantenzone/koppeling
 * met de kop  Authorization: Bearer <KLANTENZONE_API_KEY>  en een JSON-bericht:
 *
 * {
 *   "externId": "OFF-2026-035",                // verplicht: offerte- of klantnummer
 *   "klant": { "voornaam": "Jan", "achternaam": "Peeters", "telefoon": "0470...", "email": "...",
 *              "adres": "Kerkstraat 12, 2440 Geel", "dienst": "Dakreiniging en dakcoating" },
 *   "afspraken": [{ "titel": "Start werken", "start": "2026-10-23T08:00", "duurMin": 480, "info": "..." }],
 *   "werken":    [{ "naam": "Dakreiniging", "datum": "2026-10-23" }],
 *   "documenten":[{ "type": "offerte", "titel": "Offerte", "url": "https://...pdf", "bedrag": 4850, "status": "info" }],
 *   "fotos":     [{ "url": "https://...jpg", "fase": "voor", "bijschrift": "Voorkant" }],
 *   "notitie":   { "titel": "Plaatsbezoek", "tekst": "..." },
 *   "welkom":    true                           // optioneel: welkomstmail met de link bij een nieuw dossier
 * }
 *
 * Bestaat het dossier al (zelfde externId), dan wordt het aangevuld: afspraken en werken met
 * dezelfde naam worden bijgewerkt, documenten en foto's met een nieuwe url toegevoegd.
 * Antwoord: { ok, id, link } — de link kan meteen naar de klant gestuurd worden.
 */

type Bericht = {
  externId?: string;
  klant?: Partial<Pick<Klant, "voornaam" | "achternaam" | "telefoon" | "email" | "adres" | "dienst">>;
  fase?: string;
  afspraken?: { titel?: string; start?: string; duurMin?: number; info?: string }[];
  werken?: { naam?: string; datum?: string }[];
  documenten?: { type?: string; titel?: string; url?: string; bedrag?: number; status?: string; datum?: string }[];
  fotos?: { url?: string; fase?: string; bijschrift?: string }[];
  notitie?: { titel?: string; tekst?: string };
  /** true: de klant krijgt bij een nieuw dossier meteen de welkomstmail met zijn link */
  welkom?: boolean;
};

const s = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isUrl = (v: unknown) => typeof v === "string" && /^https:\/\/\S+$/i.test(v);
const isDag = (v: unknown) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
const isMoment = (v: unknown) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v);

function sleutelKlopt(req: NextRequest): boolean {
  const sleutel = process.env.KLANTENZONE_API_KEY;
  const kop = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!sleutel || !kop) return false;
  const a = Buffer.from(kop), b = Buffer.from(sleutel);
  return a.length === b.length && timingSafeEqual(a, b);
}

function pasToe(k: Klant, m: Bericht) {
  const nu = new Date().toISOString();
  const kl = m.klant ?? {};
  for (const veld of ["voornaam", "achternaam", "telefoon", "email", "adres", "dienst"] as const) {
    const v = s(kl[veld]);
    if (v) k[veld] = v;
  }
  if (m.fase && (FASES as readonly string[]).includes(m.fase)) k.fase = m.fase as Fase;

  for (const a of m.afspraken ?? []) {
    const titel = s(a.titel, 80);
    if (!titel || !isMoment(a.start)) continue;
    const bestaand = k.afspraken.find((x) => x.titel === titel);
    if (bestaand) {
      bestaand.start = a.start!;
      if (a.duurMin) bestaand.duurMin = a.duurMin;
      if (a.info) bestaand.info = s(a.info, 1000);
    } else {
      k.afspraken.push({ id: nieuwId(6), titel, start: a.start!, duurMin: a.duurMin ?? 60, info: s(a.info, 1000) || undefined });
      k.log.unshift({ datum: nu, tekst: `Nieuwe afspraak: ${titel}.` });
    }
    if (titel === "Start werken") k.start = { datum: a.start!.slice(0, 10), precisie: "dag" };
  }
  k.afspraken.sort((x, y) => x.start.localeCompare(y.start));

  for (const w of m.werken ?? []) {
    const naam = s(w.naam, 80);
    if (!naam) continue;
    const bestaand = (k.werken ??= []).find((x) => x.naam === naam);
    if (bestaand) { if (isDag(w.datum)) bestaand.datum = w.datum; }
    else k.werken.push({ id: nieuwId(6), naam, status: "gepland", datum: isDag(w.datum) ? w.datum : undefined });
  }

  for (const d of m.documenten ?? []) {
    if (!isUrl(d.url) || k.documenten.some((x) => x.url === d.url)) continue;
    const type = (d.type && d.type in DOC_LOG_ZIN ? d.type : "andere") as DocType;
    k.documenten.unshift({
      id: nieuwId(6), type, url: d.url!, titel: s(d.titel, 120) || "Document",
      bedrag: typeof d.bedrag === "number" ? d.bedrag : undefined,
      status: (["open", "betaald", "info"].includes(d.status ?? "") ? d.status : type === "voorschot" || type === "factuur" ? "open" : "info") as DocStatus,
      datum: isDag(d.datum) ? d.datum! : nu.slice(0, 10),
    });
    k.log.unshift({ datum: nu, tekst: DOC_LOG_ZIN[type] });
  }

  for (const f of m.fotos ?? []) {
    if (!isUrl(f.url) || k.fotos.some((x) => x.url === f.url)) continue;
    const fase = (f.fase && f.fase in FOTO_FASE_LABEL ? f.fase : "tijdens") as FotoFase;
    k.fotos.unshift({ id: nieuwId(6), url: f.url!, fase, bijschrift: s(f.bijschrift, 140) || undefined, datum: nu });
  }

  if (m.notitie && s(m.notitie.tekst) && !(k.notities ?? []).some((n) => n.tekst === s(m.notitie!.tekst, 4000))) {
    (k.notities ??= []).unshift({ id: nieuwId(6), datum: nu, titel: s(m.notitie.titel, 120) || undefined, tekst: s(m.notitie.tekst, 4000) });
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.KLANTENZONE_API_KEY) return NextResponse.json({ ok: false, fout: "Koppeling staat uit." }, { status: 503 });
  if (!sleutelKlopt(req)) return NextResponse.json({ ok: false, fout: "Geen toegang." }, { status: 401 });

  let m: Bericht;
  try { m = await req.json(); } catch { return NextResponse.json({ ok: false, fout: "Geen geldige JSON." }, { status: 400 }); }
  const externId = s(m.externId, 80);
  if (!externId) return NextResponse.json({ ok: false, fout: "externId ontbreekt." }, { status: 400 });

  let k = await klantVoorExternId(externId);
  if (k) {
    const r = await wijzigKlant(k.id, (x) => pasToe(x, m));
    k = r?.klant ?? k;
  } else {
    if (!s(m.klant?.voornaam)) return NextResponse.json({ ok: false, fout: "Nieuw dossier: klant.voornaam is verplicht." }, { status: 400 });
    const nu = new Date().toISOString();
    k = {
      id: nieuwId(), externId, voornaam: "", achternaam: "", telefoon: "", email: "", adres: "", dienst: "Dakreiniging",
      fase: "gepland", afspraken: [], fotos: [], documenten: [], werken: [],
      garantie: { mosvrijJaren: 2, coatingJaren: (m.klant?.dienst ?? "").toLowerCase().includes("coating") ? 10 : 0 },
      log: [{ datum: nu, tekst: "Je dossier is aangemaakt." }], aangemaakt: nu, bijgewerkt: nu,
    };
    pasToe(k, m);
    await saveKlant(k);
    await koppelExternId(externId, k.id);
    k = (await getKlant(k.id)) ?? k;
    if (m.welkom === true && k.email) await stuurWelkom(k).catch(() => undefined);
  }

  revalidatePath(`/klant/${k.id}`);
  revalidatePath(`/beheer/${k.id}`);
  revalidatePath("/beheer");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "www.mos-x.be";
  const proto = req.headers.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const basis = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
  return NextResponse.json({ ok: true, id: k.id, link: `${basis}/klant/${k.id}` });
}
