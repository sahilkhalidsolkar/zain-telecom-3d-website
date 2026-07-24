/**
 * sceneNames.ts
 *
 * Responsibility:
 * Strongly typed identifiers for every major chapter in the experience.
 * Prevents magic strings when dispatching scene transitions. Kept in sync
 * with the authoritative chapter list in `chapters.ts`.
 */

import { CHAPTERS } from './chapters';

export const SCENES = CHAPTERS.reduce(
  (acc, chapter) => ({ ...acc, [chapter.id]: chapter.id }),
  {} as Record<(typeof CHAPTERS)[number]['id'], (typeof CHAPTERS)[number]['id']>
);
