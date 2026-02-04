"use client";

import { useLanguage } from '@/app/i18n/LanguageContext';
import Link from 'next/link';

export default function HeaderTopBar() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-gray-200 transition cursor-pointer">
            🌍 {t('vietnam')}
          </span>
          <Link href="#" className="hover:text-gray-200 transition hidden md:block">
            📍 {t('ourStores')}
          </Link>
          <Link href="#" className="hover:text-gray-200 transition hidden md:block">
            🌱 {t('sustainability')}
          </Link>
        </div>
        <div className="hidden lg:block text-xs">
          ✨ {t('freeShipping')}
        </div>
      </div>
    </div>
  );
}