import { AssetPayload } from '@/types/asset';

/**
 * assets.ts
 *
 * Responsibility:
 * Manifest of every static asset that must be preloaded before the
 * experience starts. Paths must match real files under `public/assets/`.
 * There is no Earth model — the planet is a procedural sphere built from
 * these textures, not a glTF.
 */

export const ASSET_MANIFEST: AssetPayload[] = [
  { id: 'earthDay', url: '/assets/textures/earth/earth_day_8k.jpg', type: 'texture' },
  { id: 'earthNight', url: '/assets/textures/earth/earth_night_8k.jpg', type: 'texture' },
  { id: 'earthClouds', url: '/assets/textures/earth/earth_clouds_8k.jpg', type: 'texture' },
  { id: 'earthNormal', url: '/assets/textures/earth/earth_normal_8k.png', type: 'texture' },
  { id: 'satellite', url: '/assets/models/satellite.glb', type: 'model' },
];
