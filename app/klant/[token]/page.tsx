import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CalendarDays, Camera, Check, CheckCircle2, ChevronDown, Circle, Clock, FileText, FolderOpen, Gift, Home, LayoutDashboard,
  Leaf, LifeBuoy, MessagesSquare, ShieldCheck, Siren, Tag, UserRound, Wrench,
} from "lucide-react";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { getInstellingen, getKlant, getMomenten, listKlanten, zorgVoorRefCode, type Actie } from "@/lib/klantenzone/store";
import {
  binnenMosGarantie, controle12, controleBinnen, laatsteBehandeling, mosGarantieTot, volgendeControle,
} from "@/lib/klantenzone/onderhoud";
import { effectief } from "@/lib/klantenzone/auto";
import { dakfoto, heeftDossier, onderhoudZinvol, werkdagen, type Werkdag } from "@/lib/klantenzone/dak";
import {
  CENT_PER_PUNT, actieVoorKlant, interesseVoor, puntenInEuro, refActief, refRegels, tegoedOverzicht, volgendeMijlpaal, type RefRegels,
} from "@/lib/klantenzone/voordeel";
import {
  brusselNaarDate, dagenTot, eindUur, fmtDag, fmtDagMaand, fmtEuro, fmtKort, fmtMaand, fmtMoment, fmtUur, groet, hfd,
  maandagVan, nuMs, plusJaren, vandaag,
} from "@/lib/klantenzone/tijd";
import {
  AANVRAAG_LABEL, AANVRAAG_STATUS_LABEL, AFSPRAAK_TIPS, CHECKLIST, EXTRAS, FASES, FASE_KORT,
  FASE_LABEL, INSPECTIE_LABEL, VERWIJZING_STATUS_LABEL, VERZET_UREN, WERK_UITLEG, aanbevelingFotos, aanvraagLoopt,
  type Afspraak, type Klant, type VrijMoment, type Werk,
} from "@/lib/klantenzone/types";
import { zetChecklist, zetDeelVoorNa, zetMarketing } from "@/app/klant/actions";
import AanvraagKnop from "@/components/klantenzone/aanvraag-knop";
import Agenda, { type AgendaItem } from "@/components/klantenzone/agenda";
import VoorstelKnop from "@/components/klantenzone/voorstel-knop";
import Cadeaubon from "@/components/klantenzone/cadeaubon";
import DeelBuurlink from "@/components/klantenzone/deel-buurlink";
import DocumentLijst from "@/components/klantenzone/document-lijst";
import ReviewBallon from "@/components/klantenzone/review-ballon";
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

const TOON_ACTIES = false;
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
  { id: "dakzorg", label: "Onderhoud", icoon: Leaf },
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
  if (dringend) return { tekst: `Bekijk: ${dringend.titel.toLowerCase()}.`, link: { label: "Onderhoud", tab: "dakzorg" } };
  if (checklistOpen) return { tekst: "Bekijk hoe je je voorbereidt op de werken.", link: { label: "Voorbereiding", tab: "werken" } };
  if (volgende) return { tekst: `${volgende.titel} op ${fmtDag(volgende.start)} om ${fmtUur(volgende.start)}.`, link: { label: "Planning", tab: "werken" } };
  const open = k.documenten.filter((d) => d.status === "open");
  if (open.length) return { tekst: `Er staat ${open.length === 1 ? "een factuur" : `${open.length} facturen`} klaar.`, link: { label: "Documenten", tab: "dossier" } };
  if (k.fase === "bezig") return { tekst: "Bekijk de voortgang in het fotoverslag.", link: { label: "Fotoverslag", tab: "werken" } };
  if (k.fase === "klaar") return { tekst: "Bekijk je voor- en nafoto's.", link: { label: "Fotoverslag", tab: "werken" } };
  const c12 = controle12(k);
  if (c12 && !c12.gedaan && controleBinnen(c12.datum) <= 60) return { tekst: `Je gratis dakcontrole komt eraan, rond ${fmtMaand(c12.datum)}.`, link: { label: "Onderhoud", tab: "dakzorg" } };
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
  dienstFotos: Record<string, string>;
  centPerPunt: number;
  reviewPunten: number;
};

function kanVerzetten(a: Afspraak, ctx: Ctx) {
  return brusselNaarDate(a.start).getTime() > ctx.grens && ctx.vrijeMomenten.length > 0;
}

/* ── Herbruikbare blokken ──────────────────────────────────────────────────── */

/** Eén werkdag: wat afgewerkt werd, wat Yannick schreef en de foto's van die dag. */
function WerkdagBlok({ dag, nummer }: { dag: Werkdag; nummer?: number }) {
  return (
    <div className={kz.werkdag}>
      <p className={kz.werkdagLabel}>{nummer ? `Dag ${nummer}` : "Bezoek"}</p>
      <p className={kz.werkdagDatum}>{hfd(fmtDag(dag.dag))}</p>
      {dag.werken.length > 0 && (
        <ul className={kz.werkdagAf}>
          {dag.werken.map((w) => <li key={w}><CheckCircle2 size={16} /> {w} afgerond</li>)}
        </ul>
      )}
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
  const vandaagStr = vandaag();
  const start = startTekst(k);
  const toonStart = !!k.start && k.start.datum >= vandaagStr && !komend.some((a) => a.titel === "Start werken");
  if (komend.length === 0 && !toonStart) return <p className={kz.leeg}>Zodra de datum vastligt, zie je hier wanneer Yannick komt.</p>;
  const agendaItems: AgendaItem[] = [
    ...komend.map((a) => ({ dag: a.start.slice(0, 10), titel: a.titel, uur: fmtUur(a.start) })),
    ...(toonStart ? [{ dag: k.start!.datum, titel: "Start werken" }] : []),
  ];
  // Verwittigen kan tot 24 uur op voorhand; daarna enkel nog bellen
  const grens24 = nuMs() + 24 * 3_600_000;

  return (
    <>
      <div className={kz.planGrid}>
        <Agenda items={agendaItems} vandaag={vandaagStr} />

        <ul className={kz.planLijstKort}>
          {toonStart && (
            <li id={`plan-${k.start!.datum}`} className={kz.planRij}>
              <div className={kz.planKop}>
                <DatumBlok start={k.start!.datum} />
                <span className={kz.rijMidden}>
                  <span className={kz.planningTitel}>{start.zeker ? "Start van je werken" : "Voorlopige start"}</span>
                  <span className={kz.planningDatum}>{start.waarde}</span>
                </span>
              </div>
            </li>
          )}
          {komend.map((a) => {
            const d = a.start.slice(0, 10);
            const teLaat = brusselNaarDate(a.start).getTime() < grens24;
            const info = a.info || AFSPRAAK_TIPS[a.titel];
            return (
              <li key={a.id} id={`plan-${d}`} className={`${kz.planRij} ${d === vandaagStr ? kz.planRijNu : ""}`}>
                <details className={kz.planDetails}>
                  <summary className={kz.planKop}>
                    <DatumBlok start={a.start} />
                    <span className={kz.rijMidden}>
                      <span className={kz.planningTitel}>{a.titel}</span>
                      <span className={kz.planningDatum}>{d === vandaagStr ? "Vandaag, " + fmtDag(a.start) : hfd(fmtDag(a.start))}</span>
                      <span className={kz.planningUur}><Clock size={13} /> {fmtUur(a.start)} tot {eindUur(a.start, a.duurMin)}</span>
                    </span>
                    <span className={kz.planPijl} aria-hidden="true"><ChevronDown size={18} /></span>
                  </summary>
                  <div className={kz.planOpen}>
                    {info && <p>{info}</p>}
                    {d >= vandaagStr && (teLaat
                      ? <a className={kz.voorstelKnop} href="tel:+32468352869">Bel Yannick</a>
                      : <VoorstelKnop klantId={k.id} titel={a.titel} huidig={`${fmtDag(a.start)} om ${fmtUur(a.start)}`} vandaag={vandaagStr} />)}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      </div>
      <p className={kz.planRegel}>Kan je niet? Laat het minstens 24 uur op voorhand weten. Bij spoed: bel <a href="tel:+32468352869">+32 468 35 28 69</a>.</p>
    </>
  );
}

function Vakman({ k }: { k: Klant }) {
  return (
    <section className={kz.kaart}>
      <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><UserRound size={18} /> Je vakman</h2></div>
      <div className={kz.vakman}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={kz.vakmanFoto} src={YANNICK_FOTO} alt="Yannick, zaakvoerder van MOS-X" />
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
  const bezigWerk = (k.werken ?? []).find((w) => w.status === "bezig");
  const volgende = komend.find((a) => !(bezigWerk && a.start.slice(0, 10) === vandaag() && a.titel === bezigWerk.naam));
  const stap = volgendeStap(k, volgende);
  const berichtVers = !!k.bericht && (!k.berichtDatum || dagenTot(k.berichtDatum.slice(0, 10)) >= -7);
  const periode = werkPeriode(k);
  const laatsteDag = k.fase === "bezig" || k.fase === "klaar" ? werkdagen(k).find((d) => !!periode.van && d.dag >= periode.van && (!periode.tot || d.dag <= periode.tot)) : undefined;
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



      {laatsteDag && (
        <section className={kz.kaart}>
          <div className={kz.kaartKop}>
            <h2 className={kz.kaartTitel}><Camera size={18} /> Wat er gebeurde</h2>
            <Link href="?tab=werken" className={kz.meerLink}>Volledig verslag <ArrowRight size={14} /></Link>
          </div>
          <WerkdagBlok dag={laatsteDag} nummer={tijdlijn(k).filter((d) => d.werken.length || d.verslag).findIndex((d) => d.dag === laatsteDag.dag) + 1 || undefined} />
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
          {refActief(ctx.regels) && (
            <Link href="?tab=voordelen#buren" className={kz.deelTip}>
              <span>Ook je buren zo&apos;n resultaat laten zien? Deel je MOS-X-link en spaar voor je volgende onderhoud.</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </section>
      )}

      {naWerken && onderhoudZinvol(k) && controle && controleBinnen(controle.datum) <= 120 && <OnderhoudAanbod k={k} controle={controle} />}


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
          <span className={kz.burenTeaserBedrag}><Gift size={28} /></span>
          <span>
            <strong>De MOS-X Kring: exclusief voor klanten</strong>
            <span>Breng een buur mee en krijg een bon: {ctx.regels.naam.toLowerCase()}.</span>
          </span>
          <ArrowRight size={18} />
        </Link>
      )}
    </>
  );
}

/* ══ Mijn werken: voortgang en een tijdlijn per dag ════════════════════════ */

type TijdlijnDag = {
  dag: string;
  werken: Werk[];
  afspraken: Afspraak[];
  verslag?: Werkdag;
};

/** Alles van het project per dag: werken, afspraken, verslagen en foto's. */
/** Afspraken die niet bij de uitvoering horen: vóór de opdracht of erna. */
const GEEN_WERKDAG = ["Plaatsbezoek", "Nazorgbezoek", "Controle", "Dakcontrole"];

/** Van de start van de werken tot en met de oplevering. */
function werkPeriode(k: Klant): { van?: string; tot?: string } {
  const datums = (k.werken ?? []).map((w) => w.datum).filter((d): d is string => !!d).sort();
  const van = k.start?.precisie === "dag" ? k.start.datum : datums[0];
  const oplevering = k.afspraken.find((a) => a.titel === "Oplevering")?.start.slice(0, 10);
  const tot = [oplevering, k.garantie.vanaf, datums[datums.length - 1]].filter((d): d is string => !!d).sort().pop();
  return { van, tot };
}

/** Elke dag van de uitvoering: werken, afspraken, verslagen en foto's. Het plaatsbezoek en de nazorg horen er niet bij. */
function tijdlijn(k: Klant): TijdlijnDag[] {
  const { van, tot } = werkPeriode(k);
  const binnen = (d: string) => !!van && d >= van && (!tot || d <= tot);
  const m = new Map<string, TijdlijnDag>();
  const dag = (d: string) => {
    if (!m.has(d)) m.set(d, { dag: d, werken: [], afspraken: [] });
    return m.get(d)!;
  };
  for (const w of k.werken ?? []) if (w.datum) dag(w.datum).werken.push(w);
  for (const a of k.afspraken) {
    const d = a.start.slice(0, 10);
    if (!GEEN_WERKDAG.includes(a.titel) && binnen(d)) dag(d).afspraken.push(a);
  }
  for (const v of werkdagen(k)) if (binnen(v.dag)) dag(v.dag).verslag = v;
  return [...m.values()].sort((a, b) => a.dag.localeCompare(b.dag));
}

function MijnWerken(ctx: Ctx) {
  const { k } = ctx;
  const werken = k.werken ?? [];
  const klaar = werken.filter((w) => w.status === "klaar").length;
  const nu = werken.find((w) => w.status === "bezig");
  const vandaagStr = vandaag();
  const komend = ctx.komend.find((a) => a.start.slice(0, 10) > vandaagStr && !GEEN_WERKDAG.includes(a.titel));
  const dagen = tijdlijn(k);
  // Enkel echte werkdagen krijgen een nummer, de oplevering niet
  const nummers = new Map(dagen.filter((d) => d.werken.length || d.verslag).map((d, i) => [d.dag, i + 1]));
  const ongedateerd = werken.filter((w) => !w.datum);

  return (
    <>
      <PaginaKop titel="Mijn werken" sub={k.dienst || undefined} />

      {werken.length > 0 && (
        <section className={kz.kaart}>
          <div className={kz.voortgangKop}>
            <p className={kz.voortgangGetal}>{klaar === werken.length ? <strong className={kz.voortgangKlaar}>Alle werken zijn afgerond</strong> : klaar === 0 ? <strong className={kz.voortgangKlaar}>Je werken zijn ingepland</strong> : <><strong>{klaar}</strong> van de {werken.length} werken afgerond</>}</p>
            <span className={`${kz.badge} ${klaar === werken.length ? kz.badgeGroen : kz.badgeAmber}`}>{klaar === werken.length ? "Afgerond" : FASE_LABEL[k.fase]}</span>
          </div>
          <div className={kz.voortgangBalk} aria-hidden="true">
            {werken.map((w) => <span key={w.id} className={w.status === "klaar" ? kz.vgKlaar : w.status === "bezig" ? kz.vgNu : undefined} />)}
          </div>
          <p className={kz.voortgangVolgende}>
            {nu ? <><strong>Vandaag:</strong> {nu.naam.toLowerCase()}. </> : null}
            <strong>Volgende stap:</strong> {komend ? `${komend.titel.toLowerCase()} op ${fmtDag(komend.start)} om ${fmtUur(komend.start)}` : klaar === werken.length ? "je werken zijn afgerond" : "de datum volgt"}.
          </p>
        </section>
      )}

      {k.fase === "gepland" && <Checklist k={k} />}

      {dagen.length === 0 && <Leeg>Zodra je werken ingepland zijn, zie je hier elke dag wat er gebeurt.</Leeg>}
      <ol className={kz.tijdlijn}>
        {dagen.map((d) => {
          const staat = d.dag < vandaagStr ? "gedaan" : d.dag === vandaagStr ? "vandaag" : "gepland";
          const nummer = nummers.get(d.dag);
          const titel = d.werken.length ? d.werken.map((w, i) => (i ? w.naam.toLowerCase() : w.naam)).join(" en ") : d.afspraken.map((a) => a.titel).join(" en ") || d.verslag?.notities[0]?.titel || "Bezoek";
          const uren = d.afspraken.map((a) => `${fmtUur(a.start)} tot ${eindUur(a.start, a.duurMin)}`);
          const info = d.afspraken.map((a) => a.info || AFSPRAAK_TIPS[a.titel]).filter(Boolean) as string[];
          return (
            <li key={d.dag} className={staat === "vandaag" ? kz.tlVandaag : staat === "gedaan" ? kz.tlGedaan : undefined}>
              <span className={kz.tlPunt} aria-hidden="true">{staat === "gedaan" ? <Check size={15} strokeWidth={3} /> : null}</span>
              <div className={kz.tlKaart}>
                <div className={kz.tlKop}>
                  <div>
                    <p className={kz.werkdagLabel}>{nummer ? `Dag ${nummer} · ` : ""}{hfd(fmtDag(d.dag))}</p>
                    <h3 className={kz.tlTitel}>{titel}</h3>
                  </div>
                  <span className={`${kz.tlStaat} ${staat === "gedaan" ? kz.tlStaatGedaan : staat === "vandaag" ? kz.tlStaatNu : ""}`}>
                    {staat === "gedaan" ? "Gedaan" : staat === "vandaag" ? "Vandaag" : "Gepland"}
                  </span>
                </div>

                {staat !== "gedaan" && uren.length > 0 && <p className={kz.planningUur}><Clock size={13} /> {uren.join(" · ")} · Yannick</p>}
                {staat !== "gedaan" && d.werken.map((w) => (w.omschrijving || WERK_UITLEG[w.naam]) && <p key={w.id} className={kz.tlTekst}>{w.omschrijving || WERK_UITLEG[w.naam]}</p>)}
                {staat !== "gedaan" && info.map((t) => <p key={t} className={kz.tlTip}>{t}</p>)}

                {d.werken.some((w) => w.status === "klaar") && (
                  <ul className={kz.werkdagAf}>
                    {d.werken.filter((w) => w.status === "klaar").map((w) => <li key={w.id}><CheckCircle2 size={16} /> {w.naam} afgerond</li>)}
                  </ul>
                )}
                {d.verslag?.notities.map((n) => (
                  <div key={n.id} className={kz.werkdagNotitie}>
                    {n.titel && n.titel !== titel && <p className={kz.werkdagTitel}>{n.titel}</p>}
                    <p className={kz.werkdagTekst}>{n.tekst}</p>
                  </div>
                ))}
                {d.verslag && d.verslag.fotos.length > 0 && <div className={kz.werkdagFotos}><FotoGalerij fotos={d.verslag.fotos} zonderFilter /></div>}
                {staat === "gedaan" && !d.verslag && d.werken.length === 0 && <p className={kz.tlTekst}>Afgerond.</p>}

                {d.afspraken.filter((a) => staat !== "gedaan" && kanVerzetten(a, ctx)).map((a) => (
                  <div key={a.id} style={{ marginTop: 12 }}>
                    <VerzetKnop klantId={k.id} afspraakId={a.id} titel={`${a.titel}, nu op ${fmtDag(a.start)} om ${fmtUur(a.start)}`} momenten={ctx.vrijeMomenten} dagLabels={ctx.dagLabels} />
                  </div>
                ))}
              </div>
            </li>
          );
        })}
        {ongedateerd.map((w) => (
          <li key={w.id}>
            <span className={kz.tlPunt} aria-hidden="true" />
            <div className={kz.tlKaart}>
              <div className={kz.tlKop}>
                <div><p className={kz.werkdagLabel}>Datum volgt</p><h3 className={kz.tlTitel}>{w.naam}</h3></div>
                <span className={kz.tlStaat}>Gepland</span>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {k.log.length > 0 && (
        <details className={`${kz.kaart} ${kz.puntenHistoriek}`}>
          <summary>Logboek</summary>
          <ul className={kz.tegoedLijst}>
            {k.log.slice(0, 30).map((l, i) => <li key={i} className={kz.logRij}><span>{fmtKort(l.datum)}</span><span>{l.tekst}</span></li>)}
          </ul>
        </details>
      )}

    </>
  );
}

/* ══ Mijn dakdossier: gegevens, garantie, opmerkingen, documenten ═════════ */

/** Garantie als balk: hoeveel er al verstreken is en hoe lang ze nog loopt. */
function garantieBalken(k: Klant) {
  const { mosvrijJaren, coatingJaren, vanaf } = k.garantie;
  const lijst = [
    mosvrijJaren > 0 ? { id: "mos", naam: "Mosvrij", jaren: mosvrijJaren } : null,
    coatingJaren > 0 ? { id: "coat", naam: "Dakcoating", jaren: coatingJaren } : null,
  ].filter((x) => x !== null);
  return lijst.map((g) => {
    if (!vanaf) return { ...g, procent: 0, tekst: "Start bij de oplevering", tot: null as string | null };
    const tot = plusJaren(vanaf, g.jaren);
    const totaal = Math.max(1, dagenTot(tot) - dagenTot(vanaf));
    const verstreken = Math.min(totaal, Math.max(0, -dagenTot(vanaf)));
    const rest = Math.max(0, Math.round(dagenTot(tot) / 30.44));
    return { ...g, procent: Math.round((verstreken / totaal) * 100), tekst: rest > 24 ? `Nog ${Math.round(rest / 12)} jaar` : rest > 0 ? `Nog ${rest} maanden` : "Verlopen", tot };
  });
}

function Dakdossier({ k, controle }: Ctx) {
  const opm = (k.aanbevelingen ?? []).filter((a) => a.status === "open" || a.status === "aangevraagd");
  const oog = (k.paspoort?.aandachtspunten ?? "").split("\n").map((r) => r.trim()).filter(Boolean);
  const p = k.paspoort ?? {};
  const historiek = k.behandelingen ?? [];
  const foto = dakfoto(k);
  const garantie = garantieBalken(k);
  const certificaat = k.documenten.find((d) => d.type === "garantie");
  const inspecties = [...(k.inspecties ?? [])].sort((a, b) => b.datum.localeCompare(a.datum));
  const labels = Object.fromEntries(k.documenten.map((d) => [d.id, { datum: fmtKort(d.datum), bedrag: d.bedrag ? fmtEuro(d.bedrag) : undefined }]));

  const uitgevoerd = [
    ...historiek.map((b) => ({ id: b.id, datum: b.datum, titel: b.soort, sub: undefined as string | undefined, rapport: undefined as string | undefined })),
    // Bij een inspectie: de bevindingen en het rapport (gekoppeld, of een inspectierapport van dezelfde dag)
    ...inspecties.map((i) => ({
      id: i.id, datum: i.datum, titel: INSPECTIE_LABEL[i.soort], sub: i.bevindingen || undefined,
      rapport: i.verslagUrl ?? k.documenten.find((d) => d.type === "inspectie" && d.datum.slice(0, 10) === i.datum.slice(0, 10))?.url,
    })),
  ].sort((a, b) => b.datum.localeCompare(a.datum));
  const punten = [
    ...opm.map((a) => ({ id: a.id, titel: a.titel, tekst: a.tekst, amber: a.prioriteit !== "info", fotos: aanbevelingFotos(a), a })),
    ...oog.map((r) => {
      const [kop, ...rest] = r.split(":");
      return { id: r, titel: rest.length ? kop.trim() : r, tekst: rest.join(":").trim(), amber: false, fotos: [] as string[], a: undefined };
    }),
  ];
  // Het meest recente inspectierapport krijgt een eigen knop
  const rapport = uitgevoerd.find((r) => r.rapport)?.rapport ?? k.documenten.find((d) => d.type === "inspectie")?.url;
  // Onderhoud: hoe ver we zitten tussen de oplevering en de aangeraden datum
  const vanaf = k.garantie.vanaf;
  const ohProcent = controle && vanaf
    ? Math.min(100, Math.max(0, Math.round((-dagenTot(vanaf) / Math.max(1, dagenTot(controle.datum) - dagenTot(vanaf))) * 100)))
    : 0;
  const ohMaanden = controle ? Math.max(0, Math.round(dagenTot(controle.datum) / 30.44)) : 0;
  const tegels = [
    ...garantie.map((g) => ({
      id: g.id, soort: "garantie", titel: `Garantie ${g.naam.toLowerCase()}`, waarde: `${g.jaren} jaar`,
      procent: g.tot ? Math.max(g.procent, 3) : 0,
      sub: g.tot ? `${g.tekst} · tot ${fmtKort(g.tot)}` : "Start bij de oplevering",
    })),
    controle ? {
      id: "oh", soort: "onderhoud", titel: "Onderhoud", waarde: hfd(fmtMaand(controle.datum)),
      procent: Math.max(ohProcent, vanaf ? 3 : 0),
      sub: `Aangeraden${ohMaanden > 0 ? ` · over ${ohMaanden} maanden` : ""}`,
    } : null,
  ].filter((x) => x !== null);

  return (
    <>
      <PaginaKop titel="Mijn dakdossier" />

      <section className={kz.dpHero}>
        <div className={kz.dpHeroInfo}>
          <p className={kz.dpOog}>Mijn dak</p>
          <h2 className={kz.dpAdres}>{k.adres}</h2>
          <dl className={kz.dpSpecs}>
            <div><dt>Daktype</dt><dd>{p.daktype ?? "–"}</dd></div>
            <div><dt>Kleur</dt><dd>{p.kleur ?? "–"}</dd></div>
            <div><dt>Oppervlakte</dt><dd>{p.oppervlakte ? `${p.oppervlakte} m²` : "–"}</dd></div>
          </dl>
          <div className={kz.dpHeroKnoppen}>
            {heeftDossier(k) && <a className={`${kz.knop} ${kz.knopPrimair}`} href={`/klant/${k.id}/dakdossier`} target="_blank" rel="noopener noreferrer"><FolderOpen size={16} /> Volledig dossier</a>}
            {rapport && <a className={`${kz.knop} ${kz.dpKnopGlas}`} href={rapport} target="_blank" rel="noopener noreferrer"><FileText size={16} /> Inspectierapport</a>}
            {certificaat && <a className={`${kz.knop} ${kz.dpKnopGlas}`} href={certificaat.url} target="_blank" rel="noopener noreferrer"><ShieldCheck size={16} /> Certificaat</a>}
          </div>
        </div>
        <div className={kz.dpHeroFoto}>
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto.url} alt="Je dak" />
          ) : <span className={kz.dpFotoLeeg}><Home size={34} /></span>}
        </div>
      </section>

      {tegels.length > 0 && (
        <div className={kz.dpTegels} style={{ gridTemplateColumns: `repeat(${tegels.length}, minmax(0, 1fr))` }}>
          {tegels.map((t) => (
            <div key={t.id} className={t.soort === "onderhoud" ? kz.dpTegelOh : undefined}>
              <div className={kz.dpTegelKop}>
                <span className={kz.dpTegelIcoon}>{t.soort === "garantie" ? <ShieldCheck size={17} /> : <Leaf size={17} />}</span>
                <span className={kz.dpTegelTitel}>{t.titel}</span>
              </div>
              <strong>{t.waarde}</strong>
              <div className={kz.dpTegelBalk}><span style={{ width: `${t.procent}%` }} /></div>
              <span className={kz.dpTegelSub}>{t.sub}</span>
            </div>
          ))}
        </div>
      )}

      {(punten.length > 0 || uitgevoerd.length > 0) && (
        <div className={kz.dpDuo}>
          <section className={kz.dpKaart}>
            <h2 className={kz.dpTitel}>Aandachtspunten</h2>
            {punten.length === 0 ? <p className={kz.dpLeeg}>Niets om op te letten.</p> : (
              <ul className={kz.dpRijen}>
                {punten.map((x) => (
                  <li key={x.id}>
                    <details>
                      <summary>
                        <span className={`${kz.dosStip} ${x.amber ? kz.dosStipAmber : ""}`} aria-hidden="true" />
                        <span className={kz.dpRijTitel}>{x.titel}</span>
                        {x.fotos.length > 0 && <Camera size={15} className={kz.dpRijIcoon} aria-label="Met foto's" />}
                        <ChevronDown size={16} className={kz.dpPuntPijl} />
                      </summary>
                      <div className={kz.dpPuntOpen}>
                        {x.tekst && <p className={kz.dosSub}>{x.tekst}</p>}
                        {x.fotos.length > 0 && (
                          <div className={kz.dpPuntFotos}>
                            {x.fotos.map((u) => (
                              <a key={u} href={u} target="_blank" rel="noopener noreferrer">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={u} alt={x.titel} />
                              </a>
                            ))}
                          </div>
                        )}
                        {x.a && x.amber && (
                          <AanvraagKnop
                            klantId={k.id} soort="aanbeveling" aanbevelingId={x.a.id} klein licht alGevraagd={x.a.status === "aangevraagd"} alGevraagdTekst="Aangevraagd"
                            label="Prijs aanvragen" titel={x.titel}
                            uitleg="Je krijgt eerst een prijs en een voorstel van datum. Je zit nergens aan vast."
                            placeholder="Vraag of opmerking (optioneel)"
                          />
                        )}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={kz.dpKaart}>
            <h2 className={kz.dpTitel}>Uitgevoerd aan je dak</h2>
            {uitgevoerd.length === 0 ? <p className={kz.dpLeeg}>Nog niets uitgevoerd.</p> : (
              <ul className={kz.dpRijen}>
                {uitgevoerd.map((r) => (
                  <li key={r.id}>
                    {r.sub || r.rapport ? (
                      <details>
                        <summary>
                          <span className={kz.dpRijDatum}>{fmtKort(r.datum)}</span>
                          <span className={kz.dpRijTitel}>{r.titel}</span>
                          {r.rapport && <FileText size={15} className={kz.dpRijIcoon} aria-label="Met rapport" />}
                          <ChevronDown size={16} className={kz.dpPuntPijl} />
                        </summary>
                        <div className={kz.dpPuntOpen} style={{ paddingLeft: 0 }}>
                          {r.sub && <p className={kz.dosSub}>{r.sub}</p>}
                          {r.rapport && <a className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`} href={r.rapport} target="_blank" rel="noopener noreferrer"><FileText size={15} /> Inspectierapport bekijken</a>}
                        </div>
                      </details>
                    ) : (
                      <div className={kz.dpRij}>
                        <span className={kz.dpRijDatum}>{fmtKort(r.datum)}</span>
                        <span className={kz.dpRijTitel}>{r.titel}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {k.documenten.length > 0 && (
        <section className={`${kz.dpKaart} ${kz.dpDocs}`}>
          <h2 className={kz.dpTitel}>Documenten</h2>
          <DocumentLijst documenten={[...k.documenten].sort((a, b) => b.datum.localeCompare(a.datum))} labels={labels} />
        </section>
      )}
    </>
  );
}

/* ══ Onderhoud: het voorstel en de opmerkingen ════════════════════════════ */

function Dakzorg(ctx: Ctx) {
  const { k } = ctx;
  const gevraagd = (k.aanvragen ?? []).some((a) => aanvraagLoopt(a.status) && a.soort === "onderhoud");
  const naWerken = onderhoudZinvol(k);
  // Vóór de oplevering: verwacht onderhoud = verwachte oplevering + de mosgarantie
  const { tot: opleverDag } = werkPeriode(k);
  const verwacht = !naWerken && opleverDag && k.garantie.mosvrijJaren > 0 ? plusJaren(opleverDag, k.garantie.mosvrijJaren) : null;
  const datum = ctx.controle?.datum ?? verwacht;
  const maanden = datum ? Math.max(0, Math.round(dagenTot(datum) / 30.44)) : null;

  return (
    <>
      <PaginaKop titel="Onderhoud" />

      {(
        <section className={kz.ohHero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ONDERHOUD_FOTO} alt="" className={kz.ohBeeld} />
          <div className={kz.ohInhoud}>
            <p className={kz.ohLabel}>{naWerken ? "Je volgende onderhoud" : "Je eerste onderhoud, na je werken"}</p>
            <p className={kz.ohMaand}>{datum ? hfd(fmtMaand(datum)) : "Na je werken"}</p>
            {maanden !== null && <p className={kz.ohSub}>{maanden > 1 ? `Over ${maanden} maanden` : maanden === 1 ? "Volgende maand" : "Nu"}</p>}
            <p className={kz.ohIntro}>Is je dak gereinigd en wil je dat resultaat behouden? Dan kies je voor een onderhoud: op tijd een preventieve behandeling, zodat mos geen kans krijgt en je dak niet opnieuw grondig gereinigd moet worden.</p>
            <ul className={kz.ohWat}>
              <li><Check size={16} strokeWidth={3} /> Preventieve anti-mosbehandeling</li>
              <li><Check size={16} strokeWidth={3} /> Inspectie van je dak, met foto&apos;s</li>
            </ul>
            <div className={kz.ohKnoppen}>
              <AanvraagKnop
                klantId={k.id} soort="onderhoud" alGevraagd={gevraagd} alGevraagdTekst="Aangevraagd, Yannick neemt contact op"
                label="Plan mijn onderhoud" titel="Onderhoud inplannen"
                uitleg="Yannick neemt contact op om een moment af te spreken. Je krijgt eerst een prijs."
                placeholder="bv. Liefst in het voorjaar."
              />
              <span>Vrijblijvend, je krijgt eerst een prijs.</span>
            </div>
          </div>
        </section>
      )}

    </>
  );
}

/* ══ Diensten: catalogus en mijn aanvragen ═════════════════════════════════ */

function Diensten({ k, controle, dienstFotos, acties }: Ctx) {
  const gevraagd = (soort: string, naam?: string) => (k.aanvragen ?? []).some((a) => aanvraagLoopt(a.status) && a.soort === soort && (!naam || a.tekst.startsWith(naam)));
  const diensten = EXTRAS.filter((x) => x.id !== "coating" || k.garantie.coatingJaren === 0);
  const naWerken = k.fase === "klaar" || k.fase === "nazorg";
  return (
    <>
      <PaginaKop titel="Diensten" sub="Exclusief voor klanten van MOS-X, doorheen het jaar." />

      <section className={kz.dienstHero}>
        <span className={kz.buurOog}>Enkel voor klanten</span>
        <p className={kz.buurTitel}>{naWerken ? "Nu je dak proper is, zorgen we ook voor de rest" : "Ook voor de rest van je woning"}</p>
        <p className={kz.buurSub}>Dakgoten, gevel, oprit en terras. Yannick doet het zelf, en je krijgt altijd eerst een eerlijke prijs.</p>
      </section>

      <section id="combi" className={kz.combiKaart}>
        <span className={kz.combiProcent}>−20%</span>
        <div className={kz.combiTekst}>
          <p className={kz.combiTitel}>Combineer twee diensten en krijg tot 20% korting</p>
          <p className={kz.combiSub}>Bijvoorbeeld je dakgoten samen met je oprit of gevel. Alles op één dag, dus voordeliger voor jou.</p>
        </div>
        <div className={kz.combiKnop}>
          <AanvraagKnop klantId={k.id} soort="extra" voorvoegsel="Combinatie van twee diensten" metFotos={false} klein alGevraagd={gevraagd("extra", "Combinatie")} alGevraagdTekst="Aangevraagd"
            label="Combinatie aanvragen" titel="Twee diensten combineren" uitleg="Laat weten welke diensten je wil combineren. Je krijgt eerst een prijs, met tot 20% korting." placeholder="bv. Dakgoten en oprit." />
        </div>
      </section>

      <h2 className={kz.sectieTitel}>Onze diensten</h2>

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
  const { saldo, regels: transacties } = tegoedOverzicht(k);
  const euro = puntenInEuro(saldo, ctx.centPerPunt);
  const mijlpaal = volgendeMijlpaal(saldo);
  const lijst = k.verwijzingen ?? [];
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  const actief = refActief(regels);
  const gewoneActies = acties.filter((a) => a.actie.type !== "buurt");
  const buurtActies = acties.filter((a) => a.actie.type === "buurt");
  const inwisselGevraagd = (k.aanvragen ?? []).some((a) => aanvraagLoopt(a.status) && (a.tekst.startsWith("Punten inwisselen") || a.tekst.startsWith("Tegoed gebruiken")));
  const buurEuro = puntenInEuro(regels.beloning, ctx.centPerPunt);
  const verdienen = [
    actief ? { kop: "Een buur laat zijn dak reinigen" } : null,
    actief ? { tekst: "Jij krijgt", punten: `+${regels.beloning}`, waarde: `€ ${buurEuro}` } : null,
    actief && regels.korting > 0 ? { tekst: "Je buur krijgt", punten: "", waarde: `€ ${regels.korting}` } : null,
    ctx.reviewPunten > 0 ? { kop: "Zelf" } : null,
    ctx.reviewPunten > 0 ? { tekst: "Review op Google", punten: `+${ctx.reviewPunten}`, waarde: `€ ${puntenInEuro(ctx.reviewPunten, ctx.centPerPunt)}` } : null,
  ].filter((x) => x !== null);

  return (
    <>
      <PaginaKop titel="MOS-X Club" sub="Tevreden over je dak? Help iemand anders aan hetzelfde resultaat en laat MOS-X meebetalen aan je volgende onderhoud." />

      <section className={`${kz.kaart} ${kz.burenKaart}`}>
        <Cadeaubon naam={`${k.voornaam} ${k.achternaam}`.trim()} code={refCode} punten={saldo} euro={euro} doel={mijlpaal.doel} procent={mijlpaal.procent} />
        <div>
          <h2 className={kz.kringTitel}>Zo spaar je</h2>
          <ul className={kz.puntenTabel}>
            {verdienen.map((v) => "kop" in v ? <li key={v.kop} className={kz.puntenKop}>{v.kop}</li> : (
              <li key={v.tekst}>
                <span className={kz.puntenNaam}>{v.tekst}</span>
                <strong>{v.punten}</strong>
                <em>{v.waarde}</em>
              </li>
            ))}
          </ul>
          <p className={kz.puntenNoot}>Je tegoed is korting op elk werk van MOS-X.</p>
          {saldo > 0 && (
            <div className={kz.rijKnoppen}>
              <AanvraagKnop klantId={k.id} soort="andere" voorvoegsel={`Tegoed gebruiken (€ ${euro})`} metFotos={false} klein alGevraagd={inwisselGevraagd} alGevraagdTekst="Aangevraagd"
                label="Tegoed gebruiken" titel="Tegoed gebruiken" uitleg={`Je € ${euro} gaat af van je volgende werk. Yannick bevestigt het.`} placeholder="Voor welk werk? (optioneel)" />
            </div>
          )}
        </div>
      </section>

      <h2 className={kz.sectieTitel}>Actie</h2>
      <Link href="?tab=diensten#combi" className={`${kz.combiKaart} ${kz.combiLink}`}>
        <span className={kz.combiProcent}>−20%</span>
        <div className={kz.combiTekst}>
          <p className={kz.combiTitel}>Combineer twee diensten en krijg tot 20% korting</p>
          <p className={kz.combiSub}>Bijvoorbeeld je dakgoten samen met je oprit of gevel.</p>
        </div>
        <ArrowRight size={20} className={kz.combiPijl} />
      </Link>

      {transacties.length > 0 && (
        <details className={`${kz.kaart} ${kz.puntenHistoriek}`}>
          <summary>Je punten</summary>
          <ul className={kz.tegoedLijst}>
            {transacties.map((t) => (
              <li key={t.id}>
                <span>{fmtKort(t.datum)}</span>
                <span>{t.omschrijving}</span>
                <strong className={t.bedrag > 0 ? kz.burenPlus : undefined}>{t.bedrag > 0 ? "+" : "−"}{Math.abs(t.bedrag)}</strong>
              </li>
            ))}
          </ul>
        </details>
      )}

      {gewoneActies.length > 0 && (
        <>
          <h2 className={kz.sectieTitel}>Acties, enkel voor klanten</h2>
          <div className={kz.actieRaster}>{gewoneActies.map((a) => <ActieKaart key={a.actie.id} k={k} actie={a.actie} interesse={a.interesse} />)}</div>
        </>
      )}

      {actief && (
        <>
          <h2 className={kz.sectieTitel} id="buren">Breng een buur mee</h2>
          <section className={`${kz.kaart} ${kz.buurKaart}`} style={{ marginTop: 0 }}>
            <div className={kz.buurHero}>
              <div>
                <span className={kz.buurOog}>Burenvoordeel</span>
                <p className={kz.buurTitel}>€&nbsp;{puntenInEuro(regels.beloning, ctx.centPerPunt)} voor jou{regels.korting > 0 && <>, €&nbsp;{regels.korting} voor je buur</>}</p>
                <p className={kz.buurSub}>Voor elke dakreiniging via jouw link.</p>
              </div>
              <div className={kz.buurMunten} aria-hidden="true">
                <span>€{puntenInEuro(regels.beloning, ctx.centPerPunt)}</span>
                {regels.korting > 0 && <span>€{regels.korting}</span>}
              </div>
            </div>

            <div className={kz.buurBody}>
              <ol className={kz.buurStappen}>
                <li><span>1</span><div><strong>Deel je link</strong><p>Met buren, familie of vrienden.</p></div></li>
                <li><span>2</span><div><strong>Je buur vraagt een offerte</strong><p>Voor een dakreiniging{regels.korting > 0 ? `, met € ${regels.korting} korting` : ""}.</p></div></li>
                <li><span>3</span><div><strong>Jij krijgt €&nbsp;{puntenInEuro(regels.beloning, ctx.centPerPunt)}</strong><p>Zodra zijn dak gereinigd en betaald is.</p></div></li>
              </ol>
              <div className={kz.buurDeel}>
                <div className={kz.buurQr}>
                  <div className={kz.qr} dangerouslySetInnerHTML={{ __html: refQr }} />
                  <p>Laat je buur deze code scannen met zijn gsm.</p>
                </div>
                <DeelBuurlink url={refUrl} voornaam={k.voornaam} korting={regels.korting} />
              </div>
            </div>
            {lijst.length > 0 && (
              <ul className={kz.burenLijst}>
                {lijst.map((v, i) => (
                  <li key={v.id}>
                    <span><strong>Buur {lijst.length - i}</strong> · {fmtKort(v.datum)}</span>
                    <span className={v.status === "beloond" ? kz.burenPlus : undefined}>{VERWIJZING_STATUS_LABEL[v.status]}</span>
                  </li>
                ))}
              </ul>
            )}
            {voor && na && (
              <div className={kz.voorkeur}>
                <div>
                  <p className={kz.rijTitel}>Toon je voor en na op je uitnodiging</p>
                  <p className={kz.rijSub}>Je buur ziet alleen je voornaam en je gemeente.</p>
                </div>
                <form action={zetDeelVoorNa.bind(null, k.id, !k.deelVoorNa)}>
                  <button className={`${kz.schakel} ${k.deelVoorNa ? kz.schakelAan : ""}`} aria-pressed={!!k.deelVoorNa} aria-label="Voor en na tonen"><span /></button>
                </form>
              </div>
            )}
            <details className={kz.tipMeer}>
              <summary>Voorwaarden</summary>
              <ul className={kz.voorwaarden}>
                <li>Je punten worden toegekend nadat de opdracht van je buur uitgevoerd én volledig betaald is.</li>
                {regels.minOpdracht > 0 && <li>De opdracht van je buur is minstens € {regels.minOpdracht} waard.</li>}
                {regels.diensten && <li>Geldt voor: {regels.diensten}.</li>}
                {regels.maxPerKlant > 0 && <li>Maximaal {regels.maxPerKlant} buren per klant.</li>}
                {regels.geldigMaanden > 0 && <li>Punten blijven {regels.geldigMaanden} maanden geldig.</li>}
                {regels.eind && <li>Doorverwijzingen tot en met {fmtKort(regels.eind)}.</li>}
                <li>Niet voor jezelf, je eigen adres of iemand die al klant of aanvrager was.</li>
                <li>{regels.combineerbaar ? "Combineerbaar met andere acties." : "Niet combineerbaar met andere acties."}</li>
                <li>Punten zijn niet inwisselbaar voor geld.{ctx.reviewPunten > 0 ? " Reviewpunten krijg je voor elke eerlijke review, positief of negatief." : ""}</li>
                {burenVoordeel && <li>{burenVoordeel}</li>}
                {regels.voorwaarden && <li style={{ whiteSpace: "pre-line" }}>{regels.voorwaarden}</li>}
              </ul>
            </details>
          </section>
        </>
      )}

      {buurtActies.length > 0 && (
        <>
          <h2 className={kz.sectieTitel}>Binnenkort in je buurt</h2>
          <div className={kz.actieRaster}>{buurtActies.map((a) => <ActieKaart key={a.actie.id} k={k} actie={a.actie} interesse={a.interesse} />)}</div>
        </>
      )}
    </>
  );
}

/* ══ Hulp en contact: berichten, stormschade, profiel ══════════════════════ */

function Hulp({ k }: Ctx) {
  const lijst = [...(k.opmerkingen ?? [])].sort((a, b) => a.datum.localeCompare(b.datum));
  const marketing = k.voorkeuren?.marketing !== false;
  const aanvragen = [...(k.aanvragen ?? [])].sort((a, b) => b.datum.localeCompare(a.datum));
  return (
    <>
      <PaginaKop titel="Hulp en contact" />

      {aanvragen.length > 0 && (
        <section className={kz.kaart} id="aanvragen">
          <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><FileText size={18} /> Mijn aanvragen</h2></div>
          <ul className={kz.aanvraagKort}>
            {aanvragen.map((a) => (
              <li key={a.id}>
                <div>
                  <p className={kz.rijTitel}>{AANVRAAG_LABEL[a.soort]}</p>
                  <p className={kz.aanvraagSub}>{fmtKort(a.datum)}{a.tekst ? ` · ${a.tekst}` : ""}</p>
                </div>
                <span className={`${kz.badge} ${aanvraagLoopt(a.status) ? kz.badgeAmber : kz.badgeGroen}`}>{AANVRAAG_STATUS_LABEL[a.status]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

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

      <section className={`${kz.kaart} ${kz.spoedKaart}`} id="storm">
        <h2 className={kz.kaartTitel}><Siren size={18} /> Storm of een dringende vraag?</h2>
        <p className={kz.sub} style={{ marginTop: 4 }}>Bel Yannick of stuur een WhatsApp, dan helpt hij je zo snel mogelijk. Of meld het hieronder met foto&apos;s.</p>
        <div className={kz.spoedRij}>
          <a className={`${kz.knop} ${kz.knopPrimair}`} href={`tel:${SPOED_TEL}`}>Bel {SPOED_TOON}</a>
          <a className={`${kz.knop} ${kz.knopLicht}`} href={waLink(k, "iets dringends")} target="_blank" rel="noopener noreferrer"><WaIcoon size={17} /> WhatsApp</a>
        </div>
        <StormForm klantId={k.id} spoedTel={SPOED_TEL} spoedToon={SPOED_TOON} />
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
  // Acties voorlopig niet tonen aan klanten (Yannick zet ze later terug aan)
  const acties = (TOON_ACTIES ? instellingen.acties ?? [] : [])
    .map((actie) => ({ actie, interesse: interesseVoor(actie, alleKlanten) }))
    .filter((a) => actieVoorKlant(a.actie, k, a.interesse));

  const zichtbaar: Record<TabId, boolean> = {
    overzicht: true, werken: true, dossier: true, hulp: true,
    dakzorg: true,
    diensten: k.fase !== "gepland",
    voordelen: k.fase !== "gepland",
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
    dienstFotos: instellingen.dienstFotos ?? {},
    centPerPunt: instellingen.centPerPunt ?? CENT_PER_PUNT,
    reviewPunten: instellingen.reviewPunten ?? 0,
    komend: k.afspraken.filter((a) => a.start.slice(0, 10) >= vandaag()),
    voorbij: k.afspraken.filter((a) => a.start.slice(0, 10) < vandaag()),
    vrijeMomenten,
    dagLabels: Object.fromEntries(vrijeMomenten.map((m) => [m.start.slice(0, 10), fmtDag(m.start)])),
    grens,
  };
  const reviewAl = (k.tegoed ?? []).some((t) => t.sleutel === "review");
  // De ballon verschijnt zodra de werken klaar zijn (in het voorbeelddossier altijd, om hem te tonen)
  // Verdwijnt pas als de klant naar Google doorklikte (in het voorbeelddossier blijft hij staan)
  const toonBallon = !!ctx.reviewUrl && (!k.review?.geklikt || !!k.demo) && !reviewAl && (k.fase === "klaar" || k.fase === "nazorg" || !!k.demo);
  const openAanb = (k.aanbevelingen ?? []).filter((a) => a.status === "open").length;
  const openDocs = k.documenten.filter((d) => d.status === "open").length;
  const nieuwVanYannick = (k.opmerkingen ?? []).filter((o) => o.van === "yannick" && dagenTot(o.datum.slice(0, 10)) >= -3).length;
  const teller: Partial<Record<TabId, { n: number; amber?: boolean }>> = {
    dossier: openDocs + openAanb ? { n: openDocs + openAanb, amber: true } : undefined,
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
            <Link className={`${kz.spoedRond} ${kz.alleenMobiel}`} href="?tab=hulp#storm" aria-label="Storm of dringende vraag"><Siren size={15} /> Dringend</Link>
            <a className={kz.waRond} href={waLink(k)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Yannick"><WaIcoon size={20} /></a>
          </div>
        </div>
      </header>

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
          {k.demo && <p className={kz.demoBalk}>Voorbeelddossier met fictieve gegevens.</p>}
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

      {toonBallon && <ReviewBallon key={tab} klantId={k.id} voornaam={k.voornaam} foto={YANNICK_FOTO} />}

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
            <li><MeerMenu actief={tab} zichtbaar={tabs.filter((t) => !onderaan.includes(t.id)).map((t) => t.id)} tellers={{ dossier: openDocs + openAanb, voordelen: acties.length }} /></li>
          )}
        </ul>
      </nav>
    </main>
  );
}
