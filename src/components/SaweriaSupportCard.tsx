import React from 'react';
import { Coffee, Heart, ExternalLink, Sparkles } from 'lucide-react';

interface SaweriaSupportCardProps {
  authorName?: string;
  saweriaUrl?: string;
  onOpenModal?: () => void;
  className?: string;
}

export const SaweriaSupportCard: React.FC<SaweriaSupportCardProps> = ({
  authorName = 'PamanKen',
  saweriaUrl = 'https://saweria.co/PamanKen',
  onOpenModal,
  className = ''
}) => {
  return (
    <div className={`my-8 p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-300/40 dark:border-amber-700/40 shadow-xl shadow-amber-500/5 relative overflow-hidden ${className}`}>
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 relative z-10 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
            <Coffee className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full">
                Dukungan Karya
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                100% Gratis Tanpa Paywall
              </span>
            </div>

            <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              Menikmati Kisah The Elite Files?
            </h4>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Dukung <strong>{authorName}</strong> untuk terus berkarya dan mempercepat peluncuran <span className="italic">Book 2: The Syndicate</span> dengan mentraktir secangkir kopi di Saweria!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-shrink-0 pt-1">
          {onOpenModal ? (
            <button
              onClick={onOpenModal}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Coffee className="w-4 h-4" />
              <span>Traktir Kopi ({authorName})</span>
            </button>
          ) : (
            <a
              href={saweriaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Coffee className="w-4 h-4" />
              <span>Traktir Kopi di Saweria</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
