import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const services = [
  { label: "Dakontmossing", href: "/diensten/dakontmossing" },
  { label: "Dakcoating", href: "/diensten/dakcoating" },
  { label: "Gevelreiniging", href: "/diensten/gevelreiniging" },
  { label: "Gratis Dakdiagnose", href: "/contact" },
];

const nav = [
  { label: "Home", href: "/" },
  { label: "Diensten", href: "/diensten" },
  { label: "Realisaties", href: "/realisaties" },
  { label: "Over MOS-X", href: "/over-ons" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/#faq" },
];

const regions = [
  "Gent", "Aalst", "Dendermonde", "Sint-Niklaas",
  "Ronse", "Wetteren", "Lokeren", "Zottegem",
  "Oudenaarde", "Ninove",
];

export default function MosxFooter() {
  return (
    <footer
      className="relative"
      style={{ background: "#0D1B12" }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(26,92,54,0.4) 50%, transparent 100%)" }}
      />

      {/* CTA strip */}
      <div
        className="py-10 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="wrap">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div>
              <p className="font-display font-bold text-white text-xl lg:text-2xl mb-1">
                Klaar voor een gratis dakdiagnose?
              </p>
              <p className="text-white/40 text-sm">
                Yannick inspecteert uw dak met drone, gratis en volledig vrijblijvend.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/contact" className="btn-primary-white text-sm">
                Gratis Diagnose Aanvragen →
              </Link>
              <a href="tel:+32470000000" className="btn-outline-white text-sm">
                <Phone className="w-4 h-4" /> 0470 00 00 00
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="section-pad-sm">
        <div className="wrap">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              {/* Logo */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg"
                    style={{ background: "linear-gradient(135deg, #1A5C36 0%, #2A7A4B 100%)" }}
                  >
                    M
                  </div>
                  <div>
                    <p className="font-display font-black text-white text-xl leading-none">MOS-X</p>
                    <p className="text-[#1A5C36] text-[10px] font-bold uppercase tracking-widest">Dakspecialist</p>
                  </div>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">
                  Professionele dakontmossing, dakcoating en gevelreiniging in Oost-Vlaanderen. Door Yannick, persoonlijk.
                </p>
              </div>

              {/* Contact */}
              <div className="space-y-2.5">
                <a href="tel:+32470000000" className="flex items-center gap-2.5 text-white/50 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4 text-[#1A5C36]" />
                  0470 00 00 00
                </a>
                <a href="mailto:info@mos-x.be" className="flex items-center gap-2.5 text-white/50 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4 text-[#1A5C36]" />
                  info@mos-x.be
                </a>
                <div className="flex items-start gap-2.5 text-white/40 text-sm">
                  <MapPin className="w-4 h-4 text-[#1A5C36] mt-0.5 shrink-0" />
                  Oost-Vlaanderen
                </div>
              </div>
            </div>

            {/* Diensten */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-5">Diensten</p>
              <ul className="space-y-3">
                {services.map(s => (
                  <li key={s.href}>
                    <Link href={s.href} className="text-white/50 hover:text-white text-sm transition-colors">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigatie */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-5">Navigatie</p>
              <ul className="space-y-3">
                {nav.map(n => (
                  <li key={n.href}>
                    <Link href={n.href} className="text-white/50 hover:text-white text-sm transition-colors">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Werkgebied */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-5">Werkgebied</p>
              <div className="flex flex-wrap gap-1.5">
                {regions.map(r => (
                  <span
                    key={r}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium text-white/40"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {r}
                  </span>
                ))}
              </div>
              <p className="text-white/25 text-xs mt-4 leading-relaxed">
                Ook beschikbaar in omliggende gemeenten. Neem contact op voor uw locatie.
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl mb-12"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            {[
              { n: "200+", l: "Gereinigde daken" },
              { n: "16",   l: "⭐ 5.0 Reviews" },
              { n: "~2j",  l: "Actief in de regio" },
              { n: "100%", l: "Persoonlijk ter plaatse" },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="font-display font-black text-white text-2xl lg:text-3xl mb-1">{s.n}</p>
                <p className="text-white/30 text-xs">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <p className="text-white/25 text-xs">
              © {new Date().getFullYear()} MOS-X, Dakspecialist. Alle rechten voorbehouden.
            </p>
            <div className="flex items-center gap-5">
              {["Privacybeleid", "Algemene voorwaarden"].map(l => (
                <Link key={l} href="#" className="text-white/25 hover:text-white/50 text-xs transition-colors">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
