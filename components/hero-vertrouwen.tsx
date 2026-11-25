import { GOOGLE_REVIEWS_URL } from "@/components/google-balk";

/** Vertrouwensregel onder de knoppen van een donkere hero: VTM + Google, zoals op de homepage. */
export default function HeroVertrouwen({ licht = false }: { licht?: boolean }) {
  return (
    <div className={licht ? "hvr hvr-licht" : "hvr"}>
      <style>{`
        .hvr { padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.12); }
        .hvr-titel { margin: 0 0 10px; font: 500 13px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .02em; color: rgba(255,255,255,0.6); }
        .hvr-rij { display: flex; align-items: center; gap: 12px 26px; flex-wrap: wrap; color: rgba(255,255,255,0.75); }
        .hvr-item { display: inline-flex; align-items: center; gap: 8px; color: inherit; text-decoration: none; white-space: nowrap; transition: color .2s ease; }
        .hvr-item .vtm { font: 900 20px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.04em; }
        .hvr-item .prog b { font: 800 12px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .08em; }
        .hvr-item .prog i { font: italic 400 14px Georgia, serif; }
        .hvr-google b { font: 800 15px var(--font-montserrat), system-ui, sans-serif; }
        .hvr-google .st { letter-spacing: 1px; font-size: 13px; }
        .hvr-google .n { font: 600 13px var(--font-inter), system-ui, sans-serif; }
        .hvr-google:hover { color: #FFFFFF; }
        .hvr-google:hover .st { color: #F5B300; }
        .hvr-google:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 4px; border-radius: 6px; }
        .hvr-lijn { width: 1px; height: 24px; background: rgba(255,255,255,0.22); }
        .hvr-licht { border-top-color: #E5E7EB; }
        .hvr-licht .hvr-titel { color: #545454; }
        .hvr-licht .hvr-rij { color: #1A1A1A; }
        .hvr-licht .hvr-lijn { background: #E5E7EB; }
        .hvr-licht .hvr-google .st { color: #F5B300; }
        .hvr-licht .hvr-google:hover { color: #7AB54E; }
        @media (max-width: 480px) { .hvr-lijn { display: none; } .hvr-rij { gap: 10px 18px; } }
      `}</style>
      <p className="hvr-titel">Bekend van tv, geliefd bij onze klanten</p>
      <div className="hvr-rij">
        <span className="hvr-item" aria-label="Gezien op VTM in Lifestyle en Wonen">
          <span className="vtm">vtm</span>
          <span className="prog"><b>LIFESTYLE</b> <i>&amp; Wonen</i></span>
        </span>
        <span className="hvr-lijn" aria-hidden="true" />
        <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="hvr-item hvr-google" aria-label="5,0 op 5 sterren, 16 Google-reviews">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/></svg>
          <b>5,0</b><span className="st" aria-hidden="true">★★★★★</span><span className="n">16 Google-reviews</span>
        </a>
      </div>
    </div>
  );
}
