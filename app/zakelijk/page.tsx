"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, CalendarClock, CheckCircle2, ChevronRight, ClipboardList, FileText, Handshake, Home, Loader2, Phone, Send, ShieldCheck, Users } from "lucide-react";
import PageLayout from "@/components/page-layout";
import GoogleBalk from "@/components/google-balk";
import GoogleScore from "@/components/google-score";
import { FotoKiezer } from "@/components/foto-kiezer";
import { DIENST_CSS } from "@/components/dienst-stijl";

const doelgroepen = [
  { Icoon: Building2, titel: "Bedrijven en KMO's", tekst: "Kantoren, winkels en bedrijfspanden die er verzorgd moeten bijliggen." },
  { Icoon: Users, titel: "Syndici en VME's", tekst: "Appartementsgebouwen, met duidelijke offertes die je kan voorleggen aan de vergadering." },
  { Icoon: Home, titel: "Vastgoed en verhuur", tekst: "Meerdere panden, één aanspreekpunt en een vaste aanpak voor elk gebouw." },
];

const diensten = [
  { titel: "Dakontmossing", tekst: "Mos, algen en vuil weg, met een antimosbehandeling na.", garantie: "2 jaar mosvrij-garantie", href: "/diensten/dakontmossing" },
  { titel: "Dakcoating", tekst: "Bescherming en een nieuwe uitstraling voor het dak.", garantie: "10 jaar garantie op de hechting", href: "/diensten/dakcoating" },
  { titel: "Onderhoudsplan", tekst: "Vaste opvolging, ook voor meerdere gebouwen samen.", garantie: "Rapport na elke beurt", href: "/diensten/onderhoudsplan" },
];

const voordelen = [
  { Icoon: FileText, titel: "Offerte per gebouw" },
  { Icoon: ClipboardList, titel: "Factuur op firma" },
  { Icoon: CalendarClock, titel: "Planning in overleg" },
  { Icoon: Handshake, titel: "Eén aanspreekpunt" },
  { Icoon: ShieldCheck, titel: "Werk met garantie" },
  { Icoon: CheckCircle2, titel: "Foto's en rapport" },
];

const stappen = [
  { nr: "01", titel: "Aanvraag", tekst: "Je vertelt ons over het gebouw of de gebouwen." },
  { nr: "02", titel: "Plaatsbezoek", tekst: "We bekijken elk dak ter plaatse, gratis." },
  { nr: "03", titel: "Offerte op maat", tekst: "Per gebouw, met een duidelijke prijs vooraf." },
  { nr: "04", titel: "Uitvoering", tekst: "Op het afgesproken moment, met foto's en rapport." },
];

const ZAKELIJK_CSS = `
  .do-hero > img { position: absolute; top: 0; right: 0; bottom: 0; width: 50%; height: 100%; object-fit: cover; z-index: -2; }
  .do-hero .do-p, .zk-kaart p, .zk-stap p { text-wrap: balance; }
  .zk-kaarten { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  .zk-kaart { padding: 28px 26px; border-radius: 18px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
  .zk-kaart i { width: 44px; height: 44px; margin-bottom: 18px; border-radius: 12px; display: grid; place-items: center; background: #F2F8EC; color: #7AB54E; }
  .zk-kaart b { display: block; margin-bottom: 8px; font-size: 18px; font-weight: 800; letter-spacing: -0.01em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .zk-kaart p { margin: 0; font-size: 15px; line-height: 1.6; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
  .zk-dienst { display: flex; flex-direction: column; text-decoration: none; transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease; }
  .zk-dienst:hover { border-color: #CFE5B8; transform: translateY(-2px); box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 18px 36px -24px rgba(30,51,36,0.35); }
  .zk-dienst:active { transform: none; }
  .zk-dienst:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 3px; }
  .zk-dienst small { margin-top: 18px; display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: #7AB54E; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .zk-dienst span { margin-top: auto; padding-top: 18px; display: inline-flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 700; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .zk-stappen { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
  .zk-stap { padding: 26px 24px; border-radius: 18px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
  .zk-stap span { display: inline-grid; place-items: center; width: 40px; height: 40px; margin-bottom: 16px; border-radius: 11px; background: #9BCB6C; color: #FFFFFF; font-size: 14px; font-weight: 800; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .zk-stap b { display: block; margin-bottom: 6px; font-size: 17px; font-weight: 800; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .zk-stap p { margin: 0; font-size: 15px; line-height: 1.6; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }

  .zk-offerte { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 64px; align-items: start; }
  .zk-form { padding: 36px; border-radius: 24px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -50px rgba(30,51,36,0.35); }
  .zk-velden { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .zk-veld { display: grid; gap: 6px; }
  .zk-veld.breed { grid-column: 1 / -1; }
  .zk-veld label { font-size: 13.5px; font-weight: 700; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .zk-veld label span { color: #9BCB6C; }
  .zk-veld label em { font-style: normal; font-weight: 400; color: #8E8E89; }
  .zk-veld input, .zk-veld select, .zk-veld textarea { width: 100%; box-sizing: border-box; padding: 13px 15px; border-radius: 10px; border: 1px solid #E5E7EB; background: #F7F8F6; color: #1A1A1A; font-size: 15px; font-family: var(--font-inter), system-ui, sans-serif; transition: border-color .2s ease, background-color .2s ease, box-shadow .2s ease; }
  .zk-veld textarea { resize: vertical; min-height: 110px; }
  .zk-veld input:hover, .zk-veld select:hover, .zk-veld textarea:hover { border-color: #CFE5B8; }
  .zk-veld input:focus, .zk-veld select:focus, .zk-veld textarea:focus { outline: none; border-color: #9BCB6C; background: #FFFFFF; box-shadow: 0 0 0 4px rgba(155,203,108,0.18); }
  .zk-form .do-knop { width: 100%; margin-top: 22px; }
  .zk-form .do-knop:disabled { opacity: .7; cursor: wait; }
  .zk-noot { margin: 12px 0 0; text-align: center; font-size: 13px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }
  .zk-fout { margin: 12px 0 0; text-align: center; font-size: 14px; color: #B42318; font-family: var(--font-inter), system-ui, sans-serif; }
  .zk-klaar { text-align: center; padding: 24px 0; }
  .zk-klaar b { display: block; margin: 14px 0 6px; font-size: 22px; font-weight: 800; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .zk-klaar p { margin: 0; font-size: 15.5px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
  .zk-spin { animation: zk-spin 1s linear infinite; }
  @keyframes zk-spin { to { transform: rotate(360deg); } }

  @media (max-width: 960px) {
    .do-hero > img { width: 100%; }
    .zk-kaarten, .zk-offerte { grid-template-columns: minmax(0, 1fr); }
    .zk-offerte { gap: 36px; }
    .zk-stappen { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 640px) {
    .zk-stappen, .zk-velden { grid-template-columns: minmax(0, 1fr); }
    .zk-form { padding: 26px 20px; }
  }
`;

function naarOfferte() {
  document.getElementById("offerte")?.scrollIntoView({ behavior: "smooth" });
}

export default function ZakelijkPage() {
  const [fotos, setFotos] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    fotos.forEach((f, i) => fd.append(`foto_${i}`, f));
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <PageLayout>
      <style>{DIENST_CSS + ZAKELIJK_CSS}</style>

      {/* Hero */}
      <section className="do-hero">
        <img src="/images/14.JPEG" alt="" aria-hidden="true" />
        <div className="do-wrap">
          <div className="do-hero-tekst">
            <p className="do-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" />Zakelijk</p>
            <p className="do-oog">MOS-X Zakelijk</p>
            <h1 className="do-h1">Daken van bedrijven, <span>netjes verzorgd.</span></h1>
            <p className="do-p">Voor bedrijfspanden, appartementsgebouwen en vastgoed. Eén aanspreekpunt, een offerte per gebouw en een planning in overleg.</p>
            <div className="do-hero-knoppen">
              <button type="button" className="do-knop do-knop-g mx-glow" onClick={naarOfferte}>Vraag een offerte aan<ChevronRight size={17} /></button>
              <a className="do-knop do-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
            </div>
            <div className="do-hero-bewijs">
              <GoogleBalk />
              <span className="do-garantie-chip"><ShieldCheck size={18} color="#9BCB6C" aria-hidden="true" /><b>Factuur</b> op firma</span>
            </div>
          </div>
        </div>
      </section>

      {/* Voor wie */}
      <section className="do-sectie do-wit">
        <div className="do-wrap">
          <div className="do-kop">
            <div>
              <p className="do-oog">Voor wie</p>
              <h2 className="do-h2">Eén partner <span>voor al je daken.</span></h2>
            </div>
            <p className="do-p">Of het nu om één pand gaat of om een hele portefeuille.</p>
          </div>
          <div className="zk-kaarten">
            {doelgroepen.map(({ Icoon, titel, tekst }) => (
              <div key={titel} className="zk-kaart"><i><Icoon size={21} /></i><b>{titel}</b><p>{tekst}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Diensten */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="do-kop">
            <div>
              <p className="do-oog">Wat we doen</p>
              <h2 className="do-h2">Dezelfde aanpak, <span>op grotere schaal.</span></h2>
            </div>
          </div>
          <div className="zk-kaarten">
            {diensten.map((d) => (
              <Link key={d.titel} href={d.href} className="zk-kaart zk-dienst">
                <b>{d.titel}</b>
                <p>{d.tekst}</p>
                <small><CheckCircle2 size={16} aria-hidden="true" />{d.garantie}</small>
                <span>Meer info<ChevronRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Waarom */}
      <section className="do-sectie do-wit">
        <div className="do-wrap do-waarom">
          <div className="do-slider">
            <img src="/images/Foto realisatie.jpg" alt="Gereinigd dak van een groot gebouw" style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", display: "block" }} />
          </div>
          <div>
            <p className="do-oog">Waarom MOS-X</p>
            <h2 className="do-h2">Zakelijk geregeld, <span style={{ display: "block" }}>zonder gedoe.</span></h2>
            <ul className="do-voordelen">
              {voordelen.map(({ Icoon, titel }) => (
                <li key={titel}><i><Icoon size={20} color="#9BCB6C" /></i>{titel}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Zo werkt het */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="do-kop">
            <div>
              <p className="do-oog">Zo werkt het</p>
              <h2 className="do-h2">Van aanvraag <span>tot verzorgd dak.</span></h2>
            </div>
            <button type="button" className="do-knop do-knop-g" onClick={naarOfferte}>Vraag een offerte aan<ChevronRight size={17} /></button>
          </div>
          <div className="zk-stappen">
            {stappen.map((s) => (
              <div key={s.nr} className="zk-stap"><span>{s.nr}</span><b>{s.titel}</b><p>{s.tekst}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Offerte */}
      <section id="offerte" className="do-sectie do-wit" style={{ scrollMarginTop: 90 }}>
        <div className="do-wrap zk-offerte">
          <div>
            <p className="do-oog">Offerte aanvragen</p>
            <h2 className="do-h2">Vertel ons over <span style={{ display: "block" }}>je gebouw.</span></h2>
            <p className="do-p" style={{ marginTop: 18 }}>We nemen snel contact op om een plaatsbezoek in te plannen.</p>
            <ul className="do-voordelen" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
              <li><i><CheckCircle2 size={20} color="#9BCB6C" /></i>Gratis plaatsbezoek</li>
              <li><i><CheckCircle2 size={20} color="#9BCB6C" /></i>Prijs vooraf, per gebouw</li>
            </ul>
          </div>
          <div className="zk-form">
            {status === "ok" ? (
              <div className="zk-klaar" role="status">
                <CheckCircle2 size={44} color="#9BCB6C" />
                <b>Bedankt voor je aanvraag.</b>
                <p>We nemen snel contact met je op.</p>
              </div>
            ) : (
              <form onSubmit={verstuur}>
                <input type="hidden" name="dienst" value="Zakelijk" />
                <div className="zk-velden">
                  <div className="zk-veld"><label htmlFor="firma">Bedrijfsnaam <span>*</span></label><input id="firma" name="firma" required autoComplete="organization" /></div>
                  <div className="zk-veld"><label htmlFor="btw">Btw-nummer <em>(optioneel)</em></label><input id="btw" name="btw" placeholder="BE 0123.456.789" /></div>
                  <div className="zk-veld"><label htmlFor="voornaam">Voornaam <span>*</span></label><input id="voornaam" name="voornaam" required autoComplete="given-name" /></div>
                  <div className="zk-veld"><label htmlFor="achternaam">Achternaam <span>*</span></label><input id="achternaam" name="achternaam" required autoComplete="family-name" /></div>
                  <div className="zk-veld"><label htmlFor="email">E-mailadres <span>*</span></label><input id="email" name="email" type="email" required autoComplete="email" /></div>
                  <div className="zk-veld"><label htmlFor="telefoon">Telefoonnummer <span>*</span></label><input id="telefoon" name="telefoon" type="tel" required autoComplete="tel" /></div>
                  <div className="zk-veld">
                    <label htmlFor="gebouw">Type gebouw</label>
                    <select id="gebouw" name="gebouw" defaultValue="Bedrijfspand">
                      <option>Bedrijfspand</option>
                      <option>Appartementsgebouw</option>
                      <option>Meerdere woningen</option>
                      <option>Andere</option>
                    </select>
                  </div>
                  <div className="zk-veld">
                    <label htmlFor="aantal">Aantal gebouwen</label>
                    <select id="aantal" name="aantal" defaultValue="1">
                      <option>1</option>
                      <option>2 tot 5</option>
                      <option>Meer dan 5</option>
                    </select>
                  </div>
                  <div className="zk-veld"><label htmlFor="postcode">Postcode <span>*</span></label><input id="postcode" name="postcode" required autoComplete="postal-code" /></div>
                  <div className="zk-veld"><label htmlFor="adres">Adres</label><input id="adres" name="adres" autoComplete="street-address" placeholder="Straat en nummer" /></div>
                  <div className="zk-veld breed"><label htmlFor="bericht">Bericht</label><textarea id="bericht" name="bericht" rows={4} placeholder="Bv. twee loodsen met pannendak, liefst uitvoeren in de zomer." /></div>
                  <div className="zk-veld breed"><label>Foto&apos;s van het dak <em>(optioneel)</em></label><FotoKiezer fotos={fotos} onChange={setFotos} /></div>
                </div>
                <button type="submit" className="do-knop do-knop-g" disabled={status === "sending"}>
                  {status === "sending" ? <Loader2 size={18} className="zk-spin" /> : <Send size={17} />}
                  Offerte aanvragen
                </button>
                {status === "error" && <p className="zk-fout" role="alert">Er ging iets mis. Probeer opnieuw of bel ons even.</p>}
                <p className="zk-noot">Vrijblijvend. We delen je gegevens met niemand.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Afsluiter */}
      <section className="do-sectie do-zacht">
        <div className="do-wrap">
          <div className="do-cta">
            <div>
              <h2>Liever eerst even <span style={{ whiteSpace: "nowrap" }}>bellen?</span></h2>
              <p>We bespreken graag wat je gebouw nodig heeft.</p>
              <GoogleScore donker />
            </div>
            <div className="do-cta-knoppen">
              <a className="do-knop do-knop-g mx-glow" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
              <button type="button" className="do-knop do-knop-d" onClick={naarOfferte}>Vraag een offerte aan<ChevronRight size={17} /></button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
