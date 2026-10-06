import React, { useState, useMemo } from 'react';
import { useNovel } from '../context/NovelContext';
import type { Novel } from '../types';
import { HeroBanner } from './HeroBanner';
import { NovelCard } from './NovelCard';
import { AdSenseBanner } from './AdSenseBanner';
import { 
  Search, 
  BookPlus,
  SlidersHorizontal,
  Bookmark,
  History,
  Compass,
  FileUp,
  Sparkles,
  Layers,
  Headphones
} from 'lucide-react';

interface LibraryViewProps {
  activeTab: 'all' | 'favorites' | 'history';
  setActiveTab: (tab: 'all' | 'favorites' | 'history') => void;
  onOpenAddNovel: () => void;
  onOpenLegalModal?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenAddNovel
}) => {
  const { novels } = useNovel();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedAgeRating, setSelectedAgeRating] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'chapters' | 'newest'>('popular');

  const genres = [
    'All', 
    'Thriller', 
    'Mystery', 
    'Action', 
    'Spy & Agent', 
    'Romance', 
    'Crime', 
    'Sci-Fi', 
    'Fantasy', 
    'Psychological', 
    'Drama', 
    'Adventure', 
    'Horror', 
    'Cyberpunk', 
    'Historical'
  ];

  const ageRatings = ['All', '21+', '18+', '16+', '13+', 'Semua Umur'];

  // Featured novel (if any)
  const featuredNovel = novels.find(n => n.featured) || (novels.length > 0 ? novels[0] : undefined);

  // Filter & sort novels
  const filteredNovels = useMemo(() => {
    return novels
      .filter((novel) => {
        // Tab filter
        if (activeTab === 'favorites' && !novel.isFavorite) return false;
        if (activeTab === 'history' && (!novel.lastReadProgress || novel.lastReadProgress === 0)) return false;

        // Genre filter (supports multi-genre)
        if (selectedGenre !== 'All') {
          const hasGenre = (novel.genres && novel.genres.includes(selectedGenre)) || novel.genre === selectedGenre;
          if (!hasGenre) return false;
        }

        // Age rating filter
        if (selectedAgeRating !== 'All') {
          if (novel.ageRating !== selectedAgeRating) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = novel.title.toLowerCase().includes(q);
          const matchAuthor = novel.author.toLowerCase().includes(q);
          const matchSynopsis = novel.synopsis.toLowerCase().includes(q);
          const matchGenre = (novel.genres || [novel.genre]).some(g => g.toLowerCase().includes(q));
          const matchTags = novel.tags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchAuthor && !matchSynopsis && !matchTags && !matchGenre) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'chapters') return b.chapters.length - a.chapters.length;
        if (sortBy === 'newest') return b.publishedYear - a.publishedYear;
        return b.reviewsCount - a.reviewsCount; // popular
      });
  }, [novels, activeTab, selectedGenre, selectedAgeRating, searchQuery, sortBy]);

  // Clean Zero Data State when user hasn't added any novel yet
  if (novels.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
        
        {/* Top AdSense Banner */}
        <AdSenseBanner slotId="1001" format="horizontal" label="Iklan Sponsor AdSense (Header)" />

        {/* Welcome Hero Box */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 border border-indigo-900/40 shadow-2xl text-center space-y-6">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/30">
            <BookPlus className="w-8 h-8 text-white" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              Selamat Datang di SiNovel
            </h1>
            <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed">
              Platform pembaca novel e-book interaktif tanpa data tiruan (dummy). Mulai tambahkan atau impor karya cerita asli Anda sekarang!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenAddNovel}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <BookPlus className="w-5 h-5" />
              <span>Tulis / Impor Novel Asli Pertama</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Web Speech Narator</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Membaca bab secara otomatis dengan auto-scroll dan penyorotan kalimat aktif.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Musik Latar Suasana NCS</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dukungan playlist genre Focus, Epic, Sad, dan Mystery dengan slider volume terpisah.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <FileUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Impor Berkas Mudah</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload file naskah Anda dalam format <code>.txt</code>, <code>.md</code>, atau <code>.json</code>.
            </p>
          </div>
        </div>

        {/* Bottom AdSense Banner */}
        <AdSenseBanner slotId="1002" format="horizontal" label="Iklan Sponsor AdSense (Footer)" />

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      
      {/* Top AdSense Leaderboard */}
      <AdSenseBanner slotId="2001" format="horizontal" label="Iklan Sponsor AdSense (Top Leaderboard)" />

      {/* Featured Book Spotlight (show when browsing all catalog and without search query) */}
      {activeTab === 'all' && !searchQuery && featuredNovel && (
        <HeroBanner featuredNovel={featuredNovel} />
      )}

      {/* Library Controls Bar: Search, Genre Pills, Sort Dropdown */}
      <div className="space-y-4">
        
        {/* Title & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
              {activeTab === 'all' && (
                <>
                  <Compass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <span>Katalog Novel Karya Asli</span>
                </>
              )}
              {activeTab === 'favorites' && (
                <>
                  <Bookmark className="w-6 h-6 text-pink-500 fill-pink-500" />
                  <span>Koleksi Novel Favorit Saya</span>
                </>
              )}
              {activeTab === 'history' && (
                <>
                  <History className="w-6 h-6 text-amber-500" />
                  <span>Riwayat Lanjut Membaca</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Menampilkan {filteredNovels.length} novel dengan dukungan narasi Web Speech & NCS
            </p>
          </div>

          {/* Filters & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            {/* Age Rating Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Rating:
              </span>
              <select
                value={selectedAgeRating}
                onChange={(e) => setSelectedAgeRating(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">Semua Rating Usia</option>
                <option value="21+">21+ (Dewasa Khusus)</option>
                <option value="18+">18+ (Dewasa)</option>
                <option value="16+">16+ (Remaja Lanjut)</option>
                <option value="13+">13+ (Remaja)</option>
                <option value="Semua Umur">Semua Umur (SU)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Urutkan:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="popular">Terpopuler</option>
                <option value="rating">Rating Tertinggi (★)</option>
                <option value="chapters">Jumlah Bab Terbanyak</option>
                <option value="newest">Tahun Terbaru</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Bar & Genre Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul novel, penulis, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Genre Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  selectedGenre === g
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {g === 'All' ? 'Semua Genre' : g}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Novels Grid */}
      {filteredNovels.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Tidak ada novel yang cocok
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Coba gunakan kata kunci pencarian lain atau klik tombol di bawah untuk menambah novel baru.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All');
                setActiveTab('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Reset Filter
            </button>
            <button
              onClick={onOpenAddNovel}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
            >
              Tambah Novel Baru
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNovels.map((novel: Novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      )}

      {/* Bottom In-Feed AdSense Banner */}
      <AdSenseBanner slotId="2002" format="horizontal" label="Iklan Sponsor AdSense (Katalog Bawah)" />

    </div>
  );
};
