import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { dienstSchema, kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dakcoating met 10 jaar garantie op de hechting",
  description:
    "Geef je dak opnieuw een beschermlaag en kleur met een dakcoating van MOS-X. Voor betonpannen en kunstleien, meestal in 1 dag klaar, met 10 jaar garantie op de hechting.",
  alternates: { canonical: "/diensten/dakcoating" },
  openGraph: { title: "Dakcoating met 10 jaar garantie op de hechting | MOS-X", description: "Geef je dak opnieuw een beschermlaag en kleur met een dakcoating van MOS-X. Voor betonpannen en kunstleien, meestal in 1 dag klaar, met 10 jaar garantie op de hechting.", url: "/diensten/dakcoating", images: [{ url: "/images/Na%20bevel.jpg" }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[
        dienstSchema({ pad: "/diensten/dakcoating", naam: "Dakcoating", type: "Dakcoating", omschrijving: "Grondige dakreiniging gevolgd door twee lagen watergedragen dakcoating, voor betonpannen en kunstleien. 10 jaar garantie op de hechting." }),
        kruimelSchema([["Diensten", "/diensten"], ["Dakcoating", "/diensten/dakcoating"]]),
      ]} />
      {children}
    </>
  );
}
