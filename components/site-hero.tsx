"use client";

import { Phone, Tv, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect } from "react";

export default function SiteHero() {
  const trustindexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = trustindexRef.current;
    if (!container) return;
    if (container.querySelector('script[src*="trustindex"]')) return;
    const s = document.createElement("script");
    s.async = true;
    s.defer = true;
    s.src = "https://cdn.trustindex.io/loader.js?1b15ba67596980480f76d1d0d69";
    container.appendChild(s);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "calc(100vh + 30px)", minHeight: "calc(100vh + 30px)", background: "#1A1A1A", width: "100%", maxWidth: "100vw", overflow: "hidden" }}
    >
      {/* Video background */}
      <video
        src="/videos/yannick-hero.mp4"
        autoPlay muted loop playsInline
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover", zIndex: 0,
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: "linear-gradient(to right, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.88) 45%, rgba(26,26,26,0.55) 65%, rgba(26,26,26,0.30) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="hero-content-wrap relative flex items-center"
        style={{ height: "calc(100vh + 30px)", zIndex: 2, maxWidth: "1300px", margin: "0 auto", width: "100%", paddingLeft: "40px", paddingRight: "40px" }}
      >
        <div
          className="w-full max-w-3xl"
          style={{ paddingTop: "40px", paddingBottom: "60px" }}
        >

          {/* ── Left column ── */}
          <div>
            <p
              className="mb-5 text-[10px] md:text-[12px]"
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#9BCB6C",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <svg width="18" height="13" viewBox="0 0 18 13" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, borderRadius: "2px", marginTop: "1px" }}>
                <rect x="0"  width="6"  height="13" fill="#000000" />
                <rect x="6"  width="6"  height="13" fill="#FFE000" />
                <rect x="12" width="6"  height="13" fill="#EF3340" />
              </svg>
              <span>Actief regio Antwerpen, Limburg, Vlaams-Brabant</span>
            </p>

            <h1
              className="leading-[1.06] mb-6"
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                letterSpacing: "-0.028em",
                color: "#FFFFFF",
              }}
            >
              Levenslang een
              <br />
              <span style={{ color: "#9BCB6C" }}>verzorgd dak.</span>
            </h1>

            <p
              className="leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.62)", fontSize: "18px", maxWidth: "620px" }}
            >
              MOS-X reinigt, beschermt en onderhoudt je dak, zodat het er goed uitziet én jarenlang in topconditie blijft.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/#calculator"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#9BCB6C", color: "#fff", borderRadius: "8px",
                  padding: "14px 28px", fontSize: "16px", fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  textDecoration: "none", transition: "background 200ms ease", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
                onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
              >
                Bereken mijn richtprijs
                <ChevronRight size={15} strokeWidth={2.5} />
              </Link>
              <a
                href="tel:+32468352869"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "1px solid rgba(155,203,108,0.5)",
                  borderRadius: "8px", padding: "14px 28px",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "15px", textDecoration: "none",
                  transition: "border-color 0.2s ease, color 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#9BCB6C"; e.currentTarget.style.color = "#9BCB6C"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; e.currentTarget.style.color = "#FFFFFF"; }}
              >
                Plan een gratis plaatsbezoek
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col items-start gap-3 mb-8">
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.6)",
                borderRadius: "8px", padding: "6px 12px",
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: "11px", fontWeight: 400, fontFamily: "var(--font-inter), system-ui, sans-serif", color: "#FFFFFF" }}>Bekend van</span>
                <Tv style={{ width: "11px", height: "11px", flexShrink: 0, color: "#FFFFFF" }} />
                <span style={{ fontSize: "12px", fontWeight: 900, fontFamily: "var(--font-montserrat), system-ui, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", color: "#FFFFFF" }}>VTM Lifestyle</span>
                <span style={{ fontSize: "13px", fontStyle: "italic", fontWeight: 700, fontFamily: "Georgia, serif", color: "#FFFFFF" }}>&amp;</span>
                <span style={{ fontSize: "12px", fontStyle: "italic", fontWeight: 400, fontFamily: "Georgia, serif", color: "#FF6600" }}>Wonen</span>
              </span>
              <div style={{ display: "inline-flex", alignItems: "center", overflow: "hidden", height: "30px", padding: "0 6px", background: "white", borderRadius: "10px" }}>
                <div style={{ display: "inline-block", zoom: 0.75, flexShrink: 0 }}>
                  <div ref={trustindexRef} />
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Wave onderaan */}
      <div style={{ position: "absolute", bottom: "-1px", left: 0, width: "100%", overflow: "hidden", lineHeight: 0, zIndex: 3 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "80px" }}>
          <path d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z" fill="#F7F8F6"/>
        </svg>
      </div>
    </section>
  );
}
