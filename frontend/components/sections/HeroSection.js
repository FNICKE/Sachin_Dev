"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download, Github, Linkedin, Sparkles, Code2, Terminal, Layers, Globe, Box, Database, Hexagon, Component, Cpu, Rocket, Zap, Star } from 'lucide-react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

/* ── floating tech pills ─────────────────────── */
const techPills = [
  { icon: <Component size={14} />, text: 'React',      color: '#61DAFB', x: '76%', y: '14%', delay: 0   },
  { icon: <Hexagon size={14} />,   text: 'Node.js',    color: '#68A063', x: '80%', y: '52%', delay: 0.3 },
  { icon: <Code2 size={14} />,     text: 'TypeScript', color: '#3178C6', x: '68%', y: '78%', delay: 0.6 },
  { icon: <Database size={14} />,  text: 'MySQL',      color: '#00758F', x: '86%', y: '32%', delay: 0.9 },
  { icon: <Box size={14} />,       text: 'Next.js',    color: '#fff',    x: '72%', y: '64%', delay: 1.2 },
];

const stats = [
  { value: '20+', label: 'Projects',  icon: <Rocket size={24} />, color: '#7aa2f7' },
  { value: '1+',  label: 'Yrs Exp',   icon: <Zap size={24} />,    color: '#bb9af7' },
  { value: '15+', label: 'Clients',   icon: <Star size={24} />,   color: '#9ece6a' },
];

/* ── animated code snippets shown in the visual card ─ */
const codeLines = [
  { text: 'const dev = new Sachin();',             color: '#c792ea' },
  { text: 'dev.skills = ["React","Node","MySQL"];', color: '#82aaff' },
  { text: 'dev.passion = "crafting UX";',           color: '#c3e88d' },
  { text: 'dev.deploy().then(wow => 🚀);',          color: '#f78c6c' },
];

/* ── rotating background palette ─────────────────── */
const BG_PHASES = [
  { a: 'rgba(99,102,241,0.22)', b: 'rgba(236,72,153,0.15)', c: 'rgba(6,182,212,0.1)' },
  { a: 'rgba(139,92,246,0.22)', b: 'rgba(245,158,11,0.12)', c: 'rgba(99,102,241,0.1)' },
  { a: 'rgba(6,182,212,0.20)',  b: 'rgba(99,102,241,0.15)', c: 'rgba(236,72,153,0.1)' },
  { a: 'rgba(236,72,153,0.20)', b: 'rgba(6,182,212,0.15)',  c: 'rgba(139,92,246,0.1)' },
];

export default function HeroSection() {
  const [resumeUrl, setResumeUrl] = useState('#');
  const [bgPhase, setBgPhase] = useState(0);
  const [codeIdx, setCodeIdx] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [6, -6]);
  const rotateY = useTransform(mouseX, [-300, 300], [-6, 6]);
  const rafRef = useRef(null);

  /* mouse parallax */
  useEffect(() => {
    const h = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [mouseX, mouseY]);

  /* cycling background */
  useEffect(() => {
    const id = setInterval(() => setBgPhase(p => (p + 1) % BG_PHASES.length), 5000);
    return () => clearInterval(id);
  }, []);

  /* cycling code lines */
  useEffect(() => {
    const id = setInterval(() => setCodeIdx(i => (i + 1) % codeLines.length), 2200);
    return () => clearInterval(id);
  }, []);

  /* resume */
  useEffect(() => {
    import('@/lib/api').then(mod => {
      const { default: api, BASE_URL } = mod;
      api.get('/settings/resume').then(({ data }) => {
        if (data?.data?.resume_url) {
          const url = data.data.resume_url;
          setResumeUrl(url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`);
        }
      }).catch(() => {});
    });
  }, []);

  const phase = BG_PHASES[bgPhase];

  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center pt-32 pb-12 px-4 md:px-8 overflow-hidden">

      {/* ── ANIMATED MORPHING BACKGROUND ───────────────── */}
      <div className="hero-bg-layer">
        <AnimatePresence mode="sync">
          <motion.div
            key={bgPhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              animate={{ x: [0, 40, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: '-20rem', left: '-10rem',
                width: '50rem', height: '50rem', borderRadius: '50%',
                background: `radial-gradient(circle, ${phase.a} 0%, transparent 70%)`,
                filter: 'blur(5rem)',
              }}
            />
            <motion.div
              animate={{ x: [0, -30, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
              style={{
                position: 'absolute', bottom: '-15rem', right: '-5rem',
                width: '45rem', height: '45rem', borderRadius: '50%',
                background: `radial-gradient(circle, ${phase.b} 0%, transparent 70%)`,
                filter: 'blur(6rem)',
              }}
            />
            <motion.div
              animate={{ x: [0, 20, -20, 0], y: [0, -30, 20, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
              style={{
                position: 'absolute', top: '40%', left: '30%',
                width: '30rem', height: '30rem', borderRadius: '50%',
                background: `radial-gradient(circle, ${phase.c} 0%, transparent 70%)`,
                filter: 'blur(7rem)',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── PARTICLE DOTS ─────────────────────────────── */}
      <ParticleDots />

      {/* ── FLOATING TECH PILLS (desktop) ─────────────── */}
      {techPills.map((p, i) => (
        <motion.div
          key={p.text}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity:  { delay: 1.4 + p.delay, duration: 0.5 },
            scale:    { delay: 1.4 + p.delay, duration: 0.4, type: 'spring', bounce: 0.5 },
            y:        { delay: 2 + p.delay, duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute hidden xl:flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border z-20"
          style={{
            left: p.x, top: p.y,
            background:    `${p.color}14`,
            borderColor:   `${p.color}40`,
            color:          p.color,
            backdropFilter: 'blur(0.75rem)',
            boxShadow:     `0 0 1.5rem ${p.color}22`,
          }}
        >
          <span>{p.icon}</span>{p.text}
        </motion.div>
      ))}

      {/* ── MAIN CONTENT GRID ─────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* ═══ LEFT — TEXT CONTENT ═══ */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">

          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: -1.5 * 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border:     '1px solid rgba(34,197,94,0.28)',
              color:      '#4ade80',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for Freelance &amp; Fulltime Roles
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 2 * 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-black tracking-tight leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)' }}
          >
            <span className="text-white">Hi, I build </span>
            <span className="gradient-text-hero">stunning</span>
            <br />
            <TypeAnimation
              sequence={[
                'Web Applications', 2200,
                'REST APIs & Backends', 2200,
                'Pixel-Perfect UIs', 2200,
                'Fullstack Solutions', 2200,
              ]}
              wrapper="span"
              repeat={Infinity}
              className="text-white"
              style={{ display: 'inline-block' }}
            />
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 1.25 * 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg leading-relaxed mb-8 max-w-xl font-medium"
            style={{ color: 'rgba(148,153,184,0.9)' }}
          >
            Fullstack developer specializing in{' '}
            <span className="text-indigo-300 font-bold">React, Node.js &amp; MySQL</span>.
            I turn complex ideas into seamless, production-grade user experiences.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 1.25 * 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
          >
            <Link
              href="/projects"
              className="hero-btn-primary group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" />
              <Sparkles size={17} className="text-yellow-300" />
              View My Work
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="hero-btn-outline group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300"
            >
              <Download size={17} />
              Download Resume
            </a>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex items-center justify-center lg:justify-start gap-5"
          >
            {[
              { href: 'https://github.com/FNICKE', icon: <Github size={18} />, label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/sachin-rathod-469168310', icon: <Linkedin size={18} />, label: 'LinkedIn' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="w-px h-4 bg-white/10" />}
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:scale-105"
                >
                  {s.icon}<span>{s.label}</span>
                </a>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* ═══ RIGHT — VISUAL CARD ═══ */}
        <motion.div
          initial={{ opacity: 0, x: 3 * 16, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, type: 'spring', damping: 20 }}
          className="order-1 lg:order-2 flex justify-center items-center"
        >
          <motion.div
            style={{ rotateX, rotateY, perspective: '50rem', transformStyle: 'preserve-3d' }}
            className="hero-visual-card relative w-full max-w-lg"
          >
            {/* Glow ring behind */}
            <div className="hero-glow-ring" />

            {/* Main image card */}
            <div className="hero-img-card relative overflow-hidden rounded-3xl">
              <Image
                src="/hero-workspace.png"
                alt="Developer workspace — Sachin Rathod"
                width={600}
                height={480}
                className="w-full h-auto object-cover"
                priority
              />
              {/* dark gradient overlay for readability */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(2,8,23,0.85) 0%, rgba(2,8,23,0.2) 55%, transparent 100%)' }}
              />

              {/* ── Floating UI elements on image ── */}
              {/* Top-left: status */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(10,15,30,0.85)', border: '1px solid rgba(99,102,241,0.35)', backdropFilter: 'blur(0.75rem)' }}
              >
                <Terminal size={13} className="text-indigo-400" />
                <span className="text-indigo-300">sachin@dev</span>
                <span className="text-green-400 animate-pulse">▌</span>
              </motion.div>

              {/* Bottom: code snippet */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <motion.div
                  className="rounded-xl p-3 font-mono text-xs leading-relaxed"
                  style={{ background: 'rgba(2,8,23,0.92)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(1rem)' }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    {['#ff5f57','#febc2e','#28c840'].map(c => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                    <span className="ml-2 text-gray-500 text-xs">app.js</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={codeIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35 }}
                      style={{ color: codeLines[codeIdx].color }}
                    >
                      {'> '}{codeLines[codeIdx].text}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Top-right: layers badge */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.35)', backdropFilter: 'blur(0.75rem)', color: '#f9a8d4' }}
              >
                <Layers size={13} />
                Fullstack
              </motion.div>
            </div>

            {/* ── Stats strip below image ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-3 gap-px mt-3 rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(1.25rem)' }}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  whileHover={{ background: 'rgba(255,255,255,0.06)' }}
                  className="flex flex-col items-center py-4 px-2 transition-all duration-300"
                  style={{ background: 'rgba(10,15,30,0.7)' }}
                >
                  <span className="text-lg mb-0.5">{s.icon}</span>
                  <div className="text-xl md:text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[0.6rem] uppercase font-bold tracking-[0.16em]" style={{ color: 'rgba(86,95,137,0.8)' }}>{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[0.6rem] uppercase tracking-widest font-bold" style={{ color: 'rgba(86,95,137,0.6)' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.7), transparent)' }}
        />
      </motion.div>

      <style jsx>{`
        .hero-section { background: transparent; }

        .hero-bg-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .gradient-text-hero {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 35%, #ec4899 65%, #06b6d4 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: heroShimmer 4s linear infinite;
        }
        @keyframes heroShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 300% center; }
        }

        .hero-btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          background-size: 200% auto;
          box-shadow: 0 0.5rem 2rem rgba(99,102,241,0.45);
          animation: btnShimmer 3s linear infinite;
        }
        .hero-btn-primary:hover {
          box-shadow: 0 0.75rem 2.5rem rgba(99,102,241,0.7);
          transform: translateY(-0.125rem) scale(1.03);
        }
        @keyframes btnShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .hero-btn-outline {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.85);
          backdrop-filter: blur(0.75rem);
        }
        .hero-btn-outline:hover {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.1);
          color: #a5b4fc;
          transform: translateY(-0.125rem) scale(1.03);
        }

        .social-link { color: rgba(86,95,137,0.9); }
        .social-link:hover { color: #7aa2f7; }

        .hero-visual-card { will-change: transform; }

        .hero-glow-ring {
          position: absolute;
          inset: -0.25rem;
          border-radius: 1.75rem;
          background: linear-gradient(135deg, rgba(99,102,241,0.6), rgba(236,72,153,0.4), rgba(6,182,212,0.4));
          filter: blur(1.5rem);
          opacity: 0.5;
          animation: ringPulse 4s ease-in-out infinite alternate;
          z-index: -1;
        }
        @keyframes ringPulse {
          from { opacity: 0.35; transform: scale(0.99); }
          to   { opacity: 0.65; transform: scale(1.01); }
        }

        .hero-img-card {
          border: 1px solid rgba(99,102,241,0.2);
          box-shadow: 0 2rem 5rem rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
        }
      `}</style>
    </section>
  );
}

/* ── Particle dots component ─────────────────────── */
function ParticleDots() {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    setDots(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x:   `${Math.random() * 100}%`,
        y:   `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        dur:   Math.random() * 4 + 3,
        color: ['#6366f1','#ec4899','#06b6d4','#8b5cf6','#a78bfa'][Math.floor(Math.random() * 5)],
      }))
    );
  }, []);

  if (dots.length === 0) {
    return <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {dots.map(d => (
        <motion.div
          key={d.id}
          animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: d.x, top: d.y,
            width: d.size, height: d.size,
            borderRadius: '50%',
            background: d.color,
            boxShadow: `0 0 ${d.size * 4}px ${d.color}`,
          }}
        />
      ))}
    </div>
  );
}
