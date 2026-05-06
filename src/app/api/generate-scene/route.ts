import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL = process.env.CHAT_MODEL || "qwen3";

const SYSTEM_PROMPT = `You are a 3D scene generator. When the user describes objects or scenes, respond with ONLY a JSON object (no markdown, no explanation, no code fences) in this exact format:

{
  "objects": [
    {
      "id": "unique_id",
      "geometry": "box|sphere|torus|torusKnot|cylinder|cone|plane|icosahedron|octahedron|dodecahedron|ring",
      "color": "#hexcolor",
      "size": [number, ...],
      "position": [x, y, z],
      "rotation": [x, y, z],
      "material": "standard|wireframe|metallic|glass",
      "animation": {
        "type": "rotate|orbit|float|bounce|pulse",
        "speed": 1.0,
        "axis": "x|y|z",
        "target": "id_of_another_object"
      }
    }
  ],
  "explanation": "Brief description of the scene"
}

Geometry size arrays:
- box: [width, height, depth]
- sphere: [radius, widthSegments, heightSegments]
- torus: [radius, tubeRadius, radialSegments, tubularSegments]
- torusKnot: [radius, tubeRadius, tubularSegments, radialSegments]
- cylinder: [radiusTop, radiusBottom, height, radialSegments]
- cone: [radius, height, radialSegments]
- plane: [width, height]
- icosahedron/octahedron/dodecahedron: [radius, detail]
- ring: [innerRadius, outerRadius, thetaSegments]

Material types:
- standard: smooth shaded surface (default)
- wireframe: wireframe rendering
- metallic: high metalness + low roughness
- glass: transparent with high reflectivity

Animation types:
- rotate: continuous rotation around an axis
- orbit: revolve around another object (requires "target" id)
- float: gentle up/down floating motion
- bounce: bouncing up and down
- pulse: scale pulsing

Colors: use common hex colors like #ef4444 (red), #3b82f6 (blue), #22c55e (green), #eab308 (yellow), #6366f1 (indigo), #f97316 (orange), #a855f7 (purple), #ec4899 (pink), #ffffff (white), #000000 (black).

If the user says "donut", use torus geometry. If they say "cube", use box geometry.
When modifying an existing scene, include ALL objects (existing + new/modified). Remove objects the user asks to delete.
Position objects sensibly so they don't overlap. Space them apart by at least 2 units.
ONLY output valid JSON. No other text.`;

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(req: NextRequest) {
  const { prompt, history, currentScene } = await req.json();

  const messages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];

  // Include current scene state so LLM knows what exists
  if (currentScene && currentScene.length > 0) {
    messages.push({
      role: "system",
      content: `Current scene state:\n${JSON.stringify({ objects: currentScene }, null, 2)}\n\nWhen the user asks to modify, add, or remove objects, use this as the base state. Return the COMPLETE updated scene with all objects.`,
    });
  }

  // Add conversation history
  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: "user", content: prompt });

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: false,
      options: { temperature: 0.3 },
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Scene generation failed" },
      { status: 502 }
    );
  }

  const data = await res.json();
  const content = data.message?.content || "";

  try {
    let jsonStr = content;
    // Strip markdown fences if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    // Extract JSON object
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) {
      jsonStr = objMatch[0];
    }

    const parsed = JSON.parse(jsonStr);

    return NextResponse.json({
      objects: parsed.objects || [],
      explanation: parsed.explanation || "Scene updated.",
    });
  } catch {
    return NextResponse.json({
      objects: null,
      explanation:
        content || "Failed to generate scene. Please try a clearer description.",
    });
  }
}
