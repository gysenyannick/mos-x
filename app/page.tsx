import SiteNav             from "@/components/site-nav";
import SiteHero            from "@/components/site-hero";
import SiteTrustBar        from "@/components/site-trustbar";
import SiteServices        from "@/components/site-services";
import SiteKlantenzone     from "@/components/site-klantenzone";
import SitePricing         from "@/components/site-pricing";
import SiteStatsBar              from "@/components/site-statsbar";
import SiteRealisatiesPreview   from "@/components/site-realisaties-preview";
import SiteAboutYannick         from "@/components/site-about-yannick";
import SiteWerkgebied      from "@/components/site-werkgebied";
import SiteReviews         from "@/components/site-reviews";
import SiteWerkwijze       from "@/components/site-werkwijze";
import SiteFaq             from "@/components/site-faq";
import SiteDakkleurBanner  from "@/components/site-dakkleur-banner";
import SiteContact         from "@/components/site-contact";
import SiteFooter          from "@/components/site-footer";
import type { Metadata }   from "next";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      {/* Announcement bar + white navbar */}
      <SiteNav />

      <main>
        {/* 1 · Hero */}
        <SiteHero />

        {/* 3 · Richtprijscalculator */}
        <SitePricing />

        {/* USP stats balk */}
        <SiteStatsBar />

        {/* Voor/Na realisaties preview */}
        <SiteRealisatiesPreview />

        {/* 4 · Klantbeoordelingen */}
        <SiteReviews />

        {/* 5 · Wie is Yannick? */}
        <SiteAboutYannick />

        {/* 6 · Diensten */}
        <SiteServices />

        {/* Klantenzone */}
        <SiteKlantenzone />

        {/* 7 · Zo werken we */}
        <SiteWerkwijze />

        {/* Dakkleur-tool */}
        <SiteDakkleurBanner />

        {/* 8 · FAQ */}
        <SiteFaq />

        {/* 9 · CTA kaart */}
        <SiteContact />
      </main>

      {/* Footer */}
      <SiteFooter />
    </>
  );
}
