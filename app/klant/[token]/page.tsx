import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CalendarDays, Camera, CheckCircle2, Circle, Clock, FileText, FolderOpen, Gift, Home, LayoutDashboard,
  Leaf, LifeBuoy, MessagesSquare, ShieldCheck, Siren, Star, Tag, UserRound, Wallet, Wrench,
} from "lucide-react";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { getInstellingen, getKlant, getMomenten, listKlanten, zorgVoorRefCode, type Actie, type EigenTip } from "@/lib/klantenzone/store";
import {
  binnenMosGarantie, controle12, controleBinnen, laatsteBehandeling, laatsteControle, mosGarantieTot, volgendeControle,
} from "@/lib/klantenzone/onderhoud";
import { effectief } from "@/lib/klantenzone/auto";
import { dakGegevens, dakfoto, heeftDossier, onderhoudZinvol, werkdagen, type Werkdag } from "@/lib/klantenzone/dak";
import { actieVoorKlant, interesseVoor, refActief, refRegels, tegoedOverzicht, type RefRegels } from "@/lib/klantenzone/voordeel";
import { TIPS } from "@/lib/klantenzone/tips";
import {
  brusselNaarDate, dagenTot, eindUur, fmtDag, fmtDagMaand, fmtEuro, fmtKort, fmtMaand, fmtMoment, fmtUur, groet, hfd,
  maandagVan, nuMs, plusJaren, vandaag,
} from "@/lib/klantenzone/tijd";
import {
  AANVRAAG_LABEL, AANVRAAG_STATUS_LABEL, AFSPRAAK_TIPS, CHECKLIST, DOC_GROEPEN, DOC_IS_FACTUUR, EXTRAS, FASES, FASE_KORT,
  FASE_LABEL, INSPECTIE_LABEL, VERWIJZING_STATUS_LABEL, VERZET_UREN, aanvraagLoopt,
  type Afspraak, type Klant, type VrijMoment,
} from "@/lib/klantenzone/types";
import { reviewWeg, zetChecklist, zetDeelVoorNa, zetMarketing } from "@/app/klant/actions";
import AanvraagKnop from "@/components/klantenzone/aanvraag-knop";
import Cadeaubon from "@/components/klantenzone/cadeaubon";
import DeelBuurlink from "@/components/klantenzone/deel-buurlink";
import DocumentLijst from "@/components/klantenzone/document-lijst";
import FeedbackForm from "@/components/klantenzone/feedback-form";
import FotoGalerij from "@/components/klantenzone/foto-galerij";
import MeerMenu from "@/components/klantenzone/meer-menu";
import OpmerkingForm from "@/components/klantenzone/opmerking-form";
import StormForm from "@/components/klantenzone/storm-form";
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
const ONDERHOUD_FOTO = "/images/Antimos%20op%20dak.jpg";

/** Menu. Op gsm staan de eerste vier onderaan, de rest onder "Meer". */
const TABS = [
  { id: "overzicht", label: "Overzicht", icoon: LayoutDashboard },
  { id: "werken", label: "Mijn werken", icoon: CalendarDays },
  { id: "dossier", label: "Mijn dakdossier", icoon: FolderOpen },
  { id: "dakzorg", label: "Dakzorg", icoon: Leaf },
  { id: "diensten", label: "Diensten", icoon: Wrench },
  { id: "voordelen", label: "Mijn voordelen", icoon: Gift },
  { id: "hulp", label: "Hulp en contact", icoon: LifeBuoy },
] as const;
type TabId = (typeof TABS)[number]["id"];
const ONDERAAN: TabId[] = ["overzicht", "werken", "dossier", "hulp"];
/** Oude links (bv. in een mail) blijven werken */
const OUDE_TABS: Record<string, TabId> = {
  fotos: "werken", documenten: "dossier", dak: "dossier", tips: "dakzorg", buren: "voordelen", berichten: "hulp", extras: "diensten", logboek: "werken",
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

function groetKort(): string {
  return groet().replace("Goede", "Goeie").replace("Goedenavond", "Goeienavond");
}

/** Eén zin in gewone taal: wat gebeurt er nu met je dak? */
function statusZin(k: Klant, volgende?: Afspraak): string {
  const bezig = (k.werken ?? []).find((w) => w.status === "bezig");
  switch (k.fase) {
    case "gepland":
      if (k.start?.precisie === "dag") return `Je werken staan gepland op ${fmtDag(k.start.datum)}.`;
      if (k.start) return `Voorlopig gepland ${k.start.precisie === "week" ? `in de week van ${fmtDagMaand(maandagVan(k.start.datum))}` : `in ${fmtMaand(k.start.datum)}`}.`;
      return "Je opdracht is bevestigd. De datum volgt.";
    case "bezig":
      if (bezig) return `Vandaag: ${bezig.naam.toLowerCase()}.`;
      return volgende ? `Volgende stap: ${volgende.titel.toLowerCase()} op ${fmtDag(volgende.start)}.` : "Je werken zijn bezig.";
    case "klaar":
      return "Je dakwerken zijn afgerond.";
    default:
      return "Je garantie en onderhoudsinfo staan klaar.";
  }
}

/** Wat is logisch de volgende stap voor deze klant? */
function volgendeStap(k: Klant, volgende?: Afspraak): { tekst: string; link?: { label: string; tab: TabId } } {
  const checklistOpen = (k.fase === "gepland") && CHECKLIST.some((c) => !k.checklist?.[c.id]);
  const dringend = (k.aanbevelingen ?? []).find((a) => a.status === "open" && a.prioriteit === "dringend");
  if (dringend) return { tekst: `Bekijk: ${dringend.titel.toLowerCase()}.`, link: { label: "Dakzorg", tab: "dakzorg" } };
  if (checklistOpen) return { tekst: "Bekijk hoe je je voorbereidt op de werken.", link: { label: "Voorbereiding", tab: "werken" } };
  if (volgende) return { tekst: `${volgende.titel} op ${fmtDag(volgende.start)} om ${fmtUur(volgende.start)}.`, link: { label: "Planning", tab: "werken" } };
  const open = k.documenten.filter((d) => d.status === "open");
  if (open.length) return { tekst: `Er staat ${open.length === 1 ? "een factuur" : `${open.length} facturen`} klaar.`, link: { label: "Documenten", tab: "dossier" } };
  if (k.fase === "bezig") return { tekst: "Bekijk de voortgang in het fotoverslag.", link: { label: "Fotoverslag", tab: "werken" } };
  if (k.fase === "klaar") return { tekst: "Bekijk je voor- en nafoto's.", link: { label: "Fotoverslag", tab: "werken" } };
  const c12 = controle12(k);
  if (c12 && !c12.gedaan && controleBinnen(c12.datum) <= 60) return { tekst: `Je gratis dakcontrole komt eraan, rond ${fmtMaand(c12.datum)}.`, link: { label: "Dakzorg", tab: "dakzorg" } };
  return { tekst: "Je dakdossier en garantie staan klaar.", link: { label: "Dakdossier", tab: "dossier" } };
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

function startTekst(k: Klant): { waarde: string; zeker: boolean } {
  if (!k.start) return { waarde: "Nog te plannen", zeker: false };
  const { datum, precisie } = k.start;
  if (precisie === "maand") return { waarde: hfd(fmtMaand(datum)), zeker: false };
  if (precisie === "week") return { waarde: `Week van ${fmtDagMaand(maandagVan(datum))}`, zeker: false };
  return { waarde: hfd(fmtDag(datum)), zeker: true };
}

type GarantieRegel = { id: string; titel: string; staat: string };

function garantieStaat(k: Klant): GarantieRegel[] {
  const { mosvrijJaren, coatingJaren, vanaf } = k.garantie;
  const basis = [
    mosvrijJaren > 0 ? { id: "mos", titel: `${mosvrijJaren} jaar mosvrij`, jaren: mosvrijJaren } : null,
    coatingJaren > 0 ? { id: "coat", titel: `${coatingJaren} jaar op je dakcoating`, jaren: coatingJaren } : null,
  ].filter((x) => x !== null);
  return basis.map(({ jaren, ...x }) => {
    if (!vanaf) return { ...x, staat: "Gaat in bij de oplevering" };
    const tot = plusJaren(vanaf, jaren);
    return { ...x, staat: dagenTot(tot) >= 0 ? `Geldig tot ${fmtKort(tot)}` : `Verlopen op ${fmtKort(tot)}` };
  });
}

function DatumBlok({ start }: { start: string }) {
  return (
    <div className={kz.datumBlok} aria-hidden="true">
      <div className={kz.datumMaand}>{fmtMaand(start).slice(0, 3)}</div>
      <div className={kz.datumDag}>{Number(start.slice(8, 10))}</div>
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
  refCode: string;
  refQr: string;
  regels: RefRegels;
  burenVoordeel?: string;
  /** Acties die voor deze klant gelden, met het aantal aanvragen tot nu */
  acties: { actie: Actie; interesse: number }[];
  reviewUrl?: string;
  reviewCitaat?: string;
  reviewNaam?: string;
  eigenTips: EigenTip[];
  dienstFotos: Record<string, string>;
};

function kanVerzetten(a: Afspraak, ctx: Ctx) {
  return brusselNaarDate(a.start).getTime() > ctx.grens && ctx.vrijeMomenten.length > 0;
}

/* ── Herbruikbare blokken ──────────────────────────────────────────────────── */

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

function Planning(ctx: Ctx) {
  const { k, komend } = ctx;
  const start = startTekst(k);
  const toonStart = !!k.start && k.start.datum >= vandaag() && !komend.some((a) => a.titel === "Start werken");
  if (komend.length === 0 && !toonStart) return <p className={kz.leeg}>Zodra de datum vastligt, zie je hier wanneer Yannick komt.</p>;
  return (
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
            <span className={kz.planningUur}><Clock size={13} /> {fmtUur(a.start)} tot {eindUur(a.start, a.duurMin)} · Yannick</span>
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
  );
}

function Vakman({ k }: { k: Klant }) {
  return (
    <section className={kz.kaart}>
      <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><UserRound size={18} /> Je vakman</h2></div>
      <div className={kz.vakman}>
        <video className={kz.vakmanVideo} src="/videos/yannick-hero.mp4" poster={YANNICK_FOTO} controls muted playsInline preload="none" />
        <div>
          <p className={kz.rijTitel} style={{ fontSize: 18 }}>Hey, ik ben Yannick</p>
          <p className={kz.sub} style={{ marginTop: 6 }}>Zaakvoerder van MOS-X. Ik voer de werken zelf uit.</p>
          <p className={kz.sub} style={{ marginTop: 6 }}>Een vraag? Stuur me een bericht, een WhatsApp of bel me.</p>
          <div className={kz.rijKnoppen}>
            <Link className={`${kz.knop} ${kz.knopPrimair}`} href="?tab=hulp"><MessagesSquare size={16} /> Bericht</Link>
            <a className={`${kz.knop} ${kz.knopLicht}`} href={waLink(k)} target="_blank" rel="noopener noreferrer"><WaIcoon size={16} /> WhatsApp</a>
            <a className={`${kz.knop} ${kz.knopLicht}`} href="tel:+32468352869">Bellen</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Voorbereiding vóór de werken: de klant vinkt zelf af. */
function Checklist({ k }: { k: Klant }) {
  const klaar = CHECKLIST.filter((c) => k.checklist?.[c.id]).length;
  return (
    <section className={kz.kaart}>
      <div className={kz.kaartKop}>
        <h2 className={kz.kaartTitel}><CheckCircle2 size={18} /> Voorbereiding</h2>
        <span className={kz.badge}>{klaar} van {CHECKLIST.length}</span>
      </div>
      <ul className={kz.checklist}>
        {CHECKLIST.map((c) => {
          const aan = !!k.checklist?.[c.id];
          return (
            <li key={c.id}>
              <form action={zetChecklist.bind(null, k.id, c.id, !aan)}>
                <button className={`${kz.checkPunt} ${aan ? kz.checkPuntAan : ""}`} aria-pressed={aan}>
                  {aan ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  <span>{c.tekst}</span>
                </button>
              </form>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ReviewKaart({ k, reviewUrl, reviewCitaat, reviewNaam }: Ctx) {
  if (!reviewUrl || k.review?.weggeklikt) return null;
  return (
    <section className={`${kz.kaart} ${kz.reviewKaart2}`}>
      <div className={kz.reviewLinks}>
        <span className={kz.reviewSterren} aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={24} />)}</span>
        <h2 className={kz.reviewTitel}>Hoe was je ervaring?</h2>
        <p className={kz.sub} style={{ marginTop: 4 }}>Een eerlijke review op Google helpt andere woningeigenaars om een goede keuze te maken.</p>
        <div className={kz.rijKnoppen}>
          <a className={`${kz.knop} ${kz.knopPrimair} ${kz.reviewKnop}`} href={`/api/klantenzone/review?k=${encodeURIComponent(k.id)}`} target="_blank" rel="noopener noreferrer"><Star size={16} /> Schrijf een review</a>
          <FeedbackForm klantId={k.id} />
        </div>
        <form action={reviewWeg.bind(null, k.id)} style={{ marginTop: 10 }}>
          <button className={kz.tekstKnop}>Niet nu</button>
        </form>
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

/** Het onderhoudsvoorstel. Tijdens de mosgarantie: duidelijk dat de garantie er los van staat. */
function OnderhoudAanbod({ k, controle }: { k: Klant; controle: Ctx["controle"] }) {
  const gevraagd = (k.aanvragen ?? []).some((a) => aanvraagLoopt(a.status) && a.soort === "onderhoud");
  const tot = mosGarantieTot(k);
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
        {tot && binnenMosGarantie(k) && (
          <p className={kz.dakVerschil}>Je mosgarantie loopt tot {fmtKort(tot)} en geldt ook zonder onderhoud. Onderhoud is een keuze, geen voorwaarde.</p>
        )}
        <div className={kz.dakOnderhoudVoet}>
          <AanvraagKnop
            klantId={k.id} soort="onderhoud" alGevraagd={gevraagd} alGevraagdTekst="Aangevraagd, Yannick neemt contact op"
            label="Plan mijn onderhoud" titel="Onderhoud inplannen"
            uitleg="Yannick neemt contact op om een moment af te spreken. Je krijgt eerst een prijs."
            placeholder="bv. Liefst in het voorjaar."
          />
          <span className={kz.rijSub}>Vrijblijvend, je krijgt eerst een prijs.</span>
        </div>
      </div>
    </section>
  );
}

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

/** Een actie zoals de klant ze ziet, met voorwaarden en een aanvraagknop. */
function ActieKaart({ k, actie, interesse }: { k: Klant; actie: Actie; interesse: number }) {
  const gevraagd = (k.aanvragen ?? []).some((a) => a.campagneId === actie.id && aanvraagLoopt(a.status));
  const dienst = EXTRAS.find((x) => x.id === actie.extra);
  return (
    <article className={kz.actieKaart}>
      <div>
        <p className={kz.dakEyebrow} style={{ marginBottom: 4 }}>{actie.type === "buurt" ? "Buurtactie" : "Actie"}{actie.geldigTot ? ` · tot ${fmtKort(actie.geldigTot)}` : ""}</p>
        <h3 className={kz.actieTitel}>{actie.titel}</h3>
        {actie.tekst && <p className={kz.actieTekst}>{actie.tekst}</p>}
        {actie.type === "buurt" && actie.werkdag && <p className={kz.actieTekst}><strong>Gepland in je buurt:</strong> {actie.werkdag}</p>}
        {actie.minInteresse ? (
          <p className={kz.actieTekst}>{interesse} van de {actie.minInteresse} woningen toonden interesse. Het voordeel geldt pas als dat aantal bereikt is en Yannick bevestigt dat het te combineren valt.</p>
        ) : null}
        {actie.voorwaarden && (
          <details className={kz.tipMeer}><summary>Voorwaarden</summary><p style={{ whiteSpace: "pre-line" }}>{actie.voorwaarden}</p></details>
        )}
      </div>
      <div className={kz.actieKnop}>
        <AanvraagKnop
          klantId={k.id} soort="extra" campagneId={actie.id} voorvoegsel={dienst?.naam} klein alGevraagd={gevraagd} alGevraagdTekst="Interesse doorgegeven"
          label={actie.type === "buurt" ? "Ik heb interesse" : "Prijs aanvragen"} titel={actie.titel}
          uitleg="Je krijgt eerst een prijs. Het voordeel geldt pas als de voorwaarden vervuld zijn."
          placeholder="Iets wat Yannick moet weten? (optioneel)"
        />
      </div>
    </article>
  );
}

/* ══ Overzicht ═════════════════════════════════════════════════════════════ */

function Overzicht(ctx: Ctx) {
  const { k, komend, controle } = ctx;
  const faseIndex = FASES.indexOf(k.fase);
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  const naWerken = k.fase === "klaar" || k.fase === "nazorg";
  const prijsDocs = k.documenten.filter((d) => (DOC_IS_FACTUUR(d.type) || d.type === "offerte") && (!naWerken || d.status === "open"));
  const labels = Object.fromEntries(k.documenten.map((d) => [d.id, { datum: fmtKort(d.datum), bedrag: d.bedrag ? fmtEuro(d.bedrag) : undefined }]));
  const bezigWerk = (k.werken ?? []).find((w) => w.status === "bezig");
  const volgende = komend.find((a) => !(bezigWerk && a.start.slice(0, 10) === vandaag() && a.titel === bezigWerk.naam));
  const stap = volgendeStap(k, volgende);
  const berichtVers = !!k.bericht && (!k.berichtDatum || dagenTot(k.berichtDatum.slice(0, 10)) >= -7);
  const melding = [...(k.opmerkingen ?? [])].reverse().find((o) => o.belangrijk && o.van === "yannick" && dagenTot(o.datum.slice(0, 10)) >= -14);
  const laatsteDag = k.fase === "bezig" || k.fase === "klaar" ? werkdagen(k).find((d) => d.dag >= (k.start?.datum ?? "0000")) : undefined;
  const behandeling = laatsteBehandeling(k);
  const garantie = garantieStaat(k);
  const c12 = controle12(k);
  const openPunten = (k.aanbevelingen ?? []).filter((a) => a.status === "open").length;
  const tweeActies = ctx.acties.slice(0, 2);

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
        <p className={kz.statusVolgende}>
          <strong>Volgende:</strong> {stap.tekst}
          {stap.link && <> <Link href={`?tab=${stap.link.tab}`} className={kz.statusLink}>{stap.link.label} <ArrowRight size={13} /></Link></>}
        </p>

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
        <Link href="?tab=hulp" className={kz.meldingBalk}><strong>Belangrijk</strong> {melding.tekst}</Link>
      )}

      {naWerken && <ReviewKaart {...ctx} />}

      {laatsteDag && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><Camera size={18} /> Wat er gebeurde</h2>
            <Link href="?tab=werken" className={kz.meerLink}>Volledig verslag <ArrowRight size={14} /></Link>
          </div>
          <WerkdagBlok dag={laatsteDag} />
        </section>
      )}

      {(!naWerken || komend.length > 0) && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><CalendarDays size={18} /> Jouw planning</h2>
            <Link href="?tab=werken" className={kz.meerLink}>Mijn werken <ArrowRight size={14} /></Link>
          </div>
          <Planning {...ctx} />
        </section>
      )}

      <Vakman k={k} />

      {naWerken && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><ShieldCheck size={18} /> Je dak in het kort</h2>
            <Link href="?tab=dossier" className={kz.meerLink}>Dakdossier <ArrowRight size={14} /></Link>
          </div>
          <dl className={kz.jeDak}>
            <div><dt>Laatste behandeling</dt><dd>{behandeling ? `${behandeling.soort}, ${fmtKort(behandeling.datum)}` : "Nog niet bekend"}</dd></div>
            {garantie.map((g) => <div key={g.id}><dt>{hfd(g.titel)}</dt><dd>{g.staat}</dd></div>)}
            {c12 && <div><dt>Gratis dakcontrole</dt><dd>{c12.gedaan ? `Gedaan op ${fmtKort(c12.gedaan)}` : `Rond ${fmtMaand(c12.datum)}`}</dd></div>}
            {controle && <div><dt>Onderhoud aangeraden</dt><dd>{hfd(fmtMaand(controle.datum))}</dd></div>}
            {openPunten > 0 && <div><dt>Openstaande punten</dt><dd><Link href="?tab=dakzorg" className={kz.statusLink}>{openPunten} bekijken</Link></dd></div>}
          </dl>
        </section>
      )}

      {naWerken && voor && na && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><Camera size={18} /> Voor en na</h2>
            <Link href="?tab=werken" className={kz.meerLink}>Fotoverslag <ArrowRight size={14} /></Link>
          </div>
          <VoorNa voor={voor.url} na={na.url} />
        </section>
      )}

      {naWerken && onderhoudZinvol(k) && controle && controleBinnen(controle.datum) <= 120 && <OnderhoudAanbod k={k} controle={controle} />}

      {prijsDocs.length > 0 && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><Wallet size={18} /> Offertes en facturen</h2>
            <Link href="?tab=dossier" className={kz.meerLink}>Documenten <ArrowRight size={14} /></Link>
          </div>
          <DocumentLijst documenten={prijsDocs} labels={labels} />
        </section>
      )}

      {naWerken && tweeActies.length > 0 && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><Tag size={18} /> Voor jou</h2>
            <Link href="?tab=voordelen" className={kz.meerLink}>Mijn voordelen <ArrowRight size={14} /></Link>
          </div>
          <div className={kz.actieLijst}>{tweeActies.map((a) => <ActieKaart key={a.actie.id} k={k} actie={a.actie} interesse={a.interesse} />)}</div>
        </section>
      )}

      {naWerken && refActief(ctx.regels) && ctx.regels.beloning > 0 && (
        <Link href="?tab=voordelen" className={kz.burenTeaser}>
          <span className={kz.burenTeaserBedrag}>€&nbsp;{ctx.regels.beloning}</span>
          <span>
            <strong>Onderhoudstegoed per buur die klant wordt</strong>
            <span>{ctx.regels.korting > 0 ? `En je buur krijgt € ${ctx.regels.korting} korting. ` : ""}Bekijk het burenvoordeel.</span>
          </span>
          <ArrowRight size={18} />
        </Link>
      )}
    </>
  );
}

/* ══ Mijn werken: fases, planning, voorbereiding, fotoverslag ══════════════ */

function MijnWerken(ctx: Ctx) {
  const { k, voorbij } = ctx;
  const faseIndex = FASES.indexOf(k.fase);
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  const dagen = werkdagen(k);
  const oplevering = k.afspraken.find((a) => a.titel === "Oplevering");
  const faseDatum: Record<string, string | undefined> = {
    gepland: k.start ? startTekst(k).waarde : undefined,
    bezig: k.start?.precisie === "dag" ? hfd(fmtDag(k.start.datum)) : undefined,
    klaar: k.garantie.vanaf ? hfd(fmtDag(k.garantie.vanaf)) : oplevering ? hfd(fmtDag(oplevering.start)) : undefined,
    nazorg: k.garantie.vanaf ? `Vanaf ${fmtKort(k.garantie.vanaf)}` : undefined,
  };
  const faseUitleg: Record<string, string> = {
    gepland: "Je opdracht is bevestigd en ingepland.",
    bezig: "Yannick werkt aan je dak. Elke werkdag komt er een verslag met foto's.",
    klaar: "Samen het resultaat nalopen. Je garantie start op die dag.",
    nazorg: "Je garantie loopt, en na 12 maanden is er een gratis dakcontrole.",
  };

  return (
    <>
      <PaginaKop titel="Mijn werken" sub={k.dienst || undefined} />

      <section className={kz.kaart}>
        <ol className={kz.faseLijst}>
          {FASES.map((f, i) => (
            <li key={f} className={i < faseIndex ? kz.faseLijstKlaar : i === faseIndex ? kz.faseLijstNu : undefined}>
              <span className={kz.faseLijstBol}>{i < faseIndex ? <CheckCircle2 size={16} /> : i + 1}</span>
              <div>
                <p className={kz.faseLijstTitel}>{FASE_LABEL[f]}{i === faseIndex && <span className={`${kz.badge} ${kz.badgeGroen}`} style={{ marginLeft: 8 }}>Nu</span>}</p>
                <p className={kz.faseLijstTekst}>{faseUitleg[f]}{faseDatum[f] ? ` ${faseDatum[f]}.` : ""}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {(k.fase === "gepland" || k.fase === "bezig") && <Checklist k={k} />}

      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><CalendarDays size={18} /> Planning</h2></div>
        <Planning {...ctx} />
        {voorbij.length > 0 && (
          <details className={kz.tipMeer}>
            <summary>Eerdere afspraken ({voorbij.length})</summary>
            <ul className={kz.eerder}>
              {voorbij.map((a) => <li key={a.id}><span>{fmtKort(a.start)}</span><strong>{a.titel}</strong></li>)}
            </ul>
          </details>
        )}
      </section>

      {voor && na && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}><h2 className={kz.kaartTitel}>Voor en na</h2></div>
          <VoorNa voor={voor.url} na={na.url} />
        </section>
      )}

      <h2 className={kz.sectieTitel}>Fotoverslag</h2>
      {dagen.length === 0 && <Leeg>Zodra je dak bekeken of behandeld wordt, verschijnen hier de verslagen en foto&apos;s.</Leeg>}
      {dagen.map((d) => (
        <section key={d.dag} className={kz.kaart}>
          <WerkdagBlok dag={d} />
        </section>
      ))}
    </>
  );
}

/* ══ Mijn dakdossier: gegevens, garantie, inspecties, documenten ═══════════ */

function Dakdossier({ k }: Ctx) {
  const gegevens = dakGegevens(k);
  const historiek = k.behandelingen ?? [];
  const foto = dakfoto(k);
  const garantie = garantieStaat(k);
  const certificaat = k.documenten.find((d) => d.type === "garantie");
  const inspecties = [...(k.inspecties ?? [])].sort((a, b) => b.datum.localeCompare(a.datum));
  const labels = Object.fromEntries(k.documenten.map((d) => [d.id, { datum: fmtKort(d.datum), bedrag: d.bedrag ? fmtEuro(d.bedrag) : undefined }]));

  return (
    <>
      <PaginaKop titel="Mijn dakdossier" sub={k.adres} />

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
            <h2 className={kz.dakTitel}>Je dak</h2>
            {heeftDossier(k) && (
              <a href={`/klant/${k.id}/dakdossier`} target="_blank" rel="noopener noreferrer" className={kz.rapportLink} style={{ marginTop: 0 }}>Download als PDF</a>
            )}
          </div>
          <dl className={kz.dakSpecs}>
            {gegevens.map((g) => <div key={g.label}><dt>{g.label}</dt><dd>{g.waarde}</dd></div>)}
            {!gegevens.some((g) => g.label === "Daktype") && <div><dt>Daktype</dt><dd className={kz.onbekend}>Nog niet bekend</dd></div>}
            {!gegevens.some((g) => g.label === "Oppervlakte") && <div><dt>Oppervlakte</dt><dd className={kz.onbekend}>Nog niet bekend</dd></div>}
          </dl>
          <h3 className={kz.dakSubtitel}>Uitgevoerde werken</h3>
          {historiek.length > 0 ? (
            <ul className={kz.dakHistoriek}>
              {historiek.map((b) => <li key={b.id}><span>{fmtKort(b.datum)}</span><strong>{b.soort}{b.producten ? ` · ${b.producten}` : ""}</strong></li>)}
            </ul>
          ) : <p className={kz.rapportTekst}>Nog geen behandelingen.</p>}
        </div>
      </section>

      <section className={kz.dakBlok}>
        <div className={kz.dakBlokKop}>
          <h2 className={kz.dakTitel}>Garantie</h2>
          {certificaat && <a href={certificaat.url} target="_blank" rel="noopener noreferrer" className={kz.rapportLink} style={{ marginTop: 0 }}>Certificaat downloaden</a>}
        </div>
        {garantie.length > 0 ? (
          <div className={kz.dakGarantie}>
            {garantie.map((g) => (
              <div key={g.id}>
                <p className={kz.dakGarantieGetal}>{g.titel.split(" jaar")[0]} jaar</p>
                <p className={kz.dakGarantieWat}>{g.id === "coat" ? "Op je dakcoating" : "Mosvrij"}</p>
                <p className={kz.rijSub}>{g.staat}</p>
              </div>
            ))}
          </div>
        ) : <p className={kz.rapportTekst}>Nog geen garantie geregistreerd.</p>}
        <div className={kz.gedekt}>
          <div>
            <p className={kz.gedektKop}>Wel gedekt</p>
            <ul>
              <li>Komt er binnen de garantieperiode mos terug op het behandelde dak, dan wordt dat kosteloos behandeld.</li>
              <li>De garantie geldt zonder voorwaarde van betalend onderhoud.</li>
              <li>Een gratis controle na 12 maanden.</li>
            </ul>
          </div>
          <div>
            <p className={kz.gedektKop}>Niet gedekt</p>
            <ul>
              <li>Schade door storm, vallende takken, derden of werken van anderen aan het dak.</li>
              <li>Delen die niet behandeld werden.</li>
              <li>Algen of vuil door bladeren en volle goten.</li>
            </ul>
          </div>
        </div>
        <p className={kz.rijSub} style={{ marginTop: 10 }}>De precieze voorwaarden staan op je garantiecertificaat. Dit is geen levenslange garantie op een mosvrij dak.</p>
      </section>

      <section className={kz.dakBlok}>
        <div className={kz.dakBlokKop}><h2 className={kz.dakTitel}>Inspecties en controles</h2></div>
        {inspecties.length === 0 ? (
          <p className={kz.rapportTekst} style={{ marginTop: 0 }}>Nog geen controles geregistreerd.</p>
        ) : (
          <ul className={kz.dakHistoriek}>
            {inspecties.map((i) => (
              <li key={i.id}>
                <span>{fmtKort(i.datum)}</span>
                <strong>{INSPECTIE_LABEL[i.soort]}{i.bevindingen ? ` · ${i.bevindingen}` : ""} {i.verslagUrl && <a href={i.verslagUrl} target="_blank" rel="noopener noreferrer" className={kz.statusLink}>Verslag</a>}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <h2 className={kz.sectieTitel}>Documenten</h2>
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

/* ══ Dakzorg: controles, onderhoud, aandachtspunten, tips ══════════════════ */

function Dakzorg(ctx: Ctx) {
  const { k, controle, eigenTips } = ctx;
  const behandeling = laatsteBehandeling(k);
  const laatste = laatsteControle(k);
  const c12 = controle12(k);
  const tot = mosGarantieTot(k);
  const opm = (k.aanbevelingen ?? []).filter((a) => a.status === "open" || a.status === "aangevraagd");
  const oog = (k.paspoort?.aandachtspunten ?? "").split("\n").map((r) => r.trim()).filter(Boolean);
  const controleGevraagd = (k.aanvragen ?? []).some((a) => a.soort === "controle" && aanvraagLoopt(a.status));
  const tips = TIPS.filter((t) => !t.alleenZonderCoating || k.garantie.coatingJaren === 0);
  const gevraagdExtra = (naam: string) => (k.aanvragen ?? []).some((a) => aanvraagLoopt(a.status) && a.soort === "extra" && a.tekst.startsWith(naam));
  const gevraagdOnderhoud = (k.aanvragen ?? []).some((a) => aanvraagLoopt(a.status) && a.soort === "onderhoud");

  return (
    <>
      <PaginaKop titel="Dakzorg" sub="Hoe je dak er nu bij ligt en wanneer het weer aandacht verdient." />

      <div className={kz.zorgStats}>
        <div><span>Behandeling</span><strong>{behandeling ? fmtKort(behandeling.datum) : "Nog niet bekend"}</strong><em>{behandeling?.soort ?? " "}</em></div>
        <div><span>Controle</span><strong>{laatste ? fmtKort(laatste) : "Nog geen"}</strong><em>{laatste ? "Fysiek nagekeken" : " "}</em></div>
        <div><span>Gratis controle</span><strong>{c12 ? (c12.gedaan ? "Gedaan" : hfd(fmtMaand(c12.datum))) : "Na de oplevering"}</strong><em>12 maanden na je werken</em></div>
        <div><span>Onderhoud</span><strong>{controle ? hfd(fmtMaand(controle.datum)) : "Nog niet bekend"}</strong><em>{tot ? `Mosgarantie tot ${fmtKort(tot)}` : " "}</em></div>
      </div>

      {onderhoudZinvol(k) && <OnderhoudAanbod k={k} controle={controle} />}

      {!laatste && (
        <section className={`${kz.kaart} ${kz.controleVraag}`}>
          <div>
            <h2 className={kz.kaartTitel}><ShieldCheck size={18} /> Twijfel je over je dak?</h2>
            <p className={kz.sub} style={{ marginTop: 6 }}>Er is nog geen recente controle van je dak. Vraag een dakcontrole aan, dan kijkt Yannick het na en krijg je een verslag met foto&apos;s.</p>
          </div>
          <AanvraagKnop klantId={k.id} soort="controle" alGevraagd={controleGevraagd} alGevraagdTekst="Aangevraagd" label="Vraag een dakcontrole aan" titel="Dakcontrole aanvragen" uitleg="Yannick neemt contact op voor een moment." placeholder="Iets wat je opviel? (optioneel)" />
        </section>
      )}

      <section className={kz.dakBlok}>
        <div className={kz.dakBlokKop}>
          <h2 className={kz.dakTitel}>Opmerkingen</h2>
          {opm.length > 0 && <span className={kz.dakTeller}>{opm.length}</span>}
        </div>
        {opm.length === 0 && oog.length === 0 && <p className={kz.rapportTekst} style={{ marginTop: 0 }}>Geen opmerkingen.</p>}
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
                      klantId={k.id} soort="aanbeveling" aanbevelingId={a.id} klein licht alGevraagd={a.status === "aangevraagd"} alGevraagdTekst="Aangevraagd"
                      label="Prijs aanvragen" titel={a.titel}
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

      <h2 className={kz.sectieTitel}>Tips en advies</h2>
      <div className={kz.tipRaster2} style={{ marginTop: 0 }}>
        {eigenTips.map((t) => (
          <article key={t.id} className={kz.tipKaart}>
            {t.fotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.fotoUrl} alt="" className={kz.tipFoto} />
            )}
            <div className={kz.tipInhoud}>
              <div className={kz.tipKop}><span className={kz.dakEyebrow} style={{ margin: 0 }}>{t.onderwerp || "Van Yannick"}</span></div>
              <h3 className={kz.tipTitel}>{t.titel}</h3>
              <p className={kz.tipIntro} style={{ whiteSpace: "pre-line" }}>{t.tekst}</p>
              {t.bestandUrl && (
                <div className={kz.tipKnop}>
                  <a className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`} href={t.bestandUrl} target="_blank" rel="noopener noreferrer"><FileText size={14} /> {t.bestandNaam || "Bekijk het document"}</a>
                </div>
              )}
            </div>
          </article>
        ))}
        {tips.map((t) => {
          const extra = t.aanvraag?.extra ? EXTRAS.find((x) => x.id === t.aanvraag!.extra) : undefined;
          return (
            <article key={t.id} className={kz.tipKaart}>
              {t.foto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.foto} alt="" className={kz.tipFoto} />
              )}
              <div className={kz.tipInhoud}>
                <div className={kz.tipKop}><span className={kz.dakEyebrow} style={{ margin: 0 }}>{t.onderwerp}</span></div>
                <h3 className={kz.tipTitel}>{t.titel}</h3>
                <p className={kz.tipIntro}>{t.intro}</p>
                <details className={kz.tipMeer}>
                  <summary>Lees meer</summary>
                  {t.meer.map((p) => <p key={p}>{p}</p>)}
                </details>
                {t.aanvraag && (t.aanvraag.soort !== "onderhoud" || onderhoudZinvol(k)) && (
                  <div className={kz.tipKnop}>
                    {t.aanvraag.soort === "onderhoud" ? (
                      <AanvraagKnop klantId={k.id} soort="onderhoud" klein licht alGevraagd={gevraagdOnderhoud} alGevraagdTekst="Aangevraagd"
                        label={t.aanvraag.label} titel="Onderhoud inplannen" uitleg="Yannick neemt contact op. Je krijgt eerst een prijs." placeholder="bv. Liefst in het voorjaar." />
                    ) : (
                      <AanvraagKnop klantId={k.id} soort="extra" voorvoegsel={extra?.naam ?? t.titel} klein licht alGevraagd={gevraagdExtra(extra?.naam ?? t.titel)} alGevraagdTekst="Aangevraagd"
                        label={t.aanvraag.label} titel={extra?.naam ?? t.titel} uitleg="Je krijgt vrijblijvend een prijs en een voorstel van datum." placeholder="Iets wat Yannick moet weten? (optioneel)" />
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

/* ══ Diensten: catalogus en mijn aanvragen ═════════════════════════════════ */

function Diensten({ k, controle, dienstFotos, acties }: Ctx) {
  const gevraagd = (soort: string, naam?: string) => (k.aanvragen ?? []).some((a) => aanvraagLoopt(a.status) && a.soort === soort && (!naam || a.tekst.startsWith(naam)));
  const aanvragen = k.aanvragen ?? [];
  const diensten = EXTRAS.filter((x) => x.id !== "coating" || k.garantie.coatingJaren === 0);
  return (
    <>
      <PaginaKop titel="Diensten" sub="Nog iets laten doen? Je krijgt eerst een prijs, op maat van je woning." />

      {aanvragen.length > 0 && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}><h2 className={kz.kaartTitel}>Mijn aanvragen</h2></div>
          <ul className={kz.aanvraagLijst}>
            {aanvragen.map((a) => (
              <li key={a.id}>
                <div>
                  <p className={kz.rijTitel}>{AANVRAAG_LABEL[a.soort]}</p>
                  {a.tekst && <p className={kz.rijSub}>{a.tekst}</p>}
                  <p className={kz.rijSub}>{fmtKort(a.datum)}{a.fotos?.length ? ` · ${a.fotos.length} foto${a.fotos.length > 1 ? "'s" : ""}` : ""}</p>
                </div>
                <span className={`${kz.badge} ${aanvraagLoopt(a.status) ? kz.badgeAmber : kz.badgeGroen}`}>{AANVRAAG_STATUS_LABEL[a.status]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className={kz.dienstLijst}>
        {onderhoudZinvol(k) && (
          <article className={kz.dienst}>
            <DienstFoto src={dienstFotos.onderhoud ?? ONDERHOUD_FOTO} naam="Onderhoud" />
            <div className={kz.dienstInhoud}>
              <h2 className={kz.dienstTitel}>Preventieve anti-mosbehandeling</h2>
              <p className={kz.dienstUitleg}>Een preventieve behandeling en een volledige inspectie, zodat je dak blijft zoals na de reiniging.{controle ? ` Aangeraden in ${fmtMaand(controle.datum)}.` : ""}</p>
              <div className={kz.dienstKnop}>
                <AanvraagKnop klantId={k.id} soort="onderhoud" klein alGevraagd={gevraagd("onderhoud")} alGevraagdTekst="Aangevraagd" label="Onderhoud aanvragen" titel="Onderhoud aanvragen" uitleg="Yannick neemt contact op. Je krijgt eerst een prijs." placeholder="bv. Liefst in het voorjaar." />
              </div>
            </div>
          </article>
        )}
        <article className={kz.dienst}>
          <DienstFoto src={dienstFotos.controle ?? "/images/Foto%20dak.jpg"} naam="Dakcontrole" />
          <div className={kz.dienstInhoud}>
            <h2 className={kz.dienstTitel}>Dakcontrole</h2>
            <p className={kz.dienstUitleg}>Yannick kijkt je dak na: pannen, nok, aansluitingen en goten. Je krijgt een verslag met foto&apos;s in je dakdossier.</p>
            <div className={kz.dienstKnop}>
              <AanvraagKnop klantId={k.id} soort="controle" klein licht alGevraagd={gevraagd("controle")} alGevraagdTekst="Aangevraagd" label="Prijs aanvragen" titel="Dakcontrole aanvragen" uitleg="Yannick neemt contact op voor een moment." placeholder="Iets wat je opviel? (optioneel)" />
            </div>
          </div>
        </article>
        {diensten.map((x) => {
          const actie = acties.find((a) => a.actie.extra === x.id)?.actie;
          return (
            <article key={x.id} className={kz.dienst}>
              <DienstFoto src={dienstFotos[x.id] ?? x.foto} naam={x.naam} />
              <div className={kz.dienstInhoud}>
                {actie && <span className={kz.extraActie} style={{ marginBottom: 8 }}>{actie.titel}{actie.geldigTot ? ` · tot ${fmtKort(actie.geldigTot)}` : ""}</span>}
                <h2 className={kz.dienstTitel}>{x.naam}</h2>
                <p className={kz.dienstUitleg}>{x.tekst}</p>
                <div className={kz.dienstKnop}>
                  <AanvraagKnop klantId={k.id} soort="extra" voorvoegsel={x.naam} campagneId={actie?.id} klein licht alGevraagd={gevraagd("extra", x.naam)} alGevraagdTekst="Aangevraagd"
                    label="Prijs aanvragen" titel={x.naam} uitleg="Je krijgt vrijblijvend een prijs en een voorstel van datum. Een vaste prijs kan pas als oppervlakte en bereikbaarheid gekend zijn." placeholder="Iets wat Yannick moet weten? (optioneel)" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <Link href="?tab=hulp" className={kz.dienstAnders}>
        <span><strong>Iets anders nodig?</strong> Stuur een bericht, dan kijkt Yannick wat mogelijk is.</span>
        <ArrowRight size={18} />
      </Link>
    </>
  );
}

/* ══ Mijn voordelen: tegoed, burenvoordeel, acties ═════════════════════════ */

function Voordelen(ctx: Ctx) {
  const { k, regels, refUrl, refCode, refQr, acties, burenVoordeel } = ctx;
  const { saldo, vervallen, regels: transacties } = tegoedOverzicht(k);
  const lijst = k.verwijzingen ?? [];
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  const actief = refActief(regels);
  const gewoneActies = acties.filter((a) => a.actie.type !== "buurt");
  const buurtActies = acties.filter((a) => a.actie.type === "buurt");

  return (
    <>
      <PaginaKop titel="Mijn MOS-X voordelen" />

      <section className={kz.kaart}>
        <div className={kz.kaartKop}>
          <h2 className={kz.kaartTitel}><Wallet size={18} /> Onderhoudstegoed</h2>
          <span className={kz.burenTotaal}>€&nbsp;{saldo}</span>
        </div>
        <p className={kz.sub} style={{ marginTop: 0 }}>Je tegoed trekken we af van een volgende onderhouds- of dienstfactuur. Het is geen geld en niet inwisselbaar.</p>
        {transacties.length > 0 ? (
          <ul className={kz.tegoedLijst}>
            {transacties.map((t) => (
              <li key={t.id}>
                <span>{fmtKort(t.datum)}</span>
                <span>{t.omschrijving}{t.vervaltOp ? ` · geldig tot ${fmtKort(t.vervaltOp)}` : ""}</span>
                <strong className={t.bedrag > 0 ? kz.burenPlus : undefined}>{t.bedrag > 0 ? "+" : "−"}€&nbsp;{Math.abs(t.bedrag)}</strong>
              </li>
            ))}
            {vervallen > 0 && <li><span /><span>Vervallen tegoed</span><strong>−€&nbsp;{vervallen}</strong></li>}
          </ul>
        ) : <p className={kz.leeg}>Nog geen tegoed.</p>}
      </section>

      {actief && (
        <>
          <h2 className={kz.sectieTitel}>Samen met je buren voordeliger</h2>
          <p className={kz.sub} style={{ marginTop: -6, marginBottom: 14 }}>Tevreden over je dak? Beveel MOS-X aan en ontvang een voordeel wanneer iemand dankzij jou klant wordt.</p>
          <section className={`${kz.kaart} ${kz.burenKaart}`} style={{ marginTop: 0 }}>
            <Cadeaubon voornaam={k.voornaam} code={refCode} tegoed={saldo} beloning={regels.beloning} />
            <div>
              <ol className={kz.burenStappen}>
                <li><span>1</span><p><strong>Deel je link of code</strong> met buren, familie of vrienden.</p></li>
                <li><span>2</span><p><strong>Je buur vraagt een offerte aan.</strong>{regels.korting > 0 ? ` Hij krijgt € ${regels.korting} korting op zijn eerste opdracht.` : ""}</p></li>
                <li><span>3</span><p><strong>Is zijn opdracht uitgevoerd en betaald,</strong> dan krijg jij € {regels.beloning} onderhoudstegoed.</p></li>
              </ol>
              <DeelBuurlink url={refUrl} voornaam={k.voornaam} korting={regels.korting} />
              <details className={kz.tipMeer}>
                <summary>Voorwaarden</summary>
                <ul className={kz.voorwaarden}>
                  <li>Het tegoed wordt toegekend nadat de opdracht van je buur uitgevoerd én volledig betaald is.</li>
                  {regels.minOpdracht > 0 && <li>De opdracht van je buur is minstens € {regels.minOpdracht} waard.</li>}
                  {regels.diensten && <li>Geldt voor: {regels.diensten}.</li>}
                  {regels.maxPerKlant > 0 && <li>Maximaal {regels.maxPerKlant} beloningen per klant.</li>}
                  {regels.geldigMaanden > 0 && <li>Tegoed blijft {regels.geldigMaanden} maanden geldig.</li>}
                  {regels.eind && <li>Doorverwijzingen tot en met {fmtKort(regels.eind)}.</li>}
                  <li>Niet voor jezelf, je eigen adres of iemand die al klant of aanvrager was.</li>
                  <li>{regels.combineerbaar ? "Combineerbaar met andere acties." : "Niet combineerbaar met andere acties."}</li>
                  <li>Het tegoed is geen geld en wordt verrekend op een volgende factuur.</li>
                  {burenVoordeel && <li>{burenVoordeel}</li>}
                  {regels.voorwaarden && <li style={{ whiteSpace: "pre-line" }}>{regels.voorwaarden}</li>}
                </ul>
              </details>
            </div>
          </section>

          <section className={kz.kaart}>
            <div className={kz.kaartKop}><h2 className={kz.kaartTitel}>Jouw doorverwijzingen</h2></div>
            {lijst.length === 0 ? (
              <p className={kz.leeg}>Nog niemand via jouw link.</p>
            ) : (
              <ul className={kz.burenLijst}>
                {lijst.map((v, i) => (
                  <li key={v.id}>
                    <span><strong>Buur {lijst.length - i}</strong> · {fmtKort(v.datum)}</span>
                    <span className={v.status === "beloond" ? kz.burenPlus : undefined}>{VERWIJZING_STATUS_LABEL[v.status]}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className={kz.qrRij}>
              <div className={kz.qr} dangerouslySetInnerHTML={{ __html: refQr }} />
              <p className={kz.sub} style={{ margin: 0 }}>Je buur kan deze QR-code scannen met zijn gsm. Code: <strong>{refCode}</strong></p>
            </div>
          </section>

          {voor && na && (
            <section className={`${kz.kaart} ${kz.deelVoorNa}`}>
              <div>
                <h2 className={kz.kaartTitel}>Laat je buren het verschil zien</h2>
                <p className={kz.sub} style={{ marginTop: 6 }}>Toon je voor- en nafoto op je uitnodiging. Je buur ziet alleen je voornaam en je gemeente.</p>
                <div className={kz.rijKnoppen}>
                  <form action={zetDeelVoorNa.bind(null, k.id, !k.deelVoorNa)}>
                    <button className={`${kz.knop} ${kz.knopKlein} ${k.deelVoorNa ? kz.knopLicht : kz.knopPrimair}`}>{k.deelVoorNa ? "Foto's niet meer tonen" : "Ja, toon mijn foto's"}</button>
                  </form>
                  {k.deelVoorNa && <span className={kz.ok} style={{ margin: 0 }}><CheckCircle2 size={15} style={{ verticalAlign: -3 }} /> Je buren zien je voor en na</span>}
                </div>
              </div>
              <VoorNa voor={voor.url} na={na.url} />
            </section>
          )}
        </>
      )}

      {buurtActies.length > 0 && (
        <>
          <h2 className={kz.sectieTitel}>MOS-X is binnenkort in je buurt</h2>
          <div className={kz.actieLijst}>{buurtActies.map((a) => <ActieKaart key={a.actie.id} k={k} actie={a.actie} interesse={a.interesse} />)}</div>
        </>
      )}

      <h2 className={kz.sectieTitel}>Acties</h2>
      {gewoneActies.length === 0 ? <Leeg>Er lopen nu geen acties voor jou.</Leeg> : (
        <div className={kz.actieLijst}>{gewoneActies.map((a) => <ActieKaart key={a.actie.id} k={k} actie={a.actie} interesse={a.interesse} />)}</div>
      )}
    </>
  );
}

/* ══ Hulp en contact: berichten, stormschade, profiel ══════════════════════ */

function Hulp({ k }: Ctx) {
  const lijst = [...(k.opmerkingen ?? [])].sort((a, b) => a.datum.localeCompare(b.datum));
  const marketing = k.voorkeuren?.marketing !== false;
  return (
    <>
      <PaginaKop titel="Hulp en contact" />

      <section className={kz.kaart} id="berichten">
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><MessagesSquare size={18} /> Berichten met Yannick</h2></div>
        {lijst.length > 0 && (
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

      <section className={kz.kaart} id="storm">
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Siren size={18} /> Stormschade of probleem melden</h2></div>
        <StormForm klantId={k.id} telefoon={k.telefoon} spoedTel={SPOED_TEL} spoedToon={SPOED_TOON} />
        {(k.stormMeldingen ?? []).length > 0 && (
          <ul className={kz.aanvraagLijst} style={{ marginTop: 18 }}>
            {(k.stormMeldingen ?? []).map((m) => (
              <li key={m.id}>
                <div><p className={kz.rijTitel}>{m.type}</p><p className={kz.rijSub}>{fmtMoment(m.datum)}</p></div>
                <span className={`${kz.badge} ${m.status === "nieuw" ? kz.badgeAmber : kz.badgeGroen}`}>{m.status === "nieuw" ? "Ontvangen" : "Behandeld"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><UserRound size={18} /> Contact</h2></div>
        <div className={kz.rijKnoppen} style={{ marginTop: 0 }}>
          <a className={`${kz.knop} ${kz.knopPrimair}`} href={waLink(k)} target="_blank" rel="noopener noreferrer"><WaIcoon size={16} /> WhatsApp</a>
          <a className={`${kz.knop} ${kz.knopLicht}`} href="tel:+32468352869">Bel +32 468 35 28 69</a>
          <a className={`${kz.knop} ${kz.knopLicht}`} href="mailto:info@mos-x.be">info@mos-x.be</a>
        </div>
      </section>

      <section className={kz.kaart} id="voorkeuren">
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Home size={18} /> Mijn profiel</h2></div>
        <dl className={kz.jeDak}>
          <div><dt>Naam</dt><dd>{k.voornaam} {k.achternaam}</dd></div>
          <div><dt>Adres</dt><dd>{k.adres || "Niet ingevuld"}</dd></div>
          <div><dt>Telefoon</dt><dd>{k.telefoon || "Niet ingevuld"}</dd></div>
          <div><dt>E-mail</dt><dd>{k.email || "Niet ingevuld"}</dd></div>
        </dl>
        <p className={kz.rijSub} style={{ marginTop: 10 }}>Klopt er iets niet? Stuur een bericht, dan past Yannick het aan.</p>
        <div className={kz.voorkeur}>
          <div>
            <p className={kz.rijTitel}>Mails over acties en voorstellen</p>
            <p className={kz.rijSub}>Seizoenstips, acties, buurtacties en je onderhoudsvoorstel. Afspraken, documenten en garantie krijg je altijd.</p>
            {k.voorkeuren && <p className={kz.rijSub}>Laatst aangepast op {fmtKort(k.voorkeuren.sinds)}.</p>}
          </div>
          <form action={zetMarketing.bind(null, k.id, !marketing)}>
            <button className={`${kz.schakel} ${marketing ? kz.schakelAan : ""}`} aria-pressed={marketing} aria-label="Mails over acties en voorstellen">
              <span />
            </button>
          </form>
        </div>
      </section>
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
  const { tab: tabRuw = "" } = await searchParams;
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

  const k = effectief(ruw);
  const [instellingen, alleKlanten] = await Promise.all([getInstellingen(), listKlanten()]);
  const controle = volgendeControle(k);
  const ref = refRegels(instellingen);
  const acties = (instellingen.acties ?? [])
    .map((actie) => ({ actie, interesse: interesseVoor(actie, alleKlanten) }))
    .filter((a) => actieVoorKlant(a.actie, k, a.interesse));

  const naWerken = k.fase === "klaar" || k.fase === "nazorg";
  const zichtbaar: Record<TabId, boolean> = {
    overzicht: true, werken: true, dossier: true, hulp: true,
    dakzorg: naWerken,
    diensten: k.fase !== "gepland",
    voordelen: naWerken,
  };
  const tabs = TABS.filter((t) => zichtbaar[t.id]);
  const onderaan: TabId[] = tabs.length <= 5 ? tabs.map((t) => t.id) : ONDERAAN.filter((id) => zichtbaar[id]);
  const gevraagd = (OUDE_TABS[tabRuw] ?? tabRuw) as TabId;
  const tab: TabId = tabs.some((t) => t.id === gevraagd) ? gevraagd : "overzicht";
  const grens = nuMs() + VERZET_UREN * 3_600_000;
  const vrijeMomenten = (await getMomenten()).filter((m) => brusselNaarDate(m.start).getTime() > grens).slice(0, 30);
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "www.mos-x.be";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const refCode = await zorgVoorRefCode(k);
  const refUrl = `${proto}://${host}/buur/${refCode}`;
  const refQr = tab === "voordelen" ? await QRCode.toString(refUrl, { type: "svg", margin: 1, color: { dark: "#1A1A1A", light: "#FFFFFF" } }) : "";
  const ctx: Ctx = {
    k, controle, refUrl, refCode, refQr, regels: ref, acties,
    burenVoordeel: instellingen.burenVoordeel,
    reviewUrl: instellingen.googleReviewUrl,
    reviewCitaat: instellingen.reviewCitaat,
    reviewNaam: instellingen.reviewNaam,
    eigenTips: instellingen.tips ?? [],
    dienstFotos: instellingen.dienstFotos ?? {},
    komend: k.afspraken.filter((a) => a.start.slice(0, 10) >= vandaag()),
    voorbij: k.afspraken.filter((a) => a.start.slice(0, 10) < vandaag()),
    vrijeMomenten,
    dagLabels: Object.fromEntries(vrijeMomenten.map((m) => [m.start.slice(0, 10), fmtDag(m.start)])),
    grens,
  };
  const openAanb = (k.aanbevelingen ?? []).filter((a) => a.status === "open").length;
  const openDocs = k.documenten.filter((d) => d.status === "open").length;
  const nieuwVanYannick = (k.opmerkingen ?? []).filter((o) => o.van === "yannick" && dagenTot(o.datum.slice(0, 10)) >= -3).length;
  const teller: Partial<Record<TabId, { n: number; amber?: boolean }>> = {
    dossier: openDocs ? { n: openDocs, amber: true } : undefined,
    dakzorg: openAanb ? { n: openAanb, amber: true } : undefined,
    voordelen: acties.length ? { n: acties.length } : undefined,
    hulp: nieuwVanYannick ? { n: nieuwVanYannick, amber: true } : undefined,
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
            <Link className={`${kz.spoedRond} ${kz.alleenMobiel}`} href="?tab=hulp#storm" aria-label="Stormschade of probleem melden"><Siren size={15} /> Melden</Link>
            <a className={kz.waRond} href={waLink(k)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Yannick"><WaIcoon size={20} /></a>
          </div>
        </div>
      </header>

      {k.demo && <p className={kz.demoBalk}>Voorbeelddossier met fictieve gegevens, enkel om de klantenzone te tonen.</p>}

      <div className={kz.dash}>
        <aside className={kz.zijbalk}>
          <nav aria-label="Klantenzone">
            <ul className={kz.navLijst}>
              {tabs.map((t) => (
                <li key={t.id}>
                  <Link href={`?tab=${t.id}`} className={`${kz.navItem} ${tab === t.id ? kz.navItemAan : ""}`} aria-current={tab === t.id ? "page" : undefined}>
                    <t.icoon size={18} /> {t.label}
                    {teller[t.id] && <span className={`${kz.navTeller} ${teller[t.id]!.amber ? kz.navTellerAmber : ""}`}>{teller[t.id]!.n}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={kz.zijOnder}>
            <Link className={kz.spoed} href="?tab=hulp#storm">
              <Siren size={20} />
              <span><strong>Stormschade of probleem?</strong>Meld het hier, of bel {SPOED_TOON}</span>
            </Link>
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
          {tab === "werken" && <MijnWerken {...ctx} />}
          {tab === "dossier" && <Dakdossier {...ctx} />}
          {tab === "dakzorg" && <Dakzorg {...ctx} />}
          {tab === "diensten" && <Diensten {...ctx} />}
          {tab === "voordelen" && <Voordelen {...ctx} />}
          {tab === "hulp" && <Hulp {...ctx} />}

          <p className={kz.voet}>Deze pagina is enkel voor jou. Deel de link niet met anderen.</p>
        </div>
      </div>

      <nav className={kz.onderNav} aria-label="Klantenzone">
        <ul>
          {tabs.filter((t) => onderaan.includes(t.id)).map((t) => (
            <li key={t.id}>
              <Link href={`?tab=${t.id}`} className={`${kz.onderItem} ${tab === t.id ? kz.onderItemAan : ""}`} aria-current={tab === t.id ? "page" : undefined}>
                <t.icoon size={21} />
                {t.id === "dossier" ? "Dossier" : t.id === "werken" ? "Werken" : t.id === "hulp" ? "Hulp" : t.label}
                {teller[t.id]?.amber && <span className={kz.onderStip} aria-label="Actie nodig" />}
              </Link>
            </li>
          ))}
          {tabs.some((t) => !onderaan.includes(t.id)) && (
            <li><MeerMenu actief={tab} zichtbaar={tabs.filter((t) => !onderaan.includes(t.id)).map((t) => t.id)} tellers={{ dakzorg: openAanb, voordelen: acties.length }} /></li>
          )}
        </ul>
      </nav>
    </main>
  );
}
