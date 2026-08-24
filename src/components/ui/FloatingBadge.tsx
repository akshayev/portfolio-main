"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FloatingBadgeProps {
  text: string;
  icon?: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * FloatingBadge — A floating spatial pill badge with endless Y-axis motion.
 * Replicates the floating tech badge aesthetic of high-end 3D portfolios.
 */
export function FloatingBadge({
  text,
  icon,
  delay = 0,
  className,
}: FloatingBadgeProps) {
  return (
    <motion.div
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0B0F19]/80 px-4 py-2 font-mono text-xs sm:text-sm font-medium text-emerald-400 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)] select-none transition-colors duration-300 hover:border-emerald-500/40 hover:bg-[#0B0F19]/95",
        className
      )}
    >
      {icon && <span className="shrink-0 text-emerald-400">{icon}</span>}
      <span>{text}</span>
    </motion.div>
  );
}
