import { create } from 'zustand';

/**
 * useUIStore
 *
 * Responsibility:
 * Manages 2D HTML overlay states. This includes the global loading screen,
 * navigation menu visibility, sound toggles, and any interactive UI elements
 * that sit on top of the 3D canvas.
 */
interface UIState {
  isMenuOpen: boolean;
  isMuted: boolean;
  toggleMenu: () => void;
  toggleMuted: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  isMuted: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleMuted: () => set((state) => ({ isMuted: !state.isMuted })),
}));
