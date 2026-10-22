import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { bewaarBestand, getInstellingen, nieuwId, saveInstellingen } from "@/lib/klantenzone/store";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;

/** Yannick voegt een tip toe voor alle klanten, met optioneel een foto en een document (pdf). */
export async function POST(req: NextRequest) {
  if (!(await isBeheerder())) return NextResponse.json({ ok: false, fout: "Niet toegestaan." }, { status: 403 });
  try {
    const fd = await req.formData();
    const titel = String(fd.get("titel") ?? "").trim().slice(0, 140);
    const tekst = String(fd.get("tekst") ?? "").trim().slice(0, 4000);
    if (!titel || !tekst) return NextResponse.json({ ok: false, fout: "Vul een titel en een tekst in." }, { status: 400 });

    const foto = fd.get("foto");
    const bestand = fd.get("bestand");
    let fotoUrl: string | undefined;
    let bestandUrl: string | undefined;
    let bestandNaam: string | undefined;

    if (foto instanceof Blob && foto.size > 0) {
      if (!foto.type.startsWith("image/")) return NextResponse.json({ ok: false, fout: "De foto is geen afbeelding." }, { status: 400 });
      if (foto.size > MAX_BYTES) return NextResponse.json({ ok: false, fout: "Foto is te groot (max. 4 MB)." }, { status: 400 });
      fotoUrl = await bewaarBestand("tips", foto instanceof File ? foto.name : "foto.jpg", foto);
    }
    if (bestand instanceof Blob && bestand.size > 0) {
      if (bestand.type !== "application/pdf" && !bestand.type.startsWith("image/")) return NextResponse.json({ ok: false, fout: "Enkel pdf of afbeelding." }, { status: 400 });
      if (bestand.size > MAX_BYTES) return NextResponse.json({ ok: false, fout: "Document is te groot (max. 4 MB)." }, { status: 400 });
      bestandNaam = String(fd.get("bestandNaam") ?? "").trim().slice(0, 80) || undefined;
      bestandUrl = await bewaarBestand("tips", bestand instanceof File ? bestand.name : "document.pdf", bestand);
    }

    const i = await getInstellingen();
    i.tips = [{
      id: nieuwId(6), datum: new Date().toISOString(), titel, tekst,
      onderwerp: String(fd.get("onderwerp") ?? "").trim().slice(0, 40) || undefined,
      fotoUrl, bestandUrl, bestandNaam,
    }, ...(i.tips ?? [])];
    await saveInstellingen(i);
    revalidatePath("/beheer/instellingen");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("klantenzone tip", e);
    return NextResponse.json({ ok: false, fout: e instanceof Error ? e.message : "Opslaan mislukt." }, { status: 500 });
  }
}
