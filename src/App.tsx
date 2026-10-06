import React, { useState } from 'react';
import { NovelProvider, useNovel } from './context/NovelContext';
import { Navbar } from './components/Navbar';
import { LibraryView } from './components/LibraryView';
import { NovelDetailPage } from './components/NovelDetailPage';
import { ReaderView } from './components/Reader/ReaderView';
import { BGMPlayerWidget } from './components/BGMPlayerWidget';
import { AddNovelModal } from './components/AddNovelModal';
import { LegalPagesModal } from './components/LegalPagesModal';
import type { LegalPageTab } from './components/LegalPagesModal';
import { SaweriaModal } from './components/SaweriaModal';
import { Shield, FileText, Info, Mail, Coffee } from 'lucide-react';

const AppContent: React.FC = () => {
  const { view } = useNovel();
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'favorites' | 'history'>('all');
  const [isBGMDrawerOpen, setIsBGMDrawerOpen] = useState(false);
  const [isAddNovelOpen, setIsAddNovelOpen] = useState(false);
  const [isSaweriaOpen, setIsSaweriaOpen] = useState(false);
  
  // Legal & AdSense compliance modal
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalPageTab>('privacy');

  const openLegalTab = (tab: LegalPageTab) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* Show Navbar when not in Reader view (Reader has its own distraction-free top bar) */}
      {view !== 'reader' && (
        <Navbar 
          onOpenAddNovel={() => setIsAddNovelOpen(true)}
          onOpenBGMDrawer={() => setIsBGMDrawerOpen(true)}
          onOpenSaweria={() => setIsSaweriaOpen(true)}
          activeFilterTab={activeFilterTab}
          setActiveFilterTab={setActiveFilterTab}
        />
      )}

      {/* Main View Router */}
      <div className="flex-1">
        {view === 'library' && (
          <LibraryView 
            activeTab={activeFilterTab} 
            setActiveTab={setActiveFilterTab}
            onOpenAddNovel={() => setIsAddNovelOpen(true)}
            onOpenLegalModal={() => openLegalTab('privacy')}
          />
        )}

        {view === 'novel-detail' && (
          <NovelDetailPage />
        )}

        {view === 'reader' && (
          <ReaderView onOpenBGMDrawer={() => setIsBGMDrawerOpen(true)} />
        )}
      </div>

      {/* Footer when not in reader view */}
      {view !== 'reader' && (
        <footer className="mt-16 py-10 border-t border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  SiNovel — Pembaca E-Book Interaktif & Audiobook NCS
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Platform baca novel digital dengan dukungan Web Speech TTS, musik latar terpisah, dan privasi terjamin.
                </p>
              </div>

              {/* Compliance Legal Links for Google AdSense Approval */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <button 
                  onClick={() => openLegalTab('privacy')}
                  className="hover:underline flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Kebijakan Privasi</span>
                </button>
                <button 
                  onClick={() => openLegalTab('terms')}
                  className="hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Syarat & Ketentuan</span>
                </button>
                <button 
                  onClick={() => openLegalTab('about')}
                  className="hover:underline flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Tentang Kami</span>
                </button>
                <button 
                  onClick={() => openLegalTab('contact')}
                  className="hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Kontak & Bantuan</span>
                </button>
                <button 
                  onClick={() => setIsSaweriaOpen(true)}
                  className="hover:underline flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Traktir Penulis</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
              <p>
                © {new Date().getFullYear()} SiNovel. Seluruh hak cipta karya novel adalah milik masing-masing penulis.
              </p>
              <div className="flex items-center gap-3">
                <span>Google AdSense Ready</span>
                <span>•</span>
                <span>React + Vite + Tailwind CSS</span>
              </div>
            </div>

          </div>
        </footer>
      )}

      {/* Global Modals & Drawers */}
      <BGMPlayerWidget 
        isOpen={isBGMDrawerOpen} 
        onClose={() => setIsBGMDrawerOpen(false)} 
      />

      <AddNovelModal 
        isOpen={isAddNovelOpen} 
        onClose={() => setIsAddNovelOpen(false)} 
      />

      <LegalPagesModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

      <SaweriaModal 
        isOpen={isSaweriaOpen} 
        onClose={() => setIsSaweriaOpen(false)}
        authorName="PamanKen"
      />

    </div>
  );
};

export function App() {
  return (
    <NovelProvider>
      <AppContent />
    </NovelProvider>
  );
}

export default App;
