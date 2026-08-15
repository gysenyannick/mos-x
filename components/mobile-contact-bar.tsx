"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileContactBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="lg:hidden"
      style={{
        position: "fixed",
        bottom: "calc(16px + env(safe-area-inset-bottom))",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "calc(100% + 24px)"})`,
        width: "calc(100% - 40px)",
        zIndex: 1000,
        borderRadius: "12px",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 -2px 16px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.06)",
        background: "#FFFFFF",
        overflow: "hidden",
        height: "52px",
        transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>

        {/* Phone zone */}
        <a
          href="tel:+32468352869"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            height: "100%",
            textDecoration: "none",
            color: "#1A1A1A",
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

        {/* Divider */}
        <div style={{
          width: "1px",
          height: "28px",
          background: "rgba(0, 0, 0, 0.1)",
          flexShrink: 0,
        }} />

        {/* WhatsApp zone */}
        <a
          href="https://wa.me/32468352869"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat via WhatsApp"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "100%",
            flexShrink: 0,
          }}
        >
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#25D366",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(37,211,102,0.35)",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </a>

      </div>
    </div>
  );
}
