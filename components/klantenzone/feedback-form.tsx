"use client";

import { useState, useTransition } from "react";
import { reviewFeedback } from "@/app/klant/actions";
import kz from "./kz.module.css";

/** Rechtstreekse feedback aan MOS-X, naast (niet in plaats van) een publieke review. */
export default function FeedbackForm({ klantId }: { klantId: string }) {
  const [open, setOpen] = useState(false);
  const [tekst, setTekst] = useState("");
  const [klaar, setKlaar] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [bezig, start] = useTransition();

  if (klaar) return <p className={kz.ok} style={{ margin: 0 }}>Bedankt, Yannick leest je feedback persoonlijk.</p>;
  if (!open) return <button type="button" className={`${kz.knop} ${kz.knopLicht}`} onClick={() => setOpen(true)}>Feedback aan Yannick</button>;

  return (
    <div style={{ width: "100%" }}>
      <label htmlFor="feedback" className={kz.label}>Wat kan beter, of wat vond je goed?</label>
      <textarea id="feedback" className={kz.invoer} rows={3} value={tekst} onChange={(e) => setTekst(e.target.value)} />
      {fout && <p className={kz.fout}>{fout}</p>}
      <div className={kz.rijKnoppen}>
        <button type="button" className={`${kz.knop} ${kz.knopKlein}`} disabled={bezig || tekst.trim().length < 2}
          onClick={() => start(async () => { const r = await reviewFeedback(klantId, tekst); if (r.ok) setKlaar(true); else setFout(r.fout ?? "Dat lukte niet."); })}>
          {bezig ? "Versturen…" : "Versturen"}
        </button>
      </div>
    </div>
  );
}
