"use client";

/**
 * GlobalCanvas — thin client wrapper that dynamically loads SplineSceneWrapper.
 *
 * Why this exists:
 *   Next.js 15 App Router prohibits `next/dynamic` with `{ ssr: false }` inside
 *   Server Components (like layout.tsx). The pattern is to push the dynamic()
 *   call into a "use client" boundary, then import THAT from layout.tsx.
 */

import dynamic from "next/dynamic";

const SplineSceneWrapper = dynamic(
  () => import("@/components/canvas/SplineSceneWrapper").then((m) => ({ default: m.SplineSceneWrapper })),
  { ssr: false }
);

export function GlobalCanvas() {
  return <SplineSceneWrapper />;
}
