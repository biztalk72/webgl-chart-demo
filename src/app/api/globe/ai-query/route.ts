import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  query: string;
  currentLayer?: string;
  selectedCountry?: string;
};

type GlobeAction = {
  layer?: "population" | "temperature" | "education" | "language";
  reply: string;
};

const SYSTEM_PROMPT = `You are a globe visualization assistant. The user is looking at an interactive world heatmap with these layers:
- population: shows country populations (log-scaled)
- temperature: shows current temperature from Open-Meteo
- education: shows adult literacy rates from World Bank
- language: shows dominant language by country (color-coded by language family)

When the user asks to switch layers or explore data, respond with JSON like:
{"layer": "temperature", "reply": "Switched to temperature view. Hot regions appear red, cold regions blue."}

If no layer change is needed, just respond with:
{"reply": "Your answer here."}

Keep replies under 2 sentences. Always respond with valid JSON.`;

export async function POST(req: NextRequest) {
  const { query, currentLayer, selectedCountry }: RequestBody = await req.json();

  const userMessage = [
    selectedCountry ? `Currently selected: ${selectedCountry}.` : "",
    `Current layer: ${currentLayer ?? "population"}.`,
    `User says: ${query}`,
  ]
    .filter(Boolean)
    .join(" ");

  try {
    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2-vision",
        stream: false,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error("Ollama error");
    const data = await res.json();
    const text: string = data?.message?.content ?? "{}";

    // Extract JSON from response (LLM may wrap in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed: GlobeAction = jsonMatch ? JSON.parse(jsonMatch[0]) : { reply: text };

    return NextResponse.json({
      layer: parsed.layer ?? null,
      reply: parsed.reply ?? "Done.",
    });
  } catch {
    // Fallback: keyword-based layer switching without AI
    const q = query.toLowerCase();
    let layer: GlobeAction["layer"] | null = null;
    if (q.includes("temp") || q.includes("heat") || q.includes("weather") || q.includes("climate")) {
      layer = "temperature";
    } else if (q.includes("pop") || q.includes("people") || q.includes("density")) {
      layer = "population";
    } else if (q.includes("educ") || q.includes("liter") || q.includes("school")) {
      layer = "education";
    } else if (q.includes("lang") || q.includes("speak") || q.includes("tongue")) {
      layer = "language";
    }

    return NextResponse.json({
      layer,
      reply: layer
        ? `Switched to ${layer} layer. (Ollama unavailable — using keyword mode.)`
        : "Ollama is unavailable. Try: 'show temperature', 'show population', 'show education', or 'show language'.",
    });
  }
}
