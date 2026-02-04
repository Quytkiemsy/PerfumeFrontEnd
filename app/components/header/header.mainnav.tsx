"use client";

import { useLanguage } from '@/app/i18n/LanguageContext';
import Link from 'next/link';

export default function HeaderMainNav() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-6">
      <Link 
        href="/product?isNew=true" 
        className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors relative group"
      >
        🔥 {t('newArrivals')}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
      </Link>
      <Link 
        href="/product" 
        className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors relative group"
      >
        {t('allProducts')}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
      </Link>
    </div>
  );
}