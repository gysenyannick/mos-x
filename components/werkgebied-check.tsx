"use client";

import { useState } from "react";
import Link from "next/link";
import { WERKGEBIED_VIEWBOX, PROVINCIES, STEDEN } from "@/lib/belgie-kaart";

const REGIO = [
  { naam: "Antwerpen", pc: "2000–2999" },
  { naam: "Limburg", pc: "3500–3999" },
  { naam: "Vlaams-Brabant", pc: "1500–1999 · 3000–3499" },
  { naam: "Oost-Vlaanderen", pc: "9000–9999" },
];

/** Postcodes van de provincies waar we werken. */
function inWerkgebied(pc: number) {
  return (pc >= 1500 && pc <= 3999) || (pc >= 9000 && pc <= 9999);
}

/** "Komen we tot bij jou?": postcodecheck met kaart van België. */
export default function WerkgebiedCheck() {
  const [postcode, setPostcode] = useState("");
  const [antwoord, setAntwoord] = useState<null | boolean>(null);

  function check(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cijfers = postcode.replace(/\D/g, "");
    setAntwoord(cijfers.length === 4 ? inWerkgebied(parseInt(cijfers, 10)) : false);
  }

  return (
    <section className="wg-sectie" aria-labelledby="wg-titel">
      <style>{`
        .wg-sectie { padding: 96px 20px; background: #FFFFFF; }
        .wg-wrap { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr); gap: 56px; align-items: start; }
        .wg-titel { margin: 0; font: 800 clamp(1.9rem, 3.4vw, 2.6rem)/1.1 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #1A1A1A; }
        .wg-titel span { position: relative; z-index: 0; white-space: nowrap; }
        .wg-titel span::after { content: ""; position: absolute; z-index: -1; left: -4px; right: -4px; bottom: 2px; height: 42%; background: #9BCB6C; opacity: 0.55; border-radius: 3px; }
        .wg-tekst { margin: 14px 0 26px; font: 400 16.5px/1.65 var(--font-inter), system-ui, sans-serif; color: #545454; }
        .wg-pc { padding: 24px; border-radius: 12px; background: #0B0F0C; }
        .wg-pc label { display: block; margin-bottom: 14px; font: 700 17px var(--font-montserrat), system-ui, sans-serif; color: #FFFFFF; }
        .wg-pc-rij { display: flex; gap: 10px; }
        .wg-pc input { flex: 1; min-width: 0; height: 54px; padding: 0 16px; border-radius: 8px; border: 2px solid transparent; background: #FFFFFF; color: #1A1A1A; font: 400 16px var(--font-inter), system-ui, sans-serif; }
        .wg-pc input:focus { outline: none; border-color: #9BCB6C; }
        .wg-pc button { height: 54px; padding: 0 26px; border: 0; border-radius: 8px; cursor: pointer; background: #9BCB6C; color: #FFFFFF; font: 700 16px var(--font-montserrat), system-ui, sans-serif; transition: background-color .2s ease, transform .15s ease; }
        .wg-pc button:hover { background: #7AB54E; }
        .wg-pc button:active { transform: translateY(1px); }
        .wg-pc button:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 2px; }
        .wg-antwoord { margin: 14px 0 0; font: 500 15px/1.5 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.88); }
        .wg-antwoord a { color: #9BCB6C; font-weight: 700; }

        .wg-kaart { display: grid; grid-template-columns: minmax(0, 1fr) 210px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; }
        .wg-map { display: flex; align-items: center; padding: 18px; border-right: 1px solid #E5E7EB; background: #F2F3F0; }
        .wg-map svg { display: block; width: 100%; height: auto; }
        .wg-prov { transition: fill .2s ease; }
        .wg-stad { font: 700 21px var(--font-inter), system-ui, sans-serif; fill: #1A1A1A; paint-order: stroke; stroke: rgba(255,255,255,0.9); stroke-width: 5px; }
        .wg-zij { padding: 22px 20px; display: flex; flex-direction: column; }
        .wg-zij-oog { margin: 0 0 6px; font: 600 11px var(--font-inter), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #545454; }
        .wg-zij b.kop { display: block; margin: 0 0 10px; font: 800 16px/1.3 var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .wg-lijst { margin: 0; padding: 0; list-style: none; }
        .wg-lijst li { padding: 10px 0; border-top: 1px solid #E5E7EB; font: 500 14.5px var(--font-inter), system-ui, sans-serif; color: #1A1A1A; }
        .wg-lijst li small { display: block; margin-top: 2px; font-size: 12px; color: #545454; }
        .wg-legende { margin-top: auto; padding-top: 18px; display: grid; gap: 8px; }
        .wg-legende span { display: flex; align-items: center; gap: 10px; font: 400 13.5px var(--font-inter), system-ui, sans-serif; color: #545454; }
        .wg-legende i { width: 16px; height: 16px; border-radius: 4px; }

        @media (max-width: 960px) {
          .wg-sectie { padding: 64px 16px; }
          .wg-wrap { grid-template-columns: minmax(0, 1fr); gap: 32px; }
        }
        @media (max-width: 620px) {
          .wg-kaart { grid-template-columns: minmax(0, 1fr); }
          .wg-map { border-right: 0; border-bottom: 1px solid #E5E7EB; padding: 12px; }
          .wg-stad { font-size: 24px; stroke-width: 6px; }
          .wg-pc-rij { flex-direction: column; }
          .wg-pc input { flex: none; width: 100%; box-sizing: border-box; }
          .wg-pc button { width: 100%; }
        }
      `}</style>
      <div className="wg-wrap">
        <div>
          <h2 id="wg-titel" className="wg-titel">Komen we <span>tot bij jou?</span></h2>
          <p className="wg-tekst">We werken in vier Vlaamse provincies. Vul je postcode in en je krijgt meteen antwoord.</p>
          <form className="wg-pc" onSubmit={check}>
            <label htmlFor="wg-postcode">Vul je postcode in</label>
            <div className="wg-pc-rij">
              <input id="wg-postcode" inputMode="numeric" maxLength={4} placeholder="Bv. 2590" value={postcode} onChange={(e) => { setPostcode(e.target.value); setAntwoord(null); }} />
              <button type="submit">Check</button>
            </div>
            {antwoord === true && <p className="wg-antwoord" role="status">Goed nieuws: we komen tot bij jou. <Link href="/#calculator">Bereken je richtprijs</Link></p>}
            {antwoord === false && <p className="wg-antwoord" role="status">Daar werken we normaal niet, maar <a href="tel:+32468352869">bel ons gerust even</a>.</p>}
          </form>
        </div>

        <div className="wg-kaart">
          <div className="wg-map">
            <svg viewBox={WERKGEBIED_VIEWBOX} role="img" aria-label="Kaart van België met ons werkgebied: Antwerpen, Limburg, Vlaams-Brabant en Oost-Vlaanderen">
              {PROVINCIES.map((p) => (
                <path key={p.naam} className="wg-prov" d={p.d} fill={p.id ? "#9BCB6C" : "#E2E4DF"} stroke="#FFFFFF" strokeWidth={p.id ? 2.5 : 1.5} strokeLinejoin="round" />
              ))}
              {STEDEN.map((s) => (
                <g key={s.naam}>
                  <circle cx={s.x} cy={s.y} r={6} fill="#1A1A1A" />
                  <text className="wg-stad" x={s.onder ? s.x : s.links ? s.x - 10 : s.x + 10} y={s.onder ? s.y + 30 : s.y + 6} textAnchor={s.onder ? "middle" : s.links ? "end" : "start"}>{s.naam}</text>
                </g>
              ))}
            </svg>
          </div>
          <div className="wg-zij">
            <p className="wg-zij-oog">België</p>
            <b className="kop">4 provincies</b>
            <ul className="wg-lijst">
              {REGIO.map((r) => <li key={r.naam}>{r.naam}<small>Postcodes {r.pc}</small></li>)}
            </ul>
            <div className="wg-legende">
              <span><i style={{ background: "#9BCB6C" }} />Vast werkgebied</span>
              <span><i style={{ background: "#E2E4DF" }} />Daarbuiten: bel ons eerst</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
