import React from 'react';
import { Phone, MessageCircle, Calendar, Instagram } from 'lucide-react';
import { BRAND_PHONE, BRAND_INSTAGRAM_URL, getWhatsAppUrl } from '../data/nailData';

interface StickyContactBarProps {
  onOpenBooking: () => void;
}

export const StickyContactBar: React.FC<StickyContactBarProps> = ({ onOpenBooking }) => {
  return (
    <aside
      aria-label="Quick contact links"
      className="fixed bottom-5 right-4 sm:right-6 z-40 flex items-center gap-2 p-1.5 rounded-full bg-[#121118]/95 border border-white/20 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(180,83,9,0.25)]"
    >
      {/* 📞 Call Button with phone number allowed to show */}
      <a
        href={`tel:${BRAND_PHONE}`}
        className="px-3.5 h-10 rounded-full bg-[#1b1824] border border-white/15 hover:border-[#D4AF37] text-[#FAF7F2] hover:text-[#D4AF37] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md text-xs font-bold"
        title={`Call +91 ${BRAND_PHONE}`}
      >
        <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="tracking-wider">{BRAND_PHONE}</span>
      </a>

      {/* 💬 WhatsApp: Icon only click */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-10 h-10 rounded-full bg-[#25D366] text-[#09090b] flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-[#25D366]/30 shrink-0"
        title="Chat on WhatsApp"
        aria-label="WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/35 animate-ping pointer-events-none" />
        <MessageCircle className="w-5 h-5 fill-current" />
      </a>

      {/* 📷 Instagram: Icon only click */}
      <a
        href={BRAND_INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md shrink-0"
        title="Follow on Instagram @rv.nails_studio"
        aria-label="Instagram"
      >
        <Instagram className="w-4 h-4" />
      </a>

      {/* 📅 Book Button */}
      <button
        onClick={onOpenBooking}
        className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-md transition-all hover:scale-105 active:scale-95"
      >
        <Calendar className="w-3.5 h-3.5 text-white" />
        <span>BOOK</span>
      </button>
    </aside>
  );
};
