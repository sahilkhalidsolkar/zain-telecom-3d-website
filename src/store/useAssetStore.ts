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
  assets: Record<string, LoadedAsset>;
  setProgress: (progress: number) => void;
  setLoaded: (isLoaded: boolean) => void;
  registerAsset: (id: string, asset: LoadedAsset) => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  progress: 0,
  isLoaded: false,
  assets: {},
  setProgress: (progress) => set({ progress }),
  setLoaded: (isLoaded) => set({ isLoaded }),
  registerAsset: (id, asset) =>
    set((state) => ({ assets: { ...state.assets, [id]: asset } })),
}));
