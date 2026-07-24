'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/store/useScrollStore';

interface AnimationContextType {
  masterTimeline: gsap.core.Timeline | null;
}

const AnimationContext = createContext<AnimationContextType>({ masterTimeline: null });

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [masterTimeline, setMasterTimeline] = useState<gsap.core.Timeline | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Create the global Master Timeline.
    //
    // No `pin` here: #canvas-container is already `position: fixed` via CSS,
    // so it never needs pinning — GSAP pinning an already-fixed element
    // miscalculates the trigger's box and grows the pin-spacer on every
    // refresh (observed as document height ballooning across scroll/resize
    // events). The DOM spacer in page.tsx (sized from TOTAL_SCROLL_VH) is
    // what reserves scroll distance; ScrollTrigger just needs to observe
    // scroll over that element's own rendered height, so `end: 'bottom
    // bottom'` ties directly to it with no hand-computed px value that could
    // drift out of sync.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-spacer',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
        onUpdate: (self) => {
          useScrollStore.getState().setCanvasProgress(self.progress);
        },
      },
    });

    // GSAP/ScrollTrigger must be created client-side only (they touch
    // `window`), so this can't be initialized during render for SSR safety —
    // exposing the resulting timeline via state is the only way to make it
    // available through context, which is exactly this rule's target
    // pattern; there's no violation here to actually fix.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMasterTimeline(tl);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <AnimationContext.Provider value={{ masterTimeline }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useMasterTimeline = () => useContext(AnimationContext).masterTimeline;
