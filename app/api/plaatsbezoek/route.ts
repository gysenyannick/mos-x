import { NextRequest, NextResponse } from "next/server";
import {
  FROM_INTERN,
  FROM_KLANT,
  SUBJECT_PLAATSBEZOEK_NA_RICHTPRIJS,
  idempotencyKey,
  plaatsbezoekKlantHtml,
  sendMail,
} from "@/lib/mail";

export const runtime = "nodejs";

const EXTRA_LABELS: Record<string, string> = {
  coating: "Dakcoating",
  geen:    "Dakreiniging",
  advies:  "Advies gewenst",
};

// Zinsvorm voor de AANVRAAG-card ("Plaatsbezoek voor …")
const EXTRA_DIENST: Record<string, string> = {
  coating: "Dakcoating",
  geen:    "Dakreiniging",
  advies:  "advies over de behandeling",
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const voornaam  = (data.get("voornaam")  as string) ?? "";
    const achternaam = (data.get("achternaam") as string) ?? "";
    const email     = (data.get("email")     as string) ?? "";
    const tel       = (data.get("tel")       as string) ?? "";
    const postcode  = (data.get("postcode")  as string) ?? "";
    const adres     = (data.get("adres")     as string) ?? "";
    const woning    = (data.get("woning")    as string) ?? "";
    const dak       = (data.get("dak")       as string) ?? "";
    const opp       = (data.get("opp")       as string) ?? "";
    const extra     = (data.get("extra")     as string) ?? "";
    const priceLow  = (data.get("priceLow")  as string) ?? "";
    const priceHigh = (data.get("priceHigh") as string) ?? "";

    const attachments: { filename: string; content: string }[] = [];
    for (let i = 0; i < 3; i++) {
      const file = data.get(`foto_${i}`) as File | null;
      if (file && file.size > 0) {
        const buf = Buffer.from(await file.arrayBuffer());
        attachments.push({ filename: file.name, content: buf.toString("base64") });
      }
    }

    const fmtPrice = (n: string) => {
      const num = parseInt(n, 10);
      return isNaN(num) ? n : "€ " + num.toLocaleString("nl-BE");
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #1A1A1A;">

        <!-- HEADER -->
        <div style="background: #FFFFFF; padding: 24px 32px 20px; text-align: center; border-bottom: 3px solid #9BCB6C;">
          <img src="https://www.mos-x.be/images/Logo%20Mos-x%20png.png" alt="MOS-X" width="140" style="display: inline-block; max-width: 140px; height: auto;" />
        </div>

        <!-- CONTEXT -->
        <div style="padding: 18px 32px 14px; text-align: center; background: #F4FBF0; border-bottom: 1px solid #E5E7EB;">
          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #9BCB6C; text-transform: uppercase; letter-spacing: 0.10em;">NIEUWE AANVRAAG · GRATIS PLAATSBEZOEK NA RICHTPRIJS</p>
          <p style="margin: 0; font-size: 13px; color: #545454;">Via richtprijscalculator</p>
        </div>

        <!-- NAAM -->
        <div style="padding: 28px 32px 0;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #1A1A1A; letter-spacing: -0.02em;">${voornaam} ${achternaam}</h1>
        </div>

        <!-- AANVRAAG CARD -->
        <div style="margin: 20px 32px 0; background: #F4FBF0; border: 1px solid #9BCB6C; border-radius: 14px; padding: 18px 22px;">
          <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #9BCB6C; text-transform: uppercase; letter-spacing: 0.08em;">AANVRAAG</p>
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1A1A1A;">Plaatsbezoek voor ${EXTRA_DIENST[extra] ?? EXTRA_LABELS[extra] ?? extra}</p>
        </div>

        <!-- CONTACTGEGEVENS -->
        <div style="padding: 24px 32px 0;">
          <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; color: #545454; text-transform: uppercase; letter-spacing: 0.06em;">Contactgegevens</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; width: 110px; vertical-align: top;">Naam</td>
              <td style="padding: 7px 0; font-size: 14px; font-weight: 600; color: #1A1A1A;">${voornaam} ${achternaam}</td>
            </tr>
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">Telefoon</td>
              <td style="padding: 7px 0;"><a href="tel:${tel}" style="font-size: 15px; font-weight: 700; color: #1A1A1A; text-decoration: none;">${tel}</a></td>
            </tr>
            ${email ? `
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">E-mail</td>
              <td style="padding: 7px 0;"><a href="mailto:${email}" style="font-size: 14px; color: #1A1A1A; text-decoration: none;">${email}</a></td>
            </tr>
            ` : ""}
            ${(postcode || adres) ? `
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">Locatie</td>
              <td style="padding: 7px 0; font-size: 14px; color: #1A1A1A;">${[postcode, adres].filter(Boolean).join(", ")}</td>
            </tr>
            ` : ""}
          </table>
        </div>

        <!-- DAKINFORMATIE -->
        <div style="padding: 24px 32px 0;">
          <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; color: #545454; text-transform: uppercase; letter-spacing: 0.06em;">Dakinformatie</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; width: 110px; vertical-align: top;">Woningtype</td>
              <td style="padding: 7px 0; font-size: 14px; font-weight: 600; color: #1A1A1A;">${woning}</td>
            </tr>
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">Daktype</td>
              <td style="padding: 7px 0; font-size: 14px; color: #1A1A1A;">${dak}</td>
            </tr>
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">Oppervlakte</td>
              <td style="padding: 7px 0; font-size: 14px; color: #1A1A1A;">${opp} m²</td>
            </tr>
            <tr>
              <td style="padding: 7px 0; color: #888; font-size: 13px; vertical-align: top;">Behandeling</td>
              <td style="padding: 7px 0; font-size: 14px; color: #1A1A1A;">${EXTRA_LABELS[extra] ?? extra}</td>
            </tr>
          </table>
        </div>

        <!-- BEREKENDE RICHTPRIJS CARD -->
        <div style="margin: 24px 32px 0; background: #F4FBF0; border: 1px solid #9BCB6C; border-radius: 14px; padding: 18px 22px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; color: #9BCB6C; text-transform: uppercase; letter-spacing: 0.08em;">BEREKENDE RICHTPRIJS</p>
          <p style="margin: 0 0 6px; font-size: 26px; font-weight: 800; color: #1A1A1A; letter-spacing: -0.02em;">${fmtPrice(priceLow)} - ${fmtPrice(priceHigh)}</p>
          <p style="margin: 0; font-size: 12px; color: #545454;">Geschatte richtprijs incl. btw</p>
        </div>

        ${attachments.length > 0 ? `
        <!-- FOTO'S -->
        <div style="padding: 24px 32px 0;">
          <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #545454; text-transform: uppercase; letter-spacing: 0.06em;">Foto's bijgevoegd</p>
          <p style="margin: 0; font-size: 14px; color: #1A1A1A;">${attachments.length} foto${attachments.length > 1 ? "'s" : ""} meegestuurd met deze aanvraag.</p>
        </div>
        ` : ""}

        <!-- FOOTER -->
        <div style="margin-top: 32px; padding: 24px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 14px; font-weight: 800; color: #1A1A1A;">MOS-X</p>
          <p style="margin: 0; font-size: 12px; color: #545454;">Voor een proper, beschermd en verzorgd dak.</p>
        </div>

      </div>
    `;

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL ?? "info@mos-x.be";

    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — email not sent");
      return NextResponse.json({ ok: true, warn: "no_api_key" });
    }

    const body: Record<string, unknown> = {
      from: FROM_INTERN,
      to: [toEmail],
      reply_to: email,
      subject: `🏠 Gratis plaatsbezoek na richtprijs | ${voornaam} ${achternaam} | ${postcode}`,
      html,
    };

    if (attachments.length > 0) {
      body.attachments = attachments;
    }

    // ── 1. Interne lead naar info@mos-x.be — dit is de kritieke mail ──────────
    const intern = await sendMail(
      apiKey,
      body,
      idempotencyKey("plaatsbezoek-intern", email, opp, extra, priceLow, priceHigh),
    );

    if (!intern.ok) {
      console.error("Resend error (plaatsbezoek intern):", intern.error);
      return NextResponse.json({ error: "send_failed" }, { status: 500 });
    }

    // ── 2. Bevestiging naar de klant ──────────────────────────────────────────
    // Zelfde template als bij een gewoon plaatsbezoek; enkel het onderwerp
    // verschilt omdat de aanvraag uit de richtprijscalculator komt.
    let klantMail = false;
    if (email) {
      const klant = await sendMail(
        apiKey,
        {
          from: FROM_KLANT,
          to: [email],
          subject: SUBJECT_PLAATSBEZOEK_NA_RICHTPRIJS,
          html: plaatsbezoekKlantHtml({
            voornaam,
            dienst: EXTRA_DIENST[extra] ?? EXTRA_LABELS[extra] ?? extra,
          }),
        },
        idempotencyKey("plaatsbezoek-klant", email, opp, extra, priceLow, priceHigh),
      );
      klantMail = klant.ok;
      if (!klant.ok) {
        console.warn("Resend warning (plaatsbezoek klantbevestiging):", klant.error);
      }
    }

    return NextResponse.json({ ok: true, klantMail });
  } catch (err) {
    console.error("Plaatsbezoek API error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
