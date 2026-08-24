"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useAnimation, useInView, useScroll, useTransform } from "framer-motion";
import type { Application, SplineEvent } from "@splinetool/runtime";
import { BriefcaseBusiness, Code2, File } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

const importSpline = () => import("@splinetool/react-spline");
const Spline = dynamic(importSpline, {
  ssr: false,
  loading: () => null,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Section = "hero" | "skills" | "projects" | "contact";
type Skill = {
  name: string;
  label: string;
  shortDescription: string;
};

const SKILLS: Record<string, Skill> = {
  js: { name: "js", label: "JavaScript", shortDescription: "Production-grade browser and server logic." },
  ts: { name: "ts", label: "TypeScript", shortDescription: "Typed systems with safer refactors and clearer contracts." },
  html: { name: "html", label: "HTML", shortDescription: "Accessible document structure and semantic interfaces." },
  css: { name: "css", label: "CSS", shortDescription: "Responsive layout, animation, and polished visual systems." },
  react: { name: "react", label: "React", shortDescription: "Component architecture for interactive product surfaces." },
  vue: { name: "vue", label: "Vue", shortDescription: "Reactive UI workflows and component-driven delivery." },
  nextjs: { name: "nextjs", label: "Next.js", shortDescription: "Full-stack React, routing, caching, and server rendering." },
  tailwind: { name: "tailwind", label: "Tailwind CSS", shortDescription: "Fast, consistent utility-first interface styling." },
  nodejs: { name: "nodejs", label: "Node.js", shortDescription: "API services, integrations, and realtime backends." },
  express: { name: "express", label: "Express", shortDescription: "Lean HTTP services and middleware pipelines." },
  postgres: { name: "postgres", label: "PostgreSQL", shortDescription: "Relational data modeling and query performance." },
  mongodb: { name: "mongodb", label: "MongoDB", shortDescription: "Document data models for flexible product workflows." },
  git: { name: "git", label: "Git", shortDescription: "Version control, review flow, and release discipline." },
  github: { name: "github", label: "GitHub", shortDescription: "CI, pull requests, collaboration, and automation." },
  prettier: { name: "prettier", label: "Prettier", shortDescription: "Consistent formatting across shared codebases." },
  npm: { name: "npm", label: "npm", shortDescription: "Package management and dependency operations." },
  firebase: { name: "firebase", label: "Firebase", shortDescription: "Managed realtime services and app infrastructure." },
  wordpress: { name: "wordpress", label: "WordPress", shortDescription: "CMS implementation and custom content workflows." },
  linux: { name: "linux", label: "Linux", shortDescription: "Shell, deployment, and production environment fluency." },
  docker: { name: "docker", label: "Docker", shortDescription: "Containerized development and deployment pipelines." },
  nginx: { name: "nginx", label: "Nginx", shortDescription: "Reverse proxies, routing, and static asset delivery." },
  aws: { name: "aws", label: "AWS", shortDescription: "Cloud services, deployment, and production operations." },
  gcp: { name: "gcp", label: "Google Cloud", shortDescription: "Cloud compute, storage, and managed platform services." },
  vim: { name: "vim", label: "Vim", shortDescription: "Keyboard-native editing and terminal workflows." },
  vercel: { name: "vercel", label: "Vercel", shortDescription: "Frontend delivery, previews, and edge deployment." },
};

const STATES = {
  hero: {
    desktop: {
      scale: { x: 0.2, y: 0.2, z: 0.2 },
      position: { x: 225, y: -100, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      position: { x: 0, y: -200, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
  skills: {
    desktop: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: -40, z: 0 },
      rotation: { x: 0, y: Math.PI / 12, z: 0 },
    },
    mobile: {
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      position: { x: 0, y: -40, z: 0 },
      rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
  },
  projects: {
    desktop: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: -40, z: 0 },
      rotation: { x: Math.PI, y: Math.PI / 3, z: Math.PI },
    },
    mobile: {
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      position: { x: 0, y: 150, z: 0 },
      rotation: { x: Math.PI, y: Math.PI / 3, z: Math.PI },
    },
  },
  contact: {
    desktop: {
      scale: { x: 0.2, y: 0.2, z: 0.2 },
      position: { x: 350, y: -250, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: 150, z: 0 },
      rotation: { x: Math.PI, y: Math.PI / 3, z: Math.PI },
    },
  },
};

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const result = matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setValue(event.matches);

    setValue(result.matches);
    result.addEventListener("change", onChange);
    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

function getKeyboardState({ section, isMobile }: { section: Section; isMobile: boolean }) {
  const baseTransform = STATES[section][isMobile ? "mobile" : "desktop"];
  const width = window.innerWidth;
  const targetScale = isMobile ? width / 390 : width / 1280;
  const minScale = 0.5;
  const maxScale = isMobile ? 0.6 : 1.15;
  const scaleOffset = Math.min(Math.max(targetScale, minScale), maxScale);

  return {
    ...baseTransform,
    scale: {
      x: Math.abs(baseTransform.scale.x * scaleOffset),
      y: Math.abs(baseTransform.scale.y * scaleOffset),
      z: Math.abs(baseTransform.scale.z * scaleOffset),
    },
  };
}

function useKeycapSounds() {
  const pressRef = useRef<HTMLAudioElement | null>(null);
  const releaseRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    pressRef.current = new Audio("/assets/keycap-sounds/press.mp3");
    releaseRef.current = new Audio("/assets/keycap-sounds/release.mp3");
  }, []);

  const play = useCallback((audio: HTMLAudioElement | null) => {
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, []);

  return {
    playPressSound: useCallback(() => play(pressRef.current), [play]),
    playReleaseSound: useCallback(() => play(releaseRef.current), [play]),
  };
}

function KeyboardScene() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const selectedSkillRef = useRef<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [keyboardRevealed, setKeyboardRevealed] = useState(false);
  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const { playPressSound, playReleaseSound } = useKeycapSounds();

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
      return;
    }

    const skill = SKILLS[e.target.name];
    if (!skill) return;
    if (selectedSkillRef.current) playReleaseSound();
    playPressSound();
    setSelectedSkill(skill);
    selectedSkillRef.current = skill;
  };

  // ── GSAP Scroll-Linked Physics Engine ───────────────────────────
  useGSAP(
    () => {
      if (!splineApp) return;
      const kbd = splineApp.findObjectByName("keyboard") || splineApp.findObjectByName("Keyboard");
      if (!kbd) return;

      const heroState = getKeyboardState({ section: "hero", isMobile });
      gsap.set(kbd.scale, heroState.scale);
      gsap.set(kbd.position, heroState.position);
      gsap.set(kbd.rotation, heroState.rotation);

      // 1. Continuous Hero Scroll Scrub (Rotation, Zoom, Position & Scale)
      gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // Dynamically adjust Spline zoom on scroll
            if (typeof splineApp.setZoom === "function") {
              const zoom = gsap.utils.interpolate(1, 0.85, p);
              splineApp.setZoom(zoom);
            }

            const targetSkills = getKeyboardState({ section: "skills", isMobile });

            // Smooth position shift from right into center
            kbd.position.x = gsap.utils.interpolate(heroState.position.x, targetSkills.position.x, p);
            kbd.position.y = gsap.utils.interpolate(heroState.position.y, targetSkills.position.y, p);
            kbd.position.z = gsap.utils.interpolate(heroState.position.z, targetSkills.position.z, p);

            // Rotate upwards to showcase keycaps and turn towards skills angle
            kbd.rotation.x = gsap.utils.interpolate(
              heroState.rotation.x,
              targetSkills.rotation.x + 0.35 * Math.sin(p * Math.PI),
              p
            );
            kbd.rotation.y = gsap.utils.interpolate(heroState.rotation.y, targetSkills.rotation.y, p);
            kbd.rotation.z = gsap.utils.interpolate(heroState.rotation.z, targetSkills.rotation.z, p);

            // Scale interpolation
            const currentScale = gsap.utils.interpolate(heroState.scale.x, targetSkills.scale.x, p);
            kbd.scale.x = currentScale;
            kbd.scale.y = currentScale;
            kbd.scale.z = currentScale;
          },
        },
      });

      // 2. Section Timeline Triggers (Skills, Projects, Contact)
      const createSectionTimeline = (
        triggerId: string,
        targetSection: Section,
        prevSection: Section,
        start = "top 50%",
        end = "bottom bottom"
      ) => {
        const el = document.querySelector(triggerId);
        if (!el) return;

        ScrollTrigger.create({
          trigger: triggerId,
          start,
          end,
          scrub: 1,
          onEnter: () => {
            setActiveSection(targetSection);
            const state = getKeyboardState({ section: targetSection, isMobile });
            gsap.to(kbd.scale, { ...state.scale, duration: 1.2, ease: "power2.out" });
            gsap.to(kbd.position, { ...state.position, duration: 1.2, ease: "power2.out" });
            gsap.to(kbd.rotation, { ...state.rotation, duration: 1.2, ease: "power2.out" });
          },
          onLeaveBack: () => {
            setActiveSection(prevSection);
            const state = getKeyboardState({ section: prevSection, isMobile });
            gsap.to(kbd.scale, { ...state.scale, duration: 1.2, ease: "power2.out" });
            gsap.to(kbd.position, { ...state.position, duration: 1.2, ease: "power2.out" });
            gsap.to(kbd.rotation, { ...state.rotation, duration: 1.2, ease: "power2.out" });
          },
        });
      };

      createSectionTimeline("#skills", "skills", "hero");
      createSectionTimeline("#projects", "projects", "skills", "top 70%");
      createSectionTimeline("#contact", "contact", "projects", "top 30%");
    },
    { dependencies: [splineApp, isMobile] }
  );

  const getBongoAnimation = () => {
    const framesParent = splineApp?.findObjectByName("bongo-cat");
    const frame1 = splineApp?.findObjectByName("frame-1");
    const frame2 = splineApp?.findObjectByName("frame-2");

    if (!frame1 || !frame2 || !framesParent) {
      return { start: () => undefined, stop: () => undefined };
    }

    let interval: ReturnType<typeof setInterval>;
    const start = () => {
      let i = 0;
      framesParent.visible = true;
      interval = setInterval(() => {
        frame1.visible = i % 2 === 0;
        frame2.visible = i % 2 !== 0;
        i += 1;
      }, 100);
    };
    const stop = () => {
      clearInterval(interval);
      framesParent.visible = false;
      frame1.visible = false;
      frame2.visible = false;
    };
    return { start, stop };
  };

  const getKeycapsAnimation = () => {
    if (!splineApp) return { start: () => undefined, stop: () => undefined };

    let floatTweens: gsap.core.Tween[] = [];
    let settleTweens: gsap.core.Tween[] = [];
    const killFloat = () => {
      floatTweens.forEach((tween) => tween.kill());
      floatTweens = [];
    };
    const killSettle = () => {
      settleTweens.forEach((tween) => tween.kill());
      settleTweens = [];
    };

    const start = () => {
      killSettle();
      killFloat();
      Object.values(SKILLS)
        .sort(() => Math.random() - 0.5)
        .forEach((skill, idx) => {
          const keycap = splineApp.findObjectByName(skill.name);
          if (!keycap) return;
          floatTweens.push(
            gsap.to(keycap.position, {
              y: Math.random() * 200 + 200,
              duration: Math.random() * 2 + 2,
              delay: idx * 0.6,
              repeat: -1,
              yoyo: true,
              yoyoEase: "none",
              ease: "elastic.out(1,0.3)",
            })
          );
        });
    };

    const stop = () => {
      killFloat();
      killSettle();
      Object.values(SKILLS).forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        settleTweens.push(
          gsap.to(keycap.position, {
            y: 0,
            duration: 4,
            ease: "elastic.out(1,0.7)",
          })
        );
      });
    };

    return { start, stop };
  };

  const updateKeyboardTransform = async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard") || splineApp.findObjectByName("Keyboard");
    if (!kbd) return;

    kbd.visible = false;
    await sleep(400);
    kbd.visible = true;
    setKeyboardRevealed(true);

    const currentState = getKeyboardState({ section: activeSection, isMobile });
    gsap.fromTo(
      kbd.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      { ...currentState.scale, duration: 1.5, ease: "elastic.out(1, 0.6)" }
    );

    const allObjects = splineApp.getAllObjects();
    const keycaps = allObjects.filter((obj) => obj.name === "keycap");

    await sleep(900);

    if (isMobile) {
      allObjects.filter((obj) => obj.name === "keycap-mobile").forEach((keycap) => {
        keycap.visible = true;
      });
    } else {
      allObjects.filter((obj) => obj.name === "keycap-desktop").forEach(async (keycap, idx) => {
        await sleep(idx * 70);
        keycap.visible = true;
      });
    }

    keycaps.forEach(async (keycap, idx) => {
      keycap.visible = false;
      await sleep(idx * 70);
      keycap.visible = true;
      gsap.fromTo(
        keycap.position,
        { y: 200 },
        { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" }
      );
    });
  };

  useEffect(() => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    splineApp.addEventListener("keyUp", () => {
      if (isInputFocused()) return;
      playReleaseSound();
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
    });
    splineApp.addEventListener("keyDown", (e) => {
      if (isInputFocused()) return;
      const skill = SKILLS[e.target.name];
      if (!skill) return;
      playPressSound();
      setSelectedSkill(skill);
      selectedSkillRef.current = skill;
      splineApp.setVariable("heading", skill.label);
      splineApp.setVariable("desc", skill.shortDescription);
    });
    splineApp.addEventListener("mouseHover", handleMouseHover);

    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();

    return () => {
      bongoAnimationRef.current?.stop();
      keycapAnimationsRef.current?.stop();
    };
  }, [splineApp, isMobile, playPressSound, playReleaseSound]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    splineApp.setVariable("heading", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill, splineApp]);

  useEffect(() => {
    if (!splineApp) return;
    let cancelled = false;
    let rotateKeyboard: gsap.core.Tween | undefined;
    let teardownKeyboard: gsap.core.Tween | undefined;
    const kbd = splineApp.findObjectByName("keyboard");

    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, {
        y: Math.PI * 2 + kbd.rotation.y,
        duration: 10,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "back.inOut",
        delay: 2.5,
        paused: true,
      });

      teardownKeyboard = gsap.fromTo(
        kbd.rotation,
        { y: 0, x: -Math.PI, z: 0 },
        {
          y: -Math.PI / 2,
          duration: 5,
          repeat: -1,
          yoyo: true,
          yoyoEase: true,
          delay: 2.5,
          immediateRender: false,
          paused: true,
        }
      );
    }

    const manageAnimations = async () => {
      if (activeSection !== "skills") {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }

      if (activeSection === "hero") {
        rotateKeyboard?.restart();
        teardownKeyboard?.pause();
      } else if (activeSection === "contact") {
        rotateKeyboard?.pause();
      } else {
        rotateKeyboard?.pause();
        teardownKeyboard?.pause();
      }

      if (activeSection === "projects") {
        await sleep(300);
        if (cancelled) return;
        bongoAnimationRef.current?.start();
      } else {
        await sleep(200);
        if (cancelled) return;
        bongoAnimationRef.current?.stop();
      }

      if (activeSection === "contact") {
        await sleep(600);
        if (cancelled) return;
        teardownKeyboard?.restart();
        keycapAnimationsRef.current?.start();
      } else {
        await sleep(600);
        if (cancelled) return;
        teardownKeyboard?.pause();
        keycapAnimationsRef.current?.stop();
      }
    };

    void manageAnimations();

    return () => {
      cancelled = true;
      rotateKeyboard?.kill();
      teardownKeyboard?.kill();
    };
  }, [activeSection, splineApp]);

  useEffect(() => {
    const hash = activeSection === "hero" ? "" : `#${activeSection}`;
    const url = window.location.pathname + window.location.search + hash;
    window.history.replaceState(window.history.state, "", url);

    if (!splineApp || keyboardRevealed) return;
    void updateKeyboardTransform();
  }, [splineApp, activeSection, keyboardRevealed]);

  useEffect(() => {
    if (!splineApp) return;
    const onVisibility = () => {
      if (document.hidden) splineApp.stop();
      else splineApp.play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [splineApp]);

  return (
    <div ref={splineContainer} className="fixed inset-0 z-0 h-full w-full pointer-events-none">
      <Spline
        className="h-full w-full pointer-events-auto"
        onLoad={(app: Application) => setSplineApp(app)}
        scene="/assets/skills-keyboard.spline"
      />
    </div>
  );
}

function BlurIn({
  children,
  delay = 0,
  duration = 1,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

function BoxReveal({
  children,
  width = "fit-content",
  delay = 0,
}: {
  children: React.ReactElement;
  width?: "fit-content" | "100%";
  delay?: number;
}) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
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
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: "100%" } }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn", delay }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: "transparent",
        }}
      />
    </div>
  );
}

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="min-h-[50px] w-fit rounded-full border-2 border-white p-1"
      aria-hidden="true"
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 25], opacity: [1, 0] }}
        transition={{ duration: 1, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
        className="h-3 w-3 rounded-full bg-white"
      />
    </motion.div>
  );
}

function SectionWrapper({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <section id={id} ref={containerRef} className={cn("relative", className)}>
      <motion.div style={{ opacity, scale }} className="h-full w-full">
        {children}
      </motion.div>
    </section>
  );
}

function HeroButton({
  children,
  href,
  variant = "solid",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "solid" | "outline";
}) {
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

export function CinematicHero() {
  return (
    <SectionWrapper id="hero" className="hero-container h-screen w-full overflow-hidden bg-slate-100 dark:bg-transparent">
      <KeyboardScene />
      <div className="grid md:grid-cols-2 pointer-events-none">
        <div
          className={cn(
            "z-[2] col-span-1 h-[calc(100dvh-3rem)] md:h-[calc(100dvh-4rem)] pointer-events-none",
            "flex flex-col items-center justify-start md:items-start md:justify-center",
            "pt-28 sm:pb-16 md:p-20 lg:p-24 xl:p-28"
          )}
        >
          <div className="flex flex-col">
            <div>
              <BlurIn delay={0.7}>
                <p
                  className={cn(
                    "mt-4 cursor-default whitespace-nowrap bg-clip-text text-md font-medium text-slate-500 dark:text-zinc-400",
                    "md:self-start sm:text-xl md:text-xl"
                  )}
                >
                  Hi, I am
                  <br className="md:hidden" />
                </p>
              </BlurIn>

              <BlurIn delay={1}>
                <h1
                  className={cn(
                    "-ml-[6px] cursor-default text-left font-bold leading-none text-slate-800 dark:text-transparent",
                    "text-7xl md:text-7xl lg:text-8xl xl:text-9xl",
                    "font-sans [text-shadow:0_0_1px_rgba(255,255,255,0.9)] dark:[-webkit-text-stroke:1px_rgba(255,255,255,0.7)]"
                  )}
                >
                  Akshay
                  <br className="md:block" />
                  EV
                </h1>
              </BlurIn>

              <BlurIn delay={1.2}>
                <p
                  className={cn(
                    "cursor-default whitespace-nowrap bg-clip-text text-md font-medium text-slate-500 dark:text-zinc-400",
                    "md:mt-4 md:self-start sm:text-xl md:text-xl"
                  )}
                >
                  A Full Stack Web Developer
                </p>
              </BlurIn>
            </div>

            <div className="mt-8 flex w-fit flex-col gap-3">
              <BoxReveal delay={2} width="100%">
                <HeroButton href="/resume.pdf">
                  <File size={20} />
                  <span>Resume</span>
                </HeroButton>
              </BoxReveal>

              <div className="flex gap-3 md:self-start">
                <HeroButton href="#contact" variant="outline">
                  Hire Me
                </HeroButton>
                <div className="flex h-full items-center gap-2">
                  <HeroButton href="https://github.com/akshayev" variant="outline">
                    <Code2 size={20} aria-hidden="true" />
                    <span className="sr-only">GitHub</span>
                  </HeroButton>
                  <HeroButton href="https://www.linkedin.com/in/akshayev/" variant="outline">
                    <BriefcaseBusiness size={20} aria-hidden="true" />
                    <span className="sr-only">LinkedIn</span>
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
