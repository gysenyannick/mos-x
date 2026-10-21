import { CalendarClock, Trash2 } from "lucide-react";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { getMomenten } from "@/lib/klantenzone/store";
import { brusselNaarDate, fmtDag, fmtUur, nuMs } from "@/lib/klantenzone/tijd";
import { VERZET_UREN } from "@/lib/klantenzone/types";
import { BevestigKnop } from "@/components/klantenzone/beheer-client";
import { verwijderMoment, voegMomentToe } from "../actions";
import kz from "@/components/klantenzone/kz.module.css";

export default async function Momenten() {
  if (!(await isBeheerder())) return null;
  const nu = nuMs();
  const momenten = (await getMomenten()).filter((m) => brusselNaarDate(m.start).getTime() > nu);
  const perDag = momenten.reduce<Record<string, typeof momenten>>((acc, m) => {
    (acc[m.start.slice(0, 10)] ??= []).push(m);
    return acc;
  }, {});

  return (
    <>
      <section className={kz.kaart} style={{ marginTop: 20 }}>
        <h1 className={kz.kaartTitel} style={{ marginBottom: 6 }}><CalendarClock size={18} /> Vrije momenten</h1>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 16 }}>
          Klanten kunnen een afspraak tot {VERZET_UREN} uur vooraf zelf verzetten naar één van deze momenten.
          Kiest iemand een moment, dan is het bezet en komt zijn oude moment hier vrij. Je krijgt dan een mail.
        </p>
        <form action={voegMomentToe}>
          <div className={kz.velden}>
            <div className={kz.veld}><label htmlFor="datum">Dag</label><input id="datum" name="datum" type="date" className={kz.invoer} required /></div>
            <div className={kz.veld}>
              <label htmlFor="uren">Uren (gescheiden door een spatie)</label>
              <input id="uren" name="uren" className={kz.invoer} defaultValue="09:00 11:00 14:00 16:00" required />
            </div>
          </div>
          <div className={kz.rijKnoppen}><button className={kz.knop}>Momenten toevoegen</button></div>
        </form>
      </section>

      <section className={kz.kaart}>
        {momenten.length === 0 ? (
          <p className={kz.leeg}>Nog geen vrije momenten. Zonder vrije momenten zien klanten de knop &quot;Verzetten&quot; niet.</p>
        ) : (
          Object.entries(perDag).map(([dag, lijst]) => (
            <div key={dag} style={{ marginBottom: 14 }}>
              <p className={kz.dagKop} style={{ marginTop: 0 }}>{fmtDag(dag, true)}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {lijst.map((m) => (
                  <span key={m.id} className={kz.badge} style={{ fontSize: 14, padding: "4px 4px 4px 12px", gap: 8 }}>
                    {fmtUur(m.start)}
                    <BevestigKnop actie={verwijderMoment.bind(null, m.id)} vraag="Dit moment verwijderen?"><Trash2 size={12} /></BevestigKnop>
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
