"use client";
import React, { useState, useEffect, useCallback } from 'react';
import api, { BASE_URL } from '@/lib/api';
import { Card } from '@/components/ui';
import { 
  ArrowLeft, ExternalLink, Github, Globe, Rocket, Layers, CheckCircle2, 
  ImageIcon, Code2, Server, Star, ChevronRight, Activity 
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const techColors = {
  'React': '#61DAFB', 'Next.js': '#ffffff', 'Node.js': '#68A063',
  'MongoDB': '#4DB33D', 'MySQL': '#00758F', 'TypeScript': '#3178C6',
  'JavaScript': '#F7DF1E', 'Python': '#3776AB', 'Tailwind': '#38BDF8',
  'CSS': '#1572B6', 'HTML': '#E34F26'
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/1200x630/020817/white?text=No+Preview';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const fetchProject = useCallback(async () => {
    try {
      const { data } = await api.get(`/projects/${slug}`);
      setProject(data.data);
    } catch (err) {
      if (err.response?.status === 404) router.push('/projects');
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-[4px] border-indigo-500/20 border-t-indigo-500 rounded-full mb-6" 
      />
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <h2 className="text-xl font-bold text-indigo-400 tracking-widest uppercase">Loading Canvas...</h2>
      </motion.div>
    </div>
  );
  
  if (!project) return null;

  const techList = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : (project.tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);

  const images = project.images || [];

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-indigo-500/30 overflow-hidden relative pb-32">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 pt-32 lg:pt-40 max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Navigation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link href="/projects" className="inline-flex items-center gap-3 text-white/50 hover:text-indigo-400 transition-colors font-bold uppercase text-[10px] tracking-[0.2em] bg-white/5 border border-white/5 px-4 py-2 rounded-lg hover:border-indigo-500/30">
            <ArrowLeft size={14} /> Back to Projects
          </Link>
        </motion.div>

        {/* Title Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:items-end justify-between mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-5 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-md flex items-center gap-2">
                {project.category === 'web' ? <Globe size={12} /> : project.category === 'mobile' ? <Rocket size={12} /> : <Layers size={12} />}
                {project.category || 'System'}
              </span>
              {project.featured && (
                <span className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-md flex items-center gap-2">
                  <Star size={12} /> Featured
                </span>
              )}
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-white leading-[1.1]">
              {project.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/50 font-medium leading-relaxed max-w-3xl mt-2">
              {project.short_desc}
            </p>
          </motion.div>

          {/* Links */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 shrink-0">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold uppercase tracking-widest text-[11px] transition-colors shadow-lg shadow-indigo-500/25">
                <ExternalLink size={16} /> Live Preview
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 rounded-xl text-white font-bold uppercase tracking-widest text-[11px] transition-colors">
                <Github size={16} /> Source Code
              </a>
            )}
          </motion.div>
        </div>

        {/* Clear & Visible Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
          className="relative group w-full mb-20"
        >
           <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2rem] blur-2xl opacity-50 transition-all duration-700 pointer-events-none" />
           <div className="relative bg-white/5 border border-white/10 p-2 md:p-3 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="w-full bg-[#030303] rounded-[1.5rem] overflow-hidden flex items-center justify-center min-h-[40vh]">
                {/* using object-contain to ALWAYS make the entire image perfectly visible without cropping */}
                <img 
                  src={getImageUrl(project.thumbnail_url)} 
                  className="w-full h-auto max-h-[75vh] object-contain object-center rounded-[1.5rem]" 
                  alt={project.title} 
                />
              </div>
           </div>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Content Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-8 flex flex-col gap-16"
          >
            {/* Overview */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-indigo-400" size={24} />
                <h2 className="text-3xl font-black text-white tracking-tight">Project Overview</h2>
              </div>
              <div className="prose-styles bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 text-lg text-white/70 leading-relaxed font-medium">
                {project.description.split('\n').map((paragraph, idx) => (
                   <p key={idx} className="mb-6 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {images.length > 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-pink-400" size={24} />
                  <h2 className="text-3xl font-black text-white tracking-tight">Gallery</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {images.map((img, idx) => (
                    <div key={img.id || idx} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-lg cursor-pointer">
                      <img src={getImageUrl(img.url)} alt={`Gallery ${idx}`} className="w-full h-auto object-cover aspect-video hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="lg:col-span-4 flex flex-col gap-8 sticky top-24 h-fit"
          >
            {/* Core Tech Stack */}
            {techList.length > 0 && (
              <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl flex flex-col gap-6 rounded-3xl">
                <div className="flex items-center gap-3">
                  <Code2 className="text-indigo-400" size={20} />
                  <h3 className="text-xl font-black text-white tracking-tight">Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {techList.map((tech, idx) => {
                     const tColor = techColors[tech] || '#a5b4fc';
                     return (
                       <span key={idx} className="px-3 py-1.5 bg-black/40 border rounded-lg text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ borderColor: `${tColor}40` }}>
                         <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tColor }} />
                         {tech}
                       </span>
                     )
                  })}
                </div>
              </Card>
            )}

            {/* Skills */}
            {project.skills && project.skills.length > 0 && (
              <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl flex flex-col gap-6 rounded-3xl">
                <div className="flex items-center gap-3">
                  <Server className="text-purple-400" size={20} />
                  <h3 className="text-xl font-black text-white tracking-tight">Capabilities</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {project.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                       <span className="text-sm font-bold text-white/80">{skill.name}</span>
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-300 bg-purple-500/10 px-2 py-1 rounded-md">
                         {skill.level}
                       </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>

        </div>
      </div>
      
      <style jsx global>{`
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 5px; border: 2px solid #050505; }
        ::-webkit-scrollbar-thumb:hover { background: #444; }
        
        .prose-styles p {
          text-align: left;
        }
        .prose-styles strong {
          color: white;
          font-weight: 900;
        }
      `}</style>
    </div>
  );
}
