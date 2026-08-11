"use client";

import { useEffect, useRef, useState } from "react";

const GREEN = "#8DC63F";
const GOLD  = "#F9A825";

/* ── Animated counter ── */
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const steps = 40;
          const interval = duration / steps;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            setCount(Math.round((target * step) / steps));
            if (step >= steps) clearInterval(timer);
          }, interval);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}</span>;
}

/* ── Google coloured G ── */
function GoogleG() {
  return (
    <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

/* ── Roof SVG icon ── */
function RoofIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10.5L12 3l9 7.5" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 9v10a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1V9" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function SiteTrustBar() {
  return (
    <section
      style={{
        background: "#FFFFFF",
        width: "100%",
        padding: "40px 0",
        borderTop: "1px solid #EEEEEE",
        borderBottom: "1px solid #EEEEEE",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0",
        }}
      >

        {/* ── COL 1: Google Reviews ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "160px" }}>
          <GoogleG />
          <div style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "40px", fontWeight: 700, color: GREEN, lineHeight: 1,
          }}>
            16
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={GOLD}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <div style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "13px", color: "#888" }}>
            5 sterren reviews
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "50px", background: "#DDDDDD", margin: "0 80px", flexShrink: 0 }} />

        {/* ── COL 2: Daken gereinigd ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "160px" }}>
          <RoofIcon />
          <div style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "40px", fontWeight: 700, color: GREEN, lineHeight: 1,
          }}>
            <Counter target={100} />+
          </div>
          <div style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "13px", color: "#888" }}>
            daken gereinigd
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "50px", background: "#DDDDDD", margin: "0 80px", flexShrink: 0 }} />

        {/* ── COL 3: VTM ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "160px" }}>
          <div style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "13px", color: "#888" }}>
            Gezien op
          </div>
          <div style={{
            background: "#E8000D",
            borderRadius: "8px",
            padding: "6px 14px",
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "22px",
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>
            vtm
          </div>
          <div style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            color: "#1A1A1A",
          }}>
            Lifestyle &amp; Wonen
          </div>
        </div>

      </div>
    </section>
  );
}
