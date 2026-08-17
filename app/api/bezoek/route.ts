import { NextRequest, NextResponse } from "next/server";
import {
  FROM_INTERN,
  FROM_KLANT,
  SUBJECT_PLAATSBEZOEK,
  idempotencyKey,
  plaatsbezoekKlantHtml,
  sendMail,
} from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const voornaam = (data.get("voornaam") as string) ?? "";
    const naam     = (data.get("naam")     as string) ?? "";
    const email    = (data.get("email")    as string) ?? "";
    const tel      = (data.get("tel")      as string) ?? "";
    const postcode = (data.get("postcode") as string) ?? "";
    const gemeente = (data.get("gemeente") as string) ?? "";
    const dienst   = (data.get("dienst")   as string) ?? "";
    const bericht  = (data.get("bericht")  as string) ?? "";
    const bron     = (data.get("bron")     as string) ?? "Website";

    const apiKey  = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL ?? "info@mos-x.be";

    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — email not sent");
      return NextResponse.json({ ok: true, warn: "no_api_key" });
    }

    // ── E-mail naar Yannick ──────────────────────────────────────────────────
    const yannickHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #1A1A1A;">

        <!-- HEADER -->
        <div style="background: #FFFFFF; padding: 24px 32px 20px; text-align: center; border-bottom: 3px solid #9BCB6C;">
          <img src="https://www.mos-x.be/images/Logo%20Mos-x%20png.png" alt="MOS-X" width="140" style="display: inline-block; max-width: 140px; height: auto;" />
        </div>

        <!-- CONTEXT -->
        <div style="padding: 18px 32px 14px; text-align: center; background: #F4FBF0; border-bottom: 1px solid #E5E7EB;">
          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #9BCB6C; text-transform: uppercase; letter-spacing: 0.10em;">NIEUWE AANVRAAG · GRATIS PLAATSBEZOEK</p>
          <p style="margin: 0; font-size: 13px; color: #545454;">Via ${bron}</p>
        </div>

        <!-- NAAM -->
        <div style="padding: 28px 32px 0;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #1A1A1A; letter-spacing: -0.02em;">${voornaam} ${naam}</h1>
        </div>

        <!-- AANVRAAG CARD -->
        <div style="margin: 20px 32px 0; background: #F4FBF0; border: 1px solid #9BCB6C; border-radius: 14px; padding: 18px 22px;">
          <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #9BCB6C; text-transform: uppercase; letter-spacing: 0.08em;">AANVRAAG</p>
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1A1A1A;">Plaatsbezoek voor ${dienst}</p>
        </div>

        <!-- CONTACTGEGEVENS -->
        <div style="padding: 24px 32px 0;">
          <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; color: #545454; text-transform: uppercase; letter-spacing: 0.06em;">Contactgegevens</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; width: 110px; vertical-align: top;">Naam</td>
              <td style="padding: 7px 0; font-size: 14px; font-weight: 600; color: #1A1A1A;">${voornaam} ${naam}</td>
            </tr>
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">Telefoon</td>
              <td style="padding: 7px 0;"><a href="tel:${tel}" style="font-size: 15px; font-weight: 700; color: #9BCB6C; text-decoration: none;">${tel}</a></td>
            </tr>
            ${email ? `
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">E-mail</td>
              <td style="padding: 7px 0;"><a href="mailto:${email}" style="font-size: 14px; color: #1A5C36; text-decoration: none;">${email}</a></td>
            </tr>
            ` : ""}
            ${(postcode || gemeente) ? `
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">Locatie</td>
              <td style="padding: 7px 0; font-size: 14px; color: #1A1A1A;">${[postcode, gemeente].filter(Boolean).join(" ")}</td>
            </tr>
            ` : ""}
          </table>
        </div>

        ${bericht ? `
        <!-- BERICHT -->
        <div style="padding: 24px 32px 0;">
          <p style="margin: 0 0 10px; font-size: 11px; font-weight: 700; color: #545454; text-transform: uppercase; letter-spacing: 0.06em;">Bericht van de klant</p>
          <div style="background: #F7F8F6; border-radius: 10px; padding: 14px 16px; font-size: 14px; color: #1A1A1A; line-height: 1.65;">
            ${bericht.replace(/\n/g, "<br>")}
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

    // Bevestigingsmail naar klant — gedeelde template (zie lib/mail.ts)
    const klantHtml = plaatsbezoekKlantHtml({ voornaam, dienst });

    // Stuur e-mail naar Yannick
    const yannick = await sendMail(
      apiKey,
      {
        from: FROM_INTERN,
        to: [toEmail],
        reply_to: email || undefined,
        subject: `🏠 Gratis plaatsbezoek | ${voornaam} ${naam} | ${dienst}`,
        html: yannickHtml,
      },
      idempotencyKey("bezoek-intern", email || tel, dienst, postcode, bericht),
    );

    if (!yannick.ok) {
      console.error("Resend error (Yannick):", yannick.error);
      return NextResponse.json({ error: "send_failed" }, { status: 500 });
    }

    // Stuur bevestigingsmail naar klant (enkel als e-mailadres opgegeven)
    let klantMail = false;
    if (email) {
      const klant = await sendMail(
        apiKey,
        {
          from: FROM_KLANT,
          to: [email],
          subject: SUBJECT_PLAATSBEZOEK,
          html: klantHtml,
        },
        idempotencyKey("bezoek-klant", email, dienst, postcode, bericht),
      );
      klantMail = klant.ok;
      if (!klant.ok) {
        console.warn("Resend warning (klant bevestiging):", klant.error);
      }
    }

    return NextResponse.json({ ok: true, klantMail });
  } catch (err) {
    console.error("Bezoek API error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
