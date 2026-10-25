import type { Metadata } from "next";
import PageLayout from "@/components/page-layout";
import SiteDakkleur from "@/components/site-dakkleur";

export const metadata: Metadata = {
  title: "Dakkleur-tool | MOS-X",
  description: "Upload een foto van je woning en zie je dak meteen in een nieuwe coatingkleur. Gratis en vrijblijvend.",
};

export default function DakkleurPagina() {
  return (
    <PageLayout>
      <SiteDakkleur pagina />
    </PageLayout>
  );
}
