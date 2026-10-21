import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CalendarDays, CalendarPlus, Camera, CheckCircle2, Clock, FileText, History, Info, LayoutDashboard,
  Leaf, MapPin, MessageCircle, NotebookPen, ShieldCheck, Sparkles, Wallet,
} from "lucide-react";
import { getKlant, getMomenten } from "@/lib/klantenzone/store";
import {
  brusselNaarDate, dagenTot, eindUur, fmtDag, fmtEuro, fmtKort, fmtMaand, fmtMoment, fmtUur, groet, hfd, maandagVan,
  nuMs, plusJaren, vandaag,
} from "@/lib/klantenzone/tijd";
import {
  AFSPRAAK_TIPS, FASES, FASE_LABEL, FASE_UITLEG, FOTO_FASE_LABEL, VERZET_UREN,
  type Afspraak, type FotoFase, type Klant, type VrijMoment,
} from "@/lib/klantenzone/types";
import DocumentLijst from "@/components/klantenzone/document-lijst";
import FotoGalerij from "@/components/klantenzone/foto-galerij";
import UploadKnop from "@/components/klantenzone/upload";
import VerzetKnop from "@/components/klantenzone/verzet-knop";
import VoorNa from "@/components/klantenzone/voor-na";
import kz from "@/components/klantenzone/kz.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jouw klantenzone | MOS-X",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const WA_NUMMER = "32468352869";
const YANNICK_FOTO = "/images/Yannick%20foto%20op%20dak.JPEG";

const TABS = [
  { id: "overzicht", label: "Overzicht", icoon: LayoutDashboard },
  { id: "fotos", label: "Foto's", icoon: Camera },
  { id: "agenda", label: "Agenda", icoon: CalendarDays },
  { id: "documenten", label: "Documenten", icoon: FileText },
  { id: "logboek", label: "Logboek", icoon: NotebookPen },
] as const;
type TabId = (typeof TABS)[number]["id"];

/* ── Kleine bouwstenen ─────────────────────────────────────────────────────── */

function waLink(k: Klant, onderwerp?: string) {
  const naam = `${k.voornaam} ${k.achternaam}`.trim();
  const tekst = `Hallo Yannick, ik ben ${naam}${k.adres ? ` (${k.adres})` : ""}. ${onderwerp ? `Over ${onderwerp}: ` : ""}`;
  return `https://wa.me/${WA_NUMMER}?text=${encodeURIComponent(tekst)}`;
}

function WaIcoon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" />
    </svg>
  );
}

function PaginaKop({ titel, sub, rechts }: { titel: string; sub?: string; rechts?: React.ReactNode }) {
  return (
    <div className={kz.paginaKop}>
      <div>
        <h1 className={kz.paginaTitel}>{titel}</h1>
        {sub && <p className={kz.paginaSub}>{sub}</p>}
      </div>
      {rechts}
    </div>
  );
}

function SectieKop({ titel, meer }: { titel: string; meer?: { href: string; label: string } }) {
  return (
    <div className={kz.sectieKop}>
      <h2 className={kz.sectieTitel}>{titel}</h2>
      {meer && <Link href={meer.href} className={kz.meerLink}>{meer.label} <ArrowRight size={14} /></Link>}
    </div>
  );
}

function startTekst(k: Klant): { waarde: string; sub: string; zeker: boolean } {
  if (!k.start) return { waarde: "Nog te plannen", sub: "Je krijgt een berichtje zodra de datum vastligt.", zeker: false };
  const { datum, precisie } = k.start;
  if (precisie === "maand") return { waarde: fmtMaand(datum), sub: "Voorlopig. De exacte dag volgt.", zeker: false };
  if (precisie === "week") return { waarde: `Week van ${fmtDag(maandagVan(datum)).replace(/^\S+\s/, "")}`, sub: "Voorlopig. De exacte dag volgt.", zeker: false };
  const d = dagenTot(datum);
  return {
    waarde: fmtDag(datum),
    sub: d > 1 ? `Nog ${d} dagen` : d === 1 ? "Morgen!" : d === 0 ? "Vandaag!" : `Gestart op ${fmtKort(datum)}`,
    zeker: true,
  };
}

type GarantieRegel = { id: string; icoon: typeof Leaf; titel: string; jaren: number; uitleg: string; staat: string; rest: number | null };

function garantieStaat(k: Klant): GarantieRegel[] {
  const { mosvrijJaren, coatingJaren, vanaf } = k.garantie;
  const basis = [
    mosvrijJaren > 0 ? { id: "mos", icoon: Leaf, titel: `${mosvrijJaren} jaar mosvrij`, jaren: mosvrijJaren, uitleg: "Komt er toch mos terug in die periode, dan kom ik kosteloos terug." } : null,
    coatingJaren > 0 ? { id: "coat", icoon: ShieldCheck, titel: `${coatingJaren} jaar garantie op je coating`, jaren: coatingJaren, uitleg: "Je dakcoating blijft beschermen, zwart op wit." } : null,
  ].filter((x) => x !== null);
  return basis.map((x) => {
    if (!vanaf) return { ...x, staat: "Gaat in bij oplevering", rest: null };
    const tot = plusJaren(vanaf, x.jaren);
    const totaal = dagenTot(tot) - dagenTot(vanaf);
    const rest = Math.max(0, Math.min(100, (dagenTot(tot) / totaal) * 100));
    return { ...x, staat: dagenTot(tot) >= 0 ? `Geldig tot ${fmtKort(tot)}` : `Verlopen op ${fmtKort(tot)}`, rest };
  });
}

/** Wat is logisch de volgende stap voor deze klant? */
function volgendeStap(k: Klant, volgende?: Afspraak): { tekst: string; href: TabId; icoon: typeof Info } {
  const open = k.documenten.filter((d) => d.status === "open");
  if (open.length) return { tekst: `Er staat ${open.length === 1 ? "een factuur" : `${open.length} facturen`} voor je klaar om te betalen.`, href: "documenten", icoon: Wallet };
  if (volgende) return { tekst: `Volgende afspraak: ${volgende.titel.toLowerCase()} op ${fmtDag(volgende.start)} om ${fmtUur(volgende.start)}.`, href: "agenda", icoon: CalendarDays };
  switch (k.fase) {
    case "aanvraag":
      return k.documenten.some((d) => d.type === "offerte")
        ? { tekst: "Je offerte staat klaar. Bekijk hem rustig en laat me weten wat je ervan vindt.", href: "documenten", icoon: FileText }
        : { tekst: "Ik maak je offerte op. Je vindt hem straks bij Documenten.", href: "documenten", icoon: FileText };
    case "gepland": return { tekst: "Je werken staan gepland. Je startdatum en praktische info vind je in de agenda.", href: "agenda", icoon: CalendarDays };
    case "bezig": return { tekst: "Ik ben aan het werk. Volg de vooruitgang via de werffoto's.", href: "fotos", icoon: Camera };
    case "klaar": return { tekst: "Je dak is klaar! Bekijk het verschil voor en na.", href: "fotos", icoon: Sparkles };
    default: return { tekst: "Je dak is in nazorg. Alles wat we deden, vind je in het logboek.", href: "logboek", icoon: NotebookPen };
  }
}

function DatumBlok({ start, groot }: { start: string; groot?: boolean }) {
  return (
    <div className={groot ? kz.datumGroot : kz.datumBlok} aria-hidden="true">
      <div className={kz.datumMaand}>{fmtMaand(start).slice(0, 3)}</div>
      <div className={kz.datumDag}>{Number(start.slice(8, 10))}</div>
      {groot && <div className={`${kz.datumWeekdag} ${kz.eerste}`}>{fmtDag(start).split(" ")[0]}</div>}
    </div>
  );
}

/* ── Tabbladen ─────────────────────────────────────────────────────────────── */

type Ctx = {
  k: Klant;
  komend: Afspraak[];
  voorbij: Afspraak[];
  vrijeMomenten: VrijMoment[];
  dagLabels: Record<string, string>;
  grens: number;
};

function Overzicht({ k, komend }: Ctx) {
  const faseIndex = FASES.indexOf(k.fase);
  const stap = volgendeStap(k, komend[0]);
  const start = startTekst(k);
  const facturen = k.documenten.filter((d) => d.type !== "offerte" && d.bedrag);
  const open = facturen.filter((d) => d.status === "open").reduce((s, d) => s + (d.bedrag ?? 0), 0);
  const garantie = garantieStaat(k);
  const laatste = [...(k.notities ?? []).map((n) => ({ datum: n.datum, tekst: `Notitie: ${n.titel ?? n.tekst}` })), ...k.log]
    .sort((a, b) => b.datum.localeCompare(a.datum)).slice(0, 4);

  return (
    <>
      <section className={kz.hero} style={{ marginTop: 0 }}>
        <p className={kz.heroGroet}>{groet()} {k.voornaam},</p>
        <h1 className={kz.heroTitel}>Zo staat het met <em>je {k.dienst.toLowerCase() || "dak"}</em>.</h1>
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

      <ol className={kz.stappen} aria-label="Waar je project staat">
        {FASES.map((f, i) => (
          <li key={f} className={`${kz.stap} ${i < faseIndex ? kz.stapKlaar : ""} ${i === faseIndex ? kz.stapNu : ""}`} aria-current={i === faseIndex ? "step" : undefined}>
            <div className={kz.stapBol}>{i < faseIndex ? "✓" : i + 1}</div>
            {FASE_LABEL[f]}
          </li>
        ))}
      </ol>
      <p className={kz.stapUitleg}>{FASE_UITLEG[k.fase]}</p>

      <Link href={`?tab=${stap.href}`} className={kz.volgendeStap}>
        <span className={kz.rijIcoon}><stap.icoon size={18} /></span>
        <span style={{ flex: 1 }}>
          <span className={kz.label} style={{ display: "block", margin: 0 }}>Volgende stap</span>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{stap.tekst}</span>
        </span>
        <ArrowRight size={18} />
      </Link>

      <div className={kz.tegels}>
        <Link href="?tab=agenda" className={kz.tegel}>
          <span className={kz.tegelKop}>Startdatum <CalendarDays size={16} /></span>
          <p className={kz.tegelWaarde}>{start.waarde}</p>
          <p className={kz.tegelSub}>{start.sub}</p>
        </Link>
        <Link href="?tab=fotos" className={kz.tegel}>
          <span className={kz.tegelKop}>Werffoto&apos;s <Camera size={16} /></span>
          <p className={kz.tegelWaarde}>{k.fotos.length ? `${k.fotos.length} foto${k.fotos.length > 1 ? "'s" : ""}` : "Nog geen"}</p>
          {k.fotos.length > 0 ? (
            <div className={kz.miniFotos}>
              {k.fotos.slice(0, 4).map((f) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={f.id} src={f.url} alt="" />
              ))}
            </div>
          ) : <p className={kz.tegelSub}>Verschijnen zodra ik start</p>}
        </Link>
        <Link href="?tab=documenten" className={kz.tegel}>
          <span className={kz.tegelKop}>Te betalen <Wallet size={16} /></span>
          <p className={kz.tegelWaarde}>{facturen.length ? (open ? fmtEuro(open) : "Alles betaald") : "Niets"}</p>
          <p className={kz.tegelSub}>{k.documenten.length} document{k.documenten.length === 1 ? "" : "en"}</p>
        </Link>
        <Link href="?tab=logboek" className={kz.tegel}>
          <span className={kz.tegelKop}>Laatste nieuws <History size={16} /></span>
          <p className={kz.tegelSub} style={{ color: "#1A1A1A", fontWeight: 500, fontSize: 14 }}>{laatste[0]?.tekst ?? "Nog niets"}</p>
          {laatste[0] && <p className={kz.tegelSub}>{fmtMoment(laatste[0].datum)}</p>}
        </Link>
      </div>

      <div className={kz.grid2} style={{ marginTop: 14 }}>
        <section className={kz.kaart}>
          <p className={kz.label}>Wie komt er</p>
          <div className={kz.persoon}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={YANNICK_FOTO} alt="Yannick van MOS-X" className={kz.persoonFoto} />
            <div>
              <p className={kz.rijTitel}>Yannick</p>
              <p className={kz.rijSub}>Ik doe het werk zelf. Geen onderaannemers. Een vraag? Je krijgt mij.</p>
            </div>
          </div>
          <div className={kz.rijKnoppen}>
            <a className={kz.knop} style={{ background: "#25D366" }} href={waLink(k)} target="_blank" rel="noopener noreferrer"><WaIcoon size={16} /> WhatsApp</a>
            <a className={`${kz.knop} ${kz.knopLicht}`} href="tel:+32468352869">Bellen</a>
          </div>
        </section>

        <section className={kz.kaart}>
          <p className={kz.label}>Je garantie</p>
          {garantie.length === 0 ? (
            <p className={kz.sub}>Je garantie verschijnt hier zodra je werken bevestigd zijn.</p>
          ) : garantie.map((g) => (
            <div key={g.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className={kz.rijIcoon} style={{ width: 34, height: 34 }}><g.icoon size={17} /></span>
                <div>
                  <p className={kz.rijTitel}>{g.titel}</p>
                  <p className={kz.rijSub}>{g.staat}</p>
                </div>
              </div>
              {g.rest !== null && <div className={kz.balk} aria-hidden="true"><div className={kz.balkIn} style={{ width: `${g.rest}%` }} /></div>}
            </div>
          ))}
          {garantie.length > 0 && <p className={kz.sub} style={{ fontSize: 13, marginTop: 0 }}>{garantie.map((g) => g.uitleg).join(" ")}</p>}
        </section>
      </div>

      {laatste.length > 0 && (
        <>
          <SectieKop titel="Laatste updates" meer={{ href: "?tab=logboek", label: "Alles bekijken" }} />
          <section className={kz.kaart} style={{ marginTop: 0 }}>
            <ol className={kz.tijdlijn}>
              {laatste.map((l, i) => (
                <li key={i} className={kz.tijdItem}>
                  <p className={kz.tijdTekst}>{l.tekst}</p>
                  <p className={kz.tijdDatum}>{fmtMoment(l.datum)}</p>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </>
  );
}

function Fotos({ k }: Ctx) {
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  const groepen: FotoFase[] = ["voor", "tijdens", "na", "klant"];
  const uitleg: Record<FotoFase, string> = {
    voor: "Zo zag je dak eruit voor ik begon.",
    tijdens: "Foto's van de werf, terwijl ik bezig was.",
    na: "Het resultaat.",
    klant: "Foto's die je zelf toevoegde.",
  };

  return (
    <>
      <PaginaKop
        titel="Werffoto's"
        sub={k.fotos.length ? `${k.fotos.length} foto's van je dak. Tik op een foto om ze groot te bekijken.` : "Hier volg je je dak: voor, tijdens en na de werken."}
        rechts={<UploadKnop klantId={k.id} soort="foto" label="Zelf een foto toevoegen" licht meerdere />}
      />

      {voor && na && (
        <>
          <SectieKop titel="Het verschil" />
          <section className={kz.kaart} style={{ marginTop: 0 }}>
            <VoorNa voor={voor.url} na={na.url} />
            <p className={kz.sub} style={{ fontSize: 13 }}>Sleep de schuif naar links en rechts.</p>
          </section>
        </>
      )}

      {k.fotos.length === 0 && (
        <section className={kz.kaart}>
          <p className={kz.leeg}>Zodra ik aan de slag ga, verschijnen hier foto&apos;s van je dak. Wil je me zelf al iets tonen, zoals een lek of een plek met veel mos? Voeg dan hierboven een foto toe.</p>
        </section>
      )}

      {groepen.map((g) => {
        const lijst = k.fotos.filter((f) => f.fase === g);
        if (!lijst.length) return null;
        return (
          <div key={g}>
            <SectieKop titel={`${FOTO_FASE_LABEL[g]} (${lijst.length})`} />
            <section className={kz.kaart} style={{ marginTop: 0 }}>
              <p className={kz.sub} style={{ marginTop: 0, marginBottom: 12 }}>{uitleg[g]} Laatst toegevoegd op {fmtKort(lijst[0].datum)}.</p>
              <FotoGalerij fotos={lijst} />
            </section>
          </div>
        );
      })}
    </>
  );
}

function AfspraakKaart({ a, ctx, uitgelicht }: { a: Afspraak; ctx: Ctx; uitgelicht?: boolean }) {
  const { k } = ctx;
  const kanVerzetten = brusselNaarDate(a.start).getTime() > ctx.grens && ctx.vrijeMomenten.length > 0;
  const info = a.info || AFSPRAAK_TIPS[a.titel];
  const dagen = dagenTot(a.start);
  return (
    <section className={kz.kaart} style={uitgelicht ? { marginTop: 0, border: "1px solid #DCEDCB" } : undefined}>
      <div className={kz.afspraakGroot}>
        <DatumBlok start={a.start} groot />
        <div style={{ minWidth: 0 }}>
          {uitgelicht && <span className={`${kz.badge} ${kz.badgeGroen}`} style={{ marginBottom: 6 }}>{dagen === 0 ? "Vandaag" : dagen === 1 ? "Morgen" : `Over ${dagen} dagen`}</span>}
          <p className={kz.groot} style={{ fontSize: 20 }}>{a.titel}</p>
          <div className={kz.metaRij}>
            <span><CalendarDays size={15} /> {hfd(fmtDag(a.start))}</span>
            <span><Clock size={15} /> {fmtUur(a.start)} – {eindUur(a.start, a.duurMin)}</span>
            {k.adres && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(k.adres)}`} target="_blank" rel="noopener noreferrer"><MapPin size={15} /> {k.adres}</a>}
          </div>
          {info && <div className={kz.infoBlok}><Info size={16} /><span>{info}</span></div>}
          <div className={kz.rijKnoppen}>
            <a className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`} href={`/api/klantenzone/agenda?k=${k.id}&a=${a.id}`}><CalendarPlus size={15} /> In mijn agenda</a>
            {kanVerzetten && (
              <VerzetKnop klantId={k.id} afspraakId={a.id} titel={`${a.titel}, nu op ${fmtDag(a.start)} om ${fmtUur(a.start)}`} momenten={ctx.vrijeMomenten} dagLabels={ctx.dagLabels} />
            )}
            <a className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`} href={waLink(k, `de afspraak van ${fmtDag(a.start)}`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} /> Vraag stellen</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Agenda(ctx: Ctx) {
  const { k, komend, voorbij } = ctx;
  const start = startTekst(k);
  return (
    <>
      <PaginaKop titel="Agenda" sub={`Al je afspraken op een rij. Tot ${VERZET_UREN} uur vooraf kies je zelf een ander moment.`} />

      <section className={kz.kaart}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span className={kz.rijIcoon}><CalendarDays size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className={kz.label} style={{ margin: 0 }}>Start van je werken</p>
            <p className={kz.groot} style={{ fontSize: 19 }}>{start.waarde}</p>
          </div>
          <span className={`${kz.badge} ${start.zeker ? kz.badgeGroen : kz.badgeAmber}`}>{start.zeker ? "Vastgelegd" : k.start ? "Voorlopig" : "Te plannen"}</span>
        </div>
        <p className={kz.sub} style={{ fontSize: 13 }}>{start.sub}</p>
      </section>

      {komend.length === 0 ? (
        <section className={kz.kaart}>
          <p className={kz.leeg}>Er staan nu geen afspraken gepland. Zodra er iets vastligt, zie je het hier en krijg je een berichtje.</p>
        </section>
      ) : (
        <>
          <SectieKop titel="Eerstvolgende afspraak" />
          <AfspraakKaart a={komend[0]} ctx={ctx} uitgelicht />
          {komend.length > 1 && <SectieKop titel={`Daarna (${komend.length - 1})`} />}
          {komend.slice(1).map((a) => <AfspraakKaart key={a.id} a={a} ctx={ctx} />)}
        </>
      )}

      {voorbij.length > 0 && (
        <>
          <SectieKop titel="Afgerond" />
          <section className={`${kz.kaart} ${kz.afgelopen}`} style={{ marginTop: 0 }}>
            <ul className={kz.lijst}>
              {[...voorbij].reverse().map((a) => (
                <li key={a.id} className={kz.rij}>
                  <DatumBlok start={a.start} />
                  <div className={kz.rijMidden}>
                    <p className={kz.rijTitel}>{a.titel}</p>
                    <p className={`${kz.rijSub} ${kz.eerste}`}>{fmtDag(a.start, true)} · {fmtUur(a.start)}</p>
                  </div>
                  <CheckCircle2 size={18} color="#7AB54E" />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}

function Documenten({ k }: Ctx) {
  const labels = Object.fromEntries(k.documenten.map((d) => [d.id, { datum: fmtKort(d.datum), bedrag: d.bedrag ? fmtEuro(d.bedrag) : undefined }]));
  const offertes = k.documenten.filter((d) => d.type === "offerte");
  const facturen = k.documenten.filter((d) => d.type === "voorschot" || d.type === "factuur");
  const andere = k.documenten.filter((d) => d.type === "andere");
  const metBedrag = facturen.filter((d) => d.bedrag);
  const totaal = metBedrag.reduce((s, d) => s + (d.bedrag ?? 0), 0);
  const betaald = metBedrag.filter((d) => d.status === "betaald").reduce((s, d) => s + (d.bedrag ?? 0), 0);
  const open = totaal - betaald;

  return (
    <>
      <PaginaKop titel="Documenten" sub="Je offertes en facturen op één plek. Tik op een document om het te bekijken." />

      {totaal > 0 && (
        <section className={kz.kaart}>
          <p className={kz.label}>Betalingen</p>
          <div className={kz.totaal} style={{ marginBottom: 0 }}>
            <div className={kz.totaalVak}><p className={kz.label} style={{ margin: 0 }}>Gefactureerd</p><p className={kz.totaalBedrag}>{fmtEuro(totaal)}</p></div>
            <div className={kz.totaalVak}><p className={kz.label} style={{ margin: 0 }}>Betaald</p><p className={kz.totaalBedrag} style={{ color: "#7AB54E" }}>{fmtEuro(betaald)}</p></div>
            <div className={kz.totaalVak}><p className={kz.label} style={{ margin: 0 }}>Te betalen</p><p className={kz.totaalBedrag} style={{ color: open ? "#B7791F" : undefined }}>{fmtEuro(open)}</p></div>
          </div>
          <div className={kz.geldBalk} aria-hidden="true"><div className={kz.geldBalkIn} style={{ width: `${(betaald / totaal) * 100}%` }} /></div>
          <div className={kz.legenda}><span><i style={{ background: "#9BCB6C" }} />Betaald</span><span><i style={{ background: "#FDF3E1", border: "1px solid #E9C98F" }} />Nog te betalen</span></div>
          {open === 0 && <p className={kz.ok}><CheckCircle2 size={15} style={{ verticalAlign: -3 }} /> Alles is betaald. Bedankt!</p>}
        </section>
      )}

      {k.documenten.length === 0 && (
        <section className={kz.kaart}><p className={kz.leeg}>Je offerte en facturen verschijnen hier zodra ze klaar zijn. Je krijgt dan een berichtje.</p></section>
      )}

      {[
        { titel: "Facturen", lijst: facturen },
        { titel: "Offertes", lijst: offertes },
        { titel: "Andere documenten", lijst: andere },
      ].filter((g) => g.lijst.length).map((g) => (
        <div key={g.titel}>
          <SectieKop titel={`${g.titel} (${g.lijst.length})`} />
          <section className={kz.kaart} style={{ marginTop: 0 }}>
            <DocumentLijst documenten={g.lijst} labels={labels} />
          </section>
        </div>
      ))}

      {k.documenten.length > 0 && (
        <p className={kz.sub} style={{ textAlign: "center", marginTop: 18 }}>
          Vraag over een factuur of offerte? <a href={waLink(k, "een document")} target="_blank" rel="noopener noreferrer" style={{ color: "#7AB54E", fontWeight: 600 }}>Stuur me een berichtje</a>.
        </p>
      )}
    </>
  );
}

function Logboek({ k }: Ctx) {
  const notities = k.notities ?? [];
  const perMaand = k.log.reduce<Record<string, typeof k.log>>((acc, l) => {
    (acc[l.datum.slice(0, 7)] ??= []).push(l);
    return acc;
  }, {});

  return (
    <>
      <PaginaKop titel="Logboek" sub="Notities van Yannick en alles wat er gebeurde in je dossier." />

      <SectieKop titel={`Notities van Yannick (${notities.length})`} />
      {notities.length === 0 ? (
        <section className={kz.kaart} style={{ marginTop: 0 }}><p className={kz.leeg}>Hier schrijf ik wat me opviel op je dak, tips voor onderhoud en afspraken die we maakten.</p></section>
      ) : notities.map((n) => (
        <article key={n.id} className={kz.notitie}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={YANNICK_FOTO} alt="" className={kz.berichtFoto} />
          <div style={{ minWidth: 0 }}>
            {n.titel && <p className={kz.rijTitel}>{n.titel}</p>}
            <p className={kz.notitieTekst}>{n.tekst}</p>
            <p className={kz.tijdDatum}>Yannick · {fmtMoment(n.datum)}</p>
          </div>
        </article>
      ))}

      <SectieKop titel="Wat er gebeurde" />
      <section className={kz.kaart} style={{ marginTop: 0 }}>
        {Object.entries(perMaand).map(([maand, items]) => (
          <div key={maand}>
            <p className={kz.maandKop}>{fmtMaand(`${maand}-01`)}</p>
            <ol className={kz.tijdlijn}>
              {items.map((l, i) => (
                <li key={i} className={kz.tijdItem}>
                  <p className={kz.tijdTekst}>{l.tekst}</p>
                  <p className={kz.tijdDatum}>{fmtMoment(l.datum)}</p>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </>
  );
}

/* ── Pagina ────────────────────────────────────────────────────────────────── */

export default async function KlantPagina({
  params, searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { token } = await params;
  const { tab: tabRuw } = await searchParams;
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

  const tab: TabId = TABS.some((t) => t.id === tabRuw) ? (tabRuw as TabId) : "overzicht";
  const grens = nuMs() + VERZET_UREN * 3_600_000;
  const vrijeMomenten = (await getMomenten()).filter((m) => brusselNaarDate(m.start).getTime() > grens).slice(0, 30);
  const ctx: Ctx = {
    k,
    komend: k.afspraken.filter((a) => a.start.slice(0, 10) >= vandaag()),
    voorbij: k.afspraken.filter((a) => a.start.slice(0, 10) < vandaag()),
    vrijeMomenten,
    dagLabels: Object.fromEntries(vrijeMomenten.map((m) => [m.start.slice(0, 10), fmtDag(m.start)])),
    grens,
  };
  const openDocs = k.documenten.filter((d) => d.status === "open").length;
  const teller: Partial<Record<TabId, { n: number; amber?: boolean }>> = {
    fotos: k.fotos.length ? { n: k.fotos.length } : undefined,
    agenda: ctx.komend.length ? { n: ctx.komend.length } : undefined,
    documenten: openDocs ? { n: openDocs, amber: true } : k.documenten.length ? { n: k.documenten.length } : undefined,
    logboek: k.notities?.length ? { n: k.notities.length } : undefined,
  };

  return (
    <main className={kz.page}>
      <header className={kz.topbar}>
        <div className={`${kz.wrapBreed} ${kz.topbarIn}`} style={{ maxWidth: 1180 }}>
          <Link href="?tab=overzicht" aria-label="Overzicht">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.avif" alt="MOS-X" className={kz.logo} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className={kz.topLabel}>Jouw klantenzone</span>
            <a className={kz.waRond} href={waLink(k)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Yannick"><WaIcoon size={20} /></a>
          </div>
        </div>
      </header>

      <div className={kz.dash}>
        <aside className={kz.zijbalk}>
          <nav aria-label="Klantenzone">
            <ul className={kz.navLijst}>
              {TABS.map((t) => (
                <li key={t.id}>
                  <Link href={`?tab=${t.id}`} className={`${kz.navItem} ${tab === t.id ? kz.navItemAan : ""}`} aria-current={tab === t.id ? "page" : undefined}>
                    <t.icoon size={18} /> {t.label}
                    {teller[t.id] && <span className={`${kz.navTeller} ${teller[t.id]!.amber ? kz.navTellerAmber : ""}`}>{teller[t.id]!.n}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={kz.zijKaart}>
            <div className={kz.persoon}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={YANNICK_FOTO} alt="" className={kz.berichtFoto} />
              <div>
                <p className={kz.rijTitel}>Vraag voor Yannick?</p>
                <p className={kz.rijSub}>Eén nummer, je krijgt mij.</p>
              </div>
            </div>
            <a className={kz.knop} style={{ background: "#25D366", width: "100%", marginTop: 12, boxSizing: "border-box" }} href={waLink(k)} target="_blank" rel="noopener noreferrer"><WaIcoon size={16} /> Stuur een WhatsApp</a>
          </div>
        </aside>

        <div className={kz.inhoud}>
          {tab === "overzicht" && <Overzicht {...ctx} />}
          {tab === "fotos" && <Fotos {...ctx} />}
          {tab === "agenda" && <Agenda {...ctx} />}
          {tab === "documenten" && <Documenten {...ctx} />}
          {tab === "logboek" && <Logboek {...ctx} />}

          <p className={kz.voet}>
            <Sparkles size={14} style={{ verticalAlign: -2, color: "#9BCB6C" }} /> Bewaar deze link: hij blijft werken, van je aanvraag tot lang na je werken.
            <br />Deel hem niet met anderen, want wie de link heeft, ziet je dossier.
          </p>
        </div>
      </div>

      <nav className={kz.onderNav} aria-label="Klantenzone">
        <ul>
          {TABS.map((t) => (
            <li key={t.id}>
              <Link href={`?tab=${t.id}`} className={`${kz.onderItem} ${tab === t.id ? kz.onderItemAan : ""}`} aria-current={tab === t.id ? "page" : undefined}>
                <t.icoon size={21} />
                {t.label}
                {teller[t.id]?.amber && <span className={kz.onderStip} aria-label="Actie nodig" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
