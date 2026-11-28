"use client";

import { useState } from "react";
import Link from "next/link";
import { KAART_VIEWBOX, PROVINCIES } from "@/lib/belgie-kaart";

/** Welke provincie hoort bij een postcode (enkel ons werkgebied). */
function provincieVan(pc: number): string | null {
  if (pc >= 2000 && pc <= 2999) return "antwerpen";
  if (pc >= 3500 && pc <= 3999) return "limburg";
  if ((pc >= 1500 && pc <= 1999) || (pc >= 3000 && pc <= 3499)) return "vlaams-brabant";
  if (pc >= 9000 && pc <= 9999) return "oost-vlaanderen";
  return null;
}

/** "Komen we tot bij jou?": postcodecheck met een interactieve kaart van België. */
export default function WerkgebiedCheck() {
  const [postcode, setPostcode] = useState("");
  const [antwoord, setAntwoord] = useState<null | boolean>(null);
  const [gevonden, setGevonden] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  function check(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cijfers = postcode.replace(/\D/g, "");
    const prov = cijfers.length === 4 ? provincieVan(parseInt(cijfers, 10)) : null;
    setGevonden(prov);
    setAntwoord(prov !== null);
  }

  const actief = PROVINCIES.find((p) => p.naam === hover);
  const label = actief ? `${actief.naam}${actief.id ? " · in ons werkgebied" : " · bel ons eerst"}` : "Kies een provincie op de kaart";

  return (
    <section className="wg-sectie" aria-labelledby="wg-titel">
      <style>{`
        .wg-sectie { padding: 88px 20px; background: #F7F8F6; }
        .wg-wrap { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 64px; align-items: center; }
        .wg-titel { margin: 0; white-space: nowrap; font: 800 clamp(1.9rem, 3vw, 2.5rem)/1.1 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #1A1A1A; }
        .wg-titel span { color: #9BCB6C; }
        .wg-oog { margin: 0 0 12px; font: 700 12.5px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #9BCB6C; }
        .wg-tekst { margin: 14px 0 26px; max-width: 500px; text-wrap: pretty; font: 400 16.5px/1.65 var(--font-inter), system-ui, sans-serif; color: #545454; }
        .wg-pc { padding: 24px; border-radius: 14px; background: #0B0F0C; }
        .wg-pc label { display: block; margin-bottom: 14px; font: 700 17px var(--font-montserrat), system-ui, sans-serif; color: #FFFFFF; }
        .wg-pc-rij { display: flex; gap: 10px; }
        .wg-pc input { flex: 1; min-width: 0; height: 54px; padding: 0 16px; border-radius: 10px; border: 2px solid transparent; background: #FFFFFF; color: #1A1A1A; font: 400 16px var(--font-inter), system-ui, sans-serif; }
        .wg-pc input:focus { outline: none; border-color: #9BCB6C; }
        .wg-pc button { height: 54px; padding: 0 26px; border: 0; border-radius: 10px; cursor: pointer; background: #9BCB6C; color: #FFFFFF; font: 700 16px var(--font-montserrat), system-ui, sans-serif; transition: background-color .2s ease, transform .15s ease; }
        .wg-pc button:hover { background: #7AB54E; }
        .wg-pc button:active { transform: translateY(1px); }
        .wg-pc button:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 2px; }
        .wg-antwoord { margin: 14px 0 0; font: 500 15px/1.5 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.88); }
        .wg-antwoord a { color: #9BCB6C; font-weight: 700; }

        .wg-kaart { padding: 22px 22px 16px; border-radius: 18px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .wg-kaart svg { display: block; width: 100%; height: auto; }
        .wg-prov { cursor: pointer; transition: fill .2s ease; }
        .wg-onder { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 12px; padding-top: 12px; border-top: 1px solid #E5E7EB; }
        .wg-naam { font: 700 14px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; min-height: 18px; }
        .wg-legende { display: flex; gap: 16px; }
        .wg-legende span { display: flex; align-items: center; gap: 8px; font: 400 13px var(--font-inter), system-ui, sans-serif; color: #545454; }
        .wg-legende i { width: 14px; height: 14px; border-radius: 4px; }

        @media (max-width: 960px) {
          .wg-sectie { padding: 64px 16px; }
          .wg-wrap { grid-template-columns: minmax(0, 1fr); gap: 32px; }
        }
        @media (max-width: 620px) {
          .wg-titel { font-size: 8vw; }
          .wg-pc-rij { flex-direction: column; }
          .wg-pc input { flex: none; width: 100%; box-sizing: border-box; }
          .wg-pc button { width: 100%; }
          .wg-kaart { padding: 14px 14px 12px; }
        }
      `}</style>
      <div className="wg-wrap">
        <div>
          <p className="wg-oog">Werkgebied</p>
          <h2 id="wg-titel" className="wg-titel">Komen we <span>tot bij jou?</span></h2>
          <p className="wg-tekst">We werken in Antwerpen, Limburg, Vlaams‑Brabant en Oost‑Vlaanderen. Vul je postcode in en je krijgt meteen antwoord.</p>
          <form className="wg-pc" onSubmit={check}>
            <label htmlFor="wg-postcode">Vul je postcode in</label>
            <div className="wg-pc-rij">
              <input id="wg-postcode" inputMode="numeric" maxLength={4} placeholder="Bv. 2590" value={postcode} onChange={(e) => { setPostcode(e.target.value); setAntwoord(null); setGevonden(null); }} />
              <button type="submit">Check</button>
            </div>
            {antwoord === true && <p className="wg-antwoord" role="status">Goed nieuws: we komen tot bij jou. <Link href="/#calculator">Bereken je richtprijs</Link></p>}
            {antwoord === false && <p className="wg-antwoord" role="status">Daar werken we normaal niet, maar <a href="tel:+32468352869">bel ons gerust even</a>.</p>}
          </form>
        </div>

        <div className="wg-kaart">
          <svg viewBox={KAART_VIEWBOX} role="img" aria-label="Kaart van België met ons werkgebied: Antwerpen, Limburg, Vlaams-Brabant en Oost-Vlaanderen" onMouseLeave={() => setHover(null)}>
            {PROVINCIES.map((p) => {
              const ons = Boolean(p.id);
              const aan = hover === p.naam || (gevonden !== null && gevonden === p.id);
              const fill = ons ? (aan ? "#7AB54E" : "#9BCB6C") : (aan ? "#CFD2CB" : "#E2E4DF");
              return (
                <path key={p.naam} className="wg-prov" d={p.d} fill={fill} stroke="#FFFFFF" strokeWidth={2} strokeLinejoin="round"
                  onMouseEnter={() => setHover(p.naam)} onClick={() => setHover(p.naam)}>
                  <title>{p.naam}</title>
                </path>
              );
            })}
          </svg>
          <div className="wg-onder">
            <span className="wg-naam" aria-live="polite">{label}</span>
            <div className="wg-legende">
              <span><i style={{ background: "#9BCB6C" }} />Werkgebied</span>
              <span><i style={{ background: "#E2E4DF" }} />Bel ons eerst</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
