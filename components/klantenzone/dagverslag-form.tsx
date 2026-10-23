"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { voegNotitieToe } from "@/app/beheer/actions";
import kz from "./kz.module.css";

/** Beheer: een notitie voor een bepaalde dag, met foto's erbij, in één keer. */
export default function DagverslagForm({ klantId, vandaag }: { klantId: string; vandaag: string }) {
  const router = useRouter();
  const vorm = useRef<HTMLFormElement>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBezig(true);
    setFout(null);
    setOk(false);
    const fd = new FormData(e.currentTarget);
    const datum = String(fd.get("datum") || vandaag);
    const fase = String(fd.get("fase") || "tijdens");
    const fotos = (fd.getAll("fotos") as File[]).filter((f) => f.size > 0);
    try {
      if (String(fd.get("tekst") ?? "").trim()) await voegNotitieToe(klantId, fd);
      for (const f of fotos) {
        const u = new FormData();
        u.append("klantId", klantId); u.append("soort", "foto"); u.append("fase", fase); u.append("datum", datum); u.append("bestand", f);
        const r = await fetch("/api/klantenzone/upload", { method: "POST", body: u });
        if (!r.ok) throw new Error((await r.json().catch(() => ({}))).fout ?? "Foto opladen mislukt.");
      }
      vorm.current?.reset();
      setOk(true);
      router.refresh();
    } catch (err) {
      setFout(err instanceof Error ? err.message : "Opslaan mislukt.");
    } finally {
      setBezig(false);
    }
  }

  return (
    <form ref={vorm} onSubmit={verstuur}>
      <div className={kz.velden}>
        <div className={kz.veld}><label htmlFor="ndatum">Dag</label><input id="ndatum" name="datum" type="date" defaultValue={vandaag} className={kz.invoer} required /></div>
        <div className={kz.veld}><label htmlFor="ntitel">Titel (optioneel)</label><input id="ntitel" name="titel" className={kz.invoer} placeholder="bv. Twee gebroken pannen vervangen" /></div>
        <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="ntekst">Notitie voor de klant</label><textarea id="ntekst" name="tekst" className={kz.invoer} rows={3} placeholder="bv. Het hele dak is gereinigd. Aan de noordkant lagen twee pannen gebarsten, die zijn vervangen." /></div>
        <div className={kz.veld}><label htmlFor="nfotos">Foto&apos;s van die dag (optioneel)</label><input id="nfotos" name="fotos" type="file" accept="image/*" multiple className={kz.invoer} /></div>
        <div className={kz.veld}>
          <label htmlFor="nfase">Soort foto&apos;s</label>
          <select id="nfase" name="fase" className={kz.invoer} defaultValue="tijdens">
            <option value="inspectie">Inspectie</option><option value="voor">Voor</option><option value="tijdens">Tijdens</option><option value="na">Na</option>
          </select>
        </div>
      </div>
      {fout && <p className={kz.fout}>{fout}</p>}
      {ok && <p className={kz.ok}>Toegevoegd. De klant ziet het bij Mijn werken, op die dag.</p>}
      <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopPrimair}`} disabled={bezig}>{bezig ? "Bezig…" : "Toevoegen"}</button></div>
    </form>
  );
}
