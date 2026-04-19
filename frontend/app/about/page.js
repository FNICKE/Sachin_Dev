"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User, Code2, Brain, Rocket, Mail, Github, Linkedin,
  ExternalLink, Sparkles, MapPin, GraduationCap, Heart, ArrowRight
} from 'lucide-react';
import profileImg from './image.png';




const stats = [
  { label: 'Year Experience', value: '1+', color: '#6366f1', glow: 'rgba(99,102,241,0.3)' },
  { label: 'Projects Built', value: '25+', color: '#ec4899', glow: 'rgba(236,72,153,0.25)' },
  { label: 'Profile Views', value: '5K+', color: '#06b6d4', glow: 'rgba(6,182,212,0.25)' },
  { label: 'Tech Skills', value: '15+', color: '#8b5cf6', glow: 'rgba(139,92,246,0.25)' },
];

const highlights = [
  {
    icon: <Code2 size={22} />,
    title: "Clean Code Enthusiast",
    description: "I believe in writing code that is not just functional, but maintainable, scalable, and elegant.",
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
  },
  {
    icon: <Brain size={22} />,
    title: "Problem Solver",
    description: "Turning complex challenges into simple, intuitive user experiences is my core strength.",
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.08)',
  },
  {
    icon: <Rocket size={22} />,
    title: "Lifelong Learner",
    description: "The tech world moves fast, and I'm always at the forefront of new frameworks and design patterns.",
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
  },
];

import { Globe, Lightbulb, Coffee, Palette, Gamepad2, BookOpen } from 'lucide-react';

const interests = [
  { name: "Open Source",   icon: <Globe size={16} /> },
  { name: "Scalable Apps", icon: <Lightbulb size={16} /> },
  { name: "Coffee",        icon: <Coffee size={16} /> },
  { name: "UI/UX Design",  icon: <Palette size={16} /> },
  { name: "Gaming",        icon: <Gamepad2 size={16} /> },
  { name: "Reading",       icon: <BookOpen size={16} /> },
];

const timeline = [
  { year: '2022', title: 'Started Engineering', desc: 'Joined Saraswati College of Engineering for Computer Engineering.', icon: <GraduationCap size={16} />, color: '#6366f1' },
  { year: '2023', title: 'First Web Project', desc: 'Built my first fullstack app — a task manager using Node.js and MySQL.', icon: <Code2 size={16} />, color: '#ec4899' },
  { year: '2024', title: 'Freelancing Begins', desc: 'Started taking on freelance projects and building real-world solutions.', icon: <Rocket size={16} />, color: '#06b6d4' },
  { year: '2025', title: 'Open Source & Scale', desc: 'Diving deep into TypeScript, GraphQL, and scalable cloud architectures.', icon: <Sparkles size={16} />, color: '#8b5cf6' },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-36 relative">
      {/* Background orbs */}
      <div className="absolute top-20 right-0 -z-10 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-40 left-0 -z-10 w-[400px] h-[400px] rounded-full opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* ── HERO SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
        <div className="order-2 lg:order-1">
          <div className="section-label mb-4">Behind the Screen</div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.95]">
            I&apos;m{' '}
            <span className="gradient-text">Sachin</span>
            <br />
            <span className="text-4xl md:text-5xl" style={{ color: 'rgba(255,255,255,0.25)' }}>Rathod</span>
          </h1>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <MapPin size={16} style={{ color: '#818cf8' }} />
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Mumbai, India</span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <GraduationCap size={16} style={{ color: '#f9a8d4' }} />
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Computer Engineering Student</span>
          </div>

          <p className="text-lg leading-relaxed mb-10 font-medium" style={{ color: 'rgba(148,153,184,0.8)' }}>
            A passionate fullstack developer who turns ideas into{' '}
            <span className="text-indigo-300 font-bold">pixel-perfect digital experiences</span>.
            I bridge academic theory and real-world innovation — building scalable web apps with modern tech stacks.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl text-center group transition-all duration-300"
                style={{
                  background: 'rgba(10,15,30,0.8)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${stat.color}35`;
                  e.currentTarget.style.boxShadow = `0 0 20px ${stat.glow}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-premium btn-primary px-8 py-4 text-base">
              Get in Touch <ArrowRight size={16} />
            </Link>
            <Link href="/projects" className="btn-premium btn-outline px-8 py-4 text-base">
              See My Work
            </Link>
          </div>
        </div>

        {/* Profile image */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative group">
            <div
              className="absolute -inset-6 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(236,72,153,0.25))' }}
            />
            <div className="relative" style={{ animation: 'float 5s ease-in-out infinite' }}>
              <div className="absolute -inset-4 rounded-[3rem]" style={{ border: '1px solid rgba(99,102,241,0.18)' }} />
              <div className="absolute -inset-8 rounded-[3.5rem]" style={{ border: '1px solid rgba(236,72,153,0.08)' }} />
              <div
                className="w-72 h-72 md:w-[400px] md:h-[400px] rounded-[2.5rem] overflow-hidden"
                style={{ border: '2px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}
              >
                <Image
                  src={profileImg}
                  alt="Sachin Rathod"
                  width={450}
                  height={450}
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-700"
                />
              </div>
              {/* Floating badges */}
              {[
                { comp: <Code2 style={{ color: '#818cf8' }} size={22} />, pos: '-top-5 -right-5', delay: '0.5s' },
                { comp: <Rocket style={{ color: '#f9a8d4' }} size={22} />, pos: '-bottom-5 -left-5', delay: '1s' },
                { comp: <Heart style={{ color: '#f87171' }} size={18} />, pos: 'top-1/2 -right-7', delay: '0.2s' },
              ].map((b, i) => (
                <div key={i}
                  className={`absolute ${b.pos} p-3.5 rounded-2xl`}
                  style={{
                    background: 'rgba(10,15,30,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(12px)',
                    animation: `float 4s ease-in-out infinite ${b.delay}`,
                  }}
                >
                  {b.comp}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
        <div className="lg:col-span-2 space-y-8">
          {/* Story */}
          <section
            className="p-10 rounded-[2rem]"
            style={{
              background: 'linear-gradient(145deg, rgba(15,22,41,0.9), rgba(10,15,30,0.95))',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            }}
          >
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
                <User style={{ color: '#818cf8' }} size={20} />
              </div>
              My Story
            </h2>
            <div className="space-y-5 text-base leading-relaxed font-medium" style={{ color: 'rgba(148,153,184,0.7)' }}>
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
                className="p-7 rounded-3xl group transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, rgba(15,22,41,0.9), rgba(10,15,30,0.95))',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${item.color}30`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${item.color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="mb-4 p-3 rounded-2xl w-fit" style={{ background: item.bg }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
                <h3 className="text-white font-black mb-2 text-sm">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.description}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <section
            className="p-10 rounded-[2rem]"
            style={{
              background: 'linear-gradient(145deg, rgba(15,22,41,0.9), rgba(10,15,30,0.95))',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            }}
          >
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ background: 'rgba(236,72,153,0.12)' }}>
                <Rocket style={{ color: '#f9a8d4' }} size={20} />
              </div>
              My Journey
            </h2>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px timeline-line" />
              <div className="space-y-8 pl-14">
                {timeline.map((t, i) => (
                  <div key={i} className="relative group">
                    <div
                      className="absolute -left-9 top-0.5 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: `${t.color}15`,
                        border: `1px solid ${t.color}35`,
                        color: t.color,
                      }}
                    >
                      {t.icon}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: t.color }}>{t.year}</div>
                    <h4 className="text-white font-bold mb-1">{t.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Interests */}
          <section
            className="p-7 rounded-[2rem]"
            style={{
              background: 'linear-gradient(145deg, rgba(15,22,41,0.9), rgba(10,15,30,0.95))',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
              <Heart style={{ color: '#f87171' }} size={18} /> Interests
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {interests.map((interest) => (
                <div
                  key={interest.name}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.65)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                  }}
                >
                  <span>{interest.icon}</span>
                  {interest.name}
                </div>
              ))}
            </div>
          </section>

          {/* Connect */}
          <section
            className="p-7 rounded-[2rem] relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(15,22,41,0.9), rgba(10,15,30,0.95))',
              border: '1px solid rgba(99,102,241,0.12)',
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(20px)' }} />
            <h3 className="text-lg font-black text-white mb-2">Connect with Me</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>Always down for a chat about tech or a new project.</p>
            <div className="space-y-3">
              {[
                { icon: <Mail size={16} />, text: 'rthodsachin0766@gmail.com', href: 'mailto:rthodsachin0766@gmail.com' },
                { icon: <Github size={16} />, text: 'github.com/FNICKE', href: 'https://github.com/FNICKE' },
                { icon: <Linkedin size={16} />, text: 'linkedin.com/in/sachin-rathod', href: 'https://www.linkedin.com/in/sachin-rathod-469168310' },
              ].map(item => (
                <a key={item.text} href={item.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 text-sm font-medium group transition-all"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >
                  <span className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.05)', color: '#818cf8' }}>
                    {item.icon}
                  </span>
                  {item.text}
                </a>
              ))}
            </div>
          </section>

          {/* Resume */}
          <Link
            href="https://documentcloud.adobe.com/gsuiteintegration/index.html?state=%7B%22ids%22%3A%5B%221pXLvhJhhc3a4cho4Tm44MoMDNiwtK1op%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22109665752571630055379%22%2C%22resourceKeys%22%3A%7B%7D%7D"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 text-base font-black text-white rounded-2xl transition-all"
            style={{
              background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
              boxShadow: '0 8px 25px rgba(236,72,153,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(236,72,153,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(236,72,153,0.35)'; }}
          >
            <ExternalLink size={16} /> Download My Resume
          </Link>
        </div>
      </div>

      {/* ── QUOTE ── */}
      <section
        className="p-12 md:p-16 rounded-[2.5rem] text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(15,22,41,0.95), rgba(10,15,30,0.98))',
          border: '1px solid rgba(99,102,241,0.12)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5), transparent)', filter: 'blur(40px)' }} />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.4), transparent)', filter: 'blur(40px)' }} />
        <div className="relative z-10">
          <div className="text-6xl mb-6 select-none" style={{ color: '#6366f1' }}>&quot;</div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 italic tracking-tight">
            Code is <span className="gradient-text">poetry</span> written in logic.
          </h2>
          <p className="font-bold tracking-widest uppercase text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>— Sachin Rathod</p>
        </div>
      </section>
    </div>
  );
}
