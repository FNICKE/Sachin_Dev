"use client";
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[250px] bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 font-black uppercase tracking-widest animate-pulse">
      Loading Editor Pipeline...
    </div>
  ),
});

const RichTextEditor = ({ value, onChange, placeholder }) => {

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { list: 'check' },
      ],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }, { align: [] }],
      ['link', 'image', 'video', 'table'],
      ['blockquote', 'code-block'],
      ['clean'],
    ],
    table: true,
  };

  const formats = [
    'font',
    'size',
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'indent',
    'direction',
    'align',
    'link',
    'image',
    'video',
    'table',
    'blockquote',
    'code-block',
  ];

  return (
    <div className="rich-text-editor-container w-full">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Provide a deep dive into the details...'}
      />
    </div>
  );
};

export default RichTextEditor;
