const NAV_LINKS = ['Personal', 'Business', 'ZainTECH', 'Investor Relations', 'Sustainability', 'Careers', 'Contact'];
const SOCIAL_LINKS = ['Facebook', 'Instagram', 'X', 'LinkedIn'];

/**
 * The cinematic journey's gentle landing: a clean, minimal footer per the
 * brief ("no abrupt visual break"). Sits in normal document flow right after
 * the scroll-spacer, so it appears once the pinned canvas section's
 * ScrollTrigger range ends and the user keeps scrolling past Chapter 9.
 */
export const Footer = () => {
  return (
    <footer className="relative z-10 bg-black px-6 py-10 sm:py-16 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        <span className="text-lg font-light tracking-widest uppercase">Zain</span>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/70">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="hover:text-white">
              {link}
            </a>
          ))}
        </nav>

        <div className="flex gap-6 text-sm text-white/50">
          {SOCIAL_LINKS.map((link) => (
            <a key={link} href="#" className="hover:text-white/80">
              {link}
            </a>
          ))}
        </div>

        <p className="text-xs text-white/30">© {new Date().getFullYear()} Zain Group. All rights reserved.</p>
      </div>
    </footer>
  );
};
