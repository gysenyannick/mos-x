"use client";

import { Star, ShieldCheck, Leaf, CircleCheck } from "lucide-react";

type Stat = { title: string; label: React.ReactNode; icon: React.ReactNode };

const stats: Stat[] = [
  { title: "4,9/5 op Google",  label: "150+ daken gereinigd",          icon: <Star        size={26} color="#9BCB6C" /> },
  { title: "Vaste prijs",      label: "Geen verrassingen achteraf",    icon: <ShieldCheck size={26} color="#9BCB6C" /> },
  { title: "Dubbele garantie", label: "2 jaar mosvrij, 10 jaar coating", icon: <Leaf        size={26} color="#9BCB6C" /> },
  { title: "Schadevrij",       label: "Veilig voor je dakpannen",      icon: <CircleCheck size={26} color="#9BCB6C" /> },
];

function UspStat({ title, label, icon }: Stat) {
  return (
    <div className="usp-stat-inner" style={{ padding: "0 32px" }}>
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
      }}>{label}</p>
    </div>
  );
}

export default function SiteStatsBar() {
  return (
    <section style={{ background: "transparent", padding: "0 0 48px", position: "relative", zIndex: 5 }}>
      <style>{`
        @media (max-width: 640px) {
          .usp-stats-wrap {
            padding: 24px 12px !important;
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            row-gap: 28px;
          }
          .usp-stat-col {
            border-left: none !important;
          }
          .usp-stat-inner {
            padding: 0 8px !important;
            text-align: center;
          }
          .usp-stat-icon {
            display: flex;
            justify-content: center;
          }
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
            padding: "28px 40px",
            flexWrap: "wrap",
            overflow: "hidden",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="usp-stat-col"
              style={{
                flex: "1 1 0",
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
