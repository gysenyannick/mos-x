import Link from "next/link";
import { Gift, Users } from "lucide-react";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { getInstellingen, listKlanten } from "@/lib/klantenzone/store";
import { fmtKort } from "@/lib/klantenzone/tijd";
import { VERWIJZING_STATUS_LABEL } from "@/lib/klantenzone/types";
import { beloningMag, refRegels, tegoedOverzicht } from "@/lib/klantenzone/voordeel";
import { bewaarRefRegels } from "../portaal-actions";
import kz from "@/components/klantenzone/kz.module.css";

export default async function Doorverwijzingen() {
  if (!(await isBeheerder())) return null;
  const [i, klanten] = await Promise.all([getInstellingen(), listKlanten()]);
  const r = refRegels(i);
  const rijen = klanten.flatMap((k) => (k.verwijzingen ?? []).map((v) => ({ k, v, mag: beloningMag(k, v, r).mag })))
    .sort((a, b) => b.v.datum.localeCompare(a.v.datum));
  const teBelonen = rijen.filter((x) => x.mag);
  const openTegoed = klanten.reduce((s, k) => s + tegoedOverzicht(k).saldo, 0);

  return (
    <>
      <div className={kz.dashKop}><h1 className={kz.dashTitel}>Burenvoordeel</h1></div>

      <div className={kz.zorgStats}>
        <div><span>Doorverwijzingen</span><strong>{rijen.length}</strong><em>&nbsp;</em></div>
        <div><span>Klant geworden</span><strong>{rijen.filter((x) => ["bevestigd", "uitgevoerd", "beloond", "klant"].includes(x.v.status)).length}</strong><em>&nbsp;</em></div>
        <div><span>Klaar om te belonen</span><strong>{teBelonen.length}</strong><em>Uitgevoerd en betaald</em></div>
        <div><span>Punten in omloop</span><strong>{openTegoed}</strong><em>Bij alle klanten samen</em></div>
      </div>

      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Users size={18} /> Alle doorverwijzingen</h2></div>
        {rijen.length === 0 ? <p className={kz.leeg}>Nog geen doorverwijzingen.</p> : (
          <ul className={kz.lijst}>
            {rijen.map(({ k, v, mag }) => (
              <li key={v.id} className={kz.rij}>
                <div className={kz.rijMidden}>
                  <p className={kz.rijTitel}>{v.naam} <span className={`${kz.badge} ${v.status === "beloond" ? kz.badgeGroen : mag ? kz.badgeAmber : ""}`}>{mag ? "Klaar om te belonen" : VERWIJZING_STATUS_LABEL[v.status]}</span></p>
                  <p className={kz.rijSub}>Via {k.voornaam} {k.achternaam} · {fmtKort(v.datum)}{v.opdrachtWaarde ? ` · € ${v.opdrachtWaarde}` : ""}{v.betaald ? " · betaald" : ""}</p>
                  {(v.controle ?? []).map((c) => <p key={c} className={kz.rijSub} style={{ color: c.startsWith("Blokkeert") ? "#B4442B" : "#9A6A12" }}>⚠ {c}</p>)}
                </div>
                <Link href={`/beheer/${k.id}`} className={`${kz.knop} ${kz.knopKlein} ${kz.knopLicht}`}>Open</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Gift size={18} /> Regels van het burenvoordeel</h2></div>
        <p className={kz.sub} style={{ marginTop: 0 }}>
          Een beloning wordt nooit vanzelf toegekend. Jij zet de opdracht op &quot;uitgevoerd&quot; en &quot;betaald&quot; en klikt op &quot;Beloning toekennen&quot;.
          Laat de voorwaarden nalezen voor je ze publiceert. Let op: Google verbiedt beloningen voor reviews en kan zulke reviews verwijderen. Zet reviewpunten enkel aan als je dat risico neemt, en beloon elke eerlijke review, ook een negatieve.
        </p>
        <form action={bewaarRefRegels}>
          <div className={kz.velden}>
            <div className={kz.veld}><label htmlFor="rb">Punten per buur die klant wordt (0 = uit)</label><input id="rb" name="refBeloning" inputMode="numeric" defaultValue={i.refBeloning ?? ""} placeholder="500" className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="rrev">Punten voor een review (0 = uit)</label><input id="rrev" name="reviewPunten" inputMode="numeric" defaultValue={i.reviewPunten ?? ""} placeholder="0" className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="rcp">Waarde van 1 punt (eurocent)</label><input id="rcp" name="centPerPunt" inputMode="numeric" defaultValue={i.centPerPunt ?? ""} placeholder="10 (100 punten = € 10)" className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="rk">Korting voor de nieuwe klant (€, 0 = geen)</label><input id="rk" name="refKorting" inputMode="numeric" defaultValue={i.refKorting ?? ""} placeholder="50" className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="rm">Minimumwaarde opdracht (€)</label><input id="rm" name="refMinOpdracht" inputMode="numeric" defaultValue={i.refMinOpdracht ?? ""} className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="rmax">Maximum beloningen per klant</label><input id="rmax" name="refMaxPerKlant" inputMode="numeric" defaultValue={i.refMaxPerKlant ?? ""} className={kz.invoer} placeholder="Leeg = geen maximum" /></div>
            <div className={kz.veld}><label htmlFor="rg">Tegoed geldig (maanden)</label><input id="rg" name="refGeldigMaanden" inputMode="numeric" defaultValue={i.refGeldigMaanden ?? ""} className={kz.invoer} placeholder="Leeg = onbeperkt" /></div>
            <div className={kz.veld}><label htmlFor="rd">Welke diensten tellen mee</label><input id="rd" name="refDiensten" defaultValue={i.refDiensten ?? ""} className={kz.invoer} placeholder="bv. dakreiniging en dakcoating" /></div>
            <div className={kz.veld}><label htmlFor="rs">Actie loopt vanaf</label><input id="rs" name="refStart" type="date" defaultValue={i.refStart ?? ""} className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="re">Actie loopt tot</label><input id="re" name="refEind" type="date" defaultValue={i.refEind ?? ""} className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="rmarge">Minimale marge voor acties (%)</label><input id="rmarge" name="minMarge" inputMode="numeric" defaultValue={i.minMarge ?? ""} className={kz.invoer} /></div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="rv">Extra voorwaarden (de klant ziet dit)</label><textarea id="rv" name="refVoorwaarden" defaultValue={i.refVoorwaarden ?? ""} className={kz.invoer} /></div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="rbv">Hoe het tegoed verrekend wordt (optioneel)</label><input id="rbv" name="burenVoordeel" defaultValue={i.burenVoordeel ?? ""} className={kz.invoer} placeholder="bv. Je tegoed wordt afgetrokken van je volgende onderhoudsfactuur." /></div>
          </div>
          <div className={kz.rijKnoppen}>
            <label className={kz.vinkLabel}><input type="checkbox" name="refCombineerbaar" value="ja" defaultChecked={i.refCombineerbaar} /> Combineerbaar met andere acties</label>
          </div>
          <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopPrimair}`}>Opslaan</button></div>
        </form>
      </section>
    </>
  );
}
