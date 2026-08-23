import { client } from "@/sanity/client";
import { getFlagshipProjectsQuery } from "@/sanity/queries";
import { ExecutiveBar } from "@/components/hero/ExecutiveBar";
import { BentoGrid, SanityProject } from "@/components/projects/BentoGrid";
import { TimelineTree } from "@/components/resume/TimelineTree";
import { ResumeCTA } from "@/components/resume/ResumeCTA";
import { SpatialDemoSection } from "@/components/hero/SpatialDemoSection";

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
      <div className="mx-auto max-w-7xl space-y-12">
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
      </div>
    </main>
  );
}
