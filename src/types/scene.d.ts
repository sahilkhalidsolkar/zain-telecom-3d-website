/**
 * scene.d.ts
 * 
 * Responsibility:
 * TypeScript interfaces defining the shape of a Scene configuration.
 * e.g., SceneProps, TransitionSettings.
 */

export interface SceneProps {
  isActive: boolean;
  onLoaded?: () => void;
}
