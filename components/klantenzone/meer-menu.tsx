"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Camera, ChevronRight, FileText, Gift, Home, Lightbulb, MessagesSquare, MoreHorizontal, X } from "lucide-react";
import kz from "./kz.module.css";

const ITEMS = [
  { id: "berichten", label: "Berichten", uitleg: "Rechtstreeks met Yannick", icoon: MessagesSquare },
  { id: "fotos", label: "Foto's", uitleg: "Het verslag per werkdag", icoon: Camera },
  { id: "documenten", label: "Documenten", uitleg: "Offertes, facturen en garanties", icoon: FileText },
  { id: "dak", label: "Mijn dak", uitleg: "Dakdossier, onderhoud en garantie", icoon: Home },
  { id: "tips", label: "Tips en advies", uitleg: "Zo blijft je woning mooi", icoon: Lightbulb },
  { id: "buren", label: "Buurvoordeel", uitleg: "Je cadeaubon", icoon: Gift },
] as const;

/** "Meer" in de onderbalk op gsm: opent een paneel met de overige onderdelen. */
export default function MeerMenu({ actief, tellers, zichtbaar }: { actief: string; tellers: Partial<Record<string, number>>; zichtbaar: string[] }) {
  const [open, setOpen] = useState(false);
  const items = ITEMS.filter((i) => zichtbaar.includes(i.id));
  const isActief = items.some((i) => i.id === actief);
  const totaal = items.reduce((s, i) => s + (tellers[i.id] ?? 0), 0);

  useEffect(() => {
    if (!open) return;
    const toets = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", toets);
    return () => window.removeEventListener("keydown", toets);
  }, [open]);

  return (
    <>
      <button type="button" className={`${kz.onderItem} ${isActief ? kz.onderItemAan : ""}`} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <MoreHorizontal size={21} />
        Meer
        {totaal > 0 && <span className={kz.onderStip} aria-label="Nieuw" />}
      </button>
      {open && createPortal(
        <div className={`${kz.page} ${kz.portaal}`} onClick={() => setOpen(false)}>
        <div className={kz.modaalAchter}>
          <div className={kz.modaal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Meer">
            <div className={kz.kaartKop}>
              <h3 className={kz.kaartTitel}>Meer</h3>
              <button type="button" className={kz.icoonKnop} onClick={() => setOpen(false)} aria-label="Sluiten"><X size={18} /></button>
            </div>
            <ul className={kz.meerLijst}>
              {items.map((i) => (
                <li key={i.id}>
                  <Link href={`?tab=${i.id}`} className={kz.meerItem} onClick={() => setOpen(false)} aria-current={actief === i.id ? "page" : undefined}>
                    <span className={kz.planningIcoon}><i.icoon size={18} /></span>
                    <span className={kz.rijMidden}>
                      <span className={kz.planningTitel}>{i.label}</span>
                      <span className={kz.planningDatum}>{i.uitleg}</span>
                    </span>
                    {(tellers[i.id] ?? 0) > 0 && <span className={`${kz.navTeller} ${kz.navTellerAmber}`}>{tellers[i.id]}</span>}
                    <ChevronRight size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>,
        document.body,
      )}
    </>
  );
}
