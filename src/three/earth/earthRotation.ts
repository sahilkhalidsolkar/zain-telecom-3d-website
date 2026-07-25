import { CHAPTERS, EXPANSION_COUNTRIES } from '@/constants/chapters';
import { getActiveChapter } from '@/three/utils/chapterProgress';
import { getOrbitalAngleRad } from '@/three/camera/CameraRig';
import { latLongToVector3, mapRange } from '@/utils/math';

/**
 * Radians/second of Earth's own day-side rotation (the default, outside the
 * "face the active beacon" behavior below). Exported so anything anchored to
 * a specific point on the surface can apply Earth's exact current rotation
 * to itself — see `earthRotationState` for the live value.
 */
export const EARTH_ROTATION_SPEED = 0.03;

/**
 * Number of cards in the Innovation chapter — precomputed once at module
 * init so it isn't re-derived on every frame tick.
 */
const INNOVATION_CARD_COUNT = CHAPTERS.find((c) => c.id === 'innovation')?.cards?.length ?? 6;

/**
 * Kuwait's coordinates — Zain's flagship 5G / 5.5G market, used as the
 * face-target when 5G-related cards are active in Ch.7.
 */
const KUWAIT = EXPANSION_COUNTRIES[0]; // { name: 'Kuwait', lat: 29.3759, lon: 47.9774 }

/**
 * Earth's actual current rotation.y, written once per frame by
 * `EarthSystem`'s `useFrame` and read by everything else anchored to the
 * surface (`CountryBeaconSystem`, `CoverageRingSystem`) so they all rotate
 * in lockstep with the planet itself. A plain mutable object rather than a
 * store: this updates at render-loop frequency, which the project's rule
 * against per-frame React state exists specifically to keep out of
 * React/zustand's update cycle (docs/WORKFLOW.md).
 */
export const earthRotationState = { value: 0 };

const countryAngleRad = (lat: number, lon: number): number => {
  const [x, , z] = latLongToVector3(lat, lon, 1);
  return Math.atan2(x, z);
};

/**
 * Earth's target rotation.y for the current scroll position — normally just
 * a constant slow spin, but during Expansion each country's beacon lighting
 * up should actually be visible to the viewer, not lit on Earth's far side
 * at the mercy of wherever the constant spin and the camera's own
 * independent orbit happen to line up. So while a country is the active
 * one, this instead returns the rotation that places that country's
 * longitude at the camera's current orbital angle — Earth turns to keep
 * presenting whichever country just lit up, continuing to track the camera
 * as its own orbit keeps moving. `EarthSystem` smooths (lerps) toward
 * whatever this returns rather than snapping straight to it.
 */
export const computeTargetEarthRotationY = (canvasProgress: number, elapsedTime: number): number => {
  const { chapter, localProgress } = getActiveChapter(canvasProgress);
  const orbitalAngle = getOrbitalAngleRad(chapter.camera, localProgress);

  if (chapter.id === 'expansion' && orbitalAngle !== null) {
    const activeIndex = Math.min(
      EXPANSION_COUNTRIES.length - 1,
      Math.floor(mapRange(localProgress, 0, 1, 0, EXPANSION_COUNTRIES.length))
    );
    const country = EXPANSION_COUNTRIES[activeIndex];
    return orbitalAngle - countryAngleRad(country.lat, country.lon);
  }

  // Ch.7 Innovation: face Kuwait (Zain's flagship 5.5G market) while the
  // 5.5G (card 0) and 5G (card 1) cards are on screen. For the remaining
  // data/fintech/AI cards (indices 2-5) fall back to the normal slow spin —
  // no geographic face-target is meaningful for those stats.
  if (chapter.id === 'innovation' && orbitalAngle !== null) {
    const activeCardIndex = Math.min(
      INNOVATION_CARD_COUNT - 1,
      Math.floor(mapRange(localProgress, 0, 1, 0, INNOVATION_CARD_COUNT))
    );
    if (activeCardIndex <= 1) {
      return orbitalAngle - countryAngleRad(KUWAIT.lat, KUWAIT.lon);
    }
  }

  return elapsedTime * EARTH_ROTATION_SPEED;
};
