"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, Button, Badge } from '@/components/ui';
import { 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Loader2, 
  Folder, 
  Award,
  ArrowUpDown,
  Settings,
  HelpCircle
} from 'lucide-react';

const SkillsManagement = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Form State
  const [formSkill, setFormSkill] = useState({
    id: null,
    name: '',
    icon_url: '',
    category: 'other',
    level: 80,
    sort_order: 0
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills');
      setSkills(data.data);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormSkill({
      id: null,
      name: '',
      icon_url: '',
      category: 'other',
      level: 80,
      sort_order: 0
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (skill) => {
    setFormSkill({
      id: skill.id,
      name: skill.name,
      icon_url: skill.icon_url || '',
      category: skill.category || 'other',
      level: skill.level || 80,
      sort_order: skill.sort_order || 0
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this technical skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormSkill(prev => ({
      ...prev,
      [name]: name === 'level' || name === 'sort_order' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formSkill.name.trim()) return;

    setSaveLoading(true);
    try {
      if (formSkill.id) {
        await api.put(`/skills/${formSkill.id}`, formSkill);
      } else {
        await api.post('/skills', formSkill);
      }
      setModalOpen(false);
      fetchSkills();
    } catch (err) {
      alert('Failed to save skill');
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      frontend: 'Frontend Web',
      backend: 'Backend Services',
      database: 'Database Engine',
      devops: 'DevOps & Cloud',
      mobile: 'Mobile Development',
      other: 'Other Skill'
    };
    return categories[category] || category;
  };

  if (loading) return <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic">Initializing Technical Modules...</div>;

  const filteredSkills = skills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
        <div>
           <div className="flex items-center gap-2 text-primary font-black uppercase text-[9px] tracking-[0.2em] mb-1">
              <span className="w-6 h-[2px] bg-primary/20 rounded-full" />
              Technical Stack
           </div>
           <h1 className="text-xl font-black tracking-tight text-white">Technical Credentials</h1>
        </div>
        <Button onClick={handleOpenAddModal} variant="primary" className="btn-premium px-3.5 py-2 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 rounded-lg shadow-lg">
          <PlusCircle size={14} className="group-hover:rotate-90 transition-transform" strokeWidth={2.5} /> Add New Skill
        </Button>
      </div>

      {/* SaaS Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white/2 border border-white/5 rounded-xl p-3">
         {/* Search Input */}
         <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3.5 top-2.5 text-white/30 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-10 pr-3 text-xs font-semibold text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
              placeholder="Search skills by name..."
            />
         </div>

         {/* Selection Filters */}
         <div className="flex gap-2.5 w-full md:w-auto items-center justify-end">
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white/70 focus:outline-none cursor-pointer appearance-none min-w-[120px] text-center"
            >
               <option value="all" className="bg-[#020817]">All Categories</option>
               <option value="frontend" className="bg-[#020817]">Frontend Web</option>
               <option value="backend" className="bg-[#020817]">Backend Services</option>
               <option value="database" className="bg-[#020817]">Database Engine</option>
               <option value="devops" className="bg-[#020817]">DevOps & Cloud</option>
               <option value="mobile" className="bg-[#020817]">Mobile Dev</option>
               <option value="other" className="bg-[#020817]">Other Skill</option>
            </select>
         </div>
      </div>

      {/* Skills Table */}
      <Card className="p-0 border-white/5 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Skill Identifier</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Category</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Proficiency Level</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">Order</th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-5 py-2.5">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 relative shrink-0">
                           {skill.icon_url ? (
                             <img src={skill.icon_url} className="w-5 h-5 object-contain" alt={skill.name} />
                           ) : (
                             <HelpCircle size={14} className="text-white/20" />
                           )}
                        </div>
                        <div>
                           <p className="text-xs font-black text-white truncate group-hover:text-primary transition-colors leading-none">{skill.name}</p>
                           <p className="text-[8px] font-bold text-white/25 uppercase mt-1 leading-none">ID: {skill.id}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-5 py-2.5">
                     <Badge variant="primary" className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 flex items-center gap-1 w-fit">
                        <Folder size={10} /> {getCategoryLabel(skill.category)}
                     </Badge>
                  </td>
                  <td className="px-5 py-2.5">
                     <div className="flex items-center gap-2 max-w-[200px]">
                        <div className="flex-grow bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                           <div className="bg-primary h-full rounded-full" style={{ width: `${skill.level}%` }}></div>
                        </div>
                        <span className="text-[11px] font-black text-white/60">{skill.level}%</span>
                     </div>
                  </td>
                  <td className="px-5 py-2.5">
                     <div className="flex items-center gap-1.5 text-white/40 font-bold text-[11px]">
                        <ArrowUpDown size={12} /> {skill.sort_order}
                     </div>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                     <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleOpenEditModal(skill)} className="p-2 bg-white/5 text-white/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all border border-white/5 cursor-pointer">
                          <Edit3 size={12} />
                        </button>
                        <button onClick={() => handleDelete(skill.id)} className="p-2 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all border border-white/5 cursor-pointer">
                          <Trash2 size={12} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredSkills.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-white/20 font-bold italic text-xs">
                    No technical skills found matching current query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Datatable pagination bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/5 bg-white/2">
           <p className="text-[9px] font-black text-white/25 uppercase tracking-widest">
              Showing {filteredSkills.length} of {skills.length} Entries
           </p>
           <div className="flex items-center gap-1.5">
              <button disabled className="px-3 py-1.5 bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/20 rounded-lg transition-all cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1.5 bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/20 rounded-lg transition-all cursor-not-allowed">Next</button>
           </div>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-xl animate-fade-in">
          <Card className="w-full max-w-md border-white/10 bg-[#050b18] shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Settings className="text-primary animate-spin-slow" size={18} /> 
                {formSkill.id ? 'Configure Skill Node' : 'Initialize Skill Node'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/40 hover:text-white transition-colors p-1.5 bg-white/5 rounded-lg border border-white/5">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-0.5">Skill Name *</label>
                <input 
                  type="text" name="name" value={formSkill.name} onChange={handleChange} required
                  className="bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all font-semibold"
                  placeholder="e.g. React, Node.js, Kubernetes"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-0.5">Category</label>
                  <select 
                    name="category" value={formSkill.category} onChange={handleChange}
                    className="bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="frontend" className="bg-[#020817]">Frontend Web</option>
                    <option value="backend" className="bg-[#020817]">Backend Services</option>
                    <option value="database" className="bg-[#020817]">Database Engine</option>
                    <option value="devops" className="bg-[#020817]">DevOps & Cloud</option>
                    <option value="mobile" className="bg-[#020817]">Mobile Dev</option>
                    <option value="other" className="bg-[#020817]">Other Skill</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-0.5">Sort Order</label>
                  <input 
                    type="number" name="sort_order" value={formSkill.sort_order} onChange={handleChange}
                    className="bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all font-semibold"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-0.5">Proficiency Level ({formSkill.level}%)</label>
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2">
                  <Award size={14} className="text-primary" />
                  <input 
                    type="range" name="level" value={formSkill.level} onChange={handleChange}
                    className="flex-grow accent-primary h-2 rounded-full cursor-pointer bg-white/10"
                    min="1" max="100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-0.5">Icon Vector URL</label>
                <input 
                  type="text" name="icon_url" value={formSkill.icon_url} onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all font-semibold"
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/..."
                />
              </div>

              <div className="flex gap-2.5 border-t border-white/10 pt-4 mt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="bg-white/5 border-white/5 flex-grow py-2 text-xs font-bold text-white/40 hover:text-white rounded-lg">
                  Abort Configuration
                </Button>
                <Button type="submit" disabled={saveLoading} variant="primary" className="btn-premium flex-grow py-2 text-[11px] font-black flex items-center justify-center gap-2 rounded-lg">
                  {saveLoading ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> Compile Node</>}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SkillsManagement;
