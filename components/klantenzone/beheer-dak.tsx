import { Bell, ClipboardList, Home, Lightbulb, Trash2, Users, Wrench } from "lucide-react";
import {
  verwijderWerk, voegWerkToe, zetWerkStatus,
  bewaarPaspoort, verwijderAanbeveling, verwijderBehandeling, voegAanbevelingToe, voegBehandelingToe,
  zetAanbevelingStatus, zetAanvraagStatus, zetVerwijzingStatus,
} from "@/app/beheer/actions";
import { volgendeControle } from "@/lib/klantenzone/onderhoud";
import { fmtKort, fmtMaand, fmtMoment } from "@/lib/klantenzone/tijd";
import {
  AANVRAAG_LABEL, BEHANDELING_SOORTEN, PRIORITEIT_LABEL, WERK_STATUS_LABEL, WERK_UITLEG, type Klant, type WerkStatus,
} from "@/lib/klantenzone/types";
import { BevestigKnop } from "./beheer-client";
import kz from "./kz.module.css";

const VERWIJZING_LABEL = { nieuw: "Nieuw", gecontacteerd: "Gecontacteerd", klant: "Klant geworden", geen: "Geen interesse" } as const;
const AANBEVELING_STATUS = { open: "Open", aangevraagd: "Klant wil dit", gedaan: "Uitgevoerd", nietnu: "Klant: nu niet" } as const;

/** Aanvragen van de klant: bovenaan, want daar moet Yannick iets mee. */
export function BeheerAanvragen({ k }: { k: Klant }) {
  const lijst = k.aanvragen ?? [];
  if (!lijst.length) return null;
  const nieuw = lijst.filter((a) => a.status === "nieuw").length;
  return (
    <section className={kz.kaart} style={nieuw ? { border: "1px solid #E9C98F" } : undefined}>
      <h2 className={kz.kaartTitel} style={{ marginBottom: 12 }}><Bell size={18} /> Aanvragen van de klant {nieuw > 0 && <span className={`${kz.badge} ${kz.badgeAmber}`}>{nieuw} nieuw</span>}</h2>
      <ul className={kz.lijst}>
        {lijst.map((a) => (
          <li key={a.id} className={kz.rij} style={{ opacity: a.status === "behandeld" ? 0.55 : 1 }}>
            <div className={kz.rijMidden}>
              <p className={kz.rijTitel}>{AANVRAAG_LABEL[a.soort]}</p>
              {a.tekst && <p className={kz.rijSub} style={{ whiteSpace: "pre-line" }}>{a.tekst}</p>}
              <p className={kz.rijSub}>{fmtMoment(a.datum)}</p>
            </div>
            <form action={zetAanvraagStatus.bind(null, k.id, a.id, a.status === "nieuw" ? "behandeld" : "nieuw")}>
              <button className={`${kz.knop} ${kz.knopKlein} ${a.status === "nieuw" ? "" : kz.knopLicht}`}>{a.status === "nieuw" ? "Behandeld ✓" : "Terug op nieuw"}</button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BeheerDak({ k }: { k: Klant }) {
  const p = k.paspoort ?? {};
  const auto = volgendeControle({ ...k, volgendeControle: undefined });

  return (
    <>
      {/* ── Werken ── */}
      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 6 }}><ClipboardList size={18} /> Werken in dit project</h2>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 14 }}>
          Wat je bij deze klant uitvoert. Zet een werk op &quot;Klaar&quot; en het komt vanzelf in de onderhoudshistoriek.
        </p>
        {(k.werken ?? []).length > 0 && (
          <ul className={kz.lijst} style={{ marginBottom: 16 }}>
            {(k.werken ?? []).map((w) => (
              <li key={w.id} className={`${kz.rij} ${kz.rijWrap}`}>
                <div className={kz.rijMidden}>
                  <p className={kz.rijTitel}>{w.naam}</p>
                  <p className={kz.rijSub}>{w.datum ? fmtKort(w.datum) : "Nog geen datum"}{w.omschrijving ? ` · ${w.omschrijving}` : ""}</p>
                </div>
                <div className={kz.rijRechts}>
                  {(["gepland", "bezig", "klaar"] as WerkStatus[]).map((st) => (
                    <form key={st} action={zetWerkStatus.bind(null, k.id, w.id, st)}>
                      <button className={`${kz.knop} ${kz.knopKlein} ${w.status === st ? "" : kz.knopLicht}`}>{WERK_STATUS_LABEL[st]}</button>
                    </form>
                  ))}
                  <BevestigKnop actie={verwijderWerk.bind(null, k.id, w.id)} vraag="Werk verwijderen?"><Trash2 size={14} /></BevestigKnop>
                </div>
              </li>
            ))}
          </ul>
        )}
        <form action={voegWerkToe.bind(null, k.id)}>
          <div className={kz.velden}>
            <div className={kz.veld}>
              <label htmlFor="wnaam">Werk</label>
              <select id="wnaam" name="naam" className={kz.invoer}>
                {[...Object.keys(WERK_UITLEG), "Gevelreiniging"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </div>
            <div className={kz.veld}><label htmlFor="wdatum">Geplande dag (optioneel)</label><input id="wdatum" name="datum" type="date" className={kz.invoer} /></div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="womschr">Uitleg voor de klant (leeg = standaard)</label><input id="womschr" name="omschrijving" className={kz.invoer} placeholder="bv. Voor- en achterkant, inclusief nok" /></div>
          </div>
          <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopKlein}`}>Werk toevoegen</button></div>
        </form>
      </section>

      {/* ── Dakpaspoort ── */}
      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 6 }}><Home size={18} /> Mijn dak</h2>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 14 }}>De klant ziet dit bij &quot;Mijn dak&quot;.</p>
        <form action={bewaarPaspoort.bind(null, k.id)}>
          <div className={kz.velden}>
            <div className={`${kz.veld} ${kz.vol}`}>
              <label htmlFor="aandachtspunten">Waar je op let (één per regel)</label>
              <textarea id="aandachtspunten" name="aandachtspunten" defaultValue={p.aandachtspunten ?? ""} className={kz.invoer} placeholder={"Noordkant: veel schaduw, mos komt sneller terug\nNok: mortel in het oog houden"} />
            </div>
            <div className={`${kz.veld} ${kz.vol}`}>
              <label htmlFor="volgendeControle">Volgende controle (leeg = automatisch{auto ? `: ${fmtMaand(auto.datum)}` : ""})</label>
              <input id="volgendeControle" name="volgendeControle" type="date" defaultValue={k.volgendeControle ?? ""} className={kz.invoer} />
            </div>
          </div>
          <div className={kz.rijKnoppen}><button className={kz.knop}>Opslaan</button></div>
        </form>
      </section>

      {/* ── Behandelingen ── */}
      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 6 }}><Wrench size={18} /> Uitgevoerde behandelingen</h2>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 14 }}>De onderhoudshistoriek van het dak. De laatste behandeling bepaalt de volgende controle.</p>
        {(k.behandelingen ?? []).length > 0 && (
          <ul className={kz.lijst} style={{ marginBottom: 16 }}>
            {(k.behandelingen ?? []).map((b) => (
              <li key={b.id} className={kz.rij}>
                <div className={kz.rijMidden}>
                  <p className={kz.rijTitel}>{b.soort}</p>
                  <p className={kz.rijSub}>{fmtKort(b.datum)}{b.producten ? ` · ${b.producten}` : ""}{b.opmerking ? ` · ${b.opmerking}` : ""}</p>
                </div>
                <BevestigKnop actie={verwijderBehandeling.bind(null, k.id, b.id)} vraag="Behandeling verwijderen?"><Trash2 size={14} /></BevestigKnop>
              </li>
            ))}
          </ul>
        )}
        <form action={voegBehandelingToe.bind(null, k.id)}>
          <div className={kz.velden}>
            <div className={kz.veld}>
              <label htmlFor="bsoort">Wat</label>
              <select id="bsoort" name="soort" className={kz.invoer}>{BEHANDELING_SOORTEN.map((x) => <option key={x}>{x}</option>)}</select>
            </div>
            <div className={kz.veld}><label htmlFor="bdatum">Datum</label><input id="bdatum" name="datum" type="date" required className={kz.invoer} /></div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="bproducten">Gebruikte producten (optioneel)</label><input id="bproducten" name="producten" className={kz.invoer} /></div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="bopm">Opmerking voor de klant (optioneel)</label><input id="bopm" name="opmerking" className={kz.invoer} placeholder="bv. Volledig dak + goten, nok nagekeken" /></div>
          </div>
          <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopKlein}`}>Behandeling toevoegen</button></div>
        </form>
      </section>

      {/* ── Aanbevelingen ── */}
      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 6 }}><Lightbulb size={18} /> Aanbevelingen</h2>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 14 }}>
          Enkel bij een echte vaststelling. De klant kan met één klik &quot;Ja, graag&quot; antwoorden, en jij krijgt een mail.
        </p>
        {(k.aanbevelingen ?? []).length > 0 && (
          <ul className={kz.lijst} style={{ marginBottom: 16 }}>
            {(k.aanbevelingen ?? []).map((a) => (
              <li key={a.id} className={`${kz.rij} ${kz.rijWrap}`}>
                <div className={kz.rijMidden}>
                  <p className={kz.rijTitel}>{a.titel}</p>
                  <p className={kz.rijSub}>{PRIORITEIT_LABEL[a.prioriteit]} · {fmtKort(a.datum)} · <strong>{AANBEVELING_STATUS[a.status]}</strong></p>
                </div>
                <div className={kz.rijRechts}>
                  {a.status !== "gedaan" && (
                    <form action={zetAanbevelingStatus.bind(null, k.id, a.id, "gedaan")}><button className={`${kz.knop} ${kz.knopKlein}`}>Uitgevoerd</button></form>
                  )}
                  <BevestigKnop actie={verwijderAanbeveling.bind(null, k.id, a.id)} vraag="Aanbeveling verwijderen?"><Trash2 size={14} /></BevestigKnop>
                </div>
              </li>
            ))}
          </ul>
        )}
        <form action={voegAanbevelingToe.bind(null, k.id)}>
          <div className={kz.velden}>
            <div className={kz.veld}><label htmlFor="atitel">Wat zag je</label><input id="atitel" name="titel" required className={kz.invoer} placeholder="bv. Dakgoot achteraan vol bladeren" /></div>
            <div className={kz.veld}>
              <label htmlFor="aprio">Hoe dringend</label>
              <select id="aprio" name="prioriteit" defaultValue="aanbevolen" className={kz.invoer}>
                <option value="info">Ter info</option><option value="aanbevolen">Aanbevolen</option><option value="dringend">Dringend</option>
              </select>
            </div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="atekst">Uitleg en voorstel</label><textarea id="atekst" name="tekst" className={kz.invoer} placeholder="bv. Het water kan niet weg en loopt over de gevel. Ik kan de goten reinigen bij mijn volgende passage in je straat." /></div>
            {k.fotos.length > 0 && (
              <div className={`${kz.veld} ${kz.vol}`}>
                <label htmlFor="afoto">Foto erbij (optioneel)</label>
                <select id="afoto" name="fotoUrl" className={kz.invoer} defaultValue="">
                  <option value="">Geen foto</option>
                  {k.fotos.map((f, i) => <option key={f.id} value={f.url}>Foto {i + 1}: {f.bijschrift ?? f.fase} ({fmtKort(f.datum)})</option>)}
                </select>
              </div>
            )}
          </div>
          <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopKlein}`}>Aanbeveling toevoegen</button></div>
        </form>
      </section>

      <div style={{ marginTop: 14 }}>
        {/* ── Doorverwijzingen ── */}
        <section className={kz.kaart}>
          <h2 className={kz.kaartTitel} style={{ marginBottom: 6 }}><Users size={18} /> Via de buurlink ({(k.verwijzingen ?? []).length})</h2>
          {k.refCode && <p className={kz.sub} style={{ marginTop: 0 }}>Buurlink: /buur/{k.refCode}</p>}
          {(k.verwijzingen ?? []).length === 0 ? (
            <p className={kz.leeg}>Nog niemand via de buurlink van {k.voornaam}.</p>
          ) : (
            <ul className={kz.lijst}>
              {(k.verwijzingen ?? []).map((v) => (
                <li key={v.id} className={`${kz.rij} ${kz.rijWrap}`}>
                  <div className={kz.rijMidden}>
                    <p className={kz.rijTitel}>{v.naam}</p>
                    <p className={kz.rijSub}><a href={`tel:${v.telefoon}`} style={{ color: "inherit" }}>{v.telefoon}</a>{v.adres ? ` · ${v.adres}` : ""}</p>
                    {v.bericht && <p className={kz.rijSub}>&quot;{v.bericht}&quot;</p>}
                    <p className={kz.rijSub}>{fmtMoment(v.datum)}</p>
                  </div>
                  <div className={kz.rijKnoppen} style={{ marginTop: 6 }}>
                    {(["gecontacteerd", "klant", "geen"] as const).map((st) => (
                      <form key={st} action={zetVerwijzingStatus.bind(null, k.id, v.id, st)}>
                        <button className={`${kz.knop} ${kz.knopKlein} ${v.status === st ? "" : kz.knopLicht}`}>{VERWIJZING_LABEL[st]}</button>
                      </form>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
