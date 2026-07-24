'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getActiveChapter } from '@/three/utils/chapterProgress';
import { useScrollStore } from '@/store/useScrollStore';
import { createSeededRandom } from '@/utils/random';

const BUILDING_COUNT = 60;
/** Sits further out than the ecosystem core (z ≈ -10), so the Ch7 flythrough
 * passes the ecosystem first, then arrives at the city. */
const CITY_CENTER_Z = -20;
const CITY_HALF_WIDTH = 7;
const CITY_DEPTH = 10;

interface Building {
  position: [number, number, number];
  height: number;
  width: number;
}

const buildBuildings = (): Building[] => {
  const rand = createSeededRandom(7);
  return Array.from({ length: BUILDING_COUNT }, () => {
    const height = 1.5 + rand() * 5;
    const width = 0.5 + rand() * 0.6;
    const x = (rand() - 0.5) * CITY_HALF_WIDTH * 2;
    const z = CITY_CENTER_Z + (rand() - 0.5) * CITY_DEPTH;
    return { position: [x, height / 2, z], height, width };
  });
};

/**
 * Chapter 7's glass-city flythrough: lightweight instanced buildings with a
 * faint emissive glow (not real architectural models — kept cheap per the
 * project's performance strategy for "peak complexity" chapters). Visible
 * only while chapter.visibleSystems.city is true.
 */
export const DigitalCitySystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const buildings = useMemo(() => buildBuildings(), []);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const progress = useScrollStore.getState().canvasProgress;
    const { chapter } = getActiveChapter(progress);
    group.visible = chapter.visibleSystems.city;
  });

  return (
    <group ref={groupRef} visible={false}>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position}>
          <boxGeometry args={[b.width, b.height, b.width]} />
          <meshStandardMaterial color="#0d0221" emissive="#8a2be2" emissiveIntensity={0.35} roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
};
