import Link from "next/link";
import PageLayout from "@/components/page-layout";
import { BEDRIJF } from "@/lib/seo";

const CSS = `
  .jp-kop { position: relative; padding: 150px 24px 64px; background: radial-gradient(640px 320px at 85% 0%, rgba(155,203,108,0.10), transparent 70%), #F7F8F6; border-bottom: 1px solid #E5E7EB; }
  .jp-kop > div { max-width: 772px; margin: 0 auto; }
  .jp-kop .jp-oog { margin: 0 0 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .jp-kop h1 { margin: 0 0 14px; font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .jp-kop p { margin: 0; font-size: 16px; line-height: 1.7; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; text-wrap: balance; }
  .jp-tekst { max-width: 820px; margin: 0 auto; padding: 56px 24px 96px; font-family: var(--font-inter), system-ui, sans-serif; color: #1A1A1A; }
  .jp-tekst h2 { margin: 44px 0 12px; font-size: 21px; font-weight: 800; letter-spacing: -0.02em; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .jp-tekst h2:first-child { margin-top: 0; }
  .jp-tekst p, .jp-tekst li { font-size: 16px; line-height: 1.75; color: #3A3A3A; text-wrap: pretty !important; }
  .jp-tekst p { margin: 0 0 14px; }
  .jp-tekst ul { margin: 0 0 14px; padding-left: 22px; list-style: disc; }
  .jp-tekst li::marker { color: #9BCB6C; }
  .jp-tekst li { margin-bottom: 6px; }
  .jp-tekst a { color: #1A1A1A; font-weight: 600; text-decoration: underline; text-decoration-color: #9BCB6C; text-underline-offset: 3px; }
  .jp-tekst a:hover { color: #7AB54E; }
  .jp-tekst a:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; border-radius: 2px; }
  .jp-kaart { margin: 0 0 8px; padding: 22px 24px; border-radius: 16px; background: #F7F8F6; border: 1px solid #E5E7EB; }
  .jp-kaart p { margin: 0; }
  @media (max-width: 760px) { .jp-kop { padding: 120px 16px 48px; } .jp-tekst ul { padding-left: 18px; } .jp-tekst { padding: 40px 16px 72px; } }
`;

/** Gedeelde opmaak voor de privacyverklaring en de algemene voorwaarden. */
export default function JuridischePagina({ titel, intro, bijgewerkt, children }: { titel: string; intro: string; bijgewerkt: string; children: React.ReactNode }) {
  return (
    <PageLayout>
      <style>{CSS}</style>
      <header className="jp-kop">
        <div>
          <p className="jp-oog">MOS-X</p>
          <h1>{titel}</h1>
          <p>{intro}</p>
        </div>
      </header>
      <article className="jp-tekst">
        {children}
        <h2>Contact</h2>
        <div className="jp-kaart">
          <p>
            {BEDRIJF.naam}, ondernemingsnummer {BEDRIJF.ondernemingsnummer}
            <br />
            {BEDRIJF.vestigingen[0].straat}, {BEDRIJF.vestigingen[0].postcode} {BEDRIJF.vestigingen[0].gemeente}
            <br />
            <a href={`mailto:${BEDRIJF.email}`}>{BEDRIJF.email}</a> · <a href={`tel:${BEDRIJF.telefoonLink}`}>{BEDRIJF.telefoon}</a>
          </p>
        </div>
        <p style={{ marginTop: 28, fontSize: 14, color: "#8E8E89" }}>
          Laatst bijgewerkt op {bijgewerkt}. Zie ook onze <Link href={titel === "Privacyverklaring" ? "/algemene-voorwaarden" : "/privacyverklaring"}>{titel === "Privacyverklaring" ? "algemene voorwaarden" : "privacyverklaring"}</Link>.
        </p>
      </article>
    </PageLayout>
  );
}
