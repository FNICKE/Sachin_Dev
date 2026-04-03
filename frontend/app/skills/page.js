"use client";
import React from 'react';
import SkillsSection from '@/components/sections/SkillsSection';

export default function SkillsPage() {
  return (
    <div className="section-padding pt-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <div className="section-label justify-center">Galaxy of Skills</div>
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
          <p className="text-xl text-white/40 font-medium">
            Watch my skills orbit through the cosmos — tools, languages, and frameworks I wield to build the future.
          </p>
        </div>

        <SkillsSection />
      </div>

      <style>{`
        /* Starfield behind the page */
        .section-padding {
          position: relative;
        }
      `}</style>
    </div>
  );
}
