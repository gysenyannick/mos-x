"use client";

import Link from "next/link";
import { Calendar, CheckCircle, Shield, Star } from "lucide-react";
import BeforeAfterSlider from "@/components/before-after-slider";


export default function SiteResults() {
  return (
    <section style={{ background: "#F7F8F6", padding: "100px 0" }}>
      <div className="site-wrap">
        <div
          className="grid grid-cols-1 lg:grid-cols-3"
          style={{ gap: "48px", alignItems: "center" }}
        >

          {/* Col 1 — Text */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#6DB33F",
                marginBottom: "16px",
              }}
            >
              Zichtbaar verschil
            </p>
            <h2
              className="font-bold leading-tight mb-8"
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                letterSpacing: "-0.02em",
                color: "#0D1510",
              }}
            >
              Resultaten die voor zich spreken.
            </h2>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                "Verlengt de levensduur van uw dak",
                "Waterafstotend & vuilwerend",
                "Betere uitstraling van uw woning",
                "Waardeverhogend",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#6DB33F" }} />
                  <span style={{ color: "#4A5568", fontSize: "15px" }}>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/realisaties"
              style={{
                display: "inline-block",
                background: "#FFFFFF",
                border: "1.5px solid #6DB33F",
                color: "#6DB33F",
                borderRadius: "8px",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Bekijk meer realisaties
            </Link>
          </div>

          {/* Col 2 — Before/after slider */}
          <div>
            <BeforeAfterSlider
              beforeSrc="/images/herentals-voor.png"
              afterSrc="/images/herentals-na.png"
              beforeFilter="saturate(0.4) brightness(0.55) hue-rotate(60deg)"
            />
          </div>

          {/* Col 3 — Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Stat 1 */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <Calendar className="w-5 h-5 mb-3" style={{ color: "#6DB33F" }} />
              <p
                className="font-bold"
                style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontSize: "32px", lineHeight: 1, marginBottom: "6px", color: "#0D1510" }}
              >
                247+
              </p>
              <p style={{ color: "#6B7280", fontSize: "14px" }}>Daken gereinigd in Vlaanderen</p>
            </div>

            {/* Stat 2 */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <Shield className="w-5 h-5 mb-3" style={{ color: "#6DB33F" }} />
              <p
                className="font-bold"
                style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontSize: "32px", lineHeight: 1, marginBottom: "6px", color: "#0D1510" }}
              >
                10+ jaar
              </p>
              <p style={{ color: "#6B7280", fontSize: "14px" }}>Gemiddelde levensduur verlengd</p>
            </div>

            {/* Stat 3 — Review */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#F9A825" }} />
                ))}
              </div>
              <p
                className="font-bold"
                style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontSize: "32px", lineHeight: 1, marginBottom: "10px", color: "#0D1510" }}
              >
                5.0
              </p>
              <p style={{ color: "#4A5568", fontSize: "14px", lineHeight: "1.6", fontStyle: "italic", marginBottom: "6px" }}>
                &ldquo;Topservice! Ons dak ziet er weer als nieuw uit.&rdquo;
              </p>
              <p style={{ color: "#9CA3AF", fontSize: "12px" }}>Familie Deprez, Waregem</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
