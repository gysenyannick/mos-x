import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { faqGroups } from "@/lib/faq";
import { faqSchema, kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Veelgestelde vragen over dakreiniging en dakcoating",
  description:
    "Antwoorden op de meest gestelde vragen over dakontmossing, dakreiniging en dakcoating: prijs, werkwijze, garantie, zonnepanelen en wat je zelf moet voorzien.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "Veelgestelde vragen over dakreiniging en dakcoating | MOS-X", description: "Antwoorden op de meest gestelde vragen over dakontmossing, dakreiniging en dakcoating: prijs, werkwijze, garantie, zonnepanelen en wat je zelf moet voorzien.", url: "/faq" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[faqSchema(faqGroups.flatMap((g) => g.items)), kruimelSchema([["Veelgestelde vragen", "/faq"]])]} />
      {children}
    </>
  );
}
