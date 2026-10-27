import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { dienstSchema, kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MOS-X Dakzorg: preventief dakonderhoud",
  description:
    "Houd je gereinigde dak mosvrij met MOS-X Dakzorg: een preventieve antimosbehandeling met volledige dakcontrole en rapport. Vanaf €250 per onderhoudsbeurt.",
  alternates: { canonical: "/diensten/mos-x-dakzorg" },
  openGraph: { title: "MOS-X Dakzorg: preventief dakonderhoud | MOS-X", description: "Houd je gereinigde dak mosvrij met MOS-X Dakzorg: een preventieve antimosbehandeling met volledige dakcontrole en rapport. Vanaf €250 per onderhoudsbeurt.", url: "/diensten/mos-x-dakzorg" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[
        dienstSchema({ pad: "/diensten/mos-x-dakzorg", naam: "MOS-X Dakzorg", type: "Dakonderhoud", omschrijving: "Preventieve antimosbehandeling voor een dak dat al gereinigd is, met volledige dakcontrole, controle van dakgoten en afvoer en een rapport in je klantenzone.", prijsVanaf: 250 }),
        kruimelSchema([["Diensten", "/diensten"], ["MOS-X Dakzorg", "/diensten/mos-x-dakzorg"]]),
      ]} />
      {children}
    </>
  );
}
