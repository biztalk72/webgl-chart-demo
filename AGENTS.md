# Agent Guidelines

> Read CLAUDE.md first, then @.claude/rules/next-ssr.md before touching any component.

## Worker — Before You Write Code

1. **Check build baseline:** `npm run build` must exit 0 after your changes.
2. **Check lint:** `npm run lint` must exit 0.
3. **Client vs Server:** Any file using hooks, Three.js, Chart.js, Plotly, or DOM APIs needs `"use client"` at line 1. See @.claude/rules/next-ssr.md.
4. **Canvas components:** Wrap with `dynamic(() => import(...), { ssr: false })` at the page level.
5. **New API routes:** Add in-memory `Map` cache with 10-min TTL — pattern is in `src/app/api/globe/population/route.ts`.
6. **Design tokens:** Use Tailwind semantic classes (`bg-card`, `text-muted`, `text-accent`). No raw hex colors.
7. **New pages:** Add route to `src/components/Sidebar.tsx` nav items and `src/app/page.tsx` cards.

## Reviewer — What to Verify

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] No `"use client"` missing on interactive components
- [ ] No raw hex colors in JSX/TSX (must use Tailwind tokens)
- [ ] No direct client-to-external-API fetch (must go through `/api/*` proxy)
- [ ] New `/api/globe/*` routes have in-memory cache

## Key Invariants

- `/globe` page uses a vanilla Three.js renderer (not react-three-fiber) — `GlobeScene` is a `div` ref with imperative `THREE.WebGLRenderer`.
- `three-globe` instance is created once in a `useEffect` and stored in `globeRef` — do not re-create on every render.
- `/api/globe/temperature` batches Open-Meteo requests in groups of 20 to avoid rate limits — preserve this pattern if adding more coordinate-based lookups.
- Ollama model name in `/api/globe/ai-query`: `llama3.2-vision` — change only if the user's Ollama install uses a different model.
