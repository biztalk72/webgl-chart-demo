# WebGL & Chart Demo

Interactive WebGL 3D scenes, 2D/3D data charts, and a live global heatmap globe — all powered by a local multimodal LLM via [Ollama](https://ollama.com).

**Live:** https://webgl.intuaos.com

## Features

| Page | What it does |
|------|-------------|
| `/webgl` | Chat-driven 3D scene — describe objects and watch them appear (Three.js + r3f) |
| `/charts/2d` | Line, bar, pie, scatter charts (Chart.js) |
| `/charts/3d` | Surface plots, 3D scatter, parametric mesh (Plotly.js) |
| `/globe` | Spinning Earth with heatmap layers — population, temperature, education, language |
| `/ai` | Chat and image analysis with a local multimodal LLM |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Ollama (required for AI features)
ollama serve
ollama pull llama3.2-vision   # or any multimodal model

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

## Globe Heatmap

The `/globe` page uses live open data — no API keys required:

| Layer | Data source |
|-------|-------------|
| Population | [REST Countries](https://restcountries.com) |
| Temperature | [Open-Meteo](https://open-meteo.com) |
| Education | [World Bank](https://api.worldbank.org) |
| Language | [REST Countries](https://restcountries.com) |

Click any country to zoom in and get an AI-generated insight. Type in the chat panel to switch layers with natural language ("show temperature in Asia").

## Tech Stack

Next.js 16 · TypeScript · Three.js · three-globe · Chart.js · Plotly.js · Tailwind CSS v4 · Ollama

## Deployment

Deployed on AWS Amplify with Route 53 DNS. Push to `main` triggers auto-deploy (~4 min).

```bash
git push origin main   # → auto-deploys to https://webgl.intuaos.com
```
