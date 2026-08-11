import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EXTRA_LABELS: Record<string, string> = {
  coating: "Ja, met dakcoating (10 jaar garantie)",
  geen: "Nee, alleen dakreiniging",
  advies: "Ik twijfel nog — advies gewenst",
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

        <div style="background: #F4FBF0; border-left: 4px solid #9BCB6C; padding: 16px 20px; margin-bottom: 28px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: 700; color: #1A5C36; font-size: 15px;">
            ✅ Deze klant heeft na het ontvangen van zijn richtprijs expliciet een gratis plaatsbezoek aangevraagd.
          </p>
        </div>

        <h2 style="color: #1A1A1A; border-bottom: 3px solid #9BCB6C; padding-bottom: 12px; margin-top: 0;">
          Nieuwe aanvraag gratis plaatsbezoek via richtprijscalculator
        </h2>

        <h3 style="color: #555; margin-top: 24px;">Contactgegevens</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #888; width: 140px;">Naam</td><td style="padding: 6px 0; font-weight: 600;">${voornaam} ${achternaam}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">E-mail</td><td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Telefoon</td><td style="padding: 6px 0;"><a href="tel:${tel}">${tel}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Adres</td><td style="padding: 6px 0;">${adres || "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Postcode</td><td style="padding: 6px 0;">${postcode}</td></tr>
        </table>

        <h3 style="color: #555; margin-top: 24px;">Dakinformatie</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #888; width: 140px;">Woningtype</td><td style="padding: 6px 0; font-weight: 600;">${woning}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Daktype</td><td style="padding: 6px 0;">${dak}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Oppervlakte</td><td style="padding: 6px 0;">${opp} m²</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Behandeling</td><td style="padding: 6px 0;">${EXTRA_LABELS[extra] ?? extra}</td></tr>
        </table>

        <div style="background: #F4FBF0; border: 2px solid rgba(155,203,108,0.4); border-radius: 10px; padding: 16px 20px; margin-top: 24px; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #666;">Berekende richtprijs</p>
          <p style="margin: 0; font-size: 24px; font-weight: 800; color: #1A1A1A;">${fmtPrice(priceLow)} - ${fmtPrice(priceHigh)}</p>
          <p style="margin: 4px 0 0; font-size: 12px; color: #888;">Geschatte richtprijs incl. btw</p>
        </div>

        ${attachments.length > 0
          ? `<p style="margin-top: 24px; color: #555;">📷 ${attachments.length} foto${attachments.length > 1 ? "'s" : ""} bijgevoegd als bijlage</p>`
          : ""
        }

        <div style="margin-top: 32px; padding: 16px; background: #F7F8F6; border-radius: 8px; font-size: 13px; color: #888;">
          Aanvraag gratis plaatsbezoek ontvangen via mos-x.be
        </div>
      </div>
    `;

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL ?? "joppedeboeck@gmail.com";

    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — email not sent");
      return NextResponse.json({ ok: true, warn: "no_api_key" });
    }

    const body: Record<string, unknown> = {
      from: "MOS-X Website <noreply@mos-x.be>",
      to: [toEmail],
      reply_to: email,
      subject: `Gratis plaatsbezoek — ${voornaam} ${achternaam} (${postcode})`,
      html,
    };

    if (attachments.length > 0) {
      body.attachments = attachments;
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "send_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Plaatsbezoek API error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
