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
 * These are the original 8K (8192x4096) equirectangular maps — used
 * deliberately, at full resolution, by choice. (A 2K downscaled pass was
 * tried earlier for load-time reasons — ~30MB -> ~1.7MB — but reverted.)
 * Two real consequences of that choice, both already accounted for
 * elsewhere rather than silently left broken:
 *   - Initial load is meaningfully heavier (~30MB across 4 textures) —
 *     `LoadingScreen`'s progress bar reflects the real download/decode time.
 *   - `LoadingScreen`'s FORCE_READY_TIMEOUT_MS safety net (for if the
 *     GPU-upload-ready signal never fires) is set generously above what 8K
 *     assets can realistically take even on a slow connection, so it can't
 *     fire prematurely under normal — if slow — load conditions.
 */
export const ASSET_MANIFEST: AssetPayload[] = [
  { id: 'earthDay', url: '/assets/textures/earth/earth_day_8k.jpg', type: 'texture' },
  { id: 'earthNight', url: '/assets/textures/earth/earth_night_8k.jpg', type: 'texture' },
  { id: 'earthClouds', url: '/assets/textures/earth/earth_clouds_8k.jpg', type: 'texture' },
  { id: 'earthNormal', url: '/assets/textures/earth/earth_normal_8k.png', type: 'texture' },
  { id: 'satellite', url: '/assets/models/satellite.glb', type: 'model' },
];
