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

    // Collect photo attachments (base64 for Resend)
    const attachments: { filename: string; content: string }[] = [];
    for (let i = 0; i < 3; i++) {
      const file = data.get(`foto_${i}`) as File | null;
      if (file && file.size > 0) {
        const buf = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name,
          content: buf.toString("base64"),
        });
      }
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A1A1A; border-bottom: 3px solid #9BCB6C; padding-bottom: 12px;">
          Nieuwe richtprijsaanvraag via mos-x.be
        </h2>

        <h3 style="color: #555; margin-top: 24px;">Contactgegevens</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #888; width: 140px;">Naam</td><td style="padding: 6px 0; font-weight: 600;">${voornaam} ${achternaam}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">E-mail</td><td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Telefoon</td><td style="padding: 6px 0;"><a href="tel:${tel}">${tel}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Postcode</td><td style="padding: 6px 0;">${postcode}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Adres</td><td style="padding: 6px 0;">${adres || "—"}</td></tr>
        </table>

        <h3 style="color: #555; margin-top: 24px;">Dakinformatie</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #888; width: 140px;">Woningtype</td><td style="padding: 6px 0; font-weight: 600;">${woning}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Daktype</td><td style="padding: 6px 0;">${dak}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Oppervlakte</td><td style="padding: 6px 0;">${opp} m²</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Extra optie</td><td style="padding: 6px 0;">${EXTRA_LABELS[extra] ?? extra}</td></tr>
        </table>

        ${attachments.length > 0
          ? `<p style="margin-top: 24px; color: #555;">📷 ${attachments.length} foto${attachments.length > 1 ? "\'s" : ""} bijgevoegd</p>`
          : ""
        }

        <div style="margin-top: 32px; padding: 16px; background: #F7F8F6; border-radius: 8px; font-size: 13px; color: #888;">
          Aanvraag ontvangen via mos-x.be
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
      from: "MOS-X Website <noreply@mos-x.be>",
      to: [toEmail],
      reply_to: email,
      subject: `Richtprijsaanvraag — ${voornaam} ${achternaam} (${postcode})`,
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
    console.error("Richtprijs API error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
