"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  ImagePlus,
  X,
  BarChart3,
  MessageSquare,
  Eye,
  Loader2,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

type Mode = "chat" | "vision" | "chart";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
  chartConfig?: ChartConfig;
}

interface ChartConfig {
  type: "line" | "bar" | "pie" | "scatter";
  data: Record<string, unknown>;
  options?: Record<string, unknown>;
  backgroundImage?: string; // base64 data URL for image texture
}

const modeConfig = {
  chat: { icon: MessageSquare, label: "Chat", color: "text-accent" },
  vision: { icon: Eye, label: "Vision", color: "text-green-400" },
  chart: { icon: BarChart3, label: "Chart Gen", color: "text-yellow-400" },
};

const defaultChartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: "#ededed" } } },
  scales: {
    x: { ticks: { color: "#888" }, grid: { color: "#262626" } },
    y: { ticks: { color: "#888" }, grid: { color: "#262626" } },
  },
};

/** Convert a hex color or rgba string to a semi-transparent version */
function makeTransparent(color: string | string[], alpha: number): string | string[] {
  if (Array.isArray(color)) return color.map((c) => makeTransparent(c, alpha) as string);
  // Already rgba
  if (color.startsWith("rgba")) {
    return color.replace(/,[\s]*[\d.]+\)/, `, ${alpha})`);
  }
  // Hex
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

/** Hidden component that loads an image and calls onLoad */
function ChartImageLoader({
  src,
  onLoad,
}: {
  src: string;
  onLoad: (img: HTMLImageElement) => void;
}) {
  useEffect(() => {
    const img = new Image();
    img.onload = () => onLoad(img);
    img.src = src;
  }, [src, onLoad]);
  return null;
}

export function ChatInterface() {
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const chartImageCache = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    const userMsg: Message = { role: "user", content: input, image: image || undefined };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      if (mode === "chart") {
        await handleChartGeneration(input, userMsg, image || undefined);
      } else if (mode === "vision" && image) {
        await handleVision(input, image, userMsg);
      } else {
        await handleChat(input, userMsg);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Unknown error"}` },
      ]);
    } finally {
      setIsLoading(false);
      setImage(null);
    }
  };

  const handleChat = async (prompt: string, _userMsg: Message) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, { role: "user", content: prompt }] }),
    });
    if (!res.ok) throw new Error("Chat request failed");

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let assistantContent = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            assistantContent += json.message.content;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: assistantContent };
              return updated;
            });
          }
        } catch {
          // skip non-JSON lines
        }
      }
    }
  };

  const handleVision = async (prompt: string, imageData: string, _userMsg: Message) => {
    const res = await fetch("/api/vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt || "Describe this image in detail.", image: imageData }),
    });
    if (!res.ok) throw new Error("Vision request failed");

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let assistantContent = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            assistantContent += json.message.content;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: assistantContent };
              return updated;
            });
          }
        } catch {
          // skip
        }
      }
    }
  };

  const handleChartGeneration = async (prompt: string, _userMsg: Message, imageData?: string) => {
    const res = await fetch("/api/generate-chart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error("Chart generation failed");
    const data = await res.json();

    if (data.chartConfig) {
      const chartConfig = {
        ...data.chartConfig,
        backgroundImage: imageData || undefined,
      };
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.explanation || (imageData ? "Here is the chart with your image applied:" : "Here is the generated chart:"),
          chartConfig,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.explanation || "Could not generate chart config." },
      ]);
    }
  };

  const renderChart = (config: ChartConfig) => {
    const opts = { ...defaultChartOpts, ...config.options };
    const chartData = config.data as never;
    const ChartMap = { line: Line, bar: Bar, pie: Pie, scatter: Scatter };
    const ChartComponent = ChartMap[config.type] || Line;

    // Build plugins array for image background
    const plugins = config.backgroundImage
      ? [
          {
            id: "chartImageBackground",
            beforeDraw(chart: ChartJS) {
              const img = chartImageCache.current;
              if (!img) return;
              const { ctx, chartArea } = chart;
              if (!chartArea) return;
              const { left, top, width, height } = chartArea;
              ctx.save();
              ctx.globalAlpha = 0.6;
              ctx.drawImage(img, left, top, width, height);
              ctx.restore();
            },
          },
        ]
      : [];

    // If background image, make datasets semi-transparent so image shows through
    let finalData = chartData;
    if (config.backgroundImage && config.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = config.data as any;
      if (d.datasets) {
        finalData = {
          ...d,
          datasets: d.datasets.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (ds: any) => ({
              ...ds,
              backgroundColor: ds.backgroundColor
                ? makeTransparent(ds.backgroundColor, 0.55)
                : undefined,
            })
          ),
        } as never;
      }
    }

    return (
      <div className="h-[300px] mt-3 bg-black/30 rounded-lg p-3 relative">
        {config.backgroundImage && (
          <ChartImageLoader
            src={config.backgroundImage}
            onLoad={(img) => {
              chartImageCache.current = img;
            }}
          />
        )}
        <ChartComponent data={finalData} options={opts} plugins={plugins} />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Mode switcher */}
      <div className="flex gap-2 mb-4">
        {(Object.entries(modeConfig) as [Mode, typeof modeConfig.chat][]).map(
          ([key, { icon: Icon, label, color }]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                mode === key
                  ? `bg-card border border-border ${color} font-medium`
                  : "text-muted hover:text-foreground hover:bg-card-hover"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted text-sm">
            <div className="text-center space-y-2">
              <p className="text-lg">
                {mode === "chat" && "💬 Ask anything about charts, data, or visualization"}
                {mode === "vision" && "👁️ Upload an image and ask the AI to analyze it"}
                {mode === "chart" && "📊 Describe a chart and the AI will generate it"}
              </p>
              <p className="text-xs">Powered by local Ollama multimodal LLM</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent/20 text-foreground"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="uploaded"
                  className="max-w-[300px] rounded-lg mb-2"
                />
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.chartConfig && renderChart(msg.chartConfig)}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-xl px-4 py-3">
              <Loader2 className="animate-spin text-accent" size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Image preview */}
      {image && (
        <div className="mb-3 relative inline-block">
          <img src={image} alt="preview" className="h-20 rounded-lg border border-border" />
          <button
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
      {(mode === "vision" || mode === "chart") && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="p-2.5 rounded-lg bg-card border border-border text-muted hover:text-foreground transition-colors"
            >
              <ImagePlus size={18} />
            </button>
          </>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "chat"
              ? "Ask about data visualization..."
              : mode === "vision"
              ? "Describe what to analyze in the image..."
              : image
              ? "Describe the chart (image will be applied as texture)..."
              : "Describe the chart you want to generate..."
          }
          className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !image)}
          className="p-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
