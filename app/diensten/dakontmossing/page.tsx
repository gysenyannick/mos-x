"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Check, ChevronDown, ChevronRight, CloudRain, Droplets, Leaf, Loader2, Phone, ShieldCheck, Sparkles } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import BeforeAfterSlider from "@/components/before-after-slider";
import HeroVertrouwen from "@/components/hero-vertrouwen";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import WerkgebiedCheck from "@/components/werkgebied-check";
import SiteReviews from "@/components/site-reviews";
import { DIENST_CSS } from "@/components/dienst-stijl";
import { COATING_CSS } from "@/components/coating-stijl";

const voordelen = [
  { Icoon: Leaf, titel: "Geen los mos meer op je oprit", tekst: "Bij regen en wind waaien mosbolletjes van je dak op je oprit en terras. Na een dakreiniging hoef je die niet meer telkens op te ruimen." },
  { Icoon: Droplets, titel: "Lege, vrije dakgoten", tekst: "Het mos in je dakgoten komt van je dak. Is je dak mosvrij, dan raken je goten niet meer verstopt en loopt het regenwater vlot weg." },
  { Icoon: CloudRain, titel: "Minder vochtproblemen", tekst: "Mos werkt als een spons. Het houdt water vast en kruipt tussen je pannen, waardoor er water onder kan lopen. Zonder mos blijft je dak droog." },
  { Icoon: ShieldCheck, titel: "Je dak gaat langer mee", tekst: "Mos houdt je pannen voortdurend nat. Bij vorst zet dat water uit en barsten je pannen. Een mosvrij dak droogt sneller op en gaat jaren langer mee." },
  { Icoon: Sparkles, titel: "Een frisse uitstraling", tekst: "Een proper dak geeft je hele woning een verzorgde look. Dat valt meteen op in de straat en verhoogt de waarde van je woning als je ooit verkoopt." },
];

const uitleg: { q: string; a: React.ReactNode }[] = [
  { q: "Waarom een nabehandeling na de reiniging?", a: (<>
    <p>Een dakreiniging haalt mos, algen en vuil weg, maar bouwt de beschermlaag die over de jaren versleten is niet opnieuw op. Na het reinigen staan de poriën van je pannen zelfs verder open, waardoor ze meer water opnemen.</p>
    <p>Zonder nabehandeling komt het mos dus sneller terug, en verkort je de levensduur van je dak. Daarom stemmen we na elke reiniging de nabehandeling af op jouw dak.</p>
  </>) },
  { q: "Welke nabehandeling past bij jouw dak?", a: (<>
    <p>Dat hangt af van het type dak en de staat ervan. Betonpannen krijgen <Link href="/diensten/hydrofuge">MOS-PLUS</Link> als het dak nog in goede staat is, of <Link href="/diensten/dakcoating">MOS-MAX</Link> als het al wat ouder is. Kunstleien krijgen meestal een MOS-MAX-coating.</p>
    <p>Gewone keramische pannen krijgen MOS-PLUS: ze nemen het middel goed op en houden hun originele kleur. Geglazuurde pannen nemen niets op, daar volstaat een antimosbehandeling. Bij het plaatsbezoek zeggen we eerlijk wat je dak nodig heeft, en niet wat het duurste is.</p>
  </>) },
  { q: "Werken jullie met hoge druk, en is dat niet slecht voor je dak?", a: (<>
    <p>Nee, niet zomaar. Met te hoge druk spuit je de toplaag van je pannen weg en duw je water onder het dak. We stemmen de druk, de spuitkop en de techniek altijd af op het materiaal, de leeftijd en de staat van je dak.</p>
    <p>Moeilijke hoekjes reinigen we met een vuilfrees, en een dikke laag mos halen we eerst mechanisch los. Agressieve producten zoals bleekwater of chloor gebruiken we nooit.</p>
  </>) },
];

const stappen = [
  { titel: "Dakcontrole en voorbereiding", tekst: "We starten met een grondige controle van je dak en vervangen meteen eventuele gebroken pannen of leien." },
  { titel: "Professionele dakreiniging", tekst: "Mos, algen en vervuiling verwijderen we met een (stoom)hogedrukunit, aangevuld met een vuilfrees die ook de moeilijkste hoekjes bereikt. Zo blijft de druk laag en je dakbedekking veilig." },
  { titel: "Controle na de reiniging", tekst: "Na het reinigen controleren we het volledige dak opnieuw, zodat verborgen aandachtspunten zichtbaar worden." },
  { titel: "Nabehandeling op maat", tekst: "We beschermen je dak met de nabehandeling die erbij past, zodat het mos niet snel terugkomt. Welke dat is, spreken we vooraf met je af bij het plaatsbezoek." },
  { titel: "Alles netjes achtergelaten", tekst: "We maken muren, terras en dakgoten netjes op, zodat je meteen kan genieten van een volledig verzorgd resultaat." },
];

const daktypes = [
  { naam: "Betonpannen", img: "/images/Betonpannen.jpg" },
  { naam: "Keramische pannen", img: "/images/Keramische pannen.jpg" },
  { naam: "Kunstleien", img: "/images/Kunstleien.png" },
  { naam: "Natuurleien", img: "/images/Leien dak.jpeg" },
  { naam: "Metalen daken", img: "/images/Metalen daken.jpg" },
];

const misverstanden: { q: string; a: string }[] = [
  { q: "Een dakreiniging en een dakbehandeling zijn hetzelfde.", a: "Nee. Een dakreiniging haalt mos en vuil weg, maar geeft geen nieuwe bescherming. Op versleten betonpannen opent een reiniging de poriën zelfs verder, waardoor de pan nog meer water opneemt. Zonder behandeling achteraf verkort een reiniging de levensduur van je dak. Daarom reinigen we betonpannen nooit zonder ze daarna te behandelen." },
  { q: "Een dakreiniging kost bijna evenveel als een behandeling.", a: "Nee. Een dakreiniging is de eerste stap en kost het minst. Een behandeling zoals MOS-PLUS of MOS-MAX komt erbovenop. Na het plaatsbezoek zeggen we eerlijk wat je dak nodig heeft, en niet wat het duurste is." },
  { q: "Hoe hoger de druk, hoe properder het dak.", a: "Met te hoge druk spuit je de toplaag van je pannen weg en duw je water onder het dak. Je dak ziet er even proper uit, maar wordt sneller weer groen. Wij werken met aangepaste druk." },
  { q: "Is het mos wegschrapen niet beter?", a: "Schrapen haalt het zichtbare mos weg, maar de sporen blijven zitten. Zonder reiniging en behandeling komt het mos snel terug." },
  { q: "Wat doet een antimosbehandeling?", a: "Na het reinigen spuiten we een biologisch afbreekbaar antimosmiddel op je dak. Het doodt de laatste sporen en zorgt dat mos en algen minder snel terugkomen." },
  { q: "Ik huur een hogedrukreiniger en doe het zelf.", a: "Dat kan, maar met een gewone hogedrukreiniger beschadig je makkelijk je pannen, en je staat op hoogte zonder beveiliging. Wij werken veilig gezekerd, met de juiste uitrusting." },
  { q: "Een dakreiniging maakt je pannen kapot.", a: "Niet als het goed gebeurt. Met de juiste druk, de juiste spuitkop en de juiste techniek voor jouw dak blijven je pannen heel. Gebroken pannen vervangen we meteen." },
];

const resultaten = [
  { voor: "/images/koningshooikt-voor.jpg", na: "/images/koningshooikt-na.jpg" },
  { voor: "/images/olen-voor.png", na: "/images/olen-na.png" },
  { voor: "/images/Voor dakreiniging slider.png", na: "/images/Na dakreiniging slider.png" },
];

const faqs: { q: string; a: string; cta?: boolean }[] = [
  { q: "Wat kost een dakreiniging?", a: "De prijs hangt af van de oppervlakte, de bereikbaarheid, hoeveel mos er op je dak zit en het type dakbedekking. Bereken vrijblijvend je richtprijs. Na het plaatsbezoek krijg je een vaste prijs: offerte = factuur.", cta: true },
  { q: "Hoe lang blijft je dak proper?", a: "Dat hangt af van de ligging van je woning, de bomen rondom en het weer. Dankzij de antimosbehandeling blijft je dak een stuk langer proper. Met het MOS-CARE onderhoudsplan volgen we je dak op." },
  { q: "Hoe vaak reinig je best je dak?", a: "Gemiddeld volstaat een professionele reiniging om de 7 à 10 jaar. Een dak met veel schaduw, bomen of vocht vervuilt sneller. Een controle om de 2 à 3 jaar helpt om beginnend mos op tijd te zien." },
  { q: "Wat doen jullie bewust niet?", a: "We werken nooit met extreem hoge druk, en nooit met agressieve producten zoals bleekwater, javel of chloor. Een verkeerde aanpak veroorzaakt meer schade dan ze oplost." },
  { q: "Doen jullie herstellingen?", a: "Kleine herstellingen nemen we meteen mee: gebroken pannen vervangen, nokpannen herstellen of uitcementeren, vogelwering plaatsen en kleine herstellingen aan dakgoten." },
  { q: "Wat gebeurt er met het mos?", a: "Alle losgekomen mos, vuil en resten verzamelen we en nemen we mee. Wil je het zelf gebruiken als groenafval of compost, laat het ons gerust weten." },
  { q: "Reinigen jullie asbestdaken?", a: "Nee. Asbesthoudende dakmaterialen mogen volgens de huidige regelgeving niet gereinigd worden. Bij twijfel bekijken we dit vooraf." },
];

const REINIG_CSS = `
  .dr-acc a { color: #1A1A1A; font-weight: 500; text-decoration: none; background: linear-gradient(#9BCB6C, #9BCB6C) 0 100% / 100% 2px no-repeat; transition: color .15s ease; }
  .dr-acc a:hover { color: #7AB54E; }
  .dr-acc a:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; border-radius: 2px; }
  .dr-kop { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; margin-bottom: 40px; }
  .dr-kop .do-p { max-width: 460px; }
  .dr-types { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px; }
  .dr-type { overflow: hidden; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); transition: border-color .2s ease, transform .2s ease; }
  .dr-type:hover { border-color: #CFE5B8; transform: translateY(-3px); }
  .dr-type img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
  .dr-type div { padding: 14px 16px 16px; }
  .dr-type b { display: block; font: 800 15px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.01em; color: #1A1A1A; }
  .dr-noot { margin: 22px 0 0; text-align: center; font: 400 15px/1.6 var(--font-inter), system-ui, sans-serif; color: #545454; text-wrap: balance; }
  .dr-noot a { color: #1A1A1A; font-weight: 500; text-decoration: none; background: linear-gradient(#9BCB6C, #9BCB6C) 0 100% / 100% 2px no-repeat; }
  .dr-noot a:hover { color: #7AB54E; }
  @media (max-width: 1100px) { .dr-types { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @media (max-width: 760px) { .dr-kop { flex-direction: column; align-items: flex-start; gap: 14px; } .dr-types { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; } .dr-type div { padding: 12px; } }
  .dr-h1 { font-size: clamp(2rem, 3.5vw, 3.1rem); }
  .do-waarom .do-h2 { font-size: clamp(1.6rem, 2.5vw, 2.15rem); }
  @media (min-width: 961px) { .do-waarom .do-h2 span { white-space: nowrap; } }
  @media (max-width: 640px) { .dc-hero .dr-h1 { font-size: 7.2vw; } }
`;

function WhatsAppIcoon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function Knoppen({ open }: { open: () => void }) {
  return (
    <div className="dc-knoppen dc-knoppen-midden">
      <Link className="do-knop do-knop-g mx-glow" href="/#calculator">Bereken mijn richtprijs<ChevronRight size={17} /></Link>
      <button type="button" className="do-knop do-knop-licht" onClick={open}><CalendarCheck size={17} />Plan een gratis plaatsbezoek</button>
    </div>
  );
}

export default function DakontmossingPage() {
  const [openVoordeel, setOpenVoordeel] = useState<number | null>(null);
  const [openUitleg, setOpenUitleg] = useState<number | null>(null);
  const [openStap, setOpenStap] = useState<number | null>(null);
  const [openMv, setOpenMv] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bezoekOpen, setBezoekOpen] = useState(false);
  const [belStatus, setBelStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const openBezoek = () => setBezoekOpen(true);

  async function belMij(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBelStatus("sending");
    const fd = new FormData(e.currentTarget);
    fd.set("dienst", "dakreiniging");
    fd.set("bericht", "Aanvraag gratis dakinspectie (dakreiniging)");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      setBelStatus(res.ok ? "ok" : "error");
    } catch {
      setBelStatus("error");
    }
  }

  return (
    <PageLayout>
      <style>{DIENST_CSS + COATING_CSS + REINIG_CSS}</style>

      {/* Hero */}
      <section className="do-hero dc-hero">
        <video src="/videos/dakontmossen-hero.mp4" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        <div className="do-wrap">
          <div className="do-hero-tekst">
            <BackLink href="/#diensten" dark />
            <p className="do-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" /><Link href="/#diensten">Diensten</Link><ChevronRight size={13} color="#9BCB6C" />Dakreiniging</p>
            <p className="do-oog">Dakreiniging</p>
            <h1 className="do-h1 dc-h1 dr-h1"><b>Geef je dak opnieuw</b> <b><em>een verzorgde uitstraling.</em></b></h1>
            <p className="do-p">Een dakreiniging haalt mos, algen en korstmos weg, en je dak ziet er meteen weer verzorgd uit. Na de reiniging beschermen we je dak altijd met een nabehandeling die erbij past, zodat het mos niet snel terugkomt.</p>
            <ul className="dc-hero-vink">
              <li><i><Check size={14} strokeWidth={3.2} /></i>Werkwijze aangepast aan het materiaal en de staat van je dak</li>
              <li><i><Check size={14} strokeWidth={3.2} /></i>Vaste prijs na een gratis plaatsbezoek</li>
              <li><i><Check size={14} strokeWidth={3.2} /></i>Altijd een nabehandeling, afgestemd op je dak</li>
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

      {/* Voordelen */}
      <section className="do-sectie do-wit">
        <div className="do-wrap do-waarom">
          <div className="do-slider">
            <BeforeAfterSlider beforeSrc="/images/Before slider 2.0.png" afterSrc="/images/After slide 2.0.png" borderRadius="0" aspectRatio="4/3" />
          </div>
          <div>
            <p className="do-oog">Waarom je dak reinigen?</p>
            <h2 className="do-h2">Voorkom problemen. <span>Geniet van een verzorgd dak.</span></h2>
            <ul className="vd-acc">
              {voordelen.map(({ Icoon, titel, tekst }, i) => {
                const open = openVoordeel === i;
                return (
                  <li key={titel} className={open ? "open" : undefined}>
                    <button type="button" aria-expanded={open} aria-controls={`voordeel-${i}`} onClick={() => setOpenVoordeel(open ? null : i)}>
                      <i><Icoon size={20} color="#9BCB6C" /></i>
                      <span>{titel}</span>
                      <ChevronDown className="vd-pijl" size={18} aria-hidden="true" />
                    </button>
                    <div className="vd-tekst" id={`voordeel-${i}`}>
                      <div><p>{tekst}</p></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Uitleg + inspectiekaart */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap dc-info">
          <div>
            <p className="do-oog">Eerlijk advies</p>
            <h2 className="do-h2">Reinigen alleen is <span>niet genoeg.</span></h2>
            <p className="do-p" style={{ marginTop: 16 }}>Een reiniging maakt je dak proper, de nabehandeling houdt het zo. Daarom kijken we eerst naar je dak, en raden we pas daarna iets aan.</p>
            <div className="dc-acc dr-acc">
              {uitleg.map((f, i) => {
                const open = openUitleg === i;
                return (
                  <div key={f.q} className={open ? "dc-acc-item open" : "dc-acc-item"}>
                    <button type="button" aria-expanded={open} onClick={() => setOpenUitleg(open ? null : i)}>
                      {f.q}
                      <ChevronDown size={20} className="do-pijl" aria-hidden="true" />
                    </button>
                    <div className="dc-acc-tekst"><div>{f.a}</div></div>
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

      {/* Werkwijze */}
      <section className="do-sectie do-donker dc-mw">
        <div className="do-wrap dc-mw-grid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dc-mw-foto" src="/images/IMG_5900.JPEG" alt="Vakman van MOS-X reinigt een dak, veilig gezekerd met harnas" loading="lazy" decoding="async" style={{ objectPosition: "30% 30%" }} />
          <div className="dc-mw-kader">
            <p className="do-oog">Onze werkwijze</p>
            <h2 className="do-h2 dc-mw-titel">Zo reinigen we <span>jouw dak.</span></h2>
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
            <div className="dc-knoppen">
              <Link className="do-knop do-knop-g mx-glow" href="/#calculator">Bereken mijn richtprijs<ChevronRight size={17} /></Link>
              <button type="button" className="do-knop do-knop-d" onClick={openBezoek}><CalendarCheck size={17} />Gratis plaatsbezoek</button>
            </div>
          </div>
        </div>
      </section>

      {/* Daktypes */}
      <section className="do-sectie do-wit">
        <div className="do-wrap">
          <div className="dr-kop">
            <div>
              <p className="do-oog">Welke daken reinigen we?</p>
              <h2 className="do-h2">Elk dak vraagt <span>zijn eigen aanpak.</span></h2>
            </div>
            <p className="do-p">We stemmen de reiniging af op het materiaal, de leeftijd en de staat van je dak. Zo blijven je pannen of leien heel.</p>
          </div>
          <div className="dr-types">
            {daktypes.map((t) => (
              <div key={t.naam} className="dr-type">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.naam} loading="lazy" decoding="async" />
                <div><b>{t.naam}</b></div>
              </div>
            ))}
          </div>
          <p className="dr-noot">Welke nabehandeling jouw dak nodig heeft, zeggen we je bij het <Link href="/#dakcontrole">gratis plaatsbezoek</Link>.</p>
        </div>
      </section>

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
          <Knoppen open={openBezoek} />
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
              <div key={r.voor} className="dc-res">
                <BeforeAfterSlider beforeSrc={r.voor} afterSrc={r.na} borderRadius="0" aspectRatio="4/3" />
              </div>
            ))}
          </div>
          <Knoppen open={openBezoek} />
        </div>
      </section>

      {/* FAQ */}
      <section className="do-sectie do-wit">
        <div className="do-wrap">
          <div className="dc-mv-kop">
            <p className="do-oog">Veelgestelde vragen</p>
            <h2 className="do-h2">Alles over <span>dakreiniging.</span></h2>
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
              <a className="do-knop do-knop-g" href="https://wa.me/32468352869?text=Hallo%2C%20ik%20heb%20een%20vraag%20over%20een%20dakreiniging." target="_blank" rel="noopener noreferrer"><WhatsAppIcoon />Stel je vraag</a>
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
              <h2>Wat kost een dakreiniging <span>voor jouw dak?</span></h2>
              <p className="dc-eind-p">Bereken online meteen je richtprijs. Gratis en vrijblijvend.</p>
              <ul className="dc-eind-lijst">
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />Vaste prijs, geen verrassingen</li>
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />Altijd een nabehandeling</li>
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />Gratis plaatsbezoek en advies</li>
              </ul>
              <div className="dc-eind-knoppen">
                <Link className="do-knop do-knop-g mx-glow dc-eind-hoofd" href="/#calculator">Bereken mijn richtprijs<ChevronRight size={18} /></Link>
                <button type="button" className="do-knop do-knop-d" onClick={openBezoek}><CalendarCheck size={17} />Gratis plaatsbezoek</button>
              </div>
            </div>
            <div className="dc-eind-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="dc-eind-foto" src="/images/mos-plus-hero.webp" alt="Pas ontmost dak met het MOS-X-bord in de tuin" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} defaultDienst="Dakreiniging" bron="Dakreiniging pagina" />
    </PageLayout>
  );
}
