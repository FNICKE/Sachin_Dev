"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, Badge, Button } from '@/components/ui';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  Eye,
  BookOpen,
  Tag,
  Search,
  Hash
} from 'lucide-react';
import Link from 'next/link';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs?published=true');
      setBlogs(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="min-h-screen pt-40 px-10 text-center text-3xl font-black text-white italic animate-pulse">Synchronizing Insights...</div>;

  return (
    <div className="min-h-screen bg-black/95 pt-40 pb-20 px-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
         {/* Page Header */}
         <div className="flex flex-col gap-6 max-w-3xl">
            <div className="flex items-center gap-4 text-primary font-black uppercase text-xs tracking-[0.3em]">
               <span className="w-16 h-[2px] bg-primary" />
               Thought Repository
            </div>
            <h1 className="text-7xl font-black tracking-widest text-white uppercase italic">Journal<span className="text-primary">.</span></h1>
            <p className="text-xl text-white/40 font-medium leading-relaxed">
               Exploring the intersections of architectural design, fullstack engineering, and the future of human-machine collaboration.
            </p>
         </div>

         {/* Search Filter */}
         <div className="relative group max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={24} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-16 py-6 text-xl text-white focus:outline-none focus:border-primary transition-all font-bold placeholder:text-white/10"
              placeholder="Search by title, tag, or technology..."
            />
         </div>

         {/* Blogs Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
               <Card key={blog.id} className="group flex flex-col h-full border-white/5 bg-transparent hover:bg-white/5 hover:border-primary/20 transition-all duration-500 overflow-hidden cursor-pointer">
                  <Link href={`/blog/${blog.slug}`} className="contents">
                    <div className="relative aspect-[16/10] overflow-hidden">
                       {blog.cover_url ? (
                         <img src={blog.cover_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={blog.title} />
                       ) : (
                         <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/10 italic font-black uppercase text-xs">Editorial Image Missing</div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                       <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                          <div className="flex flex-wrap gap-2">
                             {(blog.tags || []).slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="bg-primary/90 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded transform -skew-x-12">{tag}</span>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="p-8 flex flex-col gap-6 flex-grow">
                       <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                          <div className="flex items-center gap-2 italic"><Calendar size={14} className="text-primary" /> {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</div>
                          <div className="flex items-center gap-2 italic"><Clock size={14} className="text-primary" /> {blog.read_time} Min Read</div>
                       </div>

                       <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors leading-tight line-clamp-2">
                          {blog.title}
                       </h3>

                       <p className="text-white/40 text-sm leading-relaxed line-clamp-3">
                          {blog.excerpt}
                       </p>

                       <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between group/btn">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover/btn:text-primary transition-colors italic">Deep Access /</span>
                          <ChevronRight className="text-primary transform -translate-x-2 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all" />
                       </div>
                    </div>
                  </Link>
               </Card>
            ))}
         </div>
      </div>
    </div>
  );
}
