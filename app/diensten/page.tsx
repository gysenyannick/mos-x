"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, ShieldCheck, ChevronRight } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import { ServiceCard, serviceCards } from "@/components/service-card";

export default function DienstenPage() {
  const [homeHovered, setHomeHovered] = useState(false);
  const [waHovered, setWaHovered] = useState(false);
  const [phoneHovered, setPhoneHovered] = useState(false);

  return (
    <PageLayout>

      {/* ── Page header ── */}
      <section style={{ background: "#F7F8F6", paddingTop: "120px", paddingBottom: "0px" }}>
        <div className="site-wrap">
          {/* Breadcrumb */}
          <BackLink href="/" />
          <p style={{ fontSize: "13px", color: "#545454", marginBottom: "20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            <Link
              href="/"
              onMouseEnter={() => setHomeHovered(true)}
              onMouseLeave={() => setHomeHovered(false)}
              style={{ color: homeHovered ? "#9BCB6C" : "#1A1A1A", textDecoration: "none", transition: "color 180ms ease" }}
            >Home</Link>
            <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "#9BCB6C" }} />
            <span style={{ color: "#9BCB6C" }}>Diensten</span>
          </p>
          <h1 className="leading-tight" style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", color: "#1A1A1A", marginBottom: "10px", lineHeight: 1.15 }}>
            Meer dan een <span style={{ color: "#9BCB6C" }}>proper dak.</span>
          </h1>
          <p style={{ fontSize: "17px", color: "#545454", lineHeight: 1.6, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            Van dakreiniging tot langdurig onderhoud. MOS-X helpt je dak jarenlang beschermd en verzorgd te houden.
          </p>
        </div>
      </section>

      {/* ── Service cards ── */}
      <section className="site-pad" style={{ background: "#F7F8F6", paddingTop: "60px" }}>
        <div className="site-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {serviceCards.map((s) => (
              <ServiceCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA block ── */}
      <section style={{ background: "#F7F8F6", paddingBottom: "80px" }}>
        <div className="site-wrap">
          <div className="page-cta-bar" style={{
            background: "#0B0F0C",
            border: "1px solid rgba(155,203,108,0.25)",
            borderRadius: "16px",
            padding: "32px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
            flexWrap: "wrap",
          }}>
            {/* Text */}
            <div className="page-cta-text" style={{ flex: 1, minWidth: "260px" }}>
              <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "6px", lineHeight: 1.25 }}>
                Niet zeker wat <span style={{ color: "#9BCB6C" }}>jouw dak</span> nodig heeft?
              </p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Niet elk dak heeft een coating nodig. <span className="block lg:hidden" />Soms is een reiniging voldoende. <span className="block lg:hidden" />Yannick helpt je kiezen.
              </p>
            </div>

            {/* Buttons */}
            <div className="page-cta-buttons" style={{ display: "flex", gap: "10px", flexShrink: 0, flexWrap: "wrap" }}>
              <a
                href="https://wa.me/32468352869"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setWaHovered(true)}
                onMouseLeave={() => setWaHovered(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: waHovered ? "#7AB54E" : "#9BCB6C",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px", padding: "12px 20px",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "background-color 0.2s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Yannick
              </a>
              <a
                href="tel:+32468352869"
                onMouseEnter={() => setPhoneHovered(true)}
                onMouseLeave={() => setPhoneHovered(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "transparent",
                  color: phoneHovered ? "#9BCB6C" : "#FFFFFF",
                  border: phoneHovered ? "1px solid #9BCB6C" : "1px solid rgba(155,203,108,0.5)",
                  borderRadius: "8px", padding: "12px 20px",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "border-color 0.2s ease, color 0.2s ease",
                }}
              >
                <Phone size={15} />
                +32 468 35 28 69
              </a>
            </div>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
