"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, X } from "lucide-react";
import { doeAanvraag } from "@/app/klant/actions";
import type { AanvraagSoort } from "@/lib/klantenzone/types";
import kz from "./kz.module.css";

type Props = {
  klantId: string;
  soort: AanvraagSoort;
  label: React.ReactNode;
  /** Titel bovenaan het venster */
  titel: string;
  uitleg?: string;
  placeholder?: string;
  aanbevelingId?: string;
  licht?: boolean;
  klein?: boolean;
  /** Al aangevraagd en nog niet behandeld */
  alGevraagd?: boolean;
  /** Wordt vóór de opmerking gezet, bv. de naam van een extra dienst */
  voorvoegsel?: string;
  /** Tekst van de knop als het al gevraagd is */
  alGevraagdTekst?: string;
};

/** Knop → klein venster met optionele opmerking → aanvraag komt bij Yannick binnen. */
export default function AanvraagKnop({
  klantId, soort, label, titel, uitleg, placeholder, aanbevelingId, licht, klein, alGevraagd, voorvoegsel, alGevraagdTekst,
}: Props) {
  const [open, setOpen] = useState(false);
  const [tekst, setTekst] = useState("");
  const [klaar, setKlaar] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [bezig, start] = useTransition();

  if (alGevraagd && !open) {
    return (
      <span className={`${kz.badge} ${kz.badgeGroen}`} style={{ padding: "8px 12px", fontSize: 13 }}>
        <CheckCircle2 size={14} /> {alGevraagdTekst ?? "Aangevraagd, Yannick neemt contact op"}
      </span>
    );
  }

  function verstuur() {
    setFout(null);
    start(async () => {
      const r = await doeAanvraag(klantId, soort, voorvoegsel ? `${voorvoegsel}${tekst.trim() ? `: ${tekst.trim()}` : ""}` : tekst, aanbevelingId);
      if (r.ok) setKlaar(true);
      else setFout(r.fout ?? "Dat lukte niet.");
    });
  }

  return (
    <>
      <button type="button" className={`${kz.knop} ${licht ? kz.knopLicht : ""} ${klein ? kz.knopKlein : ""}`} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open && (
        <div className={kz.modaalAchter} onClick={() => setOpen(false)}>
          <div className={kz.modaal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={titel}>
            <div className={kz.kaartKop}>
              <h3 className={kz.kaartTitel}>{klaar ? "Verstuurd!" : titel}</h3>
              <button type="button" className={kz.icoonKnop} onClick={() => setOpen(false)} aria-label="Sluiten"><X size={18} /></button>
            </div>
            {klaar ? (
              <>
                <p className={kz.sub} style={{ marginTop: 0 }}>Bedankt! Yannick heeft je vraag gekregen en neemt snel contact met je op, meestal binnen 1 werkdag.</p>
                <div className={kz.rijKnoppen}><button type="button" className={kz.knop} onClick={() => { setOpen(false); }}>Sluiten</button></div>
              </>
            ) : (
              <>
                {uitleg && <p className={kz.sub} style={{ marginTop: 0 }}>{uitleg}</p>}
                <div className={kz.veld} style={{ marginTop: 12 }}>
                  <label htmlFor={`aanvraag-${soort}`}>Opmerking (optioneel)</label>
                  <textarea id={`aanvraag-${soort}`} className={kz.invoer} value={tekst} onChange={(e) => setTekst(e.target.value)} placeholder={placeholder} />
                </div>
                {fout && <p className={kz.fout}>{fout}</p>}
                <div className={kz.rijKnoppen}>
                  <button type="button" className={kz.knop} onClick={verstuur} disabled={bezig} style={{ flex: 1 }}>{bezig ? "Even geduld…" : "Verstuur naar Yannick"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
