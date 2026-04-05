"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Seeded random for SSR stability
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── 3D CSS Cube ─── */
function Cube3D({ size = 40, color = 'rgba(99,102,241,0.25)', x, y, duration, delay, rotateDir }) {
  const face = {
    position: 'absolute', width: size, height: size,
    border: `1px solid ${color.replace(/[\d.]+\)$/, '0.5)')}`,
    boxSizing: 'border-box',
  };
  const h2 = size / 2;

  return (
    <motion.div
      style={{
        position: 'fixed', left: x, top: y,
        width: size, height: size,
        pointerEvents: 'none', zIndex: 0,
        perspective: '400px',
      }}
      animate={{ opacity: [0, 1, 1, 0], y: [0, -500], x: [0, rotateDir * 40] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.9, 1] }}
    >
      <motion.div
        style={{ width: size, height: size, position: 'relative', transformStyle: 'preserve-3d' }}
        animate={{ rotateX: [0, 360], rotateY: [0, rotateDir > 0 ? 360 : -360] }}
        transition={{ duration: duration * 0.7, delay, repeat: Infinity, ease: 'linear' }}
      >
        {/* Front */}
        <div style={{ ...face, background: color, transform: `translateZ(${h2}px)` }} />
        {/* Back */}
        <div style={{ ...face, background: color.replace(/[\d.]+\)$/, '0.12)'), transform: `rotateY(180deg) translateZ(${h2}px)` }} />
        {/* Left */}
        <div style={{ ...face, background: color.replace(/[\d.]+\)$/, '0.15)'), transform: `rotateY(-90deg) translateZ(${h2}px)` }} />
        {/* Right */}
        <div style={{ ...face, background: color.replace(/[\d.]+\)$/, '0.18)'), transform: `rotateY(90deg) translateZ(${h2}px)` }} />
        {/* Top */}
        <div style={{ ...face, background: color.replace(/[\d.]+\)$/, '0.22)'), transform: `rotateX(90deg) translateZ(${h2}px)` }} />
        {/* Bottom */}
        <div style={{ ...face, background: color.replace(/[\d.]+\)$/, '0.10)'), transform: `rotateX(-90deg) translateZ(${h2}px)` }} />
      </motion.div>
    </motion.div>
  );
}

/* ─── 3D Crystal / Octahedron using SVG  ─── */
function Crystal({ size = 50, color1, color2, x, y, duration, delay }) {
  const s = size;
  const h = s * 0.82;
  return (
    <motion.div
      style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 0 }}
      animate={{ opacity: [0, 0.9, 0.9, 0], y: [0, -450], rotate: [0, 180] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.9, 1] }}
    >
      <svg width={s} height={s * 1.6} viewBox={`0 0 ${s} ${s * 1.6}`} overflow="visible">
        <defs>
          <linearGradient id={`crg-${Math.round(x)}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
          <filter id={`cf-${Math.round(x)}`}>
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Top pyramid */}
        <polygon
          points={`${s/2},0 0,${h * 0.6} ${s},${h * 0.6}`}
          fill={`url(#crg-${Math.round(x)})`}
          opacity="0.85"
          filter={`url(#cf-${Math.round(x)})`}
        />
        <polygon
          points={`${s/2},0 0,${h * 0.6} ${s/2},${h * 0.4}`}
          fill="rgba(255,255,255,0.2)"
        />
        {/* Bottom pyramid */}
        <polygon
          points={`0,${h * 0.6} ${s},${h * 0.6} ${s/2},${s * 1.55}`}
          fill={color2}
          opacity="0.7"
        />
        <polygon
          points={`${s/2},${h * 0.6} ${s},${h * 0.6} ${s/2},${s * 1.55}`}
          fill="rgba(0,0,0,0.15)"
        />
        {/* Middle shine */}
        <ellipse cx={s/2} cy={h * 0.6} rx={s/2} ry="4" fill="rgba(255,255,255,0.3)" />
      </svg>
    </motion.div>
  );
}

/* ─── 3D Sphere using radial gradient  ─── */
function Sphere3D({ size = 60, color, glowColor, x, y, duration, delay }) {
  return (
    <motion.div
      style={{
        position: 'fixed', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${color}ee, ${color}66 50%, ${color}22)`,
        boxShadow: `0 0 ${size * 0.6}px ${glowColor}, inset 0 0 ${size * 0.3}px rgba(0,0,0,0.3)`,
        pointerEvents: 'none', zIndex: 0,
      }}
      animate={{
        opacity: [0, 0.7, 0.7, 0],
        y: [0, -500],
        x: [0, (Math.sin(delay) * 80)],
        scale: [1, 1.08, 1, 0.95],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.9, 1] }}
    >
      {/* Highlight */}
      <div style={{
        position: 'absolute', top: '15%', left: '20%',
        width: '35%', height: '25%', borderRadius: '50%',
        background: 'rgba(255,255,255,0.35)', filter: 'blur(4px)',
      }} />
      {/* Rim light */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: `1px solid ${color}88`,
      }} />
    </motion.div>
  );
}

/* ─── Glowing Ring (torus-like) ─── */
function GlowRing({ size = 70, color, x, y, duration, delay, tiltX = 60 }) {
  return (
    <motion.div
      style={{
        position: 'fixed', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        border: `3px solid transparent`,
        background: `radial-gradient(ellipse, transparent 55%, ${color} 56%, ${color}88 65%, transparent 70%)`,
        boxShadow: `0 0 20px ${color}66, 0 0 40px ${color}33`,
        pointerEvents: 'none', zIndex: 0,
        transform: `perspective(200px) rotateX(${tiltX}deg)`,
      }}
      animate={{
        opacity: [0, 0.85, 0.85, 0],
        y: [0, -400],
        rotate: [0, 360],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.9, 1] }}
    />
  );
}

/* ─── 3D Diamond / Rhombus ─── */
function Diamond3D({ size = 44, x, y, duration, delay, color1, color2 }) {
  return (
    <motion.div
      style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 0 }}
      animate={{ opacity: [0, 0.9, 0.9, 0], y: [0, -480], rotate: [0, -180] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.9, 1] }}
    >
      <svg width={size} height={size * 1.2} viewBox="0 0 44 54">
        <defs>
          <linearGradient id={`dg-${Math.round(x + y)}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        {/* Top facets */}
        <polygon points="22,2 2,20 22,24" fill={color1} opacity="0.9" />
        <polygon points="22,2 42,20 22,24" fill="rgba(255,255,255,0.25)" />
        <polygon points="2,20 42,20 22,24" fill={color2} opacity="0.7" />
        {/* Bottom */}
        <polygon points="2,20 22,52 22,24" fill={color2} opacity="0.85" />
        <polygon points="42,20 22,52 22,24" fill={color1} opacity="0.5" />
        {/* Outline */}
        <polygon points="22,2 2,20 22,52 42,20" fill="none"
          stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        {/* Facet lines */}
        <line x1="22" y1="2" x2="22" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <line x1="2" y1="20" x2="42" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      </svg>
    </motion.div>
  );
}

/* ─── Particle Sparkles ─── */
function Sparkle({ x, y, delay }) {
  return (
    <motion.div
      style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0], rotate: [0, 45] }}
      transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: Math.random() * 4 + 2 }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z"
          fill="rgba(196,181,253,0.8)" />
      </svg>
    </motion.div>
  );
}

/* ─── Starfield ─── */
function StarField({ count = 80 }) {
  const rand = seededRand(777);
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = rand() * 100;
        const y = rand() * 110;
        const size = rand() > 0.85 ? 2.2 : rand() > 0.5 ? 1.4 : 0.9;
        const dur = 12 + rand() * 20;
        const delay = -(rand() * 20);
        const peak = 0.25 + rand() * 0.65;
        return (
          <motion.div
            key={i}
            style={{
              position: 'fixed', left: `${x}%`, top: `${y}%`,
              width: size, height: size, borderRadius: '50%',
              background: 'white',
              boxShadow: size > 1.8 ? '0 0 5px 1px rgba(255,255,255,0.5)' : 'none',
              pointerEvents: 'none', zIndex: 0,
            }}
            animate={{
              opacity: [0.05, peak, 0.05],
              scale: [1, 1.3, 1],
              y: [0, -120 - rand() * 80],
            }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
          />
        );
      })}

      {/* Shooting stars */}
      {Array.from({ length: 4 }).map((_, i) => {
        const r = seededRand(i * 333 + 11);
        return (
          <motion.div
            key={`shoot-${i}`}
            style={{
              position: 'fixed',
              left: `${5 + r() * 70}%`,
              top: `${-5 - r() * 15}%`,
              width: 120, height: 2,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)',
              borderRadius: 2,
              filter: 'blur(1px) drop-shadow(0 0 5px white)',
              rotate: '35deg',
              pointerEvents: 'none', zIndex: 0,
            }}
            animate={{ x: [0, 700], y: [0, 700], opacity: [0, 0.9, 0] }}
            transition={{
              duration: 1.2 + r() * 0.8,
              delay: 4 + r() * 18 + i * 9,
              repeat: Infinity, ease: 'easeIn',
            }}
          />
        );
      })}
    </>
  );
}

/* ─── Ambient Glow Orbs ─── */
function GlowOrbs() {
  const orbs = [
    { color: 'rgba(99,102,241,0.09)', size: 600, x: '8%', y: '15%', dur: 22 },
    { color: 'rgba(236,72,153,0.07)', size: 500, x: '78%', y: '55%', dur: 28 },
    { color: 'rgba(6,182,212,0.06)', size: 420, x: '50%', y: '85%', dur: 20 },
    { color: 'rgba(139,92,246,0.08)', size: 380, x: '88%', y: '8%', dur: 24 },
    { color: 'rgba(251,113,133,0.05)', size: 300, x: '25%', y: '60%', dur: 18 },
  ];
  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed', left: orb.x, top: orb.y,
            width: orb.size, height: orb.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(50px)',
            pointerEvents: 'none', zIndex: 0,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ x: [0, 50, -30, 0], y: [0, -35, 50, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

/* ─── DNA Helix style dots ─── */
function HelixDots({ x, startY, color }) {
  const rand = seededRand(Math.round(x));
  const dots = Array.from({ length: 8 }, (_, i) => ({
    t: i / 8,
    delay: i * 0.15,
  }));
  return (
    <>
      {dots.map((d, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            left: `calc(${x}% + ${Math.sin(d.t * Math.PI * 2) * 14}px)`,
            top: `${startY + i * 18}%`,
            width: 5, height: 5, borderRadius: '50%',
            background: color,
            boxShadow: `0 0 8px ${color}`,
            pointerEvents: 'none', zIndex: 0,
          }}
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2 + rand() * 1, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

export default function FloatingObjects() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const rand = seededRand(42);

  const cubes = [
    { size: 28, color: 'rgba(99,102,241,0.2)', x: '8%', y: '15%', duration: 24, delay: -5, rotateDir: 1 },
    { size: 20, color: 'rgba(236,72,153,0.18)', x: '85%', y: '40%', duration: 30, delay: -12, rotateDir: -1 },
    { size: 36, color: 'rgba(6,182,212,0.16)', x: '55%', y: '70%', duration: 20, delay: -8, rotateDir: 1 },
    { size: 18, color: 'rgba(139,92,246,0.22)', x: '20%', y: '75%', duration: 26, delay: -3, rotateDir: -1 },
    { size: 24, color: 'rgba(251,113,133,0.15)', x: '70%', y: '12%', duration: 22, delay: -16, rotateDir: 1 },
  ];

  const crystals = [
    { size: 36, color1: '#7c3aed', color2: '#4c1d95', x: '15%', y: '30%', duration: 22, delay: -7 },
    { size: 28, color1: '#ec4899', color2: '#9d174d', x: '78%', y: '20%', duration: 26, delay: -14 },
    { size: 44, color1: '#0891b2', color2: '#164e63', x: '40%', y: '60%', duration: 32, delay: -2 },
    { size: 32, color1: '#6366f1', color2: '#3730a3', x: '90%', y: '65%', duration: 18, delay: -10 },
  ];

  const spheres = [
    { size: 48, color: '#7c3aed', glowColor: 'rgba(124,58,237,0.35)', x: '25%', y: '10%', duration: 28, delay: -6 },
    { size: 36, color: '#0891b2', glowColor: 'rgba(8,145,178,0.3)', x: '65%', y: '50%', duration: 22, delay: -18 },
    { size: 30, color: '#db2777', glowColor: 'rgba(219,39,119,0.3)', x: '5%', y: '55%', duration: 34, delay: -4 },
    { size: 42, color: '#4f46e5', glowColor: 'rgba(79,70,229,0.32)', x: '82%', y: '78%', duration: 25, delay: -11 },
  ];

  const rings = [
    { size: 80, color: 'rgba(99,102,241,0.6)', x: '12%', y: '45%', duration: 20, delay: -8, tiltX: 65 },
    { size: 60, color: 'rgba(236,72,153,0.6)', x: '72%', y: '30%', duration: 28, delay: -2, tiltX: 55 },
    { size: 100, color: 'rgba(6,182,212,0.5)', x: '48%', y: '85%', duration: 24, delay: -15, tiltX: 70 },
  ];

  const diamonds = [
    { size: 40, color1: '#a78bfa', color2: '#5b21b6', x: '60%', y: '5%', duration: 26, delay: -9 },
    { size: 30, color1: '#f472b6', color2: '#be185d', x: '32%', y: '90%', duration: 20, delay: -5 },
    { size: 50, color1: '#22d3ee', color2: '#0e7490', x: '92%', y: '25%', duration: 30, delay: -13 },
  ];

  const sparklePositions = Array.from({ length: 12 }, (_, i) => ({
    x: `${rand() * 95}%`, y: `${rand() * 95}%`, delay: rand() * 5,
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <StarField count={80} />
      <GlowOrbs />

      {/* 3D Cubes */}
      {cubes.map((c, i) => <Cube3D key={i} {...c} />)}

      {/* Crystals */}
      {crystals.map((c, i) => <Crystal key={i} {...c} />)}

      {/* Spheres */}
      {spheres.map((s, i) => <Sphere3D key={i} {...s} />)}

      {/* Glowing Rings */}
      {rings.map((r, i) => <GlowRing key={i} {...r} />)}

      {/* Diamonds */}
      {diamonds.map((d, i) => <Diamond3D key={i} {...d} />)}

      {/* Sparkle stars */}
      {sparklePositions.map((sp, i) => <Sparkle key={i} {...sp} />)}

      {/* Helix decorations */}
      <HelixDots x={5} startY={20} color="rgba(139,92,246,0.7)" />
      <HelixDots x={95} startY={50} color="rgba(236,72,153,0.6)" />
    </div>
  );
}
