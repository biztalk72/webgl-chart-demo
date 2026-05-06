import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL = process.env.CHAT_MODEL || "qwen3";

const SYSTEM_PROMPT = `You are a chart configuration generator. When asked to create a chart, respond with ONLY a JSON object in this exact format (no markdown, no explanation, no code fences):

{
  "type": "line|bar|pie|scatter",
  "explanation": "Brief description of the chart",
  "data": {
    "labels": ["Label1", "Label2", ...],
    "datasets": [
      {
        "label": "Dataset Name",
        "data": [number1, number2, ...],
        "borderColor": "#hex",
        "backgroundColor": "#hex or rgba(...)"
      }
    ]
  }
}

For scatter charts, use data: [{x: number, y: number}, ...] instead of labels.
For pie charts, include backgroundColor as an array of colors.
Use these colors: #6366f1 (indigo), #22c55e (green), #eab308 (yellow), #ef4444 (red), #06b6d4 (cyan), #f97316 (orange), #a855f7 (purple).
Generate realistic sample data that matches the request. ONLY output the JSON, nothing else.`;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      stream: false,
      options: { temperature: 0.3 },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Chart generation failed" }, { status: 502 });
  }

  const data = await res.json();
  const content = data.message?.content || "";

  try {
    // Try to extract JSON from the response (handle possible markdown fences)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Also try to find JSON object directly
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) {
      jsonStr = objMatch[0];
    }

    const parsed = JSON.parse(jsonStr);

    return NextResponse.json({
      chartConfig: {
        type: parsed.type || "bar",
        data: parsed.data,
        options: parsed.options,
      },
      explanation: parsed.explanation || "Chart generated successfully.",
    });
  } catch {
    // If JSON parsing fails, return the raw text as explanation
    return NextResponse.json({
      chartConfig: null,
      explanation: content || "Failed to generate chart. Please try a more specific description.",
    });
  }
}
