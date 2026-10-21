/**
 * Datamodel van de klantenzone.
 *
 * Eén klant = één dossier. De klant opent het via een persoonlijke link
 * (mos-x.be/klant/<id>); de id is lang en willekeurig en werkt dus als sleutel.
 */

export const FASES = ["aanvraag", "gepland", "bezig", "klaar", "nazorg"] as const;
export type Fase = (typeof FASES)[number];

export const FASE_LABEL: Record<Fase, string> = {
  aanvraag: "Aanvraag",
  gepland: "Gepland",
  bezig: "Aan het werk",
  klaar: "Klaar",
  nazorg: "Nazorg",
};

/** Korte uitleg per fase, zoals de klant ze ziet. */
export const FASE_UITLEG: Record<Fase, string> = {
  aanvraag: "Ik bekijk je aanvraag en maak je offerte op.",
  gepland: "Je werken staan ingepland. Hieronder zie je wanneer ik kom.",
  bezig: "Ik ben met je dak bezig. Foto's van de werf verschijnen hieronder.",
  klaar: "Je dak is klaar. Je garantie loopt vanaf vandaag.",
  nazorg: "Je dak is in nazorg. Vragen of iets gezien? Stuur me een berichtje.",
};

export type Precisie = "dag" | "week" | "maand";

export type Startdatum = {
  /** YYYY-MM-DD */
  datum: string;
  precisie: Precisie;
};

export type Afspraak = {
  id: string;
  /** ISO-datum met tijd, lokale Belgische tijd zonder zone: YYYY-MM-DDTHH:mm */
  start: string;
  duurMin: number;
  titel: string;
};

export type FotoFase = "voor" | "tijdens" | "na" | "klant";

export const FOTO_FASE_LABEL: Record<FotoFase, string> = {
  voor: "Voor",
  tijdens: "Tijdens",
  na: "Na",
  klant: "Van jou",
};

export type Foto = {
  id: string;
  url: string;
  fase: FotoFase;
  bijschrift?: string;
  /** ISO-tijdstip van uploaden */
  datum: string;
};

export type DocType = "offerte" | "voorschot" | "factuur" | "andere";

export const DOC_TYPE_LABEL: Record<DocType, string> = {
  offerte: "Offerte",
  voorschot: "Voorschotfactuur",
  factuur: "Factuur",
  andere: "Document",
};

export type DocStatus = "open" | "betaald" | "info";

export type Document = {
  id: string;
  type: DocType;
  titel: string;
  url: string;
  /** Bedrag incl. btw in euro, optioneel */
  bedrag?: number;
  status: DocStatus;
  /** YYYY-MM-DD */
  datum: string;
};

export type Garantie = {
  /** Aantal jaar mosvrij na reiniging (0 = geen) */
  mosvrijJaren: number;
  /** Aantal jaar garantie op coating (0 = geen coating) */
  coatingJaren: number;
  /** YYYY-MM-DD: datum waarop de garantie ingaat (meestal de opleverdatum) */
  vanaf?: string;
};

export type LogItem = {
  /** ISO-tijdstip */
  datum: string;
  tekst: string;
};

export type Klant = {
  id: string;
  voornaam: string;
  achternaam: string;
  telefoon: string;
  email: string;
  adres: string;
  dienst: string;
  fase: Fase;
  start?: Startdatum;
  /** Persoonlijk bericht van Yannick bovenaan de pagina */
  bericht?: string;
  afspraken: Afspraak[];
  fotos: Foto[];
  documenten: Document[];
  garantie: Garantie;
  log: LogItem[];
  aangemaakt: string;
  bijgewerkt: string;
};

/** Een vrij moment dat een klant kan kiezen om een afspraak te verzetten. */
export type VrijMoment = {
  id: string;
  /** YYYY-MM-DDTHH:mm, Belgische tijd */
  start: string;
  duurMin: number;
};

/** Hoe lang vooraf een klant een afspraak nog zelf mag verzetten. */
export const VERZET_UREN = 48;
