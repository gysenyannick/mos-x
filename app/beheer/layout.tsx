import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import BeheerNav from "@/components/klantenzone/beheer-nav";
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
        <div className={kz.topbarIn} style={{ maxWidth: 1180, margin: "0 auto", padding: "0 16px" }}>
          <Link href="/beheer" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.avif" alt="MOS-X" className={kz.logo} />
            <span className={kz.topLabel}>Beheer</span>
          </Link>
          <form action={logout} className={kz.alleenMobiel}>
            <button className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`} aria-label="Uitloggen"><LogOut size={15} /></button>
          </form>
        </div>
      </header>
      <div className={kz.alleenMobiel}><BeheerNav compact /></div>
      <div className={kz.dash}>
        <aside className={kz.zijbalk}>
          <Link href="/beheer#nieuw" className={`${kz.knop} ${kz.knopPrimair} ${kz.zijKnop}`}><Plus size={18} /> Nieuwe klant</Link>
          <BeheerNav />
          <div className={kz.zijOnder}>
            <div className={kz.zijKlant}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/Yannick%20foto%20op%20dak.JPEG" alt="" className={kz.avatar} style={{ objectFit: "cover" }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className={kz.zijNaam}>Yannick Gysen</p>
                <p className={kz.zijAdres}>MOS-X</p>
              </div>
              <form action={logout}>
                <button className={kz.icoonKnop} aria-label="Uitloggen" title="Uitloggen"><LogOut size={16} /></button>
              </form>
            </div>
          </div>
        </aside>
        <div className={kz.inhoud}>{children}</div>
      </div>
    </main>
  );
}
