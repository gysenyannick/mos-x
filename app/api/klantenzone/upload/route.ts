import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { bewaarBestand, getKlant, nieuwId, verwijderBestand, wijzigKlant } from "@/lib/klantenzone/store";
import type { DocStatus, DocType, FotoFase } from "@/lib/klantenzone/types";

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
        k.fotos.unshift({
          id: nieuwId(6), url, fase, datum: nu,
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
    } else if (soort === "document") {
      if (!beheerder) return fout("Niet toegestaan.", 403);
      if (file.type !== "application/pdf" && !file.type.startsWith("image/")) return fout("Enkel pdf of afbeelding.");
      const type = String(fd.get("type") || "andere") as DocType;
      const bedragRuw = String(fd.get("bedrag") ?? "").replace(",", ".").trim();
      const url = await bewaarBestand(`${klantId}/documenten`, naam, file);
      const titel = String(fd.get("titel") ?? "").trim() || naam.replace(/\.[a-z0-9]+$/i, "");
      await wijzigKlant(klantId, (k) => {
        k.documenten.unshift({
          id: nieuwId(6), url, type, titel,
          bedrag: bedragRuw ? Number(bedragRuw) : undefined,
          status: String(fd.get("status") || (type === "offerte" ? "info" : "open")) as DocStatus,
          datum: String(fd.get("datum") || nu.slice(0, 10)),
        });
        const zin: Record<DocType, string> = {
          offerte: "Je offerte staat klaar.",
          voorschot: "Je voorschotfactuur staat klaar.",
          factuur: "Je factuur staat klaar.",
          andere: `Nieuw document: ${titel}.`,
        };
        k.log.unshift({ datum: nu, tekst: zin[type] ?? zin.andere });
      });
    } else {
      return fout("Onbekend soort upload.");
    }

    revalidatePath(`/klant/${klantId}`);
    revalidatePath(`/beheer/${klantId}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("klantenzone upload", e);
    return fout(e instanceof Error ? e.message : "Upload mislukt.", 500);
  }
}

function fout(bericht: string, status = 400) {
  return NextResponse.json({ ok: false, fout: bericht }, { status });
}
