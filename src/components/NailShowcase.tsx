import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, ArrowRight, Info, RotateCw, Check, Calendar } from 'lucide-react';
import { NAIL_DESIGNS } from '../data/nailData';
import { NailDesign } from '../types';

interface NailShowcaseProps {
  onSelectDesign: (design: NailDesign) => void;
  onBookDesign: (designName: string) => void;
}

export const NailShowcase: React.FC<NailShowcaseProps> = ({
  onSelectDesign,
  onBookDesign,
}) => {
  // Only show exactly 5 signature designs as requested
  const displayDesigns = NAIL_DESIGNS.slice(0, 5);

  const [activeNailId, setActiveNailId] = useState<string | null>(displayDesigns[0].id);
  const [hoveredNailId, setHoveredNailId] = useState<string | null>(null);
  const [flippedNailId, setFlippedNailId] = useState<string | null>(null);

  // Focused nail is either hovered or clicked
  const focusedId = hoveredNailId || activeNailId;
  const focusedDesign = displayDesigns.find((d) => d.id === focusedId) || displayDesigns[0];

  const handleCardClick = (design: NailDesign) => {
    setActiveNailId(design.id);
    // Toggle flip on tap/click for mobile and desktop
    if (flippedNailId === design.id) {
      setFlippedNailId(null);
    } else {
      setFlippedNailId(design.id);
    }
  };

  return (
    <section id="nail-showcase" className="relative py-20 sm:py-28 bg-gradient-to-b from-[#F5ECE4] via-[#FAF5FF] to-[#F3E8FF] overflow-hidden border-b border-[#E9D5FF]">
      {/* Soft Orchid & Lavender Ambient Backing */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#EDE9FE]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#FCE7F3]/50 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DDD6FE] bg-white/80 shadow-xs mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#6D28D9]">
              CURATED ARTISTRY ARCHIVE
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-light text-[#1E1B4B] uppercase tracking-tight mb-3 leading-tight"
          >
            Choose Your <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#BE185D]">Bespoke Nail Style</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs sm:text-sm text-[#475569] font-normal tracking-wide max-w-2xl mx-auto"
          >
            Explore Rohit’s 5 signature salon palette designs. Tap any sculpted nail to flip it around 360° and reveal full artisan specifications, shade swatches, and instant booking.
          </motion.p>
        </div>

        {/* 5 Sculpted Nail Tips Grid - Realistic 3D Flippable Swatch Stand */}
        <div className="relative bg-white/95 rounded-[36px_36px_24px_24px] sm:rounded-[48px_48px_24px_24px] border border-[#DDD6FE] p-4 sm:p-8 lg:p-10 backdrop-blur-xl shadow-[0_20px_50px_rgba(109,40,217,0.08)] mb-10">
          
          {/* Top Display Stand Bar */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-6 text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse" />
              <span className="uppercase tracking-widest text-[#581C87] font-bold text-[11px] sm:text-xs">
                Rohit's Signature Salon Palette Collection
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#7C3AED]">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3 h-3" /> Tap Nail to Flip
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="hidden sm:inline text-slate-500">5 Signature Sets</span>
            </div>
          </div>

          {/* Exactly Five Nails Display - Responsive 3D Flip Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-6 lg:gap-6 items-center justify-center py-2">
            {displayDesigns.map((design, index) => {
              const isSelected = focusedId === design.id;
              const isFlipped = flippedNailId === design.id;

              return (
                <div
                  key={design.id}
                  className="flex flex-col items-center w-full max-w-[280px] sm:max-w-none mx-auto select-none"
                  onMouseEnter={() => setHoveredNailId(design.id)}
                  onMouseLeave={() => setHoveredNailId(null)}
                >
                  {/* 3D Perspective Flip Container */}
                  <div
                    className="relative w-full max-w-[220px] sm:max-w-[190px] aspect-[1/1.9] cursor-pointer group"
                    style={{ perspective: '1200px' }}
                    onClick={() => handleCardClick(design)}
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* ================= FRONT SIDE (Sculpted Nail Tip) ================= */}
                      <div
                        className={`absolute inset-0 w-full h-full rounded-[64px_64px_16px_16px] overflow-hidden border transition-all duration-300 bg-white ${
                          isSelected
                            ? 'border-[#7C3AED] shadow-[0_15px_30px_rgba(124,58,237,0.25)] ring-2 ring-[#7C3AED] ring-offset-2 ring-offset-white'
                            : 'border-[#E2E8F0] shadow-[0_6px_18px_rgba(0,0,0,0.06)] opacity-95 group-hover:opacity-100 group-hover:border-[#7C3AED]/70'
                        }`}
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                      >
                        {/* Nail Image */}
                        <img
                          src={design.image}
                          alt={design.name}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                        />

                        {/* Glossy Specular Sweep Reflection */}
                        <div
                          className={`gloss-overlay ${
                            isSelected ? 'translate-x-[180%] duration-1000' : ''
                          }`}
                        />

                        {/* Realistic artificial nail highlights */}
                        <div className="nail-specular-highlight opacity-60 pointer-events-none" />
                        <div className="nail-center-glow opacity-50 pointer-events-none" />

                        {/* Top Number badge on tip */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white/95 border border-[#CBD5E1] text-[#6D28D9] text-[11px] font-extrabold flex items-center justify-center shadow-xs">
                          0{index + 1}
                        </div>

                        {/* Bottom Flip / Inspect Hint Banner */}
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-center">
                          <span className="inline-flex items-center gap-1.5 text-[10px] bg-[#7C3AED] text-white px-2.5 py-1 rounded-full uppercase tracking-wider font-bold shadow-xs">
                            <RotateCw className="w-3 h-3" /> Tap to Flip
                          </span>
                        </div>
                      </div>

                      {/* ================= BACK SIDE (Artisan Specifications & Details) ================= */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-[64px_64px_16px_16px] overflow-hidden border-2 border-[#7C3AED] bg-gradient-to-b from-[#1E1B4B] via-[#0F172A] to-[#1E1B4B] text-white p-4 flex flex-col justify-between shadow-[0_16px_36px_rgba(109,40,217,0.35)]"
                        style={{
                          transform: 'rotateY(180deg)',
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                      >
                        {/* Back Top Header */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white text-[10px] font-extrabold flex items-center justify-center">
                              0{index + 1}
                            </span>
                            <span className="text-[9px] uppercase tracking-widest text-[#C4B5FD] font-bold">
                              {design.shape.split(' ')[0]} Tip
                            </span>
                          </div>

                          <h4 className="font-serif text-sm font-bold uppercase tracking-tight text-white line-clamp-2 leading-tight">
                            {design.name}
                          </h4>
                          <p className="text-[10px] text-[#A78BFA] line-clamp-1 mt-0.5 font-medium">
                            {design.finish}
                          </p>

                          {/* Palette Swatches */}
                          <div className="mt-2.5 pt-2 border-t border-white/15">
                            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                              Color Palette
                            </div>
                            <div className="flex items-center gap-1.5">
                              {design.palette.slice(0, 4).map((col, ci) => (
                                <span
                                  key={ci}
                                  className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                                  style={{ backgroundColor: col }}
                                  title={col}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Wear Duration */}
                          <div className="mt-2 text-[10px] text-[#34D399] font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3 text-[#34D399]" />
                            <span>Wear: {design.wearDuration}</span>
                          </div>
                        </div>

                        {/* Back Action Buttons */}
                        <div className="space-y-1.5 pt-2 border-t border-white/15">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDesign(design);
                            }}
                            className="w-full py-1.5 px-2 rounded-full border border-[#DDD6FE]/60 bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <Info className="w-3 h-3 text-[#C4B5FD]" />
                            <span>Full Specs</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onBookDesign(design.name);
                            }}
                            className="w-full py-1.5 px-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#DB2777] hover:from-[#6D28D9] hover:to-[#BE185D] text-white text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1 transition-all shadow-md"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Book Set</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlippedNailId(null);
                            }}
                            className="w-full text-center text-[9px] text-slate-400 hover:text-white pt-0.5 flex items-center justify-center gap-1"
                          >
                            <RotateCw className="w-2.5 h-2.5" />
                            <span>Tap to Flip Back</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Nail Label Underneath */}
                  <div className="mt-3 text-center">
                    <p
                      onClick={() => handleCardClick(design)}
                      className={`font-serif text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                        isSelected ? 'text-[#6D28D9]' : 'text-[#1E293B] group-hover:text-[#6D28D9]'
                      }`}
                    >
                      {design.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCardClick(design)}
                      className="inline-flex items-center gap-1 text-[10px] text-[#7C3AED] hover:text-[#581C87] tracking-wider uppercase mt-0.5 font-bold transition-colors"
                    >
                      <RotateCw className="w-2.5 h-2.5" />
                      <span>{isFlipped ? 'Flip to Photo' : 'Flip for Details'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Nail Detail Spotlight Banner */}
          <AnimatePresence mode="wait">
            {focusedDesign && (
              <motion.div
                key={focusedDesign.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-[#FAF5FF] p-5 sm:p-6 rounded-[24px] border border-[#DDD6FE] shadow-xs"
              >
                <div className="max-w-2xl text-left">
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-[0.2em]">
                      SELECTED STYLE:
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B4B] uppercase tracking-wide">
                      {focusedDesign.name}
                    </h3>
                    <span className="text-[10px] bg-white text-[#6D28D9] px-2.5 py-0.5 rounded-full border border-[#DDD6FE] uppercase tracking-widest font-bold shadow-xs">
                      {focusedDesign.finish}
                    </span>
                  </div>

                  {/* Color Palette Chips */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Palette:</span>
                    <div className="flex items-center gap-1.5">
                      {focusedDesign.palette.map((color, cIdx) => (
                        <span
                          key={cIdx}
                          className="w-4 h-4 rounded-full border border-white shadow-xs transition-transform hover:scale-125"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                    {focusedDesign.description}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => onSelectDesign(focusedDesign)}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-full border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#6D28D9] hover:text-[#6D28D9] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Info className="w-3.5 h-3.5 text-[#6D28D9]" />
                    <span>FULL SPECS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookDesign(focusedDesign.name)}
                    className="flex-1 md:flex-initial px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#C026D3] text-white text-xs font-bold tracking-widest uppercase shadow-[0_4px_16px_rgba(109,40,217,0.3)] hover:shadow-[0_6px_22px_rgba(109,40,217,0.4)] transition-all flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
                  >
                    <span>BOOK APPOINTMENT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};
