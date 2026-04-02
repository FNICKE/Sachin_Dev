"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, Button } from '@/components/ui';
import { 
  FileText, 
  UploadCloud, 
  Download, 
  ExternalLink,
  CheckCircle2,
  Loader2,
  RefreshCw,
  FileIcon,
  XCircle
} from 'lucide-react';

const ResumeManagement = () => {
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await api.get('/settings/resume');
      setResumeUrl(data.data.resume_url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file first.');

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await api.post('/settings/resume', formData);
      setResumeUrl(data.data.resume_url);
      setFile(null);
      alert('Resume updated successfully!');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-3xl font-black text-white animate-pulse p-20 text-center tracking-tighter italic text-primary">Accessing Career Assets...</div>;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
         <div className="flex items-center gap-4 text-primary font-black uppercase text-xs tracking-[0.25em]">
            <span className="w-12 h-[2px] bg-primary/20 rounded-full" />
            Core Identity
         </div>
         <h1 className="text-5xl font-black tracking-tighter text-white">Resume Repository</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         {/* Current Resume Preview */}
         <Card className="p-12 border-white/5 bg-white/5 flex flex-col gap-8">
            <h3 className="text-lg font-black uppercase tracking-widest text-white/40 flex items-center gap-4">
               <FileText size={24} className="text-primary" /> Active Career Record
            </h3>
            
            {resumeUrl ? (
               <div className="flex flex-col gap-8">
                  <div className="p-8 bg-white/2 rounded-2xl border border-white/5 flex items-center justify-between group">
                     <div className="flex items-center gap-6">
                        <div className="p-4 bg-primary/10 rounded-xl text-primary"><FileIcon size={32} /></div>
                        <div>
                           <p className="text-xl font-bold text-white uppercase tracking-tight">sachin_rathod_cv.pdf</p>
                           <p className="text-xs font-black text-white/20 uppercase tracking-widest mt-1">Stored on Secure Local Server</p>
                        </div>
                     </div>
                     <CheckCircle2 size={24} className="text-green-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex gap-4">
                     <a href={resumeUrl} target="_blank" className="flex-grow">
                        <Button variant="outline" className="w-full bg-white/5 border-white/5 py-4 font-black flex items-center justify-center gap-3 active:scale-95 transition-all text-white hover:text-primary hover:border-primary/20 hover:bg-primary/5">
                           <ExternalLink size={20} /> View Document
                        </Button>
                     </a>
                     <a href={resumeUrl} download className="flex-grow">
                        <Button variant="outline" className="w-full bg-white/5 border-white/5 py-4 font-black flex items-center justify-center gap-3 active:scale-95 transition-all text-white border-white/10 hover:border-white/20">
                           <Download size={20} /> Pull Backup
                        </Button>
                     </a>
                  </div>
               </div>
            ) : (
               <div className="p-20 bg-white/2 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center gap-4 text-white/20">
                  <XCircle size={48} strokeWidth={1} />
                  <p className="text-xs font-black uppercase tracking-widest">No Document Found</p>
               </div>
            )}
         </Card>

         {/* Upload New Resume */}
         <Card className="p-12 border-white/5 bg-white/5 flex flex-col gap-8">
            <h3 className="text-lg font-black uppercase tracking-widest text-white/40 flex items-center gap-4">
               <UploadCloud size={24} className="text-primary" /> Update Pipeline
            </h3>

            <div className="flex flex-col gap-8">
               <div className="relative h-48 bg-white/2 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-all group flex flex-col items-center justify-center gap-4 cursor-pointer">
                  <input 
                    type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                       <FileText size={48} className="text-primary animate-bounce" />
                       <p className="text-sm font-bold text-white">{file.name}</p>
                       <p className="text-[10px] font-black text-white/30 uppercase">Ready for Deployment</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                       <div className="p-4 bg-white/5 rounded-full text-white/20 group-hover:text-primary group-hover:bg-primary/10 transition-all"><UploadCloud size={32} /></div>
                       <p className="text-xs font-black uppercase tracking-widest text-white/20">Stage PDF or Word Asset</p>
                    </div>
                  )}
               </div>

               <Button 
                 onClick={handleUpload} disabled={uploading || !file} variant="primary" 
                 className="btn-premium w-full py-6 font-black text-lg shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
               >
                 {uploading ? <Loader2 className="animate-spin" /> : <><RefreshCw size={24} /> Redeposit Resume</>}
               </Button>

               <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <p className="text-[10px] leading-relaxed font-black uppercase tracking-widest text-primary/60 italic">
                     Uploading a new asset will immediately invalidate and replace the existing document globally across the platform.
                  </p>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default ResumeManagement;
