"use client";

import { GlassCard, GlassButton, GlassPanel, GlassBadge } from "@/components/ui/glass";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Zap } from "lucide-react";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#11172A] p-6 md:p-12 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header Section */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <GlassBadge variant="emerald" dot>
              SYSTEM ACTIVE
            </GlassBadge>
            <GlassBadge variant="titanium">
              TAILWIND V4 + FRAMER MOTION
            </GlassBadge>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Titanium & Emerald <span className="text-emerald-400">Glassmorphic Gallery</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-400">
            Interactive spatial UI component gallery with 3D physical tilt, tactile response, and subtle ambient reflections.
          </p>
        </div>

        {/* Section 1: Glass Cards Showcase */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200 border-b border-white/10 pb-3">
            1. Spatial 3D Glass Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between">
                <GlassBadge variant="emerald">FLAGSHIP</GlassBadge>
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Spatial Mesh Engine</h3>
              <p className="text-sm text-slate-400">
                Hardware-accelerated GPU canvas renderer with real-time cursor gravitational physics.
              </p>
              <GlassButton variant="primary" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                Explore Tech
              </GlassButton>
            </GlassCard>

            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between">
                <GlassBadge variant="titanium">SECURITY</GlassBadge>
                <ShieldCheck className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Upstash Redis Defense</h3>
              <p className="text-sm text-slate-400">
                Edge rate-limiting combined with invisible Cloudflare Turnstile protection.
              </p>
              <GlassButton variant="secondary" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                View Metrics
              </GlassButton>
            </GlassCard>

            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between">
                <GlassBadge variant="outline">AUTOMATION</GlassBadge>
                <Cpu className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Make.com Sanity Pipeline</h3>
              <p className="text-sm text-slate-400">
                Automated webhook ingestion syncing live GitHub repositories & case studies.
              </p>
              <GlassButton variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                Pipeline Logs
              </GlassButton>
            </GlassCard>
          </div>
        </section>

        {/* Section 2: Glass Buttons & Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200 border-b border-white/10 pb-3">
            2. Tactile Glass Buttons
          </h2>
          <GlassPanel intensity="light" className="flex flex-wrap items-center gap-4">
            <GlassButton variant="primary" size="lg" icon={<Zap className="h-5 w-5" />}>
              Primary Emerald
            </GlassButton>
            <GlassButton variant="secondary" size="lg">
              Secondary Titanium
            </GlassButton>
            <GlassButton variant="outline" size="lg">
              Outline Emerald
            </GlassButton>
            <GlassButton variant="ghost" size="lg">
              Ghost Glass
            </GlassButton>
          </GlassPanel>
        </section>

        {/* Section 3: Glass Panel Structural Containers */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200 border-b border-white/10 pb-3">
            3. Glass Panels & Intensity Levels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassPanel intensity="light">
              <h4 className="font-semibold text-emerald-400">Light Glass Panel</h4>
              <p className="mt-2 text-sm text-slate-400">
                Subtle backdrop blur suitable for quiet UI sections and secondary metric overlays.
              </p>
            </GlassPanel>

            <GlassPanel intensity="medium">
              <h4 className="font-semibold text-emerald-400">Medium Glass Panel</h4>
              <p className="mt-2 text-sm text-slate-400">
                Standard structural container with balanced glassmorphic contrast and border glow.
              </p>
            </GlassPanel>

            <GlassPanel intensity="heavy">
              <h4 className="font-semibold text-emerald-400">Heavy Glass Panel</h4>
              <p className="mt-2 text-sm text-slate-400">
                Deep obsidian glass layer designed for high-focus modals, floating bars, and executive cards.
              </p>
            </GlassPanel>
          </div>
        </section>
      </div>
    </main>
  );
}
