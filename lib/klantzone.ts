/**
 * Klantenzone — datamodel + demodossier.
 *
 * In de demo komt alles uit DEMO_DOSSIER hieronder. In de echte versie
 * komt hetzelfde object uit de database, opgehaald via de persoonlijke
 * link (/klant/<token>), en vult Yannick het in via de beheerpagina.
 */

export const STATUS_STAPPEN = [
  { key: "aanvraag",   label: "Aanvraag" },
  { key: "offerte",    label: "Offerte" },
  { key: "gepland",    label: "Gepland" },
  { key: "uitvoering", label: "Uitvoering" },
  { key: "opgeleverd", label: "Opgeleverd" },
  { key: "nazorg",     label: "Nazorg" },
] as const;

export type StatusKey = (typeof STATUS_STAPPEN)[number]["key"];

export type PlanningDag = {
  datum: string;          // ISO, bv. "2026-10-20"
  titel: string;
  omschrijving: string;
};

export type Foto = {
  src: string;
  fase: "voor" | "tijdens" | "na";
  bijschrift: string;
  datum: string;
};

export type Document = {
  soort: "offerte" | "factuur" | "garantie";
  titel: string;
  datum?: string;
  bedrag?: number;        // incl. btw
  status: "goedgekeurd" | "betaald" | "open" | "volgt";
  toelichting?: string;
  url?: string;           // PDF (geüpload of uit Dexter)
};

export type Update = {
  datum: string;
  tekst: string;
};

export type Dossier = {
  dossiernummer: string;
  klant: { voornaam: string; achternaam: string; adres: string };
  dienst: string;
  dak: string;
  status: StatusKey;
  start: { datum: string; vast: boolean; voorlopig?: string };
  oplevering?: string;
  planning: PlanningDag[];
  fotos: Foto[];
  documenten: Document[];
  updates: Update[];
};

/** Fictieve klant voor de demo — geen echte persoon of adres. */
export const DEMO_DOSSIER: Dossier = {
  dossiernummer: "MX-2026-0142",
  klant: { voornaam: "Jan", achternaam: "Peeters", adres: "Voorbeeldstraat 12, 2280 Grobbendonk" },
  dienst: "Dakontmossing + dakcoating",
  dak: "Betonpannen · ± 140 m²",
  status: "uitvoering",
  start: { datum: "2026-10-20", vast: true },
  oplevering: "2026-10-22",
  planning: [
    { datum: "2026-10-20", titel: "Dak reinigen",       omschrijving: "Mos en vuil verwijderen, goten leegmaken en doorspoelen." },
    { datum: "2026-10-21", titel: "Mosbehandeling",     omschrijving: "Antimos aanbrengen en het dak volledig laten drogen." },
    { datum: "2026-10-22", titel: "Coating & oplevering", omschrijving: "Twee lagen coating, opkuis en samen het resultaat bekijken." },
  ],
  fotos: [
    { src: "/images/IMG_5414.JPEG",      fase: "voor",    bijschrift: "Mos op de pannen bij het plaatsbezoek", datum: "2026-10-08" },
    { src: "/images/OIen - Before.png",  fase: "voor",    bijschrift: "Zicht op het dak van op de straat",      datum: "2026-10-08" },
    { src: "/images/IMG_5898.JPEG",      fase: "tijdens", bijschrift: "Dag 1 — reinigen voorkant",              datum: "2026-10-20" },
    { src: "/images/IMG_5396.JPEG",      fase: "tijdens", bijschrift: "Dag 1 — reinigen achterkant",            datum: "2026-10-20" },
    { src: "/images/IMG_5900.JPEG",      fase: "tijdens", bijschrift: "Dag 1 — laatste stuk bij de nok",        datum: "2026-10-20" },
  ],
  documenten: [
    { soort: "offerte",  titel: "Offerte dakontmossing + coating", datum: "2026-10-14", bedrag: 3300, status: "goedgekeurd" },
    { soort: "factuur",  titel: "Voorschotfactuur (30%)",          datum: "2026-10-15", bedrag: 990,  status: "betaald" },
    { soort: "factuur",  titel: "Eindfactuur",                                         bedrag: 2310, status: "volgt", toelichting: "Na de oplevering" },
    { soort: "garantie", titel: "Garantieattest",                                                    status: "volgt", toelichting: "Na de oplevering" },
  ],
  updates: [
    { datum: "2026-10-20", tekst: "Dag 1 zit erop: het dak is volledig gereinigd en de goten zijn leeg. Morgen de mosbehandeling." },
    { datum: "2026-10-16", tekst: "Je startdatum ligt vast: maandag 20 oktober. Ik ben er rond 8 uur." },
    { datum: "2026-10-14", tekst: "Bedankt voor je goedkeuring van de offerte!" },
    { datum: "2026-10-08", tekst: "Plaatsbezoek gedaan. Je offerte volgt binnen de 2 dagen." },
  ],
};
