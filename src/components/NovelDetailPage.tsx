import React, { useState } from 'react';
import { useNovel } from '../context/NovelContext';
import type { Chapter } from '../types';
import { 
  ArrowLeft, 
  BookOpen, 
  Headphones, 
  Heart, 
  Star, 
  Clock, 
  Layers, 
  Share2, 
  PlusCircle, 
  Calendar,
  MessageSquare,
  Coffee,
  ShieldAlert
} from 'lucide-react';
import { AdSenseBanner } from './AdSenseBanner';
import { SaweriaSupportCard } from './SaweriaSupportCard';
import { SaweriaModal } from './SaweriaModal';

export const NovelDetailPage: React.FC = () => {
  const { 
    selectedNovel, 
    setView, 
    openReader, 
    toggleFavorite, 
    addNewChapter 
  } = useNovel();

  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [showSaweriaModal, setShowSaweriaModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterContent, setNewChapterContent] = useState('');
  const [activeTab, setActiveTab] = useState<'chapters' | 'reviews'>('chapters');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedNovel) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-500">Novel tidak ditemukan.</p>
        <button 
          onClick={() => setView('library')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm"
        >
          Kembali ke Perpustakaan
        </button>
      </div>
    );
  }

  const totalReadTime = selectedNovel.chapters.reduce((acc, c) => acc + c.readTimeMinutes, 0);
  const lastReadChapter = selectedNovel.lastReadChapterId 
    ? selectedNovel.chapters.find(c => c.id === selectedNovel.lastReadChapterId)
    : selectedNovel.chapters[0];

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim() || !newChapterContent.trim()) return;
    addNewChapter(selectedNovel.id, newChapterTitle.trim(), newChapterContent.trim());
    setNewChapterTitle('');
    setNewChapterContent('');
    setShowAddChapterModal(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('library')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Tautan Disalin!' : 'Bagikan'}</span>
          </button>
          
          <button
            onClick={() => toggleFavorite(selectedNovel.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              selectedNovel.isFavorite
                ? 'bg-pink-50 dark:bg-pink-950/50 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${selectedNovel.isFavorite ? 'fill-pink-500' : ''}`} />
            <span>{selectedNovel.isFavorite ? 'Tersimpan di Koleksi' : 'Tambah ke Koleksi'}</span>
          </button>
        </div>
      </div>

      {/* Main Book Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left 3D Book Cover */}
        <div className="w-full md:w-64 flex-shrink-0 mx-auto md:mx-0">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10 group">
            <img 
              src={selectedNovel.cover} 
              alt={selectedNovel.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {selectedNovel.ageRating && (
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white backdrop-blur-md border border-rose-400 shadow-md">
                  {selectedNovel.ageRating}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md">
                {selectedNovel.genre}
              </span>
            </div>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 space-y-4">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {selectedNovel.ageRating && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black border border-rose-500/30">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Rating Usia {selectedNovel.ageRating} Dewasa</span>
                </span>
              )}

              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                E-Book & Audiobook
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {selectedNovel.publishedYear}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-slate-900 dark:text-white leading-tight">
              {selectedNovel.title}
            </h1>
            
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium mt-1">
              Penulis: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedNovel.author}</span>
            </p>
          </div>

          {/* Rating & Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-100 dark:border-slate-800 text-sm">
            <div className="flex items-center gap-1.5 font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-500" />
              <span className="text-base text-slate-900 dark:text-white">{selectedNovel.rating}</span>
              <span className="text-xs text-slate-400 font-normal">({selectedNovel.reviewsCount} pembaca)</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-medium">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>{selectedNovel.chapters.length} Bab Terbit</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-medium">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>±{totalReadTime} Menit Membaca</span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              {selectedNovel.totalWords.toLocaleString()} kata
            </div>
          </div>

          {/* Multi-Genre Badges */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Genre Cerita</h3>
            <div className="flex flex-wrap gap-1.5">
              {(selectedNovel.genres || [selectedNovel.genre]).map((g, idx) => (
                <span 
                  key={idx}
                  className="text-xs px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/60 dark:border-indigo-800/60"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sinopsis Cerita</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedNovel.synopsis}
            </p>
          </div>

          {/* Content Advisory Warnings (For 21+ and 18+) */}
          {selectedNovel.contentWarnings && selectedNovel.contentWarnings.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Peringatan Konten & Bimbingan Pembaca (21+):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNovel.contentWarnings.map((warning, idx) => (
                  <span 
                    key={idx} 
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-rose-100/80 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 font-medium"
                  >
                    • {warning}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedNovel.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => openReader(selectedNovel, lastReadChapter?.id)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              <span>
                {selectedNovel.lastReadChapterId ? `Lanjutkan (${lastReadChapter?.title})` : 'Mulai Membaca Bab 1'}
              </span>
            </button>

            <button
              onClick={() => openReader(selectedNovel, lastReadChapter?.id, 0)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-semibold text-sm border border-purple-200 dark:border-purple-800 transition-all active:scale-[0.98]"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Dengarkan Audiobook</span>
            </button>

            <button
              onClick={() => setShowSaweriaModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-semibold text-sm border border-amber-200/80 dark:border-amber-800/80 transition-colors"
            >
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>Traktir Kopi Penulis</span>
            </button>

            <button
              onClick={() => setShowAddChapterModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Bab Baru</span>
            </button>
          </div>

        </div>

      </div>

      {/* Saweria Author Support Banner */}
      <SaweriaSupportCard 
        authorName={selectedNovel.author}
        onOpenModal={() => setShowSaweriaModal(true)}
      />

      {/* Chapters & Reviews Navigation Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'chapters'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Daftar Bab ({selectedNovel.chapters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ulasan Pembaca</span>
            </button>
          </div>

          {activeTab === 'chapters' && (
            <button
              onClick={() => setShowAddChapterModal(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Bab</span>
            </button>
          )}
        </div>

        {/* Chapters Content */}
        {activeTab === 'chapters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedNovel.chapters.map((chapter: Chapter) => (
              <div
                key={chapter.id}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 hover:shadow-md transition-all"
              >
                <div 
                  className="flex-1 cursor-pointer pr-4"
                  onClick={() => openReader(selectedNovel, chapter.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      Bab {chapter.chapterNumber}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {chapter.readTimeMinutes} mnt
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {chapter.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openReader(selectedNovel, chapter.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Baca Bab Ini"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openReader(selectedNovel, chapter.id, 0)}
                    className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-600 dark:text-purple-400 transition-colors"
                    title="Dengarkan Audio Bab Ini"
                  >
                    <Headphones className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Content */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                    DS
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Dian Santoso</h5>
                    <p className="text-[10px] text-slate-400">Pembaca Terverifikasi • 2 hari yang lalu</p>
                  </div>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(5)}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Alur ceritanya sangat mendalam! Fitur Web Speech TTS dan pemutar musik latar NCS membuat pengalaman membacanya terasa seperti menonton film layar lebar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                    RM
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Rizky Maulana</h5>
                    <p className="text-[10px] text-slate-400">Pembaca Terverifikasi • 5 hari yang lalu</p>
                  </div>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(5)}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Tema sepiatif dan font serifnya sangat nyaman untuk mata membaca lama. Rekomendasi wajib bagi pecinta genre ini!
              </p>
            </div>
          </div>
        )}

      </div>

      {/* AdSense Banner for Book Details */}
      <AdSenseBanner slotId="4001" format="horizontal" label="Iklan Sponsor AdSense (Detail Buku)" />

      {/* Modal: Tambah Bab Baru */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <span>Tambah Bab Baru untuk "{selectedNovel.title}"</span>
              </h3>
              <button 
                onClick={() => setShowAddChapterModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChapter} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Bab (Contoh: Bab {selectedNovel.chapters.length + 1}: Pertemuan Rahasia)
                </label>
                <input
                  type="text"
                  required
                  placeholder={`Bab ${selectedNovel.chapters.length + 1}: Judul Bab...`}
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Isi Paragraf Cerita (Gunakan baris baru untuk memisahkan paragraf)
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Tulis narasi atau salin naskah bab di sini..."
                  value={newChapterContent}
                  onChange={(e) => setNewChapterContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-y font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  Simpan & Terbitkan Bab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Saweria Modal */}
      <SaweriaModal 
        isOpen={showSaweriaModal} 
        onClose={() => setShowSaweriaModal(false)}
        authorName={selectedNovel.author}
      />
    </div>
  );
};
