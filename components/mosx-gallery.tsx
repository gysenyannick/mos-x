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
    desc: "Zwaar begroeide keramische pannen. Behandeld met bioreiniging + preventieve naspray.",
    beforeBg: "img-placeholder-roof",
    afterBg:  "img-placeholder-roof-clean",
    mossy: true,
  },
  {
    type: "Dakcoating",
    location: "Aalst",
    year: "2024",
    m2: "145 m²",
    desc: "Dakontmossing gevolgd door transparante coating. Garantie 15 jaar.",
    beforeBg: "img-placeholder-roof",
    afterBg:  "img-placeholder-roof-clean",
    mossy: true,
  },
  {
    type: "Gevelreiniging",
    location: "Dendermonde",
    year: "2023",
    m2: "120 m²",
    desc: "Zwarte aanslag op baksteengevel. Volledig gereinigd met zachte druk.",
    beforeBg: "img-placeholder-facade",
    afterBg:  "img-placeholder-facade-clean",
    mossy: false,
  },
  {
    type: "Dakontmossing",
    location: "Sint-Niklaas",
    year: "2024",
    m2: "195 m²",
    desc: "Matig tot zwaar vervuilde leien. Biologische behandeling en gootreiniging.",
    beforeBg: "img-placeholder-roof",
    afterBg:  "img-placeholder-roof-clean",
    mossy: true,
  },
];

function SliderCard({ p }: { p: typeof projects[0] }) {
  const [split, setSplit] = useState(50);
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
    <div className="group bg-white rounded-3xl overflow-hidden border card-shadow hover:card-shadow-lg transition-all hover:-translate-y-1 flex flex-col"
      style={{ borderColor: "#E3E0D8" }}
    >
      {/* Slider area */}
      <div
        ref={ref}
        className="relative h-60 cursor-col-resize select-none overflow-hidden"
        onMouseDown={() => (dragging.current = true)}
        onMouseMove={e => { if (dragging.current) move(e.clientX); }}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
      >
        {/* AFTER */}
        <div className={`absolute inset-0 ${p.afterBg}`}>
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg,transparent 0px,transparent 36px,rgba(0,0,0,0.12) 36px,rgba(0,0,0,0.12) 40px),repeating-linear-gradient(90deg,transparent 0px,transparent 56px,rgba(0,0,0,0.08) 56px,rgba(0,0,0,0.08) 60px)`,
          }} />
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-[#1A5C36] backdrop-blur-sm">Na</span>
          </div>
        </div>

        {/* BEFORE (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <div className={`absolute inset-0 ${p.beforeBg}`}>
            {p.mossy && (
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse 100px 50px at 25% 30%,rgba(74,124,89,0.95) 0%,transparent 70%),radial-gradient(ellipse 70px 35px at 65% 60%,rgba(50,90,60,0.9) 0%,transparent 70%),radial-gradient(ellipse 80px 40px at 45% 80%,rgba(60,100,70,0.8) 0%,transparent 70%)",
              }} />
            )}
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(0deg,transparent 0px,transparent 36px,rgba(0,0,0,0.18) 36px,rgba(0,0,0,0.18) 40px)`,
            }} />
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white/80 backdrop-blur-sm">Vóór</span>
          </div>
        </div>

        {/* Handle */}
        <div className="absolute top-0 bottom-0 w-px bg-white/80 z-20 pointer-events-none" style={{ left: `${split}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center gap-0.5">
            <ChevronLeft className="w-3 h-3 text-[#1A5C36]" />
            <ChevronRight className="w-3 h-3 text-[#1A5C36]" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2"
              style={{ background: "#EAF4EE", color: "#1A5C36" }}
            >
              {p.type}
            </span>
            <p className="font-semibold text-sm text-[#111613]">{p.location}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-[#5C6058]">{p.year}</p>
            <p className="font-bold text-sm text-[#1A5C36]">{p.m2}</p>
          </div>
        </div>
        <p className="text-xs text-[#5C6058] leading-relaxed">{p.desc}</p>
      </div>
    </div>
  );
}

export default function MosxGallery() {
  return (
    <section className="section-pad bg-white" id="realisaties">
      <div className="wrap">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">Realisaties</p>
            <h2 className="section-headline mb-4">
              Resultaten die{" "}
              <span className="italic" style={{ color: "#1A5C36" }}>voor zichzelf spreken.</span>
            </h2>
            <p className="text-[#5C6058] text-base leading-relaxed">
              Sleep de schuifregelaar. Dit zijn echte opdrachten, geen digitale nabewerking.
            </p>
          </div>
          <Link
            href="/realisaties"
            className="btn-outline-green text-sm shrink-0"
          >
            Alle realisaties bekijken <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((p, i) => <SliderCard key={i} p={p} />)}
        </div>

        {/* CTA block */}
        <div
          className="mt-12 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6"
          style={{ background: "#F7F6F2", border: "1px solid #E3E0D8" }}
        >
          <div>
            <p className="font-display font-bold text-[#111613] text-xl lg:text-2xl mb-2">
              Wil u weten wat er bij ú mogelijk is?
            </p>
            <p className="text-[#5C6058] text-sm">
              Yannick inspecteert uw dak gratis met zijn drone en toont u het haalbare resultaat.
            </p>
          </div>
          <Link href="/contact" className="btn-primary text-base shrink-0">
            Gratis Diagnose Aanvragen →
          </Link>
        </div>
      </div>
    </section>
  );
}
