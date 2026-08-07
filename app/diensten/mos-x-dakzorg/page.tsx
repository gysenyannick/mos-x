"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Phone, ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, Calendar, Eye, Bell, X, Check, Droplets, Leaf, ChevronDown, Banknote, Home } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";

const benefits = [
  { Icon: Home,     title: "Resultaat langer behouden",         desc: "Je dak blijft langer proper en verzorgd." },
  { Icon: Leaf,     title: "Mosgroei tijdig aanpakken",          desc: "Beginnende mos- en algengroei krijgt minder kans om zich opnieuw op te bouwen." },
  { Icon: Eye,      title: "Kleine gebreken sneller opmerken",   desc: "We controleren je dak en signaleren aandachtspunten voordat ze groter worden." },
  { Icon: Banknote, title: "Geen grote achterstand meer",        desc: "Door regelmatig onderhoud voorkom je dat je dak opnieuw jarenlang vervuilt." },
];

const includesItems = [
  "Jaarlijkse inspectie door Yannick persoonlijk",
  "Preventieve reiniging waar nodig",
  "Gootcontrole en -reiniging",
  "Foto-rapportage voor en na",
  "Advies op maat voor uw dak",
  "Prioriteit bij dringende interventies",
  "Geen verborgen kosten",
  "Velux reiniging en onderhoud",
];

const withoutItems = [
  "Mos en algen groeien ongemerkt aan",
  "Goten raken verstopt, water loopt over",
  "Kleine scheurtjes worden grote schade",
  "Plotse rekeningen die u had kunnen vermijden",
  "Geen bewijs van de staat van uw dak",
];

const withItems = [
  "Yannick controleert jaarlijks persoonlijk",
  "Goten altijd vrij en functioneel",
  "Problemen vroegtijdig herkend en opgelost",
  "Vaste, transparante prijs vooraf",
  "Volledige foto-rapportage elk jaar",
];

const faqs = [
  { q: "Wat houdt het MOS-X Dakzorg plan precies in?", a: "Yannick komt elk jaar langs voor een grondige inspectie en preventief onderhoud van uw dak. U ontvangt een foto-rapportage voor en na, en eventuele problemen worden meteen opgespoord vóór ze groter worden." },
  { q: "Is het plan geschikt voor elk type dak?", a: "Ja. Of u nu dakpannen, leien of een ander daktype heeft — MOS-X Dakzorg is voor elk dak geschikt. Yannick bekijkt wat uw dak specifiek nodig heeft." },
  { q: "Wat kost het MOS-X Dakzorg plan?", a: "De prijs hangt af van de grootte en het type van uw dak. Yannick maakt na een eerste inspectie een voorstel op maat. Geen verborgen kosten, alles wordt vooraf besproken." },
  { q: "Kan ik het plan op elk moment stopzetten?", a: "Ja, u zit nergens aan vast. U kunt het plan op elk moment opzeggen, zonder boetes of verborgen kosten." },
  { q: "Wat als er tijdens de inspectie iets mis is?", a: "Yannick signaleert het meteen en bespreekt de beste aanpak met u. Als abonnee krijgt u voorrang bij dringende interventies en een eerlijke prijs vooraf." },
];

const investFeatures = [
  { Icon: ShieldCheck, title: "Bescherming op lange termijn",  desc: "Een gezond dak begint bij regelmatig onderhoud. MOS-X Dakzorg houdt uw investering op peil, jaar na jaar." },
  { Icon: Droplets,    title: "Geen waterinfiltratie",          desc: "Vroegtijdige inspectie voorkomt dat water binnendringt en structurele schade aanricht aan dakconstructie en isolatie." },
  { Icon: Leaf,        title: "Duurzamere keuze",               desc: "Een dak langer meegeven betekent minder materiaalkost en minder afval. Goed voor uw portemonnee én voor het milieu." },
];

export default function MosXDakzorgPage() {
  const trustindexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = trustindexRef.current;
    if (!container) return;
    if (container.querySelector('script[src*="trustindex"]')) return;
    const s = document.createElement("script");
    s.async = true;
    s.defer = true;
    s.src = "https://cdn.trustindex.io/loader.js?1b15ba67596980480f76d1d0d69";
    container.appendChild(s);
  }, []);

  const [homeHovered, setHomeHovered]         = useState(false);
  const [dienstenHovered, setDienstenHovered] = useState(false);
  const [waHovered, setWaHovered]             = useState(false);
  const [ctaWaHovered, setCtaWaHovered]       = useState(false);
  const [phoneHovered, setPhoneHovered]       = useState(false);
  const [ctaPhoneHovered, setCtaPhoneHovered] = useState(false);
  const [openFaq, setOpenFaq]                 = useState<number | null>(null);
  const [hoveredBenefit, setHoveredBenefit]   = useState<number | null>(null);
  const [gootSlider, setGootSlider]           = useState(50);
  const [veluxSlider, setVeluxSlider]         = useState(50);

  return (
    <PageLayout>

      {/* ── HERO ── */}
      <section style={{ background: "#111111", position: "relative", overflow: "hidden", minHeight: "calc(100vh + 30px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>

        {/* Foto mobile — volledige achtergrond */}
        <div className="block lg:hidden" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="/images/Foto_dakzorg.png"
            alt="MOS-X Dakzorg — jaarlijkse dakinspectie door Yannick"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,0.80)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(17,17,17,0.5) 0%, rgba(17,17,17,0.2) 50%, transparent 100%)", pointerEvents: "none" }} />
        </div>

        {/* Foto desktop — rechterhelft zichtbaar, links donker */}
        <div className="hidden lg:block" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "48%", zIndex: 1 }}>
          <img
            src="/images/Foto_dakzorg.png"
            alt="MOS-X Dakzorg — jaarlijkse dakinspectie door Yannick"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #111111 0%, rgba(17,17,17,0.5) 30%, rgba(17,17,17,0.1) 55%, transparent 75%)", pointerEvents: "none" }} />
        </div>

        <div className="site-wrap pt-[115px] lg:pt-[120px] pb-[100px] lg:pb-[60px] lg:-mt-[140px]" style={{ position: "relative", zIndex: 2, width: "100%" }}>

          <BackLink href="/diensten" dark />

          {/* Breadcrumb */}
          <p style={{ fontSize: "13px", marginBottom: "60px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            <Link href="/"
              onMouseEnter={() => setHomeHovered(true)}
              onMouseLeave={() => setHomeHovered(false)}
              style={{ color: homeHovered ? "#9BCB6C" : "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 180ms ease" }}
            >Home</Link>
            <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "#9BCB6C" }} />
            <Link href="/diensten"
              onMouseEnter={() => setDienstenHovered(true)}
              onMouseLeave={() => setDienstenHovered(false)}
              style={{ color: dienstenHovered ? "#9BCB6C" : "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 180ms ease" }}
            >Diensten</Link>
            <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "#9BCB6C" }} />
            <span style={{ color: "#9BCB6C" }}>MOS-X Dakzorg</span>
          </p>

          {/* Tekst — linkerhelft op desktop */}
          <div className="lg:w-1/2">
            <p className="site-eyebrow mb-4">MOS-X DAKZORG PLAN</p>
            <h1 style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 2.6vw, 2.1rem)",
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              lineHeight: 1.12,
              marginBottom: "20px",
            }}>
              Je dak is weer proper.<br />
              <span style={{ color: "#9BCB6C" }}>Wij houden het zo.</span>
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginBottom: "56px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              Na een professionele dakreiniging wil je natuurlijk dat je dak zo lang mogelijk proper en verzorgd blijft.<br /><br />
              Met MOS-X Dakzorg volgen we je dak jaarlijks op. We controleren de staat van het dak, reinigen waar nodig en pakken beginnende mosgroei en kleine aandachtspunten tijdig aan.<br /><br />
              Zo haal je meer uit je dakreiniging en voorkom je dat je dak na enkele jaren opnieuw volledig aangepakt moet worden.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="https://wa.me/32468352869"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setWaHovered(true)}
                onMouseLeave={() => setWaHovered(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: waHovered ? "#7AB54E" : "#9BCB6C",
                  color: "#FFFFFF", borderRadius: "10px",
                  padding: "14px 24px", fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "15px", textDecoration: "none",
                  transition: "background 200ms ease",
                }}
              >
                MOS-X Dakzorg aanvragen
                <ChevronRight size={15} strokeWidth={2.5} />
              </a>
              <a
                href="tel:+32468352869"
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#9BCB6C"; e.currentTarget.style.color = "#9BCB6C"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "transparent", color: "rgba(255,255,255,0.85)",
                  border: "1.5px solid rgba(155,203,108,0.5)", borderRadius: "10px",
                  padding: "14px 24px", fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "15px", textDecoration: "none",
                  transition: "border-color 200ms ease, color 200ms ease",
                }}
              >
                <Phone size={16} />
                +32 468 35 28 69
              </a>
            </div>

            {/* Google Reviews widget */}
            <div style={{ marginTop: "20px" }}>
              <div ref={trustindexRef} style={{ display: "inline-block" }} />
            </div>
          </div>

        </div>

        {/* Wave desktop */}
        <div className="hidden lg:block" style={{ position: "absolute", bottom: "-1px", left: 0, width: "100%", overflow: "hidden", lineHeight: 0, zIndex: 3 }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "80px" }}>
            <path d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z" fill="#F7F8F6"/>
          </svg>
        </div>
        {/* Wave mobile */}
        <div className="block lg:hidden" style={{ position: "absolute", bottom: "-1px", left: 0, width: "100%", overflow: "hidden", lineHeight: 0, zIndex: 3 }}>
          <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "50px" }}>
            <path d="M0,0 C360,45 1080,45 1440,0 L1440,50 L0,50 Z" fill="#F7F8F6"/>
          </svg>
        </div>
      </section>

      {/* ── SECTIE 1: Waarom MOS-X Dakzorg? ── */}
      <section style={{ background: "#F7F8F6", padding: "120px 0 100px" }}>
        <div className="site-wrap">

          {/* Gecentreerde tekst */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p className="site-eyebrow mb-4">Waarom MOS-X Dakzorg?</p>
            <h2 style={{
              fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 800, color: "#1A1A1A",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              letterSpacing: "-0.028em", lineHeight: 1.12, marginBottom: "20px",
            }}>
              <span style={{ whiteSpace: "nowrap" }}>Langer genieten van</span><br /><span style={{ color: "#9BCB6C", whiteSpace: "nowrap" }}>een verzorgd dak.</span>
            </h2>
            <p style={{ fontSize: "15px", color: "#545454", lineHeight: 1.7, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              Na een dakreiniging ziet je dak er weer proper en verzorgd uit.<br />
              Maar door regen, vocht en vervuiling begint de opbouw van mos en vuil na verloop van tijd opnieuw.<br /><br />
              Met periodieke opvolging houden we die vervuiling onder controle, controleren we je dak en pakken we kleine aandachtspunten tijdig aan.<br />
              Zo blijft je dak langer verzorgd en haal je meer uit je dakreiniging.
            </p>
          </div>

          {/* 4 benefit cards in één rij */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "16px" }}>
            {benefits.map((b, i) => {
              const Icon = b.Icon;
              return (
                <div key={i}
                  onMouseEnter={() => setHoveredBenefit(i)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "16px",
                    padding: "24px 20px",
                    boxShadow: hoveredBenefit === i ? "0 4px 24px rgba(155,203,108,0.18)" : "0 2px 12px rgba(0,0,0,0.06)",
                    transform: hoveredBenefit === i ? "translateY(-4px)" : "translateY(0)",
                    transition: "box-shadow 250ms ease, transform 250ms ease, border-color 250ms ease",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Mobiel: icon | lijn | tekst naast elkaar */}
                  <div className="flex lg:hidden" style={{ alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(155,203,108,0.12)", border: "1px solid rgba(155,203,108,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={22} color="#9BCB6C" strokeWidth={2} />
                    </div>
                    <div style={{ width: "1px", alignSelf: "stretch", background: "rgba(155,203,108,0.5)", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, fontFamily: "var(--font-montserrat), system-ui, sans-serif", marginBottom: "6px" }}>{b.title}</p>
                        <p style={{ fontSize: "13px", color: "#545454", lineHeight: 1.6, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>{b.desc}</p>
                      </div>
                    </div>
                  </div>
                  {/* Desktop: icon bovenaan, gecentreerd */}
                  <div className="hidden lg:flex lg:flex-col lg:items-center" style={{ textAlign: "center" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(155,203,108,0.12)", border: "1px solid rgba(155,203,108,0.35)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                      <Icon size={22} color="#9BCB6C" strokeWidth={2} />
                    </div>
                    <p style={{ fontWeight: 700, fontSize: "13px", color: "#1A1A1A", lineHeight: 1.3, fontFamily: "var(--font-montserrat), system-ui, sans-serif", marginBottom: "6px" }}>{b.title}</p>
                    <div style={{ width: "20px", height: "2px", background: "#9BCB6C", borderRadius: "2px", marginBottom: "8px" }} />
                    <p style={{ fontSize: "12px", color: "#545454", lineHeight: 1.6, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTIE 2: Wat zit er in jouw Dakzorg plan? ── */}
      <section style={{ background: "#F7F8F6", padding: "120px 0 100px" }}>
        <div className="site-wrap">

          {/* Kop boven het grid — volledige breedte */}
          <div style={{ marginBottom: "40px" }}>
            <p className="site-eyebrow mb-4">Wat is inbegrepen?</p>
            <h2 style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "#1A1A1A",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              letterSpacing: "-0.028em", lineHeight: 1.12, whiteSpace: "nowrap",
            }}>
              Wat zit er in jouw <span style={{ color: "#9BCB6C" }}>Dakzorg plan?</span>
            </h2>
          </div>

          <div className="grid gap-10 lg:gap-16 items-start grid-cols-1 lg:grid-cols-[5fr_5fr]">

            {/* Links: checklist */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { title: "Periodieke dakcontrole",                desc: "Controle van dakpannen, nokken en algemene staat." },
                  { title: "Onderhoud van dakgoten & afvoer",       desc: "Vrije afwatering en minder kans op verstoppingen." },
                  { title: "Preventieve anti-mosbehandeling",       desc: "Nieuwe mos- en algengroei wordt afgeremd." },
                  { title: "Controle van zinkwerk & aansluitingen", desc: "Controle van gevoelige zones waar problemen ontstaan." },
                  { title: "Kleine herstellingen inbegrepen",         desc: "Losse of beschadigde pannen en kleine gebreken pakken we meteen aan waar mogelijk." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 14px", background: "#F7F8F6", borderRadius: "10px", border: "1px solid #E5E7EB" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#9BCB6C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, fontFamily: "var(--font-montserrat), system-ui, sans-serif", marginBottom: "2px" }}>{item.title}</p>
                      <p style={{ fontSize: "13px", color: "#545454", lineHeight: 1.5, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>{item.desc}</p>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#9BCB6C", fontFamily: "var(--font-montserrat), system-ui, sans-serif", flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                ))}
              </div>

              {/* Highlight box onder de lijst */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", background: "#FFFFFF", borderRadius: "12px", border: "1px solid rgba(155,203,108,0.4)", marginTop: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(155,203,108,0.12)", border: "1px solid rgba(155,203,108,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShieldCheck size={20} color="#9BCB6C" strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, fontFamily: "var(--font-montserrat), system-ui, sans-serif", marginBottom: "4px" }}>Rust en zekerheid, jaar na jaar.</p>
                  <p style={{ fontSize: "13px", color: "#545454", lineHeight: 1.5, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Een regelmatig onderhouden dak blijft langer mooi en in topconditie.</p>
                </div>
              </div>
            </div>


            {/* Rechts: foto grid — 2 sliders bovenaan, 2 foto's onderaan */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%", transform: "translateY(20px)" }}>

              {/* Gootreiniging — voor/na slider */}
              <div className="aspect-square lg:aspect-[6/5]" style={{ borderRadius: "12px", overflow: "hidden", position: "relative", userSelect: "none", cursor: "ew-resize" }}>
                <img src="/images/Goot na.JPEG" alt="Na gootreiniging" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <img src="/images/Goot voor.JPEG" alt="Voor gootreiniging" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", clipPath: `polygon(0 0, ${gootSlider}% 0, ${gootSlider}% 100%, 0 100%)` }} />
                <div style={{ position: "absolute", top: 0, bottom: 0, left: `${gootSlider}%`, width: "2px", background: "rgba(255,255,255,0.9)", transform: "translateX(-50%)", zIndex: 2, pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: "50%", left: `${gootSlider}%`, transform: "translate(-50%, -50%)", width: "34px", height: "34px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #9BCB6C", display: "flex", alignItems: "center", justifyContent: "center", gap: "1px", zIndex: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.18)", pointerEvents: "none" }}>
                  <ChevronLeft style={{ width: "13px", height: "13px", color: "#9BCB6C" }} />
                  <ChevronRight style={{ width: "13px", height: "13px", color: "#9BCB6C" }} />
                </div>
                <span className="absolute top-[7px] left-[7px] lg:top-3 lg:left-3 text-[9px] lg:text-[11px] px-[5px] py-[2px] lg:px-3 lg:py-[5px]" style={{ zIndex: 2, color: "#FFFFFF", fontWeight: 700, background: "rgba(0,0,0,0.65)", borderRadius: "50px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none" }}>VOOR</span>
                <span className="absolute top-[7px] right-[7px] lg:top-3 lg:right-3 text-[9px] lg:text-[11px] px-[5px] py-[2px] lg:px-3 lg:py-[5px]" style={{ zIndex: 2, color: "#1A1A1A", fontWeight: 700, background: "rgba(155,203,108,0.9)", borderRadius: "50px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none" }}>NA</span>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "8px", left: "10px", zIndex: 2, pointerEvents: "none" }}>
                  <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>Gootreiniging</span>
                </div>
                <input type="range" min="0" max="100" value={gootSlider} onChange={e => setGootSlider(Number(e.target.value))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "ew-resize", zIndex: 4 }} />
              </div>

              {/* Velux reiniging — voor/na slider */}
              <div className="aspect-square lg:aspect-[6/5]" style={{ borderRadius: "12px", overflow: "hidden", position: "relative", userSelect: "none", cursor: "ew-resize" }}>
                <img src="/images/Velux na 1.0.png" alt="Na velux reiniging" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <img src="/images/Velux voor 1.0.png" alt="Voor velux reiniging" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", clipPath: `polygon(0 0, ${veluxSlider}% 0, ${veluxSlider}% 100%, 0 100%)` }} />
                <div style={{ position: "absolute", top: 0, bottom: 0, left: `${veluxSlider}%`, width: "2px", background: "rgba(255,255,255,0.9)", transform: "translateX(-50%)", zIndex: 2, pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: "50%", left: `${veluxSlider}%`, transform: "translate(-50%, -50%)", width: "34px", height: "34px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #9BCB6C", display: "flex", alignItems: "center", justifyContent: "center", gap: "1px", zIndex: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.18)", pointerEvents: "none" }}>
                  <ChevronLeft style={{ width: "13px", height: "13px", color: "#9BCB6C" }} />
                  <ChevronRight style={{ width: "13px", height: "13px", color: "#9BCB6C" }} />
                </div>
                <span className="absolute top-[7px] left-[7px] lg:top-3 lg:left-3 text-[9px] lg:text-[11px] px-[5px] py-[2px] lg:px-3 lg:py-[5px]" style={{ zIndex: 2, color: "#FFFFFF", fontWeight: 700, background: "rgba(0,0,0,0.65)", borderRadius: "50px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none" }}>VOOR</span>
                <span className="absolute top-[7px] right-[7px] lg:top-3 lg:right-3 text-[9px] lg:text-[11px] px-[5px] py-[2px] lg:px-3 lg:py-[5px]" style={{ zIndex: 2, color: "#1A1A1A", fontWeight: 700, background: "rgba(155,203,108,0.9)", borderRadius: "50px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none" }}>NA</span>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "8px", left: "10px", zIndex: 2, pointerEvents: "none" }}>
                  <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>Velux reiniging</span>
                </div>
                <input type="range" min="0" max="100" value={veluxSlider} onChange={e => setVeluxSlider(Number(e.target.value))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "ew-resize", zIndex: 4 }} />
              </div>

              {/* Anti-mosbehandeling */}
              <div className="aspect-square lg:aspect-[6/5]" style={{ borderRadius: "12px", overflow: "hidden", position: "relative" }}>
                <img src="/images/Antimos op dak.jpg" alt="Anti-mosbehandeling op dak" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: "8px", left: "10px" }}>
                  <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>Anti-mosbehandeling</span>
                </div>
              </div>

              {/* Dakpan herstelling */}
              <div className="aspect-square lg:aspect-[6/5]" style={{ borderRadius: "12px", overflow: "hidden", position: "relative" }}>
                <img src="/images/Dakpan herstelling.png" alt="Dakpan herstelling" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <span className="absolute top-[7px] left-[7px] lg:top-3 lg:left-3 text-[9px] lg:text-[11px] px-[5px] py-[2px] lg:px-3 lg:py-[5px]" style={{ zIndex: 2, color: "#FFFFFF", fontWeight: 700, background: "rgba(0,0,0,0.65)", borderRadius: "50px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>VOOR</span>
                <span className="absolute top-[7px] right-[7px] lg:top-3 lg:right-3 text-[9px] lg:text-[11px] px-[5px] py-[2px] lg:px-3 lg:py-[5px]" style={{ zIndex: 2, color: "#1A1A1A", fontWeight: 700, background: "rgba(155,203,108,0.9)", borderRadius: "50px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>NA</span>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: "8px", left: "10px" }}>
                  <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>Dakpan herstelling</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SECTIE 3: VS vergelijking ── */}
      <section style={{ background: "#111111", padding: "120px 0 100px" }}>
        <div className="site-wrap">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p className="site-eyebrow mb-4">Het verschil</p>
            <h2 style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "#FFFFFF",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              letterSpacing: "-0.028em", lineHeight: 1.12,
            }}>
              Zonder of<br />
              <span style={{ color: "#9BCB6C" }}>met MOS-X Dakzorg?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch" style={{ gap: "32px" }}>

            {/* Zonder */}
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.4)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(239,68,68,0.10)" }}>
              {/* Foto bovenaan */}
              <div style={{ height: "200px", overflow: "hidden" }}>
                <img src="/images/olen-voor.png" alt="Voor - Olen" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
              </div>
              {/* Content */}
              <div style={{ padding: "28px 32px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "18px", color: "#FFFFFF", fontFamily: "var(--font-montserrat), system-ui, sans-serif", letterSpacing: "-0.02em" }}>Zonder MOS-X Dakzorg</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {withoutItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                        <X size={11} color="#EF4444" strokeWidth={2.5} />
                      </div>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: 1.55, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VS divider */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "rgba(155,203,108,0.15)",
                border: "1.5px solid rgba(155,203,108,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "13px", fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>VS</span>
              </div>
            </div>

            {/* Met MOS-X Dakzorg */}
            <div style={{ background: "rgba(155,203,108,0.08)", border: "1.5px solid rgba(155,203,108,0.4)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(155,203,108,0.12)" }}>
              {/* Foto bovenaan */}
              <div style={{ height: "200px", overflow: "hidden" }}>
                <img src="/images/Olen - After.png" alt="Na - Olen" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
              </div>
              {/* Content */}
              <div style={{ padding: "28px 32px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "18px", color: "#FFFFFF", fontFamily: "var(--font-montserrat), system-ui, sans-serif", letterSpacing: "-0.02em" }}>Met MOS-X Dakzorg</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {withItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(155,203,108,0.2)", border: "1px solid rgba(155,203,108,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                        <Check size={11} color="#9BCB6C" strokeWidth={2.5} />
                      </div>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", lineHeight: 1.55, fontFamily: "var(--font-inter), system-ui, sans-serif", fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTIE 4: Dakzorg prijskaart ── */}
      <section style={{ background: "#F7F8F6", padding: "80px 0 100px" }}>
        <div className="site-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr]" style={{ gap: "56px", alignItems: "center" }}>

            {/* Links: foto + badge */}
            <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "4/5" }}>
              <img
                src="/images/Foto realisatie.jpg"
                alt="MOS-X Dakzorg realisatie"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }} />
              <div style={{
                position: "absolute", bottom: "24px", left: "20px", right: "20px",
                background: "rgba(10,20,10,0.80)",
                backdropFilter: "blur(8px)",
                borderRadius: "14px", padding: "14px 18px",
                display: "flex", alignItems: "flex-start", gap: "12px",
                border: "1px solid rgba(155,203,108,0.25)",
              }}>
                <ShieldCheck size={20} color="#9BCB6C" strokeWidth={2} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-montserrat), system-ui, sans-serif", lineHeight: 1.3, marginBottom: "4px" }}>
                    Regelmatige zorg, een dak dat langer meegaat.
                  </p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter), system-ui, sans-serif", lineHeight: 1.4 }}>
                    Wij houden uw dak in topconditie.
                  </p>
                </div>
              </div>
            </div>

            {/* Rechts: inhoud */}
            <div>
              <p className="site-eyebrow mb-3">MOS-X DAKZORG</p>
              <h2 style={{
                fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)", fontWeight: 800, color: "#1A1A1A",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                letterSpacing: "-0.028em", lineHeight: 1.15, marginBottom: "12px",
                whiteSpace: "nowrap",
              }}>
                Je dak verzorgd. <span style={{ color: "#9BCB6C" }}>Jaar na jaar.</span>
              </h2>
              <p style={{ fontSize: "15px", color: "#545454", lineHeight: 1.65, marginBottom: "28px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Periodieke opvolging na je dakreiniging,<br />
                zodat je dak langer proper en in goede staat blijft.
              </p>

              {/* Card: prijs + checklist + CTA */}
              <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "28px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: "0" }}>

              {/* Prijs + checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-[210px_1fr]" style={{ gap: "24px", marginBottom: "28px" }}>

                {/* Prijs */}
                <div>
                  <p style={{ fontSize: "12px", color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "6px" }}>Vanaf</p>
                  <p style={{ fontSize: "52px", fontWeight: 800, color: "#1A1A1A", fontFamily: "var(--font-montserrat), system-ui, sans-serif", letterSpacing: "0", lineHeight: 1, marginBottom: "8px" }}>€<span style={{ marginLeft: "5px" }}>249</span></p>
                  <p style={{ fontSize: "13px", color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "20px" }}>per onderhoudsbeurt</p>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "10px 12px", background: "#F7F8F6", borderRadius: "10px", border: "1px solid #E5E7EB", maxWidth: "175px" }}>
                    <Calendar size={13} color="#9BCB6C" strokeWidth={2} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <p style={{ fontSize: "12px", color: "#545454", lineHeight: 1.5, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                      Onderhoud jaarlijks of om de 2 jaar, afhankelijk van je dak.
                    </p>
                  </div>
                </div>

                {/* Checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "12px" }}>
                  {[
                    "Volledige controle van je dak",
                    "Dakgoten & afvoer gereinigd",
                    "Behandeling tegen nieuwe mosgroei",
                    "Veluxen, aansluitingen & loodwerk nagekeken",
                    "Kleine gebreken aangepakt waar mogelijk",
                    "Je ontvangt een duidelijk onderhoudsrapport",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#9BCB6C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={11} color="#FFFFFF" strokeWidth={2.5} />
                      </div>
                      <span style={{ fontSize: "13px", color: "#1A1A1A", fontFamily: "var(--font-inter), system-ui, sans-serif", lineHeight: 1.4 }}>{item}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* CTA knop */}
              <a
                href="/contact"
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#7AB54E"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#9BCB6C"; }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  width: "100%", padding: "16px 24px", borderRadius: "12px",
                  background: "#9BCB6C", color: "#FFFFFF",
                  fontSize: "15px", fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  textDecoration: "none", marginBottom: "12px",
                  transition: "background 200ms ease",
                  boxSizing: "border-box",
                }}
              >
                <Calendar size={16} strokeWidth={2} />
                Vraag MOS-X Dakzorg aan
                <ChevronRight size={16} strokeWidth={2.5} />
              </a>

              {/* Info noot */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "#F7F8F6", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="10" cy="10" r="9" stroke="#9BCB6C" strokeWidth="1.5"/>
                  <path d="M10 9v5M10 6.5v.5" stroke="#9BCB6C" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p style={{ fontSize: "13px", color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                  Grotere herstellingen? Die bespreken we altijd vooraf.
                </p>
              </div>

              </div>{/* einde card */}
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="site-pad" style={{ background: "#F7F8F6" }}>
        <div className="site-wrap">
          <h2
            className="font-bold mb-8"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", letterSpacing: "-0.02em", color: "#1A1A1A", textAlign: "center" }}
          >
            Veelgestelde vragen over MOS-X Dakzorg.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }} className="faq-grid">
            {faqs.map((f, i) => (
              <div
                key={i}
                style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden", alignSelf: "start" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "20px 24px", cursor: "pointer", background: "none", border: "none",
                    textAlign: "left", gap: "16px",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "14px", color: "#1A1A1A", lineHeight: 1.4 }}>
                    {f.q}
                  </span>
                  <ChevronDown
                    size={18}
                    color="#9BCB6C"
                    style={{ flexShrink: 0, transition: "transform 220ms ease", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px", borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
                    <p style={{ fontSize: "14px", lineHeight: 1.65, color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* WhatsApp kaart */}
            <div style={{
              background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px",
              padding: "10px 24px", alignSelf: "start",
              display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
            }}>
              <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "14px", color: "#1A1A1A" }}>
                Staat je vraag er niet bij?
              </p>
              <a
                href="https://wa.me/32468352869?text=Hallo%20Yannick%2C%20ik%20heb%20een%20vraag%20over%20MOS-X%20Dakzorg."
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={e => { e.currentTarget.style.background = "#7AB54E"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#9BCB6C"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#9BCB6C", color: "#FFFFFF", borderRadius: "8px",
                  padding: "10px 18px", fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "13px", textDecoration: "none",
                  whiteSpace: "nowrap", transition: "background-color 0.2s ease",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Stel je vraag aan Yannick
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTIE 5: CTA card ── */}
      <section style={{ background: "#F7F8F6", paddingBottom: "80px" }}>
        <div className="site-wrap">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-6 py-8 lg:px-12" style={{
            background: "#0B0F0C",
            border: "1px solid rgba(155,203,108,0.25)",
            borderRadius: "16px",
            gap: "24px",
          }}>
            <div className="text-center lg:text-left" style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "6px", lineHeight: 1.25 }}>
                Geef je dak de zorg <span style={{ color: "#9BCB6C" }}>die het verdient.</span>
              </p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Jaar na jaar een gezond dak zonder verrassingen. Yannick zorgt voor de rest.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row w-full lg:w-auto" style={{ gap: "10px" }}>
              <a
                href="https://wa.me/32468352869"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCtaWaHovered(true)}
                onMouseLeave={() => setCtaWaHovered(false)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  flex: 1,
                  background: ctaWaHovered ? "#7AB54E" : "#9BCB6C",
                  color: "#FFFFFF", border: "none",
                  borderRadius: "8px", padding: "12px 20px",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  whiteSpace: "nowrap", transition: "background-color 0.2s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Yannick
              </a>
              <a
                href="tel:+32468352869"
                onMouseEnter={() => setCtaPhoneHovered(true)}
                onMouseLeave={() => setCtaPhoneHovered(false)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  flex: 1,
                  background: "transparent",
                  color: ctaPhoneHovered ? "#9BCB6C" : "#FFFFFF",
                  border: ctaPhoneHovered ? "1px solid #9BCB6C" : "1px solid rgba(155,203,108,0.5)",
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
        </div>
      </section>

    </PageLayout>
  );
}
