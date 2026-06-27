"use client";
import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button, Card, RichTextEditor } from '@/components/ui';
import {
  Save,
  X,
  Image as ImageIcon,
  Loader2,
  Plus,
  Tag,
  Eye,
  Clock as ClockIcon,
  AlertCircle,
  CheckCircle2,
  FolderOpen,
  RefreshCcw
} from 'lucide-react';

const BlogForm = ({ id }) => {
  const router = useRouter();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(id ? true : false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    cover_url: '',
    tags: [],
    published: 0,
    read_time: 5
  });
  const [newTag, setNewTag] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaImages, setMediaImages] = useState([]);
  const [mediaError, setMediaError] = useState('');

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data } = await api.get(`/blogs/id/${id}`);
      const b = data.data;
      setFormData({
        title: b.title,
        excerpt: b.excerpt || '',
        content: b.content || '',
        cover_url: b.cover_url || '',
        tags: b.tags || [],
        published: b.published,
        read_time: b.read_time || 5
      });
    } catch (err) {
      setError('Failed to load blog. Please try again.');
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const fetchMediaImages = async () => {
    setMediaLoading(true);
    setMediaError('');
    try {
      const { data } = await api.get('/media/uploads');
      setMediaImages(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setMediaImages([]);
      const status = err?.response?.status;
      setMediaError(
        status === 404
          ? 'Media route was not found on the backend. Start the updated local backend or redeploy the Render backend.'
          : err?.response?.data?.message || 'Failed to load uploaded images.'
      );
    } finally {
      setMediaLoading(false);
    }
  };

  const openMediaLibrary = () => {
    setMediaOpen(true);
    fetchMediaImages();
  };

  const selectMediaImage = (image) => {
    setCoverFile(null);
    setFormData(prev => ({ ...prev, cover_url: image.url }));
    setMediaOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // ✅ FIX: Single submit handler called only from <form onSubmit>
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Manual validation
    if (!formData.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!formData.excerpt.trim()) {
      setError('Excerpt / lead summary is required.');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required.');
      return;
    }

    setLoading(true);
    try {
      const submission = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          submission.append(key, JSON.stringify(formData[key]));
        } else if (key === 'content') {
          const cleanedContent = (formData[key] || '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\u00a0/g, ' ');
          submission.append(key, cleanedContent);
        } else {
          submission.append(key, formData[key]);
        }
      });
      if (coverFile) submission.append('cover', coverFile);

      if (id) {
        await api.put(`/blogs/${id}`, submission);
        setSuccess('Article updated successfully!');
      } else {
        await api.post('/blogs', submission);
        setSuccess('Article created successfully! Redirecting...');
      }

      setTimeout(() => router.push('/admin/blogs'), 1200);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Save failed. Check your connection or login status.';
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Trigger form submit from external button via ref
  const triggerSubmit = () => {
    if (formRef.current) formRef.current.requestSubmit();
  };

  if (fetching) return (
    <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic text-primary">
      Fetching Editorial Content...
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-black uppercase text-[9px] tracking-[0.2em] mb-1">
            <span className="w-6 h-[2px] bg-primary/20 rounded-full" />
            Content Strategy
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">
            {id ? 'Edit Article' : 'Draft New Insight'}
          </h1>
        </div>

        {/* ✅ FIX: These buttons now trigger the form's own submit via ref */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/blogs')}
            className="bg-white/5 border-white/5 px-4 py-2 text-[11px] font-bold text-white/40 hover:text-white rounded-lg"
          >
            Discard
          </Button>
          <Button
            type="button"
            onClick={triggerSubmit}
            disabled={loading}
            variant="primary"
            className="btn-premium px-6 py-2 text-[11px] font-black shadow-lg shadow-primary/30 flex items-center gap-2 group active:scale-95 transition-all rounded-lg"
          >
            {loading
              ? <><Loader2 className="animate-spin" size={14} /> Saving...</>
              : <><Save size={14} /> {id ? 'Publish Revision' : 'Release Article'}</>
            }
          </Button>
        </div>
      </div>

      {/* ─── Status Messages ─── */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-2.5 font-semibold text-xs">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-2.5 font-semibold text-xs">
          <CheckCircle2 size={14} className="shrink-0" />
          {success}
        </div>
      )}

      {/* ✅ FIX: form ref added, submit handled only here */}
      <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ─── Main Content ─── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-0.5">
                Headline <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="bg-transparent border-b border-white/10 py-2 text-sm font-semibold text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                placeholder="Enter Article Title..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-0.5">
                Lead Summary (Excerpt) <span className="text-red-400">*</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-xs font-semibold text-white/60 focus:outline-none focus:border-primary transition-all placeholder:text-white/5"
                placeholder="Catchy summary for the listing page..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-0.5">
                Full Narrative Content <span className="text-red-400">*</span>
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                placeholder="Tell your story. Rich text editing supported."
              />
            </div>
          </Card>
        </div>

        {/* ─── Sidebar ─── */}
        <div className="flex flex-col gap-6">
          {/* Cover Image */}
          <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Cover Asset</h3>
            <div className="relative aspect-video max-h-32 bg-white/5 rounded-xl border border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer group flex items-center justify-center overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setCoverFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              {coverFile || formData.cover_url ? (
                <img
                  src={coverFile ? URL.createObjectURL(coverFile) : formData.cover_url}
                  className="w-full h-full object-cover"
                  alt="Cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-white/20 group-hover:text-primary transition-colors">
                  <ImageIcon size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Select Cover</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={openMediaLibrary} className="bg-white/5 border-white/10 text-white/60 hover:text-white rounded-lg py-2 font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5">
                <FolderOpen size={12} /> Uploads Folder
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setCoverFile(null);
                setFormData(prev => ({ ...prev, cover_url: '' }));
              }} className="bg-white/5 border-white/10 text-white/40 hover:text-red-400 rounded-lg py-2 font-black uppercase tracking-widest text-[9px]">
                Clear Image
              </Button>
            </div>
          </Card>

          {/* Read Time */}
          <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40">
                Estimated Read Time (Mins)
              </label>
              <div className="flex items-center gap-2.5">
                <ClockIcon size={14} className="text-primary" />
                <input
                  type="number"
                  name="read_time"
                  value={formData.read_time}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-primary w-16 font-black text-xs"
                />
              </div>
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Taxonomy Tags</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addTag(); }
                }}
                className="flex-grow bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary text-xs"
                placeholder="e.g. React, UX, Database"
              />
              <Button type="button" onClick={addTag} variant="outline" className="bg-white/5 border-white/5 rounded-lg px-3">
                <Plus size={14} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.tags.map((tag, idx) => (
                <span
                  onClick={() => removeTag(tag)}
                  key={idx}
                  className="bg-primary/20 border border-primary/30 text-primary text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1.5 cursor-pointer hover:bg-red-400/20 hover:border-red-400/30 hover:text-red-400 transition-all"
                >
                  {tag} <X size={10} />
                </span>
              ))}
              {formData.tags.length === 0 && (
                <span className="text-white/20 text-xs font-medium">No tags added yet</span>
              )}
            </div>
          </Card>

          {/* Publication Status */}
          <Card className="p-5 border-white/5 bg-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                Publication Status
              </span>
              <div className="flex items-center gap-2.5">
                <span className={`text-[9px] font-black uppercase ${formData.published ? 'text-green-400' : 'text-orange-400'}`}>
                  {formData.published ? 'Published' : 'Draft'}
                </span>
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published === 1}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* ✅ Also add a save button in the sidebar for convenience */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-black text-xs uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}
          >
            {loading
              ? <><Loader2 className="animate-spin" size={14} /> Saving...</>
              : <><Save size={14} /> {id ? 'Publish Revision' : 'Release Article'}</>
            }
          </button>
        </div>
      </form>

      {mediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl">
          <div className="w-full max-w-2xl max-h-[75vh] overflow-hidden rounded-2xl border border-white/10 bg-[#050b18] shadow-2xl">
            <div className="flex items-center justify-between gap-4 p-4 border-b border-white/10">
              <div>
                <h2 className="text-base font-black text-white tracking-tight">Uploads Folder</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-0.5">
                  {mediaImages.length} stored image{mediaImages.length === 1 ? '' : 's'} found
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button type="button" variant="outline" onClick={fetchMediaImages} disabled={mediaLoading} className="bg-white/5 border-white/10 text-white/50 hover:text-white rounded-lg px-2.5 py-2">
                  {mediaLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                </Button>
                <Button type="button" variant="outline" onClick={() => setMediaOpen(false)} className="bg-white/5 border-white/10 text-white/50 hover:text-white rounded-lg px-2.5 py-2">
                  <X size={14} />
                </Button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(75vh-64px)]">
              {mediaLoading ? (
                <div className="py-16 text-center text-white/30 font-black uppercase tracking-widest animate-pulse text-xs">
                  Loading stored images...
                </div>
              ) : mediaError ? (
                <div className="py-16 text-center max-w-md mx-auto">
                  <ImageIcon size={32} className="mx-auto mb-3 text-red-400/30" />
                  <p className="text-red-300 font-black uppercase tracking-widest text-xs">Unable to load uploads</p>
                  <p className="text-white/35 text-xs font-medium mt-2 leading-relaxed">{mediaError}</p>
                </div>
              ) : mediaImages.length === 0 ? (
                <div className="py-16 text-center">
                  <ImageIcon size={32} className="mx-auto mb-3 text-white/10" />
                  <p className="text-white/30 font-black uppercase tracking-widest text-xs">No uploaded images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mediaImages.map((image) => (
                    <button
                      type="button"
                      key={image.name}
                      onClick={() => selectMediaImage(image)}
                      className="group text-left rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-primary/70 hover:bg-primary/10 transition-all"
                    >
                      <div className="aspect-video bg-black/30 overflow-hidden">
                        <img src={image.url} alt={image.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/60 truncate">{image.name}</p>
                        <p className="text-[8px] font-bold text-white/25 mt-0.5">{Math.round(image.size / 1024)} KB</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogForm;
