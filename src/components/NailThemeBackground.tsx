import React from 'react';
import { motion } from 'motion/react';

export const NailThemeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Canvas: Warm aesthetic ivory & pearl cashmere */}
      <div className="absolute inset-0 bg-[#FAF8F5]" />

      {/* 2. Soft Floating Aesthetic Pastel Auroras (Multi-Color Moods) */}
      <motion.div
        animate={{
          x: [-20, 30, -20],
          y: [-15, 25, -15],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.14)_0%,rgba(216,180,254,0.10)_40%,transparent_70%)] blur-[90px]"
      />

      <motion.div
        animate={{
          x: [30, -30, 30],
          y: [20, -25, 20],
          scale: [1.05, 0.95, 1.05],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -right-40 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(167,243,208,0.18)_0%,rgba(186,230,253,0.12)_45%,transparent_70%)] blur-[100px]"
      />

      <motion.div
        animate={{
          x: [-30, 25, -30],
          y: [25, -15, 25],
          scale: [0.95, 1.1, 0.95],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-2/3 -left-32 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle_at_center,rgba(254,215,170,0.20)_0%,rgba(253,164,175,0.12)_45%,transparent_70%)] blur-[95px]"
      />

      <motion.div
        animate={{
          x: [15, -25, 15],
          y: [-25, 25, -25],
          scale: [1, 1.12, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(199,210,254,0.18)_0%,rgba(254,205,211,0.14)_45%,transparent_70%)] blur-[100px]"
      />

      {/* 3. Aesthetic Nail Art Vector Pattern - Clearly visible, elegant and stylish */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.14]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="aestheticNailArtPattern"
            width="140"
            height="140"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(12)"
          >
            {/* 1. Sculpted Almond Nail Tip Silhouette */}
            <path
              d="M 28 14 C 40 14, 46 28, 46 50 C 46 68, 42 80, 39 82 C 37 83, 19 83, 17 82 C 14 80, 10 68, 10 50 C 10 28, 16 14, 28 14 Z"
              fill="none"
              stroke="#B45309"
              strokeWidth="1.4"
            />
            {/* French smile curve */}
            <path
              d="M 15 30 C 21 22, 33 22, 39 30"
              fill="none"
              stroke="#EC4899"
              strokeWidth="1.2"
            />
            {/* Nail cuticle lunula moon */}
            <path
              d="M 20 75 C 24 71, 32 71, 36 75"
              fill="none"
              stroke="#D97706"
              strokeWidth="1"
            />

            {/* 2. Sculpted Coffin / Stiletto Tip */}
            <path
              d="M 100 85 L 115 125 L 85 125 Z"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="1.3"
            />
            <line x1="100" y1="85" x2="100" y2="125" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="2,2" />

            {/* 3. Luxury Nail Polish Bottle Silhouette */}
            <rect x="90" y="20" width="22" height="26" rx="4" fill="none" stroke="#D97706" strokeWidth="1.3" />
            <rect x="97" y="10" width="8" height="10" rx="1.5" fill="none" stroke="#B45309" strokeWidth="1.3" />
            <line x1="101" y1="20" x2="101" y2="34" stroke="#D97706" strokeWidth="1" />
            {/* Lacquer liquid wavy level */}
            <path d="M 92 36 Q 101 42 110 36" fill="none" stroke="#DB2777" strokeWidth="1.2" />

            {/* 4. Fine Detail Nail Art Brush with Drip Drop */}
            <line x1="18" y1="105" x2="52" y2="128" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 52 128 Q 58 133 63 135" fill="none" stroke="#EC4899" strokeWidth="1.6" strokeLinecap="round" />
            {/* Wet droplet */}
            <circle cx="68" cy="138" r="2.2" fill="#EC4899" />

            {/* 5. Faceted Gem / Starlight Sparkle */}
            <path
              d="M 125 65 L 128 72 L 135 75 L 128 78 L 125 85 L 122 78 L 115 75 L 122 72 Z"
              fill="#D97706"
              opacity="0.8"
            />

            {/* 6. Mini Sparkle Star */}
            <path
              d="M 58 45 L 60 50 L 65 52 L 60 54 L 58 59 L 56 54 L 51 52 L 56 50 Z"
              fill="#EC4899"
              opacity="0.75"
            />

            {/* 7. Cute Heart motif for nail accents */}
            <path
              d="M 24 135 A 2.5 2.5 0 0 0 20 132 A 2.5 2.5 0 0 0 16 135 Q 16 138 20 142 Q 24 138 24 135 Z"
              fill="#F43F5E"
              opacity="0.5"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#aestheticNailArtPattern)" />
      </svg>

      {/* 4. Delicate Aesthetic Sparkles */}
      <div className="absolute inset-0">
        {[
          { top: '15%', left: '12%', color: '#D97706', delay: 0, size: 10 },
          { top: '24%', left: '86%', color: '#EC4899', delay: 1.2, size: 9 },
          { top: '48%', left: '8%', color: '#8B5CF6', delay: 2.5, size: 11 },
          { top: '62%', left: '90%', color: '#059669', delay: 0.8, size: 8 },
          { top: '75%', left: '18%', color: '#EA580C', delay: 1.8, size: 10 },
          { top: '85%', left: '78%', color: '#DB2777', delay: 2.1, size: 9 },
          { top: '38%', left: '52%', color: '#0284C7', delay: 3.0, size: 8 },
        ].map((sparkle, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: sparkle.top,
              left: sparkle.left,
              width: sparkle.size,
              height: sparkle.size,
            }}
            animate={{
              scale: [0.7, 1.25, 0.7],
              opacity: [0.35, 0.9, 0.35],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: sparkle.delay,
              ease: 'easeInOut',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(217,119,6,0.3)]">
              <path
                d="M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z"
                fill={sparkle.color}
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
