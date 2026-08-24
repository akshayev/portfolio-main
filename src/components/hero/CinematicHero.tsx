"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GlassBadge } from "@/components/ui/glass/GlassBadge";
import { ChevronDown, Sparkles, Terminal } from "lucide-react";

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll tracking over the 150vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax mappings
  // 1. Text Y translation moves upward at a slower rate than standard scroll (0% -> 75%)
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "75%"]);
  // 2. Text scale shrinks subtly into depth (1 -> 0.88)
  const textScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.88]);
  // 3. Opacity fades smoothly as user scrolls past initial viewport (1 -> 0 at 60% progress)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  // 4. Sub-heading moves in opposing direction for depth separation
  const subtitleY = useTransform(scrollYProgress, [0, 1], ["0%", "120%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[140vh] w-full select-none"
    >
      {/* Sticky viewport frame to keep content centered while parallaxing */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-6 md:p-12 overflow-hidden">
        
        {/* Top Header Navigation / Brand Strip */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between z-20"
        >
          <div className="flex items-center gap-3">
            <GlassBadge variant="emerald">
              <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase">
                <Terminal className="h-3 w-3 text-emerald-400" />
                V3.0 // ACTIVE_NODE
              </span>
            </GlassBadge>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400 tracking-widest uppercase">
            <span>[LATENCY: 12ms]</span>
            <span>[ENGINE: SPLINE 3D]</span>
            <span>[LOCATION: GLOBAL]</span>
          </div>
        </motion.div>

        {/* Center Parallax Typography Block */}
        <motion.div
          style={{
            y: textY,
            scale: textScale,
            opacity: heroOpacity,
          }}
          className="relative z-10 my-auto flex flex-col items-center justify-center text-center pointer-events-none"
        >
          {/* Subtle Tagline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest">
              Full-Stack & AI Agent Architect
            </span>
          </motion.div>

          {/* Huge Main Title — Layered for Spatial 3D Depth */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-white uppercase leading-none mix-blend-difference"
          >
            AKSHAY EV
          </motion.h1>

          {/* Subtitle / Role with Parallax Offset */}
          <motion.div
            style={{ y: subtitleY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl px-4"
          >
            <p className="text-base sm:text-xl font-light text-slate-300 leading-relaxed tracking-wide">
              Architecting high-contrast spatial web applications, autonomous AI agent pipelines, and spatial WebGL environments.
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Viewport Indicator — Scroll Prompt */}
        <motion.div
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="z-20 flex flex-col items-center justify-center gap-2 pb-6"
        >
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            Scroll to explore spatial protocol
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-md text-emerald-400"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
