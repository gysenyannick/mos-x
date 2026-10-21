import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle, ArrowRight, CalendarDays, ClipboardList, CalendarPlus, Camera, CheckCircle2, Clock, CloudLightning, FileText,
  Home, Info, LayoutDashboard, Leaf, Lightbulb, MapPin, MessageCircle, NotebookPen, ShieldCheck, Sparkles, UserRound, Users, Wallet,
  Wrench,
} from "lucide-react";
import { headers } from "next/headers";
import { getInstellingen, getKlant, getMomenten, zorgVoorRefCode } from "@/lib/klantenzone/store";
import { controleBinnen, volgendeControle } from "@/lib/klantenzone/onderhoud";
import {
  brusselNaarDate, dagenTot, eindUur, fmtDag, fmtEuro, fmtKort, fmtMaand, fmtMoment, fmtUur, fmtDagMaand, groet, hfd, maandagVan,
  nuMs, plusJaren, vandaag,
} from "@/lib/klantenzone/tijd";
import {
  AFSPRAAK_TIPS, DAKZORG_INBEGREPEN, DOC_GROEPEN, DOC_IS_FACTUUR, FASES, FASE_KORT, FASE_LABEL, FOTO_FASE_LABEL, PRIORITEIT_LABEL, VERZET_UREN, WERK_STATUS_LABEL, WERK_UITLEG,
  type Afspraak, type FotoFase, type Klant, type VrijMoment,
} from "@/lib/klantenzone/types";
import AanvraagKnop from "@/components/klantenzone/aanvraag-knop";
import DeelBuurlink from "@/components/klantenzone/deel-buurlink";
import NietNuKnop from "@/components/klantenzone/niet-nu-knop";
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
  { id: "dak", label: "Mijn dak", icoon: Home },
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

/** Vlaamse groet volgens het uur */
function groetKort(): string {
  return groet().replace("Goede", "Goeie").replace("Goedenavond", "Goeienavond");
}

/** Leesbaar dossiernummer, bv. MX-2026-ETF0 */
function dossierNr(k: Klant): string {
  return `MX-${k.aangemaakt.slice(0, 4)}-${k.id.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase()}`;
}

/** Eén zin in gewone taal: wat gebeurt er nu met je dak? */
function statusZin(k: Klant, volgende?: Afspraak): string {
  const werken = k.werken ?? [];
  const bezig = werken.find((w) => w.status === "bezig");
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

function PaginaKop({ titel, sub, rechts, teller }: { titel: string; sub?: string; rechts?: React.ReactNode; teller?: number }) {
  return (
    <div className={kz.paginaKop}>
      <div>
        <h1 className={kz.paginaTitel}>{titel}{teller !== undefined && <span className={kz.telBol}>{teller}</span>}</h1>
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

function startTekst(k: Klant): { waarde: string; kort?: string; sub: string; zeker: boolean } {
  if (!k.start) return { waarde: "Nog te plannen", sub: "Je krijgt een berichtje zodra de datum vastligt.", zeker: false };
  const { datum, precisie } = k.start;
  if (precisie === "maand") return { waarde: fmtMaand(datum), sub: "Voorlopig. De exacte dag volgt.", zeker: false };
  if (precisie === "week") return { waarde: `Week van ${fmtDag(maandagVan(datum)).replace(/^\S+\s/, "")}`, sub: "Voorlopig. De exacte dag volgt.", zeker: false };
  const d = dagenTot(datum);
  const weekdag = hfd(fmtDag(datum).split(" ")[0]);
  return {
    waarde: fmtDag(datum),
    kort: fmtDagMaand(datum),
    sub: d > 1 ? `${weekdag}, nog ${d} dagen` : d === 1 ? `${weekdag}, morgen!` : d === 0 ? `${weekdag}, vandaag!` : "Je werken zijn gestart.",
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
function volgendeStap(k: Klant, volgende?: Afspraak, controle?: { datum: string } | null): { tekst: string; href: TabId; icoon: typeof Info } {
  const dringend = (k.aanbevelingen ?? []).find((a) => a.status === "open" && a.prioriteit === "dringend");
  if (dringend) return { tekst: `Yannick zag iets dat aandacht vraagt: ${dringend.titel.toLowerCase()}.`, href: "dak", icoon: AlertTriangle };
  const open = k.documenten.filter((d) => d.status === "open");
  if (open.length) return { tekst: `Er staat ${open.length === 1 ? "een factuur" : `${open.length} facturen`} voor je klaar om te betalen.`, href: "documenten", icoon: Wallet };
  if (volgende) return { tekst: `Volgende afspraak: ${volgende.titel.toLowerCase()} op ${fmtDag(volgende.start)} om ${fmtUur(volgende.start)}.`, href: "agenda", icoon: CalendarDays };
  switch (k.fase) {
    case "gepland": return { tekst: "Je werken staan gepland. Je startdatum en praktische info vind je in de agenda.", href: "agenda", icoon: CalendarDays };
    case "bezig": return { tekst: "Ik ben aan het werk. Volg de vooruitgang via de werffoto's.", href: "fotos", icoon: Camera };
    case "klaar": return { tekst: "Je dak is klaar! Bekijk het verschil voor en na.", href: "fotos", icoon: Sparkles };
  }
  const aanb = (k.aanbevelingen ?? []).find((a) => a.status === "open");
  if (aanb) return { tekst: `Aanbeveling van Yannick: ${aanb.titel.toLowerCase()}.`, href: "dak", icoon: Lightbulb };
  if (controle && controleBinnen(controle.datum) < 90) {
    return { tekst: `Je volgende controle is aangeraden rond ${fmtMaand(controle.datum)}. Plan ze in met één klik.`, href: "dak", icoon: Wrench };
  }
  switch (k.fase) {
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
  controle: { datum: string; reden: string } | null;
  refUrl: string;
  burenVoordeel?: string;
};

function Werken({ k }: { k: Klant }) {
  const werken = k.werken ?? [];
  if (!werken.length) return null;
  const klaar = werken.filter((w) => w.status === "klaar").length;
  return (
    <section className={kz.kaart} id="werken">
      <div className={kz.kaartKop}>
        <h2 className={kz.kaartTitel}><ClipboardList size={18} /> Je werken</h2>
        <span className={`${kz.badge} ${klaar === werken.length ? kz.badgeGroen : ""}`}>{klaar} van {werken.length} klaar</span>
      </div>
      <div className={kz.werkBalk} aria-hidden="true">
        {werken.map((w) => <span key={w.id} className={`${kz.werkBalkDeel} ${kz[`werk_${w.status}`] ?? ""}`} />)}
      </div>
      <ul className={kz.werkLijst}>
        {werken.map((w) => (
          <li key={w.id} className={`${kz.werk} ${kz[`werk_${w.status}`] ?? ""}`}>
            <span className={kz.werkStatusIcoon} aria-hidden="true">
              {w.status === "klaar" ? <CheckCircle2 size={20} /> : w.status === "bezig" ? <span className={kz.pulseGroen} /> : <Clock size={18} />}
            </span>
            <div className={kz.werkTekst}>
              <div className={kz.werkKop}>
                <p className={kz.werkNaam}>{w.naam}</p>
                <span className={`${kz.badge} ${w.status === "gepland" ? "" : kz.badgeGroen}`}>{WERK_STATUS_LABEL[w.status]}</span>
              </div>
              <p className={kz.werkUitleg}>{w.omschrijving || WERK_UITLEG[w.naam] || ""}</p>
              {w.datum && (
                <p className={kz.werkDatum}>
                  <CalendarDays size={13} /> {w.status === "klaar" ? `Uitgevoerd op ${fmtDag(w.datum)}`
                    : w.status === "bezig" ? (w.datum === vandaag() ? "Vandaag aan de slag" : `Gestart op ${fmtDag(w.datum)}`)
                    : `Gepland op ${fmtDag(w.datum)}`}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const FAQ = [
  { v: "Moet ik thuis zijn tijdens de werken?", a: "Meestal niet. Zolang ik aan je dak kan en een buitenkraan mag gebruiken, kan ik aan de slag. Bij de start en de oplevering spreek ik graag even met je af." },
  { v: "Wat als het regent?", a: "Een reiniging kan bij lichte regen, een coating niet: die heeft droog weer nodig. Schuift de planning op, dan zie je de nieuwe dag hier en krijg je een berichtje." },
  { v: "Hoe betaal ik?", a: "Via overschrijving, met de gegevens op je factuur. Op deze pagina zie je altijd wat al betaald is en wat nog openstaat." },
  { v: "Kan ik een afspraak verzetten?", a: "Ja. Tot 48 uur vooraf kies je hierboven zelf een ander vrij moment. Later nog? Stuur me een WhatsApp, dan zoeken we samen een oplossing." },
  { v: "Hoe lang blijft deze link werken?", a: "Altijd. Ook na de werken vind je hier je foto's, documenten en garantie terug." },
];

function Overzicht(ctx: Ctx) {
  const { k, komend, controle } = ctx;
  const faseIndex = FASES.indexOf(k.fase);
  const stap = volgendeStap(k, komend[0], controle);
  const start = startTekst(k);
  const facturen = k.documenten.filter((d) => DOC_IS_FACTUUR(d.type) && d.bedrag);
  const totaal = facturen.reduce((s, d) => s + (d.bedrag ?? 0), 0);
  const betaald = facturen.filter((d) => d.status === "betaald").reduce((s, d) => s + (d.bedrag ?? 0), 0);
  const open = totaal - betaald;
  const prijsDocs = k.documenten.filter((d) => DOC_IS_FACTUUR(d.type) || d.type === "offerte");
  const labels = Object.fromEntries(k.documenten.map((d) => [d.id, { datum: fmtKort(d.datum), bedrag: d.bedrag ? fmtEuro(d.bedrag) : undefined }]));

  return (
    <>
      {/* ── Kop zoals een app: donkere band + statuskaart ── */}
      <section className={kz.appKop}>
        <p className={kz.appLabel}>Mijn MOS-X</p>
        <h1 className={kz.appGroet}>{groetKort()}, {k.voornaam}</h1>
        <span className={kz.appStreep} aria-hidden="true" />
      </section>

      <section className={kz.statusKaart}>
        <div className={kz.statusBoven}>
          <span className={kz.statusStap}>{(k.dienst || "Dakwerken").split(" en ")[0]} · Stap {faseIndex + 1} van {FASES.length}</span>
          <span className={kz.dossierNr}>{dossierNr(k)}</span>
        </div>
        <h2 className={kz.statusZin}>{statusZin(k, komend[0])}</h2>
        <p className={kz.statusVolgende}><strong>Volgende:</strong> {hfd(stap.tekst.replace(/^Volgende afspraak: /, ""))}</p>

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

        {k.fotos[0] && (
          <Link href="?tab=fotos" className={kz.statusFoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={k.fotos[0].url} alt={k.fotos[0].bijschrift ?? "Laatste werffoto"} />
            <span>Laatste werffoto · {fmtDagMaand(k.fotos[0].datum.slice(0, 10))}</span>
          </Link>
        )}

        <a className={kz.statusPersoon} href={waLink(k)} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={YANNICK_FOTO} alt="" />
          <span>
            <span className={kz.statusPersoonNaam}>Yannick</span>
            <span className={kz.statusPersoonRol}>doet jouw werken zelf</span>
          </span>
          <span className={kz.statusWa}><WaIcoon size={18} /></span>
        </a>
      </section>

      {k.bericht && (
        <div className={kz.berichtLicht}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={YANNICK_FOTO} alt="" className={kz.berichtFoto} />
          <div>
            <p className={kz.berichtVanLicht}>Bericht van Yannick</p>
            <p className={kz.berichtTekstLicht}>{k.bericht}</p>
          </div>
        </div>
      )}

      {/* ── Jouw planning ── */}
      <section className={kz.kaart}>
        <div className={kz.kaartKop}>
          <h2 className={kz.kaartTitel}>Jouw planning</h2>
          <Link href="?tab=agenda" className={kz.meerLink}>Agenda <ArrowRight size={14} /></Link>
        </div>
        {komend.length === 0 && !(k.start && k.start.datum >= vandaag()) ? (
          <p className={kz.leeg}>Zodra mijn planning je start vastlegt, staat de dag hier en krijg je een berichtje.</p>
        ) : (
          <ul className={kz.planning}>
            {k.start && k.start.datum >= vandaag() && !komend.some((a) => a.titel === "Start werken") && (
              <li>
                <span className={kz.planningIcoon}><CalendarDays size={17} /></span>
                <span className={kz.rijMidden}>
                  <span className={kz.planningTitel}>{start.zeker ? "Start van je werken" : "Voorlopige start"}</span>
                  <span className={kz.planningDatum}>{hfd(start.waarde)}{start.zeker ? "" : " (voorlopig)"}</span>
                </span>
              </li>
            )}
            {komend.map((a) => {
              const kanVerzetten = brusselNaarDate(a.start).getTime() > ctx.grens && ctx.vrijeMomenten.length > 0;
              return (
                <li key={a.id}>
                  <span className={kz.planningIcoon}><CalendarDays size={17} /></span>
                  <span className={kz.rijMidden}>
                    <span className={kz.planningTitel}>{a.titel}</span>
                    <span className={kz.planningDatum}>{hfd(fmtDag(a.start))} · {fmtUur(a.start)}</span>
                  </span>
                  {kanVerzetten && <VerzetKnop klantId={k.id} afspraakId={a.id} titel={`${a.titel}, nu op ${fmtDag(a.start)} om ${fmtUur(a.start)}`} momenten={ctx.vrijeMomenten} dagLabels={ctx.dagLabels} />}
                </li>
              );
            })}
          </ul>
        )}
        <p className={kz.sub} style={{ fontSize: 13 }}>Komt het niet uit? Tot {VERZET_UREN} uur vooraf kies je zelf een ander moment.</p>
      </section>

      {/* ── Wie er aanbelt ── */}
      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><UserRound size={18} /> Wie er aanbelt</h2></div>
        <div className={kz.vakman}>
          <video className={kz.vakmanVideo} src="/videos/yannick-hero.mp4" poster={YANNICK_FOTO} controls muted playsInline preload="none" />
          <div>
            <p className={kz.rijTitel} style={{ fontSize: 17 }}>Yannick</p>
            <p className={kz.sub} style={{ marginTop: 4 }}>Ik doe het werk zelf, zonder onderaannemers. Zo weet je altijd wie er aanbelt, en stel je je vragen rechtstreeks aan mij.</p>
          </div>
        </div>
      </section>

      {/* ── 5. Werken ── */}
      <Werken k={k} />

      {/* ── 6. Werffoto's ── */}
      <SectieKop titel={`Werffoto's${k.fotos.length ? ` (${k.fotos.length})` : ""}`} meer={k.fotos.length > 6 ? { href: "?tab=fotos", label: "Alle foto's" } : undefined} />
      <section className={kz.kaart} style={{ marginTop: 0 }}>
        {k.fotos.length === 0 ? (
          <p className={kz.leeg}>Ik fotografeer je dak voor, tijdens en na de werken. Zo volg je de vooruitgang thuis of op het werk.</p>
        ) : (
          <FotoGalerij fotos={k.fotos.slice(0, 6)} />
        )}
        <div className={kz.rijKnoppen}>
          <UploadKnop klantId={k.id} soort="foto" label="Zelf een foto toevoegen" licht meerdere />
        </div>
      </section>

      {/* ── 7. Offertes en facturen ── */}
      <SectieKop titel="Offertes en facturen" meer={k.documenten.length ? { href: "?tab=documenten", label: "Alle documenten" } : undefined} />
      <section className={kz.kaart} style={{ marginTop: 0 }}>
        {totaal > 0 && (
          <>
            <div className={kz.totaal} style={{ marginBottom: 0 }}>
              <div className={kz.totaalVak}><p className={kz.label} style={{ margin: 0 }}>Betaald</p><p className={kz.totaalBedrag} style={{ color: "#7AB54E" }}>{fmtEuro(betaald)}</p></div>
              <div className={kz.totaalVak}><p className={kz.label} style={{ margin: 0 }}>Nog open</p><p className={kz.totaalBedrag} style={{ color: open ? "#B7791F" : undefined }}>{fmtEuro(open)}</p></div>
            </div>
            <div className={kz.geldBalk} aria-hidden="true"><div className={kz.geldBalkIn} style={{ width: `${(betaald / totaal) * 100}%` }} /></div>
          </>
        )}
        {prijsDocs.length === 0 ? (
          <p className={kz.leeg}>Je offerte en facturen verschijnen hier zodra ze klaar zijn.</p>
        ) : (
          <DocumentLijst documenten={prijsDocs} labels={labels} />
        )}
      </section>

      {/* ── 8. WhatsApp ── */}
      <section className={kz.waKaart}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className={kz.waTitel}>Eén nummer, het hele project lang</h2>
          <p className={kz.waTekst}>Een vraag over je offerte, je planning, een foto van je dak of iets na de werken? Stuur een WhatsApp naar hetzelfde nummer. Je krijgt altijd mij.</p>
        </div>
        <div className={kz.rijKnoppen} style={{ marginTop: 0 }}>
          <a className={`${kz.knop} ${kz.knopPrimair}`} href={waLink(k)} target="_blank" rel="noopener noreferrer"><WaIcoon size={16} /> Stuur een berichtje</a>
          <a className={`${kz.knop} ${kz.knopLicht}`} href="tel:+32468352869">+32 468 35 28 69</a>
        </div>
      </section>

      {/* ── 9. Veelgestelde vragen ── */}
      <SectieKop titel="Veelgestelde vragen" />
      <section className={kz.kaart} style={{ marginTop: 0, padding: "6px 22px" }}>
        {FAQ.map((f) => (
          <details key={f.v} className={kz.faq}>
            <summary>{f.v}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
    </>
  );
}

function MijnDak({ k, controle, refUrl, burenVoordeel }: Ctx) {
  const p = k.paspoort ?? {};
  const open = (k.aanbevelingen ?? []).filter((a) => a.status === "open" || a.status === "aangevraagd");
  const afgehandeld = (k.aanbevelingen ?? []).filter((a) => a.status === "gedaan");
  const nieuweAanvraag = (soort: string) => (k.aanvragen ?? []).some((a) => a.status === "nieuw" && a.soort === soort);
  const garantie = garantieStaat(k);
  const kenmerken = [
    { label: "Daktype", waarde: p.daktype },
    { label: "Oppervlakte", waarde: p.oppervlakte ? `± ${p.oppervlakte} m²` : undefined },
    { label: "Bouwjaar", waarde: p.bouwjaar },
    { label: "Kleur", waarde: p.kleur },
    { label: "Zonnepanelen", waarde: p.zonnepanelen === undefined ? undefined : p.zonnepanelen ? "Ja" : "Nee" },
    { label: "Dakvensters", waarde: p.dakvensters !== undefined ? String(p.dakvensters) : undefined },
    { label: "Dakgoten", waarde: p.goten },
  ].filter((x) => x.waarde);
  const verwezen = (k.verwijzingen ?? []).length;
  const klantGeworden = (k.verwijzingen ?? []).filter((v) => v.status === "klant").length;

  return (
    <>
      <PaginaKop titel="Mijn dak" sub="Je digitale dakpaspoort: alles over je dak, en wat het de komende jaren nodig heeft." />

      {/* Onderhoud */}
      <section className={kz.kaart}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span className={kz.rijIcoon}><Wrench size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className={kz.label} style={{ margin: 0 }}>Volgende controle</p>
            <p className={kz.groot} style={{ fontSize: 21 }}>{controle ? fmtMaand(controle.datum) : "Na je eerste behandeling"}</p>
            <p className={kz.sub} style={{ marginTop: 4 }}>
              {controle ? controle.reden : "Zodra je dak behandeld is, zie je hier wanneer een controle aangeraden is."}
            </p>
            {controle && (
              <div className={kz.rijKnoppen}>
                <AanvraagKnop
                  klantId={k.id} soort="onderhoud" alGevraagd={nieuweAanvraag("onderhoud")}
                  label={<><CalendarPlus size={15} /> Plan mijn volgende onderhoud</>}
                  titel="Onderhoud inplannen"
                  uitleg="Yannick neemt contact op om een moment af te spreken. Je hoeft niets opnieuw uit te leggen: hij kent je dak al."
                  placeholder="bv. Liefst in het voorjaar, of: na 16u ben ik thuis."
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Aanbevelingen */}
      <SectieKop titel={`Aanbevelingen van Yannick${open.length ? ` (${open.length})` : ""}`} />
      {open.length === 0 ? (
        <section className={kz.kaart} style={{ marginTop: 0 }}>
          <p className={kz.leeg}>Geen openstaande aanbevelingen. Ziet Yannick tijdens een bezoek iets dat aandacht vraagt, dan lees je het hier, met de reden erbij.</p>
        </section>
      ) : open.map((a) => (
        <section key={a.id} className={`${kz.kaart} ${kz.aanbeveling} ${a.prioriteit === "dringend" ? kz.aanbevelingDringend : ""}`} style={{ marginTop: 0, marginBottom: 12 }}>
          <div className={kz.aanbevelingRij}>
            {a.fotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.fotoUrl} alt="" className={kz.aanbevelingFoto} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className={`${kz.badge} ${a.prioriteit === "dringend" ? kz.badgeAmber : kz.badgeGroen}`}>{PRIORITEIT_LABEL[a.prioriteit]}</span>
              <p className={kz.rijTitel} style={{ marginTop: 8, fontSize: 16 }}>{a.titel}</p>
              {a.tekst && <p className={kz.sub} style={{ marginTop: 4 }}>{a.tekst}</p>}
              <p className={kz.tijdDatum}>Vastgesteld door Yannick · {fmtKort(a.datum)}</p>
              <div className={kz.rijKnoppen}>
                <AanvraagKnop
                  klantId={k.id} soort="aanbeveling" aanbevelingId={a.id} klein alGevraagd={a.status === "aangevraagd"}
                  label="Ja, graag laten doen" titel={a.titel}
                  uitleg="Yannick laat je weten wat het kost en wanneer hij het kan doen. Je zit nergens aan vast."
                  placeholder="Vraag of opmerking (optioneel)"
                />
                {a.status === "open" && <NietNuKnop klantId={k.id} aanbevelingId={a.id} />}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Dakzorg */}
      <SectieKop titel="MOS-X Dakzorg" />
      {k.dakzorg?.actief ? (
        <section className={`${kz.kaart} ${kz.dakzorgKaart}`} style={{ marginTop: 0 }}>
          <span className={`${kz.badge} ${kz.badgeGroen}`}><CheckCircle2 size={13} /> Actief{k.dakzorg.sinds ? ` sinds ${fmtKort(k.dakzorg.sinds)}` : ""}</span>
          <p className={kz.groot} style={{ fontSize: 20, marginTop: 10 }}>Je dak wordt opgevolgd.</p>
          <ul className={kz.vinkLijst}>{DAKZORG_INBEGREPEN.map((x) => <li key={x}><CheckCircle2 size={16} /> {x}</li>)}</ul>
          {k.dakzorg.prijs && <p className={kz.sub} style={{ fontSize: 13 }}>Jouw formule: {k.dakzorg.prijs}. Opzeggen kan altijd, zonder kosten.</p>}
        </section>
      ) : (
        <section className={`${kz.kaart} ${kz.dakzorgKaart}`} style={{ marginTop: 0 }}>
          <p className={kz.groot} style={{ fontSize: 20 }}>Levenslang een verzorgd dak.</p>
          <p className={kz.sub}>Met MOS-X Dakzorg volg ik je dak elk jaar persoonlijk op. Zo blijft het resultaat, en vang ik kleine problemen op voor ze duur worden.</p>
          <ul className={kz.vinkLijst}>{DAKZORG_INBEGREPEN.map((x) => <li key={x}><CheckCircle2 size={16} /> {x}</li>)}</ul>
          <div className={kz.rijKnoppen}>
            <AanvraagKnop
              klantId={k.id} soort="dakzorg" alGevraagd={nieuweAanvraag("dakzorg")}
              label="Ik heb interesse" titel="Interesse in MOS-X Dakzorg"
              uitleg="Yannick maakt een voorstel op maat van jouw dak. Vrijblijvend, en opzeggen kan altijd."
              placeholder="Vraag of opmerking (optioneel)"
            />
            <a className={`${kz.knop} ${kz.knopLicht}`} href="/diensten/mos-x-dakzorg" target="_blank">Meer info</a>
          </div>
        </section>
      )}

      {/* Dakpaspoort */}
      <SectieKop titel="Dakpaspoort" />
      <section className={kz.kaart} style={{ marginTop: 0 }}>
        {kenmerken.length === 0 ? (
          <p className={kz.leeg}>Na het plaatsbezoek vult Yannick hier de gegevens van je dak in: type, oppervlakte, goten en waar hij op let.</p>
        ) : (
          <dl className={kz.kenmerken}>
            {kenmerken.map((x) => (
              <div key={x.label} className={String(x.waarde).length > 22 ? kz.kenmerkBreed : undefined}><dt>{x.label}</dt><dd>{x.waarde}</dd></div>
            ))}
          </dl>
        )}
        {p.aandachtspunten && (
          <div className={kz.infoBlok} style={{ marginTop: 14 }}>
            <Lightbulb size={16} />
            <span><strong>Waar Yannick op let</strong><br />{p.aandachtspunten.split("\n").filter(Boolean).map((r, i) => <span key={i} style={{ display: "block" }}>• {r}</span>)}</span>
          </div>
        )}
        {k.documenten.some((d) => d.type === "garantie" || d.type === "fiche") && (
          <Link href="?tab=documenten" className={kz.meerLink} style={{ marginTop: 14 }}>
            Garantiecertificaat en technische fiches <ArrowRight size={14} />
          </Link>
        )}
        {garantie.length > 0 && (
          <div className={kz.rijKnoppen} style={{ marginTop: 14 }}>
            {garantie.map((g) => <span key={g.id} className={`${kz.badge} ${kz.badgeGroen}`} style={{ padding: "6px 10px", whiteSpace: "normal" }}><g.icoon size={13} /> {g.titel} · {g.staat.toLowerCase()}</span>)}
          </div>
        )}
      </section>

      {/* Historiek */}
      <SectieKop titel="Onderhoudshistoriek" meer={k.fotos.length ? { href: "?tab=fotos", label: "Foto's bekijken" } : undefined} />
      <section className={kz.kaart} style={{ marginTop: 0 }}>
        {(k.behandelingen ?? []).length === 0 && afgehandeld.length === 0 ? (
          <p className={kz.leeg}>Elke behandeling die Yannick uitvoert, komt hier: met datum, wat er gebeurde en welke producten hij gebruikte.</p>
        ) : (
          <ol className={kz.tijdlijn}>
            {(k.behandelingen ?? []).map((b) => (
              <li key={b.id} className={kz.tijdItem}>
                <p className={kz.tijdTekst} style={{ fontWeight: 600 }}>{b.soort}</p>
                {b.opmerking && <p className={kz.tijdTekst} style={{ color: "#545454" }}>{b.opmerking}</p>}
                {b.producten && <p className={kz.tijdDatum}>Gebruikt: {b.producten}</p>}
                <p className={kz.tijdDatum}>{hfd(fmtDag(b.datum, true))}</p>
              </li>
            ))}
            {afgehandeld.map((a) => (
              <li key={a.id} className={kz.tijdItem}>
                <p className={kz.tijdTekst} style={{ fontWeight: 600 }}>{a.titel}</p>
                <p className={kz.tijdDatum}>Uitgevoerd na aanbeveling</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Buren */}
      <SectieKop titel="Ook je buren een verzorgd dak?" />
      <section className={kz.kaart} style={{ marginTop: 0 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span className={kz.rijIcoon}><Users size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className={kz.rijTitel} style={{ fontSize: 16 }}>Tevreden? Zeg het voort.</p>
            <p className={kz.sub} style={{ marginTop: 4, marginBottom: 12 }}>
              Deel je persoonlijke link met buren, familie of vrienden. Zo weet ik dat ze via jou komen.
              {burenVoordeel ? ` ${burenVoordeel}` : ""}
              {" "}Werk ik bij meerdere woningen in dezelfde straat, dan bespaar ik verplaatsingen, en dat merk je.
            </p>
            <DeelBuurlink url={refUrl} voornaam={k.voornaam} />
            {verwezen > 0 && (
              <p className={kz.ok}><CheckCircle2 size={15} style={{ verticalAlign: -3 }} /> {verwezen} {verwezen === 1 ? "persoon kwam" : "mensen kwamen"} via jouw link{klantGeworden ? `, ${klantGeworden} werd${klantGeworden > 1 ? "en" : ""} klant` : ""}. Bedankt!</p>
            )}
          </div>
        </div>
      </section>

      {/* Schade */}
      <section className={kz.kaart}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <span className={kz.rijIcoon}><CloudLightning size={18} /></span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p className={kz.rijTitel}>Schade gezien na een storm?</p>
            <p className={kz.rijSub}>Meld het hier. Voeg gerust een foto toe bij Foto&apos;s, dan bekijkt Yannick het.</p>
          </div>
          <AanvraagKnop
            klantId={k.id} soort="schade" licht klein
            label={<><AlertTriangle size={15} /> Schade melden</>}
            titel="Schade melden"
            uitleg="Beschrijf kort wat je zag. Yannick neemt contact op om te kijken wat nodig is."
            placeholder="bv. Na de storm van gisteren ligt er een dakpan in de tuin."
          />
        </div>
      </section>
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
        teller={k.fotos.length}
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
      <PaginaKop titel="Agenda" teller={komend.length} sub={`Al je afspraken op een rij. Tot ${VERZET_UREN} uur vooraf kies je zelf een ander moment.`} />

      <section className={kz.kaart}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span className={kz.rijIcoon}><CalendarDays size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <p className={kz.label} style={{ margin: 0 }}>Start van je werken</p>
              <span className={`${kz.badge} ${start.zeker ? kz.badgeGroen : kz.badgeAmber}`}>{start.zeker ? "Vastgelegd" : k.start ? "Voorlopig" : "Te plannen"}</span>
            </div>
            <p className={kz.groot} style={{ fontSize: 19, marginTop: 4 }}>{start.waarde}</p>
          </div>
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
  const facturen = k.documenten.filter((d) => DOC_IS_FACTUUR(d.type));
  const metBedrag = facturen.filter((d) => d.bedrag);
  const totaal = metBedrag.reduce((s, d) => s + (d.bedrag ?? 0), 0);
  const betaald = metBedrag.filter((d) => d.status === "betaald").reduce((s, d) => s + (d.bedrag ?? 0), 0);
  const open = totaal - betaald;

  return (
    <>
      <PaginaKop titel="Documenten" teller={k.documenten.length} sub="Je offertes en facturen op één plek. Tik op een document om het te bekijken." />

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

      {DOC_GROEPEN.map((g) => ({ ...g, lijst: k.documenten.filter((d) => g.types.includes(d.type)) }))
        .filter((g) => g.lijst.length).map((g) => (
        <div key={g.titel}>
          <SectieKop titel={`${g.titel} (${g.lijst.length})`} />
          <section className={kz.kaart} style={{ marginTop: 0 }}>
            {g.uitleg && <p className={kz.sub} style={{ marginTop: 0, marginBottom: 12 }}>{g.uitleg}</p>}
            <DocumentLijst documenten={g.lijst} labels={labels} />
          </section>
        </div>
      ))}

      {k.documenten.length > 0 && (
        <p className={kz.sub} style={{ textAlign: "center", marginTop: 18 }}>
          Vraag over een document? <a href={waLink(k, "een document")} target="_blank" rel="noopener noreferrer" style={{ color: "#7AB54E", fontWeight: 600 }}>Stuur me een berichtje</a>.
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
      <PaginaKop titel="Logboek" teller={k.log.length + (k.notities?.length ?? 0)} sub="Notities van Yannick en alles wat er gebeurde in je dossier." />

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
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "www.mos-x.be";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const refCode = await zorgVoorRefCode(k);
  const ctx: Ctx = {
    k,
    controle: volgendeControle(k),
    refUrl: `${proto}://${host}/buur/${refCode}`,
    burenVoordeel: (await getInstellingen()).burenVoordeel,
    komend: k.afspraken.filter((a) => a.start.slice(0, 10) >= vandaag()),
    voorbij: k.afspraken.filter((a) => a.start.slice(0, 10) < vandaag()),
    vrijeMomenten,
    dagLabels: Object.fromEntries(vrijeMomenten.map((m) => [m.start.slice(0, 10), fmtDag(m.start)])),
    grens,
  };
  const openDocs = k.documenten.filter((d) => d.status === "open").length;
  const teller: Partial<Record<TabId, { n: number; amber?: boolean }>> = {
    dak: (() => {
      const open = (k.aanbevelingen ?? []).filter((a) => a.status === "open");
      return open.length ? { n: open.length, amber: open.some((a) => a.prioriteit === "dringend") } : undefined;
    })(),
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
          <a className={`${kz.knop} ${kz.knopPrimair} ${kz.zijKnop}`} href={waLink(k)} target="_blank" rel="noopener noreferrer">
            <WaIcoon size={17} /> Vraag aan Yannick
          </a>
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
          <div className={kz.zijOnder}>
            {k.dakzorg?.actief && <p className={kz.zijTip}><ShieldCheck size={15} /> MOS-X Dakzorg actief</p>}
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
          {tab === "dak" && <MijnDak {...ctx} />}
          {tab === "fotos" && <Fotos {...ctx} />}
          {tab === "agenda" && <Agenda {...ctx} />}
          {tab === "documenten" && <Documenten {...ctx} />}
          {tab === "logboek" && <Logboek {...ctx} />}

          <div className={kz.voet}>
            <p>Bewaar deze link: hij blijft werken, van je aanvraag tot lang na je werken.</p>
            <p>Deel hem niet met anderen: wie de link heeft, ziet je dossier.</p>
          </div>
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
