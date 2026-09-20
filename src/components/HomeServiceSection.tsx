import React from 'react';
import { Home, ShieldCheck, Clock, MapPin, ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/nailData';

interface HomeServiceSectionProps {
  onBookHomeService: () => void;
}

export const HomeServiceSection: React.FC<HomeServiceSectionProps> = ({ onBookHomeService }) => {
  return (
    <section id="home-service" className="relative py-12 sm:py-16 bg-gradient-to-b from-[#EDE0D0] via-[#F0F7F4] to-[#E2F2E9] overflow-hidden border-b border-[#6EE7B7]">
      {/* Soft Mint Ambient Backing */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#D1FAE5]/60 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="relative rounded-[56px_56px_28px_28px] border-2 border-[#A7F3D0] bg-white/95 p-8 sm:p-14 lg:p-16 overflow-hidden shadow-[0_25px_60px_rgba(5,150,105,0.08)]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Messaging */}
            <div className="lg:col-span-8 text-left">
              
              {/* Badge: HOME SERVICE AVAILABLE */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#25D366]/10 mb-6 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
                </span>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#15803D]">
                  DOORSTEP HOME SERVICE AVAILABLE
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold tracking-[0.28em] uppercase text-[#047857] mb-2">
                Can't Visit the Studio?
              </p>

              <h2 className="text-4xl sm:text-6xl font-serif font-light text-[#064E3B] uppercase tracking-tight mb-4 leading-tight">
                We Can <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#047857] via-[#059669] to-[#0284C7]">Come To You.</span>
              </h2>

              <p className="text-lg sm:text-xl text-[#0F172A] font-medium mb-4">
                Professional bespoke luxury nail artistry right at your doorstep.
              </p>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal mb-8 max-w-2xl">
                Experience full salon luxury in the comfort and privacy of your home. Rohit travels with a mobile workstation complete with surgical autoclave sterilized instruments, premium LED UV curing stations, and over 100+ swatch shades.
              </p>

              {/* 3 Key Home Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-[#059669] mb-2" />
                  <p className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                    Full Sanitization
                  </p>
                  <p className="text-[11px] text-[#475569] mt-1 font-normal">
                    Freshly sealed disposable kits opened in front of you.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] shadow-2xs">
                  <Clock className="w-5 h-5 text-[#0284C7] mb-2" />
                  <p className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                    Flexible Timing
                  </p>
                  <p className="text-[11px] text-[#475569] mt-1 font-normal">
                    Slots from 11:00 AM to 9:00 PM tailored to your schedule.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] shadow-2xs">
                  <MapPin className="w-5 h-5 text-[#D97706] mb-2" />
                  <p className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                    Zero Travel Stress
                  </p>
                  <p className="text-[11px] text-[#475569] mt-1 font-normal">
                    Sit back on your sofa while Rohit sculpts your bespoke set.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={onBookHomeService}
                  className="px-8 py-4 rounded-[28px_28px_14px_14px] bg-gradient-to-r from-[#047857] via-[#059669] to-[#0284C7] text-white text-xs sm:text-sm font-bold tracking-[0.18em] uppercase shadow-[0_10px_25px_rgba(5,150,105,0.3)] hover:shadow-[0_15px_35px_rgba(5,150,105,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>BOOK HOME SERVICE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={getWhatsAppUrl("Hi Rohit, I would like to inquire about Home Service nail booking at my location.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-[28px_28px_14px_14px] border border-[#25D366]/60 bg-[#25D366]/10 text-[#15803D] text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-[#25D366]/20 transition-all text-center flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                  <span>ASK VIA WHATSAPP</span>
                </a>
              </div>

            </div>

            {/* Right Column: Visual Graphic Badge */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-[#059669]/40 flex items-center justify-center p-6 bg-[#F0FDF4] shadow-lg">
                <div className="w-full h-full rounded-full bg-white border border-[#A7F3D0] flex flex-col items-center justify-center text-center p-6 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#059669] to-[#0284C7] flex items-center justify-center text-white mb-3 shadow-md">
                    <Home className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] text-[#047857] font-bold tracking-[0.25em] uppercase">
                    SALON GLAMOUR AT YOUR HOME
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#064E3B] uppercase mt-1">
                    Doorstep Service
                  </span>
                  <span className="text-[11px] text-[#475569] mt-1 font-medium">
                    Available across the city
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
