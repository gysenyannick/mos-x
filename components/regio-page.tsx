"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Phone, Star, ArrowRight, ChevronRight } from "lucide-react";
import { ServiceCard, serviceCards } from "@/components/service-card";
import SiteContact from "@/components/site-contact";

interface Municipality {
  name: string;
  zip: string;
}

interface ServiceItem {
  title: string;
  desc: string;
  href?: string;
}

interface RegioPageProps {
  province: string;
  municipalities: Municipality[];
  intro: string[];
  climateText?: string;
  climateParas?: string[];
  heroSubtitle?: string;
  heroLight?: boolean;
  mainTitle?: ReactNode;
  municipalityTitle?: string;
  municipalitySubtitle?: string;
  services?: ServiceItem[];
  useServiceCards?: boolean;
  ctaHeadline?: ReactNode;
  ctaSubline?: string;
  ctaButton?: string;
  ctaCard?: boolean;
  ctaDark?: boolean;
  ctaContact?: boolean;
  sidebarTitle?: string;
  sidebarSubtitle?: string;
  sidebarButton?: string;
  trustindexSrc?: string;
}

const defaultServices: ServiceItem[] = [
  { title: "Dak reinigen", desc: "biologische verwijdering van mos, algen en korstmos" },
  { title: "Dak coaten",   desc: "beschermende coating met schriftelijke garantie" },
  { title: "Dakabonnement", desc: "jaarlijkse controle en preventieve behandeling" },
];

export default function RegioPage({
  province,
  municipalities,
  intro,
  climateText,
  climateParas,
  heroSubtitle,
  heroLight,
  mainTitle,
  municipalityTitle,
  municipalitySubtitle,
  services,
  useServiceCards: showServiceCards,
  ctaHeadline,
  ctaSubline,
  ctaButton,
  ctaCard,
  ctaDark,
  ctaContact,
  sidebarTitle,
  sidebarSubtitle,
  sidebarButton,
  trustindexSrc,
}: RegioPageProps) {
  const serviceList = services ?? defaultServices;
  const [homeHov, setHomeHov] = useState(false);
  const [regioHov, setRegioHov] = useState(false);
  const [ctaBtnHov, setCtaBtnHov] = useState(false);
  const [darkBtnHov, setDarkBtnHov] = useState(false);
  const [darkPhoneHov, setDarkPhoneHov] = useState(false);
  const [sidebarBtnHov, setSidebarBtnHov] = useState(false);
  const [sidebarPhoneHov, setSidebarPhoneHov] = useState(false);
  const trustindexRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const sidebarCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const STICKY_TOP = 120;
    const LG = 1024;

    const update = () => {
      const container = sidebarContainerRef.current;
      const card = sidebarCardRef.current;
      if (!container || !card) return;
      if (window.innerWidth < LG) {
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
        card.style.width = "";
        return;
      }
      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      const containerH = container.offsetHeight;
      const cardH = card.offsetHeight;
      const scroll = window.scrollY;

      if (scroll + STICKY_TOP < containerTop) {
        card.style.position = "relative";
        card.style.top = "0";
        card.style.left = "";
        card.style.width = "";
      } else if (scroll + STICKY_TOP + cardH >= containerTop + containerH) {
        card.style.position = "absolute";
        card.style.top = (containerH - cardH) + "px";
        card.style.left = "0";
        card.style.width = "";
      } else {
        card.style.position = "fixed";
        card.style.top = STICKY_TOP + "px";
        card.style.left = container.getBoundingClientRect().left + "px";
        card.style.width = container.offsetWidth + "px";
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!trustindexSrc || !trustindexRef.current) return;
    const container = trustindexRef.current;
    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = trustindexSrc;
    script.async = true;
    script.defer = true;
    container.appendChild(script);
  }, [trustindexSrc]);

  return (
    <>
      {/* ── HERO ── */}
      {heroLight ? (
        <section className="pt-[100px] lg:pt-[120px] pb-10 lg:pb-20" style={{ background: "#F7F8F6" }}>
          <div className="site-wrap">
            {/* Breadcrumb — light style */}
            <p style={{ fontSize: "13px", marginBottom: "20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              <Link
                href="/"
                onMouseEnter={() => setHomeHov(true)}
                onMouseLeave={() => setHomeHov(false)}
                style={{ color: homeHov ? "#9BCB6C" : "#1A1A1A", textDecoration: "none", transition: "color 180ms ease" }}
              >Home</Link>
              <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "#9BCB6C" }} />
              <Link
                href="/#werkgebied"
                onMouseEnter={() => setRegioHov(true)}
                onMouseLeave={() => setRegioHov(false)}
                style={{ color: regioHov ? "#9BCB6C" : "#1A1A1A", textDecoration: "none", transition: "color 180ms ease" }}
              >Regio&apos;s</Link>
              <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "#9BCB6C" }} />
              <span style={{ color: "#9BCB6C" }}>{province}</span>
            </p>

            <h1
              className="leading-tight mb-5"
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.625rem, 5vw, 3.5rem)",
                letterSpacing: "-0.03em",
                color: "#1A1A1A",
              }}
            >
              Dakontmossing in <span style={{ color: "#9BCB6C" }}>{province}</span>
            </h1>
            <p className="text-base lg:text-lg leading-relaxed" style={{ color: "#545454" }}>
              {heroSubtitle ?? `Erkende dakspecialist, actief in heel ${province}. Persoonlijk contact met Yannick.`}
            </p>
          </div>
        </section>
      ) : (
        <section style={{ background: "#1A1A1A", paddingTop: "130px", paddingBottom: "64px" }}>
          <div className="site-wrap">
            {/* Breadcrumb — dark style */}
            <nav className="flex items-center gap-2 mb-6 text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.40)", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", color: "rgba(255,255,255,0.40)" }} />
              <Link href="/#werkgebied" style={{ color: "rgba(255,255,255,0.40)", textDecoration: "none" }}>Regio&apos;s</Link>
              <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", color: "rgba(255,255,255,0.40)" }} />
              <span style={{ color: "rgba(255,255,255,0.70)" }}>{province}</span>
            </nav>

            <h1
              className="font-black text-white leading-tight mb-4"
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Dakontmossing in {province}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "18px", maxWidth: "600px" }}>
              {heroSubtitle ?? `Erkende dakspecialist, actief in heel ${province}. Persoonlijk contact met Yannick.`}
            </p>
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT ── */}
      <section className="pt-8 pb-12 lg:pt-[60px] lg:pb-[80px]" style={{ background: "#F7F8F6" }}>
        <div className="site-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12 items-start">

            {/* ── LEFT COLUMN ── */}
            <div className="order-2 lg:order-1">

              {/* H2: Intro */}
              <h2
                className="font-bold mb-6"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                  color: "#1A1A1A",
                }}
              >
                {mainTitle ?? `MOS-X: uw dakspecialist in ${province}`}
              </h2>
              <div className="space-y-4 mb-32 lg:mb-10" style={{ color: "#545454", fontSize: "16px", lineHeight: 1.75 }}>
                {intro.map((p, i) => <p key={i}>{p}</p>)}
              </div>

              {/* Gemeenten */}
              <h2
                className="font-bold mb-2"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)",
                  color: "#1A1A1A",
                }}
              >
                {municipalityTitle ?? "Gemeenten waar wij actief zijn"}
              </h2>
              <p className="mb-6" style={{ color: "#545454", fontSize: "15px" }}>
                {municipalitySubtitle ?? "Vraag uw gratis diagnose aan in uw gemeente."}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-32 lg:mb-10">
                {municipalities.map((m) => (
                  <Link
                    key={m.name}
                    href="/contact"
                    className="municipality-card block"
                    style={{
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      textDecoration: "none",
                      transition: "border-color 200ms ease",
                    }}
                  >
                    <p className="font-bold text-sm" style={{ color: "#1A1A1A", fontSize: "13px" }}>{m.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#9BCB6C", fontSize: "11px", fontWeight: 600 }}>{m.zip}</p>
                  </Link>
                ))}
              </div>

              {/* Diensten bullets (only when not using service cards) */}
              {!showServiceCards && (
                <>
                  <h2
                    className="font-bold mb-4"
                    style={{
                      fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                      fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)",
                      color: "#1A1A1A",
                    }}
                  >
                    Onze diensten in {province}
                  </h2>
                  <ul className="space-y-3 mb-10">
                    {serviceList.map((s) => (
                      <li key={s.title} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#9BCB6C" }} />
                        {s.href ? (
                          <Link href={s.href} style={{ textDecoration: "none" }}>
                            <span style={{ color: "#545454", fontSize: "15px" }}>
                              <strong style={{ color: "#1A1A1A" }}>{s.title}</strong> - {s.desc}
                            </span>
                          </Link>
                        ) : (
                          <span style={{ color: "#545454", fontSize: "15px" }}>
                            <strong style={{ color: "#1A1A1A" }}>{s.title}</strong> - {s.desc}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Klimaat */}
              <h2
                className="font-bold mb-4"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)",
                  color: "#1A1A1A",
                }}
              >
                Waarom dakonderhoud belangrijk is in {province}
              </h2>
              {climateParas ? (
                <div className="space-y-4" style={{ color: "#545454", fontSize: "16px", lineHeight: 1.75 }}>
                  {climateParas.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              ) : (
                <p style={{ color: "#545454", fontSize: "16px", lineHeight: 1.75 }}>{climateText}</p>
              )}

            </div>

            {/* ── RIGHT SIDEBAR (js-sticky) ── */}
            <div ref={sidebarContainerRef} className="order-1 lg:order-2" style={{ alignSelf: "stretch", position: "relative" }}>
            <div ref={sidebarCardRef}>
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #9BCB6C",
                  borderRadius: "12px",
                  padding: "28px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  textAlign: "center",
                }}
              >
                <h3
                  className="font-bold mb-2"
                  style={{ fontFamily: "var(--font-montserrat)", fontSize: "17px", color: "#1A1A1A" }}
                >
                  {sidebarTitle ?? "Gratis diagnose aanvragen"}
                </h3>
                <p className="text-sm mb-5" style={{ color: "#545454" }}>
                  {sidebarSubtitle ?? "Yannick komt langs binnen 2 weken. Volledig gratis."}
                </p>

                <div style={{ borderTop: "1px solid #E5E7EB", marginBottom: "20px" }} />

                <Link
                  href="/#calculator"
                  onMouseEnter={() => setSidebarBtnHov(true)}
                  onMouseLeave={() => setSidebarBtnHov(false)}
                  style={{
                    display: "block",
                    width: "100%",
                    background: sidebarBtnHov ? "#7AB54E" : "#9BCB6C",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "13px 20px",
                    minHeight: "44px",
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily: "var(--font-montserrat)",
                    textDecoration: "none",
                    textAlign: "center",
                    boxSizing: "border-box",
                    marginBottom: "12px",
                    transition: "background 200ms ease",
                  }}
                >
                  {sidebarButton ?? "Gratis diagnose aanvragen"}
                  <ChevronRight size={14} strokeWidth={2.5} style={{ marginLeft: "2px" }} />
                </Link>

                <a
                  href="tel:+32468352869"
                  onMouseEnter={() => setSidebarPhoneHov(true)}
                  onMouseLeave={() => setSidebarPhoneHov(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    border: "1.5px solid #9BCB6C",
                    borderRadius: "8px",
                    padding: "11px 20px",
                    minHeight: "44px",
                    color: sidebarPhoneHov ? "#9BCB6C" : "#1A1A1A",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "14px",
                    textDecoration: "none",
                    boxSizing: "border-box",
                    transition: "color 200ms ease",
                  }}
                >
                  <Phone className="w-4 h-4" style={{ color: sidebarPhoneHov ? "#9BCB6C" : "#1A1A1A", transition: "color 200ms ease" }} />
                  +32 468 35 28 69
                </a>

                <div style={{ borderTop: "1px solid #E5E7EB", margin: "20px 0" }} />

                {trustindexSrc ? (
                  <div ref={trustindexRef} style={{ zoom: "0.8", marginBottom: "-16px" }} />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#F59E0B" }} />
                      ))}
                    </div>
                    <span className="text-sm" style={{ color: "#545454" }}>
                      5.0 &middot; 16 Google Reviews
                    </span>
                  </div>
                )}
              </div>
            </div>
            </div>

          </div>

          {/* ── SERVICE CARDS — outside the 2-col grid so sticky stops before this ── */}
          {showServiceCards && (
            <div className="mt-32 lg:mt-[64px]">
              <h2
                className="font-bold mb-6"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)",
                  color: "#1A1A1A",
                }}
              >
                Onze diensten in {province}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 services-grid">
                {serviceCards.map((s) => (
                  <ServiceCard key={s.id} s={s} />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      {ctaContact ? (
        <SiteContact />
      ) : (
      <section style={{ background: "#F7F8F6", paddingBottom: "80px" }}>
        <div className="site-wrap">
          {ctaDark ? (
            <div style={{
              background: "#0B0F0C",
              border: "1px solid rgba(155,203,108,0.25)",
              borderRadius: "16px",
              padding: "32px 48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "32px",
              flexWrap: "wrap",
            }}>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "6px", lineHeight: 1.25 }}>
                  {ctaHeadline ?? "Vraag vandaag nog uw gratis diagnose aan"}
                </p>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                  {ctaSubline ?? `Yannick inspecteert uw dak persoonlijk in heel ${province}. Volledig gratis, geen verplichtingen.`}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", flexShrink: 0, flexWrap: "wrap" }}>
                <Link
                  href="/#calculator"
                  onMouseEnter={() => setDarkBtnHov(true)}
                  onMouseLeave={() => setDarkBtnHov(false)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: darkBtnHov ? "#7AB54E" : "#9BCB6C",
                    color: "#FFFFFF", border: "none",
                    borderRadius: "8px", padding: "12px 20px",
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    fontWeight: 700, fontSize: "14px", textDecoration: "none",
                    whiteSpace: "nowrap", transition: "background-color 0.2s ease",
                  }}
                >
                  {ctaButton ?? "Gratis diagnose aanvragen"}
                  <ChevronRight size={14} strokeWidth={2.5} />
                </Link>
                <a
                  href="tel:+32468352869"
                  onMouseEnter={() => setDarkPhoneHov(true)}
                  onMouseLeave={() => setDarkPhoneHov(false)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "transparent",
                    color: darkPhoneHov ? "#9BCB6C" : "#FFFFFF",
                    border: darkPhoneHov ? "1px solid #9BCB6C" : "1px solid rgba(155,203,108,0.5)",
                    borderRadius: "8px", padding: "12px 20px",
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    fontWeight: 700, fontSize: "14px", textDecoration: "none",
                    whiteSpace: "nowrap", transition: "border-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  <Phone size={15} />
                  +32 468 35 28 69
                </a>
              </div>
            </div>
          ) : ctaCard ? (
            <div style={{
              background: "#FFFFFF",
              border: "1px solid #9BCB6C",
              borderRadius: "16px",
              padding: "48px 40px",
              textAlign: "center",
              boxShadow: "0 2px 16px rgba(155,203,108,0.12)",
            }}>
              <h2
                className="font-bold mb-4"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  color: "#1A1A1A",
                  letterSpacing: "-0.025em",
                }}
              >
                {ctaHeadline ?? "Vraag vandaag nog uw gratis diagnose aan"}
              </h2>
              <p style={{ fontSize: "15px", color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "28px", maxWidth: "500px", margin: "0 auto 28px" }}>
                {ctaSubline ?? `Yannick inspecteert uw dak persoonlijk in heel ${province}. Volledig gratis, geen verplichtingen.`}
              </p>
              <Link
                href="/#calculator"
                onMouseEnter={() => setCtaBtnHov(true)}
                onMouseLeave={() => setCtaBtnHov(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: ctaBtnHov ? "#7AB54E" : "#9BCB6C",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px 28px",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  textDecoration: "none",
                  transition: "background-color 0.2s ease",
                }}
              >
                {ctaButton ?? "Gratis diagnose aanvragen"}
                <ChevronRight size={14} strokeWidth={2.5} style={{ marginLeft: "2px" }} />
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <h2
                className="font-bold mb-4"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  color: "#1A1A1A",
                  letterSpacing: "-0.02em",
                }}
              >
                {ctaHeadline ?? "Vraag vandaag nog uw gratis diagnose aan"}
              </h2>
              <p className="mb-8 mx-auto" style={{ color: "#545454", fontSize: "16px", maxWidth: "500px" }}>
                {ctaSubline ?? `Yannick inspecteert uw dak persoonlijk in heel ${province}. Volledig gratis, geen verplichtingen.`}
              </p>
              <Link
                href="/#calculator"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#9BCB6C",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "14px 32px",
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: "var(--font-montserrat)",
                  textDecoration: "none",
                  transition: "background 200ms ease",
                }}
              >
                {ctaButton ?? "Gratis diagnose aanvragen"}
                <ChevronRight size={14} strokeWidth={2.5} style={{ marginLeft: "2px" }} />
              </Link>
            </div>
          )}
        </div>
      </section>
      )}
    </>
  );
}
