"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { useState } from "react";
import { BtnPress } from "@/components/btn-press";

const GREEN = "#9ACA63";
const DARK = "#0B0F0C";

const trustBullets = [
  "200+ daken gereinigd",
  "Geen onderaannemers",
  "Eerlijk advies op maat",
  "Transparante richtprijs",
];

function CheckIcon() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: "20px", height: "20px", borderRadius: "50%",
      background: GREEN, flexShrink: 0,
    }}>
      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
        <path d="M1 4.5L4 7.5L10 1.5" stroke="#0B0F0C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

export default function SiteCta() {
  const [btnHovered, setBtnHovered] = useState(false);
  const [phoneHovered, setPhoneHovered] = useState(false);

  return (
    <section style={{
      background: "#F7F8F6",
      padding: "80px 24px 0",
      position: "relative",
      zIndex: 20,
    }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{
          background: "radial-gradient(circle at top left, rgba(154,202,99,0.16), transparent 32%), #FFFFFF",
          border: "1px solid rgba(154,202,99,0.22)",
          borderRadius: "28px",
          boxShadow: "0 28px 90px rgba(11,15,12,0.14)",
          padding: "56px 64px",
          position: "relative",
          marginBottom: "-55px",
          zIndex: 20,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "56px",
          alignItems: "start",
        }}>

          {/* ── Col 1: Headline + trust bullets ── */}
          <div>
            <p style={{
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.14em", color: GREEN, marginBottom: "16px",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            }}>
              Laat uw dak weer stralen
            </p>
            <h2 style={{
              fontSize: "clamp(1.5rem, 2.2vw, 1.875rem)", fontWeight: 800,
              color: DARK, lineHeight: 1.2, letterSpacing: "-0.028em",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              marginBottom: "16px",
            }}>
              Bereken uw{" "}
              <span style={{ color: GREEN }}>richtprijs</span>
              {" "}binnen 1 minuut.
            </h2>
            <p style={{
              fontSize: "15px", color: `rgba(11,15,12,0.65)`, lineHeight: 1.65,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              marginBottom: "28px",
            }}>
              Geen verplichtingen. Gewoon een eerlijke prijs en persoonlijk advies van Yannick.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {trustBullets.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon />
                  <span style={{
                    fontSize: "14px", fontWeight: 500, color: DARK,
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Col 2: Price + CTA ── */}
          <div style={{
            borderLeft: "1px solid rgba(11,15,12,0.08)",
            paddingLeft: "56px",
          }}>
            <p style={{
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.14em", color: GREEN, marginBottom: "16px",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            }}>
              Uw prijsindicatie
            </p>
            <p style={{
              fontSize: "15px", color: `rgba(11,15,12,0.65)`, lineHeight: 1.65,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              marginBottom: "20px",
            }}>
              Geef uw dak op in 30 seconden en ontvang direct een richtprijs.
            </p>

            {/* Price card */}
            <div style={{
              background: "rgba(154,202,99,0.10)",
              border: "1px solid rgba(154,202,99,0.28)",
              borderRadius: "18px",
              padding: "20px 24px",
              marginBottom: "20px",
            }}>
              <p style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800,
                color: DARK, letterSpacing: "-0.02em",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                marginBottom: "4px",
              }}>
                € 1.250 – € 1.550
              </p>
              <p style={{
                fontSize: "13px", color: `rgba(11,15,12,0.5)`,
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}>
                Exclusief BTW · indicatieve prijs
              </p>
            </div>

            {/* Primary CTA button */}
            <BtnPress
              href="/#calculator"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: "58px", width: "100%", borderRadius: "12px",
                background: btnHovered ? "#7AB54E" : GREEN,
                color: DARK, fontSize: "14px", fontWeight: 800,
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                textDecoration: "none", letterSpacing: "0.04em",
                transition: "background 200ms ease",
                marginBottom: "14px",
              }}
            >
              PRIJS BEREKENEN
            </BtnPress>

            <p style={{
              textAlign: "center", fontSize: "12px",
              color: `rgba(11,15,12,0.45)`,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}>
              🔒 Geen verplichtingen · 100% vrijblijvend
            </p>
          </div>

          {/* ── Col 3: Yannick contact block ── */}
          <div style={{
            borderLeft: "1px solid rgba(11,15,12,0.08)",
            paddingLeft: "56px",
          }}>
            <p style={{
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.14em", color: GREEN, marginBottom: "16px",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            }}>
              Persoonlijk advies nodig?
            </p>

            {/* Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  border: `2px solid ${GREEN}`,
                  overflow: "hidden",
                  position: "relative",
                }}>
                  <Image
                    src="/images/yannick-foto.png"
                    alt="Yannick"
                    width={0} height={0}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                {/* Green verification badge */}
                <span style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: GREEN, border: "2px solid #FFFFFF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="#0B0F0C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <div>
                <p style={{
                  fontSize: "16px", fontWeight: 700, color: DARK,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  marginBottom: "2px",
                }}>
                  Yannick
                </p>
                <p style={{
                  fontSize: "13px", color: `rgba(11,15,12,0.55)`,
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                }}>
                  Eerlijk advies en de juiste oplossing voor uw dak.
                </p>
              </div>
            </div>

            <p style={{
              fontSize: "13px", color: `rgba(11,15,12,0.55)`,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              marginBottom: "20px",
            }}>
              Ma – Za: 08:00 – 17:00 · Zo: Gesloten
            </p>

            {/* Phone button */}
            <BtnPress
              href="tel:+32468352869"
              onMouseEnter={() => setPhoneHovered(true)}
              onMouseLeave={() => setPhoneHovered(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px", height: "58px", width: "100%", borderRadius: "12px",
                background: phoneHovered ? "#1A2620" : DARK,
                color: "#FFFFFF", fontSize: "15px", fontWeight: 700,
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                textDecoration: "none",
                transition: "background 200ms ease",
              }}
            >
              <Phone size={17} />
              +32 468 35 28 69
            </BtnPress>
          </div>

        </div>
      </div>
    </section>
  );
}
