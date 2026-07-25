'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { MorphingParticleField } from '@/three/particles/MorphingParticleField';
import { CameraRig } from '@/three/camera/CameraRig';
import { EarthSystem } from '@/three/earth/EarthSystem';
import { CountryBeaconSystem } from '@/three/network/CountryBeaconSystem';
import { CoverageRingSystem } from '@/three/network/CoverageRingSystem';
import { SatelliteSystem } from '@/three/satellites/SatelliteSystem';
import { Starfield } from '@/three/background/Starfield';
import { LightingRig } from '@/three/lights/LightingRig';
import { PerformanceMonitor } from '@/three/utils/PerformanceMonitor';
import { usePerformanceStore } from '@/store/usePerformanceStore';

/**
 * The single, continuously-mounted 3D scene for the whole experience.
 * Nothing in here unmounts as chapters advance — each visual system manages
 * its own visibility/opacity based on scroll progress (see `chapters.ts`
 * `visibleSystems`), rather than the discrete mount/unmount scenes the
 * project's initial scaffold assumed. That model can't produce the brief's
 * required morphs (particle -> network -> Earth), so this replaces it.
 *
 * Chapters 6/7 (Transformation, Innovation) previously had a 3D orbiting
 * "ecosystem node" system and a procedural city — both removed. The node
 * labels billboarded incorrectly (mirrored text, since the per-node
 * quaternion copy didn't account for the parent group's own rotation) and
 * read as unpolished flat-shaded spheres regardless; the city buildings
 * were being clipped by the camera flythrough, filling the frame with flat
 * color. Ch.6/7 now stay on the same Earth/particle/network continuum as
 * Ch.3-5, with the 7 ecosystem brands presented entirely via the
 * glassmorphism cards (`ChapterCards`) instead of 3D geometry.
 */
export const ExperienceScene = () => {
  const qualityTier = usePerformanceStore((state) => state.qualityTier);

  return (
    <>
      <PerformanceMonitor />
      <CameraRig />
      <LightingRig />
      <Starfield />
      <MorphingParticleField />
      <EarthSystem />
      <CountryBeaconSystem />
      <CoverageRingSystem />
      <SatelliteSystem />

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
