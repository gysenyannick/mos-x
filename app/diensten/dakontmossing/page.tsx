"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Phone, ArrowRight, ChevronDown, Search, Droplets, CloudRain, ShieldCheck, Home, ChevronRight, ChevronLeft, Leaf, Sparkles, Euro, AlertTriangle, HelpCircle } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";
import BeforeAfterSlider from "@/components/before-after-slider";

const steps = [
  { step: "STAP 01", Icon: Search,        title: "Dakcontrole & voorbereiding",      desc: "We starten met een grondige controle van je dak en vervangen meteen eventuele gebroken pannen of leien." },
  { step: "STAP 02", Icon: Droplets,      title: "Professionele dakreiniging",       desc: "Mos, algen en vervuiling verwijderen we met een hogedruk (stoom)unit, aangevuld met een vuilfrees die ook de moeilijkste hoekjes bereikt. Zo blijft de druk laag en je dakbedekking veilig." },
  { step: "STAP 03", Icon: ShieldCheck,   title: "Dakcontrole na reiniging",         desc: "Na het reinigen controleren we het volledige dak nog eens grondig, zodat eventuele verborgen aandachtspunten beter zichtbaar worden." },
  { step: "STAP 04", Icon: Home,          title: "Bescherming van je dak",           desc: "We behandelen je dak met een preventief, biologisch afbreekbaar anti-mosproduct, zodat mos minder snel terugkomt." },
  { step: "STAP 05", Icon: CloudRain,     title: "Omgeving netjes achtergelaten",    desc: "Een dakreiniging stopt voor ons niet boven op het dak. We maken muren, terras en dakgoten netjes op, zodat je kan genieten van een volledig verzorgd resultaat." },
];


const faqs: { q: string; a: string; cta?: boolean }[] = [
  { q: "Hoe lang blijft mijn dak proper?", a: "Dat hangt af van de ligging van je woning, de hoeveelheid bomen rondom en de weersomstandigheden. Met een preventieve behandeling of MOS-X Dakzorg blijft je dak doorgaans langer proper en goed onderhouden." },
  { q: "Wat kost een dakreiniging?", a: "Geen enkel dak is hetzelfde. De prijs hangt af van de oppervlakte, bereikbaarheid, vervuiling, het type dakbedekking en de gekozen afwerking.\n\nDaarom werken wij niet met standaardprijzen per m², maar bekijken we jouw dak persoonlijk zodat je een correcte richtprijs ontvangt.", cta: true },
  { q: "Hoe vaak moet je een dak laten reinigen?", a: "Dit hangt sterk af van de ligging en omgeving van je woning. Een dak met veel schaduw, bomen of vocht zal sneller opnieuw vervuilen dan een dak dat veel zon krijgt.\n\nGemiddeld volstaat een professionele reiniging ongeveer om de 7 à 10 jaar. In bosrijke of vochtige omgevingen kan onderhoud sneller nodig zijn.\n\nEen controle om de 2 à 3 jaar helpt om beginnende mosvorming of kleine problemen tijdig op te merken." },
  { q: "Is een dakcoating nodig na het reinigen?", a: "Een dakcoating is niet verplicht, maar kan afhankelijk van de staat van je dak sterk aanbevolen zijn.\n\nNa verloop van tijd verliezen sommige dakpannen hun oorspronkelijke beschermlaag. Een professionele coating brengt opnieuw een beschermende laag aan die helpt tegen:\n✓ vochtopname\n✓ weersinvloeden\n✓ vorstschade\n✓ nieuwe mosvorming\n\nZo blijft je dak langer beschermd en verzorgd." },
  { q: "Wat hoort er niet thuis bij een dakreiniging?", a: "Niet elke reinigingsmethode is geschikt voor elk dak. Een verkeerde aanpak kan meer schade veroorzaken dan oplossen.\n\nDaarom vermijden wij:\n✓ extreem hoge werkdruk\n✓ agressieve producten zoals bleekwater, javel of chloor\n✓ schadelijke chemische behandelingen\n\nGeen enkele dakpan heeft onnodig extreme druk nodig. De juiste combinatie van techniek, materiaal en ervaring bepaalt het resultaat." },
  { q: "Welke kleine herstellingen kunnen jullie uitvoeren?", a: "Tijdens de werken controleren we ook de algemene staat van je dak. Kleine herstellingen kunnen vaak meteen meegenomen worden.\n\nDenk aan:\n✓ vervangen van beschadigde dakpannen\n✓ herstellen of vernieuwen van nokpannen\n✓ uitcementeren van nokken\n✓ kleine metselwerken of voegwerken\n✓ plaatsen van vogelwering\n✓ kleine herstellingen aan dakgoten of afvoer\n✓ algemene daknazichten" },
  { q: "Wat gebeurt er met mos en vuil na de reiniging?", a: "Alle losgekomen mos, vuil en resten worden zorgvuldig verzameld tijdens de afwerking.\n\nWe kunnen het afval meenemen en correct verwerken. Wie dit liever zelf gebruikt, bijvoorbeeld als groenafval of compostmateriaal, kan dit uiteraard aangeven." },
  { q: "Reinigen jullie asbesthoudende daken?", a: "Nee. Asbesthoudende dakmaterialen mogen volgens de huidige regelgeving niet gereinigd of ontmost worden.\n\nBij vermoeden van asbest bekijken we dit vooraf. Veiligheid en correcte uitvoering gaan altijd voor." },
  { q: "Reinigen jullie ook daken in mijn regio?", a: "MOS-X is actief in verschillende regio's waaronder:\n✓ Antwerpen\n✓ Limburg\n✓ Vlaams-Brabant\n\nTwijfel je of we tot bij jou komen? Neem gerust contact op." },
];


function RealisatieLargeSlider() {
  const [split, setSplit] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"h" | "v" | null>(null);
  const move = (cx: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setSplit(Math.min(95, Math.max(5, ((cx - r.left) / r.width) * 100)));
  };
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; axis.current = null; dragging.current = true; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const dx = Math.abs(e.touches[0].clientX - startX.current);
      const dy = Math.abs(e.touches[0].clientY - startY.current);
      if (!axis.current) axis.current = dx > dy ? "h" : "v";
      if (axis.current === "h") { e.preventDefault(); move(e.touches[0].clientX); }
    };
    const onTouchEnd = () => { dragging.current = false; axis.current = null; };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => { el.removeEventListener("touchstart", onTouchStart); el.removeEventListener("touchmove", onTouchMove); el.removeEventListener("touchend", onTouchEnd); };
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height: "100%", minHeight: "460px", borderRadius: "16px", overflow: "hidden", cursor: "col-resize", userSelect: "none", boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}
      onMouseDown={() => (dragging.current = true)}
      onMouseMove={e => { if (dragging.current) move(e.clientX); }}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
    >
      <img src="/images/IMG_5414.JPEG" alt="Voor" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }} draggable={false} />
      <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 5, background: "rgba(0,0,0,0.65)", color: "#FFFFFF", padding: "6px 14px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>VOOR</div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${split}%)` }}>
        <img src="/images/IMG_5436.JPEG" alt="Na" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }} draggable={false} />
        <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 5, background: "#9BCB6C", color: "#1A1A1A", padding: "6px 14px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>NA</div>
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: "2px", left: `${split}%`, background: "rgba(255,255,255,0.75)", zIndex: 10, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "44px", height: "44px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #9BCB6C", boxShadow: "0 2px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
          <ChevronLeft style={{ width: "14px", height: "14px", color: "#9BCB6C" }} />
          <ChevronRight style={{ width: "14px", height: "14px", color: "#9BCB6C" }} />
        </div>
      </div>
    </div>
  );
}

function RealisatieSmallSlider({ beforeSrc, afterSrc, label }: { beforeSrc: string; afterSrc: string; label: string }) {
  const [split, setSplit] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"h" | "v" | null>(null);
  const move = (cx: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setSplit(Math.min(95, Math.max(5, ((cx - r.left) / r.width) * 100)));
  };
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; axis.current = null; dragging.current = true; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const dx = Math.abs(e.touches[0].clientX - startX.current);
      const dy = Math.abs(e.touches[0].clientY - startY.current);
      if (!axis.current) axis.current = dx > dy ? "h" : "v";
      if (axis.current === "h") { e.preventDefault(); move(e.touches[0].clientX); }
    };
    const onTouchEnd = () => { dragging.current = false; axis.current = null; };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => { el.removeEventListener("touchstart", onTouchStart); el.removeEventListener("touchmove", onTouchMove); el.removeEventListener("touchend", onTouchEnd); };
  }, []);
  return (
    <div style={{ flex: 1 }}>
      <div ref={ref} style={{ position: "relative", width: "100%", height: "100%", minHeight: "200px", borderRadius: "12px", overflow: "hidden", cursor: "col-resize", userSelect: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
        onMouseDown={() => (dragging.current = true)}
        onMouseMove={e => { if (dragging.current) move(e.clientX); }}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
      >
        <img src={beforeSrc} alt="Voor" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
        <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 5, background: "rgba(0,0,0,0.65)", color: "#FFFFFF", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>VOOR</div>
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${split}%)` }}>
          <img src={afterSrc} alt="Na" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
          <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 5, background: "#9BCB6C", color: "#1A1A1A", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>NA</div>
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "2px", left: `${split}%`, background: "rgba(255,255,255,0.75)", zIndex: 10, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "36px", height: "36px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #9BCB6C", boxShadow: "0 2px 8px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
            <ChevronLeft style={{ width: "12px", height: "12px", color: "#9BCB6C" }} />
            <ChevronRight style={{ width: "12px", height: "12px", color: "#9BCB6C" }} />
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)", padding: "20px 14px 10px", pointerEvents: "none", zIndex: 5 }}>
          <p style={{ margin: 0, fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "13px", color: "#FFFFFF", textAlign: "center" }}>{label}</p>
        </div>
      </div>
    </div>
  );
}

function VoorkomSlider() {
  const [split, setSplit] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"h" | "v" | null>(null);

  const move = (cx: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setSplit(Math.min(95, Math.max(5, ((cx - r.left) / r.width) * 100)));
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; axis.current = null; dragging.current = true; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const dx = Math.abs(e.touches[0].clientX - startX.current);
      const dy = Math.abs(e.touches[0].clientY - startY.current);
      if (!axis.current) axis.current = dx > dy ? "h" : "v";
      if (axis.current === "h") { e.preventDefault(); move(e.touches[0].clientX); }
    };
    const onTouchEnd = () => { dragging.current = false; axis.current = null; };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => { el.removeEventListener("touchstart", onTouchStart); el.removeEventListener("touchmove", onTouchMove); el.removeEventListener("touchend", onTouchEnd); };
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: "relative", width: "100%", height: "100%", minHeight: "400px", borderRadius: "20px", overflow: "hidden", cursor: "col-resize", userSelect: "none", boxShadow: "0 4px 32px rgba(0,0,0,0.12)" }}
      onMouseDown={() => (dragging.current = true)}
      onMouseMove={e => { if (dragging.current) move(e.clientX); }}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
    >
      <img src="/images/IMG_5414.JPEG" alt="Voor behandeling" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} draggable={false} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${split}%)` }}>
        <img src="/images/IMG_5436.JPEG" alt="Na behandeling" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${split}%`, width: "2px", background: "rgba(255,255,255,0.85)", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 10 }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "34px", height: "34px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #9BCB6C", boxShadow: "0 2px 12px rgba(0,0,0,0.20)", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
          <ChevronLeft style={{ width: "12px", height: "12px", color: "#9BCB6C" }} />
          <ChevronRight style={{ width: "12px", height: "12px", color: "#9BCB6C" }} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "14px", left: "14px", background: "rgba(0,0,0,0.65)", color: "#fff", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none", zIndex: 5 }}>VOOR</div>
      <div style={{ position: "absolute", bottom: "14px", right: "14px", background: "#9BCB6C", color: "#1A1A1A", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat), system-ui, sans-serif", pointerEvents: "none", zIndex: 5 }}>NA</div>
    </div>
  );
}

export default function DakontmossingPage() {
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

  return (
    <PageLayout>
      <style>{`
        @media (max-width: 768px) {
          .voordelen-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .daktypes-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .daktype-card {
            height: 140px !important;
          }
          .asbest-container {
            flex-direction: column !important;
          }
          .asbest-divider {
            width: auto !important;
            height: 1px !important;
            margin: 0 20px !important;
          }
          .asbest-col-right {
            width: 100% !important;
          }
          .asbest-left-col {
            flex-wrap: wrap !important;
            gap: 0 12px !important;
            align-items: center !important;
          }
          .asbest-left-col > div:not(.asbest-icon-wrap) {
            display: contents !important;
          }
          .asbest-icon-wrap {
            width: 36px !important;
            height: 36px !important;
          }
          .asbest-icon {
            width: 18px !important;
            height: 18px !important;
          }
          .asbest-title {
            flex: 1 !important;
            margin-bottom: 0 !important;
          }
          .asbest-desc {
            flex-basis: 100% !important;
            text-align: center !important;
            margin-top: 8px !important;
          }
          .voorkom-slider-wrap {
            height: 260px !important;
            overflow: hidden !important;
          }
          .voorkom-slider-wrap > div {
            min-height: unset !important;
            height: 260px !important;
          }
          .realisatie-large-wrap {
            height: 260px !important;
            overflow: hidden !important;
          }
          .realisatie-large-wrap > div {
            min-height: unset !important;
            height: 260px !important;
          }
          .werkwijze-photo {
            width: 100% !important;
            opacity: 0.40 !important;
          }
          .werkwijze-photo > img {
            object-position: 25% bottom !important;
          }
          .werkwijze-photo > div {
            display: none !important;
          }
          .werkwijze-photo::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(17,17,17,0.92) 0%, rgba(17,17,17,0.78) 40%, rgba(17,17,17,0.90) 100%);
            pointer-events: none;
          }
          .werkwijze-content {
            margin-left: 0 !important;
            padding: 40px 24px 48px !important;
            max-width: 100% !important;
            position: relative !important;
            z-index: 2 !important;
          }
        }
      `}</style>

      {/* Hero — dark two-col */}
      <section style={{ background: "#111111", position: "relative", overflow: "hidden", minHeight: "calc(100vh + 30px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>

        {/* Video desktop — absoluut, vult de volledige rechterhelft van de sectie */}
        <div className="hidden lg:block" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "44%", zIndex: 1 }}>
          <video
            src="/videos/dakreiniging-hero.mp4"
            autoPlay muted loop playsInline preload="auto"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Gradient van boven: subtiel, video is direct zichtbaar */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,17,17,0.55) 0%, rgba(17,17,17,0.2) 18%, transparent 38%)", pointerEvents: "none" }} />
          {/* Gradient van links: vervaagt naar tekst */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #111111 0%, rgba(17,17,17,0.9) 10%, rgba(17,17,17,0.3) 28%, transparent 52%)", pointerEvents: "none" }} />
        </div>

        {/* Video mobile — uitlopend boven en onder voor naadloze overgang */}
        <div className="block lg:hidden" style={{ position: "absolute", top: "-200px", right: 0, bottom: "-200px", left: 0, zIndex: 1 }}>
          <video
            src="/videos/dakreiniging-hero.mp4"
            autoPlay muted loop playsInline preload="auto"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "40% 70%", display: "block" }}
          />
          {/* Gradient overlay voor leesbaarheid */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,17,17,0.93) 0%, rgba(17,17,17,0.80) 50%, rgba(17,17,17,0.90) 100%)", pointerEvents: "none" }} />
        </div>

        <div className="site-wrap pt-[115px] lg:pt-[120px] pb-[100px] lg:pb-[60px] lg:-mt-[140px]" style={{ position: "relative", zIndex: 2, width: "100%" }}>

          <BackLink href="/diensten" dark />

          {/* Breadcrumb */}
          <p style={{ fontSize: "13px", marginBottom: "60px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            <Link
              href="/"
              onMouseEnter={() => setHomeHovered(true)}
              onMouseLeave={() => setHomeHovered(false)}
              style={{ color: homeHovered ? "#9BCB6C" : "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 180ms ease" }}
            >Home</Link>
            <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "#9BCB6C" }} />
            <Link
              href="/diensten"
              onMouseEnter={() => setDienstenHovered(true)}
              onMouseLeave={() => setDienstenHovered(false)}
              style={{ color: dienstenHovered ? "#9BCB6C" : "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 180ms ease" }}
            >Diensten</Link>
            <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "#9BCB6C" }} />
            <span style={{ color: "#9BCB6C" }}>Dakreiniging</span>
          </p>

          {/* Tekst — linkerhelft op desktop, vol op mobile */}
          <div className="lg:w-1/2">
            <p className="site-eyebrow mb-4">Professionele dakontmossing</p>
            <h1
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 3.2vw, 2.625rem)",
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
                lineHeight: 1.12,
                marginBottom: "20px",
              }}
            >
              Geef je dak opnieuw<br />
              <span style={{ color: "#9BCB6C" }}>jaren bescherming.</span>
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginBottom: "56px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              Mos en vuil houden vocht vast en laten je dak sneller verouderen.<br />
              Met een professionele reiniging verwijderen we vervuiling veilig en helpen we je dak langer in goede staat te houden.
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

      <section style={{ background: "#F7F8F6", padding: "120px 0 40px" }}>
        <div className="site-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — before/after slider */}
            <div className="voorkom-slider-wrap" style={{ height: "440px" }}>
              <BeforeAfterSlider beforeSrc="/images/IMG_5414.JPEG" afterSrc="/images/IMG_5436.JPEG" height="100%" minHeight="400px" borderRadius="20px" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.12)" }} />
            </div>

            {/* Right — text */}
            <div>
              <p className="site-eyebrow mb-4">Waarom je dak laten ontmossen?</p>
              <h2 style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontWeight: 800, fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                letterSpacing: "-0.028em", lineHeight: 1.15,
                color: "#1A1A1A", marginBottom: "38px",
              }}>
                Voorkom problemen.<br />
                <span style={{ color: "#9BCB6C" }}>Geniet opnieuw van een verzorgd dak.</span>
              </h2>

              <div className="voordelen-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "44px 28px", alignItems: "center" }}>
                {[
                  { Icon: Leaf,        title: "Geen loskomend mos rond je woning" },
                  { Icon: Droplets,    title: "Minder kans op verstopte dakgoten" },
                  { Icon: CloudRain,   title: "Minder kans op vochtproblemen" },
                  { Icon: ShieldCheck, title: "Helpt de levensduur van je dak verlengen" },
                  { Icon: Sparkles,    title: "Je woning krijgt opnieuw een frisse uitstraling" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "#FFFFFF", border: "1.5px solid #9BCB6C", boxShadow: "0 2px 8px rgba(155,203,108,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <item.Icon size={26} color="#9BCB6C" strokeWidth={2} />
                    </div>
                    <p style={{
                      fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                      fontWeight: 700, fontSize: "14px", color: "#1A1A1A", lineHeight: 1.3,
                    }}>{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* â"€â"€ Mid-page CTA â"€â"€ */}
      <section style={{ background: "#F7F8F6", paddingTop: "24px", paddingBottom: "80px" }}>
        <div className="site-wrap">
          <div className="page-cta-bar" style={{
            background: "#FFFFFF",
            border: "1px solid #9BCB6C",
            borderRadius: "16px",
            padding: "32px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
            flexWrap: "wrap",
            boxShadow: "0 2px 16px rgba(155,203,108,0.12)",
          }}>
            <div style={{ flex: 1, minWidth: "260px" }} className="text-center lg:text-left">
              <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: "6px", lineHeight: 1.25 }}>
                Voorkom dure schade aan je dak.
              </p>
              <p style={{ fontSize: "14px", color: "#545454", lineHeight: 1.6, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Mos verdwijnt niet vanzelf. Laat je dak tijdig reinigen en voorkom verstoppingen, slijtage, lekkages en onnodige kosten.
              </p>
            </div>
            <div className="page-cta-buttons" style={{ display: "flex", gap: "10px", flexShrink: 0, flexWrap: "wrap" }}>
              <Link
                href="/#calculator"
                onMouseEnter={e => { e.currentTarget.style.background = "#7AB54E"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#9BCB6C"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#9BCB6C", color: "#FFFFFF", border: "none",
                  borderRadius: "8px", padding: "12px 20px",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  whiteSpace: "nowrap", transition: "background-color 0.2s ease",
                }}
              >
                Bereken je richtprijs
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
              <a
                href="tel:+32468352869"
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#7AB54E"; e.currentTarget.style.color = "#7AB54E"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; e.currentTarget.style.color = "#545454"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "transparent", color: "#545454",
                  border: "1px solid rgba(155,203,108,0.5)",
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

      <section className="pt-16 lg:pt-[100px] pb-[180px]" style={{ background: "#F7F8F6" }}>
        <div className="site-wrap">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="site-eyebrow mb-4">Welke daken ontmossen wij?</p>
            <h2 style={{
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800, color: "#1A1A1A",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              letterSpacing: "-0.028em", lineHeight: 1.15, marginBottom: "16px",
            }}>
              Elk dak vraagt zijn eigen aanpak.
            </h2>
            <p style={{ fontSize: "16px", color: "#545454", lineHeight: 1.65, fontFamily: "var(--font-inter), system-ui, sans-serif", maxWidth: "540px", margin: "0 auto" }}>
              Elk dakmateriaal heeft zijn eigen eigenschappen. Daarom stemmen we onze reiniging af op het type dak en de staat van de dakbedekking.
            </p>
          </div>

          {/* 3×2 foto grid */}
          <div className="daktypes-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            {[
              { label: "Betonpannen",       img: "/images/Betonpannen.jpg" },
              { label: "Keramische pannen", img: "/images/Keramische pannen.jpg" },
              { label: "Tegelpannen",       img: "/images/Tegelpannen.jpg" },
              { label: "Kunstleien",        img: "/images/Kunstleien.png" },
              { label: "Natuurleien",       img: "/images/Leien dak.jpeg" },
              { label: "Metalen daken",     img: "/images/Metalen daken.jpg" },
            ].map((type, i) => (
              <div key={i} className="daktype-card" style={{ position: "relative", borderRadius: "12px", overflow: "hidden", height: "200px" }}>
                <img src={type.img} alt={type.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }} />
                <div style={{ position: "absolute", bottom: "14px", left: "14px" }}>
                  <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                    {type.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Info container */}
          <div className="asbest-container" style={{
            background: "#FFFFFF", border: "1.5px solid #9BCB6C", borderRadius: "16px",
            boxShadow: "0 2px 16px rgba(155,203,108,0.12)",
            display: "flex", overflow: "hidden",
          }}>
            {/* Links: Asbesthoudende daken */}
            <div className="asbest-left-col" style={{ flex: 1, minWidth: 0, padding: "14px 28px", display: "flex", gap: "14px", alignItems: "center" }}>
              <div className="asbest-icon-wrap" style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(155,203,108,0.15)", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertTriangle className="asbest-icon" size={28} color="#9BCB6C" strokeWidth={2.5} />
              </div>
              <div>
                <p className="asbest-title" style={{ fontWeight: 700, fontSize: "15px", color: "#1A1A1A", marginBottom: "6px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>Asbesthoudende daken</p>
                <p className="asbest-desc" style={{ fontSize: "13px", color: "#545454", lineHeight: 1.5, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                  Asbesthoudende dakmaterialen mogen volgens de huidige wetgeving niet ontmost of gereinigd worden.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="asbest-divider" style={{ width: "1px", background: "#9BCB6C", margin: "14px 0", flexShrink: 0 }} />

            {/* Rechts: Twijfel je over je dak? */}
            <div className="asbest-col-right" style={{ width: "330px", flexShrink: 0, padding: "14px 28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: "15px", color: "#1A1A1A", marginBottom: "14px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>Twijfel je over je dak?</p>
              <a
                href="https://wa.me/32468352869"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#9BCB6C", color: "#FFFFFF",
                  padding: "7px 24px", borderRadius: "8px",
                  fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  boxShadow: "0 2px 8px rgba(155,203,108,0.3)",
                  transition: "background-color 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#7AB54E"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#9BCB6C"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Stel je vraag aan Yannick
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* â"€â"€ Process — homepage style â"€â"€ */}
      {/* ── Werkwijze — foto flush links + stappen rechts ── */}
      <section style={{ background: "#111111", overflow: "hidden", position: "relative" }}>

        {/* Foto: absoluut gepositioneerd links — hoogte volgt content */}
        <div className="werkwijze-photo" style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "42%" }}>
          <img
            src="/images/IMG_5396.JPEG"
            alt="Yannick aan het werk"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center bottom", display: "block" }}
          />
          {/* Gradient overgang rechts naar donker */}
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "260px", background: "linear-gradient(to right, rgba(17,17,17,0) 0%, rgba(17,17,17,0.6) 50%, #111111 100%)", pointerEvents: "none" }} />
        </div>

        {/* Rechts: stappen — bepaalt de hoogte van de sectie */}
        <div className="werkwijze-content" style={{ marginLeft: "42%", padding: "52px 56px 64px 28px", display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "780px" }}>
            <p className="site-eyebrow mb-4" style={{ color: "#9BCB6C" }}>Onze werkwijze</p>
            <h2 style={{
              fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", fontWeight: 800, color: "#FFFFFF",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              letterSpacing: "-0.028em", lineHeight: 1.15, marginBottom: "32px",
            }}>
              Zo ontmossen we <span style={{ color: "#9BCB6C" }}>jouw dak.</span>
            </h2>

            <div>
              {steps.map((s, i) => {
                const isLast = i === steps.length - 1;
                return (
                  <div key={i} style={{ display: "flex", gap: "18px", minHeight: "120px" }}>

                    {/* Badge kolom — strekt zich uit over volledige rijhoogte */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "52px", flexShrink: 0, alignSelf: "stretch" }}>
                      {/* Lijn/ruimte boven badge */}
                      <div style={{ flex: 1, width: "1.5px", background: i > 0 ? "rgba(155,203,108,0.35)" : "transparent", marginBottom: "4px" }} />
                      {/* Badge */}
                      <div style={{
                        width: "52px", height: "52px", borderRadius: "10px", flexShrink: 0,
                        background: "rgba(155,203,108,0.07)", border: "1.5px solid #9BCB6C",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ color: "#9BCB6C", fontWeight: 800, fontSize: "17px", fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      {/* Lijn/ruimte onder badge */}
                      <div style={{ flex: 1, width: "1.5px", background: isLast ? "transparent" : "rgba(155,203,108,0.35)", marginTop: "4px" }} />
                    </div>

                    {/* Tekst — verticaal gecentreerd met badge */}
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

            {/* CTA — onderaan in de donkere sectie */}
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

      <section style={{ background: "#F7F8F6", padding: "160px 0 72px" }}>
        <div className="site-wrap">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", letterSpacing: "-0.028em", color: "#1A1A1A", margin: 0 }}>
              Onze <span style={{ color: "#9BCB6C" }}>resultaten.</span>
            </h2>
          </div>
          <div className="realisaties-preview-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "24px", alignItems: "stretch" }}>
            <div className="realisatie-large-wrap"><BeforeAfterSlider beforeSrc="/images/IMG_5414.JPEG" afterSrc="/images/IMG_5436.JPEG" height="100%" minHeight="460px" borderRadius="16px" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ flex: 1 }}><BeforeAfterSlider beforeSrc="/images/Velux%20voor%201.0.png" afterSrc="/images/Velux%20na%201.0.png" title="Velux" height="100%" minHeight="200px" borderRadius="12px" /></div>
              <div style={{ flex: 1 }}><BeforeAfterSlider beforeSrc="/images/Goot%20voor.JPEG" afterSrc="/images/Goot%20na.JPEG" title="Dakgoot" height="100%" minHeight="200px" borderRadius="12px" /></div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link
              href="/contact"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#9BCB6C", color: "#FFFFFF", borderRadius: "8px", padding: "14px 32px", fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-montserrat), system-ui, sans-serif", textDecoration: "none", transition: "background 200ms ease" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
              onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
            >
              Ja, ik wil dit resultaat
              <ChevronRight size={15} strokeWidth={2.5} style={{ marginLeft: "2px" }} />
            </Link>
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
            Alles wat je wilt weten over dakreiniging.
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
                    {f.a.split("\n").map((line, li) => {
                      if (line.startsWith("✓")) {
                        return (
                          <div key={li} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#9BCB6C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <span style={{ fontSize: "14px", color: "#1A1A1A", fontFamily: "var(--font-inter), system-ui, sans-serif", lineHeight: 1.5 }}>{line.replace("✓", "").trim()}</span>
                          </div>
                        );
                      }
                      if (line.trim() === "") return <div key={li} style={{ height: "8px" }} />;
                      return <p key={li} style={{ fontSize: "14px", lineHeight: 1.65, color: "#545454", fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "8px" }}>{line}</p>;
                    })}
                    {f.cta && (
                      <Link
                        href="/#calculator"
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#7AB54E"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#9BCB6C"; }}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "12px", background: "#9BCB6C", color: "#FFFFFF", borderRadius: "8px", padding: "9px 18px", fontWeight: 700, fontSize: "13px", textDecoration: "none", fontFamily: "var(--font-montserrat), system-ui, sans-serif", transition: "background 180ms ease" }}
                      >
                        Bereken vrijblijvend je richtprijs
                        <ChevronRight size={14} strokeWidth={2.5} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* WhatsApp cel */}
            <div style={{
              background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px",
              padding: "10px 24px", alignSelf: "start",
              display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontWeight: 700, fontSize: "14px", color: "#1A1A1A",
              }}>
                Staat je vraag er niet bij?
              </p>
              <a
                href="https://wa.me/32468352869?text=Hallo%20Yannick%2C%20ik%20heb%20een%20vraag%20over%20dakreiniging."
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

      {/* â"€â"€ CTA â"€â"€ */}
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
            <div className="page-cta-text" style={{ flex: 1, minWidth: "320px" }}>
              <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "6px", lineHeight: 1.25 }}>
                Benieuwd wat <span style={{ color: "#9BCB6C" }}>jouw dak</span> nodig heeft?
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

    </PageLayout>
  );
}

