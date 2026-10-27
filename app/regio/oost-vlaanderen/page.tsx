import type { Metadata } from "next";
import PageLayout from "@/components/page-layout";
import RegioPage  from "@/components/regio-page";

export const metadata: Metadata = {
  title: "Dakontmossing en dakcoating in Oost-Vlaanderen",
  alternates: { canonical: "/regio/oost-vlaanderen" },
  description: "MOS-X verzorgt professionele dakontmossing en dakcoating in heel Oost-Vlaanderen. Actief in Gent, Aalst, Sint-Niklaas en 27 andere gemeenten. Duidelijke prijs vooraf en schriftelijke garantie.",
};

const municipalities = [
  { name: "Gent",               zip: "9000" },
  { name: "Aalst",              zip: "9300" },
  { name: "Sint-Niklaas",       zip: "9100" },
  { name: "Dendermonde",        zip: "9200" },
  { name: "Lokeren",            zip: "9160" },
  { name: "Ronse",              zip: "9600" },
  { name: "Oudenaarde",         zip: "9700" },
  { name: "Geraardsbergen",     zip: "9500" },
  { name: "Zottegem",          zip: "9620" },
  { name: "Ninove",             zip: "9400" },
  { name: "Wetteren",           zip: "9230" },
  { name: "Wichelen",          zip: "9240" },
  { name: "Berlare",            zip: "9290" },
  { name: "Hamme",              zip: "9220" },
  { name: "Temse",              zip: "9140" },
  { name: "Beveren",            zip: "9120" },
  { name: "Maldegem",          zip: "9990" },
  { name: "Eeklo",             zip: "9900" },
  { name: "Kaprijke",          zip: "9970" },
  { name: "Sint-Laureins",      zip: "9980" },
  { name: "Assenede",          zip: "9960" },
  { name: "Zelzate",            zip: "9060" },
  { name: "Evergem",           zip: "9940" },
  { name: "Destelbergen",       zip: "9070" },
  { name: "Merelbeke",         zip: "9820" },
  { name: "De Pinte",          zip: "9840" },
  { name: "Sint-Martens-Latem", zip: "9830" },
  { name: "Nazareth",          zip: "9810" },
  { name: "Kruishoutem",       zip: "9770" },
  { name: "Deinze",            zip: "9800" },
];

const heroSubtitle =
  "Professionele dakontmossing en dakcoating in heel Oost-Vlaanderen. Eerlijk advies, vaste prijzen en garantie op de uitgevoerde werken.";

const intro = [
  "Oost-Vlaanderen is een provincie met een uitgesproken vochtig karakter. De Schelde, Leie, Durme en Dender doorkruisen de provincie en zorgen het hele jaar door voor een hoge luchtvochtigheid. Die hoge luchtvochtigheid creëert ideale omstandigheden voor mosgroei op daken.",
  "In de polders ten noorden van Gent, rond Evergem, Assenede en Sint-Laureins, blijven dakpannen na een regenbui langer vochtig door de lage ligging en de beperkte luchtcirculatie. In de Vlaamse Ardennen, rond Ronse, Zottegem en Geraardsbergen, zorgen hellingen en aangrenzende bossen voor daken die langdurig vochtig blijven.",
  "Eerlijk advies, een vaste prijs vooraf en garantie op de uitgevoerde werken. Soms volstaat een professionele reiniging, soms is een dakcoating de beste oplossing. Je ontvangt altijd een duidelijke offerte vooraf.",
];

const climateParas = [
  "Oost-Vlaanderen ligt in de invloedssfeer van het zeeklimaat, met milde winters, natte herfsten en een relatief hoge neerslag verspreid over het jaar. De combinatie van het zeeklimaat, de vele rivieren en de poldergebieden maakt de provincie bijzonder gevoelig voor mosgroei.",
  "De Schelde en haar zijrivieren zorgen voor een hoge bodemvochtigheid die ook tijdens drogere periodes merkbaar blijft. In de polderzone ten noorden van Gent, rond Maldegem, Eeklo en Assenede, creëren laaghangende nevel en een vlak landschap ideale omstandigheden voor mos- en algengroei.",
  "In stedelijke kernen als Gent en Aalst speelt luchtvervuiling een bijkomende rol. De combinatie van vervuiling en algengroei laat daken er sneller verouderd uitzien. Wie dakonderhoud uitstelt, riskeert verstopte goten, vochtproblemen en op termijn een dak dat vroeger aan vervanging toe is.",
];

const services = [
  { title: "Dakreiniging",  desc: "professionele verwijdering van mos, algen en vervuiling", href: "/diensten/dakontmossing" },
  { title: "Dakcoating",    desc: "beschermende coating met 10 jaar garantie op de hechting", href: "/diensten/dakcoating" },
  { title: "MOS-X Dakzorg", desc: "preventief onderhoud na een reiniging", href: "/diensten/mos-x-dakzorg" },
];

export default function OostVlaanderenPage() {
  return (
    <PageLayout>
      <RegioPage
        province="Oost-Vlaanderen"
        municipalities={municipalities}
        intro={intro}
        climateParas={climateParas}
        heroSubtitle={heroSubtitle}
        heroLight
        useServiceCards
        ctaContact
        trustindexSrc="https://cdn.trustindex.io/loader.js?0646a7275bcf131a35763e363e2"
        mainTitle="Professionele dakreiniging en dakcoating in Oost-Vlaanderen"
        municipalityTitle="Actief in heel de provincie Oost-Vlaanderen"
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
