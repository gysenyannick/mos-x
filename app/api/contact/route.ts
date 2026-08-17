import { NextRequest, NextResponse } from "next/server";
import {
  FROM_INTERN,
  FROM_KLANT,
  SUBJECT_CONTACT_KLANT,
  contactKlantHtml,
  esc,
  idempotencyKey,
  sendMail,
} from "@/lib/mail";

export const runtime = "nodejs";

/** Leesbare labels voor de waarden uit de dienst-dropdown op /contact. */
const DIENST_LABELS: Record<string, string> = {
  dakreiniging: "Dakreiniging",
  dakcoating: "Dakcoating",
  dakabonnement: "MOS-X Dakzorg",
  "weet-niet": "Andere",
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const voornaam   = (data.get("voornaam")   as string) ?? "";
    const achternaam = (data.get("achternaam") as string) ?? "";
    const naam = [voornaam, achternaam].filter(Boolean).join(" ");
    const email    = (data.get("email")    as string) ?? "";
    const telefoon = (data.get("telefoon") as string) ?? "";
    const postcode = (data.get("postcode") as string) ?? "";
    const adres    = (data.get("adres")    as string) ?? "";
    const dienstRaw = (data.get("dienst")  as string) ?? "";
    const bericht  = (data.get("bericht")  as string) ?? "";

    const dienst = DIENST_LABELS[dienstRaw] ?? dienstRaw;

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL ?? "info@mos-x.be";

    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — email not sent");
      return NextResponse.json({ ok: true, warn: "no_api_key" });
    }

    // ── Interne leadmail naar Yannick ────────────────────────────────────────
    const yannickHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

        <div style="background: #F4FBF0; border-left: 4px solid #9BCB6C; padding: 16px 20px; margin-bottom: 28px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: 700; color: #1A5C36; font-size: 15px;">
            ✉️ Nieuwe contactaanvraag via het contactformulier op mos-x.be
          </p>
        </div>

        <h2 style="color: #1A1A1A; border-bottom: 3px solid #9BCB6C; padding-bottom: 12px; margin-top: 0;">
          Contactaanvraag — ${esc(naam)}
        </h2>

        <div style="background: rgba(155,203,108,0.10); border: 2px solid #9BCB6C; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.08em;">Interesse in</p>
          <p style="margin: 0; font-size: 22px; font-weight: 800; color: #1A1A1A;">${esc(dienst)}</p>
        </div>

        <h3 style="color: #555; margin-top: 0;">Contactgegevens</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 7px 0; color: #888; width: 130px;">Naam</td><td style="padding: 7px 0; font-weight: 600;">${esc(naam)}</td></tr>
          <tr><td style="padding: 7px 0; color: #888;">E-mail</td><td style="padding: 7px 0;"><a href="mailto:${esc(email)}" style="color: #1A5C36;">${esc(email)}</a></td></tr>
          <tr><td style="padding: 7px 0; color: #888;">Telefoon</td><td style="padding: 7px 0;"><a href="tel:${esc(telefoon)}" style="font-weight: 700; color: #1A5C36; text-decoration: none;">${esc(telefoon)}</a></td></tr>
          <tr><td style="padding: 7px 0; color: #888;">Postcode</td><td style="padding: 7px 0;">${esc(postcode) || "—"}</td></tr>
          ${adres ? `<tr><td style="padding: 7px 0; color: #888;">Adres</td><td style="padding: 7px 0;">${esc(adres)}</td></tr>` : ""}
        </table>

        ${bericht ? `
        <h3 style="color: #555; margin-top: 24px;">Bericht van de klant</h3>
        <div style="background: #F7F8F6; border-radius: 8px; padding: 14px 16px; font-size: 14px; color: #333; line-height: 1.65; border-left: 3px solid #E5E7EB;">
          ${esc(bericht).replace(/\n/g, "<br>")}
        </div>
        ` : ""}

        <div style="margin-top: 32px; padding: 14px 16px; background: #F7F8F6; border-radius: 8px; font-size: 12px; color: #999;">
          Contactaanvraag ontvangen via het contactformulier op mos-x.be
        </div>
      </div>
    `;

    // De interne lead gaat altijd eerst en bepaalt als enige of de route slaagt.
    const intern = await sendMail(
      apiKey,
      {
        from: FROM_INTERN,
        to: [toEmail],
        reply_to: email || undefined,
        subject: `✉️ Contactaanvraag | ${naam} | ${dienst}`,
        html: yannickHtml,
      },
      idempotencyKey("contact-intern", email || telefoon, dienstRaw, postcode, bericht),
    );

    if (!intern.ok) {
      console.error("Resend error (contact intern):", intern.error);
      return NextResponse.json({ error: "send_failed" }, { status: 500 });
    }

    // ── Bevestiging naar de klant ────────────────────────────────────────────
    // Eigen foutafhandeling: faalt deze, dan is de lead al veilig binnen en
    // mag de aanvraag niet als mislukt gelden.
    let klantMail = false;
    if (email) {
      const klant = await sendMail(
        apiKey,
        {
          from: FROM_KLANT,
          to: [email],
          subject: SUBJECT_CONTACT_KLANT,
          html: contactKlantHtml({ voornaam, dienst }),
        },
        idempotencyKey("contact-klant", email, dienstRaw, postcode, bericht),
      );
      klantMail = klant.ok;
      if (!klant.ok) {
        console.warn("Resend warning (contact klantbevestiging):", klant.error);
      }
    }

    return NextResponse.json({ ok: true, klantMail });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
