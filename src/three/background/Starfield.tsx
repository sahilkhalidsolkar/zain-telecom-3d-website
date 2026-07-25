'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceStore } from '@/store/usePerformanceStore';
import { createSeededRandom } from '@/utils/random';
import type { QualityTier } from '@/types/performance';

const STAR_COUNT_BY_TIER: Record<QualityTier, number> = {
  high: 3000,
  medium: 1600,
  low: 800,
};

/** Far enough out that no camera position in any chapter (max distance
 * ~14, in Purpose's pullback) gets remotely close. */
const STARFIELD_RADIUS = 60;

const buildStarPositions = (count: number): Float32Array => {
  const rand = createSeededRandom(1337);
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Slight depth variation (0.7-1.0x radius) so it doesn't read as a
    // perfectly flat shell once particles/Earth pass in front of it.
    const radius = STARFIELD_RADIUS * (0.7 + rand() * 0.3);
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  return positions;
};

/**
 * A subtle, distant starfield — per the original vision doc ("stars should
 * remain subtle in the background and never distract from the primary
 * narrative"), a requirement `src/three/background/` existed as an empty
 * placeholder folder for since the initial scaffold but never actually
 * implemented. Purely ambient depth: rotates independently of Earth at a
 * near-imperceptible rate, present for the whole experience (not gated by
 * chapter) since it's just backdrop, never the subject.
 */
export const Starfield = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const qualityTier = usePerformanceStore((state) => state.qualityTier);
  const count = STAR_COUNT_BY_TIER[qualityTier];
  const positions = useMemo(() => buildStarPositions(count), [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.0025;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.18} sizeAttenuation color="#ffffff" transparent opacity={0.55} depthWrite={false} />
    </points>
  );
};
