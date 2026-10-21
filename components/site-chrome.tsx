"use client";

import { usePathname } from "next/navigation";

/** Verbergt sitebrede knoppen (contactbalk, WhatsApp-bol) in de klantenzone en het beheer. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pad = usePathname() ?? "";
  if (pad.startsWith("/klant/") || pad.startsWith("/beheer")) return null;
  return <>{children}</>;
}
