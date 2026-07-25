import { create } from 'zustand';
import type { Texture } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type LoadedAsset = Texture | GLTF;

/**
 * useAssetStore
 *
 * Responsibility:
 * Tracks the loading progress of textures and models, and caches the loaded
 * result of each so scenes can retrieve it synchronously by id once ready
 * (populated by `AssetProvider`, read via the `useAssets` hook).
 */
interface AssetState {
  progress: number;
  isLoaded: boolean;
  /**
   * True once the heavy GPU-side work is actually done (currently: Earth's
   * 8K textures uploaded via `gl.initTexture`, set by `EarthSystem`) — not
   * just `isLoaded` (JS-side decode/registration). `isLoaded` reaching 100%
   * does NOT mean the scene is ready to show: EarthSystem doesn't mount
   * until `isLoaded` is true, and its texture upload only happens *after*
   * that mount, so anything gating on `isLoaded` alone (e.g. LoadingScreen)
   * would hide the loader right as the single heaviest, most stall-prone
   * step was only just starting.
   */
  isSceneReady: boolean;
  assets: Record<string, LoadedAsset>;
  setProgress: (progress: number) => void;
  setLoaded: (isLoaded: boolean) => void;
  setSceneReady: (isSceneReady: boolean) => void;
  registerAsset: (id: string, asset: LoadedAsset) => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  progress: 0,
  isLoaded: false,
  isSceneReady: false,
  assets: {},
  setProgress: (progress) => set({ progress }),
  setLoaded: (isLoaded) => set({ isLoaded }),
  setSceneReady: (isSceneReady) => set({ isSceneReady }),
  registerAsset: (id, asset) =>
    set((state) => ({ assets: { ...state.assets, [id]: asset } })),
}));
