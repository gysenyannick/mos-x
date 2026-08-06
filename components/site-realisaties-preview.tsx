"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";


function LargeSlider() {
  const [split, setSplit] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (cx: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setSplit(Math.min(95, Math.max(5, ((cx - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="realisaties-large-slider"
      style={{
        position: "relative", width: "100%", height: "100%", minHeight: "460px",
        borderRadius: "16px", overflow: "hidden", cursor: "col-resize",
        userSelect: "none", boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
      }}
      onMouseDown={() => (dragging.current = true)}
      onMouseMove={e => { if (dragging.current) move(e.clientX); }}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={() => (dragging.current = true)}
      onTouchMove={e => move(e.touches[0].clientX)}
      onTouchEnd={() => (dragging.current = false)}
    >
      <img src="/images/Before bevel.jpg" alt="Voor behandeling"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        draggable={false} />
      <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 5, background: "rgba(0,0,0,0.65)", color: "#FFFFFF", padding: "6px 14px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
        VOOR
      </div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${split}%)` }}>
        <img src="/images/Na bevel.jpg" alt="Na behandeling"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          draggable={false} />
        <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 5, background: "#9BCB6C", color: "#1A1A1A", padding: "6px 14px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
          NA
        </div>
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: "2px", left: `${split}%`, background: "rgba(255,255,255,0.75)", zIndex: 10, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "44px", height: "44px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #9BCB6C", boxShadow: "0 2px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
          <ChevronLeft style={{ width: "14px", height: "14px", color: "#9BCB6C" }} />
          <ChevronRight style={{ width: "14px", height: "14px", color: "#9BCB6C" }} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontSize: "11px", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none", transition: "opacity 500ms", opacity: split === 50 ? 1 : 0, whiteSpace: "nowrap" }}>
        &larr; sleep &rarr;
      </div>
    </div>
  );
}

function SmallSlider({ beforeSrc, afterSrc, beforePosition = "50% 70%", afterPosition = "50% 70%", label }: {
  beforeSrc: string; afterSrc: string; beforePosition?: string; afterPosition?: string; label: string;
}) {
  const [split, setSplit] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (cx: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setSplit(Math.min(95, Math.max(5, ((cx - r.left) / r.width) * 100)));
  };

  return (
    <div style={{ flex: 1 }}>
      <div
        ref={ref}
        style={{ position: "relative", width: "100%", height: "100%", minHeight: "200px", borderRadius: "12px", overflow: "hidden", cursor: "col-resize", userSelect: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
        onMouseDown={() => (dragging.current = true)}
        onMouseMove={e => { if (dragging.current) move(e.clientX); }}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchStart={() => (dragging.current = true)}
        onTouchMove={e => move(e.touches[0].clientX)}
        onTouchEnd={() => (dragging.current = false)}
      >
        <img src={beforeSrc} alt="Voor" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: beforePosition }} draggable={false} />
        <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 5, background: "rgba(0,0,0,0.65)", color: "#FFFFFF", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>VOOR</div>
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${split}%)` }}>
          <img src={afterSrc} alt="Na" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: afterPosition }} draggable={false} />
          <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 5, background: "#9BCB6C", color: "#1A1A1A", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>NA</div>
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "2px", left: `${split}%`, background: "rgba(255,255,255,0.75)", zIndex: 10, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "36px", height: "36px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #9BCB6C", boxShadow: "0 2px 8px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
            <ChevronLeft style={{ width: "12px", height: "12px", color: "#9BCB6C" }} />
            <ChevronRight style={{ width: "12px", height: "12px", color: "#9BCB6C" }} />
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)", padding: "20px 14px 10px", pointerEvents: "none", zIndex: 5 }}>
          <p style={{ margin: 0, fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "13px", color: "#FFFFFF", textAlign: "center" }}>{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function SiteRealisatiesPreview() {
  return (
    <section style={{ background: "#FFFFFF", padding: "40px 0 72px", position: "relative" }}>
      <div className="site-wrap" style={{ position: "relative", zIndex: 2 }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", letterSpacing: "-0.028em", color: "#1A1A1A", margin: 0 }}>
            Onze <span style={{ color: "#9BCB6C" }}>resultaten.</span>
          </h2>
        </div>

        {/* Grid: grote slider links, 2 kleine rechts */}
        <div className="realisaties-preview-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "24px", alignItems: "stretch" }}>
          <LargeSlider />
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <SmallSlider
              beforeSrc="/images/Velux%20voor%201.0.png"
              afterSrc="/images/Velux%20na%201.0.png"
              beforePosition="center center"
              afterPosition="center center"
              label="Velux"
            />
            <SmallSlider
              beforeSrc="/images/Goot%20voor.JPEG"
              afterSrc="/images/Goot%20na.JPEG"
              label="Dakgoot"
            />
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link
            href="/realisaties"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#9BCB6C", color: "#FFFFFF", borderRadius: "8px", padding: "14px 32px", fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-montserrat), system-ui, sans-serif", textDecoration: "none", transition: "background 200ms ease" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
            onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
          >
            Bekijk alle realisaties
            <ChevronRight size={15} strokeWidth={2.5} style={{ marginLeft: "2px" }} />
          </Link>
        </div>

      </div>

      {/* SVG golf â€” symmetrische transitie naar donkere reviews sectie */}
      <div style={{ position: "absolute", bottom: "-1px", left: 0, width: "100%", overflow: "hidden", lineHeight: 0, zIndex: 3 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="realisaties-wave" style={{ display: "block", width: "100%", height: "80px" }}>
          <path d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z" fill="#0B0F0C"/>
        </svg>
      </div>

    </section>
  );
}

