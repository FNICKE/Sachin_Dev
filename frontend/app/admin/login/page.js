"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { API_URL } from '@/lib/api';
import { Mail, Lock, LogIn, Loader2, ShieldCheck } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const [showForgot, setShowForgot] = useState(false);
  const [resetStatus, setResetStatus] = useState('');
  const [resetData, setResetData] = useState({ email: '', newPassword: '' });

  const handleDirectReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setResetStatus('Password successfully updated in your database.');
      setTimeout(() => { setShowForgot(false); setResetStatus(''); }, 3000);
    } catch (err) {
      setError(err.message || 'System failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg px-6 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <Card className="w-full max-w-md p-10 border-white/5 bg-white/5 backdrop-blur-2xl relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase underline decoration-primary underline-offset-8">Direct Reset</h1>
            <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-6">{resetStatus || 'Admin Credentials Update'}</p>
          </div>
          {!resetStatus && (
            <form onSubmit={handleDirectReset} className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Domain</label>
                <input 
                  type="email" value={resetData.email} onChange={(e) => setResetData({...resetData, email: e.target.value})} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all font-medium"
                  placeholder="admin@sachin.dev"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">New Security Password</label>
                <input 
                  type="password" value={resetData.newPassword} onChange={(e) => setResetData({...resetData, newPassword: e.target.value})} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-red-400 font-bold bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-xs text-center">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full py-5 text-lg font-black mt-4 shadow-2xl shadow-primary/20">
                {loading ? <Loader2 className="animate-spin" /> : 'Update Password Directly'}
              </Button>
              <button type="button" onClick={() => {setShowForgot(false); setError('');}} className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest text-center mt-2">← Back to Login Gate</button>
            </form>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md p-10 border-white/5 bg-white/5 backdrop-blur-2xl relative z-10">
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/20">
             <ShieldCheck className="text-primary" size={32} />
          </div>
          <div className="text-center">
             <h1 className="text-3xl font-black text-white tracking-tight">Admin Gateway</h1>
             <p className="text-white/40 font-bold mt-1 uppercase text-xs tracking-widest">Authorized Personnel Only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/60 ml-1">Email Domain</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:outline-none focus:border-primary transition-all font-medium text-lg placeholder:text-white/20"
                placeholder="admin@sachin.dev"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black uppercase tracking-widest text-white/60">Security Key</label>
              <button type="button" onClick={() => setShowForgot(true)} className="text-[10px] uppercase font-black tracking-widest text-primary/60 hover:text-primary transition-colors">
                 Forgot Access?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:outline-none focus:border-primary transition-all font-medium text-lg placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-sm text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full py-5 text-xl font-black mt-4 shadow-2xl shadow-primary/30 active:scale-95 transition-transform group">
             {loading ? <Loader2 className="animate-spin" /> : <>Access System <LogIn size={20} className="group-hover:translate-x-1 transition-transform" /></>}
          </Button>

          <div className="flex items-center justify-between mt-2 px-1">
            <button type="button" onClick={() => { setEmail(''); setPassword(''); setError(''); }} className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 hover:text-white transition-colors">
               Purge Fields
            </button>
            <button type="button" onClick={() => router.push('/')} className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 hover:text-white transition-colors">
               ← Main Portal
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
