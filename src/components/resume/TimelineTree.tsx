"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassPanel, GlassBadge } from "@/components/ui/glass";
import { Activity, Sparkles } from "lucide-react";

interface TimelineItem {
  date: string;
  title: string;
  badge?: string;
  isCurrent?: boolean;
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    date: "JUN 2026",
    title: "Nokia 11-Month Internship Program (Technical Assessment Phase)",
    badge: "Upcoming Internship",
  },
  {
    date: "APR 2026",
    title: "Shortlisted for Web/Software Engineer roles at YugaYatra Retail, Atlysbridge Solutions, and Clinchsoft.",
    badge: "Career Milestone",
  },
  {
    date: "APR 2026",
    title: "Completed NPTEL Advanced AI Knowledge Representation Course & Tata Power Aptitude Assessment.",
    badge: "Certification",
  },
  {
    date: "APR 2026",
    title: "Competed in TenzorX 2026 National AI Hackathon (Poonawalla Fincorp).",
    badge: "Hackathon",
  },
  {
    date: "APR 2026",
    title: "Architected TravelSphere mobile app (Glassmorphic UI, Firestore sync, Admin package modal).",
    badge: "Mobile Architecture",
  },
  {
    date: "MAR 2026",
    title: "Zone 5 Captain for Sargam Arts Fest (Managed 119 events, logistics, and clash-resolution algorithms).",
    badge: "Leadership",
  },
  {
    date: "FEB 2026",
    title: "Shipped LeadFlow Pro (Full-stack CRM, React/Firebase, 20-phase architecture).",
    badge: "Production Ship",
  },
  {
    date: "JAN 2026",
    title: "Deployed CityPulse AI (Agentic pipeline, Supabase, Mapbox).",
    badge: "AI Deployment",
  },
  {
    date: "NOV 2025",
    title: "Kaggle 5-Day Intensive AI Agents — Built Job Seeker AI Agent with Gemini 2.0 Flash Vision.",
    badge: "AI Research",
  },
  {
    date: "PRESENT",
    title: "Final Year B.Tech IT at CUSAT / CUCEK & Lead of Photography Club.",
    badge: "Education & Leadership",
    isCurrent: true,
  },
];

export const TimelineTree: React.FC = () => {
  return (
    <GlassPanel intensity="heavy" className="h-full flex flex-col justify-between p-8 md:p-10">
      <div>
        {/* Header Strip */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              Fiber-Optic HUD Timeline
            </h3>
            <p className="text-xs text-slate-400">
              Chronological engineering milestones, deployed systems & research nodes
            </p>
          </div>
          <GlassBadge variant="emerald">
            <span className="flex items-center gap-1.5 font-mono text-xs">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              LIVE_TREE
            </span>
          </GlassBadge>
        </div>

        {/* Dashed Fiber-Optic Data Track Line */}
        <div className="relative pl-8 space-y-6 border-l-2 border-dashed border-white/10 ml-3 my-4">
          {TIMELINE_DATA.map((item, index) => (
            <motion.div
              key={`${item.date}-${index}`}
              initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.04 }}
              className="relative group"
            >
              {/* Glowing Fiber-Optic HUD Ring Node */}
              <div
                className={`w-4 h-4 rounded-full border-2 border-emerald-500 bg-[#0B0F19] shadow-[0_0_15px_rgba(16,185,129,0.3)] absolute -left-[41px] top-4 flex items-center justify-center transition-all duration-300 ${
                  item.isCurrent
                    ? "ring-4 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.8)] border-emerald-400 scale-110"
                    : "group-hover:border-emerald-300 group-hover:scale-125"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${item.isCurrent ? "animate-pulse" : "opacity-80"}`} />
              </div>

              {/* Neo-Glass Milestone Card Content */}
              <GlassPanel
                intensity="light"
                className="p-5 md:p-6 transition-all duration-300 hover:border-emerald-500/30 hover:bg-[#0B0F19]/90"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  {/* Monospaced Date Tag */}
                  <span className="font-mono text-emerald-400 text-xs sm:text-sm tracking-widest uppercase font-semibold">
                    {item.date}
                  </span>

                  {item.badge && (
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 bg-slate-900/80 border border-white/5 px-2.5 py-1 rounded-lg">
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal group-hover:text-white transition-colors duration-200">
                  {item.title}
                </p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
};
