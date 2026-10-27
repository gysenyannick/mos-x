"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, ChevronDown, ChevronRight, ClipboardList, Droplets, Eye, Leaf, Phone, ShieldCheck, Sparkles, Wallet, X } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import GoogleBalk from "@/components/google-balk";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import GoogleScore from "@/components/google-score";
import { DIENST_CSS } from "@/components/dienst-stijl";

const voordelen = [
  { Icoon: Leaf, titel: "Mos blijft weg" },
  { Icoon: Eye, titel: "Gebreken vroeg gezien" },
  { Icoon: Droplets, titel: "Vrije dakgoten" },
  { Icoon: Wallet, titel: "Geen dure achterstand" },
  { Icoon: Sparkles, titel: "Langer mooi" },
  { Icoon: ClipboardList, titel: "Rapport na elk bezoek" },
];

const stappen = [
  { nr: "01", titel: "Aanvragen", tekst: "Je vraagt Dakzorg aan, wij plannen een datum." },
  { nr: "02", titel: "Antimosbehandeling", tekst: "We houden het mos preventief weg." },
  { nr: "03", titel: "Dakinspectie", tekst: "Met een rapport in je klantenzone." },
];

const inbegrepen = [
  { titel: "Antimosbehandeling", tekst: "We behandelen je dak preventief met een antimosmiddel, zodat het mos niet terugkomt." },
  { titel: "Volledige dakcontrole", tekst: "We controleren je dakpannen, nokken en de algemene staat van je dak." },
  { titel: "Dakgoten en afvoer", tekst: "We controleren je dakgoten en afvoeren, zodat het water goed wegloopt." },
  { titel: "Veluxen en zinkwerk", tekst: "We kijken de gevoelige zones na waar problemen meestal beginnen." },
  { titel: "Kleine herstellingen", tekst: "Losse of beschadigde pannen en kleine gebreken pakken we meteen aan waar mogelijk." },
  { titel: "Rapport in je klantenzone", tekst: "Na de beurt krijg je een volledig rapport met foto's van hoe je dak erbij ligt." },
];

const vergelijk = [
  { zonder: "Mos groeit ongemerkt aan", met: "Vaste controles" },
  { zonder: "Verstopte dakgoten", met: "Goten blijven vrij" },
  { zonder: "Kleine schade wordt groot", met: "Problemen vroeg opgelost" },
  { zonder: "Onverwachte kosten", met: "Vaste prijs vooraf" },
];

const faqs = [
  { q: "Wat is MOS-X Dakzorg?", a: "Onderhoud voor een dak dat al gereinigd is. We behandelen je dak preventief met een antimosmiddel, zodat het mos geen kans krijgt. Tegelijk kijken we je hele dak na." },
  { q: "Wat kost een onderhoudsbeurt?", a: "Een onderhoudsbeurt kost vanaf €250. De exacte prijs hangt af van de grootte van je dak. Je kent die prijs vooraf, zonder verrassingen." },
  { q: "Voor wie is Dakzorg?", a: "Voor wie zijn dak al heeft laten reinigen en het graag zo houdt. Omdat je dak al proper is, volstaat een antimosbehandeling." },
  { q: "Wat met grotere herstellingen?", a: "Kleine herstellingen nemen we meteen mee. Voor grotere herstellingen maken we eerst een aparte offerte, zodat je vooraf weet waar je aan toe bent." },
];

const DAKZORG_CSS = `
  .do-hero > img { position: absolute; top: 0; right: 0; bottom: 0; width: 50%; height: 100%; object-fit: cover; z-index: -2; }
  .dz-stappen { margin-top: 8px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  .dz-stap { padding: 26px 24px; border-radius: 18px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
  .dz-stap span { display: inline-grid; place-items: center; width: 40px; height: 40px; margin-bottom: 16px; border-radius: 11px; background: #9BCB6C; color: #FFFFFF; font-size: 14px; font-weight: 800; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .dz-stap b { display: block; margin-bottom: 6px; font-size: 17px; font-weight: 800; letter-spacing: -0.01em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .dz-stap p { margin: 0; font-size: 15px; line-height: 1.6; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; text-wrap: pretty; }
  .do-hero .do-p, .dz-stap p, .do-antwoord p, .do-cta p { text-wrap: balance; }

  .dz-vgl { max-width: 860px; margin: 0 auto; border-radius: 20px; overflow: hidden; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
  .dz-vgl-kop, .dz-vgl-rij { display: grid; grid-template-columns: 1fr 1fr; }
  .dz-vgl-kop span { padding: 16px 26px; font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-montserrat), system-ui, sans-serif; color: #8E8E89; background: #F7F8F6; }
  .dz-vgl-kop span + span { color: #FFFFFF; background: #9BCB6C; }
  .dz-vgl-rij span { display: flex; align-items: center; gap: 12px; padding: 17px 26px; border-top: 1px solid #E5E7EB; font-size: 15.5px; color: #8E8E89; white-space: nowrap; font-family: var(--font-inter), system-ui, sans-serif; }
  .dz-vgl-rij span + span { color: #1A1A1A; font-weight: 600; background: #FBFDF9; border-left: 1px solid #E5E7EB; }
  .dz-vgl-rij span svg { flex: none; }
  .dc-vs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
  .dc-kaart { padding: 32px; border-radius: 20px; border: 1px solid #E5E7EB; background: #FFFFFF; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
  .dc-kaart.goed { border-color: #CFE5B8; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 0 0 3px rgba(155,203,108,0.15); }
  .dc-kaart h3 { margin: 0 0 18px; display: flex; align-items: center; gap: 10px; font-size: 19px; font-weight: 800; letter-spacing: -0.02em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .dc-kaart ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 12px; }
  .dc-kaart li { display: flex; align-items: flex-start; gap: 12px; font-size: 15.5px; line-height: 1.5; color: #1A1A1A; font-family: var(--font-inter), system-ui, sans-serif; }
  .dc-kaart li svg { flex: none; margin-top: 2px; }
  .dc-kaart:not(.goed) li { color: #545454; }

  .dz-prijs { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 440px); gap: 64px; align-items: center; justify-content: space-between; }
  .dz-zekerheden { margin: 28px 0 0; padding: 0; list-style: none; display: grid; gap: 12px; }
  .dz-zekerheden li { display: flex; align-items: center; gap: 12px; font-size: 15.5px; color: #1A1A1A; font-family: var(--font-inter), system-ui, sans-serif; }
  .dz-plan { position: relative; padding: 32px; border-radius: 24px; color: #FFFFFF; background: radial-gradient(420px 260px at 100% 0%, rgba(155,203,108,0.22), transparent 70%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 80%); box-shadow: 0 30px 70px -30px rgba(11,15,12,0.7); border: 1px solid rgba(155,203,108,0.35); }
  .dz-plan-kop { display: flex; justify-content: space-between; align-items: center; }
  .dz-plan-naam { font-size: 15px; font-weight: 800; letter-spacing: 0.02em; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .dz-plan-label { padding: 5px 11px; border-radius: 999px; background: #9BCB6C; color: #0B0F0C; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .dz-plan-prijs { margin: 26px 0 6px; display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .dz-plan-prijs small { width: 100%; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
  .dz-plan-prijs b { font-size: 60px; font-weight: 800; line-height: 1; letter-spacing: -0.04em; }
  .dz-plan-prijs span { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.65); font-family: var(--font-inter), system-ui, sans-serif; }
  .dz-plan-ritme { margin: 0 0 22px; padding-bottom: 22px; border-bottom: 1px solid rgba(255,255,255,0.12); font-size: 15px; color: #B9DE95; font-family: var(--font-inter), system-ui, sans-serif; }
  .dz-plan-kies { margin: 0 0 14px; font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55); font-family: var(--font-montserrat), system-ui, sans-serif; }
  .dz-plan ul { margin: 0 0 26px; padding: 0; list-style: none; display: grid; gap: 12px; }
  .dz-plan li { display: flex; align-items: center; gap: 12px; font-size: 15px; color: rgba(255,255,255,0.88); font-family: var(--font-inter), system-ui, sans-serif; }
  .dz-plan .do-knop { width: 100%; }
  .dz-plan .do-knop:focus-visible { outline-color: #FFFFFF; }
  .dz-plan-noot { margin: 12px 0 0; text-align: center; font-size: 13px; color: rgba(255,255,255,0.55); font-family: var(--font-inter), system-ui, sans-serif; }

  @media (max-width: 960px) {
    .dz-prijs { grid-template-columns: minmax(0, 1fr); gap: 36px; }
    .dz-plan { padding: 26px 22px; }
    .do-hero > img { width: 100%; }
    .dz-stappen, .dc-vs { grid-template-columns: minmax(0, 1fr); }
  }
  @media (max-width: 640px) {
    .dz-vgl-kop { display: none; }
    .dz-vgl-rij { grid-template-columns: minmax(0, 1fr); padding: 14px 18px; border-top: 1px solid #E5E7EB; }
    .dz-vgl-rij:first-of-type { border-top: 0; }
    .dz-vgl-rij span, .dz-vgl-rij span + span { padding: 3px 0; border: 0; background: none; font-size: 14.5px; }
    .dz-vgl-rij span:first-child { color: #A3A8A0; text-decoration: line-through; text-decoration-color: rgba(163,168,160,0.6); }
    .dc-kaart { padding: 24px; }
  }
`;

export default function MosXDakzorgPage() {
  const [openStap, setOpenStap] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [bezoekOpen, setBezoekOpen] = useState(false);

  return (
    <PageLayout>
      <style>{DIENST_CSS + DAKZORG_CSS}</style>

      {/* Hero */}
      <section className="do-hero">
        <img src="/images/16.JPEG" alt="" aria-hidden="true" />
        <div className="do-wrap">
          <div className="do-hero-tekst">
            <BackLink href="/diensten" dark />
            <p className="do-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" /><Link href="/diensten">Diensten</Link><ChevronRight size={13} color="#9BCB6C" />MOS-X Dakzorg</p>
            <p className="do-oog">MOS-X Dakzorg</p>
            <h1 className="do-h1">Je dak blijft verzorgd. <span>Jaar na jaar.</span></h1>
            <p className="do-p">Wij houden het mos weg en je dak in het oog. Zo ligt het er jarenlang mooi bij.</p>
            <div className="do-hero-knoppen">
              <button type="button" className="do-knop do-knop-g" onClick={() => setBezoekOpen(true)}>Vraag Dakzorg aan<ChevronRight size={17} /></button>
              <a className="do-knop do-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
            </div>
            <div className="do-hero-bewijs">
              <GoogleBalk />
              <span className="do-garantie-chip"><ShieldCheck size={18} color="#9BCB6C" aria-hidden="true" />Vanaf <b>€250</b> per onderhoudsbeurt</span>
            </div>
          </div>
        </div>
      </section>

      {/* Waarom */}
      <section className="do-sectie do-wit">
        <div className="do-wrap do-waarom">
          <div className="do-slider">
            <img src="/images/7.JPEG" alt="Verzorgde pannendaken na onderhoud" style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", display: "block" }} />
          </div>
          <div>
            <p className="do-oog">Waarom Dakzorg?</p>
            <h2 className="do-h2">Langer genieten van <span style={{ display: "block" }}>een verzorgd dak.</span></h2>
            <ul className="do-voordelen">
              {voordelen.map(({ Icoon, titel }) => (
                <li key={titel}><i><Icoon size={20} color="#9BCB6C" /></i>{titel}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="do-kop">
            <div>
              <p className="do-oog">Zo werkt het</p>
              <h2 className="do-h2">In drie stappen <span>naar een verzorgd dak.</span></h2>
            </div>
            <button type="button" className="do-knop do-knop-g" onClick={() => setBezoekOpen(true)}>Vraag Dakzorg aan<ChevronRight size={17} /></button>
          </div>
          <div className="dz-stappen">
            {stappen.map((s) => (
              <div key={s.nr} className="dz-stap"><span>{s.nr}</span><b>{s.titel}</b><p>{s.tekst}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Wat zit erin */}
      <section className="do-donker">
        <div className="do-wrap do-werk">
          <div className="do-werk-foto">
            <img src="/images/4.jpg" alt="Hoogwerker van MOS-X bij een woning voor een onderhoudsbeurt" style={{ objectPosition: "45% center" }} />
          </div>
          <div>
            <p className="do-oog">Wat zit erin?</p>
            <h2 className="do-h2">Alles in <span style={{ display: "block" }}>één onderhoudsbeurt.</span></h2>
            <div className="do-stappen">
              {inbegrepen.map((s, i) => {
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
            <button type="button" className="do-knop do-knop-g" onClick={() => setBezoekOpen(true)}><CalendarCheck size={18} />Vraag Dakzorg aan</button>
          </div>
        </div>
      </section>

      {/* Prijs */}
      <section id="dakzorg-prijs" className="do-sectie do-wit" style={{ scrollMarginTop: 100 }}>
        <div className="do-wrap dz-prijs">
          <div>
            <p className="do-oog">Prijs</p>
            <h2 className="do-h2">Een vaste prijs, <span style={{ display: "block" }}>vooraf afgesproken.</span></h2>
            <p className="do-p" style={{ marginTop: 18 }}>De prijs hangt af van de grootte van je dak. Je weet vooraf exact waar je aan toe bent.</p>
            <ul className="dz-zekerheden">
              <li><CheckCircle2 size={18} color="#9BCB6C" aria-hidden="true" />Mos krijgt geen kans</li>
              <li><CheckCircle2 size={18} color="#9BCB6C" aria-hidden="true" />Kleine herstellingen inbegrepen</li>
              <li><CheckCircle2 size={18} color="#9BCB6C" aria-hidden="true" />Rapport na elke beurt</li>
            </ul>
          </div>
          <div className="dz-plan">
            <div className="dz-plan-kop">
              <span className="dz-plan-naam">MOS-X Dakzorg</span>
              <span className="dz-plan-label">Op maat</span>
            </div>
            <div className="dz-plan-prijs"><small>vanaf</small><b>€250</b><span>per onderhoudsbeurt</span></div>
            <p className="dz-plan-ritme">Antimosbehandeling met dakinspectie.</p>
            <p className="dz-plan-kies">Inbegrepen</p>
            <ul>
              {inbegrepen.map((i) => <li key={i.titel}><CheckCircle2 size={18} color="#9BCB6C" aria-hidden="true" />{i.titel}</li>)}
            </ul>
            <button type="button" className="do-knop do-knop-g" onClick={() => setBezoekOpen(true)}>Vraag Dakzorg aan<ChevronRight size={17} /></button>
            <p className="dz-plan-noot">Grote herstellingen via aparte offerte</p>
          </div>
        </div>
      </section>

      {/* Met of zonder */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="do-kop">
            <div>
              <p className="do-oog">Het verschil</p>
              <h2 className="do-h2">Met of zonder <span>Dakzorg.</span></h2>
            </div>
            <p className="do-p">Een dak dat regelmatig onderhouden wordt, gaat jaren langer mee.</p>
          </div>
          <div className="dz-vgl">
            <div className="dz-vgl-kop"><span>Zonder Dakzorg</span><span>Met MOS-X Dakzorg</span></div>
            {vergelijk.map((v) => (
              <div key={v.met} className="dz-vgl-rij">
                <span><X size={17} color="#B0B6AC" aria-hidden="true" />{v.zonder}</span>
                <span><CheckCircle2 size={17} color="#9BCB6C" aria-hidden="true" />{v.met}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="do-sectie do-wit">
        <div className="do-wrap">
          <div className="do-kop">
            <div>
              <p className="do-oog">Veelgestelde vragen</p>
              <h2 className="do-h2">Alles over <span>Dakzorg.</span></h2>
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
                  {open && <div className="do-antwoord"><p>{f.a}</p></div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Afsluiter */}
      <section className="do-sectie do-wit" style={{ paddingTop: 0 }}>
        <div className="do-wrap">
          <div className="do-cta">
            <div>
              <h2>Klaar voor een <span style={{ whiteSpace: "nowrap" }}>zorgeloos dak?</span></h2>
              <p>Antimos en dakinspectie in één beurt, al vanaf €250.</p>
              <GoogleScore donker />
            </div>
            <div className="do-cta-knoppen">
              <button type="button" className="do-knop do-knop-g" onClick={() => setBezoekOpen(true)}>Vraag Dakzorg aan<ChevronRight size={17} /></button>
              <a className="do-knop do-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
            </div>
          </div>
        </div>
      </section>

      <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} defaultDienst="MOS-X Dakzorg" bron="Dakzorg pagina" titel="Vraag Dakzorg aan" subtitel="We nemen contact op en plannen een datum." voorbeeld="Bv. Mijn dak werd vorig jaar gereinigd. Een beurt in het voorjaar zou ideaal zijn." />
    </PageLayout>
  );
}
