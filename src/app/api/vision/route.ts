import { NextRequest } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const VISION_MODEL = process.env.VISION_MODEL || "minicpm-v";

export async function POST(req: NextRequest) {
  const { prompt, image } = await req.json();

  // Strip data URL prefix to get raw base64
  const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: prompt || "Describe this image in detail.",
          images: [base64Image],
        },
      ],
      stream: true,
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Vision request failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
