/** Gedeelde opmaak voor de behandelingspagina's (MOS-MAX, MOS-PLUS). */
export const COATING_CSS = `
  .dc-res { border-radius: 16px; overflow: hidden; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
  .dc-knoppen { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  .dc-knoppen-midden { justify-content: center; margin-top: 44px; }
  .do-knop-licht:hover { border-color: #9BCB6C; box-shadow: 0 8px 20px -12px rgba(122,181,78,0.6); }
  .do-knop-licht:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
  .do-knop:active { transform: translateY(1px); }
  @media (max-width: 640px) {
    .dc-knoppen { flex-direction: column; }
    .dc-knoppen .do-knop { width: 100%; }
    .dc-knoppen-midden { margin-top: 32px; }
  }
  .dc-nu-p, .dc-acc-tekst p, .do-stap-tekst p { text-wrap: pretty; }
  .dc-hero .do-p, .dc-mx-intro, .dc-eind-p, .dc-bel p { text-wrap: balance; }
  .dc-mv-item .dc-acc-tekst .dc-faq-p { white-space: pre-line; padding-left: 24px; }
  @media (max-width: 640px) { .dc-mv-item .dc-acc-tekst .dc-faq-p { padding-left: 18px; } }
  .dc-faq-cta { padding: 0 24px 22px; }
  .dc-faq-cta .do-knop { height: 44px; font-size: 14px; }
  .dc-faq-meer { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 10px; padding: 16px 16px 16px 24px; border-radius: 12px; background: #F7F8F6; border: 1px solid #E5E7EB; }
  .dc-faq-meer b { font: 700 15px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
  .dc-faq-meer .do-knop { height: 44px; padding: 0 18px; font-size: 14px; }

  .dc-eind { position: relative; isolation: isolate; overflow: hidden; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); align-items: stretch; border-radius: 24px;
    background: radial-gradient(520px 320px at 0% 100%, rgba(155,203,108,0.16), transparent 70%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 75%);
    border: 1px solid rgba(155,203,108,0.3); box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -36px rgba(11,15,12,0.65); }
  .dc-eind-tekst { position: relative; z-index: 1; padding: 56px 24px 52px 56px; }
  .dc-eind h2 { margin: 0; font: 800 clamp(1.7rem, 2.9vw, 2.4rem)/1.12 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.028em; color: #FFFFFF; text-wrap: balance; }
  .dc-eind h2 span { color: #9BCB6C; white-space: nowrap; }
  .dc-eind-p { margin: 16px 0 0; max-width: 460px; font: 400 16.5px/1.65 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.75); text-wrap: pretty; }
  .dc-eind-lijst { margin: 22px 0 0; padding: 0; list-style: none; display: grid; gap: 10px; }
  .dc-eind-lijst li { display: flex; align-items: center; gap: 10px; font: 500 15px var(--font-inter), system-ui, sans-serif; color: #FFFFFF; }
  .dc-eind-lijst svg { flex: none; width: 22px; height: 22px; padding: 4px; border-radius: 50%; background: #9BCB6C; color: #FFFFFF; }
  .dc-eind-knoppen { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
  .dc-eind-hoofd { height: 58px !important; padding: 0 30px !important; font-size: 17px !important; }
  .dc-eind-knoppen .do-knop-d { height: 58px; }
  .dc-eind-score { margin-top: 22px; }
  .dc-eind-media { position: relative; min-height: 100%; margin-left: -18%; }
  .dc-eind-foto { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
  .dc-eind-media { -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.35) 22%, #000 55%); mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.35) 22%, #000 55%); }
  @media (max-width: 900px) {
    .dc-eind { grid-template-columns: minmax(0, 1fr); }
    .dc-eind-media { order: -1; height: 230px; min-height: 0; margin-left: 0; }
    .dc-eind-media { -webkit-mask-image: linear-gradient(180deg, #000 50%, transparent 100%); mask-image: linear-gradient(180deg, #000 50%, transparent 100%); }
    .dc-eind-tekst { padding: 8px 22px 34px; }
    .dc-eind-knoppen { flex-direction: column; }
    .dc-eind-knoppen .do-knop { width: 100%; justify-content: center; }
  }
  @media (max-width: 640px) {
    .dc-faq-meer { flex-direction: column; align-items: stretch; text-align: center; padding: 18px; }
    .dc-faq-cta { padding: 0 18px 20px; }
  }
  .dc-mv-kop { text-align: center; margin: 0 auto 44px; }
  .dc-mv-kop .do-h2 { text-align: center; }
  .dc-mv { max-width: 820px; margin: 0 auto; display: grid; gap: 10px; }
  .dc-mv-item { border-radius: 12px; background: #FFFFFF; border: 1px solid #E5E7EB; transition: border-color .2s ease, box-shadow .2s ease; }
  .dc-mv-item:hover { border-color: #CFE5B8; }
  .dc-mv-item.open { border-color: #9BCB6C; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 18px 40px -24px rgba(30,51,36,0.35); }
  .dc-mv-item button { width: 100%; display: flex; align-items: center; gap: 14px; padding: 20px 24px; background: none; border: 0; border-radius: 12px; cursor: pointer; text-align: left;
    font: 700 15.5px/1.4 var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; }
  .dc-mv-item button:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
  .dc-mv-item button:active { transform: translateY(1px); }
  .dc-mv-q { flex: 1; min-width: 0; }
  .dc-mv-q i { font-style: normal; font-weight: 800; color: #9BCB6C; }
  .dc-mv-q i:first-child { margin-right: 8px; }
  .dc-mv-q i:last-child { margin-left: 6px; }
  .dc-mv-plus { flex: none; position: relative; width: 16px; height: 16px; color: #1A1A1A; }
  .dc-mv-plus::before, .dc-mv-plus::after { content: ""; position: absolute; left: 0; top: 7px; width: 16px; height: 2px; border-radius: 2px; background: currentColor; transition: transform .25s ease; }
  .dc-mv-plus::after { transform: rotate(90deg); }
  .dc-mv-item.open .dc-mv-plus { color: #9BCB6C; }
  .dc-mv-item.open .dc-mv-plus::after { transform: rotate(0deg); }
  .dc-mv-item .dc-acc-tekst p { margin: 0; padding: 0 28px 22px 50px; font: 400 15px/1.7 var(--font-inter), system-ui, sans-serif; color: #545454; text-wrap: pretty; }
  @media (max-width: 640px) {
    .dc-mv-item button { padding: 18px 18px; font-size: 14.5px; }
    .dc-mv-item .dc-acc-tekst p { padding: 0 18px 20px 18px; font-size: 14.5px; }
  }


  .zk-spin { animation: dc-spin 1s linear infinite; }
  @keyframes dc-spin { to { transform: rotate(360deg); } }
  .dc-hero::after { display: none; }
  .dc-dkb .dkb-buiten { padding-top: 88px !important; }
  @media (max-width: 767px) { .dc-dkb .dkb-buiten { padding-top: 56px !important; } }
  .dc-mw-grid { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 64px; align-items: center; }
  .dc-mw-foto { display: block; width: 100%; max-width: 460px; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 20px; justify-self: end;
    border: 1px solid rgba(155,203,108,0.35); box-shadow: 0 30px 60px -30px rgba(0,0,0,0.6); }
  .dc-mw-kader { max-width: 620px; }
  .dc-mw-kader .do-oog { font-size: 11px; letter-spacing: .14em; margin-bottom: 10px; }
  .dc-mw-titel { white-space: nowrap; font-size: clamp(1.35rem, 2.05vw, 2.05rem); }
  @media (max-width: 960px) {
    .dc-mw-grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
    .dc-mw-foto { justify-self: center; max-width: 420px; aspect-ratio: 4 / 3; }
    .dc-mw-titel { font-size: 4.55vw; letter-spacing: -0.03em; }
  }
  .dc-mx-intro { margin-top: 16px; max-width: 560px; color: rgba(255,255,255,0.75) !important; }
  .dc-nu-kop { display: flex; flex-direction: column; align-items: center; text-align: center; margin: 0 auto 40px; }
  .dc-nu-kop .do-h2, .dc-nu-kop .do-p { text-align: center; margin-left: auto; margin-right: auto; }
  .dc-nu-kop .do-p { margin-top: 14px; }
  @media (max-width: 760px) { .dc-nu-kop { margin-bottom: 28px; } }
  .dc-nu-titel { white-space: nowrap; font-size: clamp(1.5rem, 2.6vw, 2.1rem); }
  @media (max-width: 760px) { .dc-nu-titel { white-space: normal; font-size: clamp(1.45rem, 6.4vw, 1.75rem); text-wrap: balance; } }
  .dc-nu { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
  .dc-nu-kaart { overflow: hidden; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); transition: transform .25s ease, box-shadow .25s ease; }
  .dc-nu-kaart:hover { transform: translateY(-4px); box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 26px 50px -28px rgba(30,51,36,0.45); }
  .dc-nu-kaart img { display: block; width: 100%; aspect-ratio: 3 / 2; object-fit: cover; }
  .dc-nu { align-items: start; }
  .dc-nu-knop { width: 100%; display: flex; align-items: center; gap: 14px; padding: 22px 22px 22px 24px; background: none; border: 0; cursor: pointer; text-align: left; }
  .dc-nu-knop:focus-visible { outline: 2px solid #9BCB6C; outline-offset: -4px; border-radius: 12px; }
  .dc-nu-knop:hover h3 { color: #7AB54E; }
  .dc-nu-knop .do-pijl { flex-shrink: 0; margin-left: auto; color: #9BCB6C; transition: transform .25s ease; }
  .dc-nu-kaart.open .do-pijl { transform: rotate(180deg); }
  .dc-nu-kaart.open .dc-acc-tekst { grid-template-rows: 1fr; }
  .dc-nu-p { margin: 0 !important; padding: 0 26px 24px 58px; font: 400 15px/1.65 var(--font-inter), system-ui, sans-serif !important; color: #545454; text-wrap: pretty; }
  .dc-nu-nr { flex-shrink: 0; font: 700 13px var(--font-montserrat), system-ui, sans-serif; color: #9BCB6C; }
  .dc-nu-knop h3 { margin: 0; white-space: nowrap; transition: color .2s ease; font: 800 17px/1.3 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.015em; color: #1A1A1A; }
  @media (max-width: 1180px) { .dc-nu { grid-template-columns: minmax(0, 1fr); max-width: 520px; margin: 0 auto; } }
  .dc-hero .do-oog { margin-top: 12px; margin-bottom: 18px; }
  .dc-hero .do-hero-tekst { max-width: 720px; }
  .dc-h1 { margin-bottom: 26px; font-size: clamp(2.2rem, 4.2vw, 3.6rem); line-height: 1.06; }
  .dc-h1 b { display: block; font-weight: inherit; white-space: nowrap; }
  .dc-h1 em { font-style: normal; color: #9BCB6C; }
  @media (max-width: 640px) { .dc-h1 { font-size: clamp(1.9rem, 9.6vw, 2.5rem); } }
  .dc-hero .do-p { margin-bottom: 30px; }
  .dc-hero .do-hero-knoppen { margin-bottom: 40px; }
  .dc-hero-vink { list-style: none; margin: 0 0 36px; padding: 0; display: grid; gap: 14px; }
  .dc-hero-vink li { display: flex; align-items: center; gap: 10px; font-size: 15.5px; color: rgba(255,255,255,0.85); font-family: var(--font-inter), system-ui, sans-serif; }
  .dc-hero-vink i { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: #9BCB6C; color: #FFFFFF; flex-shrink: 0; }

  .dc-info { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 64px; align-items: center; }
  .dc-acc { margin-top: 26px; border-top: 1px solid #E5E7EB; }
  .dc-acc-item { border-bottom: 1px solid #E5E7EB; }
  .dc-acc-item button { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 2px; background: none; border: 0; cursor: pointer; text-align: left;
    font: 700 17px var(--font-montserrat), system-ui, sans-serif; color: #1A1A1A; letter-spacing: -0.01em; transition: color .2s ease; }
  .dc-acc-item button:hover { color: #7AB54E; }
  .dc-acc-item button:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; border-radius: 6px; }
  .dc-acc-item .do-pijl { flex-shrink: 0; color: #9BCB6C; transition: transform .25s ease; }
  .dc-acc-item.open .do-pijl { transform: rotate(180deg); }
  .dc-acc-tekst { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; }
  .dc-acc-item.open .dc-acc-tekst { grid-template-rows: 1fr; }
  .dc-mv-item.open .dc-acc-tekst { grid-template-rows: 1fr; }
  .dc-acc-tekst > div { overflow: hidden; }
  .dc-acc-tekst p { margin: 0 0 14px; font: 400 15.5px/1.7 var(--font-inter), system-ui, sans-serif; color: #545454; }
  .dc-acc-tekst .do-knop { margin: 0 0 20px; height: 44px; font-size: 14px; }

  .dc-bel { position: sticky; top: 110px; overflow: hidden; isolation: isolate; padding: 190px 28px 28px; border-radius: 20px; background: #0B0F0C; color: #FFFFFF; text-align: center; border-top: 4px solid #9BCB6C;
    box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 30px 60px -30px rgba(11,15,12,0.6); }
  .dc-bel::before { content: ""; position: absolute; z-index: -1; top: 0; left: 0; right: 0; height: 250px;
    background: linear-gradient(to bottom, rgba(11,15,12,0.05) 0%, rgba(11,15,12,0.55) 55%, #0B0F0C 100%), url("/images/dakcontrole.webp") center 22% / cover no-repeat; }
  .dc-bel-oog { margin: 0 0 10px; font: 700 12px var(--font-montserrat), system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #9BCB6C; }
  .dc-bel h3 { margin: 0 0 10px; white-space: nowrap; font: 800 clamp(17px, 1.55vw, 21px)/1.2 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.025em; }
  @media (max-width: 960px) { .dc-bel h3 { font-size: clamp(16px, 5.2vw, 21px); } }
  .dc-bel-sub { margin: 0 0 22px; font: 400 14px/1.6 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.7); }
  .dc-bel input { width: 100%; box-sizing: border-box; height: 48px; margin-bottom: 10px; padding: 0 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.16); background: rgba(255,255,255,0.06);
    color: #FFFFFF; font: 400 15px var(--font-inter), system-ui, sans-serif; transition: border-color .2s ease; }
  .dc-bel input::placeholder { color: rgba(255,255,255,0.45); }
  .dc-bel input:focus { outline: none; border-color: #9BCB6C; }
  .dc-bel .do-knop { width: 100%; }
  .dc-bel-of { margin: 14px 0; font: 400 13px var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.5); }
  .dc-bel-tel { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; color: #FFFFFF; text-decoration: none; font: 700 15px var(--font-montserrat), system-ui, sans-serif; }
  .dc-bel-tel:hover { color: #9BCB6C; }
  .dc-bel-ok { padding: 18px 0; font: 600 15px/1.6 var(--font-inter), system-ui, sans-serif; color: #FFFFFF; }



  @media (max-width: 960px) {
    .dc-info { grid-template-columns: minmax(0, 1fr); gap: 36px; }
    .dc-bel { position: static; }
  }
  @media (max-width: 560px) {
    .dc-knoppen .do-knop { width: 100%; }
  }
`;
