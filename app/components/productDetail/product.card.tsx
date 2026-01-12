// components/ProductCard.tsx
'use client';
import { formatPrice, getMinPrice } from "@/app/util/api";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Link href={`/product/${product.id}`}>
            <div className="h-full relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                {/* Badge Container */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                    {product.new && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg animate-pulse">
                            🔥 NEW
                        </span>
                    )}
                    {product.tier && (
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-md">
                            ⭐ {product.tier}
                        </span>
                    )}
                </div>

                {/* Product Image */}
                <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    <Image
                        src={`/api/image?filename=${product?.images[0]}`}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Quick view badge */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-bold text-gray-800 shadow-xl flex items-center gap-2">
                            👁️ Quick View
                        </span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-5 space-y-3">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] group-hover:text-gray-700 transition-colors">
                        {product.name}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                        {product.brand?.name && (
                            <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200">
                                🏷️ {product.brand.name}
                            </span>
                        )}
                        {product.sex && (
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold border border-blue-200">
                                {product.sex === 'MALE' ? '👨' : product.sex === 'FEMALE' ? '👩' : '👥'} {product.sex}
                            </span>
                        )}
                        {product.fragranceTypes?.name && (
                            <span className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold border border-purple-200">
                                🌸 {product.fragranceTypes.name}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                        {product.description || 'Discover this exquisite fragrance...'}
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-100 pt-3">
                        {/* Price & Variants */}
                        <div className="flex items-end justify-between mb-2">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Starting from</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    {product.perfumeVariants ? formatPrice(getMinPrice(product.perfumeVariants)) : '0'}đ
                                </p>
                            </div>
                            {product.perfumeVariants && product.perfumeVariants.length > 0 && (
                                <div className="text-right">
                                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 rounded-lg">
                                        <p className="text-xs font-bold text-gray-700">
                                            {product.perfumeVariants.length} variants
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Volumes */}
                        {product?.perfumeVariants && product.perfumeVariants.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-500 font-medium">Sizes:</span>
                                {product.perfumeVariants
                                    .map((v) => v.volume)
                                    .filter((value, index, self) => value && self.indexOf(value) === index)
                                    .slice(0, 4)
                                    .map((volume, idx) => (
                                        <span 
                                            key={idx}
                                            className="bg-white border border-gray-300 text-gray-700 px-2 py-0.5 rounded-md text-xs font-semibold"
                                        >
                                            {volume}ml
                                        </span>
                                    ))}
                                {product.perfumeVariants.length > 4 && (
                                    <span className="text-xs text-gray-500 font-medium">+more</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CTA Button */}
                    <button className="w-full mt-3 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:from-gray-900 hover:to-black shadow-lg">
                        View Details →
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;