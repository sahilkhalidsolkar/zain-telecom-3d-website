/**
 * math.ts
 * 
 * Responsibility:
 * Shared mathematical helpers specific to 3D and procedural generation.
 * E.g., lerp, clamp, mapRange, randomFloat, degreesToRadians.
 */

export const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

export const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Remaps `value` from [inMin, inMax] to [outMin, outMax], clamping the
 * input range first so callers don't need to guard out-of-range progress
 * values themselves (e.g. chapter-local scroll progress).
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
};

export const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI;

/**
 * Converts a latitude/longitude pair (degrees) to a position on the surface
 * of a sphere of the given radius, using the same convention as the Earth
 * texture UV layout (longitude 0 facing +Z, increasing eastward).
 */
/**
 * Piecewise-linear interpolation across a sorted list of {at, value}
 * keyframes. Used for scalar values (opacity, scale) that need to ramp in
 * and out at specific points in the scroll timeline, the same way
 * MorphingParticleField blends between named shape keyframes.
 */
export const sampleKeyframes = (progress: number, keyframes: { at: number; value: number }[]): number => {
  if (progress <= keyframes[0].at) return keyframes[0].value;

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (progress >= keyframes[i].at && progress <= keyframes[i + 1].at) {
      return mapRange(progress, keyframes[i].at, keyframes[i + 1].at, keyframes[i].value, keyframes[i + 1].value);
    }
  }

  return keyframes[keyframes.length - 1].value;
};

export const latLongToVector3 = (
  lat: number,
  lon: number,
  radius: number
): [number, number, number] => {
  const phi = degreesToRadians(90 - lat);
  const theta = degreesToRadians(lon + 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
};
