

'use client';

import { FaTiktok } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { useLanguage } from '@/app/i18n/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    
    return (


        <footer className="overflow-x-hidden bg-white text-black px-4 sm:px-6 md:px-8 py-12 border-t text-sm">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Các cột */}
                <div className="space-y-2">
                    <p className="font-medium">{t('aboutRef')}</p>
                    <p>{t('stores')}</p>
                    <p>{t('careers')}</p>
                    <p>{t('affiliates')}</p>
                </div>
                <div className="space-y-2">
                    <p className="font-medium">{t('faq')}</p>
                    <p>{t('contact')}</p>
                    <p>{t('sizeGuide')}</p>
                    <p>{t('eGiftCards')}</p>
                </div>
                <div className="space-y-2">
                    <p className="font-medium">{t('signIn')}</p>
                    <p>{t('returnsExchanges')}</p>
                    <p>{t('orderLookup')}</p>
                </div>
                <div className="space-y-4">
                    <p className="font-medium">{t('greatEmails')}</p>
                    <div className="flex flex-col sm:flex-row">
                        <input
                            type="email"
                            placeholder={t('giveUsEmail')}
                            className="border px-4 py-2 flex-1 min-w-0"
                        />
                        <button className="bg-black text-white px-4 py-2 font-semibold">
                            {t('signUp')}
                        </button>
                    </div>
                    <div className="flex space-x-4 mt-2 text-lg">
                        <FaTiktok />
                        <FaFacebook />
                        <FaInstagram />
                        <FaYoutube />
                    </div>
                </div>
            </div>

            <div className="mt-12 border-t pt-6 text-xs text-gray-500 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 justify-center sm:justify-between items-center">
                <p>{t('copyright')}</p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
                    <p>{t('doNotSell')}</p>
                    <p>{t('terms')}</p>
                    <p>{t('privacy')}</p>
                    <p>{t('calPrivacyNotice')}</p>
                    <p>{t('sitemap')}</p>
                    <p>{t('accessibility')}</p>
                    <p>{t('caSupplyChain')}</p>
                </div>
            </div>
        </footer>

    );
}
