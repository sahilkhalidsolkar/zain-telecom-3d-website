import { create } from 'zustand';
import Lenis from 'lenis';

interface ScrollState {
  progress: number;
  velocity: number;
  direction: number;
  lenis: Lenis | null;
  /**
   * Progress (0-1) through the pinned canvas ScrollTrigger specifically,
   * as opposed to `progress`, which is Lenis's progress through the whole
   * document. They coincide today but will diverge once content (e.g. the
   * footer) exists outside the pinned section, so chapter/camera/particle
   * systems should read this value, not `progress`.
   */
  canvasProgress: number;
  setScrollState: (state: Partial<ScrollState>) => void;
  setLenis: (lenis: Lenis) => void;
  setCanvasProgress: (progress: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  velocity: 0,
  direction: 1,
  lenis: null,
  canvasProgress: 0,
  setScrollState: (state) => set((prev) => ({ ...prev, ...state })),
  setLenis: (lenis) => set({ lenis }),
  setCanvasProgress: (canvasProgress) => set({ canvasProgress }),
}));
