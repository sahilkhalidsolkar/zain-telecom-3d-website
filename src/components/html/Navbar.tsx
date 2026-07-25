'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollStore } from '@/store/useScrollStore';
import { useChapterProgress } from '@/hooks/useChapterProgress';
import { useLenis } from '@/hooks/useLenis';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { CHAPTERS } from '@/constants/chapters';
import { TOTAL_SCROLL_VH } from '@/constants/scroll';

/**
 * Navbar.tsx
 *
 * Responsibility:
 * Detached, floating glassmorphism navigation bar that:
 *   - Sits 16px from the top, centred, with rounded corners — not edge-to-edge
 *   - Hides (slides up) when scrolling down, reappears on scroll up (both
 *     desktop AND mobile — same behaviour on all screen sizes)
 *   - Shows the Zain logo on the left and chapter nav links on the right
 *   - Highlights the active chapter with a spring-animated underline
 *   - On mobile: collapses links into a hamburger → bottom drawer
 *   - Fades in over Ch.1 so it doesn't compete with the opening hero wordmark
 */

const NAV_LABELS: Record<string, string> = {
  signal: 'Home',
  birth: 'Connectivity',
  earth: 'Earth',
  expansion: 'Expansion',
  livingNetwork: 'Network',
  transformation: 'TechCo',
  innovation: 'Innovation',
  humanImpact: 'Impact',
  purpose: 'Purpose',
};

export const Navbar = () => {
  const lenis = useLenis();
  const breakpoint = useBreakpoint();
  // Tablet also gets the mobile hamburger/drawer, not the inline desktop
  // nav: 9 chapter links + logo realistically need ~650-750px, which
  // doesn't fit in a tablet-width (~768px) floating bar alongside the logo.
  const isMobile = breakpoint !== 'desktop';

  const { chapter } = useChapterProgress();
  const activeId = chapter.id;

  // Hide/show on scroll — identical on all screen sizes
  const direction = useScrollStore((s) => s.direction);
  const velocity = useScrollStore((s) => s.velocity);
  const [hidden, setHidden] = useState(false);

  // Fade in gradually over Ch.1 so the navbar doesn't clash with the hero
  const canvasProgress = useScrollStore((s) => s.canvasProgress);
  const navOpacity = Math.min(1, canvasProgress / (2 / 23));

  // Mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Hide on scroll-down, reveal on scroll-up — same logic for all viewports.
  // `direction`/`velocity` are themselves reactive state (from the
  // useScrollStore subscription above), so Navbar already re-renders on
  // every change — adjusting `hidden` synchronously during render (React's
  // sanctioned pattern for deriving state from a prop/state change) avoids
  // the extra render-then-effect-then-rerender round trip an effect would
  // add on every scroll tick.
  const [trackedScroll, setTrackedScroll] = useState({ direction, velocity });
  if (trackedScroll.direction !== direction || trackedScroll.velocity !== velocity) {
    setTrackedScroll({ direction, velocity });
    if (Math.abs(velocity) >= 0.01) {
      setHidden(direction === 1);
    }
  }

  // Close drawer on resize to desktop — same pattern as above.
  const [trackedIsMobile, setTrackedIsMobile] = useState(isMobile);
  if (trackedIsMobile !== isMobile) {
    setTrackedIsMobile(isMobile);
    if (!isMobile) setDrawerOpen(false);
  }

  /** Scroll to a chapter's start position in pixels. */
  const scrollToChapter = useCallback(
    (chapterId: string) => {
      const ch = CHAPTERS.find((c) => c.id === chapterId);
      if (!ch || !lenis) return;
      const px = (ch.range[0] * TOTAL_SCROLL_VH * window.innerHeight) / 100;
      lenis.scrollTo(px, { duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
      setDrawerOpen(false);
    },
    [lenis],
  );

  // ── Shared floating glass style ────────────────────────────────────────────
  // Detached: centred, max-width, rounded, full border, top margin
  const floatingBase = [
    'fixed top-4 left-1/2 -translate-x-1/2 z-20',
    'w-[calc(100%-2rem)] max-w-5xl',
    'rounded-2xl',
    'border border-white/20',
    'backdrop-blur-md bg-white/10',
    'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
    'flex items-center justify-between',
  ].join(' ');

  // ── Desktop nav ────────────────────────────────────────────────────────────
  const desktopNav = (
    <motion.nav
      aria-label="Main navigation"
      className={`${floatingBase} px-6 py-2.5`}
      animate={{
        y: hidden ? 'calc(-100% - 1.25rem)' : '0%',
        opacity: navOpacity,
      }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <button
        type="button"
        onClick={() => scrollToChapter('signal')}
        className="pointer-events-auto shrink-0 focus:outline-none"
        aria-label="Scroll to top"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/zain.svg"
          alt="Zain"
          className="h-7 w-auto brightness-0 invert"
        />
      </button>

      {/* Chapter links */}
      <ul className="pointer-events-auto flex items-center gap-0.5">
        {CHAPTERS.map((ch) => {
          const isActive = ch.id === activeId;
          return (
            <li key={ch.id}>
              <button
                id={`nav-${ch.id}`}
                type="button"
                onClick={() => scrollToChapter(ch.id)}
                className={[
                  'relative px-3 py-1.5 text-[11px] uppercase tracking-widest',
                  'transition-colors duration-200 focus:outline-none rounded-lg',
                  isActive
                    ? 'text-white'
                    : 'text-white/45 hover:text-white/80',
                ].join(' ')}
              >
                {NAV_LABELS[ch.id]}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );

  // ── Mobile nav ─────────────────────────────────────────────────────────────
  const mobileNav = (
    <>
      {/* Floating pill — hides on scroll-down exactly like desktop */}
      <motion.div
        className={`${floatingBase} px-5 py-3`}
        animate={{
          y: hidden ? 'calc(-100% - 1.25rem)' : '0%',
          opacity: navOpacity,
        }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollToChapter('signal')}
          className="pointer-events-auto focus:outline-none"
          aria-label="Scroll to top"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logos/zain.svg"
            alt="Zain"
            className="h-6 w-auto brightness-0 invert"
          />
        </button>

        {/* Hamburger — also hides with the bar */}
        <button
          type="button"
          id="nav-hamburger"
          onClick={() => setDrawerOpen((v) => !v)}
          className={[
            'pointer-events-auto flex h-8 w-8 flex-col items-center justify-center gap-[5px]',
            'rounded-lg border border-white/20 bg-white/10 focus:outline-none',
          ].join(' ')}
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
        >
          <motion.span
            animate={drawerOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
            className="block h-[2px] w-4 rounded-full bg-white origin-center"
          />
          <motion.span
            animate={drawerOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.12 }}
            className="block h-[2px] w-4 rounded-full bg-white origin-center"
          />
          <motion.span
            animate={drawerOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
            className="block h-[2px] w-4 rounded-full bg-white origin-center"
          />
        </button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[18] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Bottom drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="drawer"
            className={[
              'fixed inset-x-4 bottom-4 z-[19]',
              'rounded-2xl border border-white/20',
              'backdrop-blur-md bg-white/10',
              'shadow-[0_-8px_32px_rgba(0,0,0,0.4)]',
              'px-4 pb-6 pt-4',
            ].join(' ')}
            initial={{ y: '120%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '120%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Drag handle */}
            <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-white/25" />

            <nav aria-label="Chapter navigation">
              <ul className="grid grid-cols-2 gap-1.5">
                {CHAPTERS.map((ch, idx) => {
                  const isActive = ch.id === activeId;
                  return (
                    <li key={ch.id}>
                      <button
                        type="button"
                        id={`nav-mobile-${ch.id}`}
                        onClick={() => scrollToChapter(ch.id)}
                        className={[
                          'pointer-events-auto w-full flex items-center gap-2.5 rounded-xl px-3 py-3',
                          'text-left transition-colors duration-150 focus:outline-none',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'text-white/55 hover:bg-white/10 hover:text-white/90',
                        ].join(' ')}
                      >
                        <span className="text-[10px] tabular-nums text-white/30 shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={[
                            'text-xs uppercase tracking-widest truncate',
                            isActive ? 'font-semibold' : 'font-light',
                          ].join(' ')}
                        >
                          {NAV_LABELS[ch.id]}
                        </span>
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return isMobile ? mobileNav : desktopNav;
};
