"use client";
import ProjectsGrid from '@/components/sections/ProjectsGrid';
import { Briefcase, Filter, Search } from 'lucide-react';

export default function PublicProjects() {
  return (
    <div className="section-padding pt-44">
       <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-4">
             <div className="section-label">Inventory</div>
             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Project Archives</h1>
             <p className="text-xl text-white/40 max-w-2xl font-medium">A technical deep-dive into the modules, applications, and architectures I've built from the ground up.</p>
          </div>
          <ProjectsGrid />
       </div>
    </div>
  );
}
