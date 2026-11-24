"use client";

import { Tv, ChevronRight, Play, X } from "lucide-react";
import Link from "next/link";
import { BtnPress } from "@/components/btn-press";
import { useRef, useEffect, useState } from "react";
import { preload } from "react-dom";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";

export default function SiteHero() {
  const trustindexRef = useRef<HTMLDivElement>(null);
  const [bezoekOpen, setBezoekOpen] = useState(false);
  // Op gsm een staande video, anders wordt de liggende video te sterk ingezoomd
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setVideoOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [videoOpen]);
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
      style={{ height: "calc(100vh + 30px)", minHeight: "calc(100vh + 30px)", background: "radial-gradient(900px 600px at 82% 48%, rgba(155,203,108,0.16), transparent 65%), radial-gradient(700px 500px at 0% 100%, rgba(155,203,108,0.08), transparent 70%), linear-gradient(to bottom, #FFFFFF 0%, #F7F8F6 100%)", width: "100%", maxWidth: "100vw", overflow: "hidden" }}
    >
      <style>{`
        .hv-grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr); gap: 56px; align-items: center; width: 100%; }
        .hv-kaart { position: relative; display: block; width: 100%; aspect-ratio: 16 / 10; padding: 0; border: 0; cursor: pointer; border-radius: 22px; overflow: hidden; background: #0B0F0C;
          box-shadow: 0 2px 6px rgba(26,26,26,0.06), 0 34px 70px -28px rgba(30,51,36,0.55); transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease; }
        .hv-kaart:hover { transform: translateY(-4px); box-shadow: 0 2px 6px rgba(26,26,26,0.06), 0 44px 80px -28px rgba(30,51,36,0.6); }
        .hv-kaart:active { transform: translateY(-1px) scale(0.995); }
        .hv-kaart:focus-visible { outline: 3px solid #9BCB6C; outline-offset: 4px; }
        .hv-kaart video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.22,1,.36,1); }
        .hv-kaart:hover video { transform: scale(1.04); }
        .hv-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,12,9,0.72) 0%, rgba(8,12,9,0.1) 45%, rgba(8,12,9,0) 70%); }
        .hv-play { position: absolute; left: 50%; top: 50%; width: 84px; height: 84px; margin: -42px 0 0 -42px; border-radius: 50%; background: #9BCB6C; color: #fff; display: grid; place-items: center;
          box-shadow: 0 14px 30px -10px rgba(122,181,78,0.9); transition: transform .3s cubic-bezier(.34,1.56,.64,1), background-color .2s ease; }
        .hv-play::before { content: ""; position: absolute; inset: -10px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.7); animation: hv-puls 2.4s cubic-bezier(.22,1,.36,1) infinite; }
        .hv-kaart:hover .hv-play { transform: scale(1.08); background: #7AB54E; }
        @keyframes hv-puls { 0% { transform: scale(.9); opacity: .9 } 70%,100% { transform: scale(1.35); opacity: 0 } }
        .hv-onder { position: absolute; left: 22px; right: 22px; bottom: 18px; display: flex; align-items: flex-end; justify-content: space-between; color: #fff; text-align: left; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .hv-onder small { display: block; font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #9BCB6C; }
        .hv-onder b { display: block; font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin-top: 2px; }
        .hv-duur { font-size: 12px; font-weight: 700; padding: 5px 10px; border-radius: 999px; background: rgba(255,255,255,0.16); backdrop-filter: blur(6px); }
        .hv-deco { position: absolute; inset: -26px -26px auto auto; width: 140px; height: 140px; border-radius: 28px; border: 2px dashed rgba(155,203,108,0.45); z-index: -1; }
        .hv-modal { position: fixed; inset: 0; z-index: 3000; background: rgba(8,12,9,0.9); display: flex; align-items: center; justify-content: center; padding: 20px; animation: hv-in .25s ease; }
        .hv-modal video { width: min(1100px, 100%); max-height: 82vh; border-radius: 16px; background: #000; box-shadow: 0 30px 80px -20px rgba(0,0,0,0.8); }
        .hv-sluit { position: absolute; top: 18px; right: 18px; width: 46px; height: 46px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.08); color: #fff; display: grid; place-items: center; cursor: pointer; transition: background-color .2s ease; }
        .hv-sluit:hover { background: rgba(255,255,255,0.2); }
        .hv-sluit:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
        @keyframes hv-in { from { opacity: 0 } to { opacity: 1 } }
        @media (max-width: 1023px) {
          .hv-grid { grid-template-columns: minmax(0, 1fr); gap: 36px; }
          .hv-deco { display: none; }
          .hv-play { width: 68px; height: 68px; margin: -34px 0 0 -34px; }
          .hv-onder b { font-size: 16px; }
        }
        @media (prefers-reduced-motion: reduce) { .hv-play::before { animation: none; } .hv-kaart, .hv-kaart video { transition: none; } }
      `}</style>

      {/* Content */}
      <div
        className="hero-content-wrap relative flex items-center"
        style={{ height: "calc(100vh + 30px)", zIndex: 2, maxWidth: "1300px", margin: "0 auto", width: "100%", paddingLeft: "40px", paddingRight: "40px" }}
      >
        <div
          className="hv-grid"
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
                color: "#1A1A1A",
              }}
            >
              Levenslang een
              <br />
              <span style={{ color: "#9BCB6C" }}>verzorgd dak.</span>
            </h1>

            <p
              className="hero-desc leading-relaxed mb-8"
              style={{ color: "#545454", fontSize: "18px", maxWidth: "560px" }}
            >
              <span style={{ display: "block", color: "#1A1A1A", fontWeight: 700, fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontSize: "19px", marginBottom: "8px" }}>
                <span style={{ whiteSpace: "nowrap" }}>Dak vervangen? <span style={{ color: "#7AB54E" }}>Vernieuw het!</span></span>{" "}
                <span style={{ whiteSpace: "nowrap" }}>Waarom te veel betalen?</span>
              </span>
              Een dakcoating is vele malen goedkoper dan een nieuw dak, sneller klaar en jarenlang duurzaam. Je dak ziet er weer als nieuw uit, en blijft dat levenslang dankzij ons onderhoud.
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
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#CFE5B8"; e.currentTarget.style.color = "#1A1A1A"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#FFFFFF",
                  color: "#1A1A1A",
                  border: "1px solid #CFE5B8",
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
              <a href="#reviews" className="hero-google-mini" style={{ display: "none", alignItems: "center", gap: "5px", height: "26px", padding: "0 8px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap" }}>
                <svg width="12" height="12" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#1A1A1A", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>5.0</span>
                <span style={{ fontSize: "10px", color: "#F5B300", letterSpacing: "-1px" }}>★★★★★</span>
                <span style={{ fontSize: "10px", fontWeight: 600, color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>16 reviews</span>
              </a>
              <div className="hero-google-widget" style={{ display: "inline-flex", alignItems: "center", overflow: "hidden", height: "30px", padding: "0 6px", background: "white", border: "1px solid #E5E7EB", borderRadius: "10px" }}>
                <div style={{ display: "inline-block", zoom: 0.75, flexShrink: 0 }}>
                  <div ref={trustindexRef} />
                </div>
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                background: "#FFFFFF",
                border: "1.5px solid #D9DED3",
                borderRadius: "8px", padding: "6px 12px",
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: "11px", fontWeight: 400, fontFamily: "var(--font-inter), system-ui, sans-serif", color: "#545454" }}>Bekend van</span>
                <Tv style={{ width: "11px", height: "11px", flexShrink: 0, color: "#1A1A1A" }} />
                <span style={{ fontSize: "12px", fontWeight: 900, fontFamily: "var(--font-montserrat), system-ui, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", color: "#1A1A1A" }}>VTM Lifestyle</span>
                <span style={{ fontSize: "13px", fontStyle: "italic", fontWeight: 700, fontFamily: "Georgia, serif", color: "#1A1A1A" }}>&amp;</span>
                <span style={{ fontSize: "12px", fontStyle: "italic", fontWeight: 400, fontFamily: "Georgia, serif", color: "#FF6600" }}>Wonen</span>
              </span>
            </div>
          </div>

          {/* ── Right column: video ── */}
          <div style={{ position: "relative", zIndex: 0 }}>
            <span className="hv-deco" aria-hidden="true" />
            <button type="button" className="hv-kaart" onClick={() => setVideoOpen(true)} aria-label="Bekijk de video van Yannick aan het werk">
              <video ref={videoRef} poster="/images/yannick-hero-poster.jpg" autoPlay muted loop playsInline aria-hidden="true" />
              <span className="hv-shade" />
              <span className="hv-play"><Play size={30} fill="currentColor" style={{ marginLeft: "4px" }} /></span>
              <span className="hv-onder">
                <span><small>Bekijk de video</small><b>Yannick aan het werk</b></span>
                <span className="hv-duur">0:30</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {videoOpen && (
        <div className="hv-modal" role="dialog" aria-modal="true" aria-label="Video: Yannick aan het werk" onClick={() => setVideoOpen(false)}>
          <button type="button" className="hv-sluit" aria-label="Video sluiten" onClick={() => setVideoOpen(false)}><X size={22} /></button>
          <video src="/videos/yannick-hero.mp4" poster="/images/yannick-hero-poster.jpg" controls autoPlay playsInline onClick={e => e.stopPropagation()} />
        </div>
      )}

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
