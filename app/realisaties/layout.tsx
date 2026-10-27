import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Realisaties: daken voor en na",
  description:
    "Bekijk voor- en nafoto's van daken die MOS-X ontmoste en coatte. Meer dan 150 afgewerkte daken in Antwerpen, Oost-Vlaanderen, Vlaams-Brabant en Limburg.",
  alternates: { canonical: "/realisaties" },
  openGraph: { title: "Realisaties: daken voor en na | MOS-X", description: "Bekijk voor- en nafoto's van daken die MOS-X ontmoste en coatte. Meer dan 150 afgewerkte daken in Antwerpen, Oost-Vlaanderen, Vlaams-Brabant en Limburg.", url: "/realisaties", images: [{ url: "/images/Na%20bevel.jpg" }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={kruimelSchema([["Realisaties", "/realisaties"]])} />
      {children}
    </>
  );
}
