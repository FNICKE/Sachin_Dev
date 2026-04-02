"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

const categoryIcons = {
  frontend:  { icon: '🎨', color: '#818cf8' },
  backend:   { icon: '⚙️', color: '#34d399' },
  database:  { icon: '🗄️', color: '#f59e0b' },
  devops:    { icon: '🚀', color: '#60a5fa' },
  language:  { icon: '📝', color: '#c084fc' },
  tool:      { icon: '🔧', color: '#fb923c' },
  other:     { icon: '✨', color: '#94a3b8' },
};

const SkillBar = ({ skill }) => (
  <div className="flex items-center justify-between group py-2.5 px-3 rounded-xl hover:bg-white/4 transition-all duration-200 cursor-default">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: categoryIcons[skill.category]?.color || '#6366f1', boxShadow: `0 0 8px ${categoryIcons[skill.category]?.color || '#6366f1'}60` }} />
      <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{skill.name}</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-24 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${skill.level}%`, background: `linear-gradient(90deg, ${categoryIcons[skill.category]?.color || '#6366f1'}, ${categoryIcons[skill.category]?.color || '#6366f1'}99)` }} />
      </div>
      <span className="text-xs font-bold text-white/30 w-8 text-right">{skill.level}%</span>
    </div>
  </div>
);

const SkillsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1,2,3].map(i => (
      <div key={i} className="card p-6 flex flex-col gap-4">
        <div className="skeleton h-6 w-28 rounded-lg" />
        {[1,2,3,4].map(j => <div key={j} className="skeleton h-8 w-full rounded-xl" />)}
      </div>
    ))}
  </div>
);

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    api.get('/skills')
      .then(({ data }) => setSkills(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = ['all', ...Object.keys(grouped)];

  const displayedGroups = activeCategory === 'all'
    ? grouped
    : { [activeCategory]: grouped[activeCategory] || [] };

  if (loading) return <SkillsSkeleton />;
  if (skills.length === 0) return (
    <p className="text-center text-white/30 py-16">No skills added yet.</p>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeCategory === cat
                ? 'btn-premium btn-primary py-2 px-4'
                : 'glass-panel text-white/50 hover:text-white'
            }`}
          >
            {cat === 'all' ? '✦ All Skills' : `${categoryIcons[cat]?.icon || '•'} ${cat}`}
          </button>
        ))}
      </div>

      {/* Skill groups grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(displayedGroups).map(([cat, catSkills]) => {
          const meta = categoryIcons[cat] || { icon: '✨', color: '#6366f1' };
          return (
            <div key={cat} className="card glass-panel-hover flex flex-col gap-2 p-6">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}>
                  {meta.icon}
                </div>
                <div>
                  <h3 className="font-black text-white capitalize tracking-tight">{cat}</h3>
                  <p className="text-xs text-white/30 font-semibold">{catSkills.length} skill{catSkills.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              {/* Skills */}
              {catSkills.sort((a, b) => b.level - a.level).map(skill => (
                <SkillBar key={skill.id} skill={{ ...skill, category: cat }} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsSection;
