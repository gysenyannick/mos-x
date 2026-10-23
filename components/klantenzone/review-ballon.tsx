"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import kz from "./kz.module.css";

const DICHT = "kzReviewDicht";
const TELLER = "kzReviewTel";
/** Na zoveel paginawissels komt de ballon terug, ook als hij weggeklikt werd. */
const OPNIEUW_NA = 3;

/** Het Google-logo, zodat meteen duidelijk is waar de review komt. */
function GoogleG({ wit = false }: { wit?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true" style={{ flex: "none" }}>
      {wit ? (
        <path fill="#fff" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      ) : (
        <>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </>
      )}
    </svg>
  );
}

/**
 * Een tekstballon van Yannick rechtsonder, op elke pagina. Dichtgeklapt blijft zijn foto staan,
 * en na een paar paginawissels komt de ballon terug: reviews zijn belangrijk.
 */
export default function ReviewBallon({ klantId, voornaam, foto }: { klantId: string; voornaam: string; foto: string }) {
  const [open, setOpen] = useState(false);
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    let dicht = false;
    let tel = 0;
    try {
      dicht = sessionStorage.getItem(DICHT) === "1";
      tel = Number(sessionStorage.getItem(TELLER) || 0) + 1;
      sessionStorage.setItem(TELLER, String(tel));
    } catch { /* geen opslag */ }
    const terug = dicht && tel >= OPNIEUW_NA;
    const t = setTimeout(() => {
      setZichtbaar(true);
      setOpen(!dicht || terug);
      if (terug) try { sessionStorage.removeItem(DICHT); } catch { /* geen opslag */ }
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const sluit = () => {
    setOpen(false);
    try { sessionStorage.setItem(DICHT, "1"); sessionStorage.setItem(TELLER, "0"); } catch { /* geen opslag */ }
  };

  if (!zichtbaar) return null;

  return (
    <div className={kz.ballonPlek}>
      {open && (
        <div className={kz.ballon} role="dialog" aria-label="Review voor MOS-X">
          <button type="button" className={kz.ballonSluit} onClick={sluit} aria-label="Sluiten"><X size={16} /></button>
          <span className={kz.ballonGoogle}>
            <GoogleG />
            <span>Review op Google</span>
            <span className={kz.ballonSterren} aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} />)}</span>
          </span>
          <p className={kz.ballonTitel}>Tevreden over je dak, {voornaam}?</p>
          <p className={kz.ballonTekst}>Laat een review achter op Google. Het duurt maar een minuutje en helpt Yannick enorm.</p>
          <a className={`${kz.knop} ${kz.knopPrimair} ${kz.ballonKnop}`} href={`/api/klantenzone/review?k=${encodeURIComponent(klantId)}`} target="_blank" rel="noopener noreferrer" onClick={sluit}>
            <GoogleG wit /> Schrijf je review op Google
          </a>
          <button type="button" className={kz.ballonNooit} onClick={sluit}>Later</button>
        </div>
      )}
      <button type="button" className={kz.ballonFoto} onClick={() => (open ? sluit() : setOpen(true))} aria-label={open ? "Ballon sluiten" : "Review schrijven"} aria-expanded={open}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={foto} alt="" />
        {!open && <span className={kz.ballonBadge}><Star size={11} /></span>}
      </button>
    </div>
  );
}
