"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Droplets, Shield, CalendarCheck, LayoutGrid, ArrowRight, ShieldCheck, ChevronRight } from "lucide-react";

const services = [
  {
    id: "dak-reinigen",
    title: "Dakreiniging",
    imgSubtitle: "Verwijderen van mos, algen en vuil.",
    href: "/diensten/dakontmossing",
    img: "/images/dak-reinigen.webp",
    video: "/videos/dakreiniging-hero.mp4",
    videoPosition: "center 35%",
    Icon: Droplets,
    desc: "Mos, algen en vuil verwijderen voor een proper en gezond dak.",
    checks: [
      "Proper dak in plaats van mos en vervuiling",
      "Meer uitstraling voor je woning",
      "Langere levensduur van je dak",
    ],
    link: "Meer over dakreiniging",
  },
  {
    id: "dak-coaten",
    title: "Dakcoating",
    imgSubtitle: "Bescherming en vernieuwing.",
    badge: "10 jaar garantie",
    href: "/diensten/dakcoating",
    img: "/images/IMG_4468 (2).JPEG",
    video: "/videos/Dakcoating.mp4",
    Icon: Shield,
    desc: "Geef je dak een tweede leven zonder een dure renovatie.",
    checks: [
      "Dak oogt opnieuw als nieuw",
      "Bescherming tegen regen, vorst, UV en mos",
      "Uitstel van een dure renovatie",
    ],
    link: "Meer over dakcoating",
  },
  {
    id: "dakabonnement",
    title: "MOS-X Dakzorg",
    imgSubtitle: "Jaarlijkse controle en onderhoud.",
    badge: "Onderhoudsplan",
    href: "/diensten/mos-x-dakzorg",
    img: "/images/Foto_dakzorg.png",
    video: null,
    Icon: CalendarCheck,
    desc: "Houd je dak jaar na jaar proper, beschermd en verzorgd.",
    checks: [
      "Geen verrassingen meer",
      "Jaarlijkse controle door een specialist",
      "Problemen oplossen vóór ze duur worden",
    ],
    link: "Ontdek MOS-X Dakzorg",
  },
];

function ServiceCard({ s }: { s: typeof services[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const { Icon } = s;

  return (
    <div style={{ position: "relative", transform: hovered ? "translateY(-4px)" : "translateY(0)", transition: "transform 300ms ease" }}>
    <Link
      href={s.href}
      data-service={s.id}
      className="group flex flex-col service-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        overflow: "hidden",
        textDecoration: "none",
        boxShadow: "0 4px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Media area */}
      <div className="relative overflow-hidden service-card-media" style={{ height: "380px", borderRadius: "16px 16px 0 0" }}>
        {!s.video && (
          <img
            src={s.img}
            alt={s.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transition: "transform 400ms ease" }}
          />
        )}
        {s.video && (
          <video
            ref={videoRef}
            src={s.video}
            poster={s.img}
            autoPlay muted loop playsInline
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: s.videoPosition ?? "center 65%", opacity: 1 }}
          />
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "60%",
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)",
          zIndex: 1,
        }} />
        {s.badge === "Onderhoudsplan" && (
          <div style={{
            position: "absolute", top: "14px", right: "14px", zIndex: 10,
            display: "flex", alignItems: "center", gap: "6px",
            background: "rgba(11,15,12,0.80)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(155,203,108,0.45)",
            borderRadius: "50px",
            padding: "6px 12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          }}>
            <span style={{
              fontSize: "11px", fontWeight: 700, color: "#FFFFFF",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              letterSpacing: "0.04em", whiteSpace: "nowrap",
            }}>{s.badge}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10" style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
          {/* Green icon circle */}
          <div style={{
            flexShrink: 0,
            width: "36px", height: "36px",
            background: "#9BCB6C",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "2px",
          }}>
            <Icon size={18} color="#FFFFFF" strokeWidth={2} />
          </div>
          <div>
            <p className="font-bold text-xl leading-tight"
              style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", color: hovered ? "#9BCB6C" : "#FFFFFF", transition: "color 200ms ease" }}>
              {s.title}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-inter), system-ui, sans-serif", marginTop: "2px" }}>
              {s.imgSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col service-card-body" style={{ padding: "24px", flex: 1 }}>
        {/* Description */}
        <p style={{
          fontSize: "14px", lineHeight: 1.65, color: "#555555",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          marginBottom: "20px", textAlign: "left",
        }}>
          {s.desc}
        </p>

        {/* Checkmarks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {s.checks.map((item, i) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", height: "19.5px" }}>
                <span style={{
                  width: "18px", height: "18px",
                  background: "#9BCB6C",
                  borderRadius: "50%",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", color: "#FFFFFF", fontWeight: 700,
                }}>✓</span>
              </span>
              <span style={{
                fontSize: "13px", color: "#444444", lineHeight: 1.5,
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                paddingTop: i === s.checks.length - 1 ? "2px" : "1px",
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Link */}
        <div style={{ marginTop: "auto", textAlign: "left" }}>
          <span style={{
            color: "#9BCB6C", fontSize: "14px", fontWeight: 600,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            display: "inline-flex", alignItems: "center", gap: "4px",
          }}>
            {s.link}
            <ChevronRight size={15} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>

    {/* Golden guarantee badge — overlaps top-right corner */}
    {s.badge === "10 jaar garantie" && (
      <img
        src="/images/10 jaar garantie badge.png"
        alt="10 jaar garantie"
        style={{
          position: "absolute", top: "-28px", right: "-28px",
          width: "110px", height: "110px",
          objectFit: "contain",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
    )}
    </div>
  );
}

export default function SiteServices() {
  return (
    <section className="site-pad" id="diensten" style={{
      position: "relative",
      background: "#0B0F0C",
      overflow: "hidden",
    }}>
      {/* Background photo — independently positioned */}
      <div className="hidden lg:block" style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('/images/diensten-bg.png')",
        backgroundSize: "auto 100%",
        backgroundPosition: "115% center",
        zIndex: 0,
      }} />

      {/* Gradient overlay — fades photo into dark left side */}
      <div className="hidden lg:block" style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, #0B0F0C 0%, #0B0F0C 70%, rgba(11,15,12,0.80) 80%, rgba(11,15,12,0.45) 90%, rgba(11,15,12,0.35) 100%)",
        zIndex: 1,
      }} />

      {/* Moss texture - left side */}
      <img
        src="/images/mos-texture.png"
        alt=""
        className="diensten-mos-texture"
        style={{
          position: "absolute",
          left: "-40px",
          top: "0",
          width: "auto",
          pointerEvents: "none",
          zIndex: 2,
          transform: "scaleX(-1)",
        }}
      />
      {/* Moss texture - bottom right */}
      <img
        src="/images/mos-texture.png"
        alt=""
        className="diensten-mos-texture-bottom"
        style={{
          position: "absolute",
          left: "-40px",
          bottom: "0",
          width: "auto",
          pointerEvents: "none",
          zIndex: 2,
          transform: "scaleX(-1)",
        }}
      />

      {/* Fade right edge of moss into dark background */}
      <div className="diensten-mos-fade" style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: "35%",
        background: "linear-gradient(to right, transparent 40%, #0B0F0C 90%)",
        pointerEvents: "none",
        zIndex: 3,
      }} />

      {/* Green radial glow */}
      <div style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(155,203,108,0.12) 0%, transparent 70%)",
        left: "-150px",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      <div className="site-wrap" style={{ position: "relative", zIndex: 4 }}>

        {/* Header */}
        <div className="mb-14" style={{ textAlign: "center" }}>
          <h2 className="font-bold leading-tight"
            style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", letterSpacing: "-0.028em", color: "#FFFFFF" }}>
            Voor elk dak de <span style={{ color: "#9BCB6C" }}>juiste aanpak.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.7)", marginTop: "12px" }}>
            Niet zeker wat je dak nodig heeft? Yannick helpt je kiezen.
          </p>
        </div>

        {/* 3-col grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10 services-grid">
          {services.map((s) => (
            <ServiceCard key={s.id} s={s} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center" style={{ gap: "12px", flexWrap: "wrap" }}>
          <a
            href="https://wa.me/32468352869"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
            style={{ border: "none", color: "#FFFFFF", background: "#9BCB6C", borderRadius: "10px", padding: "14px 28px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none", transition: "background-color 0.2s ease", gap: "10px" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
            onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Yannick
          </a>
          <Link
            href="/diensten"
            className="inline-flex items-center"
            style={{ border: "1px solid rgba(155,203,108,0.5)", color: "#FFFFFF", background: "transparent", borderRadius: "10px", padding: "14px 28px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none", transition: "border-color 0.2s ease, color 0.2s ease", gap: "8px" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#9BCB6C"; e.currentTarget.style.color = "#9BCB6C"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; e.currentTarget.style.color = "#FFFFFF"; }}
          >
            <LayoutGrid size={16} strokeWidth={2} />
            Alle diensten bekijken
            <ChevronRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
