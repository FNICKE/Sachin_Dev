"use client";

import React, { useEffect } from 'react';
import Terminal from '@/components/ui/Terminal';
import { motion } from 'framer-motion';

export default function ConsolePage() {
  // Background particles or simple stars effect
  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">
      
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-black"></div>
      
      <div className="absolute inset-0 bg-mesh opacity-20 z-0 mix-blend-screen"></div>

      {/* Title Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="z-10 mb-8 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-indigo-500 tracking-tight">
          Developer Console
        </h1>
        <p className="text-slate-400 mt-2 text-sm md:text-base max-w-xl mx-auto">
          Experience my portfolio through a highly interactive command-line interface. Go ahead, type something.
        </p>
      </motion.div>

      {/* Terminal Container */}
      <div className="w-full max-w-6xl z-10 relative">
        {/* Glow effect behind terminal */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-indigo-500 rounded-xl blur-lg opacity-20 animate-pulse z-0"></div>
        <div className="relative z-10">
          <Terminal />
        </div>
      </div>
      
      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="z-10 mt-8 text-slate-500 text-xs tracking-widest uppercase font-mono"
      >
        <span className="inline-block animate-pulse mr-2">●</span> System Online
      </motion.div>
    </div>
  );
}
