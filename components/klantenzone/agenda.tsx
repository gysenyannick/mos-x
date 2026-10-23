"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import kz from "./kz.module.css";

export type AgendaItem = { dag: string; titel: string; uur?: string };

const MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const DAGNAAM = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

/** Klikbare maandkalender: blader tussen maanden en tik op een dag om te zien wat er gepland staat. */
export default function Agenda({ items, vandaag }: { items: AgendaItem[]; vandaag: string }) {
  const eerste = [...items].map((i) => i.dag).sort().find((d) => d >= vandaag) ?? vandaag;
  const [maand, setMaand] = useState({ jaar: Number(eerste.slice(0, 4)), m: Number(eerste.slice(5, 7)) - 1 });
  const [gekozen, setGekozen] = useState<string>(eerste);

  const perDag = useMemo(() => {
    const map = new Map<string, AgendaItem[]>();
    for (const i of items) map.set(i.dag, [...(map.get(i.dag) ?? []), i]);
    return map;
  }, [items]);

  const aantal = new Date(Date.UTC(maand.jaar, maand.m + 1, 0)).getUTCDate();
  const startDag = (new Date(Date.UTC(maand.jaar, maand.m, 1)).getUTCDay() + 6) % 7;
  const iso = (d: number) => `${maand.jaar}-${String(maand.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const cellen: (number | null)[] = [...Array(startDag).fill(null), ...Array.from({ length: aantal }, (_, i) => i + 1)];
  const verschuif = (n: number) => setMaand(({ jaar, m }) => { const t = m + n; return { jaar: jaar + Math.floor(t / 12), m: ((t % 12) + 12) % 12 }; });
  const datum = new Date(`${gekozen}T12:00:00Z`);
  const gekozenItems = perDag.get(gekozen) ?? [];

  return (
    <div className={kz.agenda}>
      <div className={kz.agendaKopRij}>
        <button type="button" className={kz.agendaPijl} onClick={() => verschuif(-1)} aria-label="Vorige maand"><ChevronLeft size={16} /></button>
        <p className={kz.agendaMaand}>{MAANDEN[maand.m].charAt(0).toUpperCase() + MAANDEN[maand.m].slice(1)} {maand.jaar}</p>
        <button type="button" className={kz.agendaPijl} onClick={() => verschuif(1)} aria-label="Volgende maand"><ChevronRight size={16} /></button>
      </div>
      <div className={kz.agendaRooster} role="grid">
        {["ma", "di", "wo", "do", "vr", "za", "zo"].map((d) => <span key={d} className={kz.agendaKop}>{d}</span>)}
        {cellen.map((d, i) => d === null ? <span key={`l${i}`} /> : (
          <button
            type="button" key={d} onClick={() => setGekozen(iso(d))} aria-pressed={gekozen === iso(d)}
            aria-label={`${d} ${MAANDEN[maand.m]}${perDag.has(iso(d)) ? ", gepland" : ""}`}
            className={`${kz.agendaDag} ${perDag.has(iso(d)) ? kz.agendaGepland : ""} ${iso(d) === vandaag ? kz.agendaVandaag : ""} ${iso(d) < vandaag ? kz.agendaVoorbij : ""} ${gekozen === iso(d) ? kz.agendaGekozen : ""}`}
          >{d}</button>
        ))}
      </div>
      <div className={kz.agendaDetail} aria-live="polite">
        <p className={kz.agendaDetailDag}>{DAGNAAM[datum.getUTCDay()]} {datum.getUTCDate()} {MAANDEN[datum.getUTCMonth()]}</p>
        {gekozenItems.length === 0 ? <p className={kz.agendaNiets}>Niets gepland.</p> : gekozenItems.map((i) => (
          <p key={i.titel} className={kz.agendaItem}><strong>{i.titel}</strong>{i.uur ? ` · ${i.uur}` : ""}</p>
        ))}
      </div>
    </div>
  );
}
