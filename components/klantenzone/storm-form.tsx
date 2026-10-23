"use client";

import { useState } from "react";
import { CheckCircle2, Siren, X } from "lucide-react";
import kz from "./kz.module.css";

/** Eén knop: stormschade of een probleem melden, met een foto en een korte zin. */
export default function StormForm({ klantId, spoedTel, spoedToon }: { klantId: string; telefoon?: string; spoedTel: string; spoedToon: string }) {
  const [open, setOpen] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBezig(true);
    setFout(null);
    const fd = new FormData(e.currentTarget);
    fd.append("klantId", klantId);
    fd.append("type", "Stormschade of probleem");
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

  return (
    <>
      <button type="button" className={`${kz.knop} ${kz.knopMelden}`} onClick={() => { setOpen(true); setKlaar(false); }}>
        <Siren size={17} /> Stormschade of probleem melden
      </button>
      {open && (
        <div className={kz.modaalAchter} onClick={() => setOpen(false)}>
          <div className={kz.modaal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Probleem melden">
            <div className={kz.kaartKop}>
              <h3 className={kz.kaartTitel}>{klaar ? "Verstuurd" : "Probleem melden"}</h3>
              <button type="button" className={kz.icoonKnop} onClick={() => setOpen(false)} aria-label="Sluiten"><X size={18} /></button>
            </div>
            {klaar ? (
              <div className={kz.stormKlaar}>
                <CheckCircle2 size={24} />
                <p className={kz.sub} style={{ margin: 0 }}>Yannick neemt zo snel mogelijk contact op. Spoed? Bel {spoedToon}.</p>
              </div>
            ) : (
              <form onSubmit={verstuur}>
                <div className={kz.veld}>
                  <label htmlFor="stekst">Wat is er?</label>
                  <textarea id="stekst" name="tekst" className={kz.invoer} required rows={3} />
                </div>
                <div className={kz.veld} style={{ marginTop: 10 }}>
                  <label htmlFor="sfotos">Foto (optioneel)</label>
                  <input id="sfotos" name="fotos" type="file" accept="image/*" multiple className={kz.invoer} />
                </div>
                <p className={kz.rijSub} style={{ marginTop: 10 }}>Klim niet zelf op het dak. Bij gevaar: bel 112.</p>
                {fout && <p className={kz.fout}>{fout}</p>}
                <div className={kz.rijKnoppen}>
                  <button className={`${kz.knop} ${kz.knopPrimair}`} disabled={bezig} style={{ flex: 1 }}>{bezig ? "Versturen…" : "Versturen"}</button>
                  <a className={`${kz.knop} ${kz.knopLicht}`} href={`tel:${spoedTel}`}>Bel</a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
