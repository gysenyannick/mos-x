import Link from "next/link";
import type { Artikel } from "@/lib/kennisbank";

export default function KennisbankKaart({ artikel }: { artikel: Artikel }) {
  return (
    <Link href={`/kennisbank/${artikel.slug}`} className="kb-kaart">
      <img src={encodeURI(artikel.beeld)} alt={artikel.beeldAlt} loading="lazy" />
      <div>
        <b>{artikel.titel}</b>
        <small>{artikel.omschrijving}</small>
        <em>Lees meer →</em>
      </div>
    </Link>
  );
}
