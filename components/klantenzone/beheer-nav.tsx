"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarClock, Gift, Settings, Tag, Users } from "lucide-react";
import kz from "./kz.module.css";

const ITEMS = [
  { href: "/beheer", label: "Klanten", icoon: Users },
  { href: "/beheer/momenten", label: "Vrije momenten", icoon: CalendarClock },
  { href: "/beheer/acties", label: "Acties", icoon: Tag },
  { href: "/beheer/doorverwijzingen", label: "Burenvoordeel", icoon: Gift },
  { href: "/beheer/cijfers", label: "Cijfers", icoon: BarChart3 },
  { href: "/beheer/instellingen", label: "Instellingen", icoon: Settings },
];

/** Menu van het beheer; "Klanten" blijft actief ook binnen een klantdossier. */
export default function BeheerNav({ compact }: { compact?: boolean }) {
  const pad = usePathname() ?? "";
  const actief = (href: string) =>
    href === "/beheer" ? pad === "/beheer" || /^\/beheer\/(?!momenten|instellingen|acties|doorverwijzingen|cijfers)/.test(pad) : pad.startsWith(href);

  if (compact) {
    return (
      <nav className={kz.mobielNav} aria-label="Beheer">
        {ITEMS.map((i) => (
          <Link key={i.href} href={i.href} className={`${kz.mobielNavItem} ${actief(i.href) ? kz.mobielNavAan : ""}`} aria-current={actief(i.href) ? "page" : undefined}>
            <i.icoon size={16} /> {i.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Beheer">
      <ul className={kz.navLijst}>
        {ITEMS.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className={`${kz.navItem} ${actief(i.href) ? kz.navItemAan : ""}`} aria-current={actief(i.href) ? "page" : undefined}>
              <i.icoon size={18} /> {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
