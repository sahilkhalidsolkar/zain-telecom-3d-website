import { create } from 'zustand';
import type { QualityTier } from '@/types/performance';

/**
 * usePerformanceStore
 *
 * Responsibility:
 * Tracks the current rendering quality tier. Starts from device type
 * (see useBreakpoint) and can be downgraded at runtime by PerformanceMonitor
 * if frame rate drops, so 3D components (particle count, DPR, postprocessing)
 * can gracefully degrade instead of staying stuck at an unsustainable tier.
 */
interface PerformanceState {
  qualityTier: QualityTier;
  setQualityTier: (tier: QualityTier) => void;
}

export const usePerformanceStore = create<PerformanceState>((set) => ({
  qualityTier: 'high',
  setQualityTier: (qualityTier) => set({ qualityTier }),
}));
