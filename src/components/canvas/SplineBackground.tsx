"use client";

import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Spline so the heavy WebGL runtime is never server-side rendered
// and is code-split into its own chunk.
const Spline = lazy(() => import("@splinetool/react-spline"));

const SCENE_URL = "https://prod.spline.design/6mllpWi7EcbIoe-G/scene.splinecode";

/**
 * LoadingFallback — shown while Spline runtime is downloading.
 * Uses a subtle titanium radial glow that fades out once the scene is live.
 * Matches brand: #11172A titanium dark + #10B981 emerald accent.
 */
function LoadingFallback({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="spline-loader"
          className="fixed inset-0 -z-40 pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          aria-hidden="true"
        >
          {/* Deep titanium base */}
          <div className="absolute inset-0 bg-[#11172A]" />

          {/* Emerald radial core glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.03) 40%, transparent 70%)",
            }}
          />

          {/* Titanium vignette edge */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 50%, rgba(11,15,30,0.6) 100%)",
            }}
          />

          {/* Subtle pulsing indicator dot */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-emerald-400/60"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="h-1 w-1 rounded-full bg-emerald-400/40"
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-emerald-400/60"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * SplineBackground — renders a live Spline 3D scene as a fixed full-viewport
 * background layer behind all page content.
 *
 * Pointer-event strategy (ui-ux-pro-max compliant):
 * ─ The outer wrapper uses `pointer-events-none` so that the background
 *   NEVER intercepts clicks on foreground buttons, inputs, or cards.
 * ─ The inner Spline canvas uses `pointer-events-auto` to allow orbital
 *   drag / scroll physics to fire when the user interacts with the 3D scene
 *   in areas not covered by foreground elements.
 * ─ All foreground content (page.tsx children) must sit in a stacking
 *   context above z-0; the canvas lives at -z-50.
 *
 * Z-index scale (ui-ux-pro-max §Z-Index Management):
 *   -z-50  → Spline canvas (deepest)
 *   -z-40  → Loading fallback
 *    z-0   → Page content
 *    z-10  → GlassCard / GlassPanel overlays
 *    z-50  → Modals / drawers
 */
export function SplineBackground() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Loading shimmer — fades out once scene fires onLoad */}
      <LoadingFallback visible={!isLoaded} />

      {/* Spline scene container */}
      <div
        className="fixed inset-0 -z-50 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-full h-full pointer-events-auto">
          <Suspense fallback={null}>
            <Spline
              scene={SCENE_URL}
              onLoad={() => setIsLoaded(true)}
              style={{ width: "100%", height: "100%" }}
            />
          </Suspense>
        </div>
      </div>

      {/* Titanium vignette overlay — sharpens contrast at edges for WCAG 4.5:1 */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 130% 110% at 50% 50%, transparent 40%, rgba(11,15,30,0.55) 80%, rgba(11,15,30,0.85) 100%)",
        }}
      />
    </>
  );
}
