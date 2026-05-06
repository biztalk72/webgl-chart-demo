# Patterns

Reusable implementation patterns for this project.

---

## API route with in-memory cache (TTL)

Used in all `/api/globe/*` routes.

```ts
let cache: { data: T[]; ts: number } | null = null;
const TTL = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data);
  }
  // fetch + transform...
  cache = { data, ts: Date.now() };
  return NextResponse.json(data);
}
```

---

## Dynamic import to disable SSR for canvas components

Used for `GlobeScene` and any Three.js / Plotly component.

```tsx
// In page.tsx
const GlobeScene = dynamic(
  () => import("@/components/GlobeScene").then((m) => ({ default: m.GlobeScene })),
  { ssr: false, loading: () => <LoadingPlaceholder /> }
);
```

---

## GlobeScene polygon update pattern (three-globe imperative API)

Avoid re-creating the `ThreeGlobe` instance. Update data via methods on the existing `globeRef`.

```ts
// ✅ Update existing instance in useEffect
useEffect(() => {
  const globe = globeRef.current;
  if (!globe || !geoJson) return;
  globe
    .polygonsData(geoJson.features)
    .polygonCapColor(getColorFn)
    .polygonAltitude((d) => d === hoveredRef.current ? 0.018 : 0.006);
}, [layer, countryData, geoJson, getColorFn]);

// ❌ Never do this — creates a new instance on every render
const globe = new ThreeGlobe();
```

---

## Hover raycasting without react-three-fiber

For vanilla Three.js scenes, use `THREE.Raycaster` on `mousemove` to detect which polygon is hovered.

```ts
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(ndc, camera);
const hits = raycaster.intersectObjects(globe.children, true);
// Convert hit point to lat/lng, then match against GeoJSON features
const point = hits[0].point.clone().normalize();
const lat = 90 - Math.acos(point.y) * (180 / Math.PI);
const lng = (Math.atan2(point.x, point.z) * (180 / Math.PI) + 360) % 360 - 180;
```

---

## Ollama AI query with keyword fallback

Used in `/api/globe/ai-query`. Always provide a keyword-based fallback when Ollama is unavailable.

```ts
try {
  const res = await fetch("http://localhost:11434/api/chat", { ... });
  // parse JSON from LLM response
} catch {
  // keyword fallback — no LLM needed
  const q = query.toLowerCase();
  if (q.includes("temp")) layer = "temperature";
  else if (q.includes("pop")) layer = "population";
  // ...
}
```
