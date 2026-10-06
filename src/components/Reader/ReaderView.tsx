import React, { useState, useEffect, useRef } from 'react';
import { useNovel } from '../../context/NovelContext';
import { parseChapterContent } from '../../services/ttsEngine';
import type { ParsedSentence, ParsedParagraph } from '../../services/ttsEngine';
import type { HighlightColor } from '../../types';
import { 
  ArrowLeft, 
  Settings, 
  ListOrdered, 
  Bookmark as BookmarkIcon, 
  Quote, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Music, 
  Copy
} from 'lucide-react';
import { TableOfContentsDrawer } from './TableOfContentsDrawer';
import { ReaderSettingsDrawer } from './ReaderSettingsDrawer';
import { BookmarksDrawer } from './BookmarksDrawer';
import { HighlightsDrawer } from './HighlightsDrawer';
import { AudioNarrationBar } from './AudioNarrationBar';
import { AdSenseBanner } from '../AdSenseBanner';

interface ReaderViewProps {
  onOpenBGMDrawer: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ onOpenBGMDrawer }) => {
  const { 
    selectedNovel, 
    selectedChapter, 
    setView, 
    settings, 
    bookmarks, 
    addBookmark, 
    highlights, 
    addHighlight, 
    ttsState, 
    startTTS, 
    toggleTTS, 
    goToNextChapter, 
    goToPrevChapter, 
    updateReadingProgress,
    bgmState
  } = useNovel();

  // Drawer States
  const [showTOC, setShowTOC] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  // Selection Popover State
  const [selectedText, setSelectedText] = useState('');
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
  const [showAddBookmarkModal, setShowAddBookmarkModal] = useState<{ pIdx: number; text: string } | null>(null);
  const [bookmarkNote, setBookmarkNote] = useState('');

  // Scroll reading progress percentage
  const [scrollProgress, setScrollProgress] = useState(0);
  const readerContentRef = useRef<HTMLDivElement>(null);
  const activeSentenceRef = useRef<HTMLSpanElement | null>(null);

  // Parse paragraphs and sentences of current chapter
  const parsedData = selectedChapter ? parseChapterContent(selectedChapter.content) : null;

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      if (selectedNovel && selectedChapter) {
        updateReadingProgress(selectedNovel.id, selectedChapter.id, progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedNovel, selectedChapter]);

  // Auto-scroll to active TTS sentence smoothly
  useEffect(() => {
    if (settings.autoScrollTTS && ttsState.isPlaying && activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [ttsState.currentSentenceIndex, ttsState.isPlaying, settings.autoScrollTTS]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleTTS();
      } else if (e.code === 'ArrowRight' && e.altKey) {
        goToNextChapter();
      } else if (e.code === 'ArrowLeft' && e.altKey) {
        goToPrevChapter();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleZenMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTTS, goToNextChapter, goToPrevChapter]);

  // Handle Text Selection Popup Toolbar
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionPos(null);
      setSelectedText('');
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 2) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setSelectionPos({
        x: Math.max(10, rect.left + rect.width / 2),
        y: Math.max(10, rect.top + window.scrollY - 45)
      });
    }
  };

  const toggleZenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsZenMode(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsZenMode(false);
    }
  };

  const handleApplyHighlight = (color: HighlightColor) => {
    if (selectedNovel && selectedChapter && selectedText) {
      addHighlight(selectedChapter.id, selectedText, color);
      window.getSelection()?.removeAllRanges();
      setSelectionPos(null);
      setSelectedText('');
    }
  };

  const handleJumpToParagraph = (_chapterId: string, paragraphIndex: number) => {
    const targetElement = document.getElementById(`paragraph-${paragraphIndex}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!selectedNovel || !selectedChapter || !parsedData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-slate-500">Memuat teks novel...</p>
      </div>
    );
  }

  // Determine container width class
  const getWidthClass = () => {
    switch (settings.readingWidth) {
      case 'narrow': return 'max-w-xl';
      case 'normal': return 'max-w-3xl';
      case 'wide': return 'max-w-5xl';
      case 'full': return 'max-w-full px-4 sm:px-12';
      default: return 'max-w-3xl';
    }
  };

  // Determine line height style
  const getLineHeightClass = () => {
    switch (settings.lineHeight) {
      case 'compact': return 'leading-relaxed';
      case 'normal': return 'leading-loose';
      case 'relaxed': return 'leading-[2.2]';
      case 'loose': return 'leading-[2.5]';
      default: return 'leading-loose';
    }
  };

  // Determine font family class
  const getFontFamilyClass = () => {
    switch (settings.fontFamily) {
      case 'serif': return 'font-serif';
      case 'sans': return 'font-sans';
      case 'display': return 'font-display';
      case 'mono': return 'font-mono';
      default: return 'font-serif';
    }
  };

  const currentIndex = selectedNovel.chapters.findIndex(c => c.id === selectedChapter.id);

  return (
    <div 
      className={`min-h-screen transition-colors duration-200 selection:bg-indigo-500 selection:text-white pb-40 ${
        settings.theme === 'light' ? 'bg-white text-slate-900' :
        settings.theme === 'sepia' ? 'bg-[#FBF0D9] text-[#5F4B32]' :
        settings.theme === 'dark' ? 'bg-[#0F172A] text-[#E2E8F0]' :
        settings.theme === 'deep-night' ? 'bg-[#060913] text-[#CBD5E1]' :
        settings.theme === 'forest' ? 'bg-[#0E1F1A] text-[#D1E7DD]' :
        'bg-[#F6F3FF] text-[#372B56]'
      }`}
      onMouseUp={handleMouseUp}
    >
      {/* Top Scroll Progress Bar */}
      <div className="fixed top-0 inset-x-0 h-1 z-50 bg-black/10">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Reader Sticky Header */}
      {!isZenMode && (
        <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-black/5 dark:border-white/10 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            
            {/* Left Nav Button & Chapter Indicator */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setView('novel-detail')}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Kembali ke Detail Novel"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Katalog</span>
              </button>

              <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />

              <div className="min-w-0">
                <p className="text-[11px] opacity-70 truncate max-w-[120px] sm:max-w-xs">
                  {selectedNovel.title}
                </p>
                <h4 className="font-bold text-xs sm:text-sm truncate max-w-[180px] sm:max-w-sm">
                  {selectedChapter.title}
                </h4>
              </div>
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Table of Contents button */}
              <button
                onClick={() => setShowTOC(true)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-xs font-semibold flex items-center gap-1"
                title="Daftar Isi Bab"
              >
                <ListOrdered className="w-4 h-4" />
                <span className="hidden md:inline">Daftar Isi</span>
              </button>

              {/* Bookmarks Drawer button */}
              <button
                onClick={() => setShowBookmarks(true)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-xs font-semibold flex items-center gap-1"
                title="Penanda Buku"
              >
                <BookmarkIcon className="w-4 h-4 text-amber-500" />
                <span className="hidden md:inline">Penanda ({bookmarks.filter(b => b.novelId === selectedNovel.id).length})</span>
              </button>

              {/* Highlights Drawer button */}
              <button
                onClick={() => setShowHighlights(true)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-xs font-semibold flex items-center gap-1"
                title="Sorotan Teks"
              >
                <Quote className="w-4 h-4 text-indigo-500" />
                <span className="hidden md:inline">Kutipan</span>
              </button>

              {/* BGM Toggle in Reader Header */}
              <button
                onClick={onOpenBGMDrawer}
                className={`p-2 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold ${
                  bgmState.isPlaying 
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50' 
                    : 'hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title="Musik Latar NCS"
              >
                <Music className="w-4 h-4" />
                <span className="hidden lg:inline">{bgmState.isPlaying ? 'BGM ON' : 'BGM'}</span>
              </button>

              {/* Zen Fullscreen mode */}
              <button
                onClick={toggleZenMode}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Mode Bebas Gangguan (Zen Fullscreen)"
              >
                {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Settings Drawer button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Pengaturan Tampilan"
              >
                <Settings className="w-4 h-4" />
              </button>

            </div>

          </div>
        </header>
      )}

      {/* Floating Exit Zen Mode Pill if in Zen Mode */}
      {isZenMode && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-2xl bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-all shadow-lg"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={toggleZenMode}
            className="px-3.5 py-2 rounded-2xl bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-all text-xs font-bold shadow-lg flex items-center gap-1.5"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Keluar Zen Mode (Esc/F)</span>
          </button>
        </div>
      )}

      {/* Main Chapter Reader Content */}
      <main 
        ref={readerContentRef}
        className={`mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 transition-all ${getWidthClass()}`}
        style={{ textAlign: settings.textAlign }}
      >
        {/* Chapter Title & Header */}
        <div className="text-center mb-10 pb-8 border-b border-black/10 dark:border-white/10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {selectedNovel.title} • Bab {selectedChapter.chapterNumber} dari {selectedNovel.chapters.length}
          </span>
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight leading-tight`}>
            {selectedChapter.title}
          </h1>
          <p className="text-xs opacity-70">
            Estimasi waktu membaca: ±{selectedChapter.readTimeMinutes} menit • {selectedChapter.content.split(/\s+/).length} kata
          </p>
        </div>

        {/* Paragraphs and Sentences with Interactive TTS & Highlights */}
        <div 
          className={`space-y-6 ${getFontFamilyClass()} ${getLineHeightClass()}`}
          style={{ fontSize: `${settings.fontSize}px` }}
        >
          {parsedData.paragraphs.map((para: ParsedParagraph) => {
            const hasBookmark = bookmarks.some(
              b => b.novelId === selectedNovel.id && b.chapterId === selectedChapter.id && b.paragraphIndex === para.index
            );

            return (
              <div 
                key={para.index} 
                id={`paragraph-${para.index}`}
                className="relative group flex items-start gap-2"
              >
                {/* Paragraph Quick Bookmark Toggle */}
                <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                  <button
                    onClick={() => {
                      const firstSentence = para.sentences[0]?.text || '';
                      setShowAddBookmarkModal({ pIdx: para.index, text: firstSentence });
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      hasBookmark 
                        ? 'text-amber-500 fill-amber-500' 
                        : 'text-slate-400 hover:text-amber-500'
                    }`}
                    title={hasBookmark ? 'Sudah Ditandai' : 'Tandai Paragraf Ini'}
                  >
                    <BookmarkIcon className={`w-4 h-4 ${hasBookmark ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Sentences */}
                <p className="flex-1">
                  {para.sentences.map((sent: ParsedSentence) => {
                    const isSpeakingThis = ttsState.isPlaying && ttsState.currentSentence?.globalIndex === sent.globalIndex;
                    
                    // Check if this sentence is highlighted by user
                    const sentenceHighlight = highlights.find(
                      h => h.novelId === selectedNovel.id && h.chapterId === selectedChapter.id && h.text.includes(sent.text.slice(0, 20))
                    );

                    const highlightClass = sentenceHighlight
                      ? sentenceHighlight.color === 'yellow' ? 'bg-amber-200/50 dark:bg-amber-500/30'
                      : sentenceHighlight.color === 'green' ? 'bg-emerald-200/50 dark:bg-emerald-500/30'
                      : sentenceHighlight.color === 'blue' ? 'bg-sky-200/50 dark:bg-sky-500/30'
                      : sentenceHighlight.color === 'pink' ? 'bg-pink-200/50 dark:bg-pink-500/30'
                      : 'bg-purple-200/50 dark:bg-purple-500/30'
                      : '';

                    return (
                      <span
                        key={sent.globalIndex}
                        ref={isSpeakingThis ? activeSentenceRef : null}
                        onClick={() => startTTS(sent.globalIndex)}
                        title="Klik untuk bacakan dari kalimat ini"
                        className={`cursor-pointer transition-all duration-150 inline rounded-sm hover:underline decoration-indigo-400/40 ${highlightClass} ${
                          isSpeakingThis ? 'tts-active-sentence font-medium' : ''
                        }`}
                      >
                        {sent.text}{' '}
                      </span>
                    );
                  })}
                </p>
              </div>
            );
          })}
        </div>

        {/* In-Article Reading AdSense Banner */}
        <AdSenseBanner slotId="3001" format="horizontal" label="Iklan Sponsor AdSense (Akhir Bab)" />

        {/* Chapter Bottom Navigation Buttons */}
        <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={goToPrevChapter}
            disabled={currentIndex <= 0}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-sm font-bold transition-all ${
              currentIndex > 0
                ? 'border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                : 'opacity-40 border-slate-300 dark:border-slate-800 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Bab Sebelumnya</span>
          </button>

          <div className="text-center text-xs opacity-70">
            <span>Bab {selectedChapter.chapterNumber} dari {selectedNovel.chapters.length}</span>
            <div className="text-[10px] mt-0.5">SiNovel Immersive Reader</div>
          </div>

          <button
            onClick={() => goToNextChapter()}
            disabled={currentIndex >= selectedNovel.chapters.length - 1}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
              currentIndex < selectedNovel.chapters.length - 1
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                : 'opacity-40 bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'
            }`}
          >
            <span>Bab Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Floating Selection Popup Toolbar for Highlighting and Bookmark */}
      {selectionPos && selectedText && (
        <div 
          className="fixed z-50 bg-slate-900 text-white rounded-2xl shadow-2xl p-1.5 flex items-center gap-1.5 border border-slate-700 animate-fade-in pointer-events-auto"
          style={{ 
            left: `${selectionPos.x}px`, 
            top: `${selectionPos.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {/* Highlight Color Pickers */}
          <div className="flex items-center gap-1 pr-1.5 border-r border-slate-700">
            <button
              onClick={() => handleApplyHighlight('yellow')}
              className="w-5 h-5 rounded-full bg-amber-400 hover:scale-110 transition-transform"
              title="Sorot Kuning"
            />
            <button
              onClick={() => handleApplyHighlight('green')}
              className="w-5 h-5 rounded-full bg-emerald-400 hover:scale-110 transition-transform"
              title="Sorot Hijau"
            />
            <button
              onClick={() => handleApplyHighlight('blue')}
              className="w-5 h-5 rounded-full bg-sky-400 hover:scale-110 transition-transform"
              title="Sorot Biru"
            />
            <button
              onClick={() => handleApplyHighlight('pink')}
              className="w-5 h-5 rounded-full bg-pink-400 hover:scale-110 transition-transform"
              title="Sorot Merah Muda"
            />
            <button
              onClick={() => handleApplyHighlight('purple')}
              className="w-5 h-5 rounded-full bg-purple-400 hover:scale-110 transition-transform"
              title="Sorot Ungu"
            />
          </div>

          {/* Copy Quote */}
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(selectedText);
                setSelectionPos(null);
                setSelectedText('');
              }
            }}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1 text-slate-300 hover:text-white"
            title="Salin Teks"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salin</span>
          </button>
        </div>
      )}

      {/* Modal: Add Bookmark with Note */}
      {showAddBookmarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <BookmarkIcon className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Tambah Penanda Buku (Bab {selectedChapter.chapterNumber})
              </h3>
            </div>

            <p className="text-xs text-slate-500 italic line-clamp-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              "{showAddBookmarkModal.text}"
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Pribadi (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Bagian misteri terungkap / Teori Kaelan..."
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowAddBookmarkModal(null);
                  setBookmarkNote('');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  addBookmark(selectedChapter.id, showAddBookmarkModal.pIdx, showAddBookmarkModal.text, bookmarkNote.trim() || undefined);
                  setShowAddBookmarkModal(null);
                  setBookmarkNote('');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md"
              >
                Simpan Penanda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Audio Narration Player Bar */}
      <AudioNarrationBar onOpenBGM={onOpenBGMDrawer} />

      {/* Slide-out Drawers */}
      <TableOfContentsDrawer isOpen={showTOC} onClose={() => setShowTOC(false)} />
      <ReaderSettingsDrawer isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BookmarksDrawer 
        isOpen={showBookmarks} 
        onClose={() => setShowBookmarks(false)} 
        onJumpToParagraph={handleJumpToParagraph}
      />
      <HighlightsDrawer 
        isOpen={showHighlights} 
        onClose={() => setShowHighlights(false)} 
      />
    </div>
  );
};
