import { plusDagen, vandaag } from "./tijd";
import type { Klant } from "./types";

/**
 * Wanneer is een volgende controle logisch?
 * - Yannick vulde zelf een datum in → die.
 * - Anders: laatste behandeling (of opleverdatum) + 12 maanden met Dakzorg,
 *   + 18 maanden zonder (ruim voor de mosgarantie van 2 jaar afloopt).
 */
export function volgendeControle(k: Klant): { datum: string; reden: string } | null {
  if (k.volgendeControle) return { datum: k.volgendeControle, reden: "Door Yannick ingepland op basis van de toestand van je dak." };

  const laatste = [...(k.behandelingen ?? []).map((b) => b.datum), k.garantie.vanaf]
    .filter((d): d is string => !!d)
    .sort()
    .pop();
  if (!laatste) return null;

  const maanden = k.dakzorg?.actief ? 12 : 18;
  const datum = plusDagen(laatste, Math.round(maanden * 30.44));
  return {
    datum,
    reden: k.dakzorg?.actief
      ? "Je jaarlijkse inspectie, inbegrepen in MOS-X Dakzorg."
      : "Een controle ruim voor je mosgarantie afloopt, zodat beginnende mos geen kans krijgt.",
  };
}

/** Binnen hoeveel dagen is de controle? (negatief = al voorbij) */
export function controleBinnen(datum: string): number {
  return Math.round((new Date(`${datum}T12:00:00Z`).getTime() - new Date(`${vandaag()}T12:00:00Z`).getTime()) / 86_400_000);
}
