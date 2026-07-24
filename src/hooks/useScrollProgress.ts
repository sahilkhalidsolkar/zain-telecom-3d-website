'use client';

import { useScrollStore } from '@/store/useScrollStore';

/**
 * useScrollProgress
 * 
 * Responsibility:
 * A syntactic sugar hook to quickly grab the current normalized scroll
 * progress (0 to 1) from the scroll store. Essential for mapping scroll
 * to Three.js camera movements or shader uniforms.
 */
export const useScrollProgress = () => {
  const progress = useScrollStore((state) => state.progress);
  return progress;
};
