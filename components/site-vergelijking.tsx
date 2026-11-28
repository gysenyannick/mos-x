import { Check, X } from "lucide-react";

const rijen = [
  { ja: "Richtprijs binnen 60 seconden", jaSub: "Bereken online meteen wat je dak ongeveer kost.|Meteen online je richtprijs.", nee: "Weken wachten, zonder idee van een prijs.|Weken wachten op een prijs." },
  { ja: "Snel en flexibel ingepland", jaSub: "Ook in het hoogseizoen binnen maximaal 2 weken.|Ook in het hoogseizoen, max. 2 weken.", nee: "Lange wachtlijsten, ook buiten het seizoen.|Lange wachtlijsten." },
  { ja: "Prijsvaste offerte", jaSub: "Offerte = factuur. Geen meerwerk achteraf.", nee: "De prijs wijzigt achteraf door meerwerk." },
  { ja: "Tot 10 jaar garantie op de coating", jaSub: "Schriftelijk garantiebewijs, zwart op wit.", nee: "Weinig of geen garantie." },
  { ja: "Dakwerkers, geen schoonmakers", jaSub: "We kennen het vak en kunnen ook herstellen.", nee: "Schoonmakers zonder dakkennis." },
  { ja: "Kleine herstellingen inbegrepen", jaSub: "Een losse pan of kleine reparatie doen we meteen mee.|Losse pan of kleine reparatie: inbegrepen.", nee: "Voor herstellingen bel je een tweede firma.|Herstellingen? Bel een tweede firma." },
  { ja: "VCA-gecertificeerd", jaSub: "Veilig werken op hoogte, met de juiste uitrusting.|Veilig werken op hoogte.", nee: "Geen veiligheidsattest voor werken op hoogte.|Geen veiligheidsattest." },
  { ja: "Eén vast aanspreekpunt", jaSub: "Geen tussenpersonen. Direct contact via WhatsApp.|Direct contact via WhatsApp.", nee: "Onderaannemers en tussenpersonen." },
];

function T({ t }: { t: string }) {
  const [l, k] = t.split("|");
  return k ? <><span className="vg-l">{l}</span><span className="vg-k">{k}</span></> : <>{l}</>;
}

/** Homepage: vergelijking MOS-X tegenover een gewone dakreiniger (twee panelen met VS). */
export default function SiteVergelijking() {
  return (
    <section className="vg-sectie" aria-labelledby="vg-titel">
      <style>{`
        .vg-sectie { position: relative; overflow: hidden; padding: 100px 20px;
          background: #FFFFFF; }
        .vg-wrap { position: relative; max-width: 1180px; margin: 0 auto; }
        .vg-kop { text-align: center; margin-bottom: 52px; }
        .vg-oog { margin: 0 0 12px; font: 700 12.5px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #7AB54E; }
        .vg-titel { margin: 0; font: 800 clamp(1.75rem, 3.4vw, 2.5rem)/1.15 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #1A1A1A; text-wrap: balance; }
        .vg-titel span { color: #9BCB6C; }
        .vg-sub { margin: 14px 0 0; font: 400 16px/1.6 var(--font-inter), system-ui, sans-serif; color: #545454; }

        .vg-duo { position: relative; display: grid; grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr); align-items: stretch; }
        .vg-paneel { display: flex; flex-direction: column; }
        .vg-links { margin: 26px 0; background: #F7F8F6; border: 1px solid #E5E7EB; border-radius: 20px 0 0 20px; border-right: 0; box-shadow: 0 2px 16px rgba(0,0,0,0.06); }
        .vg-rechts { position: relative; isolation: isolate; overflow: hidden; border-radius: 22px; background: #0B0F0C; border-top: 4px solid #9BCB6C;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -36px rgba(11,15,12,0.65); }

        .vg-rij { display: flex; align-items: center; gap: 14px; min-height: 78px; padding: 0 28px; border-bottom: 1px solid #E5E7EB; }
        .vg-rij:last-child { border-bottom: 0; }
        .vg-rechts .vg-rij { border-bottom-color: rgba(255,255,255,0.08); padding: 0 32px; }
        .vg-hoofd { min-height: 86px !important; }
        .vg-hoofd b { font: 800 21px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.02em; }
        .vg-links .vg-hoofd b { color: #545454; }
        .vg-rechts .vg-hoofd b { color: #FFFFFF; }
        .vg-rechts .vg-hoofd b em { font-style: normal; color: #9BCB6C; }

        .vg-ja, .vg-nee { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; }
        .vg-ja { background: #9BCB6C; color: #FFFFFF; }
        .vg-nee { background: #FFFFFF; color: #A3A79E; border: 1px solid #E5E7EB; }
        .vg-tekst { min-width: 0; }
        .vg-tekst b { display: block; font: 700 15.5px/1.3 var(--font-montserrat), system-ui, sans-serif; color: #FFFFFF; white-space: nowrap; }
        .vg-tekst small { display: block; margin-top: 3px; font: 400 13.5px/1.4 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.66); white-space: nowrap; }
        .vg-nee-tekst { font: 400 14.5px/1.4 var(--font-inter), system-ui, sans-serif; color: #545454; white-space: nowrap; }

        .vg-vs { position: absolute; z-index: 3; top: 50%; left: calc(41% - 30px); transform: translateY(-50%); width: 60px; height: 60px; border-radius: 50%;
          display: grid; place-items: center; background: #9BCB6C; color: #FFFFFF; border: 4px solid #FFFFFF;
          font: 800 17px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.02em; box-shadow: 0 10px 24px -8px rgba(122,181,78,0.8); }

        .vg-k { display: none; }
        @media (max-width: 1080px) and (min-width: 861px) {
          .vg-tekst small, .vg-nee-tekst { font-size: 12.5px; }
          .vg-tekst b { font-size: 14px; }
        }
        @media (max-width: 640px) {
          .vg-l { display: none; } .vg-k { display: inline; }
          .vg-tekst small { font-size: 12.5px !important; }
          .vg-nee-tekst { font-size: 13px !important; }
          .vg-tekst b { font-size: 14px !important; }
        }
        @media (max-width: 380px) {
          .vg-rij { padding-left: 14px !important; padding-right: 10px !important; gap: 10px; }
          .vg-tekst small { font-size: 11.5px !important; }
          .vg-nee-tekst { font-size: 12px !important; }
          .vg-tekst b { font-size: 13.5px !important; }
        }
        @media (max-width: 860px) {
          .vg-sectie { padding: 72px 14px; }
          .vg-kop { margin-bottom: 34px; }
          .vg-duo { grid-template-columns: minmax(0, 1fr); }
          .vg-rechts { order: -1; }
          .vg-links { margin: 0 12px; border-radius: 0 0 18px 18px; border: 1px solid #E5E7EB; border-top: 0; }
          .vg-vs { position: relative; top: auto; left: auto; transform: none; order: 0; margin: -30px auto -30px; }
          .vg-links { order: 1; }
          .vg-rechts { padding-bottom: 28px; }
          .vg-nee-tekst, .vg-tekst small { text-wrap: pretty; }
          .vg-rij { min-height: 64px; padding: 12px 20px !important; }
          .vg-hoofd { min-height: 70px !important; }
          .vg-links .vg-hoofd { padding-top: 34px !important; }
          .vg-hoofd b { font-size: 18px; }
          .vg-tekst b { font-size: 14.5px; }
          .vg-tekst small { font-size: 13px; }
          .vg-nee-tekst { font-size: 13.5px; }
        }
      `}</style>
      <div className="vg-wrap">
        <div className="vg-kop">
          <p className="vg-oog">Het verschil</p>
          <h2 id="vg-titel" className="vg-titel">Een dakspecialist, <span>geen schoonmaakfirma.</span></h2>
          <p className="vg-sub">Zie het verschil met een gewone dakreiniger.</p>
        </div>

        <div className="vg-duo">
          <div className="vg-paneel vg-links" aria-label="Andere firma">
            <div className="vg-rij vg-hoofd"><span className="vg-nee" aria-hidden="true"><X size={14} strokeWidth={2.8} /></span><b>Andere firma</b></div>
            {rijen.map((r) => (
              <div key={r.nee} className="vg-rij"><span className="vg-nee" aria-hidden="true"><X size={14} strokeWidth={2.8} /></span><span className="vg-nee-tekst"><T t={r.nee} /></span></div>
            ))}
          </div>

          <div className="vg-vs vg-vs-plek" aria-hidden="true">VS</div>

          <div className="vg-paneel vg-rechts" aria-label="MOS-X">
            <div className="vg-rij vg-hoofd"><span className="vg-ja" aria-hidden="true"><Check size={15} strokeWidth={3} /></span><b>MOS-X</b></div>
            {rijen.map((r) => (
              <div key={r.ja} className="vg-rij">
                <span className="vg-ja" aria-hidden="true"><Check size={15} strokeWidth={3} /></span>
                <div className="vg-tekst"><b>{r.ja}</b><small><T t={r.jaSub} /></small></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
