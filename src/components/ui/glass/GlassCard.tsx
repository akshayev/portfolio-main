"use client";

import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  HTMLMotionProps,
  MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Spring config shared for both global and local tilt modes
const SPRING_CONFIG = { stiffness: 280, damping: 28, mass: 0.6 };

// Max rotation angle in degrees applied to the card tilt
const MAX_TILT_DEG = 7;

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  glowOnHover?: boolean;
  /**
   * Optional global X MotionValue from useSpatialTracking (−1 to 1).
   * When provided, local mouse tracking is disabled in favour of the
   * global spatial input (shared mouse or gyroscope).
   */
  globalX?: MotionValue<number>;
  /**
   * Optional global Y MotionValue from useSpatialTracking (−1 to 1).
   */
  globalY?: MotionValue<number>;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      enableTilt = true,
      glowOnHover = true,
      globalX,
      globalY,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    // ── Local mouse tracking (used only when no global input is provided) ──
    const localX = useMotionValue(0);
    const localY = useMotionValue(0);

    // Source is global (from useSpatialTracking) when provided, else local
    const sourceX = globalX ?? localX;
    const sourceY = globalY ?? localY;

    // Spring-smooth the source values — handles choppy gyroscope polling gracefully
    const springX = useSpring(sourceX, SPRING_CONFIG);
    const springY = useSpring(sourceY, SPRING_CONFIG);

    // Map [−1, 1] → [−MAX_TILT_DEG, +MAX_TILT_DEG] in degrees
    const rotateY = useTransform(
      springX,
      [-1, 1],
      [`-${MAX_TILT_DEG}deg`, `${MAX_TILT_DEG}deg`]
    );
    const rotateX = useTransform(
      springY,
      [-1, 1],
      [`${MAX_TILT_DEG}deg`, `-${MAX_TILT_DEG}deg`]
    );

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      // Only run local tracking if no global source is provided
      if (!globalX && !globalY && enableTilt) {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width * 2 - 1;
        const ny = (e.clientY - rect.top) / rect.height * 2 - 1;
        localX.set(nx);
        localY.set(ny);
      }
      if (onMouseMove) onMouseMove(e as any);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      // Only reset local values if we're in local tracking mode
      if (!globalX && !globalY) {
        localX.set(0);
        localY.set(0);
      }
      if (onMouseLeave) onMouseLeave(e as any);
    };

    return (
      <motion.div
        ref={ref}
        style={{
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "glass-panel glass-card-reflection relative overflow-hidden rounded-2xl p-6 transition-colors duration-300",
          glowOnHover &&
            "hover:border-emerald-500/30 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]",
          className
        )}
        {...props}
      >
        {/* Radial emerald glow overlay on hover */}
        {glowOnHover && (
          <div
            className={cn(
              "pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500",
              isHovered && "opacity-100"
            )}
            style={{
              background:
                "radial-gradient(600px circle at 50% 50%, rgba(16,185,129,0.08), transparent 40%)",
            }}
          />
        )}
        <div style={{ transform: "translateZ(20px)" }}>{children}</div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
