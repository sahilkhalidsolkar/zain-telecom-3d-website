'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { QuadraticBezierLine } from '@react-three/drei';
import { EXPANSION_COUNTRIES } from '@/constants/chapters';
import { getActiveChapter } from '@/three/utils/chapterProgress';
import { useScrollStore } from '@/store/useScrollStore';
import { latLongToVector3, mapRange } from '@/utils/math';
import { EARTH_RADIUS } from '@/three/earth/EarthSystem';

const MARKER_RADIUS = EARTH_RADIUS * 1.02;
const ARC_HEIGHT = EARTH_RADIUS * 1.35;
const PURPLE = '#8a2be2';

/**
 * Chapter 4's "one nation to eight markets" beat: each of Zain's 8 countries
 * lights up in sequence as the chapter's local scroll progress advances,
 * connected by glowing arcs with a pulse traveling along each one. Visible
 * only while chapter.visibleSystems.networkArcs is true (Expansion + Living
 * Network), but stays mounted throughout — opacity, not existence, gates it.
 */
export const NetworkArcSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const markerRefs = useRef<THREE.Mesh[]>([]);
  const pulseRefs = useRef<THREE.Mesh[]>([]);
  const arcMaterialRefs = useRef<THREE.Material[]>([]);

  const points = useMemo(
    () => EXPANSION_COUNTRIES.map((c) => new THREE.Vector3(...latLongToVector3(c.lat, c.lon, MARKER_RADIUS))),
    []
  );

  const arcMidpoints = useMemo(
    () =>
      points.slice(0, -1).map((p, i) => {
        const next = points[i + 1];
        return p.clone().add(next).normalize().multiplyScalar(ARC_HEIGHT);
      }),
    [points]
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const progress = useScrollStore.getState().canvasProgress;
    const { chapter, localProgress } = getActiveChapter(progress);
    const visible = chapter.visibleSystems.networkArcs;
    group.visible = visible;
    if (!visible) return;

    // 8 countries light up one by one across expansion's local progress;
    // livingNetwork (the chapter after) keeps them all fully lit.
    const isExpansion = chapter.id === 'expansion';
    const activeCount = isExpansion
      ? Math.floor(mapRange(localProgress, 0, 1, 0, EXPANSION_COUNTRIES.length))
      : EXPANSION_COUNTRIES.length;

    markerRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i <= activeCount;
      const targetScale = isActive ? 1 : 0.001;
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.15));
    });

    arcMaterialRefs.current.forEach((material, i) => {
      if (!material) return;
      const isActive = i < activeCount;
      const mat = material as THREE.Material & { opacity: number };
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, isActive ? 0.6 : 0, 0.1);
    });

    pulseRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isActive = i < activeCount;
      mesh.visible = isActive;
      if (!isActive) return;
      const t = (state.clock.elapsedTime * 0.4 + i * 0.3) % 1;
      const a = points[i];
      const mid = arcMidpoints[i];
      const b = points[i + 1];
      const p1 = a.clone().lerp(mid, t);
      const p2 = mid.clone().lerp(b, t);
      mesh.position.copy(p1.lerp(p2, t));
    });
  });

  return (
    <group ref={groupRef}>
      {points.map((p, i) => (
        <mesh
          key={`marker-${i}`}
          position={p}
          scale={0.001}
          ref={(el) => {
            if (el) markerRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color={PURPLE} />
        </mesh>
      ))}

      {arcMidpoints.map((mid, i) => (
        <QuadraticBezierLine
          key={`arc-${i}`}
          start={points[i]}
          end={points[i + 1]}
          mid={mid}
          color={PURPLE}
          lineWidth={1.5}
          transparent
          opacity={0}
          ref={(el) => {
            if (el) arcMaterialRefs.current[i] = el.material as THREE.Material;
          }}
        />
      ))}

      {arcMidpoints.map((_, i) => (
        <mesh
          key={`pulse-${i}`}
          ref={(el) => {
            if (el) pulseRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
};
