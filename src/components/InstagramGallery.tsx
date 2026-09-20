import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { INSTAGRAM_POSTS, BRAND_INSTAGRAM, BRAND_INSTAGRAM_URL } from '../data/nailData';

export const InstagramGallery: React.FC = () => {
  return (
    <section id="instagram" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#E2F2E9] via-[#FAF5F7] to-[#FCE7F3] overflow-hidden border-b border-[#FBCFE8]">
      {/* Soft Rose Quartz Ambient Backing */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#FCE7F3]/70 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F472B6]/40 bg-white/80 shadow-xs mb-4"
          >
            <Instagram className="w-3.5 h-3.5 text-[#DB2777]" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#BE185D]">
              @{BRAND_INSTAGRAM}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#831843] uppercase tracking-tight mb-4"
          >
            Follow The <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#DB2777] via-[#9333EA] to-[#BE185D]">Artisan Gallery</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-[#4B5563] font-normal tracking-wide max-w-2xl mx-auto mb-8"
          >
            Catch daily behind-the-scenes sets, fresh chrome glaze swatches, and client nail transformations crafted by Rohit.
          </motion.p>

          <motion.a
            href={BRAND_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] via-[#DB2777] to-[#7C3AED] text-white text-xs font-bold tracking-[0.16em] uppercase shadow-[0_6px_20px_rgba(219,39,119,0.3)] hover:shadow-[0_10px_28px_rgba(219,39,119,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            <Instagram className="w-4 h-4" />
            <span>FOLLOW @{BRAND_INSTAGRAM}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>

        {/* Curved Nail-Tip Shaped Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <motion.a
              key={post.id}
              href={BRAND_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative aspect-[3/4.2] rounded-[48px_48px_14px_14px] overflow-hidden border-2 border-white bg-white hover:border-[#DB2777] transition-all duration-500 hover:shadow-[0_15px_30px_rgba(219,39,119,0.2)] block shadow-sm"
            >
              {/* Image with zoom on hover */}
              <img
                src={post.image}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-110"
              />

              {/* Glossy specular sweep */}
              <div className="gloss-overlay" />
              <div className="nail-specular-highlight opacity-50" />

              {/* Hover Overlay with Instagram Icon & stats */}
              <div className="absolute inset-0 bg-[#831843]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                <div className="w-10 h-10 rounded-full bg-white text-[#BE185D] flex items-center justify-center mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-lg">
                  <Instagram className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-3 text-white text-xs font-bold mb-2">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-300" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 fill-current text-white" />
                    {post.comments}
                  </span>
                </div>

                <p className="text-[10px] text-white/95 line-clamp-2 px-2 font-medium">
                  {post.caption}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
};
