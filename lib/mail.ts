import { createHash } from "crypto";

/**
 * Gedeelde Resend-helpers voor alle mailflows.
 *
 * Uitgangspunten:
 * - De API-key wordt uitsluitend server-side gelezen (process.env), nooit naar de client.
 * - Interne leadmails naar info@mos-x.be zijn leidend: een falende klantmail mag
 *   die nooit blokkeren of ongedaan maken.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** Afzender voor interne leadmails naar Yannick. */
export const FROM_INTERN = "MOS-X Website <noreply@mos-x.be>";
/** Afzender voor mails naar de klant. */
export const FROM_KLANT = "MOS-X <noreply@mos-x.be>";

export const SUBJECT_PLAATSBEZOEK = "✅ Bevestiging: Aanvraag gratis plaatsbezoek";
export const SUBJECT_PLAATSBEZOEK_NA_RICHTPRIJS =
  "✅ Bevestiging: Aanvraag gratis plaatsbezoek na richtprijs";
export const SUBJECT_RICHTPRIJS_KLANT = "Je richtprijs voor je dak | MOS-X";
export const SUBJECT_CONTACT_KLANT = "✅ Bevestiging: We hebben je bericht ontvangen";

const TEL = "+32 468 35 28 69";
const TEL_HREF = "tel:+32468352869";
const WA_HREF = "https://wa.me/32468352869";
const SITE = "https://www.mos-x.be";

/** Voorkomt dat ingevulde formuliertekst de HTML van de mail kan breken. */
export function esc(v: string): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Prijsweergave identiek aan die op de website: "€ 3.300". */
export function fmtPrice(n: number | string): string {
  const num = typeof n === "number" ? n : parseInt(n, 10);
  return isNaN(num) ? String(n) : "€ " + num.toLocaleString("nl-BE");
}

/**
 * Idempotency-key voor Resend. De sleutel is stabiel binnen een venster van
 * 5 minuten, zodat dubbelklikken en snelle re-submits één mail opleveren,
 * maar een echte nieuwe aanvraag later op de dag gewoon doorgaat.
 */
export function idempotencyKey(...parts: (string | number)[]): string {
  const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
  return createHash("sha256").update([...parts, bucket].join("|")).digest("hex").slice(0, 40);
}

type SendResult = { ok: true } | { ok: false; error: string };

/** Eén verzendpad naar Resend, met optionele idempotency-key. */
export async function sendMail(
  apiKey: string,
  payload: Record<string, unknown>,
  idemKey?: string,
): Promise<SendResult> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  if (idemKey) headers["Idempotency-Key"] = idemKey;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: await res.text() };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

const FOOTER_AUTOMATISCH = `
  <div style="margin-top: 32px; padding: 14px 16px; background: #F7F8F6; border-radius: 8px; font-size: 12px; color: #999;">
    Dit is een automatische e-mail van mos-x.be. Je hoeft hier niet op te antwoorden.
  </div>`;

const CONTACT_BLOK = `
  <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 8px;">
    Heb je in de tussentijd nog vragen? Je kan Yannick altijd bereiken via:
  </p>
  <table style="font-size: 14px; color: #555; border-collapse: collapse;">
    <tr><td style="padding: 5px 12px 5px 0;">📞</td><td style="padding: 5px 0;"><a href="${TEL_HREF}" style="color: #1A5C36; font-weight: 600; text-decoration: none;">${TEL}</a></td></tr>
    <tr><td style="padding: 5px 12px 5px 0;">💬</td><td style="padding: 5px 0;"><a href="${WA_HREF}" style="color: #1A5C36; font-weight: 600; text-decoration: none;">WhatsApp Yannick</a></td></tr>
  </table>`;

/**
 * Bevestigingsmail naar de klant na een aanvraag gratis plaatsbezoek.
 * Eén gedeelde template voor zowel de gewone flow als de flow na de
 * richtprijscalculator — alleen het onderwerp verschilt.
 */
export function plaatsbezoekKlantHtml(opts: { voornaam: string; dienst: string }): string {
  const voornaam = esc(opts.voornaam);
  const dienst = esc(opts.dienst);
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #1A1A1A;">

      <!-- 1. HEADER -->
      <div style="background: #FFFFFF; padding: 28px 32px 20px; text-align: center; border-bottom: 3px solid #9BCB6C;">
        <img src="${SITE}/images/Logo%20Mos-x%20png.png" alt="MOS-X" width="160" style="display: inline-block; max-width: 160px; height: auto;" />
      </div>

      <!-- 2. HERO -->
      <div style="padding: 36px 32px 28px; text-align: center;">
        <div style="display: inline-block; background: #9BCB6C; border-radius: 50%; width: 54px; height: 54px; line-height: 54px; text-align: center; margin-bottom: 20px;">
          <span style="color: #FFFFFF; font-size: 26px; font-weight: 700; line-height: 54px;">&#10003;</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 800; color: #1A1A1A; margin: 0 0 18px; line-height: 1.35;">
          Je aanvraag is goed ontvangen
        </h1>
        <p style="font-size: 15px; font-weight: 700; color: #1A1A1A; margin: 0 0 10px;">Dag ${voornaam},</p>
        <p style="font-size: 15px; color: #545454; margin: 0; line-height: 1.7;">
          We hebben je aanvraag voor een gratis plaatsbezoek ontvangen.<br>
          Yannick neemt <strong style="color: #1A1A1A;">binnen 1 werkdag</strong> persoonlijk contact met je op.
        </p>
      </div>

      <!-- 3. JOUW AANVRAAG -->
      <div style="margin: 0 32px 28px; background: #F4FBF0; border: 1px solid #9BCB6C; border-radius: 16px; padding: 22px 24px; text-align: center;">
        <p style="margin: 0 0 6px; font-size: 12px; color: #7AB54E; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Jouw aanvraag</p>
        <p style="margin: 0; font-size: 17px; font-weight: 700; color: #1A1A1A;">Plaatsbezoek voor ${dienst}</p>
      </div>

      <!-- 4. WAT GEBEURT ER NU? -->
      <div style="margin: 0 32px 28px;">
        <p style="margin: 0 0 16px; font-size: 15px; font-weight: 700; color: #1A1A1A;">Wat gebeurt er nu?</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
          <tr>
            <td width="40" valign="top">
              <div style="background: #9BCB6C; color: #FFFFFF; border-radius: 50%; width: 28px; height: 28px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700;">1</div>
            </td>
            <td valign="top" style="padding-left: 12px;">
              <p style="margin: 0 0 3px; font-size: 14px; font-weight: 700; color: #1A1A1A;">Persoonlijk contact</p>
              <p style="margin: 0; font-size: 14px; color: #545454; line-height: 1.55;">Yannick neemt binnen 1 werkdag contact met je op.</p>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
          <tr>
            <td width="40" valign="top">
              <div style="background: #9BCB6C; color: #FFFFFF; border-radius: 50%; width: 28px; height: 28px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700;">2</div>
            </td>
            <td valign="top" style="padding-left: 12px;">
              <p style="margin: 0 0 3px; font-size: 14px; font-weight: 700; color: #1A1A1A;">We plannen het plaatsbezoek</p>
              <p style="margin: 0; font-size: 14px; color: #545454; line-height: 1.55;">Samen kiezen jullie een moment dat past.</p>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="40" valign="top">
              <div style="background: #9BCB6C; color: #FFFFFF; border-radius: 50%; width: 28px; height: 28px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700;">3</div>
            </td>
            <td valign="top" style="padding-left: 12px;">
              <p style="margin: 0 0 3px; font-size: 14px; font-weight: 700; color: #1A1A1A;">We bekijken je situatie ter plaatse</p>
              <p style="margin: 0; font-size: 14px; color: #545454; line-height: 1.55;">Zo kunnen we je gericht adviseren over de beste aanpak.</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- 5. CONTACTBLOK -->
      <div style="margin: 0 32px 28px; background: #F7F8F6; border-radius: 12px; padding: 20px 24px;">
        <p style="margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #1A1A1A;">Heb je ondertussen een vraag?</p>
        <p style="margin: 0 0 18px; font-size: 14px; color: #545454;">Je kunt Yannick rechtstreeks bereiken.</p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right: 12px;">
              <a href="${TEL_HREF}" style="display: inline-block; background: #9BCB6C; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 20px; border-radius: 8px;">${TEL}</a>
            </td>
            <td>
              <a href="${WA_HREF}" style="display: inline-block; background: #FFFFFF; color: #9BCB6C; border: 2px solid #9BCB6C; text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 20px; border-radius: 8px;">WhatsApp Yannick</a>
            </td>
          </tr>
        </table>
      </div>

      <!-- 6. FOOTER -->
      <div style="padding: 24px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
        <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #1A1A1A;">MOS-X</p>
        <p style="margin: 0 0 18px; font-size: 12px; color: #888;">Voor een proper, beschermd en verzorgd dak.</p>
        <p style="margin: 0; font-size: 11px; color: #AAA; line-height: 1.7;">
          Dit is een automatische bevestiging van je aanvraag via mos-x.be.<br>
          Je hoeft deze e-mail niet te beantwoorden.
        </p>
      </div>

    </div>
  `;
}

/** Bevestigingsmail naar de klant na een bericht via het contactformulier. */
export function contactKlantHtml(opts: { voornaam: string; dienst: string; bericht?: string }): string {
  const voornaam = esc(opts.voornaam);
  const dienst = esc(opts.dienst);
  const bericht = opts.bericht ? esc(opts.bericht).replace(/\n/g, "<br>") : "";
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #1A1A1A;">

      <!-- 1. HEADER -->
      <div style="background: #FFFFFF; padding: 28px 32px 20px; text-align: center; border-bottom: 3px solid #9BCB6C;">
        <img src="${SITE}/images/Logo%20Mos-x%20png.png" alt="MOS-X" width="160" style="display: inline-block; max-width: 160px; height: auto;" />
      </div>

      <!-- 2. HERO -->
      <div style="padding: 36px 32px 28px; text-align: center;">
        <div style="display: inline-block; background: #9BCB6C; border-radius: 50%; width: 54px; height: 54px; line-height: 54px; text-align: center; margin-bottom: 20px;">
          <span style="color: #FFFFFF; font-size: 26px; font-weight: 700; line-height: 54px;">&#10003;</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 800; color: #1A1A1A; margin: 0 0 18px; line-height: 1.35;">
          Je bericht is goed ontvangen
        </h1>
        <p style="font-size: 15px; font-weight: 700; color: #1A1A1A; margin: 0 0 10px;">Dag ${voornaam},</p>
        <p style="font-size: 15px; color: #545454; margin: 0; line-height: 1.7;">
          We hebben je bericht goed ontvangen.<br>
          Yannick beantwoordt je vraag <strong style="color: #1A1A1A;">binnen 1 werkdag</strong>.
        </p>
      </div>

      <!-- 3. JE VRAAG -->
      <div style="margin: 0 32px 28px; background: #F4FBF0; border: 1px solid #9BCB6C; border-radius: 16px; padding: 22px 24px; text-align: center;">
        <p style="margin: 0 0 6px; font-size: 12px; color: #7AB54E; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Onderwerp van je bericht</p>
        <p style="margin: 0; font-size: 17px; font-weight: 700; color: #1A1A1A;">${dienst}</p>
      </div>

      ${bericht ? `
      <!-- 3b. JOUW BERICHT -->
      <div style="margin: 0 32px 28px;">
        <p style="margin: 0 0 10px; font-size: 13px; font-weight: 700; color: #545454; text-transform: uppercase; letter-spacing: 0.06em;">Jouw bericht</p>
        <div style="background: #F7F8F6; border: 1px solid #E5E7EB; border-radius: 12px; padding: 18px 22px; font-size: 14px; color: #1A1A1A; line-height: 1.7; text-align: left;">
          ${bericht}
        </div>
      </div>
      ` : ""}

      <!-- 4. CONTACT -->
      <div style="margin: 0 32px 28px; background: #F7F8F6; border-radius: 12px; padding: 20px 24px;">
        <p style="margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #1A1A1A;">Heb je ondertussen een vraag?</p>
        <p style="margin: 0 0 18px; font-size: 14px; color: #545454;">Je kunt Yannick rechtstreeks bereiken.</p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right: 12px;">
              <a href="${TEL_HREF}" style="display: inline-block; background: #9BCB6C; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 20px; border-radius: 8px;">${TEL}</a>
            </td>
            <td>
              <a href="${WA_HREF}" style="display: inline-block; background: #FFFFFF; color: #9BCB6C; border: 2px solid #9BCB6C; text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 20px; border-radius: 8px;">WhatsApp Yannick</a>
            </td>
          </tr>
        </table>
      </div>

      <!-- 5. FOOTER -->
      <div style="padding: 24px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
        <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #1A1A1A;">MOS-X</p>
        <p style="margin: 0 0 18px; font-size: 12px; color: #888;">Voor een proper, beschermd en verzorgd dak.</p>
        <p style="margin: 0; font-size: 11px; color: #AAA; line-height: 1.7;">
          Dit is een automatische bevestiging van mos-x.be.<br>
          Je hoeft deze e-mail niet te beantwoorden.
        </p>
      </div>

    </div>
  `;
}

/** Mail naar de klant met de berekende richtprijs. */
export function richtprijsKlantHtml(opts: {
  voornaam: string;
  woning: string;
  dak: string;
  opp: string;
  behandeling: string;
  priceLow: string;
  priceHigh: string;
}): string {
  const voornaam = esc(opts.voornaam);
  const rij = (label: string, waarde: string) => `
          <tr>
            <td style="padding: 7px 0; color: #888; width: 130px; font-size: 14px;">${label}</td>
            <td style="padding: 7px 0; font-weight: 600; color: #1A1A1A; font-size: 14px;">${esc(waarde)}</td>
          </tr>`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #1A1A1A;">

      <!-- 1. HEADER -->
      <div style="background: #FFFFFF; padding: 28px 32px 20px; text-align: center; border-bottom: 3px solid #9BCB6C;">
        <img src="${SITE}/images/Logo%20Mos-x%20png.png" alt="MOS-X" width="160" style="display: inline-block; max-width: 160px; height: auto;" />
      </div>

      <!-- 2. HERO -->
      <div style="padding: 36px 32px 28px; text-align: center;">
        <div style="display: inline-block; background: #9BCB6C; border-radius: 50%; width: 54px; height: 54px; line-height: 54px; text-align: center; margin-bottom: 20px;">
          <span style="color: #FFFFFF; font-size: 26px; font-weight: 700; line-height: 54px;">&#10003;</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 800; color: #1A1A1A; margin: 0 0 18px; line-height: 1.35;">
          Je richtprijs is berekend
        </h1>
        <p style="font-size: 15px; font-weight: 700; color: #1A1A1A; margin: 0 0 10px;">Dag ${voornaam},</p>
        <p style="font-size: 15px; color: #545454; margin: 0; line-height: 1.7;">
          Bedankt om de richtprijscalculator van MOS-X te gebruiken.<br>
          Op basis van je gegevens hebben we onderstaande richtprijs voor je dak berekend.
        </p>
      </div>

      <!-- 3. RICHTPRIJS CARD -->
      <div style="margin: 0 32px 28px; background: #F4FBF0; border: 1px solid #9BCB6C; border-radius: 16px; padding: 24px; text-align: center;">
        <p style="margin: 0 0 8px; font-size: 12px; color: #7AB54E; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Jouw richtprijs</p>
        <p style="margin: 0 0 6px; font-size: 28px; font-weight: 800; color: #1A1A1A; letter-spacing: -0.02em;">
          ${fmtPrice(opts.priceLow)} - ${fmtPrice(opts.priceHigh)}
        </p>
        <p style="margin: 0; font-size: 12px; color: #888;">Geschatte richtprijs incl. btw</p>
      </div>

      <!-- 4. JOUW GEGEVENS -->
      <div style="margin: 0 32px 28px;">
        <p style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #1A1A1A;">Jouw gegevens</p>
        <table style="width: 100%; border-collapse: collapse;">
          ${rij("Woningtype", opts.woning)}
          ${rij("Daktype", opts.dak)}
          ${rij("Oppervlakte", `${opts.opp} m²`)}
          ${rij("Behandeling", opts.behandeling)}
        </table>
      </div>

      <!-- 5. DISCLAIMER -->
      <div style="margin: 0 32px 28px; background: #F7F8F6; border: 1px solid #E5E7EB; border-radius: 12px; padding: 18px 22px;">
        <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; color: #9BCB6C; text-transform: uppercase; letter-spacing: 0.08em;">Goed om te weten</p>
        <p style="margin: 0; font-size: 14px; color: #545454; line-height: 1.65;">
          Dit is een richtprijs, geen definitieve offerte. De exacte prijs bepaalt Yannick na een controle van je dak ter plaatse.
        </p>
      </div>

      <!-- 6. CTA -->
      <div style="text-align: center; margin: 0 32px 28px;">
        <a href="${SITE}/contact"
           style="display: inline-block; background: #9BCB6C; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 8px;">
          Plan een gratis plaatsbezoek
        </a>
        <p style="margin: 10px 0 0; font-size: 13px; color: #888;">
          Vrijblijvend en zonder verplichtingen.
        </p>
      </div>

      <!-- 7. CONTACT -->
      <div style="margin: 0 32px 28px; background: #F7F8F6; border-radius: 12px; padding: 20px 24px;">
        <p style="margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #1A1A1A;">Heb je ondertussen een vraag?</p>
        <p style="margin: 0 0 18px; font-size: 14px; color: #545454;">Je kunt Yannick rechtstreeks bereiken.</p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right: 12px;">
              <a href="${TEL_HREF}" style="display: inline-block; background: #9BCB6C; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 20px; border-radius: 8px;">${TEL}</a>
            </td>
            <td>
              <a href="${WA_HREF}" style="display: inline-block; background: #FFFFFF; color: #9BCB6C; border: 2px solid #9BCB6C; text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 20px; border-radius: 8px;">WhatsApp Yannick</a>
            </td>
          </tr>
        </table>
      </div>

      <!-- 8. FOOTER -->
      <div style="padding: 24px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
        <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #1A1A1A;">MOS-X</p>
        <p style="margin: 0 0 18px; font-size: 12px; color: #888;">Voor een proper, beschermd en verzorgd dak.</p>
        <p style="margin: 0; font-size: 11px; color: #AAA; line-height: 1.7;">
          Dit is een automatische e-mail van mos-x.be.<br>
          Je hoeft deze e-mail niet te beantwoorden.
        </p>
      </div>

    </div>
  `;
}
