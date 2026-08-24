"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glass";
import { FileText, Sparkles } from "lucide-react";

export interface ExecutiveBarProps {
  className?: string;
  onResumeClick?: () => void;
}

// Akshay's real tech stack, grouped by category
const SKILL_GROUPS = [
  {
    label: "Frontend",
    skills: ["TypeScript", "React", "Next.js", "Streamlit"],
  },
  {
    label: "Backend & Data",
    skills: ["Python", "FastAPI", "SQL", "C++", "Supabase"],
  },
  {
    label: "Cloud & Tools",
    skills: ["Azure", "Power Platform", "Vercel", "Render"],
  },
] as const;

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
        className="flex flex-col gap-6 p-6 md:px-8 md:py-7 border-white/15"
      >
        {/* Top Row: Name, Role & CTA */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Akshay EV
              </span>
              <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" aria-hidden="true" />
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-400 tracking-wide">
              Full-Stack Web &amp; Data Pipeline Engineer
            </p>
          </div>

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
        </div>

        {/* Skills Grid: three labeled groups */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-5">
          {SKILL_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
                {group.label}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <GlassBadge key={skill} variant="titanium" className="text-[11px]">
                    {skill}
                  </GlassBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </motion.div>
  );
};
