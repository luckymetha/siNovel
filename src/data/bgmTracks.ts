import type { BGMTrack } from '../types';

export const BGM_TRACKS: BGMTrack[] = [
  // Focus / Chill / Ambient
  {
    id: 'chill-lofi-rain',
    title: 'Rainy Night Study & Cozy Lo-Fi',
    artist: 'NCS Chillscape & Ambient Beats',
    genre: 'focus',
    duration: '03:45',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    synthPreset: 'lofi-rain',
    description: 'Ketukan lo-fi lembut berpadu gemercik air hujan, cocok untuk membaca dengan konsentrasi mendalam.'
  },
  {
    id: 'peaceful-ambient-stream',
    title: 'Binaural Serenity & Forest Stream',
    artist: 'NCS Zen Garden',
    genre: 'focus',
    duration: '04:12',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    synthPreset: 'binaural-focus',
    description: 'Suasana alam menenangkan dengan frekuensi binaural untuk merilekskan pikiran.'
  },
  
  // Epic / Cinematic / Fantasy
  {
    id: 'epic-fantasy-journey',
    title: 'Chronicles of the Celestial Realm',
    artist: 'NCS Epic Fantasy Studio',
    genre: 'epic',
    duration: '03:58',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=epic-cinematic-trailer-110034.mp3',
    synthPreset: 'fantasy-harp',
    description: 'Harmoni orkestra epik dengan petikan harpa fantasi yang membakar semangat petualangan.'
  },
  {
    id: 'majestic-battle-anthem',
    title: 'Warriors of the Starlight Sky',
    artist: 'NCS Cinematic Legends',
    genre: 'epic',
    duration: '04:30',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=epic-hollywood-trailer-9489.mp3',
    synthPreset: 'epic-pad',
    description: 'Nada megah yang dramatis untuk adegan pertempuran dan aksi magis yang menegangkan.'
  },

  // Sad / Emotional
  {
    id: 'sad-melancholy-piano',
    title: 'Tears in the Autumn Wind',
    artist: 'NCS Emotional Strings',
    genre: 'sad',
    duration: '03:20',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb54fb7ba3.mp3?filename=sad-piano-10903.mp3',
    synthPreset: 'melancholy-piano',
    description: 'Alunan denting piano sendu berbalut gesekan biola yang menyentuh relung hati terdalam.'
  },
  {
    id: 'sad-whispers-memory',
    title: 'Memories We Left Behind',
    artist: 'NCS Heartfelt Echoes',
    genre: 'sad',
    duration: '03:50',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1101.mp3?filename=emotional-piano-sad-background-music-for-videos-5688.mp3',
    synthPreset: 'melancholy-piano',
    description: 'Lagu puitis penuh nostalgia untuk bab bertema perpisahan dan kerinduan.'
  },

  // Mystery / Night
  {
    id: 'dark-cyber-mystery',
    title: 'Shadows in Neo-Metropolis',
    artist: 'NCS Darkwave & Synth',
    genre: 'mystery',
    duration: '04:05',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c3b7a5a8a1.mp3?filename=dark-mystery-trailer-110255.mp3',
    synthPreset: 'dark-ambient',
    description: 'Suasana synthwave misterius dan ketegangan spionase untuk investigasi kasus kelam.'
  }
];
