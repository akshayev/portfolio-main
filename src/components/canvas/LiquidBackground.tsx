"use client";

import { useEffect, useRef, useCallback } from "react";

interface Orb {
  x: number;
  y: number;
  radius: number;
  xOffset: number;
  yOffset: number;
  xSpeed: number;
  ySpeed: number;
  radiusSpeed: number;
  radiusRange: number;
  baseRadius: number;
  colorStop0: string;
  colorStop1: string;
}

const MAX_DPR = 1.5;

export function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const orbsRef = useRef<Orb[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const initOrbs = useCallback((width: number, height: number): Orb[] => {
    const shorter = Math.min(width, height);

    return [
      {
        // Primary emerald orb — dominant, slow, large
        x: 0,
        y: 0,
        xOffset: width * 0.35,
        yOffset: height * 0.3,
        baseRadius: shorter * 0.48,
        radius: shorter * 0.48,
        radiusRange: shorter * 0.07,
        xSpeed: 0.00031,
        ySpeed: 0.00023,
        radiusSpeed: 0.00041,
        colorStop0: "rgba(16, 185, 129, 0.13)",
        colorStop1: "rgba(16, 185, 129, 0.0)",
      },
      {
        // Secondary emerald — offset position, medium
        x: 0,
        y: 0,
        xOffset: width * 0.68,
        yOffset: height * 0.72,
        baseRadius: shorter * 0.38,
        radius: shorter * 0.38,
        radiusRange: shorter * 0.06,
        xSpeed: 0.00041,
        ySpeed: 0.00037,
        radiusSpeed: 0.00053,
        colorStop0: "rgba(52, 211, 153, 0.10)",
        colorStop1: "rgba(16, 185, 129, 0.0)",
      },
      {
        // Cold slate accent — desaturated teal undertone
        x: 0,
        y: 0,
        xOffset: width * 0.15,
        yOffset: height * 0.78,
        baseRadius: shorter * 0.32,
        radius: shorter * 0.32,
        radiusRange: shorter * 0.05,
        xSpeed: 0.00027,
        ySpeed: 0.00049,
        radiusSpeed: 0.00037,
        colorStop0: "rgba(30, 41, 59, 0.55)",
        colorStop1: "rgba(17, 23, 42, 0.0)",
      },
      {
        // Top-right ambient emerald haze
        x: 0,
        y: 0,
        xOffset: width * 0.82,
        yOffset: height * 0.18,
        baseRadius: shorter * 0.42,
        radius: shorter * 0.42,
        radiusRange: shorter * 0.06,
        xSpeed: 0.00035,
        ySpeed: 0.00028,
        radiusSpeed: 0.00045,
        colorStop0: "rgba(16, 185, 129, 0.08)",
        colorStop1: "rgba(16, 185, 129, 0.0)",
      },
    ];
  }, []);

  const resizeCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rawDPR = window.devicePixelRatio ?? 1;
      const dpr = Math.min(rawDPR, MAX_DPR);

      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      dimensionsRef.current = { width: displayWidth, height: displayHeight };

      // Physical pixel size
      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);

      // CSS display size
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      // Scale context to match DPR
      ctx.scale(dpr, dpr);

      // Reinitialise orbs whenever dimensions change
      orbsRef.current = initOrbs(displayWidth, displayHeight);
    },
    [initOrbs]
  );

  const renderFrame = useCallback(
    (ctx: CanvasRenderingContext2D, timestamp: number) => {
      const { width, height } = dimensionsRef.current;
      const t = timestamp * 0.001; // seconds
      timeRef.current = t;

      // Clear with solid titanium background each frame
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#11172A";
      ctx.fillRect(0, 0, width, height);

      // Composite mode: additive blending for glow-like orb merging
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < orbsRef.current.length; i++) {
        const orb = orbsRef.current[i];

        // Slowly mutate X, Y using independent sin/cos waves per orb
        const cx =
          orb.xOffset +
          Math.sin(t * orb.xSpeed * 1000 + i * 1.4) * (width * 0.22) +
          Math.cos(t * orb.ySpeed * 900 + i * 0.9) * (width * 0.08);

        const cy =
          orb.yOffset +
          Math.cos(t * orb.ySpeed * 1000 + i * 2.1) * (height * 0.2) +
          Math.sin(t * orb.xSpeed * 850 + i * 1.3) * (height * 0.07);

        // Slowly breathe radius
        const r =
          orb.baseRadius +
          Math.sin(t * orb.radiusSpeed * 1000 + i * 0.7) * orb.radiusRange;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, orb.colorStop0);
        grad.addColorStop(1, orb.colorStop1);

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Reset composite to default
      ctx.globalCompositeOperation = "source-over";
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial sizing
    resizeCanvas(canvas);

    // ResizeObserver for dynamic container resizing
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new ResizeObserver(() => {
      // Debounce rapid resize events
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Must reset transform before re-scaling
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        resizeCanvas(canvas);
      }, 100);
    });
    observer.observe(document.documentElement);

    // Animation loop
    const loop = (timestamp: number) => {
      renderFrame(ctx, timestamp);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [resizeCanvas, renderFrame]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-50 pointer-events-none block"
    />
  );
}
