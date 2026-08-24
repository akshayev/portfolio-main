"use client";

import { useState, useEffect } from "react";
import { GlassCard, GlassButton, GlassPanel, GlassBadge } from "@/components/ui/glass";
import { useSpatialTracking, requestGyroPermission } from "@/hooks/useSpatialTracking";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Zap, Smartphone } from "lucide-react";

export function SpatialDemoSection() {
  const { x, y } = useSpatialTracking();

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [gyroStatus, setGyroStatus] = useState<"idle" | "granted" | "denied">("idle");

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleEnableGyro = async () => {
    try {
      await requestGyroPermission();
      setGyroStatus("granted");
    } catch {
      setGyroStatus("denied");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="space-y-4 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <GlassBadge variant="emerald" dot>
            SPATIAL PHYSICS ACTIVE
          </GlassBadge>
          <GlassBadge variant="titanium">FRAMER MOTION + GYROSCOPE</GlassBadge>
          {isTouchDevice && (
            <GlassBadge variant="outline">MOBILE DEVICE DETECTED</GlassBadge>
          )}
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
          Titanium & Emerald{" "}
          <span className="text-emerald-400">Spatial Physics Gallery</span>
        </h2>
        <p className="max-w-2xl text-lg text-slate-400">
          The flagship card below is driven by global spatial tracking — mouse on
          desktop, gyroscope on mobile. All other cards retain local hover tracking.
        </p>

        {isTouchDevice && gyroStatus !== "granted" && (
          <div className="flex items-center gap-3 pt-2">
            <GlassButton
              variant="primary"
              size="md"
              icon={<Smartphone className="h-4 w-4" />}
              onClick={handleEnableGyro}
            >
              Enable Mobile 3D
            </GlassButton>
            {gyroStatus === "denied" && (
              <span className="text-xs text-red-400">
                Permission denied — reload and try again.
              </span>
            )}
          </div>
        )}
        {isTouchDevice && gyroStatus === "granted" && (
          <GlassBadge variant="emerald" dot>
            GYROSCOPE ACTIVE — TILT YOUR DEVICE
          </GlassBadge>
        )}
      </div>

      {/* Section 1: Spatial 3D Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-200 border-b border-white/10 pb-3">
          1. Spatial 3D Glass Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="space-y-4 md:col-span-1" globalX={x} globalY={y}>
            <div className="flex items-center justify-between">
              <GlassBadge variant="emerald">FLAGSHIP · SPATIAL</GlassBadge>
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Spatial Mesh Engine</h3>
            <p className="text-sm text-slate-400">
              This card is driven by{" "}
              <code className="text-emerald-400 text-xs">useSpatialTracking</code> —
              move your mouse across the screen (or tilt your device) to rotate it.
            </p>
            <GlassButton
              variant="primary"
              size="sm"
              icon={<ArrowRight className="h-4 w-4" />}
            >
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
              Edge rate-limiting combined with invisible Cloudflare Turnstile
              protection. Local hover tracking on this card.
            </p>
            <GlassButton
              variant="secondary"
              size="sm"
              icon={<ArrowRight className="h-4 w-4" />}
            >
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
              Automated webhook ingestion syncing live GitHub repositories & case
              studies. Local hover tracking on this card.
            </p>
            <GlassButton
              variant="outline"
              size="sm"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Pipeline Logs
            </GlassButton>
          </GlassCard>
        </div>
      </section>

      {/* Section 2: Button Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-200 border-b border-white/10 pb-3">
          2. Tactile Glass Buttons
        </h2>
        <GlassPanel intensity="light" className="flex flex-wrap items-center gap-4">
          <GlassButton
            variant="primary"
            size="lg"
            icon={<Zap className="h-5 w-5" />}
          >
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

      {/* Section 3: Glass Panels */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-200 border-b border-white/10 pb-3">
          3. Glass Panels & Intensity Levels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassPanel intensity="light">
            <h4 className="font-semibold text-emerald-400">Light Glass Panel</h4>
            <p className="mt-2 text-sm text-slate-400">
              Subtle backdrop blur suitable for quiet UI sections.
            </p>
          </GlassPanel>
          <GlassPanel intensity="medium">
            <h4 className="font-semibold text-emerald-400">Medium Glass Panel</h4>
            <p className="mt-2 text-sm text-slate-400">
              Standard structural container with balanced glassmorphic contrast.
            </p>
          </GlassPanel>
          <GlassPanel intensity="heavy">
            <h4 className="font-semibold text-emerald-400">Heavy Glass Panel</h4>
            <p className="mt-2 text-sm text-slate-400">
              Deep obsidian glass layer designed for high-focus modals.
            </p>
          </GlassPanel>
        </div>
      </section>
    </>
  );
}
