"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassPanel, GlassBadge } from "@/components/ui/glass";

interface TimelineItem {
  date: string;
  title: string;
  badge?: string;
  isCurrent?: boolean;
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    date: "June 2026",
    title: "Nokia 11-Month Internship Program (Technical Assessment Phase)",
    badge: "Upcoming Internship",
  },
  {
    date: "April 2026",
    title: "Shortlisted for Web/Software Engineer roles at YugaYatra Retail, Atlysbridge Solutions, and Clinchsoft.",
    badge: "Career Milestone",
  },
  {
    date: "April 2026",
    title: "Completed NPTEL Advanced AI Knowledge Representation Course & Tata Power Aptitude Assessment.",
    badge: "Certification",
  },
  {
    date: "April 2026",
    title: "Competed in TenzorX 2026 National AI Hackathon (Poonawalla Fincorp).",
    badge: "Hackathon",
  },
  {
    date: "April 2026",
    title: "Architected TravelSphere mobile app (Glassmorphic UI, Firestore sync, Admin package modal).",
    badge: "Mobile Architecture",
  },
  {
    date: "March 2026",
    title: "Zone 5 Captain for Sargam Arts Fest (Managed 119 events, logistics, and clash-resolution algorithms).",
    badge: "Leadership",
  },
  {
    date: "February 2026",
    title: "Shipped LeadFlow Pro (Full-stack CRM, React/Firebase, 20-phase architecture).",
    badge: "Production Ship",
  },
  {
    date: "January 2026",
    title: "Deployed CityPulse AI (Agentic pipeline, Supabase, Mapbox).",
    badge: "AI Deployment",
  },
  {
    date: "November 2025",
    title: "Kaggle 5-Day Intensive AI Agents — Built Job Seeker AI Agent with Gemini 2.0 Flash Vision.",
    badge: "AI Research",
  },
  {
    date: "Present",
    title: "Final Year B.Tech IT at CUSAT / CUCEK & Lead of Photography Club.",
    badge: "Education & Leadership",
    isCurrent: true,
  },
];

export const TimelineTree: React.FC = () => {
  return (
    <GlassPanel intensity="medium" className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Engineering Journey
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Milestones, shipped products, hackathons & technical leadership
            </p>
          </div>
          <GlassBadge variant="emerald" dot>
            Live Tree
          </GlassBadge>
        </div>

        <div className="relative pl-6 space-y-6 border-l border-white/10 ml-3 my-2">
          {TIMELINE_DATA.map((item, index) => (
            <motion.div
              key={`${item.date}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative group"
            >
              {/* Glowing Node Indicator */}
              <div
                className={`absolute -left-[29px] top-1.5 h-2 w-2 rounded-full ${
                  item.isCurrent
                    ? "bg-emerald-400 ring-4 ring-emerald-500/20 shadow-[0_0_12px_rgba(52,211,153,1)]"
                    : "bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.7)] group-hover:scale-125 group-hover:bg-emerald-300"
                } transition-all duration-300`}
              />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-1">
                <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase shrink-0">
                  {item.date}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-medium text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full self-start sm:self-auto">
                    {item.badge}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-normal group-hover:text-white transition-colors duration-200">
                {item.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
};
