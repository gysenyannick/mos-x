/**
 * Datum- en tijdhulpjes. Alle afspraken worden bewaard als Belgische
 * kloktijd ("2026-10-12T09:00"); de server draait in UTC, dus omrekenen
 * gebeurt hier op één plek.
 */

const TZ = "Europe/Brussels";

/** Zet "YYYY-MM-DDTHH:mm" (Belgische tijd) om naar een echt tijdstip. */
export function brusselNaarDate(lokaal: string): Date {
  const [d, t = "00:00"] = lokaal.split("T");
  const [y, mo, da] = d.split("-").map(Number);
  const [h, mi] = t.split(":").map(Number);
  const alsUtc = Date.UTC(y, mo - 1, da, h, mi);
  // Verschil tussen UTC en Brussel op dat moment (1u of 2u)
  const delen = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).formatToParts(new Date(alsUtc));
  const get = (type: string) => Number(delen.find((p) => p.type === type)?.value);
  const brusselAlsUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return new Date(alsUtc - (brusselAlsUtc - alsUtc));
}

/** Huidige Belgische datum als YYYY-MM-DD. */
export function vandaag(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

/** Huidig Belgisch uur (0-23), voor "Goedemorgen" / "Goedemiddag" / "Goedenavond". */
export function huidigUur(): number {
  return Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" }).format(new Date()));
}

export function groet(): string {
  const u = huidigUur();
  if (u < 12) return "Goedemorgen";
  if (u < 18) return "Goedemiddag";
  return "Goedenavond";
}

function datumUitIso(d: string): Date {
  // YYYY-MM-DD als middag UTC, zodat de dag nooit verschuift door tijdzones
  return new Date(`${d.slice(0, 10)}T12:00:00Z`);
}

/** "maandag 12 oktober" */
export function fmtDag(d: string, metJaar = false): string {
  return new Intl.DateTimeFormat("nl-BE", {
    timeZone: "UTC", weekday: "long", day: "numeric", month: "long", ...(metJaar ? { year: "numeric" } : {}),
  }).format(datumUitIso(d));
}

/** "12 okt. 2026" */
export function fmtKort(d: string): string {
  return new Intl.DateTimeFormat("nl-BE", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }).format(datumUitIso(d));
}

/** "oktober 2026" */
export function fmtMaand(d: string): string {
  return new Intl.DateTimeFormat("nl-BE", { timeZone: "UTC", month: "long", year: "numeric" }).format(datumUitIso(d));
}

/** "09:00" uit "YYYY-MM-DDTHH:mm" */
export function fmtUur(lokaal: string): string {
  return lokaal.slice(11, 16).replace(":", "u");
}

/** Maandag van de week waarin d valt, als YYYY-MM-DD */
export function maandagVan(d: string): string {
  const x = datumUitIso(d);
  const dag = (x.getUTCDay() + 6) % 7;
  x.setUTCDate(x.getUTCDate() - dag);
  return x.toISOString().slice(0, 10);
}

export function plusDagen(d: string, n: number): string {
  const x = datumUitIso(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
}

export function plusJaren(d: string, n: number): string {
  const x = datumUitIso(d);
  x.setUTCFullYear(x.getUTCFullYear() + n);
  return x.toISOString().slice(0, 10);
}

/** Aantal hele dagen van vandaag tot d (negatief = verleden). */
export function dagenTot(d: string): number {
  return Math.round((datumUitIso(d).getTime() - datumUitIso(vandaag()).getTime()) / 86_400_000);
}

export function fmtEuro(n: number): string {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
}

/** Huidig tijdstip in ms. Server-pagina's van de klantenzone renderen per verzoek, dus "nu" mag. */
export function nuMs(): number {
  return Date.now();
}
