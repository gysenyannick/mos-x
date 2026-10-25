"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronRight, Headphones, Home, MessageCircle, Phone, ShieldCheck, User } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import BeforeAfterSlider from "@/components/before-after-slider";
import GoogleBalk from "@/components/google-balk";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import { DIENST_CSS } from "@/components/dienst-stijl";

const redenen = [
  { Icoon: User, titel: "Eén vast aanspreekpunt", tekst: "Je weet wie je helpt." },
  { Icoon: MessageCircle, titel: "Snelle communicatie", tekst: "Snel een helder antwoord." },
  { Icoon: Calendar, titel: "Afspraken nagekomen", tekst: "Wat we beloven, doen we." },
  { Icoon: Home, titel: "Respect voor je woning", tekst: "Alles netjes achtergelaten." },
  { Icoon: ShieldCheck, titel: "Professionele producten", tekst: "Bewezen en duurzaam." },
  { Icoon: Headphones, titel: "Ook nadien bereikbaar", tekst: "Ook na de werken." },
]

const toekomst = [
  { titel: "Renoveren wordt duurder", tekst: "Onderhoud loont steeds meer." },
  { titel: "Coatings worden beter", tekst: "Ze beschermen langer dan ooit." },
  { titel: "Minder afval", tekst: "Behouden spaart grondstoffen." },
  { titel: "Behoud wint", tekst: "Meer mensen kiezen onderhoud." },
]

const OVER_CSS = `
  .do-hero > img { position: absolute; top: 0; right: 0; bottom: 0; width: 50%; height: 100%; object-fit: cover; z-index: -2; }
  .over-h1 { font-size: clamp(2rem, 3.6vw, 3rem) !important; }
  .oo-brief { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 64px; align-items: center; }
  .oo-foto { position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 4 / 5; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -40px rgba(30,51,36,0.45); }
  .oo-foto img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .oo-foto span { position: absolute; left: 16px; bottom: 16px; padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.94); font-size: 13px; font-weight: 600; color: #1A1A1A; font-family: var(--font-inter), system-ui, sans-serif; }
  .oo-tekst { margin-top: 24px; display: grid; gap: 16px; }
  .oo-quote { margin: 30px 0 0; padding: 22px 26px; border-left: 4px solid #9BCB6C; border-radius: 0 14px 14px 0; background: #F2F8EC; font-size: 20px; font-weight: 800; line-height: 1.35; letter-spacing: -0.02em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .oo-quote span { color: #9BCB6C; }
  .oo-handtekening { margin-top: 22px; display: flex; align-items: center; gap: 14px; }
  .oo-handtekening img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid #9BCB6C; }
  .oo-handtekening b { display: block; font-size: 15.5px; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .oo-handtekening small { font-size: 13.5px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }

  .oo-kies { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 56px; align-items: center; }
  .oo-redenen { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .oo-reden { display: flex; gap: 14px; align-items: center; padding: 18px 20px; border-radius: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
  .oo-reden svg { flex: none; }
  .oo-reden b { display: block; font-size: 15.5px; color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .oo-reden > div { min-width: 0; }
  .oo-reden p { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 3px 0 0; font-size: 14px; line-height: 1.5; color: rgba(255,255,255,0.62); font-family: var(--font-inter), system-ui, sans-serif; }
  .oo-ambitie-kop { max-width: 640px; margin: 0 auto; text-align: center; }
  .oo-ambitie-kop .do-p { margin-top: 18px; }
  .oo-trends { margin: 52px 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-radius: 20px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); overflow: hidden; }
  .oo-trends li { padding: 30px 26px; }
  .oo-trends li + li { border-left: 1px solid #E5E7EB; }
  .oo-trends span { display: block; margin-bottom: 14px; font-size: 36px; font-weight: 800; line-height: 1; letter-spacing: -0.04em; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .oo-trends b, .oo-trends p { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .oo-trends b { display: block; margin-bottom: 6px; font-size: 16px; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; text-wrap: balance; }
  .oo-trends p { margin: 0; font-size: 14.5px; line-height: 1.6; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; text-wrap: balance; }

  @media (max-width: 960px) {
    .do-hero > img { width: 100%; }
    .oo-brief { grid-template-columns: minmax(0, 1fr); gap: 36px; }
    .oo-foto { aspect-ratio: 4 / 3; }
    .oo-kies { grid-template-columns: minmax(0, 1fr); gap: 32px; }
    .oo-trends { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .oo-trends li:nth-child(3) { border-left: 0; }
    .oo-trends li:nth-child(n+3) { border-top: 1px solid #E5E7EB; }
  }
  @media (max-width: 560px) {
    .oo-redenen { grid-template-columns: minmax(0, 1fr); }
  }
  @media (max-width: 560px) {
    .oo-trends { grid-template-columns: minmax(0, 1fr); }
    .oo-trends li + li { border-left: 0; border-top: 1px solid #E5E7EB; }
    .oo-trends li { padding: 24px 22px; }
  }
`;

export default function OverOnsPage() {
  const [bezoekOpen, setBezoekOpen] = useState(false);

  return (
    <PageLayout>
      <style>{DIENST_CSS + OVER_CSS}</style>

      {/* Hero */}
      <section className="do-hero">
        <img src="/images/Weer een dak ontmost.jpg" alt="" aria-hidden="true" />
        <div className="do-wrap">
          <div className="do-hero-tekst">
            <BackLink href="/" dark />
            <p className="do-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" />Over ons</p>
            <p className="do-oog">Over MOS-X</p>
            <h1 className="do-h1 over-h1">Wij zorgen voor daken. <span>En voor gemoedsrust.</span></h1>
            <p className="do-p">We helpen huiseigenaars hun dak zo lang mogelijk in topconditie te houden, met vakkundig onderhoud, eerlijk advies en een persoonlijke aanpak.</p>
            <div className="do-hero-knoppen">
              <a className="do-knop do-knop-g" href="/#calculator">Bereken je richtprijs<ChevronRight size={17} /></a>
              <button type="button" className="do-knop do-knop-d" onClick={() => setBezoekOpen(true)}>Plan een gratis plaatsbezoek</button>
            </div>
            <div className="do-hero-bewijs">
              <GoogleBalk />
              <span className="do-garantie-chip"><ShieldCheck size={18} color="#9BCB6C" aria-hidden="true" /><b>150+</b> afgewerkte daken</span>
            </div>
          </div>
        </div>
      </section>

      {/* Van de oprichter */}
      <section className="do-sectie do-wit">
        <div className="do-wrap oo-brief">
          <div className="oo-foto">
            <img src="/images/Yannick foto op dak.JPEG" alt="Yannick, oprichter van MOS-X, op een dak" />
            <span>Yannick, oprichter van MOS-X</span>
          </div>
          <div>
            <p className="do-oog">Van de oprichter</p>
            <h2 className="do-h2">Hallo, <span>ik ben Yannick.</span></h2>
            <div className="oo-tekst">
              <p className="do-p">MOS-X is voor mij meer dan een bedrijf. Het is mijn manier om te bewijzen dat vakmanschap, duidelijke communicatie en persoonlijke service nog altijd samengaan.</p>
              <p className="do-p">Ik wil dat je nooit hoeft te twijfelen wanneer je antwoord krijgt, wie je project opvolgt of wat de volgende stap is. Daarom heb je bij ons altijd één vast aanspreekpunt, en werkt elk dak volgens dezelfde vaste werkwijze.</p>
              <p className="do-p">Voor mij stopt een project niet als de werken klaar zijn. Het stopt pas als jij met een goed gevoel terugkijkt op je keuze voor MOS-X.</p>
            </div>
            <p className="oo-quote">We bouwen niet alleen aan daken. <span>We bouwen aan vertrouwen.</span></p>
            <div className="oo-handtekening">
              <img src="/images/yannick-avatar.jpg" alt="" />
              <div><b>Yannick Gysen</b><small>Oprichter MOS-X</small></div>
            </div>
          </div>
        </div>
      </section>

      {/* Missie */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap do-waarom">
          <div>
            <p className="do-oog">Waarom MOS-X bestaat</p>
            <h2 className="do-h2">Onderhouden <span style={{ display: "block" }}>is overhouden.</span></h2>
            <div className="oo-tekst">
              <p className="do-p">Te vaak wordt een vervuild dak gezien als een dak dat vervangen moet worden. Terwijl goed onderhoud de levensduur vaak nog jaren kan verlengen.</p>
              <p className="do-p">En dat is vandaag belangrijker dan ooit. Renovaties en bouwmaterialen worden steeds duurder, en een verzorgd dak stelt een dure vervanging jaren uit.</p>
              <p className="do-p">Daarom reinigen, beschermen en onderhouden we daken, zodat ze zo lang mogelijk in topconditie blijven. Slim, duurzaam en betaalbaar.</p>
            </div>
          </div>
          <div className="do-slider">
            <BeforeAfterSlider beforeSrc="/images/IMG_5414.JPEG" afterSrc="/images/IMG_5436.JPEG" borderRadius="0" aspectRatio="4/3" />
          </div>
        </div>
      </section>

      {/* Waarom klanten kiezen */}
      <section className="do-donker">
        <div className="do-wrap">
          <div className="oo-kies">
          <div>
            <p className="do-oog">Waarom klanten voor ons kiezen</p>
            <h2 className="do-h2">Een proper dak. <span style={{ display: "block" }}>En de zekerheid</span><span style={{ display: "block" }}>dat alles klopt.</span></h2>
            <p className="do-p" style={{ marginTop: 18 }}>We willen niet dat je klant bent tot de factuur betaald is. Ook nadien moet je op ons kunnen rekenen.</p>
          </div>
          <ul className="oo-redenen">
            {redenen.map(({ Icoon, titel, tekst }) => (
              <li key={titel} className="oo-reden"><Icoon size={20} color="#9BCB6C" aria-hidden="true" /><div><b>{titel}</b><p>{tekst}</p></div></li>
            ))}
          </ul>
          </div>
        </div>
      </section>

      {/* Ambitie */}
      <section className="do-sectie do-wit">
        <div className="do-wrap">
          <div className="oo-ambitie-kop">
            <p className="do-oog">Onze ambitie</p>
            <h2 className="do-h2">De toekomst van <span>dakonderhoud.</span></h2>
            <p className="do-p">We geloven dat de toekomst niet ligt in het vervangen van daken, maar in het slim onderhouden ervan. Daar willen we de standaard in zetten, door elke dag een beetje beter te doen.</p>
          </div>
          <ol className="oo-trends">
            {toekomst.map((t, i) => (
              <li key={t.titel}><span>{String(i + 1).padStart(2, "0")}</span><b>{t.titel}</b><p>{t.tekst}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {/* Afsluiter */}
      <section className="do-sectie do-wit" style={{ paddingTop: 0 }}>
        <div className="do-wrap">
          <div className="do-cta">
            <div>
              <h2>Nog een vraag <span>voor ons?</span></h2>
              <p>Stuur ons gerust een bericht of bel even. We helpen je graag verder.</p>
            </div>
            <div className="do-cta-knoppen">
              <a className="do-knop do-knop-g" href="https://wa.me/32468352869" target="_blank" rel="noopener noreferrer">Stuur een WhatsApp<ChevronRight size={17} /></a>
              <a className="do-knop do-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
            </div>
          </div>
        </div>
      </section>

      <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} bron="Over ons pagina" />
    </PageLayout>
  );
}
