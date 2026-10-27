import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, ChevronLeft, FileText, Images, MessageCircle } from "lucide-react";
import LinkAanvraag from "@/components/klantenzone/link-aanvraag";

export const metadata: Metadata = {
  title: "Klantenzone",
  description: "Log in op je klantenzone van MOS-X: je planning, foto's van de werken, je documenten, garantie en onderhoud.",
  robots: { index: false, follow: true },
};

/** Ingang van de klantenzone: klanten vragen hier hun persoonlijke link opnieuw aan. */
export default function KlantenzoneIngang() {
  return (
    <main className="kzl">
      <style>{`
        .kzl { min-height: 100vh; min-height: 100dvh; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); background: #FFFFFF; font-family: var(--font-inter), system-ui, sans-serif; }

        .kzl-foto { position: relative; overflow: hidden; display: flex; align-items: flex-end; padding: 56px; background: #0F1A12 url("/images/yannick-op-dak-srgb.JPEG") center 28% / cover no-repeat; color: #FFFFFF; }
        .kzl-foto::before { content: ""; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(11,15,12,0.05) 30%, rgba(15,26,18,0.72) 62%, #0F1A12 96%); }
        .kzl-foto > div { position: relative; max-width: 520px; }
        .kzl-foto img { display: block; height: 46px; width: auto; margin-bottom: 28px; }
        .kzl-foto h2 { margin: 0 0 22px; font-size: clamp(2rem, 3.4vw, 2.9rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.03em; font-family: var(--font-montserrat), system-ui, sans-serif; text-wrap: balance; }
        .kzl-foto h2 span { display: block; color: #9BCB6C; }
        .kzl-punten { margin: 0; padding: 0; list-style: none; display: grid; gap: 12px; }
        .kzl-punten li { display: flex; align-items: center; gap: 12px; font-size: 16px; color: rgba(255,255,255,0.86); }
        .kzl-punten i { width: 34px; height: 34px; flex: none; display: grid; place-items: center; border-radius: 10px; background: rgba(155,203,108,0.16); border: 1px solid rgba(155,203,108,0.35); }

        .kzl-form { position: relative; display: flex; align-items: center; justify-content: center; padding: 96px 48px; background: radial-gradient(640px 380px at 100% 0%, rgba(155,203,108,0.10), transparent 70%), #FFFFFF; }
        .kzl-terug { position: absolute; top: 32px; left: 40px; display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px 8px 8px; border-radius: 10px; font-size: 14px; font-weight: 600; color: #545454; text-decoration: none; transition: background-color .2s ease, color .2s ease; }
        .kzl-terug:hover { background: #F7F8F6; color: #1A1A1A; }
        .kzl-terug:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
        .kzl-kaart { width: 100%; max-width: 420px; }
        .kzl-oog { margin: 0 0 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .kzl-kaart h1 { margin: 0 0 12px; font-size: clamp(2rem, 3vw, 2.5rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .kzl-uitleg { margin: 0 0 32px; font-size: 16px; line-height: 1.65; color: #545454; text-wrap: pretty; }

        .kzl .kz-link-rij { display: grid; gap: 12px; }
        .kzl .kz-link-invoer { width: 100%; box-sizing: border-box; height: 54px; padding: 0 16px; border-radius: 12px; border: 1px solid #E5E7EB; background: #F7F8F6; font-size: 16px; color: #1A1A1A; transition: border-color .2s ease, background-color .2s ease, box-shadow .2s ease; }
        .kzl .kz-link-invoer:hover { border-color: #CFE5B8; }
        .kzl .kz-link-invoer:focus { outline: none; border-color: #9BCB6C; background: #FFFFFF; box-shadow: 0 0 0 3px rgba(155,203,108,0.22); }
        .kzl .kz-link-knop { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 54px; border: 0; border-radius: 12px; background: #9BCB6C; color: #FFFFFF; font-size: 16px; font-weight: 700; cursor: pointer; font-family: var(--font-montserrat), system-ui, sans-serif; box-shadow: 0 12px 26px -14px rgba(122,181,78,0.95); transition: background-color .2s ease, transform .15s ease, box-shadow .2s ease; }
        .kzl .kz-link-knop:hover { background: #7AB54E; box-shadow: 0 16px 30px -14px rgba(122,181,78,1); }
        .kzl .kz-link-knop:active { transform: translateY(1px); }
        .kzl .kz-link-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }
        .kzl .kz-link-knop:disabled { opacity: .7; cursor: default; }
        .kzl .kz-link-ok { padding: 18px 20px; border-radius: 14px; background: #EEF6E6; border: 1px solid #CFE5B8; }

        .kzl-hulp { display: flex; align-items: center; gap: 10px; margin-top: 28px; padding-top: 22px; border-top: 1px solid #E5E7EB; font-size: 14.5px; color: #545454; }
        .kzl-hulp a { color: #1A1A1A; font-weight: 700; text-decoration: underline; text-decoration-color: #9BCB6C; text-underline-offset: 3px; }
        .kzl-hulp a:hover { color: #7AB54E; }
        .kzl-hulp a:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; border-radius: 3px; }

        @media (max-width: 900px) {
          .kzl { grid-template-columns: minmax(0, 1fr); }
          .kzl-foto { min-height: 360px; padding: 28px 20px; background-position: 40% 62%; }
          .kzl-foto img { height: 38px; margin-bottom: 18px; }
          .kzl-punten { display: none; }
          .kzl-foto h2 { margin: 0; }
          .kzl-form { padding: 32px 20px 56px; align-items: flex-start; }
          .kzl-terug { position: static; margin: 0 0 24px -8px; }
          .kzl-form { flex-direction: column; justify-content: flex-start; }
        }
      `}</style>

      <section className="kzl-foto" aria-label="Welkom">
        <div>
          <img src="/images/logo-footer-wit.png" alt="MOS-X" />
          <h2>Welkom in <span>je klantenzone.</span></h2>
          <ul className="kzl-punten">
            <li><i><CalendarCheck size={17} color="#9BCB6C" /></i>Je planning en afspraken</li>
            <li><i><Images size={17} color="#9BCB6C" /></i>Foto&apos;s van je werken, voor en na</li>
            <li><i><FileText size={17} color="#9BCB6C" /></i>Je documenten en garantie</li>
          </ul>
        </div>
      </section>

      <section className="kzl-form">
        <Link href="/" className="kzl-terug"><ChevronLeft size={18} />Terug naar de website</Link>
        <div className="kzl-kaart">
          <p className="kzl-oog">Klantenzone</p>
          <h1>Inloggen</h1>
          <p className="kzl-uitleg">Je klantenzone opent met je persoonlijke link. Vul je e-mailadres in, dan sturen we die meteen opnieuw.</p>
          <LinkAanvraag />
          <p className="kzl-hulp">
            <MessageCircle size={18} color="#9BCB6C" aria-hidden="true" />
            <span>Lukt het niet? <a href="https://wa.me/32468352869" target="_blank" rel="noopener noreferrer">Stuur ons een WhatsApp</a></span>
          </p>
        </div>
      </section>
    </main>
  );
}
