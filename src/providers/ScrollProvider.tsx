'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/store/useScrollStore';

gsap.registerPlugin(ScrollTrigger);

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5, // Smoother, slightly longer duration for cinematic feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    const setScrollState = useScrollStore.getState().setScrollState;
    const setLenis = useScrollStore.getState().setLenis;

    setLenis(lenis);

    lenis.on('scroll', (instance: Lenis) => {
      setScrollState({
        progress: instance.progress,
        velocity: instance.velocity,
        direction: instance.direction,
      });
      // Keep ScrollTrigger's internal scroll position in sync with Lenis's
      // smoothed value, otherwise pinned/scrubbed animations drift out of sync.
      ScrollTrigger.update();
    });

    // Synchronize Lenis with GSAP's ticker
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
