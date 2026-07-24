'use client';

import { useEffect, useState } from 'react';
import { breakpoints } from '@/constants/breakpoints';
import type { ResponsiveMap } from '@/types/responsive';

type Breakpoint = keyof ResponsiveMap<unknown>;

const getBreakpoint = (width: number): Breakpoint => {
  if (width < breakpoints.md) return 'mobile';
  if (width < breakpoints.lg) return 'tablet';
  return 'desktop';
};

/**
 * useBreakpoint
 *
 * Responsibility:
 * Tracks the current window size and matches it against predefined
 * Tailwind breakpoints. Crucial for responsive Three.js layouts where
 * we must adjust FOV, model scale, or position based on mobile vs desktop.
 */
export const useBreakpoint = (): Breakpoint => {
  // Default to 'desktop' on the server / before first paint to avoid
  // hydration mismatches; corrected immediately on mount.
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth));

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};
