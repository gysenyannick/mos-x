"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import GoogleBalk from "@/components/google-balk";
import { DIENST_CSS } from "@/components/dienst-stijl";

function WhatsAppIcoon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const CONTACT_CSS = `
  .ct-hero { padding: 132px 24px 72px; background: radial-gradient(700px 420px at 100% 0%, rgba(155,203,108,0.10), transparent 65%), #F7F8F6; }
  .ct-kruimel { margin: 14px 0 22px; display: flex; align-items: center; gap: 4px; font-size: 13px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }
  .ct-kruimel a { color: #1A1A1A; text-decoration: none; transition: color .2s ease; }
  .ct-kruimel a:hover { color: #7AB54E; }
  .ct-h1 { margin: 0 0 18px; font-size: clamp(2.1rem, 4.2vw, 3.3rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .ct-h1 span { display: block; color: #9BCB6C; }
  .ct-top { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: 32px; align-items: center; }
  .ct-intro { max-width: 560px; }
  .ct-foto { position: relative; border-radius: 24px; overflow: hidden; aspect-ratio: 5 / 4; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -40px rgba(30,51,36,0.45); }
  .ct-foto img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ct-foto span { position: absolute; left: 16px; bottom: 16px; display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.94); font-size: 13px; font-weight: 600; color: #1A1A1A; font-family: var(--font-inter), system-ui, sans-serif; }
  .ct-foto span i { width: 8px; height: 8px; border-radius: 50%; background: #9BCB6C; box-shadow: 0 0 0 4px rgba(155,203,108,0.25); }
  .ct-raster { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: 32px; align-items: start; margin-top: 44px; }

  .ct-form { padding: 36px; border-radius: 24px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -50px rgba(30,51,36,0.35); }
  .ct-form h2 { margin: 0 0 6px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .ct-form form > p:first-of-type { margin: 0 0 26px; font-size: 15px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
  .ct-velden { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .ct-veld { display: grid; gap: 6px; }
  .ct-veld.breed { grid-column: 1 / -1; }
  .ct-veld label { font-size: 13.5px; font-weight: 700; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .ct-veld label span { color: #9BCB6C; }
  .ct-veld input, .ct-veld select, .ct-veld textarea { width: 100%; box-sizing: border-box; padding: 13px 15px; border-radius: 10px; border: 1px solid #E5E7EB; background: #F7F8F6; color: #1A1A1A; font-size: 15px; font-family: var(--font-inter), system-ui, sans-serif; transition: border-color .2s ease, background-color .2s ease, box-shadow .2s ease; }
  .ct-veld textarea { resize: vertical; min-height: 110px; }
  .ct-veld input:hover, .ct-veld select:hover, .ct-veld textarea:hover { border-color: #CFE5B8; }
  .ct-veld input:focus, .ct-veld select:focus, .ct-veld textarea:focus { outline: none; border-color: #9BCB6C; background: #FFFFFF; box-shadow: 0 0 0 4px rgba(155,203,108,0.18); }
  .ct-verstuur { margin-top: 22px; width: 100%; }
  .ct-verstuur:disabled { opacity: 0.7; cursor: default; }
  .ct-spin { animation: ct-draai 1s linear infinite; }
  @keyframes ct-draai { to { transform: rotate(360deg); } }
  .ct-fout { margin: 12px 0 0; font-size: 14px; color: #B42318; font-family: var(--font-inter), system-ui, sans-serif; }
  .ct-noot { margin: 12px 0 0; text-align: center; font-size: 13px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }
  .ct-klaar { padding: 40px 10px; text-align: center; }
  .ct-klaar i { width: 64px; height: 64px; margin: 0 auto 18px; border-radius: 50%; display: grid; place-items: center; background: #F2F8EC; }
  .ct-klaar b { display: block; margin-bottom: 6px; font-size: 22px; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .ct-klaar p { margin: 0; font-size: 15.5px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }

  .ct-zij { display: grid; gap: 16px; }
  .ct-snel { padding: 28px; border-radius: 24px; color: #FFFFFF; background: radial-gradient(400px 240px at 100% 0%, rgba(155,203,108,0.2), transparent 70%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 80%); box-shadow: 0 30px 70px -30px rgba(11,15,12,0.7); }
  .ct-snel h3 { margin: 0 0 4px; font-size: 19px; font-weight: 800; letter-spacing: -0.02em; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .ct-snel > p { margin: 0 0 20px; font-size: 14.5px; color: rgba(255,255,255,0.68); font-family: var(--font-inter), system-ui, sans-serif; }
  .ct-snel .do-knop { width: 100%; }
  .ct-snel .do-knop + .do-knop { margin-top: 10px; }
  .ct-snel .do-knop:focus-visible { outline-color: #FFFFFF; }
  .ct-wa { background: #25D366; color: #FFFFFF; }
  .ct-wa:hover { background: #1EBE5A; }

  .ct-info { padding: 26px 28px; border-radius: 24px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
  .ct-info ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 18px; }
  .ct-info li { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 14px; align-items: start; }
  .ct-info i { width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center; background: #F2F8EC; }
  .ct-info b { display: block; font-size: 14.5px; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
  .ct-info span, .ct-info a { display: block; font-size: 14.5px; line-height: 1.55; color: #545454; text-decoration: none; font-family: var(--font-inter), system-ui, sans-serif; }
  .ct-info a { color: #1A1A1A; font-weight: 600; transition: color .2s ease; }
  .ct-info a:hover { color: #7AB54E; }
  .ct-info a:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; border-radius: 4px; }
  .ct-kaart { margin-top: 20px; border-radius: 14px; overflow: hidden; border: 1px solid #E5E7EB; }
  .ct-kaart iframe { display: block; width: 100%; height: 180px; border: 0; }

  @media (max-width: 960px) {
    .ct-hero { padding: 112px 16px 56px; }
    .ct-raster, .ct-top { grid-template-columns: minmax(0, 1fr); }
    .ct-foto { display: none; }
    .ct-form { padding: 26px 20px; }
  }
  @media (max-width: 560px) {
    .ct-velden { grid-template-columns: minmax(0, 1fr); }
  }
  @media (prefers-reduced-motion: reduce) { .ct-spin { animation: none; } }
`;

export default function ContactPage() {
  const [velden, setVelden] = useState({ voornaam: "", achternaam: "", email: "", telefoon: "", postcode: "", adres: "", dienst: "", bericht: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const zet = (k: keyof typeof velden) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setVelden((v) => ({ ...v, [k]: e.target.value }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVelden((v) => {
      const n = { ...v };
      (Object.keys(n) as (keyof typeof n)[]).forEach((k) => { const w = params.get(k); if (w) n[k] = w; });
      return n;
    });
  }, []);

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    // Zonder dit doet de browser een native POST naar /contact, wat een 405 geeft.
    e.preventDefault();
    if (status === "sending" || status === "success") return;
    setStatus("sending");
    try {
      const fd = new FormData();
      Object.entries(velden).forEach(([k, v]) => fd.append(k, v));
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) throw new Error("send_failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <PageLayout>
      <style>{DIENST_CSS + CONTACT_CSS}</style>

      <section className="ct-hero">
        <div className="do-wrap">
          <BackLink href="/" />
          <p className="ct-kruimel"><Link href="/">Home</Link><ChevronRight size={13} color="#9BCB6C" />Contact</p>
          <div className="ct-top">
          <div className="ct-intro">
            <p className="do-oog">Contact</p>
            <h1 className="ct-h1">Vragen over je dak? <span>We helpen je graag.</span></h1>
            <p className="do-p">Stel je vraag of vraag vrijblijvend een offerte aan. Je krijgt binnen 1 werkdag een persoonlijk antwoord.</p>
            <div className="do-hero-bewijs" style={{ borderTopColor: "#E5E7EB", marginTop: 26 }}>
              <GoogleBalk />
              <span className="do-garantie-chip" style={{ color: "#545454" }}><Clock size={18} color="#9BCB6C" aria-hidden="true" /><b style={{ color: "#1A1A1A" }}>Binnen 1 werkdag</b> antwoord</span>
            </div>
          </div>
          <div className="ct-foto">
            <img src="/images/IMG_5900.JPEG" alt="Vakman van MOS-X op een dak" style={{ objectPosition: "30% 25%" }} />
            <span><i aria-hidden="true" />Ma - za bereikbaar van 08:00 tot 17:00</span>
          </div>
          </div>

          <div className="ct-raster">
            <div className="ct-form">
              {status === "success" ? (
                <div className="ct-klaar" role="status">
                  <i><CheckCircle2 size={32} color="#9BCB6C" /></i>
                  <b>Bericht verstuurd!</b>
                  <p>Je ontvangt zo een bevestigingsmail. We nemen binnen 1 werkdag contact op.</p>
                </div>
              ) : (
                <form onSubmit={verstuur}>
                  <h2>Waar kunnen we je mee helpen?</h2>
                  <p>Vul het formulier in, dan nemen we contact met je op.</p>
                  <div className="ct-velden">
                    <div className="ct-veld"><label htmlFor="voornaam">Voornaam <span>*</span></label><input id="voornaam" name="voornaam" required autoComplete="given-name" value={velden.voornaam} onChange={zet("voornaam")} /></div>
                    <div className="ct-veld"><label htmlFor="achternaam">Achternaam <span>*</span></label><input id="achternaam" name="achternaam" required autoComplete="family-name" value={velden.achternaam} onChange={zet("achternaam")} /></div>
                    <div className="ct-veld"><label htmlFor="email">E-mailadres <span>*</span></label><input id="email" name="email" type="email" required autoComplete="email" placeholder="jouw@email.be" value={velden.email} onChange={zet("email")} /></div>
                    <div className="ct-veld"><label htmlFor="telefoon">Telefoonnummer <span>*</span></label><input id="telefoon" name="telefoon" type="tel" required autoComplete="tel" placeholder="0470 00 00 00" value={velden.telefoon} onChange={zet("telefoon")} /></div>
                    <div className="ct-veld"><label htmlFor="postcode">Postcode <span>*</span></label><input id="postcode" name="postcode" required autoComplete="postal-code" placeholder="2500" value={velden.postcode} onChange={zet("postcode")} /></div>
                    <div className="ct-veld"><label htmlFor="adres">Adres</label><input id="adres" name="adres" autoComplete="street-address" placeholder="Straat en nummer" value={velden.adres} onChange={zet("adres")} /></div>
                    <div className="ct-veld breed">
                      <label htmlFor="dienst">Interesse in <span>*</span></label>
                      <select id="dienst" name="dienst" required value={velden.dienst} onChange={zet("dienst")}>
                        <option value="" disabled>Kies een dienst</option>
                        <option value="Dakreiniging">Dakontmossen</option>
                        <option value="Dakcoating">Dakcoaten</option>
                        <option value="MOS-X Dakzorg">MOS-X Dakzorg</option>
                        <option value="Andere">Andere vraag</option>
                      </select>
                    </div>
                    <div className="ct-veld breed"><label htmlFor="bericht">Bericht</label><textarea id="bericht" name="bericht" rows={4} placeholder="Vertel kort over je dak of je vraag" value={velden.bericht} onChange={zet("bericht")} /></div>
                  </div>
                  <button type="submit" className="do-knop do-knop-g ct-verstuur" disabled={status === "sending"}>
                    {status === "sending" ? <Loader2 size={18} className="ct-spin" /> : <Send size={17} />}
                    {status === "sending" ? "Bezig met versturen" : "Verstuur mijn aanvraag"}
                  </button>
                  {status === "error" && <p className="ct-fout" role="alert">Er ging iets mis. Probeer opnieuw of bel ons even.</p>}
                  <p className="ct-noot">Vrijblijvend. We delen je gegevens met niemand.</p>
                </form>
              )}
            </div>

            <div className="ct-zij">
              <div className="ct-snel">
                <h3>Liever meteen contact?</h3>
                <p>Bel of stuur een bericht, ook met foto&apos;s van je dak.</p>
                <a className="do-knop ct-wa" href="https://wa.me/32468352869" target="_blank" rel="noopener noreferrer"><WhatsAppIcoon />Stuur een WhatsApp</a>
                <a className="do-knop do-knop-d" href="tel:+32468352869"><Phone size={16} />+32 468 35 28 69</a>
              </div>

              <div className="ct-info">
                <ul>
                  <li><i><Mail size={18} color="#9BCB6C" /></i><div><b>E-mail</b><a href="mailto:info@mos-x.be">info@mos-x.be</a></div></li>
                  <li><i><MapPin size={18} color="#9BCB6C" /></i><div><b>Onze vestigingen</b><span>Pastorijstraat 47, 2590 Berlaar</span><span>Bovenpad 100, 2280 Grobbendonk</span></div></li>
                  <li><i><Clock size={18} color="#9BCB6C" /></i><div><b>Openingsuren</b><span>Ma - za: 08:00 - 17:00</span><span>Zo: gesloten</span></div></li>
                </ul>
                <div className="ct-kaart">
                  <iframe title="MOS-X op de kaart" src="https://maps.google.com/maps?q=MOS-X+Dakontmossing+Coating+Grobbendonk&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
