import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Leer MOS-X kennen: specialist in dakontmossing en dakcoating, opgericht door Yannick Gysen. Eerlijk advies, een duidelijke prijs vooraf en werk met garantie.",
  alternates: { canonical: "/over-ons" },
  openGraph: { title: "Over ons | MOS-X", description: "Leer MOS-X kennen: specialist in dakontmossing en dakcoating, opgericht door Yannick Gysen. Eerlijk advies, een duidelijke prijs vooraf en werk met garantie.", url: "/over-ons" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={kruimelSchema([["Over ons", "/over-ons"]])} />
      {children}
    </>
  );
}
