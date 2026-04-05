"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CursorFollower() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState([]);
  const trailRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [catLook, setCatLook] = useState({ rotX: 0, rotY: 0 });
  const animFrameRef = useRef(null);

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const springConfig = { damping: 30, stiffness: 400, mass: 0.4 };
  const catSpringConfig = { damping: 22, stiffness: 100, mass: 1.2 };

  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);
  const catX = useSpring(cursorX, catSpringConfig);
  const catY = useSpring(cursorY, catSpringConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      trailRef.current = [
        { x: e.clientX, y: e.clientY, id: Date.now() },
        ...trailRef.current.slice(0, 9),
      ];
      setTrail([...trailRef.current]);

      // Cat look direction: center of viewport
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      setCatLook({ rotX: -dy * 18, rotY: dx * 22 });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleHoverStart = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea')) setIsHovering(true);
    };
    const handleHoverEnd = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea')) setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      <div className="fixed inset-0 pointer-events-none z-[9999]" style={{ opacity: isVisible ? 1 : 0 }}>

        {/* Paw-print trail */}
        {trail.map((point, i) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: point.x - 5,
              top: point.y - 5,
              width: Math.max(4, 10 - i),
              height: Math.max(4, 10 - i),
              borderRadius: '50%',
              background: `hsla(${260 + i * 12}, 85%, 72%, ${0.8 - i * 0.08})`,
              boxShadow: `0 0 ${14 - i * 1.2}px hsla(${260 + i * 12}, 85%, 72%, 0.6)`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}

        {/* Main dot cursor */}
        <motion.div
          animate={{ scale: isClicking ? 0.5 : isHovering ? 2.2 : 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 500 }}
          className="fixed pointer-events-none"
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #c4b5fd, #7c3aed)',
            boxShadow: '0 0 16px rgba(139,92,246,0.9), 0 0 40px rgba(139,92,246,0.4)',
            x: springX,
            y: springY,
            top: -6,
            left: -6,
          }}
        />

        {/* 3D Cat */}
        <motion.div
          className="fixed pointer-events-none"
          style={{ x: catX, y: catY, top: -70, left: -36 }}
        >
          <motion.div
            animate={{
              scale: isClicking ? 0.85 : isHovering ? 1.15 : 1,
              rotate: isClicking ? [-3, 3, -3, 0] : 0,
            }}
            transition={{ duration: 0.25, type: 'spring', damping: 15, stiffness: 300 }}
            style={{
              perspective: '300px',
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.div
              animate={{
                rotateX: catLook.rotX,
                rotateY: catLook.rotY,
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 80 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Cat3D isClicking={isClicking} isHovering={isHovering} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

function Cat3D({ isClicking, isHovering }) {
  const [blinkPhase, setBlinkPhase] = useState(false);
  const [tailAngle, setTailAngle] = useState(0);
  const [walkPhase, setWalkPhase] = useState(0);
  const tailRef = useRef(0);
  const walkRef = useRef(0);
  const timeRef = useRef(null);

  useEffect(() => {
    let t = 0;
    const loop = () => {
      t += 0.04;
      tailRef.current = Math.sin(t * 1.2) * 28;
      walkRef.current = t;
      setTailAngle(tailRef.current);
      setWalkPhase(walkRef.current);
      timeRef.current = requestAnimationFrame(loop);
    };
    timeRef.current = requestAnimationFrame(loop);

    // Blink timer
    const blinkInterval = setInterval(() => {
      setBlinkPhase(true);
      setTimeout(() => setBlinkPhase(false), 120);
    }, 3200);

    return () => {
      cancelAnimationFrame(timeRef.current);
      clearInterval(blinkInterval);
    };
  }, []);

  const eyeH = isClicking ? 1.5 : blinkPhase ? 1 : isHovering ? 11 : 8;
  const pupilH = isClicking ? 0.5 : isHovering ? 9 : 6;

  return (
    <svg
      width="72"
      height="84"
      viewBox="0 0 72 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: `
          drop-shadow(0 0 18px rgba(139,92,246,0.8))
          drop-shadow(0 0 6px rgba(139,92,246,0.5))
          drop-shadow(2px 4px 8px rgba(0,0,0,0.6))
        `,
        transform: 'translateZ(0)',
      }}
    >
      <defs>
        <radialGradient id="cg-head" cx="38%" cy="32%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#5b21b6" />
        </radialGradient>
        <radialGradient id="cg-body" cx="38%" cy="28%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="60%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </radialGradient>
        <radialGradient id="cg-belly" cx="50%" cy="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="cg-nose" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#ec4899" />
        </radialGradient>
        <linearGradient id="cg-tail" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="cg-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* 3D shadow/depth */}
        <radialGradient id="cg-cheek-l" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(249,168,212,0.55)" />
          <stop offset="100%" stopColor="rgba(249,168,212,0)" />
        </radialGradient>
        <radialGradient id="cg-cheek-r" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(249,168,212,0.55)" />
          <stop offset="100%" stopColor="rgba(249,168,212,0)" />
        </radialGradient>
      </defs>

      {/* === TAIL (animated) === */}
      <g transform={`rotate(${tailAngle}, 36, 70)`} style={{ transformOrigin: '36px 70px' }}>
        <path
          d="M36 70 Q52 55 58 42 Q63 32 55 26"
          stroke="url(#cg-tail)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M36 70 Q52 55 58 42 Q63 32 55 26"
          stroke="rgba(196,181,253,0.3)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tail tip */}
        <circle cx="55" cy="26" r="4" fill="#c4b5fd" opacity="0.9" />
      </g>

      {/* === BODY === */}
      <ellipse cx="36" cy="58" rx="18" ry="16" fill="url(#cg-body)" />
      {/* Body 3D shading */}
      <ellipse cx="30" cy="54" rx="10" ry="7" fill="rgba(255,255,255,0.08)" />
      <ellipse cx="42" cy="62" rx="10" ry="7" fill="rgba(0,0,0,0.12)" />
      {/* Belly highlight */}
      <ellipse cx="36" cy="56" rx="10" ry="9" fill="url(#cg-belly)" />

      {/* === PAWS (walking) === */}
      <ellipse
        cx="24"
        cy="72"
        rx="5.5"
        ry="3.5"
        fill="#7c3aed"
        transform={`translate(0, ${Math.sin(walkRef.current * 2) * 1.5})`}
      />
      <ellipse
        cx="36"
        cy="73"
        rx="5"
        ry="3.2"
        fill="#6d28d9"
        transform={`translate(0, ${Math.sin(walkRef.current * 2 + 1) * 1.5})`}
      />
      <ellipse
        cx="48"
        cy="72"
        rx="5.5"
        ry="3.5"
        fill="#7c3aed"
        transform={`translate(0, ${Math.sin(walkRef.current * 2 + 2) * 1.5})`}
      />
      {/* Paw toe details */}
      {[22, 24.5, 27].map((x, i) => (
        <circle key={i} cx={x} cy={74} r="1.2" fill="#5b21b6" />
      ))}
      {[46, 48.5, 51].map((x, i) => (
        <circle key={i} cx={x} cy={74} r="1.2" fill="#5b21b6" />
      ))}

      {/* === HEAD === */}
      <circle cx="36" cy="30" r="24" fill="url(#cg-head)" />
      {/* Head 3D gloss */}
      <ellipse cx="30" cy="22" rx="12" ry="8" fill="rgba(255,255,255,0.12)" />
      {/* Head shadow rim */}
      <circle cx="36" cy="30" r="24" fill="none" stroke="rgba(91,33,182,0.4)" strokeWidth="2" />

      {/* === EARS === */}
      {/* Left ear */}
      <polygon points="14,14 8,0 22,10" fill="#7c3aed" />
      <polygon points="15,12 11,3 20,9" fill="#c4b5fd" />
      {/* Left ear inner pink */}
      <polygon points="15,12 12,5 19,9" fill="rgba(249,168,212,0.6)" />
      {/* Right ear */}
      <polygon points="58,14 64,0 50,10" fill="#7c3aed" />
      <polygon points="57,12 61,3 52,9" fill="#c4b5fd" />
      <polygon points="57,12 60,5 53,9" fill="rgba(249,168,212,0.6)" />

      {/* === FACE STRIPE / MARKING === */}
      <path d="M36 14 Q38 22 36 30" stroke="rgba(167,139,250,0.3)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* === CHEEKS === */}
      <ellipse cx="20" cy="36" rx="8" ry="5" fill="url(#cg-cheek-l)" />
      <ellipse cx="52" cy="36" rx="8" ry="5" fill="url(#cg-cheek-r)" />

      {/* === EYES === */}
      {/* Eye whites */}
      <ellipse cx="27" cy="28" rx="6.5" ry={eyeH / 2 + 1} fill="white" />
      <ellipse cx="45" cy="28" rx="6.5" ry={eyeH / 2 + 1} fill="white" />
      {/* Pupils */}
      <ellipse cx="27" cy="28" rx="3.5" ry={pupilH / 2} fill="#1e1b4b" />
      <ellipse cx="45" cy="28" rx="3.5" ry={pupilH / 2} fill="#1e1b4b" />
      {/* Iris ring */}
      <ellipse cx="27" cy="28" rx="5" ry={eyeH / 2} fill="none" stroke="#7c3aed" strokeWidth="1" />
      <ellipse cx="45" cy="28" rx="5" ry={eyeH / 2} fill="none" stroke="#7c3aed" strokeWidth="1" />
      {/* Catchlights */}
      <circle cx="24.5" cy="25.5" r="1.4" fill="white" opacity="0.95" />
      <circle cx="42.5" cy="25.5" r="1.4" fill="white" opacity="0.95" />
      <circle cx="29" cy="30" r="0.8" fill="white" opacity="0.5" />
      <circle cx="47" cy="30" r="0.8" fill="white" opacity="0.5" />

      {/* === NOSE === */}
      <polygon points="36,37 33.5,40 38.5,40" fill="url(#cg-nose)" />
      {/* Nostrils */}
      <circle cx="34.5" cy="39" r="0.8" fill="rgba(0,0,0,0.3)" />
      <circle cx="37.5" cy="39" r="0.8" fill="rgba(0,0,0,0.3)" />

      {/* === MOUTH === */}
      <path d="M34,41 Q36,44.5 38,41" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M33.5,41 Q31,42.5 30,41" stroke="#ec4899" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M38.5,41 Q41,42.5 42,41" stroke="#ec4899" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* === WHISKERS (responsive) === */}
      <line x1={isHovering ? "4" : "8"} y1="31" x2="22" y2="33" stroke="rgba(255,255,255,0.65)" strokeWidth="1" strokeLinecap="round" />
      <line x1={isHovering ? "3" : "7"} y1="36" x2="22" y2="35.5" stroke="rgba(255,255,255,0.65)" strokeWidth="1" strokeLinecap="round" />
      <line x1={isHovering ? "4" : "8"} y1="41" x2="22" y2="38" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" strokeLinecap="round" />
      <line x1={isHovering ? "68" : "64"} y1="31" x2="50" y2="33" stroke="rgba(255,255,255,0.65)" strokeWidth="1" strokeLinecap="round" />
      <line x1={isHovering ? "69" : "65"} y1="36" x2="50" y2="35.5" stroke="rgba(255,255,255,0.65)" strokeWidth="1" strokeLinecap="round" />
      <line x1={isHovering ? "68" : "64"} y1="41" x2="50" y2="38" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" strokeLinecap="round" />

      {/* === Crown / Sparkle on head === */}
      {isHovering && (
        <>
          <circle cx="36" cy="6" r="2.5" fill="#fde68a" opacity="0.9" />
          <circle cx="28" cy="8" r="1.8" fill="#fde68a" opacity="0.7" />
          <circle cx="44" cy="8" r="1.8" fill="#fde68a" opacity="0.7" />
          <line x1="36" y1="2" x2="36" y2="10" stroke="#fbbf24" strokeWidth="1" />
          <line x1="32" y1="4" x2="40" y2="10" stroke="#fbbf24" strokeWidth="0.8" />
          <line x1="40" y1="4" x2="32" y2="10" stroke="#fbbf24" strokeWidth="0.8" />
        </>
      )}

      {/* Click burst */}
      {isClicking && (
        <>
          <circle cx="36" cy="30" r="28" fill="none" stroke="rgba(196,181,253,0.4)" strokeWidth="2" />
          <circle cx="36" cy="30" r="32" fill="none" stroke="rgba(167,139,250,0.2)" strokeWidth="1" />
        </>
      )}
    </svg>
  );
}
