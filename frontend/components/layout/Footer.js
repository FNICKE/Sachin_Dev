"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUpRight, Heart, Code2, Sparkles, ArrowRight } from 'lucide-react';

const links = [
  {
    group: 'Navigate', items: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Skills', href: '/skills' },
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
    ]
  },
  {
    group: 'Connect', items: [
      { label: 'GitHub', href: 'https://github.com/FNICKE', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sachin-rathod-469168310', external: true },
      { label: 'Email Me', href: 'mailto:rthodsachin0766@gmail.com', external: true },
      { label: 'Contact', href: '/contact' },
    ]
  },
];

const socials = [
  { icon: <Github size={18} />, href: 'https://github.com/FNICKE', label: 'GitHub' },
  { icon: <Linkedin size={18} />, href: 'https://www.linkedin.com/in/sachin-rathod-469168310', label: 'LinkedIn' },
  { icon: <Mail size={18} />, href: 'mailto:rthodsachin0766@gmail.com', label: 'Email' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Top gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-32 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.5) 0%, transparent 70%)', filter: 'blur(20px)' }} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-14">

          {/* Brand */}
          <div className="w-full md:max-w-sm">
            <Link href="/" className="group inline-flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
                <span className="text-white font-black text-lg">S</span>
              </div>
              <span className="text-xl font-black tracking-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Sachin.<span style={{ color: '#818cf8' }}>dev</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed font-medium mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Fullstack developer crafting pixel-perfect, high-performance web experiences. Based in Mumbai, building for the world.
            </p>

            {/* Availability badge */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold mb-6"
              style={{
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.18)',
                color: 'rgba(74,222,128,0.85)',
              }}>
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
                  className="p-2.5 rounded-xl transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                    e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
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
                <h4 className="text-xs font-black uppercase tracking-widest mb-5"
                  style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {group.group}
                </h4>
                <ul className="space-y-3">
                  {group.items.map(item => (
                    <li key={item.label}>
                      {item.external ? (
                        <a
                          href={item.href} target="_blank" rel="noreferrer"
                          className="group flex items-center gap-1.5 text-sm font-medium transition-colors"
                          style={{ color: 'rgba(255,255,255,0.45)' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'white'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                        >
                          {item.label}
                          <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            style={{ color: '#818cf8' }} />
                        </a>
                      ) : (
                        <Link href={item.href}
                          className="text-sm font-medium transition-colors block"
                          style={{ color: 'rgba(255,255,255,0.45)' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'white'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                        >
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

        {/* CTA strip */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 p-6 rounded-2xl"
          style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
          }}
        >
          <div>
            <p className="font-black text-white mb-1">Ready to build something amazing?</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Let&apos;s collaborate and bring your ideas to life.</p>
          </div>
          <Link href="/contact"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white whitespace-nowrap transition-all"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
            }}
          >
            <Sparkles size={14} className="text-yellow-300" />
            Get in Touch
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
          <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © {year} Sachin Rathod. Built with
            <Heart size={11} className="text-red-400 fill-red-400" />
            using
            <Code2 size={11} style={{ color: '#818cf8' }} />
            Next.js
          </p>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <Sparkles size={11} className="text-yellow-400" />
            Designed & developed by Sachin Rathod
          </div>
        </div>
      </div>
    </footer>
  );
}
