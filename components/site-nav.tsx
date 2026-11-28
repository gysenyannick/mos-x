"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, ChevronRight, ChevronDown, Droplets, Paintbrush, CalendarCheck, Images, Users, Mail, MessageCircle, Building2, Umbrella } from "lucide-react";
import { BtnPress } from "@/components/btn-press";

type MegaItem = { naam: string; dienst?: string; tekst: string; href: string; img: string; gsm?: [string, string] };

const diensten: MegaItem[] = [
  { naam: "Dakreiniging", tekst: "Mos, algen en vuil weg. Je dak ziet er weer verzorgd uit.", href: "/diensten/dakontmossing", img: "/images/menu-dakreiniging.webp" },
  { naam: "MOS-MAX", dienst: "Dakcoating", tekst: "Een nieuwe beschermlaag. Je dak gaat tot 15 jaar langer mee.", href: "/diensten/dakcoating", img: "/images/menu-mosmax.webp" },
  { naam: "MOS-PLUS", dienst: "Hydrofuge", tekst: "Een waterafstotende laag. Regen parelt af, mos krijgt minder kans.", href: "/contact", img: "/images/menu-mospro.webp" },
  { naam: "MOS-CARE", dienst: "Onderhoudsplan", tekst: "We volgen je dak op en houden het jaar na jaar verzorgd.", href: "/diensten/onderhoudsplan", img: "/images/menu-moscare.webp" },
];


const links = [
  { label: "Realisaties", href: "/realisaties" },
  { label: "Over ons",    href: "/over-ons" },
  { label: "Contact",     href: "/contact" },
];

const mobieleDiensten = [
  { label: "Dakreiniging", sub: "Mos, algen en vuil weg", href: "/diensten/dakontmossing", Icoon: Droplets },
  { label: "MOS-MAX", sub: "Dakcoating", href: "/diensten/dakcoating", Icoon: Paintbrush },
  { label: "MOS-PLUS", sub: "Hydrofuge", href: "/contact", Icoon: Umbrella },
  { label: "MOS-CARE", sub: "Onderhoudsplan", href: "/diensten/onderhoudsplan", Icoon: CalendarCheck },
];

const mobieleLinks = [
  { label: "Realisaties", href: "/realisaties", Icoon: Images },
  { label: "Over ons",    href: "/over-ons",    Icoon: Users },
  { label: "Contact",     href: "/contact",     Icoon: Mail },
];

const linkStijl: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "14px",
  fontWeight: 600,
  color: "#1A1A1A",
  textDecoration: "none",
  transition: "color 150ms ease",
  whiteSpace: "nowrap",
};

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dienstenOpen, setDienstenOpen] = useState(false);
  // Klein uitstel bij het sluiten, zodat het menu niet wegspringt als je met de muis naar beneden gaat.
  const sluitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMenu = () => {
    if (sluitTimer.current) clearTimeout(sluitTimer.current);
    setDienstenOpen(true);
  };
  const sluitMenu = () => {
    if (sluitTimer.current) clearTimeout(sluitTimer.current);
    sluitTimer.current = setTimeout(() => setDienstenOpen(false), 220);
  };
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isDakzorg = pathname === "/diensten/onderhoudsplan";

  // Gsm-menu: de pagina eronder scrolt niet mee, Escape sluit het menu
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const toets = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", toets);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", toets); };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    background: "#FFFFFF",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
  };

  return (
    <>
      <style>{`
        main :is(h1, h2, h3, h4, button, li, dt, dd, label, small, b, blockquote) { text-wrap: balance; }
        main p { text-wrap: balance; }
        @keyframes mx-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(155,203,108,0.6), 0 0 16px 0 rgba(155,203,108,0.35), 0 10px 24px -12px rgba(122,181,78,0.9); }
          50% { box-shadow: 0 0 0 10px rgba(155,203,108,0), 0 0 30px 6px rgba(155,203,108,0.6), 0 12px 30px -10px rgba(122,181,78,1); }
        }
        .mx-glow { animation: mx-glow 2.6s ease-in-out infinite; position: relative; overflow: hidden; isolation: isolate; }
        /* Een lichtstreep die af en toe over de knop glijdt */
        .mx-glow::after { content: ""; position: absolute; top: -20%; bottom: -20%; left: -60%; width: 40%; pointer-events: none; z-index: 1; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.38), transparent); transform: skewX(-18deg); animation: mx-glans 5.5s ease-in-out infinite; }
        @keyframes mx-glans { 0%, 62% { left: -60%; } 82%, 100% { left: 130%; } }
        /* Pijltje schuift mee bij hover */
        :is(.do-knop, .btn-press, .mx-glow, .kzp-knop, .rz-knop) svg:last-child { transition: transform .2s ease; }
        :is(.do-knop, .btn-press, .mx-glow, .kzp-knop, .rz-knop):hover svg:last-child { transform: translateX(3px); }
        /* Selectie en scrollbalk in de huisstijl */
        ::selection { background: rgba(155,203,108,0.35); color: #1A1A1A; }
        @media (hover: hover) and (pointer: fine) {
          html { scrollbar-color: #9BCB6C #F2F4F0; scrollbar-width: thin; }
        }
        .mx-glow:hover, .mx-glow:focus-visible { animation-play-state: paused; }
        .mx-tel { margin-left: auto; margin-right: 6px; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 12px;
          border-radius: 8px; border: 1px solid rgba(155,203,108,0.5); color: #1A1A1A; text-decoration: none; white-space: nowrap;
          font: 700 13px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.01em;
          transition: border-color 150ms ease, background-color 150ms ease, transform 120ms ease; }
        .mx-tel svg { color: #9BCB6C; flex-shrink: 0; }
        .mx-tel:hover { border-color: #9BCB6C; background: rgba(155,203,108,0.08); }
        .mx-tel:active { transform: scale(0.97); }
        .mx-tel:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
        @media (min-width: 1024px) { .mx-tel { display: none; } }
        @media (max-width: 359px) { .mx-tel { padding: 0 9px; font-size: 12px; } .mx-tel svg { display: none; } }
        @media (prefers-reduced-motion: reduce) { .mx-glow::after { display: none; } :is(.do-knop, .btn-press, .mx-glow, .kzp-knop, .rz-knop):hover svg:last-child { transform: none; } .mx-glow { animation: none; box-shadow: 0 0 0 4px rgba(155,203,108,0.28), 0 12px 28px -10px rgba(122,181,78,0.95) !important; } }
        .nav-diensten { position: relative; }
        .nav-diensten-knop { display: inline-flex; align-items: center; gap: 4px; background: none; border: 0; padding: 0; cursor: pointer; }
        .nav-diensten-knop:hover { color: #9BCB6C !important; }
        .nav-diensten-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 4px; border-radius: 4px; }
        .nav-diensten-menu { position: absolute; top: 100%; left: -18px; padding-top: 18px; width: 210px; }
        .nav-diensten-menu::before { content: ""; position: absolute; inset: 18px 0 0; border-radius: 14px; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 24px 48px -24px rgba(30,51,36,0.3); }
        .nav-dienst { position: relative; display: block; margin: 0 8px; padding: 11px 14px; border-radius: 10px; text-decoration: none; font-size: 14.5px; font-weight: 600; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; transition: background-color 150ms ease, color 150ms ease; }
        .nav-dienst:first-child { margin-top: 8px; }
        .nav-dienst:last-child { margin-bottom: 8px; }
        .nav-dienst:hover { background: #F2F8EC; color: #9BCB6C; }
        .nav-dienst small { display: block; margin-top: 2px; font: 500 12.5px/1.4 var(--font-inter), system-ui, sans-serif; color: #545454; }
        .nav-dienst:active { background: #EEF6E6; }
        .nav-dienst:focus-visible { outline: 2px solid #1A1A1A; outline-offset: -2px; }
        .nav-kop { top: 16px; }
        /* Megamenu (diensten) */
        .nav-mega-wrap { position: static; }
        .nav-mega { position: absolute; top: 100%; left: 0; right: 0; padding-top: 10px; animation: nav-mega-in .22s ease; }
        .nav-mega::before { content: ""; position: absolute; left: 0; right: 0; top: -22px; height: 32px; }
        @keyframes nav-mega-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        .nav-mega-in { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 24px; padding: 22px; border-radius: 18px; background: #FFFFFF; border: 1px solid #E5E7EB;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 30px 60px -30px rgba(30,51,36,0.35); }
        .nav-mega-kaarten { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
        .nav-mega-kaarten.twee { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .nav-mega-kaarten.twee .nav-mk-foto { aspect-ratio: 16 / 9; }
        .nav-mk { display: block; padding: 8px; margin: -8px; border-radius: 14px; text-decoration: none; color: #1A1A1A; transition: background-color .2s ease; }
        .nav-mk:hover { background: #F7F8F6; }
        .nav-mk:active { background: #F2F8EC; }
        .nav-mk:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 0; }
        .nav-mk-foto { display: block; overflow: hidden; border-radius: 10px; aspect-ratio: 4 / 3; background: #F7F8F6; }
        .nav-mk-foto img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
        .nav-mk:hover .nav-mk-foto img { transform: scale(1.04); }
        .nav-mk-naam { display: flex; align-items: baseline; gap: 8px; margin: 12px 2px 2px; white-space: nowrap; font: 700 15px var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.01em; transition: color .15s ease; }
        .nav-mk-naam small { font: 400 13px var(--font-inter), system-ui, sans-serif; letter-spacing: 0; color: #8E8E89; }
        .nav-mk:hover .nav-mk-naam { color: #7AB54E; }
        .nav-uit { position: relative; isolation: isolate; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; min-height: 100%; padding: 22px; border-radius: 14px; text-decoration: none; color: #FFFFFF; background: #0B0F0C; }
        .nav-uit img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; opacity: .55; transition: transform .5s ease, opacity .3s ease; }
        .nav-uit::before { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(11,15,12,0.1) 0%, rgba(11,15,12,0.85) 70%); }
        .nav-uit:hover img { transform: scale(1.04); opacity: .65; }
        .nav-uit:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
        .nav-uit b { font: 800 19px/1.2 var(--font-montserrat), system-ui, sans-serif; letter-spacing: -0.02em; }
        .nav-uit span { margin-top: 6px; font: 400 13.5px/1.5 var(--font-inter), system-ui, sans-serif; color: rgba(255,255,255,0.75); }
        .nav-uit em { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin-top: 14px; height: 38px; padding: 0 16px; border-radius: 9px; font: 700 13.5px var(--font-montserrat), system-ui, sans-serif; font-style: normal; background: #9BCB6C; color: #FFFFFF; transition: background-color .2s ease, box-shadow .2s ease; }
        .nav-uit:hover em { background: #7AB54E; box-shadow: 0 8px 18px -8px rgba(122,181,78,0.8); }
        @media (max-width: 1180px) { .nav-mega-in { grid-template-columns: minmax(0, 1fr) 220px; } .nav-mk-naam small { display: none; } }
      `}</style>
      {/* ── Floating glassmorphism navbar ── */}
      <header
        className={scrolled ? "nav-kop gescrold" : "nav-kop"}
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "calc(100% - 40px)",
          maxWidth: "1300px",
          transition: "all 0.3s ease",
        }}
      >
        <nav
          ref={navRef}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "56px",
            padding: "10px 32px",
            borderRadius: "12px",
            transition: "all 0.3s ease",
            ...navStyle,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0, marginRight: "24px" }}>
            <Image
              src="/images/logo.avif" alt="MOS-X"
              width={260} height={125}
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>

          {/* Desktop center links */}
          <div className="hidden lg:flex items-center gap-7" style={{ paddingLeft: "48px" }}>
            <div className="nav-diensten nav-mega-wrap" onMouseEnter={openMenu} onMouseLeave={sluitMenu}>
              <button
                type="button"
                className="nav-diensten-knop"
                aria-expanded={dienstenOpen}
                aria-haspopup="true"
                onClick={() => setDienstenOpen(o => !o)}
                style={{ ...linkStijl, color: dienstenOpen ? "#9BCB6C" : "#1A1A1A" }}
              >
                Diensten
                <ChevronDown size={15} strokeWidth={2.5} style={{ transition: "transform 200ms ease", transform: dienstenOpen ? "rotate(180deg)" : "none" }} />
              </button>
              {dienstenOpen && (
                <MegaMenu items={diensten} sluit={() => setDienstenOpen(false)} uit={{ titel: "Voor bedrijven", tekst: "Dakreiniging en coolroofing voor bedrijfsdaken.", knop: "Ontdek meer", href: "/zakelijk", img: "/images/menu-b2b-reiniging.webp" }} />
              )}
            </div>
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={linkStijl}
                onMouseEnter={e => (e.currentTarget.style.color = "#9BCB6C")}
                onMouseLeave={e => (e.currentTarget.style.color = "#1A1A1A")}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop socials — gecentreerd via margin: auto */}
          <div className="hidden xl:flex items-center gap-2" style={{ margin: "0 auto" }}>
            {[
              { href: "https://www.facebook.com/profile.php?id=61551512872835", label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              { href: "https://www.instagram.com/mosx.be/", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", color: "#9BCB6C", border: "1px solid rgba(155,203,108,0.35)", transition: "background 150ms ease, border-color 150ms ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,203,108,0.1)"; e.currentTarget.style.borderColor = "#9BCB6C"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(155,203,108,0.35)"; }}
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
              </a>
            ))}
          </div>


          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-4">
            <BtnPress
              href="tel:+32468352869"
              aria-label="Bel +32 468 35 28 69"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-montserrat)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#1A1A1A",
                textDecoration: "none",
                border: "1px solid rgba(155,203,108,0.5)",
                borderRadius: "8px",
                padding: "7px 14px",
                transition: "border-color 150ms ease, color 150ms ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#9BCB6C";
                e.currentTarget.style.borderColor = "#9BCB6C";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "#1A1A1A";
                e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)";
              }}
            >
              <Phone style={{ width: "14px", height: "14px", color: "currentColor", flexShrink: 0 }} />
              <span className="hidden xl:inline">+32 468 35 28 69</span>
            </BtnPress>
            {isDakzorg ? (
              <BtnPress
                href="#dakzorg-prijs"
                style={{
                  background: "#9BCB6C",
                  color: "#FFFFFF",
                  borderRadius: "6px",
                  padding: "8px 20px",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "var(--font-montserrat)",
                  textDecoration: "none",
                  transition: "background 200ms ease",
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
                onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
              >
                Onderhoudsplan aanvragen
                <ChevronRight size={13} strokeWidth={2.5} />
              </BtnPress>
            ) : (
              <BtnPress
                className="mx-glow"
                href="/#calculator"
                style={{
                  background: "#9BCB6C",
                  color: "#FFFFFF",
                  borderRadius: "6px",
                  padding: "8px 20px",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "var(--font-montserrat)",
                  textDecoration: "none",
                  transition: "background 200ms ease",
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
                onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
              >
                Bereken mijn richtprijs
                <ChevronRight size={13} strokeWidth={2.5} />
              </BtnPress>
            )}
          </div>

          {/* Gsm: nummer altijd zichtbaar in de balk */}
          <a href="tel:+32468352869" className="mx-tel lg:hidden" aria-label="Bel +32 468 35 28 69">
            <Phone size={14} strokeWidth={2.4} aria-hidden="true" />
            <span>+32 468 35 28 69</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 rounded-lg"
            style={{ color: "#1A1A1A" }}
            aria-label="Menu openen"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </header>

      {/* ── Gsm-menu ── */}
      <div className={`mm${mobileOpen ? " open" : ""}`} aria-hidden={!mobileOpen}>
        <style>{`
          .mm { position: fixed; inset: 0; z-index: 1100; pointer-events: none; }
          .mm.open { pointer-events: auto; }
          .mm-scherm { position: absolute; inset: 0; background: rgba(6,10,7,0.55); backdrop-filter: blur(3px); opacity: 0; transition: opacity .3s ease; }
          .mm.open .mm-scherm { opacity: 1; }
          .mm-paneel { position: absolute; top: 0; right: 0; bottom: 0; width: min(100%, 420px); display: flex; flex-direction: column; overflow-y: auto; overscroll-behavior: contain; background: radial-gradient(420px 260px at 100% 0%, rgba(155,203,108,0.12), transparent 70%), #FFFFFF; box-shadow: -30px 0 60px -30px rgba(11,15,12,0.45); transform: translateX(100%); transition: transform .38s cubic-bezier(.2,.8,.2,1); font-family: var(--font-montserrat), system-ui, sans-serif; }
          .mm.open .mm-paneel { transform: none; }
          .mm-kop { display: flex; align-items: center; justify-content: space-between; padding: 22px 20px 14px; }
          .mm-sluit { width: 44px; height: 44px; border-radius: 50%; border: 0; display: grid; place-items: center; background: #F2F4F0; color: #1A1A1A; cursor: pointer; transition: background-color .2s ease, transform .2s ease; }
          .mm-sluit:hover { background: #E3E8DE; }
          .mm-sluit:active { transform: scale(.94); }
          .mm-sluit:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }
          .mm-inhoud { padding: 6px 20px 20px; flex: 1; }
          .mm-oog { margin: 14px 4px 10px; font-size: 11.5px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #9BCB6C; }
          .mm-diensten { display: grid; gap: 8px; }
          .mm-dienst { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 14px; background: #F7F8F6; border: 1px solid #E5E7EB; text-decoration: none; color: #1A1A1A; transition: border-color .2s ease, background-color .2s ease, transform .15s ease; }
          .mm-dienst:hover { border-color: #CFE5B8; background: #F2F8EC; }
          .mm-dienst:active { transform: scale(.985); }
          .mm-dienst:focus-visible, .mm-link:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
          .mm-dienst.actief { border-color: #9BCB6C; background: #F2F8EC; }
          .mm-dienst i { width: 42px; height: 42px; flex: none; display: grid; place-items: center; border-radius: 12px; background: #FFFFFF; border: 1px solid #E5E7EB; color: #9BCB6C; }
          .mm-dienst b { display: block; font-size: 15.5px; font-weight: 700; }
          .mm-dienst small { display: block; margin-top: 2px; font-size: 12.5px; font-weight: 500; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }
          .mm-dienst > svg { margin-left: auto; color: #B0B6AC; }
          .mm-links { margin-top: 6px; }
          .mm-link { display: flex; align-items: center; gap: 14px; padding: 15px 6px; border-bottom: 1px solid #EEF0EC; text-decoration: none; font-size: 18px; font-weight: 700; color: #1A1A1A; transition: color .2s ease; }
          .mm-link:hover { color: #7AB54E; }
          .mm-link > svg:first-child { color: #9BCB6C; }
          .mm-link > svg:last-child { margin-left: auto; color: #C7CCC2; }
          .mm-link.actief { color: #7AB54E; }
          .mm-voet { position: sticky; bottom: 0; padding: 16px 20px 22px; box-shadow: 0 -18px 30px -24px rgba(11,15,12,0.25); border-top: 1px solid #EEF0EC; background: #FFFFFF; display: grid; gap: 10px; }
          .mm-knop { display: flex; align-items: center; justify-content: center; gap: 8px; height: 52px; border-radius: 12px; font-size: 15.5px; font-weight: 700; text-decoration: none; transition: background-color .2s ease, border-color .2s ease, transform .15s ease; }
          .mm-knop:active { transform: translateY(1px); }
          .mm-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }
          .mm-knop-g { background: #9BCB6C; color: #FFFFFF; }
          .mm-knop-g:hover { background: #7AB54E; }
          .mm-rij { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .mm-knop-l { background: #F7F8F6; color: #1A1A1A; border: 1px solid #E5E7EB; font-size: 14.5px; }
          .mm-knop-l:hover { border-color: #9BCB6C; background: #F2F8EC; }
          .mm-knop-l svg { color: #9BCB6C; }
          .mm-socials { display: flex; justify-content: center; gap: 10px; margin-top: 6px; }
          .mm-socials a { width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; color: #9BCB6C; border: 1px solid rgba(155,203,108,0.35); transition: background-color .2s ease, border-color .2s ease; }
          .mm-socials a:hover { background: rgba(155,203,108,0.1); border-color: #9BCB6C; }
          .mm-socials a:focus-visible { outline: 2px solid #9BCB6C; outline-offset: 2px; }
          .mm.open .mm-in { animation: mm-in .45s cubic-bezier(.2,.8,.2,1) both; }
          @keyframes mm-in { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: none; } }
          @media (max-height: 760px) { .mm-kop { padding-top: 16px; padding-bottom: 6px; } .mm-oog { margin-top: 8px; } .mm-dienst { padding: 10px 12px; } .mm-link { padding: 12px 6px; font-size: 17px; } .mm-socials { display: none; } }
          @media (prefers-reduced-motion: reduce) { .mm-paneel, .mm-scherm { transition: none; } .mm.open .mm-in { animation: none; } }
        `}</style>
        <div className="mm-scherm" onClick={() => setMobileOpen(false)} />
        <div className="mm-paneel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mm-kop">
            <Link href="/" onClick={() => setMobileOpen(false)} aria-label="Naar de homepage">
              <Image src="/images/logo.avif" alt="MOS-X" width={260} height={125} style={{ height: "44px", width: "auto", objectFit: "contain" }} />
            </Link>
            <button type="button" className="mm-sluit" onClick={() => setMobileOpen(false)} aria-label="Menu sluiten"><X size={20} /></button>
          </div>

          <div className="mm-inhoud">
            <p className="mm-oog mm-in" style={{ animationDelay: "40ms" }}>Onze diensten</p>
            <div className="mm-diensten">
              {mobieleDiensten.map((d, i) => (
                <Link key={d.href} href={d.href} onClick={() => setMobileOpen(false)} className={`mm-dienst mm-in${pathname === d.href ? " actief" : ""}`} style={{ animationDelay: `${70 + i * 45}ms` }}>
                  <i><d.Icoon size={20} /></i>
                  <span><b>{d.label}</b>{d.sub && <small>{d.sub}</small>}</span>
                  <ChevronRight size={18} />
                </Link>
              ))}
            </div>

            <div className="mm-diensten" style={{ marginTop: 8 }}>
              <Link href="/zakelijk" onClick={() => setMobileOpen(false)} className="mm-dienst mm-in" style={{ animationDelay: "250ms" }}>
                <i><Building2 size={20} /></i>
                <span><b>Voor bedrijven</b><small>Dakreiniging en coolroofing</small></span>
                <ChevronRight size={18} />
              </Link>
            </div>

            <nav className="mm-links" aria-label="Menu">
              {mobieleLinks.map((l, i) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className={`mm-link mm-in${pathname === l.href ? " actief" : ""}`} style={{ animationDelay: `${210 + i * 40}ms` }}>
                  <l.Icoon size={20} />
                  {l.label}
                  <ChevronRight size={18} />
                </Link>
              ))}
            </nav>
          </div>

          <div className="mm-voet">
            {isDakzorg ? (
              <a href="#dakzorg-prijs" onClick={() => setMobileOpen(false)} className="mm-knop mm-knop-g mx-glow">Onderhoudsplan aanvragen<ChevronRight size={17} /></a>
            ) : (
              <Link href="/#calculator" onClick={() => setMobileOpen(false)} className="mm-knop mm-knop-g mx-glow">Bereken mijn richtprijs<ChevronRight size={17} /></Link>
            )}
            <div className="mm-rij">
              <a href="tel:+32468352869" className="mm-knop mm-knop-l"><Phone size={17} />Bellen</a>
              <a href="https://wa.me/32468352869" target="_blank" rel="noopener noreferrer" className="mm-knop mm-knop-l"><MessageCircle size={17} />WhatsApp</a>
            </div>
            <div className="mm-socials">
              {[
                { href: "https://www.facebook.com/profile.php?id=61551512872835", label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { href: "https://www.instagram.com/mosx.be/", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


type Uitgelicht = { titel: string; tekst: string; knop: string; href: string; img: string };

/** Uitklapmenu met fotokaarten, rustig en in de MOS-X-stijl. */
function MegaMenu({ items, uit, sluit, twee }: { items: MegaItem[]; uit: Uitgelicht; sluit: () => void; twee?: boolean }) {
  return (
    <div className="nav-mega">
      <div className="nav-mega-in">
        <div className={twee ? "nav-mega-kaarten twee" : "nav-mega-kaarten"}>
          {items.map((d) => (
            <Link key={d.naam + d.href} href={d.href} className="nav-mk" onClick={sluit}>
              <span className="nav-mk-foto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt="" loading="lazy" decoding="async" width={560} height={370} />
              </span>
              <span className="nav-mk-naam">{d.naam}{d.dienst && <small>{d.dienst}</small>}</span>
            </Link>
          ))}
        </div>
        <Link href={uit.href} className="nav-uit" onClick={sluit}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={uit.img} alt="" loading="lazy" decoding="async" />
          <b>{uit.titel}</b>
          <span>{uit.tekst}</span>
          <em>{uit.knop}<ChevronRight size={15} strokeWidth={2.5} /></em>
        </Link>
      </div>
    </div>
  );
}
