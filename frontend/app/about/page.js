import React from 'react';
import Image from 'next/image';
import {
  User,
  Code2,
  Brain,
  Rocket,
  Mail,
  Github,
  Linkedin,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import profileImg from './image.png';

export const metadata = {
  title: "About Me | Sachin Rathod",
  description: "Learn more about Sachin, a fullstack developer passionate about building innovative digital solutions.",
};

const AboutPage = () => {
  const stats = [
    { label: 'Year Experience', value: '1+' },
    { label: 'Projects Built', value: '25+' },
    { label: 'Profiles Seen', value: '5K+' },
    { label: 'Tech Stack', value: '15+' },
  ];

  const highlights = [
    {
      icon: <Code2 className="text-indigo-400" size={24} />,
      title: "Clean Code Enthusiast",
      description: "I believe in writing code that is not just functional, but maintainable, scalable, and elegant."
    },
    {
      icon: <Brain className="text-pink-400" size={24} />,
      title: "Problem Solver",
      description: "Turning complex challenges into simple, intuitive user experiences is my core strength."
    },
    {
      icon: <Rocket className="text-cyan-400" size={24} />,
      title: "Lifelong Learner",
      description: "The tech world moves fast, and I'm always at the forefront of new frameworks and design patterns."
    }
  ];

  const interests = [
    { name: "Open Source", icon: <Code2 size={16} /> },
    { name: "Scalable Apps", icon: <Rocket size={16} /> },
    { name: "Coffee Enthusiast", icon: <div className="text-[10px]">☕</div> },
    { name: "UI/UX Design", icon: <Code2 size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[6.25rem]" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-pink-500/10 rounded-full blur-[6.25rem]" />

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <div className="order-2 lg:order-1">
          <div className="section-label group">
            <span className="group-hover:translate-x-1 transition-transform inline-block">Behind the Screen</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            I&apos;m <span className="gradient-text">Sachin Rathod</span>
          </h1>
          <p className="text-white/60 text-xl leading-relaxed mb-10 font-medium">
            A Computer Engineering student and Full-stack Developer based in Mumbai, India.
            Passionate about building scalable digital experiences and solving complex problems with modern tech.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-panel p-4 rounded-2xl text-center border-white/5">
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-[0.625rem] uppercase tracking-widest text-white/40 font-bold leading-tight">
                  {stat.label}
                </div>
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

        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative group">
            {/* Animated Glow behind image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/30 to-pink-500/30 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative float">
              <div className="w-64 h-64 md:w-[28.125rem] md:h-[28.125rem] rounded-[2.5rem] overflow-hidden border-2 border-white/10 glass-panel">
                <Image
                  src={profileImg}
                  alt="Sachin Rathod"
                  width={450}
                  height={450}
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 glass-panel p-4 rounded-2xl border-white/10 animate-bounce delay-700">
                <Code2 className="text-indigo-400" size={24} />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-2xl border-white/10 animate-bounce">
                <Rocket className="text-pink-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
        {/* Bio Section */}
        <div className="lg:col-span-2 space-y-12">
          <section className="glass-panel p-10 rounded-[2rem]">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
              <User className="text-indigo-400" /> My Story
            </h2>
            <div className="space-y-6 text-white/60 text-lg leading-relaxed font-medium">
              <p>
                I am a <span className="text-indigo-400 font-bold">Computer Engineering Student</span> at Saraswati College of Engineering, 
                where I bridge the gap between academic theory and real-world full-stack innovation.
              </p>
              <p>
                My developer journey is fueled by a passion for creating <span className="text-pink-400 font-bold">high-performance web applications</span>. 
                I specialize in the MERN stack while continuously exploring the frontiers of technology to build the future.
              </p>
              <p>
                <span className="text-cyan-400 font-bold">2025 Goals:</span> Deep-diving into Open Source, mastering Scalable Architectures, and tackling complex problem-solving.
                Currently sharpening my skills in <span className="text-white">TypeScript, GraphQL, and Serverless Architecture.</span>
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-3xl border-white/5 hover:border-indigo-500/20 transition-all group">
                <div className="mb-4 p-3 rounded-2xl bg-white/5 w-fit group-hover:bg-indigo-500/10 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <section className="glass-panel p-8 rounded-[2rem]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="text-indigo-400" size={20} /> Personal Interests
            </h3>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest, idx) => (
                <div key={idx} className="badge badge-primary py-2 px-4 flex items-center gap-2 normal-case font-semibold tracking-normal">
                  {interest.icon}
                  {interest.name}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-8 rounded-[2rem] border-indigo-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Code2 size={80} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Connect With Me</h3>
            <p className="text-white/40 text-sm mb-6">Always down for a coffee and a chat about tech.</p>

            <div className="space-y-4">
              <a href="mailto:rthodsachin0766@gmail.com" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-medium">rthodsachin0766@gmail.com</span>
              </a>
              <a href="https://github.com/FNICKE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Github size={18} />
                </div>
                <span className="text-sm font-medium">github.com/FNICKE</span>
              </a>
              <a href="https://www.linkedin.com/in/sachin-rathod-469168310" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Linkedin size={18} />
                </div>
                <span className="text-sm font-medium">linkedin.com/in/sachin-rathod</span>
              </a>
              <div className="flex items-center gap-4 text-white/70 group">
                <div className="p-2 rounded-lg bg-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <span className="text-sm font-medium">+91 9604669232</span>
              </div>
            </div>
          </section>

          <Link href="https://documentcloud.adobe.com/gsuiteintegration/index.html?state=%7B%22ids%22%3A%5B%221pXLvhJhhc3a4cho4Tm44MoMDNiwtK1op%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22109665752571630055379%22%2C%22resourceKeys%22%3A%7B%7D%7D" target="_blank" rel="noopener noreferrer" className="btn-premium btn-secondary w-full py-4 text-base">
            Download My Resume <ExternalLink size={18} />
          </Link>
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="glass-panel p-12 rounded-[2.5rem] text-center max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[5rem]" />
        <div className="relative z-10">
          <div className="section-label justify-center tracking-widest mb-6">Core Philosophy</div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 italic tracking-tight">
            &quot;Code is <span className="gradient-text">poetry</span> written in logic.&quot;
          </h2>
          <p className="text-white/40 font-medium">Sachin Rathod</p>
        </div>
      </section>
    </div>
  );
};

// Simple Sparkles icon manually defined for fallback
const Sparkles = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

export default AboutPage;
