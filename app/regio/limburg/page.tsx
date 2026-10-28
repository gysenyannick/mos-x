import type { Metadata } from "next";
import PageLayout from "@/components/page-layout";
import RegioPage  from "@/components/regio-page";

export const metadata: Metadata = {
  title: "Dakontmossing en dakcoating in Limburg",
  alternates: { canonical: "/regio/limburg" },
  description: "MOS-X verzorgt professionele dakontmossing en dakcoating in heel Limburg. Actief in Hasselt, Genk, Sint-Truiden en 27 andere gemeenten. Duidelijke prijs vooraf en schriftelijke garantie.",
};

const municipalities = [
  { name: "Hasselt",              zip: "3500" },
  { name: "Genk",                 zip: "3600" },
  { name: "Sint-Truiden",         zip: "3800" },
  { name: "Tongeren",             zip: "3700" },
  { name: "Maaseik",              zip: "3680" },
  { name: "Lommel",               zip: "3920" },
  { name: "Beringen",             zip: "3580" },
  { name: "Heusden-Zolder",       zip: "3550" },
  { name: "Herk-de-Stad",         zip: "3540" },
  { name: "Diest",                zip: "3290" },
  { name: "Halen",                zip: "3545" },
  { name: "Nieuwerkerken",        zip: "3850" },
  { name: "Gingelom",             zip: "3890" },
  { name: "Borgloon",             zip: "3840" },
  { name: "Riemst",               zip: "3770" },
  { name: "Bilzen",               zip: "3740" },
  { name: "Lanaken",              zip: "3620" },
  { name: "Maasmechelen",         zip: "3630" },
  { name: "Dilsen-Stokkem",       zip: "3650" },
  { name: "Kinrooi",              zip: "3640" },
  { name: "Bocholt",              zip: "3950" },
  { name: "Neerpelt",             zip: "3910" },
  { name: "Overpelt",             zip: "3900" },
  { name: "Peer",                 zip: "3990" },
  { name: "Houthalen-Helchteren", zip: "3530" },
  { name: "Zonhoven",             zip: "3520" },
  { name: "Diepenbeek",           zip: "3590" },
  { name: "Alken",                zip: "3570" },
  { name: "Wellen",               zip: "3830" },
  { name: "Kortessem",            zip: "3720" },
];

const heroSubtitle =
  "Professionele dakontmossing en dakcoating in heel Limburg. Eerlijk advies, vaste prijzen en garantie op de uitgevoerde werken.";

const intro = [
  "Limburg is de groenste provincie van Vlaanderen. In Haspengouw zorgen uitgestrekte boomgaarden voor organische aanslag in het najaar. Bloemenpollen, bladeren en sporen van fruitbomen belanden massaal op dakpannen en vormen de ideale voedingsbodem voor mos.",
  "Langs de Maasvallei, in gemeenten als Maasmechelen, Dilsen-Stokkem en Kinrooi, trekt ochtendmist regelmatig over de naburige woonwijken en houdt dakpannen lang vochtig. In de bosrijke Kempen, rond Peer, Pelt en Bocholt, blijven daken door schaduw van dichte bossen langdurig vochtig. Beide omgevingen creëren ideale omstandigheden voor mos- en algengroei.",
  "Eerlijk advies, een vaste prijs vooraf en garantie op de uitgevoerde werken. Soms volstaat een professionele reiniging, soms is een dakcoating de beste oplossing. Je ontvangt altijd een duidelijke offerte vooraf.",
];

const climateParas = [
  "Limburg heeft een continentaler klimaat dan de kustprovincies, met warmere zomers maar ook hardere vorstperiodes in de winter. Die vorstcycli zijn bijzonder schadelijk voor daken die al besmet zijn met mos of korstmos. Vocht dat door de worteltjes van korstmos in de poriën van dakpannen is doorgedrongen, zet uit bij vriesweer en veroorzaakt kleine maar aanhoudende scheurtjes. Na enkele winters zijn dakpannen poreuzer dan ooit.",
  "De bosrijke omgeving in de Kempen en rond de Maasvallei zorgt voor een permanente aanvoer van organisch materiaal op daken: bladeren, naaldval, berkenpollen en mosdeeltjes. Dat organisch dek houdt pannen nat en geeft mos een ideale kiembodem. In Haspengouw produceren fruitteeltgebieden extra sporen en stuifmeel, ook voor daken een belasting die niet onderschat mag worden.",
  "Wie dakonderhoud uitstelt in Limburg, riskeert verstopte goten, vochtproblemen en een dak dat vroeger aan vervanging toe is. Regelmatige dakreiniging en een beschermende dakcoating helpen de levensduur van je dak aanzienlijk te verlengen.",
];

const services = [
  { title: "Dakreiniging",  desc: "professionele verwijdering van mos, algen en vervuiling", href: "/diensten/dakontmossing" },
  { title: "Dakcoating",    desc: "beschermende coating met 10 jaar garantie op de hechting", href: "/diensten/dakcoating" },
  { title: "Onderhoudsplan", desc: "preventief onderhoud na een reiniging", href: "/diensten/onderhoudsplan" },
];

export default function LimburgPage() {
  return (
    <PageLayout>
      <RegioPage
        province="Limburg"
        municipalities={municipalities}
        intro={intro}
        climateParas={climateParas}
        heroSubtitle={heroSubtitle}
        heroLight
        useServiceCards
        ctaContact
        trustindexSrc="https://cdn.trustindex.io/loader.js?0646a7275bcf131a35763e363e2"
        mainTitle="Professionele dakreiniging en dakcoating in Limburg"
        municipalityTitle="Actief in heel de provincie Limburg"
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
