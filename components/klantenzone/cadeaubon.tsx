"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import kz from "./kz.module.css";

type Props = {
  naam: string;
  code: string;
  /** Jaar waarin de klant klant werd */
  lidSinds: string;
  /** Aantal bonnen die nog te gebruiken zijn */
  bonnen: number;
};

/** De ledenkaart van de MOS-X Kring: kantelt mee met je muis of vinger. */
export default function Cadeaubon({ naam, code, lidSinds, bonnen }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [gekopieerd, setGekopieerd] = useState(false);

  function beweeg(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  }
  function terug() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <div className={kz.bonZone} onPointerMove={beweeg} onPointerLeave={terug}>
      <div ref={ref} className={kz.bon}>
        <div className={kz.bonGlans} aria-hidden="true" />
        <div className={kz.bonBoven}>
          <span className={kz.bonMerk}>MOS-X</span>
          <span className={kz.bonSoort}>Kring</span>
        </div>
        <div className={kz.bonMidden}>
          <p className={kz.bonLabel}>Lid sinds {lidSinds}</p>
          <p className={kz.bonNaam}>{naam}</p>
          <p className={kz.bonSub}>{bonnen === 0 ? "Exclusief voor klanten van MOS-X" : `${bonnen} ${bonnen === 1 ? "bon" : "bonnen"} te gebruiken`}</p>
        </div>
        <div className={kz.bonOnder}>
          <span className={kz.bonCodeLabel}>Ledencode</span>
          <button
            type="button" className={kz.bonCode}
            onClick={async () => { try { await navigator.clipboard.writeText(code); setGekopieerd(true); setTimeout(() => setGekopieerd(false), 1600); } catch { /* geen klembord */ } }}
            aria-label={`Code ${code} kopiëren`}
          >
            {code} {gekopieerd ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
