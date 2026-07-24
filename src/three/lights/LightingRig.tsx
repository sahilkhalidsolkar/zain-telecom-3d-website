'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/store/useScrollStore';
import { sampleKeyframes } from '@/utils/math';

/**
 * Warmth ramps up entering Human Impact (Ch8) — "purple fades to warm
 * lighting" per the brief — and back down entering the closing Progress with
 * Purpose chapter (Ch9), which reads as bright/energetic rather than warm.
 */
const WARMTH_KEYFRAMES = [
  { at: 0, value: 0 },
  { at: 7 / 9 - 0.02, value: 0 },
  { at: 7 / 9 + 0.03, value: 1 },
  { at: 8 / 9 - 0.02, value: 1 },
  { at: 8 / 9 + 0.03, value: 0 },
  { at: 1, value: 0 },
];

const COOL = new THREE.Color('#ffffff');
const WARM = new THREE.Color('#ffb066');

/**
 * Fixed "sun" direction (independent of Earth's own rotation) plus a soft
 * ambient fill, both tinted warm during Human Impact and back to neutral
 * elsewhere — the only cross-chapter lighting mood shift the brief calls for.
 */
export const LightingRig = () => {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const progress = useScrollStore.getState().canvasProgress;
    const warmth = sampleKeyframes(progress, WARMTH_KEYFRAMES);

    if (ambientRef.current) {
      ambientRef.current.color.copy(COOL).lerp(WARM, warmth);
    }
    if (directionalRef.current) {
      directionalRef.current.color.copy(COOL).lerp(WARM, warmth);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.35} />
      <directionalLight ref={directionalRef} position={[5, 2, 5]} intensity={1.4} />
    </>
  );
};
