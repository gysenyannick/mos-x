"use client";

import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

const GOOGLE_REVIEW_URL = "https://www.google.com/search?sca_esv=bcc915fd4b92abab&rlz=1C1GCEU_enBE1139BE1139&hl=nl-BE&sxsrf=ANbL-n6TrSUrDpAkVOrNUQ51U5GNZs9b_Q:1781020093012&q=MOS-X+%7C+Dakontmossing+%26+Coating+Reviews&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qORc7vib1r0gQO2ABjRXpl_uRZy99-xBVdTGpP89RMUA3yzcvCK6A2AazedCdjGkX1gn8bkQ%3D&uds=ALYpb_mOSBfVE_qjsUIUDwhXk-cv8R5BmJbdPhES1TRqg_vpjJyijAOWQNUWx-ymHj1rypkaCI5vDZLjKLW1ObrTyqmMebN8NP7CqX96tO1wgBatLBTT6ccEki20RIqT8UXa_cZv3U6K&sa=X&ved=2ahUKEwiuju3vwPqUAxVNRaQEHUolF-wQ3PALegQIMBAF&biw=1920&bih=911&dpr=1";
// Vervang met de directe write-review link uit je Google Business dashboard (g.page/r/…/review)
const GOOGLE_WRITE_REVIEW_URL = GOOGLE_REVIEW_URL;

const outlineBtnStyle: React.CSSProperties = {
  display: "inline-block",
  border: "1px solid rgba(155,203,108,0.5)",
  color: "#FFFFFF",
  background: "transparent",
  borderRadius: "8px",
  padding: "12px 28px",
  fontSize: "14px",
  fontWeight: 600,
  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
  textDecoration: "none",
  cursor: "pointer",
  transition: "border-color 0.2s ease, color 0.2s ease",
};

const greenBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  color: "#FFFFFF",
  background: "#9BCB6C",
  borderRadius: "8px",
  padding: "12px 28px",
  fontSize: "14px",
  fontWeight: 600,
  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
  textDecoration: "none",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
};

function OutlineGoogleBtn({ text, url }: { text: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={outlineBtnStyle}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#9BCB6C";
        (e.currentTarget as HTMLAnchorElement).style.color = "#9BCB6C";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(155,203,108,0.5)";
        (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF";
      }}
    >
      {text}
    </a>
  );
}

function GreenGoogleBtn({ text, url }: { text: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={greenBtnStyle}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#7AB54E"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#9BCB6C"; }}
    >
      {text}
      <ChevronRight size={14} strokeWidth={2.5} />
    </a>
  );
}

export default function SiteReviews() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Trustindex loader finds its own <script> tag in the DOM and replaces
    // it in-place with the widget div — so the script must be a child of
    // the container where the widget should appear, not in <head>.
    if (container.querySelector('script[src*="trustindex"]')) return;
    const s = document.createElement("script");
    s.async = true;
    s.defer = true;
    s.src = "https://cdn.trustindex.io/loader.js?fef0a94745e4774d1e565f515dc";
    container.appendChild(s);
  }, []);

  return (
    <section className="site-pad site-reviews-section" id="reviews" style={{ background: "#0B0F0C", position: "relative", overflow: "hidden" }}>

      {/* Decorative background photo */}
      <img
        src="/images/IMG_5397.JPEG"
        aria-hidden="true"
        className="reviews-bg-photo"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "32%",
          objectFit: "cover",
          objectPosition: "center center",
          opacity: 0.45,
          pointerEvents: "none",
          transform: "scaleX(-1)",
        }}
      />
      {/* Gradient overlay */}
      <div className="reviews-bg-gradient" style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: "50%",
        background: "linear-gradient(to bottom, #0B0F0C 0%, transparent 25%, transparent 75%, #0B0F0C 100%), linear-gradient(to right, transparent 15%, #0B0F0C 55%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      <div className="site-wrap" style={{ position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="font-bold leading-tight mb-6"
            style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              letterSpacing: "-0.028em",
              color: "#FFFFFF",
            }}
          >
            Mooi resultaat. Duidelijke afspraken.<br /><span style={{ color: "#9BCB6C" }}>Heldere communicatie.</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "16px",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.6,
            marginBottom: "24px",
          }}>
            Niet onze woorden, maar die van onze klanten. Lees zelf waarom huiseigenaars MOS-X aanbevelen.
          </p>
          <OutlineGoogleBtn text="Laat een review achter" url={GOOGLE_WRITE_REVIEW_URL} />
        </div>

        {/* Trustindex injects here — script tag is appended to this div via useEffect */}
        <div
          ref={containerRef}
          style={{ maxWidth: "1400px", margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}
        />

        <div style={{ textAlign: "center", marginTop: "32px", position: "relative", zIndex: 2 }}>
          <GreenGoogleBtn text="Bekijk alle reviews op Google" url={GOOGLE_REVIEW_URL} />
        </div>

      </div>

      {/* Moss texture image */}
      <img
        src="/images/mos-texture.png"
        alt=""
        className="hidden lg:block"
        style={{
          position: "absolute",
          right: "-40px",
          top: "0",
          height: "100%",
          width: "auto",
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Moss texture decoration */}
      <div className="hidden lg:block" style={{
        position: "absolute",
        right: "-80px",
        top: "120px",
        width: "360px",
        height: "520px",
        opacity: 0.22,
        pointerEvents: "none",
        background: `
          radial-gradient(circle at 30% 20%, #9ACA63 0 3px, transparent 4px),
          radial-gradient(circle at 70% 35%, #9ACA63 0 5px, transparent 6px),
          radial-gradient(circle at 45% 60%, #9ACA63 0 4px, transparent 5px),
          radial-gradient(circle at 80% 75%, #9ACA63 0 7px, transparent 8px),
          radial-gradient(circle, rgba(154,202,99,0.28), transparent 65%)
        `,
        filter: "blur(0.5px)",
        transform: "rotate(-12deg)",
        zIndex: 0,
      }} />
    </section>
  );
}
