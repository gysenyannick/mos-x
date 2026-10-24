"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { vraagLinkAan } from "@/app/klant/actions";

/** Formulier op mos-x.be/klant: je persoonlijke link opnieuw per mail. */
export default function LinkAanvraag() {
  const [staat, actie, bezig] = useActionState(vraagLinkAan, null);

  if (staat?.klaar) {
    return (
      <div className="kz-link-ok" role="status">
        <p style={{ margin: 0, fontWeight: 700, color: "#1A1A1A" }}>Bekijk je mailbox</p>
        <p style={{ margin: "6px 0 0", color: "#545454", fontSize: 15, lineHeight: 1.6 }}>
          Als dit adres bij ons bekend is, krijg je zo een mail met je persoonlijke link. Niets gekregen? Kijk even bij je spam of stuur Yannick een berichtje.
        </p>
      </div>
    );
  }

  return (
    <form action={actie} className="kz-link-form">
      <label htmlFor="kz-email" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Je e-mailadres</label>
      <div className="kz-link-rij">
        <input id="kz-email" name="email" type="email" required autoComplete="email" placeholder="naam@voorbeeld.be" className="kz-link-invoer" />
        <button className="kz-link-knop" disabled={bezig}><Mail size={16} /> {bezig ? "Versturen…" : "Stuur mijn link"}</button>
      </div>
      {staat && !staat.klaar && <p style={{ margin: "8px 0 0", color: "#B4442B", fontSize: 14 }}>Vul een geldig e-mailadres in.</p>}
    </form>
  );
}
