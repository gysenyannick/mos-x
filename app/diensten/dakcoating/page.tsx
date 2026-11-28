"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarCheck, CheckCircle2, ChevronDown, ChevronRight, Download, Loader2, Palette, Phone } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import BeforeAfterSlider from "@/components/before-after-slider";
import HeroVertrouwen from "@/components/hero-vertrouwen";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import GoogleScore from "@/components/google-score";
import WerkgebiedCheck from "@/components/werkgebied-check";
import { DIENST_CSS } from "@/components/dienst-stijl";
import { DAKKLEUREN } from "@/lib/dakkleuren";

const stappen = [
  { titel: "Grondige dakreiniging", tekst: "Een coating hecht enkel op een proper dak. Daarom reinigen we je dak eerst grondig en verwijderen we mos, algen en vuil, onder aangepaste druk." },
  { titel: "Afplakken en voorbereiding", tekst: "Ramen, zonnepanelen, veranda's, schouwen en andere onderdelen schermen we zorgvuldig af, zodat de werken veilig en netjes verlopen." },
  { titel: "Eerste coatinglaag", tekst: "We brengen een eerste laag watergedragen dakcoating aan met een professionele airless spuitmachine, met een antimosprimer voor een optimale hechting." },
  { titel: "Tweede coatinglaag", tekst: "Zodra de eerste laag volledig is uitgehard, brengen we een tweede laag aan in de gekozen kleur. Zo ontstaat een duurzame, egale beschermlaag." },
  { titel: "Controle en afwerking", tekst: "We verwijderen alle beschermingsmaterialen en controleren het volledige dak, zodat alles netjes wordt achtergelaten." },
];

const info: { q: string; a: string; cta?: boolean }[] = [
  { q: "Wat is een dakcoating?", a: "Bij een dakcoating krijgen je dakpannen een nieuwe, dichte beschermlaag. Een onbehandeld dak neemt water op. In de winter bevriest dat water, zet het uit en beschadigt het de pannen van binnenuit. Zo worden pannen poreus, krijgt mos vat en kan je dak op termijn gaan lekken.\n\nMet een coating loopt het water af in plaats van in de pan te trekken. Je dak blijft langer proper, kan beter tegen vorst en ziet er jaren als nieuw uit." },
  { q: "Waarom is dat nodig in België?", a: "In België regent het vaak en schommelt de temperatuur in de winter rond het vriespunt. Je pannen worden telkens nat, bevriezen en ontdooien weer. Net dat maakt ze na verloop van tijd poreus.\n\nEen coating beschermt je dak precies daartegen: het water krijgt geen kans meer om in de pan te trekken." },
  { q: "Hoe pakken we het aan?", a: "We starten altijd met een grondige controle van je dak: de pannen, de nokken en de goten. Is je dak geschikt, dan reinigen we het eerst onder aangepaste druk, herstellen we kleine schade en brengen we daarna twee lagen coating aan.\n\nDe juiste druk, het juiste materiaal en een goede voorbereiding maken het verschil tussen een coating die jaren meegaat en een die na een paar seizoenen afbladert. Heeft je dak enkel een opfrisbeurt nodig? Dan volstaat soms een dakreiniging (MOS-PRO). We raden altijd aan wat echt nodig is, niet het duurste." },
  { q: "Wat kost een dakcoating?", a: "De prijs hangt af van de oppervlakte van je dak, de helling, de bereikbaarheid en hoeveel mos er eerst weg moet. Na het plaatsbezoek krijg je een vaste prijs: offerte = factuur, geen uurloon en geen meerwerk achteraf.\n\nWil je nu al weten in welke orde van grootte je moet denken? Bereken je richtprijs in 60 seconden.", cta: true },
  { q: "Dakcoating of een nieuw dak?", a: "Een nieuw dak kost al snel een veelvoud van een coating, met afbraak, containers en weken werk. Zijn je pannen nog stevig en is het onderdak in orde, dan geeft een coating je dak een tweede leven voor een fractie van de prijs.\n\nBovendien spaar je het milieu: geen nieuwe materialen, geen transport en geen berg bouwafval." },
];

const methode = [
  { titel: "Werkwijze", tekst: "Vaste stappen in een vaste volgorde, niet wat die dag uitkomt." },
  { titel: "Kwaliteit", tekst: "Dezelfde eisen voor elk dak, groot of klein." },
  { titel: "Materialen", tekst: "Producten gekozen voor jouw type dakpan." },
  { titel: "Documentatie", tekst: "Foto's van voor en na, en wat we gedaan hebben." },
  { titel: "Garantie", tekst: "Schriftelijk, tot 10 jaar op de hechting." },
  { titel: "Uitvoering", tekst: "Eigen mensen, geen onderaannemers." },
];

const geschikt = [
  { label: "Betonpannen", img: "/images/Betonpannen.jpg" },
  { label: "Kunstleien", img: "/images/Kunstleien.jfif" },
];

const resultaten = [
  { titel: "Dakreiniging en dakcoating", voor: "/images/Before bevel.jpg", na: "/images/Na bevel.jpg", info: "Bevel · van bruin naar antraciet" },
  { titel: "Dakreiniging en dakcoating", voor: "/images/herentals-voor.png", na: "/images/herentals-na.png", info: "Herentals · betonpannen" },
  { titel: "Dakreiniging en dakcoating", voor: "/images/FullSizeRender.JPEG", na: "/images/IMG_4574.JPEG", info: "Schilde · betonpannen in antraciet" },
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
  .dc-vs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
  .dc-kaart { padding: 32px; border-radius: 20px; border: 1px solid #E5E7EB; background: #FFFFFF; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
  .dc-kaart.goed { border-color: #CFE5B8; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 0 0 3px rgba(155,203,108,0.15); }
  .dc-kaart h3 { margin: 0 0 18px; display: flex; align-items: center; gap: 10px; font-size: 19px; font-weight: 800; letter-spacing: -0.02em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .dc-label { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; background: #9BCB6C; color: #FFFFFF; }
  .dc-kaart ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 12px; }
  .dc-kaart li { display: flex; align-items: flex-start; gap: 12px; font-size: 15.5px; line-height: 1.5; color: #1A1A1A; font-family: var(--font-inter), system-ui, sans-serif; text-wrap: pretty; }
  .dc-kaart li svg { flex: none; margin-top: 2px; }
  .dc-kaart:not(.goed) li { color: #545454; }

  .dc-kleur { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 64px; align-items: center; }
  .dc-stalen { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 10px; margin: 28px 0; }
  .dc-staal { display: grid; justify-items: center; gap: 8px; font-size: 13px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
  .dc-staal i { width: 100%; max-width: 54px; aspect-ratio: 1; border-radius: 14px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), 0 4px 10px -4px rgba(0,0,0,0.35); }
  .dc-merk { font-size: 14px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }
  .dc-merk b { color: #1A1A1A; }
  .dc-geschikt { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .dc-geschikt .do-type { aspect-ratio: 4 / 5; }
  .dc-knoppen { display: flex; gap: 10px; flex-wrap: wrap; }
  .dc-knop-l { background: #FFFFFF; color: #1A1A1A; border: 1px solid #CFE5B8; }
  .dc-knop-l:hover { background: #F2F8EC; border-color: #9BCB6C; }

  .zk-spin { animation: dc-spin 1s linear infinite; }
  @keyframes dc-spin { to { transform: rotate(360deg); } }
  .dc-hero-vink { list-style: none; margin: -12px 0 30px; padding: 0; display: grid; gap: 10px; }
  .dc-hero-vink li { display: flex; align-items: center; gap: 10px; font-size: 15.5px; color: rgba(255,255,255,0.85); font-family: var(--font-inter), system-ui, sans-serif; }
  .dc-hero-vink i { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: #9BCB6C; color: #FFFFFF; flex-shrink: 0; }

  .dc-info { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 64px; align-items: start; }
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
  .dc-acc-tekst > div { overflow: hidden; }
  .dc-acc-tekst p { margin: 0 0 14px; font: 400 15.5px/1.7 var(--font-inter), system-ui, sans-serif; color: #545454; }
  .dc-acc-tekst .do-knop { margin: 0 0 20px; height: 44px; font-size: 14px; }

  .dc-bel { position: sticky; top: 110px; padding: 32px 28px; border-radius: 20px; background: #0B0F0C; color: #FFFFFF; text-align: center; border-top: 4px solid #9BCB6C;
    box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 30px 60px -30px rgba(11,15,12,0.6); }
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

  .dc-methode { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 56px; align-items: center; }
  .dc-tegels { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid #E5E7EB; border-radius: 18px; overflow: hidden; background: #FFFFFF; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
  .dc-tegel { padding: 22px 20px; border-right: 1px solid #E5E7EB; border-bottom: 1px solid #E5E7EB; }
  .dc-tegel:nth-child(3n) { border-right: 0; }
  .dc-tegel:nth-child(n+4) { border-bottom: 0; }
  .dc-tegel small { display: block; margin-bottom: 10px; font: 700 12px var(--font-montserrat), system-ui, sans-serif; color: #9BCB6C; }
  .dc-tegel b { display: block; margin-bottom: 6px; font: 800 16px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
  .dc-tegel p { margin: 0; font: 400 13.5px/1.55 var(--font-inter), system-ui, sans-serif; color: #545454; }

  .dc-regio { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; align-items: center; }
  .dc-pc { margin-top: 24px; padding: 22px; border-radius: 16px; background: #0B0F0C; }
  .dc-pc label { display: block; margin-bottom: 12px; font: 700 15px var(--font-montserrat), system-ui, sans-serif; color: #FFFFFF; }
  .dc-pc-rij { display: flex; gap: 10px; }
  .dc-pc input { flex: 1; min-width: 0; height: 50px; padding: 0 14px; border-radius: 10px; border: 1px solid transparent; background: #FFFFFF; color: #1A1A1A; font: 400 16px var(--font-inter), system-ui, sans-serif; }
  .dc-pc input:focus { outline: none; border-color: #9BCB6C; box-shadow: 0 0 0 3px rgba(155,203,108,0.3); }
  .dc-pc .do-knop { height: 50px; }
  .dc-pc-antwoord { margin: 14px 0 0; font: 500 14.5px/1.5 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.85); }
  .dc-pc-antwoord a { color: #9BCB6C; font-weight: 700; }
  .dc-prov { padding: 26px; border-radius: 18px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
  .dc-prov b { display: block; margin-bottom: 14px; font: 800 17px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
  .dc-prov ul { margin: 0; padding: 0; list-style: none; }
  .dc-prov li { display: flex; align-items: center; gap: 10px; padding: 12px 0; border-top: 1px solid #E5E7EB; font: 500 15px var(--font-inter), system-ui, sans-serif; color: #1A1A1A; }
  .dc-prov-noot { margin: 14px 0 0; font: 400 13px var(--font-inter), system-ui, sans-serif; color: #545454; }

  @media (max-width: 960px) {
    .dc-info, .dc-methode, .dc-regio { grid-template-columns: minmax(0, 1fr); gap: 36px; }
    .dc-bel { position: static; }
    .dc-tegels { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .dc-tegel:nth-child(3n) { border-right: 1px solid #E5E7EB; }
    .dc-tegel:nth-child(2n) { border-right: 0; }
    .dc-tegel:nth-child(n+4) { border-bottom: 1px solid #E5E7EB; }
    .dc-tegel:nth-child(n+5) { border-bottom: 0; }
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
  const [openStap, setOpenStap] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [bezoekOpen, setBezoekOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState<number | null>(0);
  const [belStatus, setBelStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function belMij(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBelStatus("sending");
    const fd = new FormData(e.currentTarget);
    fd.set("dienst", "dakcoating");
    fd.set("bericht", "Bel mij terug over MOS-MAX (dakcoating)");
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
      <section className="do-hero">
        <video src="/videos/Dakcoating.mp4" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        <div className="do-wrap">
          <div className="do-hero-tekst">
            <BackLink href="/#diensten" dark />
            <p className="do-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" /><Link href="/#diensten">Diensten</Link><ChevronRight size={13} color="#9BCB6C" />MOS-MAX</p>
            <p className="do-oog">MOS-MAX · Dakcoating</p>
            <h1 className="do-h1">Je dak weer als nieuw, <span>en jaren langer mee.</span></h1>
            <p className="do-p">MOS-MAX is onze dakcoating: een professionele beschermlaag op je bestaande pannen. Je dak krijgt een nieuw leven en betere bescherming, voor een fractie van de prijs van een nieuw dak.</p>
            <ul className="dc-hero-vink">
              <li><i><CheckCircle2 size={14} strokeWidth={3} /></i>Geen dakvervanging nodig</li>
              <li><i><CheckCircle2 size={14} strokeWidth={3} /></i>Je dak ziet er weer als nieuw uit</li>
              <li><i><CheckCircle2 size={14} strokeWidth={3} /></i>Tot 10 jaar garantie op de hechting</li>
            </ul>
            <div className="do-hero-knoppen">
              <Link className="do-knop do-knop-g mx-glow" href="/#calculator">Bereken je prijs in 60 seconden<ChevronRight size={17} /></Link>
              <a className="do-knop do-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
            </div>
            <HeroVertrouwen />
          </div>
        </div>
      </section>

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

          <aside className="dc-bel" aria-label="Laat je terugbellen">
            <p className="dc-bel-oog">Wat kost MOS-MAX?</p>
            <h3>Een vaste prijs, na een gratis plaatsbezoek.</h3>
            <p className="dc-bel-sub">Tot 10 jaar garantie op de hechting. Offerte = factuur, geen meerwerk achteraf.</p>
            {belStatus === "ok" ? (
              <p className="dc-bel-ok" role="status">Bedankt! We bellen je zo snel mogelijk terug.</p>
            ) : (
              <form onSubmit={belMij}>
                <input name="voornaam" placeholder="Je naam" required autoComplete="name" aria-label="Je naam" />
                <input name="telefoon" type="tel" placeholder="Je telefoonnummer" required autoComplete="tel" aria-label="Je telefoonnummer" />
                <button type="submit" className="do-knop do-knop-g" disabled={belStatus === "sending"}>
                  {belStatus === "sending" ? <Loader2 size={17} className="zk-spin" /> : <Phone size={16} />}Bel mij terug
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

      {/* Waarom MOS-MAX */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap dc-methode">
          <div>
            <p className="do-oog">Over de naam</p>
            <h2 className="do-h2">Daarom heet onze methode <span>MOS-MAX.</span></h2>
            <p className="do-p" style={{ margin: "16px 0 26px" }}>Dakrenovatie, dakbehandeling, coating: in de markt betekent dat vaak heel iets anders. Onze naam zegt wat je echt koopt.</p>
            <Link className="do-knop do-knop-g" href="/#calculator">Bereken je richtprijs<ChevronRight size={17} /></Link>
          </div>
          <div className="dc-tegels">
            {methode.map((m, i) => (
              <div key={m.titel} className="dc-tegel"><small>{String(i + 1).padStart(2, "0")}</small><b>{m.titel}</b><p>{m.tekst}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Werkwijze */}
      <section className="do-donker">
        <div className="do-wrap do-werk">
          <div className="do-werk-foto">
            <img src="/images/IMG_4581 achteraanzicht coating.JPEG" alt="Dak na een dakcoating door MOS-X, van bovenaf gezien" />
          </div>
          <div>
            <p className="do-oog">Onze werkwijze</p>
            <h2 className="do-h2">Zo coaten we <span>jouw dak.</span></h2>
            <div className="do-stappen">
              {stappen.map((s, i) => {
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

      {/* Kleuren en geschikte daken */}
      <section className="do-sectie do-wit">
        <div className="do-wrap dc-kleur">
          <div>
            <p className="do-oog">Kleuren</p>
            <h2 className="do-h2">Kies de kleur <span style={{ display: "block" }}>die bij je woning past.</span></h2>
            <div className="dc-stalen">
              {DAKKLEUREN.map((k) => <span key={k.id} className="dc-staal"><i style={{ background: k.hex }} />{k.naam}</span>)}
            </div>
            <p className="dc-merk" style={{ marginBottom: 28 }}>De kleuren op je scherm zijn een benadering. Tijdens het plaatsbezoek tonen we je de echte stalen.</p>
            <div className="dc-knoppen">
              <Link className="do-knop do-knop-g mx-glow" href="/#dakkleur"><Palette size={18} />Zie je dak in een nieuwe kleur</Link>
            </div>
          </div>
          <div>
            <div className="dc-geschikt">
              {geschikt.map((t) => <div key={t.label} className="do-type"><img src={t.img} alt={t.label} loading="lazy" /><span>{t.label}</span></div>)}
            </div>
            <div className="do-asbest">
              <div>
                <i><AlertTriangle size={20} color="#9BCB6C" /></i>
                <span><b>Voor betonpannen en kunstleien</b><small>Oudere leien kunnen asbest bevatten. Check het met onze gratis checklist.</small></span>
              </div>
              <a className="do-knop do-knop-g" style={{ height: 46 }} href="/downloads/MOS-X-asbestchecklist.pdf" download><Download size={17} />Download de checklist</a>
            </div>
          </div>
        </div>
      </section>

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

      {/* Werkgebied */}
      <WerkgebiedCheck />

      {/* FAQ */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="do-kop">
            <div>
              <p className="do-oog">Veelgestelde vragen</p>
              <h2 className="do-h2">Alles over <span>dakcoating.</span></h2>
            </div>
          </div>
          <div className="do-faq">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={open ? "do-vraag open" : "do-vraag"}>
                  <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                    {f.q}
                    <ChevronDown size={19} aria-hidden="true" />
                  </button>
                  {open && (
                    <div className="do-antwoord">
                      <p>{f.a}</p>
                      {f.cta && <Link className="do-knop do-knop-g" style={{ height: 44, marginTop: 6, fontSize: 14 }} href="/#calculator">Bereken je richtprijs<ChevronRight size={16} /></Link>}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="do-faq-meer">
              <b>Staat je vraag er niet bij?</b>
              <a className="do-knop do-knop-g" href="https://wa.me/32468352869?text=Hallo%2C%20ik%20heb%20een%20vraag%20over%20dakcoating." target="_blank" rel="noopener noreferrer"><WhatsAppIcoon />Stel je vraag</a>
            </div>
          </div>
        </div>
      </section>

      {/* Afsluiter */}
      <section className="do-sectie do-wit" style={{ paddingTop: 0 }}>
        <div className="do-wrap">
          <div className="do-cta">
            <div>
              <h2>Benieuwd wat <span style={{ whiteSpace: "nowrap" }}>jouw dak</span> nodig heeft?</h2>
              <p>We bekijken je dak en adviseren enkel wat écht nodig is.</p>
              <GoogleScore donker />
            </div>
            <div className="do-cta-knoppen">
              <button type="button" className="do-knop do-knop-g mx-glow" onClick={() => setBezoekOpen(true)}>Plan een gratis plaatsbezoek<ChevronRight size={17} /></button>
              <a className="do-knop do-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
            </div>
          </div>
        </div>
      </section>

      <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} defaultDienst="Dakcoating" bron="Dakcoating pagina" />
    </PageLayout>
  );
}
