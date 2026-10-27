"use client";

import { Star, ShieldCheck, Leaf, CircleCheck } from "lucide-react";

type Stat = { title: string; label: React.ReactNode; kort: string; icon: React.ReactNode };

const stats: Stat[] = [
  { title: "5/5 op Google",    label: "Meer dan 150 daken gereinigd", kort: "150+ daken gereinigd", icon: <Star        size={26} color="#9BCB6C" /> },
  { title: "Vaste prijs",      label: "Geen verrassingen achteraf", kort: "Geen verrassingen", icon: <ShieldCheck size={26} color="#9BCB6C" /> },
  { title: "Garantie", label: "2 jaar mosvrij, 10 jaar op de hechting", kort: "10 jaar op de hechting", icon: <Leaf        size={26} color="#9BCB6C" /> },
  { title: "Schadevrij",       label: "Veilig voor je dakpannen", kort: "Veilig voor je pannen", icon: <CircleCheck size={26} color="#9BCB6C" /> },
];

function UspStat({ title, label, kort, icon }: Stat) {
  return (
    <div className="usp-stat-inner" style={{ padding: "0 24px" }}>
      <div className="usp-stat-icon" style={{ marginBottom: "14px" }}>
        {icon}
      </div>
      <p className="usp-stat-title" style={{
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        color: "#1A1A1A",
        fontSize: "0.9375rem",
        fontWeight: 700,
        lineHeight: 1.25,
        marginBottom: "6px",
      }}>{title}</p>
      <p className="usp-stat-label" style={{
        color: "#545454",
        fontSize: "13px",
        fontWeight: 500,
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        whiteSpace: "nowrap",
      }}><span className="usp-lang">{label}</span><span className="usp-kort">{kort}</span></p>
    </div>
  );
}

export default function SiteStatsBar() {
  return (
    <section style={{ background: "transparent", padding: "0 0 48px", position: "relative", zIndex: 5 }}>
      <style>{`
        .usp-kort { display: none; }
        /* Gsm: 2x2 kaartjes met ademruimte */
        @media (max-width: 640px) {
          .usp-stats-wrap.usp-stats-wrap {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            margin: 0 !important;
            padding: 8px 0 0 !important;
            overflow: visible !important;
          }
          .usp-stats-wrap.usp-stats-wrap > div {
            min-width: 0 !important;
            border: 0 !important;
            padding: 22px 10px !important;
          }
          .usp-stats-wrap.usp-stats-wrap > div:nth-child(odd) { border-right: 1px solid #E5E7EB !important; }
          .usp-stats-wrap.usp-stats-wrap > div:nth-child(-n+2) { border-bottom: 1px solid #E5E7EB !important; }
          .usp-stats-wrap .usp-stat-inner { padding: 0 !important; }
          .usp-stats-wrap .usp-stat-icon { display: flex; justify-content: center; margin-bottom: 10px !important; }
          .usp-stats-wrap .usp-stat-title { font-size: 14px !important; margin-bottom: 4px !important; }
          .usp-stats-wrap .usp-stat-label { white-space: nowrap !important; font-size: 13px !important; line-height: 1.4; }
          .usp-stats-wrap .usp-lang { display: none; }
          .usp-stats-wrap .usp-kort { display: inline !important; }
        }
        @media (max-width: 374px) {
          .usp-stats-wrap .usp-stat-label { font-size: 12px !important; letter-spacing: -0.01em; }
          .usp-stats-wrap.usp-stats-wrap > div { padding-left: 6px !important; padding-right: 6px !important; }
        }
        @media (max-width: 339px) {
          .usp-stats-wrap .usp-stat-label { white-space: normal !important; text-wrap: balance; }
        }
      `}</style>
      <div className="site-wrap">
        <div
          className="usp-stats-wrap"
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            background: "transparent",
            border: "none",
            borderRadius: "16px",
            padding: "28px 0",
            flexWrap: "wrap",
            overflow: "hidden",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="usp-stat-col"
              style={{
                flex: "1 1 auto",
                minWidth: "120px",
                borderLeft: i > 0 ? "1px solid #E5E7EB" : "none",
                position: "relative",
                zIndex: 1,
              }}
            >
              <UspStat {...s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
