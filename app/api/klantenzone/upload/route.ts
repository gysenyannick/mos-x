import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { bewaarBestand, getKlant, nieuwId, verwijderBestand, wijzigKlant } from "@/lib/klantenzone/store";
import { meldKlant } from "@/lib/klantenzone/meldingen";
import { DOC_IS_FACTUUR, DOC_LOG_ZIN, type DocStatus, type DocType, type FotoFase } from "@/lib/klantenzone/types";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel laat max. ~4,5 MB per verzoek toe
const MAX_KLANT_FOTOS = 30;

/**
 * Foto of document toevoegen aan een dossier.
 * - Yannick (ingelogd in /beheer): foto's en documenten.
 * - De klant zelf: enkel foto's, en enkel bij zijn eigen dossier (zijn link is zijn sleutel).
 */
export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const klantId = String(fd.get("klantId") ?? "");
    const soort = String(fd.get("soort") ?? "");
    const file = fd.get("bestand");

    if (!(file instanceof Blob) || file.size === 0) return fout("Geen bestand ontvangen.");
    if (file.size > MAX_BYTES) return fout("Bestand is te groot (max. 4 MB).");

    const bestaand = await getKlant(klantId);
    if (!bestaand) return fout("Dossier niet gevonden.", 404);

    const beheerder = await isBeheerder();
    const naam = file instanceof File ? file.name : "bestand";
    const nu = new Date().toISOString();

    if (soort === "foto") {
      if (!file.type.startsWith("image/")) return fout("Dit is geen foto.");
      const fase = (beheerder ? String(fd.get("fase") || "tijdens") : "klant") as FotoFase;
      const url = await bewaarBestand(`${klantId}/fotos`, naam, file);
      const r = await wijzigKlant(klantId, (k) => {
        if (!beheerder && k.fotos.filter((f) => f.fase === "klant").length >= MAX_KLANT_FOTOS) return false;
        const dag = String(fd.get("datum") ?? "");
        const fotoDatum = beheerder && /^\d{4}-\d{2}-\d{2}$/.test(dag) && dag !== nu.slice(0, 10) ? `${dag}T12:00:00.000Z` : nu;
        k.fotos.unshift({
          id: nieuwId(6), url, fase, datum: fotoDatum,
          bijschrift: String(fd.get("bijschrift") ?? "").trim().slice(0, 140) || undefined,
        });
        if (beheerder) {
          const alVandaag = k.log[0]?.tekst.startsWith("Nieuwe werffoto") && k.log[0].datum.slice(0, 10) === nu.slice(0, 10);
          if (!alVandaag) k.log.unshift({ datum: nu, tekst: "Nieuwe werffoto's toegevoegd." });
        }
        return true;
      });
      if (!r?.resultaat) {
        await verwijderBestand(url);
        return fout("Je hebt het maximum aantal foto's bereikt.");
      }
    } else if (soort === "aanvraagfoto") {
      if (!file.type.startsWith("image/")) return fout("Dit is geen foto.");
      const aanvraagId = String(fd.get("aanvraagId") ?? "");
      const url = await bewaarBestand(`${klantId}/aanvragen`, naam, file);
      const r = await wijzigKlant(klantId, (k) => {
        const a = (k.aanvragen ?? []).find((x) => x.id === aanvraagId);
        if (!a || (a.fotos ?? []).length >= 5) return false;
        (a.fotos ??= []).push(url);
        return true;
      });
      if (!r?.resultaat) { await verwijderBestand(url); return fout("Aanvraag niet gevonden of al 5 foto's."); }
    } else if (soort === "aanbevelingfoto") {
      if (!beheerder) return fout("Niet toegestaan.", 403);
      if (!file.type.startsWith("image/")) return fout("Dit is geen foto.");
      const abId = String(fd.get("aanbevelingId") ?? "");
      const url = await bewaarBestand(`${klantId}/aanbevelingen`, naam, file);
      const r = await wijzigKlant(klantId, (k) => {
        const a = (k.aanbevelingen ?? []).find((x) => x.id === abId);
        if (!a || (a.fotoUrls ?? []).length >= 6) return false;
        (a.fotoUrls ??= []).push(url);
        return true;
      });
      if (!r?.resultaat) { await verwijderBestand(url); return fout("Aanbeveling niet gevonden of al 6 foto's."); }
    } else if (soort === "document") {
      if (!beheerder) return fout("Niet toegestaan.", 403);
      if (file.type !== "application/pdf" && !file.type.startsWith("image/")) return fout("Enkel pdf of afbeelding.");
      const typeRuw = String(fd.get("type") || "andere");
      const type = (typeRuw in DOC_LOG_ZIN ? typeRuw : "andere") as DocType;
      const bedragRuw = String(fd.get("bedrag") ?? "").replace(",", ".").trim();
      const url = await bewaarBestand(`${klantId}/documenten`, naam, file);
      const titel = String(fd.get("titel") ?? "").trim() || naam.replace(/\.[a-z0-9]+$/i, "");
      await wijzigKlant(klantId, (k) => {
        k.documenten.unshift({
          id: nieuwId(6), url, type, titel,
          bedrag: bedragRuw ? Number(bedragRuw) : undefined,
          status: String(fd.get("status") || (DOC_IS_FACTUUR(type) ? "open" : "info")) as DocStatus,
          datum: String(fd.get("datum") || nu.slice(0, 10)),
        });
        k.log.unshift({ datum: nu, tekst: DOC_LOG_ZIN[type] ?? DOC_LOG_ZIN.andere });
      });
    } else {
      return fout("Onbekend soort upload.");
    }

    revalidatePath(`/klant/${klantId}`);
    revalidatePath(`/beheer/${klantId}`);

    if (beheerder && (soort === "foto" || soort === "document")) {
      const k = await getKlant(klantId);
      if (k) {
        const type = String(fd.get("type") || "andere");
        await meldKlant(k, soort === "foto"
          ? { soort: "fotos", sleutel: `fotos-${nu.slice(0, 10)}`, onderwerp: "Nieuwe foto's van je dak", tekst: "Er staan nieuwe foto's van je dak in je klantenzone.", knop: { label: "Bekijk het fotoverslag", tab: "werken" } }
          : type === "garantie"
            ? { soort: "garantie", sleutel: `garantie-${nu.slice(0, 10)}`, onderwerp: "Je garantiebewijs staat klaar", tekst: "Je garantiebewijs staat in je dakdossier. Bewaar het goed.", knop: { label: "Bekijk je dakdossier", tab: "dossier" } }
            : { soort: "document", sleutel: `doc-${type}-${nu.slice(0, 10)}`, onderwerp: "Een nieuw document in je klantenzone", tekst: "Er staat een nieuw document voor je klaar in je dakdossier.", knop: { label: "Bekijk je documenten", tab: "dossier" } },
        ).catch(() => undefined);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("klantenzone upload", e);
    return fout(e instanceof Error ? e.message : "Upload mislukt.", 500);
  }
}

function fout(bericht: string, status = 400) {
  return NextResponse.json({ ok: false, fout: bericht }, { status });
}
