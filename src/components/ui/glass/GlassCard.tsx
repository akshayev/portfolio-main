"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  glowOnHover?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      enableTilt = true,
      glowOnHover = true,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableTilt) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      x.set(xPct);
      y.set(yPct);

      if (onMouseMove) onMouseMove(e as any);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
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
          glowOnHover && "hover:border-emerald-500/30 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]",
          className
        )}
        {...props}
      >
        {/* Subtle radial emerald background glow on hover */}
        {glowOnHover && (
          <div
            className={cn(
              "pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500",
              isHovered && "opacity-100"
            )}
            style={{
              background:
                "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16,185,129,0.08), transparent 40%)",
            }}
          />
        )}
        <div style={{ transform: "translateZ(20px)" }}>{children}</div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
