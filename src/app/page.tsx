import { ScrollProvider } from '@/providers/ScrollProvider';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { AssetProvider } from '@/providers/AssetProvider';
import { ThreeProvider } from '@/providers/ThreeProvider';
import { ChapterText } from '@/components/html/ChapterText';
import { ChapterCards } from '@/components/html/ChapterCards';
import { Hero } from '@/components/html/Hero';
import { ScrollCue } from '@/components/html/ScrollCue';
import { Footer } from '@/components/html/Footer';
import { Navbar } from '@/components/html/Navbar';
import { LoadingScreen } from '@/components/html/LoadingScreen';
import { TOTAL_SCROLL_VH } from '@/constants/scroll';

export default function Home() {
  return (
    <AssetProvider>
      <ScrollProvider>
        <AnimationProvider>
          <main className="relative min-h-screen">
            {/* 3D Canvas Layer */}
            <ThreeProvider>
              {/* Additional 3D global elements go here */}
            </ThreeProvider>

            {/* 2D HTML Overlay Layer */}
            <LoadingScreen />
            <Navbar />
            <Hero />
            <ScrollCue />
            <ChapterText />
            <ChapterCards />

            {/*
              Scroll height forcing container. Because the canvas is fixed,
              we need a tall in-flow element to give the page something to
              scroll. AnimationProvider's ScrollTrigger targets this element
              directly (id="scroll-spacer", end: 'bottom bottom'), so its
              rendered height is the single source of truth for the total
              scroll distance — no separate px value to keep in sync.
            */}
            <div id="scroll-spacer" style={{ height: `${TOTAL_SCROLL_VH}vh` }} />
          </main>

          <Footer />
        </AnimationProvider>
      </ScrollProvider>
    </AssetProvider>
  );
}
