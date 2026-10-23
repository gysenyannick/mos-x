import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { FROM_INTERN, esc, sendMail } from "@/lib/mail";
import { bewaarBestand, getKlant, nieuwId, wijzigKlant } from "@/lib/klantenzone/store";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = ["Stormschade", "Lek of vocht binnen", "Verschoven of gebroken pannen", "Losse nok of rand", "Dakgoot", "Iets anders"];

/** De klant meldt stormschade of een probleem, met foto's. Dit is een aanvraag, geen garantie op onmiddellijke interventie. */
export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const klantId = String(fd.get("klantId") ?? "");
    const type = String(fd.get("type") ?? "");
    const tekst = String(fd.get("tekst") ?? "").trim().slice(0, 2000);
    const telefoon = String(fd.get("telefoon") ?? "").trim().slice(0, 40);
    if (!TYPES.includes(type)) return fout("Kies wat er aan de hand is.");
    if (tekst.length < 3) return fout("Beschrijf kort wat je ziet.");
    const k0 = await getKlant(klantId);
    if (!k0) return fout("Dossier niet gevonden.", 404);
    // Rem op misbruik: maximaal 5 meldingen per dag
    const vandaag = new Date().toISOString().slice(0, 10);
    if ((k0.stormMeldingen ?? []).filter((m) => m.datum.slice(0, 10) === vandaag).length >= 5) return fout("Je stuurde vandaag al meldingen. Bel bij spoed.");

    const fotos: string[] = [];
    for (const f of fd.getAll("fotos").slice(0, 5)) {
      if (!(f instanceof Blob) || f.size === 0) continue;
      if (!f.type.startsWith("image/") || f.size > MAX_BYTES) return fout("Enkel foto's tot 4 MB.");
      fotos.push(await bewaarBestand(`${klantId}/meldingen`, f instanceof File ? f.name : "foto.jpg", f));
    }

    const nu = new Date().toISOString();
    const r = await wijzigKlant(klantId, (k) => {
      (k.stormMeldingen ??= []).unshift({ id: nieuwId(6), datum: nu, type, tekst, fotos, status: "nieuw" });
      if (telefoon && telefoon !== k.telefoon) k.log.unshift({ datum: nu, tekst: `Terugbelnummer bij melding: ${telefoon}` });
      k.log.unshift({ datum: nu, tekst: `Je meldde: ${type.toLowerCase()}. Yannick neemt contact op.` });
    });
    if (!r) return fout("Dossier niet gevonden.", 404);

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const k = r.klant;
      const basis = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mos-x.be";
      await sendMail(apiKey, {
        from: FROM_INTERN,
        to: [process.env.CONTACT_EMAIL ?? "info@mos-x.be"],
        subject: `⚠️ Melding van ${k.voornaam}: ${type}`,
        html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5">
          <p><strong>${esc(type)}</strong></p><p style="white-space:pre-line">${esc(tekst)}</p>
          <p>${esc(`${k.voornaam} ${k.achternaam}`)}<br/>${esc(k.adres)}<br/>Bel: ${esc(telefoon || k.telefoon)}</p>
          ${fotos.map((u) => `<p><a href="${u.startsWith("http") ? u : basis + u}">Foto</a></p>`).join("")}
          <p><a href="${basis}/beheer/${encodeURIComponent(k.id)}">Open dossier</a></p></div>`,
      });
    }
    revalidatePath(`/klant/${klantId}`);
    revalidatePath(`/beheer/${klantId}`);
    revalidatePath("/beheer");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("klantenzone storm", e instanceof Error ? e.message : "onbekend");
    return fout("Versturen mislukt. Bel bij spoed.", 500);
  }
}

function fout(tekst: string, status = 400) {
  return NextResponse.json({ ok: false, fout: tekst }, { status });
}
