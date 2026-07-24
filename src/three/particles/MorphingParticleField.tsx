'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/store/useScrollStore';
import { usePerformanceStore } from '@/store/usePerformanceStore';
import { buildMorphTargets } from './morphTargets';
import { lerp, mapRange } from '@/utils/math';
import type { MorphTargetKey } from '@/constants/chapters';
import type { QualityTier } from '@/types/performance';

/**
 * The "purple pulse" thread running through the whole experience. One
 * instanced particle system whose target shape is blended between named
 * keyframes as scroll progress advances — the same particles become the
 * network, the Earth's surface, and so on, rather than being swapped for
 * different objects. Keyframe `at` values line up with the chapter
 * boundaries in `chapters.ts` where each transformation begins.
 *
 * The 'dissolvedToEcosystem' shape (Ch6/7) is deliberately not used yet —
 * without the actual labeled ecosystem-node system built (a later phase),
 * particles alone clumping into that shape just reads as messy floating
 * blobs. Particles stay in the network-sphere shell through Ch6/7 instead,
 * matching Earth/arcs/satellites staying visible through those chapters too.
 */
const MORPH_KEYFRAMES: { key: MorphTargetKey; at: number; colorMix: number }[] = [
  { key: 'scattered', at: 0, colorMix: 0 },
  { key: 'networkSphere', at: 2 / 9, colorMix: 0 },
  { key: 'humanCluster', at: 7 / 9, colorMix: 1 },
  { key: 'earthReform', at: 8 / 9, colorMix: 0 },
];

// Halved so the *pulse*2.0 boost below peaks at the intended hue instead of
// clipping the R/B channels to full while G stays low, which reads as
// magenta rather than purple once many additive-blended particles overlap.
const PURPLE = new THREE.Color('#8a2be2').multiplyScalar(0.5);
const WARM = new THREE.Color('#ffb066').multiplyScalar(0.5);

const PARTICLE_COUNT_BY_TIER: Record<QualityTier, number> = {
  high: 6000,
  medium: 3000,
  low: 1200,
};

interface MorphingParticleFieldProps {
  /** Overrides the tier-based default (mainly for tests/storybook-style use). */
  count?: number;
}

export const MorphingParticleField = ({ count: countOverride }: MorphingParticleFieldProps) => {
  const qualityTier = usePerformanceStore((state) => state.qualityTier);
  const count = countOverride ?? PARTICLE_COUNT_BY_TIER[qualityTier];

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const targets = useMemo(() => buildMorphTargets(count), [count]);

  // Mutated every frame in useFrame below (uTime/uColorMix uniforms) — see
  // the src/three/ eslint override for why that's fine here.
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColorA: { value: PURPLE.clone() },
          uColorB: { value: WARM.clone() },
          uColorMix: { value: 0 },
        },
        vertexShader: `
          void main() {
            gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uColorMix;
          void main() {
            float pulse = sin(uTime * 1.5) * 0.25 + 0.75;
            vec3 color = mix(uColorA, uColorB, uColorMix);
            gl_FragColor = vec4(color * pulse * 2.0, 1.0);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const progress = useScrollStore.getState().canvasProgress;

    let segment = MORPH_KEYFRAMES.length - 2;
    for (let i = 0; i < MORPH_KEYFRAMES.length - 1; i++) {
      if (progress >= MORPH_KEYFRAMES[i].at && progress < MORPH_KEYFRAMES[i + 1].at) {
        segment = i;
        break;
      }
    }

    const from = MORPH_KEYFRAMES[segment];
    const to = MORPH_KEYFRAMES[segment + 1];
    const t = mapRange(progress, from.at, to.at, 0, 1);

    const fromPositions = targets[from.key];
    const toPositions = targets[to.key];

    shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    shaderMaterial.uniforms.uColorMix.value = lerp(from.colorMix, to.colorMix, t);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      dummy.position.set(
        lerp(fromPositions[idx], toPositions[idx], t),
        lerp(fromPositions[idx + 1], toPositions[idx + 1], t),
        lerp(fromPositions[idx + 2], toPositions[idx + 2], t)
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[0.045, 0]} />
      <primitive object={shaderMaterial} attach="material" />
    </instancedMesh>
  );
};
