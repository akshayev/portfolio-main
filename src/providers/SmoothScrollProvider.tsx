"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
  isInsideModal = false,
}: {
  children: React.ReactNode;
  isInsideModal?: boolean;
}) {
  const lenis = useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    if (!lenis) return;

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(raf);
  }, [lenis]);

  return (
    <ReactLenis
      root
      autoRaf={false}
      options={{
        // lerp: 0.05 — very low linear interpolation factor creates the heavy,
        // cinematic "dragging" scroll feel characteristic of Naresh-Khatri/3d-portfolio.
        // Higher lerp (e.g. 0.1) feels snappier; lower (0.03) feels syrupy.
        lerp: 0.05,
        duration: 2,
        smoothWheel: true,
        // syncTouch: true — applies smooth scroll physics on touch devices too,
        // giving mobile the same cinematic feel as desktop.
        syncTouch: true,
        prevent: (node) => {
          if (isInsideModal) return true;
          return node.classList.contains("modall");
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}
