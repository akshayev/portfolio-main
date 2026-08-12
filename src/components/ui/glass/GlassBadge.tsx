import React from "react";
import { cn } from "@/lib/utils";

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "emerald" | "titanium" | "outline";
  className?: string;
  dot?: boolean;
}

export const GlassBadge = React.forwardRef<HTMLSpanElement, GlassBadgeProps>(
  ({ children, variant = "emerald", className, dot = false, ...props }, ref) => {
    const variantClasses = {
      emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
      titanium: "bg-slate-800/60 text-slate-300 border-white/10",
      outline: "bg-transparent text-emerald-400 border-emerald-500/40",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md transition-all duration-200 select-none",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {dot && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        )}
        {children}
      </span>
    );
  }
);

GlassBadge.displayName = "GlassBadge";
