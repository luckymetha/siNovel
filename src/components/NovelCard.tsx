import React from 'react';
import type { Novel } from '../types';
import { useNovel } from '../context/NovelContext';
import { 
  Star, 
  BookOpen, 
  Headphones, 
  Heart, 
  Layers, 
  Clock 
} from 'lucide-react';

interface NovelCardProps {
  novel: Novel;
}

export const NovelCard: React.FC<NovelCardProps> = ({ novel }) => {
  const { openReader, openNovelDetail, toggleFavorite } = useNovel();

  const totalReadTime = novel.chapters.reduce((acc, c) => acc + c.readTimeMinutes, 0);

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case 'Fantasy':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Romance':
        return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800';
      case 'Mystery':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Sci-Fi':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800';
      default:
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
    }
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-400/40 dark:hover:border-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1">
      
      {/* Cover image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer" onClick={() => openNovelDetail(novel)}>
        <img 
          src={novel.cover} 
          alt={novel.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Top Badges Overlay */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${getGenreColor(novel.genre)} pointer-events-auto shadow-sm`}>
            {novel.genre}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(novel.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all pointer-events-auto ${
              novel.isFavorite
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'
            }`}
            title="Favorit"
          >
            <Heart className={`w-3.5 h-3.5 ${novel.isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openReader(novel);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg transition-transform active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Baca Sekarang</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openReader(novel, undefined, 0);
              }}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-transform active:scale-95"
              title="Dengarkan Audio"
            >
              <Headphones className="w-4 h-4 text-pink-300" />
            </button>
          </div>
        </div>

        {/* Reading Progress Indicator Bar (if started) */}
        {novel.lastReadProgress !== undefined && novel.lastReadProgress > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/40">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-indigo-500" 
              style={{ width: `${novel.lastReadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Chapters info */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{novel.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-400" />
                {novel.chapters.length} Bab
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {totalReadTime}m
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 
            onClick={() => openNovelDetail(novel)}
            className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
          >
            {novel.title}
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            oleh {novel.author}
          </p>

          {/* Synopsis short */}
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {novel.synopsis}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {novel.tags.slice(0, 2).map((tag, idx) => (
            <span 
              key={idx} 
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

      </div>

    </div>
  );
};
