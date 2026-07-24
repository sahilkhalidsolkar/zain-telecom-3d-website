/**
 * device.ts
 * 
 * Responsibility:
 * Utilities for detecting device capabilities beyond just CSS breakpoints.
 * Checks for touch support, WebGL 2.0 support, and max texture sizes.
 */

export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};
