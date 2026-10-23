"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import kz from "./kz.module.css";

/** Persoonlijke buurlink kopiëren of delen (WhatsApp of het deelmenu van de gsm). */
export default function DeelBuurlink({ url, voornaam, korting }: { url: string; voornaam: string; korting?: number }) {
  const [ok, setOk] = useState(false);
  const tekst = `Ik heb mijn dak laten doen door Yannick van MOS-X en ben er heel tevreden over. ${korting ? `Via deze link krijg je € ${korting} korting op je eerste werk: ` : "Via deze link vraag je een richtprijs aan: "}${url} (Ik spaar er zelf onderhoudstegoed mee als je klant wordt.)`;

  async function deel() {
    if (navigator.share) {
      try { await navigator.share({ title: "MOS-X", text: tekst }); return; } catch { /* geannuleerd */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(tekst)}`, "_blank", "noopener");
  }

  return (
    <>
      <div className={`${kz.linkVak} ${kz.buurLink}`}>
        <code>{url}</code>
        <button type="button" className={kz.icoonKnop} aria-label="Link kopiëren"
          onClick={async () => { await navigator.clipboard.writeText(url); setOk(true); setTimeout(() => setOk(false), 1600); }}>
          {ok ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <button type="button" className={`${kz.knop} ${kz.knopPrimair} ${kz.buurDeelKnop}`} onClick={deel}>
        <Share2 size={16} /> Deel met je buren
      </button>
      <p className={kz.buurPrivacy}>Je buur ziet alleen je voornaam ({voornaam}), niet je adres of je dossier.</p>
    </>
  );
}
