# SiNovel - Aplikasi Web Pembaca E-Book Novel Interaktif, Audiobook TTS, & NCS Soundscapes

Aplikasi web pembaca novel e-book modern, interaktif, dan imersif yang dibangun menggunakan **React**, **TypeScript**, dan **Tailwind CSS**. Dilengkapi dengan fitur **Web Speech API Text-to-Speech (TTS) Narasi Otomatis**, **NCS Background Music Player terpisah dengan Auto-Fade**, **Penanda Buku (Bookmark)**, **Sorotan Teks (Highlighting)**, serta **Pengaturan Tampilan Distraction-Free**.

---

## 🌟 Fitur Utama

### 1. 📖 Antarmuka Pembaca E-Book (Reader UI)
- **6 Pilihan Tema Membaca**:
  - ☀️ **Terang (Light)**
  - ☕ **Sepia Hangat (Sepia)**
  - 🌙 **Gelap (Dark)**
  - 🌌 **Deep Night (OLED True Black)**
  - 🌲 **Hutan Pinus (Forest Green)**
  - 🪻 **Lavender Dream**
- **Opsi Tipografi & Layout Lengkap**:
  - Slider Ukuran Font (14px - 28px) dengan tombol cepat `A-` dan `A+`.
  - 4 Pilihan Font: *Merriweather (Serif)*, *Plus Jakarta Sans (Sans-serif)*, *Cinzel / Playfair (Display Elegan)*, *Fira Code (Monospace)*.
  - Jarak Antar Baris (Line Height): *Rapat*, *Normal*, *Santai*, *Longgar*.
  - Lebar Area Membaca (Reading Width): *Sempit*, *Standar*, *Lebar*, *Layar Penuh*.
  - Perataan Teks: *Rata Kiri* dan *Rata Kanan-Kiri (Justify)*.
- **Navigasi Bab & Daftar Isi (Table of Contents)**: Sidebar drawer dengan indikator bab aktif dan estimasi menit membaca per bab.
- **Status & Progress Membaca**: Top progress bar dinamis saat scroll, nomor bab/halaman, dan estimasi sisa waktu baca.
- **Penanda Buku (Bookmarks)**: Simpan bookmark per paragraf/kalimat lengkap dengan catatan kustom (*personal notes*) dan timestamp.
- **Sorotan Teks (Highlighting)**: Seleksi teks saat membaca, pilih 5 warna sorotan (Kuning, Hijau, Biru, Pink, Ungu), salin kutipan instan, dan drawer rekap kutipan.
- **Zen Mode (Fullscreen Distraction-Free)**: Membaca tanpa gangguan visual dengan satu tombol atau shortcut `F`.

---

### 2. 🎙️ Fitur Audio / Narasi (Text-to-Speech & Audiobook)
- **Web Speech API TTS**: Narasi otomatis teks bab per kalimat tanpa ketergantungan API pihak ketiga atau batas kuota.
- **Live Text Auto-Highlight & Auto-Scroll**: Kalimat yang sedang dibacakan akan otomatis tersorot dengan efek glow dan layar auto-scroll menjaga pandangan tetap di posisi kalimat.
- **Klik Kalimat Langsung Baca**: Klik pada kalimat mana saja di dalam bab untuk langsung mulai mendengarkan dari titik tersebut.
- **Kontrol Audio Lengkap**:
  - Play / Pause / Resume
  - Speed Control: `0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`
  - Skip `-10s` (mundur 3 kalimat) dan `+10s` (maju 3 kalimat)
  - Pindah Bab Otomatis (*Auto-play next chapter*) saat bab selesai dinarasikan.
  - Pemilih Suara Narator (*Voice Selector*) dengan dukungan suara Bahasa Indonesia dan variasi bahasa lainnya dari sistem/browser.

---

### 3. 🎵 Pemutar Musik Latar BGM (NCS Backsound Player)
- **Terpisah dari Narasi Suara**: Musik latar berjalan pada channel terpisah agar tidak menutupi kejelasan suara pembacaan novel.
- **4 Playlist Preset NCS Sesuai Suasana Membaca**:
  1. ☕ **Focus / Chill / Ambient**: *Rainy Night Study Lo-Fi*, *Binaural Serenity & Forest Stream*
  2. ⚔️ **Epic / Cinematic / Fantasy**: *Chronicles of the Celestial Realm*, *Warriors of the Starlight Sky*
  3. 🌧️ **Sad / Emotional**: *Tears in the Autumn Wind*, *Memories We Left Behind*
  4. 🌌 **Mystery / Night**: *Shadows in Neo-Metropolis*
- **Generative Web Audio Synthesizer Fallback**: Menjamin musik suasana selalu berbunyi halus secara offline sekalipun stream online lambat/diblokir.
- **Kontrol Volume Mandiri (Slider 0-100%) & Mute Button**.
- **Fitur Auto-Fade In / Fade Out**: Suara memudar secara halus ketika musik dihentikan atau berganti lagu.
- **Pengatur Waktu Tidur (Sleep Timer)**: 15, 30, 45, 60 menit untuk membaca santai sebelum tidur.

---

### 4. 📚 Katalog, Perpustakaan, & Detail Novel (Library)
- **Hero Spotlight**: Novel pilihan mingguan dengan cover 3D hover effect dan akses cepat *Mulai Membaca* atau *Dengarkan Audio*.
- **Filter Genre**: *All*, *Fantasy*, *Romance*, *Mystery*, *Sci-Fi*.
- **Live Search**: Pencarian instan berdasarkan Judul, Penulis, Sinopsis, dan Tag tema.
- **Tab Navigasi**: *Jelajah Katalog*, *Koleksi Saya (Favorit)*, dan *Lanjut Membaca (Riwayat)*.
- **Pengurutan (Sort)**: *Terpopuler*, *Rating Tertinggi*, *Jumlah Bab*, *Tahun Rilis*.
- **Halaman Detail Novel**: Sinopsis lengkap, statistik kata & waktu baca, ulasan pembaca, serta daftar bab interaktif.
- **Penulis & Impor Karya Baru**: Modal pembuatan novel custom untuk menambahkan cerita Anda sendiri lengkap dengan bab dan cover!

---

## ⌨️ Pintasan Keyboard (Shortcuts)

| Shortcut | Aksi |
|---|---|
| `Space` | Play / Pause Narasi Suara TTS |
| `Alt` + `→` | Pindah ke Bab Berikutnya |
| `Alt` + `←` | Pindah ke Bab Sebelumnya |
| `F` | Toggle Mode Zen (Fullscreen Layar Penuh) |

---

## 🚀 Cara Menjalankan Project

### Prasyarat
- **Node.js**: versi 18+ atau 20+
- **npm** atau **yarn** / **pnpm**

### Langkah Instalasi
```bash
# Masuk ke direktori project
cd d:/Gawe/SiNovel

# Jalankan server pengembangan lokal
npm run dev
```

Buka peramban di `http://localhost:5173` untuk menikmati pengalaman membaca di **SiNovel**.

### Build untuk Produksi
```bash
npm run build
npm run preview
```

---

## 🛠️ Arsitektur & Teknologi
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Audio API**: Web Speech API (`window.speechSynthesis`) & Web Audio API (`AudioContext`)
- **Penyimpanan**: `localStorage` (Status riwayat membaca, daftar favorit, penanda buku, kutipan teks, preferensi tema & font).
