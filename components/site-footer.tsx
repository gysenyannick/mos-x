"use client";

import Link from "next/link";
import Image from "next/image";

const GREEN = "#9ACA63";

const colTitle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: GREEN,
  marginBottom: "20px",
  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
};

const linkStyle: React.CSSProperties = {
  display: "block",
  fontSize: "15px",
  color: "rgba(255,255,255,0.72)",
  textDecoration: "none",
  lineHeight: 1.8,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  transition: "color 150ms ease",
};

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={linkStyle}
      onMouseEnter={e => (e.currentTarget.style.color = GREEN)}
      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
    >
      {children}
    </Link>
  );
}

function ALink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={linkStyle}
      onMouseEnter={e => (e.currentTarget.style.color = GREEN)}
      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
    >
      {children}
    </a>
  );
}

function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        width: "38px", height: "38px", borderRadius: "8px",
        border: "1px solid rgba(154,202,99,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: GREEN, transition: "background 150ms ease",
        flexShrink: 0,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(154,202,99,0.12)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </a>
  );
}

export default function SiteFooter() {
  return (
    <footer style={{
      backgroundColor: "#0B0F0C",
      backgroundImage: `linear-gradient(90deg, #0B0F0C 0%, #0B0F0C 42%, rgba(11,15,12,0.90) 58%, rgba(11,15,12,0.45) 100%), url('/images/footer-bg.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "right center",
      backgroundRepeat: "no-repeat",
      paddingTop: "30px",
      paddingBottom: "24px",
    }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 40px)" }}>

        {/* ── Main grid ── */}
        <div className="footer-grid">

          {/* Col 1 — Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <Link href="/" style={{ display: "inline-block", marginBottom: "20px" }}>
              <Image
                src="/images/logo-footer.avif"
                alt="MOS-X"
                width={260} height={125}
                style={{ height: "62px", width: "auto", objectFit: "contain" }}
              />
            </Link>
            <p style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.72)",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              lineHeight: 1.75,
              marginBottom: "28px",
              maxWidth: "260px",
            }}>
              Voor een proper, beschermd en verzorgd dak.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <SocialBtn href="https://www.facebook.com/profile.php?id=61551512872835" label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </SocialBtn>
              <SocialBtn href="https://www.instagram.com/mosx.be/" label="Instagram">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialBtn>
              <SocialBtn href="https://www.linkedin.com/in/yannick-gysen-3b0018247/" label="LinkedIn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </SocialBtn>
            </div>
          </div>

          {/* Col 2 — Diensten */}
          <div>
            <span style={colTitle}>Diensten</span>
            <FLink href="/diensten/dakontmossing">Dakreiniging</FLink>
            <FLink href="/diensten/dakcoating">Dakcoating</FLink>
            <FLink href="/contact">MOS-X Dakzorg</FLink>
          </div>

          {/* Col 3 — Regio's */}
          <div>
            <span style={colTitle}>Regio&apos;s</span>
            <FLink href="/regio/antwerpen">Antwerpen</FLink>
            <FLink href="/regio/limburg">Limburg</FLink>

            <FLink href="/regio/vlaams-brabant">Vlaams-Brabant</FLink>
          </div>

          {/* Col 4 — Navigatie */}
          <div>
            <span style={colTitle}>Navigatie</span>
            <FLink href="/">Home</FLink>
            <FLink href="/realisaties">Realisaties</FLink>
            <FLink href="/over-ons">Over ons</FLink>
            <FLink href="/contact">Contact</FLink>
            <FLink href="/faq">FAQ</FLink>
          </div>

          {/* Col 5 — Contact */}
          <div>
            <span style={colTitle}>Contact</span>
            <ALink href="tel:+32468352869">+32 468 35 28 69</ALink>
            <ALink href="mailto:info@mos-x.be">info@mos-x.be</ALink>
            <span style={{ ...linkStyle, cursor: "default" }}>
              Bovenpad 100<br />2280 Grobbendonk
            </span>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom-bar" style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          marginTop: "24px",
          paddingTop: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            &copy; 2026 MOS-X.be – Alle rechten voorbehouden
          </span>
          <span style={{ display: "flex", gap: "24px" }}>
            {(["Privacyverklaring", "Algemene voorwaarden"] as const).map(l => (
              <Link
                key={l}
                href="#"
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 150ms ease", fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.color = GREEN)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {l}
              </Link>
            ))}
          </span>
        </div>

      </div>
    </footer>
  );
}
