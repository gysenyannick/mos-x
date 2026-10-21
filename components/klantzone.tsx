"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Check, CalendarDays, MapPin, Home, Camera, FileText, Receipt, ShieldCheck,
  Download, MessageCircle, Phone, X, ChevronLeft, ChevronRight, Clock, Info,
} from "lucide-react";
import { STATUS_STAPPEN, type Dossier, type Document, type Foto } from "@/lib/klantzone";

const GREEN = "#9BCB6C";
const GREEN_HOVER = "#7AB54E";
const DARK = "#1A1A1A";
const MUTED = "#545454";
const BORDER = "#E5E7EB";
const SOFT = "#F7F8F6";
const EASE = [0.22, 1, 0.36, 1] as const;

const TEL = "+32 468 35 28 69";
const TEL_HREF = "tel:+32468352869";

const fmtDag = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) =>
  new Date(iso + "T12:00:00").toLocaleDateString("nl-BE", opts);
const hoofdletter = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const fmtKort = (iso: string) => fmtDag(iso, { day: "numeric", month: "short" });
const fmtEuro = (n: number) => "€ " + n.toLocaleString("nl-BE");

function groet(uur: number) {
  if (uur < 12) return "Goedemorgen";
  if (uur < 18) return "Goedemiddag";
  return "Goedenavond";
}

/* ── Gedeelde kaart ── */
function Card({ children, style, id, flush }: { children: React.ReactNode; style?: React.CSSProperties; id?: string; flush?: boolean }) {
  return (
    <section
      id={id}
      className={flush ? "kz-card kz-card-flush" : "kz-card"}
      style={{
        background: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        padding: "24px",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function CardTitle({ icon, children, extra }: { icon: React.ReactNode; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: "-0.028em", color: DARK, margin: 0 }}>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(155,203,108,0.14)", color: GREEN_HOVER, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </span>
        {children}
      </h2>
      {extra}
    </div>
  );
}

/* ── Statusbalk ── */
function StatusStepper({ status }: { status: Dossier["status"] }) {
  const actief = STATUS_STAPPEN.findIndex((s) => s.key === status);
  const reduce = useReducedMotion();
  return (
    <div className="kz-stepper" role="list" aria-label="Stand van je project">
      {STATUS_STAPPEN.map((s, i) => {
        const klaar = i < actief;
        const nu = i === actief;
        return (
          <div key={s.key} role="listitem" aria-current={nu ? "step" : undefined} className="kz-step">
            <div className="kz-step-track">
              {i > 0 && (
                <span className="kz-line">
                  <motion.span
                    className="kz-line-fill"
                    initial={{ scaleX: reduce ? (i <= actief ? 1 : 0) : 0 }}
                    animate={{ scaleX: i <= actief ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: EASE }}
                  />
                </span>
              )}
              <motion.span
                className="kz-dot"
                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.12, ease: EASE }}
                style={{
                  background: klaar || nu ? GREEN : "#FFFFFF",
                  borderColor: klaar || nu ? GREEN : BORDER,
                  color: klaar || nu ? "#FFFFFF" : "#9CA3AF",
                }}
              >
                {klaar ? <Check size={14} strokeWidth={3} /> : i + 1}
                {nu && <span className="kz-dot-pulse" aria-hidden="true" />}
              </motion.span>
            </div>
            <span className="kz-step-label" style={{ color: nu ? DARK : klaar ? MUTED : "#9CA3AF", fontWeight: nu ? 700 : 500 }}>
              {s.label}
            </span>
          </div>
        );
      })}
      <p className="kz-step-caption">Stap {actief + 1} van {STATUS_STAPPEN.length} · <strong style={{ color: DARK }}>{STATUS_STAPPEN[actief].label}</strong></p>
    </div>
  );
}

/* ── Foto-lightbox ── */
function Lightbox({ fotos, index, onClose, onNav }: { fotos: Foto[]; index: number; onClose: () => void; onNav: (d: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose, onNav]);

  const f = fotos[index];
  return (
    <motion.div
      role="dialog" aria-modal="true" aria-label={f.bijschrift}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(10,12,10,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <button className="kz-lb-btn" aria-label="Sluiten" onClick={onClose} style={{ top: 16, right: 16 }}><X size={20} /></button>
      {fotos.length > 1 && (
        <>
          <button className="kz-lb-btn" aria-label="Vorige foto" onClick={(e) => { e.stopPropagation(); onNav(-1); }} style={{ left: 16, top: "50%", transform: "translateY(-50%)" }}><ChevronLeft size={22} /></button>
          <button className="kz-lb-btn" aria-label="Volgende foto" onClick={(e) => { e.stopPropagation(); onNav(1); }} style={{ right: 16, top: "50%", transform: "translateY(-50%)" }}><ChevronRight size={22} /></button>
        </>
      )}
      <figure onClick={(e) => e.stopPropagation()} style={{ margin: 0, maxWidth: 960, width: "100%", textAlign: "center" }}>
        <div style={{ position: "relative", width: "100%", height: "min(76vh, 720px)" }}>
          <Image src={f.src} alt={f.bijschrift} fill sizes="100vw" style={{ objectFit: "contain" }} />
        </div>
        <figcaption style={{ color: "#FFFFFF", fontSize: 14, marginTop: 12, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
          {f.bijschrift} <span style={{ color: "rgba(255,255,255,0.55)" }}>· {fmtKort(f.datum)}</span>
        </figcaption>
      </figure>
    </motion.div>
  );
}

/* ── Documentregel ── */
const DOC_ICON = { offerte: FileText, factuur: Receipt, garantie: ShieldCheck };
const STATUS_PILL: Record<Document["status"], { label: string; bg: string; fg: string }> = {
  goedgekeurd: { label: "Goedgekeurd", bg: "rgba(155,203,108,0.16)", fg: "#4F7F2E" },
  betaald:     { label: "Betaald",     bg: "rgba(155,203,108,0.16)", fg: "#4F7F2E" },
  open:        { label: "Te betalen",  bg: "#FFF6E5",                fg: "#8A5A00" },
  volgt:       { label: "Volgt",       bg: SOFT,                     fg: MUTED },
};

function DocRow({ d, onDemo }: { d: Document; onDemo: () => void }) {
  const Icon = DOC_ICON[d.soort];
  const pill = STATUS_PILL[d.status];
  const beschikbaar = d.status !== "volgt";
  return (
    <li className="kz-doc">
      <span style={{ width: 40, height: 40, borderRadius: 12, background: SOFT, color: beschikbaar ? GREEN_HOVER : "#9CA3AF", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={19} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14.5, color: DARK }}>{d.titel}</p>
        <p style={{ margin: "2px 0 0", fontSize: 13, color: MUTED }}>
          {d.datum ? fmtDag(d.datum, { day: "numeric", month: "long", year: "numeric" }) : d.toelichting}
          {d.bedrag != null && <> · <span style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{fmtEuro(d.bedrag)}</span></>}
        </p>
        <span className="kz-pill-inline" style={{ display: "none", fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: pill.bg, color: pill.fg }}>{pill.label}</span>
      </div>
      <span className="kz-pill-side" style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: pill.bg, color: pill.fg, whiteSpace: "nowrap" }}>{pill.label}</span>
      {beschikbaar && (
        <button className="kz-icon-btn" aria-label={`${d.titel} downloaden`} onClick={onDemo}>
          <Download size={17} />
        </button>
      )}
    </li>
  );
}

/* ════════════════════════════════════════════════════════ */

export default function Klantzone({ dossier, demo = false, vandaag }: { dossier: Dossier; demo?: boolean; vandaag?: string }) {
  const reduce = useReducedMotion();
  const [uur, setUur] = useState<number | null>(null);
  const [fase, setFase] = useState<Foto["fase"]>("tijdens");
  const [lb, setLb] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setUur(new Date().getHours()), 0);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const today = vandaag ?? new Date().toISOString().slice(0, 10);
  const { klant, planning } = dossier;
  const dagIndex = planning.findIndex((p) => p.datum === today);
  const fotosFase = useMemo(() => dossier.fotos.filter((f) => f.fase === fase), [dossier.fotos, fase]);
  const telling = (f: Foto["fase"]) => dossier.fotos.filter((x) => x.fase === f).length;

  const facturen = dossier.documenten.filter((d) => d.soort === "factuur");
  const totaal = dossier.documenten.find((d) => d.soort === "offerte")?.bedrag ?? 0;
  const betaald = facturen.filter((d) => d.status === "betaald").reduce((s, d) => s + (d.bedrag ?? 0), 0);
  const pct = totaal ? Math.round((betaald / totaal) * 100) : 0;

  const waHref = `https://wa.me/32468352869?text=${encodeURIComponent(`Hallo Yannick, ik heb een vraag over mijn dossier ${dossier.dossiernummer}.`)}`;
  const demoMelding = () => setToast("Dit is een demo: hier opent straks de echte PDF.");

  const fadeUp = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay: 0.08 * i, ease: EASE },
  });

  return (
    <div style={{ background: SOFT, minHeight: "100vh", fontFamily: "var(--font-inter), system-ui, sans-serif", color: DARK }}>
      <style>{`
        .kz-wrap { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
        .kz-grid { display: grid; grid-template-columns: minmax(0,1fr) 340px; gap: 20px; align-items: start; }
        .kz-aside { position: sticky; top: 20px; display: flex; flex-direction: column; gap: 20px; }
        .kz-main { display: flex; flex-direction: column; gap: 20px; }

        .kz-stepper { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); }
        .kz-step-caption { display: none; grid-column: 1 / -1; }
        .kz-step { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0; }
        .kz-step-track { position: relative; width: 100%; display: flex; justify-content: center; }
        .kz-line { position: absolute; top: 50%; right: 50%; width: 100%; height: 3px; margin-top: -1.5px; background: ${BORDER}; border-radius: 3px; overflow: hidden; }
        .kz-line-fill { position: absolute; inset: 0; background: ${GREEN}; transform-origin: left center; }
        .kz-dot { position: relative; z-index: 1; width: 30px; height: 30px; border-radius: 50%; border: 2px solid; display: inline-flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 700; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .kz-dot-pulse { position: absolute; inset: -2px; border-radius: 50%; border: 2px solid ${GREEN}; animation: kz-pulse 2.4s cubic-bezier(.22,1,.36,1) infinite; }
        @keyframes kz-pulse { 0% { transform: scale(1); opacity: .8 } 70%,100% { transform: scale(1.7); opacity: 0 } }
        .kz-step-label { font-size: 12.5px; text-align: center; line-height: 1.25; }

        .kz-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 46px; padding: 0 18px; border-radius: 10px; font-family: var(--font-montserrat), system-ui, sans-serif; font-weight: 700; font-size: 14.5px; text-decoration: none; cursor: pointer; border: none;
          transition: background-color .2s ease, box-shadow .2s ease, transform .15s ease, border-color .2s ease; }
        .kz-btn:focus-visible, .kz-icon-btn:focus-visible, .kz-tab:focus-visible, .kz-thumb:focus-visible, .kz-lb-btn:focus-visible { outline: 3px solid rgba(155,203,108,0.55); outline-offset: 2px; }
        .kz-btn:active, .kz-icon-btn:active, .kz-thumb:active { transform: scale(0.97); }
        .kz-btn-primary { background: ${GREEN}; color: #FFFFFF; }
        .kz-btn-primary:hover { background: ${GREEN_HOVER}; box-shadow: 0 8px 20px -8px rgba(122,181,78,0.6); }
        .kz-btn-ghost { background: #FFFFFF; color: ${DARK}; border: 1px solid ${BORDER}; }
        .kz-btn-ghost:hover { border-color: ${GREEN}; box-shadow: 0 6px 16px -10px rgba(122,181,78,0.5); }

        .kz-icon-btn { width: 38px; height: 38px; border-radius: 10px; border: 1px solid ${BORDER}; background: #FFFFFF; color: ${DARK}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
          transition: border-color .2s ease, color .2s ease, transform .15s ease; }
        .kz-icon-btn:hover { border-color: ${GREEN}; color: ${GREEN_HOVER}; }

        .kz-tabs { display: inline-flex; padding: 4px; background: ${SOFT}; border: 1px solid ${BORDER}; border-radius: 12px; gap: 2px; }
        .kz-tab { border: none; background: transparent; padding: 7px 14px; border-radius: 9px; font-size: 13.5px; font-weight: 600; color: ${MUTED}; cursor: pointer; transition: background-color .2s ease, color .2s ease; }
        .kz-tab:hover { color: ${DARK}; }
        .kz-tab[aria-selected="true"] { background: #FFFFFF; color: ${DARK}; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

        .kz-photos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .kz-thumb { position: relative; aspect-ratio: 4 / 3; border-radius: 12px; overflow: hidden; border: none; padding: 0; cursor: zoom-in; background: ${SOFT}; transition: transform .15s ease; }
        .kz-thumb img { transition: transform .5s cubic-bezier(.22,1,.36,1); }
        .kz-thumb:hover img { transform: scale(1.05); }

        .kz-doc { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-top: 1px solid ${BORDER}; }
        .kz-doc:first-child { border-top: none; padding-top: 0; }

        .kz-lb-btn { position: absolute; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color .2s ease; }
        .kz-lb-btn:hover { background: rgba(255,255,255,0.18); }

        .kz-timeline { list-style: none; margin: 0; padding: 0; }
        .kz-tl-item { position: relative; display: flex; gap: 14px; padding-bottom: 18px; }
        .kz-tl-item:last-child { padding-bottom: 0; }
        .kz-tl-item::before { content: ""; position: absolute; left: 15px; top: 34px; bottom: 0; width: 2px; background: ${BORDER}; }
        .kz-tl-item:last-child::before { display: none; }

        @media (max-width: 960px) {
          .kz-grid { grid-template-columns: 1fr; }
          .kz-aside { position: static; }
        }
        @media (max-width: 640px) {
          .kz-wrap { padding: 0 16px; }
          .kz-card { padding: 20px !important; }
          .kz-card-flush { padding: 0 !important; }
          .kz-step-label { display: none; }
          .kz-step-caption { display: block; text-align: center; margin: 12px 0 0; font-size: 13.5px; color: ${MUTED}; }
          .kz-grid { display: flex; flex-direction: column; }
          .kz-main, .kz-aside { display: contents; }
          .kz-o-status { order: 1; } .kz-o-yannick { order: 2; } .kz-o-planning { order: 3; }
          .kz-o-fotos { order: 4; } .kz-o-docs { order: 5; } .kz-o-nieuws { order: 6; }
          .kz-pill-side { display: none; }
          .kz-pill-inline { display: inline-block !important; margin-top: 6px; }
          .kz-dot { width: 26px; height: 26px; font-size: 11px; }
          .kz-photos { grid-template-columns: repeat(2, 1fr); }
          .kz-hero-title { font-size: 28px !important; }
          .kz-page { padding-bottom: 96px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kz-dot-pulse { animation: none; opacity: 0; }
          .kz-thumb img { transition: none; }
        }
      `}</style>

      {demo && (
        <div style={{ background: DARK, color: "#FFFFFF", fontSize: 13, textAlign: "center", padding: "9px 16px" }}>
          <Info size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6, color: GREEN }} />
          Demo van de Mos-X klantenzone, met een fictieve klant. Zo ziet je klant zijn eigen pagina.
        </div>
      )}

      {/* Header */}
      <header style={{ background: "#FFFFFF", borderBottom: `1px solid ${BORDER}` }}>
        <div className="kz-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <Link href="/" aria-label="Mos-X home" style={{ display: "flex", alignItems: "center" }}>
            <Image src="/images/logo.avif" alt="Mos-X" width={120} height={40} style={{ height: 36, width: "auto" }} priority />
          </Link>
          <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>
            Jouw klantenzone · <span style={{ fontVariantNumeric: "tabular-nums" }}>{dossier.dossiernummer}</span>
          </span>
        </div>
      </header>

      <main className="kz-page" style={{ padding: "36px 0 80px", position: "relative" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: "0 0 auto 0", height: 420, background: "radial-gradient(ellipse 60% 100% at 20% 0%, rgba(155,203,108,0.10), rgba(155,203,108,0) 70%)", pointerEvents: "none" }} />
        <div className="kz-wrap" style={{ position: "relative" }}>

          {/* Begroeting */}
          <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GREEN_HOVER }}>
              {dossier.dienst}
            </p>
            <h1 className="kz-hero-title" style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: "-0.028em", lineHeight: 1.1, margin: "8px 0 10px" }}>
              {uur === null ? "Hallo" : groet(uur)} {klant.voornaam} <span aria-hidden="true">👋</span>
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: MUTED, display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><MapPin size={15} /> {klant.adres}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Home size={15} /> {dossier.dak}</span>
            </p>
          </motion.div>

          <div className="kz-grid">
            <div className="kz-main">

              {/* Status + vandaag */}
              <motion.div {...fadeUp(1)} className="kz-o-status">
                <Card>
                  <StatusStepper status={dossier.status} />
                  <div style={{ marginTop: 24, padding: "18px 20px", borderRadius: 14, background: "linear-gradient(135deg, rgba(155,203,108,0.14), rgba(155,203,108,0.05))", border: "1px solid rgba(155,203,108,0.35)", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 240px" }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GREEN_HOVER }}>
                        {dagIndex >= 0 ? `Vandaag · dag ${dagIndex + 1} van ${planning.length}` : "Volgende stap"}
                      </p>
                      <p style={{ margin: "4px 0 0", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>
                        {dagIndex >= 0 ? planning[dagIndex].titel : `Start op ${fmtDag(dossier.start.datum)}`}
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: 14, color: MUTED }}>
                        {dagIndex >= 0 ? planning[dagIndex].omschrijving : dossier.start.vast ? "Je startdatum ligt vast." : dossier.start.voorlopig}
                      </p>
                    </div>
                    {dossier.oplevering && (
                      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: "12px 16px", border: `1px solid ${BORDER}`, minWidth: 170 }}>
                        <p style={{ margin: 0, fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 6 }}><CalendarDays size={14} /> Verwachte oplevering</p>
                        <p style={{ margin: "3px 0 0", fontWeight: 700, fontSize: 15 }}>{hoofdletter(fmtDag(dossier.oplevering))}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Planning */}
              <motion.div {...fadeUp(2)} className="kz-o-planning">
                <Card>
                  <CardTitle icon={<CalendarDays size={18} />}>Planning</CardTitle>
                  <ol className="kz-timeline">
                    {planning.map((p, i) => {
                      const klaar = p.datum < today;
                      const nu = p.datum === today;
                      return (
                        <li key={p.datum} className="kz-tl-item">
                          <span style={{ position: "relative", zIndex: 1, width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                            background: klaar ? GREEN : nu ? "#FFFFFF" : SOFT, color: klaar ? "#FFFFFF" : nu ? GREEN_HOVER : "#9CA3AF", border: `2px solid ${klaar || nu ? GREEN : BORDER}` }}>
                            {klaar ? <Check size={15} strokeWidth={3} /> : i + 1}
                          </span>
                          <div style={{ flex: 1, paddingTop: 4 }}>
                            <p style={{ margin: 0, fontSize: 13, color: MUTED }}>
                              {hoofdletter(fmtDag(p.datum))}
                              {nu && <span style={{ marginLeft: 8, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#FFFFFF", background: GREEN, borderRadius: 999, padding: "2px 8px" }}>Vandaag</span>}
                            </p>
                            <p style={{ margin: "2px 0 0", fontWeight: 700, fontSize: 15 }}>{p.titel}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 14, color: MUTED, lineHeight: 1.5 }}>{p.omschrijving}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </Card>
              </motion.div>

              {/* Werffoto's */}
              <motion.div {...fadeUp(3)} className="kz-o-fotos">
                <Card>
                  <CardTitle
                    icon={<Camera size={18} />}
                    extra={
                      <div className="kz-tabs" role="tablist" aria-label="Fase">
                        {(["voor", "tijdens", "na"] as const).map((f) => (
                          <button key={f} role="tab" aria-selected={fase === f} className="kz-tab" onClick={() => setFase(f)}>
                            {f[0].toUpperCase() + f.slice(1)} <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{telling(f)}</span>
                          </button>
                        ))}
                      </div>
                    }
                  >
                    Werffoto&apos;s
                  </CardTitle>
                  <AnimatePresence mode="wait">
                    <motion.div key={fase} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                      {fotosFase.length ? (
                        <div className="kz-photos">
                          {fotosFase.map((f, i) => (
                            <button key={f.src} className="kz-thumb" onClick={() => setLb(i)} aria-label={`Foto bekijken: ${f.bijschrift}`}>
                              <Image src={f.src} alt={f.bijschrift} fill sizes="(max-width: 640px) 50vw, 240px" style={{ objectFit: "cover" }} />
                              <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "18px 10px 8px", background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", color: "#FFFFFF", fontSize: 11.5, textAlign: "left", fontWeight: 500 }}>
                                {fmtKort(f.datum)}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div style={{ border: `1.5px dashed ${BORDER}`, borderRadius: 12, padding: "32px 20px", textAlign: "center", color: MUTED, fontSize: 14 }}>
                          <Camera size={22} style={{ margin: "0 auto 8px", color: "#9CA3AF" }} />
                          {fase === "na" ? "Na de oplevering zie je hier het resultaat." : "Nog geen foto's in deze fase."}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Card>
              </motion.div>

              {/* Documenten */}
              <motion.div {...fadeUp(4)} className="kz-o-docs">
                <Card>
                  <CardTitle icon={<FileText size={18} />}>Offertes, facturen & garantie</CardTitle>
                  {totaal > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 8 }}>
                        <span style={{ color: MUTED }}>Betaald</span>
                        <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmtEuro(betaald)} <span style={{ color: MUTED, fontWeight: 500 }}>van {fmtEuro(totaal)}</span></span>
                      </div>
                      <div style={{ height: 8, background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 999, overflow: "hidden" }}>
                        <motion.div initial={{ width: reduce ? `${pct}%` : 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.5, ease: EASE }} style={{ height: "100%", background: GREEN, borderRadius: 999 }} />
                      </div>
                    </div>
                  )}
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {dossier.documenten.map((d) => <DocRow key={d.titel} d={d} onDemo={demoMelding} />)}
                  </ul>
                </Card>
              </motion.div>
            </div>

            {/* Zijkolom */}
            <aside className="kz-aside">
              <motion.div {...fadeUp(1)} className="kz-o-yannick">
                <Card flush style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ position: "relative", height: 210 }}>
                    <Image src="/images/yannick-op-dak-srgb.JPEG" alt="Yannick van Mos-X op een dak" fill sizes="340px" style={{ objectFit: "cover", objectPosition: "center 72%" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent 55%)" }} />
                    <div style={{ position: "absolute", left: 18, bottom: 14, color: "#FFFFFF" }}>
                      <p style={{ margin: 0, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GREEN }}>Op je werf</p>
                      <p style={{ margin: "2px 0 0", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontSize: 20, fontWeight: 800 }}>Yannick</p>
                    </div>
                  </div>
                  <div style={{ padding: "18px 20px 20px" }}>
                    <p style={{ margin: "0 0 16px", fontSize: 14, color: MUTED, lineHeight: 1.55 }}>
                      Ik sta zelf op je dak, van de eerste tot de laatste dag. Vragen? Stuur me gewoon een berichtje.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <a className="kz-btn kz-btn-primary" href={waHref} target="_blank" rel="noopener noreferrer">
                        <MessageCircle size={18} /> WhatsApp Yannick
                      </a>
                      <a className="kz-btn kz-btn-ghost" href={TEL_HREF}>
                        <Phone size={16} /> {TEL}
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div {...fadeUp(2)} className="kz-o-nieuws">
                <Card>
                  <CardTitle icon={<Clock size={18} />}>Laatste nieuws</CardTitle>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                    {dossier.updates.map((u, i) => (
                      <li key={u.datum + i} style={{ display: "flex", gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? GREEN : BORDER, marginTop: 6, flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: 0, fontSize: 12.5, color: MUTED }}>{fmtKort(u.datum)}</p>
                          <p style={{ margin: "2px 0 0", fontSize: 14, lineHeight: 1.5 }}>{u.tekst}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </aside>
          </div>

          <p style={{ textAlign: "center", fontSize: 12.5, color: "#9CA3AF", marginTop: 32 }}>
            Deze pagina is enkel voor jou. Deel je link niet met anderen.
          </p>
        </div>
      </main>

      <AnimatePresence>
        {lb !== null && (
          <Lightbox
            fotos={fotosFase}
            index={lb}
            onClose={() => setLb(null)}
            onNav={(d) => setLb((i) => (i === null ? i : (i + d + fotosFase.length) % fotosFase.length))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 16, x: "-50%" }}
            style={{ position: "fixed", left: "50%", bottom: 90, background: DARK, color: "#FFFFFF", padding: "12px 18px", borderRadius: 12, fontSize: 14, zIndex: 1500, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.4)", maxWidth: "calc(100% - 32px)" }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
