/**
 * Eén bron voor alles wat Google en AI-zoekmachines over MOS-X moeten weten:
 * bedrijfsgegevens, de gestructureerde data (schema.org) en het werkgebied.
 */

export const SITE = "https://www.mos-x.be";

export const BEDRIJF = {
  naam: "MOS-X",
  ondernemingsnummer: "BE0805.594.502",
  zaakvoerder: "Yannick Gysen",
  telefoon: "+32 468 35 28 69",
  telefoonLink: "+32468352869",
  email: "info@mos-x.be",
  /** De eerste vestiging is de hoofdzetel. */
  vestigingen: [
    { straat: "Bovenpad 100", postcode: "2280", gemeente: "Grobbendonk" },
    { straat: "Pastorijstraat 47", postcode: "2590", gemeente: "Berlaar" },
  ],
  provincies: ["Antwerpen", "Oost-Vlaanderen", "Vlaams-Brabant", "Limburg"],
  socials: [
    "https://www.facebook.com/profile.php?id=61551512872835",
    "https://www.instagram.com/mosx.be/",
  ],
  logo: `${SITE}/images/Logo%20Mos-x%20png.png`,
  omschrijving:
    "MOS-X is specialist in dakontmossing en dakcoating in Vlaanderen. We reinigen daken, behandelen ze tegen mos en geven ze met een coating een nieuwe beschermlaag, met 2 jaar mosvrij-garantie na een ontmossing en 10 jaar garantie op de hechting van de coating.",
} as const;

const adres = (v: (typeof BEDRIJF.vestigingen)[number]) => ({
  "@type": "PostalAddress",
  streetAddress: v.straat,
  postalCode: v.postcode,
  addressLocality: v.gemeente,
  addressRegion: "Antwerpen",
  addressCountry: "BE",
});

/** Het bedrijf zelf, op elke pagina. */
export const bedrijfSchema = {
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  "@id": `${SITE}/#bedrijf`,
  name: BEDRIJF.naam,
  legalName: BEDRIJF.naam,
  vatID: BEDRIJF.ondernemingsnummer,
  url: SITE,
  logo: BEDRIJF.logo,
  image: `${SITE}/images/16.JPEG`,
  description: BEDRIJF.omschrijving,
  telephone: BEDRIJF.telefoon,
  email: BEDRIJF.email,
  founder: { "@type": "Person", name: BEDRIJF.zaakvoerder },
  address: adres(BEDRIJF.vestigingen[0]),
  location: BEDRIJF.vestigingen.map((v) => ({ "@type": "Place", address: adres(v) })),
  areaServed: BEDRIJF.provincies.map((p) => ({ "@type": "AdministrativeArea", name: `Provincie ${p}` })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  priceRange: "€€",
  sameAs: BEDRIJF.socials,
  knowsAbout: ["dakontmossing", "dakreiniging", "dakcoating", "antimosbehandeling", "dakonderhoud", "dakgoten reinigen"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Diensten",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@id": `${SITE}/diensten/dakontmossing#dienst` } },
      { "@type": "Offer", itemOffered: { "@id": `${SITE}/diensten/dakcoating#dienst` } },
      { "@type": "Offer", itemOffered: { "@id": `${SITE}/diensten/onderhoudsplan#dienst` } },
    ],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  url: SITE,
  name: BEDRIJF.naam,
  inLanguage: "nl-BE",
  publisher: { "@id": `${SITE}/#bedrijf` },
};

/** Een dienst, met het bedrijf als aanbieder. */
export function dienstSchema(o: { pad: string; naam: string; type: string; omschrijving: string; prijsVanaf?: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}${o.pad}#dienst`,
    name: o.naam,
    serviceType: o.type,
    description: o.omschrijving,
    url: `${SITE}${o.pad}`,
    provider: { "@id": `${SITE}/#bedrijf` },
    areaServed: BEDRIJF.provincies.map((p) => ({ "@type": "AdministrativeArea", name: `Provincie ${p}` })),
    ...(o.prijsVanaf
      ? { offers: { "@type": "Offer", priceCurrency: "EUR", price: o.prijsVanaf, priceSpecification: { "@type": "PriceSpecification", minPrice: o.prijsVanaf, priceCurrency: "EUR" } } }
      : {}),
  };
}

/** Kruimelpad, zodat Google de structuur van de site toont. */
export function kruimelSchema(stappen: [naam: string, pad: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"], ...stappen].map(([naam, pad], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: naam,
      item: `${SITE}${pad}`,
    })),
  };
}

export function faqSchema(vragen: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: vragen.map((v) => ({ "@type": "Question", name: v.q, acceptedAnswer: { "@type": "Answer", text: v.a } })),
  };
}
