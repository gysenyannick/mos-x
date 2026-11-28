"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, MapPin, Minus, Phone, Plus, RotateCcw } from "lucide-react";

/** Kaartdata: alle Belgische gemeentes, provinciegrenzen en postcodes (zie public/data). */
type Kaart = {
  w: number;
  h: number;
  g: { n: string; p: string; d: string; c: [number, number] }[];
  grens: string;
  labels: Record<string, [number, number]>;
  pc: Record<string, number>;
};

type View = { x: number; y: number; w: number; h: number };

const WERKGEBIED = new Set(["antwerpen", "limburg", "vlaams-brabant"]);

const PROV_NAAM: Record<string, string> = {
  "antwerpen": "Antwerpen",
  "limburg": "Limburg",
  "vlaams-brabant": "Vlaams-Brabant",
  "oost-vlaanderen": "Oost-Vlaanderen",
  "west-vlaanderen": "West-Vlaanderen",
  "brussel": "Brussel",
  "waals-brabant": "Waals-Brabant",
  "henegouwen": "Henegouwen",
  "namen": "Namen",
  "luik": "Luik",
  "luxemburg": "Luxemburg",
};

/** Labelposities die beter staan dan het zwaartepunt van de provincie. */
const LABEL_POS: Record<string, [number, number]> = {
  "vlaams-brabant": [600, 262],
  "waals-brabant": [528, 336],
  "west-vlaanderen": [112, 222],
  "oost-vlaanderen": [330, 206],
};

const MIN_W = 110;

type Antwoord =
  | { soort: "ja"; gemeente: string; provincie: string }
  | { soort: "nee"; gemeente: string; provincie: string }
  | { soort: "onbekend" };

/** "Komen we tot bij jou?": postcodecheck met een zoombare kaart van alle Belgische gemeentes. */
export default function WerkgebiedCheck() {
  const [kaart, setKaart] = useState<Kaart | null>(null);
  const [postcode, setPostcode] = useState("");
  const [antwoord, setAntwoord] = useState<Antwoord | null>(null);
  const [gevonden, setGevonden] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [sleept, setSleept] = useState(false);
  const [pxBreed, setPxBreed] = useState(590);
  const svgRef = useRef<SVGSVGElement>(null);
  const anim = useRef<number | null>(null);
  const sleep = useRef<{ px: number; py: number; v: View; moved: boolean } | null>(null);

  useEffect(() => {
    let weg = false;
    fetch("/data/belgie-gemeentes.json")
      .then((r) => r.json())
      .then((d: Kaart) => { if (!weg) { setKaart(d); setView({ x: 0, y: 0, w: d.w, h: d.h }); } })
      .catch(() => {});
    return () => { weg = true; };
  }, []);

  // Werkelijke breedte van de kaart op het scherm: tekst krijgt overal dezelfde grootte in pixels.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(([e]) => { if (e.contentRect.width) setPxBreed(e.contentRect.width); });
    ro.observe(svg);
    return () => ro.disconnect();
  }, [kaart]);

  const begrens = useCallback((v: View): View => {
    if (!kaart) return v;
    const w = Math.min(kaart.w, Math.max(MIN_W, v.w));
    const h = w * (kaart.h / kaart.w);
    const x = Math.min(kaart.w - w, Math.max(0, v.x));
    const y = Math.min(kaart.h - h, Math.max(0, v.y));
    return { x, y, w, h };
  }, [kaart]);

  /** Vloeiend naar een nieuwe uitsnede bewegen. */
  const gaNaar = useCallback((doel: View) => {
    if (!view) return;
    const eind = begrens(doel);
    const start = view;
    const t0 = performance.now();
    const duur = 450;
    if (anim.current) cancelAnimationFrame(anim.current);
    const stap = (t: number) => {
      const p = Math.min(1, (t - t0) / duur);
      const e = 1 - Math.pow(1 - p, 3);
      setView({
        x: start.x + (eind.x - start.x) * e,
        y: start.y + (eind.y - start.y) * e,
        w: start.w + (eind.w - start.w) * e,
        h: start.h + (eind.h - start.h) * e,
      });
      if (p < 1) anim.current = requestAnimationFrame(stap);
    };
    anim.current = requestAnimationFrame(stap);
  }, [view, begrens]);

  const zoom = useCallback((factor: number, cx?: number, cy?: number) => {
    if (!view) return;
    const mx = cx ?? view.x + view.w / 2;
    const my = cy ?? view.y + view.h / 2;
    gaNaar({ x: mx - (mx - view.x) * factor, y: my - (my - view.y) * factor, w: view.w * factor, h: view.h * factor });
  }, [view, gaNaar]);

  const reset = useCallback(() => { if (kaart) gaNaar({ x: 0, y: 0, w: kaart.w, h: kaart.h }); }, [kaart, gaNaar]);

  function naarKaartPunt(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg || !view) return null;
    const r = svg.getBoundingClientRect();
    return { x: view.x + ((clientX - r.left) / r.width) * view.w, y: view.y + ((clientY - r.top) / r.height) * view.h };
  }

  function check(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cijfers = postcode.replace(/\D/g, "");
    const i = kaart && cijfers.length === 4 ? kaart.pc[cijfers] : undefined;
    if (!kaart || i === undefined) {
      setGevonden(null);
      setAntwoord({ soort: "onbekend" });
      return;
    }
    const g = kaart.g[i];
    setGevonden(i);
    setAntwoord({ soort: WERKGEBIED.has(g.p) ? "ja" : "nee", gemeente: g.n, provincie: PROV_NAAM[g.p] ?? "" });
    const w = 300;
    const h = w * (kaart.h / kaart.w);
    gaNaar({ x: g.c[0] - w / 2, y: g.c[1] - h / 2, w, h });
  }

  const actief = hover ?? gevonden;
  const label = useMemo(() => {
    if (!kaart || actief === null) return null;
    const g = kaart.g[actief];
    return { naam: g.n, prov: PROV_NAAM[g.p] ?? "", ons: WERKGEBIED.has(g.p) };
  }, [kaart, actief]);

  // Schaal t.o.v. de volledige kaart: tekst en speld blijven leesbaar als je inzoomt.
  const k = kaart && view ? view.w / kaart.w : 1;
  /** Aantal kaarteenheden per schermpixel. */
  const px = view ? view.w / pxBreed : 1;
  /** Provincienamen iets kleiner op een smal scherm, zodat ze niet over elkaar vallen. */
  const lblF = Math.min(1, Math.max(0.7, pxBreed / 590));
  const ingezoomd = k < 0.97;
  const toonGemeentes = k < 0.42;

  /** Gemeentenamen die in beeld passen zonder over elkaar te vallen. */
  const zichtbareGemeentes = useMemo(() => {
    if (!kaart || !view || !toonGemeentes) return [];
    const fs = 12 * px;
    const marge = view.w * 0.03;
    const kandidaten = kaart.g
      .map((g, i) => ({ g, i }))
      .filter(({ g }) => g.c[0] > view.x + marge && g.c[0] < view.x + view.w - marge && g.c[1] > view.y + marge && g.c[1] < view.y + view.h - marge);
    // eerst de gezochte/aangewezen gemeente, dan het werkgebied, dan de rest
    kandidaten.sort((a, b) => {
      const pa = a.i === gevonden ? 0 : a.i === hover ? 1 : WERKGEBIED.has(a.g.p) ? 2 : 3;
      const pb = b.i === gevonden ? 0 : b.i === hover ? 1 : WERKGEBIED.has(b.g.p) ? 2 : 3;
      return pa - pb;
    });
    const gezet: { x0: number; x1: number; y0: number; y1: number }[] = [];
    const uit: { g: Kaart["g"][number]; i: number }[] = [];
    for (const c of kandidaten) {
      const bw = c.g.n.length * fs * 0.56 + fs * 0.6;
      const bh = fs * 1.5;
      const cy = c.i === gevonden ? c.g.c[1] + 10 * px : c.g.c[1];
      const box = { x0: c.g.c[0] - bw / 2, x1: c.g.c[0] + bw / 2, y0: cy - bh / 2, y1: cy + bh / 2 };
      if (gezet.some((o) => box.x0 < o.x1 && box.x1 > o.x0 && box.y0 < o.y1 && box.y1 > o.y0)) continue;
      gezet.push(box);
      uit.push(c);
    }
    return uit;
  }, [kaart, view, toonGemeentes, px, gevonden, hover]);

  return (
    <section className="wg-sectie" aria-labelledby="wg-titel">
      <style>{`
        .wg-sectie { position: relative; padding: 88px 20px; background: radial-gradient(700px 420px at 85% 40%, rgba(155,203,108,0.10), transparent 70%), #F7F8F6; }
        .wg-wrap { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr); gap: 56px; align-items: center; }
        .wg-titel { margin: 0; white-space: nowrap; font: 800 clamp(1.9rem, 3vw, 2.5rem)/1.1 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #1A1A1A; }
        .wg-titel span { color: #9BCB6C; }
        .wg-oog { margin: 0 0 12px; font: 700 12.5px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #9BCB6C; }
        .wg-tekst { margin: 14px 0 26px; max-width: 480px; text-wrap: balance; font: 400 16.5px/1.65 var(--font-inter), system-ui, sans-serif; color: #545454; }
        .wg-tekst b { font-weight: 500; color: #1A1A1A; }
        .wg-tekst span { display: block; }
        .wg-pc { padding: 24px; border-radius: 16px; background: #0B0F0C; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 30px 60px -34px rgba(11,15,12,0.6); }
        .wg-pc label { display: block; margin-bottom: 14px; font: 700 17px var(--font-montserrat), system-ui, sans-serif; color: #FFFFFF; }
        .wg-pc-rij { display: flex; gap: 10px; }
        .wg-pc input { flex: 1; min-width: 0; height: 54px; padding: 0 16px; border-radius: 10px; border: 2px solid transparent; background: #FFFFFF; color: #1A1A1A; font: 500 17px var(--font-inter), system-ui, sans-serif; letter-spacing: .06em; }
        .wg-pc input:focus { outline: none; border-color: #9BCB6C; }
        .wg-pc button { height: 54px; padding: 0 26px; border: 0; border-radius: 10px; cursor: pointer; background: #9BCB6C; color: #FFFFFF; font: 700 16px var(--font-montserrat), system-ui, sans-serif; transition: background-color .2s ease, box-shadow .2s ease, transform .15s ease; }
        .wg-pc button:hover { background: #7AB54E; box-shadow: 0 8px 20px -8px rgba(122,181,78,0.7); }
        .wg-pc button:active { transform: translateY(1px); }
        .wg-pc button:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 2px; }

        .wg-uitslag { display: flex; gap: 12px; align-items: flex-start; margin-top: 16px; padding: 14px 16px; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(155,203,108,0.35); animation: wg-in .3s ease; }
        .wg-uitslag.nee { border-color: rgba(255,255,255,0.16); }
        .wg-uitslag-ico { flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: #9BCB6C; color: #FFFFFF; }
        .wg-uitslag.nee .wg-uitslag-ico { background: rgba(255,255,255,0.14); }
        .wg-uitslag b { display: block; text-wrap: balance; font: 700 15.5px/1.35 var(--font-montserrat), system-ui, sans-serif; color: #FFFFFF; }
        .wg-uitslag span { display: block; margin-top: 3px; text-wrap: pretty; font: 400 14px/1.5 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.72); }
        .wg-uitslag a { color: #9BCB6C; font-weight: 700; text-decoration: none; }
        .wg-uitslag a:hover { color: #B9DE95; text-decoration: underline; }
        @keyframes wg-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

        .wg-kaart { position: relative; padding: 14px; border-radius: 20px; background: #FFFFFF; border: 1px solid #E5E7EB;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -48px rgba(30,51,36,0.35); }
        .wg-venster { position: relative; overflow: hidden; border-radius: 14px;
          background: radial-gradient(120% 90% at 55% 30%, #FFFFFF 0%, #F7F8F6 70%); border: 1px solid #EEF0EC; }
        .wg-svg { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
        .wg-svg.zoom { touch-action: none; cursor: grab; }
        .wg-svg.sleept { cursor: grabbing; }
        .wg-leeg { aspect-ratio: 1000 / 815; }
        .wg-gem { cursor: pointer; transition: fill .15s ease; }
        .wg-ons { filter: drop-shadow(0 6px 10px rgba(70,110,40,0.22)); }
        .wg-lbl { pointer-events: none; font-family: var(--font-montserrat), system-ui, sans-serif; font-weight: 800; letter-spacing: .02em; text-anchor: middle; dominant-baseline: middle; paint-order: stroke; stroke-linejoin: round; }
        .wg-lbl.ons { fill: #FFFFFF; stroke: rgba(70,110,40,0.5); }
        .wg-lbl.niet { fill: #8B9088; stroke: #EEF0EC; font-weight: 700; }
        .wg-glbl { pointer-events: none; font-family: var(--font-inter), system-ui, sans-serif; font-weight: 500; text-anchor: middle; dominant-baseline: middle; paint-order: stroke; stroke-linejoin: round; }
        .wg-glbl.ons { fill: #1A1A1A; stroke: rgba(255,255,255,0.85); }
        .wg-glbl.niet { fill: #545454; stroke: rgba(255,255,255,0.85); }
        .wg-glbl.actief { font-weight: 700; }
        .wg-glbl.gevonden { fill: #FFFFFF; stroke: #1A1A1A; font-weight: 700; }
        .wg-pin { pointer-events: none; animation: wg-pin .5s cubic-bezier(.2,1.4,.4,1); transform-box: fill-box; transform-origin: 50% 100%; }
        @keyframes wg-pin { from { opacity: 0; transform: translateY(-14px) scale(.7); } to { opacity: 1; transform: none; } }

        .wg-zoom { position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .wg-zoom button { width: 40px; height: 40px; display: grid; place-items: center; border: 0; background: #FFFFFF; color: #1A1A1A; cursor: pointer; transition: background-color .2s ease, color .2s ease; }
        .wg-zoom button + button { border-top: 1px solid #E5E7EB; }
        .wg-zoom button:hover:not(:disabled) { background: #F2F8EC; color: #7AB54E; }
        .wg-zoom button:active:not(:disabled) { background: #E6F2DA; }
        .wg-zoom button:focus-visible { outline: 2px solid #9BCB6C; outline-offset: -2px; }
        .wg-zoom button:disabled { color: #C9CCC5; cursor: default; }
        .wg-tip { position: absolute; left: 12px; bottom: 12px; padding: 6px 10px; border-radius: 999px; background: rgba(255,255,255,0.92); border: 1px solid #E5E7EB; font: 500 12px var(--font-inter), system-ui, sans-serif; color: #545454; pointer-events: none; }

        .wg-onder { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 4px 2px; }
        .wg-naam { display: flex; align-items: center; gap: 8px; min-height: 20px; font: 700 14px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .wg-naam small { font: 500 13px var(--font-inter), system-ui, sans-serif; color: #545454; }
        .wg-legende { display: flex; gap: 16px; }
        .wg-legende span { display: flex; align-items: center; gap: 8px; font: 400 13px var(--font-inter), system-ui, sans-serif; color: #545454; }
        .wg-legende i { width: 14px; height: 14px; border-radius: 4px; }

        @media (max-width: 960px) {
          .wg-sectie { padding: 64px 16px; }
          .wg-wrap { grid-template-columns: minmax(0, 1fr); gap: 28px; }
          .wg-tekst { max-width: 400px; }
        }
        @media (max-width: 620px) {
          .wg-titel { font-size: 8vw; }
          .wg-pc-rij { flex-direction: column; }
          .wg-pc input { flex: none; width: 100%; box-sizing: border-box; }
          .wg-pc button { width: 100%; }
          .wg-kaart { padding: 8px; }
          .wg-zoom { top: 8px; right: 8px; }
          .wg-zoom button { width: 36px; height: 36px; }
          .wg-tip { display: none; }
          .wg-legende { gap: 12px; }
        }
      `}</style>
      <div className="wg-wrap">
        <div>
          <p className="wg-oog">Werkgebied</p>
          <h2 id="wg-titel" className="wg-titel">Komen we <span>tot bij jou?</span></h2>
          <p className="wg-tekst"><span>We werken in <b>Antwerpen</b>, <b>Limburg</b> en <b>Vlaams&#8209;Brabant</b>.</span> <span>Vul je postcode in en je ziet meteen je gemeente.</span></p>
          <form className="wg-pc" onSubmit={check}>
            <label htmlFor="wg-postcode">Vul je postcode in</label>
            <div className="wg-pc-rij">
              <input id="wg-postcode" inputMode="numeric" autoComplete="postal-code" maxLength={4} placeholder="Bv. 2590" value={postcode}
                onChange={(e) => { setPostcode(e.target.value); setAntwoord(null); setGevonden(null); }} />
              <button type="submit">Check</button>
            </div>
            {antwoord?.soort === "ja" && (
              <div className="wg-uitslag" role="status">
                <span className="wg-uitslag-ico"><Check size={17} strokeWidth={3} /></span>
                <div><b>Goed nieuws, we komen tot in {antwoord.gemeente}.</b><span>Provincie {antwoord.provincie}. <Link href="/#calculator">Bereken je richtprijs</Link></span></div>
              </div>
            )}
            {antwoord?.soort === "nee" && (
              <div className="wg-uitslag nee" role="status">
                <span className="wg-uitslag-ico"><Phone size={15} /></span>
                <div><b>{antwoord.gemeente} ligt buiten ons werkgebied.</b><span>Bel ons gerust even, soms kan het toch. <a href="tel:+32468352869">+32 468 35 28 69</a></span></div>
              </div>
            )}
            {antwoord?.soort === "onbekend" && (
              <div className="wg-uitslag nee" role="status">
                <span className="wg-uitslag-ico"><MapPin size={15} /></span>
                <div><b>Die postcode vinden we niet.</b><span>Kijk ze even na: een Belgische postcode heeft 4 cijfers.</span></div>
              </div>
            )}
          </form>
        </div>

        <div className="wg-kaart">
          <div className="wg-venster">
            {kaart && view ? (
              <svg ref={svgRef} className={`wg-svg${ingezoomd ? " zoom" : ""}${sleept ? " sleept" : ""}`} viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} role="img"
                aria-label="Kaart van België met alle gemeentes. Ons werkgebied: Antwerpen, Limburg en Vlaams-Brabant"
                onMouseLeave={() => setHover(null)}
                onPointerDown={(e) => {
                  if (!ingezoomd) return;
                  if (anim.current) cancelAnimationFrame(anim.current);
                  sleep.current = { px: e.clientX, py: e.clientY, v: view, moved: false };
                }}
                onPointerMove={(e) => {
                  const s = sleep.current;
                  const svg = svgRef.current;
                  if (!s || !svg) return;
                  const dx = e.clientX - s.px;
                  const dy = e.clientY - s.py;
                  if (!s.moved && Math.hypot(dx, dy) < 4) return;
                  if (!s.moved) { s.moved = true; setSleept(true); svg.setPointerCapture(e.pointerId); }
                  const r = svg.getBoundingClientRect();
                  setView(begrens({ ...s.v, x: s.v.x - (dx / r.width) * s.v.w, y: s.v.y - (dy / r.height) * s.v.h }));
                }}
                onPointerUp={() => { setTimeout(() => { sleep.current = null; }, 0); setSleept(false); }}
                onPointerCancel={() => { sleep.current = null; setSleept(false); }}
                onDoubleClick={(e) => { const p = naarKaartPunt(e.clientX, e.clientY); if (p) zoom(0.5, p.x, p.y); }}>
                {(["niet", "ons"] as const).map((laag) => (
                  <g key={laag} className={laag === "ons" ? "wg-ons" : undefined}>
                    {kaart.g.map((g, i) => {
                      const ons = WERKGEBIED.has(g.p);
                      if ((laag === "ons") !== ons) return null;
                      const isGevonden = gevonden === i;
                      const isHover = hover === i;
                      const fill = isGevonden ? "#1A1A1A" : ons ? (isHover ? "#7AB54E" : "#9BCB6C") : (isHover ? "#CFD2CB" : "#E2E4DF");
                      return (
                        <path key={i} className="wg-gem" d={g.d} fill={fill} stroke="#FFFFFF" strokeWidth={0.7} vectorEffect="non-scaling-stroke" strokeLinejoin="round"
                          onMouseEnter={() => setHover(i)} onClick={() => { if (!sleep.current?.moved) setHover(i); }}>
                          <title>{g.n}</title>
                        </path>
                      );
                    })}
                  </g>
                ))}
                <path d={kaart.grens} fill="none" stroke="#FFFFFF" strokeWidth={2.4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" pointerEvents="none" />
                {!toonGemeentes && Object.entries(kaart.labels).filter(([p]) => p !== "brussel").map(([p, pos]) => {
                  const [x, y] = LABEL_POS[p] ?? pos;
                  const ons = WERKGEBIED.has(p);
                  return (
                    <text key={p} className={ons ? "wg-lbl ons" : "wg-lbl niet"} x={x} y={y} fontSize={(ons ? 14 : 11.5) * px * lblF} strokeWidth={2.4 * px * lblF}>{PROV_NAAM[p]}</text>
                  );
                })}
                {zichtbareGemeentes.map(({ g, i }) => (
                  <text key={i} className={`wg-glbl ${WERKGEBIED.has(g.p) ? "ons" : "niet"}${i === actief ? " actief" : ""}${i === gevonden ? " gevonden" : ""}`}
                    x={g.c[0]} y={i === gevonden ? g.c[1] + 10 * px : g.c[1]} fontSize={12 * px} strokeWidth={3 * px}>{g.n}</text>
                ))}
                {gevonden !== null && (() => {
                  const [x, y] = kaart.g[gevonden].c;
                  const s = 0.8 * px;
                  return (
                    <g key={gevonden} transform={`translate(${x} ${y})`}>
                      <g className="wg-pin">
                        <g transform={`scale(${s})`}>
                          <path d="M0 0C-3-9-15-15-15-27a15 15 0 0 1 30 0C15-15 3-9 0 0Z" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth={3} />
                          <circle cx={0} cy={-27} r={5.5} fill="#9BCB6C" />
                        </g>
                      </g>
                    </g>
                  );
                })()}
              </svg>
            ) : (
              <div className="wg-leeg" aria-hidden="true" />
            )}
            <div className="wg-zoom">
              <button type="button" aria-label="Inzoomen" onClick={() => zoom(0.6)} disabled={!view || view.w <= MIN_W + 1}><Plus size={18} /></button>
              <button type="button" aria-label="Uitzoomen" onClick={() => zoom(1 / 0.6)} disabled={!ingezoomd}><Minus size={18} /></button>
              <button type="button" aria-label="Volledige kaart" onClick={reset} disabled={!ingezoomd}><RotateCcw size={16} /></button>
            </div>
            {!ingezoomd && <span className="wg-tip">Zoom in met + of dubbelklik</span>}
          </div>
          <div className="wg-onder">
            <span className="wg-naam" aria-live="polite">
              {label ? (<><MapPin size={15} color={label.ons ? "#7AB54E" : "#545454"} />{label.naam}<small>{label.prov}{label.ons ? " · werkgebied" : " · bel ons eerst"}</small></>) : "Wijs een gemeente aan op de kaart"}
            </span>
            <div className="wg-legende">
              <span><i style={{ background: "#9BCB6C" }} />Werkgebied</span>
              <span><i style={{ background: "#E2E4DF" }} />Bel ons eerst</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
