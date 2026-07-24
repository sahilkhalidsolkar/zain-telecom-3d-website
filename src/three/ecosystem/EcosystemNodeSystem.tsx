'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, Line } from '@react-three/drei';
import { ECOSYSTEM_NODES } from '@/constants/chapters';
import { getActiveChapter } from '@/three/utils/chapterProgress';
import { useScrollStore } from '@/store/useScrollStore';

/** Offset from Earth's origin so the ecosystem doesn't overlap the planet. */
export const ECOSYSTEM_CENTER: [number, number, number] = [0, 0, -10];
const RING_RADIUS = 3.2;
const PURPLE = '#8a2be2';

/**
 * Chapter 6/7's "Beyond telecommunications" centerpiece: a glowing core
 * ("ZAIN") with Zain's 8 technology-ecosystem businesses orbiting it,
 * connected by flowing energy lines. Deliberately a small number of
 * discrete, labeled objects — not a particle-cluster dissolve — since that
 * approach read as messy noise without this structure.
 */
export const EcosystemNodeSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const nodeRefs = useRef<THREE.Group[]>([]);
  const pulseRefs = useRef<THREE.Mesh[]>([]);

  const nodePositions = useMemo(
    () =>
      ECOSYSTEM_NODES.map((_, i) => {
        const angle = (i / ECOSYSTEM_NODES.length) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(angle) * RING_RADIUS, Math.sin(i * 1.3) * 0.8, Math.sin(angle) * RING_RADIUS);
      }),
    []
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const progress = useScrollStore.getState().canvasProgress;
    const { chapter } = getActiveChapter(progress);
    group.visible = chapter.visibleSystems.ecosystemNodes;
    if (!group.visible) return;

    group.rotation.y += 0.0015;

    if (coreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.08 + 1;
      coreRef.current.scale.setScalar(pulse);
    }

    nodeRefs.current.forEach((node) => {
      if (!node) return;
      node.quaternion.copy(state.camera.quaternion);
    });

    pulseRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = (state.clock.elapsedTime * 0.3 + i * 0.4) % 1;
      mesh.position.lerpVectors(new THREE.Vector3(0, 0, 0), nodePositions[i], t);
    });
  });

  return (
    <group ref={groupRef} position={ECOSYSTEM_CENTER} visible={false}>
      <pointLight color={PURPLE} intensity={2} distance={8} />

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshBasicMaterial color={PURPLE} />
      </mesh>
      <Text position={[0, 0.65, 0]} fontSize={0.28} color="#ffffff" anchorX="center" anchorY="middle">
        ZAIN
      </Text>

      {nodePositions.map((pos, i) => (
        <Line key={`energy-${i}`} points={[[0, 0, 0], pos.toArray()]} color={PURPLE} lineWidth={1} transparent opacity={0.35} />
      ))}

      {nodePositions.map((_, i) => (
        <mesh
          key={`pulse-${i}`}
          ref={(el) => {
            if (el) pulseRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {ECOSYSTEM_NODES.map((name, i) => (
        <group
          key={name}
          position={nodePositions[i]}
          ref={(el) => {
            if (el) nodeRefs.current[i] = el;
          }}
        >
          <mesh>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.8} />
          </mesh>
          <Text position={[0, 0.28, 0]} fontSize={0.16} color="#ffffff" anchorX="center" anchorY="middle">
            {name}
          </Text>
        </group>
      ))}
    </group>
  );
};
