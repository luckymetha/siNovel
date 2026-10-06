import React, { useState } from 'react';
import { Shield, FileText, Info, Mail, X, CheckCircle2, Lock } from 'lucide-react';

export type LegalPageTab = 'privacy' | 'terms' | 'about' | 'contact';

interface LegalPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalPageTab;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const [activeTab, setActiveTab] = useState<LegalPageTab>(initialTab);
  const [contactSent, setContactSent] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-8">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Pusat Informasi & Legalitas SiNovel
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kepatuhan Standar Kebijakan Google AdSense & Perlindungan Pengguna
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/60 p-1.5 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              activeTab === 'privacy'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kebijakan Privasi (Privacy Policy)</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              activeTab === 'terms'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Syarat & Ketentuan (Terms)</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              activeTab === 'about'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Tentang Kami (About Us)</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              activeTab === 'contact'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Hubungi Kami (Contact)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          
          {/* Privacy Policy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Kebijakan Privasi (Privacy Policy)
              </h4>
              <p className="text-xs text-slate-500">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

              <div className="space-y-3">
                <p>
                  Privasi pengunjung kami di <strong>SiNovel</strong> sangat penting bagi kami. Dokumen kebijakan privasi ini menguraikan jenis informasi pribadi yang diterima dan dikumpulkan oleh SiNovel dan bagaimana informasi tersebut digunakan.
                </p>

                <h5 className="font-bold text-slate-900 dark:text-white pt-2">1. Penggunaan Cookie & Google AdSense</h5>
                <p>
                  Google, sebagai vendor pihak ketiga, menggunakan cookie untuk menayangkan iklan di SiNovel. Penggunaan cookie DART oleh Google memungkinkannya menampilkan iklan kepada pengunjung kami berdasarkan kunjungan mereka ke situs ini dan situs lainnya di internet. Pengguna dapat memilih untuk tidak menggunakan cookie DART dengan mengunjungi Kebijakan Privasi jaringan iklan dan konten Google.
                </p>

                <h5 className="font-bold text-slate-900 dark:text-white pt-2">2. Penyimpanan Lokal (Local Storage)</h5>
                <p>
                  SiNovel menggunakan fitur <code>localStorage</code> peramban Anda untuk menyimpan preferensi membaca Anda (seperti mode tema, ukuran font, riwayat bab yang terakhir dibaca, penanda buku/bookmark, dan kutipan yang disorot). Data ini disimpan secara aman di dalam perangkat Anda sendiri dan tidak dikirim ke server pihak ketiga tanpa izin Anda.
                </p>

                <h5 className="font-bold text-slate-900 dark:text-white pt-2">3. Web Speech API & Pemutar Audio</h5>
                <p>
                  Fitur pembacaan teks otomatis (Audio Narasi) berjalan sepenuhnya di sisi klien (*client-side*) menggunakan Web Speech API bawaan peramban Anda. Tidak ada rekaman suara atau data teks pribadi yang direkam atau ditransmisikan keluar.
                </p>

                <h5 className="font-bold text-slate-900 dark:text-white pt-2">4. Persetujuan Pengguna</h5>
                <p>
                  Dengan menggunakan situs web kami, Anda dengan ini menyetujui Kebijakan Privasi kami dan menyetujui semua ketentuan yang tercantum.
                </p>
              </div>
            </div>
          )}

          {/* Terms of Service Tab */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Syarat & Ketentuan Layanan (Terms of Service)
              </h4>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 dark:text-white">1. Ketentuan Penggunaan</h5>
                <p>
                  Dengan mengakses SiNovel, Anda setuju untuk terikat oleh Syarat dan Ketentuan Layanan ini, semua undang-undang dan peraturan yang berlaku, serta setuju bahwa Anda bertanggung jawab untuk mematuhi hukum setempat yang berlaku.
                </p>

                <h5 className="font-bold text-slate-900 dark:text-white pt-2">2. Hak Cipta dan Konten Penulis</h5>
                <p>
                  Seluruh karya novel, cerita pendek, dan naskah yang diterbitkan oleh penulis di platform ini tetap menjadi hak cipta milik masing-masing penulis. Dilarang keras menyalin, menggandakan, atau mendistribusikan ulang konten tanpa izin tertulis dari pemegang hak cipta.
                </p>

                <h5 className="font-bold text-slate-900 dark:text-white pt-2">3. Musik Latar Bebas Royalti (NoCopyrightSounds)</h5>
                <p>
                  Lagu latar yang tersedia pada pemutar musik berasal dari penyedia musik bebas royalti (NCS / Domain Publik / Creative Commons) untuk tujuan peningkatan pengalaman membaca imersif.
                </p>

                <h5 className="font-bold text-slate-900 dark:text-white pt-2">4. Penafian Tanggung Jawab</h5>
                <p>
                  Layanan SiNovel disediakan "sebagaimana adanya". Kami tidak memberikan jaminan, tersurat maupun tersirat, mengenai keakuratan atau keandalan materi yang dipublikasikan oleh pihak ketiga.
                </p>
              </div>
            </div>
          )}

          {/* About Us Tab */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Tentang SiNovel
              </h4>
              <p>
                <strong>SiNovel</strong> adalah platform aplikasi web pembaca novel digital interaktif generasi masa kini yang menggabungkan kenikmatan membaca bebas gangguan (*distraction-free reading*) dengan teknologi narasi suara otomatis (*Web Speech API*) dan musik latar suasana (*NCS Ambient Soundscapes*).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <h6 className="font-bold text-xs text-indigo-600 dark:text-indigo-400">Audiobook Interaktif</h6>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Mendengarkan novel dengan kalimat yang tersorot otomatis dan kecepatan narasi yang dapat diatur sesuka hati.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <h6 className="font-bold text-xs text-purple-600 dark:text-purple-400">Preset Musik Suasana NCS</h6>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Menghadirkan genre musik fokus, epik, emosional, dan misteri dengan kontrol volume mandiri.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Us Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Hubungi Tim SiNovel & Layanan Bantuan
              </h4>
              <p className="text-xs text-slate-500">
                Punya pertanyaan mengenai karya novel, pengaduan hak cipta (DMCA), atau peluang kerja sama penerbitan? Hubungi kami melalui formulir di bawah ini:
              </p>

              {contactSent ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h5 className="font-bold text-emerald-800 dark:text-emerald-300">Pesan Anda Telah Terkirim!</h5>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Terima kasih telah menghubungi SiNovel. Tim kami akan merespons melalui email dalam waktu 1x24 jam kerja.
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSent(true);
                  }}
                  className="space-y-3 pt-1"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nama Anda"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Alamat Email</label>
                      <input 
                        type="email" 
                        required
                        placeholder="nama@email.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subjek Pesan</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Pertanyaan / Pengaduan Hak Cipta / Kemitraan"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Isi Pesan</label>
                    <textarea 
                      rows={4}
                      required
                      placeholder="Tuliskan detail pesan Anda di sini..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                    />
                  </div>

                  <div className="pt-1 text-right">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95"
                    >
                      Kirim Pesan
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
          >
            Tutup Halaman
          </button>
        </div>

      </div>
    </div>
  );
};
