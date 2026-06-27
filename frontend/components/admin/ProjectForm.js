"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge, RichTextEditor } from '@/components/ui';
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
  Clock,
  FolderOpen,
  RefreshCcw
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
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaImages, setMediaImages] = useState([]);
  const [mediaError, setMediaError] = useState('');

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

  const fetchMediaImages = async () => {
    setMediaLoading(true);
    setMediaError('');
    try {
      const { data } = await api.get('/media/uploads');
      setMediaImages(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setMediaImages([]);
      const status = err?.response?.status;
      setMediaError(
        status === 404
          ? 'Media route was not found on the backend. Start the updated local backend or redeploy the Render backend.'
          : err?.response?.data?.message || 'Failed to load uploaded images.'
      );
    } finally {
      setMediaLoading(false);
    }
  };

  const openMediaLibrary = () => {
    setMediaOpen(true);
    fetchMediaImages();
  };

  const selectMediaImage = (image) => {
    setThumbnailFile(null);
    setFormData(prev => ({ ...prev, thumbnail_url: image.url }));
    setMediaOpen(false);
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
        } else if (key === 'description') {
          const cleanedDesc = (formData[key] || '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\u00a0/g, ' ');
          submission.append(key, cleanedDesc);
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
      const errorMsg = err?.response?.data?.message || err?.message || 'Save failed';
      alert(`Save failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic">Fetching Module Data...</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Form Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-primary font-black uppercase text-[9px] tracking-[0.2em] mb-1">
              <span className="w-6 h-[2px] bg-primary/20 rounded-full" />
              Deployment Pipeline
           </div>
           <h1 className="text-xl font-black tracking-tight text-white">{id ? 'Edit Platform Module' : 'Add New Project'}</h1>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" onClick={() => router.push('/admin/projects')} className="bg-white/5 border-white/5 px-4 py-2 text-[11px] font-bold active:scale-95 transition-all text-white/40 hover:text-white rounded-lg">Cancel Action</Button>
           <Button onClick={handleSubmit} disabled={loading} variant="primary" className="btn-premium px-6 py-2 text-[11px] font-black shadow-lg shadow-primary/30 flex items-center gap-2 group active:scale-95 transition-all rounded-lg">
             {loading ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} className="group-hover:rotate-12 transition-transform" /> {id ? 'Compile Updates' : 'Build & Deploy'}</>}
           </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Side: Main Details */}
         <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-0.5">Asset Title</label>
                  <input 
                    type="text" name="title" value={formData.title} onChange={handleChange} required
                    className="bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                    placeholder="Project Name"
                  />
               </div>

               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-0.5">Short Description (Marketing Hook)</label>
                  <input 
                    type="text" name="short_desc" value={formData.short_desc} onChange={handleChange} required
                    className="bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-xs font-semibold text-white/80 focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                    placeholder="Briefly explain what this project does..."
                  />
               </div>

               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-0.5">Detailed Technical Specifications</label>
                  <RichTextEditor 
                    value={formData.description} 
                    onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                    placeholder="Provide a deep dive into the architecture, challenges, and solutions..."
                  />
               </div>
            </Card>

            <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
               <h3 className="text-xs font-black tracking-tight text-white flex items-center gap-2 uppercase tracking-widest text-white/40">
                 <Terminal size={14} className="text-primary" /> Tech Stack Integration
               </h3>
               <div className="flex flex-col gap-4">
                  <div className="flex gap-2.5">
                     <input 
                       type="text" value={newTech} onChange={(e) => setNewTech(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                       className="flex-grow bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all font-medium placeholder:text-white/10"
                       placeholder="e.g. Next.js, Redis, Docker..."
                     />
                     <Button type="button" onClick={addTech} variant="outline" className="bg-white/5 border-white/5 rounded-lg px-4 font-black"><Plus size={14} /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {formData.tech_stack.map((tech, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:border-red-400/50 hover:text-red-400 group cursor-pointer transition-all" onClick={() => removeTech(tech)}>
                           {tech} <X size={12} className="group-hover:rotate-90 transition-transform" />
                        </div>
                     ))}
                     {formData.tech_stack.length === 0 && <p className="text-white/20 font-bold italic text-xs">No technologies assigned yet.</p>}
                  </div>
               </div>
            </Card>
         </div>

         {/* Right Side: Sidebar Controls */}
         <div className="flex flex-col gap-6">
            {/* Media Upload */}
            <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">Visual Asset</h3>
               <div className="relative aspect-video max-h-32 bg-white/5 rounded-lg border border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer group flex items-center justify-center overflow-hidden">
                  <input 
                    type="file" onChange={(e) => {
                      setThumbnailFile(e.target.files[0]);
                      setFormData(prev => ({ ...prev, thumbnail_url: '' }));
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  {thumbnailFile || formData.thumbnail_url ? (
                    <img src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : formData.thumbnail_url} alt="Project visual asset preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-white/20 group-hover:text-primary transition-colors">
                      <ImageIcon size={24} strokeWidth={1} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Upload Cover</span>
                    </div>
                  )}
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={openMediaLibrary} className="bg-white/5 border-white/10 text-white/60 hover:text-white rounded-lg py-2 font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5">
                    <FolderOpen size={12} /> Uploads Folder
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setThumbnailFile(null);
                    setFormData(prev => ({ ...prev, thumbnail_url: '' }));
                  }} className="bg-white/5 border-white/10 text-white/40 hover:text-red-400 rounded-lg py-2 font-black uppercase tracking-widest text-[9px]">
                    Clear Image
                  </Button>
               </div>
            </Card>

            {/* Deployment Links */}
            <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">Production Endpoints</h3>
               <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Live URL</label>
                     <div className="relative group">
                       <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
                       <input 
                         type="url" name="live_url" value={formData.live_url} onChange={handleChange}
                         className="w-full bg-white/5 border border-white/10 rounded-lg px-9 py-2 text-white focus:outline-none focus:border-primary transition-all font-semibold text-xs placeholder:text-white/5"
                         placeholder="https://..."
                       />
                     </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Github Source</label>
                     <div className="relative group">
                       <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
                       <input 
                         type="url" name="github_url" value={formData.github_url} onChange={handleChange}
                         className="w-full bg-white/5 border border-white/10 rounded-lg px-9 py-2 text-white focus:outline-none focus:border-primary transition-all font-semibold text-xs placeholder:text-white/5"
                         placeholder="https://github.com/..."
                       />
                     </div>
                  </div>
               </div>
            </Card>

            {/* Classification & Status */}
            <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">Classification</h3>
               <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Primary Category</label>
                     <select 
                       name="category" value={formData.category} onChange={handleChange}
                       className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary transition-all font-semibold text-xs appearance-none cursor-pointer"
                     >
                       <option value="fullstack" className="bg-[#020817]">Fullstack Application</option>
                       <option value="web" className="bg-[#020817]">Frontend / Web UI</option>
                       <option value="mobile" className="bg-[#020817]">Mobile Development</option>
                       <option value="api" className="bg-[#020817]">Backend / API Microservice</option>
                       <option value="other" className="bg-[#020817]">Other Category</option>
                     </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                     <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Lifecycle Status</label>
                     <select 
                       name="status" value={formData.status} onChange={handleChange}
                       className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary transition-all font-semibold text-xs appearance-none cursor-pointer"
                     >
                       <option value="completed" className="bg-[#020817]">Live & Stable</option>
                       <option value="in_progress" className="bg-[#020817]">Actively Building</option>
                       <option value="archived" className="bg-[#020817]">Legacy / Archived</option>
                     </select>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer group" onClick={() => handleChange({ target: { name: 'featured', type: 'checkbox', checked: !formData.featured }})}>
                     <div className="flex flex-col">
                        <span className="text-xs font-black text-white group-hover:text-primary transition-colors uppercase tracking-widest">Featured Module</span>
                        <span className="text-[8px] font-bold text-white/30">Promote to homepage showcase</span>
                     </div>
                     <div className={`w-4.5 h-4.5 rounded-full border-2 transition-all flex items-center justify-center ${formData.featured ? 'bg-primary border-primary' : 'bg-transparent border-white/20'}`}>
                        {formData.featured && <CheckCircle2 size={12} className="text-white" />}
                     </div>
                  </div>
               </div>
            </Card>

            {/* Skill Alignment */}
            <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">Technical Alignment</h3>
               <div className="flex flex-wrap gap-1.5">
                  {allSkills.map((skill) => (
                    <div 
                      key={skill.id} 
                      onClick={() => toggleSkill(skill.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all border ${formData.skill_ids.includes(skill.id) ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-white/30 hover:text-white'}`}
                    >
                      {skill.name}
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </form>

      {mediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl">
          <div className="w-full max-w-2xl max-h-[75vh] overflow-hidden rounded-2xl border border-white/10 bg-[#050b18] shadow-2xl">
            <div className="flex items-center justify-between gap-4 p-4 border-b border-white/10">
              <div>
                <h2 className="text-base font-black text-white tracking-tight">Uploads Folder</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-0.5">
                  {mediaImages.length} stored image{mediaImages.length === 1 ? '' : 's'} found
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button type="button" variant="outline" onClick={fetchMediaImages} disabled={mediaLoading} className="bg-white/5 border-white/10 text-white/50 hover:text-white rounded-lg px-2.5 py-2">
                  {mediaLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                </Button>
                <Button type="button" variant="outline" onClick={() => setMediaOpen(false)} className="bg-white/5 border-white/10 text-white/50 hover:text-white rounded-lg px-2.5 py-2">
                  <X size={14} />
                </Button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(75vh-64px)]">
              {mediaLoading ? (
                <div className="py-16 text-center text-white/30 font-black uppercase tracking-widest animate-pulse text-xs">
                  Loading stored images...
                </div>
              ) : mediaError ? (
                <div className="py-16 text-center max-w-md mx-auto">
                  <ImageIcon size={32} className="mx-auto mb-3 text-red-400/30" />
                  <p className="text-red-300 font-black uppercase tracking-widest text-xs">Unable to load uploads</p>
                  <p className="text-white/35 text-xs font-medium mt-2 leading-relaxed">{mediaError}</p>
                </div>
              ) : mediaImages.length === 0 ? (
                <div className="py-16 text-center">
                  <ImageIcon size={32} className="mx-auto mb-3 text-white/10" />
                  <p className="text-white/30 font-black uppercase tracking-widest text-xs">No uploaded images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mediaImages.map((image) => (
                    <button
                      type="button"
                      key={image.name}
                      onClick={() => selectMediaImage(image)}
                      className="group text-left rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-primary/70 hover:bg-primary/10 transition-all"
                    >
                      <div className="aspect-video bg-black/30 overflow-hidden">
                        <img src={image.url} alt={image.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/60 truncate">{image.name}</p>
                        <p className="text-[8px] font-bold text-white/25 mt-0.5">{Math.round(image.size / 1024)} KB</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
