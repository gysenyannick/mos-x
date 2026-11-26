"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
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
        .dc-tekst { padding: 64px 64px 60px; color: #FFFFFF; }
        .dc-oog { margin: 0 0 18px; font: 600 12px var(--font-inter), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,0.6); }
        .dc-titel { margin: 0 0 22px; font: 800 clamp(1.9rem, 3vw, 2.5rem)/1.15 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #FFFFFF; }
        .dc-titel span { position: relative; white-space: nowrap; color: #9BCB6C; }
        .dc-titel span::after { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 3px; border-radius: 2px; background: #9BCB6C; }
        .dc-p { margin: 0 0 24px; max-width: 470px; font: 400 16.5px/1.75 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.72); }
        .dc-lijst { list-style: none; margin: 0 0 30px; padding: 0; display: grid; gap: 10px; }
        .dc-lijst li { display: flex; align-items: center; gap: 12px; font: 500 15px var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.88); }
        .dc-lijst svg { color: #9BCB6C; flex-shrink: 0; }
        .dc-prijs { display: flex; align-items: baseline; gap: 12px; padding-top: 22px; margin: 0 0 22px; border-top: 1px solid rgba(255,255,255,0.12);
          font: 500 14px var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.55); }
        .dc-prijs b { font: 800 20px var(--font-montserrat), system-ui, sans-serif; color: #9BCB6C; letter-spacing: -0.01em; }
        .dc-knop { display: inline-flex; align-items: center; gap: 8px; height: 52px; padding: 0 26px; border: 0; border-radius: 10px; cursor: pointer;
          background: #9BCB6C; color: #FFFFFF; font: 700 15px var(--font-montserrat), system-ui, sans-serif;
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
            <p className="dc-oog">Gratis dakcheck</p>
            <h2 id="dc-titel" className="dc-titel">Weet jij in welke staat<br />je dak <span>echt is?</span></h2>
            <p className="dc-p">Yannick komt langs en bekijkt je dak ter plaatse. Je krijgt een verslag met foto&apos;s van wat we zien en wat er nodig is om je dak langer mee te laten gaan. Volledig vrijblijvend.</p>
            <ul className="dc-lijst">
              <li><Check size={18} strokeWidth={2.6} aria-hidden="true" />In welke staat is je dak?</li>
              <li><Check size={18} strokeWidth={2.6} aria-hidden="true" />Welke behandeling is nodig?</li>
              <li><Check size={18} strokeWidth={2.6} aria-hidden="true" />Verslag met foto&apos;s, zonder aankoopverplichting</li>
            </ul>
            <p className="dc-prijs">Vrijblijvend en zonder kosten <b>Nu gratis</b></p>
            <button type="button" className="dc-knop" onClick={() => setOpen(true)}>Plan je gratis dakcheck<ChevronRight size={17} strokeWidth={2.5} /></button>
          </div>
          <div className="dc-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/dakcheck-yannick.webp" alt="Yannick aan het werk op een dak" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
      <PlaatsbezoekModal open={open} onClose={() => setOpen(false)} bron="Homepage gratis dakcheck"
        titel="Plan je gratis dakcheck" subtitel="Yannick bekijkt je dak ter plaatse, vrijblijvend."
        voorbeeld="Bv. Ik wil graag weten in welke staat mijn dak is. Een bezoek op zaterdagvoormiddag past mij." />
    </section>
  );
}
