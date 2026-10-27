import type { Metadata } from "next";
import PageLayout from "@/components/page-layout";
import RegioPage  from "@/components/regio-page";

export const metadata: Metadata = {
  title: "Dakontmossing en dakcoating in Vlaams-Brabant",
  alternates: { canonical: "/regio/vlaams-brabant" },
  description: "MOS-X verzorgt professionele dakontmossing en dakcoating in heel Vlaams-Brabant. Actief in Leuven, Vilvoorde, Halle en 27 andere gemeenten. Duidelijke prijs vooraf en schriftelijke garantie.",
};

const municipalities = [
  { name: "Leuven",              zip: "3000" },
  { name: "Vilvoorde",           zip: "1800" },
  { name: "Halle",               zip: "1500" },
  { name: "Asse",                zip: "1730" },
  { name: "Zaventem",            zip: "1930" },
  { name: "Grimbergen",          zip: "1850" },
  { name: "Meise",               zip: "1861" },
  { name: "Kampenhout",          zip: "1910" },
  { name: "Kortenberg",          zip: "3070" },
  { name: "Tervuren",            zip: "3080" },
  { name: "Overijse",            zip: "3090" },
  { name: "Hoeilaart",           zip: "1560" },
  { name: "Huldenberg",          zip: "3040" },
  { name: "Bierbeek",            zip: "3360" },
  { name: "Tienen",              zip: "3300" },
  { name: "Diest",               zip: "3290" },
  { name: "Aarschot",            zip: "3200" },
  { name: "Rotselaar",           zip: "3110" },
  { name: "Zemst",               zip: "1980" },
  { name: "Steenokkerzeel",      zip: "1820" },
  { name: "Wezembeek-Oppem",     zip: "1970" },
  { name: "Kraainem",            zip: "1950" },
  { name: "Wemmel",              zip: "1780" },
  { name: "Lennik",              zip: "1750" },
  { name: "Pepingen",            zip: "1670" },
  { name: "Sint-Genesius-Rode",  zip: "1640" },
  { name: "Sint-Pieters-Leeuw", zip: "1600" },
  { name: "Linkebeek",           zip: "1630" },
  { name: "Dilbeek",             zip: "1700" },
  { name: "Londerzeel",          zip: "1840" },
];

const heroSubtitle =
  "Professionele dakontmossing en dakcoating in heel Vlaams-Brabant. Eerlijk advies, vaste prijzen en garantie op de uitgevoerde werken.";

const intro = [
  "Vlaams-Brabant combineert de dichtbebouwde Brusselse rand met groene woonkernen langs de Dijle en de Demer. In de randstedelijke zone zorgen hoge bomen langs rijkswegen en in tuinen voor langdurige beschaduwing van daken. Langs de Dijle en de Demer blijft vochtige ochtendlucht regelmatig langer hangen, waardoor mos en algen ideale groeiomstandigheden vinden.",
  "Vooral in woonwijken die grenzen aan het Zoniënwoud, zoals Overijse, Hoeilaart en Sint-Genesius-Rode, blijven daken langer vochtig door de schaduw van hoge bomen. Daardoor krijgen mos, algen en korstmos meer kans om zich te ontwikkelen op het dak.",
  "Eerlijk advies, een vaste prijs vooraf en garantie op de uitgevoerde werken. Soms volstaat een professionele reiniging, soms is een dakcoating de beste oplossing. Je ontvangt altijd een duidelijke offerte vooraf.",
];

const climateParas = [
  "Vlaams-Brabant heeft een gematigd zeeklimaat met een bijzonder kenmerk: de nabijheid van Brussel en het uitgestrekte groen van het Zoniënwoud, de Dijlevallei en de Demervallei. Die combinatie zorgt voor een iets hogere luchtvochtigheid dan gemiddeld en creëert ideale omstandigheden voor mos- en algengroei op daken.",
  "In woonwijken die grenzen aan het Zoniënwoud blijven daken langer vochtig door schaduw van hoge bomen. Ook langs de Dijle en de Demer blijft vochtige lucht regelmatig langer hangen. Hierdoor krijgen mos, algen en korstmossen meer kans om zich vast te zetten.",
  "Wie dakonderhoud uitstelt, riskeert verstopte goten, vochtproblemen en op termijn een dak dat vroeger aan vervanging toe is. Regelmatige dakreiniging, eventueel gevolgd door een beschermende dakcoating, helpt de levensduur van de dakbedekking aanzienlijk te verlengen.",
];

const services = [
  { title: "Dakreiniging",  desc: "professionele verwijdering van mos, algen en vervuiling", href: "/diensten/dakontmossing" },
  { title: "Dakcoating",    desc: "beschermende coating met 10 jaar garantie op de hechting", href: "/diensten/dakcoating" },
  { title: "MOS-X Dakzorg", desc: "preventief onderhoud na een reiniging", href: "/diensten/mos-x-dakzorg" },
];

export default function VlaamsBrabantPage() {
  return (
    <PageLayout>
      <RegioPage
        province="Vlaams-Brabant"
        municipalities={municipalities}
        intro={intro}
        climateParas={climateParas}
        heroSubtitle={heroSubtitle}
        heroLight
        useServiceCards
        ctaContact
        trustindexSrc="https://cdn.trustindex.io/loader.js?0646a7275bcf131a35763e363e2"
        mainTitle="Professionele dakreiniging en dakcoating in Vlaams-Brabant"
        municipalityTitle="Actief in heel de provincie Vlaams-Brabant"
        municipalitySubtitle="Ontdek of jouw gemeente in ons werkgebied ligt."
        services={services}
        ctaHeadline={<>Benieuwd wat <span style={{ color: "#9BCB6C" }}>jouw dak</span> nodig heeft?</>}
        ctaSubline="Bereken vrijblijvend je richtprijs. Zo krijg je snel een eerste indicatie van de kostprijs voor jouw dak."
        ctaButton="Bereken je richtprijs"
        sidebarTitle="Bereken je richtprijs"
        sidebarSubtitle="Ontvang een persoonlijke richtprijs op maat van jouw dak."
        sidebarButton="Bereken je richtprijs"
      />
    </PageLayout>
  );
}
