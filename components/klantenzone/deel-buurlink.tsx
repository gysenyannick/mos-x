"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import kz from "./kz.module.css";

/** Persoonlijke buurlink kopiëren of delen (WhatsApp of het deelmenu van de gsm). */
export default function DeelBuurlink({ url, voornaam }: { url: string; voornaam: string }) {
  const [ok, setOk] = useState(false);
  const tekst = `Ik heb mijn dak laten doen door Yannick van MOS-X en ben er heel tevreden over. Via deze link vraag je een richtprijs aan: ${url}`;

  async function deel() {
    if (navigator.share) {
      try { await navigator.share({ title: "MOS-X", text: tekst }); return; } catch { /* geannuleerd */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(tekst)}`, "_blank", "noopener");
  }

  return (
    <>
      <div className={kz.linkVak} style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
        <code>{url}</code>
        <button type="button" className={kz.icoonKnop} aria-label="Link kopiëren"
          onClick={async () => { await navigator.clipboard.writeText(url); setOk(true); setTimeout(() => setOk(false), 1600); }}>
          {ok ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className={kz.rijKnoppen}>
        <button type="button" className={kz.knop} style={{ background: "#25D366" }} onClick={deel}>
          <Share2 size={15} /> Deel met je buren
        </button>
      </div>
      <p className={kz.sub} style={{ fontSize: 12 }}>Je buur ziet alleen je voornaam ({voornaam}), niet je adres of je dossier.</p>
    </>
  );
}
