"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, ease: [0.77, 0, 0.175, 1] },
    },
  };

  const itemVariants = {
    hidden: { y: "100%", opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.77, 0, 0.175, 1] } },
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-[#050810] overflow-hidden select-none"
    >
      {/* 3D Spline Keyboard Background */}
      <div className="absolute inset-0 z-0">
        <Spline scene="https://prod.spline.design/kZCBKUjc7ToI2zKG/scene.splinecode" />
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
