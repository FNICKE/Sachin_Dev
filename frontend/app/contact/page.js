"use client";
import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, Loader2, CheckCircle2,
  Github, Linkedin, MessageSquare, Sparkles, Zap, Clock, ArrowRight
} from 'lucide-react';
import api from '@/lib/api';

const contactInfo = [
  {
    icon: <Mail size={22} />, label: 'Email', value: 'rthodsachin0766@gmail.com',
    href: 'mailto:rthodsachin0766@gmail.com', color: '#6366f1', glow: 'rgba(99,102,241,0.3)',
  },
  {
    icon: <Phone size={22} />, label: 'Phone', value: '+91 9604669232',
    href: 'tel:+919604669232', color: '#ec4899', glow: 'rgba(236,72,153,0.3)',
  },
  {
    icon: <MapPin size={22} />, label: 'Location', value: 'Mumbai, India',
    href: null, color: '#06b6d4', glow: 'rgba(6,182,212,0.3)',
  },
];

const socials = [
  { icon: <Github size={20} />, label: 'GitHub', href: 'https://github.com/FNICKE', color: '#fff' },
  { icon: <Linkedin size={20} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/sachin-rathod-469168310', color: '#0A66C2' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contacts', formData);
      setSent(true);
    } catch (err) {
      alert('Failed to send message. Please email directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-36 pb-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto flex flex-col gap-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col gap-5"
        >
          <div className="section-label justify-center">
            <MessageSquare size={14} /> Let&apos;s Connect
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Get in{' '}
            <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl font-medium max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(148,153,184,0.7)' }}>
            Have a project in mind, a question, or just want to say hi? My inbox is always open.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 5 }}
                className="rounded-2xl p-5 transition-all"
                style={{
                  background: 'rgba(10,15,30,0.8)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {item.href ? (
                  <a href={item.href} className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ background: `${item.color}14`, color: item.color, boxShadow: `0 0 20px ${item.glow}` }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.label}</p>
                      <p className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">{item.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}14`, color: item.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.label}</p>
                      <p className="font-semibold text-sm text-white">{item.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="rounded-2xl p-6 transition-all"
              style={{
                background: 'rgba(10,15,30,0.8)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Find Me Online</p>
              <div className="flex gap-3">
                {socials.map(s => (
                  <motion.a
                    key={s.label}
                    href={s.href} target="_blank" rel="noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {s.icon} {s.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'rgba(10,15,30,0.8)',
                border: '1px solid rgba(34,197,94,0.2)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 blur-2xl"
                style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }} />
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Available Now</span>
              </div>
              <p className="text-white font-bold mb-1">Open to Freelance</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Ready for new projects & collaborations</p>
            </motion.div>
          </motion.div>

          {/* Right – form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 rounded-3xl p-8 md:p-10"
            style={{
              background: 'linear-gradient(145deg, rgba(15,22,41,0.9), rgba(10,15,30,0.95))',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 flex flex-col items-center gap-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(34,197,94,0.12)',
                      border: '2px solid rgba(34,197,94,0.4)',
                      boxShadow: '0 0 40px rgba(34,197,94,0.2)',
                    }}
                  >
                    <CheckCircle2 size={44} className="text-emerald-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">Message Sent! 🎉</h3>
                    <p className="font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>I&apos;ll get back to you within 24 hours.</p>
                  </div>
                  <button
                    onClick={() => { setSent(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                    className="btn-premium btn-outline px-6 py-3 text-sm"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
                      <Zap size={18} style={{ color: '#818cf8' }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">Send a Message</h2>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Usually replies within 24 hours</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { key: 'name', label: 'Your Name', type: 'text', placeholder: 'Sachin Rathod' },
                      { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key} className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</label>
                        <input
                          type={type} value={formData[key]} required
                          onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                          onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
                          placeholder={placeholder}
                          className="w-full rounded-2xl px-5 py-4 text-white font-medium focus:outline-none transition-all placeholder:text-white/20"
                          style={{
                            background: focused === key ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                            border: focused === key ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                            boxShadow: focused === key ? '0 0 20px rgba(99,102,241,0.1)' : 'none',
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Subject</label>
                    <input
                      type="text" value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
                      placeholder="Project collaboration / Freelance inquiry..."
                      className="w-full rounded-2xl px-5 py-4 text-white font-medium focus:outline-none transition-all placeholder:text-white/20"
                      style={{
                        background: focused === 'subject' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                        border: focused === 'subject' ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: focused === 'subject' ? '0 0 20px rgba(99,102,241,0.1)' : 'none',
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Message</label>
                    <textarea
                      rows={6} value={formData.message} required
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                      placeholder="Tell me about your project, idea, or just say hello..."
                      className="w-full rounded-2xl px-5 py-4 text-white font-medium focus:outline-none transition-all placeholder:text-white/20 resize-none"
                      style={{
                        background: focused === 'message' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                        border: focused === 'message' ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: focused === 'message' ? '0 0 20px rgba(99,102,241,0.1)' : 'none',
                      }}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 text-base font-black rounded-2xl text-white mt-2 flex items-center justify-center gap-3 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      boxShadow: loading ? 'none' : '0 8px 25px rgba(99,102,241,0.4)',
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin" size={20} /> Sending...</>
                    ) : (
                      <><Send size={18} /> Send Message <ArrowRight size={16} /></>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
