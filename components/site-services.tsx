"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { Droplets, Shield, CalendarCheck, ChevronRight } from "lucide-react";
import { BtnPress } from "@/components/btn-press";
import { PlaatsbezoekModal } from "@/components/plaatsbezoek-modal";

const services = [
  {
    id: "dak-reinigen",
    title: "Dakreiniging",
    imgSubtitle: "Verwijderen van mos, algen en vuil.",
    badge: "2 jaar mosvrij",
    sticker: { groot: "2", klein: "mosvrij garantie" },
    href: "/diensten/dakontmossing",
    img: "/images/IMG_4543.JPEG",
    video: "/videos/dakreiniging-hero.mp4",
    videoPosition: "center 35%",
    Icon: Droplets,
    desc: "Verwijder mos en aanslag. Geef je dak zijn verzorgde uitstraling terug.",
    link: "Ontdek dakreiniging",
  },
  {
    id: "dak-coaten",
    title: "Dakcoating",
    imgSubtitle: "Bescherming en vernieuwing.",
    badge: "10 jaar garantie",
    sticker: { groot: "10", klein: "garantie" },
    href: "/diensten/dakcoating",
    img: "/images/IMG_4468 (2).JPEG",
    video: "/videos/dakcoating-kaart.mp4",
    Icon: Shield,
    desc: "Geef je dak een nieuwe uitstraling met een beschermende coating.",
    link: "Ontdek dakcoating",
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
    desc: "Wij volgen je dak op en helpen het jarenlang verzorgd te houden.",
    link: "Ontdek Dakzorg",
  },
];

function ServiceCard({ s, isActive, onMount }: { s: typeof services[0]; isActive: boolean; onMount: (id: string, el: HTMLDivElement | null) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const { Icon } = s;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !s.video) return;
    // Pas laden wanneer de kaart bijna in beeld is, zodat de pagina snel opent.
    const bron = s.video;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      video.muted = true;
      video.src = bron;
      video.play().catch(() => {});
    }, { rootMargin: "200px" });
    io.observe(video);
    return () => io.disconnect();
  }, [s.video]);

  const cardBoxShadow = isActive
    ? "0 4px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.06), 0 0 0 2px #9BCB6C"
    : "0 4px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.06)";

  return (
    <div ref={(el) => onMount(s.id, el)} data-card-id={s.id} style={{ position: "relative", transform: hovered ? "translateY(-4px)" : "translateY(0)", transition: "transform 300ms ease" }}>
    <Link
      href={s.href}
      data-service={s.id}
      className="group flex flex-col service-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0B0F0C",
        borderRadius: "16px",
        overflow: "hidden",
        textDecoration: "none",
        boxShadow: cardBoxShadow,
        transition: "box-shadow 300ms ease",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Media area */}
      <div className="relative overflow-hidden service-card-media" style={{ height: "460px", borderRadius: "16px" }}>
        {!s.video && (
          <img loading="lazy" decoding="async"
            src={s.img}
            alt={s.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transition: "transform 400ms ease" }}
          />
        )}
        {s.video && (
          <video
            ref={videoRef}
            poster={s.img}
            muted
            loop
            playsInline
            preload="none"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: s.videoPosition ?? "center 65%", opacity: 1 }}
          />
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "75%",
          background: "linear-gradient(to top, rgba(8,12,9,0.92) 0%, rgba(8,12,9,0.7) 40%, transparent 100%)",
          zIndex: 1,
        }} />
        <div className="absolute bottom-0 left-0 right-0 z-10 service-card-tekst" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              flexShrink: 0, width: "36px", height: "36px", background: "#9BCB6C", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={18} color="#FFFFFF" strokeWidth={2} />
            </div>
            <p className="font-bold text-xl leading-tight"
              style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", color: hovered ? "#9BCB6C" : "#FFFFFF", transition: "color 200ms ease", letterSpacing: "-0.02em" }}>
              {s.title}
            </p>
          </div>
          <p style={{
            margin: "12px 0 0", fontSize: "15px", lineHeight: 1.55, color: "rgba(255,255,255,0.82)",
            fontFamily: "var(--font-inter), system-ui, sans-serif", textWrap: "pretty",
          }}>
            {s.desc}
          </p>
          <span style={{
            marginTop: "16px", color: "#9BCB6C", fontSize: "14px", fontWeight: 700,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            display: "inline-flex", alignItems: "center", gap: "6px",
          }}>
            {s.link}
            <ChevronRight size={15} strokeWidth={2.5} style={{ transform: hovered ? "translateX(3px)" : "none", transition: "transform 200ms ease" }} />
          </span>
        </div>
      </div>
    </Link>

    {/* Sticker over de rechterbovenhoek: cijfer + lint met de garantie */}
    {s.sticker && (
      <div aria-label={`${s.sticker.groot} jaar ${s.sticker.klein}`} style={{
        position: "absolute", top: "-18px", right: "-12px", zIndex: 20,
        width: "86px", height: "86px",
        transform: hovered ? "rotate(-3deg) scale(1.04)" : "rotate(-9deg)",
        transition: "transform 300ms ease", pointerEvents: "none",
        fontFamily: "var(--font-montserrat), system-ui, sans-serif", lineHeight: 1,
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle at 32% 26%, #B4DA8C 0%, #9BCB6C 58%, #86BC57 100%)",
          boxShadow: "0 8px 18px -6px rgba(0,0,0,0.55)",
        }} />
        <div style={{ position: "absolute", inset: "5px", borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.6)" }} />
        <div style={{ position: "absolute", top: "20px", left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "baseline", gap: "3px", color: "#0B0F0C" }}>
          <span style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-0.04em" }}>{s.sticker.groot}</span>
          <span style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em" }}>JAAR</span>
        </div>
        <div style={{
          position: "absolute", left: "-15px", right: "-15px", bottom: "14px", height: "19px",
          background: "#0B0F0C", color: "#FFFFFF",
          clipPath: "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%, 6% 50%)",
          display: "grid", placeItems: "center",
          fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          {s.sticker.klein}
        </div>
      </div>
    )}
    </div>
  );
}

export default function SiteServices() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [bezoekOpen, setBezoekOpen] = useState(false);
  const cardEls = useRef<Map<string, HTMLDivElement>>(new Map());

  const registerCard = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) cardEls.current.set(id, el);
    else cardEls.current.delete(id);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = (entry.target as HTMLElement).dataset.cardId!;
          ratios.set(id, entry.intersectionRatio);
        });
        let bestId: string | null = null;
        let bestRatio = 0.75;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
        });
        setActiveCardId(bestId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 0.9, 1] }
    );

    cardEls.current.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="site-pad" id="diensten" style={{
      position: "relative",
      background: "#0B0F0C",
      overflow: "hidden",
    }}>
      {/* Moss texture - right side (zelfde stijl als de reviews) */}
      <img decoding="async"
        src="/images/mos-texture.jpg"
        alt=""
        aria-hidden="true"
        className="hidden lg:block"
        style={{
          position: "absolute",
          right: "0",
          top: "0",
          height: "100%",
          width: "auto",
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Moss texture - left side */}
      <img decoding="async"
        src="/images/mos-texture.jpg"
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
      <img decoding="async"
        src="/images/mos-texture.jpg"
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
            Niet zeker wat je dak nodig heeft? We helpen je kiezen.
          </p>
        </div>

        {/* 3-col grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10 services-grid">
          {services.map((s) => (
            <ServiceCard key={s.id} s={s} isActive={activeCardId === s.id} onMount={registerCard} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center" style={{ gap: "12px", flexWrap: "wrap" }}>
          <BtnPress
            href="https://wa.me/32468352869"
            target="_blank"
            className="inline-flex items-center"
            style={{ border: "none", color: "#FFFFFF", background: "#9BCB6C", borderRadius: "10px", padding: "14px 28px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none", transition: "background-color 0.2s ease", gap: "10px" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#7AB54E")}
            onMouseLeave={e => (e.currentTarget.style.background = "#9BCB6C")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Yannick
          </BtnPress>
          <button
            type="button"
            onClick={() => setBezoekOpen(true)}
            className="inline-flex items-center"
            style={{ cursor: "pointer", border: "1px solid rgba(155,203,108,0.5)", color: "#FFFFFF", background: "transparent", borderRadius: "10px", padding: "14px 28px", fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none", transition: "border-color 0.2s ease, color 0.2s ease", gap: "8px" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#9BCB6C"; e.currentTarget.style.color = "#9BCB6C"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(155,203,108,0.5)"; e.currentTarget.style.color = "#FFFFFF"; }}
          >
            <CalendarCheck size={16} strokeWidth={2} />
            Plan een gratis plaatsbezoek
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <PlaatsbezoekModal open={bezoekOpen} onClose={() => setBezoekOpen(false)} bron="Homepage diensten" />
    </section>
  );
}
