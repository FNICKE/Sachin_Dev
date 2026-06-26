"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, Button, Badge } from '@/components/ui';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ExternalLink, 
  Github, 
  Edit3, 
  Trash2, 
  Eye, 
  Globe, 
  Smartphone, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Archive,
  Image as ImageIcon,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data || []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.short_desc?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': 
        return <Badge variant="success" className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 flex items-center gap-1.5 w-fit border-green-500/20 bg-green-500/5 text-green-500"><CheckCircle2 size={10} /> Completed</Badge>;
      case 'in_progress': 
        return <Badge variant="primary" className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 flex items-center gap-1.5 w-fit border-blue-500/20 bg-blue-500/5 text-blue-400"><Clock size={10} /> In Progress</Badge>;
      case 'archived': 
        return <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 flex items-center gap-1.5 w-fit border-white/20 bg-white/5 text-white/50"><Archive size={10} /> Archived</Badge>;
      default: 
        return null;
    }
  };

  if (loading) return <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic text-primary">Synchronizing Database Modules...</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
        <div>
           <div className="flex items-center gap-2 text-primary font-black uppercase text-[9px] tracking-[0.2em] mb-1">
              <span className="w-6 h-[2px] bg-primary/20 rounded-full" />
              Content Management
           </div>
           <h1 className="text-xl font-black tracking-tight text-white">Project Repositories</h1>
        </div>
        <Link href="/admin/projects/new">
          <Button variant="primary" className="btn-premium px-3.5 py-2 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 rounded-lg shadow-lg">
            <PlusCircle size={14} className="group-hover:rotate-90 transition-transform" strokeWidth={2.5} /> Add New Project
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
              placeholder="Search by title, specs..."
            />
         </div>

         {/* Selection Filters */}
         <div className="flex gap-2.5 w-full md:w-auto items-center justify-end">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white/70 focus:outline-none cursor-pointer appearance-none min-w-[110px] text-center"
            >
               <option value="all" className="bg-[#020817]">All Statuses</option>
               <option value="completed" className="bg-[#020817]">Completed</option>
               <option value="in_progress" className="bg-[#020817]">In Progress</option>
               <option value="archived" className="bg-[#020817]">Archived</option>
            </select>

            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white/70 focus:outline-none cursor-pointer appearance-none min-w-[110px] text-center"
            >
               <option value="all" className="bg-[#020817]">All Categories</option>
               <option value="frontend" className="bg-[#020817]">Frontend</option>
               <option value="backend" className="bg-[#020817]">Backend</option>
               <option value="fullstack" className="bg-[#020817]">Fullstack</option>
               <option value="mobile" className="bg-[#020817]">Mobile</option>
            </select>
         </div>
      </div>

      {/* Datatable */}
      <Card className="p-0 border-white/5 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Release Details</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Category</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Status</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Deployment</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-white/20 font-bold italic text-xs">
                    No projects found matching the filters.
                  </td>
                </tr>
              )}
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-5 py-2.5">
                     <div className="flex items-center gap-3">
                        <div className="w-14 h-8 rounded bg-white/5 overflow-hidden border border-white/5 relative shrink-0">
                           {project.thumbnail_url ? <img src={project.thumbnail_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={14} /></div>}
                        </div>
                        <div>
                           <p className="text-xs font-black text-white truncate group-hover:text-primary transition-colors leading-none">{project.title}</p>
                           <p className="text-[8px] font-bold text-white/30 mt-1 uppercase tracking-widest leading-none">{project.slug}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-5 py-2.5">
                     <Badge variant="primary" className="text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 flex items-center gap-1 w-fit">
                        {project.category}
                     </Badge>
                  </td>
                  <td className="px-5 py-2.5">
                     {getStatusBadge(project.status)}
                  </td>
                  <td className="px-5 py-2.5">
                     <div className="flex items-center gap-1.5">
                        {project.live_url ? <a href={project.live_url} target="_blank" title="Live Site" className="p-2 bg-white/5 hover:bg-primary/20 text-primary border border-white/5 rounded-lg transition-all"><ExternalLink size={12} /></a> : <div className="p-2 bg-white/2 text-white/10 rounded-lg"><XCircle size={12} /></div>}
                        {project.github_url ? <a href={project.github_url} target="_blank" title="GitHub Code" className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 rounded-lg transition-all"><Github size={12} /></a> : <div className="p-2 bg-white/2 text-white/10 rounded-lg"><XCircle size={12} /></div>}
                     </div>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                     <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/projects/${project.id}/edit`}>
                           <div className="p-2 bg-white/5 text-white/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all border border-white/5 cursor-pointer"><Edit3 size={12} /></div>
                        </Link>
                        <div onClick={() => handleDelete(project.id)} className="p-2 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all cursor-pointer border border-white/5"><Trash2 size={12} /></div>
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
              Showing {filteredProjects.length} of {projects.length} Entries
           </p>
           <div className="flex items-center gap-1.5">
              <button disabled className="px-3 py-1.5 bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/20 rounded-lg transition-all cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1.5 bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/20 rounded-xl transition-all cursor-not-allowed">Next</button>
           </div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectsManagement;
