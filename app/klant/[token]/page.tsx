import type { Metadata } from "next";
import Link from "next/link";
import {
  AppWindow, ArrowRight, Building2, CalendarDays, Camera, CheckCircle2, Clock, Droplets,
  FileText, Hammer, Home, LayoutDashboard, Leaf, NotebookPen, ShieldCheck, Sparkles,
  Star, Sun, Tag, UserRound, Users, Wallet, Wrench, Grid3x3,
} from "lucide-react";
import { headers } from "next/headers";
import { getInstellingen, getKlant, getMomenten, zorgVoorRefCode, type Actie } from "@/lib/klantenzone/store";
import { controleBinnen, volgendeControle } from "@/lib/klantenzone/onderhoud";
import { effectief } from "@/lib/klantenzone/auto";
import {
  brusselNaarDate, dagenTot, eindUur, fmtDag, fmtDagMaand, fmtEuro, fmtKort, fmtMaand, fmtMoment, fmtUur, groet, hfd,
  maandagVan, nuMs, plusJaren, vandaag,
} from "@/lib/klantenzone/tijd";
import {
  AFSPRAAK_TIPS, DOC_GROEPEN, DOC_IS_FACTUUR, EXTRAS, FASES, FASE_KORT, FASE_LABEL, FOTO_FASE_LABEL,
  VERZET_UREN,
  type Afspraak, type FotoFase, type Klant, type VrijMoment,
} from "@/lib/klantenzone/types";
import AanvraagKnop from "@/components/klantenzone/aanvraag-knop";
import DeelBuurlink from "@/components/klantenzone/deel-buurlink";
import DocumentLijst from "@/components/klantenzone/document-lijst";
import FotoGalerij from "@/components/klantenzone/foto-galerij";
import MeerMenu from "@/components/klantenzone/meer-menu";
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

/** Menu links. De eerste vier staan op gsm ook onderaan, de rest onder "Meer". */
const TABS = [
  { id: "overzicht", label: "Overzicht", icoon: LayoutDashboard },
  { id: "fotos", label: "Foto's", icoon: Camera },
  { id: "documenten", label: "Documenten", icoon: FileText },
  { id: "dak", label: "Mijn dak", icoon: Home },
  { id: "extras", label: "Extra's", icoon: Sparkles },
  { id: "acties", label: "Acties", icoon: Tag },
  { id: "logboek", label: "Logboek", icoon: NotebookPen },
] as const;
type TabId = (typeof TABS)[number]["id"];
const ONDERAAN: TabId[] = ["overzicht", "fotos", "documenten", "dak"];

const EXTRA_ICOON: Record<(typeof EXTRAS)[number]["id"], typeof Droplets> = {
  goten: Droplets, gevel: Building2, oprit: Grid3x3, velux: AppWindow, zonnepanelen: Sun, herstelling: Hammer,
};

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

/** Vlaamse groet volgens het uur */
function groetKort(): string {
  return groet().replace("Goede", "Goeie").replace("Goedenavond", "Goeienavond");
}

/** Eén zin in gewone taal: wat gebeurt er nu met je dak? */
function statusZin(k: Klant, volgende?: Afspraak): string {
  const bezig = (k.werken ?? []).find((w) => w.status === "bezig");
  switch (k.fase) {
    case "gepland":
      if (k.start?.precisie === "dag") return `Je werken starten op ${fmtDag(k.start.datum)}. Yannick komt zelf.`;
      if (k.start) return `Je werken staan voorlopig gepland in ${k.start.precisie === "week" ? `de week van ${fmtDagMaand(maandagVan(k.start.datum))}` : fmtMaand(k.start.datum)}.`;
      return "Je werken zijn bevestigd. Ik laat je zo snel mogelijk weten wanneer ik kom.";
    case "bezig":
      if (bezig) return `Ik ben nu bezig met de ${bezig.naam.toLowerCase()} van je dak.`;
      return volgende ? `De werken lopen. Volgende stap: ${volgende.titel.toLowerCase()} op ${fmtDag(volgende.start)}.` : "De werken aan je dak zijn bezig.";
    case "klaar":
      return "Je dak is klaar. Bekijk het verschil op de foto's, en je garantie loopt.";
    default:
      return "Je dak is in nazorg. Ik volg het verder op, jij hoeft niets te doen.";
  }
}

/** Wat is logisch de volgende stap voor deze klant? */
function volgendeStap(k: Klant, volgende?: Afspraak, controle?: { datum: string } | null): string {
  const dringend = (k.aanbevelingen ?? []).find((a) => a.status === "open" && a.prioriteit === "dringend");
  if (dringend) return `Bekijk Mijn dak: ${dringend.titel.toLowerCase()}.`;
  if (volgende) return `${volgende.titel} op ${fmtDag(volgende.start)} om ${fmtUur(volgende.start)}.`;
  const open = k.documenten.filter((d) => d.status === "open");
  if (open.length) return `Er staat ${open.length === 1 ? "een factuur" : `${open.length} facturen`} klaar om te betalen.`;
  if (k.fase === "klaar") return "Bekijk het resultaat bij je foto's.";
  if (controle && controleBinnen(controle.datum) < 90) return `Je volgende controle, rond ${fmtMaand(controle.datum)}.`;
  if (controle) return `Een controle in ${fmtMaand(controle.datum)}. Tot dan hoef je niets te doen.`;
  return "Ik laat je weten wanneer ik kom.";
}

function PaginaKop({ titel, sub, rechts, teller }: { titel: string; sub?: string; rechts?: React.ReactNode; teller?: number }) {
  return (
    <div className={kz.paginaKop}>
      <div>
        <h1 className={kz.paginaTitel}>{titel}{teller ? <span className={kz.telBol}>{teller}</span> : null}</h1>
        {sub && <p className={kz.paginaSub}>{sub}</p>}
      </div>
      {rechts}
    </div>
  );
}

function startTekst(k: Klant): { waarde: string; sub: string; zeker: boolean } {
  if (!k.start) return { waarde: "Nog te plannen", sub: "Je krijgt een berichtje zodra de datum vastligt.", zeker: false };
  const { datum, precisie } = k.start;
  if (precisie === "maand") return { waarde: hfd(fmtMaand(datum)), sub: "Voorlopig. De exacte dag volgt.", zeker: false };
  if (precisie === "week") return { waarde: `Week van ${fmtDagMaand(maandagVan(datum))}`, sub: "Voorlopig. De exacte dag volgt.", zeker: false };
  const d = dagenTot(datum);
  return {
    waarde: hfd(fmtDag(datum)),
    sub: d > 1 ? `Nog ${d} dagen.` : d === 1 ? "Morgen!" : d === 0 ? "Vandaag!" : "Je werken zijn gestart.",
    zeker: true,
  };
}

type GarantieRegel = { id: string; icoon: typeof Leaf; titel: string; uitleg: string; staat: string; rest: number | null };

function garantieStaat(k: Klant): GarantieRegel[] {
  const { mosvrijJaren, coatingJaren, vanaf } = k.garantie;
  const basis = [
    mosvrijJaren > 0 ? { id: "mos", icoon: Leaf, titel: `${mosvrijJaren} jaar mosvrij`, jaren: mosvrijJaren, uitleg: "Komt er toch mos terug in die periode, dan kom ik kosteloos terug." } : null,
    coatingJaren > 0 ? { id: "coat", icoon: ShieldCheck, titel: `${coatingJaren} jaar garantie op je coating`, jaren: coatingJaren, uitleg: "Je dakcoating blijft beschermen, zwart op wit." } : null,
  ].filter((x) => x !== null);
  return basis.map(({ jaren, ...x }) => {
    if (!vanaf) return { ...x, staat: "Gaat in bij de oplevering", rest: null };
    const tot = plusJaren(vanaf, jaren);
    const totaal = dagenTot(tot) - dagenTot(vanaf);
    const rest = Math.max(0, Math.min(100, (dagenTot(tot) / totaal) * 100));
    return { ...x, staat: dagenTot(tot) >= 0 ? `Geldig tot ${fmtKort(tot)}` : `Verlopen op ${fmtKort(tot)}`, rest };
  });
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

function Leeg({ children }: { children: React.ReactNode }) {
  return <section className={kz.kaart}><p className={kz.leeg}>{children}</p></section>;
}

/* ── Gedeelde context ──────────────────────────────────────────────────────── */

type Ctx = {
  k: Klant;
  komend: Afspraak[];
  voorbij: Afspraak[];
  vrijeMomenten: VrijMoment[];
  dagLabels: Record<string, string>;
  grens: number;
  controle: { datum: string; reden: string } | null;
  refUrl: string;
  burenVoordeel?: string;
  acties: Actie[];
  reviewUrl?: string;
};

function kanVerzetten(a: Afspraak, ctx: Ctx) {
  return brusselNaarDate(a.start).getTime() > ctx.grens && ctx.vrijeMomenten.length > 0;
}

/* ══ Overzicht ═════════════════════════════════════════════════════════════ */


function Overzicht(ctx: Ctx) {
  const { k, komend, controle } = ctx;
  const faseIndex = FASES.indexOf(k.fase);
  const start = startTekst(k);
  const toonStart = !!k.start && k.start.datum >= vandaag() && !komend.some((a) => a.titel === "Start werken");
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  const prijsDocs = k.documenten.filter((d) => DOC_IS_FACTUUR(d.type) || d.type === "offerte");
  const labels = Object.fromEntries(k.documenten.map((d) => [d.id, { datum: fmtKort(d.datum), bedrag: d.bedrag ? fmtEuro(d.bedrag) : undefined }]));

  return (
    <>
      {/* 1. Waar je werf staat */}
      <section className={kz.appKop}>
        <p className={kz.appLabel}>Mijn MOS-X</p>
        <h1 className={kz.appGroet}>{groetKort()}, {k.voornaam}</h1>
        <span className={kz.appStreep} aria-hidden="true" />
      </section>

      <section className={kz.statusKaart}>
        <div className={kz.statusBoven}>
          <span className={kz.statusStap}><span className={kz.verbergMobiel}>{(k.dienst || "Dakwerken").split(" en ")[0]} · </span>Stap {faseIndex + 1} van {FASES.length}</span>
        </div>
        <h2 className={kz.statusZin}>{statusZin(k, komend[0])}</h2>
        <p className={kz.statusVolgende}><strong>Volgende:</strong> {volgendeStap(k, komend[0], controle)}</p>

        <div className={kz.fasen} aria-label={`Stap ${faseIndex + 1} van ${FASES.length}: ${FASE_LABEL[k.fase]}`}>
          {FASES.map((f, i) => {
            const werken = k.werken ?? [];
            const delen = i === faseIndex && f === "bezig" && werken.length ? werken.map((w) => w.status) : null;
            return (
              <div key={f} className={kz.fase}>
                <div className={kz.faseBalk}>
                  {delen ? delen.map((st, j) => (
                    <span key={j} className={`${kz.faseStip} ${st === "klaar" ? kz.faseStipKlaar : st === "bezig" ? kz.faseStipNu : ""}`} />
                  )) : (
                    <span className={`${kz.faseDeel} ${i < faseIndex ? kz.faseDeelKlaar : i === faseIndex ? kz.faseDeelNu : ""}`} />
                  )}
                </div>
                <span className={`${kz.faseNaam} ${i === faseIndex ? kz.faseNaamNu : ""}`}>{FASE_KORT[f]}</span>
              </div>
            );
          })}
        </div>

        {k.bericht && (
          <blockquote className={kz.statusBericht}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={YANNICK_FOTO} alt="" />
            <p>{k.bericht}</p>
          </blockquote>
        )}
      </section>

      {/* Review: vanzelf na de oplevering, zolang het dak er nog splinternieuw uitziet */}
      {k.fase === "klaar" && ctx.reviewUrl && (
        <section className={`${kz.kaart} ${kz.reviewKaart}`}>
          <span className={kz.reviewSterren} aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={18} />)}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className={kz.rijTitel} style={{ fontSize: 17 }}>Tevreden over je dak?</p>
            <p className={kz.sub} style={{ marginTop: 4 }}>Een review op Google helpt me enorm. Het duurt maar een minuutje.</p>
          </div>
          <a className={`${kz.knop} ${kz.knopPrimair}`} href={ctx.reviewUrl} target="_blank" rel="noopener noreferrer">Schrijf een review</a>
        </section>
      )}

      {/* 2. Jouw planning */}
      <section className={kz.kaart}>
        <div className={kz.kaartKop}>
          <h2 className={kz.kaartTitel}><CalendarDays size={18} /> Jouw planning</h2>
        </div>
        {komend.length === 0 && !toonStart ? (
          <p className={kz.leeg}>Zodra je werken gepland zijn, zie je hier wanneer en hoe laat ik kom.</p>
        ) : (
          <ul className={kz.planning}>
            {toonStart && (
              <li>
                <DatumBlok start={k.start!.datum} />
                <span className={kz.rijMidden}>
                  <span className={kz.planningTitel}>{start.zeker ? "Start van je werken" : "Voorlopige start"}</span>
                  <span className={kz.planningDatum}>{start.waarde}</span>
                </span>
              </li>
            )}
            {komend.map((a) => (
              <li key={a.id}>
                <DatumBlok start={a.start} />
                <span className={kz.rijMidden}>
                  <span className={kz.planningTitel}>{a.titel}</span>
                  <span className={kz.planningDatum}>{hfd(fmtDag(a.start))}</span>
                  <span className={kz.planningUur}><Clock size={13} /> {fmtUur(a.start)} tot {eindUur(a.start, a.duurMin)}</span>
                  {(a.info || AFSPRAAK_TIPS[a.titel]) && <span className={kz.planningInfo}>{a.info || AFSPRAAK_TIPS[a.titel]}</span>}
                </span>
                {kanVerzetten(a, ctx) && (
                  <span className={kz.planningActie}>
                    <VerzetKnop klantId={k.id} afspraakId={a.id} titel={`${a.titel}, nu op ${fmtDag(a.start)} om ${fmtUur(a.start)}`} momenten={ctx.vrijeMomenten} dagLabels={ctx.dagLabels} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 3. Wie er komt */}
      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><UserRound size={18} /> Wie er komt</h2></div>
        <div className={kz.vakman}>
          <video className={kz.vakmanVideo} src="/videos/yannick-hero.mp4" poster={YANNICK_FOTO} controls muted playsInline preload="none" />
          <div>
            <p className={kz.rijTitel} style={{ fontSize: 18 }}>Hey, ik ben Yannick</p>
            <p className={kz.sub} style={{ marginTop: 6 }}>Ik ben verantwoordelijk voor jouw werk en voer de werken zelf uit.</p>
            <p className={kz.sub} style={{ marginTop: 6 }}>Heb je vragen? Stuur me gerust een WhatsApp, ik reageer snel. Of bel me.</p>
            <div className={kz.rijKnoppen}>
              <a className={`${kz.knop} ${kz.knopPrimair}`} href={waLink(k)} target="_blank" rel="noopener noreferrer"><WaIcoon size={16} /> WhatsApp</a>
              <a className={`${kz.knop} ${kz.knopLicht}`} href="tel:+32468352869">Bellen</a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Werffoto's (alleen als er foto's zijn) */}
      {k.fotos.length > 0 && <section className={kz.kaart}>
        <div className={kz.kaartKop}>
          <h2 className={kz.kaartTitel}><Camera size={18} /> Werffoto&apos;s</h2>
          {k.fotos.length > 0 && <Link href="?tab=fotos" className={kz.meerLink}>Alle foto&apos;s <ArrowRight size={14} /></Link>}
        </div>
        {voor && na ? (
          <>
            <VoorNa voor={voor.url} na={na.url} />
          </>
        ) : (
          <FotoGalerij fotos={k.fotos.slice(0, 6)} />
        )}
      </section>}

      {/* 5. Offertes en facturen (alleen als er zijn) */}
      {prijsDocs.length > 0 && <section className={kz.kaart}>
        <div className={kz.kaartKop}>
          <h2 className={kz.kaartTitel}><Wallet size={18} /> Offertes en facturen</h2>
          <Link href="?tab=documenten" className={kz.meerLink}>Documenten <ArrowRight size={14} /></Link>
        </div>
        <DocumentLijst documenten={prijsDocs} labels={labels} />
      </section>}

    </>
  );
}

/* ══ Foto's ════════════════════════════════════════════════════════════════ */

function Fotos({ k }: Ctx) {
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  const groepen: FotoFase[] = ["inspectie", "voor", "tijdens", "na", "klant"];

  return (
    <>
      <PaginaKop
        titel="Foto's"
        teller={k.fotos.length}
        sub="Inspectie, voor, tijdens en na. Tik op een foto om ze groot te bekijken."
      />
      {voor && na && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}><h2 className={kz.kaartTitel}>Voor en na</h2></div>
          <VoorNa voor={voor.url} na={na.url} />
        </section>
      )}
      {k.fotos.length === 0 && <Leeg>Zodra ik je dak bekijk of aan de slag ga, verschijnen hier de foto&apos;s.</Leeg>}
      {groepen.map((g) => {
        const lijst = k.fotos.filter((f) => f.fase === g);
        if (!lijst.length) return null;
        return (
          <section key={g} className={kz.kaart}>
            <div className={kz.kaartKop}>
              <h2 className={kz.kaartTitel}>{FOTO_FASE_LABEL[g]}</h2>
              <span className={kz.badge}>{lijst.length}</span>
            </div>
            <FotoGalerij fotos={lijst} />
          </section>
        );
      })}
    </>
  );
}

/* ══ Documenten ════════════════════════════════════════════════════════════ */

function Documenten({ k }: Ctx) {
  const labels = Object.fromEntries(k.documenten.map((d) => [d.id, { datum: fmtKort(d.datum), bedrag: d.bedrag ? fmtEuro(d.bedrag) : undefined }]));
  return (
    <>
      <PaginaKop titel="Documenten" teller={k.documenten.length} sub="Alles op één plek. Tik op een document om het te bekijken of te downloaden." />
      {k.documenten.length === 0 && <Leeg>Je offerte, facturen en garantie verschijnen hier zodra ze klaar zijn.</Leeg>}
      {DOC_GROEPEN.map((g) => ({ ...g, lijst: k.documenten.filter((d) => g.types.includes(d.type)) }))
        .filter((g) => g.lijst.length).map((g) => (
          <section key={g.titel} className={kz.kaart}>
            <div className={kz.kaartKop}>
              <h2 className={kz.kaartTitel}>{g.titel}</h2>
              <span className={kz.badge}>{g.lijst.length}</span>
            </div>
            <DocumentLijst documenten={g.lijst} labels={labels} />
          </section>
        ))}
    </>
  );
}

/* ══ Mijn dak: opmerkingen, onderhoud en garantie ═════════════════════════ */

const ONDERHOUD_FOTO = "/images/Antimos%20op%20dak.jpg";

function MijnDak({ k, controle }: Ctx) {
  const opm = (k.aanbevelingen ?? []).filter((a) => a.status === "open" || a.status === "aangevraagd");
  const oog = (k.paspoort?.aandachtspunten ?? "").split("\n").map((r) => r.trim()).filter(Boolean);
  const melding = [...(k.opmerkingen ?? [])].reverse().find((o) => o.belangrijk && o.van === "yannick");
  const garantie = garantieStaat(k);
  const certificaat = k.documenten.find((d) => d.type === "garantie");
  const gevraagd = (k.aanvragen ?? []).some((a) => a.status === "nieuw" && a.soort === "onderhoud");
  const maanden = controle ? Math.max(0, Math.round(dagenTot(controle.datum) / 30.44)) : null;
  const wanneer = maanden === null ? "" : maanden > 1 ? `over ${maanden} maanden` : maanden === 1 ? "volgende maand" : "nu";

  return (
    <>
      <PaginaKop titel="Mijn dak" />

      {melding && (
        <p className={kz.rapportMelding} style={{ marginTop: 18 }}>
          <strong>Belangrijk · </strong>{melding.tekst}
          <span> Yannick, {fmtMoment(melding.datum)}</span>
        </p>
      )}

      {/* 1. Opmerkingen */}
      <section className={kz.dakBlok}>
        <div className={kz.dakBlokKop}>
          <h2 className={kz.dakTitel}>Opmerkingen</h2>
          {opm.length > 0 && <span className={kz.dakTeller}>{opm.length}</span>}
        </div>
        {opm.length === 0 && oog.length === 0 && (
          <p className={kz.rapportTekst} style={{ marginTop: 0 }}>Geen opmerkingen. Je dak is in orde.</p>
        )}
        {opm.length > 0 && (
          <ol className={kz.dakPunten}>
            {opm.map((a, i) => (
              <li key={a.id} className={a.fotoUrl ? undefined : kz.dakPuntZonder}>
                {a.fotoUrl && (
                  <figure className={kz.dakPuntFoto}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.fotoUrl} alt={a.titel} />
                  </figure>
                )}
                <div>
                  <p className={kz.dakPuntMeta}><span>{String(i + 1).padStart(2, "0")}</span>{fmtKort(a.datum)}</p>
                  <h3 className={kz.rapportSubkop}>{a.titel}</h3>
                  {a.tekst && <p className={kz.rapportTekst}>{a.tekst}</p>}
                  <div style={{ marginTop: 14 }}>
                    <AanvraagKnop
                      klantId={k.id} soort="aanbeveling" aanbevelingId={a.id} klein licht alGevraagd={a.status === "aangevraagd"} alGevraagdTekst="Gevraagd, ik laat iets weten"
                      label="Vraag een prijs" titel={a.titel}
                      uitleg="Ik laat je weten wat het kost en wanneer ik het kan doen. Je zit nergens aan vast."
                      placeholder="Vraag of opmerking (optioneel)"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
        {oog.length > 0 && (
          <div className={kz.dakOog} style={opm.length ? undefined : { marginTop: 0 }}>
            <p className={kz.dakOogKop}>Om in het oog te houden</p>
            <ul className={kz.rapportLijst}>{oog.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
        )}
      </section>

      {/* 2. Onderhoud: een aanbod, geen verplichting */}
      <section className={kz.dakOnderhoud}>
        <div className={kz.dakOnderhoudBeeld}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ONDERHOUD_FOTO} alt="Anti-mosbehandeling op een dak" />
          {controle && (
            <p className={kz.dakOnderhoudDatum}>
              <span>Aangeraden</span>
              <strong>{hfd(fmtMaand(controle.datum))}</strong>
              <span>{wanneer}</span>
            </p>
          )}
        </div>
        <div className={kz.dakOnderhoudTekst}>
          <p className={kz.dakEyebrow}>Onderhoud na je reiniging</p>
          <h2 className={kz.dakTitelGroot}>Hou je dak jarenlang proper</h2>
          <p className={kz.rapportTekst}>
            Je dak is gereinigd. Met een onderhoudsbeurt blijft het zo. Ik breng preventief een anti-mosbehandeling aan,
            zodat nieuwe mos geen kans krijgt, en ik inspecteer meteen je dak.
          </p>
          <dl className={kz.dakInbegrepen}>
            <div><dt>Preventieve anti-mosbehandeling</dt><dd>Remt nieuwe mos en algen af, nog voor je ze ziet.</dd></div>
            <div><dt>Inspectie van je dak</dt><dd>Ik kijk de pannen, de nok en de aansluitingen na en stuur je de foto&apos;s.</dd></div>
          </dl>
          <div className={kz.dakOnderhoudVoet}>
            <AanvraagKnop
              klantId={k.id} soort="onderhoud" alGevraagd={gevraagd} alGevraagdTekst="Aangevraagd, ik neem contact op"
              label="Ja, plan mijn onderhoud"
              titel="Onderhoud inplannen"
              uitleg="Ik neem contact op om een moment af te spreken. Ik ken je dak al, je hoeft niets opnieuw uit te leggen."
              placeholder="bv. Liefst in het voorjaar."
            />
            <span className={kz.rijSub}>Vrijblijvend. Je krijgt eerst een prijs.</span>
          </div>
        </div>
      </section>

      {/* 3. Garantie */}
      {(garantie.length > 0 || certificaat) && (
        <section className={kz.dakBlok}>
          <div className={kz.dakBlokKop}>
            <h2 className={kz.dakTitel}>Garantie</h2>
            {certificaat && (
              <a href={certificaat.url} target="_blank" rel="noopener noreferrer" className={kz.rapportLink} style={{ marginTop: 0 }}>Download het certificaat</a>
            )}
          </div>
          {garantie.length > 0 && (
            <div className={kz.dakGarantie}>
              {garantie.map((g) => {
                const [getal, ...rest] = g.titel.split(" jaar ");
                return (
                  <div key={g.id}>
                    <p className={kz.dakGarantieGetal}>{getal} jaar</p>
                    <p className={kz.dakGarantieWat}>{g.id === "coat" ? "Op je dakcoating" : hfd(rest.join(" jaar "))}</p>
                    <p className={kz.rijSub}>{g.staat}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <footer className={kz.rapportVoet} style={{ paddingTop: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={YANNICK_FOTO} alt="" />
        <p><span className={kz.rapportHandtekening}>Yannick</span><span>MOS-X · dakreiniging en dakcoating</span></p>
      </footer>
    </>
  );
}

/* ══ Extra's ═══════════════════════════════════════════════════════════════ */

function Extras({ k }: Ctx) {
  const gevraagd = (naam: string) => (k.aanvragen ?? []).some((a) => a.status === "nieuw" && a.soort === "extra" && a.tekst.startsWith(naam));
  return (
    <>
      <PaginaKop titel="Extra's" sub="Ben ik toch bij je? Dan neem ik dit er graag bij. Je krijgt eerst een prijs." />
      <div className={kz.extraRaster}>
        {EXTRAS.map((x) => {
          const Icoon = EXTRA_ICOON[x.id];
          return (
            <section key={x.id} className={kz.extra}>
              <span className={`${kz.statIcoon} ${kz.tintGroen}`}><Icoon size={18} /></span>
              <h2 className={kz.extraNaam}>{x.naam}</h2>
              <p className={kz.extraTekst}>{x.tekst}</p>
              <div className={kz.extraKnop}>
                <AanvraagKnop
                  klantId={k.id} soort="extra" voorvoegsel={x.naam} alGevraagd={gevraagd(x.naam)} alGevraagdTekst="Gevraagd"
                  label="Ik heb interesse" licht klein titel={x.naam}
                  uitleg="Ik bezorg je vrijblijvend een prijs. Ben ik al in de buurt, dan combineer ik het met je andere werken."
                  placeholder="bv. Ook de goten aan de achterkant."
                />
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

/* ══ Acties: kortingen en het buurvoordeel ═════════════════════════════════ */

function Acties({ k, refUrl, burenVoordeel, acties }: Ctx) {
  const verwezen = (k.verwijzingen ?? []).length;
  return (
    <>
      <PaginaKop titel="Acties" sub="Voordelen voor jou als klant van MOS-X." />

      {acties.map((a) => (
        <section key={a.id} className={`${kz.kaart} ${kz.actie}`}>
          <span className={`${kz.statIcoon} ${kz.tintOranje}`}><Tag size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className={kz.rijTitel} style={{ fontSize: 17 }}>{a.titel}</p>
            <p className={kz.sub} style={{ marginTop: 4 }}>{a.tekst}</p>
            {a.geldigTot && <p className={kz.tijdDatum}>Geldig tot {fmtKort(a.geldigTot)}</p>}
          </div>
        </section>
      ))}

      <section className={`${kz.kaart} ${kz.actie}`}>
        <span className={`${kz.statIcoon} ${kz.tintGroen}`}><Users size={18} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className={kz.rijTitel} style={{ fontSize: 17 }}>Buurvoordeel</p>
          <p className={kz.sub} style={{ marginTop: 4, marginBottom: 12 }}>
            Deel je link met buren, familie of vrienden.{burenVoordeel ? ` ${burenVoordeel}` : " Werk ik in dezelfde straat, dan bespaar ik verplaatsingen, en dat merk je."}
          </p>
          <DeelBuurlink url={refUrl} voornaam={k.voornaam} />
          {verwezen > 0 && <p className={kz.ok}><CheckCircle2 size={15} style={{ verticalAlign: -3 }} /> {verwezen} {verwezen === 1 ? "persoon kwam" : "mensen kwamen"} via jouw link. Bedankt!</p>}
        </div>
      </section>
    </>
  );
}

/* ══ Logboek ═══════════════════════════════════════════════════════════════ */

function Logboek({ k }: Ctx) {
  const notities = k.notities ?? [];
  const behandelingen = k.behandelingen ?? [];

  return (
    <>
      <PaginaKop titel="Logboek" sub="Mijn notities en de werken die ik uitvoerde." />

      {notities.map((n) => (
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

      {behandelingen.length > 0 && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Wrench size={18} /> Uitgevoerde werken</h2></div>
          <ul className={kz.planning}>
            {behandelingen.map((b) => (
              <li key={b.id}>
                <DatumBlok start={b.datum} />
                <span className={kz.rijMidden}>
                  <span className={kz.planningTitel}>{b.soort}</span>
                  {b.opmerking && <span className={kz.planningDatum}>{b.opmerking}</span>}
                  {b.producten && <span className={kz.planningUur}>Gebruikt: {b.producten}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

    </>
  );
}

/* ══ Pagina ════════════════════════════════════════════════════════════════ */

export default async function KlantPagina({
  params, searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { token } = await params;
  const { tab: tabRuw } = await searchParams;
  const ruw = await getKlant(token);

  if (!ruw) {
    return (
      <main className={kz.page}>
        <div className={kz.wrap} style={{ paddingTop: 80, textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.avif" alt="MOS-X" className={kz.logo} style={{ margin: "0 auto 28px", height: 40 }} />
          <h1 className={kz.paginaTitel} style={{ justifyContent: "center" }}>Deze link werkt niet (meer)</h1>
          <p className={kz.sub} style={{ maxWidth: 420, margin: "12px auto 24px" }}>
            Misschien is de link onvolledig gekopieerd, of kreeg je intussen een nieuwe. Stuur me een berichtje, dan krijg je meteen je juiste link.
          </p>
          <a className={`${kz.knop} ${kz.knopPrimair}`} href={`https://wa.me/${WA_NUMMER}?text=${encodeURIComponent("Hallo Yannick, mijn link naar de klantenzone werkt niet. Kan je hem opnieuw sturen?")}`}>
            <WaIcoon size={18} /> Vraag je link op via WhatsApp
          </a>
        </div>
      </main>
    );
  }

  // Wat vanzelf volgt uit de datums (stap, werken, garantie) wordt hier ingevuld
  const k = effectief(ruw);
  const instellingen = await getInstellingen();
  const acties = (instellingen.acties ?? []).filter((a) => !a.geldigTot || a.geldigTot >= vandaag());
  const controle = volgendeControle(k);

  // Het menu groeit mee: een onderdeel verschijnt pas als er iets in staat
  const zichtbaar: Record<TabId, boolean> = {
    overzicht: true,
    fotos: k.fotos.length > 0,
    documenten: k.documenten.length > 0,
    dak: true, // opmerkingen, tips en onderhoud: altijd nuttig
    extras: k.fase !== "gepland", // pas als ik ter plaatse ben, niet al bij de planning
    acties: k.fase !== "gepland" && (acties.length > 0 || k.fase === "klaar" || k.fase === "nazorg"),
    logboek: (k.notities ?? []).length > 0 || (k.behandelingen ?? []).length > 0,
  };
  const tabs = TABS.filter((t) => zichtbaar[t.id]);
  // Op gsm: alles onderaan als het past (max. 5), anders de 4 hoofdonderdelen + "Meer"
  const onderaan: TabId[] = tabs.length <= 5 ? tabs.map((t) => t.id) : ONDERAAN.filter((id) => zichtbaar[id]);
  const tab: TabId = tabs.some((t) => t.id === tabRuw) ? (tabRuw as TabId) : "overzicht";
  const grens = nuMs() + VERZET_UREN * 3_600_000;
  const vrijeMomenten = (await getMomenten()).filter((m) => brusselNaarDate(m.start).getTime() > grens).slice(0, 30);
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "www.mos-x.be";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const refCode = await zorgVoorRefCode(k);
  const ctx: Ctx = {
    k,
    controle,
    refUrl: `${proto}://${host}/buur/${refCode}`,
    burenVoordeel: instellingen.burenVoordeel,
    acties,
    reviewUrl: instellingen.googleReviewUrl,
    komend: k.afspraken.filter((a) => a.start.slice(0, 10) >= vandaag()),
    voorbij: k.afspraken.filter((a) => a.start.slice(0, 10) < vandaag()),
    vrijeMomenten,
    dagLabels: Object.fromEntries(vrijeMomenten.map((m) => [m.start.slice(0, 10), fmtDag(m.start)])),
    grens,
  };
  const openAanb = (k.aanbevelingen ?? []).filter((a) => a.status === "open");
  const openDocs = k.documenten.filter((d) => d.status === "open").length;
  const teller: Partial<Record<TabId, { n: number; amber?: boolean }>> = {
    fotos: k.fotos.length ? { n: k.fotos.length } : undefined,
    documenten: openDocs ? { n: openDocs, amber: true } : k.documenten.length ? { n: k.documenten.length } : undefined,
    dak: openAanb.length ? { n: openAanb.length, amber: true } : undefined,
    acties: acties.length ? { n: acties.length } : undefined,
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
              {tabs.map((t) => (
                <li key={t.id} className={t.id === tabs.find((x) => !ONDERAAN.includes(x.id))?.id ? kz.navScheiding : undefined}>
                  <Link href={`?tab=${t.id}`} className={`${kz.navItem} ${tab === t.id ? kz.navItemAan : ""}`} aria-current={tab === t.id ? "page" : undefined}>
                    <t.icoon size={18} /> {t.label}
                    {teller[t.id] && <span className={`${kz.navTeller} ${teller[t.id]!.amber ? kz.navTellerAmber : ""}`}>{teller[t.id]!.n}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={kz.zijOnder}>
            <div className={kz.zijKlant}>
              <span className={kz.avatar}>{k.voornaam.charAt(0)}{k.achternaam.charAt(0)}</span>
              <div style={{ minWidth: 0 }}>
                <p className={kz.zijNaam}>{k.voornaam} {k.achternaam}</p>
                <p className={kz.zijAdres}>{k.adres}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className={kz.inhoud}>
          {tab === "overzicht" && <Overzicht {...ctx} />}
          {tab === "fotos" && <Fotos {...ctx} />}
          {tab === "documenten" && <Documenten {...ctx} />}
          {tab === "dak" && <MijnDak {...ctx} />}
          {tab === "extras" && <Extras {...ctx} />}
          {tab === "acties" && <Acties {...ctx} />}
          {tab === "logboek" && <Logboek {...ctx} />}

          <p className={kz.voet}>Bewaar deze link en deel hem niet met anderen.</p>
        </div>
      </div>

      <nav className={kz.onderNav} aria-label="Klantenzone">
        <ul>
          {tabs.filter((t) => onderaan.includes(t.id)).map((t) => (
            <li key={t.id}>
              <Link href={`?tab=${t.id}`} className={`${kz.onderItem} ${tab === t.id ? kz.onderItemAan : ""}`} aria-current={tab === t.id ? "page" : undefined}>
                <t.icoon size={21} />
                {t.label}
                {teller[t.id]?.amber && <span className={kz.onderStip} aria-label="Actie nodig" />}
              </Link>
            </li>
          ))}
          {tabs.some((t) => !onderaan.includes(t.id)) && (
            <li><MeerMenu actief={tab} zichtbaar={tabs.filter((t) => !onderaan.includes(t.id)).map((t) => t.id)} tellers={{ dak: openAanb.length }} /></li>
          )}
        </ul>
      </nav>
    </main>
  );
}
