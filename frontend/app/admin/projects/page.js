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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data);
    } catch (err) {
      console.error(err);
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

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-green-500" size={16} />;
      case 'in_progress': return <Clock className="text-blue-400" size={16} />;
      case 'archived': return <Archive className="text-white/30" size={16} />;
      default: return null;
    }
  };

  if (loading) return <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic">Synchronizing Database Modules...</div>;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-4 text-primary font-black uppercase text-xs tracking-[0.25em] mb-4">
              <span className="w-12 h-[2px] bg-primary/20 rounded-full" />
              Content Management
           </div>
           <h1 className="text-5xl font-black tracking-tighter text-white">Project Repositories</h1>
        </div>
        <Link href="/admin/projects/new">
          <Button variant="primary" className="btn-premium px-10 py-5 text-lg flex items-center gap-4 group">
            <PlusCircle size={22} className="group-hover:rotate-90 transition-transform" /> Add New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
           <input 
             type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-white/5 border border-white/10 rounded-2xl px-16 py-5 text-white focus:outline-none focus:border-primary transition-all font-medium text-lg placeholder:text-white/20"
             placeholder="Search projects..."
           />
         </div>
      </div>

      <Card className="p-0 border-white/5 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-white/30">Release Details</th>
                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-white/30">Category</th>
                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-white/30">Deployment</th>
                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-6">
                        <div className="w-24 h-16 rounded-xl bg-white/5 overflow-hidden border border-white/5 relative shrink-0">
                           {project.thumbnail_url ? <img src={project.thumbnail_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={24} /></div>}
                        </div>
                        <div>
                           <p className="text-xl font-black text-white truncate group-hover:text-primary transition-colors">{project.title}</p>
                           <p className="text-xs font-bold text-white/30 mt-1 uppercase tracking-widest">{project.slug}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <Badge variant="primary" className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 flex items-center gap-2">
                        {project.category}
                     </Badge>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-4">
                        {project.live_url ? <a href={project.live_url} target="_blank" className="p-3 bg-white/5 rounded-xl text-primary hover:bg-primary/20"><ExternalLink size={18} /></a> : <div className="p-3 bg-white/2 text-white/10 rounded-xl"><XCircle size={18} /></div>}
                        {project.github_url ? <a href={project.github_url} target="_blank" className="p-3 bg-white/5 rounded-xl text-white/60 hover:text-white"><Github size={18} /></a> : <div className="p-3 bg-white/2 text-white/10 rounded-xl"><XCircle size={18} /></div>}
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/projects/${project.id}/edit`}>
                           <div className="p-3 bg-white/5 text-white/40 hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-white/5"><Edit3 size={18} /></div>
                        </Link>
                        <div onClick={() => handleDelete(project.id)} className="p-3 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all cursor-pointer border border-white/5"><Trash2 size={18} /></div>
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

export default ProjectsManagement;
