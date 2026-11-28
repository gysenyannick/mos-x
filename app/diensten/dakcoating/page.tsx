"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Check, ChevronDown, ChevronRight, Loader2, Phone } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import BeforeAfterSlider from "@/components/before-after-slider";
import HeroVertrouwen from "@/components/hero-vertrouwen";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import GoogleScore from "@/components/google-score";
import WerkgebiedCheck from "@/components/werkgebied-check";
import SiteDakkleurBanner from "@/components/site-dakkleur-banner";
import SiteReviews from "@/components/site-reviews";
import { DIENST_CSS } from "@/components/dienst-stijl";

const methode = [
  { titel: "Grondige reiniging en voorbereiding", tekst: "Mos, algen en losse deeltjes worden volledig verwijderd. Hier gaan de meeste slechte behandelingen mis." },
  { titel: "Controle van de dakpannen", tekst: "We controleren de pannen en het onderdak. Beschadigde pannen vervangen we vóór de behandeling." },
  { titel: "Juiste primer en voorbehandeling", tekst: "Zorgvuldig gekozen producten, afgestemd op de pan en de staat ervan." },
  { titel: "Aangebracht met professioneel materiaal", tekst: "Gelijkmatig aangebracht, in de juiste dikte, over het hele dak." },
  { titel: "Controle van weer en vochtigheid", tekst: "Zijn de omstandigheden niet goed, dan wachten we." },
  { titel: "Voldoende droogtijd tussen elke stap", tekst: "Elke laag droogt volledig voor de volgende wordt aangebracht." },
];

const redenen = [
  { titel: "Mos en uv slijten je pannen", tekst: "Het mos wortelt in de pan zelf en uv-straling breekt het oppervlak af. Hoe langer je wacht, hoe meer vocht de pan opneemt, en hoe duurder het werk wordt.", img: "/images/waarom-1-mos.webp", pos: "50% 50%" },
  { titel: "Pannen barsten bij vorst", tekst: "Als het oppervlak versleten is, neemt de pan water op. De vorst laat het vocht in de pan uitzetten, net zoals in asfalt, met barsten en kans op lekken tot gevolg.", img: "/images/waarom-2-barst.webp", pos: "50% 50%" },
  { titel: "Nieuw dak jaren uitstellen", tekst: "Op het juiste moment reinigen en coaten herstelt zowel de bescherming als de uitstraling van je dak. Het is een stuk goedkoper dan de pannen vervangen of een nieuw dak leggen.", img: "/images/gemoedsrust-coating.webp", pos: "50% 35%" },
];

const info: { q: string; a: string; cta?: boolean }[] = [
  { q: "Wat is een dakcoating?", a: "Bij een dakcoating krijgen je dakpannen een nieuwe, dichte beschermlaag. Een onbehandeld dak neemt water op. In de winter bevriest dat water, zet het uit en beschadigt het de pannen van binnenuit. Zo worden pannen poreus, krijgt mos vat en kan je dak op termijn gaan lekken.\n\nMet een coating loopt het water af in plaats van in de pan te trekken. Je dak blijft langer proper, kan beter tegen vorst en ziet er jaren als nieuw uit." },
  { q: "Waarom is dat nodig in België?", a: "In België regent het vaak en schommelt de temperatuur in de winter rond het vriespunt. Je pannen worden telkens nat, bevriezen en ontdooien weer. Net dat maakt ze na verloop van tijd poreus.\n\nEen coating beschermt je dak precies daartegen: het water krijgt geen kans meer om in de pan te trekken." },
  { q: "Hoe pakken we het aan?", a: "We starten altijd met een grondige controle van je dak: de pannen, de nokken en de goten. Is je dak geschikt, dan reinigen we het eerst onder aangepaste druk, herstellen we kleine schade en brengen we daarna twee lagen coating aan.\n\nDe juiste druk, het juiste materiaal en een goede voorbereiding maken het verschil tussen een coating die jaren meegaat en een die na een paar seizoenen afbladert. Heeft je dak enkel een opfrisbeurt nodig? Dan volstaat soms een dakreiniging. We raden altijd aan wat echt nodig is, niet het duurste." },
  { q: "Wat kost een dakcoating?", a: "De prijs hangt af van de oppervlakte van je dak, de helling, de bereikbaarheid en hoeveel mos er eerst weg moet. Na het plaatsbezoek krijg je een vaste prijs: offerte = factuur, geen uurloon en geen meerwerk achteraf.\n\nWil je nu al weten in welke orde van grootte je moet denken? Bereken je richtprijs in 60 seconden.", cta: true },
  { q: "Dakcoating of een nieuw dak?", a: "Een nieuw dak kost al snel een veelvoud van een coating, met afbraak, containers en weken werk. Zijn je pannen nog stevig en is het onderdak in orde, dan geeft een coating je dak een tweede leven voor een fractie van de prijs.\n\nBovendien spaar je het milieu: geen nieuwe materialen, geen transport en geen berg bouwafval." },
];

const resultaten = [
  { titel: "Dakreiniging en dakcoating", voor: "/images/Before bevel.jpg", na: "/images/Na bevel.jpg", info: "Bevel · van bruin naar antraciet" },
  { titel: "Dakreiniging en dakcoating", voor: "/images/herentals-voor.png", na: "/images/herentals-na.png", info: "Herentals · betonpannen" },
  { titel: "Dakreiniging en dakcoating", voor: "/images/FullSizeRender.JPEG", na: "/images/IMG_4574.JPEG", info: "Schilde · betonpannen in antraciet" },
];

const misverstanden: { q: string; a: string }[] = [
  { q: "Als mijn dak groen ziet, moet het vervangen worden.", a: "Mos groeit op het oppervlak, niet door de pan heen. Vaak is enkel de beschermlaag van je pannen versleten en gaan de pannen zelf nog jaren mee. Bij de gratis dakinspectie bekijken we hoe je dak er echt aan toe is en zeggen we eerlijk of coaten nog zin heeft." },
  { q: "Een coating kost bijna evenveel als een nieuw dak.", a: "Nee. Voor een nieuw dak betaal je nieuwe pannen, latten, folie, stellingen en vaak weken werk. Bij een coating houden we je bestaande dak en geven we het een nieuwe beschermlaag. Dat kost maar een deel van een nieuw dak. Bereken je richtprijs en zie het zelf." },
  { q: "Ik koop gewoon nieuwe pannen en vervang ze zelf.", a: "Een paar kapotte pannen vervangen kan, en dat doen we bij kleine herstellingen gewoon mee. Maar nieuwe pannen tussen oude zie je meteen, en de rest van je dak blijft verweren. Een coating pakt het hele dak in één keer aan." },
  { q: "Dat is gewoon verf die er na drie jaar afbladdert.", a: "Een dakcoating is geen gewone verf. Afbladderen komt bijna altijd door slechte voorbereiding of werken bij slecht weer. Daarom reinigen we eerst grondig, brengen we een primer aan en coaten we enkel als het droog is. Op de coating krijg je 10 jaar garantie." },
  { q: "Ik kan mijn dak zelf afspuiten.", a: "Met een gewone hogedrukreiniger spuit je de toplaag van je pannen mee weg en duw je water onder de pannen. En je staat op hoogte zonder beveiliging. Wij reinigen met aangepaste druk en de juiste uitrusting." },
  { q: "Is het mos wegschrapen niet genoeg?", a: "Schrapen haalt het zichtbare mos weg, maar de sporen blijven zitten. Zonder behandeling erna komt het mos snel terug en ben je binnen korte tijd terug bij af." },
  { q: "Mijn dak lekt niet, dus er is niks aan de hand.", a: "Schade aan een dak bouwt zich traag op. Vocht trekt in de pannen, bij vorst barsten ze, en tegen dat het binnen lekt, is de schade veel groter. Wie op tijd iets doet, betaalt minder." },
  { q: "Als mijn dak lekt, moet het hele dak vervangen worden.", a: "Niet altijd. Vaak gaat het om een paar kapotte pannen, een losse nok of een slechte aansluiting. Dat herstellen we, en daarna bekijken we samen of een coating je dak nog jaren kan laten meegaan." },
  { q: "Alle dakfirma's doen hetzelfde.", a: "Het verschil zit in wat je niet ziet: de voorbereiding, de producten, de droogtijd en wie het werk doet. Bij MOS-X doen we het werk zelf, zonder onderaannemers, en krijg je vooraf een vaste prijs." },
];

const faqs: { q: string; a: string; cta?: boolean }[] = [
  { q: "Welke garantie krijg ik?", a: "Je krijgt 10 jaar garantie op de hechting van de coating. Dat wil zeggen dat de coating aan je pannen blijft hechten en niet afbladert. Een kleur die door zon en weer wat verbleekt, valt daar niet onder." },
  { q: "Wanneer is dakcoating nodig?", a: "Wanneer betonpannen of kunstleien poreus geworden zijn en hun beschermlaag verloren hebben. Tijdens het plaatsbezoek bekijken we de staat van je dak en geven we eerlijk advies." },
  { q: "Welke daken kan je coaten?", a: "Dakcoating gebruiken we vooral op betonpannen en kunstleien. Voor andere daktypes volstaat meestal een professionele reiniging met een antimosbehandeling." },
  { q: "Wordt het dak eerst gereinigd?", a: "Ja. Voor een goede hechting reinigen we het dak eerst grondig. Pas daarna brengen we de coating aan." },
  { q: "Kan ik een andere kleur kiezen?", a: "Ja. Je kiest uit 7 kleuren: zwart, antraciet, bruin, aubergine, rood, terra en fondant. Met onze dakkleur-tool zie je vooraf hoe je dak eruit zal zien." },
  { q: "Wat kost een dakcoating?", a: "De prijs hangt af van de oppervlakte, de bereikbaarheid en de staat van je dak. Bereken vrijblijvend je richtprijs, dan weet je meteen waar je aan toe bent.", cta: true },
];

const COATING_CSS = `
  .dc-mv-item .dc-acc-tekst .dc-faq-p { white-space: pre-line; padding-left: 24px; }
  @media (max-width: 640px) { .dc-mv-item .dc-acc-tekst .dc-faq-p { padding-left: 18px; } }
  .dc-faq-cta { padding: 0 24px 22px; }
  .dc-faq-cta .do-knop { height: 44px; font-size: 14px; }
  .dc-faq-meer { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 10px; padding: 16px 16px 16px 24px; border-radius: 12px; background: #F7F8F6; border: 1px solid #E5E7EB; }
  .dc-faq-meer b { font: 700 15px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
  .dc-faq-meer .do-knop { height: 44px; padding: 0 18px; font-size: 14px; }

  .dc-eind { position: relative; isolation: isolate; overflow: hidden; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); align-items: stretch; border-radius: 24px;
    background: radial-gradient(520px 320px at 0% 100%, rgba(155,203,108,0.16), transparent 70%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 75%);
    border: 1px solid rgba(155,203,108,0.3); box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -36px rgba(11,15,12,0.65); }
  .dc-eind-tekst { position: relative; z-index: 1; padding: 56px 24px 52px 56px; }
  .dc-eind h2 { margin: 0; font: 800 clamp(1.7rem, 2.9vw, 2.4rem)/1.12 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #FFFFFF; text-wrap: balance; }
  .dc-eind h2 span { color: #9BCB6C; white-space: nowrap; }
  .dc-eind-p { margin: 16px 0 0; max-width: 460px; font: 400 16.5px/1.65 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.75); text-wrap: pretty; }
  .dc-eind-lijst { margin: 22px 0 0; padding: 0; list-style: none; display: grid; gap: 10px; }
  .dc-eind-lijst li { display: flex; align-items: center; gap: 10px; font: 500 15px var(--font-inter), system-ui, sans-serif; color: #FFFFFF; }
  .dc-eind-lijst svg { flex: none; width: 22px; height: 22px; padding: 4px; border-radius: 50%; background: #9BCB6C; color: #FFFFFF; }
  .dc-eind-knoppen { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
  .dc-eind-hoofd { height: 58px !important; padding: 0 30px !important; font-size: 17px !important; }
  .dc-eind-knoppen .do-knop-d { height: 58px; }
  .dc-eind-score { margin-top: 22px; }
  .dc-eind-media { position: relative; min-height: 100%; margin-left: -18%; }
  .dc-eind-foto { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
  .dc-eind-media { -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.35) 22%, #000 55%); mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.35) 22%, #000 55%); }
  @media (max-width: 900px) {
    .dc-eind { grid-template-columns: minmax(0, 1fr); }
    .dc-eind-media { order: -1; height: 230px; min-height: 0; margin-left: 0; }
    .dc-eind-media { -webkit-mask-image: linear-gradient(180deg, #000 50%, transparent 100%); mask-image: linear-gradient(180deg, #000 50%, transparent 100%); }
    .dc-eind-tekst { padding: 8px 22px 34px; }
    .dc-eind-knoppen { flex-direction: column; }
    .dc-eind-knoppen .do-knop { width: 100%; justify-content: center; }
  }
  @media (max-width: 640px) {
    .dc-faq-meer { flex-direction: column; align-items: stretch; text-align: center; padding: 18px; }
    .dc-faq-cta { padding: 0 18px 20px; }
  }
  .dc-mv-kop { text-align: center; margin: 0 auto 44px; }
  .dc-mv-kop .do-h2 { text-align: center; }
  .dc-mv { max-width: 820px; margin: 0 auto; display: grid; gap: 10px; }
  .dc-mv-item { border-radius: 12px; background: #FFFFFF; border: 1px solid #E5E7EB; transition: border-color .2s ease, box-shadow .2s ease; }
  .dc-mv-item:hover { border-color: #CFE5B8; }
  .dc-mv-item.open { border-color: #9BCB6C; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 18px 40px -24px rgba(30,51,36,0.35); }
  .dc-mv-item button { width: 100%; display: flex; align-items: center; gap: 14px; padding: 20px 24px; background: none; border: 0; border-radius: 12px; cursor: pointer; text-align: left;
    font: 700 15.5px/1.4 var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
  .dc-mv-item button:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
  .dc-mv-item button:active { transform: translateY(1px); }
  .dc-mv-q { flex: 1; min-width: 0; }
  .dc-mv-q i { font-style: normal; font-weight: 800; color: #9BCB6C; }
  .dc-mv-q i:first-child { margin-right: 8px; }
  .dc-mv-q i:last-child { margin-left: 6px; }
  .dc-mv-plus { flex: none; position: relative; width: 16px; height: 16px; color: #1A1A1A; }
  .dc-mv-plus::before, .dc-mv-plus::after { content: ""; position: absolute; left: 0; top: 7px; width: 16px; height: 2px; border-radius: 2px; background: currentColor; transition: transform .25s ease; }
  .dc-mv-plus::after { transform: rotate(90deg); }
  .dc-mv-item.open .dc-mv-plus { color: #9BCB6C; }
  .dc-mv-item.open .dc-mv-plus::after { transform: rotate(0deg); }
  .dc-mv-item .dc-acc-tekst p { margin: 0; padding: 0 28px 22px 50px; font: 400 15px/1.7 var(--font-inter), system-ui, sans-serif; color: #545454; text-wrap: pretty; }
  @media (max-width: 640px) {
    .dc-mv-item button { padding: 18px 18px; font-size: 14.5px; }
    .dc-mv-item .dc-acc-tekst p { padding: 0 18px 20px 18px; font-size: 14.5px; }
  }


  .zk-spin { animation: dc-spin 1s linear infinite; }
  @keyframes dc-spin { to { transform: rotate(360deg); } }
  .dc-hero::after { display: none; }
  .dc-dkb .dkb-buiten { padding-top: 88px !important; }
  @media (max-width: 767px) { .dc-dkb .dkb-buiten { padding-top: 56px !important; } }
  .dc-mw-grid { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 64px; align-items: center; }
  .dc-mw-foto { display: block; width: 100%; max-width: 460px; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 20px; justify-self: end;
    border: 1px solid rgba(155,203,108,0.35); box-shadow: 0 30px 60px -30px rgba(0,0,0,0.6); }
  .dc-mw-kader { max-width: 620px; }
  .dc-mw-kader .do-oog { font-size: 11px; letter-spacing: .14em; margin-bottom: 10px; }
  .dc-mw-titel { white-space: nowrap; font-size: clamp(1.35rem, 2.05vw, 2.05rem); }
  @media (max-width: 960px) {
    .dc-mw-grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
    .dc-mw-foto { justify-self: center; max-width: 420px; aspect-ratio: 4 / 3; }
    .dc-mw-titel { font-size: 4.55vw; letter-spacing: -0.03em; }
  }
  .dc-mx-intro { margin-top: 16px; max-width: 560px; color: rgba(255,255,255,0.75) !important; }
  .dc-nu-kop { display: flex; flex-direction: column; align-items: center; text-align: center; margin: 0 auto 40px; }
  .dc-nu-kop .do-h2, .dc-nu-kop .do-p { text-align: center; margin-left: auto; margin-right: auto; }
  .dc-nu-kop .do-p { margin-top: 14px; }
  @media (max-width: 760px) { .dc-nu-kop { margin-bottom: 28px; } }
  .dc-nu-titel { white-space: nowrap; font-size: clamp(1.5rem, 2.6vw, 2.1rem); }
  @media (max-width: 760px) { .dc-nu-titel { white-space: normal; font-size: clamp(1.45rem, 6.4vw, 1.75rem); text-wrap: balance; } }
  .dc-nu { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
  .dc-nu-kaart { overflow: hidden; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); transition: transform .25s ease, box-shadow .25s ease; }
  .dc-nu-kaart:hover { transform: translateY(-4px); box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 26px 50px -28px rgba(30,51,36,0.45); }
  .dc-nu-kaart img { display: block; width: 100%; aspect-ratio: 3 / 2; object-fit: cover; }
  .dc-nu { align-items: start; }
  .dc-nu-knop { width: 100%; display: flex; align-items: center; gap: 14px; padding: 22px 22px 22px 24px; background: none; border: 0; cursor: pointer; text-align: left; }
  .dc-nu-knop:focus-visible { outline: 2px solid #9BCB6C; outline-offset: -4px; border-radius: 12px; }
  .dc-nu-knop:hover h3 { color: #7AB54E; }
  .dc-nu-knop .do-pijl { flex-shrink: 0; margin-left: auto; color: #9BCB6C; transition: transform .25s ease; }
  .dc-nu-kaart.open .do-pijl { transform: rotate(180deg); }
  .dc-nu-kaart.open .dc-acc-tekst { grid-template-rows: 1fr; }
  .dc-nu-p { margin: 0 !important; padding: 0 26px 24px 58px; font: 400 15px/1.65 var(--font-inter), system-ui, sans-serif !important; color: #545454; text-wrap: pretty; }
  .dc-nu-nr { flex-shrink: 0; font: 700 13px var(--font-montserrat), system-ui, sans-serif; color: #9BCB6C; }
  .dc-nu-knop h3 { margin: 0; white-space: nowrap; transition: color .2s ease; font: 800 17px/1.3 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.015em; color: #1A1A1A; }
  @media (max-width: 1180px) { .dc-nu { grid-template-columns: minmax(0, 1fr); max-width: 520px; margin: 0 auto; } }
  .dc-hero .do-oog { margin-top: 12px; margin-bottom: 18px; }
  .dc-hero .do-hero-tekst { max-width: 720px; }
  .dc-h1 { margin-bottom: 26px; font-size: clamp(2rem, 3.4vw, 3rem); line-height: 1.1; }
  .dc-h1 b { display: block; font-weight: inherit; white-space: nowrap; }
  .dc-h1 em { font-style: normal; color: #9BCB6C; }
  @media (max-width: 640px) { .dc-h1 b { display: inline; white-space: normal; } .dc-h1 { font-size: clamp(1.75rem, 8vw, 2.1rem); } }
  .dc-hero .do-p { margin-bottom: 30px; }
  .dc-hero .do-hero-knoppen { margin-bottom: 40px; }
  .dc-hero-vink { list-style: none; margin: 0 0 36px; padding: 0; display: grid; gap: 14px; }
  .dc-hero-vink li { display: flex; align-items: center; gap: 10px; font-size: 15.5px; color: rgba(255,255,255,0.85); font-family: var(--font-inter), system-ui, sans-serif; }
  .dc-hero-vink i { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: #9BCB6C; color: #FFFFFF; flex-shrink: 0; }

  .dc-info { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 64px; align-items: center; }
  .dc-acc { margin-top: 26px; border-top: 1px solid #E5E7EB; }
  .dc-acc-item { border-bottom: 1px solid #E5E7EB; }
  .dc-acc-item button { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 2px; background: none; border: 0; cursor: pointer; text-align: left;
    font: 700 17px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; letter-spacing: -0.01em; transition: color .2s ease; }
  .dc-acc-item button:hover { color: #7AB54E; }
  .dc-acc-item button:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; border-radius: 6px; }
  .dc-acc-item .do-pijl { flex-shrink: 0; color: #9BCB6C; transition: transform .25s ease; }
  .dc-acc-item.open .do-pijl { transform: rotate(180deg); }
  .dc-acc-tekst { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; }
  .dc-acc-item.open .dc-acc-tekst { grid-template-rows: 1fr; }
  .dc-mv-item.open .dc-acc-tekst { grid-template-rows: 1fr; }
  .dc-acc-tekst > div { overflow: hidden; }
  .dc-acc-tekst p { margin: 0 0 14px; font: 400 15.5px/1.7 var(--font-inter), system-ui, sans-serif; color: #545454; }
  .dc-acc-tekst .do-knop { margin: 0 0 20px; height: 44px; font-size: 14px; }

  .dc-bel { position: sticky; top: 110px; overflow: hidden; isolation: isolate; padding: 190px 28px 28px; border-radius: 20px; background: #0B0F0C; color: #FFFFFF; text-align: center; border-top: 4px solid #9BCB6C;
    box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 30px 60px -30px rgba(11,15,12,0.6); }
  .dc-bel::before { content: ""; position: absolute; z-index: -1; top: 0; left: 0; right: 0; height: 250px;
    background: linear-gradient(to bottom, rgba(11,15,12,0.05) 0%, rgba(11,15,12,0.55) 55%, #0B0F0C 100%), url("/images/dakcontrole.webp") center 22% / cover no-repeat; }
  .dc-bel-oog { margin: 0 0 10px; font: 700 12px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #9BCB6C; }
  .dc-bel h3 { margin: 0 0 10px; font: 800 24px/1.2 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.02em; }
  .dc-bel-sub { margin: 0 0 22px; font: 400 14px/1.6 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.7); }
  .dc-bel input { width: 100%; box-sizing: border-box; height: 48px; margin-bottom: 10px; padding: 0 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.16); background: rgba(255,255,255,0.06);
    color: #FFFFFF; font: 400 15px var(--font-inter), system-ui, sans-serif; transition: border-color .2s ease; }
  .dc-bel input::placeholder { color: rgba(255,255,255,0.45); }
  .dc-bel input:focus { outline: none; border-color: #9BCB6C; }
  .dc-bel .do-knop { width: 100%; }
  .dc-bel-of { margin: 14px 0; font: 400 13px var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.5); }
  .dc-bel-tel { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; color: #FFFFFF; text-decoration: none; font: 700 15px var(--font-montserrat), system-ui, sans-serif; }
  .dc-bel-tel:hover { color: #9BCB6C; }
  .dc-bel-ok { padding: 18px 0; font: 600 15px/1.6 var(--font-inter), system-ui, sans-serif; color: #FFFFFF; }



  @media (max-width: 960px) {
    .dc-info { grid-template-columns: minmax(0, 1fr); gap: 36px; }
    .dc-bel { position: static; }
  }
  @media (max-width: 960px) {
    .dc-vs, .dc-kleur { grid-template-columns: minmax(0, 1fr); gap: 32px; }
    .dc-kaart { padding: 24px; }
  }
  @media (max-width: 560px) {
    .dc-stalen { grid-template-columns: repeat(4, minmax(0, 1fr)); row-gap: 14px; }
    .dc-knoppen .do-knop { width: 100%; }
  }
`;

function WhatsAppIcoon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function DakcoatingPage() {
  const [openMv, setOpenMv] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bezoekOpen, setBezoekOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState<number | null>(null);
  const [openNu, setOpenNu] = useState<number | null>(null);
  const [openStap, setOpenStap] = useState<number | null>(null);
  const [belStatus, setBelStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function belMij(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBelStatus("sending");
    const fd = new FormData(e.currentTarget);
    fd.set("dienst", "dakcoating");
    fd.set("bericht", "Aanvraag gratis dakinspectie (MOS-MAX dakcoating)");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      setBelStatus(res.ok ? "ok" : "error");
    } catch {
      setBelStatus("error");
    }
  }


  return (
    <PageLayout>
      <style>{DIENST_CSS + COATING_CSS}</style>

      {/* Hero */}
      <section className="do-hero dc-hero">
        <video src="/videos/dakcoating-kaart.mp4" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        <div className="do-wrap">
          <div className="do-hero-tekst">
            <BackLink href="/#diensten" dark />
            <p className="do-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" /><Link href="/#diensten">Diensten</Link><ChevronRight size={13} color="#9BCB6C" />MOS-MAX</p>
            <p className="do-oog">Vergeet je zorgen over je dak</p>
            <h1 className="do-h1 dc-h1"><b>MOS-MAX is de dakcoating</b> <b>die je dak <em>tot 15 jaar</em></b> <b><em>langer laat meegaan.</em></b></h1>
            <p className="do-p">MOS-MAX is onze dakcoating: een professionele coating die over je dakpannen wordt aangebracht en je dak nieuw leven en betere bescherming geeft, voor een fractie van de prijs van een nieuw dak.</p>
            <ul className="dc-hero-vink">
              <li><i><Check size={14} strokeWidth={3.2} /></i>Je stelt een nieuw dak uit, of vermijdt het helemaal</li>
              <li><i><Check size={14} strokeWidth={3.2} /></i>Je bespaart duizenden euro&apos;s</li>
              <li><i><Check size={14} strokeWidth={3.2} /></i>Je dak ziet er weer als nieuw uit, en gaat jaren mee</li>
            </ul>
            <div className="do-hero-knoppen">
              <Link className="do-knop do-knop-g mx-glow" href="/#calculator">Bereken je prijs in 60 seconden<ChevronRight size={17} /></Link>
              <a className="do-knop do-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
            </div>
            <HeroVertrouwen />
          </div>
        </div>
      </section>

      {/* Werkgebied */}
      <WerkgebiedCheck />

      {/* Uitleg + terugbelkaart */}
      <section className="do-sectie do-wit">
        <div className="do-wrap dc-info">
          <div>
            <p className="do-oog">Gemaakt voor het Belgische weer</p>
            <h2 className="do-h2">Een dakcoating die <span>tegen ons klimaat kan.</span></h2>
            <p className="do-p" style={{ marginTop: 16 }}>Een professionele coating geeft je dak een nieuwe beschermlaag tegen regen, vorst en mos. Je dakpannen krijgen opnieuw een egale kleur en je dak gaat jaren langer mee.</p>
            <div className="dc-acc">
              {info.map((f, i) => {
                const open = openInfo === i;
                return (
                  <div key={f.q} className={open ? "dc-acc-item open" : "dc-acc-item"}>
                    <button type="button" aria-expanded={open} onClick={() => setOpenInfo(open ? null : i)}>
                      {f.q}
                      <ChevronDown size={20} className="do-pijl" aria-hidden="true" />
                    </button>
                    <div className="dc-acc-tekst"><div>
                      {f.a.split("\n\n").map((t) => <p key={t.slice(0, 24)}>{t}</p>)}
                      {f.cta && <Link className="do-knop do-knop-g" href="/#calculator">Bereken je richtprijs<ChevronRight size={16} /></Link>}
                    </div></div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="dc-bel" aria-label="Vraag een gratis dakinspectie aan">
            <p className="dc-bel-oog">Gratis dakinspectie</p>
            <h3>Laat je dak gratis inspecteren.</h3>
            <p className="dc-bel-sub">We bekijken je dak ter plaatse en je krijgt een vaste prijs. Laat je naam en nummer achter, dan bellen we je om een afspraak te maken.</p>
            {belStatus === "ok" ? (
              <p className="dc-bel-ok" role="status">Bedankt! We bellen je snel om je gratis dakinspectie in te plannen.</p>
            ) : (
              <form onSubmit={belMij}>
                <input name="voornaam" placeholder="Je naam" required autoComplete="name" aria-label="Je naam" />
                <input name="telefoon" type="tel" placeholder="Je telefoonnummer" required autoComplete="tel" aria-label="Je telefoonnummer" />
                <button type="submit" className="do-knop do-knop-g" disabled={belStatus === "sending"}>
                  {belStatus === "sending" ? <Loader2 size={17} className="zk-spin" /> : <CalendarCheck size={17} />}Vraag gratis inspectie aan
                </button>
                {belStatus === "error" && <p className="dc-bel-of" role="alert">Er ging iets mis. Bel ons gerust even.</p>}
              </form>
            )}
            <p className="dc-bel-of">of</p>
            <Link className="do-knop do-knop-d" href="/#calculator">Bereken je richtprijs<ChevronRight size={16} /></Link>
            <a className="dc-bel-tel" href="tel:+32468352869"><Phone size={15} />+32 468 35 28 69</a>
          </aside>
        </div>
      </section>

      {/* Werkwijze: de MOS-MAX-methode */}
      <section className="do-sectie do-donker dc-mw">
        <div className="do-wrap dc-mw-grid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dc-mw-foto" src="/images/IMG_4581 achteraanzicht coating.JPEG" alt="Dak na een dakcoating door MOS-X, van bovenaf gezien" loading="lazy" decoding="async" />
          <div className="dc-mw-kader">
            <p className="do-oog">Onze eigen behandelingsmethode</p>
            <h2 className="do-h2 dc-mw-titel">Zo werkt de <span>MOS&#8209;MAX&#8209;methode.</span></h2>
            <p className="do-p dc-mx-intro">MOS&#8209;MAX is onze eigen methode, gegroeid uit onze ervaring op het dak. We zagen waar dakbehandelingen mislopen: de voorbereiding, de producten, het aanbrengen of het weer. Daarom volgen we op elk dak dezelfde vaste stappen.</p>
            <div className="do-stappen">
              {methode.map((s, i) => {
                const open = openStap === i;
                return (
                  <div key={s.titel} className={open ? "do-stap open" : "do-stap"}>
                    <button type="button" aria-expanded={open} onClick={() => setOpenStap(open ? null : i)}>
                      <span className="do-stap-nr">{String(i + 1).padStart(2, "0")}</span>
                      {s.titel}
                      <ChevronDown size={20} className="do-pijl" aria-hidden="true" />
                    </button>
                    <div className="do-stap-tekst"><div><p>{s.tekst}</p></div></div>
                  </div>
                );
              })}
            </div>
            <button type="button" className="do-knop do-knop-g mx-glow" onClick={() => setBezoekOpen(true)}><CalendarCheck size={18} />Plan een gratis plaatsbezoek</button>
          </div>
        </div>
      </section>

      {/* Waarom nu */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="dc-nu-kop">
            <h2 className="do-h2 dc-nu-titel">Waarom loont het om je dak <span>nu te behandelen?</span></h2>
            <p className="do-p">Drie redenen waarom wachten meer kost dan iets doen.</p>
          </div>
          <div className="dc-nu">
            {redenen.map((r, i) => (
              <article key={r.titel} className={openNu === i ? "dc-nu-kaart open" : "dc-nu-kaart"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.img} alt="" loading="lazy" decoding="async" width={800} height={540} style={{ objectPosition: r.pos }} />
                <button type="button" className="dc-nu-knop" aria-expanded={openNu === i} onClick={() => setOpenNu(openNu === i ? null : i)}>
                  <span className="dc-nu-nr">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{r.titel}</h3>
                  <ChevronDown size={20} className="do-pijl" aria-hidden="true" />
                </button>
                <div className="dc-acc-tekst"><div><p className="dc-nu-p">{r.tekst}</p></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dakkleur-tool */}
      <div className="dc-dkb"><SiteDakkleurBanner /></div>

      {/* Misverstanden */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="dc-mv-kop">
            <p className="do-oog">Veelgehoorde misverstanden</p>
            <h2 className="do-h2">Wat we het <span>vaakst horen.</span></h2>
          </div>
          <div className="dc-mv">
            {misverstanden.map((m, i) => {
              const open = openMv === i;
              return (
                <div key={m.q} className={open ? "dc-mv-item open" : "dc-mv-item"}>
                  <button type="button" aria-expanded={open} onClick={() => setOpenMv(open ? null : i)}>
                    <span className="dc-mv-q"><i aria-hidden="true">«</i>{m.q}<i aria-hidden="true">»</i></span>
                    <span className="dc-mv-plus" aria-hidden="true" />
                  </button>
                  <div className="dc-acc-tekst"><div><p>{m.a}</p></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <SiteReviews />

      {/* Resultaten */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="do-kop">
            <div>
              <p className="do-oog">Voor en na</p>
              <h2 className="do-h2">Onze <span>resultaten.</span></h2>
            </div>
            <Link className="do-knop do-knop-licht" href="/realisaties">Bekijk alle realisaties<ChevronRight size={17} /></Link>
          </div>
          <div className="do-resultaten">
            {resultaten.map((r) => (
              <article key={r.voor} className="do-resultaat">
                <BeforeAfterSlider beforeSrc={r.voor} afterSrc={r.na} borderRadius="0" aspectRatio="4/3" />
                <div><b>{r.titel}</b><small>{r.info}</small></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="do-sectie do-wit">
        <div className="do-wrap">
          <div className="dc-mv-kop">
            <p className="do-oog">Veelgestelde vragen</p>
            <h2 className="do-h2">Alles over <span>dakcoating.</span></h2>
          </div>
          <div className="dc-mv">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={open ? "dc-mv-item open" : "dc-mv-item"}>
                  <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                    <span className="dc-mv-q">{f.q}</span>
                    <span className="dc-mv-plus" aria-hidden="true" />
                  </button>
                  <div className="dc-acc-tekst"><div>
                    <p className="dc-faq-p">{f.a}</p>
                    {f.cta && <div className="dc-faq-cta"><Link className="do-knop do-knop-g" href="/#calculator">Bereken je richtprijs<ChevronRight size={16} /></Link></div>}
                  </div></div>
                </div>
              );
            })}
            <div className="dc-faq-meer">
              <b>Staat je vraag er niet bij?</b>
              <a className="do-knop do-knop-g" href="https://wa.me/32468352869?text=Hallo%2C%20ik%20heb%20een%20vraag%20over%20dakcoating." target="_blank" rel="noopener noreferrer"><WhatsAppIcoon />Stel je vraag</a>
            </div>
          </div>
        </div>
      </section>

      {/* Afsluiter: richtprijs */}
      <section className="do-sectie do-zacht dc-eind-sectie">
        <div className="do-wrap">
          <div className="dc-eind">
            <div className="dc-eind-tekst">
              <p className="do-oog">Klaar in 60 seconden</p>
              <h2>Wat kost een dakcoating <span>voor jouw dak?</span></h2>
              <p className="dc-eind-p">Bereken online meteen je richtprijs. Gratis, vrijblijvend en zonder dat je je moet registreren.</p>
              <ul className="dc-eind-lijst">
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />Vaste prijs, geen verrassingen</li>
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />10 jaar garantie op de coating</li>
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />Geen onderaannemers</li>
              </ul>
              <div className="dc-eind-knoppen">
                <Link className="do-knop do-knop-g mx-glow dc-eind-hoofd" href="/#calculator">Bereken mijn richtprijs<ChevronRight size={18} /></Link>
                <button type="button" className="do-knop do-knop-d" onClick={() => setBezoekOpen(true)}><CalendarCheck size={17} />Gratis plaatsbezoek</button>
              </div>
              <div className="dc-eind-score"><GoogleScore donker /></div>
            </div>
            <div className="dc-eind-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="dc-eind-foto" src="/images/IMG_4584 Vooraanzicht dakcoating.JPEG" alt="Woning met een vers gecoat dak" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} defaultDienst="Dakcoating" bron="Dakcoating pagina" />
    </PageLayout>
  );
}
