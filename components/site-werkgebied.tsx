import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const provinces = [
  {
    name: "Vlaams-Brabant",
    href: "/regio/vlaams-brabant",
    count: "30 gemeenten",
    cities: ["Leuven", "Vilvoorde", "Halle", "Diest", "Aarschot"],
  },
  {
    name: "Oost-Vlaanderen",
    href: "/regio/oost-vlaanderen",
    count: "30 gemeenten",
    cities: ["Gent", "Aalst", "Sint-Niklaas", "Dendermonde", "Deinze"],
  },
  {
    name: "Antwerpen",
    href: "/regio/antwerpen",
    count: "30 gemeenten",
    cities: ["Antwerpen", "Mechelen", "Lier", "Turnhout", "Geel"],
  },
  {
    name: "Limburg",
    href: "/regio/limburg",
    count: "30 gemeenten",
    cities: ["Hasselt", "Genk", "Sint-Truiden", "Tongeren", "Lommel"],
  },
];

export default function SiteWerkgebied() {
  return (
    <section className="site-pad" style={{ background: "#F7F8F6" }}>
      <div className="site-wrap">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="site-eyebrow mb-4">Werkgebied</span>
          <h2
            className="font-bold leading-tight mb-4"
            style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              letterSpacing: "-0.02em",
              color: "#1A1A1A",
            }}
          >
            Actief in 4 provincies.
          </h2>
          <p style={{ color: "#545454", fontSize: "16px", lineHeight: 1.7 }}>
            We werken in Vlaams-Brabant, Oost-Vlaanderen, Antwerpen en Limburg.
          </p>
        </div>

        {/* Province cards — 2x2 on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {provinces.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="province-card flex flex-col"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "28px 24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                textDecoration: "none",
                transition: "border-color 250ms ease, transform 250ms ease, box-shadow 250ms ease",
              }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 shrink-0"
                style={{ background: "rgba(155,203,108,0.12)" }}
              >
                <MapPin className="w-4 h-4" style={{ color: "#9BCB6C" }} />
              </div>

              {/* Province name */}
              <h3
                className="font-bold mb-1"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontSize: "15px",
                  color: "#1A1A1A",
                  lineHeight: 1.3,
                }}
              >
                {p.name}
              </h3>

              {/* Count */}
              <p className="text-xs mb-4" style={{ color: "#9BCB6C", fontWeight: 600 }}>
                {p.count}
              </p>

              {/* Sample cities */}
              <p className="text-xs leading-relaxed flex-1" style={{ color: "#545454" }}>
                {p.cities.join(" · ")} &middot; meer
              </p>

              {/* Arrow */}
              <div
                className="flex items-center gap-1 mt-4 text-xs font-semibold"
                style={{ color: "#9BCB6C" }}
              >
                Bekijk gemeenten
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm mt-8" style={{ color: "#9CA3AF" }}>
          Staat uw gemeente er niet bij? Neem contact op &mdash; we kijken graag of een uitzondering mogelijk is.
        </p>
      </div>
    </section>
  );
}
