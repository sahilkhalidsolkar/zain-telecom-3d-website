'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';
import { useScrollStore } from '@/store/useScrollStore';
import { getActiveChapter } from '@/three/utils/chapterProgress';
import { clamp, degreesToRadians, lerp, radiansToDegrees } from '@/utils/math';
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

/** The vertical FOV (degrees) every chapter's `camera.radius`/position was
 * designed against, at this reference aspect ratio — i.e. what desktop
 * actually looks like today. */
const REFERENCE_FOV_DEG = 45;
const REFERENCE_ASPECT = 1.6;
const REFERENCE_HALF_H_FOV_RAD = Math.atan(Math.tan(degreesToRadians(REFERENCE_FOV_DEG / 2)) * REFERENCE_ASPECT);
const MIN_FOV_DEG = 45;
const MAX_FOV_DEG = 100;

/**
 * Every chapter's camera waypoints (`chapters.ts`) are world-space distances
 * tuned by eye against a desktop-ish aspect ratio. Three.js's `fov` is always
 * the *vertical* field of view — horizontal FOV is derived from it and the
 * canvas aspect ratio, so on a narrow portrait phone (aspect ~0.46) the
 * horizontal FOV ends up roughly a third of desktop's at the same vertical
 * FOV. Earth itself still frames fine vertically, but anything that spreads
 * out sideways around it (satellite orbits, the particle field, beacon
 * beams) gets cropped off the left/right edges.
 *
 * Fix: derive `fov` each frame so the *horizontal* FOV stays pinned to what
 * REFERENCE_ASPECT/REFERENCE_FOV_DEG produces, regardless of the actual
 * canvas aspect — narrower screens get a wider vertical FOV, which reads as
 * the camera pulling back just enough to fit the same horizontal content,
 * clamped so extreme aspect ratios don't fisheye.
 */
const computeAdaptiveFov = (aspect: number): number => {
  const halfVFovRad = Math.atan(Math.tan(REFERENCE_HALF_H_FOV_RAD) / aspect);
  return clamp(radiansToDegrees(halfVFovRad) * 2, MIN_FOV_DEG, MAX_FOV_DEG);
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
  const { camera, size } = useThree();
  const targetPosition = useMemo(() => new Vector3(), []);
  const targetLookAt = useMemo(() => new Vector3(), []);
  const lastAppliedFov = useRef<number | null>(null);

  useFrame(() => {
    const progress = useScrollStore.getState().canvasProgress;
    const { chapter, localProgress } = getActiveChapter(progress);

    resolveCameraTarget(chapter.camera, localProgress, targetPosition, targetLookAt);

    camera.position.lerp(targetPosition, 0.08);
    camera.lookAt(targetLookAt);

    if (camera instanceof PerspectiveCamera && size.height > 0) {
      const fov = computeAdaptiveFov(size.width / size.height);
      if (lastAppliedFov.current !== fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
        lastAppliedFov.current = fov;
      }
    }
  });

  return null;
};
