"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";


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

        {/* Grid: video links, 2 foto's rechts */}
        <div className="realisaties-preview-grid" style={{ display: "grid", gridTemplateColumns: "500px 350px", gap: "24px", alignItems: "start", margin: "0 auto", width: "fit-content" }}>
          {/* Links: video met native controls */}
          <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.10)", background: "#000", maxHeight: "500px" }}>
            <video
              src="/videos/video-dakreiniging.mp4"
              controls
              muted
              playsInline
              style={{ width: "100%", height: "500px", objectFit: "cover", display: "block" }}
            />
          </div>
          {/* Rechts: 2 foto's die de volledige hoogte vullen */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "500px" }}>
            <div style={{ flex: 1, borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
              <img
                src="/images/IMG_5898.JPEG"
                alt="Dakreiniging resultaat"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{ flex: 1, borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
              <img
                src="/images/IMG_5942.JPEG"
                alt="Dakreiniging resultaat"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
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

