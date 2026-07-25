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
          {(() => {
            let currentDelay = 0.2; // slight pause after chapter container enters
            return chapter.text.map((line, i) => {
              if (line === '') {
                return <div key={i} className="h-3" />;
              }

              const lineDelay = currentDelay;
              currentDelay += line.length * 0.03 + 0.15; // 0.03s per char + brief pause before next line

              return (
                <p key={i} className="text-lg sm:text-2xl font-light tracking-wide uppercase">
                  <motion.span
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.03, delayChildren: lineDelay } },
                      hidden: {},
                    }}
                    aria-label={line}
                  >
                    {line.split('').map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        aria-hidden="true"
                        variants={{
                          hidden: { opacity: 0, display: 'none' },
                          visible: { opacity: 1, display: 'inline-block' },
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    ))}
                  </motion.span>
                </p>
              );
            });
          })()}

          {chapter.id === 'purpose' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              type="button"
              onClick={() => lenis?.scrollTo(0, { duration: 2 })}
              className="mt-8 pointer-events-auto rounded-full border border-white/40 px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
            >
              Explore Zain
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
