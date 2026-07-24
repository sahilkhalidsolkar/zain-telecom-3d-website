'use client';

import { useScrollStore } from '@/store/useScrollStore';

/**
 * useLenis
 *
 * Responsibility:
 * Exposes the global Lenis instance to any component.
 * Allows components to programmatically scroll to specific sections,
 * stop/start scrolling, or hook directly into the raf loop if needed.
 */
export const useLenis = () => {
  return useScrollStore((state) => state.lenis);
};
