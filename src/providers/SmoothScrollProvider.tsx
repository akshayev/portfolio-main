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
        duration: 2,
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
