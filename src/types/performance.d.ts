/**
 * performance.d.ts
 * 
 * Responsibility:
 * TypeScript interfaces defining hardware tier thresholds, profiling data,
 * and configuration limits based on quality.
 */

export type QualityTier = 'high' | 'medium' | 'low';

export interface PerformanceLimits {
  maxParticles: number;
  dpr: number;
  shadowsEnabled: boolean;
}
