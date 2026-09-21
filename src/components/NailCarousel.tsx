import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  Play,
  Pause,
  Sparkles,
  Calendar,
  Zap
} from 'lucide-react';
import { NAIL_DESIGNS } from '../data/nailData';
import { NailDesign } from '../types';

interface NailCarouselProps {
  onSelectDesign: (design: NailDesign) => void;
  onBookDesign: (designName: string) => void;
}

export const NailCarousel: React.FC<NailCarouselProps> = ({
  onSelectDesign,
  onBookDesign,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [speed, setSpeed] = useState<number>(1); // 1 = Normal, 1.5 = Fast
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicate for seamless infinite loop (10 items -> 20 items)
  const infiniteDesigns = [...NAIL_DESIGNS, ...NAIL_DESIGNS];

  // Continuous infinite smooth glide loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollStep = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Only scroll if playing and user is not hovering or actively dragging
      if (isPlaying && !isHovered && !isDragging) {
        // ~45px per second base speed
        const pixelsToMove = 45 * speed * Math.min(delta, 0.1);
        el.scrollLeft += pixelsToMove;

        // When reached the end of the first duplicate, seamlessly wrap to start
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, isHovered, isDragging, speed]);

  // Handle boundary check on manual scroll
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const halfWidth = el.scrollWidth / 2;
    if (halfWidth > 0) {
      if (el.scrollLeft >= halfWidth * 1.95) {
        el.scrollLeft -= halfWidth;
      } else if (el.scrollLeft <= 5) {
        el.scrollLeft += halfWidth;
      }
    }
  };

  const nextSlide = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const prevSlide = () => {
    const el = scrollRef.current;
    if (!el) return;
    const halfWidth = el.scrollWidth / 2;
    if (el.scrollLeft <= 10) {
      el.scrollLeft += halfWidth;
    }
    el.scrollBy({ left: -320, behavior: 'smooth' });
  };

  // Touch and mouse drag handlers for natural swiping
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    setIsDragging(true);
    startXRef.current = e.touches[0].pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchEnd = () => {
    // Keep auto-scroll paused briefly after touch interaction so user can view
    touchTimeoutRef.current = setTimeout(() => {
      setIsDragging(false);
    }, 1200);
  };

  return (
    <section
      id="nail-carousel"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F3E8FF] via-[#F2F8F5] to-[#E6F4ED] overflow-hidden border-b border-[#A7F3D0]"
    >
      {/* Soft Ambient Radiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#D1FAE5]/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FCE7F3]/40 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#A7F3D0] bg-white/90 shadow-xs mb-3">
              <Layers className="w-3.5 h-3.5 text-[#059669]" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#047857]">
                BESPOKE SWATCH RUNWAY
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[9px] font-extrabold tracking-wider border border-[#A7F3D0]">
                <Zap className="w-2.5 h-2.5 fill-current" /> INFINITE MOVING
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#064E3B] font-light uppercase tracking-tight">
              Runway <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#047857] via-[#0D9488] to-[#2563EB]">Swatches</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#334155] font-normal mt-2 max-w-2xl leading-relaxed">
              Rohit’s signature sculpted nail tips glide continuously in an endless artisan runway loop.
              Hover anywhere to pause & inspect individual shade palettes, or tap to view full set details & book instantly.
            </p>
          </div>

          {/* Controls: Play/Pause, Speed, & Navigation */}
          <div className="flex items-center flex-wrap gap-2.5 self-start lg:self-end">
            {/* Play/Pause Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold tracking-wider uppercase transition-all shadow-xs ${
                isPlaying
                  ? 'bg-white border-[#A7F3D0] text-[#047857] hover:bg-[#F0FDF4]'
                  : 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] hover:bg-[#FEE2E2]'
              }`}
              title={isPlaying ? 'Pause infinite runway movement' : 'Resume infinite runway movement'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current text-[#059669]" />
                  <span>RUNNING</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-[#DC2626]" />
                  <span>PAUSED</span>
                </>
              )}
            </button>

            {/* Speed Toggle */}
            <button
              onClick={() => setSpeed((prev) => (prev === 1 ? 1.5 : 1))}
              className="px-3 py-2 rounded-full border border-[#CBD5E1] bg-white text-[11px] font-bold text-[#475569] hover:text-[#047857] hover:border-[#059669] transition-all shadow-xs"
              title="Toggle runway glide speed"
            >
              {speed === 1 ? '1.0x GLIDE' : '1.5x FAST'}
            </button>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-[#A7F3D0] bg-white text-[#064E3B] hover:text-[#059669] hover:border-[#059669] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs"
                aria-label="Previous nail swatch"
                title="Scroll previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-[#A7F3D0] bg-white text-[#064E3B] hover:text-[#059669] hover:border-[#059669] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs"
                aria-label="Next nail swatch"
                title="Scroll next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Presentation Track */}
        <div
          className="relative bg-white/95 p-5 sm:p-8 rounded-[48px_48px_28px_28px] border border-[#A7F3D0] shadow-[0_20px_50px_rgba(5,150,105,0.08)]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleMouseUpOrLeave();
          }}
        >
          {/* Track Mounting Bar */}
          <div className="absolute top-10 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[#059669]/25 to-transparent pointer-events-none hidden md:block" />

          {/* Infinite Smooth Glide Track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="overflow-x-auto py-4 cursor-grab active:cursor-grabbing select-none scrollbar-none scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div className="flex gap-6 sm:gap-7 items-center w-max pl-2 pr-6">
              {infiniteDesigns.map((design, idx) => {
                const displayIndex = (idx % NAIL_DESIGNS.length) + 1;
                return (
                  <div
                    key={`${design.id}-${idx}`}
                    className="flex-shrink-0 w-[240px] sm:w-[265px] flex flex-col items-center group select-none"
                  >
                    {/* Metal swatch ring mount connector */}
                    <div className="w-4 h-6 rounded-full border border-[#A7F3D0] bg-[#F0FDF4] mb-1 flex items-center justify-center shadow-2xs transition-colors group-hover:bg-[#DCFCE7]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    </div>

                    {/* Realistic Artificial Nail Tip Frame */}
                    <div
                      onClick={() => onSelectDesign(design)}
                      className="cursor-pointer relative w-full aspect-[1/1.85] rounded-[72px_72px_16px_16px] overflow-hidden border-2 border-[#E2E8F0] bg-[#1C1917] shadow-[0_10px_25px_rgba(0,0,0,0.08)] group-hover:border-[#059669] group-hover:shadow-[0_18px_35px_rgba(5,150,105,0.25)] transition-all duration-500 transform group-hover:-translate-y-2"
                    >
                      <img
                        src={design.image}
                        alt={design.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                      />

                      {/* Specular glass luster overlays */}
                      <div className="gloss-overlay" />
                      <div className="nail-specular-highlight opacity-60" />
                      <div className="nail-center-glow opacity-50" />

                      {/* Top Pill Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] text-[#A7F3D0] uppercase tracking-wider font-extrabold border border-white/20">
                          #{displayIndex.toString().padStart(2, '0')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] text-[#064E3B] uppercase tracking-wider font-bold border border-[#CBD5E1] shadow-2xs">
                          {design.shape.split(' ')[0]}
                        </span>
                      </div>

                      {/* Bottom Info Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col justify-end text-left pointer-events-none">
                        {/* Palette Dots */}
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] text-[#A7F3D0] font-bold uppercase tracking-widest">
                            {design.finish.split(' ')[0]} Finish
                          </p>
                          <div className="flex items-center gap-1">
                            {design.palette.slice(0, 4).map((c, ci) => (
                              <span
                                key={ci}
                                className="w-2.5 h-2.5 rounded-full border border-white/60 shadow-xs"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>

                        <h4 className="font-serif text-base sm:text-lg font-bold text-white uppercase tracking-tight line-clamp-1">
                          {design.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-white/80 line-clamp-1 mt-0.5 font-light">
                          {design.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Dual Action CTA Buttons on Card Bottom */}
                    <div className="w-full mt-3 flex items-center gap-1.5 px-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDesign(design);
                        }}
                        className="flex-1 py-2 rounded-full border border-[#CBD5E1] hover:border-[#059669] bg-white text-[10px] text-[#334155] hover:text-[#047857] hover:bg-[#F0FDF4] uppercase tracking-wider font-bold flex items-center justify-center gap-1 transition-all shadow-2xs"
                        title="View specifications and color swatches"
                      >
                        <Eye className="w-3 h-3 text-[#059669]" />
                        <span>DETAILS</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookDesign(design.name);
                        }}
                        className="flex-1 py-2 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1 transition-all shadow-xs"
                        title="Book this design set"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>BOOK SET</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Footer Runway Ribbon */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-[#E2E8F0] text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying && !isHovered ? 'bg-[#059669]' : 'bg-[#EF4444]'} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying && !isHovered ? 'bg-[#059669]' : 'bg-[#EF4444]'}`} />
              </span>
              <span className="font-medium">
                {isHovered
                  ? 'Runway Paused on Hover — Click any set to inspect'
                  : isPlaying
                  ? 'Endless Moving Runway Active — Hover or Drag to Inspect'
                  : 'Runway Paused — Click "Running" above to restart'}
              </span>
            </div>

            <div className="flex items-center gap-3 font-semibold text-[11px] text-[#064E3B]">
              <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0]">
                {NAIL_DESIGNS.length} Signature Sets Available
              </span>
              <span className="hidden md:inline text-[#94A3B8]">•</span>
              <span className="hidden md:inline text-[#475569]">
                Autoclave Sterilized • 4-Week Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
