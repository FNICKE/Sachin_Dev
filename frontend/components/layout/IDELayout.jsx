"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Files, Search, GitBranch, Mail, Settings, 
  ChevronRight, ChevronDown, Terminal,
  X, GitCommit, User, Briefcase, Code2, Home as HomeIcon
} from 'lucide-react';

const EXPLORER_ITEMS = [
  { name: 'Home.jsx', path: '/', icon: <HomeIcon size={14} className="text-[#7aa2f7]" /> },
  { name: 'Projects.ts', path: '/projects', icon: <Briefcase size={14} className="text-[#e0af68]" /> },
  { name: 'Skills.json', path: '/skills', icon: <Code2 size={14} className="text-[#9ece6a]" /> },
  { name: 'Experience.tsx', path: '/about', icon: <User size={14} className="text-[#bb9af7]" /> },
  { name: 'Terminal.sh', path: '/console', icon: <Terminal size={14} className="text-[#565f89]" /> },
  { name: 'Contact.css', path: '/contact', icon: <Mail size={14} className="text-[#f7768e]" /> },
];

export default function IDELayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isPortfolioOpen, setPortfolioOpen] = useState(true);

  // Determine current active file
  const activeFile = EXPLORER_ITEMS.find((item) => {
    if (item.path === '/') return pathname === '/';
    return pathname.startsWith(item.path);
  }) || EXPLORER_ITEMS[0];

  return (
    <div className="flex h-screen w-full bg-[#1a1b26] text-[#a9b1d6] font-sans overflow-hidden selection:bg-[#28344a] selection:text-white">
      
      {/* Activity Bar */}
      <div className="w-12 md:w-16 h-full flex flex-col items-center py-4 bg-[#16161e] border-r border-[#1a1b26] z-20 shrink-0 shadow-xl">
        <div className="flex flex-col gap-6 flex-1 w-full items-center">
          <div 
            className={`cursor-pointer p-2 rounded-xl transition-all duration-300 relative group ${isSidebarOpen ? 'text-[#7aa2f7] bg-[#7aa2f7]/10' : 'text-[#565f89] hover:text-[#7aa2f7] hover:bg-white/5'}`}
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Files size={24} strokeWidth={1.5} />
            {isSidebarOpen && <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 h-8 w-1 bg-[#7aa2f7] rounded-r-full shadow-[0_0_10px_#7aa2f7]" />}
          </div>
          <Link href="/projects" className="cursor-pointer p-2 rounded-xl text-[#565f89] hover:text-[#7aa2f7] hover:bg-white/5 transition-all">
            <Search size={24} strokeWidth={1.5} />
          </Link>
          <div className="cursor-pointer p-2 rounded-xl text-[#565f89] hover:text-[#7aa2f7] hover:bg-white/5 transition-all relative">
            <GitBranch size={24} strokeWidth={1.5} />
            <div className="absolute top-2 right-1.5 w-2 h-2 bg-[#f7768e] rounded-full border-2 border-[#16161e]" />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full items-center pb-2">
          <Link href="/contact" className="cursor-pointer p-2 rounded-xl text-[#565f89] hover:text-[#7aa2f7] hover:bg-white/5 transition-all">
            <Mail size={24} strokeWidth={1.5} />
          </Link>
          <div className="cursor-pointer p-2 rounded-xl text-[#565f89] hover:text-[#7aa2f7] hover:bg-white/5 transition-all">
            <Settings size={28} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Explorer Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 h-full bg-[#16161e] flex flex-col border-r border-[#15161d] shrink-0 hidden md:flex transition-all">
          <div className="px-5 py-4 text-[11px] font-bold tracking-widest text-[#565f89] uppercase flex justify-between items-center opacity-80">
            <span>Explorer</span>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2">
            {/* PORTFOLIO folder */}
            <div 
              className="flex items-center px-2 py-2 cursor-pointer hover:bg-white/5 rounded-lg text-sm text-[#c0caf5] font-semibold transition-colors"
              onClick={() => setPortfolioOpen(!isPortfolioOpen)}
            >
              {isPortfolioOpen ? <ChevronDown size={14} className="mr-2 text-[#7aa2f7]" /> : <ChevronRight size={14} className="mr-2 text-[#7aa2f7]" />}
              <span className="tracking-wide">Portfolio</span>
            </div>

            {/* Files */}
            {isPortfolioOpen && (
              <div className="flex flex-col gap-1 mt-1 pl-4">
                {EXPLORER_ITEMS.map((item) => {
                  const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center px-3 py-1.5 rounded-md cursor-pointer text-sm transition-all ${
                        isActive 
                          ? 'bg-[#bb9af7]/10 text-[#bb9af7] shadow-[inset_0_0_10px_rgba(187,154,247,0.05)]' 
                          : 'hover:bg-white/5 text-[#9499b8] hover:text-[#c0caf5]'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#1a1b26] overflow-hidden min-w-0">
        
        {/* Editor Tabs (Header) */}
        <div className="flex bg-[#16161e] h-[40px] shrink-0 overflow-x-auto no-scrollbar border-b border-[#15161d]">
          {EXPLORER_ITEMS.map((item) => {
            const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
            if (!isActive) return null; 
            return (
              <div key={item.path} className={`flex items-center h-full px-5 border-r border-[#15161d] min-w-fit cursor-pointer transition-all ${isActive ? 'bg-[#1a1b26] text-[#7aa2f7] border-t-2 border-t-[#7aa2f7]' : 'bg-[#16161e] text-[#565f89] hover:bg-[#1a1b26]/50'}`}>
                <span className="mr-3">{item.icon}</span>
                <span className="text-xs font-semibold tracking-wide mr-2">{item.name}</span>
                <X size={12} className="ml-2 hover:bg-[#7aa2f7]/20 rounded-sm p-[1px] transition-colors" />
              </div>
            );
          })}
          <div className="flex-1"></div>
        </div>
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center h-[30px] px-6 bg-[#1a1b26] text-[10px] font-medium text-[#565f89] shrink-0 z-10 w-full overflow-x-hidden border-b border-white/5">
          <span className="hover:text-[#c0caf5] cursor-pointer">src</span>
          <ChevronRight size={12} className="mx-1 opacity-50" />
          <span className="hover:text-[#c0caf5] cursor-pointer">components</span>
          <ChevronRight size={12} className="mx-1 opacity-50" />
          <span className="text-[#c0caf5] font-semibold">{activeFile.name}</span>
        </div>

        {/* Scrollable Editor Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative ide-content-area custom-scrollbar pb-10">
          
          {/* Subtle line numbers overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-[#565f89]/10 hidden lg:flex flex-col items-center py-10 text-[#414868] text-[10px] font-mono select-none pointer-events-none z-0">
            {Array.from({ length: 200 }).map((_, i) => (
              <span key={i} className="leading-[1.8rem]">{i + 1}</span>
            ))}
          </div>

          <div className="relative z-10 min-h-full pl-0 lg:pl-[3.5rem] w-full">
            {children}
          </div>
          
          {/* Overlay Grid Pattern for tactile feel */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#565f89_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] z-0"></div>
        </div>
      </div>

      {/* Status Bar (Footer) */}
      <div className="absolute bottom-0 left-0 right-0 h-[24px] bg-[#7aa2f7] text-[#16161e] flex justify-between items-center px-4 text-[10px] font-bold z-30 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center h-full gap-5">
          <Link href="https://github.com/developer" target="_blank" className="flex items-center cursor-pointer hover:bg-black/10 px-2 py-1 rounded transition-colors group">
            <GitBranch size={12} className="mr-1.5" />
            <span>main*</span>
          </Link>
          <div className="flex items-center cursor-pointer hover:bg-black/10 px-2 py-1 rounded transition-colors gap-1.5">
            <GitCommit size={12} />
            <span>0</span>
            <X size={10} className="ml-1 opacity-50" />
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center h-full gap-5">
          <div className="hidden sm:flex items-center px-2 py-1 rounded hover:bg-black/10 cursor-pointer transition-colors">
            <span>Spaces: 2</span>
          </div>
          <div className="hidden sm:flex items-center px-2 py-1 rounded hover:bg-black/10 cursor-pointer transition-colors uppercase">
            <span>UTF-8</span>
          </div>
          <div className="flex items-center px-2 py-1 bg-[#16161e] text-[#7aa2f7] rounded-sm shadow-sm scale-90">
            <span>Next.js</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-black/10 cursor-pointer transition-colors group">
            <div className="w-2 h-2 rounded-full bg-[#9ece6a] group-hover:animate-pulse shadow-[0_0_5px_#9ece6a]"></div>
            <span>Prettier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
