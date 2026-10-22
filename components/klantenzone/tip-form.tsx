"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import kz from "./kz.module.css";

/** Beheer: een tip of advies toevoegen voor alle klanten, met foto en/of document. */
export default function TipForm() {
  const router = useRouter();
  const vorm = useRef<HTMLFormElement>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBezig(true);
    setFout(null);
    try {
      const r = await fetch("/api/klantenzone/tip", { method: "POST", body: new FormData(e.currentTarget) });
      const j = await r.json().catch(() => ({ ok: false, fout: "Opslaan mislukt." }));
      if (!j.ok) setFout(j.fout ?? "Opslaan mislukt.");
      else { vorm.current?.reset(); router.refresh(); }
    } catch {
      setFout("Geen verbinding. Probeer opnieuw.");
    } finally {
      setBezig(false);
    }
  }

  return (
    <form ref={vorm} onSubmit={verstuur}>
      <div className={kz.velden}>
        <div className={kz.veld}><label htmlFor="ttitel">Titel</label><input id="ttitel" name="titel" required className={kz.invoer} placeholder="bv. Waarom je dak na de winter nakijken" /></div>
        <div className={kz.veld}><label htmlFor="tonderwerp">Onderwerp (optioneel)</label><input id="tonderwerp" name="onderwerp" className={kz.invoer} placeholder="bv. Advies" /></div>
        <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="ttekst">Tekst</label><textarea id="ttekst" name="tekst" required className={kz.invoer} rows={4} /></div>
        <div className={kz.veld}><label htmlFor="tfoto">Foto (optioneel)</label><input id="tfoto" name="foto" type="file" accept="image/*" className={kz.invoer} /></div>
        <div className={kz.veld}><label htmlFor="tbestand">Document, pdf (optioneel)</label><input id="tbestand" name="bestand" type="file" accept="application/pdf,image/*" className={kz.invoer} /></div>
        <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="tbnaam">Naam van de knop bij het document (optioneel)</label><input id="tbnaam" name="bestandNaam" className={kz.invoer} placeholder="bv. Lees de brochure" /></div>
      </div>
      {fout && <p className={kz.fout}>{fout}</p>}
      <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopPrimair}`} disabled={bezig}>{bezig ? "Bezig…" : "Tip toevoegen"}</button></div>
    </form>
  );
}
