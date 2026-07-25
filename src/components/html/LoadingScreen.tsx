'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssetStore } from '@/store/useAssetStore';
import { useLenis } from '@/hooks/useLenis';

/** Held after the scene is actually ready so the exit reads as a deliberate
 * reveal rather than an abrupt cut the instant the last byte lands. */
const EXIT_DELAY_MS = 400;

/**
 * Safety net: if `isSceneReady` never arrives for some reason (a device/
 * browser combination where the GPU-upload path behaves unexpectedly, or
 * any other edge case), this loading gate must not be able to trap the user
 * forever behind a stuck 99%. Once `isLoaded` is true, proceed anyway after
 * this many ms even without the scene-ready signal.
 */
const FORCE_READY_TIMEOUT_MS = 8000;

/**
 * Full-screen gate shown from first paint until the scene is actually ready
 * to show — driven by real state, not a fake timer. Two distinct signals:
 * `isLoaded` (JS-side asset decode done) and `isSceneReady` (EarthSystem has
 * also finished uploading the decoded textures to the GPU, which only
 * happens *after* `isLoaded` since EarthSystem doesn't mount before then).
 * Gating only on `isLoaded` was the bug reported here — the bar would hit
 * 100% while the single heaviest, most stall-prone step (uploading Earth's
 * 8K textures) was only just starting, so the fade-out ran before the scene
 * was actually ready. The displayed percentage now holds at 99% until
 * `isSceneReady` too, and only then jumps to 100% and starts the exit.
 *
 * Scroll is suspended for the duration (via Lenis's own stop/start) so
 * scrolling ahead during load can't leave the user disoriented once the
 * real experience appears at whatever position they'd scrolled to blind.
 */
export const LoadingScreen = () => {
  const isLoaded = useAssetStore((s) => s.isLoaded);
  const isSceneReady = useAssetStore((s) => s.isSceneReady);
  const progress = useAssetStore((s) => s.progress);
  const lenis = useLenis();
  const [visible, setVisible] = useState(true);
  const [forcedReady, setForcedReady] = useState(false);

  useEffect(() => {
    lenis?.stop();
  }, [lenis]);

  // Safety net — see FORCE_READY_TIMEOUT_MS above.
  useEffect(() => {
    if (!isLoaded || isSceneReady) return;
    const timer = setTimeout(() => setForcedReady(true), FORCE_READY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isLoaded, isSceneReady]);

  const sceneReady = isSceneReady || forcedReady;

  useEffect(() => {
    if (!sceneReady) return;
    const timer = setTimeout(() => {
      setVisible(false);
      lenis?.start();
    }, EXIT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [sceneReady, lenis]);

  const percent = sceneReady ? 100 : Math.min(99, Math.round(progress * 100));
  const ready = isLoaded && sceneReady;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="relative flex h-40 w-40 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(138,43,226,0.55) 0%, rgba(138,43,226,0) 70%)',
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.img
              src="/assets/logos/zain.svg"
              alt="Zain"
              className="relative h-10 w-auto sm:h-12"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="relative flex flex-col items-center gap-2">
            {/* Same breathing glow as the logo, sized for this block, so the
                whole loader reads as one pulsing unit rather than a static
                bar bolted under an animated logo. */}
            <motion.div
              className="pointer-events-none absolute -inset-x-10 -inset-y-6 rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(138,43,226,0.35) 0%, rgba(138,43,226,0) 70%)',
              }}
              animate={{ opacity: ready ? [0.4, 0.8, 0.4] : [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative h-[2px] w-40 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full rounded-full bg-white/80"
                animate={{ width: `${percent}%`, opacity: [0.6, 1, 0.6] }}
                transition={{
                  width: { duration: 0.3, ease: 'easeOut' },
                  opacity: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
                }}
              />
            </div>
            <p className="relative text-xs uppercase tracking-[0.25em] text-white/50">{percent}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
