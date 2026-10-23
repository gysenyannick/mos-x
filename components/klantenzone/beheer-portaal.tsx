import { Bell, ClipboardCheck, Gift, ShieldCheck, Siren, Star, Trash2, Users, Wallet } from "lucide-react";
import {
  bewaarVerwijzing, boekTegoed, kenBeloningToe, kenReviewPuntenToe, verwijderInspectie, voegInspectieToe, zetAanvraagStatusV2, zetDemo, zetStormStatus,
} from "@/app/beheer/portaal-actions";
import { controle12 } from "@/lib/klantenzone/onderhoud";
import type { Instellingen } from "@/lib/klantenzone/store";
import { fmtKort, fmtMaand, fmtMoment } from "@/lib/klantenzone/tijd";
import {
  AANVRAAG_LABEL, AANVRAAG_STATUSSEN, AANVRAAG_STATUS_LABEL, CHECKLIST, INSPECTIE_LABEL, VERWIJZING_STATUS_LABEL, aanvraagLoopt, type Klant,
} from "@/lib/klantenzone/types";
import { REF_WERK_LABEL, beloningMag, refRegels, tegoedOverzicht, type RefWerk } from "@/lib/klantenzone/voordeel";
import { BevestigKnop } from "./beheer-client";
import kz from "./kz.module.css";

/** Aanvragen van de klant met hun status; bovenaan, want daar moet Yannick iets mee. */
export function BeheerAanvragenV2({ k }: { k: Klant }) {
  const lijst = k.aanvragen ?? [];
  const storm = (k.stormMeldingen ?? []).filter((m) => m.status === "nieuw");
  if (!lijst.length && !storm.length) return null;
  const lopend = lijst.filter((a) => aanvraagLoopt(a.status)).length;
  return (
    <section className={kz.kaart} style={lopend || storm.length ? { border: "1px solid #E9C98F" } : undefined}>
      {storm.length > 0 && (
        <>
          <h2 className={kz.kaartTitel} style={{ marginBottom: 12 }}><Siren size={18} /> Meldingen van de klant <span className={`${kz.badge} ${kz.badgeAmber}`}>{storm.length} nieuw</span></h2>
          <ul className={kz.lijst} style={{ marginBottom: 18 }}>
            {storm.map((m) => (
              <li key={m.id} className={`${kz.rij} ${kz.rijWrap}`}>
                <div className={kz.rijMidden}>
                  <p className={kz.rijTitel}>{m.type}</p>
                  <p className={kz.rijSub} style={{ whiteSpace: "pre-line" }}>{m.tekst}</p>
                  <p className={kz.rijSub}>{fmtMoment(m.datum)}{m.fotos.length ? " · " : ""}{m.fotos.map((u, i) => <a key={u} href={u} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>Foto {i + 1}</a>)}</p>
                </div>
                <form action={zetStormStatus.bind(null, k.id, m.id, "behandeld")}><button className={`${kz.knop} ${kz.knopKlein}`}>Behandeld</button></form>
              </li>
            ))}
          </ul>
        </>
      )}
      {lijst.length > 0 && (
        <>
          <h2 className={kz.kaartTitel} style={{ marginBottom: 12 }}><Bell size={18} /> Aanvragen van de klant {lopend > 0 && <span className={`${kz.badge} ${kz.badgeAmber}`}>{lopend} lopend</span>}</h2>
          <ul className={kz.lijst}>
            {lijst.map((a) => (
              <li key={a.id} className={`${kz.rij} ${kz.rijWrap}`} style={{ opacity: aanvraagLoopt(a.status) ? 1 : 0.6 }}>
                <div className={kz.rijMidden}>
                  <p className={kz.rijTitel}>{AANVRAAG_LABEL[a.soort]}</p>
                  {a.tekst && <p className={kz.rijSub} style={{ whiteSpace: "pre-line" }}>{a.tekst}</p>}
                  <p className={kz.rijSub}>{fmtMoment(a.datum)}{a.fotos?.length ? " · " : ""}{(a.fotos ?? []).map((u, i) => <a key={u} href={u} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>Foto {i + 1}</a>)}</p>
                </div>
                <div className={kz.statusKnoppen}>
                  {AANVRAAG_STATUSSEN.map((st) => (
                    <form key={st} action={zetAanvraagStatusV2.bind(null, k.id, a.id, st)}>
                      <button className={`${kz.knop} ${kz.knopKlein} ${a.status === st || (st === "afgesloten" && a.status === "behandeld") ? "" : kz.knopLicht}`}>{AANVRAAG_STATUS_LABEL[st]}</button>
                    </form>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <p className={kz.rijSub} style={{ marginTop: 8 }}>Bij Offerte verstuurd, Goedgekeurd, Ingepland, Uitgevoerd en Afgesloten krijgt de klant een mail.</p>
        </>
      )}
    </section>
  );
}

/** Doorverwijzingen van deze klant: statusflow, waarde, betaald, controles en beloning. */
export function BeheerVerwijzingen({ k, instellingen }: { k: Klant; instellingen: Instellingen }) {
  const regels = refRegels(instellingen);
  const lijst = k.verwijzingen ?? [];
  return (
    <section className={kz.kaart}>
      <h2 className={kz.kaartTitel} style={{ marginBottom: 6 }}><Users size={18} /> Doorverwijzingen ({lijst.length})</h2>
      {k.refCode && <p className={kz.sub} style={{ marginTop: 0 }}>Code {k.refCode} · link /buur/{k.refCode}</p>}
      {lijst.length === 0 ? <p className={kz.leeg}>Nog niemand via {k.voornaam}.</p> : (
        <ul className={kz.lijst}>
          {lijst.map((v) => {
            const { mag, redenen } = beloningMag(k, v, regels);
            return (
              <li key={v.id} className={`${kz.rij} ${kz.rijWrap}`}>
                <div className={kz.rijMidden} style={{ flexBasis: "100%" }}>
                  <p className={kz.rijTitel}>{v.naam} <span className={`${kz.badge} ${v.status === "beloond" ? kz.badgeGroen : ""}`}>{VERWIJZING_STATUS_LABEL[v.status]}</span></p>
                  <p className={kz.rijSub}><a href={`tel:${v.telefoon}`} style={{ color: "inherit" }}>{v.telefoon}</a>{v.adres ? ` · ${v.adres}` : ""} · {fmtMoment(v.datum)}</p>
                  {v.bericht && <p className={kz.rijSub}>&quot;{v.bericht}&quot;</p>}
                  {(v.controle ?? []).map((c) => <p key={c} className={kz.rijSub} style={{ color: c.startsWith("Blokkeert") ? "#B4442B" : "#9A6A12" }}>⚠ {c}</p>)}
                  {v.status !== "beloond" && (
                    <form action={bewaarVerwijzing.bind(null, k.id, v.id)} className={kz.velden} style={{ marginTop: 10 }}>
                      <div className={kz.veld}>
                        <label htmlFor={`st-${v.id}`}>Status</label>
                        <select id={`st-${v.id}`} name="status" defaultValue={v.status === "gecontacteerd" ? "offerte" : v.status === "klant" ? "bevestigd" : v.status} className={kz.invoer}>
                          {(["nieuw", "offerte", "bevestigd", "uitgevoerd", "geen"] as const).map((st) => <option key={st} value={st}>{VERWIJZING_STATUS_LABEL[st]}</option>)}
                        </select>
                      </div>
                      <div className={kz.veld}>
                        <label htmlFor={`werk-${v.id}`}>Soort werk</label>
                        <select id={`werk-${v.id}`} name="werk" defaultValue={v.werk ?? "dak"} className={kz.invoer}>
                          {(Object.keys(REF_WERK_LABEL) as RefWerk[]).map((w) => <option key={w} value={w}>{REF_WERK_LABEL[w]}</option>)}
                        </select>
                      </div>
                      <div className={kz.veld}><label htmlFor={`w-${v.id}`}>Opdrachtwaarde (€)</label><input id={`w-${v.id}`} name="opdrachtWaarde" inputMode="decimal" defaultValue={v.opdrachtWaarde ?? ""} className={kz.invoer} /></div>
                      <div className={kz.veld}>
                        <label htmlFor={`b-${v.id}`}>Volledig betaald</label>
                        <select id={`b-${v.id}`} name="betaald" defaultValue={v.betaald ? "ja" : "nee"} className={kz.invoer}><option value="nee">Nee</option><option value="ja">Ja</option></select>
                      </div>
                      <div className={kz.veld}><label htmlFor={`r-${v.id}`}>Reden (bij niet in aanmerking)</label><input id={`r-${v.id}`} name="reden" defaultValue={v.reden ?? ""} className={kz.invoer} /></div>
                      <div className={`${kz.veld} ${kz.vol}`}><button className={`${kz.knop} ${kz.knopKlein} ${kz.knopLicht}`}>Opslaan</button></div>
                    </form>
                  )}
                  {v.status !== "beloond" && (
                    <div style={{ marginTop: 8 }}>
                      {mag ? (
                        <form action={kenBeloningToe.bind(null, k.id, v.id)}><button className={`${kz.knop} ${kz.knopKlein} ${kz.knopPrimair}`}><Gift size={14} /> Beloning toekennen ({regels.beloning} punten)</button></form>
                      ) : (
                        <p className={kz.rijSub}>Beloning nog niet mogelijk: {redenen.join(" ")}</p>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** Dakzorg, tegoed, review, voorbereiding en voorkeuren van deze klant. */
export function BeheerZorg({ k }: { k: Klant }) {
  const { saldo, vervallen, regels } = tegoedOverzicht(k);
  const c12 = controle12(k);
  const klaar = CHECKLIST.filter((c) => k.checklist?.[c.id]).length;
  return (
    <>
      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 6 }}><ShieldCheck size={18} /> Inspecties en controles</h2>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 12 }}>
          {c12 ? (c12.gedaan ? `Gratis controle na 12 maanden gedaan op ${fmtKort(c12.gedaan)}.` : `Gratis controle na 12 maanden: rond ${fmtMaand(c12.datum)}.`) : "De 12-maandencontrole volgt na de oplevering."}
        </p>
        {(k.inspecties ?? []).length > 0 && (
          <ul className={kz.lijst} style={{ marginBottom: 14 }}>
            {[...(k.inspecties ?? [])].sort((a, b) => b.datum.localeCompare(a.datum)).map((i) => (
              <li key={i.id} className={kz.rij}>
                <div className={kz.rijMidden}><p className={kz.rijTitel}>{INSPECTIE_LABEL[i.soort]} · {fmtKort(i.datum)}</p>{i.bevindingen && <p className={kz.rijSub}>{i.bevindingen}</p>}</div>
                <BevestigKnop actie={verwijderInspectie.bind(null, k.id, i.id)} vraag="Controle verwijderen?"><Trash2 size={14} /></BevestigKnop>
              </li>
            ))}
          </ul>
        )}
        <form action={voegInspectieToe.bind(null, k.id)}>
          <div className={kz.velden}>
            <div className={kz.veld}><label htmlFor="idatum">Datum</label><input id="idatum" name="datum" type="date" required className={kz.invoer} /></div>
            <div className={kz.veld}>
              <label htmlFor="isoort">Soort</label>
              <select id="isoort" name="soort" className={kz.invoer} defaultValue="12maanden">
                {Object.entries(INSPECTIE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="ibev">Bevindingen (de klant ziet dit)</label><textarea id="ibev" name="bevindingen" className={kz.invoer} placeholder="bv. Dak in goede staat, lichte groene waas op de noordkant." /></div>
            <div className={kz.veld}><label htmlFor="iurl">Link naar verslag (optioneel)</label><input id="iurl" name="verslagUrl" className={kz.invoer} placeholder="Upload het verslag bij Documenten en plak de link" /></div>
            <div className={kz.veld}><label htmlFor="ivolg">Onderhoud aanraden op (optioneel)</label><input id="ivolg" name="volgendeControle" type="date" className={kz.invoer} /></div>
          </div>
          <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopKlein}`}>Controle toevoegen</button></div>
        </form>
      </section>

      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 6 }}><Wallet size={18} /> Spaarpot: {saldo} punten</h2>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 12 }}>Elke boeking blijft bewaard. Corrigeer met een nieuwe boeking, nooit door te wissen.{vervallen ? ` Vervallen: ${vervallen} punten.` : ""}</p>
        {regels.length > 0 && (
          <ul className={kz.lijst} style={{ marginBottom: 14 }}>
            {regels.map((t) => (
              <li key={t.id} className={kz.rij}>
                <div className={kz.rijMidden}><p className={kz.rijTitel}>{t.bedrag > 0 ? "+" : ""}{t.bedrag} punten · {t.soort}</p><p className={kz.rijSub}>{t.omschrijving} · {fmtMoment(t.datum)} · {t.door}{t.vervaltOp ? ` · geldig tot ${fmtKort(t.vervaltOp)}` : ""}</p></div>
              </li>
            ))}
          </ul>
        )}
        <form action={boekTegoed.bind(null, k.id)}>
          <div className={kz.velden}>
            <div className={kz.veld}>
              <label htmlFor="tsoort">Soort</label>
              <select id="tsoort" name="soort" className={kz.invoer} defaultValue="gebruikt">
                <option value="gebruikt">Gebruikt op een factuur</option>
                <option value="correctie">Correctie (+ of −)</option>
                <option value="geannuleerd">Geannuleerd (bv. terugbetaling)</option>
              </select>
            </div>
            <div className={kz.veld}><label htmlFor="tbedrag">Punten</label><input id="tbedrag" name="bedrag" inputMode="decimal" required className={kz.invoer} /></div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="tom">Reden</label><input id="tom" name="omschrijving" required className={kz.invoer} placeholder="bv. Verrekend op factuur 2026-118" /></div>
          </div>
          <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopKlein}`}>Boeken</button></div>
        </form>
      </section>

      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 12 }}><ClipboardCheck size={18} /> Klant</h2>
        <dl className={kz.jeDak}>
          <div><dt>Voorbereiding</dt><dd>{klaar} van {CHECKLIST.length} bevestigd</dd></div>
          <div><dt>Mails over acties</dt><dd>{k.voorkeuren ? `${k.voorkeuren.marketing ? "Ja" : "Nee"} · ${fmtKort(k.voorkeuren.sinds)}` : "Standaard ja (bestaande klant)"}</dd></div>
          <div><dt><Star size={13} style={{ verticalAlign: -2 }} /> Review</dt><dd>{k.review?.geklikt ? `Op de knop geklikt ${fmtKort(k.review.geklikt)}` : k.review?.weggeklikt ? `Weggeklikt ${fmtKort(k.review.weggeklikt)}` : "Nog niets"}</dd></div>
        </dl>
        {(k.review?.feedback ?? []).map((f) => <p key={f.datum} className={kz.rijSub} style={{ marginTop: 8 }}>Feedback {fmtKort(f.datum)}: &quot;{f.tekst}&quot;</p>)}
        {!(k.tegoed ?? []).some((t) => t.sleutel === "review") && (
          <form action={kenReviewPuntenToe.bind(null, k.id)} style={{ marginTop: 12 }}>
            <button className={`${kz.knop} ${kz.knopKlein} ${kz.knopLicht}`}>Reviewpunten toekennen (als je de review gezien hebt)</button>
          </form>
        )}
        <form action={zetDemo.bind(null, k.id, !k.demo)} style={{ marginTop: 12 }}>
          <button className={`${kz.knop} ${kz.knopKlein} ${kz.knopLicht}`}>{k.demo ? "Geen voorbeelddossier meer" : "Markeer als voorbeelddossier"}</button>
        </form>
      </section>
    </>
  );
}
