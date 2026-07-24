'use client';

import { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ExperienceScene } from '@/three/scenes/ExperienceScene';
import { usePerformanceStore } from '@/store/usePerformanceStore';
import type { QualityTier } from '@/types/performance';

const DPR_BY_TIER: Record<QualityTier, [number, number]> = {
  high: [1, 2],
  medium: [1, 1.5],
  low: [1, 1],
};

export const ThreeProvider = ({ children }: { children?: ReactNode }) => {
  const qualityTier = usePerformanceStore((state) => state.qualityTier);

  return (
    <div id="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={DPR_BY_TIER[qualityTier]}
      >
        <ExperienceScene />

        {/* Children can be additional global 3D elements or effects if needed */}
        {children}
      </Canvas>
    </div>
  );
};
