"use client";

/**
 * SplineSceneWrapper — Persistent Global 3D Canvas
 *
 * Architectural role: This component owns the Spline Application instance
 * for the entire page. It renders as a fixed full-viewport layer so the 3D
 * keyboard remains ALIVE while the user scrolls between sections.
 *
 * GSAP ScrollTrigger wires up multi-section state transitions:
 *   hero    → skills  : keyboard glides center-right → center, rotates to show keycaps
 *   skills  → projects: keyboard retreats to background corner, scale reduces
 *   projects→ contact : keyboard becomes ambient background asset (far corner, low opacity)
 *
 * Pointer-event contract:
 *   outer wrapper: pointer-events-none  (text/buttons above are clickable)
 *   inner canvas : pointer-events-auto  (orbit drag, keycap press still work)
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Application, SplineEvent } from "@splinetool/runtime";

// Bypass Next.js 15 SWC transform: extract import to a variable first
const importSpline = () => import("@splinetool/react-spline");
const Spline = dynamic(importSpline, {
  ssr: false,
  loading: () => null,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "hero" | "skills" | "projects" | "contact";
type Skill = { name: string; label: string; shortDescription: string };

// ─── Skills map (must match object names in the .spline file) ────────────────
const SKILLS: Record<string, Skill> = {
  js:        { name: "js",        label: "JavaScript",   shortDescription: "Production-grade browser and server logic." },
  ts:        { name: "ts",        label: "TypeScript",   shortDescription: "Typed systems with safer refactors and clearer contracts." },
  html:      { name: "html",      label: "HTML",         shortDescription: "Accessible document structure and semantic interfaces." },
  css:       { name: "css",       label: "CSS",          shortDescription: "Responsive layout, animation, and polished visual systems." },
  react:     { name: "react",     label: "React",        shortDescription: "Component architecture for interactive product surfaces." },
  vue:       { name: "vue",       label: "Vue",          shortDescription: "Reactive UI workflows and component-driven delivery." },
  nextjs:    { name: "nextjs",    label: "Next.js",      shortDescription: "Full-stack React, routing, caching, and server rendering." },
  tailwind:  { name: "tailwind",  label: "Tailwind CSS", shortDescription: "Fast, consistent utility-first interface styling." },
  nodejs:    { name: "nodejs",    label: "Node.js",      shortDescription: "API services, integrations, and realtime backends." },
  express:   { name: "express",   label: "Express",      shortDescription: "Lean HTTP services and middleware pipelines." },
  postgres:  { name: "postgres",  label: "PostgreSQL",   shortDescription: "Relational data modeling and query performance." },
  mongodb:   { name: "mongodb",   label: "MongoDB",      shortDescription: "Document data models for flexible product workflows." },
  git:       { name: "git",       label: "Git",          shortDescription: "Version control, review flow, and release discipline." },
  github:    { name: "github",    label: "GitHub",       shortDescription: "CI, pull requests, collaboration, and automation." },
  prettier:  { name: "prettier",  label: "Prettier",     shortDescription: "Consistent formatting across shared codebases." },
  npm:       { name: "npm",       label: "npm",          shortDescription: "Package management and dependency operations." },
  firebase:  { name: "firebase",  label: "Firebase",     shortDescription: "Managed realtime services and app infrastructure." },
  wordpress: { name: "wordpress", label: "WordPress",    shortDescription: "CMS implementation and custom content workflows." },
  linux:     { name: "linux",     label: "Linux",        shortDescription: "Shell, deployment, and production environment fluency." },
  docker:    { name: "docker",    label: "Docker",       shortDescription: "Containerized development and deployment pipelines." },
  nginx:     { name: "nginx",     label: "Nginx",        shortDescription: "Reverse proxies, routing, and static asset delivery." },
  aws:       { name: "aws",       label: "AWS",          shortDescription: "Cloud services, deployment, and production operations." },
  gcp:       { name: "gcp",       label: "Google Cloud", shortDescription: "Cloud compute, storage, and managed platform services." },
  vim:       { name: "vim",       label: "Vim",          shortDescription: "Keyboard-native editing and terminal workflows." },
  vercel:    { name: "vercel",    label: "Vercel",       shortDescription: "Frontend delivery, previews, and edge deployment." },
};

// ─── Keyboard transform states per section ────────────────────────────────────
const STATES = {
  hero: {
    desktop: { scale: { x: 0.2,  y: 0.2,  z: 0.2  }, position: { x: 225,  y: -100, z: 0 }, rotation: { x: 0, y: 0,            z: 0 } },
    mobile:  { scale: { x: 0.3,  y: 0.3,  z: 0.3  }, position: { x: 0,    y: -200, z: 0 }, rotation: { x: 0, y: 0,            z: 0 } },
  },
  skills: {
    desktop: { scale: { x: 0.25, y: 0.25, z: 0.25 }, position: { x: 0,    y: -40,  z: 0 }, rotation: { x: 0, y: Math.PI / 12, z: 0 } },
    mobile:  { scale: { x: 0.3,  y: 0.3,  z: 0.3  }, position: { x: 0,    y: -40,  z: 0 }, rotation: { x: 0, y: Math.PI / 6,  z: 0 } },
  },
  projects: {
    desktop: { scale: { x: 0.25, y: 0.25, z: 0.25 }, position: { x: 0,    y: -40,  z: 0 }, rotation: { x: Math.PI,     y: Math.PI / 3,  z: Math.PI } },
    mobile:  { scale: { x: 0.3,  y: 0.3,  z: 0.3  }, position: { x: 0,    y: 150,  z: 0 }, rotation: { x: Math.PI,     y: Math.PI / 3,  z: Math.PI } },
  },
  contact: {
    desktop: { scale: { x: 0.2,  y: 0.2,  z: 0.2  }, position: { x: 350,  y: -250, z: 0 }, rotation: { x: 0, y: 0,            z: 0 } },
    mobile:  { scale: { x: 0.25, y: 0.25, z: 0.25 }, position: { x: 0,    y: 150,  z: 0 }, rotation: { x: Math.PI,     y: Math.PI / 3,  z: Math.PI } },
  },
};

// ─── Utilities ────────────────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);
  useEffect(() => {
    const result = matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setValue(e.matches);
    setValue(result.matches);
    result.addEventListener("change", onChange);
    return () => result.removeEventListener("change", onChange);
  }, [query]);
  return value;
}

function getKeyboardState({ section, isMobile }: { section: Section; isMobile: boolean }) {
  const base = STATES[section][isMobile ? "mobile" : "desktop"];
  const width = window.innerWidth;
  const targetScale = isMobile ? width / 390 : width / 1280;
  const scaleOffset = Math.min(Math.max(targetScale, 0.5), isMobile ? 0.6 : 1.15);
  return {
    ...base,
    scale: {
      x: Math.abs(base.scale.x * scaleOffset),
      y: Math.abs(base.scale.y * scaleOffset),
      z: Math.abs(base.scale.z * scaleOffset),
    },
  };
}

function useKeycapSounds() {
  const pressRef   = useRef<HTMLAudioElement | null>(null);
  const releaseRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    pressRef.current   = new Audio("/assets/keycap-sounds/press.mp3");
    releaseRef.current = new Audio("/assets/keycap-sounds/release.mp3");
  }, []);
  const play = useCallback((audio: HTMLAudioElement | null) => {
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, []);
  return {
    playPressSound:   useCallback(() => play(pressRef.current),   [play]),
    playReleaseSound: useCallback(() => play(releaseRef.current), [play]),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SplineSceneWrapper() {
  const isMobile   = useMediaQuery("(max-width: 767px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const [activeSection, setActiveSection]     = useState<Section>("hero");
  const [keyboardRevealed, setKeyboardRevealed] = useState(false);
  const selectedSkillRef  = useRef<Skill | null>(null);
  const bongoRef          = useRef<{ start: () => void; stop: () => void } | null>(null);
  const keycapsRef        = useRef<{ start: () => void; stop: () => void } | null>(null);
  const { playPressSound, playReleaseSound } = useKeycapSounds();

  // ── 1. GSAP MULTI-SECTION SCROLLTRIGGER ─────────────────────────────────────
  useGSAP(
    () => {
      if (!splineApp) return;
      const kbd = splineApp.findObjectByName("keyboard") ?? splineApp.findObjectByName("Keyboard");
      if (!kbd) return;

      const heroState = getKeyboardState({ section: "hero", isMobile });
      gsap.set(kbd.scale,    heroState.scale);
      gsap.set(kbd.position, heroState.position);
      gsap.set(kbd.rotation, heroState.rotation);

      // HERO → SKILLS: continuous scrub — rotation, zoom, position & scale
      gsap.timeline({
        scrollTrigger: {
          trigger:  "#hero",
          start:    "top top",
          end:      "bottom top",
          scrub:    1,
          onUpdate: (self) => {
            const p = self.progress;
            const skillsState = getKeyboardState({ section: "skills", isMobile });

            // Optional zoom via Spline API (if exposed)
            if (typeof (splineApp as any).setZoom === "function") {
              (splineApp as any).setZoom(gsap.utils.interpolate(1, 0.88, p));
            }

            // Smooth position glide: hero center-right → skills center
            kbd.position.x = gsap.utils.interpolate(heroState.position.x, skillsState.position.x, p);
            kbd.position.y = gsap.utils.interpolate(heroState.position.y, skillsState.position.y, p);
            kbd.position.z = gsap.utils.interpolate(heroState.position.z, skillsState.position.z, p);

            // Rotate upward to reveal keycaps + arc to skills angle
            kbd.rotation.x = gsap.utils.interpolate(
              heroState.rotation.x,
              skillsState.rotation.x + 0.35 * Math.sin(p * Math.PI),
              p
            );
            kbd.rotation.y = gsap.utils.interpolate(heroState.rotation.y, skillsState.rotation.y, p);
            kbd.rotation.z = gsap.utils.interpolate(heroState.rotation.z, skillsState.rotation.z, p);

            const s = gsap.utils.interpolate(heroState.scale.x, skillsState.scale.x, p);
            kbd.scale.x = s; kbd.scale.y = s; kbd.scale.z = s;
          },
        },
      });

      // SKILLS → PROJECTS: retreat to corner, slight rotation
      ScrollTrigger.create({
        trigger: "#projects",
        start:   "top 70%",
        end:     "bottom bottom",
        scrub:   1,
        onEnter: () => {
          setActiveSection("projects");
          const s = getKeyboardState({ section: "projects", isMobile });
          gsap.to(kbd.scale,    { ...s.scale,    duration: 1.4, ease: "power2.out" });
          gsap.to(kbd.position, { ...s.position, duration: 1.4, ease: "power2.out" });
          gsap.to(kbd.rotation, { ...s.rotation, duration: 1.4, ease: "power2.out" });
        },
        onLeaveBack: () => {
          setActiveSection("skills");
          const s = getKeyboardState({ section: "skills", isMobile });
          gsap.to(kbd.scale,    { ...s.scale,    duration: 1.2, ease: "power2.out" });
          gsap.to(kbd.position, { ...s.position, duration: 1.2, ease: "power2.out" });
          gsap.to(kbd.rotation, { ...s.rotation, duration: 1.2, ease: "power2.out" });
        },
      });

      // SKILLS entry (for scroll-back from projects)
      ScrollTrigger.create({
        trigger: "#skills",
        start:   "top 50%",
        end:     "bottom bottom",
        scrub:   1,
        onEnter: () => {
          setActiveSection("skills");
          const s = getKeyboardState({ section: "skills", isMobile });
          gsap.to(kbd.scale,    { ...s.scale,    duration: 1.2, ease: "power2.out" });
          gsap.to(kbd.position, { ...s.position, duration: 1.2, ease: "power2.out" });
          gsap.to(kbd.rotation, { ...s.rotation, duration: 1.2, ease: "power2.out" });
        },
        onLeaveBack: () => {
          setActiveSection("hero");
        },
      });

      // PROJECTS → CONTACT: keyboard becomes ambient far-corner asset
      ScrollTrigger.create({
        trigger: "#contact",
        start:   "top 30%",
        end:     "bottom bottom",
        scrub:   1,
        onEnter: () => {
          setActiveSection("contact");
          const s = getKeyboardState({ section: "contact", isMobile });
          gsap.to(kbd.scale,    { ...s.scale,    duration: 1.6, ease: "power2.out" });
          gsap.to(kbd.position, { ...s.position, duration: 1.6, ease: "power2.out" });
          gsap.to(kbd.rotation, { ...s.rotation, duration: 1.6, ease: "power2.out" });
        },
        onLeaveBack: () => {
          setActiveSection("projects");
          const s = getKeyboardState({ section: "projects", isMobile });
          gsap.to(kbd.scale,    { ...s.scale,    duration: 1.2, ease: "power2.out" });
          gsap.to(kbd.position, { ...s.position, duration: 1.2, ease: "power2.out" });
          gsap.to(kbd.rotation, { ...s.rotation, duration: 1.2, ease: "power2.out" });
        },
      });
    },
    { dependencies: [splineApp, isMobile] }
  );

  // ── 2. Keyboard entry reveal (elastic scale-in + keycap bounce) ────────────
  useEffect(() => {
    if (!splineApp || keyboardRevealed) return;
    let cancelled = false;

    const reveal = async () => {
      const kbd = splineApp.findObjectByName("keyboard") ?? splineApp.findObjectByName("Keyboard");
      if (!kbd) return;

      kbd.visible = false;
      await sleep(400);
      if (cancelled) return;
      kbd.visible = true;
      setKeyboardRevealed(true);

      const state = getKeyboardState({ section: "hero", isMobile });
      gsap.fromTo(kbd.scale, { x: 0.01, y: 0.01, z: 0.01 }, { ...state.scale, duration: 1.5, ease: "elastic.out(1, 0.6)" });

      const all     = splineApp.getAllObjects();
      const keycaps = all.filter((o) => o.name === "keycap");

      await sleep(900);
      if (cancelled) return;

      if (isMobile) {
        all.filter((o) => o.name === "keycap-mobile").forEach((k) => { k.visible = true; });
      } else {
        all.filter((o) => o.name === "keycap-desktop").forEach(async (k, i) => {
          await sleep(i * 70);
          k.visible = true;
        });
      }

      keycaps.forEach(async (k, i) => {
        k.visible = false;
        await sleep(i * 70);
        k.visible = true;
        gsap.fromTo(k.position, { y: 200 }, { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" });
      });
    };

    void reveal();
    return () => { cancelled = true; };
  }, [splineApp, isMobile, keyboardRevealed]);

  // ── 3. Section-dependent idle animations (bongo cat, keycap float) ─────────
  useEffect(() => {
    if (!splineApp) return;
    let cancelled = false;

    // Bongo cat animation
    const framesParent = splineApp.findObjectByName("bongo-cat");
    const frame1       = splineApp.findObjectByName("frame-1");
    const frame2       = splineApp.findObjectByName("frame-2");
    let bongoInterval: ReturnType<typeof setInterval>;

    const bongo = {
      start: () => {
        if (!frame1 || !frame2 || !framesParent) return;
        let i = 0; framesParent.visible = true;
        bongoInterval = setInterval(() => {
          frame1.visible = i % 2 === 0; frame2.visible = i % 2 !== 0; i++;
        }, 100);
      },
      stop: () => {
        clearInterval(bongoInterval);
        if (framesParent) framesParent.visible = false;
        if (frame1) frame1.visible = false;
        if (frame2) frame2.visible = false;
      },
    };
    bongoRef.current = bongo;

    // Keycap float / settle
    let floatTweens: gsap.core.Tween[] = [];
    const keycapAnim = {
      start: () => {
        floatTweens.forEach((t) => t.kill());
        floatTweens = [];
        Object.values(SKILLS).sort(() => Math.random() - 0.5).forEach((skill, idx) => {
          const cap = splineApp.findObjectByName(skill.name);
          if (!cap) return;
          floatTweens.push(gsap.to(cap.position, {
            y: Math.random() * 200 + 200, duration: Math.random() * 2 + 2,
            delay: idx * 0.6, repeat: -1, yoyo: true, ease: "elastic.out(1,0.3)",
          }));
        });
      },
      stop: () => {
        floatTweens.forEach((t) => t.kill());
        floatTweens = [];
        Object.values(SKILLS).forEach((skill) => {
          const cap = splineApp.findObjectByName(skill.name);
          if (cap) gsap.to(cap.position, { y: 0, duration: 4, ease: "elastic.out(1,0.7)" });
        });
      },
    };
    keycapsRef.current = keycapAnim;

    // Idle auto-rotate for hero section
    const kbd = splineApp.findObjectByName("keyboard") ?? splineApp.findObjectByName("Keyboard");
    let rotateKbd: gsap.core.Tween | undefined;
    if (kbd) {
      rotateKbd = gsap.to(kbd.rotation, {
        y: Math.PI * 2 + kbd.rotation.y, duration: 10,
        repeat: -1, yoyo: true, ease: "back.inOut", delay: 2.5, paused: true,
      });
    }

    const manage = async () => {
      if (activeSection === "hero")    { rotateKbd?.restart(); }
      else                             { rotateKbd?.pause(); }

      if (activeSection === "projects") {
        await sleep(300); if (cancelled) return; bongo.start();
      } else {
        await sleep(200); if (cancelled) return; bongo.stop();
      }

      if (activeSection === "contact") {
        await sleep(600); if (cancelled) return; keycapAnim.start();
      } else {
        await sleep(600); if (cancelled) return; keycapAnim.stop();
      }
    };
    void manage();

    return () => {
      cancelled = true;
      rotateKbd?.kill();
      bongo.stop();
      keycapAnim.stop();
    };
  }, [activeSection, splineApp]);

  // ── 4. Spline event listeners (keycap press / hover) ──────────────────────
  useEffect(() => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const el = document.activeElement;
      return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || (el as HTMLElement).isContentEditable);
    };

    const handleHover = (e: SplineEvent) => {
      if (selectedSkillRef.current?.name === e.target.name) return;
      if (e.target.name === "body" || e.target.name === "platform") {
        if (selectedSkillRef.current) playReleaseSound();
        selectedSkillRef.current = null;
        splineApp.setVariable("heading", ""); splineApp.setVariable("desc", "");
        return;
      }
      const skill = SKILLS[e.target.name];
      if (!skill) return;
      if (selectedSkillRef.current) playReleaseSound();
      playPressSound();
      selectedSkillRef.current = skill;
      splineApp.setVariable("heading", skill.label);
      splineApp.setVariable("desc",    skill.shortDescription);
    };

    splineApp.addEventListener("keyUp",     () => { if (!isInputFocused()) { playReleaseSound(); splineApp.setVariable("heading", ""); splineApp.setVariable("desc", ""); } });
    splineApp.addEventListener("keyDown",   (e) => { if (!isInputFocused()) { const s = SKILLS[e.target.name]; if (s) { playPressSound(); selectedSkillRef.current = s; splineApp.setVariable("heading", s.label); splineApp.setVariable("desc", s.shortDescription); } } });
    splineApp.addEventListener("mouseHover", handleHover);

    return () => { /* spline removes all on unmount */ };
  }, [splineApp, playPressSound, playReleaseSound]);

  // ── 5. Hash URL sync & page-visibility pause ──────────────────────────────
  useEffect(() => {
    const hash = activeSection === "hero" ? "" : `#${activeSection}`;
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search + hash);
  }, [activeSection]);

  useEffect(() => {
    if (!splineApp) return;
    const onVis = () => document.hidden ? splineApp.stop() : splineApp.play();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [splineApp]);

  return (
    /* Fixed full-viewport layer — z-0, behind all page content */
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 w-screen h-screen pointer-events-none"
      aria-hidden="true"
    >
      <Spline
        className="w-full h-full pointer-events-auto"
        scene="/assets/skills-keyboard.spline"
        onLoad={(app: Application) => setSplineApp(app)}
      />
    </div>
  );
}
