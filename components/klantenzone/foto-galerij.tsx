"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { FOTO_FASE_LABEL, type Foto, type FotoFase } from "@/lib/klantenzone/types";
import kz from "./kz.module.css";

type Props = {
  fotos: Foto[];
  /** Enkel in beheer: server action om een foto te verwijderen */
  onVerwijder?: (fotoId: string) => Promise<void>;
};

const VOLGORDE: FotoFase[] = ["voor", "tijdens", "na", "klant"];

export default function FotoGalerij({ fotos, onVerwijder }: Props) {
  const fases = VOLGORDE.filter((f) => fotos.some((x) => x.fase === f));
  const [filter, setFilter] = useState<FotoFase | "alle">("alle");
  const [open, setOpen] = useState<number | null>(null);
  const zichtbaar = filter === "alle" ? fotos : fotos.filter((f) => f.fase === filter);

  useEffect(() => {
    if (open === null) return;
    const toets = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % zichtbaar.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + zichtbaar.length) % zichtbaar.length));
    };
    window.addEventListener("keydown", toets);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", toets); document.body.style.overflow = ""; };
  }, [open, zichtbaar.length]);

  if (fotos.length === 0) return null;
  const huidig = open !== null ? zichtbaar[open] : null;

  return (
    <>
      {fases.length > 1 && (
        <div className={kz.tabs} role="tablist">
          {(["alle", ...fases] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`${kz.tab} ${filter === f ? kz.tabAan : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "alle" ? `Alle (${fotos.length})` : FOTO_FASE_LABEL[f]}
            </button>
          ))}
        </div>
      )}

      <div className={kz.fotoGrid}>
        {zichtbaar.map((f, i) => (
          <div key={f.id} style={{ position: "relative" }}>
            <button type="button" className={kz.fotoTegel} onClick={() => setOpen(i)} aria-label={f.bijschrift ?? "Foto openen"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt={f.bijschrift ?? ""} loading="lazy" />
              <span className={kz.fotoFase}>{FOTO_FASE_LABEL[f.fase]}</span>
            </button>
            {onVerwijder && (
              <button
                type="button"
                className={kz.icoonKnop}
                style={{ position: "absolute", top: 6, right: 6, width: 30, height: 30 }}
                aria-label="Foto verwijderen"
                onClick={async () => { if (confirm("Foto verwijderen?")) await onVerwijder(f.id); }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {huidig && (
        <div className={kz.lightbox} onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={huidig.url} alt={huidig.bijschrift ?? ""} onClick={(e) => e.stopPropagation()} />
          <button type="button" className={kz.lbSluit} onClick={() => setOpen(null)} aria-label="Sluiten"><X size={20} /></button>
          {zichtbaar.length > 1 && (
            <>
              <button type="button" className={kz.lbVorige} aria-label="Vorige"
                onClick={(e) => { e.stopPropagation(); setOpen((open! - 1 + zichtbaar.length) % zichtbaar.length); }}>
                <ChevronLeft size={22} />
              </button>
              <button type="button" className={kz.lbVolgende} aria-label="Volgende"
                onClick={(e) => { e.stopPropagation(); setOpen((open! + 1) % zichtbaar.length); }}>
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <div className={kz.lbOnder}>
            {FOTO_FASE_LABEL[huidig.fase]}
            {huidig.bijschrift ? ` · ${huidig.bijschrift}` : ""}
            {` · ${open! + 1}/${zichtbaar.length}`}
          </div>
        </div>
      )}
    </>
  );
}
