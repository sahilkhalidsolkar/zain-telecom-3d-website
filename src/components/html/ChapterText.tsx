'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useChapterProgress } from '@/hooks/useChapterProgress';
import { useLenis } from '@/hooks/useLenis';

/**
 * Data-driven 2D text overlay: fades in/out per chapter using `chapters.ts`
 * copy verbatim from the brief, instead of one hardcoded block per chapter.
 * Chapter changes are infrequent (9 across the whole scroll), so a plain
 * React state swap + AnimatePresence is enough — no need to route this
 * through the GSAP master timeline used for continuous 3D scroll-driving.
 */
export const ChapterText = () => {
  const { chapter } = useChapterProgress();
  const lenis = useLenis();

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-white"
        >
          {chapter.text.map((line, i) =>
            line === '' ? (
              <div key={i} className="h-3" />
            ) : (
              <p key={i} className="text-lg sm:text-2xl font-light tracking-wide uppercase">
                {line}
              </p>
            )
          )}

          {chapter.id === 'purpose' && (
            <button
              type="button"
              onClick={() => lenis?.scrollTo(0, { duration: 2 })}
              className="mt-8 pointer-events-auto rounded-full border border-white/40 px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
            >
              Explore Zain
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
