"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge } from '@/components/ui';
import { 
  Save, 
  X, 
  Image as ImageIcon, 
  Github, 
  Globe, 
  Settings, 
  CheckCircle2, 
  Loader2, 
  Link as LinkIcon,
  Plus,
  Terminal,
  Layers,
  Smartphone,
  Globe2,
  MoreVertical,
  XCircle,
  Archive,
  Clock
} from 'lucide-react';

const ProjectForm = ({ id }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(id ? true : false);
  const [formData, setFormData] = useState({
    title: '',
    short_desc: '',
    description: '',
    thumbnail_url: '',
    live_url: '',
    github_url: '',
    tech_stack: [],
    category: 'fullstack',
    status: 'completed',
    featured: 0,
    sort_order: 0,
    skill_ids: []
  });
  const [newTech, setNewTech] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    fetchSkills();
    if (id) fetchProject();
  }, [id]);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills');
      setAllSkills(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/id/${id}`);
      const p = data.data;
      setFormData({
        title: p.title,
        short_desc: p.short_desc,
        description: p.description,
        thumbnail_url: p.thumbnail_url,
        live_url: p.live_url,
        github_url: p.github_url,
        tech_stack: p.tech_stack || [],
        category: p.category,
        status: p.status,
        featured: p.featured,
        sort_order: p.sort_order,
        skill_ids: (p.skills || []).map(s => s.id)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const addTech = () => {
    if (newTech.trim() && !formData.tech_stack.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        tech_stack: [...prev.tech_stack, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTech = (item) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.filter(i => i !== item)
    }));
  };

  const toggleSkill = (skillId) => {
    setFormData(prev => {
      const ids = [...prev.skill_ids];
      if (ids.includes(skillId)) {
        return { ...prev, skill_ids: ids.filter(id => id !== skillId) };
      } else {
        return { ...prev, skill_ids: [...ids, skillId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submission = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tech_stack' || key === 'skill_ids') {
          submission.append(key, JSON.stringify(formData[key]));
        } else {
          submission.append(key, formData[key]);
        }
      });
      if (thumbnailFile) submission.append('thumbnail', thumbnailFile);

      if (id) {
        await api.put(`/projects/${id}`, submission);
      } else {
        await api.post('/projects', submission);
      }
      router.push('/admin/projects');
    } catch (err) {
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic">Fetching Module Data...</div>;

  return (
    <div className="flex flex-col gap-12">
      {/* Form Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-4 text-primary font-black uppercase text-xs tracking-[0.25em] mb-4">
              <span className="w-12 h-[2px] bg-primary/20 rounded-full" />
              Deployment Pipeline
           </div>
           <h1 className="text-5xl font-black tracking-tighter text-white">{id ? 'Edit Platform Module' : 'Add New Project'}</h1>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" onClick={() => router.push('/admin/projects')} className="bg-white/5 border-white/5 px-8 py-4 font-bold active:scale-95 transition-all text-white/40 hover:text-white">Cancel Action</Button>
           <Button onClick={handleSubmit} disabled={loading} variant="primary" className="btn-premium px-12 py-4 font-black shadow-2xl shadow-primary/30 flex items-center gap-4 group active:scale-95 transition-all">
             {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} className="group-hover:rotate-12 transition-transform" /> {id ? 'Compile Updates' : 'Build & Deploy'}</>}
           </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Left Side: Main Details */}
         <div className="lg:col-span-2 flex flex-col gap-12">
            <Card className="p-12 border-white/5 bg-white/5 flex flex-col gap-8">
               <div className="flex flex-col gap-3">
                  <label className="text-sm font-black uppercase tracking-widest text-white/40 ml-1">Asset Title</label>
                  <input 
                    type="text" name="title" value={formData.title} onChange={handleChange} required
                    className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-3xl font-black text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                    placeholder="Project Name"
                  />
               </div>

               <div className="flex flex-col gap-3">
                  <label className="text-sm font-black uppercase tracking-widest text-white/40 ml-1">Short Description (Marketing Hook)</label>
                  <input 
                    type="text" name="short_desc" value={formData.short_desc} onChange={handleChange} required
                    className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl font-bold text-white/80 focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                    placeholder="Briefly explain what this project does..."
                  />
               </div>

               <div className="flex flex-col gap-3">
                  <label className="text-sm font-black uppercase tracking-widest text-white/40 ml-1">Detailed Technical Specifications</label>
                  <textarea 
                    name="description" value={formData.description} onChange={handleChange} required rows={10}
                    className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-lg font-medium text-white/60 focus:outline-none focus:border-primary transition-all placeholder:text-white/10 resize-none leading-relaxed"
                    placeholder="Provide a deep dive into the architecture, challenges, and solutions..."
                  />
               </div>
            </Card>

            <Card className="p-12 border-white/5 bg-white/5 flex flex-col gap-8">
               <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-4">
                 <Terminal size={24} className="text-primary" /> Tech Stack Integration
               </h3>
               <div className="flex flex-col gap-6">
                  <div className="flex gap-4">
                     <input 
                       type="text" value={newTech} onChange={(e) => setNewTech(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                       className="flex-grow bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-medium text-lg placeholder:text-white/10"
                       placeholder="e.g. Next.js, Redis, Docker..."
                     />
                     <Button type="button" onClick={addTech} variant="outline" className="bg-white/5 border-white/5 rounded-xl px-6 font-black"><Plus size={20} /></Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                     {formData.tech_stack.map((tech, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:border-red-400/50 hover:text-red-400 group cursor-pointer transition-all" onClick={() => removeTech(tech)}>
                           {tech} <X size={14} className="group-hover:rotate-90 transition-transform" />
                        </div>
                     ))}
                     {formData.tech_stack.length === 0 && <p className="text-white/20 font-bold italic text-sm">No technologies assigned yet.</p>}
                  </div>
               </div>
            </Card>
         </div>

         {/* Right Side: Sidebar Controls */}
         <div className="flex flex-col gap-12">
            {/* Media Upload */}
            <Card className="p-10 border-white/5 bg-white/5 flex flex-col gap-6">
               <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-4 uppercase text-xs tracking-widest text-white/40">Visual Asset</h3>
               <div className="relative aspect-video bg-white/5 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer group flex items-center justify-center overflow-hidden">
                  <input 
                    type="file" onChange={(e) => setThumbnailFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  {thumbnailFile || formData.thumbnail_url ? (
                    <img src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : formData.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/20 group-hover:text-primary transition-colors">
                      <ImageIcon size={48} strokeWidth={1} />
                      <span className="text-xs font-black uppercase tracking-widest">Upload Cover</span>
                    </div>
                  )}
               </div>
            </Card>

            {/* Deployment Links */}
            <Card className="p-10 border-white/5 bg-white/5 flex flex-col gap-8">
               <h3 className="text-xl font-black tracking-tight text-white uppercase text-xs tracking-widest text-white/40">Production Endpoints</h3>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Live URL</label>
                    <div className="relative group">
                      <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="url" name="live_url" value={formData.live_url} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold text-sm placeholder:text-white/5"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Github Source</label>
                    <div className="relative group">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="url" name="github_url" value={formData.github_url} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold text-sm placeholder:text-white/5"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
               </div>
            </Card>

            {/* Classification & Status */}
            <Card className="p-10 border-white/5 bg-white/5 flex flex-col gap-8">
               <h3 className="text-xl font-black tracking-tight text-white uppercase text-xs tracking-widest text-white/40">Classification</h3>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Primary Category</label>
                    <select 
                      name="category" value={formData.category} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold text-sm appearance-none cursor-pointer"
                    >
                      <option value="fullstack" className="bg-[#020817]">Fullstack Application</option>
                      <option value="web" className="bg-[#020817]">Frontend / Web UI</option>
                      <option value="mobile" className="bg-[#020817]">Mobile Development</option>
                      <option value="api" className="bg-[#020817]">Backend / API Microservice</option>
                      <option value="other" className="bg-[#020817]">Other Category</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Lifecycle Status</label>
                    <select 
                      name="status" value={formData.status} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold text-sm appearance-none cursor-pointer"
                    >
                      <option value="completed" className="bg-[#020817]">Live & Stable</option>
                      <option value="in_progress" className="bg-[#020817]">Actively Building</option>
                      <option value="archived" className="bg-[#020817]">Legacy / Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer group" onClick={() => handleChange({ target: { name: 'featured', type: 'checkbox', checked: !formData.featured }})}>
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-white group-hover:text-primary transition-colors uppercase tracking-widest">Featured Module</span>
                        <span className="text-[10px] font-bold text-white/30">Promote to homepage showcase</span>
                     </div>
                     <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${formData.featured ? 'bg-primary border-primary' : 'bg-transparent border-white/20'}`}>
                        {formData.featured && <CheckCircle2 size={16} className="text-white" />}
                     </div>
                  </div>
               </div>
            </Card>

            {/* Skill Alignment */}
            <Card className="p-10 border-white/5 bg-white/5 flex flex-col gap-6">
               <h3 className="text-xl font-black tracking-tight text-white uppercase text-xs tracking-widest text-white/40">Technical Alignment</h3>
               <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <div 
                      key={skill.id} 
                      onClick={() => toggleSkill(skill.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border ${formData.skill_ids.includes(skill.id) ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-white/30 hover:text-white'}`}
                    >
                      {skill.name}
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </form>
    </div>
  );
};

export default ProjectForm;
