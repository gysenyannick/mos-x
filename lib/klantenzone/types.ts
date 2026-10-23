/**
 * Datamodel van de klantenzone.
 *
 * Eén klant = één dossier. De klant opent het via een persoonlijke link
 * (mos-x.be/klant/<id>); de id is lang en willekeurig en werkt dus als sleutel.
 */

/**
 * De vier stappen van een werf. Een klantenzone krijg je pas als je klant bent,
 * dus er is geen stap "aanvraag": het begint bij de planning.
 */
export const FASES = ["gepland", "bezig", "klaar", "nazorg"] as const;
export type Fase = (typeof FASES)[number];

export const FASE_LABEL: Record<Fase, string> = {
  gepland: "Planning",
  bezig: "Uitvoering",
  klaar: "Oplevering",
  nazorg: "Nazorg",
};

/** Namen in de stappenbalk */
export const FASE_KORT: Record<Fase, string> = {
  gepland: "Planning",
  bezig: "Uitvoering",
  klaar: "Oplevering",
  nazorg: "Nazorg",
};

/** Oude dossiers kunnen nog "aanvraag" hebben: die tellen als planning. */
export function normaliseerFase(f: string): Fase {
  return (FASES as readonly string[]).includes(f) ? (f as Fase) : "gepland";
}

/** Korte uitleg per fase, zoals de klant ze ziet. */
export const FASE_UITLEG: Record<Fase, string> = {
  gepland: "Je werken staan ingepland. Hieronder zie je wanneer Yannick komt.",
  bezig: "Yannick is met je dak bezig. Foto's van de werf verschijnen hieronder.",
  klaar: "Je dak is klaar. Je garantie loopt vanaf vandaag.",
  nazorg: "Je dak is in nazorg. Vragen of iets gezien? Stuur Yannick een berichtje.",
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
  /** Uitleg voor de klant: wat gebeurt er, wat moet hij voorzien */
  info?: string;
};

export type FotoFase = "inspectie" | "voor" | "tijdens" | "na" | "klant";

export const FOTO_FASE_LABEL: Record<FotoFase, string> = {
  inspectie: "Inspectie",
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

export type DocType =
  | "offerte" | "voorschot" | "factuur"
  | "garantie" | "oplevering" | "inspectie" | "fiche" | "product"
  | "andere";

export const DOC_TYPE_LABEL: Record<DocType, string> = {
  offerte: "Offerte",
  voorschot: "Voorschotfactuur",
  factuur: "Factuur",
  garantie: "Garantiecertificaat",
  oplevering: "Opleveringsverslag",
  inspectie: "Inspectierapport",
  fiche: "Technische fiche",
  product: "Gebruikt product",
  andere: "Document",
};

/** Documenten met een bedrag dat betaald moet worden */
export const DOC_IS_FACTUUR = (t: DocType) => t === "voorschot" || t === "factuur";

/** Hoe de documenten bij de klant gegroepeerd worden, in deze volgorde */
export const DOC_GROEPEN: { titel: string; uitleg: string; types: DocType[] }[] = [
  { titel: "Facturen", uitleg: "Voorschot en eindfactuur, met wat al betaald is.", types: ["voorschot", "factuur"] },
  { titel: "Garanties", uitleg: "Bewaar ze goed: hiermee ben je zwart op wit gedekt.", types: ["garantie"] },
  { titel: "Offertes", uitleg: "Wat we afspraken, met de prijs vooraf.", types: ["offerte"] },
  { titel: "Verslagen", uitleg: "Wat vastgesteld werd bij inspecties en bij de oplevering.", types: ["oplevering", "inspectie"] },
  { titel: "Technische fiches", uitleg: "De producten die op je dak gebruikt zijn.", types: ["fiche", "product"] },
  { titel: "Andere documenten", uitleg: "", types: ["andere"] },
];

/** Zin in de tijdlijn als er een document bijkomt */
export const DOC_LOG_ZIN: Record<DocType, string> = {
  offerte: "Je offerte staat klaar.",
  voorschot: "Je voorschotfactuur staat klaar.",
  factuur: "Je factuur staat klaar.",
  garantie: "Je garantiecertificaat staat klaar.",
  oplevering: "Het opleveringsverslag staat klaar.",
  inspectie: "Het inspectierapport staat klaar.",
  fiche: "De technische fiche van de gebruikte producten staat klaar.",
  product: "Er staat een foto van een gebruikt product klaar.",
  andere: "Er staat een nieuw document klaar.",
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

/** Notitie van Yannick in het logboek van de klant */
export type Notitie = {
  id: string;
  /** ISO-tijdstip */
  datum: string;
  titel?: string;
  tekst: string;
};

/* ── Werken in dit project (bv. dakreiniging + dakcoating) ───────────────── */

export type WerkStatus = "gepland" | "bezig" | "klaar";

export const WERK_STATUS_LABEL: Record<WerkStatus, string> = {
  gepland: "Gepland",
  bezig: "Bezig",
  klaar: "Klaar",
};

/** Uitleg per soort werk, zodat de klant weet wat er gebeurt. */
export const WERK_UITLEG: Record<string, string> = {
  "Dakreiniging": "Mos, algen en vuil verwijderen met lage druk, zodat je pannen niet beschadigen.",
  "Anti-mosbehandeling": "Een behandeling die nieuwe mosgroei afremt.",
  "Dakcoating": "Een beschermlaag die je pannen waterafstotend maakt en opnieuw kleur geeft.",
  "Gootreiniging": "Bladeren en vuil uit de dakgoten halen, zodat het water weer vlot weg kan.",
  "Velux reiniging": "Dakvensters reinigen, binnen en buiten.",
  "Herstelling": "Gebroken of verschoven pannen vervangen of terugleggen.",
  "Inspectie": "Een volledige controle van je dak, met foto's.",
};

export type Werk = {
  id: string;
  naam: string;
  status: WerkStatus;
  /** YYYY-MM-DD: geplande of uitgevoerde dag */
  datum?: string;
  /** Extra uitleg van Yannick (leeg = standaarduitleg) */
  omschrijving?: string;
};

/* ── Dakpaspoort ───────────────────────────────────────────────────────────── */

export type Paspoort = {
  daktype?: string;
  /** m² */
  oppervlakte?: number;
  /** bv. "1985" of "jaren '80" */
  bouwjaar?: string;
  kleur?: string;
  zonnepanelen?: boolean;
  /** Aantal dakvensters (Velux) */
  dakvensters?: number;
  goten?: string;
  /** Wat Yannick in het oog houdt, één per regel */
  aandachtspunten?: string;
};

export const BEHANDELING_SOORTEN = [
  "Dakreiniging", "Anti-mosbehandeling", "Dakcoating", "Gootreiniging", "Inspectie", "Herstelling", "Velux reiniging",
] as const;

export type Behandeling = {
  id: string;
  /** YYYY-MM-DD */
  datum: string;
  soort: string;
  producten?: string;
  opmerking?: string;
};

export type Prioriteit = "info" | "aanbevolen" | "dringend";

export const PRIORITEIT_LABEL: Record<Prioriteit, string> = {
  info: "Ter info",
  aanbevolen: "Aanbevolen",
  dringend: "Dringend",
};

/** Een concrete vaststelling van Yannick met een voorstel, nooit automatisch. */
export type Aanbeveling = {
  id: string;
  datum: string;
  titel: string;
  tekst: string;
  prioriteit: Prioriteit;
  status: "open" | "aangevraagd" | "gedaan" | "nietnu";
  fotoUrl?: string;
};

export type AanvraagSoort = "onderhoud" | "aanbeveling" | "dakzorg" | "schade" | "extra" | "andere";

export const AANVRAAG_LABEL: Record<AanvraagSoort, string> = {
  onderhoud: "Onderhoud inplannen",
  aanbeveling: "Aanbeveling laten uitvoeren",
  dakzorg: "Interesse in MOS-X Dakzorg",
  schade: "Schade melden",
  extra: "Extra dienst",
  andere: "Vraag",
};

/** Iets wat de klant via zijn pagina vraagt; komt bij Yannick binnen. */
export type Aanvraag = {
  id: string;
  datum: string;
  soort: AanvraagSoort;
  tekst: string;
  status: "nieuw" | "behandeld";
};

export type Dakzorg = {
  actief: boolean;
  /** YYYY-MM-DD */
  sinds?: string;
  /** Wat de klant betaalt, vrije tekst, bv. "€ 195 per jaar" */
  prijs?: string;
};

/** Wat in MOS-X Dakzorg zit (zelfde lijst als op de website). */
export const DAKZORG_INBEGREPEN = [
  "Jaarlijkse inspectie door Yannick persoonlijk",
  "Preventieve reiniging waar nodig",
  "Gootcontrole en -reiniging",
  "Foto-rapportage voor en na",
  "Advies op maat voor jouw dak",
  "Voorrang bij dringende interventies",
];

/** Iemand die via de buurlink van een klant binnenkwam. */
export type Verwijzing = {
  id: string;
  datum: string;
  naam: string;
  telefoon: string;
  adres: string;
  bericht?: string;
  status: "nieuw" | "gecontacteerd" | "klant" | "geen";
};

/** Een opmerking op Mijn dak: van de klant, of van Yannick (eventueel als belangrijke melding). */
export type Opmerking = {
  id: string;
  /** ISO-tijdstip */
  datum: string;
  van: "klant" | "yannick";
  tekst: string;
  /** Alleen bij Yannick: in het oog springende melding */
  belangrijk?: boolean;
  /** Alleen bij de klant: nog niet beantwoord of afgehandeld */
  nieuw?: boolean;
};

export type LogItem = {
  /** ISO-tijdstip */
  datum: string;
  tekst: string;
};

export type Klant = {
  id: string;
  /** Foto die Yannick koos als overzichtsfoto van het dak (dakdossier) */
  dakfotoId?: string;
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
  /** De klant laat zijn voor- en na-foto zien op zijn uitnodigingslink */
  deelVoorNa?: boolean;
  /** ISO-tijdstip waarop het bericht geschreven werd; na een week verdwijnt het vanzelf */
  berichtDatum?: string;
  /** Datum (YYYY-MM-DD) van de onderhoudsbeurt waarvoor de herinnering al vertrok */
  herinnerdVoor?: string;
  afspraken: Afspraak[];
  fotos: Foto[];
  documenten: Document[];
  garantie: Garantie;
  /* Velden hieronder kunnen ontbreken bij dossiers van vóór die functie */
  /** Nummer in een ander systeem (bv. Beavr), voor de automatische koppeling */
  externId?: string;
  werken?: Werk[];
  notities?: Notitie[];
  opmerkingen?: Opmerking[];
  paspoort?: Paspoort;
  behandelingen?: Behandeling[];
  /** YYYY-MM-DD: aanbevolen volgende controle (leeg = automatisch berekend) */
  volgendeControle?: string;
  aanbevelingen?: Aanbeveling[];
  aanvragen?: Aanvraag[];
  dakzorg?: Dakzorg;
  /** Korte code voor de buurlink: mos-x.be/buur/<code> */
  refCode?: string;
  verwijzingen?: Verwijzing[];
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

/** Standaarduitleg per soort afspraak, als Yannick zelf niets invult. */
export const AFSPRAAK_TIPS: Record<string, string> = {
  "Plaatsbezoek": "Yannick bekijkt je dak en bespreekt met jou wat het nodig heeft. Reken op een halfuurtje. Je hoeft niets voor te bereiden.",
  "Start werken": "Zorg dat de oprit of het stuk voor je woning vrij is en dat er een buitenkraan bruikbaar is. Thuis zijn hoeft niet.",
  "Dakreiniging": "Hou ramen en dakvensters dicht tijdens de werken. Een buitenkraan in de buurt is handig.",
  "Dakcoating": "De coating heeft droog weer nodig. Is het nat, dan schuift de dag in overleg op. Hou ramen en dakvensters dicht.",
  "Oplevering": "Samen het resultaat nalopen en je garantie overlopen. Reken op een kwartiertje.",
  "Nazorgbezoek": "Gratis controle binnen je garantie: Yannick kijkt hoe je dak erbij ligt. Je hoeft niets te doen.",
};

/** Hoe lang vooraf een klant een afspraak nog zelf mag verzetten. */
export const VERZET_UREN = 48;

/** Extra diensten die de klant er met één klik bij kan vragen. */
/** Diensten die een klant kan aanvragen. De foto kan Yannick vervangen via Instellingen. */
export const EXTRAS: readonly { id: string; naam: string; tekst: string; foto?: string }[] = [
  { id: "coating", naam: "Dakcoating", tekst: "Na een reiniging zijn je pannen open en poreus. Een coating sluit ze af, geeft je dak zijn kleur terug en houdt het langer proper, met tot 10 jaar garantie.", foto: "/images/IMG_4584%20Vooraanzicht%20dakcoating.JPEG" },
  { id: "goten", naam: "Dakgoten reinigen", tekst: "Bladeren, mos en vuil eruit, zodat het regenwater weer vlot weg kan en niet op de onderste pannen blijft staan.", foto: "/images/Goot%20na.JPEG" },
  { id: "herstelling", naam: "Kleine herstellingen", tekst: "Een gebroken of verschoven pan, losse nokpannen of verweerde voegen: snel hersteld voor er water binnenkomt.", foto: "/images/Dakpan%20herstelling.png" },
  { id: "gevel", naam: "Gevelreiniging", tekst: "Groene aanslag en vuil van je gevel, zacht gereinigd en zonder schade aan steen of voegen. Zo past je gevel weer bij je propere dak." },
  { id: "oprit", naam: "Oprit en terras", tekst: "Mos en onkruid tussen de klinkers weg, op lage druk, zodat het zand in de voegen blijft." },
];
