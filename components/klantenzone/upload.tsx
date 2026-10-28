"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";
import kz from "./kz.module.css";
import { comprimeer } from "@/lib/foto";

type Props = {
  klantId: string;
  soort: "foto" | "document";
  label: string;
  /** Extra velden die meegestuurd worden (fase, type, titel, ...) */
  velden?: () => Record<string, string>;
  meerdere?: boolean;
  licht?: boolean;
  onKlaar?: () => void;
};

export default function UploadKnop({ klantId, soort, label, velden, meerdere, licht, onKlaar }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [bezig, setBezig] = useState<string | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  async function kies(files: FileList | null) {
    if (!files?.length) return;
    setFout(null);
    const lijst = Array.from(files);
    for (let i = 0; i < lijst.length; i++) {
      setBezig(lijst.length > 1 ? `${i + 1}/${lijst.length}` : "…");
      const f = lijst[i];
      const data = soort === "foto" ? await comprimeer(f) : f;
      const fd = new FormData();
      fd.set("klantId", klantId);
      fd.set("soort", soort);
      const naam = soort === "foto" ? f.name.replace(/\.[a-z0-9]+$/i, "") + ".jpg" : f.name;
      fd.set("bestand", data, naam);
      for (const [k, v] of Object.entries(velden?.() ?? {})) fd.set(k, v);
      try {
        const res = await fetch("/api/klantenzone/upload", { method: "POST", body: fd });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.ok) { setFout(json.fout ?? "Uploaden is mislukt."); break; }
      } catch {
        setFout("Geen verbinding. Probeer het opnieuw.");
        break;
      }
    }
    setBezig(null);
    if (ref.current) ref.current.value = "";
    onKlaar?.();
    router.refresh();
  }

  return (
    <div>
      <input
        ref={ref}
        type="file"
        hidden
        multiple={meerdere}
        accept={soort === "foto" ? "image/*" : "application/pdf,image/*"}
        onChange={(e) => kies(e.target.files)}
      />
      <button
        type="button"
        className={`${kz.knop} ${kz.knopKlein} ${licht ? kz.knopLicht : ""}`}
        onClick={() => ref.current?.click()}
        disabled={!!bezig}
      >
        {bezig ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
        {bezig ? `Uploaden ${bezig}` : label}
      </button>
      {fout && <p className={kz.fout}>{fout}</p>}
    </div>
  );
}
