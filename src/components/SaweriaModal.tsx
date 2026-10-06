import React, { useState } from 'react';
import { Coffee, Heart, ExternalLink, Sparkles, X, QrCode, CheckCircle2 } from 'lucide-react';

interface SaweriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName?: string;
  saweriaUrl?: string;
}

export const SaweriaModal: React.FC<SaweriaModalProps> = ({
  isOpen,
  onClose,
  authorName = 'PamanKen',
  saweriaUrl = 'https://saweria.co/PamanKen'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(saweriaUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-amber-900/50 p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                Dukungan Pembaca
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-0.5">
              Traktir Kopi {authorName}
            </h3>
          </div>
        </div>

        {/* Content */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Seluruh 29 bab <strong className="text-slate-900 dark:text-white">The Elite Files</strong> disajikan <strong>100% Gratis</strong> tanpa koin/paywall. Jika kamu menyukai ceritanya, dukung PamanKen untuk terus menulis sekuel berikutnya! ☕✨
        </p>

        {/* Support Perks Box */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Mendukung Penulis Independen</span>
          </div>
          <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
            Menerima pembayaran instan via <strong>QRIS, GoPay, OVO, DANA, ShopeePay, & Bank Transfer</strong> mulai dari Rp 5.000.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <a
            href={saweriaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Coffee className="w-4 h-4" />
            <span>Buka Halaman Saweria {authorName}</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <QrCode className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin Link Saweria</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
