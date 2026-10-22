import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft, Camera, Clock, ExternalLink, FileText, KeyRound, MessagesSquare, NotebookPen, Save, Trash2 } from "lucide-react";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { getInstellingen, getKlant } from "@/lib/klantenzone/store";
import { effectief } from "@/lib/klantenzone/auto";
import { fmtDag, fmtEuro, fmtKort, fmtUur } from "@/lib/klantenzone/tijd";
import { DOC_IS_FACTUUR, DOC_TYPE_LABEL, FASES, FASE_LABEL } from "@/lib/klantenzone/types";
import FotoGalerij from "@/components/klantenzone/foto-galerij";
import { BeheerAanvragen, BeheerDak } from "@/components/klantenzone/beheer-dak";
import { BevestigKnop, DocumentUpload, FotoUpload, KopieerLink } from "@/components/klantenzone/beheer-client";
import {
  bewaarKlant, nieuweLink, verwijderAfspraak, verwijderDocument, verwijderFoto, verwijderKlant,
  opmerkingGezien, verwijderNotitie, verwijderOpmerking, voegAfspraakToe, voegNotitieToe, voegOpmerkingToe,
  zetDocumentStatus,
} from "../actions";
import kz from "@/components/klantenzone/kz.module.css";

/** Belgisch gsm-nummer → internationaal formaat voor wa.me */
function waNummer(tel: string): string | null {
  let d = tel.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  else if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = "32" + d.slice(1);
  return d.length >= 9 ? d : null;
}

export default async function BeheerKlant({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isBeheerder())) return null;
  const { id } = await params;
  const k = await getKlant(id);
  if (!k) notFound();
  const auto = effectief(k);
  const reviewUrl = (await getInstellingen()).googleReviewUrl;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "www.mos-x.be";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const link = `${proto}://${host}/klant/${k.id}`;
  const wa = waNummer(k.telefoon);
  const waTekst = `Dag ${k.voornaam}, hier is je persoonlijke pagina bij MOS-X. Daar volg je je dak op: planning, foto's, documenten en garantie. Bewaar deze link goed:\n${link}\n\nGroetjes, Yannick`;
  const waUpdate = `Dag ${k.voornaam}, er is nieuws over je dak: kijk even op je pagina 👉 ${link}`;

  const bewaar = bewaarKlant.bind(null, k.id);
  const afspraakToe = voegAfspraakToe.bind(null, k.id);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <Link href="/beheer" className={kz.icoonKnop} aria-label="Terug"><ArrowLeft size={18} /></Link>
        <h1 className={kz.kaartTitel} style={{ fontSize: 22, flex: "1 1 200px" }}>{k.voornaam} {k.achternaam}</h1>
        <a href={`/klant/${k.id}`} target="_blank" className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`}><ExternalLink size={15} /> Bekijk als klant</a>
      </div>

      {/* ── Link delen ── */}
      <section className={kz.kaart}>
        <p className={kz.label}>Persoonlijke link van de klant</p>
        <KopieerLink url={link} />
        <div className={kz.rijKnoppen}>
          {wa ? (
            <>
              <a className={kz.knop} style={{ background: "#25D366" }} target="_blank" rel="noopener noreferrer"
                href={`https://wa.me/${wa}?text=${encodeURIComponent(waTekst)}`}>Stuur link via WhatsApp</a>
              <a className={`${kz.knop} ${kz.knopLicht}`} target="_blank" rel="noopener noreferrer"
                href={`https://wa.me/${wa}?text=${encodeURIComponent(waUpdate)}`}>Stuur update-berichtje</a>
              {reviewUrl && (
                <a className={`${kz.knop} ${kz.knopLicht}`} target="_blank" rel="noopener noreferrer"
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(`Dag ${k.voornaam}, bedankt om voor MOS-X te kiezen! Ben je tevreden over je dak? Een korte review helpt me enorm: ${reviewUrl}

Groetjes, Yannick`)}`}>Vraag een review</a>
              )}
            </>
          ) : (
            <p className={kz.sub} style={{ margin: 0 }}>Vul een gsm-nummer in om de link via WhatsApp te sturen.</p>
          )}
        </div>
      </section>

      <BeheerAanvragen k={k} />

      <div className={kz.grid2} style={{ alignItems: "start", marginTop: 14 }}>
        {/* ── Gegevens & status ── */}
        <section className={kz.kaart}>
          <h2 className={kz.kaartTitel} style={{ marginBottom: 14 }}>Status en gegevens</h2>
          <form action={bewaar}>
            <div className={kz.velden}>
              <div className={`${kz.veld} ${kz.vol}`}>
                <label htmlFor="fase">Stap {auto.fase !== k.fase && <span style={{ color: "#7AB54E", fontWeight: 600 }}>(nu automatisch: {FASE_LABEL[auto.fase]})</span>}</label>
                <select id="fase" name="fase" defaultValue={k.fase} className={kz.invoer}>
                  {FASES.map((f) => <option key={f} value={f}>{FASE_LABEL[f]}</option>)}
                </select>
              </div>
              <div className={kz.veld}>
                <label htmlFor="startDatum">Startdatum</label>
                <input id="startDatum" name="startDatum" type="date" defaultValue={k.start?.datum ?? ""} className={kz.invoer} />
              </div>
              <div className={kz.veld}>
                <label htmlFor="startPrecisie">Zekerheid</label>
                <select id="startPrecisie" name="startPrecisie" defaultValue={k.start?.precisie ?? "dag"} className={kz.invoer}>
                  <option value="dag">Vaste dag</option>
                  <option value="week">Voorlopig: die week</option>
                  <option value="maand">Voorlopig: die maand</option>
                </select>
              </div>
              <div className={`${kz.veld} ${kz.vol}`}>
                <label htmlFor="bericht">Persoonlijk bericht bovenaan (optioneel)</label>
                <textarea id="bericht" name="bericht" defaultValue={k.bericht ?? ""} className={kz.invoer}
                  placeholder="bv. Dag Jan, ik kom maandag rond 8u. Zorg je dat de oprit vrij is? Tot dan!" />
              </div>
              <div className={kz.veld}><label htmlFor="voornaam">Voornaam</label><input id="voornaam" name="voornaam" defaultValue={k.voornaam} className={kz.invoer} required /></div>
              <div className={kz.veld}><label htmlFor="achternaam">Achternaam</label><input id="achternaam" name="achternaam" defaultValue={k.achternaam} className={kz.invoer} /></div>
              <div className={kz.veld}><label htmlFor="telefoon">Gsm</label><input id="telefoon" name="telefoon" defaultValue={k.telefoon} className={kz.invoer} inputMode="tel" /></div>
              <div className={kz.veld}><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" defaultValue={k.email} className={kz.invoer} /></div>
              <div className={kz.veld}><label htmlFor="adres">Adres</label><input id="adres" name="adres" defaultValue={k.adres} className={kz.invoer} /></div>
              <div className={kz.veld}><label htmlFor="dienst">Dienst</label><input id="dienst" name="dienst" defaultValue={k.dienst} className={kz.invoer} /></div>
              <div className={kz.veld}><label htmlFor="mosvrijJaren">Jaar mosvrij</label><input id="mosvrijJaren" name="mosvrijJaren" type="number" min={0} defaultValue={k.garantie.mosvrijJaren} className={kz.invoer} /></div>
              <div className={kz.veld}><label htmlFor="coatingJaren">Jaar garantie coating (0 = geen)</label><input id="coatingJaren" name="coatingJaren" type="number" min={0} defaultValue={k.garantie.coatingJaren} className={kz.invoer} /></div>
              <div className={`${kz.veld} ${kz.vol}`}>
                <label htmlFor="garantieVanaf">Garantie loopt vanaf (leeg = bij &quot;Klaar&quot; automatisch vandaag)</label>
                <input id="garantieVanaf" name="garantieVanaf" type="date" defaultValue={k.garantie.vanaf ?? ""} className={kz.invoer} />
              </div>
            </div>
            <div className={kz.rijKnoppen}><button className={kz.knop}><Save size={15} /> Opslaan</button></div>
          </form>
        </section>

        <div>
          {/* ── Afspraken ── */}
          <section className={kz.kaart} style={{ marginTop: 0 }}>
            <h2 className={kz.kaartTitel} style={{ marginBottom: 14 }}><Clock size={18} /> Afspraken</h2>
            {k.afspraken.length > 0 && (
              <ul className={kz.lijst} style={{ marginBottom: 14 }}>
                {k.afspraken.map((a) => (
                  <li key={a.id} className={kz.rij}>
                    <div className={kz.rijMidden}>
                      <p className={kz.rijTitel}>{a.titel}</p>
                      <p className={`${kz.rijSub} ${kz.eerste}`}>{fmtDag(a.start, true)} · {fmtUur(a.start)}</p>
                    </div>
                    <BevestigKnop actie={verwijderAfspraak.bind(null, k.id, a.id)} vraag="Afspraak verwijderen?"><Trash2 size={14} /></BevestigKnop>
                  </li>
                ))}
              </ul>
            )}
            <form action={afspraakToe}>
              <div className={kz.velden}>
                <div className={`${kz.veld} ${kz.vol}`}>
                  <label htmlFor="titel">Wat</label>
                  <select id="titel" name="titel" className={kz.invoer} defaultValue="Plaatsbezoek">
                    <option>Plaatsbezoek</option>
                    <option>Start werken</option>
                    <option>Dakreiniging</option>
                    <option>Dakcoating</option>
                    <option>Oplevering</option>
                    <option>Nazorgbezoek</option>
                  </select>
                </div>
                <div className={kz.veld}><label htmlFor="datum">Datum</label><input id="datum" name="datum" type="date" className={kz.invoer} required /></div>
                <div className={kz.veld}><label htmlFor="uur">Uur</label><input id="uur" name="uur" type="time" defaultValue="09:00" className={kz.invoer} /></div>
                <div className={kz.veld}>
                  <label htmlFor="duurMin">Duur</label>
                  <select id="duurMin" name="duurMin" className={kz.invoer} defaultValue="60">
                    <option value="30">30 min</option>
                    <option value="60">1 uur</option>
                    <option value="120">2 uur</option>
                    <option value="240">Halve dag</option>
                    <option value="480">Hele dag</option>
                  </select>
                </div>
                <div className={`${kz.veld} ${kz.vol}`}>
                  <label htmlFor="info">Info voor de klant (leeg = standaardtekst)</label>
                  <textarea id="info" name="info" className={kz.invoer} placeholder="bv. Ik kom met de hoogwerker, zet je auto even op straat?" />
                </div>
              </div>
              <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopKlein}`}>Afspraak toevoegen</button></div>
            </form>
          </section>

          {/* ── Documenten ── */}
          <section className={kz.kaart}>
            <h2 className={kz.kaartTitel} style={{ marginBottom: 14 }}><FileText size={18} /> Offertes en facturen</h2>
            {k.documenten.length > 0 && (
              <ul className={kz.lijst} style={{ marginBottom: 16 }}>
                {k.documenten.map((d) => (
                  <li key={d.id} className={`${kz.rij} ${kz.rijWrap}`}>
                    <div className={kz.rijMidden}>
                      <a href={d.url} target="_blank" className={kz.rijTitel} style={{ color: "inherit" }}>{d.titel}</a>
                      <p className={kz.rijSub}>{DOC_TYPE_LABEL[d.type]} · {fmtKort(d.datum)}{d.bedrag ? ` · ${fmtEuro(d.bedrag)}` : ""}</p>
                    </div>
                    <div className={kz.rijRechts}>
                      {DOC_IS_FACTUUR(d.type) && (
                        d.status === "betaald" ? (
                          <form action={zetDocumentStatus.bind(null, k.id, d.id, "open")}>
                            <button className={`${kz.badge} ${kz.badgeGroen}`} style={{ border: 0, cursor: "pointer" }} title="Klik om terug op open te zetten">Betaald ✓</button>
                          </form>
                        ) : (
                          <form action={zetDocumentStatus.bind(null, k.id, d.id, "betaald")}>
                            <button className={`${kz.knop} ${kz.knopKlein}`}>Markeer betaald</button>
                          </form>
                        )
                      )}
                      <BevestigKnop actie={verwijderDocument.bind(null, k.id, d.id)} vraag="Document verwijderen?"><Trash2 size={14} /></BevestigKnop>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <DocumentUpload klantId={k.id} />
          </section>
        </div>
      </div>

      <BeheerDak k={k} />

      {/* ── Opmerkingen (Mijn dak) ── */}
      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 6 }}><MessagesSquare size={18} /> Opmerkingen en meldingen</h2>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 14 }}>
          De klant ziet dit bij &quot;Mijn dak&quot;. Een belangrijke melding staat daar bovenaan, in het oog springend.
        </p>
        {(k.opmerkingen ?? []).length > 0 && (
          <ul className={kz.gesprek}>
            {(k.opmerkingen ?? []).map((o) => (
              <li key={o.id} className={o.van === "klant" ? kz.gesprekYannick : kz.gesprekKlant}>
                <div className={kz.gesprekBallon} style={o.belangrijk ? { background: "#FFF8E8", border: "1px solid #F1D9A6" } : undefined}>
                  <p>{o.tekst}</p>
                  <span>
                    {o.van === "klant" ? k.voornaam : o.belangrijk ? "Jij · belangrijke melding" : "Jij"} · {fmtKort(o.datum)}
                    {o.nieuw && <strong style={{ color: "#B7791F" }}> · nieuw</strong>}
                  </span>
                </div>
                <BevestigKnop actie={verwijderOpmerking.bind(null, k.id, o.id)} vraag="Opmerking verwijderen?"><Trash2 size={13} /></BevestigKnop>
              </li>
            ))}
          </ul>
        )}
        <form action={voegOpmerkingToe.bind(null, k.id)}>
          <div className={kz.veld}>
            <label htmlFor="optekst">Antwoord of melding</label>
            <textarea id="optekst" name="tekst" required className={kz.invoer} placeholder="bv. Na de storm van gisteren heb ik je dak van op straat bekeken: alles ligt goed." />
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, fontSize: 14 }}>
            <input type="checkbox" name="belangrijk" value="ja" /> Belangrijke melding (bovenaan bij de klant)
          </label>
          <div className={kz.rijKnoppen}>
            <button className={`${kz.knop} ${kz.knopKlein}`}>Versturen</button>
          </div>
        </form>
        {(k.opmerkingen ?? []).some((o) => o.nieuw) && (
          <form action={opmerkingGezien.bind(null, k.id)} style={{ marginTop: 8 }}>
            <button className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`}>Gezien, geen antwoord nodig</button>
          </form>
        )}
      </section>

      {/* ── Notities ── */}
      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 6 }}><NotebookPen size={18} /> Notities voor de klant ({(k.notities ?? []).length})</h2>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 14 }}>Verschijnen in het logboek van de klant: wat je zag op het dak, onderhoudstips, gemaakte afspraken.</p>
        <form action={voegNotitieToe.bind(null, k.id)}>
          <div className={kz.velden}>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="ntitel">Titel (optioneel)</label><input id="ntitel" name="titel" className={kz.invoer} placeholder="bv. Twee gebroken pannen vervangen" /></div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="ntekst">Notitie</label><textarea id="ntekst" name="tekst" className={kz.invoer} required placeholder="bv. Aan de noordkant lagen twee pannen gebarsten. Die heb ik meteen vervangen, zonder extra kosten." /></div>
          </div>
          <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopKlein}`}>Notitie toevoegen</button></div>
        </form>
        {(k.notities ?? []).length > 0 && (
          <ul className={kz.lijst} style={{ marginTop: 16 }}>
            {(k.notities ?? []).map((n) => (
              <li key={n.id} className={kz.rij} style={{ alignItems: "flex-start" }}>
                <div className={kz.rijMidden}>
                  {n.titel && <p className={kz.rijTitel}>{n.titel}</p>}
                  <p className={kz.notitieTekst} style={{ fontSize: 14, marginTop: n.titel ? 2 : 0 }}>{n.tekst}</p>
                  <p className={kz.rijSub}>{fmtKort(n.datum)}</p>
                </div>
                <BevestigKnop actie={verwijderNotitie.bind(null, k.id, n.id)} vraag="Notitie verwijderen?"><Trash2 size={14} /></BevestigKnop>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Foto's ── */}
      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 14 }}><Camera size={18} /> Werffoto&apos;s ({k.fotos.length})</h2>
        <FotoUpload klantId={k.id} />
        {k.fotos.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <FotoGalerij fotos={k.fotos} onVerwijder={verwijderFoto.bind(null, k.id)} />
          </div>
        )}
      </section>

      {/* ── Gevarenzone ── */}
      <section className={kz.kaart}>
        <h2 className={kz.kaartTitel} style={{ marginBottom: 8 }}>Link en dossier</h2>
        <p className={kz.sub} style={{ marginTop: 0 }}>
          Nieuwe link maken: de oude link werkt dan niet meer (handig als hij bij de verkeerde persoon belandde).
        </p>
        <div className={kz.rijKnoppen}>
          <BevestigKnop actie={nieuweLink.bind(null, k.id)} vraag="Nieuwe link maken? De oude link werkt daarna niet meer." klein={false}>
            <KeyRound size={15} /> Nieuwe link
          </BevestigKnop>
          <BevestigKnop actie={verwijderKlant.bind(null, k.id)} vraag={`Dossier van ${k.voornaam} definitief verwijderen, met alle foto's en documenten?`} klein={false}>
            <Trash2 size={15} /> Dossier verwijderen
          </BevestigKnop>
        </div>
      </section>
    </>
  );
}
