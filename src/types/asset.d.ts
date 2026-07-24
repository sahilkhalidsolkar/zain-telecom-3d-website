/**
 * asset.d.ts
 * 
 * Responsibility:
 * TypeScript interfaces defining asset payload shapes, loader return types,
 * and manifest structures.
 */

export interface AssetPayload {
  id: string;
  url: string;
  type: 'model' | 'texture' | 'audio';
}
