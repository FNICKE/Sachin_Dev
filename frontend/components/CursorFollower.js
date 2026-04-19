"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/* ── spring configs ── */
const DOT_SPRING   = { damping: 28, stiffness: 450, mass: 0.35 };
const CAT_SPRING   = { damping: 20, stiffness: 90,  mass: 1.3  };

export default function CursorFollower() {
  const [visible,  setVisible]  = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [trail,    setTrail]    = useState([]);
  const trailRef = useRef([]);
  const [catLook, setCatLook] = useState({ rotX: 0, rotY: 0 });

  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);

  const springX = useSpring(cursorX, DOT_SPRING);
  const springY = useSpring(cursorY, DOT_SPRING);
  const catX    = useSpring(cursorX, CAT_SPRING);
  const catY    = useSpring(cursorY, CAT_SPRING);

  useEffect(() => {
    const onMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);

      trailRef.current = [
        { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() },
        ...trailRef.current.slice(0, 11),
      ];
      setTrail([...trailRef.current]);

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setCatLook({
        rotX: -((e.clientY - cy) / cy) * 20,
        rotY:  ((e.clientX - cx) / cx) * 25,
      });
    };
    const onDown     = () => setClicking(true);
    const onUp       = () => setClicking(false);
    const onOver     = (e) => { if (e.target.closest('a,button,[role="button"],input,textarea,select')) setHovering(true); };
    const onOut      = (e) => { if (e.target.closest('a,button,[role="button"],input,textarea,select')) setHovering(false); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    document.addEventListener('mouseover',  onOver);
    document.addEventListener('mouseout',   onOut);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseout',   onOut);
    };
  }, [cursorX, cursorY, visible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      <div
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        {/* ── Star trail ── */}
        {trail.map((pt, i) => {
          const t = 1 - i / trail.length;
          return (
            <motion.div
              key={pt.id}
              initial={{ opacity: t * 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{
                position:     'fixed',
                left:          pt.x - 5,
                top:           pt.y - 5,
                width:         Math.max(3, 11 - i),
                height:        Math.max(3, 11 - i),
                borderRadius: '50%',
                background:   `hsla(${255 + i * 13}, 88%, 72%, ${0.9 - i * 0.07})`,
                boxShadow:    `0 0 ${14 - i}px hsla(${255 + i * 13}, 88%, 72%, 0.7)`,
              }}
            />
          );
        })}

        {/* ── Ring cursor ── */}
        <motion.div
          style={{
            position:     'fixed',
            top:          -12,
            left:         -12,
            width:        24,
            height:       24,
            borderRadius: '50%',
            border:       '2px solid rgba(139,92,246,0.6)',
            x: springX,
            y: springY,
          }}
          animate={{ scale: clicking ? 0.5 : hovering ? 2.5 : 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 400 }}
        />

        {/* ── Dot cursor ── */}
        <motion.div
          style={{
            position:     'fixed',
            top:          -5,
            left:         -5,
            width:        10,
            height:       10,
            borderRadius: '50%',
            background:   'radial-gradient(circle at 35% 35%, #ddd6fe, #7c3aed)',
            boxShadow:    '0 0 1rem rgba(139,92,246,0.9), 0 0 2.5rem rgba(139,92,246,0.4)',
            x: springX,
            y: springY,
          }}
          animate={{ scale: clicking ? 0.3 : hovering ? 0 : 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 500 }}
        />

        {/* ── 3D Cat ── */}
        <motion.div
          className="fixed pointer-events-none"
          style={{ x: catX, y: catY, top: -76, left: -40 }}
        >
          <motion.div
            animate={{
              scale:  clicking ? 0.82 : hovering ? 1.18 : 1,
              rotate: clicking ? [-4, 4, -4, 0] : 0,
            }}
            transition={{ duration: 0.28, type: 'spring', damping: 14, stiffness: 300 }}
            style={{ perspective: '20rem', transformStyle: 'preserve-3d' }}
          >
            <motion.div
              animate={{ rotateX: catLook.rotX, rotateY: catLook.rotY }}
              transition={{ type: 'spring', damping: 22, stiffness: 80 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Cat3D clicking={clicking} hovering={hovering} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Cat SVG Component
───────────────────────────────────────────── */
function Cat3D({ clicking, hovering }) {
  const [blink,     setBlink]     = useState(false);
  const [tailAngle, setTailAngle] = useState(0);
  const [walkT,     setWalkT]     = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let t = 0;
    const loop = () => {
      t += 0.035;
      setTailAngle(Math.sin(t * 1.1) * 30);
      setWalkT(t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const blinkTimer = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 110);
    }, 3500);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(blinkTimer);
    };
  }, []);

  const eyeRY  = clicking ? 0.8 : blink ? 0.5 : hovering ? 6  : 4.5;
  const pupRY  = clicking ? 0.3 : hovering ? 5  : 3.2;

  return (
    <svg
      width="80"
      height="92"
      viewBox="0 0 80 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: `
          drop-shadow(0 0 1.2rem rgba(139,92,246,0.9))
          drop-shadow(0 0 0.5rem rgba(139,92,246,0.5))
          drop-shadow(0.125rem 0.25rem 0.5rem rgba(0,0,0,0.7))
        `,
        transform: 'translateZ(0)',
        willChange: 'filter',
      }}
    >
      <defs>
        <radialGradient id="gc-head" cx="38%" cy="32%">
          <stop offset="0%"   stopColor="#ddd6fe" />
          <stop offset="55%"  stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#5b21b6" />
        </radialGradient>
        <radialGradient id="gc-body" cx="38%" cy="28%">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="60%"  stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </radialGradient>
        <radialGradient id="gc-belly" cx="50%" cy="40%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)"   />
        </radialGradient>
        <radialGradient id="gc-nose" cx="50%" cy="30%">
          <stop offset="0%"   stopColor="#fda4af" />
          <stop offset="100%" stopColor="#ec4899" />
        </radialGradient>
        <linearGradient id="gc-tail" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <radialGradient id="gc-cheek" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="rgba(253,164,175,0.55)" />
          <stop offset="100%" stopColor="rgba(253,164,175,0)"    />
        </radialGradient>
        <filter id="gc-inner-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── TAIL ── */}
      <g transform={`rotate(${tailAngle}, 40, 78)`} style={{ transformOrigin: '40px 78px' }}>
        <path d="M40 78 Q58 62 65 48 Q71 35 62 28"
          stroke="url(#gc-tail)" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.9" />
        <path d="M40 78 Q58 62 65 48 Q71 35 62 28"
          stroke="rgba(196,181,253,0.35)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="62" cy="28" r="4.5" fill="#c4b5fd" opacity="0.9" />
      </g>

      {/* ── BODY ── */}
      <ellipse cx="40" cy="64" rx="20" ry="17" fill="url(#gc-body)" />
      <ellipse cx="34" cy="59" rx="11"  ry="8"  fill="rgba(255,255,255,0.09)" />
      <ellipse cx="47" cy="69" rx="11"  ry="8"  fill="rgba(0,0,0,0.13)" />
      <ellipse cx="40" cy="62" rx="11"  ry="10" fill="url(#gc-belly)" />

      {/* ── PAWS ── */}
      {[24, 40, 56].map((cx, i) => (
        <ellipse
          key={cx}
          cx={cx} cy="80" rx="6" ry="3.8"
          fill={i === 1 ? '#6d28d9' : '#7c3aed'}
          transform={`translate(0,${Math.sin(walkT * 2 + i) * 1.6})`}
        />
      ))}
      {/* toe dots */}
      {[21,24,27].map((x,i) => <circle key={i} cx={x} cy={82} r="1.3" fill="#4c1d95" />)}
      {[53,56,59].map((x,i) => <circle key={i} cx={x} cy={82} r="1.3" fill="#4c1d95" />)}

      {/* ── HEAD ── */}
      <circle cx="40" cy="33" r="26" fill="url(#gc-head)" />
      <ellipse cx="33" cy="24" rx="13" ry="9" fill="rgba(255,255,255,0.13)" />
      <circle  cx="40" cy="33" r="26" fill="none" stroke="rgba(91,33,182,0.45)" strokeWidth="2" />

      {/* ── EARS ── */}
      <polygon points="16,15 9,0 25,11"  fill="#7c3aed" />
      <polygon points="17,13 12,3 22,10" fill="#c4b5fd" />
      <polygon points="17,13 13,5 21,10" fill="rgba(253,164,175,0.65)" />
      <polygon points="64,15 71,0 55,11"  fill="#7c3aed" />
      <polygon points="63,13 68,3 58,10" fill="#c4b5fd" />
      <polygon points="63,13 67,5 59,10" fill="rgba(253,164,175,0.65)" />

      {/* ── FOREHEAD STRIPE ── */}
      <path d="M40 16 Q42 25 40 33" stroke="rgba(167,139,250,0.35)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* ── CHEEKS ── */}
      <ellipse cx="22" cy="39" rx="9" ry="6" fill="url(#gc-cheek)" />
      <ellipse cx="58" cy="39" rx="9" ry="6" fill="url(#gc-cheek)" />

      {/* ── EYES ── */}
      <ellipse cx="30" cy="31" rx="7.5" ry={eyeRY + 1.2} fill="white" />
      <ellipse cx="50" cy="31" rx="7.5" ry={eyeRY + 1.2} fill="white" />
      <ellipse cx="30" cy="31" rx="4"   ry={pupRY}        fill="#1e1b4b" />
      <ellipse cx="50" cy="31" rx="4"   ry={pupRY}        fill="#1e1b4b" />
      <ellipse cx="30" cy="31" rx="6"   ry={eyeRY}        fill="none" stroke="#7c3aed" strokeWidth="1.5" />
      <ellipse cx="50" cy="31" rx="6"   ry={eyeRY}        fill="none" stroke="#7c3aed" strokeWidth="1.5" />
      {/* catchlights */}
      <circle cx="27" cy="28" r="1.6" fill="white" opacity="0.95" />
      <circle cx="47" cy="28" r="1.6" fill="white" opacity="0.95" />
      <circle cx="32" cy="33" r="0.9" fill="white" opacity="0.5"  />
      <circle cx="52" cy="33" r="0.9" fill="white" opacity="0.5"  />
      {/* iris shimmer */}
      <ellipse cx="28" cy="30" rx="2" ry={pupRY * 0.5} fill="rgba(167,139,250,0.4)" />
      <ellipse cx="48" cy="30" rx="2" ry={pupRY * 0.5} fill="rgba(167,139,250,0.4)" />

      {/* ── NOSE ── */}
      <polygon points="40,41 37,44.5 43,44.5" fill="url(#gc-nose)" />
      <circle cx="38.5" cy="43" r="0.9" fill="rgba(0,0,0,0.35)" />
      <circle cx="41.5" cy="43" r="0.9" fill="rgba(0,0,0,0.35)" />

      {/* ── MOUTH ── */}
      <path d="M37.5,45 Q40,49 42.5,45"  stroke="#ec4899" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M37,45 Q34,47 33,45"      stroke="#ec4899" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M43,45 Q46,47 47,45"      stroke="#ec4899" strokeWidth="1.3" strokeLinecap="round" fill="none" />

      {/* ── WHISKERS ── */}
      {[
        [hovering ? 2 : 6, 34, 25, 36],
        [hovering ? 1 : 5, 39, 25, 39],
        [hovering ? 2 : 6, 44, 25, 42],
        [hovering ? 78 : 74, 34, 55, 36],
        [hovering ? 79 : 75, 39, 55, 39],
        [hovering ? 78 : 74, 44, 55, 42],
      ].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={`rgba(255,255,255,${i < 3 ? 0.65 : 0.55})`}
          strokeWidth={i % 3 === 2 ? 0.9 : 1.1}
          strokeLinecap="round" />
      ))}

      {/* ── HOVER CROWN ── */}
      {hovering && (
        <g filter="url(#gc-inner-glow)">
          <polygon points="40,5 42,11 48,8 44,14 50,14 40,20 30,14 36,14 32,8 38,11" fill="#fde68a" opacity="0.9" />
          <circle cx="40" cy="3" r="2.5" fill="#fbbf24" opacity="0.9" />
        </g>
      )}

      {/* ── CLICK BURST ── */}
      {clicking && (
        <>
          <circle cx="40" cy="33" r="30" fill="none" stroke="rgba(196,181,253,0.5)" strokeWidth="2" />
          <circle cx="40" cy="33" r="36" fill="none" stroke="rgba(167,139,250,0.25)" strokeWidth="1" />
          {[0,60,120,180,240,300].map(angle => (
            <line key={angle}
              x1={40 + Math.cos(angle * Math.PI/180) * 32}
              y1={33 + Math.sin(angle * Math.PI/180) * 32}
              x2={40 + Math.cos(angle * Math.PI/180) * 40}
              y2={33 + Math.sin(angle * Math.PI/180) * 40}
              stroke="rgba(196,181,253,0.6)" strokeWidth="1.5" strokeLinecap="round" />
          ))}
        </>
      )}
    </svg>
  );
}
