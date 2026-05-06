import { NextResponse } from "next/server";

let cache: { data: CountryData[]; ts: number } | null = null;
const TTL = 10 * 60 * 1000;

type CountryData = {
  iso: string;
  name: string;
  value: number;
  extra: Record<string, unknown>;
};

type WBEntry = {
  country: { id: string; value: string };
  value: number | null;
};

// World Bank: literacy rate, adult total (SE.ADT.LITR.ZS)
async function fetchWorldBank(indicator: string): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&mrv=1&per_page=300`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    const [, entries]: [unknown, WBEntry[]] = await res.json();
    entries?.forEach((e) => {
      if (e.value !== null) map.set(e.country.id.toUpperCase(), e.value);
    });
  } catch {
    // return empty map
  }
  return map;
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const [literacyMap, enrollmentMap] = await Promise.all([
      fetchWorldBank("SE.ADT.LITR.ZS"),  // Literacy rate
      fetchWorldBank("SE.PRM.ENRR"),       // School enrollment primary (% gross)
    ]);

    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=cca2,cca3,name,region",
      { next: { revalidate: 600 } }
    );
    const countries: { cca2: string; cca3: string; name: { common: string }; region: string }[] = await res.json();

    const data: CountryData[] = countries.map((c) => {
      const literacy = literacyMap.get(c.cca3) ?? literacyMap.get(c.cca2) ?? null;
      const enrollment = enrollmentMap.get(c.cca3) ?? enrollmentMap.get(c.cca2) ?? null;
      const score = literacy ?? (enrollment ? Math.min(enrollment, 100) : null);
      return {
        iso: c.cca2,
        name: c.name.common,
        value: score !== null ? score / 100 : 0.5,
        extra: { literacy: score, enrollment, region: c.region },
      };
    });

    cache = { data, ts: Date.now() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}
