"use client";
import React from 'react';
import SkillsSection from '@/components/sections/SkillsSection';

export default function SkillsPage() {
  return (
    <div className="section-padding pt-44">
       <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
             <div className="section-label justify-center">Proficiency</div>
             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">My Tech Stack</h1>
             <p className="text-xl text-white/40 font-medium">Tools, languages, and frameworks I use to build robust digital solutions.</p>
          </div>
          <SkillsSection />
       </div>
    </div>
  );
}
