"use client";

import { useState, useTransition } from "react";
import { CalendarClock, X } from "lucide-react";
import { verzetAfspraak } from "@/app/klant/actions";
import type { VrijMoment } from "@/lib/klantenzone/types";
import kz from "./kz.module.css";

type Props = {
  klantId: string;
  afspraakId: string;
  titel: string;
  momenten: VrijMoment[];
  /** "maandag 12 oktober" per datum, op de server opgemaakt */
  dagLabels: Record<string, string>;
};

export default function VerzetKnop({ klantId, afspraakId, titel, momenten, dagLabels }: Props) {
  const [open, setOpen] = useState(false);
  const [keuze, setKeuze] = useState<string | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const [klaar, setKlaar] = useState(false);
  const [bezig, start] = useTransition();

  const perDag = momenten.reduce<Record<string, VrijMoment[]>>((acc, m) => {
    (acc[m.start.slice(0, 10)] ??= []).push(m);
    return acc;
  }, {});

  function bevestig() {
    if (!keuze) return;
    setFout(null);
    start(async () => {
      const r = await verzetAfspraak(klantId, afspraakId, keuze);
      if (r.ok) setKlaar(true);
      else setFout(r.fout ?? "Dat lukte niet.");
    });
  }

  function sluit() { setOpen(false); setKeuze(null); setFout(null); setKlaar(false); }

  return (
    <>
      <button type="button" className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`} onClick={() => setOpen(true)}>
        <CalendarClock size={15} /> Verzetten
      </button>

      {open && (
        <div className={kz.modaalAchter} onClick={sluit}>
          <div className={kz.modaal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Afspraak verzetten">
            <div className={kz.kaartKop}>
              <h3 className={kz.kaartTitel}>{klaar ? "Afspraak verzet" : "Kies een nieuw moment"}</h3>
              <button type="button" className={kz.icoonKnop} onClick={sluit} aria-label="Sluiten"><X size={18} /></button>
            </div>

            {klaar ? (
              <>
                <p className={kz.sub}>Gelukt! Je nieuwe moment staat op je pagina en wij kregen een seintje.</p>
                <div className={kz.rijKnoppen}><button type="button" className={kz.knop} onClick={sluit}>Sluiten</button></div>
              </>
            ) : (
              <>
                <p className={kz.sub} style={{ marginTop: 0 }}>{titel}</p>
                {Object.entries(perDag).map(([dag, lijst]) => (
                  <div key={dag}>
                    <p className={kz.dagKop}>{dagLabels[dag] ?? dag}</p>
                    <div className={kz.momentGrid}>
                      {lijst.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className={`${kz.moment} ${keuze === m.id ? kz.momentAan : ""}`}
                          onClick={() => setKeuze(m.id)}
                          aria-pressed={keuze === m.id}
                        >
                          {m.start.slice(11, 16).replace(":", "u")}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {fout && <p className={kz.fout}>{fout}</p>}
                <div className={kz.rijKnoppen}>
                  <button type="button" className={kz.knop} onClick={bevestig} disabled={!keuze || bezig} style={{ flex: 1 }}>
                    {bezig ? "Even geduld…" : "Bevestig nieuw moment"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
