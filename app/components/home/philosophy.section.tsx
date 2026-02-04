'use client';
import { useLanguage } from '@/app/i18n/LanguageContext';

export default function PhilosophySection() {
  const { t } = useLanguage();
  
  return (
    <section className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
        {t('beingNatural')}
      </h2>
      <p className="text-gray-600 text-lg max-w-3xl mx-auto">
        {t('sustainableLuxury')}
      </p>
    </section>
  );
}
