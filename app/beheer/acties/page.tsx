import Link from "next/link";
import { Tag } from "lucide-react";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { CAMPAGNE_TYPE_LABEL, getInstellingen, listKlanten, type Actie, type CampagneType } from "@/lib/klantenzone/store";
import { effectief } from "@/lib/klantenzone/auto";
import { fmtKort } from "@/lib/klantenzone/tijd";
import { EXTRAS, aanvraagLoopt } from "@/lib/klantenzone/types";
import { actieVoorKlant, campagneMarge, campagneStaat, interesseVoor, refRegels } from "@/lib/klantenzone/voordeel";
import { bewaarCampagne, zetCampagneStatus } from "../portaal-actions";
import kz from "@/components/klantenzone/kz.module.css";

const STAAT_LABEL = { concept: "Concept", gepland: "Gepland", actief: "Actief", gepauzeerd: "Gepauzeerd", afgelopen: "Afgelopen", volzet: "Volzet" } as const;
const FASE_OPTIES = [["gepland", "Planning"], ["bezig", "Uitvoering"], ["klaar", "Oplevering"], ["nazorg", "Nazorg"]] as const;

export default async function Acties({ searchParams }: { searchParams: Promise<{ bewerk?: string }> }) {
  if (!(await isBeheerder())) return null;
  const { bewerk } = await searchParams;
  const [i, ruw] = await Promise.all([getInstellingen(), listKlanten()]);
  const klanten = ruw.map(effectief);
  const acties = i.acties ?? [];
  const c: Partial<Actie> = acties.find((a) => a.id === bewerk) ?? {};
  const beloning = refRegels(i).beloning;

  return (
    <>
      <div className={kz.dashKop}><h1 className={kz.dashTitel}>Acties en buurtacties</h1></div>
      <p className={kz.sub} style={{ marginTop: 0 }}>
        Een actie verschijnt pas als ze actief staat, de voorwaarden nagekeken zijn en de klant tot de doelgroep hoort.
        Na de einddatum verdwijnt ze vanzelf. Acties stapelen niet, tenzij je &quot;combineerbaar&quot; aanvinkt.
      </p>

      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Tag size={18} /> Alle acties</h2></div>
        {acties.length === 0 ? <p className={kz.leeg}>Nog geen acties.</p> : (
          <ul className={kz.lijst}>
            {acties.map((a) => {
              const aanvragen = klanten.flatMap((k) => (k.aanvragen ?? []).filter((x) => x.campagneId === a.id));
              const staat = campagneStaat(a, interesseVoor(a, klanten));
              const bereik = klanten.filter((k) => actieVoorKlant({ ...a, status: "actief", nagekeken: true, start: undefined }, k)).length;
              const marge = campagneMarge(a, 0);
              const onder = marge && i.minMarge !== undefined && marge.procent < i.minMarge;
              return (
                <li key={a.id} className={`${kz.rij} ${kz.rijWrap}`}>
                  <div className={kz.rijMidden} style={{ flexBasis: "100%" }}>
                    <p className={kz.rijTitel}>{a.titel} <span className={`${kz.badge} ${staat === "actief" ? kz.badgeGroen : staat === "afgelopen" ? "" : kz.badgeAmber}`}>{STAAT_LABEL[staat]}</span></p>
                    <p className={kz.rijSub}>
                      {a.type ? CAMPAGNE_TYPE_LABEL[a.type] : "Actie"}
                      {a.start ? ` · vanaf ${fmtKort(a.start)}` : ""}{a.geldigTot ? ` · tot ${fmtKort(a.geldigTot)}` : " · geen einddatum"}
                      {a.postcodes?.length ? ` · ${a.postcodes.join(", ")}` : " · overal"}
                      {a.maxAanvragen ? ` · max. ${a.maxAanvragen}` : ""}
                    </p>
                    <p className={kz.rijSub}>
                      Doelgroep nu: {bereik} klant{bereik === 1 ? "" : "en"} · Aanvragen: {aanvragen.length} ({aanvragen.filter((x) => !aanvraagLoopt(x.status)).length} afgerond)
                      {" · "}Marge: {marge ? `€ ${marge.marge} (${marge.procent}%)` : "onbekend"}
                      {onder && <strong style={{ color: "#B4442B" }}> · onder de minimale marge van {i.minMarge}%</strong>}
                    </p>
                    {a.type && !a.nagekeken && <p className={kz.rijSub} style={{ color: "#9A6A12" }}>Eerst voorwaarden en prijzen nakijken voor je ze activeert.</p>}
                    <div className={kz.rijKnoppen} style={{ marginTop: 8 }}>
                      <Link href={`?bewerk=${a.id}#vorm`} className={`${kz.knop} ${kz.knopKlein} ${kz.knopLicht}`}>Bewerken</Link>
                      {a.status !== "actief" && <form action={zetCampagneStatus.bind(null, a.id, "actief")}><button className={`${kz.knop} ${kz.knopKlein}`}>Activeren</button></form>}
                      {a.status !== "gepauzeerd" && <form action={zetCampagneStatus.bind(null, a.id, "gepauzeerd")}><button className={`${kz.knop} ${kz.knopKlein} ${kz.knopLicht}`}>Pauzeren</button></form>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className={kz.kaart} id="vorm">
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}>{c.id ? `Bewerken: ${c.titel}` : "Nieuwe actie"}</h2>{c.id && <Link href="/beheer/acties" className={kz.meerLink}>Nieuwe actie</Link>}</div>
        <form action={bewaarCampagne} key={c.id ?? "nieuw"}>
          {c.id && <input type="hidden" name="id" value={c.id} />}
          <div className={kz.velden}>
            <div className={kz.veld}><label htmlFor="ctitel">Titel</label><input id="ctitel" name="titel" required defaultValue={c.titel ?? ""} className={kz.invoer} placeholder="bv. Najaarscheck: laat je dakgoten reinigen" /></div>
            <div className={kz.veld}>
              <label htmlFor="ctype">Type</label>
              <select id="ctype" name="type" defaultValue={c.type ?? "seizoen"} className={kz.invoer}>
                {(Object.keys(CAMPAGNE_TYPE_LABEL) as CampagneType[]).map((t) => <option key={t} value={t}>{CAMPAGNE_TYPE_LABEL[t]}</option>)}
              </select>
            </div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="ctekst">Omschrijving (met de echte prijs of het echte voordeel)</label><textarea id="ctekst" name="tekst" defaultValue={c.tekst ?? ""} className={kz.invoer} /></div>
            <div className={kz.veld}>
              <label htmlFor="cextra">Dienst</label>
              <select id="cextra" name="extra" defaultValue={c.extra ?? ""} className={kz.invoer}>
                <option value="">Geen bepaalde dienst</option>
                {EXTRAS.map((x) => <option key={x.id} value={x.id}>{x.naam}</option>)}
              </select>
            </div>
            <div className={kz.veld}><label htmlFor="cstart">Start (leeg = meteen)</label><input id="cstart" name="start" type="date" defaultValue={c.start ?? ""} className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="ctot">Einde (verdwijnt daarna vanzelf)</label><input id="ctot" name="geldigTot" type="date" defaultValue={c.geldigTot ?? ""} className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="cmax">Maximum aanvragen (leeg = geen)</label><input id="cmax" name="maxAanvragen" inputMode="numeric" defaultValue={c.maxAanvragen ?? ""} className={kz.invoer} /></div>
            <div className={`${kz.veld} ${kz.vol}`}>
              <span className={kz.label}>Doelgroep (leeg = klanten vanaf de uitvoering)</span>
              <div className={kz.rijKnoppen} style={{ marginTop: 4 }}>
                {FASE_OPTIES.map(([v, l]) => (
                  <label key={v} className={kz.vinkLabel}><input type="checkbox" name="fases" value={v} defaultChecked={c.fases?.includes(v)} /> {l}</label>
                ))}
              </div>
            </div>
            <div className={kz.veld}><label htmlFor="cpc">Postcodes (leeg = overal)</label><input id="cpc" name="postcodes" defaultValue={c.postcodes?.join(", ") ?? ""} className={kz.invoer} placeholder="bv. 2200, 2440" /></div>
            <div className={kz.veld}><label htmlFor="cdag">Buurtactie: geplande werkdag of periode</label><input id="cdag" name="werkdag" defaultValue={c.werkdag ?? ""} className={kz.invoer} placeholder="Enkel als die echt in je planning staat" /></div>
            <div className={kz.veld}><label htmlFor="cmin">Groepsactie: vanaf hoeveel woningen</label><input id="cmin" name="minInteresse" inputMode="numeric" defaultValue={c.minInteresse ?? ""} className={kz.invoer} placeholder="bv. 3" /></div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="cvw">Voorwaarden</label><textarea id="cvw" name="voorwaarden" defaultValue={c.voorwaarden ?? ""} className={kz.invoer} placeholder="Wat geldt, voor wie, tot wanneer, welke prijs, combineerbaar of niet." /></div>
          </div>

          <p className={kz.label} style={{ marginTop: 16 }}>Marge (optioneel, per opdracht)</p>
          <div className={kz.velden}>
            <div className={kz.veld}><label htmlFor="cw">Opdrachtwaarde (€)</label><input id="cw" name="opdrachtWaarde" inputMode="decimal" defaultValue={c.opdrachtWaarde ?? ""} className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="ck">Directe kosten (€)</label><input id="ck" name="kosten" inputMode="decimal" defaultValue={c.kosten ?? ""} className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="cv">Verplaatsing (€)</label><input id="cv" name="verplaatsing" inputMode="decimal" defaultValue={c.verplaatsing ?? ""} className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="ckor">Korting voor de klant (€)</label><input id="ckor" name="korting" inputMode="decimal" defaultValue={c.korting ?? ""} className={kz.invoer} /></div>
            <div className={kz.veld}><label htmlFor="ca">Andere kosten (€)</label><input id="ca" name="andereKosten" inputMode="decimal" defaultValue={c.andereKosten ?? ""} className={kz.invoer} /></div>
          </div>
          {(() => {
            const m = campagneMarge(c as Actie);
            const metRef = campagneMarge(c as Actie, beloning);
            return <p className={kz.rijSub} style={{ marginTop: 8 }}>Marge: {m ? `€ ${m.marge} (${m.procent}%)` : "onbekend, vul waarde en kosten in"}{metRef ? ` · met burenvoordeel erbij: € ${metRef.marge} (${metRef.procent}%)` : ""}</p>;
          })()}

          <div className={kz.rijKnoppen} style={{ marginTop: 14 }}>
            <label className={kz.vinkLabel}><input type="checkbox" name="combineerbaar" value="ja" defaultChecked={c.combineerbaar} /> Combineerbaar met andere voordelen</label>
            <label className={kz.vinkLabel}><input type="checkbox" name="nagekeken" value="ja" defaultChecked={c.nagekeken} /> Voorwaarden en prijzen nagekeken (Belgisch consumentenrecht)</label>
          </div>
          <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopPrimair}`}>{c.id ? "Opslaan" : "Actie aanmaken (als concept)"}</button></div>
        </form>
      </section>
    </>
  );
}
