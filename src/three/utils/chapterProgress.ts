import { CHAPTERS, ChapterConfig } from '@/constants/chapters';
import { mapRange } from '@/utils/math';

export interface ActiveChapter {
  chapter: ChapterConfig;
  chapterIndex: number;
  /** 0-1 progress within the active chapter's own range. */
  localProgress: number;
}

/**
 * Pure lookup: given global canvas scroll progress (0-1), find the active
 * chapter and how far through it we are. Kept dependency-free (no store/React
 * import) so it can be called both from the `useChapterProgress` hook (for
 * HTML/UI consumers) and directly inside `useFrame` loops in R3F components
 * (for particles/camera/etc.) without pulling those systems into React's
 * render cycle — per-frame state belongs in refs/uniforms, not React state.
 */
export const getActiveChapter = (globalProgress: number): ActiveChapter => {
  const chapterIndex = CHAPTERS.findIndex(
    (chapter) => globalProgress >= chapter.range[0] && globalProgress < chapter.range[1]
  );

  const resolvedIndex = chapterIndex === -1 ? CHAPTERS.length - 1 : chapterIndex;
  const chapter = CHAPTERS[resolvedIndex];
  const localProgress = mapRange(globalProgress, chapter.range[0], chapter.range[1], 0, 1);

  return { chapter, chapterIndex: resolvedIndex, localProgress };
};
