"use client";

import { useLanguage } from '@/app/i18n/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
        <svg 
          className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 border border-gray-100 z-50">
        <button
          onClick={() => setLanguage('vi')}
          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg ${
            language === 'vi' ? 'bg-gray-50 font-semibold text-gray-900' : 'text-gray-700'
          }`}
        >
          🇻🇳 Tiếng Việt
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors last:rounded-b-lg ${
            language === 'en' ? 'bg-gray-50 font-semibold text-gray-900' : 'text-gray-700'
          }`}
        >
          🇬🇧 English
        </button>
      </div>
    </div>
  );
}