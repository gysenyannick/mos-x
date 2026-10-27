import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageLayout from "@/components/page-layout";
import JsonLd from "@/components/json-ld";
import KennisbankKaart from "@/components/kennisbank-kaart";
import { KENNISBANK_CSS } from "@/components/kennisbank-stijl";
import { ARTIKELS, CATEGORIEEN, artikelVoor, type Artikel } from "@/lib/kennisbank";
import { SITE, faqSchema, kruimelSchema } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTIKELS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = artikelVoor((await params).slug);
  if (!a) return {};
  return {
    title: a.seoTitel,
    description: a.omschrijving,
    alternates: { canonical: `/kennisbank/${a.slug}` },
    openGraph: { type: "article", title: `${a.seoTitel} | MOS-X`, description: a.omschrijving, url: `/kennisbank/${a.slug}`, images: [{ url: encodeURI(a.beeld) }] },
  };
}

const CTA: Record<Artikel["cta"], { titel: string; tekst: string; knoppen: [string, string][] }> = {
  ontmossen: {
    titel: "Je dak laten ontmossen?",
    tekst: "Met antimosbehandeling en 2 jaar mosvrij-garantie. Het plaatsbezoek is gratis en vrijblijvend.",
    knoppen: [["Bereken je richtprijs", "/#calculator"], ["Meer over dakontmossing", "/diensten/dakontmossing"]],
  },
  coaten: {
    titel: "Je dak opnieuw als nieuw?",
    tekst: "Een coating geeft je dak zijn kleur en beschermlaag terug, met 10 jaar garantie op de hechting.",
    knoppen: [["Bereken je richtprijs", "/#calculator"], ["Zie je dak in een nieuwe kleur", "/#dakkleur"]],
  },
  dakzorg: {
    titel: "Je dak proper houden?",
    tekst: "Met MOS-X Dakzorg behandelen we je dak preventief tegen mos en controleren we meteen je hele dak.",
    knoppen: [["Ontdek MOS-X Dakzorg", "/diensten/mos-x-dakzorg"], ["Bereken je richtprijs", "/#calculator"]],
  },
  asbest: {
    titel: "Twijfel je over asbest?",
    tekst: "Met onze gratis checklist ga je zelf na of je dak asbest kan bevatten. Asbestvrij? Dan helpen we je graag verder.",
    knoppen: [["Download de checklist", "/downloads/MOS-X-asbestchecklist.pdf"], ["Bereken je richtprijs", "/#calculator"]],
  },
};

export default async function KennisbankArtikel({ params }: Props) {
  const a = artikelVoor((await params).slug);
  if (!a) notFound();
  const categorie = CATEGORIEEN.find((c) => c.id === a.categorie)!;
  const verwant = a.verwant.map(artikelVoor).filter((x): x is Artikel => !!x);
  const cta = CTA[a.cta];
  const url = `${SITE}/kennisbank/${a.slug}`;

  return (
    <PageLayout>
      <style>{KENNISBANK_CSS}</style>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.titel,
            description: a.omschrijving,
            image: `${SITE}${encodeURI(a.beeld)}`,
            url,
            mainEntityOfPage: url,
            inLanguage: "nl-BE",
            author: { "@id": `${SITE}/#bedrijf` },
            publisher: { "@id": `${SITE}/#bedrijf` },
          },
          kruimelSchema([["Kennisbank", "/kennisbank"], [a.titel, `/kennisbank/${a.slug}`]]),
          ...(a.faq ? [faqSchema(a.faq)] : []),
        ]}
      />
      <header className="kb-kop">
        <div className="kb-kop-in">
          <nav className="kb-kruimel" aria-label="Kruimelpad">
            <Link href="/">Home</Link><span aria-hidden="true">›</span>
            <Link href="/kennisbank">Kennisbank</Link><span aria-hidden="true">›</span>
            <span>{categorie.naam}</span>
          </nav>
          <p className="kb-oog">{categorie.naam}</p>
          <h1>{a.titel}</h1>
          <p className="kb-intro">{a.intro}</p>
        </div>
      </header>

      <div className="kb-raster">
        <article className="kb-tekst">
          <img className="kb-beeld" src={encodeURI(a.beeld)} alt={a.beeldAlt} />
          {a.secties.map((s) => (
            <section key={s.kop}>
              <h2>{s.kop}</h2>
              {s.tekst.map((t) => <p key={t}>{t}</p>)}
              {s.lijst && <ul>{s.lijst.map((l) => <li key={l}>{l}</li>)}</ul>}
            </section>
          ))}
          {a.faq && (
            <section className="kb-faq">
              <h2>Veelgestelde vragen</h2>
              {a.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </section>
          )}
        </article>

        <aside className="kb-cta">
          <p className="kb-oog">MOS-X</p>
          <b>{cta.titel}</b>
          <p>{cta.tekst}</p>
          {cta.knoppen.map(([label, href], i) => (
            href.endsWith(".pdf")
              ? <a key={href} href={href} download className={`kb-knop ${i === 0 ? "kb-knop-g" : "kb-knop-l"}`}>{label}</a>
              : <Link key={href} href={href} className={`kb-knop ${i === 0 ? "kb-knop-g" : "kb-knop-l"}`}>{label}</Link>
          ))}
        </aside>
      </div>

      {verwant.length > 0 && (
        <section className="kb-verwant" aria-labelledby="verwant">
          <h2 id="verwant">Lees ook</h2>
          <div className="kb-kaarten">
            {verwant.map((v) => <KennisbankKaart key={v.slug} artikel={v} />)}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
