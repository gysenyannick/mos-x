"use client";

import { useState, useTransition } from "react";
import { CalendarClock, CheckCircle2, X } from "lucide-react";
import { doeAanvraag } from "@/app/klant/actions";
import kz from "./kz.module.css";

/** De klant stelt een andere datum voor. Yannick beslist en past de afspraak zelf aan. */
export default function VoorstelKnop({ klantId, titel, huidig, vandaag }: { klantId: string; titel: string; huidig: string; vandaag: string }) {
  const [open, setOpen] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [bezig, start] = useTransition();

  function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const datum = String(fd.get("datum") ?? "");
    const dagdeel = String(fd.get("dagdeel") ?? "");
    const extra = String(fd.get("opmerking") ?? "").trim();
    if (!datum) { setFout("Kies een datum."); return; }
    const leesbaar = new Intl.DateTimeFormat("nl-BE", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${datum}T12:00:00Z`));
    setFout(null);
    start(async () => {
      const r = await doeAanvraag(klantId, "verzetten", `${titel} (nu ${huidig}) → voorstel: ${leesbaar}${dagdeel ? `, ${dagdeel}` : ""}${extra ? `. ${extra}` : ""}`);
      if (r.ok) setKlaar(true); else setFout(r.fout ?? "Dat lukte niet.");
    });
  }

  return (
    <>
      <button type="button" className={kz.voorstelKnop} onClick={() => { setOpen(true); setKlaar(false); }}>
        <CalendarClock size={15} /> Andere datum voorstellen
      </button>
      {open && (
        <div className={kz.modaalAchter} onClick={() => setOpen(false)}>
          <div className={kz.modaal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Andere datum voorstellen">
            <div className={kz.kaartKop}>
              <h3 className={kz.kaartTitel}>{klaar ? "Voorstel verstuurd" : "Andere datum voorstellen"}</h3>
              <button type="button" className={kz.icoonKnop} onClick={() => setOpen(false)} aria-label="Sluiten"><X size={18} /></button>
            </div>
            {klaar ? (
              <div className={kz.stormKlaar}>
                <CheckCircle2 size={24} />
                <p className={kz.sub} style={{ margin: 0 }}>We bekijken je voorstel en laten je weten of het past. Tot dan blijft de huidige afspraak staan.</p>
              </div>
            ) : (
              <form onSubmit={verstuur}>
                <p className={kz.sub} style={{ marginTop: 0 }}><strong>{titel}</strong>, nu op {huidig}.</p>
                <div className={kz.velden}>
                  <div className={kz.veld}><label htmlFor="vdatum">Welke dag past beter?</label><input id="vdatum" name="datum" type="date" min={vandaag} className={kz.invoer} required /></div>
                  <div className={kz.veld}>
                    <label htmlFor="vdeel">Liefst</label>
                    <select id="vdeel" name="dagdeel" className={kz.invoer} defaultValue="">
                      <option value="">Maakt niet uit</option><option value="voormiddag">Voormiddag</option><option value="namiddag">Namiddag</option>
                    </select>
                  </div>
                  <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="vopm">Opmerking (optioneel)</label><input id="vopm" name="opmerking" className={kz.invoer} placeholder="bv. Ik ben die week op reis." /></div>
                </div>
                {fout && <p className={kz.fout}>{fout}</p>}
                <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopPrimair}`} disabled={bezig} style={{ flex: 1 }}>{bezig ? "Versturen…" : "Voorstel versturen"}</button></div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
