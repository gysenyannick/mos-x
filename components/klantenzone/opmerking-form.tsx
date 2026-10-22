"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { plaatsOpmerking } from "@/app/klant/actions";
import kz from "./kz.module.css";

/** De klant laat een opmerking of vraag achter over zijn dak. */
export default function OpmerkingForm({ klantId }: { klantId: string }) {
  const [tekst, setTekst] = useState("");
  const [fout, setFout] = useState<string | null>(null);
  const [klaar, setKlaar] = useState(false);
  const [bezig, start] = useTransition();

  function verstuur(e: React.FormEvent) {
    e.preventDefault();
    setFout(null);
    start(async () => {
      const r = await plaatsOpmerking(klantId, tekst);
      if (r.ok) { setTekst(""); setKlaar(true); setTimeout(() => setKlaar(false), 4000); }
      else setFout(r.fout ?? "Dat lukte niet.");
    });
  }

  return (
    <form onSubmit={verstuur} className={kz.opmerkingForm}>
      <label htmlFor="opmerking" className={kz.label}>Iets gezien of een vraag over je dak?</label>
      <textarea
        id="opmerking" className={kz.invoer} value={tekst} onChange={(e) => setTekst(e.target.value)}
        placeholder="bv. Na de storm ligt er een pan scheef aan de achterkant." rows={3}
      />
      <div className={kz.opmerkingVoet}>
        <span className={kz.rijSub}>{klaar ? "Verstuurd! Ik laat snel iets weten." : "Ik krijg je opmerking meteen binnen."}</span>
        <button className={`${kz.knop} ${kz.knopPrimair} ${kz.knopKlein}`} disabled={bezig || tekst.trim().length < 2}>
          <Send size={14} /> {bezig ? "Versturen…" : "Versturen"}
        </button>
      </div>
      {fout && <p className={kz.fout}>{fout}</p>}
    </form>
  );
}
