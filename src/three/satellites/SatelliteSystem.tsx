'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAssets } from '@/hooks/useAssets';
import { useScrollStore } from '@/store/useScrollStore';
import { getActiveChapter } from '@/three/utils/chapterProgress';
import { EARTH_RADIUS } from '@/three/earth/EarthSystem';

interface OrbitConfig {
  radius: number;
  speed: number;
  tiltDeg: number;
  phase: number;
}

const ORBITS: OrbitConfig[] = [
  { radius: EARTH_RADIUS * 1.5, speed: 0.15, tiltDeg: 12, phase: 0 },
  { radius: EARTH_RADIUS * 1.7, speed: -0.11, tiltDeg: 55, phase: 2.1 },
  { radius: EARTH_RADIUS * 1.9, speed: 0.09, tiltDeg: -30, phase: 4.2 },
];

const SATELLITE_SCALE = 0.12;

/**
 * A handful of the existing satellite.glb model in slow, independent orbits
 * around the Earth — visible whenever chapter.visibleSystems.satellites is
 * true (Earth Emerges, Expansion, Living Network, Progress with Purpose).
 */
export const SatelliteSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const orbitRefs = useRef<THREE.Group[]>([]);
  const { getModel, isLoaded } = useAssets();

  const clonedScenes = useMemo(() => {
    const gltf = getModel('satellite');
    if (!gltf) return [];
    return ORBITS.map(() => gltf.scene.clone(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const progress = useScrollStore.getState().canvasProgress;
    const { chapter } = getActiveChapter(progress);
    group.visible = chapter.visibleSystems.satellites;
    if (!group.visible) return;

    orbitRefs.current.forEach((orbitGroup, i) => {
      if (!orbitGroup) return;
      const { speed, phase } = ORBITS[i];
      orbitGroup.rotation.y = state.clock.elapsedTime * speed + phase;
    });
  });

  if (!isLoaded || clonedScenes.length === 0) return null;

  return (
    <group ref={groupRef}>
      {ORBITS.map((orbit, i) => (
        <group
          key={i}
          rotation={[0, 0, THREE.MathUtils.degToRad(orbit.tiltDeg)]}
          ref={(el) => {
            if (el) orbitRefs.current[i] = el;
          }}
        >
          <group position={[orbit.radius, 0, 0]} scale={SATELLITE_SCALE}>
            <primitive object={clonedScenes[i]} />
          </group>
        </group>
      ))}
    </group>
  );
};
