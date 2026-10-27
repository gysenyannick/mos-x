"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Palette, X } from "lucide-react";
import DakkleurVenster from "@/components/site-dakkleur";

const OPSLAG = "mosx-exit-popup";
const PAUZE_DAGEN = 7;
const MIN_SECONDEN = 8;

/**
 * Wie de site wil verlaten zonder iets te doen, krijgt één keer de dakkleur-tool aangeboden.
 * Enkel op pc (muis gaat bovenaan uit het venster), hooguit één keer per week per bezoeker.
 */
export default function ExitPopup() {
  const pad = usePathname() ?? "";
  const [zichtbaar, setZichtbaar] = useState(false);
  const [toolOpen, setToolOpen] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches) return;
    try {
      const laatst = Number(localStorage.getItem(OPSLAG) ?? 0);
      if (Date.now() - laatst < PAUZE_DAGEN * 864e5) return;
    } catch {}
    const start = Date.now();
    const vertrek = (e: MouseEvent) => {
      if (e.clientY > 0 || e.relatedTarget) return;
      if (Date.now() - start < MIN_SECONDEN * 1000) return;
      // Niet tonen als er al een venster open staat (formulier, dakkleur-tool, menu).
      if (document.body.style.overflow === "hidden" || document.querySelector('[role="dialog"]')) return;
      setZichtbaar(true);
      try { localStorage.setItem(OPSLAG, String(Date.now())); } catch {}
      document.removeEventListener("mouseout", vertrek);
    };
    document.addEventListener("mouseout", vertrek);
    return () => document.removeEventListener("mouseout", vertrek);
  }, []);

  useEffect(() => {
    if (!zichtbaar) return;
    const toets = (e: KeyboardEvent) => { if (e.key === "Escape") setZichtbaar(false); };
    window.addEventListener("keydown", toets);
    return () => window.removeEventListener("keydown", toets);
  }, [zichtbaar]);

  if (pad.startsWith("/dakkleur")) return null;

  return (
    <>
      {zichtbaar && (
        <div className="ep" role="dialog" aria-modal="true" aria-labelledby="ep-titel" onClick={(e) => { if (e.target === e.currentTarget) setZichtbaar(false); }}>
          <style>{`
            .ep { position: fixed; inset: 0; z-index: 1900; display: grid; place-items: center; padding: 24px; background: rgba(6,10,7,0.62); backdrop-filter: blur(3px); animation: ep-in .25s ease; }
            @keyframes ep-in { from { opacity: 0; } to { opacity: 1; } }
            .ep-kaart { position: relative; width: 100%; max-width: 760px; display: grid; grid-template-columns: 300px minmax(0, 1fr); overflow: hidden; border-radius: 24px; background: #FFFFFF; box-shadow: 0 40px 90px -40px rgba(0,0,0,0.75); animation: ep-op .3s ease; }
            @keyframes ep-op { from { transform: translateY(12px); } to { transform: none; } }
            .ep-beeld { position: relative; min-height: 380px; background: url("/images/IMG_4584%20Vooraanzicht%20dakcoating.JPEG") 50% 40% / cover; }
            .ep-tag { position: absolute; top: 14px; z-index: 1; padding: 6px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-montserrat), system-ui, sans-serif; }
            .ep-tag.na { left: 14px; background: #9BCB6C; color: #0B0F0C; }
            .ep-tekst { padding: 40px 36px 34px; display: flex; flex-direction: column; justify-content: center; }
            .ep-tekst .ep-oog { margin: 0 0 12px; font-size: 12.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
            .ep-tekst h2 { margin: 0 0 12px; font-size: 27px; font-weight: 800; line-height: 1.15; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; text-wrap: balance; }
            .ep-tekst h2 span { display: block; color: #9BCB6C; }
            .ep-tekst p.ep-uitleg { margin: 0 0 24px; font-size: 15.5px; line-height: 1.65; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; text-wrap: pretty; }
            .ep-knop { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 52px; padding: 0 24px; border: 0; border-radius: 10px; background: #9BCB6C; color: #FFFFFF; font-size: 15.5px; font-weight: 700; cursor: pointer; font-family: var(--font-montserrat), system-ui, sans-serif; box-shadow: 0 10px 24px -12px rgba(122,181,78,0.9); transition: background-color .2s ease, transform .15s ease, box-shadow .2s ease; }
            .ep-knop:hover { background: #7AB54E; box-shadow: 0 14px 28px -12px rgba(122,181,78,0.95); }
            .ep-knop:active { transform: translateY(1px); }
            .ep-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
            .ep-nee { margin-top: 12px; align-self: center; padding: 6px 10px; border: 0; background: none; font-size: 13.5px; color: #8E8E89; cursor: pointer; font-family: var(--font-inter), system-ui, sans-serif; }
            .ep-nee:hover { color: #1A1A1A; text-decoration: underline; }
            .ep-nee:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; border-radius: 4px; }
            .ep-sluit { position: absolute; top: 14px; right: 14px; z-index: 2; width: 36px; height: 36px; border: 0; border-radius: 50%; display: grid; place-items: center; background: #F2F4F0; color: #1A1A1A; cursor: pointer; transition: background-color .2s ease; }
            .ep-sluit:hover { background: #E3E8DE; }
            .ep-sluit:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }
            @media (prefers-reduced-motion: reduce) { .ep, .ep-kaart { animation: none; } }
          `}</style>
          <div className="ep-kaart">
            <button type="button" className="ep-sluit" onClick={() => setZichtbaar(false)} aria-label="Sluiten"><X size={18} /></button>
            <div className="ep-beeld" role="img" aria-label="Een woning met een nieuw gecoat dak">
              <span className="ep-tag na">Na coating</span>
            </div>
            <div className="ep-tekst">
              <p className="ep-oog">Nog even dit</p>
              <h2 id="ep-titel">Benieuwd hoe jouw dak eruitziet <span>in een nieuwe kleur?</span></h2>
              <p className="ep-uitleg">Upload een foto van je woning en kies een kleur. Je ziet meteen het resultaat, gratis.</p>
              <button type="button" className="ep-knop" onClick={() => { setZichtbaar(false); setToolOpen(true); }}>
                <Palette size={18} />Probeer het op mijn dak
              </button>
              <button type="button" className="ep-nee" onClick={() => setZichtbaar(false)}>Nee, bedankt</button>
            </div>
          </div>
        </div>
      )}
      <DakkleurVenster open={toolOpen} onClose={() => setToolOpen(false)} />
    </>
  );
}
