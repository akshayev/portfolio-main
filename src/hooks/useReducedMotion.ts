"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to the OS-level `prefers-reduced-motion` media query.
 *
 * Returns `true` when the user has requested reduced motion (e.g. macOS
 * System Settings → Accessibility → Display → Reduce motion, or the
 * equivalent Windows/Android/iOS toggle).
 *
 * Uses `useSyncExternalStore` so the value stays in sync with the OS
 * preference even if the user toggles it while the page is already open.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    // subscribe: attaches the listener and returns a cleanup function
    (callback: () => void) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

      // Modern browsers: addEventListener("change", …)
      // Legacy fallback: addListener(…)
      const handler = () => {
        callback();
      };

      if (mql.addEventListener) {
        mql.addEventListener("change", handler);
      } else {
        mql.addListener(handler);
      }

      return () => {
        if (mql.removeEventListener) {
          mql.removeEventListener("change", handler);
        } else {
          mql.removeListener(handler);
        }
      };
    },
    // getSnapshot: read the current value on every render
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
    // getServerSnapshot: used during SSR (default to false = motion allowed)
    () => false
  );
}
