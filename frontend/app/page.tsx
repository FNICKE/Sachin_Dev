import HeroSection from '@/components/sections/HeroSection';
import ProjectsGrid from '@/components/sections/ProjectsGrid';
import SkillsSection from '@/components/sections/SkillsSection';
import Link from 'next/link';
import { ArrowRight, Sparkles, Rocket, Code2, Zap, Star, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Sachin Rathod | Fullstack Developer',
  description: 'Portfolio of Sachin Rathod — Fullstack Developer crafting high-performance, pixel-perfect web applications.',
};

const statItems = [
  { icon: <Rocket size={32} />, label: 'Projects Built', value: '20+', color: '#6366f1', glow: 'rgba(99,102,241,0.15)' },
  { icon: <TrendingUp size={32} />, label: 'Tech In Arsenal', value: '15+', color: '#ec4899', glow: 'rgba(236,72,153,0.12)' },
  { icon: <Star size={32} />, label: 'Happy Clients', value: '15+', color: '#06b6d4', glow: 'rgba(6,182,212,0.12)' },
];

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
            <p className="mt-3 max-w-md font-medium" style={{ color: 'rgba(148,153,184,0.7)' }}>
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
      <section className="max-w-7xl mx-auto px-6 py-28" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
          <div className="section-label justify-center">
            <Zap size={13} className="text-yellow-400" /> What I Know
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 mt-2">
            Technical{' '}
            <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-lg leading-relaxed font-medium" style={{ color: 'rgba(148,153,184,0.7)' }}>
            A broad toolkit to build, ship, and scale production-grade software.
          </p>
        </div>
        <SkillsSection />
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div
          className="rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(15,22,41,0.9), rgba(10,15,30,0.95))',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Decorative glows */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }} />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />
          <div className="absolute inset-0 bg-grid-dense opacity-30 pointer-events-none" />

          {statItems.map(stat => (
            <div key={stat.label} className="text-center relative z-10 group">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div
                className="text-4xl md:text-5xl font-black mb-2 transition-transform group-hover:scale-110"
                style={{ color: stat.color, textShadow: `0 0 30px ${stat.glow}` }}
              >
                {stat.value}
              </div>
              <div className="font-bold text-sm uppercase tracking-wider" style={{ color: 'rgba(148,153,184,0.5)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div
          className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(15,22,41,0.95), rgba(10,15,30,0.98))',
            border: '1px solid rgba(99,102,241,0.15)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02)',
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

          <div className="relative z-10">
            <div className="section-label justify-center mb-5">
              <Rocket size={13} /> Let&apos;s build together
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.95]">
              Have a project{' '}
              <span className="gradient-text block md:inline">in mind?</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto mb-10 font-medium leading-relaxed" style={{ color: 'rgba(148,153,184,0.7)' }}>
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
