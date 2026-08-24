"use client";

import React, { useRef } from "react";
import { motion, Variants } from "framer-motion";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const importSpline = () => import("@splinetool/react-spline");
const Spline = dynamic(importSpline, {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-emerald-500 font-mono text-sm">
      Loading 3D Engine...
    </div>
  ),
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(textRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      scale: 1.1,
      opacity: 0,
      y: 100,
    });
  }, { scope: containerRef });

  const title1 = "AKSHAY EV";
  const title2 = "FULL STACK ENGINEER";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, ease: [0.77, 0, 0.175, 1] },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: "100%", opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.77, 0, 0.175, 1] } },
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-[#050810] overflow-hidden select-none"
    >
      {/* 3D Spline Keyboard Background */}
      <div className="absolute inset-0 w-full h-[100vh] z-0 pointer-events-auto">
        <Spline
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Massive Overlapping Typography */}
      <div
        ref={textRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none mix-blend-difference"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="overflow-hidden">
            <motion.div className="flex">
              {title1.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={itemVariants}
                  className="text-6xl sm:text-9xl md:text-[12rem] font-extrabold tracking-tighter text-white uppercase leading-none"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.div>
          </div>
          <div className="overflow-hidden mt-4">
            <motion.div className="flex">
              {title2.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={itemVariants}
                  className="text-xl sm:text-4xl md:text-5xl font-light tracking-[0.2em] text-emerald-400 uppercase leading-none"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
