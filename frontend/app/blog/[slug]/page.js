"use client";
import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Card, Badge, Button } from '@/components/ui';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ArrowLeft,
  Eye,
  BookOpen,
  Tag,
  Share2,
  Bookmark,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = useCallback(async () => {
    try {
      const { data } = await api.get(`/blogs/${slug}`);
      setBlog(data.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
         router.push('/blog');
      }
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  if (loading) return <div className="min-h-screen pt-40 px-10 text-center text-3xl font-black text-white italic animate-pulse text-primary">Deciphering Content Stream...</div>;
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-black/95">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-[radial-gradient(circle,rgba(var(--primary-rgb),0.05)_0%,transparent_70%)] blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
         {/* Detail Hero Section */}
         <div className="w-full relative h-[70vh] flex items-end">
            <div className="absolute inset-0 z-0">
               <img src={blog.cover_url} className="w-full h-full object-cover grayscale-[0.3] brightness-50" alt={blog.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
               <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            </div>

            <div className="max-w-7xl mx-auto w-full px-10 pb-20 relative z-20 flex flex-col gap-12">
               <Link href="/blog" className="flex items-center gap-4 text-white/40 hover:text-primary transition-all group font-black uppercase text-[10px] tracking-widest">
                  <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Repository Return
               </Link>

               <div className="flex flex-col gap-8 max-w-4xl">
                  <div className="flex items-center gap-6">
                     <span className="bg-primary px-4 py-2 text-white text-[10px] font-black uppercase tracking-[0.2em] transform -skew-x-12">{blog.tags?.[0] || 'Uncategorized'}</span>
                     <div className="flex items-center gap-2 text-white/40 font-black text-[10px] uppercase tracking-widest italic border-l border-white/10 pl-6"><Clock size={14} className="text-primary" /> {blog.read_time} Min Deep Dive</div>
                  </div>

                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] italic">
                     {blog.title}
                  </h1>

                  <p className="text-2xl text-white/60 font-medium leading-relaxed italic max-w-3xl border-l-4 border-primary pl-8 py-4 bg-white/5 backdrop-blur-sm rounded-r-2xl">
                     {blog.excerpt}
                  </p>
               </div>
            </div>
         </div>

         {/* Content Area */}
         <main className="max-w-7xl mx-auto px-10 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Main Narrative */}
            <article className="lg:col-span-8 flex flex-col gap-20 prose prose-invert max-w-none prose-lg prose-primary">
               <div className="p-12 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-primary/10 select-none pointer-events-none"><BookOpen size={200} strokeWidth={1} /></div>
                  
                  {/* Content Container */}
                  <div className="relative z-10 whitespace-pre-wrap leading-relaxed font-medium text-lg text-white/80 first-letter:text-6xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:mt-2 italic">
                     {blog.content}
                  </div>
               </div>

               {/* Footer Section */}
               <footer className="flex flex-col gap-10 pt-20 border-t border-white/5">
                  <div className="flex flex-wrap gap-4">
                     {(blog.tags || []).map((tag, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-primary hover:border-primary/20 transition-all cursor-pointer">
                           <Hash size={14} className="text-primary" /> {tag}
                        </div>
                     ))}
                  </div>

                  <div className="flex items-center justify-between p-8 bg-primary/5 border border-primary/20 rounded-3xl group">
                     <p className="text-lg font-black text-white italic tracking-tighter uppercase tracking-[0.2em]">Engage / <span className="text-primary font-black uppercase text-xs ml-4 tracking-[0.4em]">Connect with the author</span></p>
                     <div className="flex items-center gap-4">
                        <Button variant="outline" className="p-4 bg-white/5 border-white/5 rounded-2xl text-white/60 hover:text-primary transition-all"><Share2 size={20} /></Button>
                        <Button variant="outline" className="p-4 bg-white/5 border-white/5 rounded-2xl text-white/60 hover:text-primary transition-all"><Bookmark size={20} /></Button>
                     </div>
                  </div>
               </footer>
            </article>

            {/* Sidebar Metadata */}
            <aside className="lg:col-span-4 flex flex-col gap-12 h-fit lg:sticky lg:top-40">
               <Card className="p-10 border-white/5 bg-white/5 flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Insights Meta</span>
                     <h3 className="text-2xl font-black text-white italic tracking-tighter">Engagement Registry</h3>
                  </div>

                  <div className="flex flex-col gap-6">
                     <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex flex-col gap-1">
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Access Volume</span>
                           <span className="text-lg font-black text-white flex items-center gap-3"><Eye size={20} className="text-primary" /> {blog.views.toLocaleString()} Reads</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex flex-col gap-1">
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Release Signature</span>
                           <span className="text-lg font-black text-white flex items-center gap-3"><Calendar size={20} className="text-primary" /> {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex flex-col gap-1">
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Estimated Consumption</span>
                           <span className="text-lg font-black text-white flex items-center gap-3"><Clock size={20} className="text-primary" /> {blog.read_time} Min Deep Level</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex flex-col gap-1">
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Feedback Loop</span>
                           <span className="text-lg font-black text-white flex items-center gap-3"><MessageSquare size={20} className="text-primary" /> 12 Insights Shared</span>
                        </div>
                     </div>
                  </div>

                  <Button variant="primary" className="btn-premium py-5 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 group">
                     Follow Thought Stream <ChevronLeft size={16} className="rotate-180 transform group-hover:translate-x-2 transition-all" />
                  </Button>
               </Card>

               <div className="p-8 bg-primary border border-primary text-white rounded-3xl flex flex-col gap-4 relative overflow-hidden group cursor-pointer shadow-2xl shadow-primary/30">
                  <div className="absolute -top-10 -right-10 opacity-20 group-hover:scale-110 transition-transform"><BookOpen size={150} strokeWidth={1} /></div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] opacity-60 italic">Free Access /</h4>
                  <p className="text-2xl font-black tracking-tighter italic leading-[1.1]">The Roadmap to Fullstack Architect</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-4 underline decoration-2 underline-offset-4">Explore Roadmap</p>
               </div>
            </aside>
         </main>
      </div>
    </div>
  );
}
