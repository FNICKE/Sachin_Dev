"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, Github, Briefcase, Search, ArrowUpRight,
  Star, Code, Layout, Server, Database, Smartphone, Filter
} from 'lucide-react';
import Link from 'next/link';
import api, { BASE_URL } from '@/lib/api';

const techColors = {
  'React': '#61DAFB', 'Next.js': '#ffffff', 'Node.js': '#68A063',
  'MongoDB': '#4DB33D', 'MySQL': '#00758F', 'TypeScript': '#3178C6',
  'JavaScript': '#F7DF1E', 'Python': '#3776AB', 'Express': '#8b8b8b',
  'Tailwind': '#38BDF8', 'CSS': '#1572B6', 'HTML': '#E34F26',
  'Redux': '#764ABC', 'GraphQL': '#E10098',
};

const getImgUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const iconList = [<Code size={48} key="code" />, <Layout size={48} key="layout" />, <Server size={48} key="server" />, <Database size={48} key="db" />, <Smartphone size={48} key="phone" />];

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
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative rounded-3xl overflow-hidden transition-all duration-500"
      style={{
        background: 'linear-gradient(145deg, rgba(15,22,41,0.9), rgba(10,15,30,0.95))',
        border: hovered ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hovered
          ? '0 25px 60px -10px rgba(0,0,0,0.6), 0 0 60px -20px rgba(99,102,241,0.3)'
          : '0 10px 30px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))' }}>
        {getImgUrl(project.thumbnail_url || project.image_url) ? (
          <img
            src={getImgUrl(project.thumbnail_url || project.image_url)}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div animate={{ rotate: hovered ? 10 : 0, scale: hovered ? 1.1 : 1 }} style={{ color: 'rgba(99,102,241,0.3)' }}>
              {iconList[index % 5]}
            </motion.div>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 flex items-end p-5"
          style={{
            background: 'linear-gradient(to top, rgba(2,8,23,0.95) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div className="flex gap-3">
            {project.live_url && (
              <motion.a
                href={project.live_url} target="_blank" rel="noreferrer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold transition-colors"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold transition-colors"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <Github size={14} /> Source
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)' }}>
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-black text-white leading-tight transition-colors"
            style={{ color: hovered ? '#a5b4fc' : 'white' }}>
            {project.title}
          </h3>
          <motion.div animate={{ rotate: hovered ? 45 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
            <ArrowUpRight size={20} className="flex-shrink-0 mt-0.5 transition-colors"
              style={{ color: hovered ? '#818cf8' : 'rgba(255,255,255,0.2)' }} />
          </motion.div>
        </div>

        <p className="text-sm leading-relaxed mb-5 line-clamp-2 font-medium" style={{ color: 'rgba(148,153,184,0.7)' }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {techList.slice(0, 5).map((tech) => (
            <span
              key={tech}
              style={{
                color: techColors[tech] || '#a5b4fc',
                background: `${techColors[tech] || '#6366f1'}12`,
                border: `1px solid ${techColors[tech] || '#6366f1'}28`,
              }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
            >
              {tech}
            </span>
          ))}
          {techList.length > 5 && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              +{techList.length - 5}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {project.category || 'project'}
          </span>
          {project.slug && (
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all px-3 py-1.5 rounded-lg"
              style={{
                color: '#818cf8',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              Details <ArrowUpRight size={12} />
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
    <div className="min-h-screen pt-44 pb-20 px-6">
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
          <p className="text-xl font-medium leading-relaxed max-w-2xl" style={{ color: 'rgba(148,153,184,0.7)' }}>
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
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.25)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-2xl pl-12 pr-5 py-3.5 text-white text-sm font-medium focus:outline-none transition-all placeholder:text-white/20"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.background = 'rgba(99,102,241,0.05)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Filter size={15} className="self-center" style={{ color: 'rgba(255,255,255,0.3)' }} />
            {allTags.map(tag => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTag(tag)}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                style={activeTag === tag ? {
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                } : {
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Count */}
        <div className="text-sm font-semibold -mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Showing <span style={{ color: '#818cf8' }}>{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
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
            <Search size={48} style={{ color: 'rgba(255,255,255,0.15)' }} />
            <div className="font-black text-2xl" style={{ color: 'rgba(255,255,255,0.25)' }}>
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
