"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Droplets, Shield, CalendarCheck, ChevronRight } from "lucide-react";

export interface ServiceCardData {
  id: string;
  title: string;
  imgSubtitle: string;
  href: string;
  img: string;
  video: string | null;
  videoPosition?: string;
  Icon: React.ElementType;
  desc: string;
  checks: string[];
  link: string;
  badge?: string;
}

export const serviceCards: ServiceCardData[] = [
  {
    id: "dak-reinigen",
    title: "Dakreiniging",
    imgSubtitle: "Verwijderen van mos, algen en vuil.",
    href: "/diensten/dakontmossing",
    img: "/images/IMG_4543.JPEG",
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

export function ServiceCard({ s, imageHeight = 380 }: { s: ServiceCardData; imageHeight?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const { Icon } = s;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !s.video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [s.video]);

  return (
    <div style={{ position: "relative", cursor: "pointer", transform: hovered ? "translateY(-4px)" : "translateY(0)", transition: "transform 300ms ease" }}>
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
          boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)" : "0 4px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.06)",
          transition: "box-shadow 300ms ease",
          display: "flex", flexDirection: "column",
        }}
      >
        <div className="relative overflow-hidden service-card-media" style={{ height: `${imageHeight}px`, borderRadius: "16px 16px 0 0" }}>
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
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
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

        <div className="flex flex-col service-card-body" style={{ padding: "24px", flex: 1 }}>
          <p style={{ fontSize: "14px", lineHeight: 1.65, color: "#555555", fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "20px" }}>
            {s.desc}
          </p>
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
                <span style={{ fontSize: "13px", color: "#444444", lineHeight: 1.5, fontFamily: "var(--font-inter), system-ui, sans-serif", paddingTop: i === s.checks.length - 1 ? "2px" : "1px" }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "auto" }}>
            <span style={{ color: "#9BCB6C", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-montserrat), system-ui, sans-serif", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              {s.link}
              <ChevronRight size={15} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </Link>

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
