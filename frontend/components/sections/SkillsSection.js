"use client";
import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';

/* ─────────────────────────────────────────
   Skill logo / color map  (SVG icon URLs from Simple Icons CDN)
   ───────────────────────────────────────── */
const SKILL_META = {
  // Frontend
  'react':       { logo: 'https://cdn.simpleicons.org/react/61DAFB',       color: '#61DAFB', trail: 'rgba(97,218,251,0.35)' },
  'next.js':     { logo: 'https://cdn.simpleicons.org/nextdotjs/ffffff',    color: '#ffffff', trail: 'rgba(255,255,255,0.25)' },
  'html':        { logo: 'https://cdn.simpleicons.org/html5/E34F26',        color: '#E34F26', trail: 'rgba(227,79,38,0.35)'  },
  'html5':       { logo: 'https://cdn.simpleicons.org/html5/E34F26',        color: '#E34F26', trail: 'rgba(227,79,38,0.35)'  },
  'css':         { logo: 'https://cdn.simpleicons.org/css3/1572B6',         color: '#1572B6', trail: 'rgba(21,114,182,0.35)' },
  'css3':        { logo: 'https://cdn.simpleicons.org/css3/1572B6',         color: '#1572B6', trail: 'rgba(21,114,182,0.35)' },
  'javascript':  { logo: 'https://cdn.simpleicons.org/javascript/F7DF1E',   color: '#F7DF1E', trail: 'rgba(247,223,30,0.35)' },
  'js':          { logo: 'https://cdn.simpleicons.org/javascript/F7DF1E',   color: '#F7DF1E', trail: 'rgba(247,223,30,0.35)' },
  'typescript':  { logo: 'https://cdn.simpleicons.org/typescript/3178C6',   color: '#3178C6', trail: 'rgba(49,120,198,0.35)' },
  'ts':          { logo: 'https://cdn.simpleicons.org/typescript/3178C6',   color: '#3178C6', trail: 'rgba(49,120,198,0.35)' },
  'vue':         { logo: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',     color: '#4FC08D', trail: 'rgba(79,192,141,0.35)' },
  'vue.js':      { logo: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',     color: '#4FC08D', trail: 'rgba(79,192,141,0.35)' },
  'tailwind':    { logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',  color: '#06B6D4', trail: 'rgba(6,182,212,0.35)'  },
  'tailwindcss': { logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',  color: '#06B6D4', trail: 'rgba(6,182,212,0.35)'  },
  'bootstrap':   { logo: 'https://cdn.simpleicons.org/bootstrap/7952B3',    color: '#7952B3', trail: 'rgba(121,82,179,0.35)' },
  'angular':     { logo: 'https://cdn.simpleicons.org/angular/DD0031',      color: '#DD0031', trail: 'rgba(221,0,49,0.35)'   },
  'redux':       { logo: 'https://cdn.simpleicons.org/redux/764ABC',        color: '#764ABC', trail: 'rgba(118,74,188,0.35)' },
  'svelte':      { logo: 'https://cdn.simpleicons.org/svelte/FF3E00',       color: '#FF3E00', trail: 'rgba(255,62,0,0.35)'   },
  // Backend
  'node.js':     { logo: 'https://cdn.simpleicons.org/nodedotjs/339933',    color: '#339933', trail: 'rgba(51,153,51,0.35)'  },
  'nodejs':      { logo: 'https://cdn.simpleicons.org/nodedotjs/339933',    color: '#339933', trail: 'rgba(51,153,51,0.35)'  },
  'express':     { logo: 'https://cdn.simpleicons.org/express/ffffff',      color: '#ffffff', trail: 'rgba(255,255,255,0.2)' },
  'express.js':  { logo: 'https://cdn.simpleicons.org/express/ffffff',      color: '#ffffff', trail: 'rgba(255,255,255,0.2)' },
  'django':      { logo: 'https://cdn.simpleicons.org/django/092E20',       color: '#092E20', trail: 'rgba(9,46,32,0.6)'     },
  'fastapi':     { logo: 'https://cdn.simpleicons.org/fastapi/009688',      color: '#009688', trail: 'rgba(0,150,136,0.35)'  },
  'flask':       { logo: 'https://cdn.simpleicons.org/flask/ffffff',        color: '#ffffff', trail: 'rgba(255,255,255,0.2)' },
  'graphql':     { logo: 'https://cdn.simpleicons.org/graphql/E10098',      color: '#E10098', trail: 'rgba(225,0,152,0.35)'  },
  'spring':      { logo: 'https://cdn.simpleicons.org/spring/6DB33F',       color: '#6DB33F', trail: 'rgba(109,179,63,0.35)' },
  // Database
  'mysql':       { logo: 'https://cdn.simpleicons.org/mysql/4479A1',        color: '#4479A1', trail: 'rgba(68,121,161,0.35)' },
  'postgresql':  { logo: 'https://cdn.simpleicons.org/postgresql/336791',   color: '#336791', trail: 'rgba(51,103,145,0.35)' },
  'postgres':    { logo: 'https://cdn.simpleicons.org/postgresql/336791',   color: '#336791', trail: 'rgba(51,103,145,0.35)' },
  'mongodb':     { logo: 'https://cdn.simpleicons.org/mongodb/47A248',      color: '#47A248', trail: 'rgba(71,162,72,0.35)'  },
  'redis':       { logo: 'https://cdn.simpleicons.org/redis/DC382D',        color: '#DC382D', trail: 'rgba(220,56,45,0.35)'  },
  'sqlite':      { logo: 'https://cdn.simpleicons.org/sqlite/003B57',       color: '#003B57', trail: 'rgba(0,59,87,0.6)'     },
  'firebase':    { logo: 'https://cdn.simpleicons.org/firebase/FFCA28',     color: '#FFCA28', trail: 'rgba(255,202,40,0.35)' },
  'supabase':    { logo: 'https://cdn.simpleicons.org/supabase/3ECF8E',     color: '#3ECF8E', trail: 'rgba(62,207,142,0.35)' },
  // DevOps / tools
  'git':         { logo: 'https://cdn.simpleicons.org/git/F05032',          color: '#F05032', trail: 'rgba(240,80,50,0.35)'  },
  'github':      { logo: 'https://cdn.simpleicons.org/github/ffffff',       color: '#ffffff', trail: 'rgba(255,255,255,0.2)' },
  'docker':      { logo: 'https://cdn.simpleicons.org/docker/2496ED',       color: '#2496ED', trail: 'rgba(36,150,237,0.35)' },
  'kubernetes':  { logo: 'https://cdn.simpleicons.org/kubernetes/326CE5',   color: '#326CE5', trail: 'rgba(50,108,229,0.35)' },
  'linux':       { logo: 'https://cdn.simpleicons.org/linux/FCC624',        color: '#FCC624', trail: 'rgba(252,198,36,0.35)' },
  'aws':         { logo: 'https://cdn.simpleicons.org/amazonaws/FF9900',    color: '#FF9900', trail: 'rgba(255,153,0,0.35)'  },
  'nginx':       { logo: 'https://cdn.simpleicons.org/nginx/009639',        color: '#009639', trail: 'rgba(0,150,57,0.35)'   },
  // Languages
  'python':      { logo: 'https://cdn.simpleicons.org/python/3776AB',       color: '#3776AB', trail: 'rgba(55,118,171,0.35)' },
  'java':        { logo: 'https://cdn.simpleicons.org/openjdk/437291',      color: '#437291', trail: 'rgba(67,114,145,0.35)' },
  'php':         { logo: 'https://cdn.simpleicons.org/php/777BB4',          color: '#777BB4', trail: 'rgba(119,123,180,0.35)'},
  'go':          { logo: 'https://cdn.simpleicons.org/go/00ADD8',           color: '#00ADD8', trail: 'rgba(0,173,216,0.35)'  },
  'rust':        { logo: 'https://cdn.simpleicons.org/rust/ffffff',         color: '#ffffff', trail: 'rgba(255,255,255,0.2)' },
  'c':           { logo: 'https://cdn.simpleicons.org/c/A8B9CC',            color: '#A8B9CC', trail: 'rgba(168,185,204,0.35)'},
  'c++':         { logo: 'https://cdn.simpleicons.org/cplusplus/00599C',    color: '#00599C', trail: 'rgba(0,89,156,0.35)'   },
  'c#':          { logo: 'https://cdn.simpleicons.org/csharp/239120',       color: '#239120', trail: 'rgba(35,145,32,0.35)'  },
  'kotlin':      { logo: 'https://cdn.simpleicons.org/kotlin/0095D5',       color: '#0095D5', trail: 'rgba(0,149,213,0.35)'  },
  'swift':       { logo: 'https://cdn.simpleicons.org/swift/FA7343',        color: '#FA7343', trail: 'rgba(250,115,67,0.35)' },
};

const DEFAULT_META = { color: '#6366f1', trail: 'rgba(99,102,241,0.3)', logo: null };

function getSkillMeta(name) {
  const key = (name || '').toLowerCase().trim();
  return SKILL_META[key] || DEFAULT_META;
}

/* ─────────────────────────────────────────
   Category config
   ───────────────────────────────────────── */
const CATEGORY_CONFIG = {
  frontend:  { label: 'Frontend',  emoji: '🎨', color: '#818cf8' },
  backend:   { label: 'Backend',   emoji: '⚙️', color: '#34d399' },
  database:  { label: 'Database',  emoji: '🗄️', color: '#f59e0b' },
  devops:    { label: 'DevOps',    emoji: '🚀', color: '#60a5fa' },
  language:  { label: 'Language',  emoji: '📝', color: '#c084fc' },
  tool:      { label: 'Tools',     emoji: '🔧', color: '#fb923c' },
  other:     { label: 'Other',     emoji: '✨', color: '#94a3b8' },
};

/* ─────────────────────────────────────────
   Galaxy Orbit Ring Component
   ───────────────────────────────────────── */
const ORBIT_RADII   = [110, 170, 235, 305, 380, 455, 530];
const ORBIT_SPEEDS  = [28, 42, 55, 68, 82, 96, 112]; // seconds per revolution
const ORBIT_TILTS   = [0, 15, -10, 20, -5, 12, -18]; // degrees

function GalaxyCanvas({ skills }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const timeRef   = useRef(0);
  const blastRef  = useRef({ active: false, time: 0, x: 0, y: 0 });

  // spread skills across orbits
  const orbits = React.useMemo(() => {
    const rings = ORBIT_RADII.map(() => []);
    skills.forEach((skill, i) => {
      rings[i % ORBIT_RADII.length].push(skill);
    });
    return rings;
  }, [skills]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    blastRef.current = {
      active: true,
      time: performance.now(),
      x,
      y
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    // Pre-load logos
    const imageCache = {};
    skills.forEach(skill => {
      const meta = getSkillMeta(skill.name);
      if (meta.logo && !imageCache[skill.name]) {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = meta.logo;
        imageCache[skill.name] = img;
      }
    });

    function resize() {
      const parent = canvas.parentElement;
      canvas.width  = parent ? parent.clientWidth  : 800;
      canvas.height = parent ? parent.clientHeight : 800;
    }
    resize();
    window.addEventListener('resize', resize);

    function drawStars(ctx, w, h) {
      // draw tiny stars once (using a seeded pattern)
      for (let i = 0; i < 160; i++) {
        const x = ((Math.sin(i * 7.3 + 1) * 0.5 + 0.5)) * w;
        const y = ((Math.cos(i * 3.7 + 2) * 0.5 + 0.5)) * h;
        const r = 0.4 + (Math.sin(i * 2.1) * 0.5 + 0.5) * 1.2;
        const op = 0.2 + (Math.cos(i * 4.1) * 0.5 + 0.5) * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`;
        ctx.fill();
      }
    }

    function draw(ts) {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      // Stars background
      drawStars(ctx, w, h);

      // Blast Logic Calculation
      const blast = blastRef.current;
      let blastPower = 0;
      let blastElapsed = 0;
      if (blast.active) {
        blastElapsed = (ts - blast.time) / 1000;
        if (blastElapsed < 2.5) {
          // Strong exponential decay at first, then ease back
          blastPower = Math.max(0, Math.exp(-blastElapsed * 2.5) * (1 - blastElapsed / 2.5));
          
          // Draw Blast Ripple
          const rippleCount = 3;
          for (let i = 0; i < rippleCount; i++) {
            const rProgress = (blastElapsed * 1.5 - i * 0.2);
            if (rProgress > 0 && rProgress < 1) {
              const rippleR = rProgress * 300;
              const rippleOp = (1 - rProgress) * 0.4;
              ctx.beginPath();
              ctx.arc(blast.x, blast.y, rippleR, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(160, 140, 255, ${rippleOp})`;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }
        } else {
          blast.active = false;
        }
      }

      // Central glow (galaxy core)
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
      coreGrad.addColorStop(0,   'rgba(130,100,255,0.55)');
      coreGrad.addColorStop(0.4, 'rgba(99,102,241,0.2)');
      coreGrad.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Pulsing core ring
      const pulse = Math.sin(ts / 900) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 18 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(160,140,255,${0.4 + pulse * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      orbits.forEach((orbitSkills, ringIdx) => {
        if (orbitSkills.length === 0) return;
        const radius = ORBIT_RADII[ringIdx];
        const tilt   = ORBIT_TILTS[ringIdx] * (Math.PI / 180);
        const speed  = ORBIT_SPEEDS[ringIdx];

        // Scale orbit to fit canvas
        const scale = Math.min((w * 0.46) / ORBIT_RADII[ORBIT_RADII.length - 1], 1);
        const r = radius * scale;

        // Draw orbit ring (ellipse with tilt)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,0.04)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Draw each skill on this orbit
        orbitSkills.forEach((skill, skillIdx) => {
          const meta = getSkillMeta(skill.name);
          const baseAngle = (skillIdx / orbitSkills.length) * Math.PI * 2;
          const angle = baseAngle + (ts / (speed * 1000)) * Math.PI * 2;

          // Convert to canvas coords after rotation
          const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
          const rx2 = Math.cos(angle) * r;
          const ry2 = Math.sin(angle) * r * 0.32;
          let sx = cx + rx2 * cosT - ry2 * sinT;
          let sy = cy + rx2 * sinT + ry2 * cosT;

          // Apply Blast Displacement
          if (blastPower > 0) {
            const dx = sx - blast.x;
            const dy = sy - blast.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            // Push force: outward from click point
            const force = blastPower * 500 * (1 / (1 + dist * 0.0015)); 
            sx += (dx / dist) * force;
            sy += (dy / dist) * force;
          }

          // Depth cue: behind = smaller / dimmer
          const depthFactor = 0.6 + 0.4 * ((ry2 / (r * 0.32) + 1) / 2);
          const planetR = (18 + (skill.level || 50) * 0.1) * scale * depthFactor;

          // Glowing trail dot
          const trailGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, planetR * 2.8);
          trailGrad.addColorStop(0,   meta.color + 'cc');
          trailGrad.addColorStop(0.4, meta.trail || meta.color + '44');
          trailGrad.addColorStop(1,   'transparent');
          ctx.beginPath();
          ctx.arc(sx, sy, planetR * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = trailGrad;
          ctx.fill();

          // Planet circle background
          ctx.beginPath();
          ctx.arc(sx, sy, planetR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(10,12,28,0.92)`;
          ctx.fill();
          ctx.strokeStyle = meta.color + 'aa';
          ctx.lineWidth = 1.5 * depthFactor;
          ctx.stroke();

          // Draw logo inside planet
          const img = imageCache[skill.name];
          const logoSize = planetR * 1.2;
          if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(sx, sy, planetR - 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.globalAlpha = depthFactor;
            ctx.drawImage(img, sx - logoSize / 2, sy - logoSize / 2, logoSize, logoSize);
            ctx.restore();
          } else {
            // Fallback: first letter
            ctx.save();
            ctx.globalAlpha = depthFactor;
            ctx.font = `bold ${Math.max(8, planetR * 0.7)}px Outfit, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = meta.color;
            ctx.fillText((skill.name || '?')[0].toUpperCase(), sx, sy);
            ctx.restore();
          }

          // Skill name label
          if (depthFactor > 0.75 && planetR > 14) {
            ctx.save();
            ctx.globalAlpha = (depthFactor - 0.75) * 4;
            ctx.font = `600 ${Math.max(9, planetR * 0.6)}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = meta.color;
            ctx.shadowBlur = 6;
            ctx.fillText(skill.name, sx, sy + planetR + 4);
            ctx.restore();
          }
        });
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [orbits, skills]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}
    />
  );
}

/* ─────────────────────────────────────────
   Skill Pill (for the list view below galaxy)
   ───────────────────────────────────────── */
function SkillPill({ skill }) {
  const meta = getSkillMeta(skill.name);
  return (
    <div
      className="skill-pill"
      style={{ '--pill-color': meta.color, '--pill-trail': meta.trail }}
    >
      {meta.logo ? (
        <img
          src={meta.logo}
          alt={skill.name}
          width={18}
          height={18}
          style={{ filter: 'drop-shadow(0 0 4px ' + meta.color + '88)' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <span style={{ color: meta.color, fontWeight: 700, fontSize: '0.8rem' }}>
          {(skill.name || '?')[0].toUpperCase()}
        </span>
      )}
      <span>{skill.name}</span>
      <span className="pill-level">{skill.level}%</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Category Card
   ───────────────────────────────────────── */
function CategoryCard({ category, skills, active, onClick }) {
  const cfg   = CATEGORY_CONFIG[category] || { label: category, emoji: '✨', color: '#94a3b8' };
  const total = skills.length;

  return (
    <button
      onClick={onClick}
      className={`category-card ${active ? 'category-card--active' : ''}`}
      style={{ '--cat-color': cfg.color }}
    >
      <span className="cat-emoji">{cfg.emoji}</span>
      <span className="cat-label">{cfg.label}</span>
      <span className="cat-count">{total}</span>
    </button>
  );
}

/* ─────────────────────────────────────────
   Main SkillsSection
   ───────────────────────────────────────── */
const FALLBACK_SKILLS = [
  { id: 'f1', name: 'React', category: 'frontend', level: 95 },
  { id: 'f2', name: 'Next.js', category: 'frontend', level: 90 },
  { id: 'f3', name: 'Vue.js', category: 'frontend', level: 85 },
  { id: 'f4', name: 'Angular', category: 'frontend', level: 80 },
  { id: 'f5', name: 'JavaScript', category: 'language', level: 95 },
  { id: 'f6', name: 'TypeScript', category: 'language', level: 85 },
  { id: 'f7', name: 'Tailwind', category: 'frontend', level: 90 },
  { id: 'f8', name: 'SASS', category: 'frontend', level: 80 },
  { id: 'f9', name: 'Node.js', category: 'backend', level: 90 },
  { id: 'f10', name: 'Express', category: 'backend', level: 90 },
  { id: 'f11', name: 'Java', category: 'backend', level: 85 },
  { id: 'f12', name: 'Python', category: 'language', level: 75 },
  { id: 'f13', name: 'MySQL', category: 'database', level: 90 },
  { id: 'f14', name: 'MongoDB', category: 'database', level: 85 },
  { id: 'f15', name: 'PostgreSQL', category: 'database', level: 80 },
  { id: 'f16', name: 'Redis', category: 'database', level: 60 },
  { id: 'f17', name: 'Git', category: 'devops', level: 95 },
  { id: 'f18', name: 'GitHub', category: 'devops', level: 95 },
  { id: 'f19', name: 'Docker', category: 'devops', level: 70 }
];

export default function SkillsSection() {
  const [skills,          setSkills]          = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [activeCategory,  setActiveCategory]  = useState('all');

  useEffect(() => {
    api.get('/skills')
      .then(({ data }) => {
        const fetchedSkills = data.data || [];
        if (fetchedSkills.length > 0) {
          setSkills(fetchedSkills);
        } else {
          setSkills(FALLBACK_SKILLS);
        }
      })
      .catch(err => {
        console.error(err);
        setSkills(FALLBACK_SKILLS);
      })
      .finally(() => setLoading(false));
  }, []);

  const grouped = React.useMemo(() => skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {}), [skills]);

  const filteredSkills = activeCategory === 'all'
    ? skills
    : (grouped[activeCategory] || []);

  const categories = Object.keys(grouped);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <div className="skeleton" style={{ width: 600, height: 600, maxWidth: '90vw', borderRadius: '50%' }} />
    </div>
  );

  if (skills.length === 0) return (
    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '4rem' }}>
      No skills added yet.
    </p>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start w-full relative z-10">
      {/* ── Left: Galaxy Canvas ── */}
      <div className="w-full xl:w-7/12 glass-panel rounded-[2.5rem] p-6 lg:p-10 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
        {/* Decorative background blurs inside panel */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-[6.25rem] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-pink-500/10 rounded-full blur-[6.25rem] pointer-events-none" />
        
        <div className="galaxy-wrapper w-full flex-grow relative flex items-center justify-center">
          <div className="galaxy-canvas-container">
            <GalaxyCanvas skills={filteredSkills} />
          </div>
          {/* Floating label */}
          <div className="galaxy-center-label">
            <span className="gcl-count">{filteredSkills.length}</span>
            <span className="gcl-text">Technologies</span>
          </div>
        </div>
      </div>

      {/* ── Right: Filters and Pills ── */}
      <div className="w-full xl:w-5/12 flex flex-col gap-6">
        {/* Category Filter */}
        <div className="glass-panel p-6 lg:p-8 rounded-[2rem] border-t border-white/5">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
             <div className="p-2 rounded-xl bg-white/5 border border-white/5 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.2)]">⚡</div>
             Domain Filter
          </h3>
          <div className="category-filter-row">
            <button
              onClick={() => setActiveCategory('all')}
              className={`category-card ${activeCategory === 'all' ? 'category-card--active' : ''}`}
              style={{ '--cat-color': '#6366f1' }}
            >
              <span className="cat-emoji">✦</span>
              <span className="cat-label">All</span>
              <span className="cat-count">{skills.length}</span>
            </button>
            {categories.map(cat => (
              <CategoryCard
                key={cat}
                category={cat}
                skills={grouped[cat]}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        </div>

        {/* Skill Pills Grid */}
        <div className="glass-panel p-6 lg:p-8 rounded-[2rem] flex-grow border-t border-white/5 relative overflow-hidden">
           <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[4rem] pointer-events-none" />
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
             <div className="p-2 rounded-xl bg-white/5 border border-white/5 shadow-[0_0_15px_rgba(236,72,153,0.2)]">🔥</div>
             Tech Stack
          </h3>
          <div className="skill-pills-grid overflow-y-auto max-h-[350px] pr-2 custom-scrollbar relative z-10 p-1">
            {filteredSkills
              .sort((a, b) => b.level - a.level)
              .map(skill => (
                <SkillPill key={skill.id} skill={skill} />
              ))}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Galaxy Wrapper ── */
        .galaxy-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .galaxy-canvas-container {
          width: 100%;
          max-width: 600px;
          aspect-ratio: 1;
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          background: radial-gradient(ellipse at center,
            rgba(20,14,50,0.95) 0%,
            rgba(5,8,24,0.99) 70%,
            rgba(2,4,14,1) 100%);
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.12),
            0 0 80px rgba(99,102,241,0.08),
            0 40px 120px rgba(0,0,0,0.7),
            inset 0 0 60px rgba(99,102,241,0.1);
        }

        /* Center label overlay */
        .galaxy-center-label {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
          z-index: 2;
        }
        .gcl-count {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          font-weight: 900;
          background: linear-gradient(135deg, #a5b4fc, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .gcl-text {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        /* ── Category Filter ── */
        .category-filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          justify-content: center;
        }
        .category-card {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 1rem;
          border-radius: 9999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          letter-spacing: 0.02em;
        }
        .category-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: var(--cat-color);
          color: var(--cat-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px color-mix(in srgb, var(--cat-color) 30%, transparent);
        }
        .category-card--active {
          background: color-mix(in srgb, var(--cat-color) 18%, transparent);
          border-color: var(--cat-color);
          color: var(--cat-color);
          box-shadow: 0 0 20px color-mix(in srgb, var(--cat-color) 25%, transparent);
        }
        .cat-emoji { font-size: 1rem; }
        .cat-label { font-family: 'Outfit', sans-serif; }
        .cat-count {
          background: rgba(255,255,255,0.1);
          border-radius: 9999px;
          padding: 0 0.45rem;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.5);
          min-width: 1.4rem;
          text-align: center;
        }
        .category-card--active .cat-count {
          background: color-mix(in srgb, var(--cat-color) 25%, transparent);
          color: var(--cat-color);
        }

        /* ── Skill Pills ── */
        .skill-pills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          justify-content: center;
        }
        .skill-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.9rem 0.4rem 0.55rem;
          border-radius: 9999px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.75);
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .skill-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: color-mix(in srgb, var(--pill-color) 6%, transparent);
          opacity: 0;
          transition: opacity 0.2s;
          border-radius: inherit;
        }
        .skill-pill:hover {
          border-color: var(--pill-color);
          color: #fff;
          transform: translateY(-3px) scale(1.04);
          box-shadow:
            0 6px 24px color-mix(in srgb, var(--pill-color) 30%, transparent),
            0 0 0 1px color-mix(in srgb, var(--pill-color) 20%, transparent);
        }
        .skill-pill:hover::before { opacity: 1; }
        .pill-level {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--pill-color);
          background: color-mix(in srgb, var(--pill-color) 15%, transparent);
          padding: 0.1rem 0.45rem;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}
