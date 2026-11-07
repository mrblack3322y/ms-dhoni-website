'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// 1. Split Text Character / Word Stagger Reveal
export function SplitTextReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap gap-x-2 overflow-hidden ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-1">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0, rotate: 2 }}
            animate={isInView ? { y: '0%', opacity: 1, rotate: 0 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

// 2. 3D Perspective Tilt Card with Specular Shine
export function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 9;
    const rotY = ((x - centerX) / centerX) * 9;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Dynamic Specular Glare Overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  );
}

// 3. Anamorphic Golden Laser Divider Between Sections
export function AnamorphicDivider({ color = '#D4AF66' }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <div ref={ref} className="relative w-full py-12 flex items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* Central Expanding Laser Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
        }}
      />

      {/* Center Bright Spark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: [0, 1.8, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute w-3 h-3 rounded-full blur-[1px]"
        style={{ backgroundColor: color, boxShadow: `0 0 20px 4px ${color}` }}
      />
    </div>
  );
}
