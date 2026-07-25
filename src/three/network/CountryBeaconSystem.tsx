'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EXPANSION_COUNTRIES } from '@/constants/chapters';
import { getActiveChapter } from '@/three/utils/chapterProgress';
import { useScrollStore } from '@/store/useScrollStore';
import { latLongToVector3, mapRange } from '@/utils/math';
import { EARTH_RADIUS, EARTH_ROTATION_SPEED } from '@/three/earth/EarthSystem';

const SURFACE_RADIUS = EARTH_RADIUS * 1.01;
const BEAM_HEIGHT = 0.65;
const BEAM_RADIUS = 0.018;
const RED = new THREE.Color('#ff1a3c');

const BEAM_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BEAM_FRAGMENT = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    // Soft glow across the beam's width (uv.x wraps the cylinder's
    // circumference), brighter near the ground than at the tip.
    float radial = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 2.0);
    float verticalFade = mix(1.0, 0.35, vUv.y);
    float flicker = 0.85 + 0.15 * sin(uTime * 6.0 + vUv.y * 8.0);
    gl_FragColor = vec4(uColor * flicker * 2.0, radial * verticalFade * uOpacity);
  }
`;

interface Beacon {
  position: [number, number, number];
  quaternion: THREE.Quaternion;
}

/**
 * Chapter 4's "one nation to eight markets" beat: each of Zain's 8 countries
 * lights up in sequence as the chapter's local scroll progress advances, as
 * a vertical red beacon of light shooting up from the surface — replacing
 * an earlier arc-and-traveling-pulse "data transfer" look between countries,
 * per direct reference to a satellite photo of a ground-to-space light beam.
 * Visible only while chapter.visibleSystems.countryBeacons is true
 * (Expansion + Living Network), but stays mounted throughout — opacity, not
 * existence, gates it.
 */
export const CountryBeaconSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const beamRefs = useRef<THREE.Mesh[]>([]);
  const beamMaterialRefs = useRef<THREE.ShaderMaterial[]>([]);

  const beacons = useMemo<Beacon[]>(
    () =>
      EXPANSION_COUNTRIES.map((c) => {
        const position = latLongToVector3(c.lat, c.lon, SURFACE_RADIUS);
        const normal = new THREE.Vector3(...position).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        return { position, quaternion };
      }),
    []
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    // Beacon lat/long positions are computed once in local (unrotated)
    // space, same as Earth's own geometry — so this group must apply the
    // exact same rotation Earth's mesh does each frame, or the beacons stay
    // fixed in world space while the globe's surface spins underneath them,
    // drifting off the actual country within moments.
    group.rotation.y = state.clock.elapsedTime * EARTH_ROTATION_SPEED;

    const progress = useScrollStore.getState().canvasProgress;
    const { chapter, localProgress } = getActiveChapter(progress);
    const visible = chapter.visibleSystems.countryBeacons;
    group.visible = visible;
    if (!visible) return;

    // 8 countries light up one by one across expansion's local progress;
    // livingNetwork (the chapter after) keeps them all fully lit.
    const isExpansion = chapter.id === 'expansion';
    const activeCount = isExpansion
      ? Math.floor(mapRange(localProgress, 0, 1, 0, EXPANSION_COUNTRIES.length))
      : EXPANSION_COUNTRIES.length;

    beamRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i <= activeCount;
      const targetScale = isActive ? 1 : 0.001;
      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, targetScale, 0.12);
    });

    beamMaterialRefs.current.forEach((material, i) => {
      if (!material) return;
      const isActive = i <= activeCount;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uOpacity.value = THREE.MathUtils.lerp(material.uniforms.uOpacity.value, isActive ? 1 : 0, 0.1);
    });
  });

  return (
    <group ref={groupRef}>
      {beacons.map((beacon, i) => (
        <group key={i} position={beacon.position} quaternion={beacon.quaternion}>
          <mesh
            position={[0, BEAM_HEIGHT / 2, 0]}
            scale={[1, 0.001, 1]}
            ref={(el) => {
              if (el) beamRefs.current[i] = el;
            }}
          >
            <cylinderGeometry args={[BEAM_RADIUS, BEAM_RADIUS, BEAM_HEIGHT, 12, 1, true]} />
            <shaderMaterial
              ref={(el) => {
                if (el) beamMaterialRefs.current[i] = el as THREE.ShaderMaterial;
              }}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              uniforms={{ uColor: { value: RED.clone() }, uOpacity: { value: 0 }, uTime: { value: 0 } }}
              vertexShader={BEAM_VERTEX}
              fragmentShader={BEAM_FRAGMENT}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
