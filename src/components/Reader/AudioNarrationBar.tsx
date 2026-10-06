import React, { useState } from 'react';
import { useNovel } from '../../context/NovelContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  SkipBack, 
  SkipForward, 
  Gauge, 
  ChevronUp, 
  ChevronDown,
  Headphones,
  Languages,
  Check
} from 'lucide-react';

interface AudioNarrationBarProps {
  onOpenBGM: () => void;
}

export const AudioNarrationBar: React.FC<AudioNarrationBarProps> = ({ onOpenBGM }) => {
  const { 
    selectedChapter, 
    ttsState, 
    toggleTTS, 
    skipTTSSentence, 
    setTTSRate, 
    setTTSVoice, 
    setAutoPlayNextChapter,
    goToNextChapter,
    goToPrevChapter,
    bgmState
  } = useNovel();

  const [isExpanded, setIsExpanded] = useState(true);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  if (!selectedChapter) return null;

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];
  const progressPercent = ttsState.totalSentences > 0 
    ? Math.round((ttsState.currentSentenceIndex / ttsState.totalSentences) * 100) 
    : 0;

  return (
    <>
      {/* Floating Audio Bar Container */}
      <div className="fixed bottom-0 inset-x-0 z-40 p-2 sm:p-4 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          
          <div className="bg-slate-900/95 text-white backdrop-blur-xl rounded-3xl border border-slate-700/80 shadow-2xl p-3 sm:p-4 transition-all">
            
            {/* Top Minimized/Header Strip */}
            <div className="flex items-center justify-between gap-2 pb-2">
              
              {/* Left chapter info & sentence progress */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Narasi Suara Bab {selectedChapter.chapterNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      • {ttsState.currentSentenceIndex + 1}/{ttsState.totalSentences} Kalimat ({progressPercent}%)
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                    {ttsState.currentSentence ? ttsState.currentSentence.text : selectedChapter.title}
                  </p>
                </div>
              </div>

              {/* Right quick toggles */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Voice Selector button */}
                <button
                  onClick={() => setShowVoiceModal(!showVoiceModal)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-300 flex items-center gap-1 border border-slate-700"
                  title="Pilih Suara Narator Web Speech"
                >
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">
                    {ttsState.selectedVoice ? ttsState.selectedVoice.name.split(' ')[0] : 'Suara'}
                  </span>
                </button>

                {/* Speed selector pill */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-2.5 py-1 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-[11px] font-bold text-indigo-300 flex items-center gap-1 border border-indigo-800"
                    title="Kecepatan Membaca"
                  >
                    <Gauge className="w-3.5 h-3.5" />
                    <span>{ttsState.rate}x</span>
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute right-0 bottom-full mb-2 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-1.5 z-50 flex gap-1 animate-fade-in">
                      {speedOptions.map((spd) => (
                        <button
                          key={spd}
                          onClick={() => {
                            setTTSRate(spd);
                            setShowSpeedMenu(false);
                          }}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                            ttsState.rate === spd
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Minimize toggle */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* Expandable Controls Area */}
            {isExpanded && (
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                
                {/* Speech Timeline Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Playback Button Group */}
                <div className="flex items-center justify-between gap-2">
                  
                  {/* Left: Previous Chapter */}
                  <button
                    onClick={goToPrevChapter}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Bab Sebelumnya"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  {/* Middle Narration Controls */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    
                    {/* Skip -10s / backward 3 sentences */}
                    <button
                      onClick={() => skipTTSSentence('backward10')}
                      className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-0.5 text-xs font-medium"
                      title="Mundur 10 Detik"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="text-[10px] hidden sm:inline">-10s</span>
                    </button>

                    {/* Main Play / Pause Button */}
                    <button
                      onClick={toggleTTS}
                      className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 transition-all"
                      title={ttsState.isPlaying && !ttsState.isPaused ? 'Jeda Narasi' : 'Mulai Narasi Audio'}
                    >
                      {ttsState.isPlaying && !ttsState.isPaused ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>

                    {/* Skip +10s / forward 3 sentences */}
                    <button
                      onClick={() => skipTTSSentence('forward10')}
                      className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-0.5 text-xs font-medium"
                      title="Maju 10 Detik"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span className="text-[10px] hidden sm:inline">+10s</span>
                    </button>

                  </div>

                  {/* Right: Next Chapter */}
                  <button
                    onClick={() => goToNextChapter()}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Bab Selanjutnya"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                </div>

                {/* Sub-bar: Auto-play next chapter switch & quick BGM link */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={ttsState.autoPlayNextChapter}
                      onChange={(e) => setAutoPlayNextChapter(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-0"
                    />
                    <span>Otomatis Lanjut Bab Berikutnya</span>
                  </label>

                  <button
                    onClick={onOpenBGM}
                    className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>{bgmState.isPlaying ? 'Musik BGM Aktif' : 'Pasang Musik BGM'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* Voice Selection Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="w-full max-w-md bg-slate-900 text-white rounded-3xl border border-slate-700 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-sm text-white">Pilih Suara Narator Web Speech</h4>
              </div>
              <button 
                onClick={() => setShowVoiceModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Pilihan suara yang tersedia dari mesin Web Speech API di perangkat/browser Anda:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
              {ttsState.availableVoices.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">Memuat daftar suara sistem...</p>
              ) : (
                ttsState.availableVoices.map((voice, idx) => {
                  const isSelected = ttsState.selectedVoice?.voiceURI === voice.voiceURI;
                  const isIndo = voice.lang.startsWith('id');

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setTTSVoice(voice);
                        setShowVoiceModal(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="font-bold truncate max-w-[240px]">{voice.name}</span>
                        <span className="text-[10px] text-slate-400">
                          Bahasa: {voice.lang} {isIndo ? '🇮🇩 (Indonesia)' : ''}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowVoiceModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
