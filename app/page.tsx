import SiteNav             from "@/components/site-nav";
import SiteHero            from "@/components/site-hero";
import SiteServices        from "@/components/site-services";
import SitePricing         from "@/components/site-pricing";
import SiteStatsBar              from "@/components/site-statsbar";
import SiteRealisatiesPreview   from "@/components/site-realisaties-preview";
import SiteAboutYannick         from "@/components/site-about-yannick";
import SiteReviews         from "@/components/site-reviews";
import SiteWerkwijze       from "@/components/site-werkwijze";
import SiteDakcheck        from "@/components/site-dakcheck";
import SiteVergelijking    from "@/components/site-vergelijking";
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
        {/* 1 · Hero: belofte + video */}
        <SiteHero />

        {/* 2 · Richtprijscalculator: belangrijkste conversie */}
        <SitePricing />

        {/* USP-balk: zekerheden net na de prijs */}
        <SiteStatsBar />

        {/* 3 · Klantbeoordelingen: bewijs op het twijfelmoment */}
        <SiteReviews />

        {/* 5 · Wie is Yannick? */}
        <SiteAboutYannick />

        {/* Vergelijking: MOS-X tegenover een gewone dakreiniger */}
        <SiteVergelijking />

        {/* 6 · Diensten */}
        <SiteServices />

        {/* Gratis dakcontrole: voor wie niet zeker is wat zijn dak nodig heeft */}
        <SiteDakcheck />


        {/* 8 · Zo werken we */}
        <SiteWerkwijze />


        {/* 9 · Voor/na realisaties: bewijs */}
        <SiteRealisatiesPreview />

        {/* Dakkleur-tool: speelse afsluiter na de resultaten */}
        <SiteDakkleurBanner />

        {/* 10 · FAQ: laatste bezwaren weg */}
        <SiteFaq />

        {/* 11 · Contact */}
        <SiteContact />
      </main>

      {/* Footer */}
      <SiteFooter />
    </>
  );
}
