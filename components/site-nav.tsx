"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, ChevronRight, ChevronDown } from "lucide-react";
import { BtnPress } from "@/components/btn-press";

const diensten = [
  { label: "Dakontmossen",  href: "/diensten/dakontmossing" },
  { label: "Dakcoaten",     href: "/diensten/dakcoating" },
  { label: "MOS-X Dakzorg", href: "/diensten/mos-x-dakzorg" },
];

const links = [
  { label: "Realisaties", href: "/realisaties" },
  { label: "Over ons",    href: "/over-ons" },
  { label: "Contact",     href: "/contact" },
  { label: "Klantenzone", href: "/klant" },
];

const mobileLinks = [
  { label: "Home",        href: "/" },
  ...links,
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
  const [mobielDienstenOpen, setMobielDienstenOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isDakzorg = pathname === "/diensten/mos-x-dakzorg";

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
        .nav-dienst:active { background: #EEF6E6; }
        .nav-dienst:focus-visible { outline: 2px solid #1A1A1A; outline-offset: -2px; }
      `}</style>
      {/* ── Floating glassmorphism navbar ── */}
      <header
        style={{
          position: "fixed",
          top: "16px",
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
            <div className="nav-diensten" onMouseEnter={() => setDienstenOpen(true)} onMouseLeave={() => setDienstenOpen(false)}>
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
                <div className="nav-diensten-menu">
                  {diensten.map(d => (
                    <Link key={d.href} href={d.href} className="nav-dienst" onClick={() => setDienstenOpen(false)}>
                      {d.label}
                    </Link>
                  ))}
                </div>
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
                MOS-X Dakzorg aanvragen
                <ChevronRight size={13} strokeWidth={2.5} />
              </BtnPress>
            ) : (
              <BtnPress
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg"
            style={{ color: "#1A1A1A" }}
            aria-label="Menu openen"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[1100] flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div
            className="relative ml-auto w-72 h-full flex flex-col p-6"
            style={{ background: "#FFFFFF", borderLeft: "1px solid rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Image src="/images/logo.avif" alt="MOS-X" width={260} height={125}
                  style={{ height: "52px", width: "auto", objectFit: "contain" }} />
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg"
                style={{ color: "#1A1A1A" }} aria-label="Menu sluiten">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 flex-1 items-center">
              <Link href="/" onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-lg font-semibold text-center w-full"
                style={{ fontFamily: "var(--font-montserrat)", color: "var(--color-brand-green)", textDecoration: "none", fontSize: "20px" }}>
                Home
              </Link>
              <button type="button" onClick={() => setMobielDienstenOpen(o => !o)} aria-expanded={mobielDienstenOpen}
                className="px-3 py-3 rounded-lg font-semibold w-full flex items-center justify-center gap-1"
                style={{ fontFamily: "var(--font-montserrat)", color: "var(--color-brand-green)", fontSize: "20px", background: "none", border: 0, cursor: "pointer" }}>
                Diensten
                <ChevronDown size={18} strokeWidth={2.5} style={{ transition: "transform 200ms ease", transform: mobielDienstenOpen ? "rotate(180deg)" : "none" }} />
              </button>
              {mobielDienstenOpen && diensten.map(d => (
                <Link key={d.href} href={d.href} onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-center w-full"
                  style={{ fontFamily: "var(--font-montserrat)", color: "#1A1A1A", textDecoration: "none", fontSize: "16px", fontWeight: 600 }}>
                  {d.label}
                </Link>
              ))}
              {mobileLinks.filter(l => l.href !== "/").map(l => (
                <Link
                  key={l.href} href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 rounded-lg font-semibold text-center w-full"
                  style={{ fontFamily: "var(--font-montserrat)", color: "var(--color-brand-green)", textDecoration: "none", fontSize: "20px" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex gap-3 pb-6 justify-center">
              {[
                { href: "https://www.facebook.com/profile.php?id=61551512872835", label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { href: "https://www.instagram.com/mosx.be/", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", background: "#F7F8F6", color: "#9BCB6C", transition: "background 150ms ease" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#E8F5D9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#F7F8F6")}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
            </div>

            <div className="space-y-3 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
              <BtnPress href="tel:+32468352869" className="flex items-center justify-center gap-2 text-sm font-semibold"
                style={{
                  color: "#1A1A1A", border: "2px solid #9BCB6C", borderRadius: "50px",
                  padding: "12px 20px", textDecoration: "none", fontFamily: "var(--font-montserrat)",
                }}>
                <Phone className="w-4 h-4" style={{ color: "#1A1A1A" }} />
                +32 468 35 28 69
              </BtnPress>
              {isDakzorg ? (
                <a
                  href="#dakzorg-prijs"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full text-sm font-bold"
                  style={{
                    background: "#9BCB6C", color: "#FFFFFF", borderRadius: "50px",
                    padding: "12px 20px", textDecoration: "none",
                    fontFamily: "var(--font-montserrat)",
                    transition: "background 200ms ease",
                    gap: "6px", display: "flex",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#7AB54E"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#9BCB6C"; }}
                >
                  MOS-X Dakzorg aanvragen
                  <ChevronRight size={13} strokeWidth={2.5} />
                </a>
              ) : (
                <Link href="/#calculator" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full text-sm font-bold"
                  style={{
                    background: "#9BCB6C", color: "#FFFFFF", borderRadius: "50px",
                    padding: "12px 20px", textDecoration: "none",
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  Bereken mijn richtprijs
                  <ChevronRight size={13} strokeWidth={2.5} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
