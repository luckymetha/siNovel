export interface ParsedSentence {
  text: string;
  paragraphIndex: number;
  sentenceIndex: number;
  globalIndex: number;
}

export interface ParsedParagraph {
  index: number;
  rawText: string;
  sentences: ParsedSentence[];
}

// Split chapter content into clean structured paragraphs and sentences
export function parseChapterContent(content: string): {
  paragraphs: ParsedParagraph[];
  allSentences: ParsedSentence[];
} {
  const rawParagraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphs: ParsedParagraph[] = [];
  const allSentences: ParsedSentence[] = [];
  let globalIndex = 0;

  rawParagraphs.forEach((pText, pIdx) => {
    const trimmed = pText.trim();
    // Split sentences by punctuation (. ! ? etc.) while preserving integrity
    const sentenceRegex = /[^.!?\n]+[.!?]+["'”’]?|\S[^\n.!?]+$/g;
    const matches = trimmed.match(sentenceRegex) || [trimmed];
    
    const sentences: ParsedSentence[] = [];
    matches.forEach((sText, sIdx) => {
      const cleanText = sText.trim();
      if (cleanText.length > 0) {
        const sentenceObj: ParsedSentence = {
          text: cleanText,
          paragraphIndex: pIdx,
          sentenceIndex: sIdx,
          globalIndex: globalIndex++
        };
        sentences.push(sentenceObj);
        allSentences.push(sentenceObj);
      }
    });

    paragraphs.push({
      index: pIdx,
      rawText: trimmed,
      sentences
    });
  });

  return { paragraphs, allSentences };
}

export class TTSEngine {
  private synth: SpeechSynthesis | null = null;
  private sentences: ParsedSentence[] = [];
  private currentSentenceIndex: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private rate: number = 1.0;
  private pitch: number = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private onSentenceChangeCallbacks: ((sentence: ParsedSentence | null) => void)[] = [];
  private onStateChangeCallbacks: ((state: { isPlaying: boolean; isPaused: boolean; currentSentenceIndex: number }) => void)[] = [];
  private onChapterCompleteCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      // Load voices
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Try to find Indonesian voice first, or default
    const indonesianVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia'));
    if (indonesianVoice) {
      this.selectedVoice = indonesianVoice;
    } else if (voices.length > 0) {
      this.selectedVoice = voices.find(v => v.default) || voices[0];
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public setVoice(voice: SpeechSynthesisVoice | null) {
    this.selectedVoice = voice;
    if (this.isPlaying && !this.isPaused) {
      const idx = this.currentSentenceIndex;
      this.stop();
      this.playFromSentenceIndex(idx);
    }
  }

  public getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.5, Math.min(2.5, newRate));
    if (this.isPlaying && !this.isPaused) {
      const idx = this.currentSentenceIndex;
      this.stop();
      this.playFromSentenceIndex(idx);
    }
  }

  public getRate(): number {
    return this.rate;
  }

  public loadSentences(sentences: ParsedSentence[]) {
    this.stop();
    this.sentences = sentences;
    this.currentSentenceIndex = 0;
    this.notifySentenceChange(null);
  }

  public playFromSentenceIndex(index: number) {
    if (!this.synth || this.sentences.length === 0) return;
    this.stop();

    this.currentSentenceIndex = Math.max(0, Math.min(this.sentences.length - 1, index));
    this.isPlaying = true;
    this.isPaused = false;
    this.speakCurrentSentence();
  }

  private speakCurrentSentence() {
    if (!this.synth || !this.isPlaying || this.isPaused) return;

    if (this.currentSentenceIndex >= this.sentences.length) {
      this.isPlaying = false;
      this.notifyStateChange();
      this.notifySentenceChange(null);
      if (this.onChapterCompleteCallback) {
        this.onChapterCompleteCallback();
      }
      return;
    }

    const currentSentence = this.sentences[this.currentSentenceIndex];
    this.notifySentenceChange(currentSentence);
    this.notifyStateChange();

    this.synth.cancel(); // clear previous speech

    const utterance = new SpeechSynthesisUtterance(currentSentence.text);

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    utterance.onend = () => {
      if (this.isPlaying && !this.isPaused) {
        this.currentSentenceIndex++;
        this.speakCurrentSentence();
      }
    };

    utterance.onerror = (e) => {
      // If stopped or canceled manually, ignore error
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn('TTS Utterance error:', e);
      if (this.isPlaying && !this.isPaused) {
        this.currentSentenceIndex++;
        this.speakCurrentSentence();
      }
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis speak failed:', err);
    }
  }

  public pause() {
    if (!this.isPlaying || this.isPaused) return;
    this.isPaused = true;
    if (this.synth) {
      this.synth.cancel();
    }
    this.notifyStateChange();
  }

  public resume() {
    if (!this.isPlaying && this.sentences.length > 0) {
      this.playFromSentenceIndex(this.currentSentenceIndex);
      return;
    }
    if (this.isPaused) {
      this.isPaused = false;
      this.speakCurrentSentence();
    }
  }

  public togglePlayPause() {
    if (this.isPlaying && !this.isPaused) {
      this.pause();
    } else if (this.isPaused) {
      this.resume();
    } else {
      this.playFromSentenceIndex(this.currentSentenceIndex);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.synth) {
      this.synth.cancel();
    }
    this.notifySentenceChange(null);
    this.notifyStateChange();
  }

  public skipNextSentence() {
    if (this.currentSentenceIndex < this.sentences.length - 1) {
      this.playFromSentenceIndex(this.currentSentenceIndex + 1);
    }
  }

  public skipPreviousSentence() {
    if (this.currentSentenceIndex > 0) {
      this.playFromSentenceIndex(this.currentSentenceIndex - 1);
    } else {
      this.playFromSentenceIndex(0);
    }
  }

  public skipSentences(offset: number) {
    const target = Math.max(0, Math.min(this.sentences.length - 1, this.currentSentenceIndex + offset));
    this.playFromSentenceIndex(target);
  }

  public onSentenceChange(cb: (sentence: ParsedSentence | null) => void) {
    this.onSentenceChangeCallbacks.push(cb);
    return () => {
      this.onSentenceChangeCallbacks = this.onSentenceChangeCallbacks.filter(c => c !== cb);
    };
  }

  public onStateChange(cb: (state: { isPlaying: boolean; isPaused: boolean; currentSentenceIndex: number }) => void) {
    this.onStateChangeCallbacks.push(cb);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(c => c !== cb);
    };
  }

  public setOnChapterComplete(cb: (() => void) | null) {
    this.onChapterCompleteCallback = cb;
  }

  private notifySentenceChange(sentence: ParsedSentence | null) {
    this.onSentenceChangeCallbacks.forEach(cb => cb(sentence));
  }

  private notifyStateChange() {
    this.onStateChangeCallbacks.forEach(cb => cb({
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentSentenceIndex: this.currentSentenceIndex
    }));
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentSentenceIndex: this.currentSentenceIndex,
      totalSentences: this.sentences.length,
      currentSentence: this.sentences[this.currentSentenceIndex] || null,
      rate: this.rate
    };
  }
}

export const ttsEngine = new TTSEngine();
