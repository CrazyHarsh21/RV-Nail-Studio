import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onComplete }) => {
  // Phase tracker:
  // 0: Initial dark spark & particles (0s - 1s)
  // 1: Nail contour outline drawing (1s - 2s)
  // 2: Base fill & botanical floral painting stroke-by-stroke (2s - 3.2s)
  // 3: Gloss cure, specular sweep & 3D tilt (3.2s - 4.2s)
  // 4: Logo reveal (RV Nails Art by Rohit) & Tagline line-by-line (4.2s - 5.2s)
  // 5: Final nail expansion & curtain transition (5.2s+)
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      onComplete();
      return;
    }

    // Phase schedule (smooth cinematic progression ~4.6s total)
    const timer1 = setTimeout(() => setPhase(1), 900);
    const timer2 = setTimeout(() => setPhase(2), 1900);
    const timer3 = setTimeout(() => setPhase(3), 3000);
    const timer4 = setTimeout(() => setPhase(4), 4000);
    const timer5 = setTimeout(() => {
      setPhase(5);
      setIsExiting(true);
    }, 5000);

    const timerComplete = setTimeout(() => {
      onComplete();
    }, 5800);

    // Smooth progress counter
    const startTime = Date.now();
    const duration = 5000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 40);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timerComplete);
      clearInterval(interval);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={isExiting ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070709] text-[#FAF7F2] overflow-hidden select-none"
      >
        {/* Subtle Luxury Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Central multi-color radial glow that breathes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{
              opacity: phase >= 1 ? [0.2, 0.35, 0.25] : 0.15,
              scale: phase >= 1 ? 1 : 0.4,
            }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,#FF2A85_0%,#9333EA_25%,#06B6D4_50%,transparent_70%)] blur-3xl pointer-events-none opacity-30"
          />

          {/* Soft multi-color depth tones */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF2A85]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#06B6D4]/15 blur-3xl" />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#070709_90%)]" />
        </div>

        {/* Floating golden micro dust particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${(i * 8 + 10) % 90}vw`,
                y: '105vh',
                opacity: 0,
                scale: 0.4 + (i % 3) * 0.3,
              }}
              animate={{
                y: '-10vh',
                opacity: [0, 0.6, 0.8, 0],
                x: `calc(${((i * 8 + 10) % 90)}vw + ${Math.sin(i) * 30}px)`,
              }}
              transition={{
                duration: 6 + (i % 4) * 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
              className="absolute w-1 h-1 rounded-full bg-[#E5C478] shadow-[0_0_8px_#E5C478]"
            />
          ))}
        </div>

        {/* Center Stage: The Hero Sculpted Nail Art & Brand Reveal */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-lg w-full px-6 min-h-[460px]">
          
          {/* Nail Tip Stage */}
          <motion.div
            animate={{
              y: phase >= 4 ? -28 : 0,
              scale: phase === 5 ? 1.15 : 1,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Initial glowing warm-gold center spark (0 - 1s) */}
            {phase === 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.8, 1], opacity: [0, 1, 0.9] }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute w-3 h-3 rounded-full bg-[#E5C478] shadow-[0_0_30px_10px_rgba(229,196,120,0.8)]"
              />
            )}

            {/* Realistic Artificial Nail Tip Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-[150px] sm:w-[175px] aspect-[1/2.05] perspective-1000"
            >
              {/* 3D Perspective Tilt on Phase 3 */}
              <motion.div
                animate={{
                  rotateY: phase >= 3 ? [-4, 4, 0] : 0,
                  rotateZ: phase >= 3 ? [-1.5, 1.5, 0] : 0,
                  scale: phase >= 3 ? 1.02 : 1,
                }}
                transition={{
                  duration: 2.2,
                  ease: 'easeInOut',
                }}
                className="relative w-full h-full rounded-[64px_64px_16px_16px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* SVG Nail Contour & Artistic Botanical Painting Canvas */}
                <svg
                  viewBox="0 0 160 320"
                  className="absolute inset-0 w-full h-full z-10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Nail Base Porcelain & Blush Gradient */}
                    <linearGradient id="nailBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FAF7F2" />
                      <stop offset="35%" stopColor="#F5EFE6" />
                      <stop offset="70%" stopColor="#EFE5DC" />
                      <stop offset="100%" stopColor="#E2D4C8" />
                    </linearGradient>

                    {/* Gold Leaf Accents */}
                    <linearGradient id="goldLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FAF3E0" />
                      <stop offset="50%" stopColor="#E5C478" />
                      <stop offset="100%" stopColor="#C6A052" />
                    </linearGradient>

                    {/* Emerald Botanical Foliage */}
                    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3E7B5C" />
                      <stop offset="100%" stopColor="#1E4733" />
                    </linearGradient>

                    {/* Soft Blush Heart/Petal Accent */}
                    <linearGradient id="blushPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F7D6D8" />
                      <stop offset="100%" stopColor="#EAAEB4" />
                    </linearGradient>
                  </defs>

                  {/* Nail Outer Silhouette Path (Almond Luxury Shape) */}
                  <clipPath id="nailClip">
                    <path d="M 80 4 C 130 4, 154 48, 154 130 C 154 210, 146 300, 136 316 C 132 319, 28 319, 24 316 C 14 300, 6 210, 6 130 C 6 48, 30 4, 80 4 Z" />
                  </clipPath>

                  {/* Group clipped inside the nail */}
                  <g clipPath="url(#nailClip)">
                    {/* 1. Base Porcelain Coat Filling In (Phase 2) */}
                    <motion.rect
                      x="0"
                      y="0"
                      width="160"
                      height="320"
                      fill="url(#nailBaseGrad)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: phase >= 2 ? 1 : 0 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />

                    {/* Subtle Milky Texture Wash */}
                    <motion.ellipse
                      cx="80"
                      cy="150"
                      rx="70"
                      ry="120"
                      fill="#FFFFFF"
                      opacity="0.25"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: phase >= 2 ? 0.25 : 0 }}
                      transition={{ duration: 1 }}
                    />

                    {/* 2. Hand-Painted Botanical Stem / Vine Stroke-by-Stroke */}
                    {phase >= 2 && (
                      <>
                        {/* Central curving vine stem */}
                        <motion.path
                          d="M 82 285 C 80 230, 92 180, 76 130 C 66 98, 78 60, 80 42"
                          stroke="url(#emeraldGrad)"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.9 }}
                          transition={{ duration: 1.1, delay: 0.1, ease: 'easeInOut' }}
                        />

                        {/* Secondary micro-branch lower */}
                        <motion.path
                          d="M 81 220 C 65 205, 52 212, 44 200"
                          stroke="url(#emeraldGrad)"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                        />

                        {/* Secondary micro-branch upper right */}
                        <motion.path
                          d="M 78 140 C 95 125, 115 132, 122 118"
                          stroke="url(#emeraldGrad)"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
                        />

                        {/* Delicate Hand-Painted Botanical Leaves */}
                        {/* Leaf 1 (Left Lower) */}
                        <motion.path
                          d="M 44 200 C 40 190, 52 186, 56 195 C 58 202, 48 206, 44 200 Z"
                          fill="url(#emeraldGrad)"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.95 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                        />

                        {/* Leaf 2 (Right Mid) */}
                        <motion.path
                          d="M 122 118 C 130 112, 124 98, 114 106 C 108 112, 116 122, 122 118 Z"
                          fill="url(#emeraldGrad)"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.95 }}
                          transition={{ duration: 0.5, delay: 0.95 }}
                        />

                        {/* Leaf 3 (Near Apex) */}
                        <motion.path
                          d="M 80 42 C 86 32, 94 38, 88 48 C 84 52, 78 48, 80 42 Z"
                          fill="url(#emeraldGrad)"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.95 }}
                          transition={{ duration: 0.4, delay: 1.1 }}
                        />

                        {/* Leaf 4 (Stem Center Left) */}
                        <motion.path
                          d="M 72 165 C 58 158, 62 144, 74 150 Z"
                          fill="url(#emeraldGrad)"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.85 }}
                        />

                        {/* 3. Delicate Hand-Painted Soft Blush Petals & Micro Hearts */}
                        <motion.path
                          d="M 85 105 C 80 98, 92 92, 96 100 C 100 92, 112 98, 107 105 C 101 113, 96 116, 96 116 C 96 116, 91 113, 85 105 Z"
                          fill="url(#blushPetalGrad)"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.9 }}
                          transition={{ duration: 0.6, delay: 1.15, ease: 'easeOut' }}
                        />

                        {/* 4. 24K Gold Foil Leaf Flakes & Gilded Details */}
                        <motion.circle
                          cx="94"
                          cy="158"
                          r="3"
                          fill="url(#goldLeafGrad)"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.4, 1] }}
                          transition={{ duration: 0.4, delay: 1.25 }}
                        />
                        <motion.circle
                          cx="68"
                          cy="118"
                          r="2.2"
                          fill="url(#goldLeafGrad)"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.3, 1] }}
                          transition={{ duration: 0.4, delay: 1.35 }}
                        />
                        <motion.polygon
                          points="78,72 82,75 80,78 76,76"
                          fill="url(#goldLeafGrad)"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4, delay: 1.4 }}
                        />
                        <motion.polygon
                          points="88,230 92,233 89,237 85,234"
                          fill="url(#goldLeafGrad)"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4, delay: 1.45 }}
                        />
                      </>
                    )}

                    {/* 5. Phase 3: Ultra-Glossy Topcoat & Crystalline Depth */}
                    {phase >= 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </g>

                  {/* 6. Gold Outline Drawing Contour (Phase 1 to completion) */}
                  <motion.path
                    d="M 80 4 C 130 4, 154 48, 154 130 C 154 210, 146 300, 136 316 C 132 319, 28 319, 24 316 C 14 300, 6 210, 6 130 C 6 48, 30 4, 80 4 Z"
                    stroke="url(#goldLeafGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: phase >= 1 ? 1 : 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                  />
                </svg>

                {/* Specular curved gloss line & light reflection (Phase 3+) */}
                {phase >= 3 && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -140 }}
                      animate={{ opacity: [0, 1, 0.8, 1], x: [ -140, 60, 200 ] }}
                      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-[-25deg] pointer-events-none"
                    />

                    {/* Realistic curved acrylic highlight refraction */}
                    <div className="nail-specular-highlight opacity-75" />
                    <div className="nail-center-glow opacity-80" />
                  </>
                )}

                {/* Soft natural drop shadow behind nail tip */}
                <div className="absolute inset-0 rounded-[64px_64px_16px_16px] shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] pointer-events-none" />
              </motion.div>

              {/* Sparkle badge at tip during cure */}
              {phase >= 3 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.9] }}
                  transition={{ duration: 0.6 }}
                  className="absolute -top-2 -right-2 text-[#E5C478] pointer-events-none"
                >
                  <Sparkles className="w-5 h-5 fill-[#E5C478]" />
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Logo Reveal & Tagline (Phase 4+) */}
          <div className="mt-8 text-center flex flex-col items-center">
            {phase >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                {/* RV Monogram with thin gold stroke drawing */}
                <div className="relative flex items-center justify-center w-12 h-12 mb-3">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="21"
                      fill="transparent"
                      stroke="#E5C478"
                      strokeWidth="1.5"
                      strokeDasharray="140"
                      initial={{ strokeDashoffset: 140 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="font-serif text-base font-bold text-[#E5C478] tracking-widest">
                    RV
                  </span>
                </div>

                {/* Brand Title */}
                <motion.h1
                  initial={{ opacity: 0, letterSpacing: '0.15em' }}
                  animate={{ opacity: 1, letterSpacing: '0.28em' }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="font-serif text-2xl sm:text-3xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FAF7F2] via-[#FF4E9B] to-[#00D2FF] tracking-[0.28em] leading-none"
                >
                  RV NAILS ART
                </motion.h1>

                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="text-[11px] text-[#00D2FF] tracking-[0.35em] uppercase font-medium mt-1"
                >
                  by Rohit
                </motion.span>

                {/* Tagline Line by Line */}
                <div className="mt-4 pt-3 border-t border-white/10 overflow-hidden flex flex-col items-center">
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="font-serif text-xs sm:text-sm tracking-[0.22em] text-[#FAF7F2]/90 uppercase font-light"
                  >
                    SPECTRUM OF BEAUTY.
                  </motion.p>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.65 }}
                    className="font-serif text-xs sm:text-sm tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-[#FF4E9B] via-[#06B6D4] to-[#FFD700] uppercase font-bold mt-0.5"
                  >
                    RAINBOW CONFIDENCE.
                  </motion.p>
                </div>
              </motion.div>
            )}
          </div>

        </div>

        {/* Bottom Minimal Loading Indicator */}
        <div className="absolute bottom-8 sm:bottom-12 inset-x-6 max-w-xs mx-auto text-center z-20">
          <div className="flex items-center justify-between text-[10px] text-[#FAF7F2]/60 uppercase tracking-[0.25em] mb-2 font-light">
            <span>LOADING EXPERIENCE</span>
            <span className="font-mono text-[#00D2FF]">{progress}%</span>
          </div>

          {/* Progress bar line */}
          <div className="relative w-full h-[2px] bg-[#1a1824] rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#FF2A85] via-[#9333EA] via-[#06B6D4] to-[#F59E0B] rounded-full shadow-[0_0_8px_#FF2A85]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="mt-4 text-[10px] text-[#FAF7F2]/40 hover:text-[#00D2FF] uppercase tracking-[0.25em] transition-colors py-1 px-3"
          >
            ENTER STUDIO →
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
