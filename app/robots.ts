import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

const PRIVE = ["/beheer", "/klant/", "/buur/", "/api/"];

/** Zoekmachines en AI-assistenten mogen de openbare site lezen, nooit de klantenzone of het beheer. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVE },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot"],
        allow: "/",
        disallow: PRIVE,
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
