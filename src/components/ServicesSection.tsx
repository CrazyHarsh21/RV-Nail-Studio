import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Palette, Scissors, Crown, HeartHandshake, Clock, ArrowRight, Check } from 'lucide-react';
import { SERVICES } from '../data/nailData';

interface ServicesSectionProps {
  onBookService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookService }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Palette':
        return <Palette className="w-5 h-5" />;
      case 'Scissors':
        return <Scissors className="w-5 h-5" />;
      case 'Crown':
        return <Crown className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#E6F4ED] via-[#FDF6F0] to-[#FAECE1] overflow-hidden border-b border-[#FED7AA]">
      {/* Warm Apricot Ambient Backing */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[550px] h-[550px] bg-[#FFEDD5]/60 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FDBA74] bg-white/80 shadow-xs mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#C2410C]">
              ARTISAN NAIL SERVICES
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#431407] uppercase tracking-tight mb-4"
          >
            Nail Care, <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#B45309]">Your Way</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-[#57534E] font-normal tracking-wide max-w-2xl mx-auto"
          >
            From sculpted acrylic extensions and Russian cuticle manicures to bridal nail couture and doorstep home sessions, Rohit crafts each set with autoclave-grade hygiene.
          </motion.p>
        </div>

        {/* 5 Luxury Service Cards inspired by Nail Polish Bottles & Sculpted Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const isFullSpan = index === 3 || index === 4;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={`group relative flex flex-col justify-between p-8 bg-white/95 border border-[#FED7AA] hover:border-[#EA580C] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(234,88,12,0.12)] overflow-hidden rounded-[48px_48px_20px_20px] shadow-sm ${
                  isFullSpan && index === 3 ? 'lg:col-span-1' : ''
                }`}
              >
                {/* Polish bottle cap accent silhouette at top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-transparent via-[#EA580C] to-transparent opacity-60 group-hover:opacity-100 transition-all" />

                {/* Shimmer sweep effect */}
                <div className="gloss-overlay" />

                {/* Card Content Top */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    {/* Icon container */}
                    <div className="w-13 h-13 rounded-2xl bg-[#FFEDD5] border border-[#FDBA74] flex items-center justify-center text-[#C2410C] shadow-xs group-hover:scale-110 group-hover:bg-[#EA580C] group-hover:text-white transition-all duration-300">
                      {getIcon(service.icon)}
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-[#78716C] uppercase tracking-widest block font-semibold">
                        Duration
                      </span>
                      <span className="text-xs text-[#C2410C] font-bold flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-[#EA580C]" />
                        {service.duration}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] uppercase tracking-wide mb-2 group-hover:text-[#C2410C] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-[#78716C] font-medium mb-3 leading-relaxed">
                    {service.subtitle}
                  </p>

                  <p className="text-sm text-[#44403C] leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="space-y-2 mb-6 border-t border-[#F5EBE1] pt-4">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-[#292524] font-medium">
                        <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Bottom CTA */}
                <div className="pt-4 border-t border-[#F5EBE1] flex items-center justify-between mt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#78716C] uppercase tracking-widest font-semibold">
                      Starting From
                    </span>
                    <span className="font-serif text-xl font-bold text-[#B45309]">
                      {service.priceStart}
                    </span>
                  </div>

                  <button
                    onClick={() => onBookService(service.title)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF0E6] border border-[#FDBA74] text-[#7C2D12] text-xs font-bold tracking-wider uppercase hover:bg-gradient-to-r hover:from-[#C2410C] hover:to-[#EA580C] hover:text-white hover:border-transparent transition-all duration-300 shadow-xs"
                  >
                    <span>SELECT</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
