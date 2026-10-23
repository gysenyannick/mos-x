"use client";

import { useState } from "react";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import kz from "./kz.module.css";

const TYPES = ["Stormschade", "Lek of vocht binnen", "Verschoven of gebroken pannen", "Losse nok of rand", "Dakgoot", "Iets anders"];

/** Stormschade of een probleem melden, met foto's. */
export default function StormForm({ klantId, telefoon, spoedTel, spoedToon }: { klantId: string; telefoon: string; spoedTel: string; spoedToon: string }) {
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBezig(true);
    setFout(null);
    const fd = new FormData(e.currentTarget);
    fd.append("klantId", klantId);
    try {
      const r = await fetch("/api/klantenzone/storm", { method: "POST", body: fd });
      const j = await r.json().catch(() => ({ ok: false }));
      if (j.ok) setKlaar(true);
      else setFout(j.fout ?? "Versturen mislukt. Bel bij spoed.");
    } catch {
      setFout("Geen verbinding. Bel bij spoed.");
    } finally {
      setBezig(false);
    }
  }

  if (klaar) {
    return (
      <div className={kz.stormKlaar}>
        <CheckCircle2 size={28} />
        <div>
          <p className={kz.rijTitel}>Je melding is verstuurd</p>
          <p className={kz.sub} style={{ marginTop: 4 }}>Yannick neemt zo snel mogelijk contact met je op. Dit is een aanvraag, geen garantie op een onmiddellijke tussenkomst. Bij spoed: bel {spoedToon}.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={verstuur}>
      <div className={kz.stormVeilig}>
        <TriangleAlert size={20} />
        <p><strong>Eerst veilig.</strong> Hou afstand van losse delen, klim nooit zelf op het dak en bel bij acuut gevaar de brandweer (112).</p>
      </div>
      <div className={kz.velden}>
        <div className={kz.veld}>
          <label htmlFor="stype">Wat is er aan de hand?</label>
          <select id="stype" name="type" className={kz.invoer} required defaultValue="">
            <option value="" disabled>Kies…</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className={kz.veld}>
          <label htmlFor="stel">Terugbelnummer</label>
          <input id="stel" name="telefoon" className={kz.invoer} defaultValue={telefoon} inputMode="tel" />
        </div>
        <div className={`${kz.veld} ${kz.vol}`}>
          <label htmlFor="stekst">Wat zie je?</label>
          <textarea id="stekst" name="tekst" className={kz.invoer} required rows={3} placeholder="bv. Na de storm liggen er twee pannen in de tuin, aan de achterkant." />
        </div>
        <div className={`${kz.veld} ${kz.vol}`}>
          <label htmlFor="sfotos">Foto&apos;s (optioneel, max. 5)</label>
          <input id="sfotos" name="fotos" type="file" accept="image/*" multiple className={kz.invoer} />
        </div>
      </div>
      {fout && <p className={kz.fout}>{fout}</p>}
      <div className={kz.rijKnoppen}>
        <button className={`${kz.knop} ${kz.knopPrimair}`} disabled={bezig}>{bezig ? "Versturen…" : "Melding versturen"}</button>
        <a className={`${kz.knop} ${kz.knopLicht}`} href={`tel:${spoedTel}`}>Spoed? Bel {spoedToon}</a>
      </div>
    </form>
  );
}
