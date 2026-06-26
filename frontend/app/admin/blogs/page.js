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
      setBlogs(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setBlogs([]);
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

  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBlogs = (blogs || []).filter(b => {
    const matchesSearch = b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'published' && b.published) || 
                          (statusFilter === 'draft' && !b.published);
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic text-primary">Synchronizing Editorial Database...</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
        <div>
           <div className="flex items-center gap-2 text-primary font-black uppercase text-[9px] tracking-[0.2em] mb-1">
              <span className="w-6 h-[2px] bg-primary/20 rounded-full" />
              Content Strategy
           </div>
           <h1 className="text-xl font-black tracking-tight text-white">Editorial Repository</h1>
        </div>
        <Link href="/admin/blogs/new">
          <Button variant="primary" className="btn-premium px-3.5 py-2 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 rounded-lg shadow-lg">
            <PlusCircle size={14} className="group-hover:rotate-90 transition-transform" strokeWidth={2.5} /> Draft New Insight
          </Button>
        </Link>
      </div>

      {/* SaaS Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white/2 border border-white/5 rounded-xl p-3">
         {/* Search Input */}
         <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3.5 top-2.5 text-white/30 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-10 pr-3 text-xs font-semibold text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
              placeholder="Search articles..."
            />
         </div>

         {/* Selection Filters */}
         <div className="flex gap-2.5 w-full md:w-auto items-center justify-end">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white/70 focus:outline-none cursor-pointer appearance-none min-w-[120px] text-center"
            >
               <option value="all" className="bg-[#020817]">All Statuses</option>
               <option value="published" className="bg-[#020817]">Published (Live)</option>
               <option value="draft" className="bg-[#020817]">Draft Mode</option>
            </select>
         </div>
      </div>

      {/* Datatable */}
      <Card className="p-0 border-white/5 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Article Details</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Taxonomy</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Engagement</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-white/20 font-bold italic text-xs">
                    {searchTerm ? 'No articles match your search query.' : 'No articles yet — click "Draft New Insight" to start.'}
                  </td>
                </tr>
              )}
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-5 py-2.5">
                     <div className="flex items-center gap-3">
                        <div className="w-14 h-8 rounded bg-white/5 overflow-hidden border border-white/5 relative shrink-0">
                           {blog.cover_url ? <img src={blog.cover_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={14} /></div>}
                        </div>
                        <div>
                           <p className="text-xs font-black text-white truncate group-hover:text-primary transition-colors leading-none">{blog.title}</p>
                           <div className="flex items-center gap-1.5 mt-1 leading-none">
                              {blog.published ? <Badge variant="success" className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-green-500/20 bg-green-500/5 text-green-500">Live</Badge> : <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-orange-500/20 bg-orange-500/5 text-orange-500">Draft</Badge>}
                              <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">~{blog.read_time} min read</span>
                           </div>
                        </div>
                     </div>
                  </td>
                  <td className="px-5 py-2.5">
                     <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(blog.tags || []).map((tag, idx) => (
                           <span key={idx} className="text-[8px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">#{tag}</span>
                        ))}
                     </div>
                  </td>
                  <td className="px-5 py-2.5">
                     <div className="flex items-center gap-1.5 text-white/40 font-bold">
                        <Eye size={12} className="text-primary" />
                        <span className="text-[11px] font-black">{(blog.views || 0).toLocaleString()}</span>
                     </div>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                     <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/blogs/${blog.id}/edit`}>
                           <div className="p-2 bg-white/5 text-white/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all border border-white/5 cursor-pointer"><Edit3 size={12} /></div>
                        </Link>
                        <div onClick={() => handleDelete(blog.id)} className="p-2 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all cursor-pointer border border-white/5"><Trash2 size={12} /></div>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Datatable pagination bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/5 bg-white/2">
           <p className="text-[9px] font-black text-white/25 uppercase tracking-widest">
              Showing {filteredBlogs.length} of {blogs.length} Entries
           </p>
           <div className="flex items-center gap-1.5">
              <button disabled className="px-3 py-1.5 bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/20 rounded-lg transition-all cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1.5 bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/20 rounded-lg transition-all cursor-not-allowed">Next</button>
           </div>
        </div>
      </Card>
    </div>
  );
};

export default BlogsManagement;
