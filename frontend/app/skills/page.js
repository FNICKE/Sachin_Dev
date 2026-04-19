"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SkillsSection from '@/components/sections/SkillsSection';
import { Terminal, Cpu, Zap, Code2 } from 'lucide-react';

const SYSTEM_LOGS = [
  { text: "Initializing technical matrix...", color: '#9ece6a' },
  { text: "Loading architectural frameworks...", color: '#7aa2f7' },
  { text: "Syncing full-stack dependencies...", color: '#bb9af7' },
  { text: "Optimizing interface protocols...", color: '#e0af68' },
  { text: "✓ Interface ready. Awaiting interaction.", color: '#9ece6a' },
];

const topStats = [
  { label: 'Technologies', value: '15+', icon: <Cpu size={18} />, color: '#7aa2f7' },
  { label: 'Projects Delivered', value: '20+', icon: <Code2 size={18} />, color: '#bb9af7' },
  { label: 'Experience', value: '1+ Yr', icon: <Zap size={18} />, color: '#9ece6a' },
];

export default function SkillsPage() {
  return (
    <div
      className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden"
      style={{ background: '#020817' }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-dense opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'rgba(122,162,247,0.06)', filter: 'blur(120px)' }} />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'rgba(187,154,247,0.06)', filter: 'blur(120px)' }} />

      <div className="max-w-7xl mx-auto flex flex-col gap-14 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-5"
        >
          <div className="section-label justify-center">
            <Terminal size={13} /> Technical Expertise
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            My <span className="gradient-text">Skill Matrix</span>
          </h1>
          <p className="text-xl font-medium leading-relaxed max-w-2xl" style={{ color: 'rgba(148,153,184,0.7)' }}>
            A curated arsenal of tools, technologies, and frameworks I use to craft production-grade software.
          </p>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto w-full"
        >
          {topStats.map((s, i) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex flex-col items-center gap-2 py-5 px-3 rounded-2xl transition-all"
              style={{
                background: 'rgba(10,15,30,0.8)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span style={{ color: s.color }}>{s.icon}</span>
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Console Terminal */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col w-full max-w-2xl rounded-[2rem] p-6 font-mono text-[11px] relative overflow-hidden group transition-all duration-500"
            style={{
              background: '#0d0d14',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(122,162,247,0.35)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            {/* Terminal header */}
            <div className="flex items-center justify-between mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#f7768e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#e0af68' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#9ece6a' }} />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <Terminal size={11} style={{ color: '#565f89' }} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#565f89' }}>
                  skill_matrix.deployment.log
                </span>
              </div>
              <div />
            </div>

            <div className="flex flex-col gap-3">
              {SYSTEM_LOGS.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex gap-3"
                >
                  <span className="font-black opacity-40" style={{ color: '#7aa2f7' }}>
                    [{String(new Date().getHours()).padStart(2, '0')}:{String(new Date().getMinutes()).padStart(2, '0')}]
                  </span>
                  <span className="font-bold opacity-60" style={{ color: '#bb9af7' }}>{'>'}</span>
                  <span className="font-medium tracking-tight" style={{ color: log.color }}>{log.text}</span>
                </motion.div>
              ))}
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-4 mt-1"
                style={{ background: '#7aa2f7', boxShadow: '0 0 10px #7aa2f7' }}
              />
            </div>

            <Terminal size={120} className="absolute -bottom-12 -right-12 -rotate-12 pointer-events-none"
              style={{ color: 'rgba(255,255,255,0.015)' }} />
          </motion.div>
        </div>

        {/* Skills Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <SkillsSection />
        </motion.div>

        {/* Status Bar */}
        <div className="flex items-center justify-center gap-8 pt-8 opacity-25"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#9ece6a' }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#565f89' }}>Matrix Online</span>
          </div>
          <div className="flex items-center gap-2 pl-8" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#565f89' }}>Protocol: Neural_Hub_V4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
