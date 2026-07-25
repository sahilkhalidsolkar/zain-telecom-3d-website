'use client';

import { useChapterProgress } from '@/hooks/useChapterProgress';
import { mapRange } from '@/utils/math';

/**
 * Branded hero moment: Zain wordmark + tagline inside a dark circular
 * vignette, visible only during the opening `signal` chapter and fading out
 * as the user starts scrolling (by local progress 0.4, before particles
 * begin forming network shapes). Sits in the upper portion of the frame —
 * not dead-center — so it doesn't collide with `ChapterText`'s centered
 * poetic lines for this same chapter.
 *
 * The vignette is a plain CSS radial-gradient, not a 3D object — it renders
 * instantly on load with no texture/asset dependency. (This doubles as the
 * fix for a real bug: Earth's sphere was writing to the depth buffer even
 * while fully transparent, which carved an Earth-shaped hole out of the
 * particle field behind it from the very start — see EarthSystem's
 * `depthWrite` fix. That was an accident of the 3D scene; this hero vignette
 * is the same "dark circle" idea done deliberately in 2D instead, so it's
 * not coupled to Earth's position/opacity at all.)
 */
export const Hero = () => {
  const { chapter, localProgress } = useChapterProgress();

  if (chapter.id !== 'signal') return null;

  const opacity = 1 - mapRange(localProgress, 0, 0.4, 0, 1);
  if (opacity <= 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[10%] z-10 flex justify-center" style={{ opacity }}>
      <div
        className="flex h-[34vmin] w-[34vmin] flex-col items-center justify-center gap-4 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 75%)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no need for next/image optimization */}
        <img src="/assets/logos/zain.svg" alt="Zain" className="h-8 w-auto sm:h-10" />
        <p className="text-sm uppercase tracking-[0.3em] text-white/80">Progress with Purpose</p>
      </div>
    </div>
  );
};
