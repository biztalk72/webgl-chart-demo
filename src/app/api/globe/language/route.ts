import { NextResponse } from "next/server";

let cache: { data: CountryData[]; ts: number } | null = null;
const TTL = 10 * 60 * 1000;

type CountryData = {
  iso: string;
  name: string;
  value: number;
  extra: Record<string, unknown>;
};

type RestCountry = {
  cca2: string;
  name: { common: string };
  languages?: Record<string, string>;
  region?: string;
};

// Assign stable color bucket (0–1) by dominant language family
const LANGUAGE_FAMILIES: Record<string, number> = {
  English: 0.05, Spanish: 0.15, French: 0.25, Portuguese: 0.35,
  Arabic: 0.45, Russian: 0.55, Chinese: 0.62, Hindi: 0.68,
  Bengali: 0.72, Malay: 0.76, Swahili: 0.80, German: 0.84,
  Japanese: 0.88, Korean: 0.91, Turkish: 0.94, Persian: 0.97,
};

function langValue(lang: string): number {
  const match = Object.keys(LANGUAGE_FAMILIES).find((k) =>
    lang.toLowerCase().includes(k.toLowerCase())
  );
  if (match) return LANGUAGE_FAMILIES[match];
  // Deterministic hash for unknown languages
  let h = 0;
  for (const ch of lang) h = (h * 31 + ch.charCodeAt(0)) & 0xffff;
  return (h % 100) / 100;
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=cca2,name,languages,region",
      { next: { revalidate: 600 } }
    );
    const countries: RestCountry[] = await res.json();

    const data: CountryData[] = countries.map((c) => {
      const langs = Object.values(c.languages ?? {});
      const primary = langs[0] ?? "Unknown";
      return {
        iso: c.cca2,
        name: c.name.common,
        value: langValue(primary),
        extra: { language: primary, allLanguages: langs, region: c.region },
      };
    });

    cache = { data, ts: Date.now() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}
