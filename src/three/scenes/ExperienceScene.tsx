'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { MorphingParticleField } from '@/three/particles/MorphingParticleField';
import { CameraRig } from '@/three/camera/CameraRig';
import { EarthSystem } from '@/three/earth/EarthSystem';
import { NetworkArcSystem } from '@/three/network/NetworkArcSystem';
import { SatelliteSystem } from '@/three/satellites/SatelliteSystem';
import { EcosystemNodeSystem } from '@/three/ecosystem/EcosystemNodeSystem';
import { DigitalCitySystem } from '@/three/city/DigitalCitySystem';
import { LightingRig } from '@/three/lights/LightingRig';
import { PerformanceMonitor } from '@/three/utils/PerformanceMonitor';
import { usePerformanceStore } from '@/store/usePerformanceStore';

/**
 * The single, continuously-mounted 3D scene for the whole experience.
 * Nothing in here unmounts as chapters advance — each visual system manages
 * its own visibility/opacity based on scroll progress (see `chapters.ts`
 * `visibleSystems`), rather than the discrete mount/unmount scenes the
 * project's initial scaffold assumed. That model can't produce the brief's
 * required morphs (particle -> network -> Earth -> ecosystem), so this
 * replaces it.
 */
export const ExperienceScene = () => {
  const qualityTier = usePerformanceStore((state) => state.qualityTier);

  return (
    <>
      <PerformanceMonitor />
      <CameraRig />
      <LightingRig />
      <MorphingParticleField />
      <EarthSystem />
      <NetworkArcSystem />
      <SatelliteSystem />
      <EcosystemNodeSystem />
      <DigitalCitySystem />

      {/* Skipped on 'low' tier — the particle shader already boosts
          brightness for bloom, but the extra composite pass isn't worth it
          on devices already struggling to hold frame rate. */}
      {qualityTier !== 'low' && (
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.4} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
};
