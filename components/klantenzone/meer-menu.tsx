"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronRight, Lightbulb, MoreHorizontal, NotebookPen, Sparkles, TriangleAlert, X } from "lucide-react";
import kz from "./kz.module.css";

const ITEMS = [
  { id: "aandachtspunten", label: "Aandachtspunten", uitleg: "Wat ik zag op je dak", icoon: TriangleAlert },
  { id: "advies", label: "Advies", uitleg: "Onderhoud, garantie en Dakzorg", icoon: Lightbulb },
  { id: "extras", label: "Extra's", uitleg: "Goten, gevel, oprit en meer", icoon: Sparkles },
  { id: "logboek", label: "Logboek", uitleg: "Alles wat er gebeurde", icoon: NotebookPen },
] as const;

/** "Meer" in de onderbalk op gsm: opent een paneel met de overige onderdelen. */
export default function MeerMenu({ actief, tellers }: { actief: string; tellers: Partial<Record<string, number>> }) {
  const [open, setOpen] = useState(false);
  const isActief = ITEMS.some((i) => i.id === actief);
  const totaal = ITEMS.reduce((s, i) => s + (tellers[i.id] ?? 0), 0);

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
              {ITEMS.map((i) => (
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
