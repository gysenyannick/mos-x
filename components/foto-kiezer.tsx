"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { comprimeer } from "@/lib/foto";

const MAX = 3;
// Vercel aanvaardt max. 4,5 MB per aanvraag: samen blijven we daar ruim onder
const MAX_TOTAAL = 4_000_000;

type Props = {
  fotos: File[];
  onChange: (fotos: File[]) => void;
  /** Tekst op de knop */
  label?: string;
};

/** Optionele foto-upload voor formulieren: max. 3 foto's, in de browser verkleind. */
export function FotoKiezer({ fotos, onChange, label = "Foto's van je dak toevoegen" }: Props) {
  const invoer = useRef<HTMLInputElement>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [voorbeelden, setVoorbeelden] = useState<string[]>([]);

  useEffect(() => {
    const urls = fotos.map((f) => URL.createObjectURL(f));
    setVoorbeelden(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [fotos]);

  async function kies(lijst: FileList | null) {
    if (!lijst?.length) return;
    setFout("");
    setBezig(true);
    const nieuw = [...fotos];
    for (const f of Array.from(lijst).slice(0, MAX - fotos.length)) {
      const blob = await comprimeer(f);
      const naam = blob === f ? f.name : f.name.replace(/\.[^.]+$/, "") + ".jpg";
      const bestand = new File([blob], naam, { type: blob.type || f.type });
      const totaal = nieuw.reduce((s, x) => s + x.size, 0) + bestand.size;
      if (totaal > MAX_TOTAAL) { setFout("Deze foto is te groot. Probeer een andere foto."); continue; }
      nieuw.push(bestand);
    }
    onChange(nieuw);
    setBezig(false);
  }

  return (
    <div className="fk">
      <style>{`
        .fk-rij { display: flex; flex-wrap: wrap; gap: 8px; }
        .fk-duim { position: relative; width: 64px; height: 64px; border-radius: 10px; overflow: hidden; border: 1px solid #E5E7EB; background: #F7F8F6; }
        .fk-duim img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .fk-weg { position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; border-radius: 50%; border: 0; background: rgba(26,26,26,0.8); color: #fff; display: grid; place-items: center; cursor: pointer; padding: 0; }
        .fk-weg:hover { background: #1A1A1A; }
        .fk-weg:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 1px; }
        .fk-knop { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-height: 46px; padding: 10px 14px; border-radius: 10px; border: 1.5px dashed #C5DFA8; background: #F9FCF5; color: #5A8F3A; font-size: 14px; font-weight: 600; cursor: pointer; font-family: var(--font-inter), system-ui, sans-serif; transition: background-color .2s ease, border-color .2s ease; }
        .fk-knop:hover { background: #EEF6E6; border-color: #9BCB6C; }
        .fk-knop:active { background: #E3F0D6; }
        .fk-knop:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
        .fk-knop:disabled { cursor: default; opacity: .7; }
        .fk-fout { margin: 6px 0 0; font-size: 12.5px; color: #B91C1C; }
      `}</style>
      {fotos.length > 0 && (
        <div className="fk-rij" style={{ marginBottom: fotos.length < MAX ? "10px" : 0 }}>
          {voorbeelden.map((src, i) => (
            <div key={src} className="fk-duim">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Foto ${i + 1}`} />
              <button type="button" className="fk-weg" aria-label="Foto verwijderen" onClick={() => onChange(fotos.filter((_, j) => j !== i))}>
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}
      {fotos.length < MAX && (
        <>
          <input ref={invoer} type="file" accept="image/*,.heic,.heif" multiple hidden onChange={(e) => { kies(e.target.files); e.target.value = ""; }} />
          <button type="button" className="fk-knop" disabled={bezig} onClick={() => invoer.current?.click()}>
            {bezig ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} strokeWidth={2.2} />}
            {bezig ? "Foto's klaarzetten…" : fotos.length ? "Nog een foto toevoegen" : label}
          </button>
        </>
      )}
      {fout && <p className="fk-fout">{fout}</p>}
    </div>
  );
}
