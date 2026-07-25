'use client';

import { useChapterProgress } from '@/hooks/useChapterProgress';
import { mapRange } from '@/utils/math';

/**
 * Branded hero moment: Zain wordmark + tagline inside a dark vignette,
 * visible only during the opening `signal` chapter and fading out as the
 * user starts scrolling (by local progress 0.4, before particles begin
 * forming network shapes). Sits in the upper portion of the frame — not
 * dead-center — so it doesn't collide with `ChapterText`'s centered poetic
 * lines for this same chapter.
 *
 * On mobile the vignette is a content-hugging rounded rectangle rather than
 * a forced circle: at `34vmin` a small phone (~375px wide) only gets ~127px,
 * too small for the logo plus "Progress with Purpose" at this tracking
 * (~277px unwrapped) without the wrapped lines crowding a circle's curved
 * edges. From `sm:` up there's plenty of room (34vmin ≈ 367px at 1080p), so
 * it stays the original circle there.
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
    <div className="pointer-events-none fixed inset-x-0 top-[14%] sm:top-[10%] z-10 flex justify-center px-6" style={{ opacity }}>
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-[2rem] px-7 py-8 sm:h-[34vmin] sm:w-[34vmin] sm:gap-4 sm:rounded-full sm:px-0 sm:py-0"
        style={{
          background:
            'radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 75%)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no need for next/image optimization */}
        <img src="/assets/logos/zain.svg" alt="Zain" className="h-8 w-auto sm:h-10" />
        <p className="whitespace-nowrap text-xs uppercase tracking-[0.15em] text-white/80 sm:whitespace-normal sm:text-sm sm:tracking-[0.3em]">
          Progress with Purpose
        </p>
      </div>
    </div>
  );
};
