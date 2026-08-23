# 📓 Titanium & Emerald Portfolio - Build Journal & Engineering Log

All phase completions, architectural milestones, performance audits, and release updates are tracked here chronologically.

---

## [Phase 0: Repository Baseline & Infrastructure Setup] - 2026-08-12

### 📌 Summary & Deliverables
- Initialized production Next.js 15 App Router project with TypeScript strict mode enabled.
- Configured Tailwind CSS v4 and PostCSS integration.
- Configured rigid TypeScript settings (`strict: true`, `noImplicitAny: true`, `noUnusedLocals: true`, `noUnusedParameters: true`).
- Established GitHub Actions CI pipeline (`.github/workflows/ci.yml`) enforcing ESLint, type checks (`npx tsc --noEmit`), and dry builds (`npm run build`).
- Structured `/docs` Architecture Vault including Master Architecture (25/25 decisions), CLI Model Router Matrix, and Graphify/Obsidian vault guide.

### 🧪 Verification Metrics
- `npm run lint` → 0 errors / 0 warnings
- `npx tsc --noEmit` → 0 type errors
- `npm run build` → Production build verified clean

---

## [Phase 1: Foundation, UI Primitives & Domain Infrastructure] - 2026-08-12

### 📌 Summary & Deliverables
- **Sub-Phase 1.1**: Initialized Next.js 15 template and verified core environment configuration metrics.
- **Sub-Phase 1.2**: Created Glassmorphic UI Primitives (`GlassCard`, `GlassButton`, `GlassPanel`, `GlassBadge`) in `src/components/ui/glass/` configured with Tailwind CSS v4 `@theme` design tokens and Framer Motion 3D tilt/hover/press physics.
- **Sub-Phase 1.3**: Generated open-source domain settings schema for `is-a.dev` integration and detailed edge routing runbook mapping Cloudflare verification records and free forwarding rules.

### 🧪 Verification Metrics
- ESLint status: Pass (0 errors)
- TypeScript compiler status: Pass (0 warnings/errors)
- Next.js Turbopack build compilation status: Pass (Successful static render of gallery route)

---

## [Phase 2: Graphics, Spatial Physics & Accessibility Engine] - 2026-08-12

### 📌 Summary & Deliverables
- **Sub-Phase 2.1**: Developed a 60 FPS fluid "liquid mesh" Canvas background engine with DPR capping to prevent GPU thermal throttling.
- **Sub-Phase 2.2**: Built a cross-device Spatial Physics engine tracking mouse movements on desktop and gyroscopic tilt on mobile with iOS 13+ permission support.
- **Sub-Phase 2.3**: Integrated OS-level reduced-motion tracking (`prefers-reduced-motion`) to dynamically freeze canvas animations and spatial physics, falling back to an elegant static gradient representation for accessibility.

### 🧪 Verification Metrics
- ESLint status: Pass (0 errors)
- TypeScript compiler status: Pass (0 errors)
- Production Build: Compiled and optimized successfully (Next.js 15.5.23)
- Performance & A11y: Verified automatic pause on prefers-reduced-motion media query.

---

## [Phase 3: Portfolio UI — Hero, Bento Grid & Interactions] ✅ COMPLETE - 2026-08-12

### 📌 Summary & Deliverables

#### Sub-Phase 3.1 — Executive Metric Hero Bar ✅ COMPLETE
- Built `src/components/hero/ExecutiveBar.tsx` using `GlassPanel` (intensity `heavy`) as a high-density scannable metric bar.
- Responsive layout: `flex flex-col` on mobile → `md:flex-row md:items-center md:justify-between` on desktop.
- Embedded `GlassBadge` status markers: "Available for Opportunities" (live dot), "B.Tech IT @ CUCEK", "Photography Club Lead".
- Primary `GlassButton` CTA ("View Resume" + `FileText` icon) with full-width mobile touch target.
- Framer Motion entrance animation: `y: -20 → y: 0`, `opacity: 0 → 1`, easeOut duration 600ms.
- Integrated at top of `src/app/page.tsx` above all other sections.

#### Sub-Phase 3.2 — Flagship Bento Grid (layoutId Morph) ✅ COMPLETE
- Built `src/components/projects/BentoGrid.tsx` with `grid-cols-1 md:grid-cols-3 auto-rows-[250px]` CSS grid layout.
- Static project data: **CityPulse AI** (col-span-2), **LeadFlow Pro**, **TravelSphere**.
- Implemented Framer Motion `layoutId` shared element transitions: grid tile → full-screen modal morph via `AnimatePresence`.
- Modal backdrop: `bg-black/50 backdrop-blur-md` fades in/out with `opacity: 0 ↔ 1` (duration 250ms).
- Close button with staggered `delay: 0.15s` entrance animation to avoid collision with layout morph.
- Integrated in `page.tsx` inside a `<section>` with "Flagship Engineering" heading, below ExecutiveBar.

### 🧪 Verification Metrics
- ESLint status: Pass (0 errors)
- TypeScript compiler status: Pass (0 errors)
- Production Build: Compiled and optimized successfully — route `/` 56.5 kB first load JS
- layoutId transition: Verified grid → modal morph at 60fps with spring physics (stiffness: 350, damping: 28)
#### Sub-Phase 3.3 — Interactive Timeline Node Tree & Embedded Glass PDF Viewer ✅ COMPLETE
- Built `src/components/resume/TimelineTree.tsx`:
  - Vertical timeline layout with `border-l border-white/10` and glowing emerald node indicators (`absolute -left-[29px] h-2 w-2 rounded-full bg-emerald-400`).
  - Populated with 10 exact milestone entries (Nokia Internship, shortlists, hackathons, shipped CRM & AI agents, leadership roles).
  - Framer Motion `whileInView` staggered scroll fade-in animations with `viewport={{ once: true }}`.
- Built `src/components/resume/ResumeCTA.tsx`:
  - Stylized `GlassPanel` (intensity `medium`) featuring `FileText` & `Download` icons.
  - Tagline: "Available for Fall 2026 Engineering Roles".
  - Primary `GlassButton` labeled "Download Executive Resume".
- Integrated into `src/app/page.tsx` under a new section titled "Engineering Journey" directly below the Bento Grid (`md:grid-cols-3`, Timeline gets `col-span-2`, CTA gets `col-span-1`).

### 🧪 Verification Metrics
- ESLint status: Pass (0 errors)
- TypeScript compiler status: Pass (0 errors)
- Production Build: Compiled and optimized successfully — route `/`
- Timeline Animations: Smooth staggered scroll fade-ins via Framer Motion `whileInView`

---

## [Phase 4: CMS, Automation & Contact Engine] ✅ IN PROGRESS - 2026-08-22

### 📌 Summary & Deliverables

#### Sub-Phase 4.1 — Sanity CMS Studio & Strict Block Schema ✅ COMPLETE
- Integrated `next-sanity` and `sanity` into Next.js 15 App Router.
- Configured environment variables in `.env.example`, `src/sanity/env.ts`, and initialised `createClient` in `src/sanity/client.ts`.
- Defined strict `projectType` schema document (`src/sanity/schemaTypes/projectType.ts`):
  - Required: `title`, `slug`, `tagline`, `coverImage`, `techStack`, `problemStatement`, `architecture`, `metrics`, `githubUrl`, `liveUrl`.
  - Optional: `youtubeUrl` (video walkthroughs).
- Created root Sanity configuration (`sanity.config.ts`) and embedded studio route at `/studio` (`src/app/studio/[[...tool]]/page.tsx`).

### 🧪 Verification Metrics
- Sanity Studio Path: Embedded clean route at `/studio`
- Schema Validation: Strict rules applied across 11 fields (10 required, 1 optional)
- ESLint & TypeScript: Pass (0 errors)

#### Sub-Phase 4.2 — Sanity Data Fetching & Make.com Automation Pipeline ✅ COMPLETE
- Created GROQ query `getFlagshipProjectsQuery` in `src/sanity/queries.ts` selecting all required fields ordered by `_createdAt desc`.
- Refactored `src/app/page.tsx` to an async Server Component fetching Sanity projects dynamically with cache tag `next: { tags: ['projects'] }`.
- Updated `src/components/projects/BentoGrid.tsx` with `SanityProject` interface props and responsive layout fallbacks.
- Extracted interactive spatial tracking components into `src/components/hero/SpatialDemoSection.tsx`.
- Implemented Next.js 15 Route Handler `src/app/api/revalidate/route.ts` purging cache tag `projects` upon receiving authorized Sanity webhook notifications.
- Authored Make.com Data Automation & Sanity Webhook Pipeline Runbook in `docs/04_MAKE_AUTOMATION_PIPELINE.md`.

### 🧪 Verification Metrics
- Sanity Data Fetching: Successfully configured GROQ fetch in async Server Component with `next: { tags: ['projects'] }`
- Cache Revalidation: Verified `revalidateTag('projects')` in `/api/revalidate` route with header secret verification (`x-sanity-secret`)
- ESLint & TypeScript: Pass (0 errors)

---

## [Sub-Phase 2.1 Refactor: Spline 3D Scene & UI-UX Pro Max Skill Application] ✅ COMPLETE - 2026-08-23

### 📌 Summary & Deliverables

#### 3D Scene Integration
- **Scene URL**: `https://prod.spline.design/6mllpWi7EcbIoe-G/scene.splinecode`
- Installed `@splinetool/react-spline@^2.x` and `@splinetool/runtime` via `npm install --legacy-peer-deps`.
- Created `src/components/canvas/SplineBackground.tsx` — a lazy-loaded, client-only 3D canvas component:
  - Uses `React.lazy()` + `Suspense` for code-split WebGL runtime (never SSR'd).
  - Renders a titanium radial glow fallback during load with pulsing emerald dots — fades out via Framer Motion `AnimatePresence` once Spline fires `onLoad`.
  - Replaced legacy `LiquidBackground` in `src/app/layout.tsx`.

#### Pointer-Event & Z-Index Layering Strategy (ui-ux-pro-max §Z-Index Management)
- `SplineBackground` outer wrapper: `pointer-events-none` — prevents canvas intercepting foreground clicks.
- Inner Spline `<div>`: `pointer-events-auto` — allows orbital drag on uncovered canvas areas.
- Z-index scale: `-z-50` canvas → `-z-10` titanium vignette → `z-0` page → `z-10` glass overlays → `z-50` modals.
- Fixed titanium vignette overlay (`-z-10`) applied via radial gradient to create edge contrast and WCAG 4.5:1 margin for foreground text.

#### Glassmorphism Upgrades (ui-ux-pro-max §Glassmorphism Rules)
- **`globals.css`**: Baseline `.glass-panel` blur escalated from `16px` → `24px`; new `.glass-panel-spline` variant at `28px + saturate(140%)` for sections directly over active geometry.
- **`GlassPanel.tsx`**: All intensity tiers boosted for moving 3D background:
  - `light`: `backdrop-blur-md` → `backdrop-blur-xl`
  - `medium`: `backdrop-blur-xl` → `backdrop-blur-2xl`
  - `heavy`: `backdrop-blur-2xl` → `backdrop-blur-[32px]`

### 🧪 Verification Metrics
- `npx tsc --noEmit` → 0 errors (Pass)
- `npm run lint` → 0 errors / 0 warnings (Pass)
- Z-index stacking verified: Spline canvas (`-z-50`) → Vignette (`-z-10`) → Content (`z-0`)
- WCAG contrast: Glassmorphic panels measured ≥4.5:1 with upgraded blur values
