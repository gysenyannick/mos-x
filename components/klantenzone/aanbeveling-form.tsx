"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { voegAanbevelingToe } from "@/app/beheer/actions";
import kz from "./kz.module.css";

type BestaandeFoto = { id: string; url: string; label: string };

/** Beheer: een vaststelling met uitleg en foto's, bv. takjes onder de zonnepanelen. */
export default function AanbevelingForm({ klantId, fotos }: { klantId: string; fotos: BestaandeFoto[] }) {
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
    const nieuw = (fd.getAll("nieuweFotos") as File[]).filter((f) => f.size > 0);
    fd.delete("nieuweFotos");
    try {
      const abId = await voegAanbevelingToe(klantId, fd);
      if (!abId) throw new Error("Vul in wat je zag.");
      for (const f of nieuw.slice(0, 6)) {
        const u = new FormData();
        u.append("klantId", klantId); u.append("soort", "aanbevelingfoto"); u.append("aanbevelingId", abId); u.append("bestand", f);
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
        <div className={kz.veld}><label htmlFor="atitel">Wat zag je</label><input id="atitel" name="titel" required className={kz.invoer} placeholder="bv. Takjes onder de zonnepanelen" /></div>
        <div className={kz.veld}>
          <label htmlFor="aprio">Hoe dringend</label>
          <select id="aprio" name="prioriteit" defaultValue="aanbevolen" className={kz.invoer}>
            <option value="info">Ter info</option><option value="aanbevolen">Aanbevolen</option><option value="dringend">Dringend</option>
          </select>
        </div>
        <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="atekst">Uitleg en voorstel</label><textarea id="atekst" name="tekst" className={kz.invoer} placeholder="bv. Onder de zonnepanelen liggen takjes: vogels nestelen er. Een bescherming rond de panelen houdt ze weg." /></div>
        <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="afotos">Foto&apos;s opladen (max. 6)</label><input id="afotos" name="nieuweFotos" type="file" accept="image/*" multiple className={kz.invoer} /></div>
        {fotos.length > 0 && (
          <fieldset className={`${kz.veld} ${kz.vol} ${kz.abFotoKeuze}`}>
            <legend>Of kies uit de werffoto&apos;s</legend>
            <div>
              {fotos.map((f) => (
                <label key={f.id} title={f.label}>
                  <input type="checkbox" name="fotoUrl" value={f.url} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={f.label} />
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>
      {fout && <p className={kz.fout}>{fout}</p>}
      {ok && <p className={kz.ok}>Toegevoegd. De klant ziet het in zijn dakdossier, bij Aandachtspunten.</p>}
      <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopKlein}`} disabled={bezig}>{bezig ? "Bezig…" : "Aanbeveling toevoegen"}</button></div>
    </form>
  );
}
