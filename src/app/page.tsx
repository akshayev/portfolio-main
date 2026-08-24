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
    /*
     * bg-transparent — the persistent <SplineSceneWrapper /> (fixed z-0 in layout)
     * shows through every section as the user scrolls.
     * cursor-none — hides the native OS cursor globally; CustomCursor renders instead.
     * Sections use relative z-10 with glass cards (backdrop-blur) for content legibility.
     */
    <main className="relative min-h-screen text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-transparent cursor-none">
      {/* ── Awwwards-style Cinematic Parallax Hero Section ─────────────────
          Full-viewport height. The 3D keyboard occupies the right half;
          typography anchors to the left. No padding-bottom here — the hero
          takes exactly 100vh and the keyboard begins its GSAP rotation the
          instant the user scrolls into the next section.
      ─────────────────────────────────────────────────────────────────── */}
      <CinematicHero />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 space-y-0 pb-24">

        {/* ── Section: Skills / Executive Bar ─────────────────────────────
            pb-[20vh] gives the GSAP ScrollTrigger on the keyboard enough
            scroll distance to fully complete the "hero → skills" rotation
            animation before the Projects grid enters the viewport.

            Layout: The ExecutiveBar is pushed to the RIGHT half (w-full
            md:w-[55%] ml-auto), leaving the left 45% of the viewport
            completely empty for the 3D keyboard to occupy — matching
            Naresh's reference layout exactly.
        ─────────────────────────────────────────────────────────────────── */}
        <section id="skills" className="min-h-[50vh] pb-[20vh]">
          <div className="w-full md:w-[55%] ml-auto">
            <ExecutiveBar />
          </div>
        </section>

        {/* ── Section: Flagship Engineering ───────────────────────────────
            pb-[20vh] ensures the "skills → projects" keyboard rotation has
            enough scroll runway to animate fully before the grid appears.
        ─────────────────────────────────────────────────────────────────── */}
        <section id="projects" className="space-y-6 min-h-[60vh] pb-[20vh]">
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

        {/* ── Section: Engineering Journey ────────────────────────────────
            pb-[20vh] gives the "projects → journey" keyboard transition
            its scroll breathing room.
        ─────────────────────────────────────────────────────────────────── */}
        <section className="space-y-6 min-h-[50vh] pb-[20vh]">
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

        {/* ── Interactive Spatial Demo ─────────────────────────────────── */}
        <div className="pb-[20vh]">
          <SpatialDemoSection />
        </div>

        {/* ── Section: Initiate Protocol — Contact Engine ──────────────── */}
        <section id="contact" className="space-y-6 pt-4 min-h-[60vh] border-t border-white/10">
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
