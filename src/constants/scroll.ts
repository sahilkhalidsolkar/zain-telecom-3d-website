/**
 * scroll.ts
 *
 * Responsibility:
 * Single source of truth for the total scroll length of the experience.
 * Both the DOM spacer (`page.tsx`) that gives Lenis something to scroll
 * and the master GSAP ScrollTrigger (`AnimationProvider`) that scrubs the
 * timeline must agree on this value, or pinned/scrubbed animations will
 * run out of scroll distance before (or after) the timeline completes.
 *
 * This was bumped up from the original 500 (too short — cards had less
 * scroll distance per item than a single mouse-wheel tick) and then back
 * down from 3600 (readable, but made the whole page too long to reach the
 * footer). Card read-time no longer depends on this value at all — with
 * `ChapterCards`'s own real-time minimum dwell (MIN_DWELL_MS) doing that job
 * regardless of scroll speed — so this only needs to be "enough distance for
 * the camera moves and 2D text per chapter to feel unhurried," not "enough
 * distance to force cards to stay on screen."
 */
export const TOTAL_SCROLL_VH = 1400;
