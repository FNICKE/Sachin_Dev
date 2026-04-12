"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, Github, Linkedin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ComputerMockup from '../ui/ComputerMockup';

const HeroSection = () => {
  const [resumeUrl, setResumeUrl] = useState('https://documentcloud.adobe.com/gsuiteintegration/index.html?state=%7B%22ids%22%3A%5B%221pXLvhJhhc3a4cho4Tm44MoMDNiwtK1op%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22109665752571630055379%22%2C%22resourceKeys%22%3A%7B%7D%7D');

  useEffect(() => {
    import('@/lib/api').then(module => {
      const { default: api, BASE_URL } = module;
      api.get('/settings/resume').then(({ data }) => {
        if (data?.data?.resume_url) {
          const url = data.data.resume_url;
          setResumeUrl(url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`);
        }
      }).catch(() => { });
    });
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center pt-24 pb-20 px-6 overflow-hidden">

      {/* Background details */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7aa2f7]/20 to-transparent" />
        <div className="absolute top-2/4 right-0 w-2/3 h-px bg-gradient-to-r from-transparent via-[#bb9af7]/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Side: Content */}
        <div className="flex flex-col items-start text-left">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white leading-[1.1] tracking-tight mb-6"
          >
            I build <span className="text-[#7aa2f7]">robust</span> & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bb9af7] to-[#7aa2f7]">pixel-perfect</span> <br />
            digital solutions.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-xl text-[#9499b8] text-lg md:text-xl font-medium leading-relaxed mb-10"
          >
            Focused on fullstack excellence and clean architecture. I turn complex ideas into seamless user experiences using modern ecosystems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-5"
          >
            <Link
              href="/projects"
              className="px-8 py-4 bg-[#7aa2f7] text-[#16161e] rounded-xl font-bold flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgb(122,162,247,0.3)] transition-all duration-300 active:scale-95"
            >
              Examine My Work
              <ArrowRight size={18} />
            </Link>
            <a
              href={resumeUrl}
              target="_blank"
              className="px-8 py-4 border border-[#565f89]/30 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-white/5 transition-all active:scale-95"
            >
              <Download size={18} />
              Resume
            </a>
          </motion.div>

          {/* Socials Link Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center gap-8 text-[#565f89]"
          >
            <a href="https://github.com/FNICKE" target="_blank" className="hover:text-[#7aa2f7] transition-colors flex items-center gap-2">
              <Github size={20} />
              <span className="text-sm font-semibold">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/sachin-rathod-469168310" target="_blank" className="hover:text-[#7aa2f7] transition-colors flex items-center gap-2">
              <Linkedin size={20} />
              <span className="text-sm font-semibold">LinkedIn</span>
            </a>
          </motion.div>
        </div>

        {/* Right Side: Visual Hook (Computer Mockup) */}
        <div className="relative hidden lg:block">
          <ComputerMockup />
        </div>

      </div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="relative z-10 max-w-7xl mx-auto w-full mt-24 pt-12 border-t border-white/5 flex flex-wrap gap-12 md:gap-24"
      >
        <div className="flex flex-col">
          <span className="text-3xl font-black text-[#7aa2f7]">20+</span>
          <span className="text-[#565f89] text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Deployments</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-black text-[#bb9af7]">1+</span>
          <span className="text-[#565f89] text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Exp Years</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-black text-[#9ece6a]">15+</span>
          <span className="text-[#565f89] text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Satisfied Clients</span>
        </div>
      </motion.div>

    </section>
  );
};

export default HeroSection;
