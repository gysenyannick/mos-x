import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKlant } from "@/lib/klantenzone/store";
import { effectief } from "@/lib/klantenzone/auto";
import { volgendeControle } from "@/lib/klantenzone/onderhoud";
import { dakGegevens, dakfoto, garantieRegels, onderhoudZinvol } from "@/lib/klantenzone/dak";
import { fmtKort, fmtMaand, hfd, vandaag } from "@/lib/klantenzone/tijd";
import PrintKnop from "@/components/klantenzone/print-knop";
import d from "./dossier.module.css";

export const metadata: Metadata = {
  title: "Dakdossier | MOS-X",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Dakdossier({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const ruw = await getKlant(token);
  if (!ruw) notFound();

  const k = effectief(ruw);
  const gegevens = dakGegevens(k);
  const foto = dakfoto(k);
  const werken = k.behandelingen ?? [];
  const garantie = garantieRegels(k);
  const punten = [
    ...(k.aanbevelingen ?? []).filter((a) => a.status === "open" || a.status === "aangevraagd").map((a) => a.titel),
    ...(k.paspoort?.aandachtspunten ?? "").split("\n").map((r) => r.trim()).filter(Boolean),
  ];
  const controle = onderhoudZinvol(k) ? volgendeControle(k) : null;
  const voor = k.fotos.find((f) => f.fase === "voor");
  const na = k.fotos.find((f) => f.fase === "na");
  const extra = voor && na ? [voor, na] : k.fotos.filter((f) => f.id !== foto?.id).slice(0, 4);

  return (
    <main className={d.scherm}>
      <div className={d.balk}>
        <Link href={`/klant/${k.id}?tab=dak`} className={d.terug}>Terug naar je klantenzone</Link>
        <PrintKnop className={d.knop}>Opslaan als PDF</PrintKnop>
      </div>

      <article className={d.blad}>
        <header className={d.kop}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.avif" alt="MOS-X" className={d.logo} />
          <div className={d.kopRechts}>
            <p>Opgemaakt op {fmtKort(vandaag())}</p>
          </div>
        </header>

        <div className={d.titelBlok}>
          <p className={d.eyebrow}>Dakdossier</p>
          <h1 className={d.titel}>{k.adres}</h1>
          <p className={d.sub}>{k.voornaam} {k.achternaam}</p>
        </div>

        <section className={`${d.deel} ${foto ? d.metFoto : ""}`}>
          {foto && (
            <figure className={d.hoofdfoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.url} alt="Het dak" />
              <figcaption>Foto van {fmtKort(foto.datum)}</figcaption>
            </figure>
          )}
          <div>
            <h2 className={d.kop2}>Het dak</h2>
            {gegevens.length > 0 ? (
              <table className={d.tabel}>
                <tbody>
                  {gegevens.map((g) => <tr key={g.label}><th>{g.label}</th><td>{g.waarde}</td></tr>)}
                </tbody>
              </table>
            ) : (
              <p className={d.tekst}>Nog geen gegevens.</p>
            )}
          </div>
        </section>

        {garantie.length > 0 && (
          <section className={d.deel}>
            <h2 className={d.kop2}>Garantie</h2>
            <table className={d.tabel}>
              <tbody>
                {garantie.map((g) => <tr key={g.titel}><th>{hfd(g.titel)}</th><td>{g.staat}</td></tr>)}
              </tbody>
            </table>
          </section>
        )}

        {werken.length > 0 && (
          <section className={d.deel}>
            <h2 className={d.kop2}>Uitgevoerde werken</h2>
            <table className={`${d.tabel} ${d.werken}`}>
              <thead><tr><th>Datum</th><th>Werk</th><th>Details</th></tr></thead>
              <tbody>
                {werken.map((w) => (
                  <tr key={w.id}>
                    <td>{fmtKort(w.datum)}</td>
                    <th>{w.soort}</th>
                    <td>{[w.producten, w.opmerking].filter(Boolean).join(" · ") || "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {(punten.length > 0 || controle) && (
          <section className={`${d.deel} ${d.tweeKol}`}>
            {punten.length > 0 && (
              <div>
                <h2 className={d.kop2}>Aandachtspunten</h2>
                <ul className={d.lijst}>{punten.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            )}
            {controle && (
              <div>
                <h2 className={d.kop2}>Volgend onderhoud</h2>
                <p className={d.groot}>{hfd(fmtMaand(controle.datum))}</p>
                <p className={d.tekst}>Aangeraden: een preventieve anti-mosbehandeling en een inspectie van het dak.</p>
              </div>
            )}
          </section>
        )}

        {extra.length > 0 && (
          <section className={d.deel}>
            <h2 className={d.kop2}>{voor && na ? "Voor en na" : "Foto's"}</h2>
            <div className={d.fotos}>
              {extra.map((f) => (
                <figure key={f.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt="" />
                  <figcaption>{f === voor && na ? "Voor" : f === na && voor ? "Na" : fmtKort(f.datum)}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <footer className={d.voet}>
          <span>MOS-X · dakreiniging en dakcoating</span>
          <span>+32 468 35 28 69 · info@mos-x.be · mos-x.be</span>
        </footer>
      </article>
    </main>
  );
}
