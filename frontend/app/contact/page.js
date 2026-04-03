"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import api from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contacts', formData);
      setSent(true);
    } catch (err) { alert('Failed to send message'); }
    finally { setLoading(false); }
  };

  return (
    <div className="section-padding pt-44">
       <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <div className="flex flex-col gap-4 text-center">
             <div className="section-label justify-center">Connect</div>
             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Get in Touch</h1>
             <p className="text-xl text-white/40 font-medium">Have a project or just want to say hi? I&apos;d love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {/* Info */}
             <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                   <h3 className="text-2xl font-black text-white tracking-tight">Contact Information</h3>
                   <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5"><Mail size={24} /></div>
                         <div><p className="text-xs font-black uppercase tracking-widest text-white/30">Email</p><p className="text-lg font-bold text-white">rthodsachin0766@gmail.com</p></div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-secondary border border-white/5"><Phone size={24} /></div>
                         <div><p className="text-xs font-black uppercase tracking-widest text-white/30">Phone</p><p className="text-lg font-bold text-white">+91 9604669232</p></div>
                      </div>
                   </div>
                </div>
                <Card className="p-8 border-white/5 bg-white/5">
                   <h4 className="text-lg font-black text-white mb-2">Available for Freelance</h4>
                   <p className="text-sm font-medium text-white/40 mb-6">I am currently available for new fullstack projects and remote collaborations.</p>
                   <Button variant="primary" className="btn-premium w-full">Schedule a Call</Button>
                </Card>
             </div>

             {/* Form */}
             <Card className="p-10 border-white/5 bg-white/5">
                {sent ? (
                  <div className="text-center py-20 flex flex-col items-center gap-6 animate-fade-in">
                     <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 border border-green-500/20 shadow-2xl shadow-green-500/20"><CheckCircle2 size={40} /></div>
                     <h3 className="text-3xl font-black text-white">Message Sent!</h3>
                     <p className="text-white/40 font-bold uppercase text-xs tracking-widest">I will get back to you shortly.</p>
                     <Button onClick={() => setSent(false)} className="btn-premium btn-outline mt-4">Send another</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Your Full Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all font-medium" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all font-medium" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Message Body</label>
                        <textarea rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all font-medium resize-none leading-relaxed" />
                     </div>
                     <Button type="submit" disabled={loading} className="w-full btn-premium btn-primary py-5 text-lg font-black group">
                        {loading ? <Loader2 className="animate-spin" /> : <>Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
                     </Button>
                  </form>
                )}
             </Card>
          </div>
       </div>
    </div>
  );
}
