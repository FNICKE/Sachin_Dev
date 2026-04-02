"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

const categoryColors = {
  web: 'badge-cyan',
  mobile: 'badge-secondary',
  api: 'badge-success',
  fullstack: 'badge-primary',
  other: 'badge-primary',
};

const ProjectCard = ({ project }) => (
  <article className="group flex flex-col h-full card glass-panel-hover overflow-hidden">
    {/* Image */}
    <div className="relative overflow-hidden aspect-video">
      <img
        src={project.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Quick action overlay */}
      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noreferrer"
            className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-black/70 transition-all hover:scale-110 border border-white/10">
            <Github size={18} />
          </a>
        )}
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noreferrer"
            className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-black/70 transition-all hover:scale-110 border border-white/10">
            <ExternalLink size={18} />
          </a>
        )}
      </div>
      {/* Featured badge */}
      {project.featured ? (
        <div className="absolute top-3 right-3">
          <span className="badge badge-secondary text-[10px]">⭐ Featured</span>
        </div>
      ) : null}
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 p-6 gap-4">
      {/* Category & status */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`badge ${categoryColors[project.category] || 'badge-primary'}`}>
          {project.category}
        </span>
        {project.status === 'in_progress' && (
          <span className="badge badge-cyan">In Progress</span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors leading-tight">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/50 leading-relaxed flex-1 line-clamp-2">
        {project.short_desc}
      </p>

      {/* Tech tags */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(project.tech_stack) ? project.tech_stack : []).slice(0, 4).map((tech, i) => (
            <span key={i} className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-white/5 text-white/50 border border-white/8">
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex gap-2">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer"
              className="text-white/40 hover:text-white transition-colors">
              <Github size={17} />
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer"
              className="text-white/40 hover:text-white transition-colors">
              <ExternalLink size={17} />
            </a>
          )}
        </div>
        <Link href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors group/link">
          Case Study
          <ArrowUpRight size={14} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  </article>
);

const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="skeleton aspect-video w-full" />
    <div className="p-6 flex flex-col gap-3">
      <div className="skeleton h-5 w-20 rounded-full" />
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
    </div>
  </div>
);

const ProjectsGrid = ({ limit }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then(({ data }) => {
        const all = data.data || [];
        setProjects(limit ? all.slice(0, limit) : all);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
    </div>
  );

  if (projects.length === 0) return (
    <div className="text-center py-24 text-white/30 font-semibold">
      No projects yet. Add your first project from the admin panel!
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(p => <ProjectCard key={p.id} project={p} />)}
    </div>
  );
};

export default ProjectsGrid;
