import type { Metadata } from "next";

// Geen gestructureerde data hier: deze layout omvat ook de dienstpagina's, die hun eigen kruimelpad hebben.
export const metadata: Metadata = {
  title: {
    default: "Diensten: dakontmossing, dakcoating en dakzorg",
    template: "%s | MOS-X",
  },
  description:
    "Alles wat MOS-X voor je dak doet: dakontmossing met 2 jaar mosvrij-garantie, dakcoating met 10 jaar garantie op de hechting en MOS-X Dakzorg voor preventief onderhoud.",
  alternates: { canonical: "/diensten" },
  openGraph: { title: "Diensten: dakontmossing, dakcoating en dakzorg | MOS-X", description: "Alles wat MOS-X voor je dak doet: dakontmossing met 2 jaar mosvrij-garantie, dakcoating met 10 jaar garantie op de hechting en MOS-X Dakzorg voor preventief onderhoud.", url: "/diensten" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
