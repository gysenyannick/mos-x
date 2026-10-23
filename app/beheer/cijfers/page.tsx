import { BarChart3 } from "lucide-react";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { CAMPAGNE_TYPE_LABEL, getInstellingen, listKlanten } from "@/lib/klantenzone/store";
import { AANVRAAG_LABEL, aanvraagLoopt, type AanvraagSoort } from "@/lib/klantenzone/types";
import { campagneMarge } from "@/lib/klantenzone/voordeel";
import kz from "@/components/klantenzone/kz.module.css";

/** Commercieel overzicht: enkel wat echt in de dossiers staat, niets geschat. */
export default async function Cijfers() {
  if (!(await isBeheerder())) return null;
  const [i, klanten] = await Promise.all([getInstellingen(), listKlanten()]);
  const echte = klanten.filter((k) => !k.demo);
  const telDemo = klanten.length - echte.length;

  const refs = echte.flatMap((k) => k.verwijzingen ?? []);
  const refKlant = refs.filter((v) => ["bevestigd", "uitgevoerd", "beloond", "klant"].includes(v.status));
  const refOmzet = refs.filter((v) => v.opdrachtWaarde && (v.status === "uitgevoerd" || v.status === "beloond")).reduce((s, v) => s + (v.opdrachtWaarde ?? 0), 0);
  const beloningKost = echte.flatMap((k) => k.tegoed ?? []).filter((t) => t.soort === "toegekend").reduce((s, t) => s + t.bedrag, 0);
  const tegoedGebruikt = echte.flatMap((k) => k.tegoed ?? []).filter((t) => t.soort === "gebruikt").reduce((s, t) => s - t.bedrag, 0);

  const aanvragen = echte.flatMap((k) => k.aanvragen ?? []);
  const perSoort = new Map<AanvraagSoort, { totaal: number; uitgevoerd: number }>();
  for (const a of aanvragen) {
    const x = perSoort.get(a.soort) ?? { totaal: 0, uitgevoerd: 0 };
    x.totaal++;
    if (a.status === "uitgevoerd" || a.status === "afgesloten") x.uitgevoerd++;
    perSoort.set(a.soort, x);
  }
  const herhaal = echte.filter((k) => (k.behandelingen ?? []).length >= 2 || (k.aanvragen ?? []).some((a) => a.soort === "onderhoud" && !aanvraagLoopt(a.status))).length;
  const reviewKlik = echte.filter((k) => k.review?.geklikt).length;

  return (
    <>
      <div className={kz.dashKop}><h1 className={kz.dashTitel}>Cijfers</h1></div>
      <p className={kz.sub} style={{ marginTop: 0 }}>Enkel wat in de dossiers staat.{telDemo ? ` ${telDemo} voorbeelddossier${telDemo > 1 ? "s" : ""} niet meegeteld.` : ""}</p>

      <div className={kz.zorgStats}>
        <div><span>Doorverwijzingen</span><strong>{refs.length}</strong><em>{refKlant.length} werden klant</em></div>
        <div><span>Omzet via buren</span><strong>€ {Math.round(refOmzet)}</strong><em>Uitgevoerde opdrachten</em></div>
        <div><span>Kost beloningen</span><strong>€ {beloningKost}</strong><em>€ {tegoedGebruikt} al verrekend</em></div>
        <div><span>Herhaalklanten</span><strong>{herhaal}</strong><em>Tweede behandeling of onderhoud</em></div>
      </div>

      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><BarChart3 size={18} /> Aanvragen via de klantenzone</h2></div>
        {aanvragen.length === 0 ? <p className={kz.leeg}>Nog geen aanvragen.</p> : (
          <dl className={kz.jeDak}>
            {[...perSoort.entries()].map(([soort, x]) => <div key={soort}><dt>{AANVRAAG_LABEL[soort]}</dt><dd>{x.totaal} aangevraagd · {x.uitgevoerd} uitgevoerd</dd></div>)}
          </dl>
        )}
      </section>

      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}>Acties</h2></div>
        {(i.acties ?? []).length === 0 ? <p className={kz.leeg}>Nog geen acties.</p> : (
          <dl className={kz.jeDak}>
            {(i.acties ?? []).map((a) => {
              const lijst = echte.flatMap((k) => (k.aanvragen ?? []).filter((x) => x.campagneId === a.id));
              const marge = campagneMarge(a);
              return (
                <div key={a.id}>
                  <dt>{a.titel}<br /><span className={kz.rijSub}>{a.type ? CAMPAGNE_TYPE_LABEL[a.type] : "Actie"}</span></dt>
                  <dd>{lijst.length} aanvragen · {lijst.filter((x) => x.status === "uitgevoerd" || x.status === "afgesloten").length} uitgevoerd · marge {marge ? `${marge.procent}%` : "onbekend"}</dd>
                </div>
              );
            })}
          </dl>
        )}
      </section>

      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}>Reviews</h2></div>
        <p className={kz.sub} style={{ marginTop: 0 }}>{reviewKlik} klant{reviewKlik === 1 ? "" : "en"} klikte op &quot;Schrijf een review&quot;. Of er echt een review kwam, zie je in Google.</p>
      </section>
    </>
  );
}
