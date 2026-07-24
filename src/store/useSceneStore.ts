import { create } from 'zustand';
import type { ChapterId } from '@/constants/chapters';

/**
 * useSceneStore
 *
 * Responsibility:
 * Tracks which narrative chapter is currently active, for consumers that
 * need it outside the render-heavy scroll path (e.g. a chapter progress
 * indicator, or nav highlighting) — updated by `useChapterProgress` only
 * when the chapter actually changes, not on every scroll tick.
 */
interface SceneState {
  activeScene: ChapterId | null;
  setActiveScene: (scene: ChapterId) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  activeScene: null,
  setActiveScene: (activeScene) => set({ activeScene }),
}));
