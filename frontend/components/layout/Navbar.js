"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Skills', href: '/skills' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change
  useEffect(() => { const id = setTimeout(() => setOpen(false), 0); return () => clearTimeout(id); }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] z-[100] transition-all duration-100"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #6366f1, #ec4899, #06b6d4)',
          boxShadow: '0 0 10px rgba(99,102,241,0.6)',
        }}
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-500 rounded-2xl ${
          scrolled || open
            ? 'py-2.5 glass-panel bg-[#020817]/70 border border-white/10 shadow-2xl shadow-black/60 backdrop-blur-2xl'
            : 'py-4 bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)' }}
            >
              <span className="text-white font-black text-lg z-10">S</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#f43f5e)' }} />
            </motion.div>
            <span className="font-black text-lg tracking-tight text-white/90 group-hover:text-white transition-colors hidden sm:block">
              Sachin Rathod
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden md:block">
              <Link href="/contact" className="btn-premium btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
                <Sparkles size={14} className="text-yellow-300" />
                Hire Me
              </Link>
            </motion.div>

            <button
              className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-all"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-1 border-t border-white/5 mt-3 mx-2">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                          isActive
                            ? 'text-white bg-indigo-500/15 border border-indigo-500/25'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.name}
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-2"
                >
                  <Link href="/contact" className="btn-premium btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2">
                    <Sparkles size={14} className="text-yellow-300" /> Hire Me
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
