'use client';

import { ReactNode, useEffect } from 'react';
import { LoadingManager, SRGBColorSpace, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ASSET_MANIFEST } from '@/constants/assets';
import { useAssetStore } from '@/store/useAssetStore';

/**
 * AssetProvider
 *
 * Responsibility:
 * Kicks off the global preloading sequence for everything in ASSET_MANIFEST
 * (textures + models). Updates useAssetStore with loading progress and
 * caches each loaded asset by id so scenes can retrieve it synchronously
 * once ready, instead of each scene loading its own copy.
 */
export const AssetProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const { setProgress, setLoaded, registerAsset } = useAssetStore.getState();

    const manager = new LoadingManager();
    manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      setProgress(itemsTotal === 0 ? 1 : itemsLoaded / itemsTotal);
    };
    manager.onLoad = () => setLoaded(true);
    manager.onError = (url) => {
      console.error(`[AssetProvider] Failed to load asset: ${url}`);
    };

    const textureLoader = new TextureLoader(manager);
    const gltfLoader = new GLTFLoader(manager);

    ASSET_MANIFEST.forEach((asset) => {
      if (asset.type === 'texture') {
        textureLoader.load(asset.url, (texture) => {
          if (!asset.id.toLowerCase().includes('normal')) {
            texture.colorSpace = SRGBColorSpace;
          }
          registerAsset(asset.id, texture);
        });
      } else if (asset.type === 'model') {
        gltfLoader.load(asset.url, (gltf) => {
          registerAsset(asset.id, gltf);
        });
      }
    });

    return () => {
      manager.onProgress = () => {};
      manager.onLoad = () => {};
      manager.onError = () => {};
    };
  }, []);

  return <>{children}</>;
};
