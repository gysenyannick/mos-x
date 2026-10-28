/**
 * De kennisbank: eigen artikels over mos, daktypes en dakonderhoud.
 * Elk artikel beantwoordt één vraag waar mensen op zoeken, en eindigt met een logische volgende stap.
 */

/** Zet op true om de kennisbank weer online te zetten (links, sitemap en pagina's). */
export const KENNISBANK_ONLINE = false;

export type Categorie = "mos" | "daktypes" | "tips";

export type Sectie = { kop: string; tekst: string[]; lijst?: string[] };

export type Artikel = {
  slug: string;
  categorie: Categorie;
  titel: string;
  /** Titel voor Google, zonder " | MOS-X" (dat komt er vanzelf bij). */
  seoTitel: string;
  omschrijving: string;
  intro: string;
  beeld: string;
  beeldAlt: string;
  secties: Sectie[];
  faq?: { q: string; a: string }[];
  verwant: string[];
  cta: "ontmossen" | "coaten" | "dakzorg" | "asbest";
};

export const CATEGORIEEN: { id: Categorie; naam: string; uitleg: string }[] = [
  { id: "mos", naam: "Mos en algen", uitleg: "Wat groeit er op je dak, en wat doet het met je dakbedekking?" },
  { id: "daktypes", naam: "Per daktype", uitleg: "Elk dak vraagt een eigen aanpak. Zo pakken we jouw type dak aan." },
  { id: "tips", naam: "Tips en advies", uitleg: "Wanneer, hoe vaak en hoe je je dak het best laat behandelen." },
];

export const ARTIKELS: Artikel[] = [
  // ── Mos en algen ─────────────────────────────────────────────────────────
  {
    slug: "wat-is-mos-op-je-dak",
    categorie: "mos",
    titel: "Wat is mos op je dak, en waarom groeit het daar?",
    seoTitel: "Mos op je dak: wat is het en waarom groeit het?",
    omschrijving: "Waarom groeit er mos op je dak, waar groeit het het meest en wat kun je eraan doen? Uitleg over mos op dakpannen en leien.",
    intro: "Bijna elk dak in Vlaanderen krijgt vroeg of laat mos. Dat is geen teken van slecht onderhoud, maar van ons klimaat: veel regen, weinig zon en veel bomen. Hier lees je wat mos precies is en waarom het zo graag op daken groeit.",
    beeld: "/images/IMG_4493.JPEG",
    beeldAlt: "Mos tussen de dakpannen van een woning",
    secties: [
      {
        kop: "Wat is mos eigenlijk?",
        tekst: [
          "Mos is een eenvoudige plant zonder echte wortels. Het hecht zich vast met fijne draadjes en haalt water en voeding rechtstreeks uit de lucht en de regen. Daardoor kan het groeien op plaatsen waar andere planten geen kans hebben, zoals op dakpannen en leien.",
          "Mos verspreidt zich via sporen die met de wind meekomen. Komt een spoor terecht op een vochtig plekje op je dak, dan begint het te groeien. Na een paar jaar zie je de typische groene kussentjes tussen en op de pannen.",
        ],
      },
      {
        kop: "Waarom groeit mos vooral op daken?",
        tekst: ["Een dak biedt mos precies wat het nodig heeft:"],
        lijst: [
          "Vocht: regen en dauw blijven liggen in de groeven en naden van de pannen.",
          "Schaduw: op de noordkant en onder bomen droogt het dak trager op.",
          "Een ruw oppervlak: oudere pannen worden poreus, waardoor sporen zich makkelijk vasthechten.",
          "Voeding: stof, bladeren en vuil in de naden vormen een dun laagje grond.",
        ],
      },
      {
        kop: "Waar zie je het eerst?",
        tekst: [
          "Mos begint bijna altijd op de noordkant van het dak, op plaatsen onder of naast bomen en in de naden tussen de pannen. Op de zuidkant, waar de zon het dak snel opdroogt, zie je vaker een dunne groene of zwarte aanslag van algen dan echte moskussens.",
        ],
      },
      {
        kop: "Wat kun je eraan doen?",
        tekst: [
          "Mos verdwijnt niet vanzelf. Het groeit elk jaar verder, en de oude lagen houden vocht en vuil vast waar nieuw mos op groeit. De enige echte oplossing is het dak grondig te reinigen en daarna te behandelen met een antimosmiddel, zodat nieuwe sporen geen kans krijgen.",
          "Na een dakontmossing bij MOS-X krijg je 2 jaar mosvrij-garantie: komt er binnen 2 jaar toch mos terug, dan brengen we gratis, op onze kosten, een nieuwe antimosbehandeling aan.",
        ],
      },
    ],
    faq: [
      { q: "Is mos op mijn dak een teken van slecht onderhoud?", a: "Nee. Mos groeit op bijna elk dak in ons klimaat, zeker op de noordkant en onder bomen. Het is wel een teken dat je dak aan een reiniging toe is." },
      { q: "Verdwijnt mos in de zomer vanzelf?", a: "Nee. In droge periodes wordt mos bruin en lijkt het dood, maar zodra het weer regent, groeit het gewoon verder." },
    ],
    verwant: ["mos-of-algen", "is-mos-schadelijk-voor-je-dak", "dak-beschermen-tegen-mos"],
    cta: "ontmossen",
  },
  {
    slug: "mos-of-algen",
    categorie: "mos",
    titel: "Mos, algen of korstmos: wat zit er op je dak?",
    seoTitel: "Mos, algen of korstmos op je dak: het verschil",
    omschrijving: "Groene aanslag, zwarte strepen of moskussens op je dak? Zo herken je het verschil tussen mos, algen en korstmos, en wat je eraan doet.",
    intro: "Niet alles wat groen of zwart is op je dak, is mos. Vaak gaat het om algen of korstmos. Ze zien er anders uit, maar hebben één ding gemeen: ze houden vocht vast en tasten je dakbedekking aan.",
    beeld: "/images/Voor dakreiniging slider.png",
    beeldAlt: "Dakpannen met groene aanslag en mos voor een dakreiniging",
    secties: [
      {
        kop: "Mos: groene kussentjes",
        tekst: [
          "Mos herken je aan de dikke, zachte kussentjes tussen en op de pannen. Het groeit vooral op de noordkant en onder bomen. Na een droge periode wordt het bruin, maar bij regen kleurt het weer groen.",
        ],
      },
      {
        kop: "Algen: groene of zwarte aanslag",
        tekst: [
          "Algen zie je als een dunne, egale groene laag of als zwarte strepen die naar beneden lopen. Ze voelen glad aan en groeien over het hele oppervlak van de pan. Algen zijn vaak de eerste stap: ze maken het oppervlak ruwer en vochtiger, waardoor mos zich daarna makkelijker vasthecht.",
        ],
      },
      {
        kop: "Korstmos: grijze of gele vlekjes",
        tekst: [
          "Korstmos is een samenwerking van een schimmel en een alg. Je ziet het als ronde, platte vlekjes in grijs, geel of oranje die stevig vastzitten op de pan. Korstmos groeit traag, maar is moeilijk te verwijderen en dringt diep in het oppervlak.",
        ],
      },
      {
        kop: "Moet je alles laten verwijderen?",
        tekst: [
          "Ja. Mos, algen en korstmos houden allemaal vocht vast in je dakbedekking. Bij vorst zet dat vocht uit, waardoor pannen sneller verweren en barsten. Bij een dakontmossing verwijderen we daarom niet alleen het mos, maar ook de algen en korstmossen, en behandelen we het dak daarna preventief.",
        ],
      },
    ],
    verwant: ["wat-is-mos-op-je-dak", "is-mos-schadelijk-voor-je-dak", "hoe-wordt-een-dak-ontmost"],
    cta: "ontmossen",
  },
  {
    slug: "is-mos-schadelijk-voor-je-dak",
    categorie: "mos",
    titel: "Is mos schadelijk voor je dak?",
    seoTitel: "Is mos schadelijk voor je dak? Dit zijn de gevolgen",
    omschrijving: "Mos op je dak lijkt onschuldig, maar het houdt vocht vast, verstopt je dakgoten en laat pannen sneller verweren. Dit zijn de gevolgen.",
    intro: "Een beetje mos op het dak lijkt onschuldig, en sommige mensen vinden het zelfs mooi. Toch is het beter om er niet te lang mee te wachten. Mos werkt als een spons, en dat heeft gevolgen voor je hele dak.",
    beeld: "/images/Goot voor.JPEG",
    beeldAlt: "Dakgoot vol mos en bladeren",
    secties: [
      {
        kop: "Mos houdt vocht vast",
        tekst: [
          "Mos neemt regenwater op en geeft het heel traag weer af. Daardoor blijven je pannen veel langer nat dan nodig. Een dak dat nooit goed opdroogt, verweert sneller: het oppervlak wordt poreus en neemt nog meer water op.",
        ],
      },
      {
        kop: "Vorstschade",
        tekst: [
          "Water dat in de pannen trekt, zet uit wanneer het vriest. Elke winter ontstaan zo kleine scheurtjes. Na een paar jaar kunnen pannen afschilferen of barsten, en dan kan er water onder je dak lopen.",
        ],
      },
      {
        kop: "Water dat onder de pannen loopt",
        tekst: [
          "Dikke moskussens tussen de pannen kunnen het regenwater tegenhouden of opzij duwen. Bij hevige regen loopt het water dan niet meer netjes naar de goot, maar zoekt het een weg onder de pannen. Zo ontstaan vochtplekken en lekken.",
        ],
      },
      {
        kop: "Verstopte dakgoten",
        tekst: [
          "Mos komt los bij regen en wind en spoelt in je dakgoten en afvoeren. Die raken verstopt, waardoor het water over de rand loopt, langs je gevel naar beneden. Ook op je oprit en terras vind je dan losse mosbolletjes.",
        ],
      },
      {
        kop: "Wanneer moet je ingrijpen?",
        tekst: [
          "Zie je groene kussentjes tussen de pannen, een groene of zwarte waas over het dak of vaak mos in je dakgoot? Dan is het tijd voor een reiniging. Hoe vroeger je ingrijpt, hoe kleiner de kans op schade aan de pannen zelf.",
        ],
      },
    ],
    faq: [
      { q: "Kan mos mijn dak laten lekken?", a: "Mos zelf maakt geen gat in je dak, maar het houdt water vast en kan het onder de pannen duwen. Samen met vorstschade aan poreuze pannen kan dat op termijn tot vochtproblemen en lekken leiden." },
    ],
    verwant: ["waarom-je-dak-laten-ontmossen", "wanneer-je-dak-ontmossen", "mos-of-algen"],
    cta: "ontmossen",
  },
  {
    slug: "dak-beschermen-tegen-mos",
    categorie: "mos",
    titel: "Hoe bescherm je je dak tegen mos?",
    seoTitel: "Je dak beschermen tegen mos: zo blijft het langer proper",
    omschrijving: "Zo houd je je dak langer mosvrij: met een antimosbehandeling, regelmatig onderhoud, een coating en een paar eenvoudige maatregelen rond je woning.",
    intro: "Een proper dak blijft niet vanzelf proper. Mossporen waaien elk jaar opnieuw aan. Met de juiste aanpak hou je je dak wel veel langer mosvrij, en hoef je niet telkens een volledige reiniging te laten doen.",
    beeld: "/images/Antimos op dak.jpg",
    beeldAlt: "Antimosbehandeling wordt op een dak aangebracht",
    secties: [
      {
        kop: "1. Een antimosbehandeling na de reiniging",
        tekst: [
          "Na een reiniging is je dak proper, maar ook kwetsbaar: de pannen zijn open en nieuwe sporen hechten er snel op. Een antimosbehandeling zorgt dat nieuw mos geen kans krijgt. Bij MOS-X hoort die behandeling standaard bij elke dakontmossing.",
        ],
      },
      {
        kop: "2. Preventief onderhoud",
        tekst: [
          "Door je dak tijdig opnieuw te behandelen met een antimosmiddel, voorkom je dat er weer een dikke laag mos groeit. Zo is een volledige reiniging niet meer nodig. Met het MOS-X Onderhoudsplan doen we dat voor je, samen met een controle van je hele dak.",
        ],
      },
      {
        kop: "3. Een dakcoating",
        tekst: [
          "Zijn je pannen poreus geworden, dan neemt het oppervlak veel vocht op en hecht mos er sneller op. Een coating sluit de pannen opnieuw af. Daardoor droogt je dak sneller op en krijgt mos minder vat.",
        ],
      },
      {
        kop: "4. Wat je zelf kunt doen",
        tekst: ["Rond je woning kun je ook een en ander doen:"],
        lijst: [
          "Snoei takken die over het dak hangen, zodat er meer zon en wind bij komt.",
          "Houd je dakgoten vrij van bladeren, zodat er geen vochtige hoekjes blijven.",
          "Kijk elk voorjaar even naar je dak: kleine plekjes zijn makkelijk te behandelen.",
        ],
      },
    ],
    verwant: ["om-de-hoeveel-tijd-dak-ontmossen", "dak-coaten", "wat-is-mos-op-je-dak"],
    cta: "dakzorg",
  },

  // ── Per daktype ──────────────────────────────────────────────────────────
  {
    slug: "betonpannen-ontmossen",
    categorie: "daktypes",
    titel: "Betonpannen ontmossen: zo pakken we het aan",
    seoTitel: "Betonpannen ontmossen en reinigen",
    omschrijving: "Betonpannen worden na verloop van tijd poreus en mos hecht er sterk op. Zo ontmossen we een dak met betonpannen, en wanneer een coating zinvol is.",
    intro: "Betonpannen zijn sterk en betaalbaar, en je vindt ze op heel veel Vlaamse daken. Hun nadeel: de beschermlaag slijt na de jaren weg, waardoor het oppervlak poreus wordt en mos er gemakkelijk op groeit.",
    beeld: "/images/Betonpannen.jpg",
    beeldAlt: "Dak met betonpannen",
    secties: [
      {
        kop: "Waarom mos zo graag op betonpannen groeit",
        tekst: [
          "Nieuwe betonpannen hebben een gladde toplaag met kleur. Door zon, regen en vorst verdwijnt die laag langzaam. Het beton eronder is ruw en neemt water op, en dat is precies wat mos nodig heeft. Daarom zie je op oudere betonpannen vaak dikke moskussens en een doffe, vlekkerige kleur.",
        ],
      },
      {
        kop: "Hoe we betonpannen reinigen",
        tekst: [
          "We reinigen betonpannen met een aangepaste druk, zodat we mos en vuil verwijderen zonder het oppervlak verder te beschadigen. Moeilijke plekken en naden pakken we aan met een vuilfrees. Daarna behandelen we het dak met een biologisch afbreekbaar antimosmiddel.",
          "Bij het verwijderen van mos is er altijd een risico dat er kleine stukjes van een verweerde pan meekomen. Daarom controleren we het dak voor en na de reiniging, en vervangen we gebroken pannen meteen waar dat kan.",
        ],
      },
      {
        kop: "Coaten na de reiniging?",
        tekst: [
          "Zijn je betonpannen poreus en verkleurd, dan is een coating vaak de beste keuze. Een coating sluit de pannen opnieuw af, geeft je dak zijn kleur terug en zorgt dat mos minder vat krijgt. Op een dakcoating krijg je bij MOS-X 10 jaar garantie op de hechting.",
        ],
      },
    ],
    faq: [
      { q: "Kunnen betonpannen beschadigd raken bij het ontmossen?", a: "Met de juiste druk en techniek blijft je dak veilig. Bij sterk verweerde pannen kan er wel eens een stukje meekomen. We controleren het dak daarom voor en na de reiniging en vervangen gebroken pannen waar mogelijk." },
    ],
    verwant: ["dak-coaten", "coaten-of-nieuw-dak", "hoe-wordt-een-dak-ontmost"],
    cta: "coaten",
  },
  {
    slug: "keramische-dakpannen-ontmossen",
    categorie: "daktypes",
    titel: "Keramische dakpannen ontmossen",
    seoTitel: "Keramische dakpannen ontmossen en reinigen",
    omschrijving: "Keramische dakpannen gaan lang mee, maar ook daar groeit mos op. Zo reinigen we klei- en keramische pannen veilig, zonder de glazuurlaag te beschadigen.",
    intro: "Keramische pannen, gemaakt van gebakken klei, gaan tientallen jaren mee. Toch groeit er ook op deze pannen mos en algen, vooral op de noordkant en onder bomen. Met de juiste aanpak blijven ze er nog lang mooi uitzien.",
    beeld: "/images/Keramische pannen.jpg",
    beeldAlt: "Dak met keramische dakpannen",
    secties: [
      {
        kop: "Waarom ook keramische pannen vuil worden",
        tekst: [
          "Keramische pannen zijn minder poreus dan betonpannen, maar mos vindt toch houvast in de naden, de overlappingen en op ruwere plekken. Op ongeglazuurde pannen hecht vuil makkelijker. Na een aantal jaren zie je dan een groene of zwarte waas en mos tussen de pannen.",
        ],
      },
      {
        kop: "Zacht reinigen",
        tekst: [
          "Keramische pannen reinigen we met een aangepaste, lage druk. Zo verwijderen we mos en vuil, zonder de glazuurlaag of het oppervlak van de pan aan te tasten. Daarna volgt een antimosbehandeling, zodat het dak langer proper blijft.",
        ],
      },
      {
        kop: "Hoe lang blijft het proper?",
        tekst: [
          "Dat hangt af van de ligging van je woning: veel schaduw en bomen betekenen sneller nieuwe groei. Na een dakontmossing bij MOS-X krijg je 2 jaar mosvrij-garantie, en met het MOS-X Onderhoudsplan houd je je dak daarna preventief proper.",
        ],
      },
    ],
    verwant: ["om-de-hoeveel-tijd-dak-ontmossen", "dak-beschermen-tegen-mos", "hoe-wordt-een-dak-ontmost"],
    cta: "ontmossen",
  },
  {
    slug: "leien-ontmossen",
    categorie: "daktypes",
    titel: "Leien ontmossen: natuurleien veilig reinigen",
    seoTitel: "Leien dak ontmossen en reinigen",
    omschrijving: "Natuurleien zijn mooi en duurzaam, maar ook kwetsbaar. Zo verwijderen we mos en aanslag van een leien dak, zonder de leien te beschadigen.",
    intro: "Een leien dak geeft een woning een stijlvolle uitstraling en gaat heel lang mee. Leien zijn wel dun en kwetsbaar. Bij het ontmossen is voorzichtigheid daarom belangrijker dan kracht.",
    beeld: "/images/Natuurleien.jpg",
    beeldAlt: "Dak met natuurleien",
    secties: [
      {
        kop: "Mos en aanslag op leien",
        tekst: [
          "Op natuurleien zie je vaak een groene of witte aanslag van algen en korstmos, en mos in de naden en op de onderste rand van de leien. Omdat leien dun zijn, kan vocht dat tussen de leien blijft zitten bij vorst schade veroorzaken.",
        ],
      },
      {
        kop: "Voorzichtig en met lage druk",
        tekst: [
          "Leien reinigen we met lage druk en de juiste techniek, zodat ze niet verschuiven of afbreken. Waar nodig werken we vanaf een hoogwerker, zodat we het dak zo weinig mogelijk betreden. Daarna behandelen we het dak met een antimosmiddel.",
        ],
      },
      {
        kop: "Natuurleien of kunstleien?",
        tekst: [
          "Natuurleien zijn van natuursteen, kunstleien van vezelcement. Ze lijken op elkaar, maar vragen een andere aanpak. Oudere kunstleien kunnen bovendien asbest bevatten. Twijfel je wat er op je dak ligt, vraag het ons dan gerust.",
        ],
      },
    ],
    verwant: ["kunstleien-ontmossen", "asbest-op-je-dak-herkennen", "hoe-wordt-een-dak-ontmost"],
    cta: "ontmossen",
  },
  {
    slug: "kunstleien-ontmossen",
    categorie: "daktypes",
    titel: "Kunstleien ontmossen en coaten",
    seoTitel: "Kunstleien ontmossen en coaten",
    omschrijving: "Kunstleien verkleuren en worden poreus, waardoor mos er snel op groeit. Zo reinigen we kunstleien, en waarom je eerst moet nagaan of ze asbest bevatten.",
    intro: "Kunstleien zijn van vezelcement en liggen op heel wat woningen uit de jaren 70 tot nu. Na verloop van tijd verliezen ze hun kleur en worden ze poreus. Met een reiniging en coating zien ze er weer verzorgd uit.",
    beeld: "/images/Kunstleien.png",
    beeldAlt: "Dak met kunstleien",
    secties: [
      {
        kop: "Eerst: bevatten je leien asbest?",
        tekst: [
          "Kunstleien die vóór 1998 werden gelegd, kunnen asbest bevatten. Asbesthoudende daken mogen we niet ontmossen of coaten. Daarom kijken we dit altijd eerst na. Met onze gratis checklist kun je zelf al een eerste inschatting maken.",
        ],
      },
      {
        kop: "Reinigen zonder schade",
        tekst: [
          "Asbestvrije kunstleien reinigen we met een aangepaste, lage druk, zodat het oppervlak niet verder openbreekt. Daarna volgt een antimosbehandeling.",
        ],
      },
      {
        kop: "Een coating geeft ze een tweede leven",
        tekst: [
          "Verkleurde, poreuze kunstleien knappen enorm op met een coating. De coating sluit het oppervlak af en geeft je dak opnieuw een egale kleur. Bij MOS-X krijg je 10 jaar garantie op de hechting.",
        ],
      },
    ],
    verwant: ["asbest-op-je-dak-herkennen", "dak-coaten", "leien-ontmossen"],
    cta: "asbest",
  },
  {
    slug: "metalen-dak-reinigen",
    categorie: "daktypes",
    titel: "Een metalen dak reinigen",
    seoTitel: "Metalen dak of dakpanplaten reinigen",
    omschrijving: "Ook metalen daken en dakpanplaten krijgen algen, vuil en mos. Zo reinigen we een metalen dak zonder de beschermlaag te beschadigen.",
    intro: "Metalen daken en dakpanplaten zie je vaak op bijgebouwen, garages en moderne woningen. Ze zijn licht en duurzaam, maar ook hier zetten zich na een tijd algen, vuil en mos vast, vooral in de groeven en aan de onderkant.",
    beeld: "/images/Metalen daken.jpg",
    beeldAlt: "Metalen dak met dakpanprofiel",
    secties: [
      {
        kop: "Wat er op een metalen dak groeit",
        tekst: [
          "Op metalen platen blijven bladeren en stof liggen in de groeven. Daarin groeien algen en mos. Die houden vocht vast tegen het metaal, wat op termijn de beschermlaag kan aantasten.",
        ],
      },
      {
        kop: "Zo reinigen we het",
        tekst: [
          "Een metalen dak reinigen we met een aangepaste druk en een geschikt reinigingsmiddel, zodat de coating van de platen intact blijft. Ook de goten en de overlappingen van de platen nemen we mee.",
        ],
      },
    ],
    verwant: ["dak-beschermen-tegen-mos", "hoe-wordt-een-dak-ontmost", "wanneer-je-dak-ontmossen"],
    cta: "ontmossen",
  },
  {
    slug: "asbest-op-je-dak-herkennen",
    categorie: "daktypes",
    titel: "Asbest op je dak herkennen",
    seoTitel: "Asbest op je dak herkennen: waar moet je op letten?",
    omschrijving: "Bevat je dak asbest? Zo herken je asbesthoudende leien en golfplaten, en waarom een asbestdak niet ontmost of gecoat mag worden.",
    intro: "Voor we een dak ontmossen of coaten, willen we zeker weten dat er geen asbest in zit. Asbesthoudende daken mogen we niet behandelen. Hier lees je waar je op kunt letten.",
    beeld: "/images/Kunstleien.jfif",
    beeldAlt: "Oudere kunstleien op een dak",
    secties: [
      {
        kop: "Waar zit asbest vaak in?",
        tekst: ["In België werd asbest tot 1998 gebruikt in bouwmaterialen. Op daken vind je het vooral in:"],
        lijst: [
          "kunstleien van vezelcement die voor 1998 werden gelegd;",
          "golfplaten op garages, schuren en bijgebouwen;",
          "sommige onderdelen zoals dakgoten, afvoeren en nokstukken uit die periode.",
        ],
      },
      {
        kop: "Hoe herken je het?",
        tekst: [
          "Het bouwjaar is de belangrijkste aanwijzing: is je dak gelegd voor 1998 en bestaat het uit kunstleien of golfplaten, dan is de kans reëel. Soms staat er een code op de achterkant van de lei. Zekerheid krijg je pas met een staalname door een erkend labo.",
        ],
      },
      {
        kop: "Waarom we een asbestdak niet behandelen",
        tekst: [
          "Bij het reinigen van een asbestdak kunnen vezels vrijkomen, en die zijn schadelijk voor de gezondheid. Daarom mogen we asbesthoudende daken niet ontmossen of coaten. Twijfel je, gebruik dan onze gratis checklist of vraag het ons tijdens het plaatsbezoek.",
        ],
      },
    ],
    verwant: ["kunstleien-ontmossen", "leien-ontmossen", "zelf-ontmossen-of-laten-doen"],
    cta: "asbest",
  },

  // ── Tips en advies ───────────────────────────────────────────────────────
  {
    slug: "waarom-je-dak-laten-ontmossen",
    categorie: "tips",
    titel: "Waarom je dak laten ontmossen?",
    seoTitel: "Waarom je dak laten ontmossen? 6 goede redenen",
    omschrijving: "Een mosvrij dak gaat langer mee, houdt je dakgoten vrij en ziet er verzorgd uit. Dit zijn de belangrijkste redenen om je dak te laten ontmossen.",
    intro: "Je dak laten ontmossen is meer dan een kwestie van uitzicht. Een proper dak beschermt je woning beter en gaat langer mee. Dit zijn de belangrijkste redenen.",
    beeld: "/images/Weer een dak ontmost.jpg",
    beeldAlt: "Een dak na een dakontmossing door MOS-X",
    secties: [
      {
        kop: "De voordelen van een mosvrij dak",
        tekst: [],
        lijst: [
          "Je dak gaat langer mee: zonder mos drogen de pannen sneller op en is er minder vorstschade.",
          "Minder kans op vochtproblemen: water loopt weer netjes naar de goot in plaats van onder de pannen.",
          "Lege, vrije dakgoten: het mos in je goten komt van je dak.",
          "Geen losse mosbolletjes meer op je oprit en terras.",
          "Een frisse uitstraling: een proper dak geeft je hele woning een verzorgde look.",
          "Meer waarde: een verzorgd dak maakt een goede indruk als je ooit verkoopt.",
        ],
      },
      {
        kop: "Goedkoper dan wachten",
        tekst: [
          "Hoe langer je wacht, hoe meer schade mos kan aanrichten aan de pannen zelf. Een tijdige reiniging is veel goedkoper dan het vervangen van verweerde pannen of een volledig nieuw dak.",
        ],
      },
      {
        kop: "Met garantie",
        tekst: [
          "Na een dakontmossing bij MOS-X krijg je 2 jaar mosvrij-garantie: komt er binnen 2 jaar toch mos terug, dan brengen we gratis, op onze kosten, een nieuwe antimosbehandeling aan.",
        ],
      },
    ],
    verwant: ["is-mos-schadelijk-voor-je-dak", "wanneer-je-dak-ontmossen", "hoe-wordt-een-dak-ontmost"],
    cta: "ontmossen",
  },
  {
    slug: "wanneer-je-dak-ontmossen",
    categorie: "tips",
    titel: "Wanneer laat je je dak het best ontmossen?",
    seoTitel: "Wanneer je dak ontmossen? Het beste moment",
    omschrijving: "In welk seizoen laat je je dak het best ontmossen, en aan welke signalen zie je dat het tijd is? Zo kies je het juiste moment.",
    intro: "Je kunt je dak bijna het hele jaar laten ontmossen, maar niet elk moment is even goed. Het weer speelt een grote rol, net als de staat van je dak.",
    beeld: "/images/4.jpg",
    beeldAlt: "Hoogwerker van MOS-X bij een woning",
    secties: [
      {
        kop: "Het beste seizoen",
        tekst: [
          "De lente en de herfst zijn ideaal: het is niet te warm, en er zijn genoeg droge dagen. Na de reiniging heeft de antimosbehandeling een paar droge dagen nodig om goed in te werken. In de zomer kan het ook, zolang het niet te heet is. In de winter werken we niet bij vorst, omdat het water dan op het dak bevriest.",
        ],
      },
      {
        kop: "Signalen dat het tijd is",
        tekst: [],
        lijst: [
          "Je ziet groene kussentjes tussen of op de pannen.",
          "Je dak heeft een groene of zwarte waas gekregen.",
          "Je vindt geregeld mos in je dakgoten of op je oprit.",
          "Je dakgoot loopt over bij hevige regen.",
        ],
      },
      {
        kop: "Plan op tijd",
        tekst: [
          "In de lente en de herfst is de vraag het grootst. Wil je op een bepaald moment geholpen worden, vraag dan tijdig een plaatsbezoek aan.",
        ],
      },
    ],
    verwant: ["om-de-hoeveel-tijd-dak-ontmossen", "waarom-je-dak-laten-ontmossen", "hoe-wordt-een-dak-ontmost"],
    cta: "ontmossen",
  },
  {
    slug: "om-de-hoeveel-tijd-dak-ontmossen",
    categorie: "tips",
    titel: "Om de hoeveel tijd moet je je dak ontmossen?",
    seoTitel: "Om de hoeveel tijd je dak ontmossen?",
    omschrijving: "Hoe vaak je je dak moet laten ontmossen, hangt af van de ligging en het type dak. Zo weet je wanneer het weer tijd is, en hoe je het uitstelt.",
    intro: "Er bestaat geen vaste termijn die voor elk dak geldt. Hoe snel mos terugkomt, hangt sterk af van waar je woning staat en hoe je dak eruitziet.",
    beeld: "/images/7.JPEG",
    beeldAlt: "Dak met pannen omringd door bomen",
    secties: [
      {
        kop: "Waar het van afhangt",
        tekst: [],
        lijst: [
          "Schaduw: een dak onder bomen of op het noorden krijgt sneller weer mos.",
          "Bomen in de buurt: bladeren en sporen komen sneller op je dak terecht.",
          "De staat van je pannen: poreuze pannen nemen meer vocht op.",
          "De behandeling na de reiniging: met een antimosbehandeling blijft je dak veel langer proper.",
        ],
      },
      {
        kop: "Uitstellen met preventief onderhoud",
        tekst: [
          "De slimste aanpak is je dak na de reiniging proper te houden, zodat er nooit meer een dikke laag mos groeit. Met het MOS-X Onderhoudsplan behandelen we je dak preventief met een antimosmiddel en controleren we meteen je hele dak. Zo is een volledige reiniging niet meer nodig.",
        ],
      },
      {
        kop: "En de garantie?",
        tekst: [
          "Na een dakontmossing bij MOS-X krijg je 2 jaar mosvrij-garantie. Komt er binnen die 2 jaar toch mos terug, dan brengen we gratis een nieuwe antimosbehandeling aan.",
        ],
      },
    ],
    verwant: ["dak-beschermen-tegen-mos", "wanneer-je-dak-ontmossen", "dak-coaten"],
    cta: "dakzorg",
  },
  {
    slug: "hoe-wordt-een-dak-ontmost",
    categorie: "tips",
    titel: "Hoe wordt een dak ontmost? Onze werkwijze stap voor stap",
    seoTitel: "Hoe wordt een dak ontmost? De werkwijze stap voor stap",
    omschrijving: "Van controle tot antimosbehandeling: zo verloopt een professionele dakontmossing bij MOS-X, stap voor stap.",
    intro: "Een dak ontmossen is meer dan het mos eraf spuiten. Een goede reiniging begint met een controle en eindigt met een behandeling die het dak langer proper houdt. Zo werken wij.",
    beeld: "/images/Na dakreiniging slider.png",
    beeldAlt: "Dak na een professionele reiniging",
    secties: [
      {
        kop: "1. Controle en voorbereiding",
        tekst: ["We starten met een controle van je dak. Gebroken pannen of leien vervangen we meteen, en we beschermen de omgeving waar nodig."],
      },
      {
        kop: "2. Reinigen met aangepaste druk",
        tekst: [
          "Mos, algen en vuil verwijderen we met een (stoom)hogedrukunit, aangevuld met een vuilfrees die ook de moeilijkste hoekjes bereikt. De druk stemmen we af op je type dak, zodat je dakbedekking veilig blijft.",
        ],
      },
      {
        kop: "3. Controle na de reiniging",
        tekst: ["Na het reinigen kijken we het dak opnieuw na. Op een proper dak worden aandachtspunten zichtbaar die eerst onder het mos verborgen zaten."],
      },
      {
        kop: "4. Antimosbehandeling",
        tekst: ["We behandelen je dak met een preventief, biologisch afbreekbaar antimosmiddel, zodat nieuw mos geen kans krijgt."],
      },
      {
        kop: "5. Alles netjes achterlaten",
        tekst: ["We maken muren, terras en dakgoten schoon. Je hoeft zelf niets op te ruimen."],
      },
    ],
    faq: [
      { q: "Moet ik thuis zijn tijdens de werken?", a: "Meestal niet. Zolang we toegang hebben tot het dak en een wateraansluiting kunnen gebruiken, kunnen de werken zonder jou verlopen." },
      { q: "Hoe lang duurt een dakontmossing?", a: "Voor een gemiddelde woning 1 à 2 werkdagen. Dat hangt af van de grootte, de bereikbaarheid en de hoeveelheid mos." },
    ],
    verwant: ["waarom-je-dak-laten-ontmossen", "welke-ontmossingsproducten", "zelf-ontmossen-of-laten-doen"],
    cta: "ontmossen",
  },
  {
    slug: "welke-ontmossingsproducten",
    categorie: "tips",
    titel: "Welke producten gebruik je om een dak te ontmossen?",
    seoTitel: "Ontmossingsproducten voor je dak: wat werkt echt?",
    omschrijving: "Antimosmiddel, bleekwater of een hogedrukreiniger? Wat werkt echt tegen mos op je dak, en waarom sommige producten meer kwaad dan goed doen.",
    intro: "In de winkel vind je allerlei middelen tegen mos. Niet alles is even goed voor je dak, je tuin of het milieu. Dit zijn de verschillen.",
    beeld: "/images/Antimos op dak.jpg",
    beeldAlt: "Antimosmiddel wordt op een dak gespoten",
    secties: [
      {
        kop: "Antimosmiddel: na de reiniging",
        tekst: [
          "Een antimosmiddel doodt mossporen en algen en zorgt dat ze niet terugkomen. Het werkt het best op een proper dak, want op een dikke laag mos raakt het middel de pannen niet. Daarom brengen wij het altijd aan na de reiniging.",
        ],
      },
      {
        kop: "Liever geen bleekwater of agressieve middelen",
        tekst: [
          "Bleekwater en sterke chloorproducten lijken snel te werken, maar ze kunnen je pannen verkleuren, je dakgoten aantasten en schade toebrengen aan je planten en tuin. Wij werken met een biologisch afbreekbaar antimosmiddel.",
        ],
      },
      {
        kop: "Een hogedrukreiniger alleen is niet genoeg",
        tekst: [
          "Met een gewone hogedrukreiniger verwijder je wel mos, maar met te veel druk beschadig je makkelijk het oppervlak van de pannen. Daardoor groeit mos er later net sneller op. Een professionele reiniging gebeurt met aangepaste druk en wordt afgewerkt met een antimosbehandeling.",
        ],
      },
    ],
    verwant: ["zelf-ontmossen-of-laten-doen", "hoe-wordt-een-dak-ontmost", "dak-beschermen-tegen-mos"],
    cta: "ontmossen",
  },
  {
    slug: "zelf-ontmossen-of-laten-doen",
    categorie: "tips",
    titel: "Je dak zelf ontmossen of laten doen?",
    seoTitel: "Dak zelf ontmossen of laten doen? Voor- en nadelen",
    omschrijving: "Zelf je dak ontmossen lijkt goedkoper, maar het brengt risico's mee. Dit zijn de voor- en nadelen van zelf doen tegenover een vakman.",
    intro: "Met een ladder en een hogedrukreiniger je dak zelf ontmossen: het lijkt een goedkope oplossing. Toch zijn er een paar goede redenen om het aan een vakman over te laten.",
    beeld: "/images/Voor dakreiniging slider (2).png",
    beeldAlt: "Mos op een dak dat gereinigd moet worden",
    secties: [
      {
        kop: "De risico's van zelf doen",
        tekst: [],
        lijst: [
          "Veiligheid: werken op een nat, glad dak zonder valbeveiliging is gevaarlijk.",
          "Schade aan je dak: met te veel druk beschadig je de pannen, waardoor mos later net sneller terugkomt.",
          "Water onder de pannen: verkeerd spuiten duwt water onder de dakbedekking.",
          "Geen nabehandeling: zonder antimosmiddel staat het mos er snel weer.",
          "Asbest: bij oudere daken weet je niet altijd wat je reinigt.",
        ],
      },
      {
        kop: "Wat een vakman anders doet",
        tekst: [
          "Een professionele reiniging gebeurt met aangepaste druk per daktype, met de juiste veiligheidsmaatregelen en een antimosbehandeling erna. Bovendien wordt je dak gecontroleerd, zodat problemen vroeg ontdekt worden.",
        ],
      },
      {
        kop: "Garantie op het resultaat",
        tekst: [
          "Bij MOS-X krijg je na een dakontmossing 2 jaar mosvrij-garantie. Komt er binnen 2 jaar toch mos terug, dan brengen we gratis, op onze kosten, een nieuwe antimosbehandeling aan. Die zekerheid heb je niet als je het zelf doet.",
        ],
      },
    ],
    verwant: ["welke-ontmossingsproducten", "hoe-wordt-een-dak-ontmost", "asbest-op-je-dak-herkennen"],
    cta: "ontmossen",
  },
  {
    slug: "dak-coaten",
    categorie: "tips",
    titel: "Je dak laten coaten: wat moet je weten?",
    seoTitel: "Dak laten coaten: werkwijze, kleuren en garantie",
    omschrijving: "Wat is een dakcoating, voor welke daken is het geschikt en hoe verloopt het? Alles over je dak laten coaten, met 10 jaar garantie op de hechting.",
    intro: "Na jaren regen, zon en vorst verliezen dakpannen hun beschermlaag en hun kleur. Een coating geeft je dak opnieuw een beschermlaag, zonder dat je het moet vervangen.",
    beeld: "/images/Na bevel.jpg",
    beeldAlt: "Woning met een gecoat dak in antraciet",
    secties: [
      {
        kop: "Wat is een dakcoating?",
        tekst: [
          "Een dakcoating is een beschermende laag die op je pannen wordt gespoten, net zoals de originele toplaag uit de fabriek. Ze sluit poreuze pannen af, zodat ze minder vocht opnemen, en geeft je dak opnieuw een egale kleur.",
        ],
      },
      {
        kop: "Voor welke daken?",
        tekst: [
          "Een coating is geschikt voor betonpannen en kunstleien die poreus of verkleurd zijn. Asbesthoudende daken coaten we niet. Voor keramische pannen en natuurleien volstaat meestal een reiniging met een antimosbehandeling.",
        ],
      },
      {
        kop: "Hoe het verloopt",
        tekst: [],
        lijst: [
          "Grondige reiniging: een coating hecht enkel op een proper dak.",
          "Afplakken: ramen, zonnepanelen en schouwen schermen we af.",
          "Eerste laag: watergedragen coating met een antimosprimer.",
          "Tweede laag: in de gekozen kleur, na het uitharden van de eerste.",
          "Controle en afwerking: alles netjes achtergelaten.",
        ],
      },
      {
        kop: "Kleuren en garantie",
        tekst: [
          "Je kiest uit zeven kleuren: zwart, antraciet, bruin, aubergine, rood, terra en fondant. Met onze dakkleur-tool zie je op een foto van je eigen woning hoe je dak eruitziet. Op de coating krijg je 10 jaar garantie op de hechting.",
        ],
      },
    ],
    faq: [
      { q: "Hoe lang duurt een dakcoating?", a: "Voor een gemiddelde woning zijn we meestal in 1 dag klaar, afhankelijk van de grootte van het dak en het weer." },
    ],
    verwant: ["coaten-of-nieuw-dak", "betonpannen-ontmossen", "kunstleien-ontmossen"],
    cta: "coaten",
  },
  {
    slug: "coaten-of-nieuw-dak",
    categorie: "tips",
    titel: "Dak coaten of een nieuw dak laten leggen?",
    seoTitel: "Dak coaten of vervangen? Zo maak je de juiste keuze",
    omschrijving: "Is je dak verouderd, dan hoef je het niet altijd te vervangen. Wanneer een coating volstaat en wanneer een nieuw dak toch beter is.",
    intro: "Ziet je dak er versleten uit, dan denk je misschien meteen aan een nieuw dak. Dat is een grote investering. Vaak is dat niet nodig, en geeft een coating je dak een tweede leven.",
    beeld: "/images/IMG_4584 Vooraanzicht dakcoating.JPEG",
    beeldAlt: "Woning met een vernieuwd, gecoat dak",
    secties: [
      {
        kop: "Wanneer een coating volstaat",
        tekst: [],
        lijst: [
          "Je pannen zijn poreus, verkleurd of dof, maar nog heel.",
          "De dakconstructie, het onderdak en de isolatie zijn in orde.",
          "Er zijn geen grote lekken.",
        ],
      },
      {
        kop: "Wanneer een nieuw dak beter is",
        tekst: [],
        lijst: [
          "Veel pannen zijn gebarsten of brokkelen af.",
          "Het dak lekt op meerdere plaatsen of de dakconstructie is aangetast.",
          "Je wilt je dak ook isoleren of de structuur aanpassen.",
          "Het dak bevat asbest.",
        ],
      },
      {
        kop: "Het verschil",
        tekst: [
          "Een nieuw dak betekent afbraak, containers, weken planning en een veel hogere kost. Een coating is meestal in 1 dag klaar, je bestaande dak blijft en het kost een fractie van de prijs. Tijdens een gratis plaatsbezoek bekijken we eerlijk welke oplossing bij jouw dak past.",
        ],
      },
    ],
    verwant: ["dak-coaten", "betonpannen-ontmossen", "is-mos-schadelijk-voor-je-dak"],
    cta: "coaten",
  },
];

export const artikelVoor = (slug: string) => ARTIKELS.find((a) => a.slug === slug);
