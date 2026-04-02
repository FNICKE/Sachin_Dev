import HeroSection from '@/components/sections/HeroSection';
import ProjectsGrid from '@/components/sections/ProjectsGrid';
import SkillsSection from '@/components/sections/SkillsSection';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Projects Section */}
      <section id="projects" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="section-label">Selected Work</div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Featured Projects
            </h2>
          </div>
          <Link href="/projects"
            className="btn-premium btn-outline text-sm py-2.5 px-5 w-fit">
            View All Projects →
          </Link>
        </div>
        <ProjectsGrid limit={3} />
      </section>

      {/* Skills Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
          <div className="section-label">What I Know</div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Technical Skills
          </h2>
          <p className="text-white/45 text-lg leading-relaxed font-medium">
            A broad toolkit to build, ship, and scale production-grade software.
          </p>
        </div>
        <SkillsSection />
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="glass-panel rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          {/* Glow orbs */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(30px)' }} />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }} />

          <div className="relative z-10">
            <div className="section-label justify-center">Let&apos;s build together</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Have a project in mind?
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 font-medium leading-relaxed">
              I&apos;m always excited to collaborate on meaningful projects. 
              Let&apos;s discuss your idea and bring it to life.
            </p>
            <Link href="/contact" className="btn-premium btn-primary text-base px-10 py-4">
              Start a Conversation →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
