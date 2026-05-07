design.md — UI/UX Design System Specification
Version: 1.0.0 | Last Updated: 2026-05-06 Philosophy: First Principles Design — Every decision must be justified by perception science, not convention.


0. 설계 철학 (Design Philosophy)
"The best design is the one where nothing can be removed." — Antoine de Saint-Exupéry "Question every requirement." — Elon Musk
핵심 원칙 (Core Principles)



1. 디자인 토큰 (Design Tokens)
토큰은 디자인의 DNA다. 코드와 디자인 도구의 단일 진실 공급원(Single Source of Truth).
1.1 색상 시스템 (Color System)
원칙
60-30-10 Rule: 배경 60%, 보조 30%, 강조 10%
HSL 기반: 색상 조작의 예측 가능성 확보
Semantic Naming: 역할 기반 명명 (색상 기반 명명 금지)

/* ===========================

   COLOR TOKENS

   =========================== */

:root {

  /* --- Primitive Tokens (변경 금지) --- */

  --color-gray-50:  hsl(220, 14%, 96%);

  --color-gray-100: hsl(220, 13%, 91%);

  --color-gray-200: hsl(220, 12%, 83%);

  --color-gray-300: hsl(220, 10%, 70%);

  --color-gray-400: hsl(220,  9%, 58%);

  --color-gray-500: hsl(220,  8%, 46%);

  --color-gray-600: hsl(220, 10%, 35%);

  --color-gray-700: hsl(220, 12%, 26%);

  --color-gray-800: hsl(220, 14%, 17%);

  --color-gray-900: hsl(220, 16%, 10%);

  --color-primary-50:  hsl(217, 91%, 96%);

  --color-primary-100: hsl(217, 89%, 88%);

  --color-primary-200: hsl(217, 87%, 78%);

  --color-primary-300: hsl(217, 85%, 65%);

  --color-primary-400: hsl(217, 83%, 54%);

  --color-primary-500: hsl(217, 91%, 44%);  /* Base */

  --color-primary-600: hsl(217, 93%, 37%);

  --color-primary-700: hsl(217, 95%, 29%);

  --color-primary-800: hsl(217, 97%, 20%);

  --color-primary-900: hsl(217, 99%, 13%);

  --color-success-500: hsl(142, 71%, 38%);

  --color-warning-500: hsl(38,  92%, 50%);

  --color-error-500:   hsl(0,   84%, 55%);

  --color-info-500:    hsl(199, 89%, 48%);

  /* --- Semantic Tokens (컴포넌트에서 이것만 사용) --- */

  /* Surface */

  --color-bg-base:       var(--color-gray-50);

  --color-bg-subtle:     var(--color-gray-100);

  --color-bg-muted:      var(--color-gray-200);

  --color-bg-overlay:    rgba(0, 0, 0, 0.48);

  /* Text */

  --color-text-primary:  var(--color-gray-900);

  --color-text-secondary:var(--color-gray-600);

  --color-text-disabled: var(--color-gray-400);

  --color-text-inverse:  hsl(0, 0%, 100%);

  --color-text-link:     var(--color-primary-500);

  /* Border */

  --color-border-default:var(--color-gray-200);

  --color-border-focus:  var(--color-primary-500);

  --color-border-error:  var(--color-error-500);

  /* Interactive */

  --color-action-primary:        var(--color-primary-500);

  --color-action-primary-hover:  var(--color-primary-600);

  --color-action-primary-active: var(--color-primary-700);

  /* Status */

  --color-status-success: var(--color-success-500);

  --color-status-warning: var(--color-warning-500);

  --color-status-error:   var(--color-error-500);

  --color-status-info:    var(--color-info-500);

}

/* Dark Mode */

@media (prefers-color-scheme: dark) {

  :root {

    --color-bg-base:        var(--color-gray-900);

    --color-bg-subtle:      var(--color-gray-800);

    --color-bg-muted:       var(--color-gray-700);

    --color-text-primary:   var(--color-gray-50);

    --color-text-secondary: var(--color-gray-400);

    --color-border-default: var(--color-gray-700);

  }

}
색상 접근성 체크리스트
AA 기준: 일반 텍스트 ≥ 4.5:1, 대형 텍스트 ≥ 3:1
AAA 기준 (권장): 일반 텍스트 ≥ 7:1
색상만으로 정보를 전달하지 않는다 (아이콘/텍스트 병행)
prefers-color-scheme 미디어쿼리 대응

도구: Colour Contrast Analyser, Adobe Color


1.2 타이포그래피 (Typography)
원칙
Type Scale: 1.250 비율 (Major Third) — base: 16px
Line Height: 가독성 공식 = font-size × 1.5 (body), × 1.2 (heading)
Measure (행 길이): 45–75자 (최적 독서 경험)¹

/* ===========================

   TYPOGRAPHY TOKENS

   =========================== */

:root {

  /* Font Families */

  --font-display: 'Pretendard Variable', 'Apple SD Gothic Neo', sans-serif;

  --font-body:    'Pretendard Variable', 'Apple SD Gothic Neo', sans-serif;

  --font-mono:    'JetBrains Mono', 'D2Coding', 'Fira Code', monospace;

  /* Font Size Scale (Major Third: ×1.25) */

  --text-xs:   0.640rem;  /*  10.2px */

  --text-sm:   0.800rem;  /*  12.8px */

  --text-base: 1.000rem;  /*  16px   */

  --text-md:   1.250rem;  /*  20px   */

  --text-lg:   1.563rem;  /*  25px   */

  --text-xl:   1.953rem;  /*  31px   */

  --text-2xl:  2.441rem;  /*  39px   */

  --text-3xl:  3.052rem;  /*  49px   */

  /* Font Weight */

  --font-weight-regular: 400;

  --font-weight-medium:  500;

  --font-weight-semibold:600;

  --font-weight-bold:    700;

  /* Line Height */

  --leading-none:    1.0;

  --leading-tight:   1.2;

  --leading-snug:    1.375;

  --leading-normal:  1.5;

  --leading-relaxed: 1.625;

  --leading-loose:   2.0;

  /* Letter Spacing */

  --tracking-tight:  -0.025em;

  --tracking-normal:  0em;

  --tracking-wide:    0.025em;

  --tracking-wider:   0.05em;

  --tracking-widest:  0.1em;

}
타이포그래피 사용 가이드



1.3 간격 시스템 (Spacing System)
원칙: 8px Grid System
모든 간격은 4px의 배수. 주요 간격은 8px의 배수.²

/* ===========================

   SPACING TOKENS

   =========================== */

:root {

  --space-0:   0px;

  --space-px:  1px;

  --space-0-5: 2px;

  --space-1:   4px;

  --space-1-5: 6px;

  --space-2:   8px;

  --space-3:   12px;

  --space-4:   16px;

  --space-5:   20px;

  --space-6:   24px;

  --space-8:   32px;

  --space-10:  40px;

  --space-12:  48px;

  --space-16:  64px;

  --space-20:  80px;

  --space-24:  96px;

  --space-32:  128px;

  --space-40:  160px;

  --space-48:  192px;

  --space-56:  224px;

  --space-64:  256px;

}
간격 사용 패턴



1.4 반응형 브레이크포인트 (Breakpoints)
/* ===========================

   BREAKPOINT TOKENS

   =========================== */

/*

  Mobile First 원칙:

  기본(min-width 없음) = 모바일

  sm  = 640px  (태블릿 세로)

  md  = 768px  (태블릿 가로)

  lg  = 1024px (노트북)

  xl  = 1280px (데스크톱)

  2xl = 1536px (대형 모니터)

*/

:root {

  --screen-sm:  640px;

  --screen-md:  768px;

  --screen-lg:  1024px;

  --screen-xl:  1280px;

  --screen-2xl: 1536px;

}


1.5 그림자 & 레이어 (Shadow & Elevation)
물리 법칙: 고도가 높을수록 그림자가 크고 흐려진다 (실제 빛의 산란 모방)

/* ===========================

   SHADOW TOKENS (Google Material의 elevation 개념)

   =========================== */

:root {

  /* elevation 0 — 평면 */

  --shadow-none: none;

  /* elevation 1 — 카드, 드롭다운 */

  --shadow-sm:

    0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* elevation 2 — 카드 호버, 팝오버 */

  --shadow-md:

    0 4px 6px -1px rgba(0, 0, 0, 0.10),

    0 2px 4px -2px rgba(0, 0, 0, 0.10);

  /* elevation 3 — 모달, 드로어 */

  --shadow-lg:

    0 10px 15px -3px rgba(0, 0, 0, 0.10),

    0  4px  6px -4px rgba(0, 0, 0, 0.10);

  /* elevation 4 — 알림, 토스트 */

  --shadow-xl:

    0 20px 25px -5px  rgba(0, 0, 0, 0.10),

    0  8px 10px -6px  rgba(0, 0, 0, 0.10);

  /* elevation 5 — 풀스크린 오버레이 */

  --shadow-2xl:

    0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* 내부 그림자 */

  --shadow-inner:

    inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);

}


1.6 모션 & 애니메이션 (Motion)
원칙: 모션은 방향을 알려주는 내레이터다. 장식이 아니다.³

/* ===========================

   MOTION TOKENS

   =========================== */

:root {

  /* Duration */

  --duration-instant:  50ms;

  --duration-fast:    100ms;

  --duration-normal:  200ms;

  --duration-slow:    300ms;

  --duration-slower:  500ms;

  --duration-slowest: 700ms;

  /* Easing — 실제 물리 움직임 모방 */

  --ease-linear:     linear;

  --ease-in:         cubic-bezier(0.4, 0, 1, 1);

  --ease-out:        cubic-bezier(0, 0, 0.2, 1);    /* 대부분의 UI 트랜지션 */

  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);  /* 요소 이동 */

  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1); /* 탄성 효과 */

  --ease-bounce:     cubic-bezier(0.68, -0.55, 0.265, 1.55);

}

/* 모션 감소 선호 대응 (필수) */

@media (prefers-reduced-motion: reduce) {

  *, *::before, *::after {

    animation-duration:   0.01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration:  0.01ms !important;

  }

}
모션 사용 원칙



1.7 테두리 반경 (Border Radius)
:root {

  --radius-none:  0px;

  --radius-sm:    2px;   /* 태그, 배지 */

  --radius-base:  4px;   /* 인풋, 버튼 */

  --radius-md:    6px;   /* 카드 */

  --radius-lg:    8px;   /* 패널 */

  --radius-xl:    12px;  /* 모달 */

  --radius-2xl:   16px;  /* 드로어 */

  --radius-3xl:   24px;  /* 풀스크린 패널 */

  --radius-full:  9999px; /* 알약형, 아바타 */

}


2. 그리드 & 레이아웃 (Grid & Layout)
2.1 12컬럼 그리드
/* Container */

.container {

  width: 100%;

  max-width: 1280px;

  margin-inline: auto;

  padding-inline: var(--space-6);

}

@media (min-width: 1024px) {

  .container { padding-inline: var(--space-12); }

}

/* Grid */

.grid {

  display: grid;

  grid-template-columns: repeat(12, 1fr);

  gap: var(--space-6);

}
2.2 레이아웃 패턴



3. 컴포넌트 가이드라인 (Component Guidelines)
3.1 Atomic Design 계층
Atoms → Molecules → Organisms → Templates → Pages

  │          │           │            │

토큰 적용  원자 조합    분자 조합   생태계 조합
3.2 컴포넌트 해부학 (Component Anatomy)
모든 인터랙티브 컴포넌트는 다음 상태를 가진다:

Default → Hover → Focus → Active → Disabled → Error → Loading
상태별 시각 규칙



3.3 핵심 컴포넌트 명세
Button
/* Button Base */

.btn {

  display:         inline-flex;

  align-items:     center;

  justify-content: center;

  gap:             var(--space-2);

  border:          1px solid transparent;

  border-radius:   var(--radius-base);

  font-family:     var(--font-display);

  font-weight:     var(--font-weight-medium);

  line-height:     var(--leading-none);

  cursor:          pointer;

  transition:      all var(--duration-fast) var(--ease-out);

  white-space:     nowrap;

  user-select:     none;

}

/* Sizes */

.btn-sm  { padding: var(--space-1-5) var(--space-3); font-size: var(--text-sm);  }

.btn-md  { padding: var(--space-2)   var(--space-4); font-size: var(--text-base);}

.btn-lg  { padding: var(--space-3)   var(--space-6); font-size: var(--text-md); }

/* Variants */

.btn-primary {

  background-color: var(--color-action-primary);

  color:            var(--color-text-inverse);

}

.btn-primary:hover  { background-color: var(--color-action-primary-hover); }

.btn-primary:active { background-color: var(--color-action-primary-active); transform: scale(0.98); }

.btn-primary:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }

.btn-secondary {

  background-color: transparent;

  border-color:     var(--color-border-default);

  color:            var(--color-text-primary);

}

.btn-ghost {

  background-color: transparent;

  color:            var(--color-text-secondary);

}

.btn-ghost:hover { background-color: var(--color-bg-subtle); }
Input
.input {

  width:         100%;

  padding:       var(--space-2) var(--space-3);

  border:        1px solid var(--color-border-default);

  border-radius: var(--radius-base);

  font-size:     var(--text-base);

  color:         var(--color-text-primary);

  background:    var(--color-bg-base);

  transition:    border-color var(--duration-fast) var(--ease-out),

                 box-shadow   var(--duration-fast) var(--ease-out);

}

.input:focus {

  outline:       none;

  border-color:  var(--color-border-focus);

  box-shadow:    0 0 0 3px rgba(var(--color-primary-500-rgb), 0.2);

}

.input[aria-invalid="true"] {

  border-color: var(--color-border-error);

}

.input::placeholder { color: var(--color-text-disabled); }


4. 접근성 (Accessibility)
4.1 WCAG 2.2 준수 레벨

4.2 접근성 체크리스트
키보드 내비게이션
모든 인터랙티브 요소가 Tab으로 접근 가능
논리적인 포커스 순서 (DOM 순서 = 시각적 순서)
focus-visible 표시 (:focus-visible 사용, :focus 미사용 권장)
모달/팝오버 내 포커스 트랩 (Focus Trap)
Escape 키로 팝오버/모달 닫기
시맨틱 HTML
<!-- ✅ Good -->

<button type="button" aria-label="알림 닫기">

  <svg aria-hidden="true">...</svg>

</button>

<!-- ❌ Bad -->

<div class="btn" onclick="...">닫기</div>

<!-- ✅ Good — 폼 레이블 연결 -->

<label for="email">이메일</label>

<input id="email" type="email" aria-describedby="email-error">

<p id="email-error" role="alert">올바른 이메일 형식을 입력하세요</p>
ARIA 사용 규칙
First Rule of ARIA: ARIA보다 네이티브 HTML이 우선
aria-label vs aria-labelledby: 텍스트가 화면에 없을 때 aria-label, 있을 때 aria-labelledby
동적 콘텐츠 변경: aria-live="polite" (긴급: assertive)
비활성화: disabled 대신 aria-disabled="true" (포커스 유지 필요 시)
색상 접근성
/* 고대비 모드 대응 */

@media (forced-colors: active) {

  .btn-primary {

    border: 2px solid ButtonText;

  }

}


5. 아이콘 시스템 (Icon System)
5.1 아이콘 원칙

5.2 권장 아이콘 라이브러리
Lucide Icons — MIT, 일관된 스트로크, SVG
Heroicons — MIT, Tailwind CSS와 궁합
Phosphor Icons — 6가지 굵기 변형

<!-- 장식 아이콘 -->

<svg aria-hidden="true" focusable="false" width="20" height="20">

  <use href="#icon-search" />

</svg>

<!-- 의미 아이콘 (텍스트 없을 때) -->

<button aria-label="검색">

  <svg aria-hidden="true" width="20" height="20">

    <use href="#icon-search" />

  </svg>

</button>


6. 반응형 디자인 전략 (Responsive Strategy)
6.1 Mobile First 원칙
/* Mobile: 기본값 */

.card { padding: var(--space-4); }

/* Tablet: 640px+ */

@media (min-width: 640px) {

  .card { padding: var(--space-6); }

}

/* Desktop: 1024px+ */

@media (min-width: 1024px) {

  .card { padding: var(--space-8); }

}
6.2 반응형 타이포그래피
/* Fluid Typography — clamp() 사용 */

:root {

  --text-display: clamp(2rem, 5vw + 1rem, 4rem);

  --text-h1:      clamp(1.5rem, 3vw + 1rem, 3rem);

  --text-h2:      clamp(1.25rem, 2vw + 1rem, 2rem);

}
6.3 터치 타겟 크기
Apple HIG & Google Material 기준: 최소 44×44px (iOS), 48×48dp (Android)

/* 시각적 크기는 작아도 터치 영역은 크게 */

.icon-btn {

  width:  44px;

  height: 44px;

  display: grid;

  place-items: center;

}


7. 성능 & 품질 가이드라인 (Performance)
7.1 Core Web Vitals 목표

7.2 이미지 최적화
<!-- Responsive Images -->

<img

  src="hero-800.webp"

  srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1200.webp 1200w"

  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"

  alt="설명"

  loading="lazy"

  decoding="async"

  width="800"

  height="600"

/>
7.3 Critical CSS 전략
<!-- 인라인 Critical CSS (above-the-fold) -->

<style>/* 초기 뷰포트 스타일만 */</style>

<!-- 나머지는 비동기 로딩 -->

<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">


8. 스켈레톤 & 로딩 상태 (Loading States)
/* Skeleton Animation */

@keyframes skeleton-pulse {

  0%, 100% { opacity: 1; }

  50%       { opacity: 0.4; }

}

.skeleton {

  background-color: var(--color-bg-muted);

  border-radius:    var(--radius-base);

  animation:        skeleton-pulse 1.5s ease-in-out infinite;

}

<!-- Skeleton Example -->

<article aria-busy="true" aria-label="콘텐츠 로딩 중">

  <div class="skeleton" style="height: 200px; margin-bottom: 16px;"></div>

  <div class="skeleton" style="height: 20px; width: 60%; margin-bottom: 8px;"></div>

  <div class="skeleton" style="height: 16px; width: 80%;"></div>

</article>


9. 다국어 & 국제화 (i18n)
/* RTL 대응 — Logical Properties 사용 */

/* ❌ 방향 고정 */

.card { margin-left: 16px; padding-right: 12px; }

/* ✅ 논리 속성 */

.card { margin-inline-start: 16px; padding-inline-end: 12px; }

/* RTL 레이아웃 */

[dir="rtl"] .icon-left { transform: scaleX(-1); }

/* 다국어 폰트 */

:root {

  --font-body: 

    'Pretendard Variable',    /* 한국어 */

    'Noto Sans JP',           /* 일본어 */

    'PingFang SC',            /* 중국어 간체 */

    'Apple SD Gothic Neo',    /* macOS 한국어 폴백 */

    sans-serif;

}


10. 디자인 검토 기준 (Design Review Checklist)
컴포넌트 완성도
모든 상태 (default, hover, focus, active, disabled, error, loading) 정의됨
다크 모드 대응됨
모바일/태블릿/데스크톱 레이아웃 검토됨
빈 상태(Empty State) 디자인 존재함
오류 상태(Error State) 디자인 존재함
접근성
색상 대비 비율 WCAG AA 통과
키보드만으로 모든 기능 사용 가능
스크린리더로 테스트 완료 (VoiceOver / NVDA)
포커스 순서가 논리적
모든 이미지에 alt 텍스트
성능
이미지 WebP 포맷 사용
폰트 font-display: swap 설정
Lighthouse 점수: Performance ≥ 90
코드 품질
디자인 토큰만 사용 (하드코딩된 색상/크기 없음)
시맨틱 HTML 사용
BEM 또는 합의된 CSS 방법론 사용


11. 버전 & 변경 이력 (Changelog)



참고 자료 & 각주
¹ 가독성 최적 행 길이: Robert Bringhurst, The Elements of Typographic Style, 4th ed., p.26 — "45~75자가 단단 조판의 만족스러운 행 길이" ² 8px Grid System: Google Material Design 3 — m3.material.io/foundations/layout/understanding-layout/spacing ³ Motion Design Principles: Google Material Motion — m3.material.io/styles/motion/overview; Val Head, Designing Interface Animation, Rosenfeld Media, 2016 ⁴ WCAG 2.2: W3C Web Content Accessibility Guidelines — www.w3.org/TR/WCAG22 ⁵ Core Web Vitals: Google Search Central — web.dev/vitals ⁶ Atomic Design: Brad Frost, Atomic Design, 2016 — atomicdesign.bradfrost.com ⁷ Color Systems (HSL): Refactoring UI, Adam Wathan & Steve Schoger, 2018 ⁸ Touch Target Sizes: Apple HIG — developer.apple.com/design/human-interface-guidelines; Google Material Accessibility — 48dp minimum ⁹ CSS Logical Properties (RTL): MDN Web Docs — developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values ¹⁰ Fluid Typography (clamp): Utopia.fyi — utopia.fyi/type/calculator



이 문서는 프로젝트의 단일 진실 공급원(Single Source of Truth)입니다. 변경 시 반드시 버전을 올리고 변경 이력을 기록하세요.
