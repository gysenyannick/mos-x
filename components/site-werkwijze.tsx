"use client";

import { useState } from "react";
import { Calculator, MapPin, FileText, Home, ShieldCheck, ChevronRight } from "lucide-react";

const steps = [
  {
    Icon: Calculator,
    step: "STAP 01",
    title: "Richtprijs berekenen",
    desc: "Bereken eenvoudig online je richtprijs en weet meteen waar je ongeveer aan toe bent.",
  },
  {
    Icon: MapPin,
    step: "STAP 02",
    title: "Kies je volgende stap",
    desc: "Interesse na je richtprijs? Kies voor een plaatsbezoek of laat Yannick je dak op afstand bekijken.",
  },
  {
    Icon: FileText,
    step: "STAP 03",
    title: "Offerte op maat",
    desc: "Yannick bekijkt je dak en maakt een duidelijke offerte afgestemd op jouw situatie.",
  },
  {
    Icon: Home,
    step: "STAP 04",
    title: "Professionele uitvoering",
    desc: "We voeren de werken vakkundig en zorgvuldig uit, op het afgesproken moment.",
  },
  {
    Icon: ShieldCheck,
    step: "STAP 05",
    title: "Oplevering & nazorg",
    desc: "We leveren pas op wanneer alles netjes is afgewerkt en blijven bereikbaar voor advies.",
  },
];

function StepCard({ Icon, step, title, desc, showButton, wide }: typeof steps[0] & { showButton?: boolean; wide?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="werkwijze-step-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexGrow: wide ? 0 : 1,
        flexShrink: wide ? 0 : 1,
        flexBasis: wide ? "220px" : "0%",
        background: "#0B0F0C",
        border: `1px solid ${hovered ? "#9BCB6C" : "rgba(155,203,108,0.35)"}`,
        borderRadius: "16px",
        padding: "28px 20px",
        boxShadow: hovered
          ? "0 4px 24px rgba(155,203,108,0.18)"
          : "0 2px 16px rgba(0,0,0,0.25)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 250ms ease, transform 250ms ease, border-color 250ms ease",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 0%, rgba(155,203,108,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Top: icon | vertical line (mobile) | step label + title */}
      <div className="step-card-top">
        <div className="step-card-icon" style={{
          width: "48px", height: "48px", borderRadius: "50%",
          background: "rgba(155,203,108,0.12)",
          border: "1px solid rgba(155,203,108,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, position: "relative",
        }}>
          <Icon size={22} color="#9BCB6C" strokeWidth={2} />
        </div>

        <div className="step-card-vline" />

        <div className="step-card-header-text">
          <p style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#9BCB6C", marginBottom: "6px",
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            whiteSpace: "nowrap", position: "relative",
          }}>
            {step}
          </p>
          <p style={{
            fontSize: "14px", fontWeight: 700, color: "#FFFFFF",
            marginBottom: "10px", lineHeight: 1.3,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            position: "relative",
          }}>
            {title}
          </p>
        </div>
      </div>

      {/* Green horizontal divider — desktop only, hidden on mobile */}
      <div className="step-card-hdivider" style={{
        width: "32px", height: "2px", background: "#9BCB6C",
        borderRadius: "2px", marginBottom: "12px",
        flexShrink: 0, position: "relative",
      }} />

      {/* Description */}
      <p className="step-card-desc" style={{
        fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65,
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        position: "relative",
      }}>
        {desc}
      </p>


      {showButton && (
        <div className="werkwijze-cta-wrap" style={{ marginTop: "24px", alignSelf: "flex-start" }}>
          <a
            href="/#calculator"
            className="werkwijze-cta-btn"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#9BCB6C", color: "#FFFFFF",
              fontWeight: 700, fontSize: "13px",
              borderRadius: "8px", padding: "10px 5px",
              textDecoration: "none",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              border: "2px solid #9BCB6C",
              transition: "background 200ms ease, color 200ms ease",
              whiteSpace: "nowrap", width: "fit-content",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
            onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
          >
            Bereken mijn richtprijs
            <ChevronRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      )}
    </div>
  );
}

function Connector() {
  return (
    <div className="werkwijze-connector" style={{
      width: "40px", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%",
        background: "#0B0F0C", border: "1px solid rgba(155,203,108,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "13px", color: "#9BCB6C", fontWeight: 700,
      }}>
        →
      </div>
    </div>
  );
}

export default function SiteWerkwijze() {
  const items = steps.flatMap((s, i) =>
    i < steps.length - 1
      ? [<StepCard key={`card-${i}`} {...s} showButton={i === 0} wide={i === 0} />, <Connector key={`conn-${i}`} />]
      : [<StepCard key={`card-${i}`} {...s} />]
  );

  return (
    <section style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(155,203,108,0.06) 0%, transparent 65%), #F7F8F6", padding: "100px 0", width: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .werkwijze-cta-wrap {
            margin-top: 6px !important;
          }
        }
      `}</style>
      <div className="site-wrap">

        {/* Header */}
        <div style={{ marginBottom: "56px", textAlign: "center" }}>
          <h2 style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#1A1A1A",
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            letterSpacing: "-0.028em", lineHeight: 1.15, marginBottom: "16px",
          }}>
            Zo verloopt <span style={{ color: "#9BCB6C" }}>jouw traject</span> met MOS-X.
          </h2>
          <p style={{
            fontSize: "16px", color: "#666666", lineHeight: 1.7,
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            maxWidth: "800px", margin: "0 auto",
          }}>
            Duidelijk, transparant en zonder verrassingen. Van eerste richtprijs tot een levenslang verzorgd dak.
          </p>
        </div>

        {/* Steps + connectors — flat siblings so alignItems:stretch works */}
        <div className="werkwijze-steps-row" style={{ display: "flex", alignItems: "stretch" }}>
          {items}
        </div>

      </div>
    </section>
  );
}
