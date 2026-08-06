"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Phone, ChevronRight } from "lucide-react";
import BackLink from "@/components/back-link";
import PageLayout from "@/components/page-layout";

const materials = [
  { icon: "🧱", name: "Baksteen", desc: "Zwarte aanslag en mos verwijderd. Voegen blijven intact." },
  { icon: "🏛️", name: "Pleisterwerk", desc: "Zachte reiniging zonder beschadiging van de bepleistering." },
  { icon: "🪨", name: "Natuursteen", desc: "Zachte methode voor zandsteen, blauwe hardsteen en meer." },
  { icon: "🏢", name: "Betonsteen", desc: "Algen en kalkuitbloeiing verwijderd van betonnen gevels." },
];

const faqs = [
  { q: "Beschadigt de reiniging mijn gevel?", a: "Nee. Wij gebruiken uitsluitend zachte reinigingsmethodes die geschikt zijn voor uw type gevel. Geen hogedruk die voegen beschadigt." },
  { q: "Hoe lang duurt gevelreiniging?", a: "Een gemiddelde gevel (60-100 m²) reinigen wij op één dag. Grotere projecten kunnen twee dagen in beslag nemen." },
  { q: "Blijft de gevel lang schoon?", a: "Na reiniging kunt u optioneel een beschermende impregneringen laten aanbrengen die nieuwe aanslag aanzienlijk vertraagt." },
];

export default function GevelreinigingPage() {
  const [waHovered, setWaHovered] = useState(false);
  const [phoneHovered, setPhoneHovered] = useState(false);

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "#0B0F0C" }}>
        <div className="site-wrap relative z-10">
          <BackLink href="/diensten" label="Terug naar diensten" dark />
          <p style={{ fontSize: "13px", marginBottom: "16px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 180ms ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>Home</Link>
            <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "rgba(255,255,255,0.25)" }} />
            <Link href="/diensten" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 180ms ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>Diensten</Link>
            <ChevronRight size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", margin: "0 3px", color: "rgba(255,255,255,0.25)" }} />
            <span style={{ color: "#9BCB6C" }}>Gevelreiniging</span>
          </p>
          <p className="site-eyebrow mb-4">Dienst</p>
          <h1
            className="text-white font-black leading-tight mb-5 max-w-2xl"
            style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Gevelreiniging ,
            <br />
            <span style={{ color: "#9BCB6C" }}>zachte methode.</span>
          </h1>
          <p className="text-lg max-w-xl leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            Zwarte aanslag, mos en algen van uw gevel. Geschikt voor baksteen, pleisterwerk, natuursteen en betonsteen.
          </p>
          <Link href="/contact" className="site-btn-primary">
            Gratis inspectie aanvragen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Before / After visual ── */}
      <section className="site-pad-sm" style={{ background: "#F7F8F6" }}>
        <div className="site-wrap">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="relative rounded-2xl overflow-hidden h-48 img-before-facade" style={{ border: "1px solid #E5E7EB" }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,31,26,0.8) 0%, transparent 50%)" }} />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white/80"
                  style={{ fontFamily: "var(--font-montserrat)" }}>VOOR</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-48 img-after-facade" style={{ border: "1px solid #E5E7EB" }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,31,26,0.8) 0%, transparent 50%)" }} />
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold text-white"
                  style={{ fontFamily: "var(--font-montserrat)", background: "#9BCB6C" }}>NA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Materials ── */}
      <section className="site-pad" style={{ background: "#F7F8F6" }}>
        <div className="site-wrap">
          <p className="site-eyebrow mb-4">Geschikt voor</p>
          <h2
            className="font-bold mb-10"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", letterSpacing: "-0.02em", color: "#1A1A1A" }}
          >
            Alle <span style={{ color: "#9BCB6C" }}>geveltypen gereinigd.</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {materials.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl p-6"
                style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
              >
                <span className="text-3xl mb-4 block">{m.icon}</span>
                <h3 className="font-bold mb-2 text-sm" style={{ fontFamily: "var(--font-montserrat)", color: "#1A1A1A" }}>{m.name}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#545454" }}>{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Included */}
          <div className="grid lg:grid-cols-2 gap-14">
            <div>
              <p className="site-eyebrow mb-4">Wat is inbegrepen?</p>
              <ul className="space-y-3">
                {[
                  "Gratis inspectie op locatie",
                  "Zachte biologische reiniging",
                  "Geschikt voor alle geveltypen",
                  "Geen beschadiging aan voegen",
                  "Foto-rapportage voor en na",
                  "Optioneel: beschermende impregnering",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#9BCB6C" }} />
                    <span className="text-sm" style={{ color: "#545454" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="site-eyebrow mb-4">Waarom zachte reiniging?</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#545454" }}>
                Hogedrukreiniging beschadigt voegen, poreuze stenen en bepleistering. Zachte bioreiniging verwijdert de aanslag aan de wortel, zonder schade aan uw gevel.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#545454" }}>
                Het resultaat is duurzamer: aanslag keert minder snel terug omdat de bron behandeld wordt in plaats van oppervlakkig weggespoeld.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="site-pad" style={{ background: "#F7F8F6" }}>
        <div className="site-wrap site-wrap-narrow">
          <p className="site-eyebrow mb-4">Vragen</p>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6"
                style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
              >
                <p className="font-bold mb-2 text-sm" style={{ fontFamily: "var(--font-montserrat)", color: "#1A1A1A" }}>{f.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#545454" }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#F7F8F6", paddingBottom: "80px" }}>
        <div className="site-wrap">
          <div style={{
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
            <div style={{ flex: 1, minWidth: "260px" }}>
              <p style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "6px", lineHeight: 1.25 }}>
                Klaar voor een <span style={{ color: "#9BCB6C" }}>schone gevel?</span>
              </p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "2px" }}>
                Gratis inspectie · Zachte methode · Geen panschade.
              </p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Yannick staat klaar om te helpen.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexShrink: 0, flexWrap: "wrap" }}>
              <a
                href="https://wa.me/32468352869"
                target="_blank"
                rel="noopener noreferrer"
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Yannick
              </a>
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

