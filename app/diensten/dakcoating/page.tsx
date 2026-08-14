"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Phone, ArrowRight, ChevronDown, Droplets, ShieldCheck, Home, CloudRain, ChevronRight, Leaf, Sparkles, Banknote, Recycle, X, Check, Sun, Wind } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import BeforeAfterSlider from "@/components/before-after-slider";

const steps = [
  { step: "STAP 01", Icon: Home,        title: "Afplakken & voorbereiding", desc: "Ramen, zonnepanelen, veranda's, schouwen en andere onderdelen worden zorgvuldig afgeschermd zodat de werken veilig en netjes kunnen verlopen." },
  { step: "STAP 02", Icon: Droplets,    title: "Eerste coatinglaag",        desc: "We brengen een eerste laag watergedragen dakcoating aan met een professionele airless spuitmachine. Hierbij wordt een anti-mosprimer toegevoegd voor optimale hechting." },
  { step: "STAP 03", Icon: CloudRain,   title: "Tweede coatinglaag",        desc: "Nadat de eerste laag volledig is uitgehard brengen we een tweede laag coating aan in de gekozen kleur. Zo ontstaat een duurzame en egale beschermlaag." },
  { step: "STAP 04", Icon: ShieldCheck, title: "Controle & afwerking",      desc: "Na de werken verwijderen we alle beschermingsmaterialen en voeren we een grondige controle uit zodat alles netjes wordt achtergelaten." },
];

const features = [
  { Icon: ShieldCheck, title: "Beschermende laag",   desc: "Vormt een vocht- en vuilafstotend schild over je dakpannen." },
  { Icon: Sun,         title: "UV-bestendig",         desc: "Behoudt langer zijn uitstraling ondanks blootstelling aan zonlicht." },
  { Icon: CloudRain,   title: "Weerbestendig",        desc: "Ontwikkeld om bestand te zijn tegen regen, vorst en wisselende weersomstandigheden." },
  { Icon: Wind,        title: "Dampdoorlatend",       desc: "Laat de ondergrond blijven ademen terwijl de buitenzijde beschermd wordt." },
  { Icon: Leaf,        title: "Anti-mos werking",     desc: "Helpt nieuwe aangroei van mossen en algen vertragen." },
];

const coatingColors = [
  { name: "Zwart",      hex: "#1C1C1C" },
  { name: "Fondant",    hex: "#3D2B20" },
  { name: "Brown",      hex: "#6B3D2A" },
  { name: "Antraciet",  hex: "#464646" },
  { name: "Avondrood",  hex: "#7E1E1E" },
  { name: "Red",        hex: "#B52424" },
  { name: "Terra",      hex: "#C45A28" },
];

const benefits = [
  { Icon: ShieldCheck, title: "Nieuwe beschermlaag",      desc: "Beschermt de dakpannen opnieuw tegen weersinvloeden." },
  { Icon: Droplets,    title: "Minder vochtopname",       desc: "Helpt voorkomen dat dakpannen langdurig vocht vasthouden." },
  { Icon: Leaf,        title: "Minder snelle mosvorming", desc: "Een gladde beschermlaag maakt het moeilijker voor vuil en mos om zich opnieuw vast te zetten." },
  { Icon: Sparkles,    title: "Vernieuwde uitstraling",   desc: "Je dak krijgt opnieuw een frisse, egale uitstraling in de gewenste kleur." },
  { Icon: Banknote,    title: "Stel dure renovatie uit",  desc: "Behoud je bestaande dak langer zonder meteen een volledige vervanging." },
  { Icon: Recycle,     title: "Duurzamere keuze",         desc: "Een dak behouden betekent minder materiaalverbruik en minder afval." },
];

const faqs = [
  { q: "Wanneer is dakcoating nodig?", a: "Wanneer betonpannen of kunstleien poreus geworden zijn en hun beschermlaag verloren hebben. Tijdens de inspectie bekijkt Yannick de staat van je dak en geeft eerlijk advies." },
  { q: "Voor welke daken is dakcoating geschikt?", a: "Dakcoating wordt voornamelijk toegepast op betonpannen en kunstleien. Voor andere daktypes volstaat meestal een professionele reiniging en een preventieve behandeling." },
  { q: "Hoe lang gaat dakcoating mee?", a: "Op dakcoating geeft MOS-X tot 10 jaar garantie. Tijdens de inspectie krijg je advies op maat van jouw dak." },
  { q: "Kan ik een andere kleur kiezen?", a: "Ja. Dakcoating is beschikbaar in verschillende kleuren zodat je dak opnieuw de uitstraling krijgt die bij je woning past." },
  { q: "Moet het dak eerst gereinigd worden?", a: "Ja. Voor een optimale hechting moet het dak eerst grondig gereinigd worden. Dakreiniging wordt apart uitgevoerd voor de coating wordt aangebracht." },
];

export default function DakcoatingPage() {
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
  const [openFaq, setOpenFaq]                 = useState<number | null>(null);
  const [waHovered, setWaHovered]             = useState(false);
  const [phoneHovered, setPhoneHovered]       = useState(false);
  const [lightboxImg, setLightboxImg]         = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxImg) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxImg(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lightboxImg]);

  return (
    <PageLayout>

      {/* Hero — dark */}
      <section style={{ background: "#111111", position: "relative", overflow: "hidden", minHeight: "calc(100vh + 30px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>

        {/* Video desktop — absoluut, vult de volledige rechterhelft */}
        <div className="hidden lg:block" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "44%", zIndex: 1 }}>
          <video
            src="/videos/Dakcoating.mp4"
            autoPlay muted loop playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Gradient van boven: subtiel */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,17,17,0.55) 0%, rgba(17,17,17,0.2) 18%, transparent 38%)", pointerEvents: "none" }} />
          {/* Gradient van links: vervaagt naar tekst */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #111111 0%, rgba(17,17,17,0.9) 10%, rgba(17,17,17,0.3) 28%, transparent 52%)", pointerEvents: "none" }} />
        </div>

        {/* Video mobile — uitlopend boven en onder voor naadloze overgang */}
        <div className="block lg:hidden" style={{ position: "absolute", top: "-200px", right: 0, bottom: "-200px", left: 0, zIndex: 1 }}>
          <video
            src="/videos/Dakcoating.mp4"
            autoPlay muted loop playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 50%", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,17,17,0.93) 0%, rgba(17,17,17,0.80) 50%, rgba(17,17,17,0.90) 100%)", pointerEvents: "none" }} />
        </div>

        <div className="site-wrap pt-[115px] lg:pt-[140px] pb-[100px] lg:pb-[60px] lg:-mt-[140px]" style={{ position: "relative", zIndex: 2, width: "100%" }}>

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
            <span style={{ color: "#9BCB6C" }}>Dakcoating</span>
          </p>

          {/* Tekst — linkerhelft op desktop */}
          <div className="lg:w-1/2">
            <p className="site-eyebrow mb-4">Professionele dakcoating</p>
            <h1
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 2.6vw, 2.1rem)",
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
                lineHeight: 1.12,
                marginBottom: "20px",
              }}
            >
              Geef je dak opnieuw<br />
              <span style={{ color: "#9BCB6C" }}>bescherming en uitstraling.</span>
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginBottom: "56px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              Na jaren blootstelling aan regen, zon en vorst kan de oorspronkelijke beschermlaag van dakpannen slijten. Hierdoor worden pannen poreuzer, verliezen ze hun kleur en krijgt mos sneller de kans om terug te groeien.<br /><br />
              Met een professionele dakcoating krijgt je dak een nieuwe beschermende afwerking en opnieuw de uitstraling die het verdient.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="/#calculator"
                onMouseEnter={e => { e.currentTarget.style.background = "#7AB54E"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#9BCB6C"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#9BCB6C", color: "#FFFFFF", borderRadius: "10px",
                  padding: "14px 24px", fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "15px", textDecoration: "none",
                  transition: "background 200ms ease",
                }}
              >
                Bereken je richtprijs
                <ChevronRight size={15} strokeWidth={2.5} />
              </Link>
              <a
                href="tel:+32468352869"
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#9BCB6C"; e.currentTarget.style.color = "#9BCB6C"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "transparent", color: "rgba(255,255,255,0.85)",
                  border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: "10px",
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

        {/* Wave onderaan — desktop */}
        <div className="hidden lg:block" style={{ position: "absolute", bottom: "-1px", left: 0, width: "100%", overflow: "hidden", lineHeight: 0, zIndex: 3 }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "80px" }}>
            <path d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z" fill="#F7F8F6"/>
          </svg>
        </div>
        {/* Wave onderaan — mobile */}
        <div className="block lg:hidden" style={{ position: "absolute", bottom: "-1px", left: 0, width: "100%", overflow: "hidden", lineHeight: 0, zIndex: 3 }}>
          <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "50px" }}>
            <path d="M0,0 C360,45 1080,45 1440,0 L1440,50 L0,50 Z" fill="#F7F8F6"/>
          </svg>
        </div>
      </section>

      {/* Waarom je dak laten coaten? — tekst links, benefit grid rechts */}
      <section style={{ background: "#F7F8F6", padding: "120px 0 100px" }}>
        <div className="site-wrap">
          {/*
            Mobile volgorde: 1) slider  2) header  3) body+CTA
            Desktop volgorde: links: header boven body — rechts: slider (span 2 rijen)
            Gerealiseerd door 3 aparte grid-items met expliciete lg: plaatsing.
          */}
          <div className="grid gap-4 lg:gap-x-16 lg:gap-y-0 items-start grid-cols-1 lg:grid-cols-[5fr_7fr]">

            {/* 1 — Slider + foto's (mobiel: eerste; desktop: rechterkolom, overspant 2 rijen) */}
            <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <BeforeAfterSlider
                beforeSrc="/images/FullSizeRender.JPEG"
                afterSrc="/images/IMG_4574.JPEG"
                beforePosition="center 40%"
                afterPosition="center 40%"
                aspectRatio="16/10"
              />
              <div style={{ display: "flex", gap: "10px" }}>
                {[
                  { src: "/images/IMG_4581 achteraanzicht coating.JPEG", alt: "Achteraanzicht dakcoating" },
                  { src: "/images/IMG_4584 Vooraanzicht dakcoating.JPEG", alt: "Vooraanzicht dakcoating" },
                ].map(photo => (
                  <div key={photo.src} onClick={() => setLightboxImg(photo.src)}
                    style={{ flex: 1, height: "175px", borderRadius: "12px", overflow: "hidden", position: "relative", cursor: "zoom-in", minWidth: 0 }}>
                    <img src={photo.src} alt={photo.alt}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      draggable={false}
                    />
                    <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.50)", borderRadius: "6px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2 — Header (eyebrow + titel + ondertitel) — mobiel: tweede; desktop: linkerkolom rij 1 */}
            <div className="lg:col-start-1 lg:row-start-1" style={{ display: "flex", flexDirection: "column" }}>
              <p className="site-eyebrow mb-4">Waarom dakcoating?</p>
              <h2 style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "#1A1A1A",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                letterSpacing: "-0.028em", lineHeight: 1.12, marginBottom: "10px",
              }}>
                Waarom je dak<br />laten coaten?
              </h2>
              <p style={{ color: "#9BCB6C", fontWeight: 700, fontSize: "15px", marginBottom: "8px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
                Meer dan alleen een nieuwe kleur.
              </p>
            </div>

            {/* 3 — Body tekst + CTA — mobiel: derde; desktop: linkerkolom rij 2 */}
            <div className="lg:col-start-1 lg:row-start-2" style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: "15px", color: "#545454", lineHeight: 1.7, marginBottom: "16px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Na tientallen jaren krijgen dakpannen heel wat te verduren. Regen, vorst, UV-straling en vervuiling zorgen ervoor dat de oorspronkelijke beschermlaag langzaam verdwijnt.
              </p>
              <p style={{ fontSize: "15px", color: "#545454", lineHeight: 1.7, marginBottom: "16px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Wanneer een dakreiniging alleen niet meer volstaat, biedt een dakcoating de ideale oplossing. Na een grondige reiniging brengen we een nieuwe beschermlaag aan die je dak opnieuw beschermt tegen vocht, UV-straling en nieuwe mosgroei.
              </p>
              <p style={{ fontSize: "15px", color: "#545454", lineHeight: 1.7, marginBottom: "40px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Zo krijgt je dak niet alleen zijn frisse uitstraling terug, maar verleng je ook de levensduur van je bestaande dak.
              </p>
              <div>
                <Link
                  href="/#calculator"
                  onMouseEnter={e => { e.currentTarget.style.background = "#7AB54E"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#9BCB6C"; }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "#9BCB6C", color: "#FFFFFF",
                    borderRadius: "8px", padding: "13px 24px",
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    fontWeight: 700, fontSize: "15px", textDecoration: "none",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  Bereken je richtprijs
                  <ChevronRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Welke daken coaten? — 2 foto-kolommen */}
      <section style={{ background: "#F7F8F6", padding: "60px 0 180px" }}>
        <div className="site-wrap">

          {/* Heading + intro */}
          <div style={{ textAlign: "center", maxWidth: "920px", margin: "0 auto 48px" }}>
            <p className="site-eyebrow mb-4">Geschikt voor</p>
            <h2 style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "#1A1A1A",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              letterSpacing: "-0.028em", lineHeight: 1.12, marginBottom: "20px",
            }}>
              Welke daken <span style={{ color: "#9BCB6C" }}>coaten?</span>
            </h2>
            <p style={{ fontSize: "15px", color: "#545454", lineHeight: 1.7, fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "12px" }}>
              Het coaten met een dakcoating kan op verschillende soorten dakbedekkingen toegepast worden, waaronder de meest gebruikte betonpannen of kunstleien zijn.
            </p>
            <p style={{ fontSize: "15px", color: "#545454", lineHeight: 1.7, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              Al de rest van de dakbedekkingen is ontmossen en het aanbrengen van een anti-mos product voldoende.
            </p>
          </div>

          {/* 2 foto-kolommen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Kunstleien */}
            <div className="aspect-video lg:aspect-[4/3]" style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", position: "relative" }}>
              <img
                src="/images/Kunstleien.jfif"
                alt="Kunstleien"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(17,17,17,0.75) 0%, transparent 100%)", padding: "28px 24px 20px", textAlign: "center" }}>
                <p style={{ margin: 0, color: "#FFFFFF", fontWeight: 800, fontSize: "15px", letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif", textTransform: "uppercase" }}>
                  Kunstleien
                </p>
              </div>
            </div>

            {/* Betonpannen */}
            <div className="aspect-video lg:aspect-[4/3]" style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", position: "relative" }}>
              <img
                src="/images/Betonpannen.jpg"
                alt="Betonnen dakpannen"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(17,17,17,0.75) 0%, transparent 100%)", padding: "28px 24px 20px", textAlign: "center" }}>
                <p style={{ margin: 0, color: "#FFFFFF", fontWeight: 800, fontSize: "15px", letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif", textTransform: "uppercase" }}>
                  Betonnen pannen
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Werkwijze — foto flush links + stappen rechts */}
      <section style={{ background: "#111111", overflow: "hidden", position: "relative" }}>
        <style>{`
          @media (max-width: 1023px) {
            .werkwijze-dakcoating-content { padding: 48px 20px !important; margin-left: 0 !important; max-width: 100% !important; }
            .page-cta-bar { flex-direction: column !important; align-items: center !important; text-align: center !important; padding: 28px 24px !important; }
            .page-cta-text { min-width: unset !important; width: 100% !important; }
            .page-cta-buttons { justify-content: center !important; width: 100% !important; }
          }
        `}</style>

        {/* Foto: absoluut gepositioneerd links — alleen desktop */}
        <div className="hidden lg:block" style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "42%" }}>
          <img
            src="/images/IMG_4468 dakcoating pagina.JPEG"
            alt="Dakcoating resultaat"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
          />
          {/* Gradient overgang rechts naar donker */}
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "260px", background: "linear-gradient(to right, rgba(17,17,17,0) 0%, rgba(17,17,17,0.6) 50%, #111111 100%)", pointerEvents: "none" }} />
        </div>

        {/* Rechts: stappen — bepaalt de hoogte van de sectie */}
        <div className="werkwijze-dakcoating-content lg:ml-[42%]" style={{ padding: "52px 56px 64px 28px", display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "780px" }}>
          <p className="site-eyebrow mb-4" style={{ color: "#9BCB6C" }}>Onze werkwijze</p>
          <h2 style={{
            fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", fontWeight: 800, color: "#FFFFFF",
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            letterSpacing: "-0.028em", lineHeight: 1.15, marginBottom: "32px",
          }}>
            Zo brengen we <span style={{ color: "#9BCB6C" }}>dakcoating aan.</span>
          </h2>

          <div>
            {steps.map((s, i) => {
              const isLast = i === steps.length - 1;
              return (
                <div key={i} style={{ display: "flex", gap: "18px", minHeight: "120px" }}>

                  {/* Badge kolom */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "52px", flexShrink: 0, alignSelf: "stretch" }}>
                    <div style={{ flex: 1, width: "1.5px", background: i > 0 ? "rgba(155,203,108,0.35)" : "transparent", marginBottom: "4px" }} />
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "10px", flexShrink: 0,
                      background: "rgba(155,203,108,0.07)", border: "1.5px solid #9BCB6C",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ color: "#9BCB6C", fontWeight: 800, fontSize: "17px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div style={{ flex: 1, width: "1.5px", background: isLast ? "transparent" : "rgba(155,203,108,0.35)", marginTop: "4px" }} />
                  </div>

                  {/* Tekst */}
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "12px 0", borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                    <p style={{ fontWeight: 700, fontSize: "15px", color: "#FFFFFF", marginBottom: "5px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", lineHeight: 1.3 }}>
                      {s.title}
                    </p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div style={{ marginTop: "24px" }}>
            <Link
              href="/contact"
              onMouseEnter={e => { e.currentTarget.style.background = "#7AB54E"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#9BCB6C"; }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#9BCB6C", color: "#FFFFFF", border: "none",
                borderRadius: "8px", padding: "13px 24px",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontWeight: 700, fontSize: "15px", textDecoration: "none",
                transition: "background-color 0.2s ease",
              }}
            >
              Plan een gratis plaatsbezoek
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* Dakrenovatie vs Dakcoating vergelijking */}
      <section style={{ background: "#F7F8F6", padding: "120px 0 100px" }}>
        <div className="site-wrap">

          {/* Heading + intro */}
          <div style={{ textAlign: "center", maxWidth: "750px", margin: "0 auto 56px" }}>
            <p className="site-eyebrow mb-4">Dak vervangen of dak coaten?</p>
            <h2 style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "#1A1A1A",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              letterSpacing: "-0.028em", lineHeight: 1.12, marginBottom: "20px",
            }}>
              Geef je dak een tweede leven<br /><span style={{ color: "#9BCB6C" }}>zonder een volledige renovatie.</span>
            </h2>
            <p style={{ fontSize: "15px", color: "#545454", lineHeight: 1.7, fontFamily: "var(--font-inter), system-ui, sans-serif", margin: 0 }}>
              Een verouderde uitstraling betekent niet altijd dat je dak versleten is.<br />
              Een professionele dakcoating kan je dak opnieuw beschermen voor een fractie van de investering.
            </p>
          </div>

          {/* Vergelijking: 2 kaarten met absolute VS badge */}
          <div style={{ position: "relative", maxWidth: "960px", margin: "0 auto" }}>

            {/* VS badge — alleen desktop */}
            <div className="hidden lg:flex" style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)", zIndex: 10,
              width: "52px", height: "52px", borderRadius: "50%",
              background: "#FFFFFF", border: "2px solid #9BCB6C",
              boxShadow: "0 4px 16px rgba(155,203,108,0.25)",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#9BCB6C", fontWeight: 800, fontSize: "13px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", letterSpacing: "0.05em" }}>VS</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-[88px]" style={{ alignItems: "stretch" }}>

            {/* Links: Volledige dakrenovatie */}
            <div style={{
              background: "#FFF8F8",
              border: "1.5px solid rgba(239,68,68,0.2)",
              borderRadius: "16px",
              padding: "36px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid rgba(239,68,68,0.12)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <X size={18} color="#EF4444" strokeWidth={2.5} />
                </div>
                <p style={{ fontWeight: 800, fontSize: "16px", color: "#EF4444", fontFamily: "var(--font-montserrat), system-ui, sans-serif", lineHeight: 1.2 }}>
                  Volledige dakrenovatie
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Hoge investering die snel kan oplopen",
                  "Volledig dak uitbreken en vervangen",
                  "Weken wachten op planning en materialen",
                  "Meerdere dagen een werf rondom je woning",
                  "Lawaai, stof, containers en overlast",
                  "Stijgende materiaal- en arbeidskosten",
                  "Oude dakbedekking wordt volledig afgevoerd",
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                      <X size={11} color="#EF4444" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: "14px", color: "#545454", lineHeight: 1.5, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rechts: MOS-X dakcoating */}
            <div style={{
              background: "rgba(155,203,108,0.05)",
              border: "1.5px solid rgba(155,203,108,0.3)",
              borderRadius: "16px",
              padding: "36px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid rgba(155,203,108,0.18)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(155,203,108,0.12)", border: "1px solid rgba(155,203,108,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={18} color="#9BCB6C" strokeWidth={2.5} />
                </div>
                <p style={{ fontWeight: 800, fontSize: "16px", color: "#9BCB6C", fontFamily: "var(--font-montserrat), system-ui, sans-serif", lineHeight: 1.2 }}>
                  MOS-X dakcoating
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Je bestaande dak blijft behouden",
                  "Nieuwe beschermlaag op je dakpannen",
                  "Terug een frisse uitstraling naar keuze",
                  "Geen zware afbraakwerken nodig",
                  "Geen wekenlange renovatie rondom je woning",
                  "Minder verspilling van goede materialen",
                  "Betaalbare manier om je dak langer te behouden",
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(155,203,108,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                      <Check size={11} color="#9BCB6C" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: "14px", color: "#545454", lineHeight: 1.5, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(155,203,108,0.18)" }}>
                <Link
                  href="/contact"
                  onMouseEnter={e => { e.currentTarget.style.background = "#7AB54E"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#9BCB6C"; }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "#9BCB6C", color: "#FFFFFF", border: "none",
                    borderRadius: "8px", padding: "13px 24px",
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    fontWeight: 700, fontSize: "15px", textDecoration: "none",
                    whiteSpace: "nowrap", transition: "background-color 0.2s ease",
                  }}
                >
                  Plan een gratis plaatsbezoek
                  <ChevronRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </div>

            </div>{/* einde grid */}
          </div>{/* einde relative wrapper */}
        </div>
      </section>

      {/* Eigenschappen + Kleuren */}
      <section style={{ background: "#F7F8F6", padding: "80px 0 100px" }}>
        <div className="site-wrap">
          <div className="grid gap-12 lg:gap-16 items-stretch grid-cols-1 lg:grid-cols-[3fr_2fr]">

            {/* Links: eigenschappen */}
            <div>
              <p className="site-eyebrow mb-4">Eigenschappen van onze dakcoating</p>
              <h2 style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "#1A1A1A",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                letterSpacing: "-0.028em", lineHeight: 1.12, marginBottom: "10px",
              }}>
                Een nieuwe beschermlaag
              </h2>
              <p style={{ color: "#9BCB6C", fontWeight: 700, fontSize: "15px", marginBottom: "20px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
                voor jarenlang resultaat.
              </p>
              <p style={{ fontSize: "15px", color: "#545454", lineHeight: 1.7, marginBottom: "36px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Onze dakcoating is ontwikkeld om je dak opnieuw te beschermen tegen dagelijkse invloeden zoals regen, zon, vorst en vervuiling. Na het uitharden vormt de coating een duurzame beschermlaag over de dakbedekking.
              </p>

              {/* Voordelen + foto gestapeld op mobiel, naast elkaar op desktop */}
              <div className="flex flex-col lg:flex-row lg:items-center" style={{ gap: "28px" }}>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      "Hoge dampdoorlaatbaarheid",
                      "UV-bestendig",
                      "Bestand tegen regen, vorst en weersinvloeden",
                      "Helpt nieuwe mos- en algengroei te beperken",
                      "Vormt een vocht- en vuilafstotende beschermlaag",
                    ].map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(155,203,108,0.15)", border: "1px solid rgba(155,203,108,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                          <Check size={11} color="#9BCB6C" strokeWidth={3} />
                        </div>
                        <span style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: 600, lineHeight: 1.5, fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Foto — onderaan op mobiel, rechts op desktop */}
                <div className="mx-auto lg:mx-0 lg:flex-shrink-0" style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.10)", width: "260px" }}>
                  <img
                    src="/images/Dakcoating verfpot.png"
                    alt="Dakcoating verfpot"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </div>
            </div>

            {/* Rechts: kleurkeuze */}
            <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "32px 28px", border: "1px solid #E5E7EB", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
              <h3 style={{
                fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)", fontWeight: 800, color: "#1A1A1A",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: "12px",
              }}>
                Kies de uitstraling<br />van jouw dak.
              </h3>
              <p style={{ fontSize: "13px", color: "#545454", lineHeight: 1.65, marginBottom: "28px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Naast bescherming bepaalt de coating ook de nieuwe look van je woning. Kies de kleur die past bij jouw stijl.
              </p>

              {/* Kleur swatches: 4 kolommen */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "22px 10px", flex: 1, alignContent: "space-evenly" }}>
                {coatingColors.map((c, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "54px", height: "54px", borderRadius: "50%",
                      background: c.hex,
                      border: "2px solid rgba(0,0,0,0.10)",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.16)",
                    }} />
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#545454", textAlign: "center", fontFamily: "var(--font-montserrat), system-ui, sans-serif", lineHeight: 1.2 }}>
                      {c.name}
                    </p>
                  </div>
                ))}
                {/* Andere kleuren op aanvraag */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "54px", height: "54px", borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid rgba(0,0,0,0.10)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.16)",
                    flexShrink: 0,
                  }}>
                    <img
                      src="/images/Regenboogcirkel.png"
                      alt="Andere kleuren"
                      style={{
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transform: "scale(1.4)",
                        transformOrigin: "center",
                      }}
                    />
                  </div>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#9BCB6C", textAlign: "center", fontFamily: "var(--font-montserrat), system-ui, sans-serif", lineHeight: 1.2 }}>
                    Andere kleuren op aanvraag
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid #E5E7EB" }}>
                <Link
                  href="/#calculator"
                  onMouseEnter={e => { e.currentTarget.style.background = "#7AB54E"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#9BCB6C"; }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "#9BCB6C", color: "#FFFFFF",
                    borderRadius: "8px", padding: "11px 20px", width: "100%", justifyContent: "center",
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    fontWeight: 700, fontSize: "14px", textDecoration: "none",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  Bereken je richtprijs
                  <ChevronRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="site-pad" style={{ background: "#F7F8F6" }}>
        <div className="site-wrap">

          <h2
            className="font-bold mb-8"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", letterSpacing: "-0.02em", color: "#1A1A1A", textAlign: "center" }}
          >
            Alles wat je wilt weten over dakcoating.
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
                href="https://wa.me/32468352869?text=Hallo%20Yannick%2C%20ik%20heb%20een%20vraag%20over%20dakcoating."
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={e => { e.currentTarget.style.background = "#7AB54E"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#9BCB6C"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#9BCB6C", color: "#FFFFFF", borderRadius: "10px",
                  padding: "9px 18px", fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  transition: "background 200ms ease",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Stel je vraag aan Yannick
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: "#F7F8F6", paddingBottom: "80px" }}>
        <div className="site-wrap">
          <div className="page-cta-bar" style={{
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
            <div className="page-cta-text" style={{ flex: 1, minWidth: "340px" }}>
              <p className="lg:whitespace-nowrap" style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "6px", lineHeight: 1.25 }}>
                Benieuwd of dakcoating geschikt is voor <span style={{ color: "#9BCB6C" }}>jouw dak</span>?
              </p>
              <p className="lg:whitespace-nowrap" style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Yannick bekijkt je dak ter plaatse en adviseert welke behandeling écht nodig is.
              </p>
            </div>
            <div className="page-cta-buttons" style={{ display: "flex", gap: "10px", flexShrink: 0, flexWrap: "wrap" }}>
              <Link
                href="/contact"
                onMouseEnter={() => setWaHovered(true)}
                onMouseLeave={() => setWaHovered(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: waHovered ? "#7AB54E" : "#9BCB6C",
                  color: "#FFFFFF", border: "none",
                  borderRadius: "8px", padding: "12px 20px",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  whiteSpace: "nowrap", transition: "background-color 0.2s ease",
                }}
              >
                Plan een gratis plaatsbezoek
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
              <a
                href="tel:+32468352869"
                onMouseEnter={() => setPhoneHovered(true)}
                onMouseLeave={() => setPhoneHovered(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "transparent",
                  color: phoneHovered ? "#9BCB6C" : "#FFFFFF",
                  border: phoneHovered ? "1px solid #9BCB6C" : "1px solid rgba(155,203,108,0.5)",
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


      {/* Lightbox */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)}
          style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", cursor: "zoom-out" }}>
          <img src={lightboxImg} alt="Vergrote foto"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px" }}
            draggable={false}
            onClick={e => e.stopPropagation()}
          />
          <button onClick={() => setLightboxImg(null)}
            style={{ position: "fixed", top: "20px", right: "20px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#FFFFFF", fontSize: "20px", lineHeight: 1 }}>
            ✕
          </button>
        </div>
      )}
    </PageLayout>
  );
}
