"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeFilter?: string;
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeFilter }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

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
    const handleTouchMove = (e: TouchEvent) => {
      if (dragging.current) {
        e.preventDefault();
        updatePosition(e.touches[0].clientX);
      }
    };
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
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
        className="absolute flex items-center justify-center"
        style={{
          left: `${position}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
          zIndex: 11,
          cursor: "ew-resize",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={() => { dragging.current = true; }}
        onTouchEnd={() => { dragging.current = false; }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 4L2 9L6 14" stroke="#9BCB6C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 4L16 9L12 14" stroke="#9BCB6C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* VOOR label */}
      <div
        className="absolute bottom-4 left-4 px-2.5 py-1 rounded-md text-[11px] font-bold text-white"
        style={{ background: "rgba(0,0,0,0.65)", zIndex: 10, letterSpacing: "0.08em" }}
      >
        VOOR
      </div>

      {/* NA label */}
      <div
        className="absolute bottom-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold text-white"
        style={{ background: "#9BCB6C", zIndex: 10, letterSpacing: "0.08em" }}
      >
        <CheckCircle className="w-3 h-3" /> NA
      </div>
    </div>
  );
}
