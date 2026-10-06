import React from 'react';
import type { Novel } from '../types';
import { useNovel } from '../context/NovelContext';
import { 
  BookOpen, 
  Star, 
  Headphones, 
  Sparkles, 
  Flame, 
  Clock, 
  Layers, 
  Heart 
} from 'lucide-react';

interface HeroBannerProps {
  featuredNovel?: Novel;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredNovel }) => {
  const { openReader, openNovelDetail, toggleFavorite } = useNovel();

  if (!featuredNovel) return null;

  const totalWordsFormatted = (featuredNovel.totalWords / 1000).toFixed(1) + 'k kata';
  const totalReadTime = featuredNovel.chapters.reduce((acc, c) => acc + c.readTimeMinutes, 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl border border-indigo-900/40 my-6">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
        
        {/* Left Story Information */}
        <div className="flex-1 space-y-4 text-center lg:text-left">
          
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Pilihan Editor Minggu Ini
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              {featuredNovel.genre}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <Headphones className="w-3.5 h-3.5" />
              Narasi Audio Web Speech
            </span>
          </div>

          {/* Title & Author */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
              {featuredNovel.title}
            </h1>
            <p className="text-sm sm:text-base text-indigo-200 mt-1">
              Karya <span className="font-semibold text-white">{featuredNovel.author}</span> • Tahun {featuredNovel.publishedYear}
            </p>
          </div>

          {/* Synopsis */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-2xl">
            {featuredNovel.synopsis}
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 py-2 border-y border-white/10 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{featuredNovel.rating}</span>
              <span className="text-slate-400 font-normal">({featuredNovel.reviewsCount} ulasan)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{featuredNovel.chapters.length} Bab</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>±{totalReadTime} mnt baca</span>
            </div>
            <div className="text-slate-400 hidden sm:inline">
              • {totalWordsFormatted}
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={() => openReader(featuredNovel)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <BookOpen className="w-5 h-5" />
              <span>Mulai Membaca</span>
            </button>

            <button
              onClick={() => openReader(featuredNovel, undefined, 0)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Headphones className="w-5 h-5 text-pink-400" />
              <span>Dengarkan Audio</span>
            </button>

            <button
              onClick={() => openNovelDetail(featuredNovel)}
              className="px-4 py-3 rounded-2xl bg-transparent hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm transition-colors border border-transparent hover:border-white/10"
            >
              Lihat Detail & Bab
            </button>

            <button
              onClick={() => toggleFavorite(featuredNovel.id)}
              className={`p-3 rounded-2xl border transition-all ${
                featuredNovel.isFavorite
                  ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                  : 'bg-white/10 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Tambah ke Favorit"
            >
              <Heart className={`w-5 h-5 ${featuredNovel.isFavorite ? 'fill-pink-400' : ''}`} />
            </button>
          </div>

        </div>

        {/* Right 3D Cover Showcase */}
        <div className="relative group perspective-1000 flex-shrink-0">
          <div 
            onClick={() => openNovelDetail(featuredNovel)}
            className="w-48 sm:w-56 lg:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-purple-950/80 ring-1 ring-white/20 transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 cursor-pointer relative"
          >
            <img 
              src={featuredNovel.cover} 
              alt={featuredNovel.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                {featuredNovel.genre}
              </span>
              <p className="text-white font-bold text-sm leading-snug">
                {featuredNovel.title}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
