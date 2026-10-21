import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays, Camera, ChevronRight, Clock, FileText, Link2, ListChecks, MessageCircle, ShieldCheck,
} from "lucide-react";
import PageLayout from "@/components/page-layout";

export const metadata: Metadata = {
  title: "Jouw klantenzone | MOS-X",
  description:
    "Elke klant van MOS-X krijgt een eigen pagina: de stand van je werken, je startdatum, werffoto's, offerte, factuur en garantie. Geen login, gewoon je eigen link.",
};

const GROEN = "#9BCB6C";
const GROEN_D = "#7AB54E";
const WA = "https://wa.me/32468352869";
const H = { fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.028em" } as const;

const wat = [
  { icoon: ListChecks, titel: "Waar je dak staat", tekst: "Aanvraag, gepland, aan het werk, klaar, nazorg. Je ziet in één oogopslag in welke stap je zit en wat er nog komt." },
  { icoon: CalendarDays, titel: "Je startdatum", tekst: "Ligt je dag vast, dan staat hij op je pagina. Nog niet helemaal zeker? Dan zie je al de week of de maand." },
  { icoon: Camera, titel: "Foto's van je dak", tekst: "Ik fotografeer je dak voor, tijdens en na de werken. Zo zie je het verschil, ook als je zelf niet thuis bent." },
  { icoon: FileText, titel: "Offerte en factuur", tekst: "Al je documenten bij elkaar, met wat al betaald is en wat nog openstaat. Downloaden wanneer het jou past." },
  { icoon: Clock, titel: "Afspraken verzetten", tekst: "Past een afspraak toch niet? Tot 48 uur vooraf kies je zelf een ander vrij moment. Geen gebel nodig." },
  { icoon: ShieldCheck, titel: "Je garantie", tekst: "2 jaar mosvrij na reiniging, 10 jaar op je coating. Je ziet precies tot wanneer je gedekt bent." },
];

const stappen = [
  { titel: "Je vraagt een offerte aan", tekst: "Via de website, telefonisch of via WhatsApp. Vanaf dan bestaat je dossier." },
  { titel: "Je krijgt je eigen link", tekst: "Ik stuur je via WhatsApp een link naar je persoonlijke pagina. Geen account, geen wachtwoord." },
  { titel: "Je volgt alles op", tekst: "Bij elke stap krijg je een berichtje. Alles wat je nodig hebt, staat op je pagina, ook jaren later nog." },
];

function Telefoon() {
  return (
    <div aria-hidden="true" style={{
      width: 280, maxWidth: "100%", margin: "0 auto", borderRadius: 36, padding: 10, background: "#111",
      boxShadow: "0 30px 80px -20px rgba(0,0,0,.45)",
    }}>
      <div style={{ borderRadius: 28, overflow: "hidden", background: "#F7F8F6" }}>
        <div style={{ background: "#1A1A1A", color: "#fff", padding: "34px 18px 18px",
          backgroundImage: "radial-gradient(120% 140% at 100% 0%, rgba(155,203,108,.3) 0%, rgba(155,203,108,0) 55%)" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>Goedemorgen Jan,</div>
          <div style={{ ...H, fontSize: 20, lineHeight: 1.1, margin: "4px 0 10px" }}>Zo staat het met <span style={{ color: GROEN }}>je dak</span>.</div>
          <span style={{ fontSize: 11, background: GROEN, borderRadius: 99, padding: "4px 10px", fontWeight: 600 }}>● Gepland</span>
        </div>
        <div style={{ padding: 12, display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", borderRadius: 12, padding: "10px 8px" }}>
            {["Aanvraag", "Gepland", "Werk", "Klaar"].map((s, i) => (
              <div key={s} style={{ textAlign: "center", fontSize: 9, color: i <= 1 ? "#1A1A1A" : "#999", flex: 1 }}>
                <div style={{ width: 18, height: 18, borderRadius: 99, margin: "0 auto 4px", display: "grid", placeItems: "center", fontSize: 9,
                  background: i < 1 ? GROEN : "#fff", color: i < 1 ? "#fff" : i === 1 ? GROEN_D : "#999",
                  border: `2px solid ${i <= 1 ? GROEN : "#E5E7EB"}` }}>{i < 1 ? "✓" : i + 1}</div>
                {s}
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".08em", color: "#545454", textTransform: "uppercase" }}>Startdatum</div>
            <div style={{ ...H, fontSize: 15, marginTop: 2 }}>Maandag 12 oktober</div>
            <div style={{ fontSize: 10, color: "#545454", marginTop: 2 }}>Nog 5 dagen</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".08em", color: "#545454", textTransform: "uppercase", marginBottom: 6 }}>Werffoto&apos;s</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {["/images/Before%20bevel.jpg", "/images/Antimos%20op%20dak.jpg", "/images/Betonpannen.jpg"].map((src) => <img key={src} src={src} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 6 }} />)}
            </div>
          </div>
          <div style={{ background: "#25D366", color: "#fff", borderRadius: 12, padding: 10, textAlign: "center", fontSize: 11, fontWeight: 700 }}>
            Vraag? Stuur Yannick een WhatsApp
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KlantenzoneInfo() {
  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section style={{ background: "#F7F8F6", padding: "140px 0 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 60% at 85% 20%, rgba(155,203,108,0.14) 0%, rgba(155,203,108,0) 70%)" }} />
        <div className="site-wrap" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <p style={{ color: GROEN_D, fontWeight: 600, fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase", margin: "0 0 14px" }}>Nieuw bij MOS-X</p>
            <h1 style={{ ...H, fontSize: "clamp(2.2rem, 5vw, 3.6rem)", lineHeight: 1.05, color: "#1A1A1A", margin: "0 0 18px" }}>
              Volg je dak op, <span style={{ color: GROEN }}>vanuit je zetel.</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "#545454", maxWidth: 520, margin: "0 0 28px" }}>
              Elke klant krijgt een eigen pagina: waar je werken staan, wanneer ik kom, foto&apos;s van je dak, je offerte, factuur en garantie.
              Geen login, geen wachtwoord. Gewoon je eigen link.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link href="/#calculator" className="kz-cta" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GROEN, color: "#fff", borderRadius: 8, padding: "14px 26px", fontWeight: 700, fontFamily: H.fontFamily, textDecoration: "none" }}>
                Bereken mijn richtprijs <ChevronRight size={16} />
              </Link>
              <a href={`${WA}?text=${encodeURIComponent("Hallo Yannick, ik ben al klant. Kan je me de link naar mijn klantenzone sturen?")}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#1A1A1A", borderRadius: 8, padding: "14px 22px", fontWeight: 700, fontFamily: H.fontFamily, textDecoration: "none" }}>
                <Link2 size={16} /> Al klant? Vraag je link op
              </a>
            </div>
          </div>
          <Telefoon />
        </div>
      </section>

      {/* ── Wat je ziet ── */}
      <section style={{ background: "#fff", padding: "90px 0" }}>
        <div className="site-wrap">
          <h2 style={{ ...H, fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", color: "#1A1A1A", margin: "0 0 10px", textAlign: "center" }}>
            Alles over je dak, <span style={{ color: GROEN }}>op één pagina.</span>
          </h2>
          <p style={{ textAlign: "center", color: "#545454", fontSize: 17, maxWidth: 560, margin: "0 auto 44px" }}>
            Je pagina groeit mee: van je eerste aanvraag tot de nazorg, jaren na de werken.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 18 }}>
            {wat.map(({ icoon: Icoon, titel, tekst }) => (
              <div key={titel} style={{ borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", padding: 24, background: "#fff" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#EEF6E6", color: GROEN_D, display: "grid", placeItems: "center", marginBottom: 14 }}><Icoon size={22} /></div>
                <h3 style={{ ...H, fontSize: 18, margin: "0 0 6px", color: "#1A1A1A" }}>{titel}</h3>
                <p style={{ color: "#545454", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zo werkt het ── */}
      <section style={{ background: "#F7F8F6", padding: "90px 0" }}>
        <div className="site-wrap">
          <h2 style={{ ...H, fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", color: "#1A1A1A", margin: "0 0 44px", textAlign: "center" }}>
            Zo werkt het
          </h2>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {stappen.map((s, i) => (
              <li key={s.titel} style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
                <div style={{ ...H, width: 40, height: 40, borderRadius: 99, background: GROEN, color: "#fff", display: "grid", placeItems: "center", marginBottom: 14 }}>{i + 1}</div>
                <h3 style={{ ...H, fontSize: 18, margin: "0 0 6px", color: "#1A1A1A" }}>{s.titel}</h3>
                <p style={{ color: "#545454", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{s.tekst}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── WhatsApp ── */}
      <section style={{ background: "#fff", padding: "90px 0" }}>
        <div className="site-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <h2 style={{ ...H, fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", color: "#1A1A1A", margin: "0 0 14px" }}>
              Eén nummer. <span style={{ color: GROEN }}>En je krijgt mij.</span>
            </h2>
            <p style={{ color: "#545454", fontSize: 17, lineHeight: 1.6, margin: "0 0 24px" }}>
              Geen callcenter, geen doorverbinden. Een vraag over je offerte, je planning of een foto van je dak? Stuur een WhatsApp naar hetzelfde nummer en je krijgt antwoord van Yannick zelf.
            </p>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", borderRadius: 8, padding: "14px 24px", fontWeight: 700, fontFamily: H.fontFamily, textDecoration: "none" }}>
              <MessageCircle size={18} /> Stuur me een berichtje
            </a>
            <p style={{ color: "#545454", fontSize: 14, marginTop: 12 }}>Liever bellen? <a href="tel:+32468352869" style={{ color: "#1A1A1A", fontWeight: 600 }}>+32 468 35 28 69</a></p>
          </div>
          <div aria-hidden="true" style={{ background: "#ECE5DD", borderRadius: 20, padding: 20, display: "grid", gap: 10, maxWidth: 420, width: "100%", justifySelf: "center" }}>
            <div style={{ justifySelf: "end", background: "#DCF8C6", borderRadius: "14px 14px 4px 14px", padding: "10px 12px", fontSize: 14, maxWidth: "85%" }}>
              Hallo Yannick, weet je al wanneer je komt? <span style={{ fontSize: 11, color: "#7a8a6e", marginLeft: 6 }}>09:41</span>
            </div>
            <div style={{ justifySelf: "start", background: "#fff", borderRadius: "14px 14px 14px 4px", padding: "10px 12px", fontSize: 14, maxWidth: "85%" }}>
              Dag Jan! Ik kom maandag 12 oktober om 8u. Op je pagina zie je alles staan, ook de foto&apos;s zodra ik begin. 👍 <span style={{ fontSize: 11, color: "#999", marginLeft: 6 }}>09:43</span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
