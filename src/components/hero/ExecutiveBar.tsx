"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glass";
import { FileText, Sparkles } from "lucide-react";

export interface ExecutiveBarProps {
  className?: string;
  onResumeClick?: () => void;
}

export const ExecutiveBar: React.FC<ExecutiveBarProps> = ({
  className,
  onResumeClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      <GlassPanel
        intensity="heavy"
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between p-6 md:px-8 md:py-6 border-white/15"
      >
        {/* Left Segment: Name & Role */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Akshay
            </h1>
            <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
          </div>
          <p className="text-xs md:text-sm font-medium text-slate-400 tracking-wide">
            Full-Stack &amp; AI Agent Engineer
          </p>
        </div>

        {/* Middle Segment: Executive Metrics & Status Badges */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <GlassBadge variant="emerald" dot>
            Available for Opportunities
          </GlassBadge>
          <GlassBadge variant="titanium">
            B.Tech IT @ CUCEK
          </GlassBadge>
          <GlassBadge variant="titanium">
            Photography Club Lead
          </GlassBadge>
        </div>

        {/* Right Segment: Primary Call to Action */}
        <div className="flex items-center shrink-0">
          <GlassButton
            variant="primary"
            size="lg"
            icon={<FileText className="h-5 w-5" />}
            onClick={onResumeClick}
            aria-label="View Resume"
            className="w-full md:w-auto"
          >
            View Resume
          </GlassButton>
        </div>
      </GlassPanel>
    </motion.div>
  );
};
