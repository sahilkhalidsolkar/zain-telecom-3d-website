'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAssets } from '@/hooks/useAssets';
import { useAssetStore } from '@/store/useAssetStore';
import { useScrollStore } from '@/store/useScrollStore';
import { sampleKeyframes } from '@/utils/math';
import { getChapterStart } from '@/constants/chapters';

export const EARTH_RADIUS = 3;

/**
 * Radians/second of Earth's own day-side rotation. Exported so anything
 * anchored to a specific point on the surface (CountryBeaconSystem's
 * beacons) can apply the exact same rotation to itself — otherwise Earth's
 * texture spins underneath a beacon left in fixed world space, and the lit
 * point visibly drifts away from the actual country within moments.
 */
export const EARTH_ROTATION_SPEED = 0.03;

const EARTH_CHAPTER_START = getChapterStart('earth');

/**
 * Earth's visibility across the whole scroll, as opacity keyframes: hidden
 * until Ch3 (Earth Emerges), then fades in and stays present for the rest of
 * the experience. It previously dissolved away during Ch6's transformation
 * into an ecosystem-cluster shape, but that shape isn't built out properly
 * yet (see MorphingParticleField) — Earth, network arcs, and satellites all
 * stay on screen through Ch6/7 instead of disappearing until that's ready.
 */
const OPACITY_KEYFRAMES = [
  { at: 0, value: 0 },
  { at: EARTH_CHAPTER_START, value: 0 },
  { at: EARTH_CHAPTER_START + 0.02, value: 1 },
  { at: 1, value: 1 },
];

const ATMOSPHERE_VERTEX = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(uColor, clamp(intensity, 0.0, 1.0) * uOpacity);
  }
`;

/**
 * The literal Earth: day/night/cloud/normal-mapped sphere + a Fresnel-glow
 * atmosphere shell, using the textures already preloaded by AssetProvider.
 * Fades in/out (never unmounts) per OPACITY_KEYFRAMES above, per the
 * project's "morph, don't disappear" continuous-scene architecture.
 */
export const EarthSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const dayMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const cloudsMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const atmosphereMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const { gl } = useThree();
  const { getTexture, isLoaded } = useAssets();

  // These are 8K textures (~250MB+ uncompressed once decoded) that only get
  // uploaded to the GPU the first time their material is actually drawn.
  // Previously the whole group was `visible={false}` until Ch3's opacity
  // ramp crossed zero, so that upload — a real, visible stall — happened
  // right in the middle of the Ch2→Ch3 scroll instead of during load.
  // Forcing the upload here, as soon as the textures exist, moves that cost
  // to asset-load time (before the user starts scrolling) instead.
  useEffect(() => {
    if (!isLoaded) return;
    [getTexture('earthDay'), getTexture('earthNight'), getTexture('earthClouds'), getTexture('earthNormal')].forEach(
      (texture) => {
        if (texture) gl.initTexture(texture);
      }
    );
    // gl.initTexture uploads synchronously (it's what was causing the
    // mid-scroll stall this whole effect exists to avoid), so by the time
    // the loop above returns, the actual GPU-bound work is done — this is
    // the real "ready" signal LoadingScreen should wait for, not `isLoaded`.
    useAssetStore.getState().setSceneReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useFrame((state, delta) => {
    const progress = useScrollStore.getState().canvasProgress;
    const opacity = sampleKeyframes(progress, OPACITY_KEYFRAMES);

    const group = groupRef.current;
    if (!group) return;

    // Kept permanently visible (opacity alone hides it) — toggling `.visible`
    // would re-defer the texture upload above until the object re-enters the
    // render list, undoing the fix.
    //
    // Set directly from elapsed time (rather than accumulated via `+= delta
    // * speed` every frame) so it's an exact, reproducible function of time —
    // CountryBeaconSystem computes the identical value independently to stay
    // in sync, which an accumulator drifting from per-frame float rounding
    // couldn't guarantee.
    group.rotation.y = state.clock.elapsedTime * EARTH_ROTATION_SPEED;

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.045;
    }
    if (dayMaterialRef.current) {
      dayMaterialRef.current.opacity = opacity;
      // A transparent mesh still writes to the depth buffer by default even
      // at opacity 0 — since this mesh is now permanently in the render list
      // (see the texture pre-upload note above), that was carving a
      // Earth-shaped hole out of whatever sat behind it (particles) for the
      // entire time Earth was meant to be invisible, before Ch3 even starts.
      // Only write depth once Earth is actually meant to occlude things.
      dayMaterialRef.current.depthWrite = opacity > 0.5;
    }
    if (cloudsMaterialRef.current) {
      cloudsMaterialRef.current.opacity = opacity * 0.4;
    }
    if (atmosphereMaterialRef.current) {
      atmosphereMaterialRef.current.uniforms.uOpacity.value = opacity;
    }
  });

  if (!isLoaded) return null;

  const dayMap = getTexture('earthDay');
  const nightMap = getTexture('earthNight');
  const cloudsMap = getTexture('earthClouds');
  const normalMap = getTexture('earthNormal');

  return (
    <group ref={groupRef}>
      <mesh frustumCulled={false}>
        <sphereGeometry args={[EARTH_RADIUS, 48, 48]} />
        <meshStandardMaterial
          ref={dayMaterialRef}
          map={dayMap}
          normalMap={normalMap}
          emissiveMap={nightMap}
          emissive={new THREE.Color('#ffffff')}
          emissiveIntensity={0.6}
          roughness={0.85}
          metalness={0}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={cloudsRef} scale={1.008} frustumCulled={false}>
        <sphereGeometry args={[EARTH_RADIUS, 48, 48]} />
        <meshStandardMaterial
          ref={cloudsMaterialRef}
          map={cloudsMap}
          alphaMap={cloudsMap}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.05} frustumCulled={false}>
        <sphereGeometry args={[EARTH_RADIUS, 32, 32]} />
        <shaderMaterial
          ref={atmosphereMaterialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          uniforms={{ uColor: { value: new THREE.Color('#8a2be2') }, uOpacity: { value: 0 } }}
          vertexShader={ATMOSPHERE_VERTEX}
          fragmentShader={ATMOSPHERE_FRAGMENT}
        />
      </mesh>
    </group>
  );
};
