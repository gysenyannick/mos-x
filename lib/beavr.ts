/**
 * Elke aanvraag van de website ook naar Beavr sturen (aanvragen, pipeline en opvolging).
 *
 * Het adres staat als geheime instelling bij Vercel: BEAVR_INTAKE_URL
 * (Beavr → Instellingen → Koppelingen → "Je eigen calculator of formulier").
 * Staat het er niet, dan gebeurt er niets. Lukt het niet, dan merkt de bezoeker
 * niets: de mail naar MOS-X vertrekt altijd gewoon.
 */
export type BeavrLead = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  service?: string;
  min?: string | number;
  max?: string | number;
  vat?: number;
  answers?: Record<string, string>;
  page?: string;
};

export async function sendToBeavr(lead: BeavrLead): Promise<void> {
  const url = process.env.BEAVR_INTAKE_URL;
  if (!url) return;
  // Lege antwoorden niet meesturen
  const answers = Object.fromEntries(
    Object.entries(lead.answers ?? {}).filter(([, v]) => v && String(v).trim()),
  );
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://www.mos-x.be" },
      body: JSON.stringify({ ...lead, answers }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.warn("Beavr: aanvraag niet aanvaard", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.warn("Beavr: aanvraag niet verstuurd", err);
  }
}
