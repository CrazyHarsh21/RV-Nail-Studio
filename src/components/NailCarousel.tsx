import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Eye, Layers } from 'lucide-react';
import { NAIL_DESIGNS } from '../data/nailData';
import { NailDesign } from '../types';

interface NailCarouselProps {
  onSelectDesign: (design: NailDesign) => void;
  onBookDesign: (designName: string) => void;
}

export const NailCarousel: React.FC<NailCarouselProps> = ({
  onSelectDesign,
  onBookDesign: _onBookDesign,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % NAIL_DESIGNS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + NAIL_DESIGNS.length) % NAIL_DESIGNS.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="nail-carousel" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F3E8FF] via-[#F2F8F5] to-[#E6F4ED] overflow-hidden border-b border-[#A7F3D0]">
      {/* Soft Sage Ambient Backing */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#D1FAE5]/60 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#A7F3D0] bg-white/80 shadow-xs mb-3">
              <Layers className="w-3.5 h-3.5 text-[#059669]" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#047857]">
                SWATCH RUNWAY & TIP TRACK
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#064E3B] font-light uppercase tracking-tight">
              Bespoke Nail <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#047857] via-[#0D9488] to-[#2563EB]">Swatch Runway</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#334155] font-normal mt-2 max-w-lg">
              Swipe or tap through Rohit’s sculpted nail swatches on an artisan track with high-gloss liquid reflections and shape options.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-[#A7F3D0] bg-white text-[#064E3B] hover:text-[#059669] hover:border-[#059669] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Previous nail tip"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-[#A7F3D0] bg-white text-[#064E3B] hover:text-[#059669] hover:border-[#059669] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Next nail tip"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Presentation Track */}
        <div
          ref={containerRef}
          className="relative bg-white/95 p-6 sm:p-10 rounded-[56px_56px_28px_28px] border border-[#A7F3D0] shadow-[0_20px_50px_rgba(5,150,105,0.08)]"
        >
          {/* Track Mounting Bar */}
          <div className="absolute top-10 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-[#059669]/20 to-transparent pointer-events-none hidden md:block" />

          {/* Draggable & Swipable Container */}
          <div className="overflow-hidden py-4">
            <motion.div
              className="flex gap-6 sm:gap-8 items-center cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -300, right: 300 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) {
                  nextSlide();
                } else if (info.offset.x > 50) {
                  prevSlide();
                }
              }}
            >
              {NAIL_DESIGNS.map((design, idx) => {
                return (
                  <motion.div
                    key={design.id}
                    layout
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-shrink-0 w-[240px] sm:w-[260px] flex flex-col items-center group select-none"
                    onClick={() => onSelectDesign(design)}
                  >
                    {/* Metal swatch ring mount connector */}
                    <div className="w-4 h-6 rounded-full border border-[#A7F3D0] bg-[#F0FDF4] mb-1 flex items-center justify-center shadow-2xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    </div>

                    {/* Realistic Artificial Nail Tip */}
                    <div className="relative w-full aspect-[1/1.85] rounded-[72px_72px_16px_16px] overflow-hidden border-2 border-[#E2E8F0] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.07)] group-hover:border-[#059669] group-hover:shadow-[0_15px_30px_rgba(5,150,105,0.2)] transition-all duration-500 transform group-hover:-translate-y-2">
                      <img
                        src={design.image}
                        alt={design.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                      />

                      {/* Glossy specular reflection */}
                      <div className="gloss-overlay" />
                      <div className="nail-specular-highlight opacity-60" />
                      <div className="nail-center-glow opacity-50" />

                      {/* Pill Badge */}
                      <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#CBD5E1] text-[9px] text-[#064E3B] uppercase tracking-wider font-bold shadow-xs">
                        {design.shape.split(' ')[0]}
                      </div>

                      {/* Bottom Overlay Info */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col justify-end text-left">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[10px] text-[#A7F3D0] font-bold uppercase tracking-widest">
                            Set #{idx + 1}
                          </p>
                          {/* Mini Palette preview dots */}
                          <div className="flex items-center gap-1">
                            {design.palette.slice(0, 4).map((c, ci) => (
                              <span
                                key={ci}
                                className="w-2.5 h-2.5 rounded-full border border-white/60"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="font-serif text-lg font-bold text-white uppercase">
                          {design.name}
                        </h4>
                        <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 font-light">
                          {design.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* CTA on Card Bottom */}
                    <div className="w-full mt-3 flex items-center justify-center px-2 text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDesign(design);
                        }}
                        className="w-full py-2 rounded-full border border-[#CBD5E1] hover:border-[#059669] bg-white text-[11px] text-[#334155] hover:text-[#047857] hover:bg-[#F0FDF4] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#059669]" />
                        <span>VIEW SET DETAILS</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {NAIL_DESIGNS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i
                    ? 'w-8 bg-[#059669]'
                    : 'w-2 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                }`}
                aria-label={`Go to nail design ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
