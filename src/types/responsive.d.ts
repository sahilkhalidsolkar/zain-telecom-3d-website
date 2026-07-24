/**
 * responsive.d.ts
 * 
 * Responsibility:
 * TypeScript interfaces defining responsive maps. For example, 
 * mapping a scale value to different screen sizes.
 */

export interface ResponsiveMap<T> {
  mobile: T;
  tablet: T;
  desktop: T;
}
