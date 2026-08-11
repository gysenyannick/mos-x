import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const postcode = (req.nextUrl.searchParams.get("postcode") ?? "").trim();
  if (q.length < 3) return NextResponse.json([]);

  try {
    const query = postcode ? q + " " + postcode + " België" : q + " België";
    const url =
      "https://photon.komoot.io/api/?q=" +
      encodeURIComponent(query) +
      "&limit=6&lang=nl&bbox=2.5,49.5,6.5,51.5";

    const res = await fetch(url, {
      headers: { "User-Agent": "MOS-X Website/1.0 (info@mos-x.be)" },
    });

    if (!res.ok) return NextResponse.json([]);
    const data = await res.json();

    const seen = new Set<string>();
    const results: string[] = [];

    for (const f of data.features ?? []) {
      const p = f.properties;
      if (!p || p.country_code !== "be") continue;
      if (!p.street) continue;
      const addr = p.housenumber ? p.street + " " + p.housenumber : p.street;
      if (seen.has(addr)) continue;
      seen.add(addr);
      results.push(addr);
    }

    return NextResponse.json(results.slice(0, 5), {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch {
    return NextResponse.json([]);
  }
}
