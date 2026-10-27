import type { Metadata } from "next";
import Link from "next/link";
import PageLayout from "@/components/page-layout";
import JsonLd from "@/components/json-ld";
import KennisbankKaart from "@/components/kennisbank-kaart";
import { KENNISBANK_CSS } from "@/components/kennisbank-stijl";
import { ARTIKELS, CATEGORIEEN } from "@/lib/kennisbank";
import { SITE, kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kennisbank: alles over mos, dakreiniging en dakcoating",
  description: "Uitleg en advies van MOS-X over mos en algen op je dak, ontmossen per daktype, dakcoating en het juiste moment om je dak te laten behandelen.",
  alternates: { canonical: "/kennisbank" },
  openGraph: { title: "Kennisbank | MOS-X", url: "/kennisbank" },
};

export default function Kennisbank() {
  return (
    <PageLayout>
      <style>{KENNISBANK_CSS}</style>
      <JsonLd
        data={[
          kruimelSchema([["Kennisbank", "/kennisbank"]]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Kennisbank van MOS-X",
            url: `${SITE}/kennisbank`,
            hasPart: ARTIKELS.map((a) => ({ "@type": "Article", headline: a.titel, url: `${SITE}/kennisbank/${a.slug}` })),
          },
        ]}
      />
      <header className="kb-kop">
        <div className="kb-kop-in">
          <nav className="kb-kruimel" aria-label="Kruimelpad">
            <Link href="/">Home</Link><span aria-hidden="true">›</span><span>Kennisbank</span>
          </nav>
          <p className="kb-oog">Kennisbank</p>
          <h1>Alles over mos, <span>dakreiniging en dakcoating.</span></h1>
          <p className="kb-intro">Wat groeit er op je dak, hoe pak je het aan en wanneer is het tijd? Eerlijke uitleg uit de praktijk, per onderwerp en per daktype.</p>
        </div>
      </header>

      {CATEGORIEEN.map((c) => {
        const lijst = ARTIKELS.filter((a) => a.categorie === c.id);
        // 4 per rij als dat netjes uitkomt, anders 3, zodat er geen kaart alleen op een rij staat.
        const kolommen = lijst.length % 3 !== 0 && lijst.length % 4 === 0 ? " vier" : "";
        return (
        <section key={c.id} className="kb-groep" aria-labelledby={`groep-${c.id}`}>
          <div className="kb-groep-kop">
            <div>
              <h2 id={`groep-${c.id}`}>{c.naam}</h2>
              <p>{c.uitleg}</p>
            </div>
          </div>
          <div className={`kb-kaarten${kolommen}`}>
            {lijst.map((a) => <KennisbankKaart key={a.slug} artikel={a} />)}
          </div>
        </section>
        );
      })}
    </PageLayout>
  );
}
