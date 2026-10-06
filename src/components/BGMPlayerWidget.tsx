import React, { useState } from 'react';
import { useNovel } from '../context/NovelContext';
import type { BGMGenre } from '../types';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Clock, 
  ShieldCheck,
  X
} from 'lucide-react';

interface BGMPlayerWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BGMPlayerWidget: React.FC<BGMPlayerWidgetProps> = ({ isOpen, onClose }) => {
  const { 
    bgmState, 
    playBGMTrack, 
    toggleBGM, 
    setBGMVolume, 
    toggleBGMMute, 
    setBGMSleepTimer 
  } = useNovel();

  const [activeGenreTab, setActiveGenreTab] = useState<BGMGenre>('focus');

  if (!isOpen) return null;

  const genresList: { id: BGMGenre; label: string; icon: string; desc: string }[] = [
    { id: 'focus', label: 'Focus / Chill / Ambient', icon: '☕', desc: 'Lofi santai & suara alam untuk fokus penuh' },
    { id: 'epic', label: 'Epic / Cinematic / Fantasy', icon: '⚔️', desc: 'Petikan harpa & orkestra megah bertema petualangan' },
    { id: 'sad', label: 'Sad / Emotional', icon: '🌧️', desc: 'Denting piano sendu & gesekan dawai melankolis' },
    { id: 'mystery', label: 'Mystery / Night', icon: '🌌', desc: 'Synthwave kelam & tensi spionase mendebarkan' },
  ];

  const filteredTracks = bgmState.tracks.filter(t => t.genre === activeGenreTab);

  const sleepTimerOptions = [
    { label: 'Off', minutes: null },
    { label: '15 mnt', minutes: 15 },
    { label: '30 mnt', minutes: 30 },
    { label: '45 mnt', minutes: 45 },
    { label: '60 mnt', minutes: 60 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 text-white rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with NCS branding */}
        <div className="p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Music className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg tracking-tight text-white font-sans">
                  NCS & Ambient Backsound Player
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                  Royalty-Free
                </span>
              </div>
              <p className="text-xs text-purple-200/70">
                Musik latar imersif terpisah dengan kontrol volume khusus dan auto-fade
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Track Banner & Master Controls */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Active Track Title */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={toggleBGM}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
                  bgmState.isPlaying 
                    ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/40 hover:scale-105'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {bgmState.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    {bgmState.isPlaying ? 'Sedang Memutar Musik Latar' : 'BGM Dijeda (Auto-fade siap)'}
                  </span>
                  {bgmState.isPlaying && (
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 h-3 bg-purple-400 rounded-full animate-pulse" />
                      <span className="w-0.5 h-2 bg-pink-400 rounded-full animate-pulse delay-75" />
                      <span className="w-0.5 h-3.5 bg-indigo-400 rounded-full animate-pulse delay-150" />
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-sm text-white truncate max-w-xs sm:max-w-sm">
                  {bgmState.currentTrack?.title || 'Pilih Lagu Suasana'}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {bgmState.currentTrack?.artist} • {bgmState.currentTrack?.genre.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Dedicated Volume Slider */}
            <div className="flex items-center gap-3 w-full sm:w-60 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-800">
              <button
                onClick={toggleBGMMute}
                title={bgmState.isMuted ? 'Batal Bisukan' : 'Bisukan BGM'}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                {bgmState.isMuted || bgmState.volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Volume BGM</span>
                  <span>{bgmState.isMuted ? 'Muted' : `${Math.round(bgmState.volume * 100)}%`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={bgmState.isMuted ? 0 : bgmState.volume}
                  onChange={(e) => {
                    if (bgmState.isMuted) toggleBGMMute();
                    setBGMVolume(parseFloat(e.target.value));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

          </div>

          {/* Sleep Timer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Pengatur Waktu Tidur (Auto-fade out):</span>
            </div>
            <div className="flex items-center gap-1">
              {sleepTimerOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setBGMSleepTimer(opt.minutes)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    bgmState.sleepTimerMinutes === opt.minutes
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Genre Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-slate-950 border-b border-slate-800">
          {genresList.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGenreTab(g.id)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                activeGenreTab === g.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{g.icon}</span>
              <span className="truncate">{g.id.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Track Playlist Items */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <p className="text-xs text-slate-400 font-medium px-1 mb-2">
            {genresList.find(g => g.id === activeGenreTab)?.desc}
          </p>

          {filteredTracks.map((track) => {
            const isCurrentTrack = bgmState.currentTrack?.id === track.id;
            const isPlayingThis = isCurrentTrack && bgmState.isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => playBGMTrack(track)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrentTrack
                    ? 'bg-purple-950/60 border-purple-500/60 text-white shadow-lg shadow-purple-900/20'
                    : 'bg-slate-800/60 border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isPlayingThis 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-700 text-slate-300 group-hover:text-white'
                  }`}>
                    {isPlayingThis ? (
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-0.5 h-3 bg-white rounded-full animate-bounce" />
                        <span className="w-0.5 h-4 bg-white rounded-full animate-bounce delay-100" />
                        <span className="w-0.5 h-2 bg-white rounded-full animate-bounce delay-200" />
                      </div>
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h5 className="font-bold text-sm text-white truncate">
                      {track.title}
                    </h5>
                    <p className="text-xs text-slate-400 truncate">
                      {track.artist}
                    </p>
                    <p className="text-[11px] text-purple-300/80 truncate mt-0.5">
                      {track.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 text-xs text-slate-400">
                  <span className="hidden sm:inline font-mono">{track.duration}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPlayingThis) {
                        toggleBGM();
                      } else {
                        playBGMTrack(track);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isPlayingThis
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    {isPlayingThis ? 'Sedang Diputar' : 'Putar Lagu'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-slate-950 text-center border-t border-slate-800/80 text-[11px] text-slate-400">
          💡 Tips: Musik latar berjalan terpisah dari narasi suara bab e-book. Anda dapat menyesuaikan volume keduanya secara mandiri.
        </div>

      </div>
    </div>
  );
};
