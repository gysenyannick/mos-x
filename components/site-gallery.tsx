"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    type: "Dakontmossing",
    location: "Gent",
    year: "2024",
    m2: "175 m²",
    desc: "Zwaar begroeide keramische pannen. Bioreiniging + preventieve naspray.",
    before: "img-before-roof",
    after:  "img-after-roof",
  },
  {
    type: "Dakontmossing + Coating",
    location: "Aalst",
    year: "2024",
    m2: "145 m²",
    desc: "Reiniging gevolgd door transparante dakcoating. 15 jaar garantie.",
    before: "img-before-roof",
    after:  "img-after-roof",
  },
  {
    type: "Gevelreiniging",
    location: "Dendermonde",
    year: "2023",
    m2: "120 m²",
    desc: "Zwarte aanslag op baksteengevel. Volledig gereinigd met zachte methode.",
    before: "img-before-facade",
    after:  "img-after-facade",
  },
  {
    type: "Dakontmossing",
    location: "Sint-Niklaas",
    year: "2024",
    m2: "195 m²",
    desc: "Matig vervuilde leien. Biologische behandeling + gootreiniging.",
    before: "img-before-roof",
    after:  "img-after-roof",
  },
];

function SliderCard({ p }: { p: (typeof projects)[0] }) {
  const [split, setSplit] = useState(48);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"h" | "v" | null>(null);

  const move = (cx: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setSplit(Math.min(92, Math.max(8, ((cx - r.left) / r.width) * 100)));
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; axis.current = null; dragging.current = true; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const dx = Math.abs(e.touches[0].clientX - startX.current);
      const dy = Math.abs(e.touches[0].clientY - startY.current);
      if (!axis.current) axis.current = dx > dy ? "h" : "v";
      if (axis.current === "h") { e.preventDefault(); move(e.touches[0].clientX); }
    };
    const onTouchEnd = () => { dragging.current = false; axis.current = null; };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => { el.removeEventListener("touchstart", onTouchStart); el.removeEventListener("touchmove", onTouchMove); el.removeEventListener("touchend", onTouchEnd); };
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#262B23", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Slider */}
      <div
        ref={ref}
        className="relative h-72 cursor-col-resize select-none overflow-hidden"
        onMouseDown={() => (dragging.current = true)}
        onMouseMove={e => { if (dragging.current) move(e.clientX); }}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
      >
        {/* After */}
        <div className={`absolute inset-0 ${p.after}`}>
          <div className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent 0px,transparent 34px,rgba(0,0,0,0.10) 34px,rgba(0,0,0,0.10) 36px),repeating-linear-gradient(90deg,transparent 0px,transparent 54px,rgba(0,0,0,0.06) 54px,rgba(0,0,0,0.06) 56px)",
            }}
          />
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#6DB33F] text-white"
              style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
              NA
            </span>
          </div>
        </div>

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <div className={`absolute inset-0 ${p.before}`} />
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white/80"
              style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
              VOOR
            </span>
          </div>
        </div>

        {/* Divider handle */}
        <div
          className="absolute top-0 bottom-0 w-px z-20 pointer-events-none"
          style={{ left: `${split}%`, background: "rgba(255,255,255,0.9)" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center gap-0.5">
            <ChevronLeft className="w-3 h-3 text-[#081012]" />
            <ChevronRight className="w-3 h-3 text-[#081012]" />
          </div>
        </div>

        {/* Touch hint (first frame) */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] text-white/50 pointer-events-none transition-opacity duration-500"
          style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", opacity: split === 48 ? 1 : 0 }}
        >
          ← sleep →
        </div>
      </div>

      {/* Card info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span
              className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold mb-2"
              style={{ background: "rgba(109,179,63,0.15)", color: "#6DB33F", fontFamily: "var(--font-montserrat)" }}
            >
              {p.type}
            </span>
            <p className="font-semibold text-sm text-white"
              style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
              {p.location}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-white/30">{p.year}</p>
            <p className="font-bold text-sm" style={{ color: "#6DB33F", fontFamily: "var(--font-montserrat)" }}>{p.m2}</p>
          </div>
        </div>
        <p className="text-xs text-white/40 leading-relaxed">{p.desc}</p>
      </div>
    </div>
  );
}

export default function SiteGallery() {
  return (
    <section className="site-pad" id="realisaties" style={{ background: "#081012" }}>
      <div className="site-wrap">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="site-eyebrow mb-4">Voor & Na</p>
            <h2
              className="font-bold text-white leading-tight"
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Het resultaat spreekt
              <span style={{ color: "#6DB33F" }}> voor zichzelf.</span>
            </h2>
            <p className="text-white/45 text-sm mt-3 max-w-md">
              Sleep de schuifregelaar om het verschil te zien. Echte opdrachten, geen digitale nabewerking.
            </p>
          </div>
          <Link href="/realisaties" className="site-btn-outline-white shrink-0">
            Alle realisaties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((p, i) => <SliderCard key={i} p={p} />)}
        </div>
      </div>
    </section>
  );
}



