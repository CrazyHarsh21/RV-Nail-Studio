import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MessageCircle, Phone, Sparkles, MapPin, Clock } from 'lucide-react';
import { BRAND_PHONE, getWhatsAppUrl } from '../data/nailData';

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

        <p className="text-lg sm:text-xl font-serif italic text-[#B45309] mb-8 font-semibold">
          “Beauty begins at your fingertips, sculpted with bespoke artistry.”
        </p>

        <p className="text-xs sm:text-sm text-[#57534E] max-w-xl mx-auto font-normal leading-relaxed mb-10">
          Whether you visit our private studio lounge for an unhurried luxury manicure or schedule Rohit to visit your doorstep, your satisfaction and hygiene are our supreme priority.
        </p>

        {/* 3 Prominent CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-12">
          {/* Primary: Book Appointment */}
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-[28px_28px_14px_14px] bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs sm:text-sm tracking-[0.16em] uppercase shadow-[0_8px_25px_rgba(180,83,9,0.35)] hover:shadow-[0_12px_35px_rgba(194,65,12,0.45)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>BOOK APPOINTMENT</span>
          </button>

          {/* Secondary: WhatsApp Us */}
          <a
            href={getWhatsAppUrl("Hi Rohit, I would like to visit the studio and book an appointment.")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-4 rounded-[28px_28px_14px_14px] border border-[#25D366]/60 bg-[#25D366]/10 text-[#15803D] text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
            <span>WHATSAPP US</span>
          </a>

          {/* Tertiary: Call Now */}
          <a
            href={`tel:${BRAND_PHONE}`}
            className="w-full sm:w-auto px-7 py-4 rounded-[28px_28px_14px_14px] border border-[#E7DFD5] bg-white text-[#1C1917] hover:text-[#B45309] hover:border-[#B45309] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Phone className="w-4 h-4 text-[#B45309]" />
            <span>CALL NOW</span>
          </a>
        </div>

        {/* Operating Hours & Location Summary */}
        <div className="pt-8 border-t border-[#E7DFD5] grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-xs text-[#78716C] font-semibold">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#EA580C]" />
            <span>Open Mon – Sun: 11:00 AM – 9:00 PM</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-[#0284C7]" />
            <span>Studio Visits & City Doorstep Service</span>
          </div>
        </div>

      </div>
    </section>
  );
};
