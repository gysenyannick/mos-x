"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarCheck, ChevronRight, Euro, House, Mail, MapPin, Palette, Phone, ShieldCheck } from "lucide-react";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";
import MosAchtergrond from "@/components/mos-achtergrond";

function WhatsAppIcoon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Eén keuze in de kaart "Waar ben je naar op zoek?". */
function Optie({ icoon, titel, sub, href, onClick, start = false, extern = false }: {
  icoon: React.ReactNode; titel: string; sub: string; href?: string; onClick?: () => void; start?: boolean; extern?: boolean;
}) {
  const inhoud = (
    <>
      <span className="ct-icoon">{icoon}</span>
      <span className="ct-optie-tekst"><b>{titel}</b><small>{sub}</small></span>
      <ChevronRight size={18} className="ct-pijl" aria-hidden="true" />
    </>
  );
  const klasse = start ? "ct-optie ct-optie-start" : "ct-optie";
  if (onClick) return <button type="button" className={klasse} onClick={onClick}>{inhoud}</button>;
  if (extern) return <a className={klasse} href={href} target="_blank" rel="noopener noreferrer">{inhoud}</a>;
  return <Link className={klasse} href={href!}>{inhoud}</Link>;
}

export default function SiteContact() {
  const [bezoekOpen, setBezoekOpen] = useState(false);

  return (
    <>
    <section id="contact" className="ct">
      <style>{`
        .ct { position: relative; isolation: isolate; overflow: hidden; padding: 104px 24px; background: radial-gradient(620px 520px at 78% 50%, rgba(155,203,108,0.14), transparent 70%), radial-gradient(600px 420px at 0% 100%, rgba(155,203,108,0.07), transparent 65%), linear-gradient(180deg, #FFFFFF 0%, #FBFCFA 100%); }
        .ct-raster { max-width: 1140px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 72px; align-items: center; }
        .ct-oog { margin: 0 0 14px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ct-titel { margin: 0 0 20px; font-size: clamp(2rem, 3.6vw, 2.9rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ct-titel span { display: block; color: #9BCB6C; }
        .ct-tekst { margin: 0 0 40px; max-width: 470px; font-size: 17px; line-height: 1.7; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .ct-gegevens { display: grid; gap: 24px; margin: 0 0 40px; padding: 0; list-style: none; }
        .ct-gegevens li { display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 16px; align-items: start; }
        .ct-blok { width: 44px; height: 44px; border-radius: 12px; background: #EEF6E6; color: #9BCB6C; display: grid; place-items: center; }
        .ct-gegevens b { display: block; margin-bottom: 2px; font-size: 17px; font-weight: 800; letter-spacing: -0.01em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ct-gegevens div > span, .ct-gegevens a { display: block; font-size: 15.5px; line-height: 1.55; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .ct-gegevens a { color: #9BCB6C; font-weight: 600; text-decoration: none; transition: color .2s ease; }
        .ct-gegevens a:hover { color: #1A1A1A; }
        .ct-gegevens a:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; border-radius: 4px; }
        .ct-gegevens small { display: block; font-size: 13.5px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }
        .ct-bewijs { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding-top: 28px; border-top: 1px solid #E5E7EB; font-size: 14.5px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .ct-bewijs > span { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
        .ct-bewijs b { color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ct-bewijs i { width: 1px; height: 22px; background: #E5E7EB; }
        .ct-sterren { color: #9BCB6C; letter-spacing: 2px; }

        .ct-kaart { border-radius: 20px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); overflow: hidden; }
        .ct-kop { padding: 28px 30px 22px; border-bottom: 1px solid #E5E7EB; }
        .ct-kop h3 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.028em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ct-kop p { margin: 6px 0 0; font-size: 14.5px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .ct-lijst { padding: 8px 22px 24px; background: #F7F8F6; }
        .ct-groep { display: flex; align-items: center; gap: 12px; margin: 18px 4px 10px; font-size: 11.5px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E89; font-family: var(--font-montserrat), system-ui, sans-serif; }
                .ct-groep-start { color: #9BCB6C; }
        .ct-opties { display: grid; gap: 10px; }
        .ct-optie { width: 100%; display: grid; grid-template-columns: 46px minmax(0, 1fr) 18px; gap: 16px; align-items: center; padding: 14px 18px 14px 14px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB; text-align: left; text-decoration: none; color: inherit; cursor: pointer; font: inherit; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: border-color .2s ease, box-shadow .2s ease, transform .15s ease; }
        .ct-optie:hover { border-color: #9BCB6C; box-shadow: 0 10px 24px -14px rgba(30,51,36,0.35); transform: translateY(-1px); }
        .ct-optie:active { transform: translateY(0); }
        .ct-optie:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }
        .ct-icoon { width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center; background: #F7F8F6; color: #1A1A1A; border: 1px solid #E5E7EB; }
        .ct-optie-tekst b { display: block; font-size: 15.5px; font-weight: 700; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .ct-optie-tekst small { display: block; margin-top: 2px; font-size: 13.5px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .ct-pijl { color: #8E8E89; transition: transform .2s ease, color .2s ease; }
        .ct-optie:hover .ct-pijl { color: #7AB54E; transform: translateX(3px); }
        .ct-optie-start { border-color: #CFE5B8; }
        .ct-optie-start .ct-icoon { background: #9BCB6C; border-color: #9BCB6C; color: #FFFFFF; }
        .ct-optie-start .ct-pijl { color: #9BCB6C; }

        @media (max-width: 960px) {
          .ct { padding: 72px 20px; }
          .ct-raster { grid-template-columns: minmax(0, 1fr); gap: 44px; }
          .ct-tekst { max-width: none; }
        }
        @media (max-width: 520px) {
          .ct-kop { padding: 24px 20px 20px; }
          .ct-lijst { padding: 4px 12px 18px; }
          .ct-optie { grid-template-columns: 42px minmax(0, 1fr) 16px; gap: 12px; padding: 12px 14px 12px 12px; }
          .ct-icoon { width: 42px; height: 42px; }
          .ct-bewijs { font-size: 13.5px; }
          .ct-bewijs i { display: none; }
        }
      `}</style>

      <MosAchtergrond hoek="rechtsonder" />
      <div className="ct-raster">
        <div>
          <p className="ct-oog">Contact</p>
          <h2 className="ct-titel">Klaar voor een <span>verzorgd dak?</span></h2>
          <p className="ct-tekst">Vragen, een richtprijs of een plaatsbezoek? Kies hiernaast wat je zoekt, of neem rechtstreeks contact met ons op.</p>
          <ul className="ct-gegevens">
            <li>
              <span className="ct-blok"><MapPin size={20} /></span>
              <div>
                <b>Onze vestigingen</b>
                <span>Pastorijstraat 47, 2590 Berlaar</span>
                <span>Bovenpad 100, 2280 Grobbendonk</span>
              </div>
            </li>
            <li>
              <span className="ct-blok"><Mail size={20} /></span>
              <div><b>E-mail</b><a href="mailto:info@mos-x.be">info@mos-x.be</a></div>
            </li>
            <li>
              <span className="ct-blok"><Phone size={20} /></span>
              <div><b>Telefoon</b><a href="tel:+32468352869">+32 468 35 28 69</a><small>Ma - za: 08:00 - 17:00 · zo: gesloten</small></div>
            </li>
          </ul>
          <div className="ct-bewijs">
            <span><span className="ct-sterren" aria-hidden="true">★★★★★</span><b>5,0</b> op Google</span>
            <i aria-hidden="true" />
            <span><ShieldCheck size={18} color="#9BCB6C" aria-hidden="true" /><b>10 jaar</b> garantie</span>
          </div>
        </div>

        <div className="ct-kaart">
          <div className="ct-kop">
            <h3>Waar ben je naar op zoek?</h3>
            <p>We helpen je graag verder.</p>
          </div>
          <div className="ct-lijst">
            <p className="ct-groep">Ontdekken</p>
            <div className="ct-opties">
              <Optie icoon={<Euro size={20} />} titel="Wat kost mijn dak?" sub="Bereken je richtprijs in 1 minuut" href="/#calculator" />
              <Optie icoon={<Palette size={20} />} titel="Zie mijn dak in een nieuwe kleur" sub="Upload een foto van je huis" href="/dakkleur" />
            </div>

            <p className="ct-groep ct-groep-start">Klaar om te starten</p>
            <div className="ct-opties">
              <Optie start icoon={<CalendarCheck size={20} />} titel="Plan een gratis plaatsbezoek" sub="We bekijken je dak ter plaatse" onClick={() => setBezoekOpen(true)} />
              <Optie start extern icoon={<WhatsAppIcoon />} titel="Stuur ons een WhatsApp" sub="Snel antwoord, ook met foto's van je dak" href="https://wa.me/32468352869" />
            </div>

            <p className="ct-groep">Al klant?</p>
            <div className="ct-opties">
              <Optie icoon={<House size={20} />} titel="Mijn MOS-X" sub="Volg je werken in je klantenzone" href="/klant" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} bron="CTA sectie" />
    </>
  );
}
