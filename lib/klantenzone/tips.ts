/** Tips en advies voor klanten wiens dak net behandeld is: hoe het in topconditie blijft. */
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
  /** Enkel tonen als de klant (nog) geen coating heeft */
  alleenZonderCoating?: boolean;
};

export const TIPS: Tip[] = [
  {
    id: "eerste-weken",
    onderwerp: "Na de behandeling",
    titel: "Je dak de eerste weken na de behandeling",
    intro: "De anti-mosbehandeling werkt nog weken door. Zie je hier en daar nog wat resten, dan is dat normaal.",
    meer: [
      "De behandeling doodt ook de sporen die je niet ziet. Wat nog op de pannen zit, verkleurt en spoelt met de regen weg.",
      "Spuit er niet zelf met water op en laat de regen zijn werk doen. Na een paar maanden kijk je best of je goten niet vol resten liggen.",
    ],
    foto: "/images/Na%20dakreiniging%20slider.png",
  },
  {
    id: "onderhoud",
    onderwerp: "Onderhoud",
    titel: "Zo blijft je dak jaren proper",
    intro: "Mos komt na een tijd terug, eerst op de schaduwkant. Een preventieve behandeling op tijd houdt het tegen.",
    meer: [
      "Mossporen waaien elk jaar opnieuw aan. Op een gereinigd dak hechten ze moeilijker, maar na een tijd krijgen ze weer vat, eerst aan de noordkant en onder bomen.",
      "Een anti-mosbehandeling doodt die sporen voor je er iets van ziet. Grondig reinigen is dan niet meer nodig.",
    ],
    foto: "/images/Antimos%20op%20dak.jpg",
    aanvraag: { soort: "onderhoud", label: "Plan mijn onderhoud" },
  },
  {
    id: "takken",
    onderwerp: "Bomen",
    titel: "Snoei de takken boven je dak",
    intro: "Schaduw en vallende bladeren houden je dak vochtig. Daar komt mos het eerst terug.",
    meer: [
      "Hou takken minstens een meter van je dak. Zo droogt het na een regenbui sneller op en blijven er minder bladeren liggen.",
      "Snoeien doe je best in de winter, als de boom in rust is.",
    ],
    foto: "/images/Weer%20een%20dak%20ontmost.jpg",
  },
  {
    id: "goten",
    onderwerp: "Dakgoten",
    titel: "Reinig je goten na de bladval",
    intro: "Volle goten lopen over. Het water blijft dan op de onderste pannen staan, en net daar groeit mos het snelst.",
    meer: [
      "In november zitten goten het vaakst vol: bladeren, zand van de pannen en resten van de behandeling.",
      "Eén keer per jaar leegmaken is meestal genoeg. Staan er bomen vlak bij je huis, dan best twee keer.",
    ],
    foto: "/images/Goot%20na.JPEG",
    aanvraag: { soort: "extra", extra: "goten", label: "Vraag een prijs" },
  },
  {
    id: "jaarlijks",
    onderwerp: "Controle",
    titel: "Kijk één keer per jaar naar je dak",
    intro: "Van op straat zie je al veel: een groene waas op de schaduwkant, een verschoven pan of een losse nok.",
    meer: [
      "Neem in het voorjaar een foto van elke kant van je dak. Zo zie je het verschil met vorig jaar.",
      "Twijfel je? Stuur de foto via Berichten. Yannick kijkt mee, gratis.",
    ],
    foto: "/images/Foto%20dak.jpg",
  },
  {
    id: "storm",
    onderwerp: "Na een storm",
    titel: "Na een storm: waar let je op?",
    intro: "Kijk van op straat of er pannen scheef liggen of ontbreken, vooral aan de nok en de randen.",
    meer: [
      "Klim niet zelf op het dak. Neem een foto van op de grond en stuur ze via Berichten, of bel bij spoed.",
      "Een verschoven pan is snel teruggelegd. Wacht je te lang, dan kan er water binnenkomen.",
    ],
    foto: "/images/Dakpan%20herstelling.png",
    aanvraag: { soort: "extra", extra: "herstelling", label: "Laat het nakijken" },
  },
  {
    id: "coating",
    onderwerp: "Bescherming",
    titel: "Een coating houdt je gereinigde dak langer mooi",
    intro: "Na een reiniging zijn de pannen open en poreus. Een coating sluit ze af, zodat water en mos minder vat krijgen.",
    meer: [
      "Je dak krijgt ook zijn kleur terug. En op de coating krijg je tot 10 jaar garantie.",
      "Kort na een reiniging is het ideale moment: je dak is al proper en droog.",
    ],
    foto: "/images/IMG_4584%20Vooraanzicht%20dakcoating.JPEG",
    aanvraag: { soort: "extra", extra: "coating", label: "Vraag een prijs" },
    alleenZonderCoating: true,
  },
];
