import React from 'react';
import { useNovel } from '../../context/NovelContext';
import type { Bookmark } from '../../types';
import { X, Bookmark as BookmarkIcon, Trash2, BookOpen, StickyNote } from 'lucide-react';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToParagraph: (chapterId: string, paragraphIndex: number) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onJumpToParagraph 
}) => {
  const { selectedNovel, bookmarks, removeBookmark } = useNovel();

  if (!isOpen || !selectedNovel) return null;

  const novelBookmarks = bookmarks.filter(b => b.novelId === selectedNovel.id);

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
              <BookmarkIcon className="w-5 h-5 text-amber-500 fill-amber-500" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Penanda Buku (Bookmarks)
                </h3>
                <p className="text-xs text-slate-400">
                  {novelBookmarks.length} penanda tersimpan
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

          {/* Bookmarks List */}
          <div className="space-y-3 pt-4">
            {novelBookmarks.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto">
                  <BookmarkIcon className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Belum ada penanda buku
                </p>
                <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto">
                  Klik ikon bookmark di samping paragraf saat membaca untuk menandai halaman ini.
                </p>
              </div>
            ) : (
              novelBookmarks.map((bm: Bookmark) => (
                <div
                  key={bm.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                      Bab {bm.chapterNumber} • Paragraf #{bm.paragraphIndex + 1}
                    </span>
                    
                    <button
                      onClick={() => removeBookmark(bm.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Hapus Penanda"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {bm.note && (
                    <div className="flex items-start gap-1.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                      <StickyNote className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
                      <span className="font-medium italic">{bm.note}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2">
                    "{bm.sentenceText}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>{new Date(bm.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <button
                      onClick={() => {
                        onJumpToParagraph(bm.chapterId, bm.paragraphIndex);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 shadow-xs"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Buka Posisi</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Penanda otomatis tersimpan di memori lokal peramban Anda.
          </p>
        </div>

      </div>
    </div>
  );
};
