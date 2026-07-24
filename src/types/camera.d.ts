/**
 * camera.d.ts
 * 
 * Responsibility:
 * TypeScript interfaces defining Camera data structures, such as 
 * predefined look-at targets, FOV configurations, and path splines.
 */

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}
