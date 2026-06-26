"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { BASE_URL } from '@/lib/api';
import {
  Calendar, Clock, ChevronRight, Search, BookOpen, Tag,
  Rss, Flame, FileText, Bookmark, Feather, Hash, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const fallbackIcons = [
  <FileText size={48} key="f" />,
  <Bookmark size={48} key="b" />,
  <Flame size={48} key="fl" />,
  <Feather size={48} key="fe" />,
  <Hash size={48} key="h" />,
];

function BlogSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden animate-pulse"
      style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="skeleton aspect-[16/10]" />
      <div className="p-7 space-y-4">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

function BlogCard({ blog, index, featured = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group rounded-3xl overflow-hidden transition-all duration-500 ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
      style={{
        background: 'linear-gradient(145deg, rgba(15,22,41,0.9), rgba(10,15,30,0.95))',
        border: hovered ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hovered ? '0 25px 60px -10px rgba(0,0,0,0.6), 0 0 50px -20px rgba(99,102,241,0.25)' : '0 10px 30px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      <Link href={`/blog/${blog.slug}`} className="block h-full">
        {/* Image */}
        <div
          className={`relative overflow-hidden ${featured ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))' }}
        >
          {getImageUrl(blog.cover_url) ? (
            <img
              src={getImageUrl(blog.cover_url)}
              alt={blog.title}
              className="w-full h-full object-cover transition-all duration-700"
              style={{
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                filter: hovered ? 'brightness(0.7)' : 'brightness(1)',
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: hovered ? 5 : 0, scale: hovered ? 1.1 : 1 }}
                style={{ color: 'rgba(99,102,241,0.35)' }}
              >
                {fallbackIcons[index % 5]}
              </motion.div>
            </div>
          )}

          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,8,23,0.85) 0%, transparent 60%)' }} />

          {/* Tags */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
            {(blog.tags || []).slice(0, 3).map((tag, i) => (
              <span key={i}
                className="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg text-white"
                style={{ background: 'rgba(99,102,241,0.85)', backdropFilter: 'blur(8px)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {featured && (
            <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', backdropFilter: 'blur(8px)' }}>
              <Flame size={11} className="text-red-400" />
              <span className="text-red-400 text-[9px] font-black uppercase tracking-widest">Featured</span>
            </div>
          )}

          {!featured && (
            <div className="absolute top-4 left-4">
              <TrendingUp size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#818cf8' }} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-7 flex flex-col gap-4">
          <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} style={{ color: '#818cf8' }} />
              {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} style={{ color: '#f9a8d4' }} />
              {blog.read_time || 5} Min Read
            </span>
          </div>

          <h3
            className={`font-black leading-tight line-clamp-2 transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}
            style={{ color: hovered ? '#a5b4fc' : 'white' }}
          >
            {blog.title}
          </h3>

          <p className="text-sm leading-relaxed line-clamp-2 font-medium" style={{ color: 'rgba(148,153,184,0.65)' }}>
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-[10px] font-black uppercase tracking-widest transition-colors"
              style={{ color: hovered ? '#818cf8' : 'rgba(255,255,255,0.35)' }}>
              Read Article
            </span>
            <motion.div animate={{ x: hovered ? 4 : 0 }}>
              <ChevronRight size={18} style={{ color: '#818cf8', opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    api.get('/blogs?published=true').then(({ data }) => {
      setBlogs(data.data || []);
    }).catch(() => setBlogs([])).finally(() => setLoading(false));
  }, []);

  const allTags = ['All', ...Array.from(new Set(blogs.flatMap(b => b.tags || []))).slice(0, 7)];

  const filtered = blogs.filter(b => {
    const matchSearch = !searchTerm ||
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchTag = activeTag === 'All' || (b.tags || []).includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div className="min-h-screen pt-44 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 max-w-3xl"
        >
          <div className="section-label">
            <Rss size={14} /> Thought Repository
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
            Journal<span className="gradient-text">.</span>
          </h1>
          <p className="text-xl font-medium leading-relaxed" style={{ color: 'rgba(148,153,184,0.7)' }}>
            Exploring the intersections of architectural design, fullstack engineering, and the future of human-machine collaboration.
          </p>
        </motion.div>

        {/* Search + Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-5"
        >
          <div className="relative group max-w-lg">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.2)' }} />
            <input
              type="text" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by title or tag..."
              className="w-full rounded-2xl pl-12 pr-5 py-4 text-white font-medium focus:outline-none transition-all placeholder:text-white/15 text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.background = 'rgba(99,102,241,0.05)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTag(tag)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                style={activeTag === tag ? {
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Tag size={10} /> {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Count */}
        <div className="text-sm font-semibold -mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <span style={{ color: '#818cf8' }}>{filtered.length}</span> article{filtered.length !== 1 ? 's' : ''} found
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <BlogSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 flex flex-col items-center gap-4"
          >
            <BookOpen size={48} style={{ color: 'rgba(255,255,255,0.15)' }} />
            <div className="font-black text-2xl" style={{ color: 'rgba(255,255,255,0.2)' }}>No articles found.</div>
            <p style={{ color: 'rgba(255,255,255,0.12)' }}>Try a different search term or tag.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((blog, i) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  index={i}
                  featured={i === 0 && activeTag === 'All' && !searchTerm}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
