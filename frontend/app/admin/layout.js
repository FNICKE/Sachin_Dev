"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import ChatbotWrapper from '@/components/ui/ChatbotWrapper';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Settings, 
  User, 
  MessageSquare, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  PlusCircle
} from 'lucide-react';

const AdminRootLayout = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [user, loading, router, isLoginPage]);

  if (loading) return <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white text-3xl font-black animate-pulse uppercase tracking-[0.2em]">Initializing System...</div>;

  if (!user && !isLoginPage) return null;

  const menuItems = [
    { title: 'Overview', icon: <LayoutDashboard />, href: '/admin/dashboard', category: 'MAIN MENU' },
    { title: 'Projects', icon: <Briefcase />, href: '/admin/projects', category: 'CONTENT STRATEGY' },
    { title: 'Blog Articles', icon: <FileText />, href: '/admin/blogs', category: 'CONTENT STRATEGY' },
    { title: 'Technical Skills', icon: <Settings />, href: '/admin/skills', category: 'PLATFORM SETTINGS' },
    { title: 'Inquiries', icon: <MessageSquare />, href: '/admin/messages', category: 'PLATFORM SETTINGS' },
  ];

  const getBreadcrumbs = () => {
    const crumbs = ['Console'];
    if (pathname === '/admin/dashboard') crumbs.push('Overview');
    else if (pathname === '/admin/projects') crumbs.push('Projects');
    else if (pathname === '/admin/blogs') crumbs.push('Blog Articles');
    else if (pathname === '/admin/skills') crumbs.push('Technical Skills');
    else if (pathname === '/admin/messages') crumbs.push('Inquiries');
    else {
      if (pathname.includes('/projects/new')) crumbs.push('Projects', 'New Project');
      else if (pathname.includes('/projects/')) crumbs.push('Projects', 'Edit Project');
      else if (pathname.includes('/blogs/new')) crumbs.push('Blogs', 'New Article');
      else if (pathname.includes('/blogs/')) crumbs.push('Blogs', 'Edit Article');
      else crumbs.push('Dashboard');
    }
    return crumbs;
  };

  const getCurrentPageTitle = () => {
    switch (pathname) {
      case '/admin/dashboard': return 'Overview';
      case '/admin/projects': return 'Projects';
      case '/admin/blogs': return 'Blog Articles';
      case '/admin/skills': return 'Technical Skills';
      case '/admin/messages': return 'Inquiries';
      default:
        if (pathname.includes('/projects/new')) return 'New Project';
        if (pathname.includes('/projects/')) return 'Edit Project';
        if (pathname.includes('/blogs/new')) return 'New Article';
        if (pathname.includes('/blogs/')) return 'Edit Article';
        return 'Sachin Portfolio';
    }
  };

  // If it's the login page, just render the content without the admin sidebar
  if (isLoginPage) return <>{children}</>;

  // Group menu items by category
  const categories = ['MAIN MENU', 'CONTENT STRATEGY', 'PLATFORM SETTINGS'];

  return (
    <div className="min-h-screen bg-[#020817] flex text-white relative">
      <div className="fixed inset-0 bg-mesh opacity-20 pointer-events-none -z-10 bg-[length:200%_200%] animate-gradient" />
      
      {/* SaaS Sidebar */}
      <aside className="w-64 h-screen sticky top-0 border-r border-white/5 bg-white/2 backdrop-blur-3xl flex flex-col p-5 shrink-0 z-40">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
            <ShieldCheck size={20} className="text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight leading-none text-white">Sachin Dev</h2>
            <p className="text-[8px] font-black uppercase tracking-widest text-primary mt-0.5">Management Gate</p>
          </div>
        </div>

        {/* Sidebar Search Bar (SaaS layout style) */}
        <div className="relative mb-6 px-1">
          <input 
            type="text" 
            placeholder="Quick search menu..." 
            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 pl-8 text-[11px] font-semibold text-white/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <svg className="w-3.5 h-3.5 text-white/30 absolute left-4 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        {/* Grouped Sidebar Navigation */}
        <div className="flex flex-col gap-4 flex-grow overflow-y-auto px-0.5 pr-0">
          {categories.map((cat, catIdx) => (
            <div key={catIdx} className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black tracking-widest text-white/20 px-3 uppercase">{cat}</span>
              <nav className="flex flex-col gap-1">
                {menuItems.filter(item => item.category === cat).map((item, idx) => (
                  <Link 
                    key={idx} 
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-bold text-[12px] transition-all group ${pathname === item.href ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-white/10' : 'text-white/45 hover:bg-white/5 hover:text-white border border-transparent'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      {React.cloneElement(item.icon, { size: 14, className: pathname === item.href ? 'text-white font-black' : 'text-white/40 group-hover:text-white transition-colors' })} 
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight size={10} className={`transition-transform duration-300 ${pathname === item.href ? 'translate-x-0.5 opacity-100' : 'opacity-0'}`} />
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Details */}
        <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
           {user && (
             <div className="flex items-center gap-2.5 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center font-black text-secondary text-xs">
                   {user.name ? user.name[0] : 'S'}
                </div>
                <div className="flex-grow overflow-hidden">
                   <p className="text-[11px] font-black truncate text-white leading-none">{user.name}</p>
                   <p className="text-[8px] font-bold text-white/30 truncate uppercase tracking-widest mt-1">{user.role}</p>
                </div>
             </div>
           )}
        </div>
      </aside>

      {/* Main Panel Content Wrapper */}
      <div className="flex-grow flex flex-col min-h-screen">
        {/* Top Header Navbar */}
        <header className="h-14 border-b border-white/5 bg-[#020817]/60 backdrop-blur-3xl px-6 flex items-center justify-between sticky top-0 z-30">
          {/* Page title and Breadcrumbs */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
              {getBreadcrumbs().map((crumb, index) => (
                <React.Fragment key={index}>
                  <span>{crumb}</span>
                  {index < getBreadcrumbs().length - 1 && <span className="text-white/20">/</span>}
                </React.Fragment>
              ))}
            </div>
            <h1 className="text-sm font-black text-white/95 uppercase tracking-wider leading-none">{getCurrentPageTitle()}</h1>
          </div>

          {/* Center search input */}
          <div className="hidden md:flex items-center relative w-80 group">
            <svg className="w-3.5 h-3.5 text-white/30 group-focus-within:text-primary absolute left-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search administration nodes..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 pl-9 pr-3 text-[11px] font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-all focus:bg-white/10 focus:shadow-md focus:shadow-primary/5"
            />
          </div>
          
          {/* Right menu utility buttons */}
          <div className="flex items-center gap-4">
             {/* Live Web link */}
             <a href="/" target="_blank" title="View Portfolio Site" className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-all border border-white/5 flex items-center justify-center">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
             </a>

             {/* Notifications */}
             <button title="In-App Notifications" className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-all border border-white/5 flex items-center justify-center relative">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path></svg>
               <span className="w-1.5 h-1.5 bg-primary rounded-full absolute top-1.5 right-1.5 animate-pulse" />
             </button>

             <span className="w-[1px] h-5 bg-white/10" />

             {/* Exit logout button */}
             <button 
               onClick={logout} 
               className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/10 hover:border-red-500/20 active:scale-95 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"
             >
                <LogOut size={11} /> Exit Gate
             </button>
          </div>
        </header>

        {/* Dynamic Page Rendering */}
        <main className="flex-grow p-6 overflow-x-hidden">
          {children}
        </main>

        {/* AI Chatbot — available on all admin pages */}
        <ChatbotWrapper />
      </div>
    </div>
  );
};

export default AdminRootLayout;
