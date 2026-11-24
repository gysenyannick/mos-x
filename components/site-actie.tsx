import Link from "next/link";

/**
 * Homepage: actiebanner (voorjaarsbonus) bij een dakreiniging.
 * Opbouw zoals een promobanner: foto in organische vorm, grote korting, en rechts een witte kaart.
 */
export default function SiteActie() {
  return (
    <section className="sa-sectie" aria-labelledby="sa-titel">
      <style>{`
        .sa-sectie { padding: 48px 0 96px; }
        .sa-wrap { max-width: 1320px; margin: 0 auto; padding: 0 20px; }
        .sa-kaart { display: grid; grid-template-columns: 230px minmax(0, 1fr) 310px; align-items: center; gap: 52px;
          padding: 64px 56px 64px 64px; border-radius: 28px; background: #F2F8EC;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04), 0 30px 60px -40px rgba(30,51,36,0.3); }
        .sa-foto { position: relative; width: 100%; aspect-ratio: 1 / 0.92; isolation: isolate; }
        .sa-foto::before { content: ""; position: absolute; inset: -9px; z-index: -1; background: #CFE5B8;
          border-radius: 60% 40% 42% 58% / 44% 56% 44% 56%; }
        .sa-foto img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; display: block;
          border-radius: 60% 40% 42% 58% / 44% 56% 44% 56%; }
        .sa-en { margin: 6px 0 0; font: 600 17px var(--font-inter), system-ui, sans-serif; color: #545454; }
        .sa-oog { margin: 0 0 10px; font: 700 13px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #7AB54E; }
        .sa-titel { margin: 0; font-family: var(--font-montserrat), system-ui, sans-serif; font-weight: 800; letter-spacing: -0.035em; line-height: 1; color: #1A1A1A; white-space: nowrap; }
        .sa-titel .pct { font-size: clamp(3.4rem, 5.4vw, 5rem); color: #9BCB6C; letter-spacing: -0.05em; }
        .sa-titel .kort { font-size: clamp(1.8rem, 2.8vw, 2.7rem); margin-left: 12px; }
        .sa-sub { margin: 10px 0 0; white-space: nowrap; font: 700 clamp(1.15rem, 1.8vw, 1.5rem) var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.01em; color: #1A1A1A; }
        .sa-tekst { margin: 22px 0 0; max-width: 500px; font: 400 16.5px/1.65 var(--font-inter), system-ui, sans-serif; color: #545454; }
        .sa-tekst b { color: #1A1A1A; font-weight: 700; }
        .sa-prijs { background: #FFFFFF; border-radius: 22px; padding: 36px 32px 32px; text-align: center;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 24px 48px -28px rgba(30,51,36,0.35); }
        .sa-prijs h3 { margin: 0; letter-spacing: .14em; text-transform: uppercase; color: #7AB54E !important; font: 800 13px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .sa-gratis-k { margin: 6px 0 22px; font: 700 17px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
        .sa-gratis { margin: 10px 0 0; font: 800 64px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.04em; line-height: 1; color: #1A1A1A; }
        .sa-knop { display: flex; align-items: center; justify-content: center; height: 52px; border-radius: 10px; background: #9BCB6C; color: #FFFFFF;
          text-decoration: none; font: 700 16px var(--font-montserrat), system-ui, sans-serif;
          box-shadow: 0 10px 22px -12px rgba(122,181,78,0.9); transition: background-color .2s ease, transform .15s ease; }
        .sa-knop:hover { background: #7AB54E; }
        .sa-knop:active { transform: translateY(1px); }
        .sa-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
        @media (max-width: 1100px) {
          .sa-kaart { grid-template-columns: 220px minmax(0, 1fr); padding: 44px 40px; gap: 40px; }
          .sa-prijs { grid-column: 1 / -1; max-width: 420px; justify-self: center; width: 100%; }
        }
        @media (max-width: 680px) {
          .sa-sub { white-space: normal; }
          .sa-punt { display: none; }
          .sa-datum { display: block; margin-top: 4px; }
          .sa-sectie { padding: 8px 0 56px; }
          .sa-kaart { grid-template-columns: minmax(0, 1fr); padding: 36px 20px 26px; gap: 30px; text-align: center; }
          .sa-foto { width: 70%; margin: 0 auto; }
          .sa-tekst { margin-left: auto; margin-right: auto; }
          .sa-titel .kort { margin-left: 8px; }
        }
        @media (max-width: 380px) { .sa-titel .pct { font-size: 3rem; } .sa-titel .kort { font-size: 1.6rem; } }
      `}</style>
      <div className="sa-wrap">
        <div className="sa-kaart">
          <div className="sa-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/herentals-na.png" alt="Gereinigd dak met dakramen" loading="lazy" decoding="async" />
          </div>

          <div>
            <p className="sa-oog">Voorjaarsbonus<span className="sa-punt"> · </span><span className="sa-datum">Boek vóór 31 maart</span></p>
            <h2 id="sa-titel" className="sa-titel"><span className="pct">50%</span><span className="kort">korting</span></h2>
            <p className="sa-sub">op je oprit of terras</p>
            <p className="sa-en">bij elke dakreiniging</p>
            <p className="sa-tekst"><b>Dakgoten, glaspartijen en zonnepanelen</b> nemen we gratis mee.</p>
          </div>

          <div className="sa-prijs">
            <h3>Voorjaarsbonus</h3>
            <p className="sa-gratis">−50%</p>
            <p className="sa-gratis-k">Oprit of terras</p>
            <Link href="/#calculator" className="sa-knop">Bereken mijn richtprijs</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
