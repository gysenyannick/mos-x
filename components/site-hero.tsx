"use client";

import { Phone, Tv, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BtnPress } from "@/components/btn-press";
import { useRef, useEffect, useState } from "react";
import { preload } from "react-dom";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import MosVolger from "@/components/mos-volger";

export default function SiteHero() {
  const trustindexRef = useRef<HTMLDivElement>(null);
  const [bezoekOpen, setBezoekOpen] = useState(false);
  // Op gsm een staande video, anders wordt de liggende video te sterk ingezoomd
  const videoRef = useRef<HTMLVideoElement>(null);
  preload("/images/yannick-hero-poster.jpg", { as: "image", fetchPriority: "high" });
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Tot de video geladen is, toont de poster meteen een beeld.
    v.src = "/videos/yannick-hero.mp4";
    v.play().catch(() => {});
  }, []);

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
      className="relative overflow-hidden hero-sectie"
      style={{ height: "calc(100vh + 30px)", minHeight: "calc(100vh + 30px)", background: "#1A1A1A", width: "100%", maxWidth: "100vw", overflow: "hidden" }}
    >
      <MosVolger />

      {/* Video background */}
      <video
        ref={videoRef}
        poster="/images/yannick-hero-poster.jpg"
        autoPlay muted loop playsInline
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover", zIndex: 0,
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 hero-overlay"
        style={{ zIndex: 1 }}
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
              className="hero-region-label mb-5 text-[10px] md:text-[12px]"
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
              <span>Actief regio Antwerpen, Limburg,{" "}
                <span style={{ whiteSpace: "nowrap" }}>Vlaams-Brabant</span>
              </span>
            </p>

            <h1
              className="hero-title leading-[1.06] mb-6"
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
              className="hero-desc leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.62)", fontSize: "18px", maxWidth: "620px" }}
            >
              MOS-X reinigt, beschermt en onderhoudt je dak, zodat het er goed uitziet én jarenlang in topconditie blijft.
            </p>

            {/* CTAs */}
            <div className="hero-ctas flex flex-wrap gap-3 mb-8">
              <BtnPress
                className="mx-glow"
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
              </BtnPress>
              <button
                onClick={() => setBezoekOpen(true)}
                onPointerDown={e => { const el = e.currentTarget; el.style.transform = "scale(0.98) translateY(1px)"; el.style.opacity = "0.88"; setTimeout(() => { el.style.transform = ""; el.style.opacity = ""; }, 150); }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#9BCB6C"; e.currentTarget.style.color = "#9BCB6C"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; e.currentTarget.style.color = "#FFFFFF"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "1px solid rgba(155,203,108,0.5)",
                  borderRadius: "8px", padding: "14px 28px",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "15px",
                  transition: "border-color 0.2s ease, color 0.2s ease, transform 140ms ease, opacity 140ms ease",
                  whiteSpace: "nowrap", cursor: "pointer",
                }}
              >
                Plan een gratis plaatsbezoek
              </button>
            </div>

            {/* Trust indicators */}
            <div className="hero-badges flex flex-row items-center flex-wrap gap-3 mb-8">
              {/* Gsm: eigen compacte Google-badge */}
              <a href="#reviews" className="hero-google-mini" style={{ display: "none", alignItems: "center", gap: "5px", height: "26px", padding: "0 8px", background: "#FFFFFF", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap" }}>
                <svg width="12" height="12" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#1A1A1A", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>5.0</span>
                <span style={{ fontSize: "10px", color: "#F5B300", letterSpacing: "-1px" }}>★★★★★</span>
                <span style={{ fontSize: "10px", fontWeight: 600, color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>16 reviews</span>
              </a>
              <div className="hero-google-widget" style={{ display: "inline-flex", alignItems: "center", overflow: "hidden", height: "30px", padding: "0 6px", background: "white", borderRadius: "10px" }}>
                <div style={{ display: "inline-block", zoom: 0.75, flexShrink: 0 }}>
                  <div ref={trustindexRef} />
                </div>
              </div>
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
            </div>
          </div>


        </div>
      </div>

      <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} bron="Homepage" />

      {/* Wave onderaan */}
      <div style={{ position: "absolute", bottom: "-1px", left: 0, width: "100%", overflow: "hidden", lineHeight: 0, zIndex: 3 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "80px" }}>
          <path d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z" fill="#F7F8F6"/>
        </svg>
      </div>
    </section>
  );
}
