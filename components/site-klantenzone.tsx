"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import MosAchtergrond from "@/components/mos-achtergrond";

/** Homepage: korte uitleg van de klantenzone, met een gsm als voorbeeld. */
export default function SiteKlantenzone() {
  const [bezoekOpen, setBezoekOpen] = useState(false);
  return (
    <section style={{
      background: "radial-gradient(700px 460px at 80% 50%, rgba(155,203,108,0.10), transparent 65%), #FFFFFF",
      padding: "64px 0", overflow: "hidden", position: "relative", isolation: "isolate",
    }}>
      <svg aria-hidden="true" viewBox="0 0 600 600" style={{ position: "absolute", right: "-120px", top: "50%", transform: "translateY(-50%)", width: "760px", height: "760px", zIndex: 0 }}>
        <defs>
          <radialGradient id="kzp-vlak" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9BCB6C" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#9BCB6C" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="300" r="300" fill="url(#kzp-vlak)" />
        <circle cx="300" cy="300" r="210" fill="none" stroke="#9BCB6C" strokeOpacity="0.18" strokeWidth="1.2" strokeDasharray="2 7" />
        <circle cx="300" cy="300" r="270" fill="none" stroke="#9BCB6C" strokeOpacity="0.10" strokeWidth="1" />
      </svg>
      <MosAchtergrond hoek="linksonder" />
      <style>{`
        .kzp-raster { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: 40px; align-items: center; max-width: 1080px; margin: 0 auto; }
        .kzp-oog { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .kzp-titel { margin: 0 0 18px; font-size: clamp(1.9rem, 3.6vw, 2.9rem); font-weight: 800; line-height: 1.12; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .kzp-tekst { margin: 0 0 24px; max-width: 540px; font-size: 17px; line-height: 1.7; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .kzp-lijst { list-style: none; margin: 0 0 34px; padding: 0; display: grid; gap: 14px; }
        .kzp-lijst li { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 12px; align-items: start; font-size: 16px; line-height: 1.55; color: #1A1A1A; font-family: var(--font-inter), system-ui, sans-serif; }
        .kzp-vink { width: 26px; height: 26px; border-radius: 50%; background: #EEF6E6; color: #9BCB6C; display: grid; place-items: center; }
        .kzp-knoppen { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .kzp-knop { display: inline-flex; align-items: center; gap: 8px; height: 52px; padding: 0 26px; border-radius: 10px; background: #9BCB6C; color: #fff; font-size: 15px; font-weight: 700; text-decoration: none; font-family: var(--font-montserrat), system-ui, sans-serif; box-shadow: 0 8px 20px -10px rgba(122,181,78,0.8); transition: background-color .2s ease, transform .15s ease; }
        .kzp-knop:hover { background: #7AB54E; }
        .kzp-knop:active { transform: translateY(1px); }
        .kzp-knop:focus-visible, .kzp-link:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
        .kzp-knop-licht { background: transparent; color: #1A1A1A; border: 1px solid #CFE5B8; box-shadow: none; cursor: pointer; }
        .kzp-knop-licht:hover { background: #EEF6E6; border-color: #9BCB6C; }
        .kzp-link { background: none; border: 0; padding: 0; cursor: pointer; font-size: 15px; font-weight: 600; color: #1A1A1A; text-decoration: underline; text-underline-offset: 4px; text-decoration-color: #9BCB6C; font-family: var(--font-inter), system-ui, sans-serif; }
        .kzp-link:hover { color: #7AB54E; }

        /* De gsm */
        .kzp-gsm { position: relative; width: 290px; max-width: 100%; margin: 0 auto; aspect-ratio: 320 / 640; border-radius: 46px; padding: 11px; background: #0B0F0C; box-shadow: 0 40px 80px -30px rgba(11,15,12,0.55), inset 0 0 0 2px #2A2F2B; }
        .kzp-scherm { position: relative; height: 100%; border-radius: 36px; overflow: hidden; background: #F7F8F6; font-family: var(--font-inter), system-ui, sans-serif; }
        .kzp-kop { padding: 12px 22px 22px; background: linear-gradient(160deg, #1E3324 0%, #16261A 100%); color: #fff; }
        .kzp-status { display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 700; }
        .kzp-eiland { width: 92px; height: 26px; border-radius: 999px; background: #000; }
        .kzp-merk { margin: 14px 0 4px; font-size: 10px; font-weight: 800; letter-spacing: 0.16em; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .kzp-hallo { margin: 0; font-size: 21px; font-weight: 800; letter-spacing: -0.02em; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .kzp-streep { width: 34px; height: 3px; margin-top: 10px; border-radius: 2px; background: #9BCB6C; }
        .kzp-kaart { margin: -12px 12px 0; padding: 14px; border-radius: 16px; background: #fff; box-shadow: 0 6px 20px -10px rgba(0,0,0,0.25); position: relative; }
        .kzp-label { font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #545454; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .kzp-k-titel { margin: 6px 0 8px; font-size: 14.5px; font-weight: 800; line-height: 1.3; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .kzp-balk { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-bottom: 4px; }
        .kzp-balk span { height: 5px; border-radius: 3px; background: #E5E7EB; }
        .kzp-balk span.aan { background: #9BCB6C; }
        .kzp-stappen { display: grid; grid-template-columns: repeat(4, 1fr); font-size: 8.5px; color: #8E8E89; }
        .kzp-stappen b { color: #1A1A1A; }
        .kzp-foto { position: relative; margin-top: 10px; height: 78px; border-radius: 10px; overflow: hidden; }
        .kzp-foto img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
        .kzp-foto span { position: absolute; left: 8px; bottom: 6px; font-size: 9px; font-weight: 700; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.6); }
        .kzp-vakman { display: flex; align-items: center; gap: 9px; margin-top: 10px; }
        .kzp-vakman img { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 2px solid #9BCB6C; }
        .kzp-vakman b { display: block; font-size: 11.5px; color: #1A1A1A; }
        .kzp-vakman small { font-size: 9.5px; color: #8E8E89; }
        .kzp-plan { margin: 10px 12px 0; padding: 12px 14px; border-radius: 16px; background: #fff; box-shadow: 0 6px 20px -12px rgba(0,0,0,0.2); }
        .kzp-plan p { margin: 0 0 8px; font-size: 11.5px; font-weight: 800; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .kzp-plan div { display: flex; align-items: center; gap: 10px; }
        .kzp-dag { width: 32px; height: 34px; border-radius: 8px; background: #16261A; color: #fff; display: grid; place-items: center; align-content: center; line-height: 1; }
        .kzp-dag small { font-size: 7px; color: #9BCB6C; font-weight: 700; }
        .kzp-plan .kzp-dag b { display: block; font-size: 13px; color: #fff; }
        .kzp-plan span { font-size: 11px; color: #545454; }
        .kzp-plan span b { display: block; color: #1A1A1A; font-size: 11.5px; }
        .kzp-plan div + div { margin-top: 8px; padding-top: 8px; border-top: 1px solid #EEF0EA; }
        .kzp-docs { margin: 10px 12px 0; display: none; grid-template-columns: 1fr 1fr; gap: 8px; }
        .kzp-docs div { padding: 10px 12px; border-radius: 14px; background: #fff; box-shadow: 0 6px 20px -12px rgba(0,0,0,0.2); }
        .kzp-docs small { display: block; font-size: 8.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #9BCB6C; }
        .kzp-docs b { display: block; margin-top: 2px; font-size: 12px; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }

        .kzp-kort { display: none; }
        @media (max-width: 1023px) {
          .kzp-raster { grid-template-columns: minmax(0, 1fr); gap: 36px; }
          .kzp-inhoud { text-align: left; }
          .kzp-lijst { max-width: 100%; }
          .kzp-knoppen { align-items: stretch; }
          .kzp-knoppen .kzp-knop { width: 100%; justify-content: center; }
          .kzp-knoppen { flex-direction: column; }
        }
        @media (max-width: 560px) {
          .kzp-gsm { width: 280px; }
          .kzp-docs { display: none; }
          .kzp-lijst li { font-size: 15.5px; align-items: center; }
          .kzp-lang { display: none; }
          .kzp-kort { display: inline; white-space: nowrap; }
          .kzp-tekst { font-size: 16px; text-wrap: pretty; }
        }
      `}</style>
      <div className="site-wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="kzp-raster">
          <div className="kzp-inhoud">
            <p className="kzp-oog">
              Mijn MOS-X
            </p>
            <h2 className="kzp-titel">Volg je dak in je eigen klantenzone</h2>
            <p className="kzp-tekst">
              Elke klant krijgt een persoonlijke pagina met de planning, foto&apos;s van de werken, je documenten en je garantie. Geen account, geen wachtwoord: gewoon je eigen link.
            </p>
            <ul className="kzp-lijst">
              <li><span className="kzp-vink"><Check size={15} strokeWidth={3} /></span><span className="kzp-lang">Je ziet wanneer we komen en hoe ver de werken staan.</span><span className="kzp-kort">Planning en stand van de werken</span></li>
              <li><span className="kzp-vink"><Check size={15} strokeWidth={3} /></span><span className="kzp-lang">Foto&apos;s, offerte, facturen en garantie op één plek.</span><span className="kzp-kort">Foto&apos;s, documenten en garantie</span></li>
              <li><span className="kzp-vink"><Check size={15} strokeWidth={3} /></span><span className="kzp-lang">Exclusieve voordelen en acties, enkel voor klanten.</span><span className="kzp-kort">Exclusieve voordelen en acties</span></li>
            </ul>
            <div className="kzp-knoppen">
              <Link href="/klant" className="kzp-knop mx-glow">Naar je klantenzone <ChevronRight size={16} strokeWidth={2.5} /></Link>
              <button type="button" onClick={() => setBezoekOpen(true)} className="kzp-knop kzp-knop-licht">Plan een gratis plaatsbezoek</button>
            </div>
          </div>

          <div aria-hidden="true">
            <div className="kzp-gsm">
              <div className="kzp-scherm">
                <div className="kzp-kop">
                  <div className="kzp-status"><span>9:41</span><span className="kzp-eiland" /><span>●●●</span></div>
                  <p className="kzp-merk">MIJN MOS-X</p>
                  <p className="kzp-hallo">Goeiemorgen, Jan</p>
                  <div className="kzp-streep" />
                </div>
                <div className="kzp-kaart">
                  <span className="kzp-label">Dakreiniging · stap 2 van 4</span>
                  <p className="kzp-k-titel">Je werken starten op maandag 12 oktober.</p>
                  <div className="kzp-balk"><span className="aan" /><span className="aan" /><span /><span /></div>
                  <div className="kzp-stappen"><span>Gepland</span><b>Start</b><span>Bezig</span><span>Klaar</span></div>
                  <div className="kzp-foto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="lazy" decoding="async" src="/images/15.JPEG" alt="" />
                    <span>Foto · 1 oktober</span>
                  </div>
                  <div className="kzp-vakman">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="lazy" decoding="async" src="/images/yannick-avatar.jpg" alt="" />
                    <span><b>Yannick</b><small>Je vakman</small></span>
                  </div>
                </div>
                <div className="kzp-plan">
                  <p>Je planning</p>
                  <div>
                    <span className="kzp-dag"><small>OKT</small><b>12</b></span>
                    <span><b>Start werken</b>maandag · 08:00</span>
                  </div>
                  <div>
                    <span className="kzp-dag"><small>OKT</small><b>14</b></span>
                    <span><b>Oplevering</b>woensdag · 16:00</span>
                  </div>
                </div>
                <div className="kzp-docs">
                  <div><small>Garantie</small><b>10 jaar</b></div>
                  <div><small>Documenten</small><b>3 bestanden</b></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} bron="Homepage klantenzone" />
    </section>
  );
}
