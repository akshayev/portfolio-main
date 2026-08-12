"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────
// Gyroscope clamping range in degrees.
// Most comfortable tilt range before exceeding natural wrist motion.
const GYRO_CLAMP_DEG = 30;

// Natural resting beta (phone held upright at ~45° off horizontal)
const GYRO_BETA_OFFSET = 45;

// ─── Types ────────────────────────────────────────────────────────────────────
// iOS 13+ exposes requestPermission as a static method on DeviceOrientationEvent.
// Standard TypeScript lib types do not include this — we extend safely.
type DeviceOrientationEventStatic = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Clamps a value to [−max, +max] then normalizes it to [−1, +1].
 *
 * @example clampNormalize(15, 30) → 0.5
 * @example clampNormalize(-45, 30) → -1
 */
function clampNormalize(value: number, clampMax: number): number {
  const clamped = Math.max(-clampMax, Math.min(clampMax, value));
  return clamped / clampMax;
}

/**
 * Requests iOS 13+ gyroscope permission from the DeviceOrientationEvent API.
 *
 * MUST be called inside a direct user gesture (button click) — browsers will
 * silently reject the prompt if not user-initiated.
 *
 * Safe on desktop: if `requestPermission` is undefined (non-iOS), resolves immediately.
 * Safe on Android: Android does not gate DeviceOrientationEvent behind permission.
 *
 * @throws Error if permission is denied by the user.
 */
export async function requestGyroPermission(): Promise<void> {
  const DOE = DeviceOrientationEvent as DeviceOrientationEventStatic;

  if (typeof DOE.requestPermission === "function") {
    const result = await DOE.requestPermission();
    if (result !== "granted") {
      throw new Error("Gyroscope permission was denied by the user.");
    }
  }
  // Non-iOS / non-gated: permission is implicit — nothing to do.
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useSpatialTracking
 *
 * Returns normalized Framer Motion MotionValues `x` and `y` (range: −1 to 1)
 * that reflect the user's spatial input:
 *
 * - Desktop: cursor position mapped across the viewport.
 * - Mobile:  device tilt via DeviceOrientation API (Gamma → X, Beta → Y).
 *
 * The caller is responsible for applying `useSpring` if smoothing is desired
 * at a granular level (e.g. per-card spring stiffness), though the values
 * themselves already update at the hardware polling rate.
 */
export function useSpatialTracking() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
      // ── Desktop: Mouse Tracking ──────────────────────────────────────────
      // Map cursor X/Y across the full viewport to [−1, 1].
      // nx = (cursorX / viewportWidth) * 2 - 1
      const handleMouseMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        x.set(nx);
        y.set(ny);
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    } else {
      // ── Mobile: Gyroscope / DeviceOrientation ────────────────────────────
      // gamma: device tilt left/right  (range −90° → +90°, we use ±30°)
      // beta:  device tilt front/back  (range −180° → +180°, centred at 45°)
      //
      // Normalization formula:
      //   clampNormalize(raw, GYRO_CLAMP_DEG) = clamp(raw, ±30) / 30
      //   → output range: [−1, +1]
      //
      // Beta offset: A phone "at rest" in a natural upright grip sits at ~45°,
      // not 0°. We subtract GYRO_BETA_OFFSET so the resting position maps to y=0.
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null) {
          x.set(clampNormalize(e.gamma, GYRO_CLAMP_DEG));
        }
        if (e.beta !== null) {
          const centeredBeta = e.beta - GYRO_BETA_OFFSET;
          y.set(clampNormalize(centeredBeta, GYRO_CLAMP_DEG));
        }
      };

      window.addEventListener("deviceorientation", handleOrientation, {
        passive: true,
      });

      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }
  }, [x, y]);

  return { x, y };
}
