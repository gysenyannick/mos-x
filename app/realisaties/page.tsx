"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronRight, Phone } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import BeforeAfterSlider from "@/components/before-after-slider";
import Realisatieboek from "@/components/realisatieboek";
import GoogleBalk from "@/components/google-balk";

const projecten = [
  {
    titel: "Dakreiniging en dakcoating",
    plaats: "Herentals",
    voor: "/images/herentals-voor.png",
    na: "/images/herentals-na.png",
    kenmerken: ["Betonpannen", "120 m²", "2 dagen"],
  },
  {
    titel: "Dakreiniging en antimos",
    plaats: "Olen",
    voor: "/images/olen-voor.png",
    na: "/images/olen-na.png",
    kenmerken: ["Keramische pannen", "200 m²", "2 dagen"],
  },
  {
    titel: "Dakreiniging en dakcoating",
    plaats: "Bevel",
    voor: "/images/Before bevel.jpg",
    na: "/images/Na bevel.jpg",
    kenmerken: ["Betonpannen", "200 m²", "2 dagen"],
  },
];

const feed = [
  { src: "/images/IMG_5898.JPEG", pos: "center 30%" },
  { src: "/images/15.JPEG", pos: "center" },
  { src: "/images/IMG_4496.JPEG", pos: "center" },
  { src: "/images/koningshooikt-na.jpg", pos: "center" },
  { src: "/images/12.jpg", pos: "center" },
  { src: "/images/IMG_4584 Vooraanzicht dakcoating.JPEG", pos: "center" },
];

const INSTAGRAM = "https://www.instagram.com/mosx.be/";

function InstaIcoon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function RealisatiesPage() {
  return (
    <PageLayout>
      <style>{`
        .rz-oog { margin: 0 0 14px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .rz-h2 { margin: 0; font-size: clamp(1.9rem, 3.2vw, 2.6rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .rz-h2 span { color: #9BCB6C; }
        .rz-p { margin: 0; font-size: 16.5px; line-height: 1.7; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .rz-knop { display: inline-flex; align-items: center; gap: 8px; height: 52px; padding: 0 24px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; font-family: var(--font-montserrat), system-ui, sans-serif; transition: background-color .2s ease, border-color .2s ease, color .2s ease, transform .15s ease; }
        .rz-knop:active { transform: translateY(1px); }
        .rz-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
        .rz-knop-g { background: #9BCB6C; color: #FFFFFF; box-shadow: 0 10px 24px -12px rgba(122,181,78,0.9); }
        .rz-knop-g:hover { background: #7AB54E; }
        .rz-knop-l { background: #FFFFFF; color: #1A1A1A; border: 1px solid #CFE5B8; }
        .rz-knop-l:hover { background: #F2F8EC; border-color: #9BCB6C; }

        /* Hero */
        .rz-hero { padding: 132px 24px 72px; background: radial-gradient(700px 420px at 100% 0%, rgba(155,203,108,0.10), transparent 65%), #F7F8F6; }
        .rz-hero-raster { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; align-items: center; }
        .rz-kruimel { margin: 14px 0 22px; display: flex; align-items: center; gap: 4px; font-size: 13px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }
        .rz-kruimel a { color: #1A1A1A; text-decoration: none; transition: color .2s ease; }
        .rz-kruimel a:hover { color: #7AB54E; }
        .rz-h1 { margin: 0 0 18px; font-size: clamp(2.2rem, 4.6vw, 3.6rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .rz-h1 span { display: block; color: #9BCB6C; }
        .rz-hero-foto { position: relative; aspect-ratio: 5 / 4; border-radius: 20px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -40px rgba(30,51,36,0.45); }
        .rz-hero-foto img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .rz-hero-label { position: absolute; left: 16px; bottom: 16px; padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.94); font-size: 13px; font-weight: 600; color: #1A1A1A; font-family: var(--font-inter), system-ui, sans-serif; }

        .rz-bewijs { margin-top: 28px; padding-top: 24px; border-top: 1px solid #E5E7EB; display: flex; align-items: center; flex-wrap: wrap; gap: 12px 22px; font-size: 14.5px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .rz-bewijs b { color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }

        /* Voor en na */
        .rz-vn { padding: 96px 24px; background: #FFFFFF; }
        .rz-kop { max-width: 1180px; margin: 0 auto 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
        .rz-kop .rz-p { max-width: 440px; }
        .rz-projecten { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
        .rz-project { border-radius: 16px; overflow: hidden; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .rz-project-info { padding: 18px 20px 20px; }
        .rz-project h3 { margin: 0 0 2px; font-size: 16px; font-weight: 800; letter-spacing: -0.01em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .rz-project small { display: block; margin-bottom: 14px; font-size: 13.5px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }
        .rz-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .rz-chips span { padding: 5px 10px; border-radius: 8px; background: #F7F8F6; border: 1px solid #E5E7EB; font-size: 12.5px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }

        /* Instagram */
        .rz-ig { padding: 96px 24px; background: #F7F8F6; }
        .rz-ig-raster { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 64px; align-items: center; }
        .rz-profiel { margin: 28px 0; display: flex; align-items: center; gap: 14px; }
        .rz-avatar { width: 58px; height: 58px; border-radius: 50%; padding: 3px; background: #9BCB6C; flex: none; }
        .rz-avatar span { display: grid; place-items: center; width: 100%; height: 100%; border-radius: 50%; background: #FFFFFF; border: 2px solid #F7F8F6; }
        .rz-avatar img { width: 38px; height: auto; display: block; }
        .rz-profiel b { display: block; font-size: 15.5px; font-weight: 800; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .rz-profiel small { font-size: 13.5px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .rz-feed { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .rz-tegel { position: relative; aspect-ratio: 4 / 5; border-radius: 12px; overflow: hidden; display: block; background: #E5E7EB; }
        .rz-tegel img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s ease; }
        .rz-tegel::after { content: ""; position: absolute; inset: 0; background: rgba(11,15,12,0.35); opacity: 0; transition: opacity .25s ease; }
        .rz-tegel i { position: absolute; inset: 0; z-index: 1; display: grid; place-items: center; color: #FFFFFF; opacity: 0; transition: opacity .25s ease; }
        .rz-tegel:hover img { transform: scale(1.05); }
        .rz-tegel:hover::after, .rz-tegel:hover i { opacity: 1; }
        .rz-tegel:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }

        /* Afsluiter */
        .rz-cta { padding: 96px 24px; background: #FFFFFF; }
        .rz-cta-kaart { max-width: 1180px; margin: 0 auto; padding: 48px 56px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; gap: 32px; flex-wrap: wrap; background: radial-gradient(600px 300px at 100% 100%, rgba(155,203,108,0.18), transparent 70%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 75%); box-shadow: 0 28px 70px -30px rgba(11,15,12,0.6); }
        .rz-cta-kaart h2 { margin: 0 0 8px; font-size: clamp(1.6rem, 2.8vw, 2.2rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.028em; color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .rz-cta-kaart h2 span { color: #9BCB6C; }
        .rz-cta-kaart p { margin: 0; font-size: 16px; color: rgba(255,255,255,0.7); font-family: var(--font-inter), system-ui, sans-serif; }
        .rz-cta-knoppen { display: flex; gap: 10px; flex-wrap: wrap; }
        .rz-knop-d { background: transparent; color: #FFFFFF; border: 1px solid rgba(155,203,108,0.5); }
        .rz-knop-d:hover { border-color: #9BCB6C; color: #9BCB6C; }
        .rz-cta .rz-knop:focus-visible { outline-color: #FFFFFF; }

        @media (max-width: 960px) {
          .rz-hero { padding: 112px 16px 56px; }
          .rz-hero-raster, .rz-ig-raster { grid-template-columns: minmax(0, 1fr); gap: 36px; }
          .rz-vn, .rz-ig, .rz-cta { padding: 72px 16px; }
          .rz-projecten { grid-template-columns: minmax(0, 1fr); }
          .rz-cta-kaart { padding: 36px 24px; }
        }
        @media (max-width: 520px) {
          .rz-feed { gap: 6px; }
          .rz-cta-knoppen, .rz-cta-knoppen .rz-knop { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Hero */}
      <section className="rz-hero">
        <div className="rz-hero-raster">
          <div>
            <BackLink href="/" />
            <p className="rz-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" />Realisaties</p>
            <h1 className="rz-h1">Onze realisaties <span>spreken voor zich.</span></h1>
            <p className="rz-p">Het resultaat van onze werven. Blader door ons realisatieboek of bekijk hieronder een paar recente projecten.</p>
            <div className="rz-bewijs">
              <GoogleBalk />
              <span><b>150+</b> afgewerkte daken</span>
            </div>
          </div>
          <div className="rz-hero-foto">
            <img src="/images/17.JPEG" alt="Afgewerkt dak na dakreiniging en coating" />
            <span className="rz-hero-label">Dakreiniging en dakcoating</span>
          </div>
        </div>
      </section>

      {/* Realisatieboek */}
      <Realisatieboek />

      {/* Voor en na */}
      <section className="rz-vn">
        <div className="rz-kop">
          <div>
            <p className="rz-oog">Voor en na</p>
            <h2 className="rz-h2">Recente <span>projecten.</span></h2>
          </div>
          <p className="rz-p">Schuif over de foto om het verschil te zien.</p>
        </div>
        <div className="rz-projecten">
          {projecten.map((p) => (
            <article key={p.plaats} className="rz-project">
              <BeforeAfterSlider beforeSrc={p.voor} afterSrc={p.na} borderRadius="0" aspectRatio="4/3" />
              <div className="rz-project-info">
                <h3>{p.titel}</h3>
                <small>{p.plaats}</small>
                <div className="rz-chips">{p.kenmerken.map((k) => <span key={k}>{k}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Instagram */}
      <section className="rz-ig">
        <div className="rz-ig-raster">
          <div>
            <p className="rz-oog">Instagram</p>
            <h2 className="rz-h2">Meer realisaties <span>op Instagram.</span></h2>
            <div className="rz-profiel">
              <span className="rz-avatar"><span><img src="/images/logo.avif" alt="" /></span></span>
              <div><b>@mosx.be</b><small>Nieuwe werven, elke week</small></div>
            </div>
            <p className="rz-p" style={{ marginBottom: 28 }}>Voor en na, werven in beeld en tips voor een verzorgd dak. Volg ons en zie elke week nieuwe daken.</p>
            <a className="rz-knop rz-knop-g" href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><InstaIcoon />Volg ons op Instagram</a>
          </div>
          <div className="rz-feed">
            {feed.map((f) => (
              <a key={f.src} className="rz-tegel" href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Bekijk op Instagram">
                <img src={f.src} alt="" loading="lazy" style={{ objectPosition: f.pos }} />
                <i><ArrowUpRight size={26} /></i>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Afsluiter */}
      <section className="rz-cta">
        <div className="rz-cta-kaart">
          <div>
            <h2>Wordt jouw dak <span>het volgende?</span></h2>
            <p>Ontvang binnen 1 minuut een persoonlijke richtprijs.</p>
          </div>
          <div className="rz-cta-knoppen">
            <Link className="rz-knop rz-knop-g mx-glow" href="/#calculator">Bereken je richtprijs<ChevronRight size={17} /></Link>
            <a className="rz-knop rz-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
