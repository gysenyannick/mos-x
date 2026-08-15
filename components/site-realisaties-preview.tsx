"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BtnPress } from "@/components/btn-press";
import { useRef, useEffect, useState, useCallback } from "react";

export default function SiteRealisatiesPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoplayed, setHasAutoplayed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoplayed) {
          setHasAutoplayed(true);
          video.play().catch(() => {});
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [hasAutoplayed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay  = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    video.addEventListener("play",  onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("play",  onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  return (
    <section style={{ background: "#FFFFFF", padding: "40px 0 72px", position: "relative" }}>
      <div className="site-wrap" style={{ position: "relative", zIndex: 2 }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", letterSpacing: "-0.028em", color: "#1A1A1A", margin: 0 }}>
Resultaten die je <span style={{ color: "#9BCB6C" }}>ziet.</span>
          </h2>
        </div>

        {/* Grid: video links, 2 foto's rechts */}
        <div className="realisaties-preview-grid" style={{ display: "grid", gridTemplateColumns: "500px 350px", gap: "24px", alignItems: "start", margin: "0 auto", width: "fit-content" }}>
          {/* Links: video met custom play-knop */}
          <div
            className="h-[400px] lg:h-[500px]"
            style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.10)", background: "#000", position: "relative", cursor: "pointer" }}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src="/videos/video-dakreiniging.mp4"
              poster="/images/IMG_4543.JPEG"
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />

            {/* Custom play-knop — zichtbaar wanneer video niet speelt */}
            <div
              style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: isPlaying ? 0 : 1,
                transition: "opacity 200ms ease",
                pointerEvents: isPlaying ? "none" : "auto",
              }}
            >
              {/* Donkere overlay zodat knop goed afsteekt */}
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)" }} />
              {/* Knop */}
              <div style={{
                position: "relative", zIndex: 1,
                width: "72px", height: "72px",
                borderRadius: "50%",
                background: "#9BCB6C",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 24px rgba(155,203,108,0.45), 0 2px 8px rgba(0,0,0,0.25)",
              }}>
                {/* Play driehoek — iets naar rechts voor optisch midden */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "3px" }}>
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>
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
          <BtnPress
            href="/realisaties"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#9BCB6C", color: "#FFFFFF", borderRadius: "8px", padding: "14px 32px", fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-montserrat), system-ui, sans-serif", textDecoration: "none", transition: "background 200ms ease" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
            onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
          >
            Bekijk alle realisaties
            <ChevronRight size={15} strokeWidth={2.5} style={{ marginLeft: "2px" }} />
          </BtnPress>
        </div>

      </div>

      {/* SVG golf — symmetrische transitie naar donkere reviews sectie */}
      <div style={{ position: "absolute", bottom: "-1px", left: 0, width: "100%", overflow: "hidden", lineHeight: 0, zIndex: 3 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="realisaties-wave" style={{ display: "block", width: "100%", height: "80px" }}>
          <path d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z" fill="#0B0F0C"/>
        </svg>
      </div>

    </section>
  );
}
