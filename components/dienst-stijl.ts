// Gedeelde opmaak voor de dienstpagina's (dakontmossen, dakcoaten)
export const DIENST_CSS = `
        .do-oog { margin: 0 0 14px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-h2 { margin: 0; font-size: clamp(1.9rem, 3.2vw, 2.6rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-h2 span { color: #9BCB6C; }
        .do-h1, .do-h2, .do-garantie h2, .do-cta h2 { text-wrap: balance; }
        .do-p, .do-antwoord p, .do-stap-tekst p { text-wrap: balance; }
        .do-p { margin: 0; font-size: 16.5px; line-height: 1.7; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .do-wrap { max-width: 1180px; margin: 0 auto; }
        .do-sectie { padding: 96px 24px; }
        .do-sectie { position: relative; isolation: isolate; overflow: hidden; }
        .do-sectie::before, .do-sectie::after { content: ""; position: absolute; z-index: -1; pointer-events: none; }
        .do-wit { background: #FFFFFF; }
        .do-wit::before { top: -180px; right: -160px; width: 620px; height: 620px; border-radius: 50%; background: radial-gradient(closest-side, rgba(155,203,108,0.10), transparent); }
        .do-zacht { background: #F7F8F6; }
        .do-zacht::before { left: -200px; bottom: -220px; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(closest-side, rgba(155,203,108,0.12), transparent); }
        .do-zacht::after { inset: 0; background-image: radial-gradient(rgba(94,143,56,0.14) 1px, transparent 1.3px); background-size: 22px 22px; -webkit-mask-image: radial-gradient(70% 60% at 100% 0%, #000, transparent 70%); mask-image: radial-gradient(70% 60% at 100% 0%, #000, transparent 70%); }
        .do-zacht + .do-wit, .do-wit + .do-zacht { border-top: 1px solid rgba(229,231,235,0.7); }
        .do-hero::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 64px; z-index: 0; background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201440%2080%22%20preserveAspectRatio%3D%22none%22%3E%3Cpath%20d%3D%22M0%2C0%20C360%2C80%201080%2C80%201440%2C0%20L1440%2C80%20L0%2C80%20Z%22%20fill%3D%22%23FFFFFF%22%2F%3E%3C%2Fsvg%3E") center bottom / 100% 100% no-repeat; pointer-events: none; }
        .do-kop { margin-bottom: 44px; display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
        .do-kop .do-p { max-width: 440px; }
        .do-knop { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 52px; padding: 0 24px; border-radius: 10px; border: 0; font-size: 15px; font-weight: 700; text-decoration: none; cursor: pointer; font-family: var(--font-montserrat), system-ui, sans-serif; transition: background-color .2s ease, border-color .2s ease, color .2s ease, transform .15s ease; }
        .do-knop:active { transform: translateY(1px); }
        .do-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
        .do-knop-g { background: #9BCB6C; color: #FFFFFF; box-shadow: 0 10px 24px -12px rgba(122,181,78,0.9); }
        .do-knop-g:hover { background: #7AB54E; }
        .do-knop-licht { background: #FFFFFF; color: #1A1A1A; border: 1px solid #CFE5B8; }
        .do-knop-licht:hover { background: #F2F8EC; border-color: #9BCB6C; }
        .do-knop-d { background: transparent; color: #FFFFFF; border: 1px solid rgba(155,203,108,0.5); }
        .do-knop-d:hover { border-color: #9BCB6C; color: #9BCB6C; }
        .do-donker .do-knop:focus-visible, .do-hero .do-knop:focus-visible { outline-color: #FFFFFF; }

        /* Hero */
        .do-hero { position: relative; overflow: hidden; isolation: isolate; padding: 150px 24px 140px; background: #0B0F0C; }
        .do-hero video { position: absolute; top: 0; right: 0; bottom: 0; width: 50%; height: 100%; object-fit: cover; z-index: -2; }
        .do-hero::before { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(to right, #0B0F0C 0%, #0B0F0C 50%, rgba(11,15,12,0.6) 66%, rgba(11,15,12,0.15) 100%), linear-gradient(to bottom, rgba(11,15,12,0.6), transparent 30%, transparent 75%, rgba(11,15,12,0.7)); }
        .do-hero-tekst { max-width: 600px; }
        .do-hero .do-p { max-width: 540px; }
        .do-kruimel { margin: 14px 0 26px; display: flex; align-items: center; gap: 4px; font-size: 13px; color: rgba(255,255,255,0.5); font-family: var(--font-inter), system-ui, sans-serif; }
        .do-kruimel a { color: rgba(255,255,255,0.75); text-decoration: none; transition: color .2s ease; }
        .do-kruimel a:hover { color: #9BCB6C; }
        .do-h1 { margin: 0 0 20px; font-size: clamp(2.1rem, 4vw, 3.25rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-h1 span { display: block; color: #9BCB6C; }
        .do-hero .do-p { color: rgba(255,255,255,0.72); margin-bottom: 32px; }
        .do-hero-knoppen { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 30px; }
        .do-hero-bewijs { display: flex; align-items: center; flex-wrap: wrap; gap: 12px 22px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.12); }
        .do-garantie-chip { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.8); font-family: var(--font-inter), system-ui, sans-serif; }
        .do-garantie-chip b { color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }

        /* Waarom */
        .do-waarom { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 64px; align-items: center; }
        .do-voordelen { margin: 32px 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .do-voordelen li { white-space: nowrap; display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; background: #F7F8F6; border: 1px solid #E5E7EB; font-size: 14.5px; font-weight: 700; line-height: 1.35; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-voordelen i { width: 40px; height: 40px; border-radius: 11px; flex: none; display: grid; place-items: center; background: #FFFFFF; border: 1px solid #E5E7EB; }
        .vd-acc { margin: 28px 0 0; padding: 0; list-style: none; display: grid; gap: 10px; }
        .vd-acc li { border-radius: 14px; background: #F7F8F6; border: 1px solid #E5E7EB; transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
        .vd-acc li.open { background: #FFFFFF; border-color: rgba(155,203,108,0.55); box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .vd-acc button { width: 100%; display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: none; border: 0; border-radius: 14px; cursor: pointer; text-align: left; font-size: 14.5px; font-weight: 700; line-height: 1.35; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .vd-acc button:hover .vd-pijl { color: #7AB54E; }
        .vd-acc button:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
        .vd-acc button:active { transform: scale(0.99); }
        .vd-acc i { width: 40px; height: 40px; border-radius: 11px; flex: none; display: grid; place-items: center; background: #FFFFFF; border: 1px solid #E5E7EB; }
        .vd-pijl { margin-left: auto; flex: none; color: #545454; transition: transform 0.25s ease, color 0.2s ease; }
        .vd-acc li.open .vd-pijl { transform: rotate(180deg); color: #9BCB6C; }
        .vd-tekst { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s ease; }
        .vd-acc li.open .vd-tekst { grid-template-rows: 1fr; }
        .vd-tekst > div { overflow: hidden; }
        .vd-tekst p { margin: 0; padding: 0 20px 16px 70px; font-size: 14.5px; line-height: 1.65; color: #545454; text-wrap: balance; font-family: var(--font-inter), system-ui, sans-serif; }
        @media (max-width: 560px) { .vd-tekst p { padding: 0 16px 16px; } .vd-acc button { gap: 12px; padding: 11px 14px; font-size: 14px; } .vd-acc i { width: 36px; height: 36px; border-radius: 10px; } }
        .do-slider { border-radius: 20px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -40px rgba(30,51,36,0.45); }

        .do-uitleg { margin-top: 24px; display: grid; gap: 16px; }
        .do-feiten { margin: 32px 0 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid #E5E7EB; }
        .do-feiten div { padding: 20px 16px 0 0; }
        .do-feiten div + div { padding-left: 20px; border-left: 1px solid #E5E7EB; }
        .do-feiten dt { font-size: clamp(1.25rem, 2vw, 1.6rem); font-weight: 800; letter-spacing: -0.02em; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-feiten dt { white-space: nowrap; }
        .do-feiten dd { margin: 2px 0 0; font-size: 14.5px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }

        /* Garantie */
        .do-garantie { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 40px; align-items: center; padding: 44px 48px; border-radius: 24px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .do-garantie .do-p, .do-uitleg .do-p { text-wrap: balance; }
        .do-zegel { width: 132px; height: 132px; border-radius: 50%; display: grid; place-items: center; text-align: center; background: radial-gradient(circle at 30% 25%, #B8DC94, #9BCB6C 60%); color: #FFFFFF; box-shadow: 0 0 0 8px rgba(155,203,108,0.15); font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-zegel b { display: block; font-size: 46px; font-weight: 800; line-height: 1; letter-spacing: -0.04em; }
        .do-zegel small { display: block; font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
        .do-garantie h2 { margin: 0 0 12px; font-size: clamp(1.4rem, 2.1vw, 1.75rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-garantie h2 span { color: #9BCB6C; }

        /* Werkwijze */
        .do-donker { position: relative; overflow: hidden; isolation: isolate; padding: 96px 24px; background: radial-gradient(700px 420px at 100% 0%, rgba(155,203,108,0.14), transparent 65%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 75%); }
        .do-werk { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 64px; align-items: start; }
        .do-werk-foto { position: sticky; top: 110px; border-radius: 20px; overflow: hidden; aspect-ratio: 4 / 5; box-shadow: 0 40px 80px -40px rgba(0,0,0,0.9); }
        .do-werk-foto img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .do-donker .do-h2 { color: #FFFFFF; }
        .do-donker .do-p { color: rgba(255,255,255,0.7); }
        .do-stappen { margin: 32px 0 28px; display: grid; gap: 10px; }
        .do-stap { border-radius: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: border-color .2s ease, background-color .2s ease; }
        .do-stap.open { border-color: rgba(155,203,108,0.5); background: rgba(155,203,108,0.08); }
        .do-stap button { width: 100%; display: grid; grid-template-columns: 40px minmax(0, 1fr) 20px; gap: 14px; align-items: center; padding: 14px 18px 14px 14px; background: none; border: 0; text-align: left; cursor: pointer; color: #FFFFFF; font-size: 16px; font-weight: 700; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-stap button:focus-visible { outline: 2px solid #FFFFFF; outline-offset: -2px; border-radius: 14px; }
        .do-stap-nr { width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center; font-size: 14px; font-weight: 800; color: #9BCB6C; border: 1px solid rgba(155,203,108,0.5); transition: background-color .2s ease, color .2s ease; }
        .do-stap.open .do-stap-nr { background: #9BCB6C; color: #0B0F0C; border-color: #9BCB6C; }
        .do-pijl { color: rgba(255,255,255,0.5); transition: transform .25s ease, color .2s ease; }
        .do-stap.open .do-pijl { transform: rotate(180deg); color: #9BCB6C; }
        .do-stap-tekst { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; }
        .do-stap.open .do-stap-tekst { grid-template-rows: 1fr; }
        .do-stap-tekst > div { overflow: hidden; }
        .do-stap-tekst p { margin: 0; padding: 0 20px 18px 68px; font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.72); font-family: var(--font-inter), system-ui, sans-serif; }

        /* Daktypes */
        .do-types { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
        .do-type { position: relative; aspect-ratio: 16 / 10; border-radius: 16px; overflow: hidden; }
        .do-type img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s ease; }
        .do-type:hover img { transform: scale(1.04); }
        .do-type::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(11,15,12,0.75), transparent 55%); }
        .do-type span { position: absolute; left: 18px; bottom: 16px; z-index: 1; font-size: 16px; font-weight: 700; color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-asbest { margin-top: 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px 32px; flex-wrap: wrap; padding: 20px 24px; border-radius: 16px; background: #F7F8F6; border: 1px solid #E5E7EB; }
        .do-asbest > div { display: flex; align-items: center; gap: 16px; }
        .do-asbest > div:first-child { flex: 1 1 320px; min-width: 0; }
        .do-asbest i { width: 44px; height: 44px; border-radius: 12px; flex: none; display: grid; place-items: center; background: #FFFFFF; border: 1px solid #E5E7EB; }
        .do-asbest b { display: block; font-size: 15px; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-asbest small { display: block; margin-top: 2px; font-size: 14px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }

        /* Resultaten */
        .do-resultaten { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
        .do-resultaat { border-radius: 16px; overflow: hidden; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .do-resultaat div:last-child { padding: 16px 20px 18px; }
        .do-resultaat b { display: block; font-size: 16px; font-weight: 800; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-resultaat small { display: block; margin-top: 2px; font-size: 13.5px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }

        /* FAQ */
        .do-faq { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: start; }
        .do-vraag { border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB; transition: border-color .2s ease; }
        .do-vraag.open { border-color: #CFE5B8; }
        .do-vraag button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 20px 22px; background: none; border: 0; text-align: left; cursor: pointer; font-size: 15px; font-weight: 700; line-height: 1.4; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-vraag button:hover { color: #7AB54E; }
        .do-vraag button:focus-visible { outline: 2px solid #1A1A1A; outline-offset: -2px; border-radius: 16px; }
        .do-vraag button svg { flex: none; color: #9BCB6C; transition: transform .25s ease; }
        .do-vraag.open button svg { transform: rotate(180deg); }
        .do-antwoord { padding: 0 22px 20px; }
        .do-antwoord p { margin: 0 0 10px; font-size: 15px; line-height: 1.7; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .do-vink { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; font-size: 15px; color: #1A1A1A; font-family: var(--font-inter), system-ui, sans-serif; }
        .do-faq-meer { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding: 16px 22px; border-radius: 16px; background: #F7F8F6; border: 1px solid #E5E7EB; }
        .do-faq-meer b { font-size: 15px; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-faq-meer .do-knop { height: 44px; padding: 0 18px; font-size: 14px; }

        /* Afsluiter */
        .do-cta { padding: 48px 56px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; gap: 32px; flex-wrap: wrap; background: radial-gradient(600px 300px at 100% 100%, rgba(155,203,108,0.18), transparent 70%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 75%); box-shadow: 0 28px 70px -30px rgba(11,15,12,0.6); }
        .do-cta h2 { margin: 0 0 8px; font-size: clamp(1.6rem, 2.8vw, 2.2rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.028em; color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .do-cta h2 span { color: #9BCB6C; }
        .do-cta p { margin: 0; font-size: 16px; color: rgba(255,255,255,0.7); font-family: var(--font-inter), system-ui, sans-serif; }
        .do-cta-knoppen { display: flex; gap: 10px; flex-wrap: wrap; }
        .do-cta .do-knop:focus-visible { outline-color: #FFFFFF; }

        @media (max-width: 1180px) and (min-width: 961px) {
          .do-voordelen { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 760px) { .do-voordelen { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 960px) {
          .do-garantie { position: relative; overflow: hidden; display: grid; justify-items: center; text-align: center; gap: 0; max-width: 820px; margin: 0 auto; padding: 52px 48px 48px; border-radius: 28px; color: #FFFFFF; background: radial-gradient(520px 300px at 50% 0%, rgba(155,203,108,0.22), transparent 70%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 80%); box-shadow: 0 30px 70px -30px rgba(11,15,12,0.6); border: 1px solid rgba(155,203,108,0.35); }
          .do-zegel { width: 112px; height: 112px; margin-bottom: 22px; border-radius: 50%; display: grid; place-items: center; text-align: center; background: radial-gradient(circle at 30% 25%, #B8DC94, #9BCB6C 60%); color: #0B0F0C; box-shadow: 0 0 0 8px rgba(155,203,108,0.15), 0 0 0 16px rgba(155,203,108,0.07); font-family: var(--font-montserrat), system-ui, sans-serif; }
          .do-zegel b { display: block; font-size: 42px; font-weight: 800; line-height: 1; letter-spacing: -0.04em; }
          .do-zegel small { display: block; margin-top: 2px; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
          .do-garantie h2 { margin: 0 0 12px; font-size: clamp(1.6rem, 2.6vw, 2.1rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.028em; color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }
          .do-garantie .do-oog { color: #B9DE95; }
          .do-garantie .do-p { margin: 0 auto 28px !important; max-width: 520px !important; color: rgba(255,255,255,0.72); }
          .do-garantie .do-knop:focus-visible { outline-color: #FFFFFF; }
          .do-zegel { width: 124px; height: 124px; margin-bottom: 26px; background: rgba(155,203,108,0.1); border: 2px solid #9BCB6C; color: #FFFFFF; box-shadow: 0 0 0 10px rgba(155,203,108,0.06), 0 18px 40px -18px rgba(155,203,108,0.55); }
          .do-zegel b { font-size: 52px; letter-spacing: -0.05em; }
          .do-zegel small { margin-top: 6px; font-size: 11px; letter-spacing: 0.24em; color: #9BCB6C; }
          .do-zegel .zg-x { display: none; }
          .do-garantie .do-p { max-width: 310px !important; font-size: 15.5px; line-height: 1.7; text-wrap: balance; }
          .do-garantie { grid-template-columns: minmax(0, 1fr); padding: 40px 22px 36px; border-radius: 22px; }
          .do-sectie, .do-donker { padding: 72px 16px; }
          .do-hero { padding: 120px 16px 96px; }
          .do-hero::after { height: 36px; }
          .do-hero video { width: 100%; }
          .do-hero::before { background: linear-gradient(to bottom, rgba(11,15,12,0.92), rgba(11,15,12,0.82) 50%, rgba(11,15,12,0.95)); }
          .do-waarom, .do-werk { grid-template-columns: minmax(0, 1fr); gap: 40px; }
          .do-werk-foto { position: relative; top: 0; aspect-ratio: 16 / 10; }
          .do-types, .do-resultaten { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .do-resultaten { grid-template-columns: minmax(0, 1fr); }
          .do-faq { grid-template-columns: minmax(0, 1fr); }
          .do-cta { padding: 36px 24px; }
        }
        @media (max-width: 560px) {
          .do-garantie h2 span { display: block; }
          .do-feiten dd { font-size: 12.5px !important; }
          .do-feiten div { padding-right: 10px; }
          .do-feiten div + div { padding-left: 12px; }
          .do-feiten dt { font-size: 1.15rem; }
          .do-feiten dd { font-size: 13px; }
          .do-voordelen { grid-template-columns: minmax(0, 1fr); }
          .do-types { gap: 10px; }
          .do-type span { left: 12px; bottom: 10px; font-size: 14px; }
          .do-stap-tekst p { padding-left: 20px; }
          .do-hero-knoppen .do-knop, .do-cta-knoppen, .do-cta-knoppen .do-knop { width: 100%; }
        }
      `;
