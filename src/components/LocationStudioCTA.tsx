import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MessageCircle, Phone, Sparkles, MapPin, Clock, Instagram, ExternalLink } from 'lucide-react';
import { BRAND_PHONE, BRAND_INSTAGRAM_URL, BRAND_ADDRESS, BRAND_MAPS_URL, getWhatsAppUrl } from '../data/nailData';

interface LocationStudioCTAProps {
  onOpenBooking: () => void;
}

export const LocationStudioCTA: React.FC<LocationStudioCTAProps> = ({ onOpenBooking }) => {
  return (
    <section id="studio" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#FCE7F3] via-[#FAF5F0] to-[#F5ECE4] overflow-hidden border-b border-[#E7DFD5]">
      {/* Soft warm ambient halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#FEF3C7]/40 via-[#FCE7F3]/40 to-[#E9D5FF]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/50 bg-white/80 shadow-xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#92400E]">
            YOUR PRIVATE NAIL SANCTUARY
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#1C1917] uppercase tracking-tight mb-4">
          Visit Our <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D]">Nail Art Studio</span>
        </h2>

        <p className="text-lg sm:text-xl font-serif italic text-[#B45309] mb-6 font-semibold">
          “Beauty begins at your fingertips, sculpted with bespoke artistry.”
        </p>

        <p className="text-xs sm:text-sm text-[#57534E] max-w-xl mx-auto font-normal leading-relaxed mb-8">
          Whether you visit our private studio lounge for an unhurried luxury nail art session or schedule Rohit to visit your doorstep, your satisfaction and hygiene are our supreme priority.
        </p>

        {/* Studio Address Banner */}
        <div className="max-w-2xl mx-auto mb-10 p-5 rounded-3xl bg-white/95 border border-[#E7DFD5] shadow-sm text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] block">
                Official Studio Location
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#1C1917] leading-relaxed">
                {BRAND_ADDRESS}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#78716C] mt-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Mon – Sun: 11:00 AM – 9:00 PM</span>
              </div>
            </div>
          </div>

          <a
            href={BRAND_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2.5 rounded-full bg-[#FAF5F0] hover:bg-[#F5ECE4] border border-[#E7DFD5] text-[#92400E] text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 shadow-2xs"
          >
            <span>Get Directions</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Contact Actions: Book + Call (icon with number) + WhatsApp icon only + Instagram icon only */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-xl mx-auto mb-10">
          {/* Primary: Book Appointment */}
          <button
            onClick={onOpenBooking}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs sm:text-sm tracking-[0.14em] uppercase shadow-[0_8px_25px_rgba(180,83,9,0.35)] hover:shadow-[0_12px_35px_rgba(194,65,12,0.45)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>BOOK APPOINTMENT</span>
          </button>

          {/* Tertiary: Call Now with phone number allowed to show */}
          <a
            href={`tel:${BRAND_PHONE}`}
            className="px-5 py-3.5 rounded-full border border-[#E7DFD5] bg-white text-[#1C1917] hover:text-[#B45309] hover:border-[#B45309] text-xs sm:text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
            title={`Call +91 ${BRAND_PHONE}`}
          >
            <Phone className="w-4 h-4 text-[#B45309]" />
            <span>Call: +91 {BRAND_PHONE}</span>
          </a>

          {/* WhatsApp: Icon only click */}
          <a
            href={getWhatsAppUrl("Hi Rohit, I would like to visit the studio and book an appointment.")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-[#25D366]/60 bg-[#25D366]/15 hover:bg-[#25D366]/30 text-[#15803D] flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xs"
            title="Chat on WhatsApp (+91 6397449307)"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5 fill-current text-[#25D366]" />
          </a>

          {/* Instagram: Icon only click */}
          <a
            href={BRAND_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-pink-400/50 bg-pink-500/10 hover:bg-pink-500/25 text-[#BE185D] hover:text-[#E11D48] flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xs"
            title="Follow on Instagram @rv.nails_studio"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>

        {/* Operating Hours & Location Summary */}
        <div className="pt-6 border-t border-[#E7DFD5] grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-xs text-[#78716C] font-semibold">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#EA580C]" />
            <span>Open Mon – Sun: 11:00 AM – 9:00 PM</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-[#0284C7]" />
            <span>Laxmi Nagar Studio & Doorstep Service</span>
          </div>
        </div>

      </div>
    </section>
  );
};
