'use client';

import { motion } from 'framer-motion';

interface GlassCardProps {
  title: string;
  body: string;
  /** Horizontal entry direction on desktop/tablet; ignored on mobile, which
   * always slides up from below instead (no room for off-screen horizontal
   * travel on a narrow viewport). */
  side: 'left' | 'right';
  isMobile: boolean;
}

/**
 * The reusable glassmorphism data card — per the vision doc's own
 * "glassmorphism and translucent panels ... for overlays and informational
 * content" principle. Used only where there's real structured data to show
 * (see ChapterCards), not as a universal per-chapter treatment.
 */
export const GlassCard = ({ title, body, side, isMobile }: GlassCardProps) => {
  const offset = side === 'left' ? -40 : 40;
  const initial = isMobile ? { opacity: 0, y: 24 } : { opacity: 0, x: offset };
  const animate = isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 };
  const exit = isMobile ? { opacity: 0, y: -16 } : { opacity: 0, x: offset };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="pointer-events-none w-full max-w-xs rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-xl backdrop-blur-md"
    >
      <p className="text-2xl font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-white/70">{body}</p>
    </motion.div>
  );
};
