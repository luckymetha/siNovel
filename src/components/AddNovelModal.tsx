import React, { useState, useRef } from 'react';
import { useNovel } from '../context/NovelContext';
import type { Genre, Chapter } from '../types';
import { BookPlus, Sparkles, X, Upload } from 'lucide-react';

interface AddNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddNovelModal: React.FC<AddNovelModalProps> = ({ isOpen, onClose }) => {
  const { addNewNovel } = useNovel();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<Genre>('Fantasy');
  const [synopsis, setSynopsis] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  
  // Imported chapters if user uploads a file
  const [importedChapters, setImportedChapters] = useState<Chapter[]>([]);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const genres: Genre[] = ['Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Adventure', 'Historical', 'Drama'];

  const presetCovers = [
    { label: 'Fantasy Kosmik', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop' },
    { label: 'Romansa Senja', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop' },
    { label: 'Misteri Kastil', url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop' },
    { label: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop' },
  ];

  // Handle file import (.txt or .json or .md)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportedFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(text);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.author) setAuthor(parsed.author);
          if (parsed.genre) setGenre(parsed.genre);
          if (parsed.synopsis) setSynopsis(parsed.synopsis);
          if (parsed.chapters && Array.isArray(parsed.chapters)) {
            setImportedChapters(parsed.chapters);
          }
          return;
        } catch (err) {
          console.error('Error parsing JSON novel:', err);
        }
      }

      // If .txt or .md, parse chapters based on "Bab", "Chapter", or split by delimiters
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
      if (!title) setTitle(cleanTitle);

      const chapterSplits = text.split(/(?=(?:Bab|Chapter)\s+\d+)/i);
      if (chapterSplits.length > 1 && chapterSplits[0].trim().length < 50) {
        // Multi-chapter split detected
        const chapters: Chapter[] = chapterSplits.filter(c => c.trim().length > 0).map((rawText, idx) => {
          const lines = rawText.trim().split('\n');
          const firstLine = lines[0].trim();
          const content = lines.slice(1).join('\n').trim() || rawText.trim();
          const words = content.split(/\s+/).length;
          return {
            id: `imported-ch-${idx + 1}-${Date.now()}`,
            chapterNumber: idx + 1,
            title: firstLine || `Bab ${idx + 1}`,
            content,
            readTimeMinutes: Math.max(1, Math.ceil(words / 200))
          };
        });
        setImportedChapters(chapters);
      } else {
        // Single chapter text
        setChapterTitle(`Bab 1: ${cleanTitle}`);
        setChapterContent(text);
      }
    };

    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !synopsis.trim()) return;

    const tags = tagsInput
      ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      : [genre, 'Original'];

    const chosenCover = coverUrl.trim() || presetCovers[0].url;

    let finalChapters: Chapter[] = [];

    if (importedChapters.length > 0) {
      finalChapters = importedChapters;
    } else {
      const words = chapterContent ? chapterContent.split(/\s+/).length : 250;
      const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

      finalChapters = [
        {
          id: `custom-ch-1-${Date.now()}`,
          chapterNumber: 1,
          title: chapterTitle.trim() || 'Bab 1: Awal Perjalanan',
          content: chapterContent.trim() || 'Kisah ini dimulai dari sini...',
          readTimeMinutes
        }
      ];
    }

    addNewNovel({
      title: title.trim(),
      author: author.trim(),
      genre,
      synopsis: synopsis.trim(),
      tags,
      cover: chosenCover,
      chapters: finalChapters,
      isFavorite: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Tulis / Impor Karya Novel Asli Anda
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data novel Anda akan langsung tersimpan di aplikasi dan siap dinarasikan lewat Web Speech & musik NCS.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Drag-and-Drop Quick Upload */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300 dark:border-indigo-900/60 rounded-2xl p-4 bg-indigo-50/40 dark:bg-indigo-950/20 text-center hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5"
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".txt,.json,.md" 
            onChange={handleFileUpload}
            className="hidden" 
          />
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            <Upload className="w-4 h-4" />
            <span>{importedFileName ? `File Terpilih: ${importedFileName}` : 'Klik untuk Impor File Naskah (.txt / .json / .md)'}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {importedChapters.length > 0 
              ? `✓ Berhasil memuat ${importedChapters.length} bab dari file Anda!` 
              : 'Otomatis memuat judul dan memisahkan bab secara instan'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul Novel *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Sang Penjelajah Dimensi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Penulis *
              </label>
              <input
                type="text"
                required
                placeholder="Nama Anda atau Nama Pena"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Genre & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Genre Utama
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as Genre)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tag Tema (pisahkan koma)
              </label>
              <input
                type="text"
                placeholder="Fantasi, Aksi, Petualangan"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Sinopsis Cerita *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ceritakan gambaran singkat kisah novel Anda..."
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Cover image url & presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              URL Gambar Sampul / Cover
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              <span className="text-[11px] text-slate-400">Pilihan cepat:</span>
              {presetCovers.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCoverUrl(preset.url)}
                  className={`text-[11px] px-2 py-1 rounded-lg border transition-all ${
                    coverUrl === preset.url
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Chapter (Bab 1) - Only show if not imported multi-chapter file */}
          {importedChapters.length === 0 && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-xs text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Naskah Bab Pertama (Bab 1)</span>
              </h4>

              <div>
                <input
                  type="text"
                  placeholder="Judul Bab 1 (Contoh: Bab 1: Pertemuan Awal)"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <textarea
                  rows={5}
                  placeholder="Tulis atau salin paragraf bab pertama di sini..."
                  value={chapterContent}
                  onChange={(e) => setChapterContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none resize-y font-sans"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              Simpan & Buka Novel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
