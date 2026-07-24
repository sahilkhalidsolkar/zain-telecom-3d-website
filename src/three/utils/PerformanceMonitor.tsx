'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { usePerformanceStore } from '@/store/usePerformanceStore';
import type { QualityTier } from '@/types/performance';

const INITIAL_TIER_BY_BREAKPOINT: Record<ReturnType<typeof useBreakpoint>, QualityTier> = {
  mobile: 'low',
  tablet: 'medium',
  desktop: 'high',
};

const DOWNGRADE: Record<QualityTier, QualityTier> = {
  high: 'medium',
  medium: 'low',
  low: 'low',
};

const LOW_FPS_THRESHOLD = 40;
const SAMPLE_WINDOW_SECONDS = 2;

/**
 * Sets the initial quality tier from device type, then downgrades (never
 * auto-upgrades, to avoid thrashing) if sustained FPS drops below threshold.
 * Renders nothing — purely drives usePerformanceStore, which particle count,
 * DPR, and postprocessing all read.
 */
export const PerformanceMonitor = () => {
  const breakpoint = useBreakpoint();
  const frameCount = useRef(0);
  const windowStart = useRef(0);

  useEffect(() => {
    usePerformanceStore.getState().setQualityTier(INITIAL_TIER_BY_BREAKPOINT[breakpoint]);
  }, [breakpoint]);

  useFrame((state) => {
    frameCount.current += 1;
    const elapsed = state.clock.elapsedTime - windowStart.current;
    if (elapsed < SAMPLE_WINDOW_SECONDS) return;

    const fps = frameCount.current / elapsed;
    frameCount.current = 0;
    windowStart.current = state.clock.elapsedTime;

    if (fps < LOW_FPS_THRESHOLD) {
      const current = usePerformanceStore.getState().qualityTier;
      usePerformanceStore.getState().setQualityTier(DOWNGRADE[current]);
    }
  });

  return null;
};
