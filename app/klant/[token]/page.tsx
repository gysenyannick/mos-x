import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays, Camera, FileText, ShieldCheck, Clock, Download, Leaf, Sparkles, History, MapPin,
} from "lucide-react";
import { getKlant, getMomenten } from "@/lib/klantenzone/store";
import {
  brusselNaarDate, dagenTot, nuMs, fmtDag, fmtEuro, fmtKort, fmtMaand, fmtUur, groet, maandagVan, plusJaren, vandaag,
} from "@/lib/klantenzone/tijd";
import {
  DOC_TYPE_LABEL, FASES, FASE_LABEL, FASE_UITLEG, VERZET_UREN, type Klant,
} from "@/lib/klantenzone/types";
import FotoGalerij from "@/components/klantenzone/foto-galerij";
import UploadKnop from "@/components/klantenzone/upload";
import VerzetKnop from "@/components/klantenzone/verzet-knop";
import kz from "@/components/klantenzone/kz.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jouw klantenzone | MOS-X",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const WA_NUMMER = "32468352869";
const YANNICK_FOTO = "/images/Yannick%20foto%20op%20dak.JPEG";

function waLink(k: Klant) {
  const tekst = `Hallo Yannick, ik ben ${k.voornaam} ${k.achternaam}`.trim() + (k.adres ? ` (${k.adres})` : "") + ". ";
  return `https://wa.me/${WA_NUMMER}?text=${encodeURIComponent(tekst)}`;
}

function WaIcoon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" />
    </svg>
  );
}

function Startdatum({ k }: { k: Klant }) {
  if (!k.start) {
    return (
      <>
        <p className={kz.groot}>Nog te plannen</p>
        <p className={kz.sub}>Zodra je startdatum vastligt, zie je hem hier en stuur ik je een berichtje.</p>
      </>
    );
  }
  const { datum, precisie } = k.start;
  if (precisie === "maand") {
    return (
      <>
        <p className={kz.groot}>{fmtMaand(datum)}</p>
        <p className={kz.sub}><span className={`${kz.badge} ${kz.badgeAmber}`}>Voorlopig</span> De exacte dag laat ik je zo snel mogelijk weten.</p>
      </>
    );
  }
  if (precisie === "week") {
    return (
      <>
        <p className={kz.groot}>Week van {fmtDag(maandagVan(datum)).replace(/^\S+\s/, "")}</p>
        <p className={kz.sub}><span className={`${kz.badge} ${kz.badgeAmber}`}>Voorlopig</span> De exacte dag laat ik je zo snel mogelijk weten.</p>
      </>
    );
  }
  const d = dagenTot(datum);
  return (
    <>
      <p className={kz.groot}>{fmtDag(datum)}</p>
      <p className={kz.sub}>
        <span className={`${kz.badge} ${kz.badgeGroen}`}>Vastgelegd</span>{" "}
        {d > 1 ? `Nog ${d} dagen.` : d === 1 ? "Morgen!" : d === 0 ? "Vandaag!" : `Gestart op ${fmtKort(datum)}.`}
      </p>
    </>
  );
}

function Garantie({ k }: { k: Klant }) {
  const { mosvrijJaren, coatingJaren, vanaf } = k.garantie;
  const items = [
    mosvrijJaren > 0 && { icoon: <Leaf size={18} />, titel: `${mosvrijJaren} jaar mosvrij`, jaren: mosvrijJaren, uitleg: "Komt er toch mos terug in die periode, dan kom ik kosteloos terug." },
    coatingJaren > 0 && { icoon: <ShieldCheck size={18} />, titel: `${coatingJaren} jaar garantie op je coating`, jaren: coatingJaren, uitleg: "Je dakcoating blijft beschermen, zwart op wit." },
  ].filter(Boolean) as { icoon: React.ReactNode; titel: string; jaren: number; uitleg: string }[];
  if (items.length === 0) return null;

  return (
    <section className={kz.kaart}>
      <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><ShieldCheck size={18} /> Je garantie</h2></div>
      {items.map((g) => {
        let staat = "Gaat in bij oplevering.";
        let pct = 0;
        if (vanaf) {
          const tot = plusJaren(vanaf, g.jaren);
          const totaal = dagenTot(tot) - dagenTot(vanaf);
          pct = Math.min(100, Math.max(0, ((totaal - dagenTot(tot)) / totaal) * 100));
          staat = dagenTot(tot) >= 0 ? `Geldig tot ${fmtKort(tot)}` : `Verlopen op ${fmtKort(tot)}`;
        }
        return (
          <div key={g.titel} className={kz.garantie}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className={kz.rijIcoon} style={{ width: 34, height: 34 }}>{g.icoon}</span>
              <div style={{ flex: 1 }}>
                <p className={kz.rijTitel}>{g.titel}</p>
                <p className={kz.rijSub}>{staat}</p>
              </div>
            </div>
            {vanaf && <div className={kz.balk} aria-hidden="true"><div className={kz.balkIn} style={{ width: `${100 - pct}%` }} /></div>}
            <p className={kz.sub} style={{ fontSize: 13 }}>{g.uitleg}</p>
          </div>
        );
      })}
    </section>
  );
}

export default async function KlantPagina({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const k = await getKlant(token);

  if (!k) {
    return (
      <main className={kz.page}>
        <div className={kz.wrap} style={{ paddingTop: 80, textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.avif" alt="MOS-X" className={kz.logo} style={{ margin: "0 auto 28px", height: 40 }} />
          <h1 className={kz.heroTitel} style={{ color: "#1A1A1A" }}>Deze link werkt niet (meer)</h1>
          <p className={kz.sub} style={{ maxWidth: 420, margin: "0 auto 24px" }}>
            Misschien is de link onvolledig gekopieerd, of kreeg je intussen een nieuwe. Stuur me een berichtje, dan krijg je meteen je juiste link.
          </p>
          <a className={kz.knop} href={`https://wa.me/${WA_NUMMER}?text=${encodeURIComponent("Hallo Yannick, mijn link naar de klantenzone werkt niet. Kan je hem opnieuw sturen?")}`}>
            <WaIcoon size={18} /> Vraag je link op via WhatsApp
          </a>
        </div>
      </main>
    );
  }

  const faseIndex = FASES.indexOf(k.fase);
  const grens = nuMs() + VERZET_UREN * 3_600_000;
  const vrijeMomenten = (await getMomenten()).filter((m) => brusselNaarDate(m.start).getTime() > grens).slice(0, 30);
  const dagLabels = Object.fromEntries(vrijeMomenten.map((m) => [m.start.slice(0, 10), fmtDag(m.start)]));
  const komend = k.afspraken.filter((a) => a.start.slice(0, 10) >= vandaag());
  const voorbij = k.afspraken.filter((a) => a.start.slice(0, 10) < vandaag());
  const facturen = k.documenten.filter((d) => d.type !== "offerte" && d.bedrag);
  const betaald = facturen.filter((d) => d.status === "betaald").reduce((s, d) => s + (d.bedrag ?? 0), 0);
  const open = facturen.filter((d) => d.status === "open").reduce((s, d) => s + (d.bedrag ?? 0), 0);

  return (
    <main className={kz.page}>
      <header className={kz.topbar}>
        <div className={`${kz.wrap} ${kz.topbarIn}`}>
          <Link href="/" aria-label="MOS-X website">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.avif" alt="MOS-X" className={kz.logo} />
          </Link>
          <span className={kz.topLabel}>Jouw klantenzone</span>
        </div>
      </header>

      <div className={kz.wrap}>
        {/* ── Welkom ── */}
        <section className={kz.hero}>
          <p className={kz.heroGroet}>{groet()} {k.voornaam},</p>
          <h1 className={kz.heroTitel}>
            Zo staat het met <em>je {k.dienst.toLowerCase() || "dak"}</em>.
          </h1>
          <div className={kz.heroMeta}>
            <span className={`${kz.pill} ${kz.pillGroen}`}><span className={kz.pulse} /> {FASE_LABEL[k.fase]}</span>
            {k.adres && <span className={kz.pill}><MapPin size={13} /> {k.adres}</span>}
          </div>
          {k.bericht && (
            <div className={kz.bericht}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={YANNICK_FOTO} alt="" className={kz.berichtFoto} />
              <div>
                <p className={kz.berichtTekst}>{k.bericht}</p>
                <p className={kz.berichtVan}>Yannick</p>
              </div>
            </div>
          )}
        </section>

        {/* ── Stappen ── */}
        <ol className={kz.stappen} aria-label="Waar je project staat">
          {FASES.map((f, i) => (
            <li
              key={f}
              className={`${kz.stap} ${i < faseIndex ? kz.stapKlaar : ""} ${i === faseIndex ? kz.stapNu : ""}`}
              aria-current={i === faseIndex ? "step" : undefined}
            >
              <div className={kz.stapBol}>{i < faseIndex ? "✓" : i + 1}</div>
              {FASE_LABEL[f]}
            </li>
          ))}
        </ol>
        <p className={kz.stapUitleg}>{FASE_UITLEG[k.fase]}</p>

        {/* ── Wanneer + wie ── */}
        <div className={kz.grid2} style={{ marginTop: 18 }}>
          <section className={kz.kaart}>
            <p className={kz.label}><CalendarDays size={13} style={{ verticalAlign: -2 }} /> Startdatum</p>
            <Startdatum k={k} />
          </section>
          <section className={kz.kaart}>
            <p className={kz.label}>Wie komt er</p>
            <div className={kz.persoon}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={YANNICK_FOTO} alt="Yannick van MOS-X" className={kz.persoonFoto} />
              <div>
                <p className={kz.rijTitel}>Yannick</p>
                <p className={kz.rijSub}>Ik doe het werk zelf. Geen onderaannemers.</p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Afspraken ── */}
        <section className={kz.kaart}>
          <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Clock size={18} /> Afspraken</h2></div>
          {komend.length === 0 ? (
            <p className={kz.leeg}>Er staan geen afspraken gepland.</p>
          ) : (
            <ul className={kz.lijst}>
              {komend.map((a) => {
                const kanVerzetten = brusselNaarDate(a.start).getTime() > grens && vrijeMomenten.length > 0;
                return (
                  <li key={a.id} className={kz.rij}>
                    <div className={kz.datumBlok} aria-hidden="true">
                      <div className={kz.datumMaand}>{fmtMaand(a.start).slice(0, 3)}</div>
                      <div className={kz.datumDag}>{Number(a.start.slice(8, 10))}</div>
                    </div>
                    <div className={kz.rijMidden}>
                      <p className={kz.rijTitel}>{a.titel}</p>
                      <p className={`${kz.rijSub} ${kz.eerste}`}>{fmtDag(a.start)} · {fmtUur(a.start)}</p>
                    </div>
                    <div className={kz.rijRechts}>
                      {kanVerzetten && (
                        <VerzetKnop klantId={k.id} afspraakId={a.id} titel={`${a.titel}, nu op ${fmtDag(a.start)} om ${fmtUur(a.start)}`} momenten={vrijeMomenten} dagLabels={dagLabels} />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {komend.length > 0 && (
            <p className={kz.sub} style={{ fontSize: 13 }}>
              Past het toch niet? Tot {VERZET_UREN} uur vooraf kies je zelf een ander moment. Later nog? Stuur me een berichtje.
            </p>
          )}
          {voorbij.length > 0 && <p className={kz.sub} style={{ fontSize: 13 }}>{voorbij.length} eerdere afspraak{voorbij.length > 1 ? "en" : ""} afgerond.</p>}
        </section>

        {/* ── Werffoto's ── */}
        <section className={kz.kaart}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><Camera size={18} /> Werffoto&apos;s</h2>
            <UploadKnop klantId={k.id} soort="foto" label="Foto toevoegen" licht meerdere />
          </div>
          {k.fotos.length === 0 ? (
            <p className={kz.leeg}>Zodra ik aan de slag ga, verschijnen hier foto&apos;s van je dak. Zelf een foto van je dak toevoegen kan ook.</p>
          ) : (
            <FotoGalerij fotos={k.fotos} />
          )}
        </section>

        {/* ── Documenten ── */}
        <section className={kz.kaart}>
          <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><FileText size={18} /> Offertes en facturen</h2></div>
          {facturen.length > 0 && (
            <div className={kz.totaal}>
              <div className={kz.totaalVak}>
                <p className={kz.label} style={{ margin: 0 }}>Betaald</p>
                <p className={kz.totaalBedrag} style={{ color: "#7AB54E" }}>{fmtEuro(betaald)}</p>
              </div>
              <div className={kz.totaalVak}>
                <p className={kz.label} style={{ margin: 0 }}>Nog open</p>
                <p className={kz.totaalBedrag}>{fmtEuro(open)}</p>
              </div>
            </div>
          )}
          {k.documenten.length === 0 ? (
            <p className={kz.leeg}>Je offerte en facturen verschijnen hier zodra ze klaar zijn.</p>
          ) : (
            <ul className={kz.lijst}>
              {k.documenten.map((d) => (
                <li key={d.id} className={kz.rij}>
                  <span className={kz.rijIcoon}><FileText size={18} /></span>
                  <div className={kz.rijMidden}>
                    <p className={kz.rijTitel}>{d.titel}</p>
                    <p className={kz.rijSub}>
                      {DOC_TYPE_LABEL[d.type]} · {fmtKort(d.datum)}{d.bedrag ? ` · ${fmtEuro(d.bedrag)}` : ""}
                    </p>
                  </div>
                  <div className={kz.rijRechts}>
                    {d.status === "betaald" && <span className={`${kz.badge} ${kz.badgeGroen}`}>Betaald</span>}
                    {d.status === "open" && <span className={`${kz.badge} ${kz.badgeAmber}`}>Open</span>}
                    <a className={kz.icoonKnop} href={d.url} target="_blank" rel="noopener" aria-label={`${d.titel} downloaden`}>
                      <Download size={16} />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Garantie ── */}
        <Garantie k={k} />

        {/* ── Tijdlijn ── */}
        {k.log.length > 0 && (
          <section className={kz.kaart}>
            <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><History size={18} /> Wat er gebeurde</h2></div>
            <ol className={kz.tijdlijn}>
              {k.log.slice(0, 12).map((l, i) => (
                <li key={i} className={kz.tijdItem}>
                  <p className={kz.tijdTekst}>{l.tekst}</p>
                  <p className={kz.tijdDatum}>{fmtKort(l.datum)}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <p className={kz.voet}>
          <Sparkles size={14} style={{ verticalAlign: -2, color: "#9BCB6C" }} /> Bewaar deze link: hij blijft werken, van je aanvraag tot lang na je werken.
          <br />Deel hem niet met anderen, want wie de link heeft, ziet je dossier.
        </p>
      </div>

      <div className={kz.waBalk}>
        <a className={kz.waKnop} href={waLink(k)} target="_blank" rel="noopener noreferrer">
          <WaIcoon /> Vraag? Stuur Yannick een WhatsApp
        </a>
      </div>
    </main>
  );
}
