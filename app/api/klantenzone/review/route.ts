import { NextRequest, NextResponse } from "next/server";
import { getInstellingen, wijzigKlant } from "@/lib/klantenzone/store";
import { GOOGLE_WRITE_REVIEW_URL } from "@/lib/google-review";

export const runtime = "nodejs";

/**
 * Klik op "Schrijf een review": we noteren de klik (niet of er echt een review kwam,
 * dat weten we niet zeker) en sturen door naar het Google-bedrijfsprofiel.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("k") ?? "";
  const googleReviewUrl = (await getInstellingen()).googleReviewUrl || GOOGLE_WRITE_REVIEW_URL;
  if (!googleReviewUrl) return NextResponse.redirect(new URL(`/klant/${encodeURIComponent(id)}`, req.url));
  if (id) {
    await wijzigKlant(id, (k) => { (k.review ??= {}).geklikt = new Date().toISOString(); }).catch(() => null);
  }
  return NextResponse.redirect(googleReviewUrl);
}
