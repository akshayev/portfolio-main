"use client";

import React from "react";
import { FileText, Download, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { GlassPanel, GlassButton, GlassBadge } from "@/components/ui/glass";

export const ResumeCTA: React.FC = () => {
  const handleDownload = () => {
    // Triggers resume download or preview
    const link = document.createElement("a");
    link.href = "#";
    link.download = "Akshay_Executive_Resume_2026.pdf";
    // For preview demonstration, log action
    console.log("Downloading Executive Resume...");
  };

  return (
    <GlassPanel
      intensity="medium"
      className="h-full flex flex-col justify-between relative overflow-hidden group border-emerald-500/20 hover:border-emerald-500/40 transition-colors duration-500"
    >
      {/* Ambient background glow */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <GlassBadge variant="emerald" dot>
            Verified PDF
          </GlassBadge>
        </div>

        <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
          Executive Resume
        </h3>
        
        <p className="text-sm font-medium text-emerald-400 mb-4 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 shrink-0" />
          Available for Fall 2026 Engineering Roles
        </p>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Comprehensive breakdown of production architecture, full-stack CRM deployments, agentic AI pipelines, and engineering leadership.
        </p>

        <div className="space-y-2.5 mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Full-Stack & AI Agent Engineering</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>B.Tech IT @ CUSAT / CUCEK</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Nokia Internship Assessment Phase</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <GlassButton
          variant="primary"
          size="lg"
          className="w-full justify-center group/btn"
          icon={<Download className="w-4 h-4 transition-transform duration-200 group-hover/btn:-translate-y-0.5" />}
          onClick={handleDownload}
        >
          Download Executive Resume
        </GlassButton>
      </div>
    </GlassPanel>
  );
};
