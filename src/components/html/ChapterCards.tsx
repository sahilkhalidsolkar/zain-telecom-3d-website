'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChapterProgress } from '@/hooks/useChapterProgress';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { mapRange } from '@/utils/math';
import { GlassCard } from './GlassCard';

/**
 * Minimum real time (ms) a card stays on screen before the next one can
 * replace it, regardless of how fast the user scrolls past its portion of
 * the chapter. Allocating more *scroll distance* per card doesn't actually
 * guarantee more *read time* — a faster scroll gesture just covers that
 * distance faster too. This is the only thing that actually guarantees a
 * minimum viewing time independent of scroll speed.
 */
const MIN_DWELL_MS = 1200;

/**
 * Renders one glassmorphism card at a time for chapters with real structured
 * data (`chapter.cards` in chapters.ts — countries, stats, ecosystem brands,
 * DEI programs), alternating which side each card enters from.
 *
 * The card the scroll position currently "wants" (`targetIndex`) can change
 * every frame, but `displayIndex` — what's actually shown — only follows it
 * once MIN_DWELL_MS has passed since the last change. Scrolling fast just
 * means some intermediate cards get skipped entirely (jumping straight to
 * whatever the target is once the dwell timer fires), rather than every
 * card flickering past unread.
 *
 * Both a left-docked and a right-docked container are always mounted; only
 * whichever one matches the active card's `side` actually renders it. This
 * matters because AnimatePresence only animates the *card*, not this
 * container — if the container itself switched sides based on the new
 * card's side, it would jump to the new position while the old card was
 * still mid-exit-animation, making it flash in the wrong place. Each slot
 * staying put and independently toggling its own content in/out avoids that.
 *
 * Deliberately renders nothing for chapters without a `cards` array —
 * Ch.1-3 and Ch.9 keep their existing minimal/poetic-only treatment.
 */
export const ChapterCards = () => {
  const { chapter, localProgress } = useChapterProgress();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  const cards = chapter.cards;

  const targetIndex =
    cards && cards.length > 0 ? Math.min(cards.length - 1, Math.floor(mapRange(localProgress, 0, 1, 0, cards.length))) : 0;

  const [displayIndex, setDisplayIndex] = useState(targetIndex);
  // Tracks which chapter `displayIndex` was last reset for — state, not a
  // ref, so the reset below can happen synchronously during render (React's
  // sanctioned "adjust state when a prop changes" pattern). This must be
  // synchronous rather than done in an effect: an effect runs one render
  // *after* this one, so on the render where `chapter` first changes,
  // `cards[displayIndex]` would still be indexing into the *new* chapter's
  // (possibly shorter) `cards` array with the *previous* chapter's index,
  // which crashed when the new array was shorter.
  const [resetForChapter, setResetForChapter] = useState(chapter.id);
  if (resetForChapter !== chapter.id) {
    setResetForChapter(chapter.id);
    setDisplayIndex(targetIndex);
  }

  const lastChangeRef = useRef(0);

  // Any time the displayed card actually changes (including the
  // chapter-change reset above), restart the dwell clock. Reading
  // performance.now() and writing a ref are both disallowed during render,
  // so this part happens a render later in an effect — harmless, since it
  // only affects animation timing, never array bounds.
  useEffect(() => {
    lastChangeRef.current = performance.now();
  }, [displayIndex]);

  useEffect(() => {
    if (targetIndex === displayIndex) return;
    const elapsed = performance.now() - lastChangeRef.current;
    const delay = Math.max(0, MIN_DWELL_MS - elapsed);
    const timer = setTimeout(() => setDisplayIndex(targetIndex), delay);
    return () => clearTimeout(timer);
  }, [targetIndex, displayIndex]);

  if (!cards || cards.length === 0) return null;

  // Belt-and-suspenders: guards against the one-render-stale gap between a
  // chapter change and the reset above being applied.
  const safeIndex = Math.min(displayIndex, cards.length - 1);
  const card = cards[safeIndex];
  const side = safeIndex % 2 === 0 ? 'left' : 'right';
  const cardKey = `${chapter.id}-${safeIndex}`;

  const slotClassName = (slotSide: 'left' | 'right') =>
    `fixed inset-y-0 z-10 flex items-center px-6 sm:px-12 pointer-events-none ${
      slotSide === 'left' ? 'left-0' : 'right-0'
    }`;

  if (isMobile) {
    return (
      <div className="fixed inset-x-0 bottom-16 z-10 flex justify-center px-6 pointer-events-none">
        <AnimatePresence mode="wait">
          <GlassCard key={cardKey} title={card.title} body={card.body} side={side} isMobile />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <div className={slotClassName('left')}>
        <AnimatePresence mode="wait">
          {side === 'left' && <GlassCard key={cardKey} title={card.title} body={card.body} side="left" isMobile={false} />}
        </AnimatePresence>
      </div>
      <div className={slotClassName('right')}>
        <AnimatePresence mode="wait">
          {side === 'right' && <GlassCard key={cardKey} title={card.title} body={card.body} side="right" isMobile={false} />}
        </AnimatePresence>
      </div>
    </>
  );
};
