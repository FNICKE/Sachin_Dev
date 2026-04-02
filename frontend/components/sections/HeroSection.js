"use client";
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Download, ChevronDown } from 'lucide-react';

const words = ['Fullstack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Open Source Fan'];

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

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
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora" />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'drift1 14s ease-in-out infinite alternate' }} />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'drift2 18s ease-in-out infinite alternate' }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Availability badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel text-sm font-semibold text-white/80 mb-10 float">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          Available for freelance projects
        </div>

        {/* Main heading */}
        <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-[1.02] tracking-[-0.04em] text-white mb-6">
          Hi, I&apos;m{' '}
          <span className="gradient-text">Sachin</span>
          <br />
          <span className="text-white/30 text-[0.65em]">
            {displayed}
            <span className="inline-block w-[2px] h-[0.8em] bg-indigo-400 ml-1 align-middle animate-pulse" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-[clamp(1rem,1.8vw,1.25rem)] text-white/55 leading-relaxed font-medium mb-12">
          I craft high-performance, pixel-perfect web applications using{' '}
          <span className="text-indigo-300 font-semibold">Next.js</span>,{' '}
          <span className="text-purple-300 font-semibold">Node.js</span>, and{' '}
          <span className="text-pink-300 font-semibold">MySQL</span>.
          Turning complex ideas into seamless digital experiences.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link href="/projects" className="btn-premium btn-primary text-base px-8 py-4 group">
            View My Work
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
          </Link>
          <Link href="/contact" className="btn-premium btn-outline text-base px-8 py-4">
            <Download size={18} />
            Download CV
          </Link>
        </div>

        {/* Social row */}
        <div className="flex justify-center items-center gap-8 mb-24">
          <div className="h-px w-16 bg-white/10" />
          <a href="https://github.com" target="_blank" rel="noreferrer"
            className="p-3 rounded-xl glass-panel text-white/50 hover:text-white hover:scale-110 transition-all duration-200">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer"
            className="p-3 rounded-xl glass-panel text-white/50 hover:text-white hover:scale-110 transition-all duration-200">
            <Linkedin size={20} />
          </a>
          <div className="h-px w-16 bg-white/10" />
        </div>

        {/* Scroll indicator */}
        <a href="#projects" className="inline-flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors group">
          <span className="text-xs font-semibold uppercase tracking-widest">Scroll down</span>
          <ChevronDown size={18} className="animate-bounce" />
        </a>
      </div>

      {/* Stats row */}
      <div className="relative z-10 mt-20 grid grid-cols-3 gap-6 max-w-2xl w-full mx-auto">
        {[
          { label: 'Projects Built', value: '20+' },
          { label: 'Years Experience', value: '3+' },
          { label: 'Happy Clients', value: '15+' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel rounded-2xl p-5 text-center">
            <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
            <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
