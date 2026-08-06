"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Phone, MapPin, CheckCircle } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";

const projecten = [
  {
    title: "Dakreiniging + Dakcoating",
    location: "Herentals",
    category: "dakcoating" as const,
    voorImg: "/images/herentals-voor.png",
    naImg: "/images/herentals-na.png",
    type: "Keramische pannen",
    opp: "210 m²",
    duur: "2 dagen",
  },
  {
    title: "Dakreiniging",
    location: "Olen",
    category: "dakreiniging" as const,
    voorImg: "/images/olen-voor.png",
    naImg: "/images/olen-na.png",
    type: "Betonnen pannen",
    opp: "165 m²",
    duur: "2 dagen",
  },
  {
    title: "Dakreiniging + Dakcoating",
    location: "Bevel",
    category: "dakcoating" as const,
    voorImg: "/images/Before bevel.jpg",
    naImg: "/images/Na bevel.jpg",
    type: "Keramische pannen",
    opp: "180 m²",
    duur: "2 dagen",
  },
  {
    title: "Dakreiniging",
    location: "Koningshooikt",
    category: "dakreiniging" as const,
    voorImg: "/images/koningshooikt-voor.jpg",
    naImg: "/images/koningshooikt-na.jpg",
    type: "Betonnen pannen",
    opp: "140 m²",
    duur: "2 dagen",
  },
];

function LargeSlider() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { dragging.current = true; updatePos(e.clientX); };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp = () => { dragging.current = false; };
  const onTouchStart = (e: React.TouchEvent) => { dragging.current = true; updatePos(e.touches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { if (dragging.current) updatePos(e.touches[0].clientX); };

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
      style={{ position: "relative", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.10)", height: "100%", cursor: "ew-resize", userSelect: "none" }}
    >
      {/* Voor */}
      <img src="/images/IMG_5414.JPEG" alt="Voor behandeling" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", pointerEvents: "none" }} draggable={false} />

      {/* Na — geclipped */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${pos}%)`, pointerEvents: "none" }}>
        <img src="/images/IMG_5436.JPEG" alt="Na behandeling" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} draggable={false} />
      </div>

      {/* Lijn */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: "2px", background: "#FFFFFF", transform: "translateX(-50%)", pointerEvents: "none" }} />

      {/* Handle */}
      <div style={{ position: "absolute", top: "50%", left: `${pos}%`, transform: "translate(-50%, -50%)", width: "40px", height: "40px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #9BCB6C", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.20)", pointerEvents: "none" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9BCB6C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l-6-6 6-6"/><path d="M15 6l6 6-6 6"/></svg>
      </div>

      {/* Labels */}
      <div style={{ position: "absolute", bottom: "14px", left: "14px", background: "rgba(0,0,0,0.65)", color: "#fff", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none" }}>VOOR</div>
      <div style={{ position: "absolute", bottom: "14px", right: "14px", background: "#9BCB6C", color: "#1A1A1A", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none" }}>NA</div>
    </div>
  );
}

function SmallSlider({ beforeSrc, afterSrc, beforePosition = "50% 70%", afterPosition = "50% 70%", height = "350px", title }: { beforeSrc: string; afterSrc: string; beforePosition?: string; afterPosition?: string; height?: string; title?: string }) {
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
      style={{ position: "relative", width: "100%", height, borderRadius: "12px", overflow: "hidden", cursor: "col-resize", userSelect: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
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
      {title && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)", padding: "20px 14px 10px", pointerEvents: "none", zIndex: 5 }}>
          <p style={{ margin: 0, fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "13px", color: "#FFFFFF", textAlign: "center" }}>{title}</p>
        </div>
      )}
    </div>
  );
}

const projectCarouselPhotos: { src: string; type?: "video"; caption: string }[] = [
  { src: "/images/1.JPEG",  caption: "Dakreiniging Schilde" },
  { src: "/images/2.JPEG",  caption: "Dakreiniging Schilde" },
  { src: "/images/3.JPEG",  caption: "Dakreiniging Schilde" },
  { src: "/images/4.jpg",   caption: "Dakreiniging Schilde" },
  { src: "/images/5.JPEG",  caption: "Dakreiniging Schilde" },
  { src: "/images/6.1.mp4", type: "video", caption: "Dakreiniging Schilde" },
  { src: "/images/7.JPEG",  caption: "Dakreiniging Schilde" },
  { src: "/images/8.JPEG",  caption: "Dakreiniging Schilde" },
  { src: "/images/9.JPEG",  caption: "Dakreiniging Schilde" },
  { src: "/images/10.MP4",  type: "video", caption: "Dakreiniging Schilde" },
  { src: "/images/11.jpg",  caption: "Dakreiniging Schilde" },
  { src: "/images/12.jpg",  caption: "Dakreiniging Schilde" },
  { src: "/images/13.jpg",  caption: "Dakreiniging Schilde" },
];

function ProjectCarousel() {
  const [idx, setIdx] = useState(0);
  const item = projectCarouselPhotos[idx];
  const prev = () => setIdx(i => (i - 1 + projectCarouselPhotos.length) % projectCarouselPhotos.length);
  const next = () => setIdx(i => (i + 1) % projectCarouselPhotos.length);
  const isVideo = item.type === "video";

  // Auto-advance elke 4 seconden (6s bij video's)
  useEffect(() => {
    const delay = isVideo ? 6000 : 4000;
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % projectCarouselPhotos.length);
    }, delay);
    return () => clearInterval(timer);
  }, [idx, isVideo]);

  return (
    <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", height: "100%", minHeight: "380px", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", background: "#000" }}>
      {isVideo ? (
        <video
          key={item.src}
          autoPlay
          muted
          loop
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src={item.src} type="video/mp4" />
        </video>
      ) : (
        <>
          {/* Wazig achtergrond */}
          <img key={item.src + "-bg"} src={item.src} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "blur(18px)", transform: "scale(1.08)", pointerEvents: "none" }} draggable={false} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
          {/* Volledige foto */}
          <img key={item.src} src={item.src} alt={item.caption} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} draggable={false} />
        </>
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.55) 100%)" }} />
      {isVideo && (
        <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.65)", color: "#FFFFFF", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif", display: "flex", alignItems: "center", gap: "5px" }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><polygon points="2,1 9,5 2,9"/></svg>
          VIDEO
        </div>
      )}
      <p style={{ position: "absolute", bottom: "44px", left: "16px", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-montserrat), system-ui, sans-serif", margin: 0 }}>{item.caption}</p>
      <p style={{ position: "absolute", bottom: "18px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.65)", fontSize: "12px", fontFamily: "var(--font-inter), system-ui, sans-serif", margin: 0, whiteSpace: "nowrap" }}>{idx + 1} / {projectCarouselPhotos.length}</p>
      <button onClick={prev} aria-label="Vorige" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.90)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
        <ChevronLeft size={18} color="#1A1A1A" />
      </button>
      <button onClick={next} aria-label="Volgende" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.90)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
        <ChevronRight size={18} color="#1A1A1A" />
      </button>
    </div>
  );
}

export default function RealisatiesPage() {
  const [homeHovered, setHomeHovered] = useState(false);
  const [ctaGreenHovered, setCtaGreenHovered] = useState(false);
  const [ctaPhoneHovered, setCtaPhoneHovered] = useState(false);
  const [filterTab, setFilterTab] = useState("alle");
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
    <PageLayout>
      <style>{`
        @media (min-width: 1024px) {
          .realisaties-stats-card {
            padding: 8px 0 !important;
            border-radius: 18px !important;
          }
          .realisaties-stats-card .stat-number {
            font-size: 1.3rem !important;
          }
          .realisaties-stats-card .stat-label {
            font-size: 11px !important;
          }
          .realisaties-stats-card .stat-col {
            padding: 0 22px !important;
          }
          .realisaties-stats-card .trustindex-col {
            padding: 0 32px !important;
            zoom: 0.92 !important;
          }
        }
        @media (max-width: 1023px) {
          /* Hero */
          .realisaties-hero { min-height: 420px !important; padding-bottom: 80px !important; }
          .realisaties-hero-imgwrap { left: 0 !important; }
          .realisaties-hero-gradient {
            background: linear-gradient(to bottom, rgba(247,248,246,0.82) 0%, rgba(247,248,246,0.82) 55%, rgba(247,248,246,0.82) 100%) !important;
          }
          .realisaties-stats-card {
            min-width: 0 !important;
            width: 100% !important;
            display: flex !important;
          }

          /* Uitgelicht project */
          .realisaties-featured-card {
            padding: 24px 20px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .realisaties-main-grid { display: contents !important; }
          .realisaties-sub-grid { display: contents !important; }
          .realisaties-velux-goot { display: contents !important; }
          .realisaties-text-info { display: contents !important; }
          .realisaties-text-header { order: 1; }
          .realisaties-large-slider { order: 2; height: 280px !important; }
          .realisaties-text-body { order: 3; }
          .realisaties-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .realisaties-location-badges { justify-content: center; width: 100%; }
          .realisaties-carousel { order: 3; }
          .realisaties-velux { order: 4; }
          .realisaties-dakgoot { order: 5; }

          /* Bekijk meer */
          .realisaties-project-grid {
            grid-template-columns: 1fr !important;
          }

          /* Werkgebied */
          .werkgebied-card { min-height: 0 !important; }
          .werkgebied-text {
            width: 100% !important;
            padding: 28px 22px 14px !important;
          }
          .werkgebied-regions {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          .werkgebied-media {
            position: relative !important;
            inset: auto !important;
            width: 100% !important;
            height: 281px !important;
          }
          .werkgebied-media img {
            transform: none !important;
            height: 300px !important;
            object-fit: contain !important;
            object-position: center center !important;
          }
          .werkgebied-arrow-desktop { display: none !important; }
          .werkgebied-arrow-mobile {
            display: block !important;
            position: absolute;
            top: 0; left: 0; width: 100%; height: 60px;
            z-index: 10;
            pointer-events: none;
          }
        }
      `}</style>

      {/* â"€â"€ Hero â"€â"€ */}
      <section className="realisaties-hero" style={{ background: "#F7F8F6", paddingTop: "120px", paddingBottom: "50px", position: "relative", overflow: "hidden" }}>

        {/* Foto rechterhelft */}
        <div className="realisaties-hero-imgwrap" style={{ position: "absolute", top: 0, left: "52%", right: 0, bottom: 0, zIndex: 0, overflow: "hidden" }}>
          <img
            src="/images/Lichtaart - After.png"
            alt="Dakreiniging resultaat"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
          />
          <div className="realisaties-hero-gradient" style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #F7F8F6 0%, #F7F8F6 5%, transparent 55%)" }} />
        </div>

        <div className="site-wrap" style={{ position: "relative", zIndex: 1 }}>
          <BackLink href="/" />
          <p style={{ fontSize: "13px", color: "#9BCB6C", marginBottom: "20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            <Link
              href="/"
              onMouseEnter={() => setHomeHovered(true)}
              onMouseLeave={() => setHomeHovered(false)}
              style={{ color: homeHovered ? "#9BCB6C" : "#1A1A1A", textDecoration: "none", transition: "color 180ms ease" }}
            >Home</Link>
            <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "#9BCB6C" }} />
            <span style={{ color: "#9BCB6C" }}>Realisaties</span>
          </p>
          <h1 className="leading-tight max-w-3xl"
            style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", color: "#1A1A1A", marginBottom: "16px" }}>
            Onze realisaties<br /><span style={{ color: "#9BCB6C" }}>spreken voor zich.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "18px", color: "#555555", marginBottom: "24px" }}>
            Echte projecten. Eerlijke resultaten.
          </p>

          {/* Stats inline card */}
          <div className="realisaties-stats-card" style={{ display: "inline-flex", alignItems: "center", background: "#FFFFFF", border: "1px solid #9BCB6C", borderRadius: "16px", padding: "6px 0", boxShadow: "0 4px 24px rgba(155,203,108,0.18)" }}>
            {/* Stat: daken */}
            <div className="stat-col" style={{ flex: "0 0 38%", padding: "0 16px", textAlign: "center" }}>
              <p className="stat-number" style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", color: "#9BCB6C", fontSize: "1.1rem", fontWeight: 800, marginBottom: "2px", lineHeight: 1 }}>55+</p>
              <p className="stat-label" style={{ color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "10px", margin: 0, whiteSpace: "nowrap" }}>Afgewerkte daken</p>
            </div>
            {/* Divider */}
            <div style={{ width: "1px", alignSelf: "stretch", background: "#E5E7EB" }} />
            {/* Trustindex widget — script wordt via useEffect binnenin dit element geladen */}
            <div ref={trustindexRef} className="trustindex-col" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 28px", zoom: 0.82 }} />
          </div>

        </div>
      </section>



      {/* â"€â"€ Uitgelicht project â"€â"€ */}
      <section style={{ background: "#FFFFFF", paddingTop: "48px" }}>
        <div className="site-wrap">
          <div className="realisaties-featured-card" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", padding: "40px 48px" }}>
          <div className="realisaties-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "48px", alignItems: "stretch" }}>

            {/* Links: project info */}
            <div className="realisaties-text-info">
              <div className="realisaties-text-header">
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#9BCB6C", fontFamily: "var(--font-montserrat), system-ui, sans-serif", marginBottom: "10px" }}>
                Uitgelicht project
              </p>
              <h2 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", letterSpacing: "-0.028em", color: "#1A1A1A", marginBottom: "2px" }}>
                Dakreiniging in Schilde
              </h2>
              </div>
              <div className="realisaties-text-body">
              <div className="realisaties-location-badges" style={{ display: "flex", flexDirection: "row", gap: "6px", marginBottom: "18px", flexWrap: "nowrap" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(155,203,108,0.1)", border: "1px solid rgba(155,203,108,0.3)", borderRadius: "50px", padding: "3px 9px" }}>
                  <MapPin size={11} color="#9BCB6C" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#555555", fontFamily: "var(--font-inter), system-ui, sans-serif", whiteSpace: "nowrap" }}>Schilde, Antwerpen</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(155,203,108,0.1)", border: "1px solid rgba(155,203,108,0.3)", borderRadius: "50px", padding: "3px 9px" }}>
                  <span style={{ fontSize: "11px", color: "#888888", fontFamily: "var(--font-inter), system-ui, sans-serif", whiteSpace: "nowrap" }}>Met hoogwerker uitgevoerd</span>
                </div>
              </div>
              <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.7, marginBottom: "20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Dit dak was zwaar vervuild door mos en algen. Na de reiniging kregen de dakpannen opnieuw hun oorspronkelijke kleur terug. Ook de dakgoten en velux werden grondig gereinigd voor een volledig verzorgd resultaat.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "24px" }}>
                {["Professionele dakreiniging", "Dakgoten gereinigd", "Controle en vervanging van enkele dakpannen"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={16} color="#9BCB6C" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "14px", color: "#333333", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="realisaties-stats-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: "10px", paddingTop: "20px" }}>
                {[
                  { label: "Type dakpannen", value: "Betonpannen" },
                  { label: "Oppervlakte", value: "325 m²" },
                  { label: "Duur",        value: "2d" },
                  { label: "Jaar",        value: "2026" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#F7F8F6", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "12px 14px" }}>
                    <p style={{ fontSize: "11px", color: "#9E9E9E", fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "4px" }}>{s.label}</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>{s.value}</p>
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* Rechts: voor/na slider */}
            <div className="realisaties-large-slider" style={{ height: "100%" }}><LargeSlider /></div>
          </div>

          {/* Foto carrousel + gestapelde Velux/Dakgoot sliders */}
          <div className="realisaties-sub-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginTop: "32px", paddingTop: "32px", alignItems: "stretch" }}>
            {/* Links: foto carrousel */}
            <div className="realisaties-carousel"><ProjectCarousel /></div>

            {/* Rechts: Velux boven, Dakgoot onder */}
            <div className="realisaties-velux-goot" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="realisaties-velux"><SmallSlider beforeSrc="/images/Velux%20voor%201.0.png" afterSrc="/images/Velux%20na%201.0.png" beforePosition="center center" afterPosition="center center" height="210px" title="Velux" /></div>
              <div className="realisaties-dakgoot"><SmallSlider beforeSrc="/images/Goot%20voor.JPEG" afterSrc="/images/Goot%20na.JPEG" height="210px" title="Dakgoot" /></div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Bekijk meer projecten */}
      <section style={{ background: "#FFFFFF", padding: "80px 0" }}>
        <div className="site-wrap">
          <h2 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", letterSpacing: "-0.028em", color: "#1A1A1A", marginBottom: "28px" }}>
            Bekijk meer <span style={{ color: "#9BCB6C" }}>projecten.</span>
          </h2>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
            {[
              { id: "alle",          label: "Alle projecten" },
              { id: "dakreiniging",  label: "Dakreiniging" },
              { id: "dakcoating",    label: "Dakcoating" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                style={{
                  padding: "9px 22px",
                  borderRadius: "50px",
                  border: filterTab === tab.id ? "1px solid #9BCB6C" : "1px solid #E5E7EB",
                  background: filterTab === tab.id ? "#9BCB6C" : "#FFFFFF",
                  color: filterTab === tab.id ? "#1A1A1A" : "#545454",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  cursor: "pointer",
                  transition: "background 150ms ease, border-color 150ms ease, color 150ms ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Project cards grid */}
          <div className="realisaties-project-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {projecten
              .filter(p => filterTab === "alle" || p.category === filterTab)
              .map((p, i) => (
                <div key={i} style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
                  {/* VOOR - bovenste helft */}
                  <div style={{ position: "relative", height: "215px" }}>
                    <img src={p.voorImg} alt={p.title + " " + p.location + " voor"}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                      draggable={false} />
                    <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2, background: "rgba(0,0,0,0.65)", color: "#FFFFFF", padding: "4px 11px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>VOOR</div>
                  </div>
                  {/* Scheidingslijn */}
                  <div style={{ height: "2px", background: "#F7F8F6" }} />
                  {/* NA - onderste helft */}
                  <div style={{ position: "relative", height: "215px" }}>
                    <img src={p.naImg} alt={p.title + " " + p.location + " na"}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                      draggable={false} />
                    <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2, background: "#9BCB6C", color: "#1A1A1A", padding: "4px 11px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>NA</div>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)", zIndex: 1 }} />
                    <p style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px", zIndex: 2, color: "#FFFFFF", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "13px", margin: 0 }}>
                      {p.title + " - " + p.location}
                    </p>
                  </div>
                  {/* Meta chips */}
                  <div style={{ padding: "12px 14px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {[p.type, p.opp, p.duur].map((chip, ci) => (
                      <span key={ci} style={{ background: "#F7F8F6", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "4px 9px", fontSize: "11px", color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ Werkgebied kaart â"€â"€ */}
      <section style={{ background: "#FFFFFF", padding: "0 0 48px" }}>
        <div className="site-wrap">
          <div className="werkgebied-card" style={{
            position: "relative",
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
            overflow: "hidden",
            minHeight: "250px",
          }}>
            <div className="werkgebied-text" style={{ width: "50%", padding: "32px 64px 32px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h2 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", letterSpacing: "-0.028em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "10px" }}>
                Actief in <span style={{ color: "#9BCB6C" }}>jouw regio.</span>
              </h2>
              <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.6, marginBottom: "16px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                We komen dagelijks langs in jouw regio om snel en efficiënt te helpen waar het er écht toe doet.
              </p>
              <div className="werkgebied-regions" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {["Antwerpen", "Limburg", "Vlaams-Brabant"].map(r => (
                  <div key={r} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "9px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <MapPin size={14} color="#9BCB6C" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "13.5px", color: "#1A1A1A", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="werkgebied-media hidden lg:block" style={{ position: "absolute", top: 0, bottom: 0, left: "calc(50% - 60px)", right: 0, overflow: "hidden" }}>
              <img
                src="/images/Regiokaart pc.png"
                alt="Werkgebied MOS-X - Antwerpen, Vlaams-Brabant, Limburg"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transform: "scale(1.3) translateX(3%)", display: "block" }}
              />
              <svg
                className="werkgebied-arrow-mobile"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
                aria-hidden="true"
                style={{ display: "none" }}
              >
                <polygon points="0,0 100,0 100,10 50,50 0,10" fill="white" />
                <polyline points="0,10 50,50 100,10" fill="none" stroke="#9BCB6C" strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
              </svg>
            </div>
            <svg
              className="werkgebied-arrow-desktop"
              style={{ position: "absolute", top: 0, left: "calc(50% - 60px)", width: "120px", height: "100%", zIndex: 10, pointerEvents: "none" }}
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <polygon points="0,0 40,0 70,50 40,100 0,100" fill="white" />
              <polyline points="40,0 70,50 40,100" fill="none" stroke="#9BCB6C" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
            {/* Mobiel: chevron + afbeelding */}
            <div className="block lg:hidden" style={{ paddingTop: "10px" }}>
              <svg style={{ display: "block", width: "100%", height: "42px" }} preserveAspectRatio="none" viewBox="0 0 100 42" aria-hidden="true">
                <polygon points="0,4 50,40 100,4 100,42 0,42" fill="#FAF8F6" />
                <polyline points="0,4 50,40 100,4" fill="none" stroke="#9BCB6C" strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <div style={{ background: "#FAF8F6", padding: "20px 0" }}>
                <img src="/images/Werkgebied donkere achtergrond 2.0.png" alt="Werkgebied MOS-X - Antwerpen, Vlaams-Brabant, Limburg" style={{ width: "100%", height: "250px", objectFit: "cover", objectPosition: "center", display: "block" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â"€â"€ CTA â"€â"€ */}
      <section style={{ background: "#FFFFFF", paddingTop: "60px", paddingBottom: "60px" }}>
        <div className="site-wrap">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 text-center sm:text-left"
            style={{ background: "#0B0F0C", border: "1px solid #9BCB6C", borderRadius: "16px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 100% 100%, rgba(155,203,108,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p className="font-black text-xl mb-1" style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", color: "#FFFFFF" }}>
                Benieuwd wat mogelijk is voor <span style={{ color: "#9BCB6C" }}>jouw dak</span>?
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Ontvang een persoonlijke richtprijs en advies van Yannick.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center shrink-0" style={{ position: "relative", zIndex: 1 }}>
              <Link href="/#calculator" className="inline-flex items-center gap-2"
                style={{ background: ctaGreenHovered ? "#7AB54E" : "#9BCB6C", color: "#FFFFFF", borderRadius: "8px", padding: "12px 24px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "14px", textDecoration: "none", transition: "background-color 0.2s ease" }}
                onMouseEnter={() => setCtaGreenHovered(true)}
                onMouseLeave={() => setCtaGreenHovered(false)}>
                Bereken je richtprijs
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
              <a href="tel:+32468352869" className="inline-flex items-center gap-2"
                style={{ background: "transparent", border: ctaPhoneHovered ? "1px solid #9BCB6C" : "1px solid rgba(155,203,108,0.5)", color: ctaPhoneHovered ? "#9BCB6C" : "#FFFFFF", borderRadius: "8px", padding: "12px 24px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "14px", textDecoration: "none", transition: "border-color 0.2s ease, color 0.2s ease" }}
                onMouseEnter={() => setCtaPhoneHovered(true)}
                onMouseLeave={() => setCtaPhoneHovered(false)}>
                <Phone className="w-4 h-4" /> +32 468 35 28 69
              </a>
            </div>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}

