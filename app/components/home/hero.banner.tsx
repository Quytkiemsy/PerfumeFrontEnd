"use client";

import { useLanguage } from '@/app/i18n/LanguageContext';
import Link from 'next/link';

export default function HeroBanner({ luxuryProduct }: { luxuryProduct: IProduct }) {
  const { t } = useLanguage();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
      <span className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-white/30 animate-pulse">
        {t('newCollection')}
      </span>
      <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl leading-tight">
        {t('notAMirage')}
      </h1>
      <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-2xl">
        {t('discoverCollection')}
      </p>
      <Link 
        href={`/product?tier=LUXURY`} 
        className="group/btn px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-2xl transform hover:scale-105 active:scale-95"
      >
        <span className="flex items-center gap-2">
          {t('exploreLuxury')}
          <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </Link>
    </div>
  );
}