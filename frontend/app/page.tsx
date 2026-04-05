import HeroSection from '@/components/sections/HeroSection';
import ProjectsGrid from '@/components/sections/ProjectsGrid';
import SkillsSection from '@/components/sections/SkillsSection';
import Link from 'next/link';
import { ArrowRight, Sparkles, Rocket, Code2, Zap } from 'lucide-react';

export const metadata = {
  title: 'Sachin Rathod | Fullstack Developer',
  description: 'Portfolio of Sachin Rathod — Fullstack Developer crafting high-performance, pixel-perfect web applications.',
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* ─── FEATURED PROJECTS ─── */}
      <section id="projects" className="max-w-7xl mx-auto px-6 py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="section-label">
              <Code2 size={13} /> Selected Work
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mt-2">
              Featured{' '}
              <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-white/40 font-medium mt-3 max-w-md">
              Hand-picked builds that showcase my range — from fullstack apps to pixel-perfect UIs.
            </p>
          </div>
          <Link
            href="/projects"
            className="btn-premium btn-outline text-sm py-3 px-6 w-fit flex items-center gap-2 group"
          >
            View All Projects
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProjectsGrid limit={3} />
      </section>

      {/* ─── Skills ─── */}
      <section className="max-w-7xl mx-auto px-6 py-28 border-t border-white/5">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
          <div className="section-label justify-center">
            <Zap size={13} className="text-yellow-400" /> What I Know
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 mt-2">
            Technical{' '}
            <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-white/45 text-lg leading-relaxed font-medium">
            A broad toolkit to build, ship, and scale production-grade software.
          </p>
        </div>
        <SkillsSection />
      </section>

      {/* ─── MINI ABOUT STRIP ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div
          className="glass-panel rounded-3xl p-8 md:p-12 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }} />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />

          {[
            { icon: '🚀', label: 'Projects Built', value: '20+' },
            { icon: '🎯', label: 'Tech In Arsenal', value: '15+' },
            { icon: '⭐', label: 'Happy Clients', value: '15+' },
          ].map(stat => (
            <div key={stat.label} className="text-center relative z-10">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-white/40 font-semibold text-sm uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="glass-panel rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border border-white/5">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          {/* Grid dots */}
          <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

          <div className="relative z-10">
            <div className="section-label justify-center mb-5">
              <Rocket size={13} /> Let&apos;s build together
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.95]">
              Have a project{' '}
              <span className="gradient-text block md:inline">in mind?</span>
            </h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto mb-10 font-medium leading-relaxed">
              I&apos;m always excited to collaborate on meaningful projects.
              Let&apos;s discuss your idea and bring it to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="btn-premium btn-primary text-base px-10 py-4 group">
                <Sparkles size={16} className="text-yellow-300" />
                Start a Conversation
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/projects" className="btn-premium btn-outline text-base px-8 py-4">
                See My Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
