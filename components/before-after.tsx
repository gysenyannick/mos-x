"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const projects = [
  {
    title: "Dakpannen · Gent",
    desc: "Zwaar begroeide keramische pannen uit 2002. Behandeld met zachte reiniging + 10j coating.",
    before: {
      label: "Vóór",
      bg: "linear-gradient(160deg, #2D4A35 0%, #1E3527 30%, #253D2E 60%, #1A2E20 100%)",
      moss: true,
    },
    after: {
      label: "Na",
      bg: "linear-gradient(160deg, #8B6A4A 0%, #7A5C3D 30%, #8B6A4A 60%, #6B4E33 100%)",
    },
    year: "2023",
    m2: "165 m²",
  },
  {
    title: "Leien dak · Brugge",
    desc: "Historische woning met 40 jaar oude leien. Voorzichtige reiniging zonder hogedruk.",
    before: {
      label: "Vóór",
      bg: "linear-gradient(160deg, #1E2D28 0%, #243830 40%, #1A2822 100%)",
      moss: true,
    },
    after: {
      label: "Na",
      bg: "linear-gradient(160deg, #4A4A52 0%, #3D3D47 30%, #45454F 60%, #38383F 100%)",
    },
    year: "2024",
    m2: "220 m²",
  },
  {
    title: "Plat dak · Kortrijk",
    desc: "EPDM dak met algengroei en bladophoping in de goten. Volledig gereinigd en geïnspecteerd.",
    before: {
      label: "Vóór",
      bg: "linear-gradient(160deg, #1C2E20 0%, #223525 40%, #1A2B1E 100%)",
      moss: true,
    },
    after: {
      label: "Na",
      bg: "linear-gradient(160deg, #2A2A2A 0%, #222222 40%, #1E1E1E 100%)",
    },
    year: "2024",
    m2: "95 m²",
  },
];

function BeforeAfterCard({ project }: { project: typeof projects[0] }) {
  const [split, setSplit] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"h" | "v" | null>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(95, Math.max(5, ((clientX - rect.left) / rect.width) * 100));
    setSplit(pct);
  };

  const onMouseDown = () => { dragging.current = true; };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) handleMove(e.clientX); };
  const onMouseUp = () => { dragging.current = false; };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; axis.current = null; dragging.current = true; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const dx = Math.abs(e.touches[0].clientX - startX.current);
      const dy = Math.abs(e.touches[0].clientY - startY.current);
      if (!axis.current) axis.current = dx > dy ? "h" : "v";
      if (axis.current === "h") { e.preventDefault(); handleMove(e.touches[0].clientX); }
    };
    const onTouchEnd = () => { dragging.current = false; axis.current = null; };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => { el.removeEventListener("touchstart", onTouchStart); el.removeEventListener("touchmove", onTouchMove); el.removeEventListener("touchend", onTouchEnd); };
  }, []);

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-[#1B3A26]">
      {/* Image comparison */}
      <div
        ref={containerRef}
        className="relative h-64 md:h-72 cursor-col-resize select-none overflow-hidden"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* AFTER (full) */}
        <div
          className="absolute inset-0"
          style={{ background: project.after.bg }}
        >
          {/* Clean tile pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg, transparent 0px, transparent 38px,
                rgba(0,0,0,0.15) 38px, rgba(0,0,0,0.15) 42px
              ), repeating-linear-gradient(
                90deg, transparent 0px, transparent 58px,
                rgba(0,0,0,0.1) 58px, rgba(0,0,0,0.1) 62px
              )`,
            }}
          />
          <div className="absolute bottom-4 right-4">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white"
              style={{ background: "rgba(27,58,38,0.8)", backdropFilter: "blur(8px)" }}
            >
              {project.after.label}
            </span>
          </div>
        </div>

        {/* BEFORE (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <div
            className="absolute inset-0"
            style={{ background: project.before.bg }}
          >
            {/* Mossy tile pattern */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg, transparent 0px, transparent 38px,
                  rgba(0,0,0,0.2) 38px, rgba(0,0,0,0.2) 42px
                ), repeating-linear-gradient(
                  90deg, transparent 0px, transparent 58px,
                  rgba(0,0,0,0.15) 58px, rgba(0,0,0,0.15) 62px
                )`,
              }}
            />
            {project.before.moss && (
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background: `
                    radial-gradient(ellipse 100px 50px at 25% 30%, rgba(74,124,89,0.9) 0%, transparent 70%),
                    radial-gradient(ellipse 80px 40px at 65% 60%, rgba(50,90,60,0.9) 0%, transparent 70%),
                    radial-gradient(ellipse 60px 30px at 45% 80%, rgba(60,100,70,0.8) 0%, transparent 70%)
                  `,
                }}
              />
            )}
          </div>
          <div className="absolute bottom-4 left-4">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            >
              {project.before.label}
            </span>
          </div>
        </div>

        {/* Drag handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none"
          style={{ left: `${split}%` }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center gap-0.5"
          >
            <ChevronLeft className="w-3 h-3 text-[#1B3A26]" />
            <ChevronRight className="w-3 h-3 text-[#1B3A26]" />
          </div>
        </div>
      </div>

      {/* Card details */}
      <div className="p-5 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-[#1A1A18] mb-1">{project.title}</h3>
            <p className="text-sm leading-relaxed text-[#6B6B5E]">{project.desc}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-[#6B6B5E]">{project.year}</p>
            <p className="font-bold text-sm text-[#1B3A26]">{project.m2}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section
      className="section-padding"
      id="realisaties"
      style={{ background: "#F8F6F2" }}
    >
      <div className="container-tight">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#C49A28" }}
          >
            Realisaties
          </p>
          <h2
            className="font-display font-bold leading-tight mb-6"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#1B3A26" }}
          >
            Resultaten die{" "}
            <span className="italic">voor zichzelf spreken</span>
          </h2>
          <p className="text-base lg:text-lg leading-relaxed text-[#6B6B5E]">
            Versleep de schuifregelaar om het verschil te zien. Dit zijn echte opdrachten ,
            geen digitale nabewerking.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((p, i) => (
            <BeforeAfterCard key={i} project={p} />
          ))}
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 lg:p-12 text-center"
          style={{ background: "linear-gradient(135deg, #EDE9E2 0%, #E4E0D8 100%)", border: "1px solid #D8D4CC" }}
        >
          <p className="text-[#6B6B5E] text-base mb-2">
            Wil u zien of uw dak ook in aanmerking komt?
          </p>
          <p
            className="font-display font-bold mb-6"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", color: "#1B3A26" }}
          >
            Yannick doet een gratis inspectie en toont u het resultaat dat mogelijk is.
          </p>
          <a
            href="#diagnose"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all btn-primary-glow"
            style={{
              background: "linear-gradient(135deg, #C8380A 0%, #a82e08 100%)",
              boxShadow: "0 6px 24px rgba(200,56,10,0.35)",
            }}
          >
            Gratis Dakinspectie →
          </a>
        </div>
      </div>
    </section>
  );
}
