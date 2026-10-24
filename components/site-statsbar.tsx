"use client";

import { Star, ShieldCheck, Leaf, CircleCheck } from "lucide-react";

type Stat = { title: string; label: React.ReactNode; icon: React.ReactNode };

const stats: Stat[] = [
  { title: "5/5 op Google",    label: "Meer dan 150 daken gereinigd",           icon: <Star        size={26} color="#9BCB6C" /> },
  { title: "Vaste prijs",      label: "Geen verrassingen achteraf",             icon: <ShieldCheck size={26} color="#9BCB6C" /> },
  { title: "Dubbele garantie", label: "2 jaar mosvrij, 10 jaar op de coating",  icon: <Leaf        size={26} color="#9BCB6C" /> },
  { title: "Schadevrij",       label: "Veilig voor je dakpannen",               icon: <CircleCheck size={26} color="#9BCB6C" /> },
];

function UspStat({ title, label, icon }: Stat) {
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
      }}>{label}</p>
    </div>
  );
}

export default function SiteStatsBar() {
  return (
    <section style={{ background: "transparent", padding: "0 0 48px", position: "relative", zIndex: 5 }}>
      <style>{`
        /* Gsm: 2x2 kaartjes met ademruimte */
        @media (max-width: 640px) {
          .usp-stats-wrap.usp-stats-wrap {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 0 !important;
            padding: 8px 0 0 !important;
            overflow: visible !important;
          }
          .usp-stats-wrap.usp-stats-wrap > div {
            min-width: 0 !important;
            border: 1px solid #E5E7EB !important;
            border-radius: 16px;
            background: #FFFFFF;
            box-shadow: 0 2px 16px rgba(0,0,0,0.05);
            padding: 20px 12px !important;
          }
          .usp-stats-wrap .usp-stat-inner { padding: 0 !important; }
          .usp-stats-wrap .usp-stat-icon { display: flex; justify-content: center; margin-bottom: 10px !important; }
          .usp-stats-wrap .usp-stat-title { font-size: 14px !important; margin-bottom: 4px !important; }
          .usp-stats-wrap .usp-stat-label { white-space: normal !important; font-size: 12.5px !important; line-height: 1.4; text-wrap: balance; }
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
