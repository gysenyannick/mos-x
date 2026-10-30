import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { kruimelSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Zakelijk: dakontmossing en dakcoating voor bedrijven en syndici",
  description:
    "MOS-X voor bedrijven, syndici en vastgoedbeheerders: dakontmossing, dakcoating en onderhoud van bedrijfspanden en appartementsgebouwen. Offerte op maat per gebouw, factuur op firma.",
  alternates: { canonical: "/zakelijk" },
  openGraph: { title: "Zakelijk | MOS-X", description: "Dakontmossing, dakcoating en onderhoud voor bedrijven, syndici en vastgoedbeheerders. Offerte op maat per gebouw, factuur op firma.", url: "/zakelijk" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[kruimelSchema([["Zakelijk", "/zakelijk"]])]} />
      {children}
    </>
  );
}
