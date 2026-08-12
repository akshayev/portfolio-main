import React from "react";
import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className, intensity = "medium", ...props }, ref) => {
    const intensityClasses = {
      light: "bg-slate-900/40 backdrop-blur-md border-white/5",
      medium: "bg-slate-900/70 backdrop-blur-xl border-white/10 shadow-2xl",
      heavy: "bg-slate-950/85 backdrop-blur-2xl border-white/15 shadow-2xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl border p-8 text-slate-100 transition-all duration-300",
          intensityClasses[intensity],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";
