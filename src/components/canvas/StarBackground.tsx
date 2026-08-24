"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import dynamic from "next/dynamic";
import type * as THREE from "three";

/**
 * RotatingStarField — Animated Three.js group rotating stars endlessly across X and Y axes.
 * Math:
 *   rotation.x -= delta / 10
 *   rotation.y -= delta / 15
 */
function RotatingStarField() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x -= delta / 10;
      groupRef.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </group>
  );
}

function StarCanvasInner() {
  return (
    <div
      className="fixed inset-0 -z-50 h-full w-full pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <RotatingStarField />
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * StarBackground — Dynamically imported (ssr: false) React Three Fiber starfield canvas
 * creating a deep-space 3D environment behind the portfolio.
 */
export const StarBackground = dynamic(() => Promise.resolve(StarCanvasInner), {
  ssr: false,
});
