"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, ChevronRight } from "lucide-react";

const links = [
  { label: "Diensten",    href: "/diensten" },
  { label: "Realisaties", href: "/realisaties" },
  { label: "Over ons",    href: "/over-ons" },
  { label: "Contact",     href: "/contact" },
  { label: "FAQ",         href: "/faq" },
];

const mobileLinks = [
  { label: "Home",        href: "/" },
  ...links,
];

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

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
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1A1A1A",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#9BCB6C")}
                onMouseLeave={e => (e.currentTarget.style.color = "#1A1A1A")}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop socials — gecentreerd via margin: auto */}
          <div className="hidden lg:flex items-center gap-2" style={{ margin: "0 auto" }}>
            {[
              { href: "https://www.facebook.com/profile.php?id=61551512872835", label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              { href: "https://www.instagram.com/mosx.be/", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { href: "https://www.linkedin.com/in/yannick-gysen-3b0018247/", label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
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
            <a
              href="tel:+32468352869"
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
              +32 468 35 28 69
            </a>
            <Link
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
              Bereken je richtprijs
              <ChevronRight size={13} strokeWidth={2.5} />
            </Link>
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
              {mobileLinks.map(l => (
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
                { href: "https://www.linkedin.com/in/yannick-gysen-3b0018247/", label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
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
              <a href="tel:+32468352869" className="flex items-center justify-center gap-2 text-sm font-semibold"
                style={{
                  color: "#1A1A1A", border: "2px solid #9BCB6C", borderRadius: "50px",
                  padding: "12px 20px", textDecoration: "none", fontFamily: "var(--font-montserrat)",
                }}>
                <Phone className="w-4 h-4" style={{ color: "#1A1A1A" }} />
                +32 468 35 28 69
              </a>
              <Link href="/#calculator" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full text-sm font-bold"
                style={{
                  background: "#9BCB6C", color: "#FFFFFF", borderRadius: "50px",
                  padding: "12px 20px", textDecoration: "none",
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                Bereken je richtprijs
                <ChevronRight size={13} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
