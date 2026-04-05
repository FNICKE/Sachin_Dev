import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Code2, Brain, Rocket, Mail, Github, Linkedin, ExternalLink, Sparkles, MapPin, GraduationCap, Heart } from 'lucide-react';
import profileImg from './image.png';

export const metadata = {
  title: "About | Sachin Rathod – Fullstack Developer",
  description: "Learn more about Sachin Rathod — a passionate fullstack developer and Computer Engineering student based in Mumbai.",
};

const stats = [
  { label: 'Year Experience', value: '1+', color: '#6366f1' },
  { label: 'Projects Built', value: '25+', color: '#ec4899' },
  { label: 'Profile Views', value: '5K+', color: '#06b6d4' },
  { label: 'Tech Skills', value: '15+', color: '#8b5cf6' },
];

const highlights = [
  {
    icon: <Code2 className="text-indigo-400" size={22} />,
    title: "Clean Code Enthusiast",
    description: "I believe in writing code that is not just functional, but maintainable, scalable, and elegant.",
    color: '#6366f1',
  },
  {
    icon: <Brain className="text-pink-400" size={22} />,
    title: "Problem Solver",
    description: "Turning complex challenges into simple, intuitive user experiences is my core strength.",
    color: '#ec4899',
  },
  {
    icon: <Rocket className="text-cyan-400" size={22} />,
    title: "Lifelong Learner",
    description: "The tech world moves fast, and I'm always at the forefront of new frameworks and design patterns.",
    color: '#06b6d4',
  },
];

const interests = [
  { name: "Open Source", icon: "🌐" },
  { name: "Scalable Apps", icon: "🚀" },
  { name: "Coffee", icon: "☕" },
  { name: "UI/UX Design", icon: "🎨" },
  { name: "Gaming", icon: "🎮" },
  { name: "Reading", icon: "📚" },
];

const timeline = [
  { year: '2022', title: 'Started Engineering', desc: 'Joined Saraswati College of Engineering for Computer Engineering.', icon: <GraduationCap size={16} /> },
  { year: '2023', title: 'First Web Project', desc: 'Built my first fullstack app — a task manager using Node.js and MySQL.', icon: <Code2 size={16} /> },
  { year: '2024', title: 'Freelancing Begins', desc: 'Started taking on freelance projects and building real-world solutions.', icon: <Rocket size={16} /> },
  { year: '2025', title: 'Open Source & Scale', desc: 'Diving deep into TypeScript, GraphQL, and scalable cloud architectures.', icon: <Sparkles size={16} /> },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-36 relative">
      {/* Background orbs */}
      <div className="absolute top-20 right-0 -z-10 w-[500px] h-[500px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-40 left-0 -z-10 w-[400px] h-[400px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
        <div className="order-2 lg:order-1">
          <div className="section-label mb-4">Behind the Screen</div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.95]">
            I&apos;m{' '}
            <span className="gradient-text">Sachin</span>
            <br />
            <span className="text-white/30 text-4xl md:text-5xl">Rathod</span>
          </h1>

          <div className="flex items-center gap-2 mb-6">
            <MapPin size={16} className="text-indigo-400" />
            <span className="text-white/50 text-sm font-semibold">Mumbai, India</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <GraduationCap size={16} className="text-pink-400" />
            <span className="text-white/50 text-sm font-semibold">Computer Engineering Student</span>
          </div>

          <p className="text-white/60 text-lg leading-relaxed mb-10 font-medium">
            A passionate fullstack developer who turns ideas into{' '}
            <span className="text-indigo-300 font-bold">pixel-perfect digital experiences</span>.
            I bridge academic theory and real-world innovation — building scalable web apps with modern tech stacks.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel p-4 rounded-2xl text-center border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-premium btn-primary px-8 py-4 text-base">
              Get in Touch
            </Link>
            <Link href="/projects" className="btn-premium btn-outline px-8 py-4 text-base">
              See My Work
            </Link>
          </div>
        </div>

        {/* Profile image */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative group">
            {/* Glow */}
            <div className="absolute -inset-6 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(236,72,153,0.2))' }} />

            <div className="relative" style={{ animation: 'float 5s ease-in-out infinite' }}>
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-[3rem] border border-indigo-500/20" />
              <div className="absolute -inset-8 rounded-[3.5rem] border border-pink-500/10" />

              <div className="w-72 h-72 md:w-[420px] md:h-[420px] rounded-[2.5rem] overflow-hidden border-2 border-white/10 glass-panel">
                <Image
                  src={profileImg}
                  alt="Sachin Rathod"
                  width={450}
                  height={450}
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-700"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-5 -right-5 glass-panel p-3.5 rounded-2xl border border-white/10 shadow-lg"
                style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}>
                <Code2 className="text-indigo-400" size={22} />
              </div>
              <div className="absolute -bottom-5 -left-5 glass-panel p-3.5 rounded-2xl border border-white/10 shadow-lg"
                style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
                <Rocket className="text-pink-400" size={22} />
              </div>
              <div className="absolute top-1/2 -right-7 glass-panel p-3 rounded-2xl border border-white/10 shadow-lg"
                style={{ animation: 'float 5s ease-in-out infinite 0.2s' }}>
                <Heart className="text-red-400" size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
        {/* Bio + Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Story */}
          <section className="glass-panel p-10 rounded-[2rem] border border-white/5">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <User className="text-indigo-400" /> My Story
            </h2>
            <div className="space-y-5 text-white/60 text-base leading-relaxed font-medium">
              <p>
                I am a <span className="text-indigo-400 font-bold">Computer Engineering Student</span> at Saraswati College of Engineering,
                where I bridge the gap between academic theory and real-world full-stack innovation.
              </p>
              <p>
                My developer journey is fueled by a passion for creating{' '}
                <span className="text-pink-400 font-bold">high-performance web applications</span>.
                I specialize in the MERN stack while continuously exploring the frontiers of technology to build the future.
              </p>
              <p>
                <span className="text-cyan-400 font-bold">2025 Goals:</span> Deep-diving into Open Source, mastering Scalable Architectures, and tackling complex problem-solving.
                Currently sharpening my skills in <span className="text-white">TypeScript, GraphQL, and Serverless Architecture.</span>
              </p>
            </div>
          </section>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="glass-panel p-7 rounded-3xl border border-white/5 group transition-all duration-300"
                style={{ '--hl-color': item.color }}
              >
                <div className="mb-4 p-3 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-white font-black mb-2 text-sm">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <section className="glass-panel p-10 rounded-[2rem] border border-white/5">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <Rocket className="text-pink-400" /> My Journey
            </h2>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent" />
              <div className="space-y-8 pl-14">
                {timeline.map((t, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-9 top-0.5 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                      {t.icon}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{t.year}</div>
                    <h4 className="text-white font-bold mb-1">{t.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Interests */}
          <section className="glass-panel p-7 rounded-[2rem] border border-white/5">
            <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
              <Heart className="text-red-400" size={18} /> Interests
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {interests.map((interest) => (
                <div
                  key={interest.name}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/70 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-white transition-all"
                >
                  <span>{interest.icon}</span>
                  {interest.name}
                </div>
              ))}
            </div>
          </section>

          {/* Connect */}
          <section className="glass-panel p-7 rounded-[2rem] border border-indigo-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(20px)' }} />
            <h3 className="text-lg font-black text-white mb-2">Connect with Me</h3>
            <p className="text-white/40 text-sm mb-6">Always down for a chat about tech or a new project.</p>
            <div className="space-y-3">
              {[
                { icon: <Mail size={16} />, text: 'rthodsachin0766@gmail.com', href: 'mailto:rthodsachin0766@gmail.com' },
                { icon: <Github size={16} />, text: 'github.com/FNICKE', href: 'https://github.com/FNICKE' },
                { icon: <Linkedin size={16} />, text: 'linkedin.com/in/sachin-rathod', href: 'https://www.linkedin.com/in/sachin-rathod-469168310' },
              ].map(item => (
                <a key={item.text} href={item.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-white text-sm font-medium group transition-all">
                  <span className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 text-indigo-400 transition-colors">{item.icon}</span>
                  {item.text}
                </a>
              ))}
            </div>
          </section>

          {/* Resume */}
          <Link
            href="https://documentcloud.adobe.com/gsuiteintegration/index.html?state=%7B%22ids%22%3A%5B%221pXLvhJhhc3a4cho4Tm44MoMDNiwtK1op%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22109665752571630055379%22%2C%22resourceKeys%22%3A%7B%7D%7D"
            target="_blank" rel="noopener noreferrer"
            className="btn-premium btn-secondary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            <ExternalLink size={16} /> Download My Resume
          </Link>
        </div>
      </div>

      {/* Quote section */}
      <section className="glass-panel p-12 md:p-16 rounded-[2.5rem] text-center relative overflow-hidden border border-white/5">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent)', filter: 'blur(40px)' }} />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.3), transparent)', filter: 'blur(40px)' }} />
        <div className="relative z-10">
          <div className="text-6xl mb-6 select-none">&quot;</div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 italic tracking-tight">
            Code is <span className="gradient-text">poetry</span> written in logic.
          </h2>
          <p className="text-white/40 font-bold tracking-widest uppercase text-sm">— Sachin Rathod</p>
        </div>
      </section>
    </div>
  );
}
