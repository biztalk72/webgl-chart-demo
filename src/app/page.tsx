import Link from "next/link";
import { Box, BarChart3, Globe, Globe2, MessageSquare, Cpu, Zap } from "lucide-react";

const cards = [
  {
    href: "/webgl",
    icon: Box,
    title: "WebGL 3D Scene",
    description: "Interactive Three.js scene — chat to create 3D objects with animated geometry and particle systems",
    color: "text-indigo-400",
    borderColor: "hover:border-indigo-500/50",
  },
  {
    href: "/charts/2d",
    icon: BarChart3,
    title: "2D Charts",
    description: "Line, bar, pie, and scatter charts with Chart.js — responsive and theme-aware",
    color: "text-green-400",
    borderColor: "hover:border-green-500/50",
  },
  {
    href: "/charts/3d",
    icon: Globe,
    title: "3D Charts",
    description: "Surface plots, 3D scatter, and parametric mesh visualizations with Plotly.js",
    color: "text-yellow-400",
    borderColor: "hover:border-yellow-500/50",
  },
  {
    href: "/globe",
    icon: Globe2,
    title: "Global Heatmap",
    description: "Spinning Earth globe with heatmap layers — population, temperature, education, language — powered by open data",
    color: "text-blue-400",
    borderColor: "hover:border-blue-500/50",
  },
  {
    href: "/ai",
    icon: MessageSquare,
    title: "AI Chat & Vision",
    description: "Chat with a local multimodal LLM — analyze images, generate charts from text, apply image textures to charts",
    color: "text-cyan-400",
    borderColor: "hover:border-cyan-500/50",
  },
];

const techStack = [
  { icon: Zap, label: "Next.js 15", sub: "App Router + TypeScript" },
  { icon: Box, label: "Three.js", sub: "react-three-fiber + drei" },
  { icon: BarChart3, label: "Chart.js", sub: "react-chartjs-2" },
  { icon: Globe, label: "Plotly.js", sub: "3D surfaces & meshes" },
  { icon: Cpu, label: "Ollama", sub: "Local multimodal LLM" },
];

export default function Home() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          <span className="text-accent">WebGL</span> & Chart Demo
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Interactive 3D visualizations, data charts, and AI-powered chart generation
          — all running locally with a multimodal LLM via Ollama.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {cards.map(({ href, icon: Icon, title, description, color, borderColor }) => (
          <Link
            key={href}
            href={href}
            className={`group bg-card border border-border rounded-xl p-6 transition-all duration-200 ${borderColor} hover:bg-card-hover`}
          >
            <div className={`${color} mb-3`}>
              <Icon size={28} />
            </div>
            <h2 className="text-lg font-semibold mb-1 group-hover:text-foreground transition-colors">
              {title}
            </h2>
            <p className="text-sm text-muted">{description}</p>
          </Link>
        ))}
      </div>

      {/* Tech Stack */}
      <div>
        <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
          Tech Stack
        </h3>
        <div className="flex flex-wrap gap-3">
          {techStack.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3"
            >
              <Icon size={18} className="text-accent" />
              <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
