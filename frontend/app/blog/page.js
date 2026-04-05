"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Calendar, Clock, ChevronRight, Search, BookOpen, Tag, Rss, Flame, TrendingUp, FileText, Bookmark, Feather, Hash } from 'lucide-react';
import Link from 'next/link';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Skeleton card
function BlogSkeleton() {
  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 animate-pulse">
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

// Blog card
function BlogCard({ blog, index, featured = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group glass-panel rounded-3xl overflow-hidden border border-white/5 hover:border-indigo-500/25 transition-all duration-500 ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
      style={{ boxShadow: hovered ? '0 20px 60px -10px rgba(99,102,241,0.2)' : undefined }}
    >
      <Link href={`/blog/${blog.slug}`} className="block h-full">
        {/* Image */}
        <div className={`relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 ${featured ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}>
          {getImageUrl(blog.cover_url) ? (
            <img
              src={getImageUrl(blog.cover_url)}
              alt={blog.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-950/40">
            <motion.div
              animate={{ rotate: hovered ? 5 : 0, scale: hovered ? 1.1 : 1 }}
              className="text-indigo-400 opacity-40"
            >
              {[<FileText size={48} key="f" />, <Bookmark size={48} key="b" />, <Flame size={48} key="fl" />, <Feather size={48} key="fe" />, <Hash size={48} key="h" />][index % 5]}
            </motion.div>
          </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Tags */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
            {(blog.tags || []).slice(0, 3).map((tag, i) => (
              <span key={i}
                className="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg"
                style={{ background: 'rgba(99,102,241,0.85)', color: 'white' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {featured && (
            <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)' }}>
              <Flame size={11} className="text-red-400" />
              <span className="text-red-400 text-[9px] font-black uppercase tracking-widest">Featured</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-7 flex flex-col gap-4">
          <div className="flex items-center gap-5 text-white/30 text-[10px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-indigo-400" />
              {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-pink-400" />
              {blog.read_time || 5} Min Read
            </span>
          </div>

          <h3 className={`font-black text-white group-hover:text-indigo-300 transition-colors leading-tight line-clamp-2 ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
            {blog.title}
          </h3>

          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 font-medium">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-indigo-400 transition-colors">
              Read Article
            </span>
            <motion.div animate={{ x: hovered ? 4 : 0 }}>
              <ChevronRight size={18} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
    <div className="section-padding pt-44 min-h-screen">
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
          <p className="text-xl text-white/40 font-medium leading-relaxed">
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
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by title or tag..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all placeholder:text-white/15 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTag(tag)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTag === tag
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/70'
                }`}
              >
                <Tag size={10} /> {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Count */}
        <div className="text-white/30 text-sm font-semibold -mt-8">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
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
              <Search size={48} className="text-white/20" />
              <div className="text-white/20 font-black text-2xl">No articles found.</div>
              <p className="text-white/15">Try a different search term or tag.</p>
            </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((blog, i) => (
                <BlogCard key={blog.id} blog={blog} index={i} featured={i === 0 && activeTag === 'All' && !searchTerm} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
