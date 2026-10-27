import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact en gratis plaatsbezoek",
  description:
    "Neem contact op met MOS-X voor een gratis plaatsbezoek of een vraag over je dak. Bel of WhatsApp +32 468 35 28 69, maandag tot zaterdag van 8 tot 17 uur.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact en gratis plaatsbezoek | MOS-X", description: "Neem contact op met MOS-X voor een gratis plaatsbezoek of een vraag over je dak. Bel of WhatsApp +32 468 35 28 69, maandag tot zaterdag van 8 tot 17 uur.", url: "/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={kruimelSchema([["Contact", "/contact"]])} />
      {children}
    </>
  );
}
