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
      <label htmlFor="opmerking" className={kz.label}>Nieuw bericht</label>
      <textarea
        id="opmerking" className={kz.invoer} value={tekst} onChange={(e) => setTekst(e.target.value)}
        placeholder="bv. Moet ik de auto morgen van de oprit zetten?" rows={3}
      />
      <div className={kz.opmerkingVoet}>
        <span className={kz.rijSub}>{klaar ? "Verstuurd. Yannick antwoordt zo snel mogelijk." : "Liever bellen? +32 468 35 28 69"}</span>
        <button className={`${kz.knop} ${kz.knopPrimair} ${kz.knopKlein}`} disabled={bezig || tekst.trim().length < 2}>
          <Send size={14} /> {bezig ? "Versturen…" : "Versturen"}
        </button>
      </div>
      {fout && <p className={kz.fout}>{fout}</p>}
    </form>
  );
}
