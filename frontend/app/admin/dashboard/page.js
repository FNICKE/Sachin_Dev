"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, Button } from '@/components/ui';
import { 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Clock, 
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
     projects: 0,
     skills: 0,
     blogs: 0,
     messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projects, skills, blogs, messages] = await Promise.all([
        api.get('/projects').catch(() => ({ data: { data: [] } })),
        api.get('/skills').catch(() => ({ data: { data: [] } })),
        api.get('/blogs').catch(() => ({ data: { data: [] } })),
        api.get('/contacts').catch(() => ({ data: { data: [] } }))
      ]);
      setStats({
        projects: projects.data?.data?.length || 0,
        skills: skills.data?.data?.length || 0,
        blogs: blogs.data?.data?.length || 0,
        messages: messages.data?.data?.length || 0
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic">Compiling System Metrics...</div>;

  const cardData = [
    { title: 'Project Assets', value: stats.projects, icon: <Briefcase />, color: 'primary', link: '/admin/projects' },
    { title: 'Technical Skills', value: stats.skills, icon: <Zap />, color: 'secondary', link: '/admin/skills' },
    { title: 'Blog Content', value: stats.blogs, icon: <FileText />, color: 'primary', link: '/admin/blogs' },
    { title: 'Active Inquiries', value: stats.messages, icon: <MessageSquare />, color: 'secondary', link: '/admin/messages' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-2">
              <span className="w-8 h-[2px] bg-primary/20 rounded-full" />
              System Status: Nominal
           </div>
           <h1 className="text-3xl font-black tracking-tight text-white">Dashboard Overview</h1>
        </div>
        <div className="flex items-center gap-4 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl">
           <Clock className="text-primary" size={20} />
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 leading-none">Current System Lock</p>
              <p className="text-xs font-black text-white mt-1 leading-none">{new Date().toLocaleString()}</p>
           </div>
        </div>
      </div>
 
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
         {cardData.map((card, idx) => (
            <Link key={idx} href={card.link} className="block group">
              <Card className="p-4.5 border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group hover:-translate-y-1 rounded-xl border hover:border-primary/20 flex flex-col gap-3">
                 <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-lg group-hover:scale-105 transition-transform shrink-0">
                       {React.cloneElement(card.icon, { size: 16 })}
                    </div>
                    <span className="text-[9px] bg-green-500/10 text-green-400 font-black uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-green-500/10">
                       <TrendingUp size={9} /> +{(idx + 1) * 3.5}%
                    </span>
                 </div>
                 
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate">{card.title}</h3>
                    <p className="text-2xl font-black text-white mt-0.5 leading-none">{card.value}</p>
                 </div>
 
                 {/* Progress Bar (SaaS layout details) */}
                 <div className="flex flex-col gap-1.5 mt-0.5">
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/5">
                       <div 
                         className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000" 
                         style={{ width: `${Math.min(100, Math.max(15, (card.value * 8) || 30))}%` }}
                       />
                    </div>
                    <span className="text-[8px] text-white/20 font-bold uppercase tracking-wider">
                       Target Node Sync Status: Operational
                    </span>
                 </div>
              </Card>
            </Link>
         ))}
      </div>

      {/* Chart Section */}
      <Card className="p-5 border-white/5 bg-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
               <span className="text-[8px] bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-full font-black uppercase tracking-wider">Analytics telemetry</span>
               <h2 className="text-base font-black tracking-tight text-white mt-1.5">Monthly System Activity</h2>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-[10px] font-bold text-white/60">Node Traffic</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-secondary rounded-full" />
                  <span className="text-[10px] font-bold text-white/60">Mutations</span>
               </div>
               <select className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-white/70 focus:outline-none cursor-pointer">
                  <option className="bg-[#020817]">Last 6 Months</option>
                  <option className="bg-[#020817]">Last 12 Months</option>
               </select>
            </div>
         </div>

         {/* SVG Dashboard Line Chart */}
         <div className="w-full h-[150px] relative mt-2">
            <svg viewBox="0 0 1000 220" className="w-full h-full overflow-visible">
               <defs>
                  <linearGradient id="chartGradPrimary" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                     <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="chartGradSecondary" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                     <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                  </linearGradient>
               </defs>

               {/* Gridlines */}
               <line x1="0" y1="20" x2="1000" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
               <line x1="0" y1="70" x2="1000" y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
               <line x1="0" y1="120" x2="1000" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
               <line x1="0" y1="170" x2="1000" y2="170" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
               <line x1="0" y1="220" x2="1000" y2="220" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

               {/* Primary Area / Line (Traffic) */}
               <path 
                  d="M 50,180 C 150,140 200,90 350,110 C 500,130 600,40 750,70 C 900,100 950,120 1000,80 L 1000,220 L 50,220 Z" 
                  fill="url(#chartGradPrimary)" 
               />
               <path 
                  d="M 50,180 C 150,140 200,90 350,110 C 500,130 600,40 750,70 C 900,100 950,120 1000,80" 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
               />

               {/* Secondary Area / Line (Mutations) */}
               <path 
                  d="M 50,200 C 150,170 200,150 350,140 C 500,130 600,100 750,120 C 900,140 950,160 1000,110 L 1000,220 L 50,220 Z" 
                  fill="url(#chartGradSecondary)" 
               />
               <path 
                  d="M 50,200 C 150,170 200,150 350,140 C 500,130 600,100 750,120 C 900,140 950,160 1000,110" 
                  fill="none" 
                  stroke="#ec4899" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeDasharray="4 2"
               />

               {/* Data Points */}
               <circle cx="350" cy="110" r="5" fill="#6366f1" stroke="#020817" strokeWidth="2" />
               <circle cx="750" cy="70" r="5" fill="#6366f1" stroke="#020817" strokeWidth="2" />
               <circle cx="750" cy="120" r="4" fill="#ec4899" stroke="#020817" strokeWidth="2" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[9px] font-black text-white/30 uppercase mt-3 px-4 tracking-widest">
               <span>Jan / Node A</span>
               <span>Feb / Node B</span>
               <span>Mar / Node C</span>
               <span>Apr / Node D</span>
               <span>May / Node E</span>
               <span>Jun / Node F</span>
            </div>
         </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Recent Activity */}
         <Card className="lg:col-span-2 p-5 border-white/5 bg-white/5">
            <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-white/5">
               <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                  <Activity className="text-primary" size={16} /> System Deployment Logs
               </h2>
               <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Real-time Feed</span>
            </div>
            
            <div className="flex flex-col gap-3">
               {[1,2,3].map((log) => (
                 <div key={log} className="p-3 bg-white/2 hover:bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/10 shrink-0">
                          <CheckCircle2 size={14} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-white leading-none">Security Node Sync Completed</p>
                          <p className="text-[9px] font-bold text-white/30 mt-1 uppercase tracking-widest">System Protocol Ok · 10m ago</p>
                       </div>
                    </div>
                    <ArrowUpRight size={12} className="text-white/20 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                 </div>
               ))}
            </div>
         </Card>

         {/* Quick Actions */}
         <Card className="p-5 border-white/5 bg-white/5 flex flex-col justify-between">
            <div>
               <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-white/5">
                  <h2 className="text-sm font-black tracking-tight text-white">Quick Control</h2>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Actions</span>
               </div>
               <div className="flex flex-col gap-2.5">
                  <Link href="/admin/projects/new">
                    <Button className="w-full justify-between py-3 group bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest rounded-lg">
                       New Project <Zap size={12} className="group-hover:rotate-12 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/admin/skills">
                    <Button className="w-full justify-between py-3 group bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest rounded-lg">
                       New Technical Skill <Zap size={12} />
                    </Button>
                  </Link>
               </div>
            </div>
            
            <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-3">
               <ShieldCheck className="text-primary" size={20} />
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary leading-none">Security Standard</p>
                  <p className="text-[8px] font-bold text-white/40 mt-1">TLS 1.3 Encryption Active</p>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
