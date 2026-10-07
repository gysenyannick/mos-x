"use client";

import { useEffect, useRef, useState } from "react";
import { motion, animate, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ShieldCheck, Home, MapPin } from "lucide-react";

const GREEN = "#9BCB6C";
const EASE  = [0.22, 1, 0.36, 1] as const;

/* ── Telt op van 0 naar target zodra het in beeld komt ── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref     = useRef<HTMLSpanElement>(null);
  const inView  = useInView(ref, { once: true, amount: 0.6 });
  const reduce  = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: reduce ? 0 : 1.6,
      delay: reduce ? 0 : 0.25,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className="usp-num">
      {value}{suffix}
    </span>
  );
}

type Stat = {
  key: string;
  title: React.ReactNode;
  label: React.ReactNode;
  icon: React.ReactNode;
};

const REGIONS = ["Antwerpen", "Limburg", "Vlaams-Brabant"];

const stats: Stat[] = [
  {
    key: "garantie",
    title: <>Tot <CountUp to={10} /> jaar garantie</>,
    label: "Bescherming op onze premium coatings.",
    icon: <ShieldCheck size={26} strokeWidth={2} />,
  },
  {
    key: "daken",
    title: <><CountUp to={150} suffix="+" /> daken gereinigd</>,
    label: "Van reiniging tot complete bescherming.",
    icon: <Home size={26} strokeWidth={2} />,
  },
  {
    key: "regio",
    title: "Actief in de regio's",
    label: (
      <span className="usp-chips">
        {REGIONS.map((r, i) => (
          <motion.span
            key={r}
            className="usp-chip"
            variants={{
              hidden: { opacity: 0, y: 6, scale: 0.92 },
              show:   { opacity: 1, y: 0, scale: 1, transition: { delay: 0.45 + i * 0.09, duration: 0.45, ease: EASE } },
            }}
          >
            {r}
          </motion.span>
        ))}
      </span>
    ),
    icon: <MapPin size={26} strokeWidth={2} />,
  },
];

const container: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const iconPop: Variants = {
  hidden: { scale: 0.4, rotate: -14, opacity: 0 },
  show:   { scale: 1, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 16, delay: 0.15 } },
};

export default function SiteStatsBar() {
  const reduce = useReducedMotion();

  return (
    <section style={{ background: "transparent", padding: "0 0 48px", position: "relative", zIndex: 5 }}>
      <style>{`
        .usp-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          padding: 20px 0;
        }
        .usp-card {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 24px 28px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
          overflow: hidden;
          isolation: isolate;
          transition: transform .35s cubic-bezier(.22,1,.36,1),
                      box-shadow .35s cubic-bezier(.22,1,.36,1),
                      border-color .35s ease;
        }
        /* zachte groene gloed bovenaan */
        .usp-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 70% at 50% 0%, rgba(155,203,108,0.14), rgba(155,203,108,0) 70%);
          opacity: 0;
          transform: translateY(12px);
          transition: opacity .4s ease, transform .5s cubic-bezier(.22,1,.36,1);
          z-index: -1;
        }
        /* groene accentlijn die openschuift */
        .usp-card::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 100%;
          height: 3px;
          background: ${GREEN};
          border-radius: 3px 3px 0 0;
          transform: translateX(-50%) scaleX(0);
          transition: transform .45s cubic-bezier(.22,1,.36,1);
        }
        .usp-card:hover {
          transform: translateY(-6px);
          border-color: rgba(155,203,108,0.45);
          box-shadow: 0 2px 6px rgba(26,26,26,0.04),
                      0 18px 40px -12px rgba(122,181,78,0.32);
        }
        .usp-card:hover::before { opacity: 1; transform: translateY(0); }
        .usp-card:hover::after  { transform: translateX(-50%) scaleX(0.4); }

        .usp-icon-wrap {
          position: relative;
          width: 60px;
          height: 60px;
          margin-bottom: 18px;
        }
        .usp-icon {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          color: #7AB54E;
          background: rgba(155,203,108,0.14);
          transition: background-color .35s ease, color .35s ease, transform .45s cubic-bezier(.34,1.56,.64,1);
        }
        .usp-card:hover .usp-icon {
          background: ${GREEN};
          color: #FFFFFF;
          transform: rotate(-8deg) scale(1.06);
        }
        /* pulserende ring achter het icoon */
        .usp-ring {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          border: 2px solid rgba(155,203,108,0.55);
          animation: usp-pulse 2.8s cubic-bezier(.22,1,.36,1) infinite;
        }
        .usp-card--daken .usp-ring { animation-delay: .9s; }
        .usp-card--regio .usp-ring { animation-delay: 1.8s; }
        @keyframes usp-pulse {
          0%   { transform: scale(1);    opacity: .7; }
          70%  { transform: scale(1.45); opacity: 0;  }
          100% { transform: scale(1.45); opacity: 0;  }
        }

        .usp-title {
          font-family: var(--font-montserrat), system-ui, sans-serif;
          color: #1A1A1A;
          font-size: 1.125rem;
          font-weight: 800;
          letter-spacing: -0.028em;
          line-height: 1.25;
          margin-bottom: 8px;
        }
        .usp-num {
          color: #7AB54E;
          font-variant-numeric: tabular-nums;
        }
        .usp-label {
          color: #545454;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.5;
          font-family: var(--font-inter), system-ui, sans-serif;
        }
        .usp-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
        }
        .usp-chip {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 500;
          color: #1A1A1A;
          background: #F7F8F6;
          border: 1px solid #E5E7EB;
          transition: background-color .25s ease, border-color .25s ease;
        }
        .usp-card:hover .usp-chip {
          background: rgba(155,203,108,0.12);
          border-color: rgba(155,203,108,0.45);
        }

        @media (max-width: 860px) {
          .usp-grid { gap: 14px; }
          .usp-card { padding: 26px 16px 22px; }
          .usp-title { font-size: 1rem; }
        }
        @media (max-width: 640px) {
          .usp-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 8px 0;
          }
          .usp-card {
            flex-direction: row;
            align-items: center;
            text-align: left;
            gap: 16px;
            padding: 18px 18px;
          }
          .usp-card::after { left: 0; width: 3px; height: 100%; bottom: auto; top: 0;
                             border-radius: 0 3px 3px 0; transform: scaleY(0); }
          .usp-card:hover::after { transform: scaleY(0.5); }
          .usp-card:hover { transform: translateY(-3px); }
          .usp-icon-wrap { width: 52px; height: 52px; margin-bottom: 0; flex-shrink: 0; }
          .usp-icon { border-radius: 14px; }
          .usp-ring { border-radius: 14px; }
          .usp-chips { justify-content: flex-start; gap: 5px; }
          .usp-chip { padding: 3px 9px; font-size: 12px; }
          .usp-title { margin-bottom: 4px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .usp-ring { animation: none; opacity: 0; }
          .usp-card, .usp-card::before, .usp-card::after, .usp-icon { transition: none; }
          .usp-card:hover, .usp-card:hover .usp-icon { transform: none; }
        }
      `}</style>

      <div className="site-wrap">
        <motion.div
          className="usp-grid"
          variants={container}
          initial={reduce ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((s) => (
            /* motion-wrapper voor de entree, binnenste div voor hover (anders overschrijft framer de CSS transform) */
            <motion.div key={s.key} variants={card} style={{ display: "flex" }}>
              <div className={`usp-card usp-card--${s.key}`}>
                <div className="usp-icon-wrap" aria-hidden="true">
                  <span className="usp-ring" />
                  <motion.div variants={iconPop} style={{ width: "100%", height: "100%" }}>
                    <div className="usp-icon">{s.icon}</div>
                  </motion.div>
                </div>
                <div>
                  <p className="usp-title">{s.title}</p>
                  <div className="usp-label">{s.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
