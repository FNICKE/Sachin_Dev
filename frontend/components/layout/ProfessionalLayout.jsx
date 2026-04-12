"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Work', path: '/projects' },
  { name: 'Expertise', path: '/skills' },
  { name: 'About', path: '/about' },
  { name: 'Console', path: '/console' },
];

export default function ProfessionalLayout({ children }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-[#FAFAFA] selection:text-[#050505] flex flex-col relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[100px]" />
      </div>

      {/* Navigation Bar */}
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out md:px-8 px-4 ${
          isScrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 ease-in-out ${
          isScrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl shadow-black/50' : ''
        }`}>
          <Link href="/" className="group flex items-center gap-2 z-50 mix-blend-difference">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
            <span className="font-outfit font-bold tracking-tight text-lg text-white">Sachin Rathod.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 mix-blend-difference">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.name} 
                href={link.path}
                className={`text-sm tracking-wide font-medium relative group py-1 text-white/70 hover:text-white transition-colors ${
                  pathname === link.path ? 'text-white' : ''
                }`}
              >
                {link.name}
                {pathname === link.path && (
                  <motion.div 
                    layoutId="underline"
                    className="absolute left-0 right-0 bottom-0 h-[1px] bg-white" 
                  />
                )}
                <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-white scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 z-50">
            <Link 
              href="/contact"
              className="relative overflow-hidden rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold tracking-wide transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 group"
            >
              <span>Let's Talk</span>
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden z-50 text-white p-2 mix-blend-difference"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map(link => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-outfit font-bold hover:text-white/70 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-8 rounded-full bg-white text-black px-8 py-4 text-lg font-semibold tracking-wide"
              >
                Let's Talk
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Ultra Minimalist Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#050505]/50 backdrop-blur-lg mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-12 transition-all">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold tracking-tight mb-4">Have an idea?</h2>
            <p className="text-[#888888] font-inter text-lg">Let's build something exceptional together.</p>
            <a href="mailto:hello@sachin.dev" className="inline-block mt-8 text-xl border-b-2 border-white pb-1 font-medium hover:text-white/70 hover:border-white/70 transition-all">
              hello@sachin.dev
            </a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <Github size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <Linkedin size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row justify-between text-[#555555] text-sm">
          <p>© {new Date().getFullYear()} Sachin Rathod. All rights reserved.</p>
          <p>Designed with precision.</p>
        </div>
      </footer>

    </div>
  );
}
