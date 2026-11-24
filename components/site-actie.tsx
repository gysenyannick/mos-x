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
        .sa-sectie { padding: 48px 0 96px; }
        .sa-wrap { max-width: 1320px; margin: 0 auto; padding: 0 20px; }
        .sa-kaart { display: grid; grid-template-columns: 300px minmax(0, 1fr) 270px; align-items: center; gap: 40px;
          padding: 64px 56px 64px 64px; border-radius: 28px; background: #F2F8EC;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04), 0 30px 60px -40px rgba(30,51,36,0.3); }
        .sa-foto { position: relative; width: calc(100% - 14px); aspect-ratio: 16 / 12; isolation: isolate; }
        .sa-foto::before { content: ""; position: absolute; inset: 16px -14px -14px 16px; z-index: -1; background: #9BCB6C; border-radius: 20px; }
        .sa-foto img { width: 100%; height: 100%; object-fit: cover; object-position: 62% 55%; display: block;
          border-radius: 18px; box-shadow: 0 24px 48px -28px rgba(30,51,36,0.55); }
        .sa-oog { margin: 0 0 10px; font: 700 13px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #7AB54E; }
        .sa-titel { margin: 0; font-family: var(--font-montserrat), system-ui, sans-serif; font-weight: 800; letter-spacing: -0.035em; line-height: 1; color: #1A1A1A; white-space: nowrap; }
        .sa-titel .pct { font-size: clamp(3.4rem, 5.4vw, 5rem); color: #9BCB6C; letter-spacing: -0.05em; }
        .sa-titel .kort { font-size: clamp(1.8rem, 2.8vw, 2.7rem); margin-left: 12px; }
        .sa-sub { margin: 12px 0 0; white-space: nowrap; font: 700 clamp(1rem, 1.3vw, 1.1rem) var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.01em; color: #1A1A1A; }
        .sa-prijs { background: #FFFFFF; border-radius: 22px; padding: 36px 32px 32px; text-align: center;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 24px 48px -28px rgba(30,51,36,0.35); }
        .sa-prijs h3 { margin: 0; letter-spacing: .14em; text-transform: uppercase; color: #7AB54E !important; font: 800 13px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .sa-gratis-k { margin: 6px 0 22px; font: 700 17px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .sa-gratis { margin: 10px 0 0; font: 800 64px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.04em; line-height: 1; color: #1A1A1A; }
        .sa-knop { display: flex; align-items: center; justify-content: center; width: 100%; height: 52px; border: 0; cursor: pointer; border-radius: 10px; background: #9BCB6C; color: #FFFFFF;
          text-decoration: none; font: 700 16px var(--font-montserrat), system-ui, sans-serif;
          box-shadow: 0 10px 22px -12px rgba(122,181,78,0.9); transition: background-color .2s ease, transform .15s ease; }
        .sa-knop:hover { background: #7AB54E; }
        .sa-knop:active { transform: translateY(1px); }
        .sa-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
        @media (max-width: 1100px) {
          .sa-kaart { grid-template-columns: 280px minmax(0, 1fr); padding: 44px 40px; gap: 40px; }
          .sa-prijs { grid-column: 1 / -1; max-width: 420px; justify-self: center; width: 100%; }
        }
        @media (max-width: 680px) {
          .sa-sub { white-space: normal; }
          .sa-punt { display: none; }
          .sa-datum { display: block; margin-top: 4px; }
          .sa-sectie { padding: 8px 0 56px; }
          .sa-kaart { grid-template-columns: minmax(0, 1fr); padding: 36px 20px 26px; gap: 30px; text-align: center; }
          .sa-foto { width: calc(100% - 12px); margin: 0 12px 0 0; }
          .sa-foto::before { inset: 12px -12px -12px 12px; }
          .sa-titel .kort { margin-left: 8px; }
        }
        @media (max-width: 380px) { .sa-titel .pct { font-size: 3rem; } .sa-titel .kort { font-size: 1.6rem; } }
      `}</style>
      <div className="sa-wrap">
        <div className="sa-kaart">
          <div className="sa-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/actie-dak-oprit.webp" alt="Ontmost dak met het MOS-X-bord en de bestelwagen op de oprit" loading="lazy" decoding="async" />
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
