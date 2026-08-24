import dynamic from "next/dynamic";
import { client } from "@/sanity/client";
import { getFlagshipProjectsQuery } from "@/sanity/queries";
import { CinematicHero } from "@/components/hero/CinematicHero";
import { ExecutiveBar } from "@/components/hero/ExecutiveBar";
import { GlassBadge } from "@/components/ui/glass/GlassBadge";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { Mail, MapPin, Radio } from "lucide-react";
import type { SanityProject } from "@/components/projects/BentoGrid";

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Imports — deferred chunks, excluded from initial JS bundle.
// CinematicHero & ExecutiveBar are above-the-fold critical path (static imports).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * BentoGrid skeleton — maintains the grid height so CLS = 0 while loading.
 */
const BentoGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <GlassPanel key={i} intensity="light" className="h-52 animate-pulse opacity-40">{null}</GlassPanel>
    ))}
  </div>
);

/**
 * TimelineTree skeleton — maintains column height to prevent CLS.
 */
const TimelineSkeleton = () => (
  <GlassPanel intensity="light" className="h-96 animate-pulse opacity-40">{null}</GlassPanel>
);

/**
 * ResumeCTA skeleton.
 */
const ResumeSkeleton = () => (
  <GlassPanel intensity="light" className="h-40 animate-pulse opacity-40">{null}</GlassPanel>
);

/**
 * ContactForm skeleton — matches the GlassPanel(heavy) height of the real form.
 */
const ContactSkeleton = () => (
  <GlassPanel intensity="heavy" className="h-[480px] animate-pulse opacity-40 max-w-xl mx-auto">{null}</GlassPanel>
);

/**
 * SpatialDemoSection skeleton.
 */
const SpatialSkeleton = () => (
  <GlassPanel intensity="light" className="h-64 animate-pulse opacity-40">{null}</GlassPanel>
);

// Dynamically imported components — each ships in its own JS chunk
const BentoGrid = dynamic(
  () => import("@/components/projects/BentoGrid").then((m) => ({ default: m.BentoGrid })),
  { ssr: true, loading: () => <BentoGridSkeleton /> }
);

const TimelineTree = dynamic(
  () => import("@/components/resume/TimelineTree").then((m) => ({ default: m.TimelineTree })),
  { ssr: true, loading: () => <TimelineSkeleton /> }
);

const ResumeCTA = dynamic(
  () => import("@/components/resume/ResumeCTA").then((m) => ({ default: m.ResumeCTA })),
  { ssr: true, loading: () => <ResumeSkeleton /> }
);

const SpatialDemoSection = dynamic(
  () => import("@/components/hero/SpatialDemoSection").then((m) => ({ default: m.SpatialDemoSection })),
  { loading: () => <SpatialSkeleton /> }
);

const ContactForm = dynamic(
  () => import("@/components/contact/ContactForm").then((m) => ({ default: m.ContactForm })),
  { loading: () => <ContactSkeleton /> }
);

export const revalidate = 3600; // fallback revalidation in seconds

export default async function GalleryPage() {
  let projects: SanityProject[] = [];

  try {
    projects = await client.fetch<SanityProject[]>(
      getFlagshipProjectsQuery,
      {},
      { next: { tags: ["projects"] } }
    );
  } catch (error) {
    console.error("Sanity fetch error (falling back to mock data):", error);
  }

  return (
    <main className="min-h-screen text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* ── Awwwards-style Cinematic Parallax Hero Section ─────────── */}
      <CinematicHero />

      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-16 pb-24">
        {/* Executive Metric Bar */}
        <ExecutiveBar />

        {/* ── Section: Flagship Engineering (deferred chunk) ─────────── */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Flagship Engineering
            </h2>
            <p className="text-sm text-slate-400">
              Click any project to explore the full case study.
            </p>
          </div>
          <BentoGrid projects={projects} />
        </section>

        {/* ── Section: Engineering Journey (deferred chunks) ─────────── */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Engineering Journey
            </h2>
            <p className="text-sm text-slate-400">
              Interactive experience timeline and executive resume download.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <TimelineTree />
            </div>
            <div className="md:col-span-1">
              <ResumeCTA />
            </div>
          </div>
        </section>

        {/* ── Interactive Spatial Demo (deferred chunk) ───────────────── */}
        <SpatialDemoSection />

        {/* ── Section: Initiate Protocol — Contact Engine ─────────────── */}
        <section className="space-y-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="space-y-3">
                <GlassBadge variant="emerald">
                  <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
                  Comms Channel Open
                </GlassBadge>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  Initiate Protocol
                </h2>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Have an ambitious spatial application, full-stack architecture project, or engineering leadership opportunity? Transmit your query directly via the spatial protocol engine.
                </p>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Direct Channel</span>
                    <span className="font-mono text-white">hello@akshay.is-a.dev</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Location Node</span>
                    <span className="text-white">Global Remote / Hybrid</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
