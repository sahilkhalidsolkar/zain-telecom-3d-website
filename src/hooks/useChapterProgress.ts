'use client';

import { useEffect, useRef } from 'react';
import { useScrollStore } from '@/store/useScrollStore';
import { useSceneStore } from '@/store/useSceneStore';
import { getActiveChapter } from '@/three/utils/chapterProgress';

/**
 * useChapterProgress
 *
 * Responsibility:
 * Reactive chapter lookup for HTML/UI consumers (chapter text overlays,
 * progress indicators). Subscribes to the store, so it re-renders on every
 * scroll tick — fine for lightweight DOM updates, but R3F components driving
 * per-frame visuals (particles, camera, Earth) should instead call
 * `getActiveChapter(useScrollStore.getState().canvasProgress)` inside their
 * own `useFrame` callback to avoid routing high-frequency updates through
 * React state.
 *
 * Also mirrors the active chapter id into `useSceneStore`, but only when it
 * actually changes, for consumers (nav/progress indicator) that don't need
 * per-tick updates.
 */
export const useChapterProgress = () => {
  const canvasProgress = useScrollStore((state) => state.canvasProgress);
  const active = getActiveChapter(canvasProgress);
  const lastChapterId = useRef<string | null>(null);

  useEffect(() => {
    if (lastChapterId.current !== active.chapter.id) {
      lastChapterId.current = active.chapter.id;
      useSceneStore.getState().setActiveScene(active.chapter.id);
    }
  }, [active.chapter.id]);

  return active;
};
