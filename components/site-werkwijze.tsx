"use client";

import { ChevronRight } from "lucide-react";
import { BtnPress } from "@/components/btn-press";

const delen = [
  {
    label: "Deel 1",
    titel: "Je offerte",
    stappen: [
      { titel: "Richtprijs berekenen", tekst: "Bereken online je richtprijs en weet meteen waar je aan toe bent." },
      { titel: "Kies je volgende stap", tekst: "Kies een plaatsbezoek, of laat ons je dak op afstand bekijken." },
      { titel: "Offerte op maat", tekst: "Een duidelijke offerte, afgestemd op jouw dak en situatie." },
    ],
  },
  {
    label: "Deel 2",
    titel: "Je dak",
    stappen: [
      { titel: "Professionele uitvoering", tekst: "Vakkundig en zorgvuldig, op het afgesproken moment." },
      { titel: "Oplevering & nazorg", tekst: "We leveren pas op als alles netjes is, en blijven bereikbaar." },
      { titel: "Jaarlijkse opvolging", tekst: "Met MOS-X Dakzorg blijft je dak jarenlang verzorgd." },
    ],
  },
];

export default function SiteWerkwijze() {
  return (
    <section style={{
      background: "radial-gradient(900px 500px at 85% 10%, rgba(155,203,108,0.10), transparent 65%), radial-gradient(800px 500px at 10% 100%, rgba(155,203,108,0.08), transparent 65%), #F7F8F6",
      padding: "100px 0", width: "100%", position: "relative", overflow: "hidden",
    }}>
      {/* Zachte golven onderaan, zoals een heuvellandschap */}
      <svg aria-hidden="true" viewBox="0 0 1440 420" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: "55%", zIndex: 0, maskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)" }}>
        <path d="M0,170 C240,90 480,90 720,150 C960,210 1200,220 1440,120 L1440,420 L0,420 Z" fill="#9BCB6C" fillOpacity="0.04" />
        <path d="M0,250 C260,190 520,200 760,250 C1000,300 1220,300 1440,230 L1440,420 L0,420 Z" fill="#9BCB6C" fillOpacity="0.04" />
        <path d="M0,330 C300,290 600,300 860,330 C1100,358 1280,350 1440,320 L1440,420 L0,420 Z" fill="#9BCB6C" fillOpacity="0.04" />
      </svg>
      {/* Bolletjes rechtsboven */}
      <svg aria-hidden="true" width="140" height="110" viewBox="0 0 140 110" style={{ position: "absolute", top: "40px", right: "6%", zIndex: 0 }}>
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
        .ww-stappen li { min-height: 104px; box-sizing: border-box; display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 14px; padding: 18px 0; border-top: 1px solid #E5E7EB; }
        .ww-stappen li:first-child { border-top: 0; }
        .ww-nr { width: 34px; height: 34px; border-radius: 50%; background: #9BCB6C; color: #fff; display: grid; place-items: center; font-size: 14px; font-weight: 800; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ww-stap-titel { margin: 5px 0 0; font-size: 16px; font-weight: 700; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ww-stap-tekst { margin: 4px 0 0; max-width: 270px; font-size: 14.5px; line-height: 1.55; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; text-wrap: balance; }
        @media (max-width: 1024px) {
          .ww-raster { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
          .ww-foto { grid-column: 1 / -1; min-height: 280px; }
        }
        @media (max-width: 680px) {
          .ww-raster { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .ww-foto { min-height: 220px; }
          .ww-kaart { padding: 22px 20px 4px; }
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
            Zo verloopt <span style={{ color: "#9BCB6C" }}>jouw traject</span> met MOS-X.
          </h2>
          <p style={{
            fontSize: "16px", color: "#545454", lineHeight: 1.7,
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            maxWidth: "800px", margin: "0 auto", textWrap: "balance",
          }}>
            Duidelijk, transparant en zonder verrassingen. Van eerste richtprijs tot een levenslang verzorgd dak.
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
                {d.stappen.map((s, si) => (
                  <li key={s.titel}>
                    <span className="ww-nr">{di * 3 + si + 1}</span>
                    <div>
                      <p className="ww-stap-titel">{s.titel}</p>
                      <p className="ww-stap-tekst">{s.tekst}</p>
                    </div>
                  </li>
                ))}
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
