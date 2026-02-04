"use client";

import { useLanguage } from '@/app/i18n/LanguageContext';
import Link from 'next/link';

export default function HeaderLogo() {
  const { t } = useLanguage();

  return (
    <Link href="/" className="flex items-center justify-center flex-shrink-0">
      <div className="text-center">
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
          ✨ {t('brandName')}
        </h1>
        <p className="text-xs text-gray-500 hidden lg:block">{t('premiumFragrance')}</p>
      </div>
    </Link>
  );
}