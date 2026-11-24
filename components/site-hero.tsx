"use client";

import { ChevronRight, Play, X } from "lucide-react";
import { BtnPress } from "@/components/btn-press";
import { useEffect, useState } from "react";
import { preload } from "react-dom";

import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";

export default function SiteHero() {
  const [bezoekOpen, setBezoekOpen] = useState(false);
  preload("/images/hero-achtergrond-coating.jpg", { as: "image", fetchPriority: "high" });
  const [videoOpen, setVideoOpen] = useState(false);
  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setVideoOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [videoOpen]);

  return (
    <section
      className="relative overflow-hidden hero-sectie"
      style={{ height: "calc(100vh + 30px)", minHeight: "calc(100vh + 30px)", background: "#1A1A1A", width: "100%", maxWidth: "100vw", overflow: "hidden" }}
    >
      {/* Statische achtergrond: afgewerkt, gecoat dak */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-achtergrond-coating.jpg"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "55% 45%", zIndex: 0 }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 hero-overlay"
        style={{ zIndex: 1 }}
      />

      <style>{`
        .hv-accent { position: relative; display: inline-block; }
        .hv-streep { position: absolute; left: 0; bottom: -0.12em; width: 96%; height: 0.24em; }
        .hv-grid { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr); gap: 64px; align-items: center; width: 100%; }
        .hv-rechts { position: relative; isolation: isolate; padding: 40px 0; }
        @media (min-width: 1024px) {
          .hv-rechts .hv-kaart { width: 100%; aspect-ratio: 1 / 0.92; border-radius: 60% 40% 42% 58% / 44% 56% 44% 56%; box-shadow: 0 40px 80px -36px rgba(0,0,0,0.8); }
          .hv-rechts .hv-kaart:hover { transform: none; }
          .hv-rechts .hv-revkaart { left: -10px; bottom: 96px; }
          .hv-rechts .hv-sticker { top: 70px; right: -6px; width: 128px; height: 128px; }
        }
        .hv-blob { position: absolute; inset: 26px -14px 34px 16px; z-index: -1;
          border-radius: 60% 40% 42% 58% / 44% 56% 44% 56%;
          background: #9BCB6C; }
        @keyframes hv-blob { 0% { border-radius: 58% 42% 54% 46% / 52% 58% 42% 48%; } 100% { border-radius: 46% 54% 42% 58% / 58% 46% 54% 42%; } }
        .hv-kaart { position: relative; display: block; width: 100%; aspect-ratio: 4 / 3; padding: 0; border: 0; cursor: pointer; border-radius: 22px; overflow: hidden; background: #0B0F0C;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.10), 0 40px 80px -30px rgba(0,0,0,0.85); transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease; }
        .hv-kaart:hover { transform: translateY(-4px); box-shadow: 0 0 0 1px rgba(155,203,108,0.45), 0 48px 90px -30px rgba(0,0,0,0.9); }
        .hv-kaart:active { transform: translateY(-1px) scale(0.995); }
        .hv-kaart:focus-visible { outline: 3px solid #9BCB6C; outline-offset: 4px; }
        .hv-kaart video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.22,1,.36,1); }
        .hv-kaart:hover video { transform: scale(1.04); }
        .hv-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,12,9,0.78) 0%, rgba(8,12,9,0.1) 45%, rgba(8,12,9,0) 70%); }
        .hv-play { position: absolute; left: 50%; top: 50%; width: 84px; height: 84px; margin: -42px 0 0 -42px; border-radius: 50%; background: #9BCB6C; color: #fff; display: grid; place-items: center;
          box-shadow: 0 14px 30px -10px rgba(122,181,78,0.9); transition: transform .3s cubic-bezier(.34,1.56,.64,1), background-color .2s ease; }
        .hv-play::before { content: ""; position: absolute; inset: -10px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.7); animation: hv-puls 2.4s cubic-bezier(.22,1,.36,1) infinite; }
        .hv-kaart:hover .hv-play { transform: scale(1.08); background: #7AB54E; }
        @keyframes hv-puls { 0% { transform: scale(.9); opacity: .9 } 70%,100% { transform: scale(1.35); opacity: 0 } }
        .hv-onder { position: absolute; left: 22px; right: 22px; bottom: 18px; display: flex; align-items: flex-end; justify-content: space-between; color: #fff; text-align: left; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .hv-onder small { display: block; font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #9BCB6C; }
        .hv-onder b { display: block; font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin-top: 2px; }
        .hv-duur { font-size: 12px; font-weight: 700; padding: 5px 10px; border-radius: 999px; background: rgba(255,255,255,0.16); backdrop-filter: blur(6px); }
        .hv-sticker { position: absolute; top: -40px; right: -36px; z-index: 3; width: 150px; height: 150px; border-radius: 50%; background: #FFFFFF; transform: none;
          display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; line-height: 1.05;
          box-shadow: 0 16px 34px -12px rgba(0,0,0,0.6); pointer-events: none; }

        .hv-sticker .k { font: 700 9.5px var(--font-inter), system-ui, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #545454; display: flex; align-items: center; gap: 4px; }
        .hv-sticker .v { font: 900 30px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.02em; color: #1A1A1A; margin-top: 4px; }
        .hv-sticker .l { font: 900 11px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #1A1A1A; }
        .hv-sticker .w { font: italic 400 13px Georgia, serif; color: #FF6600; margin-top: 2px; }
        .hv-revkaart { position: absolute; left: -34px; bottom: -30px; z-index: 3; display: flex; align-items: center; gap: 12px; padding: 14px 20px 14px 14px; border-radius: 16px; background: #FFFFFF; text-decoration: none; color: #1A1A1A;
          box-shadow: 0 18px 40px -14px rgba(0,0,0,0.65); transition: transform .25s cubic-bezier(.22,1,.36,1); }
        .hv-revkaart:hover { transform: translateY(-3px); }
        .hv-revkaart:focus-visible { outline: 3px solid #9BCB6C; outline-offset: 3px; }
        .hv-revkaart .g { width: 44px; height: 44px; border-radius: 12px; background: #F7F8F6; display: grid; place-items: center; flex-shrink: 0; }
        .hv-revkaart .r { display: flex; align-items: center; gap: 8px; }
        .hv-revkaart b { font: 800 20px var(--font-montserrat), system-ui, sans-serif; }
        .hv-revkaart .s { color: #F5B300; font-size: 15px; letter-spacing: 1px; }
        .hv-revkaart small { display: block; font: 500 13px var(--font-inter), system-ui, sans-serif; color: #545454; margin-top: 1px; }
        .hv-onder { top: 20px; bottom: auto !important; align-items: flex-start !important; }
        .hv-shade { background: linear-gradient(to bottom, rgba(8,12,9,0.7) 0%, rgba(8,12,9,0.1) 40%, rgba(8,12,9,0) 60%) !important; }
        .hv-badgerij { display: flex; }
        .hv-badge { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; background: #FFFFFF; border-radius: 10px; text-decoration: none; white-space: nowrap;
          box-shadow: 0 6px 16px -8px rgba(0,0,0,0.5); transition: transform .2s ease; }
        .hv-badge:hover { transform: translateY(-1px); }
        .hv-badge:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 3px; }
        .hv-badge b { font: 800 14px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .hv-badge .s { color: #F5B300; font-size: 13px; letter-spacing: -0.5px; }
        .hv-badge .n { font: 600 12.5px var(--font-inter), system-ui, sans-serif; color: #545454; }
        .hv-modal { position: fixed; inset: 0; z-index: 3000; background: rgba(8,12,9,0.9); display: flex; align-items: center; justify-content: center; padding: 20px; animation: hv-in .25s ease; }
        .hv-modal video { width: min(1100px, 100%); max-height: 82vh; border-radius: 16px; background: #000; box-shadow: 0 30px 80px -20px rgba(0,0,0,0.8); }
        .hv-sluit { position: absolute; top: 18px; right: 18px; width: 46px; height: 46px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.08); color: #fff; display: grid; place-items: center; cursor: pointer; transition: background-color .2s ease; }
        .hv-sluit:hover { background: rgba(255,255,255,0.2); }
        .hv-sluit:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
        @keyframes hv-in { from { opacity: 0 } to { opacity: 1 } }
        @media (min-width: 1024px) {
          .hero-sectie .hero-overlay { background: linear-gradient(to right, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.88) 50%, rgba(26,26,26,0.8) 100%) !important; }
        }
        @media (max-width: 1023px) {
          .hv-grid { grid-template-columns: minmax(0, 1fr); gap: 0; }
          .hv-rechts { margin-top: 32px; }
          .hv-sticker, .hv-revkaart { display: none; }
          .hv-rechts { order: -1; width: 92%; margin: 0 auto 34px; }
          .hero-sectie .hero-region-label { justify-content: center; text-align: center; }
          .hero-sectie .hero-title, .hero-sectie .hero-desc { text-align: center; margin-left: auto; margin-right: auto; }
          .hv-streep { left: 2%; }
          .hv-badgerij { justify-content: center; }
          .hero-sectie .hero-title { font-size: clamp(2.4rem, 11vw, 3rem) !important; }
          .hv-rechts .hv-kaart { aspect-ratio: 1 / 0.92; border-radius: 60% 40% 42% 58% / 44% 56% 44% 56%; box-shadow: 0 30px 60px -30px rgba(0,0,0,0.8); }
          .hv-blob { inset: 18px -10px 24px 12px; }
          .hv-play { width: 64px; height: 64px; margin: -32px 0 0 -32px; }
              }
        @media (prefers-reduced-motion: reduce) { .hv-blob { animation: none; } .hv-play::before { animation: none; } .hv-kaart, .hv-kaart video { transition: none; } }
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
                color: "rgba(255,255,255,0.85)",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
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
              <span className="hv-accent">
                <span style={{ color: "#9BCB6C" }}>mosvrij dak.</span>
                <svg className="hv-streep" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 12 C 60 4, 140 3, 296 9" fill="none" stroke="#9BCB6C" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p
              className="hero-desc leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.62)", fontSize: "18px", maxWidth: "620px" }}
            >
              Een dak zonder mos is een dak zonder zorgen. MOS-X reinigt en coat je dak, en houdt het levenslang mosvrij met ons unieke onderhoudsplan.
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

            {/* Google-reviews: dezelfde witte badge als op de live site */}
            <div className="hv-badgerij">
              <a href="#reviews" className="hv-badge">
                <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
                <b>5.0</b>
                <span className="s" aria-hidden="true">★★★★★</span>
                <span className="n">16 reviews</span>
              </a>
            </div>
          </div>

          {/* Rechts: video met sticker */}
          <div className="hv-rechts">
            <span className="hv-blob" aria-hidden="true" />
            <button type="button" className="hv-kaart" onClick={() => setVideoOpen(true)} aria-label="Bekijk de video van Yannick aan het werk">
              <video src="/videos/yannick-hero.mp4" poster="/images/yannick-hero-poster.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
              <span className="hv-play"><Play size={30} fill="currentColor" style={{ marginLeft: "4px" }} /></span>
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
