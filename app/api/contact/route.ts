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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #1A1A1A;">

        <!-- HEADER -->
        <div style="background: #FFFFFF; padding: 24px 32px 20px; text-align: center; border-bottom: 3px solid #9BCB6C;">
          <img src="https://www.mos-x.be/images/Logo%20Mos-x%20png.png" alt="MOS-X" width="140" style="display: inline-block; max-width: 140px; height: auto;" />
        </div>

        <!-- CONTEXT -->
        <div style="padding: 18px 32px 14px; text-align: center; background: #F4FBF0; border-bottom: 1px solid #E5E7EB;">
          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #9BCB6C; text-transform: uppercase; letter-spacing: 0.10em;">NIEUWE AANVRAAG · CONTACT</p>
          <p style="margin: 0; font-size: 13px; color: #545454;">Via contactformulier</p>
        </div>

        <!-- NAAM -->
        <div style="padding: 28px 32px 0;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #1A1A1A; letter-spacing: -0.02em;">${esc(naam)}</h1>
        </div>

        <!-- INTERESSE CARD -->
        <div style="margin: 20px 32px 0; background: #F4FBF0; border: 1px solid #9BCB6C; border-radius: 14px; padding: 18px 22px;">
          <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #9BCB6C; text-transform: uppercase; letter-spacing: 0.08em;">INTERESSE</p>
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1A1A1A;">${esc(dienst)}</p>
        </div>

        <!-- CONTACTGEGEVENS -->
        <div style="padding: 24px 32px 0;">
          <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; color: #545454; text-transform: uppercase; letter-spacing: 0.06em;">Contactgegevens</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; width: 110px; vertical-align: top;">Naam</td>
              <td style="padding: 7px 0; font-size: 14px; font-weight: 600; color: #1A1A1A;">${esc(naam)}</td>
            </tr>
            ${telefoon ? `
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">Telefoon</td>
              <td style="padding: 7px 0;"><a href="tel:${esc(telefoon)}" style="font-size: 15px; font-weight: 700; color: #1A1A1A; text-decoration: none;">${esc(telefoon)}</a></td>
            </tr>
            ` : ""}
            ${email ? `
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">E-mail</td>
              <td style="padding: 7px 0;"><a href="mailto:${esc(email)}" style="font-size: 14px; color: #1A1A1A; text-decoration: none;">${esc(email)}</a></td>
            </tr>
            ` : ""}
            ${(postcode || adres) ? `
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">Locatie</td>
              <td style="padding: 7px 0; font-size: 14px; color: #1A1A1A;">${[esc(postcode), esc(adres)].filter(Boolean).join(", ")}</td>
            </tr>
            ` : ""}
          </table>
        </div>

        ${bericht ? `
        <!-- BERICHT -->
        <div style="padding: 24px 32px 0;">
          <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; color: #545454; text-transform: uppercase; letter-spacing: 0.06em;">Bericht van de klant</p>
          <div style="background: #F7F8F6; border-radius: 10px; padding: 16px 20px; font-size: 14px; color: #1A1A1A; line-height: 1.65;">
            ${esc(bericht).replace(/\n/g, "<br>")}
          </div>
        </div>
        ` : ""}

        <!-- FOOTER -->
        <div style="margin-top: 32px; padding: 24px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 14px; font-weight: 800; color: #1A1A1A;">MOS-X</p>
          <p style="margin: 0; font-size: 12px; color: #545454;">Voor een proper, beschermd en verzorgd dak.</p>
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
          html: contactKlantHtml({ voornaam, dienst, bericht }),
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
