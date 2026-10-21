import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, LogOut, Settings, Users } from "lucide-react";
import { beheerActief, isBeheerder } from "@/lib/klantenzone/auth";
import { LoginForm } from "@/components/klantenzone/beheer-client";
import { logout } from "./actions";
import kz from "@/components/klantenzone/kz.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beheer klantenzone | MOS-X",
  robots: { index: false, follow: false },
};

export default async function BeheerLayout({ children }: { children: React.ReactNode }) {
  if (!beheerActief()) {
    return (
      <main className={kz.page}>
        <div className={kz.wrap}>
          <p className={kz.melding} style={{ marginTop: 80 }}>
            Het beheer is nog niet actief. Zet in Vercel een geheime instelling <strong>ADMIN_PASSWORD</strong> met je wachtwoord.
          </p>
        </div>
      </main>
    );
  }

  if (!(await isBeheerder())) {
    return <main className={kz.page}><div className={kz.wrap}><LoginForm /></div></main>;
  }

  return (
    <main className={kz.page} style={{ paddingBottom: 60 }}>
      <header className={kz.topbar}>
        <div className={`${kz.wrapBreed} ${kz.topbarIn}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Link href="/beheer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.avif" alt="MOS-X" className={kz.logo} />
            </Link>
            <nav style={{ display: "flex", gap: 6 }}>
              <Link href="/beheer" className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`}><Users size={15} /> <span className={kz.verbergMobiel}>Klanten</span></Link>
              <Link href="/beheer/momenten" className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`}><CalendarClock size={15} /> <span className={kz.verbergMobiel}>Vrije momenten</span></Link>
              <Link href="/beheer/instellingen" className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`}><Settings size={15} /> <span className={kz.verbergMobiel}>Instellingen</span></Link>
            </nav>
          </div>
          <form action={logout}>
            <button className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`} aria-label="Uitloggen"><LogOut size={15} /></button>
          </form>
        </div>
      </header>
      <div className={kz.wrapBreed}>{children}</div>
    </main>
  );
}
