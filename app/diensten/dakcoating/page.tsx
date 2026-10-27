"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarCheck, CheckCircle2, ChevronDown, ChevronRight, Download, Palette, Phone, ShieldCheck, X } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import BeforeAfterSlider from "@/components/before-after-slider";
import GoogleBalk from "@/components/google-balk";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import GoogleScore from "@/components/google-score";
import { DIENST_CSS } from "@/components/dienst-stijl";
import { DAKKLEUREN } from "@/lib/dakkleuren";

const stappen = [
  { titel: "Grondige dakreiniging", tekst: "Een coating hecht enkel op een proper dak. Daarom reinigen we je dak eerst grondig en verwijderen we mos, algen en vuil, zonder hoge druk." },
  { titel: "Afplakken en voorbereiding", tekst: "Ramen, zonnepanelen, veranda's, schouwen en andere onderdelen schermen we zorgvuldig af, zodat de werken veilig en netjes verlopen." },
  { titel: "Eerste coatinglaag", tekst: "We brengen een eerste laag watergedragen dakcoating aan met een professionele airless spuitmachine, met een antimosprimer voor een optimale hechting." },
  { titel: "Tweede coatinglaag", tekst: "Zodra de eerste laag volledig is uitgehard, brengen we een tweede laag aan in de gekozen kleur. Zo ontstaat een duurzame, egale beschermlaag." },
  { titel: "Controle en afwerking", tekst: "We verwijderen alle beschermingsmaterialen en controleren het volledige dak, zodat alles netjes wordt achtergelaten." },
];

const vervangen = [
  "Hoge investering",
  "Volledig dak uitbreken",
  "Weken wachten op materiaal",
  "Lawaai, stof en containers",
];

const coaten = [
  "Een fractie van de prijs",
  "Je bestaande dak blijft",
  "Meestal in 1 dag klaar",
  "Geen afbraak of overlast",
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
  { q: "Hoeveel garantie krijg ik op de coating?", a: "Je krijgt 10 jaar garantie op de hechting van de coating. Dat wil zeggen dat de coating aan je pannen blijft hechten en niet afbladert. Een kleur die door zon en weer wat verbleekt, valt daar niet onder." },
  { q: "Wanneer is dakcoating nodig?", a: "Wanneer betonpannen of kunstleien poreus geworden zijn en hun beschermlaag verloren hebben. Tijdens het plaatsbezoek bekijken we de staat van je dak en geven we eerlijk advies." },
  { q: "Voor welke daken is dakcoating geschikt?", a: "Dakcoating gebruiken we vooral op betonpannen en kunstleien. Voor andere daktypes volstaat meestal een professionele reiniging met een antimosbehandeling." },
  { q: "Moet het dak eerst gereinigd worden?", a: "Ja. Voor een goede hechting reinigen we het dak eerst grondig. Pas daarna brengen we de coating aan." },
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

  return (
    <PageLayout>
      <style>{DIENST_CSS + COATING_CSS}</style>

      {/* Hero */}
      <section className="do-hero">
        <video src="/videos/Dakcoating.mp4" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        <div className="do-wrap">
          <div className="do-hero-tekst">
            <BackLink href="/diensten" dark />
            <p className="do-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" /><Link href="/diensten">Diensten</Link><ChevronRight size={13} color="#9BCB6C" />Dakcoaten</p>
            <p className="do-oog">Dakcoaten</p>
            <h1 className="do-h1">Geef je dak opnieuw <span>kleur en bescherming.</span></h1>
            <p className="do-p">Na jaren regen, zon en vorst verliezen dakpannen hun beschermlaag en hun kleur. Na een grondige reiniging geven we je dak met een professionele coating een nieuwe afwerking, zonder het te moeten vervangen.</p>
            <div className="do-hero-knoppen">
              <a className="do-knop do-knop-g mx-glow" href="/#calculator">Bereken je richtprijs<ChevronRight size={17} /></a>
              <button type="button" className="do-knop do-knop-d" onClick={() => setBezoekOpen(true)}>Plan een gratis plaatsbezoek</button>
            </div>
            <div className="do-hero-bewijs">
              <GoogleBalk />
              <span className="do-garantie-chip"><ShieldCheck size={18} color="#9BCB6C" aria-hidden="true" /><b>10&nbsp;jaar</b> garantie</span>
            </div>
          </div>
        </div>
      </section>

      {/* Waarom */}
      <section className="do-sectie do-wit">
        <div className="do-wrap do-waarom">
          <div className="do-slider">
            <img src="/images/IMG_4584 Vooraanzicht dakcoating.JPEG" alt="Dak met een nieuwe coating in antraciet, van bovenaf gezien" style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", display: "block" }} />
          </div>
          <div>
            <p className="do-oog">Waarom coaten?</p>
            <h2 className="do-h2">Je dak opnieuw beschermd. <span style={{ display: "block" }}>En weer als nieuw.</span></h2>
            <div className="do-uitleg">
              <p className="do-p">Na jaren regen, zon en vorst verliezen dakpannen hun beschermlaag. Ze worden poreus, nemen meer vocht op, verkleuren en mos krijgt sneller vat.</p>
              <p className="do-p">Een coating geeft je pannen opnieuw een beschermlaag, net zoals de originele laag uit de fabriek. Je dak ziet er weer als nieuw uit en gaat jaren langer mee, zonder dat je het moet vervangen.</p>
            </div>
            <dl className="do-feiten">
              <div><dt>Als nieuw</dt><dd>uit de fabriek</dd></div>
              <div><dt>10 jaar</dt><dd>op hechting</dd></div>
              <div><dt>1 dag</dt><dd>meestal klaar</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* Garantie */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="do-garantie">
            <div className="do-zegel" aria-hidden="true"><div><b>10</b><small>jaar<span className="zg-x"> garantie</span></small></div></div>
            <div>
              <p className="do-oog">Onze garantie</p>
              <h2>10&nbsp;jaar garantie <span>op de hechting.</span></h2>
              <p className="do-p" style={{ maxWidth: 560 }}>De coating blijft 10&nbsp;jaar hechten aan je pannen en bladert niet af.</p>
            </div>
            <a className="do-knop do-knop-g" href="/#calculator">Bereken je richtprijs<ChevronRight size={17} /></a>
          </div>
        </div>
      </section>

      {/* Vervangen of coaten */}
      <section className="do-sectie do-wit">
        <div className="do-wrap">
          <div className="do-kop">
            <div>
              <p className="do-oog">Vervangen of coaten?</p>
              <h2 className="do-h2">Een vernieuwd dak, <span>zonder renovatie.</span></h2>
            </div>
            <p className="do-p">Is je dak nog gezond? Dan geeft een coating het een tweede leven.</p>
          </div>
          <div className="dc-vs">
            <div className="dc-kaart">
              <h3>Dak vervangen</h3>
              <ul>{vervangen.map((t) => <li key={t}><X size={18} color="#8E8E89" aria-hidden="true" />{t}</li>)}</ul>
            </div>
            <div className="dc-kaart goed">
              <h3>Dak coaten <span className="dc-label">Slimmer</span></h3>
              <ul>{coaten.map((t) => <li key={t}><CheckCircle2 size={18} color="#9BCB6C" aria-hidden="true" />{t}</li>)}</ul>
            </div>
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
            <button type="button" className="do-knop do-knop-g" onClick={() => setBezoekOpen(true)}><CalendarCheck size={18} />Plan een gratis plaatsbezoek</button>
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
              <Link className="do-knop do-knop-g" href="/#dakkleur"><Palette size={18} />Zie je dak in een nieuwe kleur</Link>
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

      {/* FAQ */}
      <section className="do-sectie do-wit">
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
                      {f.cta && <a className="do-knop do-knop-g" style={{ height: 44, marginTop: 6, fontSize: 14 }} href="/#calculator">Bereken je richtprijs<ChevronRight size={16} /></a>}
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
