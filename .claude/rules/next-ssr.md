# Next.js SSR Rules — Read Before Writing Any Component

This project uses **Next.js 16 App Router**. Components are Server Components by default.

## Hard Rules

1. **Add `"use client"` at the top of any file that uses:**
   - `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`
   - `Three.js`, `@react-three/fiber`, `three-globe`
   - `Chart.js`, `react-chartjs-2`
   - `Plotly.js`, `react-plotly.js`
   - `window`, `document`, `navigator`, `localStorage`
   - Event handlers (`onClick`, `onChange`, etc.) on interactive elements

2. **Use `dynamic(() => import(...), { ssr: false })` for:**
   - Any component that creates a `canvas` or WebGL context
   - Any component that imports Three.js or three-globe at module level
   - Plotly components (they access `window` on import)

3. **Never import Three.js or three-globe directly in a Server Component or `layout.tsx`.**

4. **API routes (`/api/*`) run server-side — they can access `process.env` and make server-to-server calls. Do not fetch from these inside Server Components; use them from client components via `fetch()`.**

## Pattern Reference

```tsx
// ✅ Correct — canvas component with SSR disabled
const GlobeScene = dynamic(
  () => import("@/components/GlobeScene").then(m => ({ default: m.GlobeScene })),
  { ssr: false }
);

// ✅ Correct — client component with hooks
"use client";
import { useState } from "react";

// ❌ Wrong — Three.js in server context
import ThreeGlobe from "three-globe"; // at top level of a Server Component
```
