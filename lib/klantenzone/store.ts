import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { normaliseerFase, type Klant, type VrijMoment } from "./types";

/**
 * Opslag van de klantenzone.
 *
 * Online (Vercel):
 *   - gegevens in Upstash Redis   → KV_REST_API_URL + KV_REST_API_TOKEN
 *                                   (of UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
 *   - foto's en pdf's in Vercel Blob → BLOB_READ_WRITE_TOKEN
 * Beide zet Vercel zelf als je ze koppelt via Storage in het dashboard.
 *
 * Lokaal (npm run dev) zonder die instellingen: alles komt in de map .data/
 * zodat je kan testen zonder iets te koppelen. Online wordt die terugval
 * nooit gebruikt: daar is het bestandssysteem niet blijvend.
 */

const KEY_KLANT = (id: string) => `mx:klant:${id}`;
const KEY_KLANTEN = "mx:klanten";
const KEY_MOMENTEN = "mx:momenten";

function redisEnv() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

const isLocal = process.env.NODE_ENV !== "production";

export type OpslagStatus = { data: "redis" | "lokaal" | "ontbreekt"; bestanden: "blob" | "lokaal" | "ontbreekt" };

export function opslagStatus(): OpslagStatus {
  return {
    data: redisEnv() ? "redis" : isLocal ? "lokaal" : "ontbreekt",
    bestanden: process.env.BLOB_READ_WRITE_TOKEN ? "blob" : isLocal ? "lokaal" : "ontbreekt",
  };
}

export function nieuwId(bytes = 18): string {
  return randomBytes(bytes).toString("base64url");
}

/* ── Gegevens ─────────────────────────────────────────────────────────────── */

type Backend = {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  sadd(key: string, member: string): Promise<void>;
  srem(key: string, member: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
  /** Zet alleen als de sleutel nog niet bestaat (slot), vervalt na ms. */
  setnx(key: string, value: string, ms: number): Promise<boolean>;
};

let redisBackend: Backend | null = null;

async function backend(): Promise<Backend> {
  const env = redisEnv();
  if (env) {
    if (!redisBackend) {
      const { Redis } = await import("@upstash/redis");
      const r = new Redis(env);
      redisBackend = {
        get: (k) => r.get(k),
        set: async (k, v) => { await r.set(k, v); },
        del: async (k) => { await r.del(k); },
        sadd: async (k, m) => { await r.sadd(k, m); },
        srem: async (k, m) => { await r.srem(k, m); },
        smembers: (k) => r.smembers(k),
        setnx: async (k, v, ms) => (await r.set(k, v, { nx: true, px: ms })) === "OK",
      };
    }
    return redisBackend;
  }
  if (isLocal) return lokaalBackend;
  throw new Error("Opslag niet gekoppeld: koppel Upstash Redis aan dit project in Vercel.");
}

/* Lokale terugval: één JSON-bestand in .data/ */
const LOKAAL_BESTAND = path.join(process.cwd(), ".data", "klantenzone.json");
type LokaalDb = { kv: Record<string, unknown>; sets: Record<string, string[]> };

async function leesLokaal(): Promise<LokaalDb> {
  let tekst: string;
  try {
    tekst = await fs.readFile(LOKAAL_BESTAND, "utf8");
  } catch {
    return { kv: {}, sets: {} }; // bestand bestaat nog niet
  }
  // Bewust geen try/catch: een kapot bestand mag nooit als "leeg" behandeld en dan overschreven worden
  return JSON.parse(tekst);
}
async function schrijfLokaal(db: LokaalDb) {
  await fs.mkdir(path.dirname(LOKAAL_BESTAND), { recursive: true });
  // Eerst naar een tijdelijk bestand, dan vervangen: nooit een half geschreven bestand
  const tmp = `${LOKAAL_BESTAND}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2));
  await fs.rename(tmp, LOKAAL_BESTAND);
}

/** Alle lokale lees- en schrijfacties na elkaar, zodat gelijktijdige verzoeken elkaar niet overschrijven. */
let wachtrij: Promise<unknown> = Promise.resolve();
function naElkaar<T>(werk: () => Promise<T>): Promise<T> {
  const volgende = wachtrij.then(werk, werk);
  wachtrij = volgende.catch(() => undefined);
  return volgende;
}
function wijzig(fn: (db: LokaalDb) => void): Promise<void> {
  return naElkaar(async () => { const db = await leesLokaal(); fn(db); await schrijfLokaal(db); });
}

const lokaalBackend: Backend = {
  get: <T,>(k: string) => naElkaar(async () => ((await leesLokaal()).kv[k] as T) ?? null),
  set: (k, v) => wijzig((db) => { db.kv[k] = v; }),
  del: (k) => wijzig((db) => { delete db.kv[k]; }),
  sadd: (k, m) => wijzig((db) => { db.sets[k] = Array.from(new Set([...(db.sets[k] ?? []), m])); }),
  srem: (k, m) => wijzig((db) => { db.sets[k] = (db.sets[k] ?? []).filter((x) => x !== m); }),
  smembers: (k) => naElkaar(async () => (await leesLokaal()).sets[k] ?? []),
  setnx: (k, v, ms) => naElkaar(async () => {
    const nu = Date.now();
    const bestaand = sloten.get(k);
    if (bestaand && bestaand > nu) return false;
    sloten.set(k, nu + ms);
    return true;
  }),
};
const sloten = new Map<string, number>();

export async function getKlant(id: string): Promise<Klant | null> {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(id)) return null;
  const k = await (await backend()).get<Klant>(KEY_KLANT(id));
  if (k) k.fase = normaliseerFase(k.fase);
  return k;
}

export async function saveKlant(k: Klant): Promise<void> {
  const b = await backend();
  k.bijgewerkt = new Date().toISOString();
  await b.set(KEY_KLANT(k.id), k);
  await b.sadd(KEY_KLANTEN, k.id);
}

/**
 * Lees, wijzig en bewaar een dossier zonder dat een gelijktijdige wijziging
 * (bv. klant uploadt een foto terwijl Yannick iets aanpast) verloren gaat.
 * Geeft het bewaarde dossier terug, of null als het niet bestaat.
 */
export async function wijzigKlant<T = void>(
  id: string, fn: (k: Klant) => T | Promise<T>,
): Promise<{ klant: Klant; resultaat: T } | null> {
  const b = await backend();
  const slot = `mx:slot:${id}`;
  const tot = Date.now() + 8000;
  while (!(await b.setnx(slot, "1", 10_000))) {
    if (Date.now() > tot) throw new Error("Dossier is even bezet. Probeer het opnieuw.");
    await new Promise((r) => setTimeout(r, 60 + Math.random() * 60));
  }
  try {
    const k = await getKlant(id);
    if (!k) return null;
    const resultaat = await fn(k);
    await saveKlant(k);
    return { klant: k, resultaat };
  } finally {
    if (b === lokaalBackend) sloten.delete(slot);
    else await b.del(slot);
  }
}

export async function deleteKlant(id: string): Promise<void> {
  const b = await backend();
  await b.del(KEY_KLANT(id));
  await b.srem(KEY_KLANTEN, id);
}

export async function listKlanten(): Promise<Klant[]> {
  const b = await backend();
  const ids = await b.smembers(KEY_KLANTEN);
  const klanten = (await Promise.all(ids.map((id) => b.get<Klant>(KEY_KLANT(id)))))
    .map((k) => (k ? { ...k, fase: normaliseerFase(k.fase) } : k));
  return klanten
    .filter((k): k is Klant => !!k)
    .sort((a, b) => b.bijgewerkt.localeCompare(a.bijgewerkt));
}

export async function getMomenten(): Promise<VrijMoment[]> {
  const m = (await (await backend()).get<VrijMoment[]>(KEY_MOMENTEN)) ?? [];
  return m.sort((a, b) => a.start.localeCompare(b.start));
}

export async function saveMomenten(m: VrijMoment[]): Promise<void> {
  await (await backend()).set(KEY_MOMENTEN, m);
}

/* ── Bestanden ────────────────────────────────────────────────────────────── */

const LOKAAL_UPLOADS = path.join(process.cwd(), "public", "_dev-uploads");

/** Slaat een bestand op en geeft de publieke URL terug. Het pad bevat een willekeurig stuk. */
export async function bewaarBestand(map: string, naam: string, data: Blob): Promise<string> {
  const veilig = naam.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "").slice(-60) || "bestand";
  const pad = `klantenzone/${map}/${nieuwId(9)}-${veilig}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const res = await put(pad, data, { access: "public", contentType: data.type || undefined });
    return res.url;
  }
  if (isLocal) {
    const doel = path.join(LOKAAL_UPLOADS, pad);
    await fs.mkdir(path.dirname(doel), { recursive: true });
    await fs.writeFile(doel, Buffer.from(await data.arrayBuffer()));
    return `/_dev-uploads/${pad}`;
  }
  throw new Error("Bestandsopslag niet gekoppeld: koppel Vercel Blob aan dit project.");
}

export async function verwijderBestand(url: string): Promise<void> {
  try {
    if (url.startsWith("/_dev-uploads/") && isLocal) {
      await fs.unlink(path.join(LOKAAL_UPLOADS, url.replace("/_dev-uploads/", "")));
    } else if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { del } = await import("@vercel/blob");
      await del(url);
    }
  } catch {
    // Bestand al weg: geen probleem.
  }
}

/* ── Buurlinks en instellingen ────────────────────────────────────────────── */

const KEY_REF = (code: string) => `mx:ref:${code}`;
const KEY_INSTELLINGEN = "mx:instellingen";

/** Een actie of korting die Yannick aan alle klanten toont. */
export type Actie = {
  id: string;
  titel: string;
  tekst: string;
  /** Dienst bij Extra's waarop de korting geldt (leeg = algemene actie) */
  extra?: string;
  /** YYYY-MM-DD, leeg = geen einddatum */
  geldigTot?: string;
};

export type Instellingen = {
  /** Wat buren en doorverwijzers krijgen, vrije tekst. Leeg = geen beloning vermelden. */
  burenVoordeel?: string;
  acties?: Actie[];
  /** Link naar "review schrijven" van het Google-bedrijfsprofiel */
  googleReviewUrl?: string;
  /** Een echte review van Google, getoond naast de reviewknop */
  reviewCitaat?: string;
  reviewNaam?: string;
  /** Doorverwijzen: wat de klant krijgt per buur die klant wordt, en de korting voor die buur (euro; 0 = uit) */
  refBeloning?: number;
  refKorting?: number;
};

export const REF_STANDAARD = 50;

/** Geeft de buurcode van een klant terug en maakt er een aan als die nog niet bestaat. */
export async function zorgVoorRefCode(k: Klant): Promise<string> {
  if (k.refCode) return k.refCode;
  const nieuw = nieuwId(5).replace(/[-_]/g, "x");
  const r = await wijzigKlant(k.id, (x) => (x.refCode ??= nieuw));
  const code = r?.resultaat ?? nieuw;
  await (await backend()).set(KEY_REF(code), k.id);
  k.refCode = code;
  return code;
}

export async function klantVoorRefCode(code: string): Promise<Klant | null> {
  if (!/^[A-Za-z0-9]{4,16}$/.test(code)) return null;
  const id = await (await backend()).get<string>(KEY_REF(code));
  return id ? getKlant(id) : null;
}

/** Na "nieuwe link" moet de buurcode naar het nieuwe dossier wijzen. */
export async function herkoppelRefCode(k: Klant): Promise<void> {
  if (k.refCode) await (await backend()).set(KEY_REF(k.refCode), k.id);
}

export async function getInstellingen(): Promise<Instellingen> {
  return (await (await backend()).get<Instellingen>(KEY_INSTELLINGEN)) ?? {};
}

export async function saveInstellingen(i: Instellingen): Promise<void> {
  await (await backend()).set(KEY_INSTELLINGEN, i);
}

/* ── Koppeling: klant terugvinden op een extern nummer (bv. uit Beavr) ─────── */

const KEY_EXTERN = (id: string) => `mx:extern:${id}`;

export async function klantVoorExternId(externId: string): Promise<Klant | null> {
  const id = await (await backend()).get<string>(KEY_EXTERN(externId));
  return id ? getKlant(id) : null;
}

export async function koppelExternId(externId: string, klantId: string): Promise<void> {
  await (await backend()).set(KEY_EXTERN(externId), klantId);
}
