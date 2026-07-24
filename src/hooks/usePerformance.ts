'use client';

import { usePerformanceStore } from '@/store/usePerformanceStore';

/**
 * usePerformance
 * 
 * Responsibility:
 * Exposes the current quality tier. Allows 3D components to gracefully
 * degrade (e.g., turning off shadows, reducing particle count) on lower-end
 * mobile devices to maintain framerate.
 */
export const usePerformance = () => {
  const qualityTier = usePerformanceStore((state) => state.qualityTier);
  return { qualityTier };
};
