import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { ARTIKELS, KENNISBANK_ONLINE } from "@/lib/kennisbank";

/** Alle openbare pagina's voor Google. De klantenzone en het beheer staan er bewust niet in. */
export default function sitemap(): MetadataRoute.Sitemap {
  const nu = new Date();
  const pagina = (pad: string, prioriteit: number, frequentie: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${SITE}${pad}`,
    lastModified: nu,
    changeFrequency: frequentie,
    priority: prioriteit,
  });
  return [
    pagina("/", 1, "weekly"),
    pagina("/diensten/dakontmossing", 0.9),
    pagina("/diensten/dakcoating", 0.9),
    pagina("/diensten/onderhoudsplan", 0.8),
    pagina("/diensten", 0.7),
    pagina("/realisaties", 0.8, "weekly"),
    pagina("/over-ons", 0.6),
    pagina("/contact", 0.7),
    pagina("/faq", 0.6),
    pagina("/regio/antwerpen", 0.7),
    pagina("/regio/oost-vlaanderen", 0.7),
    pagina("/regio/vlaams-brabant", 0.7),
    pagina("/regio/limburg", 0.7),
    ...(KENNISBANK_ONLINE ? [pagina("/kennisbank", 0.7, "weekly"), ...ARTIKELS.map((a) => pagina(`/kennisbank/${a.slug}`, 0.6))] : []),
    pagina("/klantenzone", 0.4),
    pagina("/privacyverklaring", 0.2, "yearly"),
    pagina("/algemene-voorwaarden", 0.2, "yearly"),
  ];
}
