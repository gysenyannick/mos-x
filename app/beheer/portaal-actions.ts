"use server";

import { revalidatePath } from "next/cache";
import { vereisBeheerder } from "@/lib/klantenzone/auth";
import { meldKlant } from "@/lib/klantenzone/meldingen";
import { getInstellingen, nieuwId, saveInstellingen, wijzigKlant, type Actie, type CampagneType } from "@/lib/klantenzone/store";
import {
  AANVRAAG_LABEL, AANVRAAG_STATUSSEN, AANVRAAG_STATUS_LABEL, type AanvraagStatus, type Inspectie, type Klant, type VerwijzingStatus,
} from "@/lib/klantenzone/types";
import { beloningMag, beloningTransactie, refRegels, voegTransactieToe } from "@/lib/klantenzone/voordeel";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const getal = (fd: FormData, k: string) => {
  const v = s(fd, k).replace(",", ".");
  if (v === "") return undefined;
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
};

function ververs(id?: string) {
  revalidatePath("/beheer");
  revalidatePath("/beheer/doorverwijzingen");
  revalidatePath("/beheer/cijfers");
  if (id) {
    revalidatePath(`/beheer/${id}`);
    revalidatePath(`/klant/${id}`);
  }
}

function audit(k: Klant, wat: string) {
  (k.audit ??= []).push({ datum: new Date().toISOString(), wie: "Yannick (beheer)", wat });
}

/* ── Aanvragen van de klant ──────────────────────────────────────────────── */

export async function zetAanvraagStatusV2(id: string, aanvraagId: string, status: AanvraagStatus) {
  await vereisBeheerder();
  if (!AANVRAAG_STATUSSEN.includes(status)) return;
  const r = await wijzigKlant(id, (k) => {
    const a = (k.aanvragen ?? []).find((x) => x.id === aanvraagId);
    if (!a || a.status === status) return null;
    a.status = status;
    (a.historiek ??= []).push({ datum: new Date().toISOString(), status });
    return a;
  });
  ververs(id);
  const a = r?.resultaat;
  if (r && a && status !== "nieuw" && status !== "beoordeling") {
    await meldKlant(r.klant, {
      soort: "aanvraag", sleutel: `aanvraag-${a.id}-${status}`,
      onderwerp: `Je aanvraag: ${AANVRAAG_STATUS_LABEL[status].toLowerCase()}`,
      tekst: `De status van je aanvraag "${AANVRAAG_LABEL[a.soort]}" is nu: ${AANVRAAG_STATUS_LABEL[status]}.`,
      knop: { label: "Bekijk je aanvragen", tab: "diensten" },
    });
  }
}

/* ── Inspecties en controles ─────────────────────────────────────────────── */

export async function voegInspectieToe(id: string, fd: FormData) {
  await vereisBeheerder();
  const datum = s(fd, "datum");
  const soort = s(fd, "soort") as Inspectie["soort"];
  if (!datum || !["12maanden", "controle", "plaatsbezoek"].includes(soort)) return;
  const r = await wijzigKlant(id, (k) => {
    (k.inspecties ??= []).push({ id: nieuwId(6), datum, soort, bevindingen: s(fd, "bevindingen"), verslagUrl: s(fd, "verslagUrl") || undefined });
    k.log.unshift({ datum: new Date().toISOString(), tekst: "Er werd een dakcontrole toegevoegd aan je dakdossier." });
    // Na een controle kan Yannick de onderhoudsdatum bijstellen
    const volgende = s(fd, "volgendeControle");
    if (volgende) k.volgendeControle = volgende;
  });
  ververs(id);
  if (r) {
    await meldKlant(r.klant, {
      soort: "controle", sleutel: `inspectie-${datum}`,
      onderwerp: "Het verslag van je dakcontrole staat klaar",
      tekst: "Je dak werd gecontroleerd. Het verslag staat in je dakdossier.",
      knop: { label: "Bekijk je dakdossier", tab: "dossier" },
    });
  }
}

export async function verwijderInspectie(id: string, inspectieId: string) {
  await vereisBeheerder();
  await wijzigKlant(id, (k) => { k.inspecties = (k.inspecties ?? []).filter((i) => i.id !== inspectieId); });
  ververs(id);
}

/* ── Stormmeldingen ──────────────────────────────────────────────────────── */

export async function zetStormStatus(id: string, meldingId: string, status: "nieuw" | "behandeld") {
  await vereisBeheerder();
  await wijzigKlant(id, (k) => {
    const m = (k.stormMeldingen ?? []).find((x) => x.id === meldingId);
    if (m) m.status = status;
  });
  ververs(id);
}

/* ── Doorverwijzingen en beloningen ──────────────────────────────────────── */

const VERWIJZING_FLOW: VerwijzingStatus[] = ["nieuw", "offerte", "bevestigd", "uitgevoerd", "geen"];

export async function bewaarVerwijzing(id: string, vId: string, fd: FormData) {
  await vereisBeheerder();
  const status = s(fd, "status") as VerwijzingStatus;
  await wijzigKlant(id, (k) => {
    const v = (k.verwijzingen ?? []).find((x) => x.id === vId);
    if (!v) return;
    const oud = JSON.stringify({ st: v.status, w: v.opdrachtWaarde, b: v.betaald });
    // Een toegekende beloning blijft: de status gaat dan niet meer terug
    if (v.status !== "beloond" && VERWIJZING_FLOW.includes(status)) v.status = status;
    v.opdrachtWaarde = getal(fd, "opdrachtWaarde");
    v.betaald = s(fd, "betaald") === "ja";
    v.reden = s(fd, "reden") || undefined;
    const nieuw = JSON.stringify({ st: v.status, w: v.opdrachtWaarde, b: v.betaald });
    if (oud !== nieuw) audit(k, `Doorverwijzing ${v.naam}: ${oud} → ${nieuw}`);
  });
  ververs(id);
}

/** Kent de beloning toe, enkel als alle voorwaarden vervuld zijn. Twee keer klikken geeft geen twee beloningen. */
export async function kenBeloningToe(id: string, vId: string): Promise<void> {
  await vereisBeheerder();
  const regels = refRegels(await getInstellingen());
  const r = await wijzigKlant(id, (k) => {
    const v = (k.verwijzingen ?? []).find((x) => x.id === vId);
    if (!v) return null;
    const { mag } = beloningMag(k, v, regels);
    if (!mag) return null;
    const nu = new Date().toISOString();
    const t = beloningTransactie(v, regels, nieuwId(8), nu);
    if (!voegTransactieToe(k, t)) return null;
    v.status = "beloond";
    audit(k, `Beloning € ${t.bedrag} toegekend voor doorverwijzing ${v.naam} (sleutel ${t.sleutel})`);
    k.log.unshift({ datum: nu, tekst: `Je kreeg een bon (${regels.naam.toLowerCase()}) omdat iemand via jou klant werd. Bedankt!` });
    return t.bedrag;
  });
  ververs(id);
  if (r?.resultaat) {
    await meldKlant(r.klant, {
      soort: "beloning", sleutel: `beloning-${vId}`,
      onderwerp: "Je kreeg een bon van de MOS-X Kring",
      tekst: `Iemand die jij aanbracht, werd klant. Bedankt! Je kreeg een bon: ${regels.naam.toLowerCase()}.`,
      knop: { label: "Bekijk je voordelen", tab: "voordelen" },
    });
  }
}

/** Handmatige boeking: tegoed gebruikt, correctie of annulering. Altijd met reden, nooit iets overschrijven. */
export async function boekTegoed(id: string, fd: FormData) {
  await vereisBeheerder();
  const soort = s(fd, "soort") as "gebruikt" | "correctie" | "geannuleerd";
  const bedrag = getal(fd, "bedrag");
  const reden = s(fd, "omschrijving");
  if (!["gebruikt", "correctie", "geannuleerd"].includes(soort) || !bedrag || !reden) return;
  // Gebruikt en geannuleerd gaan altijd af; een correctie mag beide richtingen
  const teken = soort === "correctie" ? bedrag : -Math.abs(bedrag);
  await wijzigKlant(id, (k) => {
    const ok = voegTransactieToe(k, { id: nieuwId(8), datum: new Date().toISOString(), soort, bedrag: teken, omschrijving: reden, door: "yannick" });
    if (ok) audit(k, `Tegoed ${soort}: ${teken > 0 ? "+" : ""}${teken} (${reden})`);
  });
  ververs(id);
}

export async function zetDemo(id: string, aan: boolean) {
  await vereisBeheerder();
  await wijzigKlant(id, (k) => { k.demo = aan || undefined; });
  ververs(id);
}

/* ── Acties en campagnes ─────────────────────────────────────────────────── */

const TYPES: CampagneType[] = ["seizoen", "combinatie", "persoonlijk", "klanten", "dakzorg", "capaciteit", "buurt"];

export async function bewaarCampagne(fd: FormData) {
  await vereisBeheerder();
  const titel = s(fd, "titel");
  if (!titel) return;
  const id = s(fd, "id") || nieuwId(6);
  const type = s(fd, "type") as CampagneType;
  const lijst = (v: string) => v.split(/[,\s]+/).map((x) => x.trim()).filter(Boolean);
  const fases = fd.getAll("fases").map(String).filter((f) => ["gepland", "bezig", "klaar", "nazorg"].includes(f)) as Actie["fases"];
  const i = await getInstellingen();
  const bestaand = (i.acties ?? []).find((a) => a.id === id);
  const c: Actie = {
    ...bestaand,
    id, titel,
    tekst: s(fd, "tekst"),
    type: TYPES.includes(type) ? type : "seizoen",
    extra: s(fd, "extra") || undefined,
    start: s(fd, "start") || undefined,
    geldigTot: s(fd, "geldigTot") || undefined,
    status: bestaand?.status ?? "concept",
    fases: fases?.length ? fases : undefined,
    postcodes: lijst(s(fd, "postcodes")).filter((p) => /^\d{4}$/.test(p)),
    werkdag: s(fd, "werkdag") || undefined,
    minInteresse: getal(fd, "minInteresse"),
    maxAanvragen: getal(fd, "maxAanvragen"),
    voorwaarden: s(fd, "voorwaarden") || undefined,
    combineerbaar: s(fd, "combineerbaar") === "ja",
    nagekeken: s(fd, "nagekeken") === "ja",
    opdrachtWaarde: getal(fd, "opdrachtWaarde"),
    kosten: getal(fd, "kosten"),
    verplaatsing: getal(fd, "verplaatsing"),
    korting: getal(fd, "korting"),
    andereKosten: getal(fd, "andereKosten"),
  };
  // Zonder controle kan een campagne niet actief staan
  if (!c.nagekeken && c.status === "actief") c.status = "gepauzeerd";
  i.acties = bestaand ? (i.acties ?? []).map((a) => (a.id === id ? c : a)) : [c, ...(i.acties ?? [])];
  await saveInstellingen(i);
  revalidatePath("/beheer/acties");
}

export async function zetCampagneStatus(id: string, status: "concept" | "actief" | "gepauzeerd") {
  await vereisBeheerder();
  const i = await getInstellingen();
  i.acties = (i.acties ?? []).map((a) => {
    if (a.id !== id) return a;
    if (status === "actief" && a.type && !a.nagekeken) return a; // eerst voorwaarden nakijken
    return { ...a, status };
  });
  await saveInstellingen(i);
  revalidatePath("/beheer/acties");
}

export async function bewaarRefRegels(fd: FormData) {
  await vereisBeheerder();
  const i = await getInstellingen();
  const heel = (k: string) => { const v = getal(fd, k); return v === undefined ? undefined : Math.max(0, Math.round(v)); };
  await saveInstellingen({
    ...i,
    refBeloning: heel("refBeloning"),
    refBeloningNaam: s(fd, "refBeloningNaam") || undefined,
    refKorting: heel("refKorting"),
    refMinOpdracht: heel("refMinOpdracht"),
    refMaxPerKlant: heel("refMaxPerKlant"),
    refGeldigMaanden: heel("refGeldigMaanden"),
    refStart: s(fd, "refStart") || undefined,
    refEind: s(fd, "refEind") || undefined,
    refDiensten: s(fd, "refDiensten") || undefined,
    refCombineerbaar: s(fd, "refCombineerbaar") === "ja",
    refVoorwaarden: s(fd, "refVoorwaarden") || undefined,
    burenVoordeel: s(fd, "burenVoordeel") || undefined,
    minMarge: heel("minMarge"),
  });
  revalidatePath("/beheer/doorverwijzingen");
  revalidatePath("/beheer/instellingen");
}

