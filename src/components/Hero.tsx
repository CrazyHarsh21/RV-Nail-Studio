import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageCircle, Calendar, ArrowUpRight, Award, ShieldCheck, Home } from 'lucide-react';
import { HERO_IMAGE, ARTIST_IMAGE, getWhatsAppUrl } from '../data/nailData';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF3ED] to-[#F5ECE4] pt-20 sm:pt-22 lg:pt-24 pb-12 lg:pb-16 border-b border-[#EAE0D5]">
      {/* Subtle Aesthetic Soft Cashmere Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#FED7AA]/25 via-[#FDE2E4]/30 to-[#E9D5FF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-10 w-[450px] h-[450px] bg-[#FEF3C7]/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center pt-2 pb-6">
          
          {/* Left Column: Monogram, Headlines & Real Nail Studio Content */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Top Badge Row */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 flex-wrap">
              {/* RV Luxury Monogram */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-center w-12 h-12"
              >
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center border-2 border-[#D4AF37] shadow-[0_4px_15px_rgba(212,175,55,0.25)]">
                  <span className="font-serif text-lg font-bold text-[#B45309] tracking-widest">
                    RV
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 text-[#D97706]">
                  <Sparkles className="w-full h-full fill-[#D97706]" />
                </div>
              </motion.div>

              {/* Doorstep Home Service Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#25D366]/10 shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
                </span>
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-[#15803D]">
                  DOORSTEP HOME SERVICE & STUDIO
                </span>
              </motion.div>
            </div>

            {/* Main Headlines - Authentic to RV Nails Art by Rohit */}
            <div className="overflow-hidden mb-2">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-xs sm:text-sm font-bold tracking-[0.28em] uppercase text-[#B45309] mb-2 flex items-center gap-2"
              >
                <span>✦ BESPOKE NAIL ARTISTRY & SCULPTING ✦</span>
              </motion.p>
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl xl:text-7xl font-serif font-light tracking-tight text-[#1C1917] uppercase leading-[1.08]"
              >
                Sculpted Nails.
              </motion.h1>
            </div>

            <div className="overflow-hidden mb-5">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl xl:text-7xl font-serif font-bold tracking-tight uppercase leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D]"
              >
                Aesthetic Perfection.
              </motion.h1>
            </div>

            {/* Subheadline describing the real craft */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-sm sm:text-base md:text-lg text-[#57534E] font-light leading-relaxed mb-6 max-w-xl"
            >
              Handcrafted acrylic extensions, liquid chrome glazing, bespoke 3D nail art, and bridal nail couture customized to your style by master nail artist <span className="font-serif italic font-bold text-[#92400E]">Rohit</span>.
            </motion.p>

            {/* Aesthetic Finish Chips */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center gap-2 mb-8 flex-wrap"
            >
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider mr-1">
                Signature Finishes:
              </span>
              {[
                { name: 'Opal Chrome', color: '#E8A598' },
                { name: 'Russian Gel', color: '#D4AF37' },
                { name: 'Ombre Aura', color: '#A78BFA' },
                { name: 'Bridal Crystal', color: '#6EE7B7' },
              ].map((f, fi) => (
                <div
                  key={fi}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E7DFD5] shadow-xs"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white"
                    style={{ backgroundColor: f.color }}
                  />
                  <span className="text-[11px] text-[#292524] font-semibold">{f.name}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10"
            >
              {/* Primary CTA */}
              <button
                onClick={onOpenBooking}
                className="relative group overflow-hidden px-8 py-4 rounded-[28px_28px_14px_14px] bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs sm:text-sm tracking-[0.16em] uppercase shadow-[0_8px_25px_rgba(180,83,9,0.35)] hover:shadow-[0_12px_35px_rgba(194,65,12,0.45)] transition-all duration-300 hover:scale-[1.02] active:scale-95 text-center flex items-center justify-center gap-2.5"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>BOOK APPOINTMENT</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 pointer-events-none" />
              </button>

              {/* Secondary CTA: WhatsApp Rohit */}
              <a
                href={getWhatsAppUrl("Hi Rohit, I would like to book a luxury nail appointment with RV Nails Art.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-[28px_28px_14px_14px] border border-[#25D366]/60 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#15803D] text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-95 text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                <span>WHATSAPP ROHIT</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#16A34A]" />
              </a>
            </motion.div>

            {/* Quick Credibility Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E7DFD5] max-w-lg"
            >
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#B45309]">500+</p>
                <p className="text-[11px] text-[#78716C] uppercase tracking-wider font-semibold">Sets Sculpted</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#B45309]">100%</p>
                <p className="text-[11px] text-[#78716C] uppercase tracking-wider font-semibold">Autoclave Sterilized</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#B45309]">4.9★</p>
                <p className="text-[11px] text-[#78716C] uppercase tracking-wider font-semibold">Client Love</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Aesthetic Editorial Nail Art Photo with Artist Rohit Capsule */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md aspect-[3/4] group"
            >
              {/* Outer Warm Rose Gold & Amber Glow */}
              <div className="absolute -inset-2.5 rounded-[64px_64px_24px_24px] bg-gradient-to-tr from-[#E8A598]/40 via-[#D4AF37]/30 to-[#F472B6]/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Sculpted Nail-Tip Container with Editorial Photo */}
              <div className="relative w-full h-full rounded-[60px_60px_20px_20px] overflow-hidden border-2 border-[#E7DFD5] bg-white shadow-[0_20px_50px_rgba(40,25,10,0.12)]">
                <img
                  src={HERO_IMAGE}
                  alt="RV Nails Art by Rohit - Editorial Bespoke Nail Sculpting"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Subtle soft vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-transparent to-black/10 pointer-events-none" />

                {/* Specular light sweep */}
                <div className="gloss-overlay" />
                <div className="nail-specular-highlight opacity-70" />

                {/* Floating Bottom Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E7DFD5] shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B45309] to-[#C2410C] flex items-center justify-center text-white shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-serif font-bold text-[#1C1917] tracking-wider uppercase">
                        RV Nails Art Studio
                      </p>
                      <p className="text-[10px] text-[#92400E] tracking-wider uppercase font-semibold">
                        By Rohit • Doorstep Available
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-[#25D366]/20 text-[#15803D] px-2.5 py-1 rounded-full font-bold tracking-wider">
                      Open Today
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Capsule Badge with Owner Rohit's Portrait */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -top-4 -left-6 pl-2 pr-4 py-2 rounded-full bg-white border border-[#E7DFD5] shadow-xl backdrop-blur-lg items-center gap-2.5"
              >
                <img
                  src={ARTIST_IMAGE}
                  alt="Rohit - Founder & Master Artist"
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover object-top border-2 border-[#D4AF37]"
                />
                <div className="text-left">
                  <p className="text-xs text-[#1C1917] font-bold tracking-wide">
                    Rohit
                  </p>
                  <p className="text-[9px] text-[#B45309] tracking-wider uppercase font-bold">
                    Master Nail Artist
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
