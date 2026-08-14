"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeFilter?: string;
  beforePosition?: string;
  afterPosition?: string;
  borderRadius?: string;
  aspectRatio?: string;
  height?: string;
  minHeight?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  hideLabels?: boolean;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeFilter,
  beforePosition = "center",
  afterPosition = "center",
  borderRadius = "16px",
  aspectRatio = "4/3",
  height,
  minHeight,
  title,
  className,
  style,
  hideLabels = false,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [showHint, setShowHint] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"h" | "v" | null>(null);
  const hasInteracted = useRef(false);

  const markInteracted = useCallback(() => {
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      setShowHint(false);
    }
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) updatePosition(e.clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [updatePosition]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      axis.current = null;
      dragging.current = true;
    };
    const onMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const dx = Math.abs(e.touches[0].clientX - startX.current);
      const dy = Math.abs(e.touches[0].clientY - startY.current);
      if (!axis.current) axis.current = dx > dy ? "h" : "v";
      if (axis.current === "h") {
        e.preventDefault();
        markInteracted();
        updatePosition(e.touches[0].clientX);
      }
    };
    const onEnd = () => { dragging.current = false; };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [markInteracted, updatePosition]);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius,
    cursor: "ew-resize",
    userSelect: "none",
    ...(height ? { height } : { aspectRatio }),
    ...(minHeight ? { minHeight } : {}),
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
      onMouseDown={(e) => {
        dragging.current = true;
        markInteracted();
        updatePosition(e.clientX);
      }}
    >
      {/* Before image */}
      <img
        src={beforeSrc}
        alt="Voor"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: beforePosition,
          ...(beforeFilter ? { filter: beforeFilter } : {}),
          pointerEvents: "none", display: "block",
        }}
        draggable={false}
      />

      {/* After image (clipped from left) */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${position}%)` }}>
        <img
          src={afterSrc}
          alt="Na"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: afterPosition,
            pointerEvents: "none", display: "block",
          }}
          draggable={false}
        />
      </div>

      {/* VOOR label */}
      {!hideLabels && <div style={{
        position: "absolute", top: "12px", left: "12px", zIndex: 3,
        background: "rgba(0,0,0,0.65)", color: "#FFFFFF",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
        padding: "5px 12px", borderRadius: "50px",
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        pointerEvents: "none",
      }}>VOOR</div>}

      {/* NA label */}
      {!hideLabels && <div style={{
        position: "absolute", top: "12px", right: "12px", zIndex: 3,
        background: "#9BCB6C", color: "#1A1A1A",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
        padding: "5px 12px", borderRadius: "50px",
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        pointerEvents: "none",
      }}>NA</div>}

      {/* Divider line */}
      <div style={{
        position: "absolute", top: 0, bottom: 0,
        left: `${position}%`,
        width: "2px",
        background: "rgba(255,255,255,0.9)",
        transform: "translateX(-50%)",
        zIndex: 4,
        pointerEvents: "none",
      }} />

      {/* Handle — 32px visual, large invisible hit area via full-slider drag */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: `${position}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 5,
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: "#FFFFFF",
        border: "2px solid #9BCB6C",
        boxShadow: "0 2px 10px rgba(0,0,0,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}>
        <ChevronLeft style={{ width: "11px", height: "11px", color: "#9BCB6C" }} />
        <ChevronRight style={{ width: "11px", height: "11px", color: "#9BCB6C" }} />
      </div>

      {/* Instruction badge — below center handle, disappears on first use */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "68%",
        transform: "translate(-50%, -50%)",
        zIndex: 6,
        background: "rgba(0,0,0,0.68)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        color: "#FFFFFF",
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.02em",
        padding: "4px 10px",
        borderRadius: "100px",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        pointerEvents: "none",
        opacity: showHint ? 1 : 0,
        transition: "opacity 500ms ease",
      }}>
        ‹ Sleep om te vergelijken ›
      </div>

      {/* Optional bottom caption */}
      {title && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3,
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
          padding: "24px 14px 10px",
          pointerEvents: "none",
        }}>
          <p style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontWeight: 700, fontSize: "13px", color: "#FFFFFF",
            textAlign: "center",
          }}>{title}</p>
        </div>
      )}
    </div>
  );
}
