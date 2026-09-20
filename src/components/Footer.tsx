import React from 'react';
import { Phone, MessageCircle, Instagram, Sparkles, Heart, ArrowUp } from 'lucide-react';
import { BRAND_PHONE, BRAND_INSTAGRAM, BRAND_INSTAGRAM_URL, getWhatsAppUrl } from '../data/nailData';

interface FooterProps {
  onOpenBooking: () => void;
  onReplayIntro?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onReplayIntro, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#181513] pt-16 pb-24 sm:pb-16 text-[#FAF7F2] overflow-hidden">
      {/* Warm gold hairline accent */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#B45309] via-[#D4AF37] via-[#C2410C] to-[#BE185D]" />

      {/* Ambient background glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-gradient-to-r from-[#B45309]/15 via-[#D4AF37]/15 to-[#BE185D]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10 items-start">
          
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#231F1C] border border-[#D4AF37]/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <span className="font-serif text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#D4AF37] to-[#F59E0B]">RV</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold uppercase tracking-widest leading-tight text-white">
                  RV NAILS ART
                </h3>
                <p className="text-xs text-[#D4AF37] tracking-[0.25em] uppercase font-semibold">
                  by Rohit
                </p>
              </div>
            </div>

            <p className="text-sm font-serif italic text-[#FDE68A] mb-3">
              Sculpted Luxury Nails • Bespoke Artistry • Doorstep Care
            </p>

            <p className="text-xs text-[#FAF7F2]/70 leading-relaxed max-w-sm mb-6 font-normal">
              Elevating personal expression with bespoke hand-sculpted nail artistry, chrome glaze overlays, hygienic gel extensions, and high-shine manicures. Studio appointments and doorstep home visits available.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="tracking-wider uppercase font-bold text-[11px]">
                Home Service Available
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF7F2]/75">
              <li>
                <a href="#nail-showcase" className="hover:text-[#FDE68A] transition-colors">
                  Signature Nail Showcase
                </a>
              </li>
              <li>
                <a href="#nail-carousel" className="hover:text-[#FDE68A] transition-colors">
                  Artisan Swatch Runway
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#FDE68A] transition-colors">
                  Services & Pricing Menu
                </a>
              </li>
              <li>
                <a href="#why-choose-us" className="hover:text-[#FDE68A] transition-colors">
                  Hygiene & Standards
                </a>
              </li>
              <li>
                <a href="#artist" className="hover:text-[#FDE68A] transition-colors">
                  Meet Rohit
                </a>
              </li>
              <li>
                <a href="#home-service" className="hover:text-[#FDE68A] transition-colors">
                  Doorstep Home Visits
                </a>
              </li>
              <li>
                <a href="#instagram" className="hover:text-[#FDE68A] transition-colors">
                  Instagram Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Connect & CTAs */}
          <div className="md:col-span-4 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
              Connect With Rohit
            </h4>
            
            <p className="text-xs text-[#FAF7F2]/70 mb-4 font-normal">
              Direct booking, custom nail art consultations, and doorstep reservations:
            </p>

            <div className="flex flex-col gap-2.5 mb-6">
              {/* WhatsApp button */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] text-xs font-bold tracking-wider flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp: +91 {BRAND_PHONE}</span>
              </a>

              {/* Call button */}
              <a
                href={`tel:${BRAND_PHONE}`}
                className="py-2.5 px-4 rounded-full border border-white/15 bg-[#231F1C] text-[#FAF7F2] text-xs font-bold tracking-wider flex items-center justify-center gap-2 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Call: {BRAND_PHONE}</span>
              </a>

              {/* Instagram button */}
              <a
                href={BRAND_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-full border border-white/15 bg-[#231F1C] text-[#FAF7F2] text-xs font-bold tracking-wider flex items-center justify-center gap-2 hover:border-[#BE185D] hover:text-[#BE185D] transition-all"
              >
                <Instagram className="w-4 h-4 text-[#BE185D]" />
                <span>Instagram: @{BRAND_INSTAGRAM}</span>
              </a>
            </div>

            <button
              onClick={onOpenBooking}
              className="py-3.5 px-5 rounded-full bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs tracking-widest uppercase shadow-[0_4px_16px_rgba(180,83,9,0.3)] hover:shadow-[0_6px_22px_rgba(180,83,9,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              BOOK AN APPOINTMENT
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/60 font-medium">
          <p>© {new Date().getFullYear()} RV Nails Art by Rohit. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#FAF7F2]">Instagram @{BRAND_INSTAGRAM}</span>
            <span>•</span>
            <span className="hover:text-[#FAF7F2]">Phone: {BRAND_PHONE}</span>
            {onReplayIntro && (
              <>
                <span>•</span>
                <button
                  onClick={onReplayIntro}
                  className="hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Replay Intro</span>
                </button>
              </>
            )}
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#D4AF37] text-stone-500 hover:text-stone-300 transition-colors"
                  title="Salon Staff Portal"
                >
                  Salon Staff
                </button>
              </>
            )}
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
