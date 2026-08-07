"use client";

import { CalendarCheck, Home, MessageSquareDot, Headphones, User, Calculator, ChevronRight } from "lucide-react";

const usps = [
  { Icon: CalendarCheck,     title: "We komen onze afspraken na." },
  { Icon: Home,              title: "We behandelen je dak met de grootste zorg." },
  { Icon: MessageSquareDot,  title: "We communiceren helder en snel." },
  { Icon: Headphones,        title: "We blijven ook na de werken bereikbaar." },
];

export default function SiteAboutYannick() {

  return (
    <section style={{ background: "transparent", padding: "80px 0", overflow: "hidden" }}>
      <div className="about-yannick-wrap" style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 40px" }}>

        <div className="flex flex-col lg:flex-row" style={{ gap: "32px", alignItems: "stretch" }}>

          {/* ── LINKS: foto ── */}
          <div className="about-yannick-photo-wrap" style={{ flex: "0 0 45%", position: "relative" }}>
            <div className="about-yannick-photo-inner" style={{
              position: "relative",
              height: "100%",
              minHeight: "460px",
            }}>
              <img
                src="/images/Yannick foto op dak.JPEG"
                alt="Yannick - oprichter MOS-X"
                className="about-yannick-photo"
                style={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 70%",
                  borderRadius: "16px",
                }}
              />

              {/* Naamlabel linksonder op de foto */}
              <div style={{
                position: "absolute",
                bottom: "20px",
                left: "16px",
                background: "rgba(11,15,12,0.75)",
                backdropFilter: "blur(6px)",
                borderRadius: "10px",
                padding: "10px 16px",
                zIndex: 10,
              }}>
                <p style={{
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  margin: 0,
                }}>Yannick</p>
                <p style={{
                  color: "#9BCB6C",
                  fontSize: "12px",
                  fontWeight: 500,
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  margin: "2px 0 0 0",
                }}>Oprichter & Vakspecialist MOS-X</p>
              </div>
            </div>
          </div>

          {/* ── RECHTS: tekst ── */}
          <div style={{ flex: "1 1 0" }}>

            {/* Headline */}
            <p style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontWeight: 600, fontSize: "12px", color: "#9BCB6C",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px",
            }}>
              WAAROM MOS-X
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontWeight: 800, fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.15,
              color: "#1A1A1A", marginBottom: "16px", letterSpacing: "-0.028em",
            }}>
              Kiezen voor MOS-X<br />is kiezen voor <span style={{ color: "#9BCB6C" }}>gemoedsrust.</span>
            </h2>

            {/* Green accent line */}
            <div style={{ width: "48px", height: "3px", background: "#9BCB6C", borderRadius: "2px", marginBottom: "20px" }} />

            {/* Body */}
            <p style={{
              fontSize: "16px", lineHeight: 1.7, color: "#666666",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              marginBottom: "40px",
            }}>
              Een dak reinigen is één ding. Er een bedrijf voor kiezen waarop je kunt vertrouwen, is minstens even belangrijk. Daarom draait het bij MOS-X niet alleen om het eindresultaat, maar ook om duidelijke afspraken, heldere communicatie en een service waarop je kunt blijven rekenen.
            </p>

            {/* USPs */}
            <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "15px", color: "#1A1A1A", marginBottom: "12px" }}>
              Vier beloftes die we aan elke klant maken.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {usps.map(({ Icon, title }) => (
                <div key={title} className="flex items-center gap-2 sm:gap-3.5 p-2 sm:p-[8px_16px]" style={{
                  background: "#F7F8F6",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                }}>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center" style={{
                    background: "rgba(155,203,108,0.12)",
                    border: "1px solid rgba(155,203,108,0.25)",
                    borderRadius: "50%",
                  }}>
                    <Icon size={14} color="#9BCB6C" strokeWidth={2} className="sm:hidden" />
                    <Icon size={17} color="#9BCB6C" strokeWidth={2} className="hidden sm:block" />
                  </div>
                  <p className="text-[11px] sm:text-[14px]" style={{
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    fontWeight: 700, color: "#1A1A1A",
                    margin: 0,
                  }}>{title}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="about-btns" style={{ display: "flex", gap: "12px", marginTop: "36px", flexWrap: "wrap" }}>
              <a
                href="/over-ons"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  border: "2px solid #9BCB6C", color: "#9BCB6C",
                  background: "transparent", borderRadius: "8px",
                  padding: "12px 24px", fontSize: "15px", fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  textDecoration: "none", transition: "background 200ms ease, color 200ms ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#9BCB6C"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9BCB6C"; }}
              >
                Meer over ons
              </a>
              <a
                href="/#calculator"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#9BCB6C", color: "#FFFFFF",
                  border: "2px solid #9BCB6C", borderRadius: "8px",
                  padding: "12px 24px", fontSize: "15px", fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  textDecoration: "none", transition: "background 200ms ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
                onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
              >
                Bereken je richtprijs
                <ChevronRight size={14} strokeWidth={2.5} />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
