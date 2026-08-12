"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassBadge } from "@/components/ui/glass";
import { X, ArrowUpRight, Cpu, Globe, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────
   PROJECT DATA  (static mock — Sanity CMS integration in later phase)
──────────────────────────────────────────────────────────────────── */
export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  variant: "emerald" | "titanium" | "outline";
  icon: React.ReactNode;
  /** Tailwind span classes for the grid cell */
  colSpan?: string;
  rowSpan?: string;
  accentColor: string;
}

const PROJECTS: Project[] = [
  {
    id: "citypulse-ai",
    title: "CityPulse AI",
    tagline: "Real-time urban intelligence platform",
    description:
      "An end-to-end AI platform that ingests live sensor feeds, satellite imagery, and civic data streams to surface predictive city-health metrics. Built with a distributed edge inference pipeline, a Next.js 15 App Router dashboard, and a vector search layer powered by Upstash Redis for sub-10ms geospatial lookups.",
    tags: ["Next.js 15", "Edge AI", "Redis", "TypeScript"],
    variant: "emerald",
    icon: <Globe className="h-6 w-6" />,
    colSpan: "md:col-span-2",
    rowSpan: "",
    accentColor: "rgba(16,185,129,0.2)",
  },
  {
    id: "leadflow-pro",
    title: "LeadFlow Pro",
    tagline: "AI-native B2B sales pipeline automation",
    description:
      "A modular CRM automation engine that uses LLM-based intent scoring to qualify inbound leads in real time, orchestrate multi-step outreach sequences via Make.com webhooks, and surface pipeline health signals. Integrates with Sanity CMS for sales collateral and features a Framer Motion–driven analytics dashboard.",
    tags: ["LLM Agents", "Make.com", "Sanity CMS", "Framer Motion"],
    variant: "titanium",
    icon: <Zap className="h-6 w-6" />,
    colSpan: "",
    rowSpan: "",
    accentColor: "rgba(148,163,184,0.15)",
  },
  {
    id: "travelsphere",
    title: "TravelSphere",
    tagline: "Spatial-aware travel discovery engine",
    description:
      "A geo-personalised travel discovery app that combines device gyroscope input with a Mapbox spatial layer to render immersive 3D destination cards. Uses serverless AI routing to generate optimised multi-day itineraries based on real-time flight prices, weather forecasts, and user preference embeddings stored in a pgvector database.",
    tags: ["Mapbox", "Spatial UX", "pgvector", "Serverless AI"],
    variant: "outline",
    icon: <Cpu className="h-6 w-6" />,
    colSpan: "",
    rowSpan: "",
    accentColor: "rgba(16,185,129,0.12)",
  },
];

/* ──────────────────────────────────────────────────────────────────
   INNER CARD CONTENT  (shared between grid tile & modal)
──────────────────────────────────────────────────────────────────── */
interface CardContentProps {
  project: Project;
  isModal?: boolean;
}

const CardContent: React.FC<CardContentProps> = ({ project, isModal = false }) => (
  <>
    {/* Icon + badge row */}
    <div className="flex items-center justify-between mb-4">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl text-emerald-400"
        style={{ background: project.accentColor }}
      >
        {project.icon}
      </span>
      <GlassBadge variant={project.variant}>{project.tags[0]}</GlassBadge>
    </div>

    {/* Title & tagline */}
    <h3
      className={cn(
        "font-bold text-white",
        isModal ? "text-2xl md:text-3xl mb-2" : "text-lg mb-1"
      )}
    >
      {project.title}
    </h3>
    <p className={cn("text-slate-400", isModal ? "text-base mb-6" : "text-xs mb-4")}>
      {project.tagline}
    </p>

    {/* Full description — only in modal */}
    {isModal && (
      <p className="text-sm text-slate-300 leading-relaxed mb-6">
        {project.description}
      </p>
    )}

    {/* Tag strip */}
    <div className="flex flex-wrap gap-2">
      {(isModal ? project.tags : project.tags.slice(0, 2)).map((tag) => (
        <GlassBadge key={tag} variant="titanium" className="text-[10px]">
          {tag}
        </GlassBadge>
      ))}
    </div>

    {/* CTA link — only in modal */}
    {isModal && (
      <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-emerald-400">
        <ArrowUpRight className="h-4 w-4" />
        <span>View Case Study</span>
      </div>
    )}
  </>
);

/* ──────────────────────────────────────────────────────────────────
   MAIN BENTO GRID COMPONENT
──────────────────────────────────────────────────────────────────── */
export const BentoGrid: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = PROJECTS.find((p) => p.id === selectedId) ?? null;

  return (
    <>
      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4">
        {PROJECTS.map((project) => (
          <motion.div
            key={project.id}
            layoutId={`project-${project.id}`}
            onClick={() => setSelectedId(project.id)}
            className={cn(
              "relative overflow-hidden rounded-2xl cursor-pointer",
              "bg-slate-900/70 border border-white/10 p-6",
              "backdrop-blur-xl shadow-2xl",
              "hover:border-emerald-500/30 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]",
              "transition-colors duration-300",
              project.colSpan,
              project.rowSpan
            )}
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            {/* Accent glow radial */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
              style={{
                background: `radial-gradient(ellipse at 20% 20%, ${project.accentColor}, transparent 65%)`,
              }}
            />
            <div className="relative z-10">
              <CardContent project={project} isModal={false} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Modal Overlay (AnimatePresence keeps exit animations alive) ── */}
      <AnimatePresence>
        {selectedId && selectedProject && (
          <>
            {/* Dark blurred backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedId(null)}
            />

            {/* Morphed card modal — SAME layoutId as the grid tile */}
            <motion.div
              key={`modal-${selectedId}`}
              layoutId={`project-${selectedId}`}
              className="fixed z-50 inset-4 md:inset-[10%] lg:inset-[15%] overflow-auto rounded-3xl"
              style={{
                background: "rgba(15,23,42,0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(28px)",
                boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 60px ${selectedProject.accentColor}`,
              }}
            >
              <div className="relative p-8 md:p-12">
                {/* Close button */}
                <motion.button
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => setSelectedId(null)}
                  aria-label="Close project modal"
                >
                  <X className="h-4 w-4" />
                </motion.button>

                {/* Accent radial in modal */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-40"
                  style={{
                    background: `radial-gradient(ellipse at 15% 15%, ${selectedProject.accentColor}, transparent 60%)`,
                  }}
                />
                <div className="relative z-10">
                  <CardContent project={selectedProject} isModal />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
