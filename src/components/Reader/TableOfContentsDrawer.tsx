import React from 'react';
import { useNovel } from '../../context/NovelContext';
import type { Chapter } from '../../types';
import { X, Clock, ListOrdered } from 'lucide-react';

interface TableOfContentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableOfContentsDrawer: React.FC<TableOfContentsDrawerProps> = ({ isOpen, onClose }) => {
  const { selectedNovel, selectedChapter, openReader } = useNovel();

  if (!isOpen || !selectedNovel) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between overflow-y-auto z-10">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Daftar Isi Bab
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-[200px]">
                  {selectedNovel.title}
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

          {/* Chapter list items */}
          <div className="space-y-1.5 pt-4">
            {selectedNovel.chapters.map((chapter: Chapter) => {
              const isCurrent = selectedChapter?.id === chapter.id;

              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    openReader(selectedNovel, chapter.id);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCurrent 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        Bab {chapter.chapterNumber}
                      </span>
                      <span className={`text-[11px] flex items-center gap-1 ${
                        isCurrent ? 'text-indigo-100' : 'text-slate-400'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {chapter.readTimeMinutes} mnt
                      </span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm mt-1 truncate">
                      {chapter.title}
                    </h4>
                  </div>

                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Total {selectedNovel.chapters.length} Bab • SiNovel Interactive
          </p>
        </div>

      </div>
    </div>
  );
};
