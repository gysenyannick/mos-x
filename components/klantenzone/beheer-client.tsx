"use client";

import { useActionState, useRef, useState } from "react";
import { Check, Copy, Lock } from "lucide-react";
import { login } from "@/app/beheer/actions";
import UploadKnop from "./upload";
import kz from "./kz.module.css";

export function LoginForm() {
  const [staat, actie, bezig] = useActionState(login, {});
  return (
    <form action={actie} className={kz.kaart} style={{ maxWidth: 380, margin: "80px auto 0" }}>
      <h1 className={kz.kaartTitel} style={{ marginBottom: 6 }}><Lock size={18} /> Beheer klantenzone</h1>
      <p className={kz.sub} style={{ marginBottom: 16 }}>Enkel voor MOS-X.</p>
      <div className={kz.veld}>
        <label htmlFor="wachtwoord">Wachtwoord</label>
        <input id="wachtwoord" name="wachtwoord" type="password" className={kz.invoer} autoComplete="current-password" required autoFocus />
      </div>
      {staat?.fout && <p className={kz.fout}>{staat.fout}</p>}
      <div className={kz.rijKnoppen}>
        <button className={kz.knop} disabled={bezig} style={{ flex: 1 }}>{bezig ? "Even geduld…" : "Inloggen"}</button>
      </div>
    </form>
  );
}

export function KopieerLink({ url }: { url: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className={kz.linkVak}>
      <code>{url}</code>
      <button
        type="button"
        className={kz.icoonKnop}
        aria-label="Link kopiëren"
        onClick={async () => { await navigator.clipboard.writeText(url); setOk(true); setTimeout(() => setOk(false), 1600); }}
      >
        {ok ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}

/** Knop die eerst om bevestiging vraagt (verwijderen e.d.). */
export function BevestigKnop({
  actie, vraag, children, klein = true,
}: { actie: () => Promise<void>; vraag: string; children: React.ReactNode; klein?: boolean }) {
  return (
    <form action={actie} onSubmit={(e) => { if (!confirm(vraag)) e.preventDefault(); }} style={{ display: "inline" }}>
      <button className={`${kz.knop} ${kz.knopGevaar} ${klein ? kz.knopKlein : ""}`}>{children}</button>
    </form>
  );
}

export function FotoUpload({ klantId }: { klantId: string }) {
  const [fase, setFase] = useState("tijdens");
  const bijschrift = useRef<HTMLInputElement>(null);
  return (
    <div className={kz.velden} style={{ alignItems: "end" }}>
      <div className={kz.veld}>
        <label htmlFor="fotofase">Fase</label>
        <select id="fotofase" className={kz.invoer} value={fase} onChange={(e) => setFase(e.target.value)}>
          <option value="voor">Voor</option>
          <option value="tijdens">Tijdens</option>
          <option value="na">Na</option>
        </select>
      </div>
      <div className={kz.veld}>
        <label htmlFor="bijschrift">Bijschrift (optioneel)</label>
        <input id="bijschrift" ref={bijschrift} className={kz.invoer} placeholder="bv. Noordkant na reiniging" />
      </div>
      <div className={kz.vol}>
        <UploadKnop
          klantId={klantId}
          soort="foto"
          meerdere
          label="Foto's kiezen en uploaden"
          velden={() => ({ fase, bijschrift: bijschrift.current?.value ?? "" })}
          onKlaar={() => { if (bijschrift.current) bijschrift.current.value = ""; }}
        />
      </div>
    </div>
  );
}

export function DocumentUpload({ klantId }: { klantId: string }) {
  const [type, setType] = useState("offerte");
  const [titel, setTitel] = useState("");
  const [bedrag, setBedrag] = useState("");
  const [status, setStatus] = useState("info");
  const [datum, setDatum] = useState(() => new Date().toISOString().slice(0, 10));

  return (
    <div className={kz.velden} style={{ alignItems: "end" }}>
      <div className={kz.veld}>
        <label htmlFor="doctype">Soort</label>
        <select id="doctype" className={kz.invoer} value={type}
          onChange={(e) => { setType(e.target.value); setStatus(e.target.value === "voorschot" || e.target.value === "factuur" ? "open" : "info"); }}>
          <optgroup label="Prijs en betaling">
            <option value="offerte">Offerte</option>
            <option value="voorschot">Voorschotfactuur</option>
            <option value="factuur">Factuur</option>
          </optgroup>
          <optgroup label="Na de werken">
            <option value="garantie">Garantiecertificaat</option>
            <option value="oplevering">Opleveringsverslag</option>
            <option value="inspectie">Inspectierapport</option>
            <option value="fiche">Technische fiche (producten)</option>
          </optgroup>
          <option value="andere">Ander document</option>
        </select>
      </div>
      <div className={kz.veld}>
        <label htmlFor="doctitel">Titel</label>
        <input id="doctitel" className={kz.invoer} value={titel} onChange={(e) => setTitel(e.target.value)} placeholder="bv. Offerte dakreiniging" />
      </div>
      <div className={kz.veld}>
        <label htmlFor="docbedrag">Bedrag incl. btw (optioneel)</label>
        <input id="docbedrag" className={kz.invoer} inputMode="decimal" value={bedrag} onChange={(e) => setBedrag(e.target.value)} placeholder="bv. 2450" />
      </div>
      <div className={kz.veld}>
        <label htmlFor="docstatus">Status</label>
        <select id="docstatus" className={kz.invoer} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="info">Ter info</option>
          <option value="open">Nog te betalen</option>
          <option value="betaald">Betaald</option>
        </select>
      </div>
      <div className={kz.veld}>
        <label htmlFor="docdatum">Datum</label>
        <input id="docdatum" type="date" className={kz.invoer} value={datum} onChange={(e) => setDatum(e.target.value)} />
      </div>
      <div>
        <UploadKnop
          klantId={klantId}
          soort="document"
          label="Pdf kiezen en uploaden"
          velden={() => ({ type, titel, bedrag, status, datum })}
          onKlaar={() => { setTitel(""); setBedrag(""); }}
        />
      </div>
    </div>
  );
}
