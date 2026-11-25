import type { Metadata } from "next";
import PageLayout from "@/components/page-layout";
import RegioPage from "@/components/regio-page";

export const metadata: Metadata = {
  title: "Dakontmossing en dakcoating in Antwerpen",
  alternates: { canonical: "/regio/antwerpen" },
  description: "MOS-X verzorgt professionele dakontmossing en dakcoating in heel de provincie Antwerpen. Actief in Antwerpen, Mechelen, Lier en 27 andere gemeenten. Duidelijke prijs vooraf en schriftelijke garantie.",
};

const municipalities = [
  { name: "Antwerpen",            zip: "2000" },
  { name: "Mechelen",             zip: "2800" },
  { name: "Lier",                 zip: "2500" },
  { name: "Herentals",            zip: "2200" },
  { name: "Turnhout",             zip: "2300" },
  { name: "Grobbendonk",          zip: "2280" },
  { name: "Mol",                  zip: "2400" },
  { name: "Geel",                 zip: "2440" },
  { name: "Olen",                 zip: "2250" },
  { name: "Heist-op-den-Berg",    zip: "2220" },
  { name: "Duffel",               zip: "2570" },
  { name: "Boom",                 zip: "2850" },
  { name: "Rumst",                zip: "2840" },
  { name: "Zandhoven",            zip: "2240" },
  { name: "Nijlen",               zip: "2560" },
  { name: "Berlaar",              zip: "2590" },
  { name: "Putte",                zip: "2580" },
  { name: "Sint-Katelijne-Waver", zip: "2860" },
  { name: "Bornem",               zip: "2880" },
  { name: "Puurs",                zip: "2870" },
  { name: "Brecht",               zip: "2960" },
  { name: "Schilde",              zip: "2970" },
  { name: "Wuustwezel",           zip: "2990" },
  { name: "Essen",                zip: "2910" },
  { name: "Kalmthout",            zip: "2920" },
  { name: "Brasschaat",           zip: "2930" },
  { name: "Schoten",              zip: "2900" },
  { name: "Wommelgem",            zip: "2160" },
  { name: "Ranst",                zip: "2520" },
  { name: "Boechout",             zip: "2530" },
];

const heroSubtitle =
  "Professionele dakontmossing en dakcoating in heel Antwerpen. Eerlijk advies, vaste prijzen en garantie op de uitgevoerde werken.";

const intro = [
  "Antwerpen kent heel uiteenlopende omstandigheden voor daken. In de havenregio zorgen fijnstof, uitlaatgassen en industriële neerslag voor extra vervuiling. In de Kempen zorgen bossen, schaduw en vochtige lucht ervoor dat mos sneller groeit.",
  "Of je nu in Antwerpen-stad woont, in de Kempen of langs de Schelde, MOS-X voert dakreiniging en dakcoating uit in heel de provincie. De aanpak wordt telkens afgestemd op het type dak, de ligging en de staat van de dakbedekking.",
  "Eerlijk advies, een vaste prijs vooraf en schriftelijke garantie op de uitgevoerde werken. Soms volstaat een professionele reiniging, soms is een dakcoating de beste oplossing. Je ontvangt altijd een duidelijke offerte vooraf.",
];

const climateParas = [
  "In de provincie Antwerpen zorgt de combinatie van maritieme invloeden vanuit de Schelde, industriële neerslag in de havenregio en de vochtige bosrijke gemeenten in de Kempen voor ideale omstandigheden voor mosgroei.",
  "Dakpannen blijven hier langer vochtig dan in drogere regio's. In de Kempen, van Schilde tot Wuustwezel en Essen, liggen daken vrijwel permanent in de schaduw van hoge bomen. Die schaduw vertraagt de droogtijd na regen en versnelt mosgroei.",
  "In havengebieden als Boom en Rumst tast luchtvervuiling de beschermlaag van dakpannen extra snel aan. Wie dakonderhoud uitstelt, riskeert verstopte goten, vochtproblemen en op termijn een dak dat vroeger aan vervanging toe is.",
];

const services = [
  { title: "Dakreiniging",    desc: "professionele verwijdering van mos, algen en vervuiling", href: "/diensten/dakontmossing" },
  { title: "Dakcoating",      desc: "beschermende coating met 10 jaar garantie op de hechting", href: "/diensten/dakcoating" },
  { title: "Onderhoudsplan",   desc: "preventief onderhoud na een reiniging", href: "/diensten/onderhoudsplan" },
];

export default function AntwerpenPage() {
  return (
    <PageLayout>
      <RegioPage
        province="Antwerpen"
        municipalities={municipalities}
        intro={intro}
        climateParas={climateParas}
        heroSubtitle={heroSubtitle}
        heroLight
        useServiceCards
        ctaContact
        trustindexSrc="https://cdn.trustindex.io/loader.js?0646a7275bcf131a35763e363e2"
        mainTitle="Professionele dakreiniging en dakcoating in Antwerpen"
        municipalityTitle="Actief in heel de provincie Antwerpen"
        municipalitySubtitle="Ontdek of jouw gemeente in ons werkgebied ligt."
        services={services}
        ctaHeadline={<>Benieuwd wat <span style={{ color: "#9BCB6C" }}>jouw dak</span> nodig heeft?</>}
        ctaSubline="Bereken vrijblijvend je richtprijs. Zo weet je meteen waar je ongeveer rekening mee kunt houden."
        ctaButton="Bereken je richtprijs"
        sidebarTitle="Bereken je richtprijs"
        sidebarSubtitle="Ontvang een persoonlijke richtprijs op maat van jouw dak."
        sidebarButton="Bereken je richtprijs"
      />
    </PageLayout>
  );
}
