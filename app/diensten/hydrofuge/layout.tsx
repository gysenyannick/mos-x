import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { dienstSchema, kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MOS-PLUS hydrofuge voor nieuwere daken",
  description:
    "MOS-PLUS: dakreiniging en een kleurloze hydrofuge die je dakpannen waterafstotend maakt. Voor nieuwere daken in goede staat, gaat 5 à 7 jaar mee, met 5 jaar garantie op de werking.",
  alternates: { canonical: "/diensten/hydrofuge" },
  openGraph: {
    title: "MOS-PLUS hydrofuge voor nieuwere daken | MOS-X",
    description: "Dakreiniging en een kleurloze hydrofuge die je dakpannen waterafstotend maakt. Gaat 5 à 7 jaar mee, met 5 jaar garantie op de werking.",
    url: "/diensten/hydrofuge",
    images: [{ url: "/images/hydrofuge-poster.jpg" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[
        dienstSchema({ pad: "/diensten/hydrofuge", naam: "MOS-PLUS hydrofuge", type: "Hydrofuge dakpannen", omschrijving: "Dakreiniging gevolgd door een kleurloze, waterafstotende behandeling van de dakpannen. Voor nieuwere daken in goede staat, 5 jaar garantie op de werking." }),
        kruimelSchema([["Diensten", "/#diensten"], ["MOS-PLUS", "/diensten/hydrofuge"]]),
      ]} />
      {children}
    </>
  );
}
