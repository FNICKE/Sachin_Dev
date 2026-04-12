"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SkillsSection from '@/components/sections/SkillsSection';
import { Terminal } from 'lucide-react';

const SYSTEM_LOGS = [
  "Initializing technical matrix...",
  "Loading architectural frameworks...",
  "Syncing full-stack dependencies...",
  "Optimizing interface protocols...",
  "Interface ready. Awaiting interaction."
];

export default function SkillsPage() {
  return (
    <div className="section-padding pt-32 pb-20 min-h-screen bg-[#020817] relative overflow-hidden">
      
      {/* Background decorations - subtle pulses */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-5 pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#7aa2f7]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#bb9af7]/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
        
        {/* The Console Header - The central focus as requested */}
        <div className="flex flex-col items-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col w-full max-w-2xl h-60 bg-[#16161e] border border-white/10 rounded-[2rem] p-6 font-mono text-[11px] relative overflow-hidden group hover:border-[#7aa2f7]/40 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
                <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#f7768e]/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#e0af68]/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#9ece6a]/40" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#565f89]">Skill_Matrix_Deployment.log</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 overflow-hidden">
                    {SYSTEM_LOGS.map((log, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.12 }}
                            className="flex gap-3"
                        >
                            <span className="text-[#7aa2f7] font-black opacity-50">[{new Date().getHours()}:{new Date().getMinutes()}:{new Date().getSeconds()}]</span>
                            <span className="text-[#bb9af7] font-bold opacity-80">{'>'}</span>
                            <span className="text-[#c0caf5] font-medium tracking-tight">{log}</span>
                        </motion.div>
                    ))}
                    <motion.div 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-2 h-4 bg-[#7aa2f7] mt-1 shadow-[0_0_10px_#7aa2f7]"
                    />
                </div>
                
                {/* Visual Flair */}
                <Terminal size={100} className="absolute -bottom-10 -right-10 text-white opacity-[0.02] -rotate-12 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7aa2f7]/5 blur-3xl pointer-events-none" />
            </motion.div>
        </div>

        {/* ── SKILLS INTERFACE ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="bg-transparent"
        >
          <SkillsSection />
        </motion.div>

        {/* Status Bar */}
        <div className="mt-12 flex items-center justify-center gap-12 opacity-30 border-t border-white/5 pt-12">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#9ece6a] rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#565f89]">Matrix Online</span>
            </div>
            <div className="flex items-center gap-2 border-l border-white/10 pl-12">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#565f89]">Protocol: Neural_Hub_V4</span>
            </div>
        </div>

      </div>

      <style jsx>{`
        .bg-grid {
          background-image: 
            linear-gradient(rgba(122, 162, 247, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122, 162, 247, 0.05) 1px, transparent 1px);
          background-size: 70px 70px;
        }
      `}</style>
    </div>
  );
}
