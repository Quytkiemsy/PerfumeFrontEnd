'use client';

import Image from 'next/image';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { formatPrice, getMinPrice } from '@/app/util/api';
import Link from 'next/link';

interface IProductProps {
    sortedProductByPrice: IProduct[];
}

const imageSizes = {
    grid: "(max-width: 768px) 100vw, 25vw",
    slider: "(max-width: 768px) 100vw, 50vw"
};

export default function ProductGrid({ sortedProductByPrice }: IProductProps) {

    const [sliderRef] = useKeenSlider<HTMLDivElement>({
        slides: {
            perView: 2,
            spacing: 20,
        },
        mode: "snap",
    });

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block bg-gradient-to-b from-white to-gray-50 py-16">
                {/* Decorative divider */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-8 text-sm text-gray-500 uppercase tracking-wider">Related Products</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-3">
                            ✨ Discover Similar Fragrances
                        </h2>
                        <p className="text-gray-600 text-lg">Curated collection of exquisite perfumes just for you</p>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        {sortedProductByPrice.map((product) => (
                            <Link 
                                key={product.id} 
                                href={`/product/${product.id}`}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                                    {/* Image Container */}
                                    <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                                        <Image
                                            src={`/api/image?filename=${product?.images[0]}`}
                                            alt={product?.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes={imageSizes.grid}
                                        />
                                        {/* Overlay gradient on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        {/* Quick view badge */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-lg">
                                                👁️ View
                                            </span>
                                        </div>

                                        {/* Tier badge */}
                                        {product?.tier && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                    {product.tier}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-5 space-y-2">
                                        <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors min-h-[3rem]">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-baseline justify-between">
                                            <p className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                                {product?.perfumeVariants ? formatPrice(getMinPrice(product?.perfumeVariants)) : '0'}đ
                                            </p>
                                            <span className="text-xs text-gray-500 font-medium">From</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Show More Button */}
                    <div className="text-center">
                        <Link href={`/product`}>
                            <button className="group relative px-10 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95">
                                <span className="relative z-10 flex items-center gap-2">
                                    Explore All Products
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden bg-gradient-to-b from-white to-gray-50 py-12">
                <div className="px-4">
                    {/* Section Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
                            ✨ Similar Fragrances
                        </h2>
                        <p className="text-gray-600">Swipe to explore more</p>
                    </div>

                    {/* Slider */}
                    <div className="w-full mb-8">
                        <div ref={sliderRef} className="keen-slider">
                            {sortedProductByPrice.map((product) => (
                                <div key={product.id} className="keen-slider__slide px-2">
                                    <Link href={`/product/${product.id}`}>
                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                            {/* Image */}
                                            <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                                                <Image
                                                    src={`/api/image?filename=${product?.images[0]}`}
                                                    alt={product?.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes={imageSizes.slider}
                                                />
                                                {/* Tier badge */}
                                                {product?.tier && (
                                                    <div className="absolute top-3 left-3">
                                                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                            {product.tier}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4 space-y-2">
                                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5rem]">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-baseline justify-between">
                                                    <p className="text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                                        {product?.perfumeVariants ? formatPrice(getMinPrice(product?.perfumeVariants)) : '0'}đ
                                                    </p>
                                                    <span className="text-xs text-gray-500">From</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Show More Button */}
                    <div className="text-center">
                        <Link href={`/product`}>
                            <button className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform">
                                View All Products →
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}


