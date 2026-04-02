"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, Button, Badge } from '@/components/ui';
import { 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Archive,
  Image as ImageIcon,
  BookOpen,
  Eye,
  Tag
} from 'lucide-react';
import Link from 'next/link';

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs');
      setBlogs(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic text-primary">Synchronizing Editorial Database...</div>;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-4 text-primary font-black uppercase text-xs tracking-[0.25em] mb-4">
              <span className="w-12 h-[2px] bg-primary/20 rounded-full" />
              Content Strategy
           </div>
           <h1 className="text-5xl font-black tracking-tighter text-white">Editorial Repository</h1>
        </div>
        <Link href="/admin/blogs/new">
          <Button variant="primary" className="btn-premium px-10 py-5 text-lg flex items-center gap-4 group">
            <PlusCircle size={22} className="group-hover:rotate-90 transition-transform" /> Draft New Insight
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-16 py-5 text-white focus:outline-none focus:border-primary transition-all font-medium text-lg placeholder:text-white/20"
              placeholder="Search articles..."
            />
         </div>
      </div>

      <Card className="p-0 border-white/5 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-white/30 text-[10px]">Article Details</th>
                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-white/30 text-[10px]">Taxonomy</th>
                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-white/30 text-[10px]">Engagement</th>
                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-white/30 text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-6">
                        <div className="w-24 h-16 rounded-xl bg-white/5 overflow-hidden border border-white/5 relative shrink-0">
                           {blog.cover_url ? <img src={blog.cover_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={24} /></div>}
                        </div>
                        <div>
                           <p className="text-xl font-black text-white truncate group-hover:text-primary transition-colors">{blog.title}</p>
                           <div className="flex items-center gap-3 mt-1">
                              {blog.published ? <Badge variant="success" className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-green-500/20 bg-green-500/5 text-green-500">Live</Badge> : <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-orange-500/20 bg-orange-500/5 text-orange-500">Draft</Badge>}
                              <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter italic">~{blog.read_time} min read</span>
                           </div>
                        </div>
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex flex-wrap gap-2 max-w-[200px]">
                        {(blog.tags || []).map((tag, idx) => (
                           <span key={idx} className="text-[9px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">#{tag}</span>
                        ))}
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-2 text-white/40 font-bold">
                        <Eye size={14} className="text-primary" />
                        <span className="text-sm font-black">{blog.views.toLocaleString()}</span>
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blogs/${blog.id}/edit`}>
                           <div className="p-3 bg-white/5 text-white/40 hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-white/5 cursor-pointer"><Edit3 size={18} /></div>
                        </Link>
                        <div onClick={() => handleDelete(blog.id)} className="p-3 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all cursor-pointer border border-white/5"><Trash2 size={18} /></div>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BlogsManagement;
