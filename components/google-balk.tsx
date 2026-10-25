"use client";

import { useEffect, useRef } from "react";

export const GOOGLE_REVIEWS_URL = "https://www.google.com/search?sca_esv=bcc915fd4b92abab&rlz=1C1GCEU_enBE1139BE1139&hl=nl-BE&sxsrf=ANbL-n6TrSUrDpAkVOrNUQ51U5GNZs9b_Q:1781020093012&q=MOS-X+%7C+Dakontmossing+%26+Coating+Reviews&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qORc7vib1r0gQO2ABjRXpl_uRZy99-xBVdTGpP89RMUA3yzcvCK6A2AazedCdjGkX1gn8bkQ%3D&uds=ALYpb_mOSBfVE_qjsUIUDwhXk-cv8R5BmJbdPhES1TRqg_vpjJyijAOWQNUWx-ymHj1rypkaCI5vDZLjKLW1ObrTyqmMebN8NP7CqX96tO1wgBatLBTT6ccEki20RIqT8UXa_cZv3U6K&sa=X&ved=2ahUKEwiuju3vwPqUAxVNRaQEHUolF-wQ3PALegQIMBAF&biw=1920&bih=911&dpr=1";

function GoogleG() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** Dezelfde Google-balk als in de hero van de homepage: Trustindex-widget op desktop, compacte badge op gsm. */
export default function GoogleBalk() {
  const widget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = widget.current;
    if (!el || el.querySelector('script[src*="trustindex"]')) return;
    const s = document.createElement("script");
    s.async = true;
    s.defer = true;
    s.src = "https://cdn.trustindex.io/loader.js?1b15ba67596980480f76d1d0d69";
    el.appendChild(s);
  }, []);

  return (
    <>
      <style>{`
        .gb-widget { display: inline-flex; align-items: center; overflow: hidden; height: 34px; padding: 0 8px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .gb-widget > div { display: inline-block; zoom: 0.78; flex-shrink: 0; }
        .gb-mini { display: none; align-items: center; gap: 6px; height: 32px; padding: 0 10px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 9px; text-decoration: none; white-space: nowrap; transition: border-color .2s ease; }
        .gb-mini:hover { border-color: #9BCB6C; }
        .gb-mini:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }
        .gb-mini b { font-size: 12.5px; font-weight: 800; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .gb-mini i { font-style: normal; font-size: 11px; color: #F5B300; letter-spacing: -1px; }
        .gb-mini span { font-size: 12px; font-weight: 600; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        @media (max-width: 767px) {
          .gb-widget { display: none; }
          .gb-mini { display: inline-flex; }
        }
      `}</style>
      <a className="gb-mini" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" aria-label="5,0 op Google, 16 reviews">
        <GoogleG /><b>5.0</b><i aria-hidden="true">★★★★★</i><span>16 reviews</span>
      </a>
      <div className="gb-widget"><div ref={widget} /></div>
    </>
  );
}
