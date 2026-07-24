'use client';

import { useSceneStore } from '@/store/useSceneStore';

/**
 * useScene
 *
 * Responsibility:
 * Exposes the currently active chapter id, kept in sync by
 * `useChapterProgress`. The experience is one continuously-mounted scene
 * choreographed by scroll progress (see `chapters.ts`), not discrete
 * mount/unmount scenes, so there is no separate transition method here —
 * consumers that need to react to a chapter change should read `activeScene`
 * (e.g. for nav highlighting or a progress indicator).
 */
export const useScene = () => {
  const activeScene = useSceneStore((state) => state.activeScene);
  return { activeScene };
};
