"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, ChevronDown, Trash2 } from 'lucide-react';

import { API_URL } from '@/lib/api';

// ─── Chat message component ────────────────────────────────────────────────────
const ChatMessage = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
        isUser
          ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30'
          : 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30'
      }`}>
        {isUser
          ? <User size={14} className="text-white" />
          : <Bot size={14} className="text-white" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-indigo-600 text-white rounded-tr-sm'
          : 'bg-white/5 border border-white/8 text-white/90 rounded-tl-sm'
      }`}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>
            {line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>
                : part
            )}
            {i < msg.content.split('\n').length - 1 && <br />}
          </span>
        ))}
        <div className={`text-[9px] mt-1.5 ${isUser ? 'text-indigo-200/60 text-right' : 'text-white/30'}`}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Typing indicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
    <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
      <Bot size={14} className="text-white" />
    </div>
    <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </motion.div>
);

// ─── Quick suggestion chips ────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What tech stack is used?",
  "How does the rich text editor work?",
  "What API endpoints exist?",
  "How is auth implemented?",
];

// ─── Main Chatbot component ────────────────────────────────────────────────────
export default function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm Sachin's AI assistant. I know everything about this portfolio — the frontend pages, backend controllers, database schema, and tech stack. What would you like to know?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;

    const userMsg = { role: 'user', content: userText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data?.data?.reply || "I couldn't generate a response. Please try again.";

      const botMsg = { role: 'assistant', content: botReply, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);

      if (!isOpen) setUnread(prev => prev + 1);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I encountered an error connecting to the AI service. Please check your internet connection and try again.",
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! I'm Sachin's AI assistant. Ask me anything about this portfolio.",
      timestamp: Date.now()
    }]);
    setShowSuggestions(true);
  };

  return (
    <>
      {/* Floating toggle button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-indigo-500/40 flex items-center justify-center cursor-pointer border border-white/10"
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-indigo-500/30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <MessageCircle size={22} className="text-white" />
              {/* Unread badge */}
              {unread > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full text-[10px] font-black text-white flex items-center justify-center"
                >
                  {unread}
                </motion.span>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-6 right-6 w-[360px] sm:w-[400px] h-[580px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/8"
              style={{
                background: 'rgba(8, 10, 22, 0.97)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/6 bg-gradient-to-r from-violet-600/15 to-indigo-600/15">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Bot size={16} className="text-white" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#080a16]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">Portfolio AI</span>
                      <Sparkles size={11} className="text-indigo-400" />
                    </div>
                    <p className="text-[10px] text-emerald-400 font-semibold">Online · Powered by Groq LLaMA</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearChat}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
                    title="Clear chat"
                  >
                    <Trash2 size={12} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} msg={msg} />
                ))}
                {isLoading && <TypingIndicator />}

                {/* Quick suggestions */}
                {showSuggestions && messages.length === 1 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-2 mt-2"
                  >
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Suggested questions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTIONS.map((s, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => sendMessage(s)}
                          className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-1.5 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all text-left"
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="px-3 py-3 border-t border-white/6 bg-white/[0.02]">
                <div className="flex items-end gap-2.5 bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 focus-within:border-indigo-500/40 transition-all">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about projects, APIs, tech stack…"
                    rows={1}
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/25 resize-none outline-none leading-relaxed max-h-24 overflow-y-auto disabled:opacity-50"
                    style={{ scrollbarWidth: 'none' }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="shrink-0 w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/30"
                  >
                    {isLoading
                      ? <Loader2 size={14} className="text-white animate-spin" />
                      : <Send size={14} className="text-white" />
                    }
                  </motion.button>
                </div>
                <p className="text-[9px] text-white/15 text-center mt-2 font-medium">
                  Press Enter to send · Shift+Enter for new line
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
