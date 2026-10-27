/** Opmaak van de kennisbank (overzicht en artikels). */
export const KENNISBANK_CSS = `
  .kb-kop { position: relative; padding: 150px 24px 72px; background: radial-gradient(700px 360px at 85% 0%, rgba(155,203,108,0.12), transparent 70%), #F7F8F6; border-bottom: 1px solid #E5E7EB; }
  .kb-kop-in { max-width: 1132px; margin: 0 auto; }
  .kb-kruimel { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 22px; font-size: 13.5px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }
  .kb-kruimel a { color: #545454; text-decoration: none; }
  .kb-kruimel a:hover { color: #7AB54E; }
  .kb-kruimel a:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; border-radius: 2px; }
  .kb-oog { margin: 0 0 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .kb-kop h1 { max-width: 820px; margin: 0 0 16px; font-size: clamp(2rem, 4.2vw, 3rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; text-wrap: balance; }
  .kb-kop h1 span { color: #9BCB6C; }
  .kb-kop p.kb-intro { max-width: 680px; margin: 0; font-size: 17px; line-height: 1.7; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; text-wrap: pretty !important; }

  /* Overzicht */
  .kb-groep { max-width: 1180px; margin: 0 auto; padding: 72px 24px 0; }
  .kb-groep:last-of-type { padding-bottom: 96px; }
  .kb-groep-kop { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 26px; }
  .kb-groep h2 { margin: 0 0 6px; font-size: clamp(1.5rem, 2.4vw, 1.9rem); font-weight: 800; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .kb-groep-kop p { margin: 0; font-size: 15.5px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
  .kb-kaarten { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
  .kb-kaarten.vier { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .kb-kaart { display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); text-decoration: none; transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
  .kb-kaart:hover { transform: translateY(-3px); border-color: #CFE5B8; box-shadow: 0 18px 40px -20px rgba(26,40,20,0.35), 0 2px 16px rgba(0,0,0,0.07); }
  .kb-kaart:active { transform: translateY(-1px); }
  .kb-kaart:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 3px; }
  .kb-kaart img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; display: block; background: #F7F8F6; }
  .kb-kaart div { padding: 18px 20px 22px; display: grid; gap: 8px; }
  .kb-kaart b { font-size: 17px; line-height: 1.3; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; text-wrap: balance; }
  .kb-kaart small { font-size: 14px; line-height: 1.55; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; text-wrap: pretty; }
  .kb-kaart em { font-style: normal; font-size: 13.5px; font-weight: 700; color: #7AB54E; font-family: var(--font-montserrat), system-ui, sans-serif; }

  /* Artikel */
  .kb-raster { max-width: 1180px; margin: 0 auto; padding: 56px 24px 24px; display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 56px; align-items: start; }
  .kb-beeld { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 16px; display: block; margin-bottom: 36px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); background: #F7F8F6; }
  .kb-tekst { font-family: var(--font-inter), system-ui, sans-serif; color: #1A1A1A; }
  .kb-tekst h2 { margin: 40px 0 12px; font-size: clamp(1.3rem, 2vw, 1.55rem); font-weight: 800; line-height: 1.25; letter-spacing: -0.022em; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .kb-tekst h2:first-of-type { margin-top: 0; }
  .kb-tekst p, .kb-tekst li { font-size: 17px; line-height: 1.75; color: #333333; text-wrap: pretty !important; }
  .kb-tekst p { margin: 0 0 14px; }
  .kb-tekst ul { margin: 0 0 14px; padding-left: 22px; list-style: disc; }
  .kb-tekst li { margin-bottom: 8px; }
  .kb-tekst li::marker { color: #9BCB6C; }
  .kb-faq { margin-top: 48px; padding-top: 8px; }
  .kb-faq details { border-bottom: 1px solid #E5E7EB; }
  .kb-faq summary { list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 0; cursor: pointer; font-size: 16.5px; font-weight: 700; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .kb-faq summary::-webkit-details-marker { display: none; }
  .kb-faq summary::after { content: "+"; flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: #F7F8F6; color: #7AB54E; font-size: 20px; font-weight: 600; transition: transform .2s ease; }
  .kb-faq details[open] summary::after { transform: rotate(45deg); }
  .kb-faq summary:hover { color: #7AB54E; }
  .kb-faq summary:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 4px; border-radius: 4px; }
  .kb-faq details p { margin: 0 0 18px; }

  .kb-cta { position: sticky; top: 110px; padding: 28px; border-radius: 20px; color: #FFFFFF; background: radial-gradient(360px 220px at 100% 0%, rgba(155,203,108,0.24), transparent 70%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 85%); box-shadow: 0 30px 60px -30px rgba(11,15,12,0.6); font-family: var(--font-inter), system-ui, sans-serif; }
  .kb-cta .kb-oog { color: #B9DE95; }
  .kb-cta b { display: block; margin: 0 0 10px; font-size: 22px; line-height: 1.2; letter-spacing: -0.02em; font-family: var(--font-montserrat), system-ui, sans-serif; text-wrap: balance; }
  .kb-cta p { margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.75); text-wrap: pretty !important; }
  .kb-knop { display: flex; align-items: center; justify-content: center; gap: 8px; height: 50px; padding: 0 20px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; white-space: nowrap; font-family: var(--font-montserrat), system-ui, sans-serif; transition: background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .15s ease; }
  .kb-knop + .kb-knop { margin-top: 10px; }
  .kb-knop:active { transform: translateY(1px); }
  .kb-knop:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 3px; }
  .kb-knop-g { background: #9BCB6C; color: #FFFFFF; box-shadow: 0 10px 24px -12px rgba(122,181,78,0.9); }
  .kb-knop-g:hover { background: #7AB54E; box-shadow: 0 14px 28px -12px rgba(122,181,78,0.95); }
  .kb-knop-l { border: 1px solid rgba(255,255,255,0.22); color: #FFFFFF; }
  .kb-knop-l:hover { border-color: #9BCB6C; background: rgba(155,203,108,0.1); }

  .kb-verwant { max-width: 1180px; margin: 0 auto; padding: 56px 24px 96px; }
  .kb-verwant h2 { margin: 0 0 22px; font-size: clamp(1.4rem, 2.2vw, 1.75rem); font-weight: 800; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }

  @media (max-width: 1000px) {
    .kb-raster { grid-template-columns: minmax(0, 1fr); gap: 40px; }
    .kb-cta { position: static; }
    .kb-kaarten, .kb-kaarten.vier { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 640px) {
    .kb-kop { padding: 118px 16px 48px; }
    .kb-groep { padding: 56px 16px 0; }
    .kb-groep-kop { display: block; }
    .kb-kaarten, .kb-kaarten.vier { grid-template-columns: minmax(0, 1fr); gap: 16px; }
    .kb-raster { padding: 36px 16px 16px; }
    .kb-tekst p, .kb-tekst li { font-size: 16.5px; }
    .kb-beeld { margin-bottom: 28px; }
    .kb-verwant { padding: 40px 16px 72px; }
    .kb-cta { padding: 24px 20px; }
  }
`;
