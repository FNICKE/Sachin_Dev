"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api, { BASE_URL } from '@/lib/api';
import { ExternalLink, Github, ArrowUpRight, Star, Globe, Smartphone, Zap, Rocket, Lightbulb } from 'lucide-react';

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
  web: <Globe size={40} className="text-indigo-400" />,
  mobile: <Smartphone size={40} className="text-pink-400" />,
  api: <Zap size={40} className="text-cyan-400" />,
  fullstack: <Rocket size={40} className="text-purple-400" />,
  other: <Lightbulb size={40} className="text-yellow-400" />
};

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const techList = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : (project.tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);

  const imgSrc = getImgUrl(project.image_url || project.thumbnail_url);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group flex flex-col h-full glass-panel rounded-3xl overflow-hidden border border-white/5 transition-all duration-500"
      style={{
        boxShadow: hovered
          ? '0 24px 64px -12px rgba(99,102,241,0.3), 0 0 0 1px rgba(99,102,241,0.15)'
          : '0 4px 24px -4px rgba(0,0,0,0.4)',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/20">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-70"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: hovered ? [0, -10, 10, 0] : 0, scale: hovered ? 1.15 : 1 }}
              transition={{ duration: 0.4 }}
            >
              {categoryIcon[project.category] || <Lightbulb size={40} className="text-yellow-400" />}
            </motion.div>
            <span className="text-white/15 text-xs font-bold uppercase tracking-widest">{project.category}</span>
          </div>
        )}

        {/* Hover overlay with buttons */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 flex items-end p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex gap-2.5 w-full">
            {project.live_url && (
              <motion.a
                href={project.live_url} target="_blank" rel="noreferrer"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: hovered ? 0 : 16, opacity: hovered ? 1 : 0 }}
                transition={{ delay: 0.04 }}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-white text-xs font-black uppercase tracking-wider transition-colors flex-1 justify-center"
              >
                <ExternalLink size={13} /> Live Demo
              </motion.a>
            )}
            {project.github_url && (
              <motion.a
                href={project.github_url} target="_blank" rel="noreferrer"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: hovered ? 0 : 16, opacity: hovered ? 1 : 0 }}
                transition={{ delay: 0.08 }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-black uppercase tracking-wider transition-colors flex-1 justify-center backdrop-blur"
              >
                <Github size={13} /> Code
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.35)' }}>
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 text-[9px] font-black uppercase tracking-widest">Featured</span>
          </div>
        )}

        {/* Category chip */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/70 bg-black/40 backdrop-blur border border-white/10">
            {project.category || 'project'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors leading-tight flex-1">
            {project.title}
          </h3>
          <motion.div animate={{ rotate: hovered ? 45 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
            <ArrowUpRight size={18} className="text-white/20 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/45 leading-relaxed flex-1 line-clamp-2 font-medium">
          {project.description || project.short_desc}
        </p>

        {/* Tech tags */}
        {techList.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techList.slice(0, 4).map((tech) => (
              <span
                key={tech}
                style={{
                  color: techColors[tech] || '#a5b4fc',
                  background: `${techColors[tech] || '#6366f1'}12`,
                  border: `1px solid ${techColors[tech] || '#6366f1'}28`,
                }}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold"
              >
                {tech}
              </span>
            ))}
            {techList.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white/25 bg-white/5 border border-white/8">
                +{techList.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex gap-3">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer"
                className="text-white/30 hover:text-white transition-colors" title="GitHub">
                <Github size={16} />
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer"
                className="text-white/30 hover:text-white transition-colors" title="Live Demo">
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          {project.slug && (
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-indigo-400/60 hover:text-indigo-300 transition-colors group/lnk"
            >
              Details
              <ArrowUpRight size={12} className="group-hover/lnk:translate-x-0.5 group-hover/lnk:-translate-y-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

const SkeletonCard = ({ i }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.07 }}
    className="rounded-3xl overflow-hidden border border-white/5 bg-white/2"
  >
    <div className="skeleton aspect-video w-full" />
    <div className="p-6 flex flex-col gap-3">
      <div className="skeleton h-4 w-16 rounded-full" />
      <div className="skeleton h-6 w-3/4 rounded-lg" />
      <div className="skeleton h-3.5 w-full rounded" />
      <div className="skeleton h-3.5 w-2/3 rounded" />
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-6 w-14 rounded-md" />
        <div className="skeleton h-6 w-14 rounded-md" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[0, 1, 2].map(i => <SkeletonCard key={i} i={i} />)}
    </div>
  );

  if (projects.length === 0) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-24 flex flex-col items-center gap-3"
    >
      <Rocket size={48} className="text-white/20" />
      <p className="text-white/30 font-bold text-lg">Projects coming soon!</p>
      <p className="text-white/20 text-sm">Add your first project from the admin panel.</p>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
    </div>
  );
}
