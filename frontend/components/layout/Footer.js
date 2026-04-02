import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  'Navigate': [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Skills', href: '/skills' },
    { name: 'Contact', href: '/contact' },
  ],
  'Connect': [
    { name: 'GitHub', href: '#', icon: <Github size={14} /> },
    { name: 'LinkedIn', href: '#', icon: <Linkedin size={14} /> },
    { name: 'Twitter', href: '#', icon: <Twitter size={14} /> },
    { name: 'Email', href: 'mailto:hello@sachin.dev', icon: <Mail size={14} /> },
  ],
};

const Footer = () => (
  <footer className="relative border-t border-white/5 mt-24"
    style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.02) 100%)' }}>
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="col-span-2 md:col-span-2">
          <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg"
              style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)' }}>S</div>
            <span className="font-black text-xl text-white/90 group-hover:text-white transition-colors">
              sachin<span className="text-indigo-400">.</span>dev
            </span>
          </Link>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs font-medium">
            Building digital products that bridge design and engineering. 
            Open to exciting opportunities and collaborations.
          </p>
          <div className="flex gap-3 mt-6">
            {[
              { icon: <Github size={17} />, href: '#' },
              { icon: <Linkedin size={17} />, href: '#' },
              { icon: <Twitter size={17} />, href: '#' },
              { icon: <Mail size={17} />, href: 'mailto:hello@sachin.dev' },
            ].map((s, i) => (
              <a key={i} href={s.href}
                className="p-2.5 rounded-xl glass-panel text-white/40 hover:text-white hover:scale-110 transition-all duration-200">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-xs font-black uppercase tracking-widest text-white/30 mb-5">{title}</h4>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white transition-colors group">
                    {link.icon}
                    {link.name}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
        <p className="text-xs text-white/25 font-medium">
          &copy; {new Date().getFullYear()} Sachin Rathod. All rights reserved.
        </p>
        <p className="text-xs text-white/25 font-medium">
          Built with Next.js · Tailwind CSS · MySQL
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
