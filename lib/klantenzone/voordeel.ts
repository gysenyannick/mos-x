import { plusDagen, plusJaren, vandaag } from "./tijd";
import type { Klant, TegoedTransactie, Verwijzing } from "./types";
import type { Actie, Instellingen } from "./store";

/* ── Onderhoudstegoed ─────────────────────────────────────────────────────── */

/**
 * Saldo op een bepaalde dag. Toegekend tegoed met een vervaldatum telt niet meer mee
 * na die datum, voor zover het nog niet gebruikt werd (gebruik telt eerst af van het oudste tegoed).
 */
export function tegoedOverzicht(k: Klant, op = vandaag()): { saldo: number; vervallen: number; regels: TegoedTransactie[] } {
  const regels = [...(k.tegoed ?? [])].sort((a, b) => a.datum.localeCompare(b.datum));
  // Potjes van toegekend tegoed, oudste eerst; afboekingen eten ze op
  const potjes: { bedrag: number; vervaltOp?: string }[] = [];
  let los = 0; // correcties zonder potje
  for (const t of regels) {
    if (t.bedrag > 0) {
      if (t.soort === "toegekend") potjes.push({ bedrag: t.bedrag, vervaltOp: t.vervaltOp });
      else los += t.bedrag;
      continue;
    }
    let af = -t.bedrag;
    for (const p of potjes) {
      if (af <= 0) break;
      const neem = Math.min(p.bedrag, af);
      p.bedrag -= neem;
      af -= neem;
    }
    los -= af;
  }
  const vervallen = potjes.filter((p) => p.vervaltOp && p.vervaltOp < op).reduce((s, p) => s + p.bedrag, 0);
  const geldig = potjes.filter((p) => !p.vervaltOp || p.vervaltOp >= op).reduce((s, p) => s + p.bedrag, 0);
  return { saldo: Math.max(0, geldig + los), vervallen, regels: regels.reverse() };
}

/** Voegt een transactie toe, behalve als dezelfde sleutel al bestaat (idempotent). Geeft terug of er iets toegevoegd werd. */
export function voegTransactieToe(k: Klant, t: TegoedTransactie): boolean {
  if (t.sleutel && (k.tegoed ?? []).some((x) => x.sleutel === t.sleutel)) return false;
  if (!Number.isFinite(t.bedrag) || t.bedrag === 0) return false;
  (k.tegoed ??= []).push(t);
  return true;
}

/* ── Burenvoordeel ───────────────────────────────────────────────────────── */

export type RefRegels = {
  beloning: number;
  /** Hoe de beloning heet voor de klant (een bon, geen geld) */
  naam: string;
  korting: number;
  minOpdracht: number;
  maxPerKlant: number;
  geldigMaanden: number;
  start?: string;
  eind?: string;
  diensten?: string;
  combineerbaar: boolean;
  voorwaarden?: string;
};

export const REF_STANDAARD_BEDRAG = 50;

export function refRegels(i: Instellingen): RefRegels {
  return {
    beloning: i.refBeloning ?? 500,
    naam: i.refBeloningNaam || "Onderhoudsbon",
    korting: i.refKorting ?? REF_STANDAARD_BEDRAG,
    minOpdracht: i.refMinOpdracht ?? 0,
    maxPerKlant: i.refMaxPerKlant ?? 0,
    geldigMaanden: i.refGeldigMaanden ?? 0,
    start: i.refStart || undefined,
    eind: i.refEind || undefined,
    diensten: i.refDiensten || undefined,
    combineerbaar: i.refCombineerbaar ?? false,
    voorwaarden: i.refVoorwaarden || undefined,
  };
}

/** Loopt het burenvoordeel vandaag? */
export function refActief(r: RefRegels, op = vandaag()): boolean {
  if (r.beloning <= 0 && r.korting <= 0) return false;
  if (r.start && op < r.start) return false;
  if (r.eind && op > r.eind) return false;
  return true;
}

/** Sleutel per doorverwijzing: één beloning per buur, nooit twee. */
export const refSleutel = (v: Verwijzing) => `ref:${v.id}`;

/** Aantal beloningen die al toegekend werden aan deze klant. */
export function aantalBeloningen(k: Klant): number {
  return (k.tegoed ?? []).filter((t) => t.sleutel?.startsWith("ref:") && t.soort === "toegekend").length;
}

/**
 * Mag de beloning voor deze doorverwijzing toegekend worden? Geeft de redenen waarom niet.
 * Voorwaarden: opdracht uitgevoerd, volledig betaald, minimumwaarde, maximum per klant,
 * niet al toegekend, geen controlemelding die blokkeert.
 */
export function beloningMag(k: Klant, v: Verwijzing, r: RefRegels): { mag: boolean; redenen: string[] } {
  const redenen: string[] = [];
  if (r.beloning <= 0) redenen.push("Er is geen beloning ingesteld.");
  if (v.status !== "uitgevoerd") redenen.push("De opdracht is nog niet als uitgevoerd aangeduid.");
  if (!v.betaald) redenen.push("De opdracht is nog niet volledig betaald.");
  if (r.minOpdracht > 0 && (v.opdrachtWaarde ?? 0) < r.minOpdracht) redenen.push(`De opdrachtwaarde is lager dan € ${r.minOpdracht}.`);
  if (r.maxPerKlant > 0 && aantalBeloningen(k) >= r.maxPerKlant) redenen.push(`Het maximum van ${r.maxPerKlant} beloningen is bereikt.`);
  if ((k.tegoed ?? []).some((t) => t.sleutel === refSleutel(v))) redenen.push("De beloning werd al toegekend.");
  if ((v.controle ?? []).some((c) => c.startsWith("Blokkeert:"))) redenen.push("Een controle blokkeert deze doorverwijzing.");
  return { mag: redenen.length === 0, redenen };
}

/** Maakt de transactie voor een toegekende beloning. */
/** @param nummer de hoeveelste beloonde buur dit is (voor de bonus) */
export function beloningTransactie(v: Verwijzing, r: RefRegels, id: string, nu: string, nummer = 1): TegoedTransactie {
  const bonus = refBonus(nummer);
  return {
    id, datum: nu, soort: "toegekend", bedrag: r.beloning + bonus,
    omschrijving: `Omdat ${v.naam.split(" ")[0]} klant werd${bonus ? ` (met ${bonus} bonuspunten)` : ""}`,
    sleutel: refSleutel(v),
    vervaltOp: r.geldigMaanden > 0 ? plusDagen(nu.slice(0, 10), Math.round(r.geldigMaanden * 30.44)) : undefined,
    door: "yannick",
  };
}

const telNorm = (t: string) => t.replace(/\D/g, "").replace(/^0032/, "0").replace(/^32/, "0");
const adresNorm = (a: string) => a.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Controles bij een nieuwe doorverwijzing. "Blokkeert:" = niet aanvaarden, andere = ter info voor Yannick.
 * @param alleKlanten alle dossiers, om bestaande klanten en dubbele doorverwijzingen te vinden
 */
export function controleerVerwijzing(aanbrenger: Klant, lead: { telefoon: string; adres: string }, alleKlanten: Klant[]): string[] {
  const uit: string[] = [];
  const tel = telNorm(lead.telefoon);
  const adr = adresNorm(lead.adres);
  if (tel && telNorm(aanbrenger.telefoon) === tel) uit.push("Blokkeert: zelfde telefoonnummer als de aanbrenger.");
  if (adr && adr.length > 6 && adresNorm(aanbrenger.adres) === adr) uit.push("Blokkeert: zelfde adres als de aanbrenger.");
  for (const k of alleKlanten) {
    if (k.id === aanbrenger.id) continue;
    if (tel && telNorm(k.telefoon) === tel) uit.push(`Bestaande klant met dit nummer: ${k.voornaam} ${k.achternaam}.`);
    else if (adr && adr.length > 6 && adresNorm(k.adres) === adr) uit.push(`Bestaande klant op dit adres: ${k.voornaam} ${k.achternaam}.`);
  }
  for (const k of alleKlanten) {
    for (const v of k.verwijzingen ?? []) {
      if (tel && telNorm(v.telefoon) === tel) {
        uit.push(k.id === aanbrenger.id ? "Blokkeert: deze buur werd al eerder door dezelfde klant aangebracht." : `Al eerder aangebracht door ${k.voornaam} ${k.achternaam}.`);
      }
    }
  }
  return [...new Set(uit)];
}

/* ── Acties en campagnes ─────────────────────────────────────────────────── */

export type CampagneStaat = "concept" | "gepland" | "actief" | "gepauzeerd" | "afgelopen" | "volzet";

export function campagneStaat(c: Actie, aanvragen = 0, op = vandaag()): CampagneStaat {
  if (c.status === "concept") return "concept";
  if (c.geldigTot && op > c.geldigTot) return "afgelopen";
  if (c.status === "gepauzeerd") return "gepauzeerd";
  if (c.start && op < c.start) return "gepland";
  if (c.maxAanvragen && aanvragen >= c.maxAanvragen) return "volzet";
  return "actief";
}

const postcodeVan = (adres: string) => adres.match(/\b(\d{4})\b/)?.[1];

/** Ziet deze klant de actie? Enkel als ze loopt, voor zijn fase en regio. Oude acties zonder doelgroep: klanten na de werken. */
export function actieVoorKlant(c: Actie, k: Klant, aanvragen = 0, op = vandaag()): boolean {
  if (campagneStaat(c, aanvragen, op) !== "actief") return false;
  if (c.type && c.type !== "persoonlijk" && !c.nagekeken) return false; // nieuwe campagnes enkel na controle
  const fases = c.fases?.length ? c.fases : ["bezig", "klaar", "nazorg"];
  if (!fases.includes(k.fase)) return false;
  if (c.postcodes?.length) {
    const pc = postcodeVan(k.adres);
    if (!pc || !c.postcodes.includes(pc)) return false;
  }
  if (c.type === "dakzorg" && !k.dakzorg?.actief) return false;
  return true;
}

/** Brutomarge na incentives, of null als de nodige gegevens ontbreken. */
export function campagneMarge(c: Actie, beloning = 0): { marge: number; procent: number } | null {
  if (c.opdrachtWaarde === undefined || c.kosten === undefined) return null;
  const waarde = c.opdrachtWaarde - (c.korting ?? 0);
  const marge = waarde - c.kosten - (c.verplaatsing ?? 0) - (c.andereKosten ?? 0) - beloning;
  return { marge: Math.round(marge), procent: waarde > 0 ? Math.round((marge / waarde) * 100) : 0 };
}

/** Hoeveel klanten toonden interesse in een actie (voor groepsacties en het maximum). */
export function interesseVoor(c: Actie, klanten: Klant[]): number {
  return klanten.reduce((s, k) => s + (k.aanvragen ?? []).filter((a) => a.campagneId === c.id).length, 0);
}

/** Einde van de garantie in jaren vanaf een datum (hulpje voor de tests). */
export const garantieTot = (vanaf: string, jaren: number) => plusJaren(vanaf, jaren);

/* ── Bonnen: het tegoed zoals de klant het ziet ──────────────────────────── */

export type Bon = { id: string; datum: string; omschrijving: string; waarde: number; rest: number; vervaltOp?: string; staat: "beschikbaar" | "gebruikt" | "vervallen" };

/**
 * Elke toegekende beloning is een bon. Gebruik telt eerst af van de oudste bon.
 * Zo ziet de klant bonnen in plaats van een geldbedrag.
 */
export function tegoedBonnen(k: Klant, op = vandaag()): Bon[] {
  const regels = [...(k.tegoed ?? [])].sort((a, b) => a.datum.localeCompare(b.datum));
  const bonnen: Bon[] = [];
  for (const t of regels) {
    if (t.bedrag > 0) {
      if (t.soort === "toegekend") bonnen.push({ id: t.id, datum: t.datum, omschrijving: t.omschrijving, waarde: t.bedrag, rest: t.bedrag, vervaltOp: t.vervaltOp, staat: "beschikbaar" });
      continue;
    }
    let af = -t.bedrag;
    for (const b of bonnen) {
      if (af <= 0) break;
      const neem = Math.min(b.rest, af);
      b.rest -= neem;
      af -= neem;
    }
  }
  for (const b of bonnen) b.staat = b.rest <= 0 ? "gebruikt" : b.vervaltOp && b.vervaltOp < op ? "vervallen" : "beschikbaar";
  return bonnen.reverse();
}

/* ── Spaarpot: punten in plaats van euro ────────────────────────────────── */

/**
 * Het tegoed wordt bijgehouden in punten. Elke beweging blijft bewaard (zie TegoedTransactie);
 * de klant ruilt punten in voor korting op een volgende factuur. Nooit punten voor reviews.
 */
export const PUNTEN = {
  welkom: 50,
  deelVoorNa: 50,
  onderhoud: 100,
} as const;

/** Standaard: zoveel punten per buur die klant wordt, en zoveel cent per punt. */
export const PUNTEN_PER_BUUR = 500;
export const CENT_PER_PUNT = 10;
/** Waarvoor punten gebruikt worden, met een vaste maximumkorting per werk in euro. */
export const PUNTEN_GEBRUIK = [
  { dienst: "Dakgootreiniging", max: 25, uitleg: "Goten proper voor de herfst." },
  { dienst: "Preventief onderhoud", max: 100, uitleg: "Een nieuwe anti-mosbehandeling." },
  { dienst: "Terras en oprit", max: 50, uitleg: "Ook rond je huis alles proper." },
  { dienst: "Nieuwe dakbehandeling", max: 150, uitleg: "Reiniging of coating van je dak." },
] as const;

/** Bonuspunten bovenop de vaste beloning: bij de 2de en de 3de buur die klant wordt. */
export const REF_BONUS: Record<number, number> = { 2: 250, 3: 500 };
export const refBonus = (nummer: number) => REF_BONUS[nummer] ?? 0;

/** Waarde van punten in euro. */
export function puntenInEuro(punten: number, centPerPunt = CENT_PER_PUNT): number {
  return Math.floor((punten * centPerPunt) / 100);
}

/** Volgende mijlpaal (elke 250 punten) en hoe ver de klant al is. */
export function volgendeMijlpaal(punten: number, stap = 250): { doel: number; procent: number } {
  const doel = (Math.floor(punten / stap) + 1) * stap;
  return { doel, procent: Math.round(((punten % stap) / stap) * 100) };
}
