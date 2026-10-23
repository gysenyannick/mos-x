import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CalendarDays, Camera, CheckCircle2, Clock,
  FileText, Home, LayoutDashboard, Leaf, ShieldCheck,
  Gift, Lightbulb, MessagesSquare, Siren, Star, Tag, UserRound, Wallet,
} from "lucide-react";
import { headers } from "next/headers";
import { REF_STANDAARD, getInstellingen, getKlant, getMomenten, zorgVoorRefCode, type Actie, type EigenTip } from "@/lib/klantenzone/store";
import { controleBinnen, volgendeControle } from "@/lib/klantenzone/onderhoud";
import { effectief } from "@/lib/klantenzone/auto";
import { dakGegevens, dakfoto, heeftDossier, onderhoudZinvol, werkdagen, type Werkdag } from "@/lib/klantenzone/dak";
import { TIPS } from "@/lib/klantenzone/tips";
import {
  brusselNaarDate, dagenTot, eindUur, fmtDag, fmtDagMaand, fmtEuro, fmtKort, fmtMaand, fmtMoment, fmtUur, groet, hfd,
  maandagVan, nuMs, plusDagen, plusJaren, vandaag,
} from "@/lib/klantenzone/tijd";
import {
  AFSPRAAK_TIPS, DOC_GROEPEN, DOC_IS_FACTUUR, EXTRAS, FASES, FASE_KORT, FASE_LABEL,
  VERZET_UREN,
  type Afspraak, type Klant, type VrijMoment,
} from "@/lib/klantenzone/types";
import AanvraagKnop from "@/components/klantenzone/aanvraag-knop";
import Cadeaubon from "@/components/klantenzone/cadeaubon";
import OpmerkingForm from "@/components/klantenzone/opmerking-form";
import { zetDeelVoorNa } from "@/app/klant/actions";
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
/** Spoednummer (bv. stormschade): voorlopig het gsm-nummer van Yannick */
const SPOED_TEL = "+32468352869";
const SPOED_TOON = "+32 468 35 28 69";
const YANNICK_FOTO = "/images/Yannick%20foto%20op%20dak.JPEG";

/** Menu links. De eerste vier staan op gsm ook onderaan, de rest onder "Meer". */
const TABS = [
  { id: "overzicht", label: "Overzicht", icoon: LayoutDashboard },
  { id: "berichten", label: "Berichten", icoon: MessagesSquare },
  { id: "fotos", label: "Foto's", icoon: Camera },
  { id: "documenten", label: "Documenten", icoon: FileText },
  { id: "dak", label: "Mijn dak", icoon: Home },
  { id: "tips", label: "Tips en advies", icoon: Lightbulb },
  { id: "diensten", label: "Diensten", icoon: Tag },
  { id: "buren", label: "Buurvoordeel", icoon: Gift },
] as const;
type TabId = (typeof TABS)[number]["id"];
const ONDERAAN: TabId[] = ["overzicht", "berichten", "fotos", "dak"];


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
      if (k.start?.precisie === "dag") return `Start op ${fmtDag(k.start.datum)}.`;
      if (k.start) return `Voorlopig gepland ${k.start.precisie === "week" ? `in de week van ${fmtDagMaand(maandagVan(k.start.datum))}` : `in ${fmtMaand(k.start.datum)}`}.`;
      return "Je opdracht is bevestigd. De datum volgt.";
    case "bezig":
      if (bezig) return `Vandaag: ${bezig.naam.toLowerCase()}.`;
      return volgende ? `Volgende stap: ${volgende.titel.toLowerCase()} op ${fmtDag(volgende.start)}.` : "Je werken zijn bezig.";
    case "klaar":
      return "Je dak is klaar.";
    default:
      return "Je werken zijn afgerond.";
  }
}

/** Wat is logisch de volgende stap voor deze klant? */
function volgendeStap(k: Klant, volgende?: Afspraak, controle?: { datum: string } | null): string {
  const dringend = (k.aanbevelingen ?? []).find((a) => a.status === "open" && a.prioriteit === "dringend");
  if (dringend) return `Bekijk Mijn dak: ${dringend.titel.toLowerCase()}.`;
  if (volgende) return `${volgende.titel} op ${fmtDag(volgende.start)} om ${fmtUur(volgende.start)}.`;
  const open = k.documenten.filter((d) => d.status === "open");
  if (open.length) return `Er staat ${open.length === 1 ? "een factuur" : `${open.length} facturen`} klaar om te betalen.`;
  if (k.fase === "klaar") return "Bekijk het resultaat in het fotoverslag.";
  if (controle && controleBinnen(controle.datum) < 90) return `Je onderhoudsbeurt, rond ${fmtMaand(controle.datum)}.`;
  if (controle) return `Onderhoud aangeraden in ${fmtMaand(controle.datum)}. Tot dan hoef je niets te doen.`;
  return "De datum volgt.";
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
    mosvrijJaren > 0 ? { id: "mos", icoon: Leaf, titel: `${mosvrijJaren} jaar mosvrij`, jaren: mosvrijJaren, uitleg: "Komt er toch mos terug in die periode, dan wordt het kosteloos behandeld." } : null,
    coatingJaren > 0 ? { id: "coat", icoon: ShieldCheck, titel: `${coatingJaren} jaar op je dakcoating`, jaren: coatingJaren, uitleg: "Je dakcoating blijft beschermen, zwart op wit." } : null,
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
  reviewCitaat?: string;
  reviewNaam?: string;
  refCode: string;
  refBeloning: number;
  refKorting: number;
  refBonusAantal: number;
  refBonusTekst?: string;
  refDubbelDagen: number;
  refOnderhoudExtra: number;
  eigenTips: EigenTip[];
  dienstFotos: Record<string, string>;
};

function kanVerzetten(a: Afspraak, ctx: Ctx) {
  return brusselNaarDate(a.start).getTime() > ctx.grens && ctx.vrijeMomenten.length > 0;
}

/* ══ Overzicht ═════════════════════════════════════════════════════════════ */

/** Eén werkdag: wat afgewerkt werd, wat Yannick schreef en de foto's van die dag. */
function WerkdagBlok({ dag }: { dag: Werkdag }) {
  return (
    <div className={kz.werkdag}>
      <div className={kz.werkdagKop}>
        <p className={kz.werkdagDatum}>{hfd(fmtDag(dag.dag))}</p>
        {dag.werken.map((w) => <span key={w} className={kz.werkdagChip}><CheckCircle2 size={14} /> {w} afgerond</span>)}
      </div>
      {dag.notities.map((n) => (
        <div key={n.id} className={kz.werkdagNotitie}>
          {n.titel && <p className={kz.werkdagTitel}>{n.titel}</p>}
          <p className={kz.werkdagTekst}>{n.tekst}</p>
        </div>
      ))}
      {dag.fotos.length > 0 && <div className={kz.werkdagFotos}><FotoGalerij fotos={dag.fotos} zonderFilter /></div>}
    </div>
  );
}

function Overzicht(ctx: Ctx) {
  const { k, komend, controle } = ctx;
  const faseIndex = FASES.indexOf(k.fase);
  const start = startTekst(k);
  const toonStart = !!k.start && k.start.datum >= vandaag() && !komend.some((a) => a.titel === "Start werken");
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  const na_werken = k.fase === "klaar" || k.fase === "nazorg";
  // Na de werken: enkel nog wat open staat; de rest zit bij Documenten
  const prijsDocs = k.documenten.filter((d) => (DOC_IS_FACTUUR(d.type) || d.type === "offerte") && (!na_werken || d.status === "open"));
  const labels = Object.fromEntries(k.documenten.map((d) => [d.id, { datum: fmtKort(d.datum), bedrag: d.bedrag ? fmtEuro(d.bedrag) : undefined }]));
  // Wat vandaag al in de statuszin staat, hoeft niet nog eens als "volgende"
  const bezigWerk = (k.werken ?? []).find((w) => w.status === "bezig");
  const volgende = komend.find((a) => !(bezigWerk && a.start.slice(0, 10) === vandaag() && a.titel === bezigWerk.naam));
  const berichtVers = !!k.bericht && (!k.berichtDatum || dagenTot(k.berichtDatum.slice(0, 10)) >= -7);
  const melding = [...(k.opmerkingen ?? [])].reverse().find((o) => o.belangrijk && o.van === "yannick" && dagenTot(o.datum.slice(0, 10)) >= -14);
  const laatsteDag = k.fase === "bezig" || k.fase === "klaar" ? werkdagen(k).find((d) => d.dag >= (k.start?.datum ?? "0000")) : undefined;

  return (
    <>
      <section className={kz.appKop}>
        <p className={kz.appLabel}>Mijn MOS-X</p>
        <h1 className={kz.appGroet}>{groetKort()}, {k.voornaam}</h1>
        <span className={kz.appStreep} aria-hidden="true" />
      </section>

      <section className={kz.statusKaart}>
        <div className={kz.statusBoven}>
          <span className={kz.statusStap}><span className={kz.verbergMobiel}>{k.dienst || "Dakwerken"} · </span>Stap {faseIndex + 1} van {FASES.length}</span>
        </div>
        <h2 className={kz.statusZin}>{statusZin(k, volgende)}</h2>
        <p className={kz.statusVolgende}><strong>Volgende:</strong> {volgendeStap(k, volgende, controle)}</p>

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

        {berichtVers && (
          <blockquote className={kz.statusBericht}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={YANNICK_FOTO} alt="" />
            <div>
              <p>{k.bericht}</p>
              {k.berichtDatum && <p className={kz.statusBerichtDatum}>Yannick · {fmtMoment(k.berichtDatum)}</p>}
            </div>
          </blockquote>
        )}
      </section>

      {melding && (
        <Link href="?tab=berichten" className={kz.meldingBalk}>
          <strong>Belangrijk</strong> {melding.tekst}
        </Link>
      )}

      {/* Na de oplevering: de review vraag bovenaan, dat moet opvallen */}
      {na_werken && <ReviewKaart {...ctx} />}

      {/* Tijdens de werken: wat er de laatste werkdag gebeurde */}
      {laatsteDag && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><Camera size={18} /> Wat er gebeurde</h2>
            <Link href="?tab=fotos" className={kz.meerLink}>Volledig verslag <ArrowRight size={14} /></Link>
          </div>
          <WerkdagBlok dag={laatsteDag} />
        </section>
      )}

      {/* Planning (na de werken enkel als er nog iets gepland staat) */}
      {(!na_werken || komend.length > 0) && <section className={kz.kaart}>
        <div className={kz.kaartKop}>
          <h2 className={kz.kaartTitel}><CalendarDays size={18} /> Jouw planning</h2>
        </div>
        {komend.length === 0 && !toonStart ? (
          <p className={kz.leeg}>Zodra de datum vastligt, zie je hier wanneer Yannick komt.</p>
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
      </section>}

      {/* Je vakman */}
      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><UserRound size={18} /> Je vakman</h2></div>
        <div className={kz.vakman}>
          <video className={kz.vakmanVideo} src="/videos/yannick-hero.mp4" poster={YANNICK_FOTO} controls muted playsInline preload="none" />
          <div>
            <p className={kz.rijTitel} style={{ fontSize: 18 }}>Hey, ik ben Yannick</p>
            <p className={kz.sub} style={{ marginTop: 6 }}>Zaakvoerder van MOS-X. Ik voer de werken zelf uit.</p>
            <p className={kz.sub} style={{ marginTop: 6 }}>Een vraag? Stuur me een bericht, een WhatsApp of bel me.</p>
            <div className={kz.rijKnoppen}>
              <Link className={`${kz.knop} ${kz.knopPrimair}`} href="?tab=berichten"><MessagesSquare size={16} /> Bericht</Link>
              <a className={`${kz.knop} ${kz.knopLicht}`} href={waLink(k)} target="_blank" rel="noopener noreferrer"><WaIcoon size={16} /> WhatsApp</a>
              <a className={`${kz.knop} ${kz.knopLicht}`} href="tel:+32468352869">Bellen</a>
            </div>
          </div>
        </div>
      </section>

      {/* Na de werken: het onderhoud, want daar blijft je dak mooi door */}
      {na_werken && onderhoudZinvol(k) && <OnderhoudAanbod k={k} controle={controle} />}

      {na_werken && voor && na && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><Camera size={18} /> Voor en na</h2>
            <Link href="?tab=fotos" className={kz.meerLink}>Fotoverslag <ArrowRight size={14} /></Link>
          </div>
          <VoorNa voor={voor.url} na={na.url} />
        </section>
      )}

      {/* Offertes en facturen (na de werken enkel wat nog open staat) */}
      {prijsDocs.length > 0 && <section className={kz.kaart}>
        <div className={kz.kaartKop}>
          <h2 className={kz.kaartTitel}><Wallet size={18} /> Offertes en facturen</h2>
          <Link href="?tab=documenten" className={kz.meerLink}>Documenten <ArrowRight size={14} /></Link>
        </div>
        <DocumentLijst documenten={prijsDocs} labels={labels} />
      </section>}

      {/* Na de werken: doorverwijzen */}
      {na_werken && ctx.refBeloning > 0 && (
        <Link href="?tab=buren" className={kz.burenTeaser}>
          <span className={kz.burenTeaserBedrag}>€&nbsp;{(dubbelTot(k, ctx.refDubbelDagen) ?? "") >= vandaag() ? ctx.refBeloning * 2 : ctx.refBeloning}</span>
          <span>
            <strong>Voor jou per buur die klant wordt</strong>
            <span>En je buur krijgt €&nbsp;{ctx.refKorting} korting. Bekijk je cadeaubon.</span>
          </span>
          <ArrowRight size={18} />
        </Link>
      )}
    </>
  );
}

/* ══ Foto's: het verslag per werkdag ══════════════════════════════════════ */

function Fotos({ k }: Ctx) {
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  const dagen = werkdagen(k);

  return (
    <>
      <PaginaKop titel="Fotoverslag" teller={k.fotos.length} sub="Per dag: wat er gebeurde, met de foto's. Tik op een foto om ze groot te bekijken." />
      {voor && na && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}><h2 className={kz.kaartTitel}>Voor en na</h2></div>
          <VoorNa voor={voor.url} na={na.url} />
        </section>
      )}
      {dagen.length === 0 && <Leeg>Zodra je dak bekeken of behandeld wordt, verschijnen hier de foto&apos;s.</Leeg>}
      {dagen.map((d) => (
        <section key={d.dag} className={kz.kaart}>
          <WerkdagBlok dag={d} />
        </section>
      ))}
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

/* ══ Onderhoud: het aanbod, op Mijn dak en op het overzicht ═══════════════ */

const ONDERHOUD_FOTO = "/images/Antimos%20op%20dak.jpg";

function OnderhoudAanbod({ k, controle }: { k: Klant; controle: Ctx["controle"] }) {
  const gevraagd = (k.aanvragen ?? []).some((a) => a.status === "nieuw" && a.soort === "onderhoud");
  const maanden = controle ? Math.max(0, Math.round(dagenTot(controle.datum) / 30.44)) : null;
  const wanneer = maanden === null ? "" : maanden > 1 ? `Over ${maanden} maanden` : maanden === 1 ? "Volgende maand" : "Nu";
  return (
    <section className={kz.dakOnderhoud}>
      <div className={kz.dakOnderhoudBeeld}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ONDERHOUD_FOTO} alt="Anti-mosbehandeling op een dak" />
      </div>
      <div className={kz.dakOnderhoudTekst}>
        <p className={kz.dakEyebrow}>Onderhoud</p>
        <h2 className={kz.dakTitelGroot}>Hou je dak proper</h2>
        <p className={kz.rapportTekst}>
          Na de reiniging is je dak weer als nieuw. Met een onderhoudsbeurt blijft dat zo: je dak krijgt een preventieve
          anti-mosbehandeling en een volledige inspectie.
        </p>
        <div className={kz.dakInbegrepen}>
          <div><strong>Anti-mos</strong><span>Preventief</span></div>
          <div><strong>Inspectie</strong><span>Met foto&apos;s</span></div>
          <div><strong>{controle ? hfd(fmtMaand(controle.datum)) : "Later"}</strong><span>{controle ? wanneer : "Na je werken"}</span></div>
        </div>
        <div className={kz.dakOnderhoudVoet}>
          <AanvraagKnop
            klantId={k.id} soort="onderhoud" alGevraagd={gevraagd} alGevraagdTekst="Aangevraagd, Yannick neemt contact op"
            label="Plan mijn onderhoud"
            titel="Onderhoud inplannen"
            uitleg="Yannick neemt contact op om een moment af te spreken. Je dak is al gekend, je hoeft niets opnieuw uit te leggen."
            placeholder="bv. Liefst in het voorjaar."
          />
          <span className={kz.rijSub}>Vrijblijvend, je krijgt eerst een prijs.</span>
        </div>
      </div>
    </section>
  );
}

/* ══ Mijn dak: dakdossier, onderhoud, opmerkingen en garantie ═════════════ */

function MijnDak({ k, controle }: Ctx) {
  const opm = (k.aanbevelingen ?? []).filter((a) => a.status === "open" || a.status === "aangevraagd");
  const oog = (k.paspoort?.aandachtspunten ?? "").split("\n").map((r) => r.trim()).filter(Boolean);
  const garantie = garantieStaat(k);
  const certificaat = k.documenten.find((d) => d.type === "garantie");
  const gegevens = dakGegevens(k);
  const historiek = k.behandelingen ?? [];
  const foto = dakfoto(k);

  return (
    <>
      <PaginaKop titel="Mijn dak" />

      {/* 1. Dakdossier */}
      <section className={`${kz.dakBlok} ${kz.dakDossier} ${foto ? "" : kz.dakDossierZonder}`}>
        {foto && (
          <figure className={kz.dakDossierFoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foto.url} alt="Je dak" />
            <figcaption>{fmtKort(foto.datum)}</figcaption>
          </figure>
        )}
        <div>
          <div className={kz.dakBlokKop} style={{ marginBottom: 0 }}>
            <h2 className={kz.dakTitel}>Dakdossier</h2>
            {heeftDossier(k) && (
              <a href={`/klant/${k.id}/dakdossier`} target="_blank" rel="noopener noreferrer" className={kz.rapportLink} style={{ marginTop: 0 }}>Download als PDF</a>
            )}
          </div>
          {gegevens.length > 0 ? (
            <dl className={kz.dakSpecs}>
              {gegevens.map((g) => (
                <div key={g.label}><dt>{g.label}</dt><dd>{g.waarde}</dd></div>
              ))}
            </dl>
          ) : (
            <p className={kz.rapportTekst}>Na het eerste bezoek vind je hier alles over je dak.</p>
          )}
          {historiek.length > 0 && (
            <>
              <h3 className={kz.dakSubtitel}>Uitgevoerde werken</h3>
              <ul className={kz.dakHistoriek}>
                {historiek.map((b) => (
                  <li key={b.id}><span>{fmtKort(b.datum)}</span><strong>{b.soort}</strong></li>
                ))}
              </ul>
            </>
          )}
          {k.fotos.length > 0 && (
            <Link href="?tab=fotos" className={kz.rapportLink}>Fotoverslag ({k.fotos.length} foto&apos;s)</Link>
          )}
        </div>
      </section>

      {/* 2. Onderhoud (pas na de werken) */}
      {onderhoudZinvol(k) && <OnderhoudAanbod k={k} controle={controle} />}

      {/* 3. Opmerkingen en aandachtspunten: wat nu niet gebeurde, maar later kan */}
      <section className={kz.dakBlok}>
        <div className={kz.dakBlokKop}>
          <h2 className={kz.dakTitel}>Opmerkingen</h2>
          {opm.length > 0 && <span className={kz.dakTeller}>{opm.length}</span>}
        </div>
        {opm.length === 0 && oog.length === 0 && (
          <p className={kz.rapportTekst} style={{ marginTop: 0 }}>Geen opmerkingen.</p>
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
                  <p className={kz.dakPuntMeta}><span>{String(i + 1).padStart(2, "0")}</span>{fmtKort(a.datum)}{a.prioriteit === "info" && " · ter info"}</p>
                  <h3 className={kz.rapportSubkop}>{a.titel}</h3>
                  {a.tekst && <p className={kz.rapportTekst}>{a.tekst}</p>}
                  {a.prioriteit !== "info" && <div style={{ marginTop: 14 }}>
                    <AanvraagKnop
                      klantId={k.id} soort="aanbeveling" aanbevelingId={a.id} klein licht alGevraagd={a.status === "aangevraagd"} alGevraagdTekst="Aangevraagd, Yannick neemt contact op"
                      label="Vraag een prijs" titel={a.titel}
                      uitleg="Je krijgt eerst een prijs en een voorstel van datum. Je zit nergens aan vast."
                      placeholder="Vraag of opmerking (optioneel)"
                    />
                  </div>}
                </div>
              </li>
            ))}
          </ol>
        )}
        {oog.length > 0 && (
          <div className={kz.dakOog} style={opm.length ? undefined : { marginTop: 0 }}>
            <p className={kz.dakOogKop}>Aandachtspunten</p>
            <ul className={kz.rapportLijst}>{oog.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
        )}
      </section>

      {/* 4. Garantie */}
      {(garantie.length > 0 || certificaat) && (
        <section className={kz.dakBlok}>
          <div className={kz.dakBlokKop}>
            <h2 className={kz.dakTitel}>Garantie</h2>
            {certificaat && (
              <a href={certificaat.url} target="_blank" rel="noopener noreferrer" className={kz.rapportLink} style={{ marginTop: 0 }}>Certificaat downloaden</a>
            )}
          </div>
          {garantie.length > 0 && (
            <div className={kz.dakGarantie}>
              {garantie.map((g) => (
                <div key={g.id}>
                  <p className={kz.dakGarantieGetal}>{g.titel.split(" jaar")[0]} jaar</p>
                  <p className={kz.dakGarantieWat}>{g.id === "coat" ? "Op je dakcoating" : "Mosvrij"}</p>
                  <p className={kz.rijSub}>{g.staat}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}

/* ══ Berichten: rechtstreeks met Yannick ══════════════════════════════════ */

function Berichten({ k }: Ctx) {
  const lijst = [...(k.opmerkingen ?? [])].sort((a, b) => a.datum.localeCompare(b.datum));
  return (
    <>
      <PaginaKop titel="Berichten" sub="Een vraag, of iets gezien aan je dak? Schrijf het hier. Yannick krijgt het meteen binnen." />
      <section className={kz.kaart}>
        {lijst.length === 0 ? (
          <p className={kz.leeg} style={{ marginTop: 0 }}>Nog geen berichten.</p>
        ) : (
          <ul className={kz.gesprek}>
            {lijst.map((o) => (
              <li key={o.id} className={o.van === "klant" ? kz.gesprekKlant : kz.gesprekYannick}>
                {o.van === "yannick" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={YANNICK_FOTO} alt="" className={kz.gesprekFoto} />
                )}
                <div className={`${kz.gesprekBallon} ${o.belangrijk ? kz.gesprekBelangrijk : ""}`}>
                  {o.belangrijk && <strong className={kz.gesprekLabel}>Belangrijk</strong>}
                  <p>{o.tekst}</p>
                  <span>{o.van === "klant" ? "Jij" : "Yannick"} · {fmtMoment(o.datum)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <OpmerkingForm klantId={k.id} />
      </section>
    </>
  );
}

/* ══ Tips en advies: gratis uitleg, en wat je kan laten doen ══════════════ */

function TipsAdvies({ k, acties, eigenTips }: Ctx) {
  const gevraagdExtra = (naam: string) => (k.aanvragen ?? []).some((a) => a.status === "nieuw" && a.soort === "extra" && a.tekst.startsWith(naam));
  const gevraagdOnderhoud = (k.aanvragen ?? []).some((a) => a.status === "nieuw" && a.soort === "onderhoud");
  return (
    <>
      <PaginaKop titel="Tips en advies" sub="Hoe je dak en je woning er langer mooi bij liggen." />
      <div className={kz.tipRaster2}>
        {eigenTips.map((t) => (
          <article key={t.id} className={kz.tipKaart}>
            {t.fotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.fotoUrl} alt="" className={kz.tipFoto} />
            )}
            <div className={kz.tipInhoud}>
              <div className={kz.tipKop}><span className={kz.dakEyebrow} style={{ margin: 0 }}>{t.onderwerp || "Van Yannick"}</span></div>
              <h2 className={kz.tipTitel}>{t.titel}</h2>
              {t.tekst.length > 220 ? (
                <>
                  <p className={kz.tipIntro}>{t.tekst.slice(0, t.tekst.lastIndexOf(" ", 200))}…</p>
                  <details className={kz.tipMeer}><summary>Lees meer</summary><p style={{ whiteSpace: "pre-line" }}>{t.tekst}</p></details>
                </>
              ) : (
                <p className={kz.tipIntro} style={{ whiteSpace: "pre-line" }}>{t.tekst}</p>
              )}
              {t.bestandUrl && (
                <div className={kz.tipKnop}>
                  <a className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`} href={t.bestandUrl} target="_blank" rel="noopener noreferrer"><FileText size={14} /> {t.bestandNaam || "Bekijk het document"}</a>
                </div>
              )}
            </div>
          </article>
        ))}
        {TIPS.filter((t) => !t.alleenZonderCoating || k.garantie.coatingJaren === 0).map((t) => {
          const extra = t.aanvraag?.extra ? EXTRAS.find((x) => x.id === t.aanvraag!.extra) : undefined;
          const korting = t.aanvraag?.extra ? acties.find((a) => a.extra === t.aanvraag!.extra) : undefined;
          return (
            <article key={t.id} className={kz.tipKaart}>
              {t.foto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.foto} alt="" className={kz.tipFoto} />
              )}
              <div className={kz.tipInhoud}>
                <div className={kz.tipKop}>
                  <span className={kz.dakEyebrow} style={{ margin: 0 }}>{t.onderwerp}</span>
                  {korting && <span className={kz.extraActie}>{korting.titel}</span>}
                </div>
                <h2 className={kz.tipTitel}>{t.titel}</h2>
                <p className={kz.tipIntro}>{t.intro}</p>
                <details className={kz.tipMeer}>
                  <summary>Lees meer</summary>
                  {t.meer.map((p) => <p key={p}>{p}</p>)}
                </details>
                {t.aanvraag && (
                  <div className={kz.tipKnop}>
                    {t.aanvraag.soort === "onderhoud" ? (
                      <AanvraagKnop
                        klantId={k.id} soort="onderhoud" klein licht alGevraagd={gevraagdOnderhoud} alGevraagdTekst="Aangevraagd"
                        label={t.aanvraag.label} titel="Onderhoud inplannen"
                        uitleg="Yannick neemt contact op om een moment af te spreken. Je krijgt eerst een prijs."
                        placeholder="bv. Liefst in het voorjaar."
                      />
                    ) : (
                      <AanvraagKnop
                        klantId={k.id} soort="extra" voorvoegsel={extra?.naam ?? t.titel} klein licht
                        alGevraagd={gevraagdExtra(extra?.naam ?? t.titel)} alGevraagdTekst="Aangevraagd"
                        label={t.aanvraag.label} titel={extra?.naam ?? t.titel}
                        uitleg="Je krijgt vrijblijvend een prijs en een voorstel van datum."
                        placeholder="Iets wat Yannick moet weten? (optioneel)"
                      />
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

    </>
  );
}

/* ══ Diensten en acties ═══════════════════════════════════════════════════ */

function Diensten({ k, acties, controle, dienstFotos }: Ctx) {
  const algemeen = acties.filter((a) => !a.extra || !EXTRAS.some((x) => x.id === a.extra));
  const gevraagdExtra = (naam: string) => (k.aanvragen ?? []).some((a) => a.status === "nieuw" && a.soort === "extra" && a.tekst.startsWith(naam));
  const gevraagdOnderhoud = (k.aanvragen ?? []).some((a) => a.status === "nieuw" && a.soort === "onderhoud");
  return (
    <>
      <PaginaKop titel="Diensten en acties" sub="Nog iets laten doen aan je woning? Je krijgt eerst een vrijblijvende prijs." />
      {algemeen.map((a) => (
        <section key={a.id} className={kz.actieBalk}>
          <p><strong>{a.titel}</strong>{a.tekst ? ` ${a.tekst}` : ""}</p>
          {a.geldigTot && <span>Tot {fmtKort(a.geldigTot)}</span>}
        </section>
      ))}
      <div className={kz.dienstLijst}>
        {onderhoudZinvol(k) && (
          <article className={kz.dienst}>
            <DienstFoto src={dienstFotos.onderhoud ?? ONDERHOUD_FOTO} naam="Onderhoud" />
            <div className={kz.dienstInhoud}>
              <h2 className={kz.dienstTitel}>Onderhoud van je dak</h2>
              <p className={kz.dienstUitleg}>
                Een preventieve anti-mosbehandeling en een volledige inspectie, zodat je dak blijft zoals na de reiniging.
                {controle ? ` Aangeraden in ${fmtMaand(controle.datum)}.` : ""}
              </p>
              <div className={kz.dienstKnop}>
                <AanvraagKnop
                  klantId={k.id} soort="onderhoud" klein alGevraagd={gevraagdOnderhoud} alGevraagdTekst="Aangevraagd"
                  label="Plan mijn onderhoud" titel="Onderhoud inplannen"
                  uitleg="Yannick neemt contact op om een moment af te spreken. Je krijgt eerst een prijs."
                  placeholder="bv. Liefst in het voorjaar."
                />
              </div>
            </div>
          </article>
        )}
        {EXTRAS.filter((x) => x.id !== "coating" || k.garantie.coatingJaren === 0).map((x) => {
          const korting = acties.find((a) => a.extra === x.id);
          return (
            <article key={x.id} className={kz.dienst}>
              <DienstFoto src={dienstFotos[x.id] ?? x.foto} naam={x.naam} />
              <div className={kz.dienstInhoud}>
                {korting && <span className={kz.extraActie} style={{ marginBottom: 8 }}>{korting.titel}{korting.geldigTot ? ` · tot ${fmtKort(korting.geldigTot)}` : ""}</span>}
                <h2 className={kz.dienstTitel}>{x.naam}</h2>
                <p className={kz.dienstUitleg}>{x.tekst}</p>
                <div className={kz.dienstKnop}>
                  <AanvraagKnop
                    klantId={k.id} soort="extra" voorvoegsel={x.naam} klein licht alGevraagd={gevraagdExtra(x.naam)} alGevraagdTekst="Aangevraagd"
                    label="Vraag een prijs" titel={x.naam}
                    uitleg="Je krijgt vrijblijvend een prijs en een voorstel van datum."
                    placeholder="Iets wat Yannick moet weten? (optioneel)"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <Link href="?tab=berichten" className={kz.dienstAnders}>
        <span><strong>Iets anders nodig?</strong> Stuur een bericht, dan kijkt Yannick wat mogelijk is.</span>
        <ArrowRight size={18} />
      </Link>
    </>
  );
}

/** Foto bij een dienst; zonder foto een rustig vlak met de naam. */
function DienstFoto({ src, naam }: { src?: string; naam: string }) {
  return src ? (
    <div className={kz.dienstFoto}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={naam} />
    </div>
  ) : (
    <div className={`${kz.dienstFoto} ${kz.dienstFotoLeeg}`} aria-hidden="true"><span>{naam}</span></div>
  );
}

/* ══ Buurvoordeel: de cadeaubon ═══════════════════════════════════════════ */

const VERWIJZING_KLANT = { nieuw: "Aanvraag ontvangen", gecontacteerd: "Yannick nam contact op", klant: "Klant geworden", geen: "Geen klant geworden" } as const;

/** Tot wanneer de dubbele beloning loopt (enkel na de oplevering), of null. */
function dubbelTot(k: Klant, dagen: number): string | null {
  if (!dagen || !k.garantie.vanaf) return null;
  return plusDagen(k.garantie.vanaf, dagen);
}

/** Tegoed in euro: per buur die klant werd, dubbel als hij binnen de periode na de oplevering kwam. */
function berekenTegoed(k: Klant, beloning: number, dagen: number): number {
  const tot = dubbelTot(k, dagen);
  return (k.verwijzingen ?? []).filter((v) => v.status === "klant")
    .reduce((som, v) => som + (tot && k.garantie.vanaf && v.datum.slice(0, 10) >= k.garantie.vanaf && v.datum.slice(0, 10) <= tot ? 2 : 1) * beloning, 0);
}

function Buren({ k, refUrl, refCode, refBeloning, refKorting, refBonusAantal, refBonusTekst, refDubbelDagen, refOnderhoudExtra, burenVoordeel }: Ctx) {
  const lijst = k.verwijzingen ?? [];
  const klanten = lijst.filter((v) => v.status === "klant").length;
  const tegoed = berekenTegoed(k, refBeloning, refDubbelDagen);
  const opOnderhoud = Math.round(tegoed * (1 + refOnderhoudExtra / 100));
  const tot = dubbelTot(k, refDubbelDagen);
  const nuDubbel = !!tot && tot >= vandaag();
  const perBuur = nuDubbel ? refBeloning * 2 : refBeloning;
  const vakjes = Math.max(5, refBonusTekst ? refBonusAantal : 0, klanten + 1);
  const nogTeGaan = refBonusTekst ? refBonusAantal - klanten : 0;
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  return (
    <>
      <PaginaKop titel="Buurvoordeel" sub={`€ ${perBuur} voor jou, € ${refKorting} korting voor je buur.`} />

      {nuDubbel && (
        <section className={kz.dubbelBalk}>
          <span className={kz.dubbelX}>2×</span>
          <p><strong>Nu dubbel: €&nbsp;{perBuur} per buur.</strong> Je dak is net gedaan en je buren zien het verschil. Dat loopt nog tot {fmtKort(tot!)}.</p>
        </section>
      )}

      <section className={`${kz.kaart} ${kz.burenKaart}`}>
        <Cadeaubon voornaam={k.voornaam} code={refCode} tegoed={tegoed} beloning={perBuur} />
        <div>
          <ol className={kz.burenStappen}>
            <li><span>1</span><p><strong>Deel je link</strong> met buren, familie of vrienden.</p></li>
            <li><span>2</span><p><strong>Je buur krijgt €&nbsp;{refKorting} korting</strong> op zijn eerste werk.</p></li>
            <li><span>3</span><p><strong>Wordt hij klant, dan krijg jij €&nbsp;{perBuur}.</strong> {burenVoordeel ?? (refOnderhoudExtra > 0 ? `Per overschrijving, of ${refOnderhoudExtra}% meer als korting op je onderhoud.` : "Als korting op je volgende onderhoud of per overschrijving.")}</p></li>
          </ol>
          <DeelBuurlink url={refUrl} voornaam={k.voornaam} korting={refKorting} />
        </div>
      </section>

      <section className={kz.kaart}>
        <div className={kz.kaartKop}>
          <h2 className={kz.kaartTitel}>Jouw tegoed</h2>
          <span className={kz.burenTotaal}>€&nbsp;{tegoed}</span>
        </div>
        <div className={kz.burenBalk} aria-label={`${klanten} buren klant geworden`}>
          {Array.from({ length: vakjes }, (_, i) => (
            <span key={i} className={`${i < klanten ? kz.burenVakVol : ""} ${refBonusTekst && i === refBonusAantal - 1 ? kz.burenVakBonus : ""}`}>{refBonusTekst && i === refBonusAantal - 1 ? "Bonus" : `€\u00a0${perBuur}`}</span>
          ))}
        </div>
        {refBonusTekst && (
          <p className={kz.burenBonus}>
            {nogTeGaan > 0
              ? <>Nog <strong>{nogTeGaan} {nogTeGaan === 1 ? "buur" : "buren"}</strong> en je krijgt er <strong>{refBonusTekst}</strong> bovenop.</>
              : <>Bonus behaald: <strong>{refBonusTekst}</strong>. Bedankt!</>}
          </p>
        )}
        {tegoed > 0 && refOnderhoudExtra > 0 && (
          <div className={kz.tegoedKeuze}>
            <div><strong>€&nbsp;{tegoed}</strong><span>per overschrijving</span></div>
            <div className={kz.tegoedKeuzeBeste}><strong>€&nbsp;{opOnderhoud}</strong><span>als korting op je onderhoud</span></div>
          </div>
        )}
        {lijst.length === 0 ? (
          <p className={kz.leeg}>Nog niemand via jouw link. Deel hem hierboven.</p>
        ) : (
          <ul className={kz.burenLijst}>
            {lijst.map((v) => (
              <li key={v.id}>
                <span><strong>{v.naam.split(" ")[0]}</strong> · {fmtKort(v.datum)}</span>
                <span className={v.status === "klant" ? kz.burenPlus : undefined}>{VERWIJZING_KLANT[v.status]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {voor && na && (
        <section className={`${kz.kaart} ${kz.deelVoorNa}`}>
          <div>
            <h2 className={kz.kaartTitel}>Laat je buren het verschil zien</h2>
            <p className={kz.sub} style={{ marginTop: 6 }}>
              Toon je voor- en na-foto op je uitnodiging. Een echt dak uit de buurt overtuigt meer dan eender welke reclame.
              Je buur ziet alleen je voornaam en je gemeente.
            </p>
            <div className={kz.rijKnoppen}>
              <form action={zetDeelVoorNa.bind(null, k.id, !k.deelVoorNa)}>
                <button className={`${kz.knop} ${kz.knopKlein} ${k.deelVoorNa ? kz.knopLicht : kz.knopPrimair}`}>
                  {k.deelVoorNa ? "Foto's niet meer tonen" : "Ja, toon mijn foto's"}
                </button>
              </form>
              {k.deelVoorNa && <span className={kz.ok} style={{ margin: 0 }}><CheckCircle2 size={15} style={{ verticalAlign: -3 }} /> Je buren zien je voor en na</span>}
            </div>
          </div>
          <VoorNa voor={voor.url} na={na.url} />
        </section>
      )}
    </>
  );
}

/* ══ Review: groot, met een echte review erbij ════════════════════════════ */

function ReviewKaart({ reviewUrl, reviewCitaat, reviewNaam }: Ctx) {
  if (!reviewUrl) return null;
  return (
    <section className={`${kz.kaart} ${kz.reviewKaart2}`}>
      <div className={kz.reviewLinks}>
        <span className={kz.reviewSterren} aria-label="5 sterren">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={26} />)}</span>
        <h2 className={kz.reviewTitel}>Tevreden over je dak?</h2>
        <p className={kz.sub} style={{ marginTop: 4 }}>Laat een review achter op Google. Het duurt een minuut en helpt Yannick enorm.</p>
        <div className={kz.rijKnoppen}>
          <a className={`${kz.knop} ${kz.knopPrimair} ${kz.reviewKnop}`} href={reviewUrl} target="_blank" rel="noopener noreferrer"><Star size={16} /> Schrijf een review</a>
        </div>
      </div>
      {reviewCitaat && (
        <figure className={kz.reviewCitaat}>
          <blockquote>“{reviewCitaat}”</blockquote>
          {reviewNaam && <figcaption>{reviewNaam} · op Google</figcaption>}
        </figure>
      )}
    </section>
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
            Misschien is de link onvolledig gekopieerd, of kreeg je intussen een nieuwe. Stuur Yannick een berichtje, dan krijg je meteen je juiste link.
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
  const naWerken = k.fase === "klaar" || k.fase === "nazorg";
  const zichtbaar: Record<TabId, boolean> = {
    overzicht: true,
    berichten: true,
    fotos: k.fotos.length > 0 || (k.notities ?? []).length > 0,
    documenten: k.documenten.length > 0,
    dak: true,
    tips: k.fase !== "gepland",
    diensten: k.fase !== "gepland",
    buren: naWerken,
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
    reviewCitaat: instellingen.reviewCitaat,
    reviewNaam: instellingen.reviewNaam,
    refCode,
    refBeloning: instellingen.refBeloning ?? REF_STANDAARD,
    refKorting: instellingen.refKorting ?? REF_STANDAARD,
    refBonusAantal: instellingen.refBonusAantal ?? 3,
    refBonusTekst: instellingen.refBonusTekst === undefined ? "een gratis onderhoudsbeurt" : instellingen.refBonusTekst || undefined,
    eigenTips: instellingen.tips ?? [],
    refDubbelDagen: instellingen.refDubbelDagen ?? 30,
    refOnderhoudExtra: instellingen.refOnderhoudExtra ?? 50,
    dienstFotos: instellingen.dienstFotos ?? {},
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
    diensten: acties.length ? { n: acties.length } : undefined,
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
            <a className={`${kz.spoedRond} ${kz.alleenMobiel}`} href={`tel:${SPOED_TEL}`} aria-label="Spoed: bel Yannick"><Siren size={15} /> Spoed</a>
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
            <a className={kz.spoed} href={`tel:${SPOED_TEL}`}>
              <Siren size={20} />
              <span><strong>Spoed na een storm?</strong>Bel {SPOED_TOON}</span>
            </a>
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
          {tab === "berichten" && <Berichten {...ctx} />}
          {tab === "tips" && <TipsAdvies {...ctx} />}
          {tab === "diensten" && <Diensten {...ctx} />}
          {tab === "buren" && <Buren {...ctx} />}

          <p className={kz.voet}>Deze pagina is enkel voor jou. Deel de link niet met anderen.</p>
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
            <li><MeerMenu actief={tab} zichtbaar={tabs.filter((t) => !onderaan.includes(t.id)).map((t) => t.id)} tellers={{ dak: openAanb.length, diensten: acties.length }} /></li>
          )}
        </ul>
      </nav>
    </main>
  );
}
