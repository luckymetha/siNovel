export type AgeRating = 'Semua Umur' | '13+' | '16+' | '18+' | '21+';

export type Genre = 
  | 'Thriller' 
  | 'Mystery' 
  | 'Action' 
  | 'Spy & Agent' 
  | 'Romance' 
  | 'Crime' 
  | 'Sci-Fi' 
  | 'Fantasy' 
  | 'Psychological' 
  | 'Drama' 
  | 'Adventure' 
  | 'Horror' 
  | 'Cyberpunk' 
  | 'Historical' 
  | 'Comedy' 
  | 'Supernatural' 
  | 'Slice of Life' 
  | string;

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string; // full text with paragraphs
  readTimeMinutes: number;
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  cover: string;
  genre: Genre; // Primary genre
  genres: Genre[]; // Multi-genre support
  ageRating: AgeRating; // '21+', '18+', '16+', '13+', 'Semua Umur'
  contentWarnings?: string[]; // e.g. ['Kekerasan', 'Konspirasi Gelap', 'Sensual']
  tags: string[];
  rating: number;
  reviewsCount: number;
  totalWords: number;
  publishedYear: number;
  featured?: boolean;
  chapters: Chapter[];
  isFavorite?: boolean;
  lastReadChapterId?: string;
  lastReadProgress?: number; // 0 to 100 percentage
  lastReadTimestamp?: number;
}

export interface Bookmark {
  id: string;
  novelId: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  paragraphIndex: number;
  sentenceText: string;
  note?: string;
  createdAt: number;
}

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple';

export interface Highlight {
  id: string;
  novelId: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  text: string;
  color: HighlightColor;
  note?: string;
  createdAt: number;
}

export type ThemeMode = 'light' | 'dark' | 'sepia' | 'deep-night' | 'forest' | 'lavender';
export type FontFamily = 'serif' | 'sans' | 'display' | 'mono';
export type LineHeight = 'compact' | 'normal' | 'relaxed' | 'loose';
export type TextAlign = 'left' | 'justify';
export type ReadingWidth = 'narrow' | 'normal' | 'wide' | 'full';

export interface ReaderSettings {
  theme: ThemeMode;
  fontSize: number; // in pixels (e.g., 14 - 28)
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  textAlign: TextAlign;
  readingWidth: ReadingWidth;
  autoScrollTTS: boolean;
  soundEffectsEnabled: boolean;
}

export type BGMGenre = 'focus' | 'epic' | 'sad' | 'mystery';

export interface BGMTrack {
  id: string;
  title: string;
  artist: string;
  genre: BGMGenre;
  duration: string;
  audioUrl?: string; // Direct royalty-free NCS/audio URL
  synthPreset: 'lofi-rain' | 'binaural-focus' | 'fantasy-harp' | 'epic-pad' | 'melancholy-piano' | 'dark-ambient';
  description: string;
}

export interface TTSVoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  default: boolean;
}
