'use client';

import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useScrollStore } from '@/store/useScrollStore';
import { getActiveChapter } from '@/three/utils/chapterProgress';
import { degreesToRadians, lerp } from '@/utils/math';
import type { CameraWaypoint } from '@/constants/chapters';

const resolveCameraTarget = (camera: CameraWaypoint, t: number, outPosition: Vector3, outLookAt: Vector3) => {
  if (camera.motion === 'orbital') {
    const angle = degreesToRadians(lerp(camera.startAngleDeg, camera.endAngleDeg, t));
    outPosition.set(Math.sin(angle) * camera.radius, camera.height, Math.cos(angle) * camera.radius);
    outLookAt.set(camera.lookAt[0], camera.lookAt[1], camera.lookAt[2]);
    return;
  }

  outPosition.set(
    lerp(camera.startPosition[0], camera.endPosition[0], t),
    lerp(camera.startPosition[1], camera.endPosition[1], t),
    lerp(camera.startPosition[2], camera.endPosition[2], t)
  );
  outLookAt.set(
    lerp(camera.startLookAt[0], camera.endLookAt[0], t),
    lerp(camera.startLookAt[1], camera.endLookAt[1], t),
    lerp(camera.startLookAt[2], camera.endLookAt[2], t)
  );
};

/**
 * Drives the R3F default camera along the per-chapter waypoints defined in
 * `chapters.ts` (dolly, orbit, dive, flythrough, circle, pullback), smoothed
 * with a trailing lerp so scroll input reads as cinematic easing rather than
 * a direct 1:1 scrub. Reads scroll progress imperatively inside `useFrame`
 * rather than via React state, per the project's "no per-frame React state"
 * rule (docs/WORKFLOW.md).
 */
export const CameraRig = () => {
  const { camera } = useThree();
  const targetPosition = useMemo(() => new Vector3(), []);
  const targetLookAt = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const progress = useScrollStore.getState().canvasProgress;
    const { chapter, localProgress } = getActiveChapter(progress);

    resolveCameraTarget(chapter.camera, localProgress, targetPosition, targetLookAt);

    camera.position.lerp(targetPosition, 0.08);
    camera.lookAt(targetLookAt);
  });

  return null;
};
