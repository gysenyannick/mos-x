import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json([]);

  try {
    // Nominatim free-text search with Belgium filter; extract postal codes from results
    const url =
      "https://nominatim.openstreetmap.org/search?q=" +
      encodeURIComponent(q + " België") +
      "&format=json&addressdetails=1&limit=15&countrycodes=be&accept-language=nl";

    const res = await fetch(url, {
      headers: {
        "User-Agent": "MOS-X Website/1.0 (info@mos-x.be)",
      },
    });

    if (!res.ok) return NextResponse.json([]);
    const data: NominatimResult[] = await res.json();

    const seen = new Set<string>();
    const results: { postcode: string; municipality: string }[] = [];

    for (const item of data) {
      const postcode = item.address?.postcode;
      if (!postcode) continue;
      if (!postcode.startsWith(q)) continue;

      const municipality =
        item.address?.city ||
        item.address?.town ||
        item.address?.village ||
        item.address?.municipality ||
        item.address?.county ||
        "";

      const key = postcode + "-" + municipality;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({ postcode, municipality });
    }

    return NextResponse.json(results.slice(0, 5), {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return NextResponse.json([]);
  }
}

interface NominatimResult {
  address?: {
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
  };
}
