"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassBadge, GlassButton } from "@/components/ui/glass";
import { X, Cpu, Globe, Zap, Code2, ExternalLink, Video, Layers, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SanityProject {
  _id: string;
  _createdAt?: string;
  title: string;
  slug?: string;
  tagline: string;
  coverImage?: any;
  techStack: string[];
  problemStatement: string;
  architecture: string;
  metrics: string[];
  githubUrl: string;
  liveUrl: string;
  youtubeUrl?: string;
}

interface BentoGridProps {
  projects?: SanityProject[];
}

const MOCK_PROJECTS: SanityProject[] = [
  {
    _id: "citypulse-ai",
    title: "CityPulse AI",
    tagline: "Real-time urban intelligence platform",
    problemStatement:
      "Modern municipalities suffer from fragmented sensor data streams, making rapid emergency response and traffic congestion management reactive rather than predictive.",
    architecture:
      "Distributed edge inference pipeline consuming live IoT sensor feeds, Next.js 15 App Router dashboard, and Upstash Redis vector search layer for sub-10ms geospatial lookups.",
    metrics: ["Sub-10ms geospatial query latency", "99.9% edge uptime", "40% faster emergency dispatch"],
    techStack: ["Next.js 15", "Edge AI", "Redis", "TypeScript"],
    githubUrl: "https://github.com",
    liveUrl: "https://citypulse.ai",
  },
  {
    _id: "leadflow-pro",
    title: "LeadFlow Pro",
    tagline: "AI-native B2B sales pipeline automation",
    problemStatement:
      "B2B sales teams lose high-intent leads due to manual scoring delays and uncoordinated multi-channel follow-up workflows.",
    architecture:
      "Modular CRM automation engine using LLM intent scoring, Make.com webhooks for outreach orchestration, and Sanity CMS for collateral management.",
    metrics: ["3.5x lead conversion rate", "Automated 85% of triage", "<2s response time"],
    techStack: ["LLM Agents", "Make.com", "Sanity CMS", "Framer Motion"],
    githubUrl: "https://github.com",
    liveUrl: "https://leadflow.pro",
  },
  {
    _id: "travelsphere",
    title: "TravelSphere",
    tagline: "Spatial-aware travel discovery engine",
    problemStatement:
      "Static travel portals fail to provide intuitive visual discovery for complex multi-destination itineraries.",
    architecture:
      "Combines device gyroscope input with Mapbox 3D layers. Uses serverless AI routing to build optimized itineraries based on real-time flight and weather APIs.",
    metrics: ["60fps 3D rendering", "10k+ active itineraries", "4.9/5 UX score"],
    techStack: ["Mapbox", "Spatial UX", "pgvector", "Serverless AI"],
    githubUrl: "https://github.com",
    liveUrl: "https://travelsphere.app",
  },
];

const ICONS = [
  <Globe key="1" className="h-6 w-6" />,
  <Zap key="2" className="h-6 w-6" />,
  <Cpu key="3" className="h-6 w-6" />,
];

const VARIANTS: Array<"emerald" | "titanium" | "outline"> = ["emerald", "titanium", "outline"];
const ACCENTS = [
  "rgba(16,185,129,0.2)",
  "rgba(148,163,184,0.15)",
  "rgba(16,185,129,0.12)",
];

interface CardContentProps {
  project: SanityProject;
  index: number;
  isModal?: boolean;
}

const CardContent: React.FC<CardContentProps> = ({ project, index, isModal = false }) => {
  const icon = ICONS[index % ICONS.length];
  const variant = VARIANTS[index % VARIANTS.length];
  const accentColor = ACCENTS[index % ACCENTS.length];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl text-emerald-400"
          style={{ background: accentColor }}
        >
          {icon}
        </span>
        <GlassBadge variant={variant}>
          {project.techStack?.[0] || "Featured"}
        </GlassBadge>
      </div>

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

      {isModal && (
        <div className="space-y-6 text-slate-300 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
              <Target className="h-4 w-4" />
              <span>Problem Statement</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {project.problemStatement}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
              <Layers className="h-4 w-4" />
              <span>Architecture & Implementation</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {project.architecture}
            </p>
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                <BarChart3 className="h-4 w-4" />
                <span>Key Metrics & Results</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {project.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-300"
                  >
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(isModal ? project.techStack : project.techStack?.slice(0, 3) || []).map((tag) => (
          <GlassBadge key={tag} variant="titanium" className="text-[10px]">
            {tag}
          </GlassBadge>
        ))}
      </div>

      {isModal && (
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <GlassButton variant="primary" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                Live Demo
              </GlassButton>
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <GlassButton variant="secondary" size="sm" icon={<Code2 className="h-4 w-4" />}>
                Source Code
              </GlassButton>
            </a>
          )}
          {project.youtubeUrl && (
            <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer">
              <GlassButton variant="outline" size="sm" icon={<Video className="h-4 w-4" />}>
                Watch Video
              </GlassButton>
            </a>
          )}
        </div>
      )}
    </>
  );
};

export const BentoGrid: React.FC<BentoGridProps> = ({ projects }) => {
  const displayProjects = projects && projects.length > 0 ? projects : MOCK_PROJECTS;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedIndex = displayProjects.findIndex((p) => p._id === selectedId);
  const selectedProject = selectedIndex !== -1 ? displayProjects[selectedIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4">
        {displayProjects.map((project, index) => {
          const colSpan = index === 0 ? "md:col-span-2" : "";
          const accentColor = ACCENTS[index % ACCENTS.length];

          return (
            <motion.div
              key={project._id}
              layoutId={`project-${project._id}`}
              onClick={() => setSelectedId(project._id)}
              className={cn(
                "relative overflow-hidden rounded-2xl cursor-pointer",
                "bg-slate-900/70 border border-white/10 p-6",
                "backdrop-blur-xl shadow-2xl",
                "hover:border-emerald-500/30 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]",
                "transition-colors duration-300",
                colSpan
              )}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
                style={{
                  background: `radial-gradient(ellipse at 20% 20%, ${accentColor}, transparent 65%)`,
                }}
              />
              <div className="relative z-10">
                <CardContent project={project} index={index} isModal={false} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedId && selectedProject && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedId(null)}
            />

            <motion.div
              key={`modal-${selectedId}`}
              layoutId={`project-${selectedId}`}
              className="fixed z-50 inset-4 md:inset-[8%] lg:inset-[12%] overflow-auto rounded-3xl"
              style={{
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(28px)",
                boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 60px ${ACCENTS[selectedIndex % ACCENTS.length]}`,
              }}
            >
              <div className="relative p-6 md:p-10">
                <motion.button
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-colors z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => setSelectedId(null)}
                  aria-label="Close project modal"
                >
                  <X className="h-4 w-4" />
                </motion.button>

                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-40"
                  style={{
                    background: `radial-gradient(ellipse at 15% 15%, ${ACCENTS[selectedIndex % ACCENTS.length]}, transparent 60%)`,
                  }}
                />
                <div className="relative z-10">
                  <CardContent project={selectedProject} index={selectedIndex} isModal />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
