"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import kz from "./kz.module.css";

type Staat = { ok?: boolean; fout?: string };

export default function BuurFormulier({ actie }: { actie: (s: Staat, fd: FormData) => Promise<Staat> }) {
  const [staat, verstuur, bezig] = useActionState(actie, {});

  if (staat.ok) {
    return (
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <CheckCircle2 size={40} color="#7AB54E" />
        <p className={kz.groot} style={{ marginTop: 10 }}>Bedankt!</p>
        <p className={kz.sub}>We nemen binnen 1 werkdag contact met je op voor een richtprijs. Liever meteen? Bel of WhatsApp naar +32 468 35 28 69.</p>
      </div>
    );
  }

  return (
    <form action={verstuur}>
      <div className={kz.velden}>
        <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="naam">Naam *</label><input id="naam" name="naam" className={kz.invoer} required autoComplete="name" /></div>
        <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="telefoon">Gsm *</label><input id="telefoon" name="telefoon" className={kz.invoer} required inputMode="tel" autoComplete="tel" /></div>
        <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="adres">Adres</label><input id="adres" name="adres" className={kz.invoer} autoComplete="street-address" placeholder="Straat, nummer en gemeente" /></div>
        <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="bericht">Wat wil je laten doen? (optioneel)</label><textarea id="bericht" name="bericht" className={kz.invoer} placeholder="bv. Mijn dak is groen van het mos." /></div>
        {/* Valstrik voor bots: mensen zien dit veld niet */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
      </div>
      {staat.fout && <p className={kz.fout}>{staat.fout}</p>}
      <div className={kz.rijKnoppen}>
        <button className={kz.knop} disabled={bezig} style={{ flex: 1, padding: "14px 18px", fontSize: 15 }}>{bezig ? "Even geduld…" : "Vraag mijn richtprijs aan"}</button>
      </div>
      <p className={kz.sub} style={{ fontSize: 12 }}>Vrijblijvend. We gebruiken je gegevens alleen om je te contacteren over je dak.</p>
    </form>
  );
}
