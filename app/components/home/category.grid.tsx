'use client';
import { useLanguage } from '@/app/i18n/LanguageContext';
import Image from "next/image";
import Link from "next/link";

interface CategoryGridProps {
  menProduct: IProduct;
  womenProduct: IProduct;
  unisexProduct: IProduct;
}

const imageSizes = {
  threeCol: "(max-width: 768px) 100vw, 33vw",
};

export default function CategoryGrid({ menProduct, womenProduct, unisexProduct }: CategoryGridProps) {
  const { t } = useLanguage();
  
  return (
    <section className="max-w-7xl mx-auto px-4 pb-20">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-3">{t('shopByCategory')}</h3>
        <p className="text-gray-600">{t('findPerfectScent')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Men Category */}
        <Link href={`/product?sex=MALE`} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
          <div className="relative aspect-[3/4]">
            <Image
              src={`/api/image?filename=${menProduct?.images[0]}`}
              alt={`${menProduct?.name} - Nước hoa nam chính hãng từ ${menProduct?.brand?.name || 'thương hiệu cao cấp'}`}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes={imageSizes.threeCol}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-xs font-bold shadow-lg">
                {t('forMen')}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
              <h4 className="text-2xl font-bold mb-2">{t('mensCollection')}</h4>
              <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('boldSophisticated')}
              </p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                {t('exploreNow')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* Women Category */}
        <Link href={`/product?sex=FEMALE`} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
          <div className="relative aspect-[3/4]">
            <Image
              src={`/api/image?filename=${womenProduct?.images[0]}`}
              alt={`${womenProduct?.name} - Nước hoa nữ chính hãng từ ${womenProduct?.brand?.name || 'thương hiệu cao cấp'}`}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes={imageSizes.threeCol}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-pink-500 text-white rounded-full text-xs font-bold shadow-lg">
                {t('forWomen')}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
              <h4 className="text-2xl font-bold mb-2">{t('womensCollection')}</h4>
              <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('elegantCaptivating')}
              </p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                {t('exploreNow')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* Unisex Category */}
        <Link href={`/product?sex=UNISEX`} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
          <div className="relative aspect-[3/4]">
            <Image
              src={`/api/image?filename=${unisexProduct?.images[0]}`}
              alt={`${unisexProduct?.name} - Nước hoa unisex chính hãng từ ${unisexProduct?.brand?.name || 'thương hiệu cao cấp'}`}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes={imageSizes.threeCol}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-purple-500 text-white rounded-full text-xs font-bold shadow-lg">
                {t('forEveryone')}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
              <h4 className="text-2xl font-bold mb-2">{t('unisexCollection')}</h4>
              <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('versatileTimeless')}
              </p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                {t('exploreNow')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
