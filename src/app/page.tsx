import { client } from "@/sanity/client";
import { getFlagshipProjectsQuery } from "@/sanity/queries";
import { ExecutiveBar } from "@/components/hero/ExecutiveBar";
import { BentoGrid, SanityProject } from "@/components/projects/BentoGrid";
import { TimelineTree } from "@/components/resume/TimelineTree";
import { ResumeCTA } from "@/components/resume/ResumeCTA";
import { SpatialDemoSection } from "@/components/hero/SpatialDemoSection";
import { ContactForm } from "@/components/contact/ContactForm";
import { GlassBadge } from "@/components/ui/glass/GlassBadge";
import { Mail, MapPin, Radio } from "lucide-react";

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
    <main className="min-h-screen p-6 md:p-12 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Executive Hero Metric Bar */}
        <ExecutiveBar />

        {/* Section: Flagship Engineering (Bento Grid) */}
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

        {/* Section: Engineering Journey */}
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

        {/* Interactive Spatial Demo Section */}
        <SpatialDemoSection />

        {/* Section: Initiate Protocol (Contact Engine) */}
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

