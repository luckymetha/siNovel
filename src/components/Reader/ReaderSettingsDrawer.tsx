import React from 'react';
import { useNovel } from '../../context/NovelContext';
import type { ThemeMode, FontFamily, LineHeight, ReadingWidth } from '../../types';
import { 
  X, 
  AlignLeft, 
  AlignJustify, 
  Sliders
} from 'lucide-react';

interface ReaderSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReaderSettingsDrawer: React.FC<ReaderSettingsDrawerProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useNovel();

  if (!isOpen) return null;

  const themes: { id: ThemeMode; label: string; icon: string; bgClass: string; textClass: string }[] = [
    { id: 'light', label: 'Terang', icon: '☀️', bgClass: 'bg-white', textClass: 'text-slate-900' },
    { id: 'sepia', label: 'Sepia Hangat', icon: '☕', bgClass: 'bg-[#FBF0D9]', textClass: 'text-[#5F4B32]' },
    { id: 'dark', label: 'Gelap', icon: '🌙', bgClass: 'bg-slate-900', textClass: 'text-slate-100' },
    { id: 'deep-night', label: 'Deep Night (OLED)', icon: '🌌', bgClass: 'bg-[#060913]', textClass: 'text-slate-200' },
    { id: 'forest', label: 'Hutan Pinus', icon: '🌲', bgClass: 'bg-[#0E1F1A]', textClass: 'text-emerald-100' },
    { id: 'lavender', label: 'Lavender Dream', icon: '🪻', bgClass: 'bg-[#F6F3FF]', textClass: 'text-[#372B56]' },
  ];

  const fonts: { id: FontFamily; label: string; sample: string; fontClass: string }[] = [
    { id: 'serif', label: 'Merriweather (Serif Klasik)', sample: 'Kisah abadi di setiap kata', fontClass: 'font-serif' },
    { id: 'sans', label: 'Plus Jakarta (Sans Modern)', sample: 'Kisah abadi di setiap kata', fontClass: 'font-sans' },
    { id: 'display', label: 'Cinzel / Playfair (Elegan)', sample: 'Kisah abadi di setiap kata', fontClass: 'font-display' },
    { id: 'mono', label: 'Fira Code (Monospace)', sample: 'Kisah abadi di setiap kata', fontClass: 'font-mono' },
  ];

  const lineHeights: { id: LineHeight; label: string; value: string }[] = [
    { id: 'compact', label: 'Rapat', value: '1.4' },
    { id: 'normal', label: 'Normal', value: '1.7' },
    { id: 'relaxed', label: 'Santai', value: '2.0' },
    { id: 'loose', label: 'Longgar', value: '2.3' },
  ];

  const readingWidths: { id: ReadingWidth; label: string; px: string }[] = [
    { id: 'narrow', label: 'Sempit', px: '640px' },
    { id: 'normal', label: 'Standar', px: '780px' },
    { id: 'wide', label: 'Lebar', px: '960px' },
    { id: 'full', label: 'Layar Penuh', px: '100%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between overflow-y-auto z-10 space-y-6">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Pengaturan Tampilan Baca
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 pt-4">
            
            {/* Theme Mode Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mode Tema & Warna Latar
              </label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateSettings({ theme: t.id })}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      settings.theme === t.id
                        ? 'ring-2 ring-indigo-500 border-transparent shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    } ${t.bgClass} ${t.textClass}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20 dark:border-white/20" />
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="uppercase tracking-wider">Ukuran Font Teks</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{settings.fontSize}px</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateSettings({ fontSize: Math.max(14, settings.fontSize - 1) })}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="14"
                  max="28"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value, 10) })}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => updateSettings({ fontSize: Math.min(28, settings.fontSize + 1) })}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Font Family Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Jenis Tipografi / Font
              </label>
              <div className="space-y-1.5">
                {fonts.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => updateSettings({ fontFamily: f.id })}
                    className={`w-full p-2.5 rounded-2xl border text-left transition-all ${
                      settings.fontFamily === f.id
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {f.label}
                    </div>
                    <div className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 ${f.fontClass}`}>
                      {f.sample}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Line Height (Jarak Baris) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Jarak Antar Baris (Line Height)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {lineHeights.map((lh) => (
                  <button
                    key={lh.id}
                    onClick={() => updateSettings({ lineHeight: lh.id })}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                      settings.lineHeight === lh.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {lh.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Width */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Lebar Area Membaca
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {readingWidths.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => updateSettings({ readingWidth: w.id })}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                      settings.readingWidth === w.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Alignment */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Perataan Teks Paragraf
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSettings({ textAlign: 'left' })}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    settings.textAlign === 'left'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                  <span>Rata Kiri</span>
                </button>
                <button
                  onClick={() => updateSettings({ textAlign: 'justify' })}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    settings.textAlign === 'justify'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <AlignJustify className="w-4 h-4" />
                  <span>Rata Kanan-Kiri</span>
                </button>
              </div>
            </div>

            {/* Toggles: Auto-scroll & Sound Effects */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Auto-Scroll Mengikuti Narasi Audio
                </span>
                <input
                  type="checkbox"
                  checked={settings.autoScrollTTS}
                  onChange={(e) => updateSettings({ autoScrollTTS: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Efek Suara Balik Halaman & Tombol
                </span>
                <input
                  type="checkbox"
                  checked={settings.soundEffectsEnabled}
                  onChange={(e) => updateSettings({ soundEffectsEnabled: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                />
              </label>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            Tutup Pengaturan
          </button>
        </div>

      </div>
    </div>
  );
};
