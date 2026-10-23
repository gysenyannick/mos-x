"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import { reviewWeg } from "@/app/klant/actions";
import kz from "./kz.module.css";

const SLEUTEL = "kzReviewDicht";

/** Een tekstballon van Yannick rechtsonder, op elke pagina. Dichtgeklapt blijft enkel zijn foto staan. */
export default function ReviewBallon({ klantId, voornaam, foto, punten, euro }: { klantId: string; voornaam: string; foto: string; punten: number; euro: number }) {
  const [open, setOpen] = useState(false);
  const [zichtbaar, setZichtbaar] = useState(false);
  const [weg, setWeg] = useState(false);

  useEffect(() => {
    let dicht = false;
    try { dicht = sessionStorage.getItem(SLEUTEL) === "1"; } catch { /* geen opslag */ }
    const t = setTimeout(() => { setZichtbaar(true); setOpen(!dicht); }, 1200);
    return () => clearTimeout(t);
  }, []);

  const sluit = () => {
    setOpen(false);
    try { sessionStorage.setItem(SLEUTEL, "1"); } catch { /* geen opslag */ }
  };

  if (weg || !zichtbaar) return null;

  return (
    <div className={kz.ballonPlek}>
      {open && (
        <div className={kz.ballon} role="dialog" aria-label="Review voor MOS-X">
          <button type="button" className={kz.ballonSluit} onClick={sluit} aria-label="Sluiten"><X size={16} /></button>
          <span className={kz.ballonSterren} aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={15} />)}</span>
          <p className={kz.ballonTitel}>Tevreden over je dak, {voornaam}?</p>
          <p className={kz.ballonTekst}>Een review op Google helpt Yannick enorm.{punten > 0 && <> Je krijgt er <strong>{punten} punten</strong> voor (€&nbsp;{euro}).</>}</p>
          <a className={`${kz.knop} ${kz.knopPrimair} ${kz.ballonKnop}`} href={`/api/klantenzone/review?k=${encodeURIComponent(klantId)}`} target="_blank" rel="noopener noreferrer" onClick={sluit}>
            <Star size={15} /> Schrijf een review
          </a>
          <button type="button" className={kz.ballonNooit} onClick={() => { setWeg(true); void reviewWeg(klantId); }}>Niet meer tonen</button>
        </div>
      )}
      <button type="button" className={kz.ballonFoto} onClick={() => (open ? sluit() : setOpen(true))} aria-label={open ? "Ballon sluiten" : "Review schrijven"} aria-expanded={open}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={foto} alt="" />
        {!open && <span className={kz.ballonBadge}><Star size={11} /></span>}
      </button>
    </div>
  );
}
