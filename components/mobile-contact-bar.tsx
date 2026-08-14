"use client";

import { Phone } from "lucide-react";

export default function MobileContactBar() {
  return (
    <div
      className="lg:hidden"
      style={{
        position: "fixed",
        bottom: "calc(16px + env(safe-area-inset-bottom))",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 40px)",
        zIndex: 1000,
      }}
    >
      <a
        href="tel:+32468352869"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          height: "52px",
          width: "100%",
          textDecoration: "none",
          color: "#1A1A1A",
          background: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 -2px 16px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        <Phone size={15} color="#9BCB6C" strokeWidth={2.5} style={{ flexShrink: 0 }} />
        <span style={{
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          color: "#1A1A1A",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}>
          +32 468 35 28 69
        </span>
      </a>
    </div>
  );
}
