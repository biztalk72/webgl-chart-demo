# WebGL & Chart Demo — CLAUDE.md

## Project Overview

Next.js 15 app showcasing interactive WebGL 3D scenes, 2D/3D data charts, and AI-powered visualization via a local Ollama multimodal LLM. Dark-themed, fully client-side rendering.

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | Next.js 15 (App Router, TypeScript) |
| 3D Rendering | Three.js via @react-three/fiber + @react-three/drei |
| 2D Charts | Chart.js via react-chartjs-2 |
| 3D Charts | Plotly.js via react-plotly.js |
| AI / LLM | Ollama (local multimodal, HTTP API) |
| Styling | Tailwind CSS v4, Geist fonts |
| Icons | lucide-react |

## Project Structure

```
src/
├── app/
│   ├── page.tsx            # Home — navigation cards
│   ├── layout.tsx          # Root layout with Sidebar
│   ├── globals.css         # CSS variables + Tailwind config
│   ├── webgl/              # WebGL 3D scene page
│   ├── charts/
│   │   ├── 2d/             # Chart.js 2D charts page
│   │   └── 3d/             # Plotly 3D charts page
│   ├── ai/                 # AI Chat & Vision page
│   └── api/
│       ├── chat/           # Ollama chat proxy
│       ├── generate-chart/ # AI → chart data endpoint
│       ├── generate-scene/ # AI → 3D scene endpoint
│       └── vision/         # Multimodal image analysis
└── components/
    ├── Sidebar.tsx          # Fixed left navigation
    ├── ChatInterface.tsx    # Reusable chat UI
    ├── WebGLScene.tsx       # Three.js canvas
    ├── WebGLChatScene.tsx   # Chat-driven 3D scene
    ├── SceneChatPanel.tsx   # Side panel for 3D chat
    ├── Charts2D.tsx         # Chart.js chart grid
    └── Charts3D.tsx         # Plotly 3D chart grid
```

## Design Tokens (globals.css)

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#0a0a0a` | Page background |
| `--card` | `#111111` | Card surfaces |
| `--border` | `#262626` | Borders |
| `--accent` | `#6366f1` | Indigo — primary actions |
| `--muted` | `#888888` | Secondary text |

Use Tailwind semantic classes (`bg-card`, `text-muted`, `text-accent`, etc.) — never raw hex.

## Development

```bash
npm run dev     # localhost:3000
npm run build   # production build
npm run lint    # ESLint
```

Ollama must be running locally for AI features: `ollama serve`.

## Key Conventions

- App Router only — no Pages Router
- `"use client"` on all components that use Three.js, Chart.js, Plotly, or browser APIs
- API routes in `src/app/api/` proxy to Ollama at `http://localhost:11434`
- No server components for visualization — all chart/scene rendering is client-side
- Tailwind v4 `@theme inline` pattern (see globals.css) — no tailwind.config.js needed

## Plans

See [Plans.md](Plans.md) for current tasks.
