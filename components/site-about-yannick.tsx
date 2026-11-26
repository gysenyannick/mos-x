"use client";

import { ChevronRight } from "lucide-react";
import { BtnPress } from "@/components/btn-press";

const usps = [
  "We komen onze afspraken na.",
  "We behandelen je dak met de grootste zorg.",
  "We communiceren helder en snel.",
  "We blijven ook na de werken bereikbaar.",
];

export default function SiteAboutYannick() {

  return (
    <section style={{
      padding: "80px 0", overflow: "hidden", position: "relative",
      background: "radial-gradient(700px 420px at 12% 20%, rgba(155,203,108,0.10), transparent 65%), radial-gradient(640px 400px at 92% 85%, rgba(155,203,108,0.08), transparent 65%), #F7F8F6",
      borderTop: "1px solid #EEF0EA", borderBottom: "1px solid #EEF0EA",
    }}>
      <div className="about-yannick-wrap" style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>

        <div className="flex flex-col lg:flex-row" style={{ gap: "32px", alignItems: "stretch" }}>

          {/* ── LINKS: foto ── */}
          <div className="about-yannick-photo-wrap" style={{ flex: "0 0 45%", position: "relative" }}>
            {/* Groene blob achter de foto */}
            <style>{`
              .ay-naam { position: absolute; z-index: 2; left: 4px; bottom: 34px; padding: 10px 16px; border-radius: 12px;
                background: rgba(11,15,12,0.82); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
                box-shadow: 0 12px 28px -12px rgba(0,0,0,0.5); }
              .ay-naam-n { margin: 0; color: #FFFFFF; font: 700 15px var(--font-montserrat), system-ui, sans-serif; }
              .ay-naam-r { margin: 2px 0 0; color: #9BCB6C; font: 500 12px var(--font-inter), system-ui, sans-serif; white-space: nowrap; }
              .ay-blob { position: absolute; z-index: 0; inset: 22px -16px -8px 20px; background: #9BCB6C; border-radius: 60% 40% 42% 58% / 44% 56% 44% 56%; }
              .about-yannick-photo-inner { border-radius: 60% 40% 42% 58% / 44% 56% 44% 56% !important; overflow: hidden; }
              .about-yannick-photo { border-radius: 0 !important; }
              @media (min-width: 1024px) {
                .about-yannick-photo-wrap { flex: 0 0 38% !important; margin-right: 56px; align-self: center; }
                .about-yannick-photo-inner { min-height: 420px !important; }
              }
              @media (max-width: 1023px) { .ay-blob { inset: 16px -10px -6px 14px; } .about-yannick-photo-wrap { margin: 0 10px 10px 0; } .about-yannick-photo-inner { min-height: 340px !important; } }
            `}</style>
            <span className="ay-blob" aria-hidden="true" />
            {/* Naamlabel */}
            <div className="ay-naam">
              <p className="ay-naam-n">Yannick</p>
              <p className="ay-naam-r">Oprichter &amp; meewerkend zaakvoerder</p>
            </div>
            <div className="about-yannick-photo-inner" style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              minHeight: "460px",
              boxShadow: "0 30px 60px -30px rgba(30,51,36,0.45)",
              borderRadius: "16px",
            }}>
              <img loading="lazy" decoding="async"
                src="/images/yannick-op-dak-srgb.JPEG"
                alt="Yannick van MOS-X aan het werk op een dak"
                className="about-yannick-photo"
                style={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 70%",
                  borderRadius: "16px",
                }}
              />

            </div>
          </div>

          {/* ── RECHTS: tekst ── */}
          <div style={{ flex: "1 1 0" }}>

            {/* Headline */}
            <p style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontWeight: 600, fontSize: "12px", color: "#9BCB6C",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px",
            }}>
              WAAROM MOS-X
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontWeight: 800, fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.15,
              color: "#1A1A1A", marginBottom: "16px", letterSpacing: "-0.028em",
            }}>
              Kiezen voor MOS-X<br />is kiezen voor <span style={{ color: "#9BCB6C" }}>gemoedsrust.</span>
            </h2>

            {/* Green accent line */}
            <div style={{ width: "48px", height: "3px", background: "#9BCB6C", borderRadius: "2px", marginBottom: "20px" }} />

            {/* Body */}
            <p style={{
              fontSize: "16px", lineHeight: 1.7, color: "#545454",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              marginBottom: "40px", maxWidth: "560px", textWrap: "balance",
            }}>
              Een dak reinigen is één ding. Een bedrijf kiezen waarop je kunt vertrouwen, is minstens even belangrijk. Daarom staan bij <span style={{ whiteSpace: "nowrap" }}>MOS-X</span> duidelijke afspraken, heldere communicatie en goede service centraal.
            </p>

            {/* USPs */}
            <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "clamp(14px, 3.9vw, 15px)", color: "#1A1A1A", marginBottom: "12px" }}>
              Vier beloftes die we aan elke klant maken.
            </p>
            <div className="sm:w-fit" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
              {usps.map((title) => (
                <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", height: "27px" }}>
                    <span style={{
                      width: "20px", height: "20px",
                      background: "#9BCB6C",
                      borderRadius: "50%",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", color: "#FFFFFF", fontWeight: 700,
                    }}>✓</span>
                  </span>
                  <p style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontWeight: 400, fontSize: "clamp(13px, 3.65vw, 14px)", lineHeight: 1.7, color: "#666666",
                    margin: 0,
                  }}>{title}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="about-btns" style={{ display: "flex", gap: "12px", marginTop: "36px", flexWrap: "wrap" }}>
              <BtnPress
                href="/over-ons"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  border: "2px solid #9BCB6C", color: "#9BCB6C",
                  background: "transparent", borderRadius: "8px",
                  padding: "12px 24px", fontSize: "15px", fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  textDecoration: "none", transition: "background 200ms ease, color 200ms ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#9BCB6C"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9BCB6C"; }}
              >
                Meer over ons
              </BtnPress>
              <BtnPress
                href="/#calculator"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#9BCB6C", color: "#FFFFFF",
                  border: "none", borderRadius: "8px",
                  padding: "12px 24px", fontSize: "15px", fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  textDecoration: "none", transition: "background 200ms ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
                onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
              >
                Bereken mijn richtprijs
                <ChevronRight size={14} strokeWidth={2.5} />
              </BtnPress>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
