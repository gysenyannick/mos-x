"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Phone, User, Calendar, MessageCircle, Home, ShieldCheck, Headphones, Handshake, TrendingUp, Leaf, BarChart2, Settings, ChevronRight } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";

function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"h" | "v" | null>(null);

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - left) / width) * 100));
    setPos(pct);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { dragging.current = true; updatePos(e.clientX); };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp = () => { dragging.current = false; };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; axis.current = null; dragging.current = true; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const dx = Math.abs(e.touches[0].clientX - startX.current);
      const dy = Math.abs(e.touches[0].clientY - startY.current);
      if (!axis.current) axis.current = dx > dy ? "h" : "v";
      if (axis.current === "h") { e.preventDefault(); updatePos(e.touches[0].clientX); }
    };
    const onTouchEnd = () => { dragging.current = false; axis.current = null; };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => { el.removeEventListener("touchstart", onTouchStart); el.removeEventListener("touchmove", onTouchMove); el.removeEventListener("touchend", onTouchEnd); };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ position: "relative", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.10)", aspectRatio: "4/3", cursor: "ew-resize", userSelect: "none" }}
    >
      {/* Voor */}
      <img src="/images/IMG_5414.JPEG" alt="Dak voor behandeling" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", pointerEvents: "none" }} />

      {/* Na — geclipped */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${pos}%)`, pointerEvents: "none" }}>
        <img src="/images/IMG_5436.JPEG" alt="Dak na behandeling" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      </div>

      {/* Lijn */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: "2px", background: "#FFFFFF", transform: "translateX(-50%)", pointerEvents: "none" }} />

      {/* Handle */}
      <div style={{ position: "absolute", top: "50%", left: `${pos}%`, transform: "translate(-50%, -50%)", width: "34px", height: "34px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #9BCB6C", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.20)", pointerEvents: "none" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9BCB6C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l-6-6 6-6"/><path d="M15 6l6 6-6 6"/></svg>
      </div>

      {/* Labels */}
      <div style={{ position: "absolute", bottom: "14px", left: "14px", background: "rgba(0,0,0,0.65)", color: "#fff", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none" }}>VOOR</div>
      <div style={{ position: "absolute", bottom: "14px", right: "14px", background: "#9BCB6C", color: "#1A1A1A", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none" }}>NA</div>
    </div>
  );
}

export default function OverOnsPage() {
  const [homeHovered, setHomeHovered] = useState(false);
  const [phoneHovered, setPhoneHovered] = useState(false);
  const [waHovered, setWaHovered] = useState(false);

  return (
    <PageLayout>
      <style>{`
        @media (max-width: 1023px) {
          .over-ons-hero { min-height: 420px !important; padding-bottom: 80px !important; }
          .over-ons-hero-imgwrap { left: 0 !important; }
          .over-ons-hero-gradient {
            background: linear-gradient(to bottom, rgba(247,248,246,0.82) 0%, rgba(247,248,246,0.82) 55%, rgba(247,248,246,0.82) 100%) !important;
          }
          .over-ons-yannick-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .over-ons-yannick-grid .over-ons-yannick-photo {
            order: -1;
          }
          .over-ons-mission-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .over-ons-mission-grid > *:first-child { order: 1; }
          .over-ons-mission-grid > *:last-child  { order: 2; }
          .over-ons-mission-grid h2 { white-space: normal !important; }
          .over-ons-mission-grid p  { white-space: normal !important; }
          .gemoedsrust-cards {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .gemoedsrust-cards > div {
            flex-direction: row !important;
            align-items: center !important;
            text-align: left !important;
            padding: 10px 12px !important;
            gap: 10px !important;
          }
          .gemoedsrust-cards > div > div:first-child {
            width: 36px !important;
            height: 36px !important;
            margin-bottom: 0 !important;
            flex-shrink: 0 !important;
          }
          .gemoedsrust-cards > div > div:nth-child(2) {
            display: none !important;
          }
          .gemoedsrust-cards p {
            font-size: 11px !important;
            margin: 0 !important;
          }
          .gemoedsrust-quote {
            padding: 20px 20px !important;
            gap: 8px 16px !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            text-align: center !important;
          }
          .gemoedsrust-quote > span { order: 1; font-size: 28px !important; line-height: 1 !important; }
          .gemoedsrust-quote > svg  { order: 1; width: 22px !important; height: 22px !important; }
          .gemoedsrust-quote > p    { order: 2; width: 100% !important; font-size: 13px !important; }
          .gemoedsrust-glow { display: none !important; }
          .gemoedsrust-mos-texture {
            transform: translateX(80px) !important;
            opacity: 0.45 !important;
          }
          .over-ons-ambitie-grid {
            grid-template-columns: 1fr !important;
          }
          .over-ons-ambitie-tekst {
            padding-top: 48px !important;
            padding-right: 0 !important;
          }
          .over-ons-ambitie-right {
            padding-left: 0 !important;
            padding-top: 32px !important;
            padding-bottom: 48px !important;
          }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="over-ons-hero" style={{ background: "#F7F8F6", paddingTop: "120px", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>

        {/* Foto rechterhelft */}
        <div className="over-ons-hero-imgwrap" style={{ position: "absolute", top: 0, left: "52%", right: 0, bottom: 0, zIndex: 0, overflow: "hidden" }}>
          <img
            src="/images/Weer een dak ontmost.jpg"
            alt="Dak ontmossing"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }}
          />
          {/* Gradient fade vanuit links */}
          <div className="over-ons-hero-gradient" style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #F7F8F6 0%, #F7F8F6 5%, transparent 55%)" }} />
        </div>

        {/* Tekst */}
        <div className="site-wrap" style={{ position: "relative", zIndex: 1 }}>
          <BackLink href="/" />
          <p style={{ fontSize: "13px", color: "#9BCB6C", marginBottom: "20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            <Link
              href="/"
              onMouseEnter={() => setHomeHovered(true)}
              onMouseLeave={() => setHomeHovered(false)}
              style={{ color: homeHovered ? "#9BCB6C" : "#1A1A1A", textDecoration: "none", transition: "color 180ms ease" }}
            >Home</Link>
            <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "#9BCB6C" }} />
            <span style={{ color: "#9BCB6C" }}>Over ons</span>
          </p>
          <h1 className="leading-tight mb-4"
            style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1.625rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", color: "#1A1A1A" }}>
            Wij zorgen voor daken.<br /><span style={{ color: "#9BCB6C" }}>En voor gemoedsrust.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "18px", color: "#555555" }}>
            Wij helpen huiseigenaars hun dak zo lang mogelijk in topconditie te houden met<br />professioneel onderhoud, eerlijke adviezen en een persoonlijke aanpak.
          </p>
        </div>
      </section>

      {/* ── Achter MOS-X / Yannick ── */}
      <section style={{ background: "#FFFFFF", padding: "80px 0" }}>
        <div className="site-wrap">
          <div className="over-ons-yannick-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "center" }}>

            {/* Links: tekst */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#9BCB6C", marginBottom: "12px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
                Achter MOS-X
              </p>
              <h2 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", letterSpacing: "-0.028em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "24px" }}>
                Hallo, ik ben <span style={{ color: "#9BCB6C" }}>Yannick.</span>
              </h2>
              <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.8, marginBottom: "14px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                MOS-X is voor mij meer dan een bedrijf. Het is de kans om te bewijzen dat vakmanschap, duidelijke communicatie en persoonlijke service nog altijd hand in hand kunnen gaan.
              </p>
              <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.8, marginBottom: "14px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Ik wil dat klanten zich nooit hoeven af te vragen wanneer ze antwoord krijgen, wie verantwoordelijk is voor hun project of wat de volgende stap is. Daarom ben ik zelf jouw aanspreekpunt, van het eerste contact tot de oplevering.
              </p>
              <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.8, marginBottom: "28px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Voor mij stopt een project niet wanneer de werken klaar zijn. Het stopt wanneer jij met een goed gevoel terugkijkt op je keuze voor MOS-X.
              </p>
            </div>

            {/* Rechts: foto met quote overlay */}
            <div className="over-ons-yannick-photo" style={{ borderRadius: "16px", overflow: "hidden", height: "400px", position: "relative" }}>
              <img
                src="/images/Yannick foto op dak.JPEG"
                alt="Yannick - oprichter MOS-X"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 70%" }}
              />
              {/* Quote overlay onderaan */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(11,15,12,0.88)", backdropFilter: "blur(6px)", padding: "18px 24px", borderTop: "1px solid rgba(155,203,108,0.20)", display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "42px", color: "#9BCB6C", fontFamily: "Georgia, serif", lineHeight: 0.7, flexShrink: 0, marginTop: "-4px" }}>"</span>
                <div>
                  <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "14px", color: "#FFFFFF", lineHeight: 1.4, marginBottom: "3px" }}>
                    We bouwen niet alleen aan daken.
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "14px", color: "#9BCB6C", lineHeight: 1.4 }}>
                    We bouwen aan vertrouwen.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Onderhouden is Overhouden ── */}
      <section style={{ background: "#FFFFFF", padding: "80px 0" }}>
        <div className="site-wrap">
          <div className="over-ons-mission-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>

            {/* Links: interactieve voor/na slider */}
            <BeforeAfterSlider />

            {/* Rechts: tekst */}
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#9BCB6C", fontFamily: "var(--font-montserrat), system-ui, sans-serif", marginBottom: "20px" }}>
                Waarom MOS-X bestaat
              </p>

              <h2 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", letterSpacing: "-0.028em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "24px", whiteSpace: "nowrap" }}>
                Onderhouden is <span style={{ color: "#9BCB6C" }}>Overhouden.</span>
              </h2>

              <p style={{ fontSize: "15px", color: "#555555", lineHeight: 1.75, marginBottom: "14px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Te vaak wordt een vervuild dak gezien als een dak dat vervangen moet worden, terwijl professioneel onderhoud de levensduur vaak nog jarenlang kan verlengen.
              </p>
              <p style={{ fontSize: "15px", color: "#555555", lineHeight: 1.75, marginBottom: "14px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Dat is vandaag belangrijker dan ooit. De kosten voor dakrenovaties en bouwmaterialen blijven stijgen, terwijl een goed onderhouden dak een dure renovatie vaak jarenlang kan uitstellen.
              </p>
              <p style={{ fontSize: "15px", color: "#1A1A1A", fontWeight: 700, lineHeight: 1.75, marginBottom: "14px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
                Daarom bestaat MOS-X.
              </p>
              <p style={{ fontSize: "15px", color: "#555555", lineHeight: 1.75, marginBottom: "24px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Wij helpen huiseigenaars hun dak professioneel te reinigen, beschermen en onderhouden, zodat het zo lang mogelijk in topconditie blijft. Zo bieden we een slimme, duurzame én betaalbare oplossing voor de toekomst van je woning.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ── Gemoedsrust ── */}
      <section style={{ background: "#0B0F0C", padding: "80px 0", position: "relative", overflow: "hidden" }}>

        {/* Groene radial glow */}
        <div className="gemoedsrust-glow" style={{ position: "absolute", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(155,203,108,0.08) 0%, transparent 70%)", left: "-150px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 0 }} />
        {/* Mos texture rechts */}
        <div className="gemoedsrust-mos-texture" style={{ position: "absolute", right: 0, top: 0, width: "520px", height: "100%", pointerEvents: "none", zIndex: 0 }}>
          <img src="/images/mos-texture.png" alt="" aria-hidden="true" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "right center", opacity: 0.50, display: "block", mixBlendMode: "screen" }} />
          {/* Fade links + boven + onder */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0B0F0C 0%, #0B0F0C 15%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #0B0F0C 0%, transparent 25%, transparent 75%, #0B0F0C 100%)", pointerEvents: "none" }} />
        </div>

        <div className="site-wrap" style={{ position: "relative", zIndex: 1 }}>

          {/* Header: label+heading | verticale lijn | beschrijving */}
          <div style={{ display: "flex", alignItems: "center", gap: "48px", marginBottom: "48px", flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 auto" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#9BCB6C", marginBottom: "10px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
                Waar klanten ons voor kiezen
              </p>
              <h2 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 2.75rem)", letterSpacing: "-0.028em", lineHeight: 1.05, color: "#FFFFFF", margin: 0 }}>
                Gemoedsrust<span style={{ color: "#9BCB6C" }}>.</span>
              </h2>
            </div>
            <div style={{ width: "1px", height: "64px", background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
            <p style={{ flex: 1, minWidth: "260px", fontSize: "15px", color: "rgba(255,255,255,0.60)", lineHeight: 1.75, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              Een proper dak is belangrijk. Maar uiteinidelijk kiezen klanten<br />voor iets veel waardevollers: de zekerheid dat alles correct verloopt.
            </p>
          </div>

          {/* 6 cards met subtekst */}
          <div className="gemoedsrust-cards" style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            {[
              { Icon: User,          title: "Rechtstreeks contact met Yannick",      desc: "Één vast aanspreekpunt van begin tot eind." },
              { Icon: MessageCircle, title: "Snelle communicatie",                   desc: "Duidelijke antwoorden en korte lijnen." },
              { Icon: Calendar,      title: "Afspraken worden nagekomen",            desc: "We doen wat we beloven, op het afgesproken moment." },
              { Icon: Home,          title: "Respect voor jouw woning",              desc: "We werken netjes en met oog voor detail." },
              { Icon: ShieldCheck,   title: "Professionele producten en technieken", desc: "Duurzame oplossingen met bewezen kwaliteit." },
              { Icon: Headphones,    title: "Ook na de uitvoering bereikbaar",       desc: "We blijven beschikbaar voor advies en opvolging." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ flex: "1 1 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px 18px 16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(155,203,108,0.10)", border: "1.5px solid rgba(155,203,108,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", flexShrink: 0 }}>
                  <Icon size={24} color="#9BCB6C" strokeWidth={1.5} />
                </div>
                <div style={{ width: "24px", height: "2px", background: "#9BCB6C", borderRadius: "2px", marginBottom: "14px" }} />
                <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "13px", color: "#FFFFFF", lineHeight: 1.4 }}>{title}</p>
              </div>
            ))}
          </div>

          {/* Quote blok */}
          <div className="gemoedsrust-quote" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "14px 52px", display: "flex", alignItems: "center", justifyContent: "center", gap: "48px", maxWidth: "780px", margin: "0 auto" }}>
            <span style={{ fontSize: "56px", color: "#9BCB6C", fontFamily: "Georgia, serif", lineHeight: 0.7, flexShrink: 0 }}>"</span>
            <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.80)", lineHeight: 1.8, textAlign: "center" }}>
              Wij willen niet dat je klant bent tot de factuur betaald is.<br />
              Wij willen dat je ook nadien nog <strong style={{ color: "#9BCB6C", fontWeight: 700 }}>met vertrouwen</strong> op ons kunt rekenen.
            </p>
            <Handshake size={40} color="#9BCB6C" strokeWidth={1.5} style={{ flexShrink: 0, opacity: 0.80 }} />
          </div>

        </div>
      </section>

      {/* ── Onze Ambitie ── */}
      <section style={{ background: "#F7F8F6", padding: "0 0 56px 0" }}>
        <div className="site-wrap" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="over-ons-ambitie-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>

            {/* ── Links: tekst boven, foto onder ── */}
            <div className="over-ons-ambitie-left" style={{ display: "flex", flexDirection: "column" }}>

              {/* Tekst */}
              <div className="over-ons-ambitie-tekst" style={{ paddingTop: "80px", paddingRight: "56px", paddingBottom: "28px" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#9BCB6C", fontFamily: "var(--font-montserrat), system-ui, sans-serif", marginBottom: "12px" }}>
                  Onze ambitie
                </p>
                <h2 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 3.2vw, 2.8rem)", letterSpacing: "-0.028em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>
                  De toekomst van<br /><span style={{ color: "#9BCB6C" }}>dakonderhoud.</span>
                </h2>
                <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "14px", color: "#1A1A1A", marginBottom: "14px" }}>
                  Slim onderhouden, langer beschermd.
                </p>
                <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.75, marginBottom: "12px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                  Wij geloven dat de toekomst niet alleen ligt in het vervangen van daken, maar vooral in het slim onderhouden ervan.
                </p>
                <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.75, marginBottom: "12px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                  Nieuwe technieken, innovatieve coatings en duurzamere producten maken het vandaag mogelijk om bestaande daken langer te beschermen dan ooit tevoren.
                </p>
                <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.75, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                  Daar willen wij een voortrekkersrol in spelen. Niet door de grootste te worden, maar door de standaard in dakonderhoud elke dag een beetje hoger te leggen.
                </p>
              </div>

              {/* Foto — vult resterende ruimte, paddingBottom matcht rechterkolom */}
              <div style={{ flex: 1, paddingBottom: "80px" }}>
                <div style={{ position: "relative", overflow: "hidden", height: "100%", minHeight: "180px" }}>
                  <img
                    src="/images/Foto dak.jpg"
                    alt=""
                    aria-hidden="true"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 33%", transform: "scale(1.1)", transformOrigin: "center 33%" }}
                  />
                  {/* Fade bovenkant */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "72px", background: "linear-gradient(to bottom, #F7F8F6, transparent)", pointerEvents: "none" }} />
                  {/* Fade onderkant */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "72px", background: "linear-gradient(to top, #F7F8F6, transparent)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            {/* ── Rechts: genummerde items ── */}
            <div className="over-ons-ambitie-right" style={{ paddingTop: "80px", paddingLeft: "56px", paddingBottom: "80px" }}>
              {/* Label */}
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", marginBottom: "28px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
                <span style={{ color: "#9BCB6C" }}>Waarom wij </span>
                <span style={{ color: "#1A1A1A" }}>geloven in deze toekomst</span>
              </p>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { Icon: BarChart2,   title: "Renovaties worden steeds duurder",    desc: "Onderhoud wordt daardoor een steeds interessantere investering.",                                                  num: "01" },
                  { Icon: ShieldCheck, title: "Coatings blijven evolueren",          desc: "Nieuwe generaties coatings bieden een langere bescherming en een duurzamer resultaat.",                          num: "02" },
                  { Icon: Leaf,        title: "Minder impact op het milieu",         desc: "Een dak behouden vraagt minder grondstoffen en produceert minder afval dan een volledige vervanging.",          num: "03" },
                  { Icon: Settings,    title: "Betere technieken",                   desc: "Professionele reinigingsmethodes worden steeds veiliger en efficientere voor bestaande dakpannen.",             num: "04" },
                  { Icon: Home,        title: "Meer focus op behoud",                desc: "Steeds meer huiseigenaars kiezen ervoor hun woning slim te onderhouden in plaats van meteen te renoveren.",    num: "05" },
                ].map(({ Icon, title, desc, num }) => (
                  <div key={title} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "18px 20px", display: "flex", gap: "16px", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(155,203,108,0.10)", border: "1.5px solid rgba(155,203,108,0.30)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={22} color="#9BCB6C" strokeWidth={1.75} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "13.5px", color: "#1A1A1A", marginBottom: "4px" }}>{title}</p>
                      <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "12.5px", color: "#666666", lineHeight: 1.6 }}>{desc}</p>
                    </div>
                    <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "22px", color: "#E5E7EB", flexShrink: 0, lineHeight: 1 }}>{num}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#F7F8F6", paddingBottom: "80px" }}>
        <div className="site-wrap">
          <div className="page-cta-bar" style={{
            background: "#0B0F0C",
            border: "1px solid #9BCB6C",
            borderRadius: "16px",
            padding: "32px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
            flexWrap: "wrap",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 100% 100%, rgba(155,203,108,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
            <div className="page-cta-text" style={{ flex: 1, minWidth: "260px", position: "relative", zIndex: 1 }}>
              <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "6px", lineHeight: 1.25 }}>
                Benieuwd wat <span style={{ color: "#9BCB6C" }}>jouw dak</span> nodig heeft?
              </p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.5, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Persoonlijk advies van Yannick.
              </p>
            </div>
            <div className="page-cta-buttons" style={{ display: "flex", gap: "10px", flexShrink: 0, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              <a
                href="https://wa.me/32468352869"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: waHovered ? "#7AB54E" : "#9BCB6C", color: "#FFFFFF",
                  borderRadius: "8px", padding: "12px 20px",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  whiteSpace: "nowrap", transition: "background-color 0.2s ease",
                }}
                onMouseEnter={() => setWaHovered(true)}
                onMouseLeave={() => setWaHovered(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Yannick
              </a>
              <a
                href="tel:+32468352869"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "transparent",
                  border: phoneHovered ? "1px solid #9BCB6C" : "1px solid rgba(155,203,108,0.5)",
                  color: phoneHovered ? "#9BCB6C" : "#FFFFFF",
                  borderRadius: "8px", padding: "12px 20px",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  whiteSpace: "nowrap", transition: "border-color 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={() => setPhoneHovered(true)}
                onMouseLeave={() => setPhoneHovered(false)}
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
