"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUpRight, Heart, Code2, Sparkles } from 'lucide-react';

const links = [
  { group: 'Navigate', items: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Skills', href: '/skills' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ]},
  { group: 'Connect', items: [
    { label: 'GitHub', href: 'https://github.com/FNICKE', external: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sachin-rathod-469168310', external: true },
    { label: 'Email Me', href: 'mailto:rthodsachin0766@gmail.com', external: true },
    { label: 'Contact', href: '/contact' },
  ]},
];

const socials = [
  { icon: <Github size={18} />, href: 'https://github.com/FNICKE', label: 'GitHub' },
  { icon: <Linkedin size={18} />, href: 'https://www.linkedin.com/in/sachin-rathod-469168310', label: 'LinkedIn' },
  { icon: <Mail size={18} />, href: 'mailto:rthodsachin0766@gmail.com', label: 'Email' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 mt-20 overflow-hidden">
      {/* Top gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-32 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.4) 0%, transparent 70%)', filter: 'blur(20px)' }} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-14">

          {/* Brand */}
          <div className="w-full md:max-w-sm">
            <Link href="/" className="group inline-flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)' }}>
                <span className="text-white font-black text-lg">S</span>
              </div>
              <span className="text-xl font-black text-white/90 tracking-tight">Sachin Rathod</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed font-medium mb-6">
              Fullstack developer crafting pixel-perfect, high-performance web experiences. Based in Mumbai, building for the world.
            </p>

            {/* Availability */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-xl glass-panel text-xs font-bold text-white/60 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for new projects
            </div>

            {/* Socials */}
            <div className="flex flex-wrap gap-3">
              {socials.map(s => (
                <motion.a
                  key={s.label}
                  href={s.href} target="_blank" rel="noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl glass-panel border border-white/8 text-white/40 hover:text-white hover:border-indigo-500/30 transition-all"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          <div className="flex flex-row flex-wrap gap-12 sm:gap-24 w-full md:w-auto">
            {links.map(group => (
              <div key={group.group} className="flex-1 min-w-[120px]">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/30 mb-5">{group.group}</h4>
                <ul className="space-y-3">
                  {group.items.map(item => (
                    <li key={item.label}>
                      {item.external ? (
                        <a
                          href={item.href} target="_blank" rel="noreferrer"
                          className="group flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors block"
                        >
                          {item.label}
                          <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 shrink-0" />
                        </a>
                      ) : (
                        <Link href={item.href}
                          className="text-sm font-medium text-white/50 hover:text-white transition-colors block">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-5">
          <p className="text-white/25 text-xs font-medium flex items-center gap-1.5">
            © {year} Sachin Rathod. Built with
            <Heart size={11} className="text-red-400 fill-red-400" />
            using
            <Code2 size={11} className="text-indigo-400" />
            Next.js
          </p>
          <div className="flex items-center gap-2 text-white/20 text-xs font-medium">
            <Sparkles size={11} className="text-yellow-400" />
            Designed & developed by Sachin Rathod
          </div>
        </div>
      </div>
    </footer>
  );
}
