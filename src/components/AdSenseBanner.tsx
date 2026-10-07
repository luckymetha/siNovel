import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface AdSenseBannerProps {
  slotId?: string;
  adClient?: string;
  format?: 'auto' | 'fluid' | 'horizontal' | 'rectangle';
  layoutKey?: string;
  className?: string;
  label?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId = '1234567890',
  adClient = 'ca-pub-9677228569710863',
  format = 'auto',
  layoutKey,
  className = '',
  label = 'Iklan Sponsor'
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isLoadedRef = useRef(false);

  // Check if live AdSense is enabled (when a real ca-pub client is set and not on localhost)
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isRealAdClient = adClient && !adClient.includes('XXXX');

  useEffect(() => {
    if (typeof window !== 'undefined' && isRealAdClient && !isLoadedRef.current) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        isLoadedRef.current = true;
      } catch (err) {
        console.debug('AdSense push error:', err);
      }
    }
  }, [isRealAdClient]);

  // If real AdSense is ready, render official AdSense <ins> tag
  if (isRealAdClient && !isLocalhost) {
    return (
      <div className={`my-6 text-center overflow-hidden ${className}`}>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          {label}
        </p>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adClient}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
          {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        />
      </div>
    );
  }

  // Visual placeholder for development / review mode
  return (
    <div className={`my-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 text-center transition-all ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>Slot Iklan Google AdSense ({format.toUpperCase()})</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-semibold">
          Slot ID: {slotId}
        </span>
      </div>

      <div className="py-4 space-y-1">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
          [ Area Penempatan Iklan Google AdSense ]
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Iklan otomatis tayang di area ini setelah domain Anda terverifikasi oleh Google AdSense.
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] text-slate-400">
        <Info className="w-3 h-3 text-slate-400" />
        <span>Ganti ID <code className="font-mono">{adClient}</code> dengan ID Penayang asli Anda saat website live.</span>
      </div>
    </div>
  );
};
