"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GREEN = "#9BCB6C";
const TOTAL_STEPS = 5;

function calcPrice(opp: number, extra: string): { low: number; high: number } {
  if (extra === "coating") {
    return {
      low: Math.max(1200, Math.round(opp * 22 / 50) * 50),
      high: Math.max(1500, Math.round(opp * 28 / 50) * 50),
    };
  }
  return {
    low: Math.max(500, Math.round(opp * 10 / 50) * 50),
    high: Math.max(650, Math.round(opp * 14 / 50) * 50),
  };
}

const STEP_NAMES = ["Woningtype", "Daktype", "Oppervlakte", "Behandeling", "Richtprijs"];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="lg:hidden" style={{ textAlign: "center", marginBottom: "28px" }}>
      <p style={{
        fontSize: "15px", fontWeight: 700,
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        color: GREEN, marginBottom: "12px", letterSpacing: "-0.01em",
      }}>
        {step}. {STEP_NAMES[step - 1]}
      </p>
      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} style={{
            flex: 1, maxWidth: "56px", height: "8px", borderRadius: "4px",
            background: i < step ? GREEN : "#E5E7EB",
            transition: "background 0.3s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

function PlaceholderImg({ label }: { label: string }) {
  return (
    <div style={{
      width: "72px", height: "56px", borderRadius: "8px",
      background: "#E8E8E8", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "10px", color: "#999", textAlign: "center", padding: "4px",
    }}>
      {label}
    </div>
  );
}

function ChoiceRow({ label, onClick, selected, imgSrc }: { label: string; onClick: () => void; selected: boolean; imgSrc?: string }) {
  return (
    <button
      onClick={onClick}
      onPointerDown={e => { const el = e.currentTarget; el.style.transform = 'scale(0.99)'; setTimeout(() => { el.style.transform = ''; }, 140); }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(155,203,108,0.15)'; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; } }}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: "16px",
        padding: "10px 16px", borderRadius: "12px", cursor: "pointer",
        border: selected ? `2px solid ${GREEN}` : "2px solid #E5E7EB",
        background: selected ? "rgba(90,158,47,0.05)" : "#FFFFFF",
        boxShadow: selected ? "0 0 0 3px rgba(155,203,108,0.2)" : "none",
        transition: "border-color 180ms ease, background 180ms ease, box-shadow 180ms ease, transform 140ms ease", textAlign: "left", marginBottom: "0",
      }}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={label}
          style={{ width: "72px", height: "56px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1, fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 600, fontSize: "15px", color: "#111" }}>
        {label}
      </div>
      <div style={{
        width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
        border: selected ? "none" : "2px solid #DDD",
        background: selected ? GREEN : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 180ms ease, border-color 180ms ease",
      }}>
        {selected && <svg key="row-check" className="calc-check" width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      </div>
    </button>
  );
}

function ChoiceCard({ label, onClick, selected, imgSrc, imgHeight = 190, cardClass = "" }: { label: string; onClick: () => void; selected: boolean; imgSrc?: string; imgHeight?: number; cardClass?: string }) {
  return (
    <button
      onClick={onClick}
      onPointerDown={e => { const el = e.currentTarget; el.style.transform = 'scale(0.98)'; setTimeout(() => { el.style.transform = ''; }, 140); }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(155,203,108,0.15)'; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; } }}
      className={`choice-card ${cardClass}`}
      style={{
        display: "flex", flexDirection: "column", alignItems: "stretch",
        padding: 0, borderRadius: "14px", cursor: "pointer", overflow: "hidden",
        border: selected ? `2px solid ${GREEN}` : "2px solid #E5E7EB",
        background: selected ? "rgba(90,158,47,0.04)" : "#FFFFFF",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: selected ? "0 0 0 3px rgba(155,203,108,0.2)" : "0 2px 8px rgba(0,0,0,0.06)",
        position: "relative", textAlign: "left",
      }}
    >
      <div className="cc-img-wrap" style={{ position: "relative", flexShrink: 0 }}>
        {imgSrc ? (
          <img src={imgSrc} alt={label} className="cc-img" style={{ width: "100%", height: `${imgHeight}px`, objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: `${imgHeight}px`, background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#AAA" }}>
            Geen foto
          </div>
        )}
        {/* Gradient overlay + label — alleen zichtbaar op mobile via CSS */}
        <div className="cc-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)", display: "none", pointerEvents: "none" }} />
        <div className="cc-overlay-label" style={{ position: "absolute", bottom: "10px", left: "12px", right: "12px", display: "none", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#fff", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "14px", lineHeight: 1.3 }}>
            {label}
          </span>
          <div style={{
            width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
            border: selected ? "none" : "2px solid rgba(255,255,255,0.5)",
            background: selected ? GREEN : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {selected && <svg key="ov-check" className="calc-check" width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
          </div>
        </div>
      </div>
      {/* Desktop footer label */}
      <div className="cc-footer" style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <span style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "14px", color: "#111", lineHeight: 1.3 }}>
          {label}
        </span>
        <div style={{
          width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
          border: selected ? "none" : "2px solid #DDD",
          background: selected ? GREEN : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 180ms ease, border-color 180ms ease",
        }}>
          {selected && <svg key="ft-check" className="calc-check" width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
        </div>
      </div>
    </button>
  );
}

function ExtraCard({ title, subtitle, bullets, selected, onClick }: { title: string; subtitle?: string; bullets: string[]; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      onPointerDown={e => { const el = e.currentTarget; el.style.transform = 'scale(0.98)'; setTimeout(() => { el.style.transform = ''; }, 140); }}
      style={{
        width: "100%", display: "flex", alignItems: "flex-start", gap: "14px",
        padding: "16px", borderRadius: "12px", cursor: "pointer",
        border: selected ? `2px solid ${GREEN}` : "2px solid #E5E7EB",
        background: selected ? "rgba(90,158,47,0.05)" : "#FFFFFF",
        transition: "all 0.2s ease", textAlign: "left", marginBottom: "10px",
      }}
    >
      <div style={{
        width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
        border: selected ? "none" : "2px solid #DDD",
        background: selected ? GREEN : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 180ms ease, border-color 180ms ease",
      }}>
        {selected && <svg key="extra-check" className="calc-check" width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111", marginBottom: subtitle || bullets.length ? "4px" : "0" }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: "13px", color: "#777", marginBottom: bullets.length ? "8px" : "0", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            {subtitle}
          </div>
        )}
        {bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: "6px", fontSize: "13px", color: "#555", marginBottom: "3px" }}>
            <span style={{ color: GREEN, fontWeight: 700, flexShrink: 0 }}>✓</span> {b}
          </div>
        ))}
      </div>
    </button>
  );
}

function Field({ label, placeholder, value, onChange, type = "text" }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {label}
      </label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "13px 16px", borderRadius: "10px",
          border: "1.5px solid #E5E7EB", background: "#F8F8F8",
          fontSize: "15px", color: "#111", outline: "none",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          boxSizing: "border-box",
          transition: "border-color 160ms ease",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = GREEN)}
        onBlur={e => (e.currentTarget.style.borderColor = "#E5E7EB")}
      />
    </div>
  );
}

const NextBtn = ({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label?: string }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: "100%", padding: "14px", borderRadius: "8px", border: "none",
    background: disabled ? "#DDD" : GREEN, color: disabled ? "#AAA" : "#fff",
    fontWeight: 700, fontSize: "15px", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
    boxShadow: disabled ? "none" : "0 4px 16px rgba(90,158,47,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
    transition: "background 220ms ease, color 220ms ease, box-shadow 220ms ease",
  }}>
    {label ?? "Ga verder"}<ChevronRight size={16} strokeWidth={2.5} />
  </button>
);


function formatBelgianPhone(raw: string): string {
  if (!raw) return raw;
  let digits = raw.replace(/\D/g, '');
  if (!digits) return raw;
  if (digits.startsWith('32') && digits.length > 9) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (!digits) return raw;
  // Mobile: 04XX → 9 digits after stripping 0, starts with 4
  if (digits.startsWith('4') && digits.length >= 9) {
    const d = digits.slice(0, 9);
    return '+32 ' + d.slice(0,3) + ' ' + d.slice(3,5) + ' ' + d.slice(5,7) + ' ' + d.slice(7,9);
  }
  // 1-digit area (02, 03, 09): 8 digits after stripping 0
  if (['2', '3', '9'].includes(digits[0]) && digits.length >= 8) {
    const d = digits.slice(0, 8);
    return '+32 ' + d[0] + ' ' + d.slice(1,4) + ' ' + d.slice(4,6) + ' ' + d.slice(6,8);
  }
  // 2-digit area (011, 016 etc.): 8 digits after stripping 0
  if (digits.length >= 8) {
    const d = digits.slice(0, 8);
    return '+32 ' + d.slice(0,2) + ' ' + d.slice(2,4) + ' ' + d.slice(4,6) + ' ' + d.slice(6,8);
  }
  return raw;
}

export default function SitePricing() {
  const [step, setStep] = useState(1);
  const [opp, setOpp] = useState(150);
  const [oppInput, setOppInput] = useState("150");
  const [oppPreset, setOppPreset] = useState<number | null>(null);
  const [woning, setWoning] = useState("");
  const [dak, setDak] = useState("");
  const [extra, setExtra] = useState("");
  const [form, setForm] = useState({ voornaam: "", achternaam: "", tel: "", email: "", postcode: "", adres: "" });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [phase, setPhase] = useState<'form' | 'animating' | 'result'>('form');
  const [checksDone, setChecksDone] = useState(0);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postcodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const adresTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submitInFlight = useRef(false);
  const stepContainerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const prefersReducedMotion = useRef(typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false);
  const [postcodeSuggestions, setPostcodeSuggestions] = useState<{postcode: string; municipality: string}[]>([]);
  const [showPostcodeDrop, setShowPostcodeDrop] = useState(false);
  const [adresSuggestions, setAdresSuggestions] = useState<string[]>([]);
  const [showAdresDrop, setShowAdresDrop] = useState(false);
  const [plaatsbezoekStatus, setPlaatsbezoekStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const addPhotos = (files: FileList) => {
    const slots = 3 - photos.length;
    if (slots <= 0) return;
    const newFiles = Array.from(files).slice(0, slots);
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    setPhotos(p => [...p, ...newFiles]);
    setPhotoPreviews(p => [...p, ...newPreviews]);
  };

  const removePhoto = (i: number) => {
    URL.revokeObjectURL(photoPreviews[i]);
    setPhotos(p => p.filter((_, idx) => idx !== i));
    setPhotoPreviews(p => p.filter((_, idx) => idx !== i));
  };

  const fetchPostcodeSuggestions = async (query: string) => {
    if (query.length < 2) { setPostcodeSuggestions([]); setShowPostcodeDrop(false); return; }
    try {
      const res = await fetch('/api/suggest/postcode?q=' + encodeURIComponent(query));
      const result: {postcode: string; municipality: string}[] = await res.json();
      setPostcodeSuggestions(result);
      setShowPostcodeDrop(result.length > 0);
    } catch { setPostcodeSuggestions([]); setShowPostcodeDrop(false); }
  };

  const fetchAdresSuggestions = async (query: string, postcode: string) => {
    if (query.length < 3) { setAdresSuggestions([]); setShowAdresDrop(false); return; }
    try {
      const params = new URLSearchParams({ q: query });
      if (postcode) params.set('postcode', postcode);
      const res = await fetch('/api/suggest/adres?' + params.toString());
      const result: string[] = await res.json();
      setAdresSuggestions(result);
      setShowAdresDrop(result.length > 0);
    } catch { setAdresSuggestions([]); setShowAdresDrop(false); }
  };

  const handlePlaatsbezoek = async () => {
    if (plaatsbezoekStatus === 'sending' || plaatsbezoekStatus === 'success') return;
    setPlaatsbezoekStatus('sending');
    try {
      const pr = calcPrice(opp, extra);
      const fd = new FormData();
      fd.append("voornaam", form.voornaam);
      fd.append("achternaam", form.achternaam);
      fd.append("email", form.email);
      fd.append("tel", form.tel);
      fd.append("postcode", form.postcode);
      fd.append("adres", form.adres);
      fd.append("woning", woning);
      fd.append("dak", dak);
      fd.append("opp", String(opp));
      fd.append("extra", extra);
      fd.append("priceLow", String(pr.low));
      fd.append("priceHigh", String(pr.high));
      photos.forEach((f, i) => fd.append(`foto_${i}`, f, f.name));
      const res = await fetch("/api/plaatsbezoek", { method: "POST", body: fd });
      if (!res.ok) throw new Error("send_failed");
      setPlaatsbezoekStatus('success');
    } catch {
      setPlaatsbezoekStatus('error');
    }
  };

  const handleSubmit = () => {
    // Guard tegen dubbelklikken: één verzending per berekening.
    if (submitInFlight.current) return;
    submitInFlight.current = true;
    setSubmitError(false);
    setPhase('animating');
    setChecksDone(0);
    setProgress(0);
    const pr = calcPrice(opp, extra);
    const fd = new FormData();
    fd.append("voornaam", form.voornaam);
    fd.append("achternaam", form.achternaam);
    fd.append("email", form.email);
    fd.append("tel", form.tel);
    fd.append("postcode", form.postcode);
    fd.append("adres", form.adres);
    fd.append("woning", woning);
    fd.append("dak", dak);
    fd.append("opp", String(opp));
    fd.append("extra", extra);
    fd.append("priceLow", String(pr.low));
    fd.append("priceHigh", String(pr.high));
    photos.forEach((f, i) => fd.append(`foto_${i}`, f, f.name));
    fetch("/api/richtprijs", { method: "POST", body: fd })
      .catch(() => {})
      .finally(() => { submitInFlight.current = false; });
  };

  useEffect(() => {
    if (phase !== 'animating') return;
    const duration = 6000;
    const start = Date.now();
    const id = setInterval(() => {
      const pct = Math.min(100, Math.round((Date.now() - start) / duration * 100));
      setProgress(pct);
      setChecksDone(Math.min(5, Math.ceil(pct / 20)));
      if (pct >= 100) {
        clearInterval(id);
        setTimeout(() => setPhase('result'), 380);
      }
    }, 40);
    return () => clearInterval(id);
  }, [phase]);

  const priceRange = calcPrice(opp, extra);
  const extraLabel = extra === "coating" ? "Dakcoating + reiniging" : extra === "geen" ? "Alleen dakreiniging" : "Advies gewenst";
  const fmt = (n: number) => "€ " + n.toLocaleString("nl-BE");

  const dienstParam = extra === "coating" ? "Dakcoating" : "Dakontmossen";
  const berichtParam = "Richtprijsaanvraag via calculator: " + woning + ", " + dak + ", " + opp + " m², " + extraLabel;
  const params = new URLSearchParams({
    naam: (form.voornaam + " " + form.achternaam).trim(),
    email: form.email,
    telefoon: form.tel,
    gemeente: form.postcode,
    dienst: dienstParam,
    bericht: berichtParam,
  });
  const contactUrl = "/contact?" + params.toString();

  const animateStep = (newStep: number, dir: 'forward' | 'backward') => {
    if (isAnimatingRef.current) return;
    const el = stepContainerRef.current;
    if (!el || prefersReducedMotion.current) { setStep(newStep); return; }
    isAnimatingRef.current = true;
    el.style.transition = 'opacity 140ms ease, transform 140ms ease';
    el.style.opacity = '0';
    el.style.transform = dir === 'forward' ? 'translateX(-14px)' : 'translateX(14px)';
    setTimeout(() => {
      setStep(newStep);
      el.style.transition = 'none';
      el.style.transform = dir === 'forward' ? 'translateX(14px)' : 'translateX(-14px)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 240ms ease-out, transform 240ms ease-out';
          el.style.transform = 'translateX(0)';
          el.style.opacity = '1';
          setTimeout(() => {
            isAnimatingRef.current = false;
            el.style.transition = '';
            el.style.transform = '';
            el.style.opacity = '';
          }, 250);
        });
      });
    }, 150);
  };

  const next = () => animateStep(Math.min(step + 1, TOTAL_STEPS), 'forward');
  const prev = () => animateStep(Math.max(step - 1, 1), 'backward');

  const tabLabels = ["Woningtype", "Daktype", "Oppervlakte", "Behandeling", "Richtprijs"];

  const woningTypes = [
    { label: "Rijwoning",          img: "/images/Rijtjes.png" },
    { label: "Halfopen bebouwing", img: "/images/halfopen.png" },
    { label: "Vrijstaande woning", img: "/images/vrijstaand.png" },
  ];
  const dakTypes = [
    { label: "Betonpannen",       img: "/images/Betonpannen.jpg" },
    { label: "Keramische pannen", img: "/images/Keramische pannen.jpg" },
    { label: "Tegelpannen",       img: "/images/Tegelpannen.jpg" },
    { label: "Kunstleien",        img: "/images/Kunstleien.png" },
    { label: "Natuurleien",       img: "/images/Leien dak.jpeg" },
    { label: "Metalen daken",     img: "/images/Metalen daken.jpg" },
    { label: "Ik weet het niet",  img: undefined },
  ];
  const extraOpties = [
    { id: "coating", title: "Ja, met dakcoating", subtitle: "Geschikt voor betonpannen en leien.", badge: "10 jaar garantie", bullets: ["Herstelt kleur en uitstraling", "Vermindert vochtopname", "Beschermt tegen weer, UV & mos"] },
    { id: "geen", title: "Nee, alleen dakreiniging", subtitle: "Inclusief standaard behandeling tegen mos- en algengroei.", badge: null, bullets: [] },
    { id: "advies", title: "Ik twijfel nog", subtitle: "Adviseer mij welke behandeling het beste bij mijn dak past.", badge: null, bullets: [] },
  ];

  return (
    <section id="calculator" className="site-pricing-section" style={{ background: "transparent", padding: "0 clamp(12px, 4vw, 40px) 60px", marginTop: "-69px", position: "relative", zIndex: 10, scrollMarginTop: "130px" }}>
      <style>{`
        /* ── Calculator animations ── */
        @keyframes calc-check-pop {
          from { opacity: 0; transform: scale(0.55); }
          to   { opacity: 1; transform: scale(1); }
        }
        .calc-check {
          animation: calc-check-pop 180ms ease forwards;
          display: block;
        }
        @keyframes calc-fade-up {
          from { opacity: 0; transform: translateY(9px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .calc-r1 { animation: calc-fade-up 280ms ease-out 0ms   both; }
        .calc-r2 { animation: calc-fade-up 280ms ease-out 80ms  both; }
        .calc-r3 { animation: calc-fade-up 280ms ease-out 170ms both; }
        .calc-r4 { animation: calc-fade-up 280ms ease-out 260ms both; }
        .calc-r5 { animation: calc-fade-up 280ms ease-out 360ms both; }
        @media (prefers-reduced-motion: reduce) {
          .calc-check { animation: none; }
          .calc-r1,.calc-r2,.calc-r3,.calc-r4,.calc-r5 {
            animation: none; opacity: 1; transform: none;
          }
        }

        @media (max-width: 640px) {
          .woning-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .choice-card-woning {
            height: 144px !important;
            flex-direction: row !important;
          }
          .choice-card-woning .cc-img-wrap {
            flex: 1;
          }
          .choice-card-woning .cc-img {
            height: 144px !important;
            width: 100% !important;
          }
          .choice-card-woning .cc-overlay {
            display: block !important;
          }
          .choice-card-woning .cc-overlay-label {
            display: flex !important;
          }
          .choice-card-woning .cc-footer {
            display: none !important;
          }
          /* Stap 2 daktype: 2 kolommen op mobile */
          .dak-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          /* Stap 3 oppervlakte-presets: 2 × 2 op mobile.
             min-width:0 is nodig omdat de nowrap-tekst anders de kolommen
             oprekt tot max-content en de vierde kaart buiten beeld duwt. */
          .opp-preset-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .opp-preset-grid > button {
            min-width: 0 !important;
          }

          /* Stap 4 coating-keuze: 1 kolom op mobile */
          .extra-grid {
            grid-template-columns: 1fr !important;
          }
          /* Jouw keuzes: 2 kolommen op mobile */
          .keuzes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          /* Combined naam-veld focus */
          .naam-wrapper:focus-within {
            border-color: #9BCB6C !important;
          }

          /* Stap 5 mobiel: naam op één rij (voornaam | achternaam),
             telefoon eronder over de volle breedte.
             Inputs hebben een intrinsieke minimumbreedte (~170px); zonder
             min-width:0 rekken ze de kolommen op en valt het veld buiten de kaart. */
          .naam-tel-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .naam-tel-grid > div,
          .postcode-adres-grid > div {
            min-width: 0 !important;
          }
          .naam-tel-grid input,
          .postcode-adres-grid input {
            min-width: 0 !important;
            width: 100% !important;
          }
          .naam-wrapper input {
            flex: 1 1 0 !important;
            min-width: 0 !important;
          }

          /* Resultaatscherm: prijsrange altijd op één regel.
             Font schaalt mee met de viewport zodat hij van 320 tot 640px
             binnen de groene kaart blijft passen. */
          .prijs-kaart {
            padding-left: 14px !important;
            padding-right: 14px !important;
          }
          .prijs-bedrag {
            white-space: nowrap !important;
            font-size: clamp(19px, 6.2vw, 30px) !important;
          }

          /* E-mailbevestiging: compacter zodat hij op één regel past.
             Bewust geen nowrap — bij een extra lang adres breekt hij liever
             af dan buiten de container te lopen. */
          .email-status {
            padding: 5px 9px !important;
            gap: 5px !important;
            max-width: 100% !important;
          }
          .email-status span {
            font-size: 11px !important;
            line-height: 1.35 !important;
          }

          /* "Wil je een exacte prijs?" — gecentreerd op mobiel */
          .exacte-prijs-kaart {
            text-align: center !important;
          }
          .exacte-prijs-rij {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
          }
          .exacte-prijs-rij > div {
            flex: 0 1 auto !important;
            min-width: 0 !important;
          }
        }
      `}</style>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        {/* Witte zweefkaart */}
        <div className="site-pricing-card" style={{ background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 8px 48px rgba(0,0,0,0.15)", padding: "clamp(20px, 4vw, 40px) clamp(20px, 4vw, 40px) 80px" }}>
          <div className="flex flex-col lg:flex-row lg:items-stretch" style={{ gap: "48px" }}>

            {/* ── LINKS: uitleg ── */}
            <div className="hidden lg:flex" style={{
              flex: "0 0 30%", minWidth: "220px",
              flexDirection: "column", justifyContent: "flex-start",
              borderRight: "1px solid #EEEEEE",
              margin: "-40px 0 -80px -40px",
              padding: "48px 32px 0 40px",
              borderRadius: "16px 0 0 16px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Dakfoto — absoluut onderaan, van rand tot rand */}
              <img
                src="/images/Grijze_foto_dak_calculator_.png"
                alt=""
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0,
                  width: "100%",
                  height: "52%",
                  objectFit: "cover",
                  objectPosition: "top center",
                  pointerEvents: "none",
                }}
              />
              {/* Gradient: wit bovenaan → transparant naar foto */}
              <div style={{
                position: "absolute",
                top: 0, bottom: 0, left: 0, right: 0,
                background: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }} />
              {/* Tekst — boven de gradient */}
              <div style={{ position: "relative", zIndex: 2 }}>
              <span style={{
                display: "inline-block", fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase", color: GREEN,
                fontFamily: "var(--font-montserrat), system-ui, sans-serif", marginBottom: "14px",
              }}>
                Binnen 60 seconden
              </span>
              <h2 style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800,
                fontSize: "1.55rem", letterSpacing: "-0.02em",
                color: "#111", marginBottom: "24px", lineHeight: 1.25,
              }}>
                Ontvang een <span style={{ color: GREEN }}>richtprijs</span><br />voor jouw dak
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["Binnen 1 minuut resultaat", "Persoonlijk dakadvies", "Vrijblijvend en zonder verplichtingen"].map((txt) => (
                  <div key={txt} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: GREEN, flexShrink: 0, display: "inline-block" }} />
                    <span style={{ fontSize: "14px", color: "#555", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>{txt}</span>
                  </div>
                ))}
              </div>
              </div>{/* einde tekst wrapper */}
            </div>

            {/* ── RECHTS: tabs + stap content ── */}
            <div style={{ flex: "1 1 0" }}>

              {/* Titel — mobile only */}
              {phase === 'form' && (
                <div className="lg:hidden" style={{ textAlign: "center", marginBottom: "20px" }}>
                  <p style={{
                    fontSize: "20px", fontWeight: 800,
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    color: "#111", letterSpacing: "-0.02em", lineHeight: 1.3,
                    marginBottom: "16px",
                  }}>
                    Ontvang een <span style={{ color: GREEN }}>richtprijs</span><br />voor jouw dak
                  </p>
                  <div style={{ width: "100%", height: "1px", background: "#E5E7EB", margin: "0 0 4px" }} />
                </div>
              )}

              {/* Stap indicator — mobile only */}
              {phase === 'form' && <StepIndicator step={step} />}

              {/* Tab navigatie — desktop only */}
              {phase === 'form' && (
                <div className="hidden lg:flex" style={{ justifyContent: "center", marginBottom: "28px", gap: "24px", overflowX: "auto", WebkitOverflowScrolling: "touch" as const }}>
                  {tabLabels.map((label, i) => {
                    const tabStep = i + 1;
                    const isActive = step === tabStep;
                    const isDone = step > tabStep;
                    return (
                      <button
                        key={label}
                        onClick={() => isDone ? setStep(tabStep) : undefined}
                        style={{
                          padding: "10px 16px 8px", border: "none", background: "none",
                          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                          fontSize: "13px", fontWeight: isActive ? 700 : 500,
                          color: isActive ? GREEN : isDone ? GREEN : "#AAAAAA",
                          cursor: isDone ? "pointer" : "default",
                          whiteSpace: "nowrap", flexShrink: 0,
                          transition: "color 0.2s",
                          display: "flex", flexDirection: "column", alignItems: "stretch",
                        }}
                      >
                        <span>{tabStep}. {label}</span>
                        <div style={{
                          height: "3px", borderRadius: "2px", marginTop: "6px",
                          background: isActive ? GREEN : "#E8E8E8",
                          transition: "background 220ms ease",
                        }} />
                      </button>
                    );
                  })}
                </div>
              )}

        <div style={{ overflow: "hidden" }}>
        <div ref={stepContainerRef} className="site-pricing-steps" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(0px, 3vw, 40px)", minHeight: "280px" }}>

          {phase === 'animating' ? (
            <div style={{ padding: "48px 0 36px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p key={checksDone < 2 ? 'a' : checksDone < 4 ? 'b' : 'c'} style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "12px", color: GREEN, marginBottom: "22px", letterSpacing: "0.12em", textTransform: "uppercase", animation: "calc-fade-up 260ms ease both" }}>
                {checksDone < 2 ? "We bekijken je dakgegevens…" : checksDone < 4 ? "We berekenen de behandeling…" : "Je richtprijs is bijna klaar…"}
              </p>
              <div style={{ width: "100%", maxWidth: "320px", height: "5px", borderRadius: "3px", background: "#EFEFEF", marginBottom: "28px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: GREEN, borderRadius: "3px", transition: "width 0.04s linear" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "290px" }}>
                {(["Woningtype gecontroleerd", "Daktype meegenomen", "Dakoppervlakte verwerkt", "Gekozen behandeling berekend", "Richtprijs samengesteld"] as string[]).map((label, i) => {
                  const active = checksDone > i;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", opacity: active ? 1 : 0.25, transition: "opacity 0.45s ease" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, background: active ? GREEN : "#E0E0E0", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s ease" }}>
                        {active && <svg key={`anim-check-${i}`} className="calc-check" width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                      </div>
                      <span style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "14px", color: active ? "#222" : "#CCC", transition: "color 0.3s ease" }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : phase === 'result' ? (
            <div style={{ padding: "16px 0 8px" }}>

              {/* Check + titel */}
              <div className="calc-r1" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: GREEN, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "19px", color: "#111", margin: 0, letterSpacing: "-0.01em" }}>
                  Je richtprijs is klaar.
                </h3>
              </div>

              {/* Prijskaart */}
              <div className="prijs-kaart calc-r2" style={{ background: "#F4FBF0", border: "2px solid rgba(155,203,108,0.4)", borderRadius: "14px", padding: "16px 24px 14px", marginBottom: "10px", textAlign: "center" }}>
                <div className="prijs-bedrag" style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "34px", color: "#111", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
                  {fmt(priceRange.low)} - {fmt(priceRange.high)}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "5px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                  Geschatte richtprijs incl. btw
                </div>
              </div>

              {/* Subtekst */}
              <p className="calc-r3" style={{ fontSize: "13px", color: "#888", lineHeight: 1.55, fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "10px", textAlign: "center" }}>
                Op basis van jouw gegevens. De exacte prijs bepalen we na controle van je dak.
              </p>

              {/* E-mailbevestiging — statusbalk */}
              <div className="calc-r3" style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
              <div className="email-status" style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(155,203,108,0.12)", border: "1px solid rgba(155,203,108,0.3)", borderRadius: "6px", padding: "5px 12px" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}><path d="M2 6l3 3 5-5" stroke="#4A8A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                <span style={{ fontSize: "12px", color: "#4A8A2A", fontFamily: "var(--font-inter), system-ui, sans-serif", fontWeight: 600 }}>
                  Ook verzonden naar {form.email}
                </span>
              </div>
              </div>

              {/* Jouw keuzes */}
              <div className="calc-r4" style={{ marginBottom: "24px" }}>
                <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "10px", color: "#BBBBBB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Jouw keuzes
                </p>
                <div className="keuzes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {([
                    { label: "Woningtype", value: woning },
                    { label: "Daktype", value: dak },
                    { label: "Oppervlakte", value: `${opp} m²` },
                    { label: "Behandeling", value: extraLabel },
                  ] as {label: string; value: string}[]).map(item => (
                    <div key={item.label} style={{ background: "#FFFFFF", borderRadius: "10px", padding: "12px 10px", textAlign: "center", border: "1.5px solid #E8ECE5", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                      <div style={{ fontSize: "12px", color: GREEN, fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "4px", letterSpacing: "0.02em", fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: "13px", fontWeight: 400, color: "#1A1A1A", fontFamily: "var(--font-inter), system-ui, sans-serif", lineHeight: 1.25 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA — gratis plaatsbezoek */}
              <div className="calc-r5">
              {plaatsbezoekStatus === 'success' ? (
                <div style={{ background: "#F4FBF0", border: "1.5px solid rgba(155,203,108,0.4)", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#9BCB6C", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "15px", color: "#1A5C36", margin: "0 0 3px" }}>
                      Yannick is verwittigd!
                    </p>
                    <p style={{ fontSize: "13px", color: "#3A7A25", fontFamily: "var(--font-inter), system-ui, sans-serif", margin: "0 0 2px", lineHeight: 1.5 }}>
                      Hij neemt binnen 1 werkdag contact met je op om het plaatsbezoek in te plannen.
                    </p>
                    <p style={{ fontSize: "11px", color: "#6AAA44", fontFamily: "var(--font-inter), system-ui, sans-serif", margin: 0 }}>
                      Je hoeft verder niets te doen.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="exacte-prijs-kaart" style={{ background: "#F7FBF2", border: "1.5px solid rgba(155,203,108,0.3)", borderRadius: "12px", padding: "14px 18px" }}>
                  <div className="exacte-prijs-rij" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "160px" }}>
                      <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "15px", color: "#111", margin: "0 0 3px" }}>
                        Wil je een exacte prijs?
                      </p>
                      <p style={{ fontSize: "12px", color: "#777", fontFamily: "var(--font-inter), system-ui, sans-serif", margin: 0, lineHeight: 1.5 }}>
                        Yannick bekijkt je dak ter plaatse en maakt daarna een offerte op maat.
                      </p>
                    </div>
                    <button
                      onClick={handlePlaatsbezoek}
                      disabled={plaatsbezoekStatus === 'sending'}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: plaatsbezoekStatus === 'sending' ? "#AAA" : "#9BCB6C", color: "#fff", padding: "10px 18px", borderRadius: "8px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "13px", border: "none", cursor: plaatsbezoekStatus === 'sending' ? "not-allowed" : "pointer", boxShadow: plaatsbezoekStatus === 'sending' ? "none" : "0 3px 12px rgba(90,158,47,0.25)", whiteSpace: "nowrap", flexShrink: 0, transition: "background 0.18s ease, box-shadow 0.18s ease" }}
                      onMouseEnter={e => { if (plaatsbezoekStatus !== 'sending') { e.currentTarget.style.background = "#7AB54E"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(90,158,47,0.38)"; } }}
                      onMouseLeave={e => { if (plaatsbezoekStatus !== 'sending') { e.currentTarget.style.background = "#9BCB6C"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(90,158,47,0.25)"; } }}
                    >
                      {plaatsbezoekStatus === 'sending' ? "Aanvraag versturen…" : (<>Plan een gratis plaatsbezoek <ChevronRight size={13} strokeWidth={2.5} /></>)}
                    </button>
                  </div>
                  {plaatsbezoekStatus === 'error' && (
                    <p style={{ fontSize: "12px", color: "#C0392B", marginTop: "10px", marginBottom: 0, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                      Er ging iets mis. Probeer het opnieuw of neem telefonisch contact op.
                    </p>
                  )}
                </div>
              )}
              </div>{/* einde calc-r5 */}

            </div>
          ) : (
            <>

              {step === 1 && (
                <div>
                  <h3 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "18px", color: "#111", marginBottom: "20px" }}>
                    Wat voor type woning is het?
                  </h3>
                  <div className="woning-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                    {woningTypes.map(w => (
                      <ChoiceCard key={w.label} label={w.label} imgSrc={w.img} selected={woning === w.label} onClick={() => { setWoning(w.label); setTimeout(next, 220); }} cardClass="choice-card-woning" />
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "18px", color: "#111", marginBottom: "20px" }}>
                    Welk type dakbedekking ligt op je dak?
                  </h3>
                  <div className="dak-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "10px" }}>
                    {dakTypes.filter(d => d.label !== "Ik weet het niet").map(d => (
                      <ChoiceCard key={d.label} label={d.label} imgSrc={d.img} imgHeight={93} selected={dak === d.label} onClick={() => setDak(d.label)} />
                    ))}
                  </div>
                  <ChoiceRow key="ik-weet-het-niet" label="Ik weet het niet" selected={dak === "Ik weet het niet"} onClick={() => setDak("Ik weet het niet")} />
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "18px" }}>
                    <button onClick={prev} style={{
                      padding: "10px 20px", borderRadius: "8px",
                      background: "rgba(155,203,108,0.12)", border: "1.5px solid rgba(155,203,108,0.5)",
                      cursor: "pointer", fontSize: "15px", fontWeight: 700, color: GREEN,
                      fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,203,108,0.22)"; e.currentTarget.style.borderColor = GREEN; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(155,203,108,0.12)"; e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; }}
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} /> Terug
                    </button>
                    <div style={{ flex: 1 }}>
                      <NextBtn onClick={next} disabled={!dak} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "18px", color: "#111", marginBottom: "8px" }}>
                    Hoe groot is je dak ongeveer?
                  </h3>
                  <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "14px", color: "#888", marginBottom: "24px" }}>
                    Een schatting is voldoende.
                  </p>
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "baseline", gap: "6px",
                      background: "#F5F5F5", borderRadius: "8px", padding: "8px 20px",
                      cursor: "text",
                      border: "1.5px dashed #C5DFA8",
                      transition: "border-color 0.18s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = GREEN)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#C5DFA8")}
                    >
                      <input
                        className="opp-input"
                        type="number"
                        min={50} max={500}
                        value={oppInput}
                        onChange={e => {
                          setOppInput(e.target.value);
                          const v = parseInt(e.target.value, 10);
                          if (!isNaN(v) && v >= 50 && v <= 500) {
                            setOpp(v);
                            setOppPreset(null);
                          }
                        }}
                        onBlur={() => {
                          const v = parseInt(oppInput, 10);
                          const clamped = isNaN(v) ? 150 : Math.min(500, Math.max(50, v));
                          setOpp(clamped);
                          setOppInput(String(clamped));
                          setOppPreset(null);
                        }}
                        onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                        style={{
                          background: "transparent", border: "none", outline: "none",
                          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                          fontWeight: 800, fontSize: "28px", color: "#1A1A1A",
                          width: "72px", textAlign: "right", padding: 0,
                          appearance: "textfield",
                        } as React.CSSProperties}
                      />
                      <span style={{
                        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                        fontWeight: 800, fontSize: "28px", color: "#1A1A1A",
                      }}>m²</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#AAA", marginTop: "6px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                      klik op het getal om zelf te typen
                    </p>
                  </div>
                  <input type="range" min={50} max={500} step={5} value={opp}
                    onChange={e => { const v = Number(e.target.value); setOpp(v); setOppInput(String(v)); setOppPreset(null); }}
                    style={{ width: "100%", accentColor: GREEN, marginBottom: "8px" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#AAA", marginBottom: "10px" }}>
                    <span>50 m²</span>
                    <span style={{ color: GREEN, fontSize: "12px", fontFamily: "var(--font-inter), system-ui, sans-serif", display: "flex", alignItems: "center", gap: "4px" }}>
                      <ChevronLeft size={13} strokeWidth={2.5} /> sleep de slider <ChevronRight size={13} strokeWidth={2.5} />
                    </span>
                    <span>500 m²</span>
                  </div>
                  {/* Preset size cards — 4 in één rij (mobiel: 2 × 2) */}
                  <div className="opp-preset-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "36px", marginBottom: "44px" }}>
                    {([
                      { label: "Klein",       sub: "tot 100 m²",  value: 75  },
                      { label: "Gemiddeld",   sub: "100 - 175 m²",  value: 137 },
                      { label: "Groot",       sub: "175 - 250 m²",  value: 212 },
                      { label: "Extra groot", sub: "250+ m²",     value: 300 },
                    ] as { label: string; sub: string; value: number }[]).map(p => {
                      const active = oppPreset === p.value;
                      return (
                        <button
                          key={p.label}
                          onClick={() => { setOpp(p.value); setOppInput(String(p.value)); setOppPreset(p.value); }}
                          style={{
                            border: `2px solid ${active ? GREEN : "#E5E7EB"}`,
                            borderRadius: "10px",
                            background: active ? "rgba(155,203,108,0.10)" : "#FAFAFA",
                            padding: "10px 10px",
                            cursor: "pointer",
                            textAlign: "center",
                            boxShadow: active ? `0 2px 12px rgba(155,203,108,0.22)` : "none",
                            transform: "translateY(0px)",
                            transition: "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                          }}
                          onMouseEnter={e => {
                            if (opp !== p.value) {
                              e.currentTarget.style.borderColor = "rgba(155,203,108,0.6)";
                              e.currentTarget.style.boxShadow = "0 4px 14px rgba(155,203,108,0.18)";
                            }
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={e => {
                            if (opp !== p.value) {
                              e.currentTarget.style.borderColor = "#E5E7EB";
                              e.currentTarget.style.boxShadow = "none";
                            }
                            e.currentTarget.style.transform = "translateY(0px)";
                          }}
                        >
                          <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "12px", color: active ? "#1A5C36" : "#111", margin: 0, whiteSpace: "nowrap" }}>{p.label}</p>
                          <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "11px", color: active ? "#2d7a4f" : "#888", margin: "3px 0 0", whiteSpace: "nowrap" }}>{p.sub}</p>
                        </button>
                      );
                    })}
                  </div>
                  {/* Terug links, Ga verder rechts */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={prev} style={{
                      padding: "10px 20px", borderRadius: "8px",
                      background: "rgba(155,203,108,0.12)", border: "1.5px solid rgba(155,203,108,0.5)",
                      cursor: "pointer",
                      fontSize: "15px", fontWeight: 700, color: GREEN,
                      fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,203,108,0.22)"; e.currentTarget.style.borderColor = GREEN; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(155,203,108,0.12)"; e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; }}
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} /> Terug
                    </button>
                    <button onClick={next}
                      style={{
                        flex: 1, padding: "14px", borderRadius: "8px", border: "none",
                        background: GREEN, color: "#fff",
                        fontWeight: 700, fontSize: "15px", cursor: "pointer",
                        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                        boxShadow: "0 4px 16px rgba(90,158,47,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        transition: "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#7AB54E";
                        e.currentTarget.style.boxShadow = "0 6px 22px rgba(90,158,47,0.38)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        const chevron = e.currentTarget.querySelector("svg");
                        if (chevron) (chevron as unknown as HTMLElement).style.transform = "translateX(3px)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = GREEN;
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(90,158,47,0.25)";
                        e.currentTarget.style.transform = "translateY(0px)";
                        const chevron = e.currentTarget.querySelector("svg");
                        if (chevron) (chevron as unknown as HTMLElement).style.transform = "translateX(0px)";
                      }}
                    >
                      Ga verder <ChevronRight size={16} strokeWidth={2.5} style={{ transition: "transform 0.18s ease" }} />
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h3 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "18px", color: "#111", marginBottom: "20px" }}>
                    Wil je je dak na de reiniging ook laten coaten?
                  </h3>
                  <div className="extra-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", alignItems: "stretch", marginTop: "60px", marginBottom: "60px" }}>
                    {extraOpties.map(o => {
                      const selected = extra === o.id;
                      return (
                        <button
                          key={o.id}
                          onClick={() => setExtra(o.id)}
                          onPointerDown={e => { const el = e.currentTarget; el.style.transform = 'scale(0.98)'; setTimeout(() => { el.style.transform = ''; }, 140); }}
                          style={{
                            display: "flex", flexDirection: "column", alignItems: "flex-start",
                            padding: "28px 16px 16px", borderRadius: "16px", cursor: "pointer",
                            position: "relative",
                            border: selected ? `2px solid ${GREEN}` : "2px solid #E5E7EB",
                            background: selected ? "rgba(155,203,108,0.06)" : "#FFFFFF",
                            boxShadow: selected ? "0 0 0 3px rgba(155,203,108,0.12)" : "0 1px 4px rgba(0,0,0,0.05)",
                            transition: "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
                            textAlign: "left", width: "100%",
                          }}
                          onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(155,203,108,0.15)"; } }}
                          onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; } }}
                        >
                          {/* Badge — zit IN de border */}
                          {o.badge && (
                            <span style={{
                              position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                              background: "#F4FBF0",
                              color: "#4A8A2A",
                              fontWeight: 700, fontSize: "10px",
                              letterSpacing: "0.04em",
                              padding: "3px 10px", borderRadius: "20px",
                              border: "1.5px solid rgba(155,203,108,0.35)",
                              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                              whiteSpace: "nowrap",
                            }}>
                              {o.badge}
                            </span>
                          )}
                          {/* Title */}
                          <span style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "14px", color: "#111", lineHeight: 1.35, marginBottom: "6px" }}>
                            {o.title}
                          </span>
                          {/* Subtitle */}
                          <p style={{ fontSize: "12px", color: "#777", lineHeight: 1.5, marginBottom: o.bullets.length ? "10px" : "0", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                            {o.subtitle}
                          </p>
                          {/* Bullets */}
                          {o.bullets.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              {o.bullets.map(b => (
                                <div key={b} style={{ display: "flex", gap: "6px", fontSize: "12px", color: "#555", lineHeight: 1.4 }}>
                                  <span style={{ color: GREEN, fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>✓</span>
                                  <span>{b}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Selectie-indicator — onderaan gecentreerd */}
                          <div style={{ marginTop: "auto", paddingTop: "16px", width: "100%", display: "flex", justifyContent: "center" }}>
                            <div style={{
                              width: "22px", height: "22px", borderRadius: "50%",
                              border: selected ? "none" : "2px solid #D1D5DB",
                              background: selected ? GREEN : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.18s ease",
                            }}>
                              {selected && <svg key={`s4-check-${o.id}`} className="calc-check" width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {/* Terug links, Ga verder rechts */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
                    <button onClick={prev} style={{
                      padding: "10px 20px", borderRadius: "8px",
                      background: "rgba(155,203,108,0.12)", border: "1.5px solid rgba(155,203,108,0.5)",
                      cursor: "pointer",
                      fontSize: "15px", fontWeight: 700, color: GREEN,
                      fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,203,108,0.22)"; e.currentTarget.style.borderColor = GREEN; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(155,203,108,0.12)"; e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; }}
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} /> Terug
                    </button>
                    <div style={{ flex: 1 }}>
                      <NextBtn onClick={next} disabled={!extra} />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h3 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "18px", color: "#111", marginBottom: "20px" }}>
                    Waar mogen we jouw richtprijs naartoe sturen?
                  </h3>

                  {/* E-mail — full width */}
                  <Field label="E-mailadres *" placeholder="bv. naam@email.be" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" />

                  {/* Naam (samen) + Telefoon — mobiel: onder elkaar */}
                  <div className="naam-tel-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                        Voornaam &amp; Achternaam *
                      </label>
                      <div className="naam-wrapper" style={{ display: "flex", borderRadius: "10px", border: "1.5px solid #E5E7EB", background: "#F8F8F8", overflow: "hidden", transition: "border-color 0.18s ease" }}>
                        <input
                          type="text" placeholder="Voornaam" value={form.voornaam}
                          onChange={e => setForm(f => ({ ...f, voornaam: e.target.value }))}
                          style={{ flex: 1, padding: "13px 14px", border: "none", outline: "none", background: "transparent", fontSize: "15px", color: "#111", fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                        />
                        <div style={{ width: "1px", background: "#E5E7EB", flexShrink: 0 }} />
                        <input
                          type="text" placeholder="Achternaam" value={form.achternaam}
                          onChange={e => setForm(f => ({ ...f, achternaam: e.target.value }))}
                          style={{ flex: 1, padding: "13px 14px", border: "none", outline: "none", background: "transparent", fontSize: "15px", color: "#111", fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                        />
                      </div>
                    </div>
                    <div>
                                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Telefoon *</label>
                                          <input
                                            type="tel" placeholder="bv. 0470 12 34 56" value={form.tel}
                                            onChange={e => setForm(f => ({ ...f, tel: e.target.value }))}
                                            onBlur={e => { const formatted = formatBelgianPhone(e.target.value); if (formatted !== e.target.value) setForm(f => ({ ...f, tel: formatted })); e.currentTarget.style.borderColor = "#E5E7EB"; }}
                                            onFocus={e => (e.currentTarget.style.borderColor = "#9BCB6C")}
                                            style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: "1.5px solid #E5E7EB", background: "#F8F8F8", fontSize: "15px", color: "#111", outline: "none", fontFamily: "var(--font-inter), system-ui, sans-serif", boxSizing: "border-box" }}
                                          />
                                        </div>
                  </div>

                  {/* Postcode + Adres — 2 kolommen */}
                  <div className="postcode-adres-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", marginBottom: "14px" }}>

                    {/* Postcode met dropdown */}
                    <div style={{ position: "relative" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Postcode *</label>
                      <input
                        type="text" placeholder="bv. 2000" value={form.postcode} autoComplete="off"
                        onChange={e => {
                          const v = e.target.value;
                          setForm(f => ({ ...f, postcode: v }));
                          if (postcodeTimer.current) clearTimeout(postcodeTimer.current);
                          postcodeTimer.current = setTimeout(() => fetchPostcodeSuggestions(v), 350);
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = "#9BCB6C"; if (postcodeSuggestions.length > 0) setShowPostcodeDrop(true); }}
                        onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; setTimeout(() => setShowPostcodeDrop(false), 160); }}
                        style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: "1.5px solid #E5E7EB", background: "#F8F8F8", fontSize: "15px", color: "#111", outline: "none", fontFamily: "var(--font-inter), system-ui, sans-serif", boxSizing: "border-box" as React.CSSProperties["boxSizing"] }}
                      />
                      {showPostcodeDrop && postcodeSuggestions.length > 0 && (
                        <div style={{ position: "absolute" as const, top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: "10px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                          {postcodeSuggestions.map((s, i) => (
                            <button key={i} type="button"
                              onMouseDown={() => { setForm(f => ({ ...f, postcode: s.postcode })); setShowPostcodeDrop(false); setPostcodeSuggestions([]); }}
                              style={{ width: "100%", padding: "9px 14px", textAlign: "left" as const, border: "none", background: "transparent", cursor: "pointer", fontSize: "13px", fontFamily: "var(--font-inter), system-ui, sans-serif", color: "#333", display: "block" }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#F7FBF2")}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                              <span style={{ fontWeight: 700, color: "#111", marginRight: "8px" }}>{s.postcode}</span>
                              <span style={{ color: "#777" }}>{s.municipality}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Adres met autocomplete */}
                    <div style={{ position: "relative" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Adres *</label>
                      <input
                        type="text" placeholder="bv. Kerkstraat 12" value={form.adres} autoComplete="off"
                        onChange={e => {
                          const v = e.target.value;
                          setForm(f => ({ ...f, adres: v }));
                          if (adresTimer.current) clearTimeout(adresTimer.current);
                          adresTimer.current = setTimeout(() => fetchAdresSuggestions(v, form.postcode), 400);
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = "#9BCB6C"; if (adresSuggestions.length > 0) setShowAdresDrop(true); }}
                        onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; setTimeout(() => setShowAdresDrop(false), 160); }}
                        style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: "1.5px solid #E5E7EB", background: "#F8F8F8", fontSize: "15px", color: "#111", outline: "none", fontFamily: "var(--font-inter), system-ui, sans-serif", boxSizing: "border-box" as React.CSSProperties["boxSizing"] }}
                      />
                      {showAdresDrop && adresSuggestions.length > 0 && (
                        <div style={{ position: "absolute" as const, top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: "10px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                          {adresSuggestions.map((addr, i) => (
                            <button key={i} type="button"
                              onMouseDown={() => { setForm(f => ({ ...f, adres: addr })); setShowAdresDrop(false); setAdresSuggestions([]); }}
                              style={{ width: "100%", padding: "9px 14px", textAlign: "left" as const, border: "none", background: "transparent", cursor: "pointer", fontSize: "13px", fontFamily: "var(--font-inter), system-ui, sans-serif", color: "#333", display: "block" }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#F7FBF2")}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                              {addr}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Foto-upload */}
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "4px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                      Heb je een foto van je dak? <span style={{ fontWeight: 400, color: "#888" }}>(optioneel)</span>
                    </p>
                    <p style={{ fontSize: "12px", color: "#999", marginBottom: "10px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                      Niet verplicht, maar helpt ons om je dak beter in te schatten.
                    </p>

                    {/* Previews */}
                    {photoPreviews.length > 0 && (
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                        {photoPreviews.map((src, i) => (
                          <div key={i} style={{ position: "relative", width: "72px", height: "72px", borderRadius: "8px", overflow: "visible" }}>
                            <img
                              src={src}
                              alt={photos[i]?.name}
                              style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px", border: "1.5px solid #E5E7EB", display: "block" }}
                              onError={e => {
                                // HEIC fallback: toon bestandsnaam
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                const fallback = e.currentTarget.nextSibling as HTMLElement | null;
                                if (fallback) fallback.style.display = "flex";
                              }}
                            />
                            <div style={{
                              display: "none", width: "72px", height: "72px", borderRadius: "8px",
                              border: "1.5px solid #E5E7EB", background: "#F0F0F0",
                              alignItems: "center", justifyContent: "center",
                              fontSize: "9px", color: "#777", textAlign: "center", padding: "4px",
                              wordBreak: "break-all",
                            }}>
                              {photos[i]?.name}
                            </div>
                            <button
                              onClick={() => removePhoto(i)}
                              style={{
                                position: "absolute", top: "-6px", right: "-6px",
                                width: "18px", height: "18px", borderRadius: "50%",
                                background: "#1A1A1A", border: "none", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#fff", fontSize: "10px", fontWeight: 700, lineHeight: 1,
                                zIndex: 1,
                              }}
                              aria-label="Foto verwijderen"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload zone — alleen zichtbaar als < 3 foto's */}
                    {photos.length < 3 && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.heic,.heif"
                          multiple
                          style={{ display: "none" }}
                          onChange={e => { if (e.target.files) { addPhotos(e.target.files); e.target.value = ""; } }}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                          style={{
                            width: "100%", padding: "14px", borderRadius: "10px",
                            border: "1.5px dashed #C5DFA8", background: "#F9FCF5",
                            cursor: "pointer", display: "flex", alignItems: "center",
                            justifyContent: "center", gap: "8px",
                            fontSize: "14px", fontWeight: 600, color: "#5A9E3A",
                            fontFamily: "var(--font-inter), system-ui, sans-serif",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.background = "rgba(155,203,108,0.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#C5DFA8"; e.currentTarget.style.background = "#F9FCF5"; }}
                        >
                          <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
                          Foto toevoegen
                          <span style={{ fontSize: "11px", color: "#AAA", fontWeight: 400 }}>
                            JPG, PNG of HEIC · max. {3 - photos.length} foto{3 - photos.length !== 1 ? "\'s" : ""}
                          </span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Foutmelding */}
                  {submitError && (
                    <p style={{ fontSize: "13px", color: "#C0392B", marginBottom: "8px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                      Er ging iets mis. Probeer het opnieuw of neem contact op via telefoon.
                    </p>
                  )}

                  {/* Terug + Submit */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                    <button onClick={prev} style={{
                      padding: "10px 20px", borderRadius: "8px",
                      background: "rgba(155,203,108,0.12)", border: "1.5px solid rgba(155,203,108,0.5)",
                      cursor: "pointer",
                      fontSize: "15px", fontWeight: 700, color: GREEN,
                      fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,203,108,0.22)"; e.currentTarget.style.borderColor = GREEN; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(155,203,108,0.12)"; e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; }}
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} /> Terug
                    </button>
                    <div style={{ flex: 1 }}>
                      <NextBtn
                        onClick={handleSubmit}
                        disabled={!form.voornaam || !form.achternaam || !form.tel || !form.email || !form.postcode || !form.adres || submitting}
                        label={submitting ? "Versturen…" : "Ontvang mijn richtprijs"}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step > 1 && step !== 2 && step !== 3 && step !== 4 && step !== 5 && (
                <div style={{ marginTop: "18px", display: "flex", justifyContent: "flex-start" }}>
                  <button onClick={prev} style={{
                    padding: "10px 20px", borderRadius: "8px",
                    background: "rgba(155,203,108,0.12)", border: "1.5px solid rgba(155,203,108,0.5)",
                    cursor: "pointer",
                    fontSize: "15px", fontWeight: 700, color: GREEN,
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,203,108,0.22)"; e.currentTarget.style.borderColor = GREEN; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(155,203,108,0.12)"; e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; }}
                  >
                    <ChevronLeft size={16} strokeWidth={2.5} /> Terug
                  </button>
                </div>
              )}
            </>
          )}
        </div>{/* einde stap content */}
        </div>{/* einde overflow wrapper */}
            </div>{/* einde rechts */}
          </div>{/* einde flex row */}
        </div>{/* einde witte kaart */}
      </div>
    </section>
  );
}
