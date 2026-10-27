"use client";

import { useEffect, useRef } from "react";
import { MOS_SVG } from "@/lib/mos-cursor";

const BEELD = `url("data:image/svg+xml,${encodeURIComponent(MOS_SVG)}") center / contain no-repeat`;

/**
 * Een mosbolletje dat de muis volgt en meerolt, enkel binnen het blok waarin het staat (de hero).
 * Alleen op pc; met "minder animaties" volgt het zonder vertraging of rollen.
 */
export default function MosVolger() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const zone = el?.parentElement;
    if (!el || !zone || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rustig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 0, y = 0, doelX = 0, doelY = 0, binnen = false, frame = 0;

    const beweeg = (e: MouseEvent) => {
      const r = zone.getBoundingClientRect();
      doelX = e.clientX - r.left;
      doelY = e.clientY - r.top;
      if (!binnen) { binnen = true; x = doelX; y = doelY; el.style.opacity = "1"; }
    };
    const weg = () => { binnen = false; el.style.opacity = "0"; };
    const tik = () => {
      const f = rustig ? 1 : 0.14;
      x += (doelX - x) * f;
      y += (doelY - y) * f;
      // Net rechtsonder de muispijl, en het rolt mee met de beweging.
      el.style.transform = `translate(${x + 18}px, ${y + 18}px)${rustig ? "" : ` rotate(${x * 1.4}deg)`}`;
      frame = requestAnimationFrame(tik);
    };

    zone.addEventListener("mousemove", beweeg);
    zone.addEventListener("mouseleave", weg);
    frame = requestAnimationFrame(tik);
    return () => {
      zone.removeEventListener("mousemove", beweeg);
      zone.removeEventListener("mouseleave", weg);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute", left: 0, top: 0, width: 26, height: 26, marginLeft: -13, marginTop: -13,
        zIndex: 30, pointerEvents: "none", opacity: 0, transition: "opacity .25s ease", willChange: "transform",
        background: BEELD, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))",
      }}
    />
  );
}
