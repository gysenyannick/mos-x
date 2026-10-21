import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Star, UserRound } from "lucide-react";
import PageLayout from "@/components/page-layout";
import BuurFormulier from "@/components/klantenzone/buur-formulier";
import { meldBuurAan } from "@/app/klant/actions";
import { getInstellingen, klantVoorRefCode } from "@/lib/klantenzone/store";
import kz from "@/components/klantenzone/kz.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aanbevolen door je buur | MOS-X",
  robots: { index: false, follow: false },
};

const H = { fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.028em" } as const;

export default async function BuurPagina({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const k = await klantVoorRefCode(code);
  const voordeel = (await getInstellingen()).burenVoordeel;
  const wie = k?.voornaam ?? "Een klant";
  const gemeente = k?.adres.match(/\d{4}\s+(.+)$/)?.[1];

  return (
    <PageLayout>
      <section style={{ background: "#F7F8F6", padding: "130px 0 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 60% at 85% 15%, rgba(155,203,108,0.14) 0%, rgba(155,203,108,0) 70%)" }} />
        <div className="site-wrap" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 40, alignItems: "start" }}>
          <div>
            <span className={`${kz.badge} ${kz.badgeGroen}`} style={{ padding: "6px 12px", fontSize: 13 }}>
              <UserRound size={14} /> Aanbevolen door {wie}{gemeente ? ` uit ${gemeente}` : ""}
            </span>
            <h1 style={{ ...H, fontSize: "clamp(2rem, 4.6vw, 3.2rem)", lineHeight: 1.06, color: "#1A1A1A", margin: "16px 0 16px" }}>
              Je buur koos voor een <span style={{ color: "#9BCB6C" }}>verzorgd dak.</span> Jij ook?
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "#545454", margin: "0 0 22px", maxWidth: 520 }}>
              Ik ben Yannick van MOS-X. Ik reinig en bescherm daken, en ik doe het werk zelf: geen onderaannemers, een eerlijke prijs vooraf.
              {wie !== "Een klant" ? ` ${wie} was tevreden en stuurde je deze link.` : ""}
            </p>
            {voordeel && (
              <div className={kz.volgendeStap} style={{ marginBottom: 20 }}>
                <span className={kz.rijIcoon}><Star size={18} /></span>
                <span style={{ fontWeight: 600 }}>{voordeel}</span>
              </div>
            )}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
              {[
                "Yannick komt zelf langs en doet zelf het werk",
                "Vaste prijs vooraf, geen verrassingen achteraf",
                "2 jaar mosvrij na reiniging, tot 10 jaar garantie op coating",
                "Werk ik al in je straat? Dan bespaar ik verplaatsing, en dat merk je",
              ].map((x) => (
                <li key={x} style={{ display: "flex", gap: 10, fontSize: 16, color: "#1A1A1A" }}>
                  <CheckCircle2 size={20} color="#7AB54E" style={{ flexShrink: 0, marginTop: 1 }} /> {x}
                </li>
              ))}
            </ul>
          </div>

          <div className={kz.kaart} style={{ marginTop: 0, padding: 24 }}>
            <h2 style={{ ...H, fontSize: 22, margin: "0 0 4px" }}>Vraag je richtprijs aan</h2>
            <p className={kz.sub} style={{ marginTop: 0, marginBottom: 16 }}>Laat je gegevens na, dan neem ik contact met je op.</p>
            {k ? (
              <BuurFormulier actie={meldBuurAan.bind(null, code)} />
            ) : (
              <p className={kz.leeg}>
                Deze link werkt niet meer, maar je bent natuurlijk welkom. <Link href="/#calculator" style={{ color: "#7AB54E", fontWeight: 600 }}>Bereken hier je richtprijs</Link>.
              </p>
            )}
            <p className={kz.sub} style={{ fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}>
              <ShieldCheck size={15} color="#7AB54E" /> {wie} ziet je gegevens niet.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
