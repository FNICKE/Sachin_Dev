"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, Button, Badge } from '@/components/ui';
import { 
  Search, 
  Trash2, 
  Eye, 
  X, 
  Mail, 
  Calendar, 
  Globe, 
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/contacts');
      setMessages(data.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (msg) => {
    setSelectedMessage(msg);
    setModalOpen(true);
    
    // If message is unread, update it to read on backend
    if (msg.status === 'unread') {
      try {
        await api.put(`/contacts/${msg.id}`, { status: 'read' });
        // Update local state status
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
      } catch (err) {
        console.error('Failed to update message status:', err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      setModalOpen(false);
      fetchMessages();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      return dateStr;
    }
  };

  if (loading) return <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic">Decoding Visitor Signals...</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-3">
        <div>
           <div className="flex items-center gap-2 text-primary font-black uppercase text-[9px] tracking-[0.2em] mb-1">
              <span className="w-6 h-[2px] bg-primary/20 rounded-full" />
              Visitor Relations
           </div>
           <h1 className="text-xl font-black tracking-tight text-white">Inquiries / Messages</h1>
        </div>
      </div>

      {/* SaaS Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white/2 border border-white/5 rounded-xl p-3">
         {/* Search Input */}
         <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3.5 top-2.5 text-white/30 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-10 pr-3 text-xs font-semibold text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
              placeholder="Search messages by sender name, email, subject..."
            />
         </div>

         {/* Selection Filters */}
         <div className="flex gap-2.5 w-full md:w-auto items-center justify-end">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white/70 focus:outline-none cursor-pointer appearance-none min-w-[120px] text-center"
            >
               <option value="all" className="bg-[#020817]">All Statuses</option>
               <option value="unread" className="bg-[#020817]">Unread</option>
               <option value="read" className="bg-[#020817]">Read</option>
            </select>
         </div>
      </div>

      {/* Messages Table */}
      <Card className="p-0 border-white/5 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Sender Details</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Subject</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Time</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Status</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMessages.map((msg) => (
                <tr key={msg.id} className={`hover:bg-white/2 transition-colors group ${msg.status === 'unread' ? 'bg-white/[0.01]' : ''}`}>
                  <td className="px-5 py-2.5">
                     <div>
                        <p className={`text-xs font-black ${msg.status === 'unread' ? 'text-white' : 'text-white/70'} truncate group-hover:text-primary transition-colors leading-none`}>{msg.name}</p>
                        <p className="text-[9px] font-semibold text-white/30 mt-1 leading-none">{msg.email}</p>
                     </div>
                  </td>
                  <td className="px-5 py-2.5">
                     <p className={`text-xs max-w-xs truncate ${msg.status === 'unread' ? 'font-black text-white' : 'font-medium text-white/60'} leading-none`}>{msg.subject}</p>
                     <p className="text-[9px] text-white/25 mt-1 truncate max-w-xs leading-none">{msg.message}</p>
                  </td>
                  <td className="px-5 py-2.5">
                     <div className="flex items-center gap-1.5 text-white/40 font-bold text-[11px]">
                        <Calendar size={12} /> {formatDate(msg.created_at)}
                     </div>
                  </td>
                  <td className="px-5 py-2.5">
                     <Badge 
                       variant={msg.status === 'unread' ? 'secondary' : 'success'} 
                       className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 flex items-center gap-1 w-fit"
                     >
                       {msg.status === 'unread' ? <AlertCircle size={10} /> : <CheckCircle2 size={10} />}
                       {msg.status}
                     </Badge>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                     <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleOpenMessage(msg)} className="p-2 bg-white/5 text-white/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all border border-white/5 cursor-pointer">
                          <Eye size={12} />
                        </button>
                        <button onClick={() => handleDelete(msg.id)} className="p-2 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all border border-white/5 cursor-pointer">
                          <Trash2 size={12} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredMessages.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-white/20 font-bold italic text-xs">
                    No contact messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Datatable pagination bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/5 bg-white/2">
           <p className="text-[9px] font-black text-white/25 uppercase tracking-widest">
              Showing {filteredMessages.length} of {messages.length} Entries
           </p>
           <div className="flex items-center gap-1.5">
              <button disabled className="px-3 py-1.5 bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/20 rounded-lg transition-all cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1.5 bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/20 rounded-lg transition-all cursor-not-allowed">Next</button>
           </div>
        </div>
      </Card>

      {/* Message Reader Modal */}
      {modalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-xl animate-fade-in">
          <Card className="w-full max-w-md border-white/10 bg-[#050b18] shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-primary" size={18} />
                <h2 className="text-base font-black text-white tracking-tight">Visitor Inquiry Details</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white/40 hover:text-white transition-colors p-1.5 bg-white/5 rounded-lg border border-white/5">
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 bg-white/5 rounded-xl p-4 border border-white/5">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30">From Name</p>
                  <p className="text-sm font-black text-white mt-0.5">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Email Address</p>
                  <a href={`mailto:${selectedMessage.email}`} className="text-sm font-black text-primary mt-0.5 hover:underline flex items-center gap-1.5">
                    <Mail size={14} /> {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Time Received</p>
                  <p className="text-xs font-bold text-white/60 mt-0.5">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Client Network IP</p>
                  <p className="text-xs font-bold text-white/60 mt-0.5 flex items-center gap-1.5">
                    <Globe size={12} /> {selectedMessage.ip_address || 'Unavailable'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Subject Header</p>
                <p className="text-sm font-black text-white mt-1.5 bg-white/5 px-4 py-2.5 rounded-lg border border-white/5">{selectedMessage.subject}</p>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Narrative Message</p>
                <div className="text-xs font-medium text-white/70 mt-1.5 bg-white/5 px-4 py-4 rounded-xl border border-white/5 leading-relaxed whitespace-pre-wrap max-h-[180px] overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex gap-2.5 border-t border-white/10 pt-4 mt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="bg-white/5 border-white/5 flex-grow py-2 text-xs font-bold text-white/40 hover:text-white rounded-lg">
                  Close Reader
                </Button>
                <Button type="button" onClick={() => handleDelete(selectedMessage.id)} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 flex-grow py-2 text-[11px] font-black flex items-center justify-center gap-2 rounded-lg transition-all">
                  <Trash2 size={14} /> Delete Message
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MessagesManagement;
