import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { dienstSchema, kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MOS-X Onderhoudsplan: preventief dakonderhoud",
  description:
    "Houd je gereinigde dak mosvrij met het MOS-X Onderhoudsplan: een preventieve antimosbehandeling met volledige dakcontrole en rapport. Vanaf €250 per onderhoudsbeurt.",
  alternates: { canonical: "/diensten/onderhoudsplan" },
  openGraph: { title: "MOS-X Onderhoudsplan: preventief dakonderhoud | MOS-X", description: "Houd je gereinigde dak mosvrij met het MOS-X Onderhoudsplan: een preventieve antimosbehandeling met volledige dakcontrole en rapport. Vanaf €250 per onderhoudsbeurt.", url: "/diensten/onderhoudsplan" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[
        dienstSchema({ pad: "/diensten/onderhoudsplan", naam: "MOS-X Onderhoudsplan", type: "Dakonderhoud", omschrijving: "Preventieve antimosbehandeling voor een dak dat al gereinigd is, met volledige dakcontrole, controle van dakgoten en afvoer en een rapport in je klantenzone.", prijsVanaf: 250 }),
        kruimelSchema([["Diensten", "/diensten"], ["MOS-X Onderhoudsplan", "/diensten/onderhoudsplan"]]),
      ]} />
      {children}
    </>
  );
}
