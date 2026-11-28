import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { dienstSchema, kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MOS-CLEAN dakreiniging en dakontmossing",
  description:
    "Professionele dakreiniging en dakontmossing door MOS-X: aangepaste druk, altijd een antimosbehandeling en een vaste prijs na een gratis plaatsbezoek. Actief in Antwerpen, Limburg en Vlaams-Brabant.",
  alternates: { canonical: "/diensten/dakontmossing" },
  openGraph: { title: "MOS-CLEAN dakreiniging en dakontmossing | MOS-X", description: "Professionele dakreiniging en dakontmossing door MOS-X: aangepaste druk, altijd een antimosbehandeling en een vaste prijs na een gratis plaatsbezoek. Actief in Antwerpen, Limburg en Vlaams-Brabant.", url: "/diensten/dakontmossing", images: [{ url: "/images/Na%20bevel.jpg" }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[
        dienstSchema({ pad: "/diensten/dakontmossing", naam: "Dakontmossing", type: "Dakontmossing en dakreiniging", omschrijving: "Mos, algen en vervuiling verwijderen van je dak, gevolgd door een antimosbehandeling. Werkwijze aangepast aan het type dak, met een vaste prijs na een gratis plaatsbezoek." }),
        kruimelSchema([["Diensten", "/#diensten"], ["Dakontmossing", "/diensten/dakontmossing"]]),
      ]} />
      {children}
    </>
  );
}
