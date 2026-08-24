"use client";

/**
 * CinematicHero — Hero section text/CTA overlay ONLY.
 *
 * The 3D Spline canvas has been extracted to <SplineSceneWrapper /> which
 * lives in the root layout as a fixed global layer. This component is now
 * purely the foreground text, name, subtitle, and CTA buttons.
 *
 * pointer-events strategy:
 *   wrapper:  pointer-events-none  → canvas below remains interactive
 *   buttons:  pointer-events-auto  → CTAs remain clickable
 */

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useAnimation, useInView, useScroll, useTransform } from "framer-motion";
import { BriefcaseBusiness, Code2, File } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Framer Motion helper: blur-fade-in reveal ───────────────────────────────
function BlurIn({ children, delay = 0, duration = 1 }: { children: React.ReactNode; delay?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0 }}
      animate={{ filter: "blur(0px)",  opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Framer Motion helper: box/wipe reveal ───────────────────────────────────
function BoxReveal({ children, width = "fit-content", delay = 0 }: { children: React.ReactElement; width?: "fit-content" | "100%"; delay?: number }) {
  const mainControls  = useAnimation();
  const slideControls = useAnimation();
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      void slideControls.start("visible");
      void mainControls.start("visible");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{ hidden: { opacity: 0, y: 75 }, visible: { opacity: 1, y: 0 } }}
        initial="hidden" animate={mainControls}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: "100%" } }}
        initial="hidden" animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn", delay }}
        style={{ position: "absolute", top: 4, bottom: 4, left: 0, right: 0, zIndex: 20, background: "transparent" }}
      />
    </div>
  );
}

// ─── Scroll-down indicator ────────────────────────────────────────────────────
function ScrollDownIcon() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY <= 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="min-h-[50px] w-fit rounded-full border-2 border-white p-1"
      aria-hidden="true"
    >
      <motion.div
        initial={{ y: 0 }} animate={{ y: [0, 25], opacity: [1, 0] }}
        transition={{ duration: 1, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
        className="h-3 w-3 rounded-full bg-white"
      />
    </motion.div>
  );
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
function HeroButton({ children, href, variant = "solid" }: { children: React.ReactNode; href: string; variant?: "solid" | "outline" }) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      className={cn(
        "pointer-events-auto inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        variant === "solid"
          ? "bg-white text-black hover:bg-white/90"
          : "border border-white/30 bg-black/10 text-white backdrop-blur hover:bg-white/10"
      )}
    >
      {children}
    </Link>
  );
}

// ─── SectionWrapper — Framer Motion scroll-driven opacity/scale ───────────────
function SectionWrapper({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  return (
    <section id={id} ref={containerRef} className={cn("relative", className)}>
      <motion.div style={{ opacity, scale }} className="h-full w-full">
        {children}
      </motion.div>
    </section>
  );
}

// ─── Exported Hero ─────────────────────────────────────────────────────────────
export function CinematicHero() {
  return (
    <SectionWrapper
      id="hero"
      className="hero-container h-screen w-full bg-transparent"
    >
      {/* Text / CTA overlay — pointer-events-none so canvas below stays interactive */}
      <div className="grid md:grid-cols-2 pointer-events-none">
        <div
          className={cn(
            "z-10 col-span-1 h-[calc(100dvh-3rem)] md:h-[calc(100dvh-4rem)] pointer-events-none",
            "flex flex-col items-center justify-start md:items-start md:justify-center",
            "pt-28 sm:pb-16 md:p-20 lg:p-24 xl:p-28"
          )}
        >
          <div className="flex flex-col">
            <div>
              <BlurIn delay={0.7}>
                <p className={cn(
                  "mt-4 cursor-default whitespace-nowrap bg-clip-text text-md font-medium text-slate-500 dark:text-zinc-400",
                  "md:self-start sm:text-xl md:text-xl"
                )}>
                  Hi, I am<br className="md:hidden" />
                </p>
              </BlurIn>

              <BlurIn delay={1}>
                <h1 className={cn(
                  "-ml-[6px] cursor-default text-left font-bold leading-none text-slate-800 dark:text-transparent",
                  "text-7xl md:text-7xl lg:text-8xl xl:text-9xl",
                  "font-sans [text-shadow:0_0_1px_rgba(255,255,255,0.9)] dark:[-webkit-text-stroke:1px_rgba(255,255,255,0.7)]"
                )}>
                  Akshay<br className="md:block" />EV
                </h1>
              </BlurIn>

              <BlurIn delay={1.2}>
                <p className={cn(
                  "cursor-default whitespace-nowrap bg-clip-text text-md font-medium text-slate-500 dark:text-zinc-400",
                  "md:mt-4 md:self-start sm:text-xl md:text-xl"
                )}>
                  A Full Stack Web Developer
                </p>
              </BlurIn>
            </div>

            <div className="mt-8 flex w-fit flex-col gap-3">
              <BoxReveal delay={2} width="100%">
                <HeroButton href="/resume.pdf">
                  <File size={20} /><span>Resume</span>
                </HeroButton>
              </BoxReveal>

              <div className="flex gap-3 md:self-start">
                <HeroButton href="#contact" variant="outline">Hire Me</HeroButton>
                <div className="flex h-full items-center gap-2">
                  <HeroButton href="https://github.com/akshayev" variant="outline">
                    <Code2 size={20} aria-hidden="true" /><span className="sr-only">GitHub</span>
                  </HeroButton>
                  <HeroButton href="https://www.linkedin.com/in/akshayev/" variant="outline">
                    <BriefcaseBusiness size={20} aria-hidden="true" /><span className="sr-only">LinkedIn</span>
                  </HeroButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid col-span-1" />
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <ScrollDownIcon />
      </div>
    </SectionWrapper>
  );
}
