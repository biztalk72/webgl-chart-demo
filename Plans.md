# Plans.md
# 계획서 (Plans)

> Active tasks for harness workers. Add new tasks here. Completed tasks are archived below.
>
> **Status markers:** `cc:TODO` · `cc:WIP` · `cc:done` · `blocked`
> **DoD baseline:** `npm run build` AND `npm run lint` both exit 0.

---

## Active / 활성

_No active tasks. Run `/harness-plan create` to plan the next feature._

---

## Backlog / 백로그

_Add future tasks here._

---

## Archive / 완료 아카이브

<details>
<summary>Phase 1–6: Global Heatmap Globe (completed 2026-05-06 / 완료)</summary>

### Phase 1: Globe Foundation / 글로브 기초

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 1.1 | Install `three-globe` + create `/globe` page | `npm run build` 0 errors, `/globe` renders | - | cc:done |
| 1.2 | Earth texture + atmosphere glow | Correct texture with atmospheric glow | 1.1 | cc:done |
| 1.3 | Auto-rotation + mouse controls (orbit & zoom) | Drag to orbit, scroll to zoom | 1.2 | cc:done |
| 1.4 | Zoom in / Zoom out buttons | +/− buttons change zoom level | 1.3 | cc:done |
| 1.5 | Sidebar + home card | `/globe` in Sidebar, reachable from home | 1.1 | cc:done |

### Phase 2: Country Polygons & Interaction / 국가 폴리곤 및 인터랙션

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 2.1 | GeoJSON country border overlay | All borders rendered on globe | 1.2 | cc:done |
| 2.2 | Hover highlight | White lift effect on mouse-over | 2.1 | cc:done |
| 2.3 | Click → tooltip / info panel | Country name and data shown on click | 2.2 | cc:done |
| 2.4 | Click-to-zoom | Camera smoothly zooms into clicked country | 2.3 | cc:done |

### Phase 3: Open Data Integration / 오픈 데이터 연동

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 3.1 | REST Countries proxy (`/api/globe/population`, `/api/globe/language`) | Returns name, population, languages, region | 1.1 | cc:done |
| 3.2 | World Bank proxy (`/api/globe/education`) | Returns literacy rate and school enrollment | 1.1 | cc:done |
| 3.3 | Open-Meteo proxy (`/api/globe/temperature`) | Returns temperature per country coordinate | 1.1 | cc:done |
| 3.4 | In-memory cache (TTL 10 min) | No duplicate requests within TTL window | 3.1–3.3 | cc:done |

### Phase 4: Heatmap Overlays / 히트맵 오버레이

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 4.1 | Population heatmap | Color-coded by population (blue→red) | 2.1, 3.1 | cc:done |
| 4.2 | Temperature heatmap | Color-coded by current temperature | 2.1, 3.3 | cc:done |
| 4.3 | Education heatmap (literacy rate) | Color-coded by literacy rate | 2.1, 3.2 | cc:done |
| 4.4 | Language map | Color-coded by primary language family | 2.1, 3.1 | cc:done |
| 4.5 | Color scale legend UI | Legend shown at bottom of screen | 4.1 | cc:done |

### Phase 5: Layer Switcher UI / 레이어 전환 UI

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 5.1 | Layer switcher buttons | Button click switches heatmap layer | 4.1–4.4 | cc:done |
| 5.2 | Loading spinner | Spinner shown while fetching data | 3.4 | cc:done |
| 5.3 | Error state UI | Fallback shown on API failure | 3.4 | cc:done |

### Phase 6: AI Integration / AI 연동

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 6.1 | `/api/globe/ai-query` endpoint | Natural language → `{ layer, reply }` JSON | 3.1 | cc:done |
| 6.2 | Chat panel on globe page | Globe controlled from chat input | 5.1, 6.1 | cc:done |
| 6.3 | Natural language layer switching | "show temperature" switches layer | 6.2 | cc:done |
| 6.4 | Country click → AI insight | AI auto-generates insight on click | 2.3, 6.2 | cc:done |

</details>
