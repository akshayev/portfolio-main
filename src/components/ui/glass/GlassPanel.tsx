import React from "react";
import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

/**
 * GlassPanel (Neo-Glass Edition)
 * High-contrast deep space titanium (#0B0F19), ultra-thin borders (border-white/5),
 * backdrop-blur-md, and subtle emerald hover glow.
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className, intensity = "medium", ...props }, ref) => {
    const intensityClasses = {
      light:
        "bg-[#0B0F19]/70 backdrop-blur-sm border-white/5 hover:border-emerald-500/20 hover:bg-[#0B0F19]/85",
      medium:
        "bg-[#0B0F19]/85 backdrop-blur-md border-white/5 hover:border-emerald-500/30 hover:bg-[#0B0F19]/95 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]",
      heavy:
        "bg-[#0B0F19]/95 backdrop-blur-lg border-white/10 hover:border-emerald-500/40 hover:bg-[#0B0F19] hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border p-8 text-slate-100 transition-all duration-300",
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
