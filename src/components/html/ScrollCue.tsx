'use client';

import { motion } from 'framer-motion';
import { useChapterProgress } from '@/hooks/useChapterProgress';
import { mapRange } from '@/utils/math';

/**
 * "Scroll to explore" affordance — the site had none, so a first-time
 * visitor landing on Chapter 1 had no signal that the page even scrolls.
 * A thin line with a pulsing dot traveling down it, bottom-center, visible
 * only during the opening `signal` chapter and fading out over the same
 * local-progress window `Hero` uses, so both opening elements dismiss in
 * sync as the user actually starts scrolling.
 */
export const ScrollCue = () => {
  const { chapter, localProgress } = useChapterProgress();

  if (chapter.id !== 'signal') return null;

  const opacity = 1 - mapRange(localProgress, 0, 0.4, 0, 1);
  if (opacity <= 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-10 z-10 flex flex-col items-center gap-3"
      style={{ opacity }}
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll to explore</p>
      <div className="relative h-10 w-px overflow-hidden bg-white/15">
        <motion.div
          className="absolute inset-x-0 top-0 h-3 rounded-full bg-white/70"
          animate={{ y: ['-100%', '250%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};
