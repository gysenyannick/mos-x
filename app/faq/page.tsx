"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Phone, Plus, Minus, ChevronRight } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";

const faqGroups = [
  {
    category: "Prijs",
    items: [
      { q: "Wat kost een dakreiniging?", a: "De prijs hangt af van verschillende factoren, zoals de grootte en bereikbaarheid van je dak, de mate van vervuiling en de gekozen behandeling. Daarom ontvang je bij MOS-X altijd een vrijblijvende richtprijs op maat. Binnen één minuut weet je al waar je ongeveer aan toe bent.", cta: { label: "Bereken mijn richtprijs", href: "https://v0-dak-calculator.vercel.app/" } },
      { q: "Hoe wordt de prijs van een dakreiniging berekend?", a: "Elk dak is anders. Daarom houden we rekening met verschillende factoren, zoals de oppervlakte, de bereikbaarheid, het type dak, de hellingsgraad, de mate van vervuiling en de gewenste behandeling. Zo betaal je alleen voor de werken die jouw dak écht nodig heeft." },
    ],
  },
  {
    category: "Dak & Reiniging",
    items: [
      { q: "Hoe weet ik of mijn dak gereinigd moet worden?", a: "Zie je mosvorming, groene aanslag of donkere vervuiling op je dak? Dan is het meestal tijd om in te grijpen. Hoe langer mos blijft liggen, hoe meer vocht het vasthoudt en hoe groter de kans op slijtage van je dak. Twijfel je? Dan bekijken we de staat van je dak graag tijdens een vrijblijvende inspectie." },
      { q: "Kan elk type dak gereinigd worden?", a: "Ja. We reinigen vrijwel alle soorten daken, waaronder betonnen dakpannen, keramische dakpannen en leien. Alleen asbestdaken mogen we wettelijk niet reinigen." },
      { q: "Hoe lang blijft mijn dak proper na een dakreiniging?", a: "Dat hangt af van de ligging van je woning, de hoeveelheid schaduw, omliggende bomen, de vochtigheid van de omgeving en het type dak. Tijdens de inspectie geven we je een realistische inschatting van het verwachte resultaat. Wil je je dak zo lang mogelijk in topconditie houden? Dan adviseren we je graag over de mogelijkheden voor extra bescherming of periodiek onderhoud." },
      { q: "Is dakreiniging schadelijk voor mijn dak of tuin?", a: "Nee. We passen onze werkwijze aan op het type dak en beschermen je tuin, gevel en omgeving waar nodig. Daarnaast werken we met professionele, milieubewuste producten en vermijden we agressieve producten zoals chloor wanneer dat niet nodig is. Zo reinigen we je dak veilig én met respect voor je woning." },
    ],
  },
  {
    category: "Coating & Aanpak",
    items: [
      { q: "Wanneer is een dakcoating de juiste keuze?", a: "Een dakcoating is vooral interessant wanneer dakpannen door de jaren heen poreus zijn geworden of hun beschermlaag verloren hebben. Dit komt vaak voor bij oudere betonnen dakpannen en bepaalde leien. Tijdens de inspectie beoordelen we de staat van je dak en adviseren we alleen een coating wanneer die écht een meerwaarde biedt." },
      { q: "Is een hoogwerker nodig voor mijn dak?", a: "Niet altijd. Wanneer we veilig met een ladder kunnen werken, doen we dat ook. In sommige situaties is een hoogwerker de veiligste en meest efficiënte oplossing, bijvoorbeeld bij hogere of moeilijk bereikbare woningen. Tijdens de inspectie bepalen we welke werkwijze het meest geschikt is voor jouw dak." },
      { q: "Ik heb zonnepanelen. Wat betekent dat voor de dakreiniging?", a: "Geen probleem. We stemmen onze werkwijze af op daken met zonnepanelen. Indien gewenst kunnen de zonnepanelen tijdens de werken professioneel worden gereinigd. Bij een dakcoating werken we zorgvuldig rondom de installatie, zodat zowel je dak als je zonnepanelen optimaal beschermd blijven." },
    ],
  },
  {
    category: "Praktisch",
    items: [
      { q: "Moet ik thuis zijn tijdens de werken?", a: "Nee, dat is meestal niet nodig. Zolang we toegang hebben tot het dak en gebruik kunnen maken van een wateraansluiting, kunnen de werken in de meeste gevallen zonder jouw aanwezigheid uitgevoerd worden. Uiteraard houden we je steeds op de hoogte." },
      { q: "Moet mijn dak eerst geïnspecteerd worden?", a: "We bekijken altijd eerst de staat van je dak voordat we een behandeling adviseren. Dat kan tijdens een plaatsbezoek of, wanneer mogelijk, op afstand. Zo krijg je eerlijk advies dat afgestemd is op jouw dak." },
    ],
  },
  {
    category: "Garantie",
    items: [
      { q: "Krijg ik garantie op de uitgevoerde werken?", a: "Ja. Op onze dakcoatings bieden we tot 10 jaar garantie, afhankelijk van de gekozen behandeling. Vooraf leggen we steeds duidelijk uit welke garantie van toepassing is, zodat je precies weet waar je op kunt rekenen." },
    ],
  },
];

const categories = faqGroups.map(g => g.category);

function AccordionItem({ faq, open, onToggle }: {
  faq: { category: string; q: string; a: string; cta?: { label: string; href: string } };
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: open ? "rgba(155,203,108,0.05)" : "#FFFFFF",
        border: open ? "1px solid rgba(155,203,108,0.4)" : "1px solid #E5E7EB",
        boxShadow: open ? "none" : "0 2px 16px rgba(0,0,0,0.05)",
        transition: "background 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <span
            className="font-bold text-sm leading-snug"
            style={{
              color: "#1A1A1A",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            }}
          >
            {faq.q}
          </span>
        </div>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: open ? "rgba(155,203,108,0.15)" : "rgba(0,0,0,0.05)",
            color: "#9BCB6C",
            transition: "background 200ms ease",
          }}
        >
          {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6">
          <div className="pl-[4.5rem]">
            <p className="text-sm leading-relaxed" style={{ color: "#545454" }}>
              {faq.a}
            </p>
            {faq.cta && (
              <a
                href={faq.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  marginTop: "14px", padding: "8px 16px",
                  background: "#9BCB6C", color: "#FFFFFF",
                  borderRadius: "8px", textDecoration: "none",
                  fontSize: "13px", fontWeight: 700,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  transition: "background 200ms ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
                onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
              >
                {faq.cta.label}
                <ChevronRight size={14} strokeWidth={2.5} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [homeHov, setHomeHov] = useState(false);
  const [waHov, setWaHov] = useState(false);
  const [phoneHov, setPhoneHov] = useState(false);
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

    const ro = new ResizeObserver(update);
    if (sidebarContainerRef.current) ro.observe(sidebarContainerRef.current);
    if (sidebarCardRef.current) ro.observe(sidebarCardRef.current);
    const accordionEl = sidebarContainerRef.current?.closest(".grid")?.querySelector(".space-y-8");
    if (accordionEl) ro.observe(accordionEl);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  return (
    <PageLayout>
      <style>{`
        /* Mobiel: ruimte tussen intro en eerste categorie halveren
           (was 40px hero-onderpadding + 40px sectie-bovenpadding) */
        @media (max-width: 767px) {
          .faq-hero { padding-bottom: 20px !important; }
          .faq-accordion-section { padding-top: 20px !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="faq-hero relative pt-28 pb-10 overflow-hidden" style={{ background: "#F7F8F6" }}>
        <div className="site-wrap relative z-10">
          <BackLink href="/" />
          <p style={{ fontSize: "13px", marginBottom: "20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            <Link
              href="/"
              onMouseEnter={() => setHomeHov(true)}
              onMouseLeave={() => setHomeHov(false)}
              style={{ color: homeHov ? "#9BCB6C" : "#1A1A1A", textDecoration: "none", transition: "color 180ms ease" }}
            >Home</Link>
            <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "#9BCB6C" }} />
            <span style={{ color: "#9BCB6C" }}>FAQ</span>
          </p>
          <h1
            className="font-black leading-tight mb-5 max-w-2xl"
            style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.03em",
              color: "#1A1A1A",
            }}
          >
            Veelgestelde
            <span style={{ color: "#9BCB6C" }}> vragen.</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "#545454" }}>
            Antwoorden op de vragen die we het vaakst krijgen. Staat je vraag er niet tussen? Yannick helpt je graag verder.
          </p>
        </div>
      </section>

      {/* ── FAQ accordion ── */}
      <section className="faq-accordion-section" style={{ background: "#F7F8F6", padding: "40px 0 80px" }}>
        <div className="site-wrap">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            {/* Accordion list — grouped by category */}
            <div className="space-y-8">
              {faqGroups.map((group) => (
                <div key={group.category}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                      style={{
                        background: "rgba(155,203,108,0.12)",
                        color: "#9BCB6C",
                        fontFamily: "var(--font-montserrat)",
                      }}
                    >
                      {group.category}
                    </span>
                    <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item, i) => (
                      <AccordionItem
                        key={`${group.category}-${i}`}
                        faq={{ category: group.category, ...item }}
                        open={open === `${group.category}-${i}`}
                        onToggle={() => setOpen(open === `${group.category}-${i}` ? null : `${group.category}-${i}`)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky sidebar */}
            <div ref={sidebarContainerRef} className="relative h-full">
              <div ref={sidebarCardRef}>
                {/* Contact card */}
                <div
                  className="rounded-2xl p-7 mb-5"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  }}
                >
                  <h3
                    className="font-black mb-2 leading-snug"
                    style={{
                      fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                      fontSize: "1.35rem",
                      letterSpacing: "-0.025em",
                      color: "#1A1A1A",
                    }}
                  >
                    Staat <span style={{ color: "#9BCB6C" }}>jouw vraag</span><br />er niet tussen?
                  </h3>
                  <p className="text-sm mb-5" style={{ color: "#545454", lineHeight: 1.6 }}>
                    Yannick helpt je graag verder met persoonlijk advies op maat.
                  </p>

                  {/* Yannick profile row */}
                  <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ background: "rgba(155,203,108,0.10)", border: "1px solid rgba(155,203,108,0.2)" }}>
                    <div style={{ width: "68px", height: "68px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                      <img
                        src="/images/IMG_4678.PNG"
                        alt="Yannick"
                        style={{
                          position: "absolute", top: "65%", left: "50%",
                          transform: "translate(-50%, -50%) scale(1.4)",
                          width: "68px", height: "68px",
                          objectFit: "cover", objectPosition: "center",
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm" style={{ fontFamily: "var(--font-montserrat)", color: "#1A1A1A" }}>Yannick</span>
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: "16px", height: "16px", borderRadius: "50%",
                          background: "#9BCB6C",
                        }}>
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "#545454" }}>Dakexpert bij MOS-X</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="https://wa.me/32468352869"
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setWaHov(true)}
                      onMouseLeave={() => setWaHov(false)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        background: waHov ? "#7AB54E" : "#9BCB6C", color: "#FFFFFF",
                        borderRadius: "8px", padding: "12px 20px",
                        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                        fontWeight: 700, fontSize: "14px", textDecoration: "none",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp Yannick
                    </a>
                    <a
                      href="tel:+32468352869"
                      onMouseEnter={() => setPhoneHov(true)}
                      onMouseLeave={() => setPhoneHov(false)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        background: "transparent",
                        color: phoneHov ? "#9BCB6C" : "#1A1A1A",
                        border: phoneHov ? "1px solid #9BCB6C" : "1px solid rgba(155,203,108,0.5)",
                        borderRadius: "8px", padding: "12px 20px",
                        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                        fontWeight: 700, fontSize: "14px", textDecoration: "none",
                        transition: "border-color 0.2s ease, color 0.2s ease",
                      }}
                    >
                      <Phone className="w-4 h-4" /> +32 468 35 28 69
                    </a>
                  </div>

                  {/* Hours */}
                  <p className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: "#9E9E9E" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Ma - Za: 08:00 - 17:00
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
