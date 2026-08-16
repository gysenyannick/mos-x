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

export const SUBJECT_PLAATSBEZOEK = "Bevestiging: aanvraag gratis plaatsbezoek ontvangen";
export const SUBJECT_PLAATSBEZOEK_NA_RICHTPRIJS =
  "Bevestiging: aanvraag gratis plaatsbezoek ontvangen na richtprijs";
export const SUBJECT_RICHTPRIJS_KLANT = "Je richtprijs voor je dak | MOS-X";
export const SUBJECT_CONTACT_KLANT = "Bevestiging: we hebben je bericht ontvangen | MOS-X";

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

        ${CONTACT_BLOK}

        <div style="margin-top: 32px; padding: 14px 16px; background: #F7F8F6; border-radius: 8px; font-size: 12px; color: #999;">
          Dit is een automatische bevestiging van mos-x.be. Je hoeft hier niet op te antwoorden.
        </div>
      </div>
    `;
}

/** Bevestigingsmail naar de klant na een bericht via het contactformulier. */
export function contactKlantHtml(opts: { voornaam: string; dienst: string }): string {
  const voornaam = esc(opts.voornaam);
  const dienst = esc(opts.dienst);
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

        <div style="background: #F4FBF0; border-left: 4px solid #9BCB6C; padding: 16px 20px; margin-bottom: 28px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: 700; color: #1A5C36; font-size: 15px;">
            ✅ Je bericht is goed ontvangen!
          </p>
        </div>

        <h2 style="color: #1A1A1A; border-bottom: 3px solid #9BCB6C; padding-bottom: 12px; margin-top: 0;">
          Dag ${voornaam},
        </h2>

        <p style="font-size: 15px; color: #333; line-height: 1.75; margin-bottom: 20px;">
          We hebben je bericht goed ontvangen.<br>
          Yannick neemt zo snel mogelijk persoonlijk contact met je op.
        </p>

        <div style="background: #F7F8F6; border-radius: 10px; padding: 18px 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.08em;">Je vraag ging over</p>
          <p style="margin: 0; font-size: 17px; font-weight: 700; color: #1A1A1A;">${dienst}</p>
        </div>

        ${CONTACT_BLOK}
        ${FOOTER_AUTOMATISCH}
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
            <td style="padding: 7px 0; color: #888; width: 130px;">${label}</td>
            <td style="padding: 7px 0; font-weight: 600; color: #1A1A1A;">${esc(waarde)}</td>
          </tr>`;

  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

        <div style="background: #F4FBF0; border-left: 4px solid #9BCB6C; padding: 16px 20px; margin-bottom: 28px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: 700; color: #1A5C36; font-size: 15px;">
            ✅ Je richtprijs is berekend!
          </p>
        </div>

        <h2 style="color: #1A1A1A; border-bottom: 3px solid #9BCB6C; padding-bottom: 12px; margin-top: 0;">
          Dag ${voornaam},
        </h2>

        <p style="font-size: 15px; color: #333; line-height: 1.75; margin-bottom: 20px;">
          Bedankt om de richtprijscalculator van MOS-X te gebruiken.<br>
          Op basis van je antwoorden berekenden we onderstaande richtprijs voor je dak.
        </p>

        <div style="background: #F4FBF0; border: 2px solid rgba(155,203,108,0.4); border-radius: 12px; padding: 20px; margin-bottom: 22px; text-align: center;">
          <p style="margin: 0 0 6px; font-size: 13px; color: #666;">Jouw richtprijs</p>
          <p style="margin: 0; font-size: 28px; font-weight: 800; color: #1A1A1A; letter-spacing: -0.02em;">
            ${fmtPrice(opts.priceLow)} - ${fmtPrice(opts.priceHigh)}
          </p>
          <p style="margin: 6px 0 0; font-size: 12px; color: #888;">Geschatte richtprijs incl. btw</p>
        </div>

        <p style="margin: 0 0 8px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.08em;">Jouw gegevens</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          ${rij("Woningtype", opts.woning)}
          ${rij("Daktype", opts.dak)}
          ${rij("Oppervlakte", `${opts.opp} m²`)}
          ${rij("Behandeling", opts.behandeling)}
        </table>

        <div style="background: #FFF8E8; border-left: 4px solid #E8B84B; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 26px;">
          <p style="margin: 0; font-size: 14px; color: #6B5218; line-height: 1.65;">
            <strong>Let op:</strong> dit is een richtprijs, geen definitieve offerte.
            De exacte prijs bepaalt Yannick pas na een controle van je dak ter plaatse.
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${SITE}/contact"
             style="display: inline-block; background: #9BCB6C; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 10px;">
            Plan een gratis plaatsbezoek
          </a>
          <p style="margin: 10px 0 0; font-size: 13px; color: #888;">
            Vrijblijvend en zonder verplichtingen.
          </p>
        </div>

        ${CONTACT_BLOK}
        ${FOOTER_AUTOMATISCH}
      </div>
    `;
}
