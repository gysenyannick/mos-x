import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { dienstSchema, kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dakontmossing met 2 jaar mosvrij-garantie",
  description:
    "Professionele dakontmossing en dakreiniging door MOS-X, met antimosbehandeling en 2 jaar mosvrij-garantie. Actief in Antwerpen, Oost-Vlaanderen, Vlaams-Brabant en Limburg.",
  alternates: { canonical: "/diensten/dakontmossing" },
  openGraph: { title: "Dakontmossing met 2 jaar mosvrij-garantie | MOS-X", description: "Professionele dakontmossing en dakreiniging door MOS-X, met antimosbehandeling en 2 jaar mosvrij-garantie. Actief in Antwerpen, Oost-Vlaanderen, Vlaams-Brabant en Limburg.", url: "/diensten/dakontmossing", images: [{ url: "/images/Na%20bevel.jpg" }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[
        dienstSchema({ pad: "/diensten/dakontmossing", naam: "Dakontmossing", type: "Dakontmossing en dakreiniging", omschrijving: "Mos, algen en vervuiling verwijderen van je dak, gevolgd door een antimosbehandeling. Komt er binnen 2 jaar toch mos terug, dan brengen we gratis een nieuwe antimosbehandeling aan." }),
        kruimelSchema([["Diensten", "/diensten"], ["Dakontmossing", "/diensten/dakontmossing"]]),
      ]} />
      {children}
    </>
  );
}
