# 🚀 Developer Handoff & Setup Guide

This document contains all the critical context, architectural decisions, and setup instructions needed to seamlessly run and develop this portfolio on any IDE or machine.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router) & React 19
- **Styling:** Tailwind CSS v4
- **3D Engine:** Spline (`@splinetool/react-spline`)
- **Animations:** GSAP (`@gsap/react`, `ScrollTrigger`) & Framer Motion
- **CMS:** Sanity (Currently configured with a graceful local fallback mock)

---

## 💻 Quick Start (For a New IDE / Machine)

Because this project uses the cutting-edge **Next.js 15 and React 19**, some third-party packages (like Three.js/Spline helpers) haven't fully updated their peer dependencies. **You MUST use the `--legacy-peer-deps` flag when installing.**

```bash
# 1. Install dependencies safely
npm install --legacy-peer-deps

# 2. Setup Environment Variables
# Copy the example env file. (The "placeholder" ID safely triggers the mock data interceptor)
cp .env.local.example .env.local

# 3. Start the dev server
npm run dev
```

---

## 🏗 Key Architectural Decisions (Read Before Editing)

### 1. Global 3D Spline Canvas (`src/components/canvas/`)
To achieve the continuous Awwwards-winning 3D scroll effect (where the keyboard rotates and persists across sections), the 3D canvas is **not** inside the Hero component.
- **`GlobalCanvas.tsx`**: A client-side boundary that dynamically imports the scene. This is required because Next.js 15 Server Components do not allow `next/dynamic` with `ssr: false`.
- **`SplineSceneWrapper.tsx`**: Contains the actual `<Spline>` component and the GSAP `ScrollTrigger` timeline. It is mounted at `-z-50` (behind all content) and relies on transparent section backgrounds (`bg-transparent`) in `page.tsx` to remain visible.

### 2. GSAP ScrollTrigger Integration
GSAP animations are hooked into the `Spline` application instance. If you need to change how the keyboard rotates when scrolling down to the "Skills" or "Projects" sections, edit the `useGSAP` timeline inside `src/components/canvas/SplineSceneWrapper.tsx`.

### 3. Sanity CMS Fallback Interceptor
You do not need Sanity credentials to work on the UI! 
In `src/sanity/client.ts`, we've implemented an interceptor. If `NEXT_PUBLIC_SANITY_PROJECT_ID="placeholder"`, it intercepts `client.fetch()` and returns high-quality mock data for the projects and experience timelines.

---

## 🚨 Troubleshooting & Known "Gotchas"

1. **White Page / Broken CSS on Load:**
   If you ever run `npm run dev` and see a plain white page with black text, it means your previous dev server crashed but locked the port, preventing Tailwind CSS from compiling.
   *Fix:* Kill the stuck port process: `npx kill-port 3000` or `pkill -f node`, then restart `npm run dev`.

2. **Next.js 15 SWC Import Bug:**
   In `GlobalCanvas.tsx` and `SplineBackground.tsx`, you will see this specific import syntax:
   `const importSpline = () => import("@splinetool/react-spline");`
   Do **not** change this to an inline `dynamic(() => import(...))`. The Next.js 15 SWC compiler incorrectly rewrites inline dynamic imports to `require()`, which breaks the Spline package. The variable extraction is a deliberate workaround.

3. **Pointer Events:**
   The `SplineSceneWrapper` uses `pointer-events-none` on the container and `pointer-events-auto` on the canvas. This ensures the 3D object can be rotated by the mouse, but doesn't block you from clicking HTML buttons layered on top.
