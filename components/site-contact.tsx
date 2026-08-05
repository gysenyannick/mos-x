"use client";

import Image from "next/image";
import { Phone, CheckCircle, ChevronRight } from "lucide-react";
import { useState } from "react";

const GREEN = "#9ACA63";
const DARK = "#0B0F0C";


export default function SiteContact() {
  const [btnHovered, setBtnHovered] = useState(false);
  const [phoneHovered, setPhoneHovered] = useState(false);

  return (
    <>
    <style>{`
      @media (max-width: 1023px) {
        .site-contact-grid {
          grid-template-columns: 1fr !important;
          padding: 28px 24px 24px !important;
          gap: 28px !important;
        }
        .contact-col-divider {
          padding-left: 0 !important;
          border-left: none !important;
          margin-top: 0 !important;
        }
      }
    `}</style>
    <section style={{
      background: "#F7F8F6",
      padding: "60px 24px 80px",
      position: "relative",
      zIndex: 20,
    }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div className="site-contact-grid" style={{
          background: `radial-gradient(ellipse at 100% 100%, rgba(154,202,99,0.15) 0%, transparent 60%), #0B0F0C`,
          border: "1px solid #9BCB6C",
          borderRadius: "28px",
          boxShadow: "0 28px 90px rgba(0,0,0,0.4)",
          padding: "36px 64px",
          position: "relative",
          marginBottom: "0",
          zIndex: 20,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "stretch",
          boxSizing: "border-box",
        }}>

          {/* ── Col 1: Headline + curved arrow ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{
              fontSize: "9.5px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.12em", color: GREEN, marginBottom: "16px",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <svg width="16" height="12" viewBox="0 0 18 13" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, borderRadius: "2px" }}>
                <rect x="0"  width="6"  height="13" fill="#000000" />
                <rect x="6"  width="6"  height="13" fill="#FFE000" />
                <rect x="12" width="6"  height="13" fill="#EF3340" />
              </svg>
              Actief regio Antwerpen, Limburg,{" "}<br />Vlaams-Brabant
            </p>
            <h2 style={{
              fontSize: "clamp(1.9rem, 2.2vw, 1.9rem)", fontWeight: 800,
              color: "#FFFFFF", lineHeight: 1.2, letterSpacing: "-0.028em",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              marginBottom: "14px",
            }}>
              Levenslang een <span style={{ color: GREEN }}>verzorgd dak</span><br />begint hier.
            </h2>
            <p style={{
              fontSize: "15px", color: `rgba(255,255,255,0.6)`, lineHeight: 1.65,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}>
              Persoonlijk advies van Yannick.<br />Alleen wat je dak écht nodig heeft.
            </p>
          </div>

          {/* ── Col 2: CTA button ── */}
          <div className="contact-col-divider" style={{ display: "flex", flexDirection: "column" }}>
            <p style={{
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.14em", color: GREEN, marginBottom: "16px",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            }}>
              Jouw richtprijs
            </p>
            {/* Checkmarks */}
            <div className="contact-checkmarks" style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "0" }}>
              {["Vrijblijvend", "Binnen 1 minuut", "Persoonlijk advies"].map((txt) => (
                <div key={txt} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle size={18} color="#9BCB6C" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <span style={{
                    fontSize: "15px", color: "rgba(255,255,255,0.75)",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontWeight: 500,
                  }}>{txt}</span>
                </div>
              ))}
            </div>

            {/* Primary CTA button */}
            <a
              href="https://v0-dak-calculator.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: "58px", width: "100%", borderRadius: "12px",
                background: btnHovered ? "#7AB54E" : GREEN,
                color: "#FFFFFF", fontSize: "14px", fontWeight: 800,
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                textDecoration: "none", letterSpacing: "0.04em",
                transition: "background 200ms ease",
                marginTop: "auto",
                boxSizing: "border-box",
              }}
            >
              BEREKEN JE RICHTPRIJS
              <ChevronRight size={16} strokeWidth={2.5} />
            </a>
          </div>

          {/* ── Col 3: Yannick contact block ── */}
          <div className="contact-col-divider" style={{ display: "flex", flexDirection: "column" }}>
            <p style={{
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.14em", color: GREEN, marginBottom: "16px",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            }}>
              Persoonlijk advies nodig?
            </p>

            {/* Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div style={{ position: "relative", width: "64px", height: "64px", flexShrink: 0 }}>
                <Image
                  src="/images/Yannick Icon foto.png"
                  alt="Yannick"
                  width={128}
                  height={128}
                  quality={100}
                  style={{
                    width: "64px", height: "64px",
                    objectFit: "cover", borderRadius: "50%",
                    border: `2px solid ${GREEN}`,
                  }}
                />
                <span style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: GREEN, border: "2px solid #0B0F0C",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="#0B0F0C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <div>
                <p style={{
                  fontSize: "16px", fontWeight: 700, color: "#FFFFFF",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  marginBottom: "4px",
                }}>
                  Yannick
                </p>
                <p style={{
                  fontSize: "13px", color: `rgba(255,255,255,0.55)`, lineHeight: 1.5,
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                }}>
                  Alleen wat je dak écht nodig heeft.
                </p>
              </div>
            </div>

            <p className="contact-hours" style={{
              fontSize: "13px", color: `rgba(255,255,255,0.5)`,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              marginBottom: "16px",
            }}>
              Ma - Za: 08:00 - 17:00<br />Zo: Gesloten
            </p>

            {/* Phone button — pushed to bottom with marginTop auto */}
            <a
              href="tel:+32468352869"
              onMouseEnter={() => setPhoneHovered(true)}
              onMouseLeave={() => setPhoneHovered(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px", height: "58px", width: "100%", borderRadius: "12px",
                background: "transparent",
                border: phoneHovered ? "1px solid #9BCB6C" : "1px solid rgba(155,203,108,0.5)",
                color: phoneHovered ? "#9BCB6C" : "#FFFFFF",
                fontSize: "15px", fontWeight: 700,
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                textDecoration: "none",
                transition: "border-color 0.2s ease, color 0.2s ease",
                marginTop: "auto",
                boxSizing: "border-box",
              }}
            >
              <Phone size={17} />
              +32 468 35 28 69
            </a>
          </div>

          {/* Mobile only: chevron + regio kaart */}
          <div className="block lg:hidden">
            <div style={{ display: "flex", justifyContent: "center", lineHeight: 0 }}>
              <svg width="32" height="17" viewBox="0 0 32 17" fill="none">
                <path d="M1 1L16 16L31 1" stroke="#9BCB6C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ marginTop: "24px" }}>
              <img
                src="/images/Regio kaart witte achtergrond.png"
                alt="Werkgebied Mos-X"
                style={{ width: "100%", display: "block", borderRadius: "12px" }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
