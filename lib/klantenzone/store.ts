import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { Klant, VrijMoment } from "./types";

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
  try {
    return JSON.parse(await fs.readFile(LOKAAL_BESTAND, "utf8"));
  } catch {
    return { kv: {}, sets: {} };
  }
}
async function schrijfLokaal(db: LokaalDb) {
  await fs.mkdir(path.dirname(LOKAAL_BESTAND), { recursive: true });
  await fs.writeFile(LOKAAL_BESTAND, JSON.stringify(db, null, 2));
}

const lokaalBackend: Backend = {
  async get<T>(k: string) { return ((await leesLokaal()).kv[k] as T) ?? null; },
  async set(k, v) { const db = await leesLokaal(); db.kv[k] = v; await schrijfLokaal(db); },
  async del(k) { const db = await leesLokaal(); delete db.kv[k]; await schrijfLokaal(db); },
  async sadd(k, m) {
    const db = await leesLokaal();
    db.sets[k] = Array.from(new Set([...(db.sets[k] ?? []), m]));
    await schrijfLokaal(db);
  },
  async srem(k, m) {
    const db = await leesLokaal();
    db.sets[k] = (db.sets[k] ?? []).filter((x) => x !== m);
    await schrijfLokaal(db);
  },
  async smembers(k) { return (await leesLokaal()).sets[k] ?? []; },
};

export async function getKlant(id: string): Promise<Klant | null> {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(id)) return null;
  return (await backend()).get<Klant>(KEY_KLANT(id));
}

export async function saveKlant(k: Klant): Promise<void> {
  const b = await backend();
  k.bijgewerkt = new Date().toISOString();
  await b.set(KEY_KLANT(k.id), k);
  await b.sadd(KEY_KLANTEN, k.id);
}

export async function deleteKlant(id: string): Promise<void> {
  const b = await backend();
  await b.del(KEY_KLANT(id));
  await b.srem(KEY_KLANTEN, id);
}

export async function listKlanten(): Promise<Klant[]> {
  const b = await backend();
  const ids = await b.smembers(KEY_KLANTEN);
  const klanten = await Promise.all(ids.map((id) => b.get<Klant>(KEY_KLANT(id))));
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
