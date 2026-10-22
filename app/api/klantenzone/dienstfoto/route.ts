import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { bewaarBestand, getInstellingen, saveInstellingen, verwijderBestand } from "@/lib/klantenzone/store";
import { EXTRAS } from "@/lib/klantenzone/types";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;
const GELDIG = new Set(["onderhoud", ...EXTRAS.map((x) => x.id)]);

/** Yannick kiest een eigen foto voor een dienst, of zet de standaardfoto terug (wis=1). */
export async function POST(req: NextRequest) {
  if (!(await isBeheerder())) return NextResponse.json({ ok: false, fout: "Niet toegestaan." }, { status: 403 });
  try {
    const fd = await req.formData();
    const dienst = String(fd.get("dienst") ?? "");
    if (!GELDIG.has(dienst)) return NextResponse.json({ ok: false, fout: "Kies een dienst." }, { status: 400 });

    const i = await getInstellingen();
    const fotos = { ...(i.dienstFotos ?? {}) };
    const oud = fotos[dienst];

    if (fd.get("wis") === "1") {
      delete fotos[dienst];
    } else {
      const foto = fd.get("foto");
      if (!(foto instanceof Blob) || foto.size === 0) return NextResponse.json({ ok: false, fout: "Kies een foto." }, { status: 400 });
      if (!foto.type.startsWith("image/")) return NextResponse.json({ ok: false, fout: "Dit is geen afbeelding." }, { status: 400 });
      if (foto.size > MAX_BYTES) return NextResponse.json({ ok: false, fout: "Foto is te groot (max. 4 MB)." }, { status: 400 });
      fotos[dienst] = await bewaarBestand("diensten", foto instanceof File ? foto.name : "foto.jpg", foto);
    }

    await saveInstellingen({ ...i, dienstFotos: fotos });
    if (oud && oud !== fotos[dienst]) await verwijderBestand(oud);
    revalidatePath("/beheer/instellingen");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("klantenzone dienstfoto", e);
    return NextResponse.json({ ok: false, fout: e instanceof Error ? e.message : "Opslaan mislukt." }, { status: 500 });
  }
}
