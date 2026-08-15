"use client";

import { useState, useEffect } from "react";
import { ChevronRight, X, Check } from "lucide-react";

const DIENSTEN = ["Dakreiniging", "Dakcoating", "MOS-X Dakzorg"];

function formatBelgianPhone(raw: string): string {
  if (!raw) return raw;
  let digits = raw.replace(/\D/g, "");
  if (!digits) return raw;
  if (digits.startsWith("32") && digits.length > 9) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!digits) return raw;
  if (digits.startsWith("4") && digits.length >= 9) {
    const d = digits.slice(0, 9);
    return "+32 " + d.slice(0,3) + " " + d.slice(3,5) + " " + d.slice(5,7) + " " + d.slice(7,9);
  }
  if (["2","3","9"].includes(digits[0]) && digits.length >= 8) {
    const d = digits.slice(0, 8);
    return "+32 " + d[0] + " " + d.slice(1,4) + " " + d.slice(4,6) + " " + d.slice(6,8);
  }
  if (digits.length >= 8) {
    const d = digits.slice(0, 8);
    return "+32 " + d.slice(0,2) + " " + d.slice(2,4) + " " + d.slice(4,6) + " " + d.slice(6,8);
  }
  return raw;
}

interface Props {
  open: boolean;
  onClose: () => void;
  defaultDienst?: string;
  bron?: string;
}

export function PlaatsbezoekModal({ open, onClose, defaultDienst = "", bron = "Website" }: Props) {
  const [diensten, setDiensten] = useState<string[]>(defaultDienst ? [defaultDienst] : []);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  useEffect(() => {
    if (open) {
      setDiensten(defaultDienst ? [defaultDienst] : []);
      setStatus("idle");
    }
  }, [open, defaultDienst]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const toggleDienst = (d: string) => {
    setDiensten(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (diensten.length === 0) return;
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    fd.set("dienst", diensten.join(", "));
    fd.set("bron", bron);
    try {
      const res = await fetch("/api/bezoek", { method: "POST", body: fd });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  const canSubmit = diensten.length > 0 && status !== "sending";

  return (
    <>
      <style>{`
        @keyframes pv-bg-in   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pv-card-in { from { opacity: 0; transform: translateY(28px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .pv-modal-wrap, .pv-modal-card { animation: none !important; }
        }
        .pv-loc-grid {
          display: grid;
          grid-template-columns: 1fr 90px;
          grid-template-areas: "tel postcode" "adres adres";
          gap: 10px;
        }
        @media (min-width: 560px) {
          .pv-loc-grid {
            grid-template-columns: 120px 1fr;
            grid-template-areas: "tel tel" "postcode adres";
            gap: 14px;
          }
        }
      `}</style>

      <div
        className="pv-modal-wrap"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
          animation: "pv-bg-in 200ms ease both",
        }}
      >
        <div
          className="pv-modal-card"
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "36px 40px",
            maxWidth: "560px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 8px 60px rgba(0,0,0,0.30), 0 2px 12px rgba(0,0,0,0.10)",
            animation: "pv-card-in 280ms cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          {/* Sluitknop */}
          <button
            onClick={onClose}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A"; (e.currentTarget as HTMLButtonElement).style.background = "#F3F4F6"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "transparent", border: "none", cursor: "pointer",
              color: "#9CA3AF", padding: "6px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "color 150ms ease, background 150ms ease",
            }}
          >
            <X size={20} />
          </button>

          {status === "done" ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(155,203,108,0.12)", border: "2px solid #9BCB6C", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Check size={24} color="#9BCB6C" strokeWidth={2.5} />
              </div>
              <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "18px", color: "#1A1A1A", marginBottom: "8px" }}>
                Aanvraag verstuurd!
              </p>
              <p style={{ fontSize: "14px", color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif", lineHeight: 1.6, marginBottom: "24px" }}>
                Je ontvangt dadelijk een bevestigingsmail. Yannick neemt <strong>binnen 1 werkdag</strong> contact met je op.
              </p>
              <button
                onClick={onClose}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#7AB54E"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#9BCB6C"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "12px 28px", borderRadius: "10px",
                  background: "#9BCB6C", color: "#FFFFFF", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "14px", transition: "background 200ms ease",
                }}
              >
                Sluiten
              </button>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "20px", color: "#9BCB6C", marginBottom: "6px", lineHeight: 1.2, paddingRight: "32px" }}>
                Plan een gratis plaatsbezoek
              </p>
              <p style={{ fontSize: "13px", color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "28px", lineHeight: 1.55 }}>
                Yannick komt langs en bekijkt je dak persoonlijk.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Dienst selector — multi-select */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555555", marginBottom: "8px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
                    Welke dienst wil je aanvragen? *
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {DIENSTEN.map(d => {
                      const selected = diensten.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleDienst(d)}
                          onMouseEnter={e => { if (!selected) { const b = e.currentTarget; b.style.borderColor = "#9BCB6C"; b.style.background = "rgba(155,203,108,0.06)"; b.style.color = "#1A1A1A"; } }}
                          onMouseLeave={e => { if (!selected) { const b = e.currentTarget; b.style.borderColor = "#E5E7EB"; b.style.background = "#F8F8F8"; b.style.color = "#555555"; } }}
                          style={{
                            padding: "9px 16px",
                            borderRadius: "8px",
                            border: selected ? "1.5px solid #9BCB6C" : "1.5px solid #E5E7EB",
                            background: selected ? "rgba(155,203,108,0.10)" : "#F8F8F8",
                            color: selected ? "#1A1A1A" : "#555555",
                            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                            fontWeight: selected ? 700 : 500,
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "border-color 150ms ease, background 150ms ease, color 150ms ease",
                            display: "inline-flex", alignItems: "center", gap: "6px",
                          }}
                        >
                          {selected && <Check size={12} strokeWidth={2.5} color="#9BCB6C" />}
                          {d}
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "6px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                    Meerdere keuzes mogelijk
                  </p>
                </div>

                {/* Voornaam + Naam naast elkaar (ook op mobiel) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555555", marginBottom: "5px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>Voornaam *</label>
                    <input type="text" name="voornaam" required placeholder="Voornaam" style={{ background: "#F8F8F8", border: "1px solid #E0E0E0", borderRadius: "8px", color: "#111111", width: "100%", padding: "12px 12px", fontSize: "14px", outline: "none", fontFamily: "var(--font-inter), system-ui, sans-serif", boxSizing: "border-box" as const }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555555", marginBottom: "5px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>Naam *</label>
                    <input type="text" name="naam" required placeholder="Naam" style={{ background: "#F8F8F8", border: "1px solid #E0E0E0", borderRadius: "8px", color: "#111111", width: "100%", padding: "12px 12px", fontSize: "14px", outline: "none", fontFamily: "var(--font-inter), system-ui, sans-serif", boxSizing: "border-box" as const }} />
                  </div>
                </div>

                {/* E-mailadres (volle breedte) */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555555", marginBottom: "5px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>E-mailadres *</label>
                  <input type="email" name="email" required placeholder="jouw@email.be" style={{ background: "#F8F8F8", border: "1px solid #E0E0E0", borderRadius: "8px", color: "#111111", width: "100%", padding: "12px 14px", fontSize: "14px", outline: "none", fontFamily: "var(--font-inter), system-ui, sans-serif", boxSizing: "border-box" as const }} />
                  <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                    Je ontvangt hierop een bevestigingsmail.
                  </p>
                </div>

                {/* Tel / Postcode / Adres — responsive via grid-template-areas */}
                <div className="pv-loc-grid">
                  <div style={{ gridArea: "tel" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555555", marginBottom: "5px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>Telefoonnummer *</label>
                    <input
                      type="tel" name="tel" required placeholder="0470 00 00 00"
                      onFocus={e => { e.currentTarget.style.borderColor = "#9BCB6C"; }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = "#E0E0E0";
                        const formatted = formatBelgianPhone(e.currentTarget.value);
                        if (formatted !== e.currentTarget.value) e.currentTarget.value = formatted;
                      }}
                      style={{ background: "#F8F8F8", border: "1px solid #E0E0E0", borderRadius: "8px", color: "#111111", width: "100%", padding: "12px 12px", fontSize: "14px", outline: "none", fontFamily: "var(--font-inter), system-ui, sans-serif", boxSizing: "border-box" as const }}
                    />
                  </div>
                  <div style={{ gridArea: "postcode" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555555", marginBottom: "5px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>Postcode *</label>
                    <input type="text" name="postcode" required placeholder="2000" style={{ background: "#F8F8F8", border: "1px solid #E0E0E0", borderRadius: "8px", color: "#111111", width: "100%", padding: "12px 10px", fontSize: "14px", outline: "none", fontFamily: "var(--font-inter), system-ui, sans-serif", boxSizing: "border-box" as const }} />
                  </div>
                  <div style={{ gridArea: "adres" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555555", marginBottom: "5px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>Adres *</label>
                    <input type="text" name="gemeente" required placeholder="Bv. Kerkstraat 12, Mechelen" style={{ background: "#F8F8F8", border: "1px solid #E0E0E0", borderRadius: "8px", color: "#111111", width: "100%", padding: "12px 14px", fontSize: "14px", outline: "none", fontFamily: "var(--font-inter), system-ui, sans-serif", boxSizing: "border-box" as const }} />
                  </div>
                </div>

                {/* Bericht */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555555", marginBottom: "5px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
                    Bericht / voorkeursmoment <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optioneel)</span>
                  </label>
                  <textarea
                    name="bericht"
                    rows={3}
                    placeholder="Bv. Ik zou graag eens naar mijn dak laten kijken. Een plaatsbezoek op vrijdag rond 18.00 u zou ideaal zijn."
                    style={{ background: "#F8F8F8", border: "1px solid #E0E0E0", borderRadius: "8px", color: "#111111", width: "100%", padding: "12px 14px", fontSize: "14px", outline: "none", fontFamily: "var(--font-inter), system-ui, sans-serif", boxSizing: "border-box" as const, resize: "none" as const }}
                  />
                </div>

                {status === "error" && (
                  <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "var(--font-inter), system-ui, sans-serif", margin: 0 }}>
                    Er is iets misgegaan. Probeer het opnieuw of bel Yannick rechtstreeks op +32 468 35 28 69.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  onMouseEnter={e => { if (canSubmit) (e.currentTarget as HTMLButtonElement).style.background = "#7AB54E"; }}
                  onMouseLeave={e => { if (canSubmit) (e.currentTarget as HTMLButtonElement).style.background = "#9BCB6C"; }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    width: "100%", padding: "16px 24px", borderRadius: "10px",
                    background: canSubmit ? "#9BCB6C" : "#C8DFB0",
                    color: "#FFFFFF", border: "none",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    fontWeight: 700, fontSize: "15px", transition: "background 200ms ease",
                  }}
                >
                  {status === "sending" ? "Aanvraag versturen…" : (
                    <>Aanvraag versturen <ChevronRight size={16} strokeWidth={2.5} /></>
                  )}
                </button>

              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
