import { NextResponse } from "next/server";

let cache: { data: CountryData[]; ts: number } | null = null;
const TTL = 10 * 60 * 1000;

type RestCountry = {
  cca2: string;
  name: { common: string };
  latlng?: number[];
  region?: string;
};

type CountryData = {
  iso: string;
  name: string;
  value: number;
  extra: Record<string, unknown>;
};

// Approximate annual mean temperature by lat/lng from Open-Meteo
async function fetchTemp(lat: number, lng: number): Promise<number | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_mean&timezone=auto&forecast_days=1`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    const data = await res.json();
    const temps: number[] | undefined = data?.daily?.temperature_2m_mean;
    return temps?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=cca2,name,latlng,region",
      { next: { revalidate: 600 } }
    );
    const countries: RestCountry[] = await res.json();

    // Batch temperature fetches (limit concurrency to avoid rate limits)
    const BATCH = 20;
    const results: CountryData[] = [];

    for (let i = 0; i < countries.length; i += BATCH) {
      const batch = countries.slice(i, i + BATCH);
      const temps = await Promise.all(
        batch.map((c) =>
          c.latlng?.length === 2 ? fetchTemp(c.latlng[0], c.latlng[1]) : Promise.resolve(null)
        )
      );
      batch.forEach((c, j) => {
        results.push({
          iso: c.cca2,
          name: c.name.common,
          value: normalizeTemp(temps[j]),
          extra: { temperature: temps[j], region: c.region },
        });
      });
    }

    cache = { data: results, ts: Date.now() };
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}

// Normalize -30°C → 50°C to 0→1
function normalizeTemp(t: number | null): number {
  if (t === null) return 0.5;
  return Math.min(1, Math.max(0, (t + 30) / 80));
}
