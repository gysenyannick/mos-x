"use client";

import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { BtnPress } from "@/components/btn-press";

const delen = [
  {
    label: "Deel 1",
    titel: "Je offerte",
    stappen: [
      { titel: "Richtprijs berekenen", tekst: "Vul in een paar stappen je woning en je dak in, en je ziet meteen een richtprijs. Vrijblijvend: je zit nergens aan vast." },
      { titel: "Plaatsbezoek", tekst: "Plan een gratis plaatsbezoek, of stuur foto's van je dak, dan bekijken we het op afstand." },
      { titel: "Offerte op maat gemaakt", tekst: "Je krijgt een duidelijke offerte, afgestemd op jouw dak. Zo weet je vooraf wat we doen en wat het kost." },
    ],
  },
  {
    label: "Deel 2",
    titel: "Je dak",
    stappen: [
      { titel: "Professionele uitvoering", tekst: "We werken op het afgesproken moment, netjes en zorgvuldig. In je klantenzone zie je de planning, foto's van de werken en hoe ver we staan." },
      { titel: "Oplevering & nazorg", tekst: "We leveren pas op als alles netjes is. Je documenten en garantie vind je in je klantenzone, en we blijven bereikbaar voor je vragen." },
      { titel: "Opvolging met Dakzorg", tekst: "Met MOS-X Dakzorg volgen we je dak op, zodat het jarenlang verzorgd blijft." },
    ],
  },
];

export default function SiteWerkwijze() {
  // Welke stap open staat; standaard alles dicht, zodat het blok rustig oogt
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{
      background: "radial-gradient(900px 500px at 85% 40%, rgba(155,203,108,0.10), transparent 65%), radial-gradient(800px 500px at 10% 100%, rgba(155,203,108,0.08), transparent 65%), #F7F8F6",
      padding: "100px 0", width: "100%", position: "relative", overflow: "hidden",
    }}>
      {/* Zachte golven onderaan, zoals een heuvellandschap */}
      <svg aria-hidden="true" viewBox="0 0 1440 420" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: "55%", zIndex: 0, maskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)" }}>
        <path d="M0,170 C240,90 480,90 720,150 C960,210 1200,220 1440,120 L1440,420 L0,420 Z" fill="#9BCB6C" fillOpacity="0.04" />
        <path d="M0,250 C260,190 520,200 760,250 C1000,300 1220,300 1440,230 L1440,420 L0,420 Z" fill="#9BCB6C" fillOpacity="0.04" />
        <path d="M0,330 C300,290 600,300 860,330 C1100,358 1280,350 1440,320 L1440,420 L0,420 Z" fill="#9BCB6C" fillOpacity="0.04" />
      </svg>
      {/* Bolletjes rechtsboven */}
      <svg aria-hidden="true" className="ww-bollen" width="140" height="110" viewBox="0 0 140 110" style={{ position: "absolute", top: "40px", right: "6%", zIndex: 0 }}>
        <circle cx="30" cy="38" r="17" fill="#9BCB6C" fillOpacity="0.22" />
        <circle cx="92" cy="14" r="8" fill="#9BCB6C" fillOpacity="0.28" />
        <circle cx="82" cy="78" r="12" fill="#9BCB6C" fillOpacity="0.18" />
        <circle cx="125" cy="56" r="5" fill="#9BCB6C" fillOpacity="0.3" />
        <circle cx="8" cy="100" r="5" fill="#9BCB6C" fillOpacity="0.25" />
      </svg>
      <style>{`
        .ww-raster { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr) minmax(0, 1fr); gap: 20px; align-items: stretch; }
        .ww-foto { position: relative; border-radius: 16px; overflow: hidden; min-height: 100%; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .ww-foto img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .ww-kaart { background: #fff; border-radius: 16px; border-top: 3px solid #9BCB6C; padding: 28px 28px 8px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .ww-label { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #1A1A1A; color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ww-titel { margin: 14px 0 10px; font-size: 24px; font-weight: 800; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ww-stappen { list-style: none; margin: 0; padding: 0; }
        .ww-stappen li { border-top: 1px solid #E5E7EB; }
        .ww-stappen li:first-child { border-top: 0; }
        .ww-vraag { width: 100%; display: grid; grid-template-columns: 34px minmax(0, 1fr) 28px; align-items: center; gap: 14px; padding: 16px 0; border: 0; background: transparent; text-align: left; cursor: pointer; }
        .ww-vraag:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 4px; border-radius: 8px; }
        .ww-vraag:hover .ww-plus { background: #DCEFC9; }
        .ww-vraag:active .ww-plus { transform: scale(0.92); }
        .ww-nr { width: 34px; height: 34px; border-radius: 50%; background: #9BCB6C; color: #fff; display: grid; place-items: center; font-size: 14px; font-weight: 800; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ww-stap-titel { font-size: 16px; font-weight: 700; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ww-plus { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: #EEF6E6; color: #7AB54E; transition: transform .3s ease, background-color .2s ease, color .2s ease; }
        .ww-vraag[aria-expanded="true"] .ww-plus { transform: rotate(45deg); background: #9BCB6C; color: #fff; }
        .ww-antw { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; }
        .ww-antw.open { grid-template-rows: 1fr; }
        .ww-antw > div { overflow: hidden; }
        .ww-stap-tekst { margin: 0; padding: 0 0 18px 48px; font-size: 14.5px; line-height: 1.6; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; text-wrap: pretty; }
        @media (prefers-reduced-motion: reduce) { .ww-antw, .ww-plus { transition: none; } }
        @media (max-width: 1024px) {
          .ww-raster { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
          .ww-foto { grid-column: 1 / -1; min-height: 280px; }
        }
        @media (max-width: 680px) {
          .ww-raster { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .ww-foto { min-height: 220px; }
          .ww-kaart { padding: 22px 20px 4px; }
          .ww-bollen { display: none; }
          .ww-vraag { grid-template-columns: 30px minmax(0, 1fr) 26px; gap: 12px; }
          .ww-nr { width: 30px; height: 30px; font-size: 13px; }
          .ww-plus { width: 26px; height: 26px; }
          .ww-stap-titel { font-size: 15px; }
          .ww-stap-tekst { padding-left: 42px; }
        }
      `}</style>
      <div className="site-wrap" style={{ position: "relative", zIndex: 1 }}>

        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <p style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9BCB6C", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
            Zo werkt het
          </p>
          <h2 style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#1A1A1A",
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            letterSpacing: "-0.028em", lineHeight: 1.15, marginBottom: "16px",
          }}>
            Van richtprijs tot <span style={{ color: "#9BCB6C", whiteSpace: "nowrap" }}>verzorgd dak.</span>
          </h2>
          <p style={{
            fontSize: "16px", color: "#545454", lineHeight: 1.7,
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            maxWidth: "800px", margin: "0 auto", textWrap: "balance",
          }}>
            Zes duidelijke stappen, zonder verrassingen.
          </p>
        </div>

        <div className="ww-raster">
          <div className="ww-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" decoding="async" src="/images/15.JPEG" alt="Luchtfoto van een verzorgd dak na de werken van MOS-X" />
          </div>
          {delen.map((d, di) => (
            <div key={d.label} className="ww-kaart">
              <span className="ww-label">{d.label}</span>
              <h3 className="ww-titel">{d.titel}</h3>
              <ol className="ww-stappen">
                {d.stappen.map((s, si) => {
                  const nr = di * 3 + si + 1;
                  const isOpen = open === nr;
                  return (
                    <li key={s.titel}>
                      <button type="button" className="ww-vraag" aria-expanded={isOpen} aria-controls={`ww-stap-${nr}`} onClick={() => setOpen(isOpen ? null : nr)}>
                        <span className="ww-nr">{nr}</span>
                        <span className="ww-stap-titel">{s.titel}</span>
                        <span className="ww-plus"><Plus size={16} strokeWidth={2.5} /></span>
                      </button>
                      <div id={`ww-stap-${nr}`} className={`ww-antw${isOpen ? " open" : ""}`}>
                        <div><p className="ww-stap-tekst">{s.tekst}</p></div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <BtnPress
            href="/#calculator"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#9BCB6C", color: "#FFFFFF", borderRadius: "10px", padding: "14px 28px",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "15px",
              textDecoration: "none", transition: "background 200ms ease",
              boxShadow: "0 8px 20px -10px rgba(122,181,78,0.8)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
            onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
          >
            Bereken mijn richtprijs
            <ChevronRight size={16} strokeWidth={2.5} />
          </BtnPress>
        </div>

      </div>
    </section>
  );
}
