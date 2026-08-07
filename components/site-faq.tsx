"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

const faqs = [
  {
    q: "Wat kost een dakreiniging?",
    a: "De prijs hangt af van de oppervlakte, bereikbaarheid en de staat van je dak. Via onze calculator ontvang je binnen 1 minuut een vrijblijvende richtprijs op maat.",
    btn: true,
  },
  {
    q: "Heb ik een dakcoating nodig?",
    a: "Niet elk dak heeft een coating nodig. Tijdens de inspectie bekijken we de staat van je dak en adviseren we alleen wat écht een meerwaarde biedt.",
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
              Bereken je richtprijs
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
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
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

        {faqs.map((faq, i) => (
          <FaqItem key={i} faq={faq} defaultOpen={i === 0} />
        ))}

      </div>
    </section>
  );
}
