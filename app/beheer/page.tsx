import Link from "next/link";
import { Bell, Plus, Users, Wrench } from "lucide-react";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { controleBinnen, volgendeControle } from "@/lib/klantenzone/onderhoud";
import { listKlanten, opslagStatus } from "@/lib/klantenzone/store";
import { fmtDag, fmtKort, fmtMaand, fmtMoment } from "@/lib/klantenzone/tijd";
import { AANVRAAG_LABEL, FASE_LABEL } from "@/lib/klantenzone/types";
import { maakKlant } from "./actions";
import kz from "@/components/klantenzone/kz.module.css";

export default async function BeheerOverzicht() {
  if (!(await isBeheerder())) return null;
  const opslag = opslagStatus();
  const klaar = opslag.data !== "ontbreekt";
  const klanten = klaar ? await listKlanten() : [];

  // Alles waar Yannick iets mee moet, over alle klanten heen
  type Taak = { klantId: string; naam: string; icoon: "bel" | "buur" | "controle"; tekst: string; datum: string };
  const taken: Taak[] = [];
  for (const k of klanten) {
    const naam = `${k.voornaam} ${k.achternaam}`.trim();
    for (const a of k.aanvragen ?? []) {
      if (a.status === "nieuw") taken.push({ klantId: k.id, naam, icoon: "bel", tekst: `${AANVRAAG_LABEL[a.soort]}${a.tekst ? `: ${a.tekst}` : ""}`, datum: a.datum });
    }
    for (const v of k.verwijzingen ?? []) {
      if (v.status === "nieuw") taken.push({ klantId: k.id, naam, icoon: "buur", tekst: `Nieuwe buur: ${v.naam} (${v.telefoon})`, datum: v.datum });
    }
    const c = volgendeControle(k);
    if (c && controleBinnen(c.datum) <= 30 && !(k.aanvragen ?? []).some((a) => a.soort === "onderhoud" && a.status === "nieuw")) {
      taken.push({ klantId: k.id, naam, icoon: "controle", tekst: `Controle ${controleBinnen(c.datum) < 0 ? "was" : "is"} aangeraden in ${fmtMaand(c.datum)}${k.dakzorg?.actief ? " (Dakzorg)" : ""}`, datum: c.datum });
    }
  }
  taken.sort((a, b) => b.datum.localeCompare(a.datum));

  return (
    <>
      {(opslag.data === "ontbreekt" || opslag.bestanden === "ontbreekt") && (
        <p className={kz.melding}>
          De opslag is nog niet gekoppeld.{" "}
          {opslag.data === "ontbreekt" && <>Koppel <strong>Upstash Redis</strong> (Vercel → Storage). </>}
          {opslag.bestanden === "ontbreekt" && <>Koppel <strong>Vercel Blob</strong> voor foto&apos;s en pdf&apos;s. </>}
          Daarna opnieuw publiceren.
        </p>
      )}
      {opslag.data === "lokaal" && (
        <p className={kz.melding}>Testmodus: gegevens staan lokaal op deze pc (map .data).</p>
      )}

      {taken.length > 0 && (
        <section className={kz.kaart} style={{ border: "1px solid #E9C98F" }}>
          <h2 className={kz.kaartTitel} style={{ marginBottom: 12 }}><Bell size={18} /> Te doen ({taken.length})</h2>
          <ul className={kz.lijst}>
            {taken.map((t, i) => (
              <li key={i} className={kz.rij}>
                <span className={kz.rijIcoon}>{t.icoon === "bel" ? <Bell size={17} /> : t.icoon === "buur" ? <Users size={17} /> : <Wrench size={17} />}</span>
                <div className={kz.rijMidden}>
                  <Link href={`/beheer/${t.klantId}`} className={kz.rijTitel} style={{ color: "inherit", textDecoration: "none" }}>{t.naam}</Link>
                  <p className={kz.rijSub}>{t.tekst}</p>
                </div>
                <span className={kz.rijSub}>{t.icoon === "controle" ? "" : fmtMoment(t.datum)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={kz.kaart}>
        <div className={kz.kaartKop}>
          <h1 className={kz.kaartTitel}>Klanten ({klanten.length})</h1>
        </div>
        {klanten.length === 0 ? (
          <p className={kz.leeg}>Nog geen klanten. Maak hieronder je eerste dossier aan.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={kz.tabel}>
              <thead>
                <tr>
                  <th>Klant</th>
                  <th>Stap</th>
                  <th className={kz.verbergMobiel}>Start</th>
                  <th className={kz.verbergMobiel}>Bijgewerkt</th>
                </tr>
              </thead>
              <tbody>
                {klanten.map((k) => (
                  <tr key={k.id}>
                    <td>
                      <Link href={`/beheer/${k.id}`}>{k.voornaam} {k.achternaam}</Link>
                      <div style={{ fontSize: 13, color: "#545454" }}>{k.dienst}{k.adres ? ` · ${k.adres}` : ""}</div>
                    </td>
                    <td>
                      <span className={`${kz.badge} ${k.fase === "klaar" || k.fase === "nazorg" ? kz.badgeGroen : ""}`}>{FASE_LABEL[k.fase]}</span>
                      {k.dakzorg?.actief && <span className={`${kz.badge} ${kz.badgeGroen}`} style={{ marginLeft: 4 }}>Dakzorg</span>}
                    </td>
                    <td className={`${kz.verbergMobiel} ${kz.eerste}`}>
                      {k.start ? (k.start.precisie === "dag" ? fmtDag(k.start.datum) : `± ${fmtKort(k.start.datum)}`) : "—"}
                    </td>
                    <td className={kz.verbergMobiel}>{fmtKort(k.bijgewerkt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {klaar && (
        <section className={kz.kaart}>
          <h2 className={kz.kaartTitel} style={{ marginBottom: 14 }}><Plus size={18} /> Nieuwe klant</h2>
          <form action={maakKlant}>
            <div className={kz.velden}>
              <div className={kz.veld}><label htmlFor="voornaam">Voornaam *</label><input id="voornaam" name="voornaam" className={kz.invoer} required /></div>
              <div className={kz.veld}><label htmlFor="achternaam">Achternaam</label><input id="achternaam" name="achternaam" className={kz.invoer} /></div>
              <div className={kz.veld}><label htmlFor="telefoon">Gsm (voor WhatsApp)</label><input id="telefoon" name="telefoon" className={kz.invoer} inputMode="tel" placeholder="0470 12 34 56" /></div>
              <div className={kz.veld}><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" className={kz.invoer} /></div>
              <div className={kz.veld}><label htmlFor="adres">Adres van de werf</label><input id="adres" name="adres" className={kz.invoer} placeholder="Straat 1, 2000 Antwerpen" /></div>
              <div className={kz.veld}>
                <label htmlFor="dienst">Dienst</label>
                <select id="dienst" name="dienst" className={kz.invoer} defaultValue="Dakreiniging">
                  <option>Dakreiniging</option>
                  <option>Dakreiniging en dakcoating</option>
                  <option>Dakcoating</option>
                  <option>MOS-X Dakzorg</option>
                  <option>Gevelreiniging</option>
                </select>
              </div>
            </div>
            <div className={kz.rijKnoppen}><button className={kz.knop}>Dossier aanmaken</button></div>
          </form>
        </section>
      )}
    </>
  );
}
