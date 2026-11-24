"use client";

import { ChevronRight, Play, X } from "lucide-react";
import { BtnPress } from "@/components/btn-press";
import { useEffect, useState } from "react";

import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";

export default function SiteHero() {
  const [bezoekOpen, setBezoekOpen] = useState(false);
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

      {/* Achtergrond: scherpe dronefoto van een gecoat dak, met een warme waas zodat de tekst leesbaar blijft */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero-achtergrond-coating.jpg" alt="" aria-hidden="true" className="hv-bgfoto" />
      <div aria-hidden="true" className="hv-waas" />

      <style>{`
        .hero-sectie .hero-content-wrap { z-index: 2; }
        .hv-trust { position: absolute; left: 0; right: 0; bottom: 92px; z-index: 2; text-align: center; padding: 0 20px; }
        .hv-trust-titel { margin: 0 0 12px; font: 500 13.5px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .02em; color: rgba(255,255,255,0.6); }
        .hv-trust-rij { display: flex; align-items: center; justify-content: center; gap: 34px; flex-wrap: wrap; color: rgba(255,255,255,0.72); }
        .hv-trust-item { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: inherit; white-space: nowrap; transition: color .2s ease; }
        .hv-trust-item .vtm { font: 900 22px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.04em; text-transform: lowercase; }
        .hv-trust-item .prog b { font: 800 13px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .08em; }
        .hv-trust-item .prog i { font: italic 400 15px Georgia, serif; }
        .hv-trust-google b { font: 800 16px var(--font-montserrat), system-ui, sans-serif; }
        .hv-trust-google .st { letter-spacing: 1px; font-size: 14px; }
        .hv-trust-google .n { font: 600 13.5px var(--font-inter), system-ui, sans-serif; }
        .hv-trust-google:hover { color: #FFFFFF; }
        .hv-trust-google:hover .st { color: #F5B300; }
        .hv-trust-google:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 4px; border-radius: 6px; }
        .hv-trust-lijn { width: 1px; height: 26px; background: rgba(255,255,255,0.22); }
        @media (max-width: 1023px) {
          .hv-trust { position: relative; bottom: auto; margin: -110px 0 120px; }
          .hv-trust-rij { gap: 14px 20px; }
          .hv-trust-lijn { display: none; }
          .hv-trust-titel { font-size: 12.5px; }
        }
        .hv-bgfoto { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 60% 50%; z-index: 0; }
        .hv-waas { position: absolute; inset: 0; z-index: 0; background: linear-gradient(to right, rgba(20,22,20,0.94) 0%, rgba(20,22,20,0.86) 45%, rgba(20,22,20,0.72) 100%), linear-gradient(to bottom, rgba(20,22,20,0.3) 0%, rgba(20,22,20,0) 30%, rgba(20,22,20,0) 70%, rgba(20,22,20,0.6) 100%); }
        @media (max-width: 1023px) { .hv-waas { background: rgba(20,22,20,0.8); } }
        .hero-sectie .hero-content-wrap { z-index: 2; }
        .hv-gloed { position: absolute; left: 50%; top: 50%; width: 125%; aspect-ratio: 1; transform: translate(-50%, -50%); z-index: -2; border-radius: 50%;
          background: radial-gradient(circle, rgba(155,203,108,0.16) 0%, rgba(155,203,108,0.08) 40%, rgba(155,203,108,0) 70%); filter: blur(30px); pointer-events: none; }
        .hv-accent { position: relative; display: inline-block; }
        .hv-streep { position: absolute; left: 0; bottom: -0.12em; width: 96%; height: 0.24em; }
        .hv-grid { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr); gap: 64px; align-items: center; width: 100%; }
        .hv-rechts { position: relative; isolation: isolate; padding: 40px 0; }
        @media (min-width: 1024px) {
          .hv-rechts .hv-kaart { width: 100%; aspect-ratio: 16 / 10.5; border-radius: 22px; box-shadow: 0 40px 80px -36px rgba(0,0,0,0.8); }
          .hv-rechts .hv-kaart:hover { transform: none; }
        }
        .hv-blob { position: absolute; inset: 62px -16px 22px 18px; z-index: -1;
          border-radius: 24px;
          background: #9BCB6C; }
        .hv-kaart { position: relative; display: block; width: 100%; aspect-ratio: 4 / 3; padding: 0; border: 0; cursor: pointer; border-radius: 22px; overflow: hidden; background: #0B0F0C;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.10), 0 40px 80px -30px rgba(0,0,0,0.85); transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease; }
        .hv-kaart:hover { transform: translateY(-4px); box-shadow: 0 0 0 1px rgba(155,203,108,0.45), 0 48px 90px -30px rgba(0,0,0,0.9); }
        .hv-kaart:active { transform: translateY(-1px) scale(0.995); }
        .hv-kaart:focus-visible { outline: 3px solid #9BCB6C; outline-offset: 4px; }
        .hv-kaart video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.22,1,.36,1); }
        .hv-kaart:hover video { transform: scale(1.04); }
        .hv-play { position: absolute; left: 50%; top: 50%; width: 84px; height: 84px; margin: -42px 0 0 -42px; border-radius: 50%; background: #9BCB6C; color: #fff; display: grid; place-items: center;
          box-shadow: 0 14px 30px -10px rgba(122,181,78,0.9); transition: transform .3s cubic-bezier(.34,1.56,.64,1), background-color .2s ease; }
        .hv-play::before { content: ""; position: absolute; inset: -10px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.7); animation: hv-puls 2.4s cubic-bezier(.22,1,.36,1) infinite; }
        .hv-kaart:hover .hv-play { transform: scale(1.08); background: #7AB54E; }
        @keyframes hv-puls { 0% { transform: scale(.9); opacity: .9 } 70%,100% { transform: scale(1.35); opacity: 0 } }

        .hv-modal { position: fixed; inset: 0; z-index: 3000; background: rgba(8,12,9,0.9); display: flex; align-items: center; justify-content: center; padding: 20px; animation: hv-in .25s ease; }
        .hv-modal video { width: auto; max-width: 100%; max-height: 86vh; border-radius: 16px; background: #000; box-shadow: 0 30px 80px -20px rgba(0,0,0,0.8); }
        .hv-sluit { position: absolute; top: 18px; right: 18px; width: 46px; height: 46px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.08); color: #fff; display: grid; place-items: center; cursor: pointer; transition: background-color .2s ease; }
        .hv-sluit:hover { background: rgba(255,255,255,0.2); }
        .hv-sluit:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
        @keyframes hv-in { from { opacity: 0 } to { opacity: 1 } }
        @media (max-width: 1023px) {
          .hv-grid { grid-template-columns: minmax(0, 1fr); gap: 0; }
          .hv-rechts { margin-top: 32px; }
          .hv-rechts { order: -1; width: 92%; margin: 0 auto 34px; }
          .hero-sectie .hero-region-label { justify-content: center; text-align: center; }
          .hero-sectie .hero-title, .hero-sectie .hero-desc { text-align: center; margin-left: auto; margin-right: auto; }
          .hv-streep { left: 2%; }
          .hero-sectie .hero-title { font-size: clamp(2.4rem, 11vw, 3rem) !important; }
          .hv-rechts .hv-kaart { aspect-ratio: 16 / 10.5; border-radius: 18px; box-shadow: 0 30px 60px -30px rgba(0,0,0,0.8); }
          .hv-blob { inset: 54px -10px 28px 14px; border-radius: 20px; }
          .hv-play { width: 64px; height: 64px; margin: -32px 0 0 -32px; }
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
              style={{ color: "rgba(255,255,255,0.68)", fontSize: "18px", maxWidth: "600px" }}
            >
              Een dak zonder mos is een <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>dak zonder zorgen</strong>. <span style={{ whiteSpace: "nowrap" }}>MOS-X</span> <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>reinigt en coat</strong> je dak, en houdt het <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>levenslang mosvrij</strong> met ons unieke <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>onderhoudsplan</strong>.
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

          </div>

          {/* Rechts: video met sticker */}
          <div className="hv-rechts">
            <span className="hv-gloed" aria-hidden="true" />
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

      {/* Vertrouwensbalk onderaan de hero, zoals "We onderhouden alle grote merken" */}
      <div className="hv-trust">
        <p className="hv-trust-titel">Bekend van tv, geliefd bij onze klanten</p>
        <div className="hv-trust-rij">
          <span className="hv-trust-item" aria-label="Gezien op VTM in Lifestyle en Wonen">
            <span className="vtm">vtm</span>
            <span className="prog"><b>LIFESTYLE</b> <i>&amp; Wonen</i></span>
          </span>
          <span className="hv-trust-lijn" aria-hidden="true" />
          <a href="#reviews" className="hv-trust-item hv-trust-google" aria-label="5,0 op 5 sterren, 16 Google-reviews">
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/></svg>
            <b>5,0</b><span className="st" aria-hidden="true">★★★★★</span><span className="n">16 Google-reviews</span>
          </a>
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
