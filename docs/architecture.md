# Architecture

## Request Flow

```
Browser
  └─ Next.js App Router (SSR shell — client components handle all rendering)
       ├─ /webgl          WebGLChatScene   Three.js via react-three-fiber
       ├─ /charts/2d      Charts2D         Chart.js via react-chartjs-2
       ├─ /charts/3d      Charts3D         Plotly.js via react-plotly.js
       ├─ /globe          GlobeScene       three-globe + vanilla Three.js
       ├─ /ai             ChatInterface    Ollama chat + vision
       └─ /api/*          Route Handlers   server-side proxies only
            ├─ chat              → Ollama /api/chat
            ├─ vision            → Ollama multimodal
            ├─ generate-chart    → Ollama → chart JSON
            ├─ generate-scene    → Ollama → 3D scene JSON
            └─ globe/
                 population      → restcountries.com   (10-min cache)
                 temperature     → open-meteo.com      (10-min cache)
                 education       → api.worldbank.org   (10-min cache)
                 language        → restcountries.com   (10-min cache)
                 ai-query        → Ollama → { layer, reply }
```

## File Map

```
src/
├── app/
│   ├── page.tsx                    Home nav cards
│   ├── layout.tsx                  Root layout — Sidebar + <main>
│   ├── globals.css                 CSS design tokens + Tailwind v4
│   ├── webgl/page.tsx
│   ├── charts/2d/page.tsx
│   ├── charts/3d/page.tsx
│   ├── globe/page.tsx              Layer switcher + AI chat panel
│   ├── ai/page.tsx
│   └── api/
│       ├── chat/route.ts
│       ├── vision/route.ts
│       ├── generate-chart/route.ts
│       ├── generate-scene/route.ts
│       └── globe/
│           ├── population/route.ts
│           ├── temperature/route.ts
│           ├── education/route.ts
│           ├── language/route.ts
│           └── ai-query/route.ts
└── components/
    ├── Sidebar.tsx                 Fixed left nav, w-60
    ├── ChatInterface.tsx           Reusable Ollama chat UI
    ├── WebGLScene.tsx              Static Three.js r3f canvas
    ├── WebGLChatScene.tsx          Chat-driven 3D object builder
    ├── SceneChatPanel.tsx          Side panel for WebGL chat
    ├── GlobeScene.tsx              three-globe + raycasting hover/click
    ├── Charts2D.tsx                Chart.js grid (line/bar/pie/scatter)
    └── Charts3D.tsx                Plotly grid (surface/scatter3d/mesh)
```

## Tech Stack

| Layer | Library | Version |
|-------|---------|---------|
| Framework | Next.js + TypeScript | 16.2.2 |
| 3D (chat-driven) | @react-three/fiber + @react-three/drei | ^9 / ^10 |
| Globe | three-globe (vanilla renderer) | 2.45.2 |
| 2D charts | Chart.js + react-chartjs-2 | ^4.5 |
| 3D charts | Plotly.js + react-plotly.js | ^3.5 |
| AI | Ollama HTTP API (local) | — |
| Styling | Tailwind CSS v4 (`@theme inline`) | ^4 |
| Icons | lucide-react | ^1.7 |
