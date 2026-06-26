"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minus, X, Terminal as TerminalIcon } from 'lucide-react';
import Link from 'next/link';

const COMMANDS = {
  help: {
    description: 'List all available commands',
    output: () => (
      <div className="text-[#a9b1d6]">
        <p className="mb-2 text-[#7aa2f7] font-bold">System Manifest:</p>
        <ul className="space-y-1">
          <li><span className="text-[#9ece6a] w-24 inline-block tracking-wider">about</span> <span className="text-[#565f89]">--</span> Identity identification</li>
          <li><span className="text-[#9ece6a] w-24 inline-block tracking-wider">skills</span> <span className="text-[#565f89]">--</span> Capabilities inventory</li>
          <li><span className="text-[#9ece6a] w-24 inline-block tracking-wider">projects</span> <span className="text-[#565f89]">--</span> Deployment history</li>
          <li><span className="text-[#9ece6a] w-24 inline-block tracking-wider">contact</span> <span className="text-[#565f89]">--</span> Establish communication</li>
          <li><span className="text-[#9ece6a] w-24 inline-block tracking-wider">clear</span> <span className="text-[#565f89]">--</span> Scrub console memory</li>
          <li><span className="text-[#9ece6a] w-24 inline-block tracking-wider">gui</span> <span className="text-[#565f89]">--</span> Toggle visual interface</li>
          <li><span className="text-[#9ece6a] w-24 inline-block tracking-wider">sudo</span> <span className="text-[#565f89]">--</span> Administrative override</li>
        </ul>
      </div>
    ),
  },
  about: {
    description: 'Identity identification',
    output: () => (
      <div className="text-[#a9b1d6] max-w-2xl space-y-3 leading-relaxed">
        <p className="flex items-center gap-2">
          <span className="text-[#7aa2f7]">#</span> 
          <span>Guest ID authenticated as <span className="text-[#bb9af7] font-bold">Observer</span>.</span>
        </p>
        <p>I am a <span className="text-[#7aa2f7] italic font-semibold">Fullstack Engineer</span> specializing in high-performance digital architecture. I believe in pixel-perfection and robust engineering principles.</p>
        <p>Currently researching distributed systems and advanced UI orchestration patterns.</p>
      </div>
    ),
  },
  skills: {
    description: 'Capabilities inventory',
    output: () => (
      <div className="text-[#a9b1d6]">
        <p className="mb-4 font-bold text-[#7aa2f7] flex items-center gap-2">
          <span className="w-2 h-2 bg-[#7aa2f7] rounded-full animate-pulse"></span>
          Primary Tech Stack
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
          {[
            { name: 'TypeScript', color: '#7aa2f7' },
            { name: 'React / Next.js', color: '#7dcfff' },
            { name: 'Node.js', color: '#9ece6a' },
            { name: 'Python / AI', color: '#e0af68' },
            { name: 'Tailwind CSS', color: '#2ac3de' },
            { name: 'SQL / NoSQL', color: '#f7768e' },
          ].map((skill) => (
            <div key={skill.name} className="flex items-center space-x-3 group">
              <div className="w-1 h-3 rounded-full bg-[#565f89] group-hover:bg-[#7aa2f7] transition-colors"></div>
              <span className="font-mono text-sm">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  projects: {
    description: 'Deployment history',
    output: () => (
      <div className="space-y-4">
        {[
          { name: 'Neural Nexus', tech: 'Next.js, LangChain, Postgres', link: '/projects/nexus' },
          { name: 'Aesthetic.UI', tech: 'React, Spline, Three.js', link: '/projects/ui' },
          { name: 'Core.Sync', tech: 'Go, Redis, Websockets', link: '/projects/sync' },
        ].map((project, idx) => (
          <div key={idx} className="group border-l-2 border-[#565f89] hover:border-[#7aa2f7] pl-4 py-1.5 transition-all bg-white/[0.02] hover:bg-[#7aa2f7]/5 rounded-r-md">
            <div className="font-bold text-[#7aa2f7] tracking-tight">{project.name}</div>
            <div className="text-xs text-[#565f89] font-semibold">{project.tech}</div>
          </div>
        ))}
        <p className="text-[10px] text-[#565f89] mt-4 uppercase tracking-[0.2em]">End of list. Type 'gui' for full archive.</p>
      </div>
    ),
  },
  contact: {
    description: 'Establish communication',
    output: () => (
      <div className="text-[#a9b1d6] space-y-3">
        <p className="text-[#565f89] font-bold text-xs uppercase tracking-widest">Protocol available via:</p>
        <div className="space-y-2">
          <p className="flex items-center gap-4">
            <span className="text-[#f7768e] font-mono text-xs w-16">MAIL:</span>
            <a href="mailto:contact@sachin.dev" className="hover:text-[#7aa2f7] underline decoration-[#7aa2f7]/30 transition-colors">contact@sachin.dev</a>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-[#e0af68] font-mono text-xs w-16">SOCIAL:</span>
            <a href="#" className="hover:text-[#7aa2f7] transition-colors">/in/sachin-rathod</a>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-[#9ece6a] font-mono text-xs w-16">GIT:</span>
            <a href="#" className="hover:text-[#7aa2f7] transition-colors">@FNICKE</a>
          </p>
        </div>
      </div>
    ),
  },
  sudo: {
    description: 'Administrative override',
    output: () => (
      <div className="text-[#f7768e] font-bold animate-pulse p-4 border border-[#f7768e]/20 bg-[#f7768e]/5 rounded-md">
        CRITICAL: UNAUTHORIZED OVERRIDE ATTEMPTED. 
        <br />
        IP LOGGED: 127.0.0.1. ESCALATING TO SYSADMIN.
      </div>
    )
  },
  gui: {
    description: 'Toggle visual interface',
    output: () => (
      <div className="text-[#9ece6a]">
        Initializing React Render Cycle... <span className="animate-pulse">|</span>
        <br />
        <Link href="/" className="text-[#7aa2f7] hover:underline mt-2 inline-block font-bold">Mount Root/Interface</Link>
      </div>
    )
  }
};

export default function Terminal() {
  const [history, setHistory] = useState([
    {
      command: '',
      output: (
        <div className="mb-6">
          <div className="text-[#7aa2f7] font-bold">
            <pre className="hidden sm:block text-[10px] sm:text-xs leading-none">
{`
   ██████╗ █████╗  ██████╗██╗  ██╗██╗███╗   ██╗
  ██╔════╝██╔══██╗██╔════╝██║  ██║██║████╗  ██║
  ╚█████╗ ███████║██║     ███████║██║██╔██╗ ██║
   ╚═══██╗██╔══██║██║     ██╔══██║██║██║╚██╗██║
  ██████╔╝██║  ██║╚██████╗██║  ██║██║██║ ╚████║
  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
`}
            </pre>
            <p className="sm:hidden text-2xl font-black mb-2 tracking-tighter">SACHIN.OS</p>
          </div>
          <div className="h-px w-full bg-[#565f89]/20 my-4"></div>
          <p className="text-[#a9b1d6] opacity-80">SACHIN DEV CONSOLE [Version 10.4.0]</p>
          <p className="text-[#565f89] text-[10px] uppercase tracking-widest mt-1">Terminal connection established via secure node.</p>
          <p className="text-[#a9b1d6] text-sm mt-4">Type <span className="text-[#9ece6a] bg-[#9ece6a]/10 px-2 py-0.5 rounded-sm font-bold">manifest</span> for command directory.</p>
        </div>
      ),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    const handleGlobalClick = () => {
      inputRef.current?.focus();
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    
    if (!cmd) return;

    if (cmd === 'manifest') {
       setInputVal('help');
       // Mock the command transition
       const fakeEvent = { preventDefault: () => {} };
       handleCommandImpl('help');
    } else {
       handleCommandImpl(cmd);
    }
  };

  const handleCommandImpl = (cmd) => {
    let output;

    if (cmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (COMMANDS[cmd]) {
      output = COMMANDS[cmd].output();
    } else {
      output = (
        <div className="text-[#f7768e] flex items-center gap-2">
          <span>Unknown sequence: '{cmd}'. Error Code 404.</span>
        </div>
      );
    }

    setHistory((prev) => [
      ...prev,
      {
        command: cmd,
        output,
      },
    ]);
    setInputVal('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#16161e] bg-[#1a1b26]/95 backdrop-blur-xl font-mono text-sm h-[80vh] min-h-[500px]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Terminal Header */}
      <div className="flex items-center px-5 py-3 bg-[#16161e] select-none">
        <div className="flex space-x-2.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#f7768e] shadow-[0_0_10px_#f7768e50]"></div>
          <div className="w-3 h-3 rounded-full bg-[#e0af68] shadow-[0_0_10px_#e0af6850]"></div>
          <div className="w-3 h-3 rounded-full bg-[#9ece6a] shadow-[0_0_10px_#9ece6a50]"></div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <TerminalIcon size={12} className="text-[#565f89] mr-2" />
          <span className="text-[#565f89] text-[10px] font-bold tracking-widest uppercase">guest@sachin.os: ~</span>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Terminal Body */}
      <div 
        className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar relative overflow-x-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence initial={false}>
          {history.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 relative z-10"
            >
              {item.command && (
                <div className="flex items-center text-[#c0caf5] mb-2 font-bold">
                  <span className="text-[#9ece6a] mr-2 opacity-80">❱❱</span>
                  <span className="text-[#bb9af7] mr-2">guest</span>
                  <span className="text-[#565f89] mr-2">in</span>
                  <span className="text-[#7aa2f7] mr-2">/root</span>
                  <span>{item.command}</span>
                </div>
              )}
              <div className="pl-6 border-l border-[#565f89]/20 ml-1.5 pb-2">
                {item.output}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current Input Line */}
        <form onSubmit={handleCommand} className="flex items-center mt-2 group relative z-10">
          <div className="flex items-center text-[#c0caf5] font-bold mr-3">
            <span className="text-[#9ece6a] mr-2 animate-pulse">❱❱</span>
            <span className="text-[#bb9af7] mr-2">guest</span>
            <span className="text-[#565f89] mr-2">in</span>
            <span className="text-[#7aa2f7]">/root</span>
          </div>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent text-[#7aa2f7] outline-none border-none focus:ring-0 p-0 m-0 font-mono tracking-wider font-bold"
              autoFocus
              spellCheck="false"
              autoComplete="off"
            />
          </div>
        </form>
        
        <div ref={endOfMessagesRef} />
        
        {/* Subtle grid in terminal */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#565f89_1px,transparent_1px)] bg-[size:30px_30px] opacity-[0.02]"></div>
      </div>

      {/* Scanline Effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-10 z-50"></div>
    </motion.div>
  );
}
