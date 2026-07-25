'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EXPANSION_COUNTRIES, FIVE_G_MARKETS } from '@/constants/chapters';
import { getActiveChapter } from '@/three/utils/chapterProgress';
import { useScrollStore } from '@/store/useScrollStore';
import { latLongToVector3 } from '@/utils/math';
import { EARTH_RADIUS } from '@/three/earth/EarthSystem';
import { earthRotationState } from '@/three/earth/earthRotation';

const SURFACE_RADIUS = EARTH_RADIUS * 1.005;
const CYAN = new THREE.Color('#22d3ee');
const RINGS_PER_MARKET = 3;
const RING_CYCLE_SECONDS = 2.4;
const RING_MAX_SCALE = 7;
const RING_INNER = 0.04;
const RING_OUTER = 0.055;

interface Marker {
  position: [number, number, number];
  quaternion: THREE.Quaternion;
}

/**
 * Chapter 7's "5G active in 4 markets" fact, made visible: expanding cyan
 * "radar ping" rings lying flat against the surface, emanating from Kuwait,
 * Saudi Arabia, Bahrain, and Jordan specifically (`FIVE_G_MARKETS`) — cyan
 * rather than Expansion's red beacons so the two data points read as
 * distinct devices, not a repeat of the same one. Visible only while
 * chapter.visibleSystems.coverageRings is true (Innovation), but stays
 * mounted throughout — opacity, not existence, gates it, per the project's
 * continuous-scene architecture.
 */
export const CoverageRingSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const materialRefs = useRef<THREE.MeshBasicMaterial[]>([]);

  const markers = useMemo<Marker[]>(
    () =>
      FIVE_G_MARKETS.map((name) => {
        const country = EXPANSION_COUNTRIES.find((c) => c.name === name);
        if (!country) throw new Error(`FIVE_G_MARKETS references unknown country: ${name}`);
        const position = latLongToVector3(country.lat, country.lon, SURFACE_RADIUS);
        const normal = new THREE.Vector3(...position).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        return { position, quaternion };
      }),
    []
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    // Anchored to specific surface points, same as CountryBeaconSystem — must
    // rotate in lockstep with Earth's own (now variable) rotation.
    group.rotation.y = earthRotationState.value;

    const progress = useScrollStore.getState().canvasProgress;
    const { chapter } = getActiveChapter(progress);
    const visible = chapter.visibleSystems.coverageRings;
    group.visible = visible;
    if (!visible) return;

    const t = state.clock.elapsedTime;

    ringRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const ringIndex = i % RINGS_PER_MARKET;
      const phase = (t / RING_CYCLE_SECONDS + ringIndex / RINGS_PER_MARKET) % 1;
      mesh.scale.setScalar(1 + phase * (RING_MAX_SCALE - 1));

      const material = materialRefs.current[i];
      if (material) {
        material.opacity = (1 - phase) * 0.7;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {markers.map((marker, markerIndex) => (
        <group key={markerIndex} position={marker.position} quaternion={marker.quaternion}>
          {Array.from({ length: RINGS_PER_MARKET }).map((_, ringIndex) => {
            const flatIndex = markerIndex * RINGS_PER_MARKET + ringIndex;
            return (
              <mesh
                key={ringIndex}
                rotation={[-Math.PI / 2, 0, 0]}
                ref={(el) => {
                  if (el) ringRefs.current[flatIndex] = el;
                }}
              >
                <ringGeometry args={[RING_INNER, RING_OUTER, 48]} />
                <meshBasicMaterial
                  ref={(el) => {
                    if (el) materialRefs.current[flatIndex] = el;
                  }}
                  color={CYAN}
                  transparent
                  opacity={0}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
};
