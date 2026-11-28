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
import SiteReviews from "@/components/site-reviews";
import { DIENST_CSS } from "@/components/dienst-stijl";
import { COATING_CSS } from "@/components/coating-stijl";

const info: { q: string; a: string; cta?: boolean }[] = [
  { q: "Hoe werkt hydrofuge?", a: "Betonpannen zijn poreus. Na verloop van tijd slijt de toplaag en begint de pan water op te nemen in plaats van het te laten aflopen. Een vochtige pan is een voedingsbodem voor mos, algen en korstmos, en in de winter bevriest dat water en zet het uit in de poriën. Net die vorst breekt de pan uiteindelijk af. Hydrofuge legt een waterafstotende laag in de bovenste millimeters van de pan: het water parelt af en de poriën blijven de hele winter droog.\n\nHet werk start altijd met een grondige dakreiniging. Mos, vuil en losse deeltjes verwijderen we met aangepaste druk. Daarna brengen we de hydrofuge aan op een volledig droog dak, bij voorkeur in twee lagen op de meest blootgestelde delen. Je dak houdt zijn originele kleur." },
  { q: "Wanneer kies je beter iets anders?", a: "We zeggen vaker nee dan je zou denken. Hydrofuge gaat ervan uit dat de pan nog een stevig oppervlak heeft. Brokkelt het oppervlak af tussen je vingers, dan heeft de behandeling weinig zin. Hetzelfde geldt voor daken met veel gebarsten pannen, een slecht onderdak of zichtbare lekken. Dan zeggen we het je liever meteen.\n\nIs je dak ouder maar nog stevig, dan is MOS-MAX meestal de betere keuze. Die bouwt een volledig nieuwe beschermlaag op en gaat een stuk langer mee. Heb je enkel mos op een verder nieuw dak, dan is MOS-PLUS ideaal: het mos moet sowieso weg, en daarna sluiten we de poriën." },
  { q: "Wat kost MOS-PLUS?", a: "De prijs hangt af van de staat van je dak, de helling, de bereikbaarheid en hoeveel mos er eerst weg moet. De dakreiniging zit altijd inbegrepen. Na het plaatsbezoek krijg je een vaste prijs: offerte = factuur, geen verrassingen achteraf.", cta: true },
  { q: "Hydrofuge of een coating?", a: "Hydrofuge is een dun, kleurloos middel dat in de pan trekt. Het vormt geen nieuwe laag zoals een coating, dus je pannen houden hun originele uitzicht. De bescherming gaat 5 à 7 jaar mee.\n\nEen coating (MOS-MAX) geeft je dak een volledig nieuwe beschermlaag en een egale kleur, en gaat een stuk langer mee. Bij het plaatsbezoek zeggen we je eerlijk wat je dak nodig heeft." },
];

const misverstanden: { q: string; a: string }[] = [
  { q: "Hydrofuge en een coating zijn hetzelfde.", a: "Nee. Hydrofuge is een dun, kleurloos middel dat in de pan trekt en ze waterafstotend maakt. Het vormt geen nieuwe laag zoals een coating, en je pannen houden hun originele uitzicht en ruwe oppervlak. De bescherming gaat normaal 5 à 7 jaar mee. MOS-PLUS is daarom een eenvoudigere en goedkopere oplossing voor nieuwere daken in goede staat, maar gaat minder lang mee dan een coating.\n\nOmdat de behandeling kleurloos is, kies je MOS-PLUS ook als je het uitzicht van je dak wil behouden. Heb je meerkleurige pannen of een tint die je mooi vindt, dan blijft die zoals ze is. Een coating geeft je dak één egale kleur." },
  { q: "Het kost bijna evenveel als een nieuw dak.", a: "Nee. Een nieuw dak betekent nieuwe pannen, latten, folie, stellingen en weken werk. MOS-PLUS kost maar een klein deel daarvan, en de dakreiniging zit er al in." },
  { q: "Het houdt maar een paar jaar, dan is het mos terug.", a: "Op een dak in goede staat gaat MOS-PLUS 5 à 7 jaar mee. Omdat de pan droog blijft, krijgt mos veel minder kans om zich vast te zetten. En je krijgt 5 jaar garantie op de werking." },
  { q: "Nieuwere dakpannen hebben niets nodig.", a: "Ook nieuwe pannen verliezen na enkele jaren hun beschermlaag van de fabriek. Net dan is hydrofuge het meest zinvol: de pan is nog gezond, en zo blijft ze langer droog en mosvrij." },
  { q: "Ik koop het middel en doe het zelf.", a: "Dat kan, maar het resultaat hangt af van de voorbereiding. Het dak moet eerst grondig gereinigd en volledig droog zijn, en het middel moet gelijkmatig aangebracht worden. Bovendien sta je op hoogte zonder beveiliging. Wij doen het met de juiste uitrusting, en je krijgt garantie." },
  { q: "Is het mos wegschrapen niet beter?", a: "Schrapen haalt het zichtbare mos weg, maar de sporen blijven zitten en de pan blijft water opnemen. Zonder behandeling erna komt het mos snel terug." },
  { q: "Er is geen haast, het dak ziet er goed uit.", a: "Net daarom. Hydrofuge werkt enkel zolang het oppervlak van de pan nog gezond is. Wacht je te lang, dan is dat oppervlak versleten en heb je een coating nodig, en die kost meer." },
];

const resultaten = [
  { voor: "/images/koningshooikt-voor.jpg", na: "/images/koningshooikt-na.jpg" },
  { voor: "/images/olen-voor.png", na: "/images/olen-na.png" },
  { voor: "/images/Voor dakreiniging slider.png", na: "/images/Na dakreiniging slider.png" },
];

const faqs: { q: string; a: string; cta?: boolean }[] = [
  { q: "Welke garantie krijg ik?", a: "Je krijgt 5 jaar garantie op de werking van MOS-PLUS: je pannen blijven waterafstotend." },
  { q: "Voor welke daken is MOS-PLUS geschikt?", a: "Voor nieuwere daken, meestal vijf tot tien jaar oud, waarvan de pannen nog een stevig oppervlak hebben. Bij het plaatsbezoek kijken we of je dak geschikt is." },
  { q: "Verandert mijn dak van kleur?", a: "Nee. Het middel is kleurloos. Je dak houdt zijn originele kleur en uitzicht, ook als je meerkleurige pannen hebt." },
  { q: "Wordt het dak eerst gereinigd?", a: "Ja, de dakreiniging zit altijd inbegrepen. We brengen de hydrofuge pas aan als het dak volledig droog is." },
  { q: "Hoelang gaat het mee?", a: "Op een dak in goede staat gaat MOS-PLUS 5 à 7 jaar mee. Daarna kan je de behandeling gewoon herhalen." },
  { q: "Wat kost MOS-PLUS?", a: "De prijs hangt af van de oppervlakte, de bereikbaarheid en de staat van je dak. Bereken vrijblijvend je richtprijs, dan weet je meteen waar je aan toe bent.", cta: true },
];

const PLUS_CSS = `
  .mp-hero::after { display: none; }
  .mp-hero::before { background: radial-gradient(700px 420px at 80% 40%, rgba(155,203,108,0.14), transparent 70%), linear-gradient(160deg, #13201A 0%, #0B0F0C 70%) !important; }
  .mp-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: 64px; align-items: center; }
  .mp-hero .do-hero-tekst { max-width: 640px; }
  .mp-video { position: relative; justify-self: end; width: 100%; max-width: 380px; aspect-ratio: 9 / 13; overflow: hidden; border-radius: 20px; background: #0B0F0C;
    border: 1px solid rgba(155,203,108,0.4); box-shadow: 0 30px 70px -30px rgba(0,0,0,0.8), 0 0 0 6px rgba(155,203,108,0.08); }
  .mp-hero .mp-video video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 60%; z-index: 0; }
  .mp-video-label { position: absolute; top: 0; left: 0; right: 0; z-index: 1; display: flex; align-items: center; gap: 8px; padding: 12px 16px;
    background: linear-gradient(180deg, rgba(11,15,12,0.85), rgba(11,15,12,0)); font: 700 11px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #FFFFFF; }
  .mp-video-label i { width: 8px; height: 8px; border-radius: 50%; background: #9BCB6C; box-shadow: 0 0 0 4px rgba(155,203,108,0.25); }
  @media (max-width: 640px) { .mp-hero .dc-h1 { font-size: 7.4vw; } }
  @media (max-width: 960px) {
    .mp-grid { grid-template-columns: minmax(0, 1fr); gap: 36px; }
    .mp-video { justify-self: center; max-width: 340px; }
  }
`;

function WhatsAppIcoon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function HydrofugePage() {
  const [openInfo, setOpenInfo] = useState<number | null>(null);
  const [openMv, setOpenMv] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bezoekOpen, setBezoekOpen] = useState(false);
  const [belStatus, setBelStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function belMij(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBelStatus("sending");
    const fd = new FormData(e.currentTarget);
    fd.set("dienst", "hydrofuge");
    fd.set("bericht", "Terugbelverzoek MOS-PLUS (hydrofuge)");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      setBelStatus(res.ok ? "ok" : "error");
    } catch {
      setBelStatus("error");
    }
  }

  return (
    <PageLayout>
      <style>{DIENST_CSS + COATING_CSS + PLUS_CSS}</style>

      {/* Hero */}
      <section className="do-hero dc-hero mp-hero">
        <div className="do-wrap mp-grid">
          <div className="do-hero-tekst">
            <BackLink href="/#diensten" dark />
            <p className="do-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" /><Link href="/#diensten">Diensten</Link><ChevronRight size={13} color="#9BCB6C" />MOS-PLUS</p>
            <p className="do-oog">MOS-PLUS · Hydrofuge</p>
            <h1 className="do-h1 dc-h1"><b>Hydrofuge voor daken</b> <b><em>die nog fris zijn.</em></b></h1>
            <p className="do-p">MOS-PLUS is onze hydrofuge voor nieuwere daken die enkel een opfrisbeurt nodig hebben. We verwijderen mos en algen en brengen een kleurloos middel aan dat diep in de pan trekt en ze waterafstotend maakt. Je dak verandert niet van uitzicht, dus ook ideaal voor meerkleurige pannen.</p>
            <ul className="dc-hero-vink">
              <li><i><Check size={14} strokeWidth={3.2} /></i>Gaat 5 à 7 jaar mee op daken in goede staat</li>
              <li><i><Check size={14} strokeWidth={3.2} /></i>Dakreiniging inbegrepen in de prijs</li>
              <li><i><Check size={14} strokeWidth={3.2} /></i>De tussenstap tussen een reiniging en een coating</li>
            </ul>
            <div className="do-hero-knoppen">
              <Link className="do-knop do-knop-g mx-glow" href="/#calculator">Bereken je prijs in 60 seconden<ChevronRight size={17} /></Link>
              <a className="do-knop do-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
            </div>
            <HeroVertrouwen />
          </div>
          <div className="mp-video">
            <video src="/videos/hydrofuge.mp4" poster="/images/hydrofuge-poster.jpg" autoPlay muted loop playsInline preload="metadata" aria-label="Video: water parelt af van een behandelde dakpan" />
            <span className="mp-video-label"><i aria-hidden="true" />MOS-PLUS in 15 seconden</span>
          </div>
        </div>
      </section>

      {/* Werkgebied */}
      <WerkgebiedCheck />

      {/* Uitleg + terugbelkaart */}
      <section className="do-sectie do-wit">
        <div className="do-wrap dc-info">
          <div>
            <p className="do-oog">Over de behandeling</p>
            <h2 className="do-h2">Wanneer loont hydrofuge, <span>en wanneer niet?</span></h2>
            <p className="do-p" style={{ marginTop: 16 }}>MOS-PLUS is de keuze als je dak vijf tot tien jaar oud is en de beschermlaag van de fabriek nog intact is. De behandeling maakt geen nieuw oppervlak, ze maakt het bestaande waterafstotend. Na vijf à zeven jaar is het middel uit de pan verdwenen. Je krijgt 5 jaar garantie op de werking.</p>
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

          <aside className="dc-bel" aria-label="Laat je terugbellen over MOS-PLUS">
            <p className="dc-bel-oog">MOS-PLUS</p>
            <h3>Wat kost MOS&#8209;PLUS?</h3>
            <p className="dc-bel-sub">Een opfrisbeurt voor nieuwere daken. We meten gratis op en je krijgt een vaste prijs. Laat je naam en nummer achter, dan bellen we je.</p>
            {belStatus === "ok" ? (
              <p className="dc-bel-ok" role="status">Bedankt! We bellen je snel terug.</p>
            ) : (
              <form onSubmit={belMij}>
                <input name="voornaam" placeholder="Je naam" required autoComplete="name" aria-label="Je naam" />
                <input name="telefoon" type="tel" placeholder="Je telefoonnummer" required autoComplete="tel" aria-label="Je telefoonnummer" />
                <button type="submit" className="do-knop do-knop-g" disabled={belStatus === "sending"}>
                  {belStatus === "sending" ? <Loader2 size={17} className="zk-spin" /> : <Phone size={17} />}Bel mij terug
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
                  <div className="dc-acc-tekst"><div>{m.a.split("\n\n").map((t) => <p key={t.slice(0, 24)}>{t}</p>)}</div></div>
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
            <h2 className="do-h2">Alles over <span>MOS&#8209;PLUS.</span></h2>
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
              <a className="do-knop do-knop-g" href="https://wa.me/32468352869?text=Hallo%2C%20ik%20heb%20een%20vraag%20over%20MOS-PLUS." target="_blank" rel="noopener noreferrer"><WhatsAppIcoon />Stel je vraag</a>
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
              <h2>Wat kost MOS&#8209;PLUS <span>voor jouw dak?</span></h2>
              <p className="dc-eind-p">Bereken online meteen je richtprijs. Gratis en vrijblijvend.</p>
              <ul className="dc-eind-lijst">
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />Vaste prijs, geen verrassingen</li>
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />5 jaar garantie op de werking</li>
                <li><Check size={15} strokeWidth={3} aria-hidden="true" />Dakreiniging inbegrepen</li>
              </ul>
              <div className="dc-eind-knoppen">
                <Link className="do-knop do-knop-g mx-glow dc-eind-hoofd" href="/#calculator">Bereken mijn richtprijs<ChevronRight size={18} /></Link>
                <button type="button" className="do-knop do-knop-d" onClick={() => setBezoekOpen(true)}><CalendarCheck size={17} />Gratis plaatsbezoek</button>
              </div>
            </div>
            <div className="dc-eind-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="dc-eind-foto" src="/images/menu-dakreiniging.webp" alt="Dak tijdens een dakreiniging" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} defaultDienst="Dakreiniging" bron="MOS-PLUS pagina" />
    </PageLayout>
  );
}
