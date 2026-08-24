"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const skills = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "FastAPI",
  "Supabase",
  "Azure",
  "Power Platform",
  "Gemini API",
  "C++",
  "SQL",
  "Firebase",
];

export function TechSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 4;
  const count = skills.length;

  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians

    for (let i = 0; i < count; i++) {
      // y goes from 1 to -1
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      pos.push([x * radius, y * radius, z * radius]);
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x -= delta / 10;
      groupRef.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => (
        <Text
          key={skill}
          position={positions[i]}
          color="#10B981"
          fontSize={0.5}
          outlineColor="#0B0F19"
          outlineWidth={0.05}
          anchorX="center"
          anchorY="middle"
        >
          {skill}
        </Text>
      ))}
    </group>
  );
}
