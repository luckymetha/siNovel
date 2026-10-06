import React, { useState } from 'react';
import { 
  BookOpen, 
  Bookmark, 
  Clock, 
  Music, 
  PlusCircle, 
  Sun, 
  Moon, 
  Coffee, 
  Sparkles,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import { useNovel } from '../context/NovelContext';
import type { ThemeMode } from '../types';

interface NavbarProps {
  onOpenAddNovel: () => void;
  onOpenBGMDrawer: () => void;
  onOpenSaweria?: () => void;
  activeFilterTab: 'all' | 'favorites' | 'history';
  setActiveFilterTab: (tab: 'all' | 'favorites' | 'history') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAddNovel, 
  onOpenBGMDrawer,
  onOpenSaweria,
  activeFilterTab,
  setActiveFilterTab
}) => {
  const { 
    view, 
    setView, 
    settings, 
    updateSettings, 
    bgmState, 
    toggleBGM, 
    totalReadMinutesToday 
  } = useNovel();

  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themeOptions: { id: ThemeMode; label: string; icon: string; bg: string }[] = [
    { id: 'light', label: 'Terang', icon: '☀️', bg: 'bg-white' },
    { id: 'sepia', label: 'Sepia Hangat', icon: '☕', bg: 'bg-[#FBF0D9]' },
    { id: 'dark', label: 'Gelap', icon: '🌙', bg: 'bg-slate-900' },
    { id: 'deep-night', label: 'Deep Night (OLED)', icon: '🌌', bg: 'bg-[#060913]' },
    { id: 'forest', label: 'Hutan Pinus', icon: '🌲', bg: 'bg-[#0E1F1A]' },
    { id: 'lavender', label: 'Lavender Dream', icon: '🪻', bg: 'bg-[#F6F3FF]' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setView('library')} 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-400 group-hover:text-pink-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent font-sans">
                  SiNovel
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Audio & BGM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                E-Book Reader & NCS Soundscapes
              </p>
            </div>
          </div>

          {/* Navigation Links (when in library view) */}
          {view === 'library' && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <button
                onClick={() => setActiveFilterTab('all')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeFilterTab === 'all'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                Jelajah Katalog
              </button>
              <button
                onClick={() => setActiveFilterTab('favorites')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeFilterTab === 'favorites'
                    ? 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Koleksi Saya
              </button>
              <button
                onClick={() => setActiveFilterTab('history')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeFilterTab === 'history'
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                Lanjut Membaca
              </button>
            </nav>
          )}

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Reading Timer Stat Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>{totalReadMinutesToday} mnt dibaca</span>
            </div>

            {/* Floating NCS BGM Quick Controller */}
            <div className="flex items-center bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/60 rounded-xl p-1 gap-1">
              <button
                onClick={toggleBGM}
                title={bgmState.isPlaying ? 'Jeda Musik Latar NCS' : 'Putar Musik Latar NCS'}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium ${
                  bgmState.isPlaying 
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30' 
                    : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40'
                }`}
              >
                {bgmState.isPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    <span className="hidden sm:inline">BGM ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span className="hidden sm:inline">BGM</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenBGMDrawer}
                title="Buka Menu Musik NCS"
                className="p-1.5 rounded-lg text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
              >
                <Music className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Selector Popover */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title="Ganti Tema Tampilan"
                className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 flex items-center justify-center"
              >
                {settings.theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
                {settings.theme === 'sepia' && <Coffee className="w-4 h-4 text-amber-700" />}
                {settings.theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
                {settings.theme === 'deep-night' && <Sparkles className="w-4 h-4 text-purple-400" />}
                {settings.theme === 'forest' && <span className="text-xs">🌲</span>}
                {settings.theme === 'lavender' && <span className="text-xs">🪻</span>}
              </button>

              {showThemeMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowThemeMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-20 animate-fade-in">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1">
                      Pilihan Tema Membaca
                    </p>
                    <div className="space-y-1">
                      {themeOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            updateSettings({ theme: opt.id });
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                            settings.theme === opt.id
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-400'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{opt.icon}</span>
                            <span>{opt.label}</span>
                          </div>
                          <span className={`w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 ${opt.bg}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Saweria Tip Button */}
            {onOpenSaweria && (
              <button
                onClick={onOpenSaweria}
                title="Traktir Kopi untuk PamanKen di Saweria"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/70 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                <span>Traktir Kopi</span>
              </button>
            )}

            {/* Add Novel Button */}
            <button
              onClick={onOpenAddNovel}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Tulis / Impor Novel</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
