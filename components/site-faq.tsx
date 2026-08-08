"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

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

        {/* Compact CTA bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "16px",
          marginTop: "32px",
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          padding: "20px 24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}>
          <p style={{
            fontSize: "15px", fontWeight: 700, color: "#1A1A1A",
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            margin: 0,
          }}>
            Staat je vraag er niet bij?
          </p>
          <a
            href="https://wa.me/32468352869?text=Hallo%20Yannick%2C%20ik%20heb%20nog%20een%20vraag%20over%20mijn%20dak."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#9BCB6C", color: "#FFFFFF",
              fontWeight: 700, fontSize: "14px",
              borderRadius: "8px", padding: "11px 20px",
              textDecoration: "none",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              transition: "background 200ms ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
            onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Stel je vraag aan Yannick
          </a>
        </div>

      </div>
    </section>
  );
}
