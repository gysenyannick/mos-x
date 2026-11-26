"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";

/** Homepage: gratis dakcheck. Donker tekstvlak links, foto van Yannick aan het werk rechts. */
export default function SiteDakcheck() {
  const [open, setOpen] = useState(false);
  return (
    <section className="dc-sectie" aria-labelledby="dc-titel">
      <style>{`
        .dc-sectie { padding: 0 0 100px; background: #F7F8F6; }
        .dc-wrap { max-width: 1222px; margin: 0 auto; padding: 0 20px; }
        .dc-kaart { display: grid; grid-template-columns: 1fr 1fr; border-radius: 20px; overflow: hidden; background: #0B0F0C;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -40px rgba(11,15,12,0.55); }
        .dc-tekst { padding: 72px 64px 64px; color: #FFFFFF; }
        .dc-oog { margin: 0 0 20px; font: 500 12px var(--font-inter), system-ui, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
        .dc-titel { margin: 0 0 30px; font: 800 clamp(1.9rem, 3vw, 2.5rem)/1.15 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #FFFFFF; }
        .dc-titel span { position: relative; white-space: nowrap; color: #FFFFFF; }
        .dc-titel span::after { content: ""; position: absolute; left: 0; right: 0; bottom: -7px; height: 4px; border-radius: 2px; background: #9BCB6C; }
        .dc-p { margin: 0 0 28px; max-width: 470px; font: 400 17px/1.85 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.72); }
        .dc-lijst { list-style: none; margin: 0 0 40px; padding: 0; display: grid; gap: 12px; }
        .dc-lijst li { display: flex; align-items: center; gap: 12px; font: 400 14.5px var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.88); }
        .dc-lijst svg { color: #9BCB6C; flex-shrink: 0; }
        .dc-prijs { display: flex; align-items: baseline; gap: 6px; padding-top: 26px; margin: 0 0 24px; border-top: 1px solid rgba(255,255,255,0.12);
          font: 500 14px var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.55); }
        .dc-prijs s { color: rgba(255,255,255,0.55); margin-right: 10px; }
        .dc-prijs b { font: 800 19px var(--font-montserrat), system-ui, sans-serif; color: #9BCB6C; letter-spacing: -0.01em; }
        .dc-knop { display: inline-flex; align-items: center; gap: 8px; height: 54px; padding: 0 34px; border: 0; border-radius: 6px; cursor: pointer;
          background: #9BCB6C; color: #FFFFFF; font: 600 15.5px var(--font-inter), system-ui, sans-serif;
          box-shadow: 0 12px 26px -12px rgba(122,181,78,0.9); transition: background-color .2s ease, transform .15s ease, box-shadow .2s ease; }
        .dc-knop:hover { background: #7AB54E; box-shadow: 0 14px 30px -12px rgba(122,181,78,1); }
        .dc-knop:active { transform: translateY(1px); }
        .dc-knop:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 3px; }
        .dc-foto { position: relative; min-height: 100%; }
        .dc-foto img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 60% 40%; display: block; }
        @media (max-width: 960px) {
          .dc-kaart { grid-template-columns: 1fr; }
          .dc-foto { order: -1; height: 300px; }
          .dc-tekst { padding: 36px 24px 32px; }
        }
        @media (max-width: 480px) {
          .dc-sectie { padding: 0 0 64px; }
          .dc-wrap { padding: 0 16px; }
          .dc-foto { height: 240px; }
          .dc-knop { width: 100%; justify-content: center; }
          .dc-titel { font-size: 1.75rem; }
          .dc-titel br { display: none; }
          .dc-p { font-size: 15.5px; }
        }
      `}</style>
      <div className="dc-wrap">
        <div className="dc-kaart">
          <div className="dc-tekst">
            <p className="dc-oog">Gratis dakcontrole</p>
            <h2 id="dc-titel" className="dc-titel">Weet jij in welke <br />staat je dak <span>eigenlijk is?</span></h2>
            <p className="dc-p">Yannick inspecteert je dak ter plaatse. Je krijgt een schriftelijk verslag met foto&apos;s van alles wat we vinden en wat er moet gebeuren om de levensduur van je dak te verlengen. Vrijblijvend.</p>
            <ul className="dc-lijst">
              <li><Check size={16} strokeWidth={2.6} aria-hidden="true" />In welke staat is je dak?</li>
              <li><Check size={16} strokeWidth={2.6} aria-hidden="true" />Welke maatregelen zijn nodig?</li>
              <li><Check size={16} strokeWidth={2.6} aria-hidden="true" />Verslag met foto&apos;s, zonder aankoopverplichting</li>
            </ul>
            <p className="dc-prijs">Normale prijs <s>€149</s> <b>Nu €0,-</b></p>
            <button type="button" className="dc-knop" onClick={() => setOpen(true)}>Boek een gratis dakcontrole <span aria-hidden="true">→</span></button>
          </div>
          <div className="dc-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/dakcheck-yannick.webp" alt="Yannick aan het werk op een dak" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
      <PlaatsbezoekModal open={open} onClose={() => setOpen(false)} bron="Homepage gratis dakcontrole"
        titel="Boek je gratis dakcontrole" subtitel="Yannick bekijkt je dak ter plaatse, vrijblijvend."
        voorbeeld="Bv. Ik wil graag weten in welke staat mijn dak is. Een bezoek op zaterdagvoormiddag past mij." />
    </section>
  );
}
