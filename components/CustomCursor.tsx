'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop / devices with fine pointer
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsVisible(true);
    } else {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if target is clickable
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, select, textarea, [data-cursor-hover]');
        if (interactive) {
          setIsPointer(true);
          const customText = interactive.getAttribute('data-cursor-text');
          if (customText) {
            setHoverText(customText);
            setIsHovered(true);
          } else {
            setHoverText('');
            setIsHovered(false);
          }
        } else {
          setIsPointer(false);
          setIsHovered(false);
          setHoverText('');
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer subtle ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-gold/40 mix-blend-difference flex items-center justify-center font-display text-[9px] uppercase tracking-widest text-gold font-bold"
        animate={{
          x: pos.x - (isHovered ? 38 : isPointer ? 24 : 16),
          y: pos.y - (isHovered ? 38 : isPointer ? 24 : 16),
          width: isHovered ? 76 : isPointer ? 48 : 32,
          height: isHovered ? 76 : isPointer ? 48 : 32,
          backgroundColor: isHovered ? 'rgba(212, 175, 102, 0.15)' : 'rgba(212, 175, 102, 0.02)',
          borderColor: isHovered ? '#D4AF66' : isPointer ? '#FDB913' : 'rgba(212, 175, 102, 0.4)',
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 350, mass: 0.5 }}
      >
        {hoverText && (
          <span className="text-[10px] text-white tracking-widest px-1 font-bold">
            {hoverText}
          </span>
        )}
      </motion.div>

      {/* Center sharp dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] w-1.5 h-1.5 rounded-full bg-gold"
        animate={{
          x: pos.x - 3,
          y: pos.y - 3,
          scale: isHovered ? 0 : isPointer ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 600 }}
      />
    </>
  );
}
