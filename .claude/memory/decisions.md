# Decisions

Key architectural decisions made in this project.

---

## three-globe over react-three-fiber for the globe

**Decision:** Use `three-globe` (v2.45.2) with a vanilla `THREE.WebGLRenderer` in `GlobeScene.tsx` instead of `@react-three/fiber`.

**Why:** `three-globe` owns its Three.js scene and exposes a fluent API for polygon/heatmap data binding (`polygonsData`, `polygonCapColor`, etc.). Integrating it as a `<primitive>` inside r3f creates lifecycle conflicts when re-calling `.polygonsData()` on data updates. Vanilla renderer with `useRef` + `useEffect` gives full imperative control with no conflicts.

**Impact:** `GlobeScene` is a `div`-ref component, not an r3f `<Canvas>`. Do not wrap it in `<Canvas>`.

---

## Open-Meteo temperature requests batched in groups of 20

**Decision:** `/api/globe/temperature` fetches temperature for all countries in batches of 20 concurrent requests.

**Why:** Open-Meteo free tier has implicit rate limits. Unbounded `Promise.all` over ~250 countries caused 429 errors. Batch of 20 keeps well within limits.

**Impact:** Any new coordinate-based Open-Meteo lookups must use the same batching pattern.

---

## API routes as proxies — no direct client-to-external fetch

**Decision:** All external API calls (REST Countries, World Bank, Open-Meteo, Ollama) go through `/api/*` Next.js route handlers.

**Why:** Centralises caching (in-memory `Map`, TTL 10 min), avoids CORS errors in the browser, and keeps API keys/config server-side.

**Impact:** Never add `fetch("https://restcountries.com/...")` in a client component. Always call `/api/globe/...` instead.

---

## Tailwind v4 @theme inline — no tailwind.config.js

**Decision:** Design tokens are declared in `globals.css` using `@theme inline` and referenced as CSS variables. No `tailwind.config.js` exists.

**Why:** Tailwind v4 native pattern. Eliminates config file drift and lets tokens be used as both CSS variables and Tailwind utility classes.

**Impact:** To add a new token, add it to `globals.css` `@theme inline` block. Do not create `tailwind.config.js`.

---

## AWS Amplify WEB_COMPUTE for Next.js SSR

**Decision:** Deployed on AWS Amplify with `platform=WEB_COMPUTE` (not `WEB`).

**Why:** `WEB` is static-only. `WEB_COMPUTE` enables SSR and API route execution via Lambda. Required for Next.js App Router with server-side route handlers.

**Impact:** Build spec uses `.next` as artifact base directory. Do not switch to `WEB` platform — API routes will break.
