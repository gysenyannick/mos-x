import Link from "next/link";
import {
  Bell, CalendarClock, CalendarDays, CheckCircle2, ChevronRight, Hammer, Plus, ShieldCheck, Users, Wrench,
} from "lucide-react";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { controleBinnen, volgendeControle } from "@/lib/klantenzone/onderhoud";
import { listKlanten, opslagStatus } from "@/lib/klantenzone/store";
import { fmtEuro, fmtKort, fmtMaand, fmtMoment } from "@/lib/klantenzone/tijd";
import { AANVRAAG_LABEL, FASE_LABEL } from "@/lib/klantenzone/types";
import { maakKlant } from "./actions";
import kz from "@/components/klantenzone/kz.module.css";

export default async function BeheerOverzicht({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
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

  // Cijferkaarten bovenaan; klikken filtert de tabel (zoals in Beavr)
  const filters = [
    { id: "alle", label: "Alle klanten", icoon: Users, tint: kz.tintPaars, lijst: klanten },
    { id: "gepland", label: "Planning", icoon: CalendarDays, tint: kz.tintBlauw, lijst: klanten.filter((k) => k.fase === "gepland") },
    { id: "bezig", label: "Uitvoering", icoon: Hammer, tint: kz.tintGroen, lijst: klanten.filter((k) => k.fase === "bezig") },
    { id: "nazorg", label: "Oplevering en nazorg", icoon: CheckCircle2, tint: kz.tintGroen, lijst: klanten.filter((k) => k.fase === "klaar" || k.fase === "nazorg") },
    { id: "dakzorg", label: "Dakzorg-leden", icoon: ShieldCheck, tint: kz.tintOranje, lijst: klanten.filter((k) => k.dakzorg?.actief) },
  ];
  const gevraagd = (await searchParams).filter;
  const filter = filters.some((f) => f.id === gevraagd) ? gevraagd! : "alle";
  const zichtbaar = filters.find((f) => f.id === filter)!.lijst;

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

      <div className={kz.dashKop}>
        <h1 className={kz.dashTitel}>Klanten<span className={kz.telBol}>{klanten.length}</span></h1>
        <div className={kz.dashActies}>
          <Link href="/beheer/momenten" className={`${kz.knop} ${kz.knopLicht}`}><CalendarClock size={16} /> Vrije momenten</Link>
          <Link href="#nieuw" className={`${kz.knop} ${kz.knopPrimair}`}><Plus size={16} /> Nieuwe klant</Link>
        </div>
      </div>

      <div className={kz.statRij6}>
        {filters.map((f) => (
          <Link key={f.id} href={f.id === "alle" ? "/beheer" : `/beheer?filter=${f.id}`} scroll={false}
            className={`${kz.stat} ${filter === f.id ? kz.statAan : ""}`} aria-current={filter === f.id ? "true" : undefined}>
            <span className={kz.statTop}><span className={`${kz.statIcoon} ${f.tint}`}><f.icoon size={17} /></span><span className={kz.statGetal}>{f.lijst.length}</span></span>
            <span className={kz.statLabel}>{f.label}</span>
          </Link>
        ))}
      </div>

      {taken.length > 0 && (
        <section className={kz.kaart} style={{ borderColor: "#E9C98F" }}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><Bell size={18} /> Te doen</h2>
            <span className={`${kz.badge} ${kz.badgeAmber}`}>{taken.length}</span>
          </div>
          <ul className={kz.lijst}>
            {taken.map((t, i) => (
              <li key={i} className={kz.rij}>
                <span className={`${kz.statIcoon} ${t.icoon === "bel" ? kz.tintOranje : t.icoon === "buur" ? kz.tintBlauw : kz.tintGroen}`}>
                  {t.icoon === "bel" ? <Bell size={16} /> : t.icoon === "buur" ? <Users size={16} /> : <Wrench size={16} />}
                </span>
                <div className={kz.rijMidden}>
                  <Link href={`/beheer/${t.klantId}`} className={kz.rijTitel} style={{ color: "inherit", textDecoration: "none" }}>{t.naam}</Link>
                  <p className={kz.rijSub}>{t.tekst}</p>
                </div>
                <span className={`${kz.rijSub} ${kz.verbergMobiel}`}>{t.icoon === "controle" ? "" : fmtMoment(t.datum)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={kz.tabelKaart}>
        {zichtbaar.length === 0 ? (
          <p className={kz.leeg} style={{ margin: 16 }}>{klanten.length ? "Geen klanten in deze selectie." : "Nog geen klanten. Maak hieronder je eerste dossier aan."}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={kz.tabel}>
              <thead>
                <tr>
                  <th>Klant</th>
                  <th className={kz.verbergMobiel}>Dienst</th>
                  <th className={kz.verbergMobiel}>Start</th>
                  <th>Stap</th>
                  <th className={kz.verbergMobiel} style={{ textAlign: "right" }}>Open</th>
                  <th aria-label="Openen" />
                </tr>
              </thead>
              <tbody>
                {zichtbaar.map((k) => {
                  const open = k.documenten.filter((d) => d.status === "open").reduce((s, d) => s + (d.bedrag ?? 0), 0);
                  return (
                    <tr key={k.id}>
                      <td>
                        <Link href={`/beheer/${k.id}`} className={kz.tabelNaam}>{k.voornaam} {k.achternaam}</Link>
                        <div className={kz.tabelSub}>{k.adres}</div>
                      </td>
                      <td className={kz.verbergMobiel}>{k.dienst}</td>
                      <td className={kz.verbergMobiel} style={{ whiteSpace: "nowrap" }}>{k.start ? (k.start.precisie === "dag" ? fmtKort(k.start.datum) : `± ${fmtMaand(k.start.datum)}`) : "—"}</td>
                      <td>
                        <span className={`${kz.badge} ${k.fase === "bezig" ? kz.badgeGroen : ""}`}>{FASE_LABEL[k.fase]}</span>
                        {k.dakzorg?.actief && <span className={`${kz.badge} ${kz.badgeGroen}`} style={{ marginLeft: 4 }}>Dakzorg</span>}
                      </td>
                      <td className={kz.verbergMobiel} style={{ textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>{open ? fmtEuro(open) : "—"}</td>
                      <td style={{ textAlign: "right" }}><Link href={`/beheer/${k.id}`} className={kz.icoonKnop} aria-label={`Open ${k.voornaam}`}><ChevronRight size={16} /></Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {klaar && (
        <section className={`${kz.kaart} ${kz.balans}`} id="nieuw">
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
