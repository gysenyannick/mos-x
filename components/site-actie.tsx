"use client";

import { useState } from "react";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";

/**
 * Homepage: actiebanner (voorjaarsbonus) bij een dakreiniging.
 * Opbouw zoals een promobanner: foto in organische vorm, grote korting, en rechts een witte kaart.
 */
export default function SiteActie() {
  const [open, setOpen] = useState(false);
  return (
    <section className="sa-sectie" aria-labelledby="sa-titel">
      <style>{`
        .sa-sectie { padding: 32px 0 72px; }
        .sa-wrap { max-width: 1380px; margin: 0 auto; padding: 0 clamp(12px, 4vw, 40px); }
        .sa-kaart { position: relative; isolation: isolate; overflow: hidden; display: grid; grid-template-columns: minmax(0, 1fr) 240px; align-items: center; gap: 36px;
          min-height: 230px; padding: 28px 40px 28px calc(38% + 20px); border-radius: 20px; background: #F2F8EC;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04), 0 30px 60px -40px rgba(30,51,36,0.3); }
        .sa-foto { position: absolute; z-index: -1; top: 0; bottom: 0; left: 0; width: 40%;
          -webkit-mask-image: linear-gradient(to right, #000 0%, #000 50%, rgba(0,0,0,0.5) 75%, transparent 100%);
          mask-image: linear-gradient(to right, #000 0%, #000 50%, rgba(0,0,0,0.5) 75%, transparent 100%); }
        .sa-foto img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 62%; display: block; }
        .sa-oog { margin: 0 0 6px; font: 700 11.5px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #7AB54E; }
        .sa-titel { margin: 0; font-family: var(--font-montserrat), system-ui, sans-serif; font-weight: 800; letter-spacing: -0.035em; line-height: 1; color: #1A1A1A; white-space: nowrap; }
        .sa-titel .pct { font-size: clamp(2.3rem, 3.6vw, 3.4rem); color: #9BCB6C; letter-spacing: -0.05em; }
        .sa-titel .kort { font-size: clamp(1.3rem, 2vw, 1.9rem); margin-left: 8px; }
        .sa-sub { margin: 8px 0 0; white-space: nowrap; font: 700 clamp(0.95rem, 1.3vw, 1.1rem) var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.01em; color: #1A1A1A; }
        .sa-prijs { background: #FFFFFF; border-radius: 16px; padding: 18px 20px; text-align: center;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 24px 48px -28px rgba(30,51,36,0.35); }
        .sa-prijs h3 { margin: 0; letter-spacing: .14em; text-transform: uppercase; color: #7AB54E !important; font: 800 12px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .sa-gratis-k { margin: 4px 0 12px; font: 700 14px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .sa-gratis { margin: 6px 0 0; font: 800 38px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.04em; line-height: 1; color: #1A1A1A; }
        .sa-knop { display: flex; align-items: center; justify-content: center; width: 100%; height: 42px; border: 0; cursor: pointer; border-radius: 10px; background: #9BCB6C; color: #FFFFFF;
          text-decoration: none; font: 700 14px var(--font-montserrat), system-ui, sans-serif;
          box-shadow: 0 10px 22px -12px rgba(122,181,78,0.9); transition: background-color .2s ease, transform .15s ease; }
        .sa-knop:hover { background: #7AB54E; }
        .sa-knop:active { transform: translateY(1px); }
        .sa-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
        @media (max-width: 1100px) { .sa-sub { white-space: normal; } .sa-punt { display: none; } .sa-datum { display: block; margin-top: 3px; } }
        @media (max-width: 1023px) { .sa-wrap { padding: 0 16px; } }
        @media (max-width: 960px) {
          .sa-kaart { grid-template-columns: minmax(0, 1fr); min-height: 0; padding: 0 24px 22px; gap: 18px; text-align: center; }
          .sa-foto { position: relative; z-index: 0; width: auto; height: 210px; margin: 0 -24px -6px;
            -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 50%, rgba(0,0,0,0.55) 74%, transparent 100%);
            mask-image: linear-gradient(to bottom, #000 0%, #000 50%, rgba(0,0,0,0.55) 74%, transparent 100%); }
          .sa-foto img { object-position: 50% 55%; }
          .sa-prijs { max-width: 320px; justify-self: center; width: 100%; }
        }
        @media (max-width: 680px) {
          .sa-sub { white-space: normal; }
          .sa-punt { display: none; }
          .sa-datum { display: block; margin-top: 4px; }
          .sa-sectie { padding: 8px 0 48px; }
          .sa-kaart { padding: 0 18px 18px; gap: 14px; }
          .sa-foto { height: 180px; margin: 0 -18px -6px; }
          .sa-titel .kort { margin-left: 8px; }
        }
        @media (max-width: 380px) { .sa-titel .pct { font-size: 2.2rem; } .sa-titel .kort { font-size: 1.25rem; } }
      `}</style>
      <div className="sa-wrap">
        <div className="sa-kaart">
          <div className="sa-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/actie-oprit.webp" width={924} height={570} alt="Propere oprit in natuursteen kasseien" loading="lazy" decoding="async" />
          </div>

          <div>
            <p className="sa-oog">Voorjaarsbonus<span className="sa-punt"> · </span><span className="sa-datum">Boek vóór 31 maart</span></p>
            <h2 id="sa-titel" className="sa-titel"><span className="pct">50%</span><span className="kort">korting</span></h2>
            <p className="sa-sub">op je oprit- of terrasreiniging, samen met je dak</p>
          </div>

          <div className="sa-prijs">
            <h3>Voorjaarsbonus</h3>
            <p className="sa-gratis">−50%</p>
            <p className="sa-gratis-k">Oprit of terras</p>
            <button type="button" className="sa-knop" onClick={() => setOpen(true)}>Ik wil deze korting</button>
          </div>
        </div>
      </div>
      <PlaatsbezoekModal open={open} onClose={() => setOpen(false)} defaultDienst="Dakreiniging" bron="Actiebanner voorjaarsbonus"
        titel="Ik wil de voorjaarsbonus" subtitel="50% op je oprit of terras, samen met je dak."
        voorbeeld="Bv. Ik wil mijn dak laten reinigen en mijn oprit erbij. Een plaatsbezoek in de week na 17.00 u past mij." />
    </section>
  );
}
