"use client";

import { useState } from "react";
import { ChevronRight, Phone, Clock } from "lucide-react";

const faqs = [
  {
    q: "Wat kost een dakreiniging?",
    a: "De prijs hangt af van de oppervlakte, bereikbaarheid en de staat van je dak. Via onze calculator ontvang je binnen 1 minuut een vrijblijvende richtprijs voor jouw dak.",
    btn: true,
  },
  {
    q: "Heb ik een dakcoating nodig?",
    a: "Niet elk dak heeft een coating nodig. Yannick bekijkt de staat van je dak en adviseert alleen wat écht een meerwaarde biedt.",
  },
  {
    q: "Welke daktypes behandelen jullie?",
    a: "We behandelen vrijwel alle soorten daken, waaronder betonnen dakpannen, keramische dakpannen en leien. Alleen asbestdaken mogen we wettelijk niet reinigen.",
  },
  {
    q: "Kan een dakreiniging mijn dak beschadigen?",
    a: "Nee. We stemmen onze reinigingsmethode af op het type dak en de staat van de dakpannen. Zo reinigen we veilig én met respect voor jouw dak.",
  },
  {
    q: "Hoe lang blijft mijn dak proper?",
    a: "Dat hangt af van de omgeving, het type dak en de hoeveelheid schaduw. Met de juiste bescherming en periodieke opvolging blijft je dak jarenlang in optimale conditie.",
  },
  {
    q: "Moet ik thuis zijn tijdens de werken?",
    a: "Nee. Zolang we toegang hebben tot de woning kunnen de werken in de meeste gevallen zonder jouw aanwezigheid uitgevoerd worden.",
  },
  {
    q: "Hoe lang duren de werken?",
    a: "De meeste projecten worden binnen één tot 2 werkdagen afgerond. Bij grotere of complexere daken informeren we je vooraf over de verwachte duur.",
  },
  {
    q: "Is er garantie op de uitgevoerde werken?",
    a: "Ja. Afhankelijk van de gekozen behandeling of coating bieden we garantie op onze werkzaamheden. We leggen dit vooraf duidelijk uit in de offerte.",
  },
];

const WA_URL = "https://wa.me/32468352869?text=Hallo%20Yannick%2C%20ik%20heb%20nog%20een%20vraag%20over%20mijn%20dak.";
const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function ContactCard() {
  return (
    <div style={{
      background: "#FFFFFF",
      borderRadius: "16px",
      padding: "28px 24px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #E5E7EB",
    }}>
      {/* Title */}
      <h3 style={{
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        fontWeight: 800, fontSize: "1.3rem", lineHeight: 1.25,
        color: "#1A1A1A", marginBottom: "10px", letterSpacing: "-0.02em",
      }}>
        Staat <span style={{ color: "#9BCB6C" }}>jouw vraag</span><br />er niet tussen?
      </h3>
      <p style={{
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        fontSize: "14px", color: "#666666", lineHeight: 1.6, marginBottom: "20px",
      }}>
        Stel ze gerust rechtstreeks aan Yannick.
      </p>

      {/* Profile row */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        background: "#F7F8F6", borderRadius: "10px",
        padding: "12px 14px", marginBottom: "16px",
      }}>
        <div style={{ position: "relative", width: "64px", height: "64px", flexShrink: 0, borderRadius: "50%", border: "2px solid #9BCB6C", overflow: "hidden" }}>
          <img
            src="/images/IMG_4678.PNG"
            alt="Yannick"
            style={{
              position: "absolute", top: "65%", left: "50%",
              transform: "translate(-50%, -50%) scale(1.4)",
              width: "64px", height: "64px",
              objectFit: "cover",
            }}
          />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontWeight: 700, fontSize: "14px", color: "#1A1A1A",
            }}>Yannick</span>
            <span style={{
              width: "16px", height: "16px", background: "#9BCB6C", borderRadius: "50%",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "9px", color: "#FFFFFF", fontWeight: 700, flexShrink: 0,
            }}>✓</span>
          </div>
          <p style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "12px", color: "#9BCB6C", margin: 0, fontWeight: 500,
          }}>Dakspecialist MOS-X</p>
        </div>
      </div>

      {/* WhatsApp button */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          width: "100%", background: "#9BCB6C", color: "#FFFFFF",
          fontWeight: 700, fontSize: "14px", borderRadius: "10px", padding: "13px 16px",
          textDecoration: "none", marginBottom: "10px",
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          transition: "background 200ms ease",
          boxSizing: "border-box",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
        onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
      >
        {WA_ICON}
        WhatsApp Yannick
      </a>

      {/* Phone button */}
      <a
        href="tel:+32468352869"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          width: "100%", background: "transparent", color: "#1A1A1A",
          fontWeight: 600, fontSize: "14px", borderRadius: "10px", padding: "12px 16px",
          textDecoration: "none", marginBottom: "14px",
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          border: "1px solid #9BCB6C",
          transition: "border-color 200ms ease, color 200ms ease",
          boxSizing: "border-box",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#7AB54E"; e.currentTarget.style.color = "#7AB54E"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#9BCB6C"; e.currentTarget.style.color = "#1A1A1A"; }}
      >
        <Phone size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
        +32 468 35 28 69
      </a>

      {/* Hours */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        <Clock size={13} color="#9BCB6C" strokeWidth={2} />
        <span style={{
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          fontSize: "12px", color: "#888888",
        }}>
          Ma - Za: 08:00 - 17:00
        </span>
      </div>
    </div>
  );
}

function FaqItem({ faq, defaultOpen }: { faq: typeof faqs[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div style={{ borderBottom: "1px solid #E5E7EB" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{
          fontSize: "16px", fontWeight: 700, color: "#111111",
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          paddingRight: "16px",
        }}>
          {faq.q}
        </span>
        <span style={{
          color: "#9BCB6C", fontSize: "18px", flexShrink: 0,
          display: "inline-block",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
        }}>
          ↓
        </span>
      </button>

      <div style={{
        overflow: "hidden",
        maxHeight: open ? "400px" : "0",
        transition: "max-height 0.3s ease",
      }}>
        <div style={{ paddingBottom: "20px" }}>
          <p style={{
            fontSize: "15px", color: "#555555", lineHeight: 1.7,
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}>
            {faq.a}
          </p>
          {faq.btn && (
            <a
              href="/#calculator"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "16px",
                background: "#9BCB6C", color: "#FFFFFF",
                fontWeight: 700, fontSize: "13px",
                borderRadius: "8px", padding: "10px 20px",
                textDecoration: "none",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                transition: "background 200ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
              onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
            >
              Bereken mijn richtprijs
              <ChevronRight size={14} strokeWidth={2.5} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SiteFaq() {
  return (
    <section style={{ background: "#F7F8F6", padding: "100px 24px" }}>
      <style>{`
        .faq-wrap {
          max-width: 1100px;
          margin: 0 auto;
        }
        .faq-header {
          margin-bottom: 48px;
        }
        .faq-layout {
          display: flex;
          gap: 48px;
          align-items: flex-start;
        }
        .faq-content {
          flex: 1;
          min-width: 0;
        }
        .faq-card-col {
          flex: 0 0 300px;
          position: sticky;
          top: 120px;
        }
        @media (max-width: 900px) {
          .faq-layout {
            flex-direction: column;
            gap: 40px;
          }
          .faq-card-col {
            flex: none;
            position: static;
            width: 100%;
          }
        }
      `}</style>

      <div className="faq-wrap">

        {/* Title — full width above */}
        <div className="faq-header">
          <p style={{
            fontSize: "12px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#9BCB6C", marginBottom: "12px",
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          }}>
            Veelgestelde vragen
          </p>
          <h2 style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#1A1A1A",
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            letterSpacing: "-0.028em", lineHeight: 1.15,
          }}>
            Nog vragen over je dak?
          </h2>
        </div>

        {/* Two columns: FAQ left, contact card right */}
        <div className="faq-layout">

          {/* Left: FAQ accordion */}
          <div className="faq-content">
            {faqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} />
            ))}
          </div>

          {/* Right: sticky contact card */}
          <div className="faq-card-col">
            <ContactCard />
          </div>

        </div>
      </div>
    </section>
  );
}
