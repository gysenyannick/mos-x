import { dagenTot, fmtKort, plusJaren } from "./tijd";
import type { Foto, Klant } from "./types";

/** De overzichtsfoto van het dak: de gekozen foto, anders de beste die er is. */
export function dakfoto(k: Klant): Foto | undefined {
  const gekozen = k.dakfotoId ? k.fotos.find((f) => f.id === k.dakfotoId) : undefined;
  if (gekozen) return gekozen;
  for (const fase of ["na", "voor", "inspectie", "tijdens"] as const) {
    const f = k.fotos.find((x) => x.fase === fase);
    if (f) return f;
  }
  return undefined;
}

/** De dakgegevens die de klant ziet; lege velden vallen weg. */
export function dakGegevens(k: Klant): { label: string; waarde: string }[] {
  const p = k.paspoort ?? {};
  const rijen: [string, string | undefined][] = [
    ["Daktype", p.daktype],
    ["Kleur", p.kleur],
    ["Oppervlakte", p.oppervlakte ? `${p.oppervlakte} m²` : undefined],
  ];
  return rijen.filter((r): r is [string, string] => !!r[1]).map(([label, waarde]) => ({ label, waarde }));
}

/** Onderhoud aanbieden heeft pas zin als het dak behandeld is. */
export function onderhoudZinvol(k: Klant): boolean {
  return k.fase === "klaar" || k.fase === "nazorg";
}

/** Is er genoeg om een dakdossier van te maken? */
export function heeftDossier(k: Klant): boolean {
  return dakGegevens(k).length > 0 || (k.behandelingen ?? []).length > 0;
}

/** Garantie in woorden, voor het dakdossier. */
export function garantieRegels(k: Klant): { titel: string; staat: string }[] {
  const { mosvrijJaren, coatingJaren, vanaf } = k.garantie;
  const regels: [string, number][] = [];
  if (mosvrijJaren > 0) regels.push([`${mosvrijJaren} jaar mosvrij`, mosvrijJaren]);
  if (coatingJaren > 0) regels.push([`${coatingJaren} jaar op de dakcoating`, coatingJaren]);
  return regels.map(([titel, jaren]) => {
    if (!vanaf) return { titel, staat: "Gaat in bij de oplevering" };
    const tot = plusJaren(vanaf, jaren);
    return { titel, staat: dagenTot(tot) >= 0 ? `Geldig tot ${fmtKort(tot)}` : `Verlopen op ${fmtKort(tot)}` };
  });
}
