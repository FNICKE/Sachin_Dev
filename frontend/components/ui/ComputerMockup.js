"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code2, LayoutGrid, Database, GitBranch, Shield, Zap, Rocket } from 'lucide-react';


const ScreenContent = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Terminal', icon: <Terminal size={14} /> },
    { name: 'App.jsx', icon: <Code2 size={14} /> },
    { name: 'Layout', icon: <LayoutGrid size={14} /> },
    { name: 'Database', icon: <Database size={14} /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tabs.length]);

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-white overflow-hidden rounded-sm font-mono text-[10px] md:text-xs">
      {/* Fake Header */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#2d2d2d] border-b border-[#3c3c3c]">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <div className="text-[#a0a0a0] text-[10px] flex-1 text-center font-sans tracking-wide">
          sachin_portfolio - VS Code
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex bg-[#252526] overflow-hidden">
        {tabs.map((tab, idx) => (
          <div 
            key={tab.name}
            className={`flex items-center space-x-2 px-3 py-1 cursor-pointer transition-colors ${
              activeTab === idx ? 'bg-[#1e1e1e] text-white border-t border-blue-500' : 'bg-[#2d2d2d] text-[#858585] hover:bg-[#2a2d2e]'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-2 md:p-3 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 p-3 flex flex-col"
          >
            {activeTab === 0 && (
              <div className="text-[#cccccc] space-y-1">
                <div className="text-green-400">guest@sachin:~$ npm start</div>
                <div className="text-blue-400">&gt; Starting development server...</div>
                <div>Compiled successfully!</div>
                <div><br/></div>
                <div>You can now view <span className="text-white font-bold">portfolio</span> in the browser.</div>
                <div><br/></div>
                <div>  Local:            <span className="text-blue-400 underline">http://localhost:3000</span></div>
                <div>  On Your Network:  <span className="text-blue-400 underline">http://192.168.1.5:3000</span></div>
                <div><br/></div>
                <div className="text-green-400 flex items-center">guest@sachin:~$ <span className="w-2 h-4 bg-white/70 ml-1 animate-pulse"></span></div>
              </div>
            )}
            
            {activeTab === 1 && (
              <div className="text-[#d4d4d4] space-y-1 whitespace-pre font-mono">
                <span className="text-[#c586c0]">import</span> <span className="text-[#4fc1ff]">React</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'react'</span>;{"\n"}
                <span className="text-[#c586c0]">import</span> <span className="text-[#9cdcfe]">HeroSection</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'./Hero'</span>;{"\n"}
                {"\n"}
                <span className="text-[#569cd6]">const</span> <span className="text-[#dcdcaa]">App</span> <span className="text-[#d4d4d4]">=</span> <span className="text-[#569cd6]">()</span> <span className="text-[#569cd6]">=&gt;</span> {"{"}{"\n"}
                {"  "}<span className="text-[#c586c0]">return</span> {"("}{"\n"}
                {"    "}&lt;<span className="text-[#569cd6]">div</span> <span className="text-[#9cdcfe]">className</span>=<span className="text-[#ce9178]">"app-wrapper"</span>&gt;{"\n"}
                {"      "}&lt;<span className="text-[#4ec9b0]">HeroSection</span> /&gt;{"\n"}
                {"      "}&lt;<span className="text-[#4ec9b0]">ProjectsGrid</span> /&gt;{"\n"}
                {"    "}&lt;/<span className="text-[#569cd6]">div</span>&gt;{"\n"}
                {"  "}{");"}{"\n"}
                {"}"};{"\n"}
                {"\n"}
                <span className="text-[#c586c0]">export default</span> <span className="text-[#4fc1ff]">App</span>;
              </div>
            )}

            {activeTab === 2 && (
              <div className="w-full h-full flex flex-col gap-2">
                <div className="text-xs text-indigo-400 mb-2">/* Component Structure */</div>
                <div className="flex-1 border-2 border-dashed border-[#404040] rounded flex items-center justify-center bg-[#1e1e1e] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                  <div className="text-[#858585] group-hover:text-white transition-colors duration-300 z-10 flex flex-col items-center">
                    <LayoutGrid className="mb-2 opacity-50" size={24} />
                    UI Render Engine
                  </div>
                </div>
                <div className="flex gap-2 h-1/3">
                  <div className="flex-1 border-2 border-dashed border-[#404040] rounded bg-[#252526] flex items-center justify-center">
                    <span className="text-[#858585] text-[10px]">Sidebar</span>
                  </div>
                  <div className="flex-[2] border-2 border-dashed border-[#404040] rounded bg-[#252526] flex items-center justify-center">
                    <span className="text-[#858585] text-[10px]">Content</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="h-full flex flex-col justify-center items-center text-[#d4d4d4]">
                <Database size={40} className="text-cyan-500 mb-4 animate-pulse" />
                <div className="w-full max-w-[200px]">
                  <div className="flex justify-between mb-1 text-[10px]">
                    <span className="text-cyan-400">Query Speed</span>
                    <span>12ms</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#404040] rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[95%]"></div>
                  </div>
                </div>
                <div className="w-full max-w-[200px] mt-4">
                  <div className="flex justify-between mb-1 text-[10px]">
                    <span className="text-green-400">Uptime</span>
                    <span>99.9%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#404040] rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[99%]"></div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <GitBranch className="text-[#858585] hover:text-white cursor-pointer" size={16} />
                  <Shield className="text-[#858585] hover:text-white cursor-pointer" size={16} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Footer bar */}
      <div className="h-4 bg-[#007acc] w-full flex items-center px-2 text-white text-[8px] font-sans">
        master* | Next.js | Tailwind CSS
      </div>
    </div>
  );
};

export default function ComputerMockup() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, type: 'spring', bounce: 0.4 }}
      className="relative mx-auto w-full max-w-[600px] perspective-[1000px] z-20"
    >
      {/* Monitor Display / Screen */}
      <motion.div 
        animate={{ rotateX: [0, 5, 0], rotateY: [0, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-black rounded-xl p-1 md:p-2 border border-white/10 shadow-2xl shadow-indigo-500/20 aspect-[16/10] overflow-hidden transform-style-3d"
      >
        {/* The glowing bezel */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10 border border-white/5" />
        
        {/* The screen content */}
        <div className="w-full h-full rounded-lg bg-[#1e1e1e] overflow-hidden relative z-0">
          <ScreenContent />
        </div>
      </motion.div>

      {/* Laptop Stand / Base (simplified flat minimal stand) */}
      <div className="relative w-[120%] -left-[10%] h-3 md:h-4 bg-gradient-to-b from-gray-300 to-gray-500 rounded-b-xl shadow-2xl flex justify-center mt-[-1px] z-10">
        {/* Trackpad notch */}
        <div className="w-16 md:w-24 h-1 md:h-1.5 bg-gray-400 rounded-b opacity-50 absolute top-0" />
      </div>

      {/* Floating reflection/shadow under the computer */}
      <div className="w-full h-10 mt-2 bg-indigo-500/10 blur-xl rounded-full scale-90" />
      
      {/* Decorative Floating elements around the computer */}
      <motion.div 
        animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-8 top-12 md:top-24 w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-xl z-30"
      >
        <Zap size={24} className="text-yellow-400" />
      </motion.div>
      
      <motion.div 
        animate={{ y: [10, -10, 10], rotate: [0, -10, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-6 bottom-16 md:bottom-24 w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-xl z-30"
      >
        <Rocket size={24} className="text-emerald-400" />
      </motion.div>

    </motion.div>
  );
}
