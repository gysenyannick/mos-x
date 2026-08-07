"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeFilter?: string;
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeFilter }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"h" | "v" | null>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = () => {
    dragging.current = true;
    const onMove = (e: MouseEvent) => { if (dragging.current) updatePosition(e.clientX); };
    const onUp = () => { dragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; axis.current = null; dragging.current = true; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const dx = Math.abs(e.touches[0].clientX - startX.current);
      const dy = Math.abs(e.touches[0].clientY - startY.current);
      if (!axis.current) axis.current = dx > dy ? "h" : "v";
      if (axis.current === "h") { e.preventDefault(); updatePosition(e.touches[0].clientX); }
    };
    const onTouchEnd = () => { dragging.current = false; axis.current = null; };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => { el.removeEventListener("touchstart", onTouchStart); el.removeEventListener("touchmove", onTouchMove); el.removeEventListener("touchend", onTouchEnd); };
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{ borderRadius: "16px", overflow: "hidden", aspectRatio: "4/3", cursor: "ew-resize" }}
    >
      {/* BEFORE */}
      <div className="absolute inset-0">
        <img
          src={beforeSrc}
          alt="Voor"
          className="absolute inset-0 w-full h-full object-cover"
          style={beforeFilter ? { filter: beforeFilter } : undefined}
          draggable={false}
        />
      </div>

      {/* AFTER */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img
          src={afterSrc}
          alt="Na"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0"
        style={{ left: `${position}%`, width: "2px", background: "rgba(255,255,255,0.9)", transform: "translateX(-50%)", zIndex: 10 }}
      />

      {/* Drag handle */}
      <div
        className="absolute flex items-center justify-center gap-0.5"
        style={{
          left: `${position}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          background: "#FFFFFF",
          border: "2px solid #9BCB6C",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          zIndex: 11,
          cursor: "ew-resize",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
      >
        <ChevronLeft style={{ width: "13px", height: "13px", color: "#9BCB6C" }} />
        <ChevronRight style={{ width: "13px", height: "13px", color: "#9BCB6C" }} />
      </div>

      {/* VOOR label */}
      <div
        className="absolute top-3 left-3 text-[11px] font-bold text-white"
        style={{ background: "rgba(0,0,0,0.65)", padding: "5px 12px", borderRadius: "50px", zIndex: 10, letterSpacing: "0.08em" }}
      >
        VOOR
      </div>

      {/* NA label */}
      <div
        className="absolute top-3 right-3 text-[11px] font-bold"
        style={{ background: "#9BCB6C", color: "#1A1A1A", padding: "5px 12px", borderRadius: "50px", zIndex: 10, letterSpacing: "0.08em" }}
      >
        NA
      </div>
    </div>
  );
}
