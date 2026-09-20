import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Gem, Smile, HeartHandshake } from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/nailData';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Gem':
        return <Gem className="w-6 h-6" />;
      case 'Smile':
        return <Smile className="w-6 h-6" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6" />;
      default:
        return <ShieldCheck className="w-6 h-6" />;
    }
  };

  return (
    <section id="why-choose-us" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#FAECE1] via-[#F0F6FA] to-[#E3EFF7] overflow-hidden border-b border-[#BAE6FD]">
      {/* Soft Powder Blue Ambient Backing */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#E0F2FE]/60 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#BAE6FD] bg-white/80 shadow-xs mb-4"
          >
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#0369A1]">
              STANDARDS OF CRAFTSMANSHIP
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#0C4A6E] uppercase tracking-tight mb-4"
          >
            Why Choose <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#1D4ED8]">RV Nails Art</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-[#475569] font-normal tracking-wide max-w-2xl mx-auto"
          >
            Master artist Rohit blends high-precision sculpting, premium international gel products, and hospital-grade autoclave sterilization for flawless results.
          </motion.p>
        </div>

        {/* 4 Points Grid with sequential viewport animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {WHY_CHOOSE_US.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="relative p-8 rounded-[40px_40px_16px_16px] bg-white/95 border border-[#BAE6FD] hover:border-[#0284C7] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(2,132,199,0.12)] group overflow-hidden shadow-xs text-left"
            >
              {/* Shimmer sweep */}
              <div className="gloss-overlay" />

              {/* Icon marker */}
              <div className="w-14 h-14 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7] mb-6 group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all duration-300 shadow-xs">
                {getIcon(item.icon)}
              </div>

              <span className="text-[10px] text-[#0369A1] font-bold tracking-[0.25em] uppercase mb-1 block">
                0{index + 1} • PILLAR
              </span>

              <h3 className="font-serif text-xl font-bold text-[#0F172A] uppercase tracking-wide mb-2 group-hover:text-[#0284C7] transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-[#0284C7] font-semibold mb-3">
                {item.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
