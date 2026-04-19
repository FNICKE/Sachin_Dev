"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import api, { BASE_URL } from '@/lib/api';
import { ExternalLink, Github, ArrowUpRight, Star, Globe, Smartphone, Zap, Rocket, Lightbulb, Terminal, Code2 } from 'lucide-react';

const techColors = {
  'React': '#61DAFB', 'Next.js': '#ffffff', 'Node.js': '#68A063',
  'MongoDB': '#4DB33D', 'MySQL': '#00758F', 'TypeScript': '#3178C6',
  'JavaScript': '#F7DF1E', 'Python': '#3776AB', 'Express': '#a5b4fc',
  'Tailwind': '#38BDF8', 'CSS': '#1572B6', 'HTML': '#E34F26',
};

const getImgUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const categoryIcon = {
  web: <Globe size={32} className="text-indigo-400" />,
  mobile: <Smartphone size={32} className="text-pink-400" />,
  api: <Zap size={32} className="text-cyan-400" />,
  fullstack: <Rocket size={32} className="text-purple-400" />,
  other: <Lightbulb size={32} className="text-yellow-400" />
};

/* ── Holographic 3D Tilt Wrapper ── */
function CyberCard({ children, delay }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: 'spring', damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full flex flex-col group [perspective:1000px]"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex flex-col w-full h-full rounded-2xl bg-black border border-white/10 transition-all duration-300 group-hover:border-indigo-500/50"
      >
        {/* Animated Glow Border behind the card */}
        <div className="absolute -inset-[2px] -z-10 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-40 blur-lg transition duration-500" />
        
        {children}
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, index }) {
  const techList = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : (project.tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);

  const imgSrc = getImgUrl(project.image_url || project.thumbnail_url);

  return (
    <CyberCard delay={index * 0.15}>
      {/* ── CARD HEADER: macOS Terminal Style ── */}
      <div className="h-9 px-4 flex items-center justify-between border-b border-indigo-500/20 bg-indigo-950/40 rounded-t-2xl z-10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-1.5 text-[0.65rem] font-mono text-indigo-300">
          <Terminal size={10} /> ~/projects/{project.slug || project.id}
        </div>
      </div>

      {/* ── IMAGE SECTION ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#020817] z-10 border-b border-white/5">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#020817] to-[#020817]">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
               {categoryIcon[project.category] || <Code2 size={32} className="text-indigo-400" />}
            </div>
            <span className="text-white/30 text-[10px] font-mono uppercase tracking-[0.2em]">{project.category}</span>
          </div>
        )}
        
        {/* Overlay grid & Matrix effect on hover */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-30 mix-blend-overlay group-hover:opacity-70 transition-opacity" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-90" />

        {/* Action Overlay */}
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 backdrop-blur border border-white/10 flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                <ExternalLink size={16} />
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-black/60 hover:bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center text-white transition-all transform hover:scale-110">
                <Github size={16} />
              </a>
            )}
        </div>
      </div>

      {/* ── CARD BODY ── */}
      <div className="flex flex-col flex-1 p-6 bg-[#020817] rounded-b-2xl z-10">
        
        {/* Title & Featured Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-[1.15rem] font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
            {project.title}
          </h3>
          {project.featured && (
            <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <Star size={10} className="text-yellow-500 fill-yellow-500" />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed flex-1 line-clamp-3 font-medium">
          {project.description || project.short_desc}
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="flex flex-wrap gap-2">
            {techList.slice(0, 5).map((tech) => (
              <span
                key={tech}
                style={{
                  color: techColors[tech] || '#a5b4fc',
                  backgroundColor: `${techColors[tech] || '#6366f1'}15`,
                  border: `1px solid ${techColors[tech] || '#6366f1'}30`,
                }}
                className="px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider font-mono shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              >
                {tech}
              </span>
            ))}
            {techList.length > 5 && (
              <span className="px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider text-white/40 bg-white/5 border border-white/10 font-mono">
                +{techList.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>
    </CyberCard>
  );
}

const SkeletonCard = ({ i }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
    className="rounded-2xl overflow-hidden border border-white/5 bg-[#0a0f1e] h-[400px] flex flex-col"
  >
    <div className="h-9 w-full bg-white/5 border-b border-white/5" />
    <div className="skeleton aspect-[16/10] w-full rounded-none" />
    <div className="p-6 flex flex-col gap-4 flex-1">
      <div className="skeleton h-5 w-3/4 rounded-md" />
      <div className="skeleton h-4 w-full rounded-md" />
      <div className="skeleton h-4 w-5/6 rounded-md" />
      <div className="mt-auto flex gap-2 pt-4 border-t border-white/5">
        <div className="skeleton h-6 w-16 rounded-md" />
        <div className="skeleton h-6 w-16 rounded-md" />
      </div>
    </div>
  </motion.div>
);

export default function ProjectsGrid({ limit }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then(({ data }) => {
        const all = data.data || [];
        setProjects(limit ? all.slice(0, limit) : all);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {[0, 1, 2, 3, 4, 5].slice(0, limit || 6).map(i => <SkeletonCard key={i} i={i} />)}
    </div>
  );

  if (projects.length === 0) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-24 flex flex-col items-center gap-4 bg-[#0a0f1e] border border-white/10 rounded-3xl"
    >
      <div className="p-6 rounded-full bg-indigo-500/10 border border-indigo-500/20">
         <Code2 size={40} className="text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white">No active projects yet</h3>
      <p className="text-white/40 text-sm max-w-sm mx-auto">Projects will appear here once you add them from your secure admin console.</p>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
    </div>
  );
}
