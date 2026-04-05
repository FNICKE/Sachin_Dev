"use client";
import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Card, Button } from '@/components/ui';
import { 
  Calendar, 
  Clock, 
  ArrowLeft,
  Eye,
  Share2,
  Bookmark,
  Hash
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to resolve backend image paths
  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/1200x630/020817/white?text=No+Cover';
    if (url.startsWith('http')) return url;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

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

      <div className="relative z-10 pt-32 lg:pt-44">
         <div className="max-w-5xl mx-auto px-6 lg:px-10 flex flex-col gap-12">
            {/* 1. Header Navigation */}
            <Link href="/blog" className="inline-flex items-center gap-3 text-white/40 hover:text-primary transition-all group font-bold uppercase text-[10px] tracking-widest">
               <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Repository Return
            </Link>

            {/* 2. Top Metadata & Title */}
            <div className="flex flex-col gap-6">
               <div className="flex flex-wrap items-center gap-4">
                  <span className="bg-primary/20 border border-primary/30 px-3 py-1.5 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                     {blog.tags?.[0] || 'Uncategorized'}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div className="flex items-center gap-2 text-white/40 font-bold text-[11px] uppercase tracking-widest">
                     <Clock size={12} className="text-primary" /> {blog.read_time} Min Deep Dive
                  </div>
               </div>

               <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] italic">
                  {blog.title}
               </h1>
            </div>

            {/* 3. Large Featured Image */}
            <div className="relative group w-full">
               <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-80 transition-all duration-700" />
               <div className="relative bg-white/5 border border-white/10 p-3 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img 
                    src={getImageUrl(blog.cover_url)} 
                    className="w-full h-auto max-h-[80vh] object-contain rounded-[2rem] hover:scale-[1.01] transition-transform duration-700" 
                    alt={blog.title} 
                  />
               </div>
            </div>

            {/* 4. Excerpt & Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-8">
               <div className="lg:col-span-8 flex flex-col gap-12">
                  {/* Excerpt Box */}
                  <div className="p-1 border-l-4 border-primary bg-white/5 rounded-r-2xl">
                    <p className="text-2xl text-white/80 font-medium leading-relaxed pl-8 py-8 italic backdrop-blur-sm">
                       {blog.excerpt}
                    </p>
                  </div>

                  {/* Main Article narrative */}
                  <article className="prose-styles">
                     <div 
                       className="relative z-10 leading-loose font-normal text-lg text-white/90"
                       dangerouslySetInnerHTML={{ __html: blog.content }}
                     />
                  </article>

                  {/* Footer Section (Tags & Share) */}
                  <footer className="flex flex-col gap-10 pt-16 border-t border-white/5">
                     <div className="flex flex-col gap-6">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Knowledge Tags</span>
                        <div className="flex flex-wrap gap-3">
                           {(blog.tags || []).map((tag, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-primary hover:border-primary/20 transition-all cursor-pointer">
                                 <Hash size={12} className="text-primary" /> {tag}
                              </div>
                           ))}
                        </div>
                     </div>
                  </footer>
               </div>

               {/* 5. Sticky Engagement Sidebar */}
               <aside className="lg:col-span-4 flex flex-col gap-8 h-fit lg:sticky lg:top-40">
                  <Card className="p-8 border-white/5 bg-white/5 flex flex-col gap-6">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Insights Meta</span>
                        <h3 className="text-xl font-black text-white italic tracking-tighter">Stats Registry</h3>
                     </div>

                     <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                           <span className="text-[9px] font-black uppercase text-white/20">Access Volume</span>
                           <span className="text-sm font-black text-white flex items-center gap-2"><Eye size={16} className="text-primary" /> {blog.views} Reads</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                           <span className="text-[9px] font-black uppercase text-white/20">Release</span>
                           <span className="text-sm font-black text-white flex items-center gap-2"><Calendar size={16} className="text-primary" /> {new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                           <Button variant="outline" className="p-3 bg-white/5 border-white/5 rounded-xl text-white/60 hover:text-primary transition-all"><Share2 size={18} /></Button>
                           <Button variant="outline" className="p-3 bg-white/5 border-white/5 rounded-xl text-white/60 hover:text-primary transition-all"><Bookmark size={18} /></Button>
                        </div>
                     </div>
                  </Card>
               </aside>
            </div>
         </div>
      </div>
      <style jsx global>{`
        .prose-styles {
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
        }
        .prose-styles h1, .prose-styles h2, .prose-styles h3 {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          color: #fff;
          margin-top: 2.5rem;
          margin-bottom: 1.2rem;
          letter-spacing: -0.02em;
        }
        .prose-styles h2 { font-size: 2.2rem; }
        .prose-styles h3 { font-size: 1.7rem; }
        .prose-styles p {
          margin-bottom: 1.8rem;
          font-size: 1.15rem;
        }
        .prose-styles img {
          border-radius: 1.5rem;
          margin: 3rem 0;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          width: 100%;
          height: auto;
          display: block;
        }
        .prose-styles strong {
          color: var(--primary);
          font-weight: 800;
        }
        .prose-styles blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 2rem;
          font-style: italic;
          margin: 2rem 0;
          background: rgba(255,255,255,0.03);
          padding: 2rem;
          border-radius: 0 1.5rem 1.5rem 0;
        }
        .prose-styles ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 2rem;
          color: rgba(255,255,255,0.7);
        }
        .prose-styles li {
          margin-bottom: 0.8rem;
        }
      `}</style>
    </div>
  );
}
