"use client";

import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import kz from "./kz.module.css";
import { MOS_CURSOR } from "@/lib/mos-cursor";

/** Voor/na-vergelijking: sleep de schuif om het verschil te zien. */
export default function VoorNa({ voor, na }: { voor: string; na: string }) {
  const [pos, setPos] = useState(50);
  const vak = useRef<HTMLDivElement>(null);

  function zet(clientX: number) {
    const r = vak.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }

  return (
    <div
      ref={vak}
      className={kz.voorNa}
      onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); zet(e.clientX); }}
      onPointerMove={(e) => { if (e.buttons) zet(e.clientX); }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={na} alt="Na de werken" draggable={false} />
      <div className={kz.voorNaVoor} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={voor} alt="Voor de werken" draggable={false} />
      </div>
      <span className={kz.voorNaLabel} style={{ left: 10 }}>Voor</span>
      <span className={kz.voorNaLabel} style={{ right: 10 }}>Na</span>
      <div className={kz.voorNaLijn} style={{ left: `${pos}%` }}>
        <span className={kz.voorNaGreep}><MoveHorizontal size={18} /></span>
      </div>
      <input
        type="range" min={0} max={100} value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Schuif tussen voor en na"
        className={kz.voorNaRange}
        style={{ cursor: MOS_CURSOR }}
      />
    </div>
  );
}
