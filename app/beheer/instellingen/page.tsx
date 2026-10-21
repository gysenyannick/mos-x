import { Settings } from "lucide-react";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { getInstellingen } from "@/lib/klantenzone/store";
import { bewaarInstellingen } from "../actions";
import kz from "@/components/klantenzone/kz.module.css";

export default async function Instellingen() {
  if (!(await isBeheerder())) return null;
  const i = await getInstellingen();

  return (
    <section className={kz.kaart} style={{ marginTop: 20, maxWidth: 720 }}>
      <h1 className={kz.kaartTitel} style={{ marginBottom: 6 }}><Settings size={18} /> Instellingen</h1>
      <form action={bewaarInstellingen}>
        <div className={kz.veld} style={{ marginTop: 14 }}>
          <label htmlFor="burenVoordeel">Voordeel voor buren en doorverwijzers</label>
          <textarea
            id="burenVoordeel" name="burenVoordeel" className={kz.invoer} defaultValue={i.burenVoordeel ?? ""}
            placeholder="bv. Wordt je buur klant? Dan krijgen jullie allebei € 50 korting op jullie volgende onderhoud."
          />
          <p className={kz.sub} style={{ fontSize: 13, marginTop: 4 }}>
            Klanten zien dit bij hun buurlink, en buren op de pagina die ze openen. Laat leeg als je geen beloning wil beloven.
            Kies een bedrag dat je marge toelaat: je belooft het aan iedereen die via een link komt.
          </p>
        </div>
        <div className={kz.rijKnoppen}><button className={kz.knop}>Opslaan</button></div>
      </form>
    </section>
  );
}
