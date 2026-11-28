"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Check, ChevronDown, ChevronRight, Loader2, Phone } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import BeforeAfterSlider from "@/components/before-after-slider";
import HeroVertrouwen from "@/components/hero-vertrouwen";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import WerkgebiedCheck from "@/components/werkgebied-check";
import SiteDakkleurBanner from "@/components/site-dakkleur-banner";
import SiteReviews from "@/components/site-reviews";
import { DIENST_CSS } from "@/components/dienst-stijl";
import { COATING_CSS } from "@/components/coating-stijl";

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
            <h1 className="do-h1 dc-h1"><b>Je dak gaat tot</b> <b><em>15 jaar langer mee.</em></b></h1>
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
            <div className="dc-knoppen">
              <Link className="do-knop do-knop-g mx-glow" href="/#calculator">Bereken mijn richtprijs<ChevronRight size={17} /></Link>
              <button type="button" className="do-knop do-knop-d" onClick={() => setBezoekOpen(true)}><CalendarCheck size={17} />Gratis plaatsbezoek</button>
            </div>
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
          <div className="dc-knoppen dc-knoppen-midden">
            <Link className="do-knop do-knop-g mx-glow" href="/#calculator">Bereken mijn richtprijs<ChevronRight size={17} /></Link>
            <button type="button" className="do-knop do-knop-licht" onClick={() => setBezoekOpen(true)}><CalendarCheck size={17} />Plan een gratis plaatsbezoek</button>
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
              <div key={r.voor} className="dc-res">
                <BeforeAfterSlider beforeSrc={r.voor} afterSrc={r.na} borderRadius="0" aspectRatio="4/3" />
              </div>
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
              <p className="dc-eind-p">Bereken online meteen je richtprijs. Gratis en vrijblijvend.</p>
              <ul className="dc-eind-lijst">
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />Vaste prijs, geen verrassingen</li>
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />10 jaar garantie op de coating</li>
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />Gratis plaatsbezoek en advies</li>
              </ul>
              <div className="dc-eind-knoppen">
                <Link className="do-knop do-knop-g mx-glow dc-eind-hoofd" href="/#calculator">Bereken mijn richtprijs<ChevronRight size={18} /></Link>
                <button type="button" className="do-knop do-knop-d" onClick={() => setBezoekOpen(true)}><CalendarCheck size={17} />Gratis plaatsbezoek</button>
              </div>
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
