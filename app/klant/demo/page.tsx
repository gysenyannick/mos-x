import type { Metadata } from "next";
import Klantzone from "@/components/klantzone";
import { DEMO_DOSSIER } from "@/lib/klantzone";

export const metadata: Metadata = {
  title: "Jouw klantenzone | MOS-X",
  description: "Volg je dakwerken op je eigen pagina: planning, werffoto's, offertes en facturen.",
  robots: { index: false, follow: false },
};

export default function KlantzoneDemoPage() {
  // Demo staat vast op dag 2 van de werken, zodat alles er "live" uitziet.
  return <Klantzone dossier={DEMO_DOSSIER} demo vandaag="2026-10-21" />;
}
