import { NextResponse } from "next/server";

// Cache with 10-minute TTL
let cache: { data: CountryData[]; ts: number } | null = null;
const TTL = 10 * 60 * 1000;

type RestCountry = {
  cca2: string;
  population: number;
  name: { common: string };
  languages?: Record<string, string>;
  region?: string;
  latlng?: number[];
};

type CountryData = {
  iso: string;
  name: string;
  value: number;
  extra: Record<string, unknown>;
};

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=cca2,population,name,languages,region,latlng",
      { next: { revalidate: 600 } }
    );
    const countries: RestCountry[] = await res.json();

    const populations = countries.map((c) => c.population).filter(Boolean);
    const maxPop = Math.max(...populations);

    const data: CountryData[] = countries.map((c) => ({
      iso: c.cca2,
      name: c.name.common,
      value: maxPop > 0 ? Math.log1p(c.population) / Math.log1p(maxPop) : 0,
      extra: {
        population: c.population,
        language: Object.values(c.languages ?? {})[0] ?? "Unknown",
        region: c.region,
        latlng: c.latlng,
      },
    }));

    cache = { data, ts: Date.now() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}
