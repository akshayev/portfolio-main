"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor — Awwwards-style floating geometric cursor.
 *
 * Architecture:
 *  - Raw mouse position stored in MotionValues (no React state → zero re-renders)
 *  - `useSpring` adds a cinematic spring-follow: stiffness:150 damping:15 = snappy but alive
 *  - Outer ring: mix-blend-difference inverts colors against text for maximum contrast
 *  - Inner dot: follows instantly, giving a precise "target" point visual
 *  - Both layers are pointer-events-none z-[9999] so they never block interactions
 *  - Hidden on touch/small devices via CSS (hidden md:block) so mobile is unaffected
 */
export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Raw mouse position — updated directly, no state batching latency
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Spring-followed position for the outer ring (laggy, cinematic)
  const springX = useSpring(rawX, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(rawY, { stiffness: 150, damping: 15, mass: 0.1 });

  // Inner dot follows with tighter spring (near-instant)
  const dotX = useSpring(rawX, { stiffness: 500, damping: 28, mass: 0.05 });
  const dotY = useSpring(rawY, { stiffness: 500, damping: 28, mass: 0.05 });

  useEffect(() => {
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    // Expand ring when hovering interactive elements
    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [role='button'], input, textarea, select, [tabindex]")
      ) {
        setIsHovering(true);
      }
    };

    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [role='button'], input, textarea, select, [tabindex]")
      ) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onEnter, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onEnter);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [rawX, rawY]);

  // SSR guard — never render on server
  if (!mounted) return null;

  return (
    <>
      {/* ── Outer glowing ring — spring-lagged, mix-blend-difference ── */}
      <motion.div
        className="pointer-events-none fixed z-[9999] hidden md:block"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: "50%",
          border: "1.5px solid rgba(255, 255, 255, 0.85)",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
        animate={{
          width: isHovering ? 56 : 36,
          height: isHovering ? 56 : 36,
          borderColor: isHovering
            ? "rgba(52, 211, 153, 0.9)"
            : "rgba(255, 255, 255, 0.85)",
          boxShadow: isHovering
            ? "0 0 18px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.2)"
            : "0 0 10px rgba(255, 255, 255, 0.15)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* ── Inner precision dot — near-instant follow, emerald glow ── */}
      <motion.div
        className="pointer-events-none fixed z-[9999] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: "rgba(52, 211, 153, 1)",
          boxShadow: "0 0 8px rgba(16, 185, 129, 0.8)",
          willChange: "transform",
        }}
      />
    </>
  );
}
