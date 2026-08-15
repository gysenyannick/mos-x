"use client";

import Image from "next/image";
import { Phone, CheckCircle, ChevronRight } from "lucide-react";
import { useState } from "react";
import { BtnPress } from "@/components/btn-press";

const GREEN = "#9ACA63";
const DARK = "#0B0F0C";


export default function SiteContact() {
  const [btnHovered, setBtnHovered] = useState(false);
  const [phoneHovered, setPhoneHovered] = useState(false);
  const [waHovered, setWaHovered] = useState(false);

  return (
    <>
    <style>{`
      @media (max-width: 1023px) {
        .site-contact-grid {
          grid-template-columns: 1fr !important;
          padding: 28px 24px 24px !important;
          gap: 28px !important;
        }
        .contact-col-divider {
          padding-left: 0 !important;
          border-left: none !important;
          margin-top: 0 !important;
        }
      }

      /* Korte bullettekst bestaat alleen op mobiel */
      .bullet-kort { display: none; }

      /* ── Mobiel: uitlijning en knopbreedtes gelijktrekken ── */
      @media (max-width: 767px) {
        /* 1. Bovenste tekst centreren */
        .contact-headline-col h2,
        .contact-headline-col > p:not(.contact-region-label) {
          text-align: center !important;
        }

        /* Regio-badge gecentreerd meelopen met de rest */
        .contact-region-label {
          justify-content: center !important;
          text-align: center !important;
        }

        /* Derde bullet ingekort zodat de groep centraler uitvalt */
        .bullet-lang { display: none !important; }
        .bullet-kort { display: inline !important; }

        /* 2. Bulletgroep als geheel inspringen; bullets blijven links uitgelijnd.
              width:fit-content geeft de groep de breedte van de langste regel,
              auto-marges centreren die groep binnen de kaart. */
        .contact-richtprijs-group {
          width: fit-content !important;
          max-width: 100% !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        /* 3. Bovenste twee knoppen even breed als WhatsApp/telefoon eronder */
        .contact-cta-btns {
          width: 100% !important;
        }

        /* 4. Onderste contactzone centreren; knoppen behouden hun breedte */
        .contact-advies-col > p {
          text-align: center !important;
        }
        .contact-profile {
          justify-content: center !important;
        }
        .contact-hours {
          text-align: center !important;
        }
      }
    `}</style>
    <section style={{
      background: "#F7F8F6",
      padding: "60px 24px 80px",
      position: "relative",
      zIndex: 20,
    }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div className="site-contact-grid" style={{
          background: `radial-gradient(ellipse at 100% 100%, rgba(154,202,99,0.15) 0%, transparent 60%), #0B0F0C`,
          border: "1px solid #9BCB6C",
          borderRadius: "28px",
          boxShadow: "0 28px 90px rgba(0,0,0,0.4)",
          padding: "36px 64px",
          position: "relative",
          marginBottom: "0",
          zIndex: 20,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "stretch",
          boxSizing: "border-box",
        }}>

          {/* ── Col 1: Headline + curved arrow ── */}
          <div className="contact-headline-col" style={{ display: "flex", flexDirection: "column", paddingBottom: "20px" }}>
            <p className="contact-region-label" style={{
              fontSize: "9.5px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.12em", color: GREEN, marginBottom: "16px",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <svg width="16" height="12" viewBox="0 0 18 13" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, borderRadius: "2px" }}>
                <rect x="0"  width="6"  height="13" fill="#000000" />
                <rect x="6"  width="6"  height="13" fill="#FFE000" />
                <rect x="12" width="6"  height="13" fill="#EF3340" />
              </svg>
              Actief regio Antwerpen, Limburg,{" "}<br />Vlaams-Brabant
            </p>
            <h2 style={{
              fontSize: "clamp(1.9rem, 2.2vw, 1.9rem)", fontWeight: 800,
              color: "#FFFFFF", lineHeight: 1.2, letterSpacing: "-0.028em",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              marginBottom: "14px", marginTop: "12px",
            }}>
              Levenslang een <span style={{ color: GREEN }}>verzorgd dak</span><br />begint hier.
            </h2>
            <p style={{
              fontSize: "15px", color: `rgba(255,255,255,0.6)`, lineHeight: 1.65,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              marginTop: "auto",
            }}>
              Persoonlijk advies van Yannick.<br />Alleen wat je dak écht nodig heeft.
            </p>
          </div>

          {/* ── Col 2: CTA button ── */}
          <div className="contact-col-divider" style={{ display: "flex", flexDirection: "column" }}>
            <div className="contact-richtprijs-group">
            <p style={{
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.14em", color: GREEN, marginBottom: "16px",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            }}>
              Jouw richtprijs
            </p>
            {/* Checkmarks */}
            <div className="contact-checkmarks" style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "0" }}>
              {[
                { txt: "Binnen 1 minuut" },
                { txt: "Persoonlijk dakadvies" },
                { txt: "Vrijblijvend en zonder verplichtingen", kort: "Vrijblijvend" },
              ].map(({ txt, kort }) => (
                <div key={txt} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle size={18} color="#9BCB6C" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <span style={{
                    fontSize: "15px", color: "rgba(255,255,255,0.75)",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontWeight: 500,
                  }}>
                    {kort ? (
                      <>
                        <span className="bullet-lang">{txt}</span>
                        <span className="bullet-kort">{kort}</span>
                      </>
                    ) : txt}
                  </span>
                </div>
              ))}
            </div>

            </div>

            {/* CTA buttons — pushed to bottom */}
            <div className="contact-cta-btns" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto", width: "calc(100% - 60px)" }}>
              <BtnPress
                href="https://v0-dak-calculator.vercel.app/"
                target="_blank"
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: "48px", width: "100%", borderRadius: "12px",
                  background: btnHovered ? "#7AB54E" : GREEN,
                  color: "#FFFFFF", fontSize: "14px", fontWeight: 800,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  textDecoration: "none", letterSpacing: "0.04em",
                  transition: "background 200ms ease",
                  boxSizing: "border-box",
                }}
              >
                Bereken mijn richtprijs
                <ChevronRight size={16} strokeWidth={2.5} style={{ marginLeft: "8px" }} />
              </BtnPress>

              <BtnPress
                href="/contact"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: "48px", width: "100%", borderRadius: "12px",
                  background: "transparent",
                  border: "1px solid rgba(155,203,108,0.5)",
                  color: "#FFFFFF", fontSize: "14px", fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  textDecoration: "none", letterSpacing: "0.04em",
                  transition: "border-color 0.2s ease, background 0.2s ease",
                  boxSizing: "border-box",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = GREEN; el.style.background = "rgba(155,203,108,0.08)"; el.style.color = GREEN; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(155,203,108,0.5)"; el.style.background = "transparent"; el.style.color = "#FFFFFF"; }}
              >
                Plan een plaatsbezoek
              </BtnPress>
            </div>
          </div>

          {/* ── Col 3: Yannick contact block ── */}
          <div className="contact-col-divider contact-advies-col" style={{ display: "flex", flexDirection: "column" }}>
            <p style={{
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.14em", color: GREEN, marginBottom: "16px",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            }}>
              Persoonlijk advies nodig?
            </p>

            {/* Profile */}
            <div className="contact-profile" style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div style={{ position: "relative", width: "72px", height: "72px", flexShrink: 0 }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: `2px solid ${GREEN}`, overflow: "hidden", position: "relative" }}>
                  <Image
                    src="/images/IMG_4678.PNG"
                    alt="Yannick"
                    width={128}
                    height={128}
                    quality={100}
                    style={{
                      position: "absolute", top: "65%", left: "50%",
                      transform: "translate(-50%, -50%) scale(1.4)",
                      width: "72px", height: "72px",
                      objectFit: "cover", objectPosition: "center",
                    }}
                  />
                </div>
                <span style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: GREEN, border: "2px solid #0B0F0C",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="#0B0F0C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <div>
                <p style={{
                  fontSize: "16px", fontWeight: 700, color: "#FFFFFF",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  marginBottom: "4px",
                }}>
                  Yannick Gysen
                </p>
                <p style={{
                  fontSize: "13px", color: `rgba(255,255,255,0.55)`, lineHeight: 1.5,
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                }}>
                  Dakspecialist MOS-X
                </p>
              </div>
            </div>

            <p className="contact-hours" style={{
              fontSize: "13px", color: `rgba(255,255,255,0.5)`,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              marginBottom: "16px",
            }}>
              Ma - Za: 08:00 - 17:00 <span style={{ margin: "0 6px", opacity: 0.4 }}>|</span> Zo: Gesloten
            </p>

            {/* Buttons — pushed to bottom with marginTop auto */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
              <BtnPress
                href="https://wa.me/32468352869"
                target="_blank"
                onMouseEnter={() => setWaHovered(true)}
                onMouseLeave={() => setWaHovered(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "8px", height: "48px", width: "100%", borderRadius: "12px",
                  background: waHovered ? "#7AB54E" : "#9BCB6C",
                  color: "#FFFFFF",
                  fontSize: "14px", fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  textDecoration: "none",
                  transition: "background 0.2s ease",
                  boxSizing: "border-box",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Yannick
              </BtnPress>
              <BtnPress
                href="tel:+32468352869"
                onMouseEnter={() => setPhoneHovered(true)}
                onMouseLeave={() => setPhoneHovered(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "8px", height: "48px", width: "100%", borderRadius: "12px",
                  background: "transparent",
                  border: phoneHovered ? "1px solid #9BCB6C" : "1px solid rgba(155,203,108,0.5)",
                  color: phoneHovered ? "#9BCB6C" : "#FFFFFF",
                  fontSize: "14px", fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  textDecoration: "none",
                  transition: "border-color 0.2s ease, color 0.2s ease",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                }}
              >
                <Phone size={15} />
                +32 468 35 28 69
              </BtnPress>
            </div>
          </div>


        </div>
      </div>
    </section>
    </>
  );
}
