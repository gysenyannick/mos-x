"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Expand, X } from "lucide-react";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";

const AANTAL = 20;
const pagina = (i: number) => `/realisatieboek/p${String(i + 1).padStart(2, "0")}.webp`;

type PageFlipInstantie = {
  on: (e: string, cb: (ev: { data: unknown }) => void) => void;
  loadFromHTML: (items: NodeListOf<HTMLElement> | HTMLElement[]) => void;
  flipNext: (c?: "top" | "bottom") => void;
  flipPrev: (c?: "top" | "bottom") => void;
  getOrientation: () => "portrait" | "landscape";
  destroy: () => void;
};

/** Bladerbaar realisatieboek met een echt omslaand blad (StPageFlip). Op brede schermen een open boek, op gsm één pagina. */
function Boek({ groot = false, onBezoek }: { groot?: boolean; onBezoek: () => void }) {
  const houder = useRef<HTMLDivElement>(null);
  const boek = useRef<PageFlipInstantie | null>(null);
  const [huidig, setHuidig] = useState(0);
  const [staand, setStaand] = useState(false);

  useEffect(() => {
    let weg = false;
    import("page-flip").then(({ PageFlip }) => {
      if (weg || !houder.current) return;
      const pf = new PageFlip(houder.current, {
        width: 800,
        height: 566,
        size: "stretch",
        minWidth: 280,
        maxWidth: 1000,
        minHeight: 198,
        maxHeight: 708,
        showCover: false,
        maxShadowOpacity: 0.45,
        flippingTime: 900,
        mobileScrollSupport: false,
      }) as unknown as PageFlipInstantie;
      pf.on("flip", (e) => setHuidig(Number(e.data)));
      pf.on("init", () => setStaand(pf.getOrientation() === "portrait"));
      pf.on("changeOrientation", (e) => setStaand(e.data === "portrait"));
      pf.loadFromHTML(houder.current.querySelectorAll<HTMLElement>(".rb-blad"));
      boek.current = pf;
    });
    return () => { weg = true; boek.current?.destroy(); boek.current = null; };
  }, []);

  useEffect(() => {
    const toets = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") boek.current?.flipNext();
      if (e.key === "ArrowLeft") boek.current?.flipPrev();
    };
    window.addEventListener("keydown", toets);
    return () => window.removeEventListener("keydown", toets);
  }, []);

  // In het open boek staan twee pagina's tegelijk open; de teller toont dan "2-3"
  const rechts = !staand && huidig + 1 < AANTAL ? huidig + 1 : null;
  const teller = rechts ? `${huidig + 1}-${rechts + 1}` : `${huidig + 1}`;
  const laatste = staand ? huidig >= AANTAL - 1 : huidig >= AANTAL - 2;

  return (
    <div className={groot ? "rb rb-groot" : "rb"}>
      <div className="rb-podium">
        <div ref={houder} className="rb-boek">
          {Array.from({ length: AANTAL }, (_, i) => (
            <div key={i} className="rb-blad" data-density="soft">
              <img src={pagina(i)} alt={`Realisatieboek pagina ${i + 1}`} draggable={false} loading={i < 4 ? "eager" : "lazy"} />
            </div>
          ))}
        </div>
      </div>

      <div className="rb-balk">
        <button type="button" className="rb-pijl" onClick={() => boek.current?.flipPrev()} disabled={huidig === 0} aria-label="Vorige pagina"><ChevronLeft size={20} /></button>
        <div className="rb-voortgang" aria-hidden="true"><i style={{ width: `${(((rechts ?? huidig) + 1) / AANTAL) * 100}%` }} /></div>
        <span className="rb-teller">{teller} / {AANTAL}</span>
        <button type="button" className="rb-pijl" onClick={() => boek.current?.flipNext()} disabled={laatste} aria-label="Volgende pagina"><ChevronRight size={20} /></button>
      </div>

      {/* Halfweg een zachte regel, op het einde een volwaardige oproep */}
      {laatste ? (
        <div className="rb-einde" role="status">
          <div>
            <b>Wordt jouw dak <span>het volgende?</span></b>
            <small>Ontvang binnen 1 minuut een persoonlijke richtprijs.</small>
          </div>
          <div className="rb-einde-knoppen">
            <a className="rbs-knop rbs-knop-g" href="/#calculator">Bereken je richtprijs<ChevronRight size={17} /></a>
            <button type="button" className="rbs-knop rbs-knop-l" onClick={onBezoek}>Plan een gratis plaatsbezoek</button>
          </div>
        </div>
      ) : (
        <p className={(rechts ?? huidig) >= AANTAL / 2 - 1 ? "rb-tip rb-tip-aan" : "rb-tip"}>
          Al overtuigd? <a href="/#calculator">Bereken je richtprijs <ChevronRight size={14} /></a>
        </p>
      )}
    </div>
  );
}

export default function Realisatieboek() {
  const [volledig, setVolledig] = useState(false);
  const [bezoek, setBezoek] = useState(false);
  const openBezoek = () => { setVolledig(false); setBezoek(true); };

  useEffect(() => {
    if (!volledig) return;
    const sluit = (e: KeyboardEvent) => { if (e.key === "Escape") setVolledig(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", sluit);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", sluit); };
  }, [volledig]);

  return (
    <section className="rbs">
      <style>{`
        .rbs { padding: 88px 24px; background: radial-gradient(700px 420px at 85% 0%, rgba(155,203,108,0.16), transparent 65%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 75%); }
        .rbs-raster { max-width: 1180px; margin: 0 auto; }
        .rbs-kop { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; flex-wrap: wrap; margin-bottom: 44px; }
        .rbs-kop > div:first-child { max-width: 560px; }
        .rbs-oog { margin: 0 0 14px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .rbs-titel { margin: 0 0 18px; font-size: clamp(1.9rem, 3.2vw, 2.6rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.028em; color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .rbs-titel span { display: block; color: #9BCB6C; }
        .rbs-tekst { margin: 0; font-size: 16.5px; line-height: 1.7; color: rgba(255,255,255,0.72); font-family: var(--font-inter), system-ui, sans-serif; }
        .rbs-knoppen { display: flex; flex-wrap: wrap; gap: 10px; }
        .rbs-knop { display: inline-flex; align-items: center; gap: 8px; height: 50px; padding: 0 22px; border-radius: 10px; font-size: 14.5px; font-weight: 700; text-decoration: none; cursor: pointer; font-family: var(--font-montserrat), system-ui, sans-serif; transition: background-color .2s ease, border-color .2s ease, transform .15s ease; }
        .rbs-knop:active { transform: translateY(1px); }
        .rbs-knop:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 3px; }
        .rbs-knop-g { background: #9BCB6C; color: #FFFFFF; border: 0; box-shadow: 0 10px 24px -12px rgba(155,203,108,0.8); }
        .rbs-knop-g:hover { background: #7AB54E; }
        .rbs-knop-l { background: transparent; color: #FFFFFF; border: 1px solid rgba(155,203,108,0.5); }
        .rbs-knop-l:hover { border-color: #9BCB6C; background: rgba(155,203,108,0.08); }

        .rb { width: 100%; }
        .rb-podium { position: relative; padding: 0 0 8px; }
        .rb-podium::after { content: ""; position: absolute; left: 10%; right: 10%; bottom: -6px; height: 40px; border-radius: 50%; background: radial-gradient(closest-side, rgba(0,0,0,0.55), transparent); z-index: 0; pointer-events: none; }
        .rb-boek { position: relative; z-index: 1; margin: 0 auto; user-select: none; }
        .rb-blad { background: #1A2B1F; overflow: hidden; }
        .rb-blad img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
        .rb-groot .rb-podium::after { display: none; }
        .rb-balk { max-width: 520px; margin: 26px auto 0; display: flex; align-items: center; gap: 14px; }
        .rb-pijl { flex: none; width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; border: 1px solid rgba(155,203,108,0.45); background: rgba(255,255,255,0.05); color: #FFFFFF; cursor: pointer; transition: background-color .2s ease, border-color .2s ease; }
        .rb-pijl:hover:not(:disabled) { background: #9BCB6C; border-color: #9BCB6C; }
        .rb-pijl:active:not(:disabled) { transform: translateY(1px); }
        .rb-pijl:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 2px; }
        .rb-pijl:disabled { opacity: 0.35; cursor: default; }
        .rb-voortgang { flex: 1; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.12); overflow: hidden; }
        .rb-voortgang i { display: block; height: 100%; border-radius: 2px; background: #9BCB6C; transition: width .4s ease; }
        .rb-teller { flex: none; min-width: 52px; text-align: center; font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.8); font-family: var(--font-montserrat), system-ui, sans-serif; font-variant-numeric: tabular-nums; }

        .rbv { position: fixed; inset: 0; z-index: 2000; display: grid; place-items: center; padding: 24px; background: rgba(6,10,7,0.94); }
        .rbv-binnen { width: min(1400px, 100%); }
        .rbv-sluit { position: fixed; top: 18px; right: 18px; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; border: 0; background: rgba(255,255,255,0.12); color: #FFFFFF; cursor: pointer; transition: background-color .2s ease; }
        .rbv-sluit:hover { background: rgba(255,255,255,0.22); }
        .rbv-sluit:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 2px; }

        .rb-tip { max-width: 520px; margin: 16px auto 0; text-align: center; font-size: 14.5px; color: rgba(255,255,255,0.6); font-family: var(--font-inter), system-ui, sans-serif; opacity: 0; transform: translateY(6px); transition: opacity .4s ease, transform .4s ease; pointer-events: none; }
        .rb-tip-aan { opacity: 1; transform: none; pointer-events: auto; }
        .rb-tip a { display: inline-flex; align-items: center; gap: 2px; margin-left: 4px; color: #9BCB6C; font-weight: 600; text-decoration: none; transition: color .2s ease; }
        .rb-tip a:hover { color: #FFFFFF; }
        .rb-tip a:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 3px; border-radius: 4px; }
        .rb-einde { max-width: 980px; margin: 26px auto 0; padding: 24px 28px; border-radius: 18px; display: flex; justify-content: space-between; align-items: center; gap: 20px 32px; flex-wrap: wrap; background: rgba(155,203,108,0.1); border: 1px solid rgba(155,203,108,0.45); animation: rb-in .45s ease both; }
        .rb-einde b { display: block; font-size: 21px; font-weight: 800; letter-spacing: -0.02em; color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .rb-einde b span { color: #9BCB6C; }
        .rb-einde small { display: block; margin-top: 4px; font-size: 14.5px; color: rgba(255,255,255,0.7); font-family: var(--font-inter), system-ui, sans-serif; }
        .rb-einde-knoppen { display: flex; gap: 10px; flex-wrap: wrap; }
        @keyframes rb-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (max-width: 960px) {
          .rb-einde { padding: 20px; }
          .rb-einde-knoppen, .rb-einde-knoppen .rbs-knop { width: 100%; justify-content: center; }
          .rbs { padding: 64px 16px; }
          .rbs-kop { margin-bottom: 28px; }
        }
      `}</style>

      <div className="rbs-raster">
        <div className="rbs-kop">
        <div>
          <p className="rbs-oog">Realisatieboek</p>
          <h2 className="rbs-titel">Blader door <span>ons werk.</span></h2>
          <p className="rbs-tekst">Ons werk, gebundeld in één boek. Blader rustig door, of download het om later te bekijken.</p>
        </div>
          <div className="rbs-knoppen">
            <button type="button" className="rbs-knop rbs-knop-g" onClick={() => setVolledig(true)}><Expand size={17} />Volledig scherm</button>
            <a className="rbs-knop rbs-knop-l" href="/realisatieboek/MOS-X-realisatieboek.pdf" download><Download size={17} />Download PDF</a>
          </div>
        </div>
        <Boek onBezoek={openBezoek} />
      </div>

      {volledig && (
        <div className="rbv" role="dialog" aria-modal="true" aria-label="Realisatieboek" onClick={(e) => { if (e.target === e.currentTarget) setVolledig(false); }}>
          <button type="button" className="rbv-sluit" onClick={() => setVolledig(false)} aria-label="Sluiten"><X size={22} /></button>
          <div className="rbv-binnen"><Boek groot onBezoek={openBezoek} /></div>
        </div>
      )}
      <PlaatsbezoekModal open={bezoek} onClose={() => setBezoek(false)} bron="Realisatieboek" />
    </section>
  );
}
