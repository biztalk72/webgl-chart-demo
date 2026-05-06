# WebGL & Chart Demo — Plans.md
# WebGL & 차트 데모 — 계획서

Created / 작성일: 2026-05-04

---

## Phase 1: Globe Foundation / 글로브 기초

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 1.1 | Install `three-globe` + create `/globe` page / `three-globe` 설치 및 `/globe` 페이지 생성 | `npm run build` 0 errors, `/globe` renders in browser | - | cc:done |
| 1.2 | Earth texture + atmosphere glow / 지구 텍스처 및 대기권 발광 | Earth displays correct texture with atmospheric glow | 1.1 | cc:done |
| 1.3 | Auto-rotation + mouse controls (orbit & zoom) / 자동 회전 및 마우스 제어 (궤도 & 줌) | Globe auto-rotates, drag to orbit, scroll to zoom | 1.2 | cc:done |
| 1.4 | Zoom in / Zoom out button UI / 줌 인·아웃 버튼 UI | + / − buttons change zoom level | 1.3 | cc:done |
| 1.5 | Sidebar + home card / 사이드바 및 홈 카드 추가 | `/globe` appears in Sidebar and is reachable from home | 1.1 | cc:done |

## Phase 2: Country Polygons & Interaction / 국가 폴리곤 및 인터랙션

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 2.1 | Country border GeoJSON polygon overlay / 국경 GeoJSON 폴리곤 오버레이 | All country borders rendered on the globe | 1.2 | cc:done |
| 2.2 | Hover highlight / 호버 하이라이트 | Country highlights (white lift) on mouse-over | 2.1 | cc:done |
| 2.3 | Click → tooltip / info panel / 클릭 시 툴팁·정보 패널 | Clicking a country shows its name and data | 2.2 | cc:done |
| 2.4 | Zoom into clicked country / 클릭 국가로 줌인 | Camera smoothly zooms into the clicked country | 2.3 | cc:done |

## Phase 3: Open Data Integration / 오픈 데이터 연동

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 3.1 | REST Countries API proxy (`/api/globe/population`, `/api/globe/language`) / REST Countries API 프록시 | Endpoint returns country name, population, languages, region | 1.1 | cc:done |
| 3.2 | World Bank API proxy (`/api/globe/education`) / World Bank API 프록시 | Returns literacy rate and school enrollment | 1.1 | cc:done |
| 3.3 | Open-Meteo API proxy (`/api/globe/temperature`) / Open-Meteo API 프록시 | Returns temperature data for each country's coordinates | 1.1 | cc:done |
| 3.4 | In-memory data cache (TTL 10 min) / 메모리 캐시 (TTL 10분) | Prevents duplicate requests for the same data | 3.1, 3.2, 3.3 | cc:done |

## Phase 4: Heatmap Overlays / 히트맵 오버레이

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 4.1 | Population heatmap (country-level color fill) / 인구 히트맵 | Countries color-coded by population (low→high: blue→red) | 2.1, 3.1 | cc:done |
| 4.2 | Temperature heatmap / 기온 히트맵 | Countries color-coded by current temperature | 2.1, 3.3 | cc:done |
| 4.3 | Education heatmap (literacy rate) / 교육 수준 히트맵 (문해율) | Countries color-coded by literacy rate | 2.1, 3.2 | cc:done |
| 4.4 | Language map (color by dominant language) / 언어 지도 (주요 언어별 색상) | Countries color-coded by primary language family | 2.1, 3.1 | cc:done |
| 4.5 | Color scale legend UI / 색상 범례 UI | Current layer's legend displayed at bottom of screen | 4.1 | cc:done |

## Phase 5: Layer Switcher UI / 레이어 전환 UI

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 5.1 | Layer switcher tab / button UI / 레이어 전환 탭·버튼 UI | Button click switches heatmap layer | 4.1, 4.2, 4.3, 4.4 | cc:done |
| 5.2 | Loading state + spinner / 로딩 상태 및 스피너 | Spinner shown while fetching data | 3.4 | cc:done |
| 5.3 | Error state UI / 오류 상태 UI | Fallback message shown on API failure | 3.4 | cc:done |

## Phase 6: AI Integration / AI 연동

| Task | Description / 설명 | DoD | Depends | Status |
|------|---------------------|-----|---------|--------|
| 6.1 | `/api/globe/ai-query` endpoint / 엔드포인트 | Natural language → `{ layer, reply }` JSON | 3.1 | cc:done |
| 6.2 | Chat panel on globe page / 글로브 페이지에 채팅 패널 추가 | Globe can be controlled from the chat input | 5.1, 6.1 | cc:done |
| 6.3 | Natural language layer switching / 자연어 레이어 전환 | "show temperature in Europe" switches the layer | 6.2 | cc:done |
| 6.4 | Country click → AI insight / 국가 클릭 시 AI 인사이트 | AI auto-generates a brief insight when a country is clicked | 2.3, 6.2 | cc:done |

---

## All 25 tasks complete 🎉 / 전체 25개 태스크 완료 🎉

Completed / 완료일: 2026-05-06
