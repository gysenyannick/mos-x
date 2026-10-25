"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarCheck, Download, CheckCircle2, ChevronDown, ChevronRight, CloudRain, Droplets, Leaf, Phone, ShieldCheck, Sparkles } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import BeforeAfterSlider from "@/components/before-after-slider";
import GoogleBalk from "@/components/google-balk";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import { DIENST_CSS } from "@/components/dienst-stijl";

const stappen = [
  { titel: "Dakcontrole en voorbereiding", tekst: "We starten met een grondige controle van je dak en vervangen meteen eventuele gebroken pannen of leien." },
  { titel: "Professionele dakreiniging", tekst: "Mos, algen en vervuiling verwijderen we met een (stoom)hogedrukunit, aangevuld met een vuilfrees die ook de moeilijkste hoekjes bereikt. Zo blijft de druk laag en je dakbedekking veilig." },
  { titel: "Controle na de reiniging", tekst: "Na het reinigen controleren we het volledige dak opnieuw, zodat verborgen aandachtspunten zichtbaar worden." },
  { titel: "Antimosbehandeling", tekst: "We behandelen je dak met een preventief, biologisch afbreekbaar antimosmiddel, zodat mos minder snel terugkomt." },
  { titel: "Omgeving netjes achtergelaten", tekst: "We maken muren, terras en dakgoten netjes op, zodat je meteen kan genieten van een volledig verzorgd resultaat." },
];

const voordelen = [
  { Icoon: Leaf, titel: "Geen loskomend mos rond je woning" },
  { Icoon: Droplets, titel: "Minder kans op verstopte dakgoten" },
  { Icoon: CloudRain, titel: "Minder kans op vochtproblemen" },
  { Icoon: ShieldCheck, titel: "Een langere levensduur voor je dak" },
  { Icoon: Sparkles, titel: "Een frisse uitstraling voor je woning" },
  { Icoon: CheckCircle2, titel: "2 jaar mosvrij, gegarandeerd" },
];

const daktypes = [
  { label: "Betonpannen", img: "/images/Betonpannen.jpg" },
  { label: "Keramische pannen", img: "/images/Keramische pannen.jpg" },
  { label: "Tegelpannen", img: "/images/Tegelpannen.jpg" },
  { label: "Kunstleien", img: "/images/Kunstleien.png" },
  { label: "Natuurleien", img: "/images/Leien dak.jpeg" },
  { label: "Metalen daken", img: "/images/Metalen daken.jpg" },
];

const resultaten = [
  { plaats: "Dakreiniging", voor: "/images/koningshooikt-voor.jpg", na: "/images/koningshooikt-na.jpg", info: "Koningshooikt · betonpannen" },
  { plaats: "Dakreiniging en antimos", voor: "/images/olen-voor.png", na: "/images/olen-na.png", info: "Olen · keramische pannen" },
  { plaats: "Dakreiniging en antimos", voor: "/images/Voor dakreiniging slider.png", na: "/images/Na dakreiniging slider.png", info: "Mos en aanslag volledig verwijderd" },
];

const faqs: { q: string; a: string; cta?: boolean }[] = [
  { q: "Wat houdt de 2 jaar mosvrij-garantie in?", a: "Na een dakontmossing bij MOS-X blijft je dak 2 jaar mosvrij. Komt er binnen die 2 jaar toch opnieuw mos op je dak, dan komen we langs en brengen we gratis, op onze kosten, een nieuwe antimosbehandeling aan." },
  { q: "Wat kost een dakreiniging?", a: "Geen enkel dak is hetzelfde. De prijs hangt af van de oppervlakte, bereikbaarheid, vervuiling, het type dakbedekking en de gekozen afwerking.\n\nDaarom werken we niet met standaardprijzen per m², maar bekijken we jouw dak persoonlijk, zodat je een correcte richtprijs ontvangt.", cta: true },
  { q: "Hoe lang blijft mijn dak proper?", a: "Dat hangt af van de ligging van je woning, de hoeveelheid bomen rondom en de weersomstandigheden. Met de antimosbehandeling of MOS-X Dakzorg blijft je dak doorgaans langer proper." },
  { q: "Hoe vaak moet je een dak laten reinigen?", a: "Een dak met veel schaduw, bomen of vocht vervuilt sneller dan een dak dat veel zon krijgt.\n\nGemiddeld volstaat een professionele reiniging om de 7 à 10 jaar. Een controle om de 2 à 3 jaar helpt om beginnende mosvorming tijdig op te merken." },
  { q: "Is een dakcoating nodig na het reinigen?", a: "Niet verplicht, maar afhankelijk van de staat van je dak kan het sterk aanbevolen zijn. Een coating brengt opnieuw een beschermlaag aan die helpt tegen:\n✓ vochtopname\n✓ weersinvloeden\n✓ vorstschade\n✓ nieuwe mosvorming" },
  { q: "Wat doen jullie bewust niet?", a: "Een verkeerde aanpak kan meer schade veroorzaken dan oplossen. Daarom vermijden we:\n✓ extreem hoge werkdruk\n✓ agressieve producten zoals bleekwater, javel of chloor\n✓ schadelijke chemische behandelingen" },
  { q: "Welke kleine herstellingen kunnen jullie uitvoeren?", a: "Kleine herstellingen nemen we vaak meteen mee:\n✓ beschadigde dakpannen vervangen\n✓ nokpannen herstellen of vernieuwen\n✓ nokken uitcementeren\n✓ vogelwering plaatsen\n✓ kleine herstellingen aan dakgoten of afvoer" },
  { q: "Wat gebeurt er met mos en vuil na de reiniging?", a: "Alle losgekomen mos, vuil en resten verzamelen we zorgvuldig. We nemen het afval mee en verwerken het correct. Wil je het zelf gebruiken als groenafval of compost, laat het ons gerust weten." },
  { q: "Reinigen jullie asbesthoudende daken?", a: "Nee. Asbesthoudende dakmaterialen mogen volgens de huidige regelgeving niet gereinigd of ontmost worden. Bij twijfel bekijken we dit vooraf." },
];

function WhatsAppIcoon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function Antwoord({ tekst }: { tekst: string }) {
  return (
    <>
      {tekst.split("\n").map((r, i) =>
        r.startsWith("✓") ? (
          <span key={i} className="do-vink"><CheckCircle2 size={17} color="#9BCB6C" aria-hidden="true" />{r.replace("✓", "").trim()}</span>
        ) : r.trim() === "" ? null : (
          <p key={i}>{r}</p>
        ),
      )}
    </>
  );
}

export default function DakontmossingPage() {
  const [openStap, setOpenStap] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [bezoekOpen, setBezoekOpen] = useState(false);

  return (
    <PageLayout>
      <style>{DIENST_CSS}</style>

      {/* Hero */}
      <section className="do-hero">
        <video src="/videos/dakreiniging-hero.mp4" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        <div className="do-wrap">
          <div className="do-hero-tekst">
            <BackLink href="/diensten" dark />
            <p className="do-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" /><Link href="/diensten">Diensten</Link><ChevronRight size={13} color="#9BCB6C" />Dakontmossen</p>
            <p className="do-oog">Dakontmossen</p>
            <h1 className="do-h1">Geef je dak opnieuw <span>jaren bescherming.</span></h1>
            <p className="do-p">Mos en vuil houden vocht vast en laten je dak sneller verouderen. We verwijderen ze veilig, zonder hoge druk, en beschermen je dak met een antimosbehandeling.</p>
            <div className="do-hero-knoppen">
              <a className="do-knop do-knop-g" href="/#calculator">Bereken je richtprijs<ChevronRight size={17} /></a>
              <button type="button" className="do-knop do-knop-d" onClick={() => setBezoekOpen(true)}>Plan een gratis plaatsbezoek</button>
            </div>
            <div className="do-hero-bewijs">
              <GoogleBalk />
              <span className="do-garantie-chip"><ShieldCheck size={18} color="#9BCB6C" aria-hidden="true" /><b>2 jaar</b> mosvrij-garantie</span>
            </div>
          </div>
        </div>
      </section>

      {/* Waarom */}
      <section className="do-sectie do-wit">
        <div className="do-wrap do-waarom">
          <div className="do-slider">
            <BeforeAfterSlider beforeSrc="/images/Before slider 2.0.png" afterSrc="/images/After slide 2.0.png" borderRadius="0" aspectRatio="4/3" />
          </div>
          <div>
            <p className="do-oog">Waarom ontmossen?</p>
            <h2 className="do-h2">Voorkom problemen. <span>Geniet opnieuw van een verzorgd dak.</span></h2>
            <ul className="do-voordelen">
              {voordelen.map(({ Icoon, titel }) => (
                <li key={titel}><i><Icoon size={20} color="#9BCB6C" /></i>{titel}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Garantie */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="do-garantie">
            <div className="do-zegel" aria-hidden="true"><div><b>2</b><small>jaar mosvrij</small></div></div>
            <div>
              <p className="do-oog">Onze garantie</p>
              <h2>2 jaar mosvrij. <span>Gegarandeerd.</span></h2>
              <p className="do-p" style={{ maxWidth: 560 }}>Komt er binnen 2 jaar na de ontmossing toch opnieuw mos op je dak? Dan komen we langs en brengen we gratis, op onze kosten, een nieuwe antimosbehandeling aan.</p>
            </div>
            <a className="do-knop do-knop-g" href="/#calculator">Bereken je richtprijs<ChevronRight size={17} /></a>
          </div>
        </div>
      </section>

      {/* Werkwijze */}
      <section className="do-donker">
        <div className="do-wrap do-werk">
          <div className="do-werk-foto">
            <img src="/images/IMG_5900.JPEG" alt="Vakman van MOS-X reinigt een dak, veilig gezekerd met harnas" style={{ objectPosition: "30% 30%" }} />
          </div>
          <div>
            <p className="do-oog">Onze werkwijze</p>
            <h2 className="do-h2">Zo ontmossen we <span>jouw dak.</span></h2>
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
            <button type="button" className="do-knop do-knop-g" onClick={() => setBezoekOpen(true)}><CalendarCheck size={18} />Plan een gratis plaatsbezoek</button>
          </div>
        </div>
      </section>

      {/* Daktypes */}
      <section className="do-sectie do-wit">
        <div className="do-wrap">
          <div className="do-kop">
            <div>
              <p className="do-oog">Welke daken?</p>
              <h2 className="do-h2">Elk dak vraagt <span>zijn eigen aanpak.</span></h2>
            </div>
            <p className="do-p">We stemmen de reiniging af op het type dakbedekking en de staat van je dak.</p>
          </div>
          <div className="do-types">
            {daktypes.map((t) => (
              <div key={t.label} className="do-type"><img src={t.img} alt={t.label} loading="lazy" /><span>{t.label}</span></div>
            ))}
          </div>
          <div className="do-asbest">
            <div>
              <i><AlertTriangle size={20} color="#9BCB6C" /></i>
              <span><b>Zitten er misschien asbestleien op je dak?</b><small>Asbesthoudende daken mogen we niet ontmossen. Check het zelf met onze gratis checklist.</small></span>
            </div>
            <a className="do-knop do-knop-g" style={{ height: 46 }} href="/downloads/MOS-X-asbestchecklist.pdf" download><Download size={17} />Download de checklist</a>
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
                <div><b>{r.plaats}</b><small>{r.info}</small></div>
              </article>
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
              <h2 className="do-h2">Alles over <span>dakontmossing.</span></h2>
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
                      <Antwoord tekst={f.a} />
                      {f.cta && <a className="do-knop do-knop-g" style={{ height: 44, marginTop: 6, fontSize: 14 }} href="/#calculator">Bereken je richtprijs<ChevronRight size={16} /></a>}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="do-faq-meer">
              <b>Staat je vraag er niet bij?</b>
              <a className="do-knop do-knop-g" href="https://wa.me/32468352869?text=Hallo%2C%20ik%20heb%20een%20vraag%20over%20dakontmossing." target="_blank" rel="noopener noreferrer"><WhatsAppIcoon />Stel je vraag</a>
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
            </div>
            <div className="do-cta-knoppen">
              <button type="button" className="do-knop do-knop-g" onClick={() => setBezoekOpen(true)}>Plan een gratis plaatsbezoek<ChevronRight size={17} /></button>
              <a className="do-knop do-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
            </div>
          </div>
        </div>
      </section>

      <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} defaultDienst="Dakreiniging" bron="Dakontmossing pagina" />
    </PageLayout>
  );
}
