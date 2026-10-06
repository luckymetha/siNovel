import React, { useState } from 'react';
import { useNovel } from '../../context/NovelContext';
import type { Highlight, HighlightColor } from '../../types';
import { X, Trash2, Copy, Check, Quote } from 'lucide-react';

interface HighlightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToChapter?: (chapterId: string) => void;
}

export const HighlightsDrawer: React.FC<HighlightsDrawerProps> = ({ 
  isOpen, 
  onClose
}) => {
  const { selectedNovel, highlights, removeHighlight } = useNovel();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen || !selectedNovel) return null;

  const novelHighlights = highlights.filter(h => h.novelId === selectedNovel.id);

  const getColorClasses = (color: HighlightColor) => {
    switch (color) {
      case 'yellow':
        return 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200';
      case 'green':
        return 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200';
      case 'blue':
        return 'bg-sky-100 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200';
      case 'pink':
        return 'bg-pink-100 dark:bg-pink-950/60 border-pink-300 dark:border-pink-800 text-pink-900 dark:text-pink-200';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200';
      default:
        return 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200';
    }
  };

  const handleCopy = (hl: Highlight) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`"${hl.text}" — ${selectedNovel.title} (${hl.chapterTitle})`);
      setCopiedId(hl.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between overflow-y-auto z-10">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Quote className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Sorotan Teks & Kutipan
                </h3>
                <p className="text-xs text-slate-400">
                  {novelHighlights.length} kutipan tersimpan
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

          {/* Highlights list */}
          <div className="space-y-3 pt-4">
            {novelHighlights.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mx-auto">
                  <Quote className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Belum ada kutipan disorot
                </p>
                <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto">
                  Blok atau klik teks paragraf saat membaca untuk memberi highlight dan menyimpan kutipan favorit.
                </p>
              </div>
            ) : (
              novelHighlights.map((hl: Highlight) => (
                <div
                  key={hl.id}
                  className={`p-3.5 rounded-2xl border ${getColorClasses(hl.color)} space-y-2 group transition-all`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span>Bab {hl.chapterNumber}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(hl)}
                        className="p-1 rounded hover:bg-black/10 transition-colors"
                        title="Salin Kutipan"
                      >
                        {copiedId === hl.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => removeHighlight(hl.id)}
                        className="p-1 rounded hover:bg-red-500/20 text-red-600 transition-colors"
                        title="Hapus Sorotan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-serif italic leading-relaxed">
                    "{hl.text}"
                  </p>

                  {hl.note && (
                    <p className="text-[11px] font-sans font-semibold pt-1 border-t border-black/10 dark:border-white/10 opacity-90">
                      Catatan: {hl.note}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Kutipan favorit Anda dapat disalin dan dibagikan dengan mudah.
          </p>
        </div>

      </div>
    </div>
  );
};
