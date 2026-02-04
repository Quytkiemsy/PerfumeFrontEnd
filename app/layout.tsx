
import { LoadingProvider } from '@/app/components/hooks/LoadingProvider';
import NextAuthWrapper from '@/app/lib/next.auth.wrapper';
import SessionErrorHandler from '@/app/lib/session.error';
import { LanguageProvider } from '@/app/i18n/LanguageContext';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import type { Metadata, Viewport } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourperfumeshop.com';

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: 'Perfume Shop - Nước Hoa Chính Hãng Cao Cấp',
        template: '%s | Perfume Shop',
    },
    description: 'Cửa hàng nước hoa chính hãng cao cấp hàng đầu Việt Nam. Đa dạng thương hiệu nổi tiếng: Chanel, Dior, Tom Ford, Versace, Calvin Klein. Cam kết 100% chính hãng, giá tốt nhất.',
    keywords: [
        'nước hoa',
        'nước hoa chính hãng',
        'nước hoa nam',
        'nước hoa nữ',
        'perfume',
        'nước hoa cao cấp',
        'Chanel',
        'Dior',
        'Tom Ford',
        'Versace',
        'Calvin Klein',
        'nước hoa unisex',
        'nước hoa luxury',
    ],
    authors: [{ name: 'Perfume Shop' }],
    creator: 'Perfume Shop',
    publisher: 'Perfume Shop',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'vi_VN',
        url: BASE_URL,
        siteName: 'Perfume Shop',
        title: 'Perfume Shop - Nước Hoa Chính Hãng Cao Cấp',
        description: 'Cửa hàng nước hoa chính hãng cao cấp hàng đầu Việt Nam. Đa dạng thương hiệu nổi tiếng: Chanel, Dior, Tom Ford, Versace.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Perfume Shop - Nước Hoa Chính Hãng',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Perfume Shop - Nước Hoa Chính Hãng Cao Cấp',
        description: 'Cửa hàng nước hoa chính hãng cao cấp hàng đầu Việt Nam.',
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: BASE_URL,
    },
    manifest: '/manifest.json',
    icons: {
        icon: '/icons/icon.svg',
        shortcut: '/icons/icon.svg',
        apple: '/icons/icon.svg',
    },
    verification: {
        google: 'your-google-verification-code', // Replace với code từ Google Search Console
        // yandex: 'your-yandex-verification-code',
        // bing: 'your-bing-verification-code',
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <html lang="vi">
            <head>
                <link rel="preconnect" href={process.env.NEXT_PUBLIC_BACKEND_URL} />
                <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_BACKEND_URL} />
            </head>
            <body>
                <NextAuthWrapper>
                    <LanguageProvider>
                        <SessionErrorHandler>
                            <Suspense fallback={
                                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Đang tải...</p>
                                    </div>
                                </div>
                            }>
                                <LoadingProvider>
                                    {children}
                                </LoadingProvider>
                            </Suspense>
                        </SessionErrorHandler>
                    </LanguageProvider>
                </NextAuthWrapper>
                <Toaster position="top-center" reverseOrder={false} />
            </body>
        </html>
    );
};



export default Layout;