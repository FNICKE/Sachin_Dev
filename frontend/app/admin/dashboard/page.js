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
      const [projects, skills] = await Promise.all([
        api.get('/projects'),
        api.get('/skills')
      ]);
      setStats({
        projects: projects.data.data.length,
        skills: skills.data.data.length,
        blogs: 0,
        messages: 0
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
    <div className="flex flex-col gap-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-4 text-primary font-black uppercase text-xs tracking-[0.25em] mb-4">
              <span className="w-12 h-[2px] bg-primary/20 rounded-full" />
              System Status: Nominal
           </div>
           <h1 className="text-5xl font-black tracking-tighter text-white">Dashboard Overview</h1>
        </div>
        <div className="flex items-center gap-6 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
           <Clock className="text-primary" size={24} />
           <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/30">Current System Lock</p>
              <p className="font-black text-white">{new Date().toLocaleString()}</p>
           </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
         {cardData.map((card, idx) => (
           <Link key={idx} href={card.link}>
             <Card className="p-10 border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group hover:-translate-y-2 relative overflow-hidden">
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity bg-primary`} />
                <div className="flex items-center justify-between mb-8">
                   <div className="p-4 bg-white/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                      {card.icon}
                   </div>
                   <Activity className="text-white/10 group-hover:text-primary/30 transition-colors" size={24} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-2">{card.title}</h3>
                <div className="flex items-end gap-4">
                   <p className="text-5xl font-black text-white">{card.value}</p>
                   <div className="mb-2 text-green-500 font-black text-xs flex items-center gap-1">
                      <TrendingUp size={12} /> Live
                   </div>
                </div>
             </Card>
           </Link>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Recent Activity */}
         <Card className="lg:col-span-2 p-12 border-white/5 bg-white/5">
            <h2 className="text-2xl font-black tracking-tighter text-white mb-10 flex items-center gap-4">
               <Zap className="text-primary" size={24} /> Neural Deployment Logs
            </h2>
            <div className="flex flex-col gap-6">
               {[1,2,3].map((log) => (
                 <div key={log} className="p-6 bg-white/2 hover:bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                          <CheckCircle2 size={24} />
                       </div>
                       <div>
                          <p className="text-lg font-black text-white leading-none">Security Update Released</p>
                          <p className="text-xs font-bold text-white/30 mt-2 uppercase tracking-widest">Successful API Sync · 14m ago</p>
                       </div>
                    </div>
                    <ArrowUpRight className="text-white/10 group-hover:text-white transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </div>
               ))}
            </div>
         </Card>

         {/* Quick Actions */}
         <Card className="p-12 border-white/5 bg-white/5">
            <h2 className="text-2xl font-black tracking-tighter text-white mb-10">Command Center</h2>
            <div className="flex flex-col gap-4">
               <Link href="/admin/projects/new">
                 <Button className="w-full justify-between py-6 group bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-sm font-black uppercase tracking-widest">
                    Build New Project <Zap size={18} className="group-hover:rotate-12" />
                 </Button>
               </Link>
               <Link href="/admin/skills/page">
                 <Button className="w-full justify-between py-6 group bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all text-sm font-black uppercase tracking-widest">
                    Integrate New Skill <Zap size={18} />
                 </Button>
               </Link>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
