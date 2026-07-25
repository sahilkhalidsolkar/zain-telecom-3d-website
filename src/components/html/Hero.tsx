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
 * The tagline is deliberately the dominant line on this screen (bolder,
 * larger than the previous xs/sm sizing) so the actual brand line reads as
 * the headline once paired with the logo mark, rather than sitting beneath
 * `ChapterText`'s narrative copy in visual weight. A short, real
 * mission-statement-derived line underneath hints at scale without breaking
 * Chapter 1's intentional minimalism (full stats are Chapter 5's job).
 *
 * The vignette is content-hugging (padding-based, no fixed width/height) at
 * every breakpoint rather than a fixed `vmin` square — a previous version
 * forced a `34vmin` circle from `sm:` up, which broke in two different ways:
 * too small on a narrow phone (vmin governed by width), and *also* too small
 * in a short/landscape-ish window (vmin governed by whichever of width/height
 * is smaller — a wide-but-short viewport shrinks it via height instead),
 * wrapping "Progress with Purpose" into two lines either way. A shape sized
 * by its own content can't wrap-then-clip against a shape that was sized
 * independently of that content, so this removes the bug class entirely
 * rather than re-tuning another magic number for the next aspect ratio.
 *
 * The vignette itself is a plain CSS radial-gradient, not a 3D object — it
 * renders instantly on load with no texture/asset dependency. (This doubles
 * as the fix for a real bug: Earth's sphere was writing to the depth buffer
 * even while fully transparent, which carved an Earth-shaped hole out of the
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
        className="flex flex-col items-center justify-center gap-3 rounded-[2rem] px-8 py-8 sm:gap-4 sm:px-12 sm:py-10"
        style={{
          background:
            'radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 75%)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no need for next/image optimization */}
        <img src="/assets/logos/zain.svg" alt="Zain" className="h-12 w-auto sm:h-16" />
        <p className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.15em] text-white sm:text-lg sm:tracking-[0.25em]">
          Progress with Purpose
        </p>
        <p className="whitespace-nowrap text-center text-[10px] tracking-wide text-white/45 sm:text-xs">
          Connecting the Middle East &amp; Africa since 1983
        </p>
      </div>
    </div>
  );
};
