"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SkillsSection from '@/components/sections/SkillsSection';
import { Layers, Cpu, Globe2, Database, Wrench, Sparkles } from 'lucide-react';

const categories = [
  { icon: <Globe2 size={18} />, label: 'Frontend', color: '#61DAFB' },
  { icon: <Database size={18} />, label: 'Backend', color: '#68A063' },
  { icon: <Cpu size={18} />, label: 'Database', color: '#00758F' },
  { icon: <Wrench size={18} />, label: 'DevTools', color: '#F7DF1E' },
  { icon: <Layers size={18} />, label: 'Cloud', color: '#FF9900' },
];

export default function SkillsPage() {
  return (
    <div className="section-padding pt-36 min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-40 left-0 w-96 h-96 opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', filter: 'blur(60px)', borderRadius: '50%' }} />
      <div className="absolute bottom-20 right-0 w-80 h-80 opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)', filter: 'blur(60px)', borderRadius: '50%' }} />

      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-5 text-center items-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="section-label justify-center"
          >
            <Sparkles size={14} className="text-yellow-400" /> Galaxy of Skills
          </motion.div>
          <h1
            className="text-5xl md:text-7xl font-black tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, #a5b4fc 0%, #c084fc 30%, #ec4899 60%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            My Tech Universe
          </h1>
          <p className="text-xl text-white/40 font-medium leading-relaxed">
            Watch my skills orbit through the cosmos — tools, languages, and frameworks I wield to build the future.
          </p>
        </motion.div>

        {/* Category chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              whileHover={{ scale: 1.08, y: -2 }}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl glass-panel border border-white/10 text-sm font-bold"
              style={{ color: cat.color }}
            >
              {cat.icon} {cat.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Skills galaxy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SkillsSection />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-3xl p-10 text-center border border-white/5 relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5), transparent)', filter: 'blur(30px)' }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Always <span className="gradient-text">Learning</span>
            </h2>
            <p className="text-white/40 font-medium max-w-md mx-auto mb-8">
              Technology never stops evolving — and neither do I. Currently exploring TypeScript, GraphQL, and cloud-native architectures.
            </p>
            <a href="/contact" className="btn-premium btn-primary px-8 py-4 inline-flex">
              <Sparkles size={16} className="text-yellow-300" /> Let&apos;s Build Something
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
