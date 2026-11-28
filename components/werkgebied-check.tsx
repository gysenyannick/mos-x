"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, MapPin, Phone } from "lucide-react";

/** Kaartdata: alle Belgische gemeentes, provinciegrenzen en postcodes (zie public/data). */
type Kaart = {
  w: number;
  h: number;
  g: { n: string; p: string; d: string; c: [number, number] }[];
  grens: string;
  labels: Record<string, [number, number]>;
  pc: Record<string, number>;
};

const WERKGEBIED = new Set(["antwerpen", "limburg", "vlaams-brabant", "oost-vlaanderen"]);

const PROV_NAAM: Record<string, string> = {
  "antwerpen": "Antwerpen",
  "limburg": "Limburg",
  "vlaams-brabant": "Vlaams-Brabant",
  "oost-vlaanderen": "Oost-Vlaanderen",
  "west-vlaanderen": "West-Vlaanderen",
  "brussel": "Brussel",
  "waals-brabant": "Waals-Brabant",
  "henegouwen": "Henegouwen",
  "namen": "Namen",
  "luik": "Luik",
  "luxemburg": "Luxemburg",
};

/** Labelposities die beter staan dan het zwaartepunt van de provincie. */
const LABEL_POS: Record<string, [number, number]> = {
  "vlaams-brabant": [600, 262],
  "waals-brabant": [528, 336],
  "west-vlaanderen": [112, 222],
  "oost-vlaanderen": [342, 206],
};

type Antwoord =
  | { soort: "ja"; gemeente: string; provincie: string }
  | { soort: "nee"; gemeente: string; provincie: string }
  | { soort: "onbekend" };

/** "Komen we tot bij jou?": postcodecheck met een interactieve kaart van alle Belgische gemeentes. */
export default function WerkgebiedCheck() {
  const [kaart, setKaart] = useState<Kaart | null>(null);
  const [postcode, setPostcode] = useState("");
  const [antwoord, setAntwoord] = useState<Antwoord | null>(null);
  const [gevonden, setGevonden] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    let weg = false;
    fetch("/data/belgie-gemeentes.json")
      .then((r) => r.json())
      .then((d: Kaart) => { if (!weg) setKaart(d); })
      .catch(() => {});
    return () => { weg = true; };
  }, []);

  function check(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cijfers = postcode.replace(/\D/g, "");
    const i = kaart && cijfers.length === 4 ? kaart.pc[cijfers] : undefined;
    if (!kaart || i === undefined) {
      setGevonden(null);
      setAntwoord({ soort: "onbekend" });
      return;
    }
    const g = kaart.g[i];
    setGevonden(i);
    setAntwoord({ soort: WERKGEBIED.has(g.p) ? "ja" : "nee", gemeente: g.n, provincie: PROV_NAAM[g.p] ?? "" });
  }

  const actief = hover ?? gevonden;
  const label = useMemo(() => {
    if (!kaart || actief === null) return null;
    const g = kaart.g[actief];
    return { naam: g.n, prov: PROV_NAAM[g.p] ?? "", ons: WERKGEBIED.has(g.p) };
  }, [kaart, actief]);

  return (
    <section className="wg-sectie" aria-labelledby="wg-titel">
      <style>{`
        .wg-sectie { padding: 88px 20px; background: #F7F8F6; }
        .wg-wrap { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); gap: 56px; align-items: center; }
        .wg-titel { margin: 0; white-space: nowrap; font: 800 clamp(1.9rem, 3vw, 2.5rem)/1.1 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #1A1A1A; }
        .wg-titel span { color: #9BCB6C; }
        .wg-oog { margin: 0 0 12px; font: 700 12.5px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #9BCB6C; }
        .wg-tekst { margin: 14px 0 26px; max-width: 460px; text-wrap: balance; font: 400 16.5px/1.65 var(--font-inter), system-ui, sans-serif; color: #545454; }
        .wg-pc { padding: 24px; border-radius: 16px; background: #0B0F0C; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 30px 60px -34px rgba(11,15,12,0.6); }
        .wg-pc label { display: block; margin-bottom: 14px; font: 700 17px var(--font-montserrat), system-ui, sans-serif; color: #FFFFFF; }
        .wg-pc-rij { display: flex; gap: 10px; }
        .wg-pc input { flex: 1; min-width: 0; height: 54px; padding: 0 16px; border-radius: 10px; border: 2px solid transparent; background: #FFFFFF; color: #1A1A1A; font: 500 17px var(--font-inter), system-ui, sans-serif; letter-spacing: .06em; }
        .wg-pc input:focus { outline: none; border-color: #9BCB6C; }
        .wg-pc button { height: 54px; padding: 0 26px; border: 0; border-radius: 10px; cursor: pointer; background: #9BCB6C; color: #FFFFFF; font: 700 16px var(--font-montserrat), system-ui, sans-serif; transition: background-color .2s ease, box-shadow .2s ease, transform .15s ease; }
        .wg-pc button:hover { background: #7AB54E; box-shadow: 0 8px 20px -8px rgba(122,181,78,0.7); }
        .wg-pc button:active { transform: translateY(1px); }
        .wg-pc button:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 2px; }

        .wg-uitslag { display: flex; gap: 12px; align-items: flex-start; margin-top: 16px; padding: 14px 16px; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(155,203,108,0.35); animation: wg-in .3s ease; }
        .wg-uitslag.nee { border-color: rgba(255,255,255,0.16); }
        .wg-uitslag-ico { flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: #9BCB6C; color: #FFFFFF; }
        .wg-uitslag.nee .wg-uitslag-ico { background: rgba(255,255,255,0.14); }
        .wg-uitslag b { display: block; text-wrap: balance; font: 700 15.5px/1.35 var(--font-montserrat), system-ui, sans-serif; color: #FFFFFF; }
        .wg-uitslag span { display: block; text-wrap: pretty; margin-top: 3px; font: 400 14px/1.5 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.72); }
        .wg-uitslag a { color: #9BCB6C; font-weight: 700; text-decoration: none; }
        .wg-uitslag a:hover { color: #B9DE95; text-decoration: underline; }
        @keyframes wg-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

        .wg-kaart { padding: 18px 18px 14px; border-radius: 18px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .wg-svg { display: block; width: 100%; height: auto; }
        .wg-leeg { aspect-ratio: 1000 / 815; border-radius: 12px; background: #F7F8F6; }
        .wg-pin { pointer-events: none; animation: wg-pin .45s cubic-bezier(.2,1.4,.4,1); transform-box: fill-box; transform-origin: 50% 100%; }
        @keyframes wg-pin { from { opacity: 0; transform: translateY(-14px) scale(.7); } to { opacity: 1; transform: none; } }
        .wg-gem { cursor: pointer; transition: fill .15s ease; }
        .wg-lbl { pointer-events: none; font: 800 23px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .02em; text-anchor: middle; dominant-baseline: middle; paint-order: stroke; stroke-linejoin: round; }
        .wg-lbl.ons { fill: #FFFFFF; stroke: rgba(70,110,40,0.5); stroke-width: 4px; }
        .wg-lbl.niet { fill: #8B9088; stroke: #E9EBE6; stroke-width: 4px; font-weight: 700; font-size: 19px; }
        .wg-onder { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 10px; padding-top: 12px; border-top: 1px solid #E5E7EB; }
        .wg-naam { display: flex; align-items: center; gap: 8px; min-height: 20px; font: 700 14px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .wg-naam small { font: 500 13px var(--font-inter), system-ui, sans-serif; color: #545454; }
        .wg-legende { display: flex; gap: 16px; }
        .wg-legende span { display: flex; align-items: center; gap: 8px; font: 400 13px var(--font-inter), system-ui, sans-serif; color: #545454; }
        .wg-legende i { width: 14px; height: 14px; border-radius: 4px; }

        @media (max-width: 960px) {
          .wg-sectie { padding: 64px 16px; }
          .wg-wrap { grid-template-columns: minmax(0, 1fr); gap: 28px; }
        }
        @media (max-width: 620px) {
          .wg-titel { font-size: 8vw; }
          .wg-pc-rij { flex-direction: column; }
          .wg-pc input { flex: none; width: 100%; box-sizing: border-box; }
          .wg-pc button { width: 100%; }
          .wg-kaart { padding: 10px 10px 12px; }
          .wg-lbl.ons { font-size: 27px; }
          .wg-lbl.niet { font-size: 22px; }
          .wg-legende { gap: 12px; }
        }
      `}</style>
      <div className="wg-wrap">
        <div>
          <p className="wg-oog">Werkgebied</p>
          <h2 id="wg-titel" className="wg-titel">Komen we <span>tot bij jou?</span></h2>
          <p className="wg-tekst">We werken in Antwerpen, Limburg, Vlaams&#8209;Brabant en Oost&#8209;Vlaanderen. Vul je postcode in en je ziet meteen je gemeente op de kaart.</p>
          <form className="wg-pc" onSubmit={check}>
            <label htmlFor="wg-postcode">Vul je postcode in</label>
            <div className="wg-pc-rij">
              <input id="wg-postcode" inputMode="numeric" autoComplete="postal-code" maxLength={4} placeholder="Bv. 2590" value={postcode}
                onChange={(e) => { setPostcode(e.target.value); setAntwoord(null); setGevonden(null); }} />
              <button type="submit">Check</button>
            </div>
            {antwoord?.soort === "ja" && (
              <div className="wg-uitslag" role="status">
                <span className="wg-uitslag-ico"><Check size={17} strokeWidth={3} /></span>
                <div><b>Goed nieuws, we komen tot in {antwoord.gemeente}.</b><span>Provincie {antwoord.provincie}. <Link href="/#calculator">Bereken je richtprijs</Link></span></div>
              </div>
            )}
            {antwoord?.soort === "nee" && (
              <div className="wg-uitslag nee" role="status">
                <span className="wg-uitslag-ico"><Phone size={15} /></span>
                <div><b>{antwoord.gemeente} ligt buiten ons werkgebied.</b><span>Bel ons gerust even, soms kan het toch. <a href="tel:+32468352869">+32 468 35 28 69</a></span></div>
              </div>
            )}
            {antwoord?.soort === "onbekend" && (
              <div className="wg-uitslag nee" role="status">
                <span className="wg-uitslag-ico"><MapPin size={15} /></span>
                <div><b>Die postcode vinden we niet.</b><span>Kijk ze even na: een Belgische postcode heeft 4 cijfers.</span></div>
              </div>
            )}
          </form>
        </div>

        <div className="wg-kaart">
          {kaart ? (
            <svg className="wg-svg" viewBox={`0 0 ${kaart.w} ${kaart.h}`} role="img"
              aria-label="Kaart van België met alle gemeentes. Ons werkgebied: Antwerpen, Limburg, Vlaams-Brabant en Oost-Vlaanderen"
              onMouseLeave={() => setHover(null)}>
              <g>
                {kaart.g.map((g, i) => {
                  const ons = WERKGEBIED.has(g.p);
                  const isGevonden = gevonden === i;
                  const isHover = hover === i;
                  const fill = isGevonden ? "#1A1A1A" : ons ? (isHover ? "#7AB54E" : "#9BCB6C") : (isHover ? "#CFD2CB" : "#E2E4DF");
                  return (
                    <path key={i} className="wg-gem" d={g.d} fill={fill} stroke="#FFFFFF" strokeWidth={0.6} strokeLinejoin="round"
                      onMouseEnter={() => setHover(i)} onClick={() => setHover(i)}>
                      <title>{g.n}</title>
                    </path>
                  );
                })}
              </g>
              <path d={kaart.grens} fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" pointerEvents="none" />
              {Object.entries(kaart.labels).filter(([p]) => p !== "brussel").map(([p, pos]) => {
                const [x, y] = LABEL_POS[p] ?? pos;
                return <text key={p} className={WERKGEBIED.has(p) ? "wg-lbl ons" : "wg-lbl niet"} x={x} y={y}>{PROV_NAAM[p]}</text>;
              })}
              {gevonden !== null && (() => {
                const [x, y] = kaart.g[gevonden].c;
                return (
                  <g key={gevonden} transform={`translate(${x} ${y})`}>
                    <g className="wg-pin"><g transform="scale(1.35)">
                      <path d="M0 0C-3-9-15-15-15-27a15 15 0 0 1 30 0C15-15 3-9 0 0Z" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth={3} />
                      <circle cx={0} cy={-27} r={5.5} fill="#9BCB6C" />
                    </g></g>
                  </g>
                );
              })()}
            </svg>
          ) : (
            <div className="wg-leeg" aria-hidden="true" />
          )}
          <div className="wg-onder">
            <span className="wg-naam" aria-live="polite">
              {label ? (<><MapPin size={15} color={label.ons ? "#7AB54E" : "#545454"} />{label.naam}<small>{label.prov}{label.ons ? " · werkgebied" : " · bel ons eerst"}</small></>) : "Wijs een gemeente aan op de kaart"}
            </span>
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
