import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  Novel, 
  Chapter, 
  Bookmark, 
  Highlight, 
  ReaderSettings, 
  BGMTrack,
  ThemeMode,
  HighlightColor
} from '../types';
import { INITIAL_NOVELS } from '../data/novelsData';
import { BGM_TRACKS } from '../data/bgmTracks';
import { ttsEngine, parseChapterContent } from '../services/ttsEngine';
import type { ParsedSentence } from '../services/ttsEngine';
import { bgmAudioEngine } from '../services/bgmAudioEngine';
import { playSoundEffect } from '../services/soundEffects';

interface NovelContextType {
  // Navigation & Views
  view: 'library' | 'novel-detail' | 'reader';
  setView: (view: 'library' | 'novel-detail' | 'reader') => void;
  selectedNovel: Novel | null;
  setSelectedNovel: (novel: Novel | null) => void;
  selectedChapter: Chapter | null;
  setSelectedChapter: (chapter: Chapter | null) => void;
  
  // Novels Data & Favorites
  novels: Novel[];
  toggleFavorite: (novelId: string) => void;
  addNewNovel: (newNovel: Omit<Novel, 'id' | 'rating' | 'reviewsCount' | 'totalWords' | 'publishedYear'>) => void;
  addNewChapter: (novelId: string, chapterTitle: string, content: string) => void;
  updateReadingProgress: (novelId: string, chapterId: string, progressPercentage: number) => void;
  
  // Bookmarks & Highlights
  bookmarks: Bookmark[];
  addBookmark: (chapterId: string, paragraphIndex: number, sentenceText: string, note?: string) => void;
  removeBookmark: (bookmarkId: string) => void;
  highlights: Highlight[];
  addHighlight: (chapterId: string, text: string, color: HighlightColor, note?: string) => void;
  removeHighlight: (highlightId: string) => void;

  // Reader Settings
  settings: ReaderSettings;
  updateSettings: (newSettings: Partial<ReaderSettings>) => void;

  // TTS State & Actions
  ttsState: {
    isPlaying: boolean;
    isPaused: boolean;
    currentSentence: ParsedSentence | null;
    rate: number;
    currentSentenceIndex: number;
    totalSentences: number;
    availableVoices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    autoPlayNextChapter: boolean;
  };
  startTTS: (fromIndex?: number) => void;
  pauseTTS: () => void;
  resumeTTS: () => void;
  toggleTTS: () => void;
  stopTTS: () => void;
  setTTSRate: (rate: number) => void;
  setTTSVoice: (voice: SpeechSynthesisVoice | null) => void;
  skipTTSSentence: (direction: 'next' | 'prev' | 'forward10' | 'backward10') => void;
  setAutoPlayNextChapter: (enabled: boolean) => void;
  
  // BGM State & Actions
  bgmState: {
    isPlaying: boolean;
    currentTrack: BGMTrack | null;
    volume: number;
    isMuted: boolean;
    tracks: BGMTrack[];
    sleepTimerMinutes: number | null;
  };
  playBGMTrack: (track: BGMTrack) => void;
  toggleBGM: () => void;
  pauseBGM: () => void;
  setBGMVolume: (volume: number) => void;
  toggleBGMMute: () => void;
  setBGMSleepTimer: (minutes: number | null) => void;

  // Navigation helpers
  openNovelDetail: (novel: Novel) => void;
  openReader: (novel: Novel, chapterId?: string, targetSentenceIndex?: number) => void;
  goToNextChapter: () => void;
  goToPrevChapter: () => void;
  
  // Reading Stats
  totalReadMinutesToday: number;
}

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'sepia',
  fontSize: 18,
  fontFamily: 'serif',
  lineHeight: 'relaxed',
  textAlign: 'left',
  readingWidth: 'normal',
  autoScrollTTS: true,
  soundEffectsEnabled: true,
};

const NovelContext = createContext<NovelContextType | undefined>(undefined);

export const NovelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State initialization with localStorage
  const [novels, setNovels] = useState<Novel[]>(() => {
    const saved = localStorage.getItem('sinovel_novels');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sync any initial novels with current author and chapter updates
          const updatedParsed = parsed.map((n: Novel) => {
            const initialMatch = INITIAL_NOVELS.find(init => init.id === n.id);
            if (initialMatch) {
              return {
                ...n,
                author: initialMatch.author,
                title: initialMatch.title,
                synopsis: initialMatch.synopsis,
                genre: initialMatch.genre,
                tags: initialMatch.tags,
                chapters: initialMatch.chapters,
                totalWords: initialMatch.totalWords,
                rating: initialMatch.rating
              };
            }
            return n;
          });
          const existingIds = new Set(updatedParsed.map((n: Novel) => n.id));
          const missingInitial = INITIAL_NOVELS.filter(n => !existingIds.has(n.id));
          return [...missingInitial, ...updatedParsed];
        }
      } catch { /* ignore */ }
    }
    return INITIAL_NOVELS;
  });

  const [view, setView] = useState<'library' | 'novel-detail' | 'reader'>('library');
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(() => {
    return INITIAL_NOVELS.length > 0 ? INITIAL_NOVELS[0] : null;
  });
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(() => {
    return INITIAL_NOVELS.length > 0 && INITIAL_NOVELS[0].chapters.length > 0 ? INITIAL_NOVELS[0].chapters[0] : null;
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('sinovel_bookmarks');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    const saved = localStorage.getItem('sinovel_highlights');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [settings, setSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem('sinovel_settings');
    if (saved) {
      try { return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }; } catch { /* ignore */ }
    }
    return DEFAULT_SETTINGS;
  });

  // Reading time counter
  const [totalReadMinutesToday, setTotalReadMinutesToday] = useState<number>(() => {
    const saved = localStorage.getItem('sinovel_read_time_' + new Date().toDateString());
    return saved ? parseInt(saved, 10) : 12; // Start with friendly 12 mins initial demo
  });

  // TTS State
  const [ttsState, setTtsState] = useState({
    isPlaying: false,
    isPaused: false,
    currentSentence: null as ParsedSentence | null,
    rate: 1.0,
    currentSentenceIndex: 0,
    totalSentences: 0,
    availableVoices: [] as SpeechSynthesisVoice[],
    selectedVoice: null as SpeechSynthesisVoice | null,
    autoPlayNextChapter: true,
  });

  // BGM State
  const [bgmState, setBgmState] = useState({
    isPlaying: false,
    currentTrack: BGM_TRACKS[0] as BGMTrack | null,
    volume: 0.35,
    isMuted: false,
    tracks: BGM_TRACKS,
    sleepTimerMinutes: null as number | null,
  });

  // Save novels, bookmarks, highlights, settings
  useEffect(() => {
    localStorage.setItem('sinovel_novels', JSON.stringify(novels));
  }, [novels]);

  useEffect(() => {
    localStorage.setItem('sinovel_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('sinovel_highlights', JSON.stringify(highlights));
  }, [highlights]);

  useEffect(() => {
    localStorage.setItem('sinovel_settings', JSON.stringify(settings));
    // Apply body theme class
    const themeClasses: ThemeMode[] = ['light', 'dark', 'sepia', 'deep-night', 'forest', 'lavender'];
    themeClasses.forEach(t => document.documentElement.classList.remove(`theme-${t}`, 'dark'));
    document.documentElement.classList.add(`theme-${settings.theme}`);
    if (settings.theme === 'dark' || settings.theme === 'deep-night' || settings.theme === 'forest') {
      document.documentElement.classList.add('dark');
    }
  }, [settings]);

  // Reading time tracker increment every minute in reader view
  useEffect(() => {
    if (view !== 'reader') return;
    const interval = setInterval(() => {
      setTotalReadMinutesToday(prev => {
        const next = prev + 1;
        localStorage.setItem('sinovel_read_time_' + new Date().toDateString(), next.toString());
        return next;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [view]);

  // Sync TTS voices
  useEffect(() => {
    const updateVoices = () => {
      const voices = ttsEngine.getAvailableVoices();
      const currentSelected = ttsEngine.getSelectedVoice();
      setTtsState(prev => ({
        ...prev,
        availableVoices: voices,
        selectedVoice: currentSelected
      }));
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Sync TTS listeners
  useEffect(() => {
    const unsubSentence = ttsEngine.onSentenceChange((sentence) => {
      setTtsState(prev => ({
        ...prev,
        currentSentence: sentence
      }));
    });

    const unsubState = ttsEngine.onStateChange((state) => {
      setTtsState(prev => ({
        ...prev,
        isPlaying: state.isPlaying,
        isPaused: state.isPaused,
        currentSentenceIndex: state.currentSentenceIndex
      }));
    });

    return () => {
      unsubSentence();
      unsubState();
    };
  }, []);

  // Load chapter sentences into TTS engine when chapter changes
  useEffect(() => {
    if (selectedChapter) {
      const { allSentences } = parseChapterContent(selectedChapter.content);
      ttsEngine.loadSentences(allSentences);
      setTtsState(prev => ({
        ...prev,
        totalSentences: allSentences.length,
        currentSentenceIndex: 0,
        currentSentence: null,
        isPlaying: false,
        isPaused: false
      }));
    }
  }, [selectedChapter]);

  // Handle TTS chapter completion
  useEffect(() => {
    ttsEngine.setOnChapterComplete(() => {
      if (ttsState.autoPlayNextChapter) {
        goToNextChapter(true); // auto play next chapter
      }
    });
  }, [ttsState.autoPlayNextChapter, selectedNovel, selectedChapter]);

  // Sleep timer for BGM
  useEffect(() => {
    if (!bgmState.sleepTimerMinutes) return;
    const timeout = setTimeout(() => {
      bgmAudioEngine.pause(true);
      setBgmState(prev => ({
        ...prev,
        isPlaying: false,
        sleepTimerMinutes: null
      }));
    }, bgmState.sleepTimerMinutes * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [bgmState.sleepTimerMinutes]);

  // Reader Setting updater
  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Toggle favorite
  const toggleFavorite = (novelId: string) => {
    setNovels(prev => prev.map(n => n.id === novelId ? { ...n, isFavorite: !n.isFavorite } : n));
    if (settings.soundEffectsEnabled) playSoundEffect('click');
  };

  // Add new novel
  const addNewNovel = (newNovelData: Omit<Novel, 'id' | 'rating' | 'reviewsCount' | 'totalWords' | 'publishedYear'>) => {
    const id = 'custom-' + Date.now();
    const words = newNovelData.chapters.reduce((acc, c) => acc + c.content.split(/\s+/).length, 0);
    const createdNovel: Novel = {
      ...newNovelData,
      id,
      rating: 5.0,
      reviewsCount: 1,
      totalWords: words,
      publishedYear: new Date().getFullYear(),
      chapters: newNovelData.chapters.length > 0 ? newNovelData.chapters : [
        {
          id: `${id}-ch-1`,
          chapterNumber: 1,
          title: 'Bab 1: Permulaan Kisah',
          content: 'Tulis bab pertama Anda di sini...',
          readTimeMinutes: 3
        }
      ]
    };
    setNovels(prev => [createdNovel, ...prev]);
    setSelectedNovel(createdNovel);
    setSelectedChapter(createdNovel.chapters[0]);
    setView('novel-detail');
  };

  // Add chapter to existing novel
  const addNewChapter = (novelId: string, chapterTitle: string, content: string) => {
    const words = content.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    setNovels(prev => prev.map(n => {
      if (n.id !== novelId) return n;
      const chapterNumber = n.chapters.length + 1;
      const newChapter: Chapter = {
        id: `${n.id}-ch-${chapterNumber}-${Date.now()}`,
        chapterNumber,
        title: chapterTitle || `Bab ${chapterNumber}`,
        content,
        readTimeMinutes
      };
      return {
        ...n,
        totalWords: n.totalWords + words,
        chapters: [...n.chapters, newChapter]
      };
    }));
  };

  // Update Reading Progress
  const updateReadingProgress = (novelId: string, chapterId: string, progressPercentage: number) => {
    setNovels(prev => prev.map(n => {
      if (n.id !== novelId) return n;
      return {
        ...n,
        lastReadChapterId: chapterId,
        lastReadProgress: Math.round(progressPercentage),
        lastReadTimestamp: Date.now()
      };
    }));
  };

  // Bookmarks
  const addBookmark = (chapterId: string, paragraphIndex: number, sentenceText: string, note?: string) => {
    if (!selectedNovel || !selectedChapter) return;
    const newBookmark: Bookmark = {
      id: 'bm-' + Date.now(),
      novelId: selectedNovel.id,
      chapterId,
      chapterNumber: selectedChapter.chapterNumber,
      chapterTitle: selectedChapter.title,
      paragraphIndex,
      sentenceText,
      note,
      createdAt: Date.now(),
    };
    setBookmarks(prev => [newBookmark, ...prev]);
    if (settings.soundEffectsEnabled) playSoundEffect('bookmark');
  };

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    if (settings.soundEffectsEnabled) playSoundEffect('click');
  };

  // Highlights
  const addHighlight = (chapterId: string, text: string, color: HighlightColor, note?: string) => {
    if (!selectedNovel || !selectedChapter) return;
    const newHighlight: Highlight = {
      id: 'hl-' + Date.now(),
      novelId: selectedNovel.id,
      chapterId,
      chapterNumber: selectedChapter.chapterNumber,
      chapterTitle: selectedChapter.title,
      text,
      color,
      note,
      createdAt: Date.now(),
    };
    setHighlights(prev => [newHighlight, ...prev]);
    if (settings.soundEffectsEnabled) playSoundEffect('highlight');
  };

  const removeHighlight = (highlightId: string) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
    if (settings.soundEffectsEnabled) playSoundEffect('click');
  };

  // Navigation functions
  const openNovelDetail = (novel: Novel) => {
    setSelectedNovel(novel);
    setView('novel-detail');
    if (settings.soundEffectsEnabled) playSoundEffect('click');
  };

  const openReader = (novel: Novel, chapterId?: string, targetSentenceIndex?: number) => {
    setSelectedNovel(novel);
    const targetChapter = chapterId 
      ? novel.chapters.find(c => c.id === chapterId) || novel.chapters[0]
      : (novel.lastReadChapterId ? novel.chapters.find(c => c.id === novel.lastReadChapterId) || novel.chapters[0] : novel.chapters[0]);
    
    setSelectedChapter(targetChapter);
    setView('reader');
    if (settings.soundEffectsEnabled) playSoundEffect('page-flip');

    if (targetSentenceIndex !== undefined && targetSentenceIndex >= 0) {
      setTimeout(() => {
        ttsEngine.playFromSentenceIndex(targetSentenceIndex);
      }, 300);
    }
  };

  const goToNextChapter = (autoPlayTTS: boolean = false) => {
    if (!selectedNovel || !selectedChapter) return;
    const currentIndex = selectedNovel.chapters.findIndex(c => c.id === selectedChapter.id);
    if (currentIndex < selectedNovel.chapters.length - 1) {
      const nextChapter = selectedNovel.chapters[currentIndex + 1];
      setSelectedChapter(nextChapter);
      updateReadingProgress(selectedNovel.id, nextChapter.id, 0);
      if (settings.soundEffectsEnabled) playSoundEffect('page-flip');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (autoPlayTTS) {
        setTimeout(() => {
          ttsEngine.playFromSentenceIndex(0);
        }, 500);
      }
    }
  };

  const goToPrevChapter = () => {
    if (!selectedNovel || !selectedChapter) return;
    const currentIndex = selectedNovel.chapters.findIndex(c => c.id === selectedChapter.id);
    if (currentIndex > 0) {
      const prevChapter = selectedNovel.chapters[currentIndex - 1];
      setSelectedChapter(prevChapter);
      updateReadingProgress(selectedNovel.id, prevChapter.id, 0);
      if (settings.soundEffectsEnabled) playSoundEffect('page-flip');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // TTS Actions
  const startTTS = (fromIndex: number = 0) => {
    ttsEngine.playFromSentenceIndex(fromIndex);
  };

  const pauseTTS = () => {
    ttsEngine.pause();
  };

  const resumeTTS = () => {
    ttsEngine.resume();
  };

  const toggleTTS = () => {
    ttsEngine.togglePlayPause();
    if (settings.soundEffectsEnabled) playSoundEffect('click');
  };

  const stopTTS = () => {
    ttsEngine.stop();
  };

  const setTTSRate = (rate: number) => {
    ttsEngine.setRate(rate);
    setTtsState(prev => ({ ...prev, rate }));
  };

  const setTTSVoice = (voice: SpeechSynthesisVoice | null) => {
    ttsEngine.setVoice(voice);
    setTtsState(prev => ({ ...prev, selectedVoice: voice }));
  };

  const skipTTSSentence = (direction: 'next' | 'prev' | 'forward10' | 'backward10') => {
    if (direction === 'next') ttsEngine.skipNextSentence();
    else if (direction === 'prev') ttsEngine.skipPreviousSentence();
    else if (direction === 'forward10') ttsEngine.skipSentences(3); // ~3 sentences is ~10s
    else if (direction === 'backward10') ttsEngine.skipSentences(-3);
  };

  const setAutoPlayNextChapter = (enabled: boolean) => {
    setTtsState(prev => ({ ...prev, autoPlayNextChapter: enabled }));
  };

  // BGM Actions
  const playBGMTrack = (track: BGMTrack) => {
    bgmAudioEngine.playTrack(track, bgmState.volume);
    setBgmState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true
    }));
    if (settings.soundEffectsEnabled) playSoundEffect('click');
  };

  const toggleBGM = () => {
    if (bgmState.isPlaying) {
      bgmAudioEngine.pause(true);
      setBgmState(prev => ({ ...prev, isPlaying: false }));
    } else {
      if (bgmState.currentTrack) {
        bgmAudioEngine.playTrack(bgmState.currentTrack, bgmState.volume);
        setBgmState(prev => ({ ...prev, isPlaying: true }));
      }
    }
    if (settings.soundEffectsEnabled) playSoundEffect('click');
  };

  const pauseBGM = () => {
    bgmAudioEngine.pause(true);
    setBgmState(prev => ({ ...prev, isPlaying: false }));
  };

  const setBGMVolume = (volume: number) => {
    bgmAudioEngine.setVolume(volume);
    setBgmState(prev => ({ ...prev, volume }));
  };

  const toggleBGMMute = () => {
    const isMuted = bgmAudioEngine.toggleMute();
    setBgmState(prev => ({ ...prev, isMuted }));
  };

  const setBGMSleepTimer = (minutes: number | null) => {
    setBgmState(prev => ({ ...prev, sleepTimerMinutes: minutes }));
  };

  return (
    <NovelContext.Provider
      value={{
        view,
        setView,
        selectedNovel,
        setSelectedNovel,
        selectedChapter,
        setSelectedChapter,
        novels,
        toggleFavorite,
        addNewNovel,
        addNewChapter,
        updateReadingProgress,
        bookmarks,
        addBookmark,
        removeBookmark,
        highlights,
        addHighlight,
        removeHighlight,
        settings,
        updateSettings,
        ttsState,
        startTTS,
        pauseTTS,
        resumeTTS,
        toggleTTS,
        stopTTS,
        setTTSRate,
        setTTSVoice,
        skipTTSSentence,
        setAutoPlayNextChapter,
        bgmState,
        playBGMTrack,
        toggleBGM,
        pauseBGM,
        setBGMVolume,
        toggleBGMMute,
        setBGMSleepTimer,
        openNovelDetail,
        openReader,
        goToNextChapter,
        goToPrevChapter,
        totalReadMinutesToday
      }}
    >
      {children}
    </NovelContext.Provider>
  );
};

export const useNovel = () => {
  const context = useContext(NovelContext);
  if (!context) {
    throw new Error('useNovel must be used within a NovelProvider');
  }
  return context;
};
