"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";

/** Homepage: gratis dakcheck. Donker tekstvlak links, foto van een dakcontrole rechts. */
export default function SiteDakcheck() {
  const [open, setOpen] = useState(false);
  return (
    <section className="dc-sectie" aria-labelledby="dc-titel">
      <style>{`
        .dc-sectie { padding: 88px 0 48px; background: #FFFFFF; border-top: 1px solid #EEF0EA; }
        .dc-wrap { max-width: 1040px; margin: 0 auto; padding: 0 20px; }
        .dc-kaart { position: relative; isolation: isolate; display: grid; grid-template-columns: 1fr 1fr; border-radius: 24px; overflow: hidden;
          background: radial-gradient(520px 320px at 0% 100%, rgba(155,203,108,0.16), transparent 70%), #0B0F0C;
          border: 1px solid rgba(155,203,108,0.45); box-shadow: 0 28px 80px -30px rgba(11,15,12,0.55); }
        .dc-tekst { position: relative; z-index: 1; padding: 48px 52px 44px; color: #FFFFFF; }
        .dc-oog { margin: 0 0 14px; font: 700 12.5px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #9BCB6C; }
        .dc-titel { margin: 0 0 18px; letter-spacing: -0.028em; font: 800 clamp(1.6rem, 2.4vw, 2rem)/1.15 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #FFFFFF; }
        .dc-titel span { white-space: nowrap; color: #9BCB6C; }
                .dc-p b { font-weight: 600; color: #FFFFFF; white-space: nowrap; }
                .dc-p { margin: 0 0 20px; max-width: 440px; font: 400 15.5px/1.7 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.72); }
        .dc-lijst { list-style: none; margin: 0 0 26px; padding: 0; display: grid; gap: 9px; }
        .dc-lijst li { display: flex; align-items: center; gap: 12px; font: 400 14px var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.88); }
        .dc-lijst i { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: #9BCB6C; display: inline-flex; align-items: center; justify-content: center; color: #FFFFFF; }
        .dc-prijs { max-width: 380px; display: flex; align-items: baseline; gap: 6px; padding-top: 18px; margin: 0 0 18px; border-top: 1px solid rgba(255,255,255,0.12);
          font: 500 14px var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.55); }
        .dc-prijs s { color: rgba(255,255,255,0.55); margin-right: 10px; }
        .dc-prijs s { font-family: var(--font-montserrat), system-ui, sans-serif; font-weight: 600; }
        .dc-prijs b { font: 800 17px var(--font-montserrat), system-ui, sans-serif; color: #9BCB6C; letter-spacing: -0.01em; }
        .dc-knop { display: inline-flex; align-items: center; gap: 8px; height: 48px; padding: 0 24px; border: 0; border-radius: 10px; cursor: pointer;
          background: #9BCB6C; color: #FFFFFF; font: 700 14.5px var(--font-montserrat), system-ui, sans-serif;
          box-shadow: 0 12px 26px -12px rgba(122,181,78,0.9); transition: background-color .2s ease, transform .15s ease, box-shadow .2s ease; }
        .dc-knop:hover { background: #7AB54E; box-shadow: 0 14px 30px -12px rgba(122,181,78,1); }
        .dc-knop:active { transform: translateY(1px); }
        .dc-knop:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 3px; }
        .dc-foto { position: absolute; z-index: 0; top: 0; right: 0; bottom: 0; width: 60%;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 14%, #000 40%);
          mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 14%, #000 40%); }
        .dc-foto img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 55% 30%; display: block; }
        @media (max-width: 960px) {
          .dc-kaart { grid-template-columns: 1fr; }
          .dc-foto { position: relative; width: auto; order: -1; height: 230px;
            -webkit-mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
            mask-image: linear-gradient(to bottom, #000 55%, transparent 100%); }
          .dc-tekst { margin-top: -40px; }
          .dc-foto img { object-position: 60% 12%; }
          .dc-tekst { padding: 30px 22px 26px; }
        }
        @media (max-width: 480px) {
          .dc-sectie { padding: 56px 0 32px; }
          .dc-wrap { padding: 0 16px; }
          .dc-foto { height: 200px; }
          .dc-knop { width: 100%; justify-content: center; }
          .dc-titel { font-size: 1.5rem; }
          .dc-titel br { display: none; }
          .dc-p { font-size: 14.5px; }
          .dc-lijst li { font-size: clamp(11.5px, 3.2vw, 14px); white-space: nowrap; gap: 8px; }
          .dc-lijst i { width: 18px; height: 18px; }
        }
      `}</style>
      <div className="dc-wrap">
        <div className="dc-kaart">
          <div className="dc-tekst">
            <p className="dc-oog">Gratis dakcontrole</p>
            <h2 id="dc-titel" className="dc-titel">Weet jij in welke <br />staat je dak <span>eigenlijk is?</span></h2>
            <p className="dc-p">Een dakexpert komt langs en <b>inspecteert je dak ter plaatse</b>. Je krijgt een <b>schriftelijk verslag met foto&apos;s</b> van alles wat we vinden en wat er moet gebeuren om de levensduur van je dak te verlengen. Vrijblijvend.</p>
            <ul className="dc-lijst">
              <li><i aria-hidden="true"><Check size={12} strokeWidth={3.2} /></i>In welke staat is je dak?</li>
              <li><i aria-hidden="true"><Check size={12} strokeWidth={3.2} /></i>Welke maatregelen zijn nodig?</li>
              <li><i aria-hidden="true"><Check size={12} strokeWidth={3.2} /></i>Verslag met foto&apos;s, zonder aankoopverplichting</li>
            </ul>
            <p className="dc-prijs">Normale prijs <s>€149</s> <b>Nu €0,-</b></p>
            <button type="button" className="dc-knop mx-glow" onClick={() => setOpen(true)}>Boek een gratis dakcontrole<ChevronRight size={16} strokeWidth={2.5} /></button>
          </div>
          <div className="dc-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/dakcontrole.webp" alt="Dakdekker controleert de dakpannen" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
      <PlaatsbezoekModal open={open} onClose={() => setOpen(false)} bron="Homepage gratis dakcontrole"
        titel="Boek je gratis dakcontrole" subtitel="We bekijken je dak ter plaatse, vrijblijvend."
        voorbeeld="Bv. Ik wil graag weten in welke staat mijn dak is. Een bezoek op zaterdagvoormiddag past mij." />
    </section>
  );
}
