import type { Metadata } from "next";
import { MessageCircle, ShieldCheck } from "lucide-react";
import PageLayout from "@/components/page-layout";
import LinkAanvraag from "@/components/klantenzone/link-aanvraag";

export const metadata: Metadata = {
  title: "Klantenzone | MOS-X",
  description: "Volg je dakwerken, je dakdossier, je garantie en je onderhoud in je persoonlijke klantenzone van MOS-X.",
  robots: { index: false, follow: true },
};

/** Ingang van de klantenzone op de website: klanten vragen hier hun persoonlijke link opnieuw aan. */
export default function KlantenzoneIngang() {
  return (
    <PageLayout>
      <style>{`
        .kz-link { position: relative; padding: 140px 16px 96px; background: radial-gradient(900px 480px at 90% 0%, rgba(155,203,108,0.12), transparent 60%), #F7F8F6; }
        .kz-link-kaart { max-width: 560px; margin: 0 auto; padding: 36px; border-radius: 20px; background: #fff; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .kz-link-oog { margin: 0; font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #7AB54E; }
        .kz-link-titel { margin: 8px 0 0; font-family: var(--font-montserrat), system-ui, sans-serif; font-weight: 800; font-size: clamp(26px, 5vw, 34px); line-height: 1.15; letter-spacing: -0.028em; color: #1A1A1A; }
        .kz-link-sub { margin: 12px 0 24px; font-size: 16px; line-height: 1.6; color: #545454; }
        .kz-link-rij { display: flex; gap: 8px; flex-wrap: wrap; }
        .kz-link-invoer { flex: 1 1 220px; min-width: 0; height: 48px; padding: 0 16px; border-radius: 12px; border: 1px solid #E5E7EB; background: #F7F8F6; font-size: 15px; color: #1A1A1A; }
        .kz-link-invoer:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 1px; background: #fff; }
        .kz-link-knop { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 20px; border: 0; border-radius: 12px; background: #9BCB6C; color: #fff; font-weight: 700; font-size: 15px; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(122,181,78,0.8); transition: background-color .15s ease, transform .15s ease; }
        .kz-link-knop:hover { background: #7AB54E; }
        .kz-link-knop:active { transform: translateY(1px); }
        .kz-link-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }
        .kz-link-knop:disabled { opacity: .7; cursor: default; }
        .kz-link-ok { padding: 16px 18px; border-radius: 12px; background: #EEF6E6; border: 1px solid #CFE5B8; }
        .kz-link-punten { list-style: none; margin: 28px 0 0; padding: 22px 0 0; border-top: 1px solid #E5E7EB; display: grid; gap: 12px; }
        .kz-link-punten li { display: flex; gap: 10px; align-items: flex-start; font-size: 14.5px; line-height: 1.5; color: #545454; }
        .kz-link-punten svg { flex: none; margin-top: 2px; color: #7AB54E; }
        .kz-link-punten a { color: #3F6B22; font-weight: 700; text-decoration: none; }
        .kz-link-punten a:hover { text-decoration: underline; }
        @media (max-width: 560px) { .kz-link { padding-top: 110px; } .kz-link-kaart { padding: 24px 20px; } .kz-link-knop { flex: 1 1 100%; } }
      `}</style>
      <section className="kz-link">
        <div className="kz-link-kaart">
          <p className="kz-link-oog">Klantenzone</p>
          <h1 className="kz-link-titel">Volg je dak, op één plek</h1>
          <p className="kz-link-sub">
            Je werken, je dakdossier, je garantie en je onderhoud. Elke klant van MOS-X krijgt een persoonlijke link. Kwijt? Vul je e-mailadres in en je krijgt hem opnieuw.
          </p>
          <LinkAanvraag />
          <ul className="kz-link-punten">
            <li><ShieldCheck size={18} /> <span>Je link is enkel voor jou. Deel hem niet met anderen.</span></li>
            <li><MessageCircle size={18} /> <span>Liever even bellen? <a href="tel:+32468352869" style={{ whiteSpace: "nowrap" }}>+32 468 35 28 69</a></span></li>
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
