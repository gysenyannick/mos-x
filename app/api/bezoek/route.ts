import { NextRequest, NextResponse } from "next/server";

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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

        <div style="background: #F4FBF0; border-left: 4px solid #9BCB6C; padding: 16px 20px; margin-bottom: 28px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: 700; color: #1A5C36; font-size: 15px;">
            🏠 Aanvraag gratis plaatsbezoek via ${bron}
          </p>
        </div>

        <h2 style="color: #1A1A1A; border-bottom: 3px solid #9BCB6C; padding-bottom: 12px; margin-top: 0;">
          Gratis plaatsbezoek — ${voornaam} ${naam}
        </h2>

        <div style="background: rgba(155,203,108,0.10); border: 2px solid #9BCB6C; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.08em;">Aangevraagde dienst(en)</p>
          <p style="margin: 0; font-size: 22px; font-weight: 800; color: #1A1A1A;">${dienst}</p>
        </div>

        <h3 style="color: #555; margin-top: 0;">Contactgegevens</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 7px 0; color: #888; width: 120px;">Naam</td><td style="padding: 7px 0; font-weight: 600;">${voornaam} ${naam}</td></tr>
          <tr><td style="padding: 7px 0; color: #888;">Telefoon</td><td style="padding: 7px 0;"><a href="tel:${tel}" style="font-weight: 700; color: #1A5C36; text-decoration: none;">${tel}</a></td></tr>
          ${email ? `<tr><td style="padding: 7px 0; color: #888;">E-mail</td><td style="padding: 7px 0;"><a href="mailto:${email}" style="color: #1A5C36;">${email}</a></td></tr>` : ""}
          <tr><td style="padding: 7px 0; color: #888;">Gemeente</td><td style="padding: 7px 0;">${postcode ? postcode + " " : ""}${gemeente || "—"}</td></tr>
        </table>

        ${bericht ? `
        <h3 style="color: #555; margin-top: 24px;">Bericht van de klant</h3>
        <div style="background: #F7F8F6; border-radius: 8px; padding: 14px 16px; font-size: 14px; color: #333; line-height: 1.65; border-left: 3px solid #E5E7EB;">
          ${bericht.replace(/\n/g, "<br>")}
        </div>
        ` : ""}

        <div style="margin-top: 32px; padding: 14px 16px; background: #F7F8F6; border-radius: 8px; font-size: 12px; color: #999;">
          Aanvraag gratis plaatsbezoek ontvangen via ${bron} — mos-x.be
        </div>
      </div>
    `;

    // ── Bevestigingsmail naar klant ──────────────────────────────────────────
    const klantHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

        <div style="background: #F4FBF0; border-left: 4px solid #9BCB6C; padding: 16px 20px; margin-bottom: 28px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: 700; color: #1A5C36; font-size: 15px;">
            ✅ Je aanvraag is goed ontvangen!
          </p>
        </div>

        <h2 style="color: #1A1A1A; border-bottom: 3px solid #9BCB6C; padding-bottom: 12px; margin-top: 0;">
          Dag ${voornaam},
        </h2>

        <p style="font-size: 15px; color: #333; line-height: 1.75; margin-bottom: 20px;">
          We hebben je aanvraag voor een gratis plaatsbezoek goed ontvangen.<br>
          Yannick neemt <strong>binnen 1 werkdag</strong> persoonlijk contact met je op om een afspraak in te plannen.
        </p>

        <div style="background: #F7F8F6; border-radius: 10px; padding: 18px 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.08em;">Aangevraagde dienst(en)</p>
          <p style="margin: 0; font-size: 17px; font-weight: 700; color: #1A1A1A;">${dienst}</p>
        </div>

        <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 8px;">
          Heb je in de tussentijd nog vragen? Je kan Yannick altijd bereiken via:
        </p>
        <table style="font-size: 14px; color: #555; border-collapse: collapse;">
          <tr><td style="padding: 5px 12px 5px 0;">📞</td><td style="padding: 5px 0;"><a href="tel:+32468352869" style="color: #1A5C36; font-weight: 600; text-decoration: none;">+32 468 35 28 69</a></td></tr>
          <tr><td style="padding: 5px 12px 5px 0;">💬</td><td style="padding: 5px 0;"><a href="https://wa.me/32468352869" style="color: #1A5C36; font-weight: 600; text-decoration: none;">WhatsApp Yannick</a></td></tr>
        </table>

        <div style="margin-top: 32px; padding: 14px 16px; background: #F7F8F6; border-radius: 8px; font-size: 12px; color: #999;">
          Dit is een automatische bevestiging van mos-x.be. Je hoeft hier niet op te antwoorden.
        </div>
      </div>
    `;

    // Stuur e-mail naar Yannick
    const yannickRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "MOS-X Website <noreply@mos-x.be>",
        to: [toEmail],
        reply_to: email || undefined,
        subject: `🏠 Gratis plaatsbezoek — ${voornaam} ${naam} · ${dienst}`,
        html: yannickHtml,
      }),
    });

    if (!yannickRes.ok) {
      const err = await yannickRes.text();
      console.error("Resend error (Yannick):", err);
      return NextResponse.json({ error: "send_failed" }, { status: 500 });
    }

    // Stuur bevestigingsmail naar klant (enkel als e-mailadres opgegeven)
    if (email) {
      const klantRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "MOS-X <noreply@mos-x.be>",
          to: [email],
          subject: "Bevestiging: aanvraag gratis plaatsbezoek ontvangen",
          html: klantHtml,
        }),
      });
      if (!klantRes.ok) {
        console.warn("Resend warning (klant bevestiging):", await klantRes.text());
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Bezoek API error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
