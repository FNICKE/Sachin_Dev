"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Download, ChevronDown, Sparkles, Zap, Code2, Globe } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const words = ['Fullstack Developer', 'Computer Engineering Student', 'Problem Solver', 'Open Source Contributor', 'UI/UX Enthusiast'];

const techBadges = [
  { name: 'React', color: '#61DAFB', bg: 'rgba(97,218,251,0.1)' },
  { name: 'Node.js', color: '#68A063', bg: 'rgba(104,160,99,0.1)' },
  { name: 'Next.js', color: '#ffffff', bg: 'rgba(255,255,255,0.08)' },
  { name: 'MySQL', color: '#00758F', bg: 'rgba(0,117,143,0.1)' },
  { name: 'MongoDB', color: '#4DB33D', bg: 'rgba(77,179,61,0.1)' },
  { name: 'TypeScript', color: '#3178C6', bg: 'rgba(49,120,198,0.1)' },
];

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('https://documentcloud.adobe.com/gsuiteintegration/index.html');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    import('@/lib/api').then(module => {
      module.default.get('/settings/resume').then(({ data }) => {
        if (data?.data?.resume_url) setResumeUrl(data.data.resume_url);
      }).catch(() => {});
    });
  }, []);

  // Typewriter effect
  useEffect(() => {
    const word = words[wordIndex];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 75);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden">

      {/* Parallax glow orbs */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 30, stiffness: 100 }}
        style={{ top: '20%', left: '15%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)', borderRadius: '50%' }}
      />
      <motion.div
        className="absolute pointer-events-none"
        animate={{ x: -mousePos.x * 0.6, y: -mousePos.y * 0.6 }}
        transition={{ type: 'spring', damping: 30, stiffness: 80 }}
        style={{ bottom: '20%', right: '15%', width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)', borderRadius: '50%' }}
      />
      <motion.div
        className="absolute pointer-events-none"
        animate={{ x: mousePos.x * 0.4, y: -mousePos.y * 0.4 }}
        transition={{ type: 'spring', damping: 25, stiffness: 60 }}
        style={{ top: '50%', right: '25%', width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)', borderRadius: '50%' }}
      />

      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-full"
            style={{ top: `${20 + i * 15}%`, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.08), transparent)' }}
            animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.5, 1, 0.5] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Animated availability badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'backOut' }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-panel text-sm font-semibold text-white/80 mb-10"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          Available for freelance projects
          <Sparkles size={13} className="text-yellow-400" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-[1.02] tracking-[-0.04em] text-white mb-6"
        >
          Hi, I&apos;m{' '}
          <span className="gradient-text relative inline-block">
            Sachin
            <motion.span
              className="absolute -bottom-2 left-0 h-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #ec4899)' }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />
          </span>
          <br />
          <motion.span
            className="text-white/30 text-[0.65em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {displayed}
            <span className="inline-block w-[0.125rem] h-[0.8em] bg-indigo-400 ml-1 align-middle animate-pulse" />
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-[clamp(1rem,1.8vw,1.25rem)] text-white/55 leading-relaxed font-medium mb-10"
        >
          I craft high-performance, pixel-perfect web applications using{' '}
          <span className="text-indigo-300 font-semibold">React</span>,{' '}
          <span className="text-purple-300 font-semibold">Node.js</span>, and{' '}
          <span className="text-pink-300 font-semibold">MySQL/MongoDB</span>.
          Built for scale, speed, and seamless digital experiences.
        </motion.p>

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {techBadges.map((b, i) => (
            <motion.span
              key={b.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              whileHover={{ scale: 1.1, y: -2 }}
              style={{ background: b.bg, color: b.color, border: `1px solid ${b.color}33` }}
              className="px-3 py-1 rounded-full text-xs font-bold tracking-wide"
            >
              {b.name}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        >
          <Link href="/projects" className="btn-premium btn-primary text-base px-8 py-4 group">
            <Zap size={18} className="text-yellow-300" />
            View My Work
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
          </Link>
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn-premium btn-outline text-base px-8 py-4 group">
            <Download size={18} />
            Download CV
          </a>
        </motion.div>

        {/* Social row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center items-center gap-8 mb-24"
        >
          <div className="h-px w-16 bg-white/10" />
          <motion.a href="https://github.com/FNICKE" target="_blank" rel="noreferrer"
            whileHover={{ scale: 1.15, y: -2 }}
            className="p-3 rounded-xl glass-panel text-white/50 hover:text-white transition-all duration-200">
            <Github size={20} />
          </motion.a>
          <motion.a href="https://www.linkedin.com/in/sachin-rathod-469168310" target="_blank" rel="noreferrer"
            whileHover={{ scale: 1.15, y: -2 }}
            className="p-3 rounded-xl glass-panel text-white/50 hover:text-white transition-all duration-200">
            <Linkedin size={20} />
          </motion.a>
          <div className="h-px w-16 bg-white/10" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#projects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="inline-flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors group"
        >
          <span className="text-xs font-semibold uppercase tracking-widest">Scroll down</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.a>
      </div>

      {/* Animated stats */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="relative z-10 mt-20 grid grid-cols-3 gap-6 max-w-2xl w-full mx-auto"
      >
        {[
          { label: 'Projects Built', value: '20+', icon: <Code2 size={18} className="text-indigo-400" /> },
          { label: 'Year Experience', value: '1+', icon: <Zap size={18} className="text-yellow-400" /> },
          { label: 'Happy Clients', value: '15+', icon: <Globe size={18} className="text-cyan-400" /> },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05, y: -3 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="glass-panel rounded-2xl p-5 text-center border border-white/5 hover:border-indigo-500/20 transition-colors"
          >
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
            <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HeroSection;
