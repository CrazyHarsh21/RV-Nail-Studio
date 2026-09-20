import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, CheckCircle2, MessageCircle } from 'lucide-react';
import { ARTIST_IMAGE, ARTIST_CRAFTING_IMAGE, getWhatsAppUrl } from '../data/nailData';

interface ArtistSectionProps {
  onOpenBooking: () => void;
}

export const ArtistSection: React.FC<ArtistSectionProps> = ({ onOpenBooking }) => {
  const [activePhoto, setActivePhoto] = useState<'portrait' | 'crafting'>('portrait');

  return (
    <section id="artist" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#E3EFF7] via-[#FAF5EE] to-[#EDE0D0] overflow-hidden border-b border-[#D4AF37]/30">
      {/* Warm Caramel Ambient Backing */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FEF3C7]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#FFEDD5]/50 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Portrait & Action Shot in sculpted frame */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <div className="relative w-full max-w-md aspect-[3/4] group">
              {/* Warm gold halo glow */}
              <div className="absolute -inset-2 rounded-[60px_60px_20px_20px] bg-gradient-to-tr from-[#D4AF37]/40 via-[#F59E0B]/30 to-[#E8A598]/40 blur-lg opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Sculpted portrait container */}
              <div className="relative w-full h-full rounded-[56px_56px_18px_18px] overflow-hidden border-2 border-[#D4AF37]/70 bg-white shadow-[0_20px_50px_rgba(180,83,9,0.15)]">
                <img
                  src={activePhoto === 'portrait' ? ARTIST_IMAGE : ARTIST_CRAFTING_IMAGE}
                  alt="Rohit - Founder & Master Nail Artist at RV Nails Art"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/85 via-transparent to-transparent pointer-events-none" />
                <div className="gloss-overlay" />

                {/* Floating Experience Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E7DFD5] shadow-lg text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-serif text-lg font-bold text-[#1C1917] uppercase tracking-wide">
                        Rohit
                      </p>
                      <p className="text-xs text-[#B45309] tracking-widest uppercase font-bold">
                        Founder & Master Nail Artist
                      </p>
                    </div>
                    <span className="text-[10px] bg-[#25D366]/20 text-[#15803D] px-2.5 py-1 rounded-full font-bold tracking-wider">
                      Home Visits Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Pill Accent */}
              <div className="absolute -top-3 -right-3 px-3.5 py-1.5 rounded-full bg-white border border-[#D4AF37] shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider">
                  Master Sculptor
                </span>
              </div>
            </div>

            {/* Photo View Switcher */}
            <div className="flex items-center gap-2 mt-4 bg-white p-1.5 rounded-full border border-[#E7DFD5] shadow-xs">
              <button
                onClick={() => setActivePhoto('portrait')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all ${
                  activePhoto === 'portrait'
                    ? 'bg-gradient-to-r from-[#B45309] to-[#C2410C] text-white shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Studio Portrait
              </button>
              <button
                onClick={() => setActivePhoto('crafting')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all ${
                  activePhoto === 'crafting'
                    ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                In Action (Crafting)
              </button>
            </div>
          </motion.div>

          {/* Right Column: Artist Bio & Vision */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37] bg-white/80 shadow-xs mb-4 w-fit">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#B45309]">
                FOUNDER & MASTER NAIL ARTIST
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-[#1C1917] font-light uppercase tracking-tight mb-3 leading-tight">
              Meet <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D]">Rohit</span>
            </h2>

            {/* Signature quote */}
            <blockquote className="text-xl sm:text-2xl font-serif italic text-[#92400E] mb-6 border-l-2 border-[#D4AF37] pl-4 font-semibold">
              “Every client’s hand is a canvas for bespoke sculpted luxury.”
            </blockquote>

            {/* Artist credential tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="px-3.5 py-1 rounded-full bg-white border border-[#E7DFD5] text-xs text-[#292524] font-semibold tracking-wider shadow-2xs">
                Founder of RV Nails Art
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] font-semibold tracking-wider">
                Chrome & Gel Sculpting Specialist
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/40 text-xs text-[#15803D] font-bold tracking-wider">
                Doorstep Home Visits
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-normal mb-6">
              With an obsessive dedication to clean cuticle architecture, sculpted nail balance, and aesthetic color palettes, Rohit crafts each set as a customized luxury jewel. From subtle glazed chrome powders to intricate bridal art and 3D crystal embellishments, his focus is flawless aesthetics with lasting 4-week durability.
            </p>

            <div className="space-y-3 mb-8 text-xs sm:text-sm text-[#44403C] font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669] flex-shrink-0" />
                <span>Custom moodboard and aesthetic color matching for weddings & special occasions.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C2410C] flex-shrink-0" />
                <span>Mobile doorstep salon kit equipped with professional travel LED lighting & sterile pack.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <span>Gentle non-damaging removal and healthy natural nail plate preservation.</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-8 py-4 rounded-[28px_28px_14px_14px] bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white text-xs sm:text-sm font-bold tracking-[0.16em] uppercase shadow-[0_8px_25px_rgba(180,83,9,0.35)] hover:shadow-[0_12px_35px_rgba(194,65,12,0.45)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK APPOINTMENT</span>
              </button>

              <a
                href={getWhatsAppUrl("Hi Rohit, I would like to book a private consultation for nail art.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-[28px_28px_14px_14px] border border-[#25D366]/50 bg-[#25D366]/10 text-[#15803D] text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-[#25D366]/20 transition-all flex items-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                <span>CHAT WITH ROHIT</span>
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
