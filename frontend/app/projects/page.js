"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Briefcase, Search, SlidersHorizontal, ArrowUpRight, Star, Calendar, Code, Layout, Server, Database, Smartphone } from 'lucide-react';
import Link from 'next/link';
import api, { BASE_URL } from '@/lib/api';

const techColors = {
  'React': '#61DAFB', 'Next.js': '#ffffff', 'Node.js': '#68A063',
  'MongoDB': '#4DB33D', 'MySQL': '#00758F', 'TypeScript': '#3178C6',
  'JavaScript': '#F7DF1E', 'Python': '#3776AB', 'Express': '#ffffff',
  'Tailwind': '#38BDF8', 'CSS': '#1572B6', 'HTML': '#E34F26',
  'Redux': '#764ABC', 'GraphQL': '#E10098',
};

const getImgUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const techList = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : (project.tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative glass-panel rounded-3xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-500"
      style={{ boxShadow: hovered ? '0 20px 60px -10px rgba(99,102,241,0.25)' : undefined }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
        {getImgUrl(project.thumbnail_url || project.image_url) ? (
          <img
            src={getImgUrl(project.thumbnail_url || project.image_url)}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-950/40">
            <motion.div
              animate={{ rotate: hovered ? 10 : 0, scale: hovered ? 1.1 : 1 }}
              className="text-white/20"
            >
              {[<Code size={48} key="code" />, <Layout size={48} key="layout" />, <Server size={48} key="server" />, <Database size={48} key="db" />, <Smartphone size={48} key="phone" />][index % 5]}
            </motion.div>
          </div>
        )}

        {/* Overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-3">
            {project.live_url && (
              <motion.a
                href={project.live_url} target="_blank" rel="noreferrer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 rounded-xl text-white text-sm font-bold hover:bg-indigo-400 transition-colors"
              >
                <ExternalLink size={14} /> Live Demo
              </motion.a>
            )}
            {project.github_url && (
              <motion.a
                href={project.github_url} target="_blank" rel="noreferrer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white text-sm font-bold hover:bg-white/20 transition-colors"
              >
                <Github size={14} /> Source
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/20 border border-yellow-400/40 rounded-full">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors leading-tight">
            {project.title}
          </h3>
          <motion.div
            animate={{ rotate: hovered ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ArrowUpRight size={20} className="text-white/20 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-0.5" />
          </motion.div>
        </div>

        <p className="text-white/50 text-sm leading-relaxed mb-5 line-clamp-2 font-medium">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {techList.slice(0, 5).map((tech) => (
            <span
              key={tech}
              style={{
                color: techColors[tech] || '#a5b4fc',
                background: `${techColors[tech] || '#6366f1'}15`,
                border: `1px solid ${techColors[tech] || '#6366f1'}30`,
              }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
            >
              {tech}
            </span>
          ))}
          {techList.length > 5 && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white/30 bg-white/5 border border-white/10">
              +{techList.length - 5}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-5">
           <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
              {project.category || 'project'}
           </span>
           {project.slug && (
              <Link 
                 href={`/projects/${project.slug}`}
                 className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 group/lnk hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1.5 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20"
              >
                 Details <ArrowUpRight size={12} className="group-hover/lnk:-translate-y-0.5 group-hover/lnk:translate-x-0.5 transition-transform" />
              </Link>
           )}
        </div>
      </div>
    </motion.div>
  );
}

export default function PublicProjects() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    api.get('/projects').then(({ data }) => {
      const list = data.data || [];
      setProjects(list);
      setFiltered(list);
    }).catch(() => setProjects([])).finally(() => setLoading(false));
  }, []);

  const allTags = ['All', ...Array.from(new Set(
    projects.flatMap(p =>
      (Array.isArray(p.tech_stack) ? p.tech_stack : (p.tech_stack || '').split(','))
        .map(t => t.trim()).filter(Boolean).slice(0, 3)
    )
  )).slice(0, 8)];

  useEffect(() => {
    let list = [...projects];
    if (activeTag !== 'All') {
      list = list.filter(p => {
        const techs = Array.isArray(p.tech_stack) ? p.tech_stack : (p.tech_stack || '').split(',').map(t => t.trim());
        return techs.includes(activeTag);
      });
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [search, activeTag, projects]);

  return (
    <div className="section-padding pt-44 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-5"
        >
          <div className="section-label">
            <Briefcase size={14} /> Selected Work
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Project{' '}
            <span className="gradient-text">Archives</span>
          </h1>
          <p className="text-xl text-white/40 max-w-2xl font-medium leading-relaxed">
            A technical deep-dive into the modules, applications, and architectures I&apos;ve built from the ground up.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
        >
          <div className="relative group flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all placeholder:text-white/20"
            />
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTag === tag
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20 hover:text-white/70'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Count */}
        <div className="text-white/30 text-sm font-semibold">
          Showing <span className="text-indigo-400">{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton rounded-3xl aspect-[4/3]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 flex flex-col items-center gap-4"
          >
            <Search size={48} className="text-white/20" />
            <div className="text-white/30 font-black text-2xl">
              No projects found. Try a different search.
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
