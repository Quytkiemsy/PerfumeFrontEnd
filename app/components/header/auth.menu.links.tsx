"use client";

import { useLanguage } from '@/app/i18n/LanguageContext';
import Link from 'next/link';

interface AuthMenuLinksProps {
  session: any;
}

export default function AuthMenuLinks({ session }: AuthMenuLinksProps) {
  const { t } = useLanguage();

  return (
    <ul className="py-2">
      <li>
        <Link 
          href="/profile" 
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all"
        >
          <span>👤</span>
          <span className="font-medium">{t('myProfile')}</span>
        </Link>
      </li>
      <li>
        <Link 
          href="/profile/addresses" 
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all"
        >
          <span>📍</span>
          <span className="font-medium">{t('myAddresses')}</span>
        </Link>
      </li>
      <li>
        <Link 
          href="/my-orders" 
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all"
        >
          <span>📦</span>
          <span className="font-medium">{t('myOrders')}</span>
        </Link>
      </li>
      {session?.role === 'ADMIN' && (
        <li>
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-3 px-4 py-3 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            <span>⚙️</span>
            <span className="font-medium">{t('adminDashboard')}</span>
          </Link>
        </li>
      )}
    </ul>
  );
}