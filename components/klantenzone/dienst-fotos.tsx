"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import kz from "./kz.module.css";

type Dienst = { id: string; naam: string; foto?: string; eigen: boolean };

/** Beheer: per dienst een eigen foto kiezen of de standaardfoto terugzetten. */
export default function DienstFotos({ diensten }: { diensten: Dienst[] }) {
  const router = useRouter();
  const [bezig, setBezig] = useState<string | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  async function stuur(dienst: string, foto?: File) {
    setBezig(dienst);
    setFout(null);
    const fd = new FormData();
    fd.append("dienst", dienst);
    if (foto) fd.append("foto", foto); else fd.append("wis", "1");
    try {
      const r = await fetch("/api/klantenzone/dienstfoto", { method: "POST", body: fd });
      const j = await r.json().catch(() => ({ ok: false, fout: "Opslaan mislukt." }));
      if (!j.ok) setFout(j.fout ?? "Opslaan mislukt.");
      else router.refresh();
    } catch {
      setFout("Geen verbinding. Probeer opnieuw.");
    } finally {
      setBezig(null);
    }
  }

  return (
    <>
      <div className={kz.dienstFotoRaster}>
        {diensten.map((d) => (
          <div key={d.id} className={kz.dienstFotoKeuze}>
            {d.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.foto} alt="" />
            ) : (
              <span className={kz.dienstFotoGeen}>Geen foto</span>
            )}
            <p className={kz.rijTitel}>{d.naam}</p>
            <div className={kz.rijKnoppen} style={{ marginTop: 6 }}>
              <label className={`${kz.knop} ${kz.knopKlein} ${kz.knopLicht}`} style={{ cursor: "pointer" }}>
                {bezig === d.id ? "Bezig…" : "Andere foto"}
                <input type="file" accept="image/*" hidden disabled={!!bezig}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) stuur(d.id, f); e.target.value = ""; }} />
              </label>
              {d.eigen && <button type="button" className={`${kz.knop} ${kz.knopKlein} ${kz.knopLicht}`} disabled={!!bezig} onClick={() => stuur(d.id)}>Standaard</button>}
            </div>
          </div>
        ))}
      </div>
      {fout && <p className={kz.fout}>{fout}</p>}
    </>
  );
}
