"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className,
      icon,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
      md: "px-5 py-2.5 text-sm rounded-xl gap-2",
      lg: "px-7 py-3.5 text-base rounded-2xl gap-2.5 font-semibold",
    };

    const variantClasses = {
      primary:
        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 hover:border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_28px_rgba(16,185,129,0.35)]",
      secondary:
        "bg-slate-800/60 text-slate-200 border border-white/10 hover:bg-slate-700/60 hover:border-white/20 hover:text-white shadow-lg",
      outline:
        "bg-transparent text-slate-300 border border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:text-emerald-300",
      ghost:
        "bg-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.96, y: 1 }}
        transition={{ type: "spring", stiffness: 450, damping: 20 }}
        className={cn(
          "inline-flex items-center justify-center font-medium backdrop-blur-md transition-all duration-200 outline-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";
