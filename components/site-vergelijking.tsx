import { Check, X } from "lucide-react";

const rijen = [
  { titel: "Offerte dezelfde dag", sub: "Geen weken wachten op een prijs" },
  { titel: "Snel ingepland", sub: "Ook in het hoogseizoen" },
  { titel: "Prijsvaste offerte", sub: "Offerte = factuur, geen meerwerk achteraf" },
  { titel: "10 jaar garantie op de coating", sub: "Bladert niet af" },
  { titel: "Dakwerkers, geen schoonmakers", sub: "Vakmannen die je dak echt kennen" },
  { titel: "Kleine herstellingen inbegrepen", sub: "Meteen gedaan, geen tweede firma nodig" },
  { titel: "VCA-gecertificeerd", sub: "Veilig werken op je dak" },
  { titel: "Eén vast aanspreekpunt", sub: "Van offerte tot oplevering" },
];

/** Homepage: vergelijking MOS-X tegenover een gewone dakreiniger. */
export default function SiteVergelijking() {
  return (
    <section className="vg-sectie" aria-labelledby="vg-titel">
      <style>{`
        .vg-sectie { padding: 96px 20px; background: radial-gradient(640px 380px at 50% 0%, rgba(155,203,108,0.08), transparent 70%), #FFFFFF; }
        .vg-wrap { max-width: 920px; margin: 0 auto; }
        .vg-kop { text-align: center; margin-bottom: 44px; }
        .vg-oog { margin: 0 0 12px; font: 700 12.5px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #9BCB6C; }
        .vg-titel { margin: 0; font: 800 clamp(1.75rem, 3.4vw, 2.5rem)/1.15 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #1A1A1A; text-wrap: balance; }
        .vg-titel span { color: #9BCB6C; }
        .vg-sub { margin: 14px 0 0; font: 400 16px/1.6 var(--font-inter), system-ui, sans-serif; color: #545454; }

        .vg-tabel { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 190px 170px; }
        .vg-mosx-bg { position: relative; z-index: 0; align-self: stretch; justify-self: stretch; border-radius: 18px; background: #F2F8EC; border: 2px solid #9BCB6C;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 24px 48px -30px rgba(122,181,78,0.6); }
        .vg-cel { position: relative; z-index: 1; display: flex; align-items: center; min-height: 74px; border-bottom: 1px solid #E5E7EB; }
        .vg-cel.mid { justify-content: center; }
        .vg-rij-laatst { border-bottom: 0; }
        .vg-kopcel { min-height: 68px; border-bottom: 1px solid #E5E7EB; }
        .vg-merk { font: 800 17px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.01em; color: #1A1A1A; }
        .vg-merk b { color: #7AB54E; }
        .vg-ander { font: 500 15px var(--font-inter), system-ui, sans-serif; color: #545454; }
        .vg-tekst { padding: 14px 16px 14px 4px; }
        .vg-tekst b { display: block; font: 700 16px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; letter-spacing: -0.01em; }
        .vg-tekst small { display: block; margin-top: 3px; font: 400 13.5px/1.45 var(--font-inter), system-ui, sans-serif; color: #545454; }
        .vg-ja { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: #9BCB6C; color: #FFFFFF; }
        .vg-nee { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: #F7F8F6; color: #B0B4AB; border: 1px solid #E5E7EB; }

        @media (max-width: 640px) {
          .vg-sectie { padding: 64px 14px; }
          .vg-kop { margin-bottom: 30px; }
          .vg-tabel { grid-template-columns: minmax(0, 1fr) 76px 66px; }
          .vg-tekst { padding: 12px 8px 12px 2px; }
          .vg-tekst b { font-size: 14px; }
          .vg-tekst small { font-size: 12px; }
          .vg-cel { min-height: 66px; }
          .vg-merk { font-size: 13px; }
          .vg-ander { font-size: 11.5px; text-align: center; line-height: 1.25; }
          .vg-ja, .vg-nee { width: 26px; height: 26px; }
          .vg-mosx-bg { border-radius: 14px; }
        }
      `}</style>
      <div className="vg-wrap">
        <div className="vg-kop">
          <p className="vg-oog">Het verschil</p>
          <h2 id="vg-titel" className="vg-titel">Een dakspecialist, <span>geen schoonmaakfirma.</span></h2>
          <p className="vg-sub">Zie het verschil met een gewone dakreiniger.</p>
        </div>

        <div className="vg-tabel" role="table" aria-label="Vergelijking MOS-X met een andere firma">
          <div className="vg-mosx-bg" style={{ gridColumn: 2, gridRow: `1 / span ${rijen.length + 1}` }} aria-hidden="true" />

          <div className="vg-cel vg-kopcel" role="columnheader" style={{ gridColumn: 1, gridRow: 1 }}><span className="sr-only">Wat je krijgt</span></div>
          <div className="vg-cel vg-kopcel mid" role="columnheader" style={{ gridColumn: 2, gridRow: 1, borderBottomColor: "rgba(155,203,108,0.45)" }}>
            <span className="vg-merk">MOS-<b>X</b></span>
          </div>
          <div className="vg-cel vg-kopcel mid" role="columnheader" style={{ gridColumn: 3, gridRow: 1 }}>
            <span className="vg-ander">Andere firma</span>
          </div>

          {rijen.map((r, i) => {
            const laatst = i === rijen.length - 1;
            const rij = i + 2;
            return (
              <div key={r.titel} role="row" style={{ display: "contents" }}>
                <div role="cell" className={`vg-cel${laatst ? " vg-rij-laatst" : ""}`} style={{ gridColumn: 1, gridRow: rij }}>
                  <div className="vg-tekst"><b>{r.titel}</b><small>{r.sub}</small></div>
                </div>
                <div role="cell" className={`vg-cel mid${laatst ? " vg-rij-laatst" : ""}`} style={{ gridColumn: 2, gridRow: rij, borderBottomColor: "rgba(155,203,108,0.35)" }}>
                  <span className="vg-ja" aria-label="Ja"><Check size={17} strokeWidth={3} /></span>
                </div>
                <div role="cell" className={`vg-cel mid${laatst ? " vg-rij-laatst" : ""}`} style={{ gridColumn: 3, gridRow: rij }}>
                  <span className="vg-nee" aria-label="Nee"><X size={15} strokeWidth={2.6} /></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
