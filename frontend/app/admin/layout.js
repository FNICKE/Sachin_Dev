"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
    { title: 'Overview', icon: <LayoutDashboard />, href: '/admin/dashboard' },
    { title: 'Projects', icon: <Briefcase />, href: '/admin/projects' },
    { title: 'Blog Articles', icon: <FileText />, href: '/admin/blogs' },
    { title: 'Technical Skills', icon: <Settings />, href: '/admin/skills' },
    { title: 'Inquiries', icon: <MessageSquare />, href: '/admin/messages' },
  ];

  // If it's the login page, just render the content without the admin sidebar
  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#020817] flex text-white relative">
      <div className="fixed inset-0 bg-mesh opacity-20 pointer-events-none -z-10 bg-[length:200%_200%] animate-gradient" />
      
      <aside className="w-80 h-screen sticky top-0 border-r border-white/5 bg-white/2 backdrop-blur-3xl flex flex-col p-8 shrink-0">
        <div className="flex items-center gap-4 mb-20">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20">
            <ShieldCheck size={28} className="text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight leading-none">Admin Panel</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Sachin Portfolio</p>
          </div>
        </div>

        <nav className="flex flex-col gap-3 flex-grow">
          {menuItems.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href}
              className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-base transition-all group ${pathname === item.href ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-4">
                {item.icon} {item.title}
              </div>
              <ChevronRight size={16} className={`transition-transform duration-300 ${pathname === item.href ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5 flex flex-col gap-6">
           {user && (
             <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl">
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center font-black text-secondary">
                  {user.name ? user.name[0] : 'S'}
                </div>
                <div className="flex-grow overflow-hidden">
                   <p className="text-sm font-black truncate">{user.name}</p>
                   <p className="text-[10px] font-bold text-white/30 truncate uppercase tracking-widest">{user.role}</p>
                </div>
             </div>
           )}
           <button 
             onClick={logout} 
             className="flex items-center gap-4 text-white/40 hover:text-red-400 px-6 py-4 rounded-2xl transition-all font-bold hover:bg-red-400/5 group"
           >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" /> Sign Out
           </button>
        </div>
      </aside>

      <main className="flex-grow p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AdminRootLayout;
