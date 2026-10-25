import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DAKKLEUREN } from "@/lib/dakkleuren";

/** Homepage: opvallende banner die naar de dakkleur-tool op /dakkleur leidt. */
export default function SiteDakkleurBanner() {
  return (
    <section className="dkb-buiten">
    <div className="dkb">
      <style>{`
        .dkb-buiten { padding: 88px 24px 100px; background: linear-gradient(#F7F8F6, #FFFFFF 160px); }
        .dkb { position: relative; overflow: hidden; isolation: isolate; max-width: 1180px; margin: 0 auto; padding: 96px 24px; border-radius: 28px; border: 1px solid rgba(155,203,108,0.5); box-shadow: 0 28px 80px -30px rgba(11,15,12,0.55); background: #0B0F0C url("/images/Na bevel.jpg") center 40% / cover no-repeat; }
        .dkb::before { content: ""; position: absolute; inset: 0; z-index: -1; background: radial-gradient(800px 420px at 50% 50%, rgba(11,15,12,0.55), transparent 75%), linear-gradient(180deg, rgba(11,15,12,0.9) 0%, rgba(14,24,17,0.8) 45%, rgba(11,15,12,0.95) 100%); }
        .dkb::after { content: ""; position: absolute; inset: 0; z-index: -1; background: radial-gradient(700px 300px at 50% 100%, rgba(155,203,108,0.18), transparent 70%); pointer-events: none; }
        .dkb-decor { position: absolute; inset: 0; z-index: -1; display: flex; justify-content: center; align-items: center; gap: 24px; padding: 0 24px; pointer-events: none; }
        .dkb-mock { border-radius: 26px; background: rgba(255,255,255,0.9); box-shadow: 0 40px 80px -30px rgba(0,0,0,0.8); opacity: 0.2; filter: blur(1px); }
        .dkb-palet { width: 300px; height: 330px; padding: 26px 24px; }
        .dkb-palet p { margin: 0 0 18px; text-align: center; font-size: 12px; font-weight: 800; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dkb-palet div { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 12px; justify-items: center; }
        .dkb-palet i { width: 34px; height: 34px; border-radius: 50%; }
        .dkb-palet b { display: block; height: 6px; width: 44px; margin: 6px auto 0; border-radius: 3px; background: #D9DED5; }
        .dkb-scherm { width: 640px; height: 330px; padding: 22px; display: grid; grid-template-columns: 150px 1fr; gap: 20px; }
        .dkb-lijst { display: grid; align-content: start; gap: 12px; padding-top: 6px; }
        .dkb-lijst span { display: flex; align-items: center; gap: 10px; }
        .dkb-lijst i { width: 22px; height: 22px; border-radius: 50%; flex: none; }
        .dkb-lijst b { height: 7px; flex: 1; border-radius: 4px; background: #D9DED5; }
        .dkb-foto { position: relative; border-radius: 14px; overflow: hidden; background: url("/images/Na bevel.jpg") center / cover; }
        .dkb-foto::before { content: ""; position: absolute; inset: 0; background: url("/images/Before bevel.jpg") center / cover; clip-path: inset(0 50% 0 0); }
        .dkb-foto::after { content: ""; position: absolute; top: 0; bottom: 0; left: 50%; width: 3px; margin-left: -1.5px; background: #fff; }

        .dkb-inhoud { position: relative; max-width: 860px; margin: 0 auto; text-align: center; color: #fff; }
        .dkb-oog { display: inline-flex; align-items: center; gap: 8px; margin: 0 0 22px; padding: 7px 14px; border-radius: 999px; background: rgba(155,203,108,0.14); border: 1px solid rgba(155,203,108,0.45); color: #9BCB6C; font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; font-family: var(--font-montserrat), system-ui, sans-serif; backdrop-filter: blur(6px); }
        .dkb-titel { margin: 0 0 20px; font-size: clamp(2rem, 4.4vw, 3.4rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.028em; font-family: var(--font-montserrat), system-ui, sans-serif; text-shadow: 0 4px 30px rgba(0,0,0,0.45); }
        .dkb-titel span { display: block; color: #9BCB6C; }
        .dkb-tekst { margin: 0 auto 34px; max-width: 560px; font-size: 18px; line-height: 1.65; color: rgba(255,255,255,0.82); font-family: var(--font-inter), system-ui, sans-serif; text-wrap: balance; }
        .dkb-knop { display: inline-flex; align-items: center; gap: 8px; height: 54px; padding: 0 28px; border-radius: 10px; background: #9BCB6C; color: #fff; font-size: 15px; font-weight: 700; text-decoration: none; font-family: var(--font-montserrat), system-ui, sans-serif; box-shadow: 0 14px 34px -12px rgba(155,203,108,0.75); transition: background-color .2s ease, transform .15s ease; }
        .dkb-knop:hover { background: #7AB54E; }
        .dkb-knop:active { transform: translateY(1px); }
        .dkb-knop:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
        .dkb-kleuren { margin-top: 30px; display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 13px; color: rgba(255,255,255,0.6); font-family: var(--font-inter), system-ui, sans-serif; }
        .dkb-kleuren i { width: 22px; height: 22px; border-radius: 50%; box-shadow: 0 0 0 2px rgba(255,255,255,0.85); }
        .dkb-kleuren span { display: flex; gap: 8px; }

        @media (max-width: 1100px) { .dkb-palet { display: none; } }
        @media (max-width: 767px) {
          .dkb-buiten { padding: 56px 16px 72px; }
          .dkb { padding: 72px 20px; border-radius: 22px; }
          .dkb-scherm { width: 92%; height: 300px; grid-template-columns: 1fr; }
          .dkb-lijst { display: none; }
          .dkb-tekst { font-size: 16px; }
          .dkb-knop { height: 52px; padding: 0 22px; }
        }
      `}</style>

      <div className="dkb-decor" aria-hidden="true">
        <div className="dkb-mock dkb-palet">
          <p>Kies je dakkleur</p>
          <div>{[...DAKKLEUREN, DAKKLEUREN[1]].map((k, i) => <span key={i}><i style={{ background: k.hex, display: "block" }} /><b /></span>)}</div>
        </div>
        <div className="dkb-mock dkb-scherm">
          <div className="dkb-lijst">{DAKKLEUREN.map((k) => <span key={k.id}><i style={{ background: k.hex }} /><b /></span>)}</div>
          <div className="dkb-foto" />
        </div>
      </div>

      <div className="dkb-inhoud">
        <h2 className="dkb-titel">Benieuwd hoe je dak eruitziet <span>in een nieuwe kleur?</span></h2>
        <p className="dkb-tekst">Upload een foto van je woning, kies een coatingkleur en onze AI toont meteen het resultaat. Gratis en vrijblijvend.</p>
        <Link href="/dakkleur" className="dkb-knop">Probeer de dakkleur-tool<ChevronRight size={18} /></Link>
        <div className="dkb-kleuren">
          <span>{DAKKLEUREN.map((k) => <i key={k.id} style={{ background: k.hex }} />)}</span>
          7 kleuren uit ons coatinggamma
        </div>
      </div>
    </div>
    </section>
  );
}
