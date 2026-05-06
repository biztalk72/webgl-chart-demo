# Conventions & Deployment

## Design Tokens

Defined in `src/app/globals.css` via `@theme inline`. **Always use Tailwind semantic classes — never raw hex.**

| CSS var | Value | Tailwind class |
|---------|-------|----------------|
| `--background` | `#0a0a0a` | `bg-background` |
| `--card` | `#111111` | `bg-card` |
| `--card-hover` | `#1a1a1a` | `bg-card-hover` |
| `--border` | `#262626` | `border-border` |
| `--accent` | `#6366f1` | `text-accent` / `bg-accent` |
| `--muted` | `#888888` | `text-muted` |

## Coding Rules

| Rule | Why |
|------|-----|
| `"use client"` on every component using Three.js, Chart.js, Plotly, or browser APIs | Next.js SSR crashes without it |
| `dynamic(() => import(...), { ssr: false })` for canvas/WebGL components | Three.js + SSR = runtime crash |
| No `tailwind.config.js` — use `@theme inline` in globals.css | Tailwind v4 pattern |
| API routes proxy all external calls — no direct client-to-external fetch | Avoids CORS; centralizes caching |
| In-memory `Map` cache with 10-min TTL in every `/api/globe/*` route | Protects free-tier rate limits |
| App Router only — no `pages/` directory | Project constraint |

## Deployment

| Item | Value |
|------|-------|
| Production URL | https://webgl.intuaos.com |
| AWS Amplify App ID | `d1jfoyd3exzj5k` (ap-northeast-2) |
| CloudFront domain | `d1j6gkwb6ejtvh.cloudfront.net` |
| Route 53 zone | `Z08510503P7PWN70O75HW` (`intuaos.com`) |
| GitHub repo | https://github.com/biztalk72/webgl-chart-demo |
| CI/CD | Push to `main` → Amplify auto-build (~4 min) |
