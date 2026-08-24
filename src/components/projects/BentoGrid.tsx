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
    tagline: "AI-powered CRM web application with Python backend and Supabase real-time data layer.",
    problemStatement:
      "Businesses needed a smart CRM that could ingest lead data from multiple channels, score intent using AI, and surface actionable insights without manual data wrangling.",
    architecture:
      "FastAPI Python backend deployed on Render, Next.js 15 frontend on Vercel, Supabase for real-time PostgreSQL, and OpenAI-powered lead scoring pipeline. Cloudflare Workers handle edge caching for sub-50ms API responses.",
    metrics: ["<50ms API latency (edge-cached)", "3.5x lead conversion uplift", "Real-time Supabase sync"],
    techStack: ["Next.js 15", "Python / FastAPI", "Supabase", "TypeScript", "OpenAI", "Render"],
    githubUrl: "https://github.com/akshayev",
    liveUrl: "https://citypulse.vercel.app",
  },
  {
    _id: "vista-holidays",
    title: "Vista Holidays",
    tagline: "Full-stack travel platform with custom API integrations and complex booking UI architecture.",
    problemStatement:
      "Existing travel portals offered fragmented booking experiences — separate flows for flights, hotels, and packages. Vista unifies all three with live pricing APIs and a seamless multi-step checkout.",
    architecture:
      "Next.js App Router frontend with server actions, custom REST aggregation layer connecting to Amadeus Flight API and partner hotel feeds, PostgreSQL via Supabase, and Stripe for secure payment processing.",
    metrics: ["Unified flight + hotel booking", "Live pricing from 3 partner APIs", "Stripe-secured checkout"],
    techStack: ["Next.js 15", "Supabase", "Stripe", "TypeScript", "Amadeus API", "Framer Motion"],
    githubUrl: "https://github.com/akshayev",
    liveUrl: "https://vista-holidays.vercel.app",
  },
  {
    _id: "leadflow-pro",
    title: "LeadFlow Pro",
    tagline: "Data pipeline and lead generation architecture with automated multi-channel orchestration.",
    problemStatement:
      "B2B sales teams lose high-intent leads due to manual scoring delays and uncoordinated follow-up workflows spread across email, LinkedIn, and WhatsApp.",
    architecture:
      "Python data ingestion pipeline feeding into Supabase, Make.com webhooks for automated outreach orchestration across email and WhatsApp Business API, Power Automate flows for CRM sync, and a React dashboard for pipeline visualization.",
    metrics: ["Automated 85% of lead triage", "<2s intent-score response", "Deployed on Azure Functions"],
    techStack: ["Python", "Power Platform", "Make.com", "Supabase", "Azure", "React"],
    githubUrl: "https://github.com/akshayev",
    liveUrl: "https://leadflow.vercel.app",
  },
  {
    _id: "jeta-futures",
    title: "JetaFutures",
    tagline: "Football Trading League platform — frontend, backend, and full infrastructure.",
    problemStatement:
      "Fantasy football platforms lacked real-time trade execution, portfolio tracking, and a live P&L dashboard. JetaFutures brings stock-market-style mechanics to football player trading.",
    architecture:
      "FastAPI backend with WebSocket support for live price feeds, React + TypeScript frontend with Recharts for P&L visualization, Supabase real-time subscriptions for portfolio updates, and Streamlit admin panel for league management.",
    metrics: ["Real-time WebSocket price feeds", "Streamlit admin dashboard", "Live P&L tracking"],
    techStack: ["FastAPI", "React", "Streamlit", "Supabase", "TypeScript", "Python"],
    githubUrl: "https://github.com/akshayev",
    liveUrl: "https://jetafutures.vercel.app",
  },
];

const ICONS = [
  <Globe key="1" className="h-5 w-5 text-emerald-400" />,
  <Zap  key="2" className="h-5 w-5 text-emerald-400" />,
  <Cpu  key="3" className="h-5 w-5 text-emerald-400" />,
  <Code2 key="4" className="h-5 w-5 text-emerald-400" />,
];

interface CardContentProps {
  project: SanityProject;
  index: number;
  isModal?: boolean;
}

const CardContent: React.FC<CardContentProps> = ({ project, index, isModal = false }) => {
  const icon = ICONS[index % ICONS.length];

  return (
    <>
      {/* Top Bar: Icon, Active Indicator & Main Tech Badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            {icon}
          </span>

          {/* Glowing Emerald Accent Dot for Active Status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981] inline-block shrink-0" />
            <span className="text-[11px] font-mono tracking-wider text-emerald-400/90 uppercase">
              LIVE_NODE
            </span>
          </div>
        </div>

        <GlassBadge variant="emerald" className="text-xs">
          {project.techStack?.[0] || "Featured"}
        </GlassBadge>
      </div>

      {/* Header & Tagline — High Contrast Typography */}
      <h3
        className={cn(
          "font-medium tracking-tight text-white",
          isModal ? "text-2xl md:text-3xl mb-3" : "text-xl md:text-2xl mb-2"
        )}
      >
        {project.title}
      </h3>
      <p
        className={cn(
          "text-slate-400 leading-relaxed",
          isModal ? "text-base mb-6" : "text-sm mb-6"
        )}
      >
        {project.tagline}
      </p>

      {/* Expanded Modal Content */}
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
                    className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 text-xs font-medium text-emerald-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2">
        {(isModal ? project.techStack : project.techStack?.slice(0, 3) || []).map((tag) => (
          <GlassBadge key={tag} variant="titanium" className="text-[11px]">
            {tag}
          </GlassBadge>
        ))}
      </div>

      {/* Modal Actions */}
      {isModal && (
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/5">
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
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-6">
        {displayProjects.map((project, index) => {
          const colSpan = index === 0 ? "md:col-span-2" : "";

          return (
            <div
              key={project._id}
              onClick={() => setSelectedId(project._id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl cursor-pointer p-8 transition-all duration-300",
                "bg-[#0B0F19]/85 backdrop-blur-md border border-white/5",
                "hover:border-emerald-500/30 hover:bg-[#0B0F19]/95 hover:shadow-[0_0_30px_rgba(16,185,129,0.06)]",
                colSpan
              )}
            >
              {/* Subtle Ambient Radial Highlight */}
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-emerald-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                aria-hidden="true"
              />

              {/* Inner Content Scales Slightly (scale: 1.03) while Outer Container Stays Completely Fixed */}
              <motion.div
                className="relative z-10 h-full flex flex-col justify-between"
                whileHover={{ scale: 1.025 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                <CardContent project={project} index={index} isModal={false} />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedId && selectedProject && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-[#050810]/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedId(null)}
            />

            <motion.div
              key={`modal-${selectedId}`}
              layoutId={`project-${selectedId}`}
              className="fixed z-50 inset-4 md:inset-[8%] lg:inset-[12%] overflow-auto rounded-2xl p-8 md:p-12"
              style={{
                background: "rgba(11, 15, 25, 0.96)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 30px 100px rgba(0,0,0,0.8), 0 0 50px rgba(16,185,129,0.08)",
              }}
            >
              <div className="relative">
                <motion.button
                  className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => setSelectedId(null)}
                  aria-label="Close project modal"
                >
                  <X className="h-4 w-4" />
                </motion.button>

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
