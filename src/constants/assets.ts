import { AssetPayload } from '@/types/asset';

/**
 * assets.ts
 *
 * Responsibility:
 * Manifest of every static asset that must be preloaded before the
 * experience starts. Paths must match real files under `public/assets/`.
 * There is no Earth model — the planet is a procedural sphere built from
 * these textures, not a glTF.
 *
 * These are 2K (2048x1024) equirectangular maps, downsized from the original
 * 8K (8192x4096) source assets — 30MB -> ~1.7MB combined, a ~17x reduction.
 * Earth (radius 3 world units, viewed from camera distances of 4-14 across
 * every chapter) never occupies enough of the viewport in this experience
 * for 8K detail to be visually distinguishable from 2K; the extra
 * resolution was pure download/decode/GPU-upload cost with no visible
 * benefit — the actual root cause of the slow loading screen. The original
 * 8K files are preserved outside `public/` (not served/deployed) at
 * `source-assets/earth-8k/`, in case a future higher-resolution re-export is
 * ever needed.
 */
export const ASSET_MANIFEST: AssetPayload[] = [
  { id: 'earthDay', url: '/assets/textures/earth/earth_day_2k.jpg', type: 'texture' },
  { id: 'earthNight', url: '/assets/textures/earth/earth_night_2k.jpg', type: 'texture' },
  { id: 'earthClouds', url: '/assets/textures/earth/earth_clouds_2k.jpg', type: 'texture' },
  { id: 'earthNormal', url: '/assets/textures/earth/earth_normal_2k.png', type: 'texture' },
  { id: 'satellite', url: '/assets/models/satellite.glb', type: 'model' },
];
