import { plusDagen, vandaag } from "./tijd";
import { FASES, type Fase, type Klant, type WerkStatus } from "./types";

/**
 * Alles wat vanzelf volgt uit de datums, zodat Yannick niet alles moet bijhouden.
 *
 * - Een gepland werk met een datum van vandaag staat op "bezig", van vroeger op "klaar".
 * - De stap volgt uit de werken en afspraken (planning → uitvoering → oplevering → nazorg),
 *   maar nooit terug: zette Yannick zelf al een latere stap, dan blijft die staan.
 * - Garantie en onderhoudshistoriek starten vanzelf vanaf de opleverdatum.
 *
 * Er wordt niets opgeslagen: dit is wat de klant (en het beheer) te zien krijgt.
 */

const NAZORG_NA_DAGEN = 14;

function werkStatus(status: WerkStatus, datum: string | undefined, nu: string): WerkStatus {
  if (status !== "gepland" || !datum) return status;
  if (datum < nu) return "klaar";
  if (datum === nu) return "bezig";
  return "gepland";
}

export function berekendeFase(k: Klant, nu = vandaag()): Fase {
  const werken = k.werken ?? [];
  const statussen = werken.map((w) => werkStatus(w.status, w.datum, nu));
  const allesKlaar = werken.length > 0 && statussen.every((s) => s === "klaar");
  const oplevering = k.afspraken.find((a) => a.titel === "Oplevering")?.start.slice(0, 10);
  const opleverDag = oplevering && oplevering <= nu ? oplevering
    : allesKlaar ? werken.map((w) => w.datum ?? "").sort().pop() || nu : undefined;

  if (opleverDag) return opleverDag <= plusDagen(nu, -NAZORG_NA_DAGEN) ? "nazorg" : "klaar";
  const gestart = statussen.some((s) => s !== "gepland")
    || (k.start?.precisie === "dag" && k.start.datum <= nu)
    || k.afspraken.some((a) => a.titel === "Start werken" && a.start.slice(0, 10) <= nu);
  return gestart ? "bezig" : "gepland";
}

/** Het dossier zoals het nu is, met alles wat automatisch volgt ingevuld. */
export function effectief(k: Klant): Klant {
  const nu = vandaag();
  const werken = (k.werken ?? []).map((w) => ({ ...w, status: werkStatus(w.status, w.datum, nu) }));
  const auto = berekendeFase({ ...k, werken }, nu);
  const fase = FASES.indexOf(auto) > FASES.indexOf(k.fase) ? auto : k.fase;

  // Opleverdatum: afspraak "Oplevering" of de laatste dag van de werken
  const opleverDag = k.afspraken.find((a) => a.titel === "Oplevering" && a.start.slice(0, 10) <= nu)?.start.slice(0, 10)
    ?? (werken.length && werken.every((w) => w.status === "klaar") ? werken.map((w) => w.datum ?? "").sort().pop() : undefined);
  const garantie = { ...k.garantie, vanaf: k.garantie.vanaf ?? ((fase === "klaar" || fase === "nazorg") ? opleverDag || undefined : undefined) };

  // Afgewerkte werken komen vanzelf in de onderhoudshistoriek
  const behandelingen = [...(k.behandelingen ?? [])];
  for (const w of werken) {
    if (w.status === "klaar" && w.datum && !behandelingen.some((b) => b.soort === w.naam && b.datum === w.datum)) {
      behandelingen.push({ id: `auto-${w.id}`, datum: w.datum, soort: w.naam, opmerking: w.omschrijving });
    }
  }
  behandelingen.sort((a, b) => b.datum.localeCompare(a.datum));

  return { ...k, fase, werken, garantie, behandelingen };
}
