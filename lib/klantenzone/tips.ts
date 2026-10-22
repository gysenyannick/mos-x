/** Tips en advies voor klanten: gratis uitleg, en waar het past een dienst om aan te vragen. */
export type Tip = {
  id: string;
  /** Kort onderwerp boven de titel */
  onderwerp: string;
  titel: string;
  intro: string;
  /** Uitleg na "Lees meer", één alinea per regel */
  meer: string[];
  foto?: string;
  /** Wat de klant kan aanvragen; leeg = enkel advies */
  aanvraag?: { soort: "onderhoud" | "extra"; extra?: string; label: string };
};

export const TIPS: Tip[] = [
  {
    id: "onderhoud",
    onderwerp: "Onderhoud",
    titel: "Zo blijft je dak jaren proper",
    intro: "Mos komt terug, vooral op de schaduwkant. Een preventieve behandeling om de anderhalf à twee jaar houdt het tegen.",
    meer: [
      "Mossporen waaien elk jaar opnieuw aan. Op een gereinigd dak hechten ze moeilijker, maar na een tijd krijgen ze weer vat, eerst aan de noordkant en onder bomen.",
      "Een anti-mosbehandeling doodt die sporen voor je er iets van ziet. Grondig reinigen is dan niet meer nodig.",
    ],
    foto: "/images/Antimos%20op%20dak.jpg",
    aanvraag: { soort: "onderhoud", label: "Plan mijn onderhoud" },
  },
  {
    id: "goten",
    onderwerp: "Dakgoten",
    titel: "Reinig je goten na de bladval",
    intro: "Volle goten lopen over. Het water loopt dan langs je gevel of blijft op de onderste pannen staan.",
    meer: [
      "In november zitten goten het vaakst vol: bladeren, mos dat van het dak spoelt en zand van de pannen.",
      "Eén keer per jaar leegmaken is meestal genoeg. Staan er bomen vlak bij je huis, dan best twee keer.",
    ],
    foto: "/images/Goot%20na.JPEG",
    aanvraag: { soort: "extra", extra: "goten", label: "Vraag een prijs" },
  },
  {
    id: "hogedruk",
    onderwerp: "Advies",
    titel: "Gebruik nooit een hogedrukreiniger op je dak",
    intro: "Het lijkt snel en goedkoop, maar het beschadigt de toplaag van je pannen.",
    meer: [
      "De straal spuit de beschermlaag van de pan weg. De pan wordt ruwer en neemt meer water op, waardoor mos er net sneller terugkomt.",
      "Water kan ook onder de pannen geblazen worden en zo in je isolatie trekken.",
    ],
    foto: "/images/Before%20slider%203.0.png",
  },
  {
    id: "storm",
    onderwerp: "Advies",
    titel: "Na een storm: waar let je op?",
    intro: "Kijk van op straat of er pannen scheef liggen of ontbreken, vooral aan de nok en de randen.",
    meer: [
      "Klim niet zelf op het dak. Neem een foto van op de grond en stuur ze via Berichten.",
      "Een verschoven pan is snel teruggelegd. Wacht je te lang, dan kan er water binnenkomen.",
    ],
    foto: "/images/Dakpan%20herstelling.png",
    aanvraag: { soort: "extra", extra: "herstelling", label: "Laat het nakijken" },
  },
  {
    id: "oprit",
    onderwerp: "Oprit en terras",
    titel: "Groene voegen op je oprit of terras",
    intro: "Mos en onkruid tussen de klinkers maken een oprit glad en doen hem ouder lijken dan hij is.",
    meer: [
      "Wegspuiten met veel druk haalt ook het zand uit de voegen. Daarna groeit het onkruid sneller terug.",
      "Beter is reinigen op lage druk en daarna de voegen opnieuw invullen.",
    ],
    aanvraag: { soort: "extra", extra: "oprit", label: "Vraag een prijs" },
  },
  {
    id: "zonnepanelen",
    onderwerp: "Zonnepanelen",
    titel: "Vuile zonnepanelen leveren minder op",
    intro: "Stof, stuifmeel en vogelpoep vormen een laagje dat licht tegenhoudt.",
    meer: [
      "Hoeveel je verliest, hangt af van de helling en de omgeving. Bij panelen naast een akker of onder bomen merk je het het snelst.",
      "Reinig ze met zacht water en een zachte borstel, nooit met een schuurmiddel.",
    ],
    aanvraag: { soort: "extra", extra: "zonnepanelen", label: "Vraag een prijs" },
  },
];
