"use client";
import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, Github, Linkedin, MessageSquare, Sparkles, Zap } from 'lucide-react';
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
  { icon: <Github size={20} />, label: 'GitHub', href: 'https://github.com/FNICKE', color: '#ffffff' },
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
      alert('Failed to send message. Please try emailing directly.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => `
    w-full bg-white/5 border rounded-2xl px-5 py-4 text-white font-medium
    focus:outline-none transition-all duration-300 placeholder:text-white/20 resize-none
    ${focused === field ? 'border-indigo-500/60 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-white/10 hover:border-white/20'}
  `;

  return (
    <div className="section-padding pt-40 min-h-screen" ref={ref}>
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
          <p className="text-xl text-white/40 font-medium max-w-xl mx-auto leading-relaxed">
            Have a project in mind, a question, or just want to say hi? My inbox is always open.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left sidebar — info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Contact cards */}
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 5, scale: 1.01 }}
                className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all"
              >
                {item.href ? (
                  <a href={item.href} className="flex items-center gap-5 group">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{ background: `${item.color}15`, color: item.color, boxShadow: `0 0 20px ${item.glow}` }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.label}</p>
                      <p className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors">{item.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}15`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.label}</p>
                      <p className="text-white font-semibold text-sm">{item.value}</p>
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
              className="glass-panel rounded-2xl p-6 border border-white/5"
            >
              <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Find Me Online</p>
              <div className="flex gap-3">
                {socials.map(s => (
                  <motion.a
                    key={s.label}
                    href={s.href} target="_blank" rel="noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/25 transition-all text-sm font-semibold"
                  >
                    {s.icon} {s.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Availability card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="glass-panel rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl" />
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Available Now</span>
              </div>
              <p className="text-white font-bold mb-1">Open to Freelance</p>
              <p className="text-white/40 text-sm">Ready for new projects & collaborations</p>
            </motion.div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 glass-panel rounded-3xl p-8 md:p-10 border border-white/5"
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
                    style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', boxShadow: '0 0 40px rgba(34,197,94,0.2)' }}
                  >
                    <CheckCircle2 size={44} className="text-emerald-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">Message Sent! 🎉</h3>
                    <p className="text-white/40 font-medium">I&apos;ll get back to you within 24 hours.</p>
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
                    <Zap size={20} className="text-indigo-400" />
                    <h2 className="text-xl font-black text-white">Send a Message</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Your Name</label>
                      <input
                        type="text" value={formData.name} required
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                        placeholder="Sachin Rathod"
                        className={inputClass('name')}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Email Address</label>
                      <input
                        type="email" value={formData.email} required
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                        placeholder="you@example.com"
                        className={inputClass('email')}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Subject</label>
                    <input
                      type="text" value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
                      placeholder="Project collaboration / Freelance inquiry..."
                      className={inputClass('subject')}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Message</label>
                    <textarea
                      rows={6} value={formData.message} required
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                      placeholder="Tell me about your project, idea, or just say hello..."
                      className={inputClass('message')}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-premium btn-primary w-full py-4 text-base font-black group mt-2"
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin" size={20} /> Sending...</>
                    ) : (
                      <><Send size={18} /> Send Message <span className="group-hover:translate-x-1 transition-transform inline-block">→</span></>
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
