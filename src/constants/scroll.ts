/**
 * scroll.ts
 *
 * Responsibility:
 * Single source of truth for the total scroll length of the experience.
 * Both the DOM spacer (`page.tsx`) that gives Lenis something to scroll
 * and the master GSAP ScrollTrigger (`AnimationProvider`) that scrubs the
 * timeline must agree on this value, or pinned/scrubbed animations will
 * run out of scroll distance before (or after) the timeline completes.
 */

export const TOTAL_SCROLL_VH = 500;
