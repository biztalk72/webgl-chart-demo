# Session Log

Per-session work log. Promote important decisions to `decisions.md` and reusable solutions to `patterns.md`.

## Index

- 2026-05-04: Project initialized (no file changes)
- 2026-05-06: Global heatmap globe implemented (Phases 1–6, 25 tasks)
- 2026-05-06: Deployed to AWS Amplify → webgl.intuaos.com
- 2026-05-06: CLAUDE.md reconstructed — split into docs/ + .claude/rules/

---

## Session: 2026-05-04

- session_id: `session-1777872406307673000`
- branch: `main`
- changes: 0 (initialization only)

---

## Session: 2026-05-06

- branch: `main`
- changes: 30 files added/modified

### Key changes
- `src/components/GlobeScene.tsx` — three-globe + raycasting hover/click
- `src/app/globe/page.tsx` — layer switcher, zoom buttons, AI chat panel
- `src/app/api/globe/*` — 5 API route proxies with 10-min in-memory cache
- `src/components/Sidebar.tsx`, `src/app/page.tsx` — globe nav entry
- Deployed: AWS Amplify app `d1jfoyd3exzj5k`, domain `webgl.intuaos.com`

### Decisions
- Used `three-globe` (v2.45.2) over react-three-fiber for globe: three-globe owns its own Three.js scene, cleaner for polygon/heatmap use case.
- Vanilla Three.js renderer in `GlobeScene` (not r3f) because three-globe instance must be imperative.
- Open-Meteo temperature batched in groups of 20 to avoid free-tier rate limits.
