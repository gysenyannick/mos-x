"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import kz from "./kz.module.css";

export type AgendaItem = { dag: string; titel: string; uur?: string };

const MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

/** Een echte maandagenda: afspraken staan in de dagvakken, tik op een dag om naar de afspraak te gaan. */
export default function Agenda({ items, vandaag }: { items: AgendaItem[]; vandaag: string }) {
  const eerste = [...items].map((i) => i.dag).sort().find((d) => d >= vandaag) ?? vandaag;
  const [maand, setMaand] = useState({ jaar: Number(eerste.slice(0, 4)), m: Number(eerste.slice(5, 7)) - 1 });

  const perDag = useMemo(() => {
    const map = new Map<string, AgendaItem[]>();
    for (const i of items) map.set(i.dag, [...(map.get(i.dag) ?? []), i]);
    return map;
  }, [items]);

  const aantal = new Date(Date.UTC(maand.jaar, maand.m + 1, 0)).getUTCDate();
  const startDag = (new Date(Date.UTC(maand.jaar, maand.m, 1)).getUTCDay() + 6) % 7;
  const totaal = Math.ceil((startDag + aantal) / 7) * 7;
  const iso = (d: number) => `${maand.jaar}-${String(maand.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const verschuif = (n: number) => setMaand(({ jaar, m }) => { const t = m + n; return { jaar: jaar + Math.floor(t / 12), m: ((t % 12) + 12) % 12 }; });

  return (
    <div className={kz.ag}>
      <div className={kz.agKop}>
        <p className={kz.agMaand}>{MAANDEN[maand.m].charAt(0).toUpperCase() + MAANDEN[maand.m].slice(1)} <span>{maand.jaar}</span></p>
        <div className={kz.agPijlen}>
          <button type="button" onClick={() => verschuif(-1)} aria-label="Vorige maand"><ChevronLeft size={18} /></button>
          <button type="button" onClick={() => verschuif(1)} aria-label="Volgende maand"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className={kz.agRooster}>
        {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((d) => <span key={d} className={kz.agWeekdag}>{d}</span>)}
        {Array.from({ length: totaal }, (_, i) => {
          const d = i - startDag + 1;
          if (d < 1 || d > aantal) return <span key={`l${i}`} className={kz.agLeeg} />;
          const dag = iso(d);
          const lijst = perDag.get(dag) ?? [];
          const klasse = `${kz.agDag} ${lijst.length ? kz.agMet : ""} ${dag === vandaag ? kz.agVandaag : ""} ${dag < vandaag ? kz.agVoorbij : ""}`;
          const inhoud = (
            <>
              <span className={kz.agNr}>{d}</span>
              {lijst.slice(0, 2).map((x) => <span key={x.titel} className={kz.agItem}>{x.titel}</span>)}
              {lijst.length > 0 && <span className={kz.agStip} aria-hidden="true" />}
            </>
          );
          return lijst.length
            ? <a key={dag} href={`#plan-${dag}`} onClick={() => document.getElementById(`plan-${dag}`)?.querySelector("details")?.setAttribute("open", "")} className={klasse} aria-label={`${d} ${MAANDEN[maand.m]}: ${lijst.map((x) => x.titel).join(", ")}`}>{inhoud}</a>
            : <span key={dag} className={klasse}>{inhoud}</span>;
        })}
      </div>
    </div>
  );
}
