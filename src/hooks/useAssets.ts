'use client';

import type { Texture } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useAssetStore, LoadedAsset } from '@/store/useAssetStore';

/**
 * useAssets
 *
 * Responsibility:
 * Provides a unified interface to retrieve loaded textures/models by the id
 * they were registered under in ASSET_MANIFEST. Components should check
 * `isLoaded` (or that their specific `getAsset(id)` call returns non-null)
 * before rendering geometry that depends on them.
 */
export const useAssets = () => {
  const isLoaded = useAssetStore((state) => state.isLoaded);
  const progress = useAssetStore((state) => state.progress);
  const assets = useAssetStore((state) => state.assets);

  const getAsset = <T extends LoadedAsset = LoadedAsset>(id: string): T | undefined =>
    assets[id] as T | undefined;

  const getTexture = (id: string) => getAsset<Texture>(id);
  const getModel = (id: string) => getAsset<GLTF>(id);

  return { isLoaded, progress, getAsset, getTexture, getModel };
};
