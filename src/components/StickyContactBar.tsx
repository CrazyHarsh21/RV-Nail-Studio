import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { BRAND_PHONE, getWhatsAppUrl } from '../data/nailData';

interface StickyContactBarProps {
  onOpenBooking: () => void;
}

export const StickyContactBar: React.FC<StickyContactBarProps> = ({ onOpenBooking }) => {
  return (
    <aside
      aria-label="Quick contact links"
      className="fixed bottom-5 right-4 sm:right-6 z-40 flex items-center gap-2.5 p-1.5 rounded-full bg-[#121118]/90 border border-white/25 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(255,42,133,0.25)]"
    >
      {/* 📞 Call Button */}
      <a
        href={`tel:${BRAND_PHONE}`}
        className="w-11 h-11 rounded-full bg-[#1b1824] border border-white/15 hover:border-[#00D2FF] text-[#FAF7F2] hover:text-[#00D2FF] flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md group"
        title="Call 6397449307"
      >
        <Phone className="w-4 h-4 text-[#FAF7F2] group-hover:text-[#00D2FF]" />
      </a>

      {/* 💬 WhatsApp Button with subtle pulse glow */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-11 h-11 rounded-full bg-[#25D366] text-[#09090b] flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-[#25D366]/30 group"
        title="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/35 animate-ping pointer-events-none" />
        <MessageCircle className="w-5 h-5 fill-current" />
      </a>

      {/* 📅 Book Button */}
      <button
        onClick={onOpenBooking}
        className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#FF2A85] via-[#9333EA] to-[#06B6D4] text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-md hover:shadow-[0_0_20px_rgba(255,42,133,0.6)] transition-all hover:scale-105 active:scale-95"
      >
        <Calendar className="w-3.5 h-3.5 text-white" />
        <span>BOOK</span>
      </button>
    </aside>
  );
};
