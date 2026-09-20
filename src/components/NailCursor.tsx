import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const NailCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Buttery-smooth spring settings
  const springConfig = { damping: 30, stiffness: 450, mass: 0.35 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch / coarse pointer
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, select, textarea, [role="button"], label, .interactive-nail');
        setIsHovering(!!interactive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Prismatic trailing rainbow micro-glow */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <motion.div
          animate={{
            scale: isHovering ? 1.8 : isClicking ? 0.9 : 1,
            opacity: isHovering ? 0.6 : 0.35,
          }}
          transition={{ duration: 0.15 }}
          className="w-5 h-5 rounded-full bg-[radial-gradient(circle,#FF3366_0%,#3399FF_50%,#FFFF33_80%,transparent_100%)] blur-[3px]"
        />
      </motion.div>

      {/* Main Mini Sculpted Nail-Tip Cursor (Delicate & Compact) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="absolute top-0 left-0 -translate-x-1.5 -translate-y-0.5 pointer-events-none"
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.85 : isHovering ? 1.15 : 1,
            rotate: isHovering ? -12 : -6,
          }}
          transition={{ type: 'spring', damping: 24, stiffness: 480 }}
          className="relative w-3.5 h-6 origin-top-center"
        >
          {/* SVG Sculpted Mini Almond Nail Tip with Rainbow Chrome */}
          <svg
            viewBox="0 0 28 54"
            className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,51,102,0.4)] filter"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Vibrant Multi-Color Rainbow Chrome Gradient */}
              <linearGradient id="cursorRainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF3366" />
                <stop offset="20%" stopColor="#FF9933" />
                <stop offset="40%" stopColor="#FFFF33" />
                <stop offset="60%" stopColor="#33CC66" />
                <stop offset="80%" stopColor="#3399FF" />
                <stop offset="100%" stopColor="#9933FF" />
              </linearGradient>

              {/* Iridescent Silver Chrome Tip Contour */}
              <linearGradient id="cursorChromeTip" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </defs>

            {/* Nail Tip Body with Rainbow Glaze */}
            <path
              d="M 14 2 C 22 2, 26 12, 26 28 C 26 44, 23 52, 21 53 C 20 54, 8 54, 7 53 C 5 52, 2 44, 2 28 C 2 12, 6 2, 14 2 Z"
              fill="url(#cursorRainbowGrad)"
              stroke="url(#cursorChromeTip)"
              strokeWidth="1.4"
            />

            {/* French Tip Prismatic Metallic Curve */}
            <path
              d="M 6 10 C 10 4, 18 4, 22 10 C 24 5, 20 2, 14 2 C 8 2, 4 5, 6 10 Z"
              fill="url(#cursorChromeTip)"
              opacity="0.9"
            />

            {/* Specular Curved Gloss Line */}
            <path
              d="M 6 16 C 6 24, 7 36, 9 44"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Micro Cuticle Band */}
            <path
              d="M 7 51 C 11 50, 17 50, 21 51"
              stroke="url(#cursorChromeTip)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>

          {/* Precision Micro Apex Dot with Rainbow Shimmer */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_#00FFFF]" />
        </motion.div>
      </motion.div>
    </div>
  );
};
