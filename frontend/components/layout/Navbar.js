"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Skills', href: '/skills' },
  { name: 'About', href: '/about' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 glass-panel border-b'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)' }}>
            <span className="text-white font-black text-lg tracking-tighter z-10">S</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#f43f5e)' }} />
          </div>
          <span className="font-black text-xl tracking-tight text-white/90 group-hover:text-white transition-colors hidden sm:block">
            sachin<span className="text-indigo-400">.</span>dev
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact" className="btn-premium btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
            <Sparkles size={15} />
            Hire Me
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-panel border-t mt-2 mx-4 rounded-2xl overflow-hidden">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-premium btn-primary mt-2 text-sm"
            >
              <Sparkles size={15} /> Hire Me
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
