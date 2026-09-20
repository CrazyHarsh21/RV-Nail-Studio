import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, ArrowRight, Info } from 'lucide-react';
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
  const [activeNailId, setActiveNailId] = useState<string | null>(NAIL_DESIGNS[0].id);
  const [hoveredNailId, setHoveredNailId] = useState<string | null>(null);

  // The active nail is either the hovered one or the currently clicked one
  const focusedId = hoveredNailId || activeNailId;
  const focusedDesign = NAIL_DESIGNS.find((d) => d.id === focusedId) || NAIL_DESIGNS[0];

  return (
    <section id="nail-showcase" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F5ECE4] via-[#FAF5FF] to-[#F3E8FF] overflow-hidden border-b border-[#E9D5FF]">
      {/* Soft Orchid & Lavender Ambient Backing */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#EDE9FE]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#FCE7F3]/50 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DDD6FE] bg-white/80 shadow-xs mb-4"
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
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#1E1B4B] uppercase tracking-tight mb-4 leading-tight"
          >
            Choose Your <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#BE185D]">Bespoke Nail Style</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-[#475569] font-normal tracking-wide max-w-2xl mx-auto"
          >
            Explore handcrafted nail sets with custom color combinations. Hover or tap each sculpted nail to inspect individual chrome glaze powders, 3D droplet effects, and wear durability.
          </motion.p>
        </div>

        {/* 5 Sculpted Nail Tips Grid - Realistic Nail Swatch Stand */}
        <div className="relative bg-white/90 rounded-[48px_48px_24px_24px] border border-[#DDD6FE] p-6 sm:p-10 lg:p-12 backdrop-blur-xl shadow-[0_20px_50px_rgba(109,40,217,0.08)] mb-12">
          
          {/* Top Display Stand Bar */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-6 mb-8 text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse" />
              <span className="uppercase tracking-widest text-[#581C87] font-bold">
                Rohit's Signature Salon Palette Collection
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[11px] uppercase tracking-wider font-semibold">
              <span>Almond & Coffin Sculpted Tips</span>
              <span>•</span>
              <span>High-Gloss UV Gel Coat</span>
            </div>
          </div>

          {/* Five Nails Flex Display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-6 lg:gap-8 items-end justify-center py-4">
            {NAIL_DESIGNS.map((design, index) => {
              const isSelected = focusedId === design.id;

              return (
                <div
                  key={design.id}
                  className="flex flex-col items-center cursor-pointer group"
                  onMouseEnter={() => setHoveredNailId(design.id)}
                  onMouseLeave={() => setHoveredNailId(null)}
                  onClick={() => {
                    setActiveNailId(design.id);
                    onSelectDesign(design);
                  }}
                >
                  {/* The Nail Tip Container */}
                  <div className="relative w-full max-w-[170px] sm:max-w-[190px] aspect-[1/1.9] perspective-1000 flex items-center justify-center">
                    
                    {/* Animated realistic nail motion */}
                    <motion.div
                      animate={
                        isSelected
                          ? {
                              scale: [1, 0.95, 1.06],
                              y: [0, 4, -12],
                              rotate: 0,
                            }
                          : {
                              scale: 1,
                              y: 0,
                              rotate: (index - 2) * 1.5,
                            }
                      }
                      transition={{
                        duration: isSelected ? 0.75 : 0.6,
                        ease: [0.16, 1, 0.3, 1],
                        times: isSelected ? [0, 0.25, 1] : undefined,
                      }}
                      className={`relative w-full h-full rounded-[64px_64px_14px_14px] overflow-hidden border transition-all duration-500 bg-white ${
                        isSelected
                          ? 'border-[#7C3AED] shadow-[0_15px_30px_rgba(124,58,237,0.25)] ring-2 ring-[#7C3AED] ring-offset-2 ring-offset-white'
                          : 'border-[#E2E8F0] shadow-[0_6px_18px_rgba(0,0,0,0.06)] opacity-95 group-hover:opacity-100 group-hover:border-[#7C3AED]/60'
                      }`}
                    >
                      {/* Nail Image */}
                      <img
                        src={design.image}
                        alt={design.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Glossy Specular Sweep Reflection */}
                      <div
                        className={`gloss-overlay ${
                          isSelected ? 'translate-x-[180%] duration-1000' : ''
                        }`}
                      />

                      {/* Realistic artificial nail highlights */}
                      <div className="nail-specular-highlight opacity-60" />
                      <div className="nail-center-glow opacity-50" />

                      {/* Number badge on tip */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white/90 border border-[#CBD5E1] text-[#6D28D9] text-[10px] font-bold flex items-center justify-center shadow-xs">
                        0{index + 1}
                      </div>

                      {/* Hover action hint */}
                      <div className="absolute bottom-3 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#1E1B4B]/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold shadow-xs">
                          <Eye className="w-3 h-3 text-[#A78BFA]" /> Inspect
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Nail Label Underneath */}
                  <div className="mt-4 text-center">
                    <p
                      className={`font-serif text-sm sm:text-base font-bold uppercase tracking-wider transition-colors duration-300 ${
                        isSelected ? 'text-[#6D28D9]' : 'text-[#1E293B] group-hover:text-[#6D28D9]'
                      }`}
                    >
                      {design.name}
                    </p>
                    <p className="text-[10px] text-[#64748B] tracking-widest uppercase mt-0.5 font-medium">
                      {design.shape.split(' ')[0]}
                    </p>
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
                transition={{ duration: 0.4 }}
                className="mt-8 pt-8 border-t border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#FAF5FF] p-6 rounded-[28px_28px_16px_16px] border border-[#DDD6FE] shadow-sm"
              >
                <div className="max-w-2xl text-left">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-[0.2em]">
                      SELECTED NAIL ART:
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#1E1B4B] uppercase tracking-wide">
                      {focusedDesign.name}
                    </h3>
                    <span className="text-[10px] bg-white text-[#6D28D9] px-2.5 py-0.5 rounded-full border border-[#DDD6FE] uppercase tracking-widest font-bold shadow-xs">
                      {focusedDesign.finish}
                    </span>
                  </div>

                  {/* Color Palette Chips */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Artisan Palette:</span>
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

                  <p className="text-sm text-[#475569] leading-relaxed font-normal">
                    {focusedDesign.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => onSelectDesign(focusedDesign)}
                    className="flex-1 md:flex-initial px-5 py-3 rounded-full border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#6D28D9] hover:text-[#6D28D9] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Info className="w-3.5 h-3.5 text-[#6D28D9]" />
                    FULL SPECS
                  </button>

                  <button
                    onClick={() => onBookDesign(focusedDesign.name)}
                    className="flex-1 md:flex-initial px-6 py-3 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#C026D3] text-white text-xs font-bold tracking-widest uppercase shadow-[0_4px_16px_rgba(109,40,217,0.3)] hover:shadow-[0_6px_22px_rgba(109,40,217,0.4)] transition-all flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
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
