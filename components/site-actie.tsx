import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Homepage: actiebanner met gratis extra's bij een dakreiniging.
 * Pas hier de voordelen aan; prijzen en voorwaarden staan bewust niet vast in de banner.
 */
const voordelen: { titel: string; noot?: string; label: string; gratis: boolean }[] = [
  { titel: "Dakgoten reinigen", label: "Gratis", gratis: true },
  { titel: "Ramen reinigen", label: "Gratis", gratis: true },
  { titel: "Zonnepanelen reinigen", noot: "indien aanwezig", label: "Gratis", gratis: true },
  { titel: "Oprit reinigen", noot: "als je die erbij wil", label: "−50%", gratis: false },
];

export default function SiteActie() {
  return (
    <section className="sa-sectie" aria-labelledby="sa-titel">
      <style>{`
        .sa-sectie { padding: 24px 0 72px; }
        .sa-kaart { position: relative; display: grid; grid-template-columns: 250px minmax(0, 1fr) 340px; align-items: center; gap: 40px;
          padding: 40px 40px 40px 48px; border-radius: 24px; overflow: hidden; isolation: isolate;
          background: radial-gradient(600px 320px at 85% 50%, rgba(155,203,108,0.14), transparent 70%), #F4FBF0;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05), 0 30px 60px -40px rgba(30,51,36,0.35); }
        .sa-foto { position: relative; width: 100%; aspect-ratio: 1 / 0.92; }
        .sa-foto::before { content: ""; position: absolute; inset: -10px -12px -6px -8px; z-index: -1; background: #CFE5B8;
          border-radius: 58% 42% 46% 54% / 46% 56% 44% 54%; }
        .sa-foto img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; display: block;
          border-radius: 60% 40% 42% 58% / 44% 56% 44% 56%; }
        .sa-oog { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #FFFFFF; border: 1px solid #CFE5B8;
          font: 700 11.5px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #7AB54E; }
        .sa-titel { margin: 16px 0 8px; font-family: var(--font-montserrat), system-ui, sans-serif; font-weight: 800; letter-spacing: -0.035em; line-height: 1; color: #1A1A1A; }
        .sa-titel .groot { display: block; font-size: clamp(2.4rem, 3.5vw, 3.25rem); color: #9BCB6C; white-space: nowrap; }
        .sa-titel .klein { display: block; white-space: nowrap; font-size: clamp(1.35rem, 2.2vw, 1.75rem); letter-spacing: -0.02em; margin-top: 6px; }
        .sa-tekst { margin: 14px 0 0; max-width: 460px; font: 400 16.5px/1.65 var(--font-inter), system-ui, sans-serif; color: #545454; }
        .sa-tekst b { color: #1A1A1A; font-weight: 700; }
        .sa-prijs { background: #FFFFFF; border-radius: 20px; padding: 26px 26px 24px; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 24px 48px -28px rgba(30,51,36,0.35); }
        .sa-prijs h3 { margin: 0 0 14px; text-align: center; font: 800 16px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .sa-lijst { list-style: none; margin: 0 0 20px; padding: 0; }
        .sa-lijst li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 0; border-top: 1px solid #EEF0EA;
          font: 600 14.5px var(--font-inter), system-ui, sans-serif; color: #1A1A1A; }
        .sa-lijst li:first-child { border-top: 0; padding-top: 0; }
        .sa-lijst small { display: block; font-weight: 500; font-size: 12.5px; color: #8E8E89; }
        .sa-label { flex-shrink: 0; padding: 5px 11px; border-radius: 999px; font: 800 12.5px var(--font-montserrat), system-ui, sans-serif; }
        .sa-label.gratis { background: #EEF6E6; color: #4F7F2E; }
        .sa-label.korting { background: #1A1A1A; color: #FFFFFF; }
        .sa-knop { display: flex; align-items: center; justify-content: center; gap: 8px; height: 52px; border-radius: 10px; background: #9BCB6C; color: #FFFFFF;
          text-decoration: none; font: 700 15.5px var(--font-montserrat), system-ui, sans-serif;
          box-shadow: 0 10px 22px -12px rgba(122,181,78,0.9); transition: background-color .2s ease, transform .15s ease; }
        .sa-knop:hover { background: #7AB54E; }
        .sa-knop:active { transform: translateY(1px); }
        .sa-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
        .sa-voet { margin: 10px 0 0; text-align: center; font: 400 12px var(--font-inter), system-ui, sans-serif; color: #8E8E89; }
        @media (max-width: 1100px) {
          .sa-kaart { grid-template-columns: 220px minmax(0, 1fr); padding: 32px; gap: 32px; }
          .sa-prijs { grid-column: 1 / -1; }
        }
        @media (max-width: 680px) {
          .sa-sectie { padding: 8px 0 56px; }
          .sa-kaart { grid-template-columns: minmax(0, 1fr); padding: 28px 20px 22px; gap: 24px; text-align: center; }
          .sa-foto { width: 72%; margin: 0 auto; }
          .sa-tekst { margin-left: auto; margin-right: auto; }
          .sa-prijs { padding: 22px 18px 20px; text-align: left; }
        }
      `}</style>
      <div className="site-wrap">
        <div className="sa-kaart">
          <div className="sa-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/herentals-na.png" alt="Gereinigd dak met dakramen" loading="lazy" decoding="async" />
          </div>

          <div>
            <span className="sa-oog">Uniek aanbod</span>
            <h2 id="sa-titel" className="sa-titel">
              <span className="groot">Gratis extra&apos;s</span>
              <span className="klein">bij elke dakreiniging</span>
            </h2>
            <p className="sa-tekst">
              Laat je dak reinigen en we nemen <b>je dakgoten, ramen en zonnepanelen</b> er gratis bij.
              Wil je ook je oprit laten doen? Dan krijg je <b>50% korting</b>.
            </p>
          </div>

          <div className="sa-prijs">
            <h3>Inbegrepen bij je dakreiniging</h3>
            <ul className="sa-lijst">
              {voordelen.map(v => (
                <li key={v.titel}>
                  <span>{v.titel}{v.noot && <small>{v.noot}</small>}</span>
                  <span className={`sa-label ${v.gratis ? "gratis" : "korting"}`}>{v.label}</span>
                </li>
              ))}
            </ul>
            <Link href="/#calculator" className="sa-knop">
              Bereken mijn richtprijs <ChevronRight size={16} strokeWidth={2.5} />
            </Link>
            <p className="sa-voet">Enkel in combinatie met een dakreiniging.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
