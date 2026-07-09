"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  ExternalLink, Github, Briefcase, Search, ArrowUpRight,
  Star, Code, Layout, Server, Database, Smartphone, Filter, Terminal
} from 'lucide-react';
import Link from 'next/link';
import api, { BASE_URL } from '@/lib/api';

/* ─────────────────────── helpers ─────────────────────── */
const techColors = {
  'React': '#61DAFB', 'Next.js': '#ffffff', 'Node.js': '#68A063',
  'MongoDB': '#4DB33D', 'MySQL': '#00758F', 'TypeScript': '#3178C6',
  'JavaScript': '#F7DF1E', 'Python': '#3776AB', 'Express': '#a5b4fc',
  'Tailwind': '#38BDF8', 'CSS': '#1572B6', 'HTML': '#E34F26',
  'Redux': '#764ABC', 'GraphQL': '#E10098',
};

const getImgUrl = (url) => {
  if (!url) return null;
  // Already a Cloudinary or external URL — just ensure https
  if (url.startsWith('https://')) return url;
  // Old localhost URL saved in DB before fix — remap to current BASE_URL
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const relativePart = url.replace(/^https?:\/\/[^/]+/, '');
    return `${BASE_URL}${relativePart}`;
  }
  // Any http URL — upgrade to https
  if (url.startsWith('http://')) return url.replace('http://', 'https://');
  // Relative path (e.g. /uploads/filename.jpg)
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Strip HTML tags (Quill stores descriptions as HTML)
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
};

const categoryIcon = {
  web:       <Layout    size={32} className="text-indigo-400" />,
  mobile:    <Smartphone size={32} className="text-pink-400" />,
  api:       <Server    size={32} className="text-cyan-400" />,
  fullstack: <Code      size={32} className="text-purple-400" />,
  other:     <Database  size={32} className="text-yellow-400" />,
};

/* ─────────────── CyberCard – 3D Tilt Wrapper ─────────── */
function CyberCard({ children, delay }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay, type: 'spring', damping: 20 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
      }}
      onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); }}
      className="relative h-full flex flex-col group [perspective:1000px]"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative flex flex-col w-full h-full rounded-2xl bg-black border border-white/10 transition-all duration-300 group-hover:border-indigo-500/50"
      >
        {/* Animated glow border */}
        <div className="absolute -inset-[2px] -z-10 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-40 blur-lg transition duration-500" />
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────── ProjectCard ─────────────────────── */
function ProjectCard({ project, index }) {
  const [imgError, setImgError] = useState(false);
  const techList = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : (project.tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);

  const imgSrc = getImgUrl(project.thumbnail_url || project.image_url);

  return (
    <CyberCard delay={index * 0.1}>

      {/* macOS Terminal Header */}
      <div className="h-9 px-4 flex items-center justify-between border-b border-indigo-500/20 bg-indigo-950/40 rounded-t-2xl z-10 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-1.5 text-[0.65rem] font-mono text-indigo-300">
          <Terminal size={10} /> ~/projects/{project.slug || project.id}
        </div>
      </div>

      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#020817] z-10 border-b border-white/5">
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#020817] to-[#020817]">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              {categoryIcon[project.category] || <Code size={32} className="text-indigo-400" />}
            </div>
            <span className="text-white/30 text-[10px] font-mono uppercase tracking-[0.2em]">{project.category}</span>
          </div>
        )}

        {/* Grid + gradient overlays */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-30 mix-blend-overlay group-hover:opacity-70 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-90" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)' }}>
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">Featured</span>
          </div>
        )}

        {/* Action buttons on hover */}
        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer"
              className="w-10 h-10 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 backdrop-blur border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <ExternalLink size={15} />
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer"
              className="w-10 h-10 rounded-xl bg-black/60 hover:bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110">
              <Github size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6 bg-[#020817] rounded-b-2xl z-10">

        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-[1.1rem] font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
            {project.title}
          </h3>
          {project.featured && (
            <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <Star size={10} className="text-yellow-500 fill-yellow-500" />
            </div>
          )}
        </div>

        <p className="text-sm text-white/50 leading-relaxed flex-1 line-clamp-3 font-medium">
          {stripHtml(project.description)}
        </p>

        {/* Tech stack pills */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-2">
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

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
            {project.category || 'project'}
          </span>
          {project.slug && (
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg transition-all hover:bg-indigo-500/20"
              style={{ color: '#818cf8', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              Details <ArrowUpRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </CyberCard>
  );
}

/* ────────────── Skeleton loader ───────────────────────── */
function SkeletonCard({ i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
      className="rounded-2xl overflow-hidden border border-white/5 bg-[#0a0f1e] flex flex-col"
      style={{ minHeight: 400 }}
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
}

/* ─────────────────────── Page ─────────────────────────── */
export default function PublicProjects() {
  const [projects, setProjects]   = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    api.get('/projects')
      .then(({ data }) => {
        const list = data.data || [];
        setProjects(list);
        setFiltered(list);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
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
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'rgba(255,255,255,0.25)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-2xl pl-12 pr-5 py-3.5 text-white text-sm font-medium focus:outline-none transition-all placeholder:text-white/20"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.background = 'rgba(99,102,241,0.05)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
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
            {[0,1,2,3,4,5].map(i => <SkeletonCard key={i} i={i} />)}
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
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
