import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, MessageCircle, Calendar, Check, Clock, ShieldCheck, Heart } from 'lucide-react';
import { NailDesign } from '../types';
import { getWhatsAppUrl } from '../data/nailData';

interface NailDetailModalProps {
  design: NailDesign | null;
  onClose: () => void;
  onBookDesign: (designName: string) => void;
}

export const NailDetailModal: React.FC<NailDetailModalProps> = ({
  design,
  onClose,
  onBookDesign,
}) => {
  if (!design) return null;

  const whatsappMessage = `Hi Rohit, I am interested in the ${design.name} nail design and would like to book an appointment.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Card with luxury curved nail top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-[#121118] border border-white/20 rounded-[48px_48px_24px_24px] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-8"
        >
          {/* Top rainbow hairline */}
          <div className="h-1.5 bg-gradient-to-r from-[#FF2A85] via-[#06B6D4] via-[#9333EA] to-[#F59E0B]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-[#09080e]/80 border border-white/20 text-[#FAF7F2] hover:text-[#FF4E9B] hover:border-[#FF2A85] flex items-center justify-center transition-all hover:scale-110"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Left: Realistic Magnified Nail Tip View */}
            <div className="md:col-span-6 relative bg-[#09080e] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
              {/* Radial ambient glow matching the design palette */}
              <div
                className="absolute inset-0 opacity-25 blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${design.palette[1] || '#FF2A85'} 0%, transparent 70%)`,
                }}
              />

              {/* Realistic Artificial Nail Tip Container */}
              <div className="relative w-full max-w-[240px] aspect-[1/1.6] rounded-[70px_70px_18px_18px] border-2 border-white/30 shadow-[0_15px_40px_rgba(255,42,133,0.3)] overflow-hidden group">
                <img
                  src={design.image}
                  alt={design.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {/* Constant specular glossy sweep reflection */}
                <div className="gloss-overlay animate-specular" />

                {/* Nail Surface Highlight Refraction */}
                <div className="nail-specular-highlight opacity-70" />
                <div className="nail-center-glow" />

                {/* Popular badge */}
                {design.popular && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF2A85] to-[#06B6D4] text-white text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    TRENDING SET
                  </div>
                )}
              </div>
            </div>

            {/* Right: Design Details & CTA */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#FF4E9B] to-[#00D2FF] tracking-[0.2em] uppercase mb-2 font-semibold">
                  <span>Rainbow Custom Nail Art</span>
                  <span>•</span>
                  <span>By Rohit</span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF7F2] tracking-tight uppercase mb-2">
                  {design.name}
                </h3>

                <p className="text-xs text-[#00D2FF] font-medium tracking-wider mb-4">
                  {design.subtitle}
                </p>

                <p className="text-sm text-[#FAF7F2]/80 leading-relaxed mb-6">
                  {design.description}
                </p>

                {/* Design Specifications Grid */}
                <div className="space-y-3 py-4 border-y border-white/10 mb-6 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#FAF7F2]/60 uppercase tracking-wider">Recommended Shape</span>
                    <span className="font-semibold text-[#FAF7F2]">{design.shape}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FAF7F2]/60 uppercase tracking-wider">Finish & Texture</span>
                    <span className="font-semibold text-[#00D2FF]">{design.finish}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FAF7F2]/60 uppercase tracking-wider">Wear Longevity</span>
                    <span className="font-semibold text-[#FF4E9B] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {design.wearDuration}
                    </span>
                  </div>

                  {/* Palette Swatches */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#FAF7F2]/60 uppercase tracking-wider">Color Spectrum</span>
                    <div className="flex items-center gap-1.5">
                      {design.palette.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {design.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-[#1c1926] border border-white/10 text-[10px] text-[#FAF7F2]/80 uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onBookDesign(design.name);
                  }}
                  className="w-full py-3.5 px-5 rounded-[24px_24px_12px_12px] bg-gradient-to-r from-[#FF2A85] via-[#9333EA] via-[#06B6D4] to-[#F59E0B] text-white font-bold text-xs tracking-[0.18em] uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(255,42,133,0.5)] transition-all hover:scale-[1.01] active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  BOOK AN APPOINTMENT
                </button>

                <a
                  href={getWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 rounded-[24px_24px_12px_12px] border border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366] font-semibold text-xs tracking-[0.16em] uppercase flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-all text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  WHATSAPP US
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
