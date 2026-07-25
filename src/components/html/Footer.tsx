'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CSUITE, BOARD, MARKET_CEOS, IDE_CHAMPIONS, type Leader, type LeadershipTab } from '@/constants/leadership';

// ─── Data ──────────────────────────────────────────────────────────────────
const NAV_LINKS = ['Personal', 'Business', 'ZainTECH', 'Investor Relations', 'Sustainability', 'Careers', 'Contact'];
const SOCIAL_LINKS = ['Facebook', 'Instagram', 'X', 'LinkedIn'];

const TABS: { id: LeadershipTab; label: string }[] = [
  { id: 'leadership', label: 'C-Suite' },
  { id: 'board', label: 'Board' },
  { id: 'markets', label: 'Market CEOs' },
];

// ─── Hooks ─────────────────────────────────────────────────────────────────
/** Returns true once the element has scrolled into view. */
const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

// ─── Sub-components ────────────────────────────────────────────────────────

/** Glassmorphism card for a C-Suite leader — shows quote on hover. */
const LeaderCard = ({ leader, delay }: { leader: Leader; delay: number }) => {
  const [hovered, setHovered] = useState(false);
  const initials = leader.name
    .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.) /, '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur-md cursor-default transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)]"
    >
      {/* Initials avatar */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold tracking-wider text-white/80">
        {initials}
      </div>

      <p className="text-sm font-semibold text-white leading-snug">{leader.name}</p>
      <p className="mt-1 text-[11px] uppercase tracking-widest text-white/45 leading-tight">{leader.title}</p>

      {/* Quote overlay */}
      <AnimatePresence>
        {hovered && leader.quote && (
          <motion.div
            key="quote"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center rounded-2xl bg-black/75 p-5 backdrop-blur-sm"
          >
            <blockquote className="text-xs leading-relaxed text-white/85 italic">
              &ldquo;{leader.quote}&rdquo;
            </blockquote>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/** Compact row for a Board member — no hover quote needed. */
const BoardRow = ({ leader, delay }: { leader: Leader; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-colors duration-200 hover:bg-white/10"
  >
    <span className="text-sm text-white/85">{leader.name}</span>
    <span className="text-[10px] uppercase tracking-widest text-white/35 shrink-0">{leader.title}</span>
  </motion.div>
);

/** Market CEO card with country badge and quote on hover. */
const MarketCard = ({ leader, delay }: { leader: Leader; delay: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md cursor-default transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)]"
    >
      <span className="mb-3 inline-block rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/60">
        {leader.market}
      </span>
      <p className="text-sm font-semibold text-white">{leader.name}</p>
      <p className="mt-1 text-[11px] uppercase tracking-widest text-white/45">{leader.title}</p>

      <AnimatePresence>
        {hovered && leader.quote && (
          <motion.div
            key="quote"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center rounded-2xl bg-black/75 p-5 backdrop-blur-sm"
          >
            <blockquote className="text-xs leading-relaxed text-white/85 italic">
              &ldquo;{leader.quote}&rdquo;
            </blockquote>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Leadership Section ────────────────────────────────────────────────────
const LeadershipSection = () => {
  const [activeTab, setActiveTab] = useState<LeadershipTab>('leadership');
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="w-full max-w-5xl mx-auto px-4 py-16">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35 mb-2">The People</p>
        <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-white">Behind the Progress</h2>
        <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </motion.div>

      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mb-8 flex justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm"
        style={{ width: 'fit-content', margin: '0 auto 2rem' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`leadership-tab-${tab.id}`}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative z-10 px-5 py-2 text-xs uppercase tracking-widest transition-colors duration-200 rounded-xl focus:outline-none ${
              activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="tab-bg"
                className="absolute inset-0 rounded-xl bg-white/15 border border-white/20"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'leadership' && inView && (
          <motion.div
            key="leadership"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            {/* C-Suite grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {CSUITE.map((leader, i) => (
                <LeaderCard key={leader.name} leader={leader} delay={i * 0.08} />
              ))}
            </div>
            {/* IDE Champions strip */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-white/35">IDE Program Champions</p>
              <div className="flex flex-wrap gap-2">
                {IDE_CHAMPIONS.map((c) => (
                  <span
                    key={c.name}
                    className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs text-white/65 transition-colors hover:border-white/30 hover:text-white/90"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'board' && inView && (
          <motion.div
            key="board"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-2"
          >
            {BOARD.map((leader, i) => (
              <BoardRow key={leader.name} leader={leader} delay={i * 0.05} />
            ))}
          </motion.div>
        )}

        {activeTab === 'markets' && inView && (
          <motion.div
            key="markets"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {MARKET_CEOS.map((leader, i) => (
              <MarketCard key={leader.name} leader={leader} delay={i * 0.1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ─── Footer ────────────────────────────────────────────────────────────────
/**
 * The cinematic journey's gentle landing: leadership profiles + minimal nav.
 * Sits in normal document flow right after the scroll-spacer, so it appears
 * once the pinned canvas section's ScrollTrigger range ends.
 */
export const Footer = () => {
  return (
    <footer className="relative z-10 bg-black text-white">
      {/* Gradient bridge from 3D canvas → footer */}
      <div className="h-24 bg-gradient-to-b from-transparent to-black" />

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* Interactive leadership section */}
      <LeadershipSection />

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Minimal footer nav */}
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-10 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logos/zain.svg" alt="Zain" className="h-7 w-auto brightness-0 invert opacity-60" />

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/50">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="uppercase tracking-wider transition-colors hover:text-white/80">
              {link}
            </a>
          ))}
        </nav>

        <div className="flex gap-5 text-xs text-white/35">
          {SOCIAL_LINKS.map((link) => (
            <a key={link} href="#" className="uppercase tracking-wider transition-colors hover:text-white/70">
              {link}
            </a>
          ))}
        </div>

        <p className="text-[11px] text-white/20">© {new Date().getFullYear()} Zain Group. All rights reserved.</p>
      </div>
    </footer>
  );
};
