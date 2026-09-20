import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, Sparkles } from 'lucide-react';

interface SectionMarker {
  id: string;
  name: string;
}

const SECTIONS: SectionMarker[] = [
  { id: 'hero', name: 'Studio' },
  { id: 'nail-showcase', name: 'Showcase' },
  { id: 'nail-carousel', name: 'Swatches' },
  { id: 'services', name: 'Services' },
  { id: 'why-choose-us', name: 'Quality' },
  { id: 'artist', name: 'Artist Rohit' },
  { id: 'home-service', name: 'Home Service' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'studio', name: 'Book Studio' },
];

export const NailScrollBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('Studio');
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = window.scrollY;
      const progress = Math.min(Math.max(currentScroll / totalScroll, 0), 1);
      setScrollProgress(progress);

      // Detect active section
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(SECTIONS[i].name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRailClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!railRef.current) return;
    const rect = railRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = Math.max(0, Math.min(1, clickY / rect.height));

    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: ratio * totalScroll,
      behavior: 'smooth',
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Page scroll position indicator"
      className="fixed right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scroll to Top Mini Button */}
      <AnimatePresence>
        {scrollProgress > 0.12 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            onClick={scrollToTop}
            className="mb-3 w-7 h-7 rounded-full bg-[#121116] border border-[#E5C478]/40 text-[#E5C478] hover:bg-[#E5C478] hover:text-[#09090b] flex items-center justify-center transition-all shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:scale-110"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Nail Scroll Rail Container */}
      <div className="relative flex items-center justify-center py-2">
        {/* Section Tooltip pill */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-10 whitespace-nowrap px-3 py-1.5 rounded-full bg-[#121116]/95 border border-[#E5C478]/50 shadow-[0_4px_15px_rgba(0,0,0,0.8)] flex items-center gap-2 pointer-events-none"
              style={{
                top: `${scrollProgress * 100}%`,
                transform: 'translateY(-50%)',
              }}
            >
              <Sparkles className="w-3 h-3 text-[#E5C478] animate-spin" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FAF7F2]">
                {activeSection}
              </span>
              <span className="text-[9px] font-mono text-[#E5C478]">
                {Math.round(scrollProgress * 100)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Track Line */}
        <div
          ref={railRef}
          onClick={handleRailClick}
          className="relative w-3.5 h-[220px] lg:h-[280px] rounded-full bg-[#121116]/80 border border-[#FAF7F2]/10 backdrop-blur-sm cursor-pointer overflow-hidden p-0.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
        >
          {/* Animated Rainbow Liquid Fill Line */}
          <div
            className="w-full rounded-full bg-gradient-to-b from-[#FF3366] via-[#FFFF33] via-[#33CC66] via-[#3399FF] to-[#9933FF] transition-all duration-75 shadow-[0_0_8px_rgba(255,51,102,0.6)]"
            style={{ height: `${Math.max(scrollProgress * 100, 4)}%` }}
          />

          {/* Animated Sculpted Nail Tip Slider */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              top: `calc(${scrollProgress * 100}% - 14px)`,
            }}
          >
            {/* The Sculpted Artificial Nail Tip with Rainbow Chrome */}
            <div className="relative w-5 h-8 filter drop-shadow-[0_2px_10px_rgba(6,182,212,0.7)]">
              <svg
                viewBox="0 0 28 50"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="scrollNailRainbowFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF3366" />
                    <stop offset="25%" stopColor="#FF9933" />
                    <stop offset="50%" stopColor="#FFFF33" />
                    <stop offset="75%" stopColor="#33CC66" />
                    <stop offset="100%" stopColor="#3399FF" />
                  </linearGradient>

                  <linearGradient id="scrollNailGloss" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Almond Contour */}
                <path
                  d="M 14 2 C 22 2, 26 12, 26 26 C 26 40, 23 48, 21 49 C 20 50, 8 50, 7 49 C 5 48, 2 40, 2 26 C 2 12, 6 2, 14 2 Z"
                  fill="url(#scrollNailRainbowFill)"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                />

                {/* Specular curved gloss highlight */}
                <path
                  d="M 6 12 C 6 22, 7 34, 9 42"
                  stroke="url(#scrollNailGloss)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* French chrome smile curve */}
                <path
                  d="M 7 10 C 11 6, 17 6, 21 10 C 23 5, 19 2, 14 2 C 9 2, 5 5, 7 10 Z"
                  fill="#FFF"
                  opacity="0.9"
                />
              </svg>

              {/* Pulsing rainbow micro-halo */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF3366] to-[#00FFFF] opacity-40 blur-sm animate-pulse pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Percentage pill at the bottom */}
      <div className="mt-2 text-[9px] font-mono tracking-widest text-[#E5C478]/80 font-bold">
        {Math.round(scrollProgress * 100)}%
      </div>
    </aside>
  );
};
