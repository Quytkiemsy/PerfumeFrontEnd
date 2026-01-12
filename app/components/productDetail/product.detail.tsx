'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import ProductGrid from '../home/product.home';
import { useCartStore } from '@/app/store/cartStore';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface IProductDetailProps {
    product: IProduct;
    sortedProductByPrice: IProduct[];
}

export default function ProductDetail({ product, sortedProductByPrice }: IProductDetailProps) {
    const [selectVar, setSelectVar] = useState<string>('');
    const [selectedVolume, setSelectedVolume] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'description' | 'details'>('description');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const addItem = useCartStore(state => state.addItem)
    const { data: session, status } = useSession();

    const handleAddToCart = () => {
        if (!product || !selectVar || !selectedVolume) {
            toast.error('Please select a variant and size before adding to cart.');
            return;
        }
        const productCart: IProduct = {
            id: product.id,
            name: product.name,
            brand: product.brand,
            images: product.images,
            description: product.description,
            details: product.details,
            perfumeVariants: product.perfumeVariants?.filter((variant) => variant.variantType === selectVar && variant.volume === selectedVolume),
        };
        if (session?.user?.username) {
            addItem(productCart, session.user.username);
        } else {
            addItem(productCart, localStorage.getItem('guestId') || '', 1);
        }
        toast.success('Added to cart successfully!');
    }

    const selectedVariant = product?.perfumeVariants?.find(
        (variant) => variant.variantType === selectVar && variant.volume === selectedVolume
    );

    const mainImgRef = useRef<HTMLImageElement | null>(null);

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Left Side - Images Gallery */}
                        <div className="p-6 md:p-10">
                            {/* Main Image */}
                            <div className="relative aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 group shadow-lg">
                                <Image
                                    ref={mainImgRef}
                                    src={`/api/image?filename=${product?.images[selectedImageIndex] || product?.images[0]}`}
                                    alt={product?.name}
                                    fill
                                    className="object-cover transition-all duration-500 group-hover:scale-110"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Thumbnail Images */}
                            <div className="grid grid-cols-4 gap-3">
                                {product?.images?.slice(0, 4).map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg
                                            ${selectedImageIndex === index 
                                                ? 'border-gray-800 ring-2 ring-gray-400 shadow-md' 
                                                : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <Image
                                            src={`/api/image?filename=${img}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side - Product Info */}
                        <div className="p-6 md:p-10 flex flex-col">
                            {/* Brand & Name */}
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    {product?.brand?.name}
                                </p>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                    {product?.name}
                                </h1>
                                <div className="flex items-baseline gap-3">
                                    <p className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                        ₫{selectedVariant?.price?.toLocaleString('en-US') || '0'}
                                    </p>
                                    {selectedVariant && selectedVariant?.stockQuantity && selectedVariant?.stockQuantity > 0 && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                            In Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Variant Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Select Type
                                </label>
                                <div className="flex gap-3">
                                    {['FULLBOTTLE', 'DECANT'].map((variant) => (
                                        <button
                                            key={variant}
                                            onClick={() => {
                                                setSelectVar(variant);
                                                setSelectedVolume('');
                                            }}
                                            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 
                                                ${variant === selectVar
                                                    ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg scale-105'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                                                }`}
                                        >
                                            {variant === 'FULLBOTTLE' ? '🍾 Full Bottle' : '💧 Decant'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Select Size
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {product?.perfumeVariants
                                        ?.filter(v => !selectVar || v.variantType === selectVar)
                                        .map((variant, i) => {
                                            const isDisabled = selectVar && selectVar !== variant.variantType;
                                            const isSelected = selectedVolume === variant.volume;
                                            const isOutOfStock = (variant.stockQuantity ?? 0) === 0;

                                            return (
                                                <button
                                                    key={i}
                                                    disabled={isDisabled || isOutOfStock}
                                                    onClick={() => setSelectedVolume(variant.volume ?? '')}
                                                    className={`relative py-4 px-4 rounded-xl font-semibold text-sm transition-all duration-300
                                                        ${isSelected
                                                            ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg scale-105 ring-2 ring-gray-400'
                                                            : isDisabled || isOutOfStock
                                                                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                                                        }`}
                                                >
                                                    <div>{variant?.volume}ml</div>
                                                    {isOutOfStock && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-xs text-red-500 font-bold">Sold Out</span>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* Stock Info */}
                            {selectedVariant && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Available Stock:</span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {selectedVariant.stockQuantity} units
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                                className="w-full py-4 rounded-xl font-bold text-lg mb-6 transition-all duration-300 transform
                                    disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500
                                    bg-gradient-to-r from-gray-800 to-gray-900 text-white
                                    hover:from-gray-900 hover:to-black hover:shadow-2xl hover:scale-105
                                    active:scale-95"
                            >
                                {!selectedVariant 
                                    ? '🛒 Select Options to Add'
                                    : selectedVariant.stockQuantity === 0 
                                        ? '❌ Out of Stock' 
                                        : '🛒 Add to Cart'}
                            </button>

                            {/* Shipping Info */}
                            <div className="mb-6 space-y-2 p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <span className="text-xl">🚚</span>
                                    <span className="font-medium">Free express shipping</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <span className="text-xl">✅</span>
                                    <span className="font-medium">Duties and taxes guaranteed</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <span className="text-xl">📦</span>
                                    <span className="font-medium">Delivery in 3-8 business days</span>
                                </div>
                            </div>

                            {/* Tabs for Description & Details */}
                            <div className="mt-auto">
                                <div className="flex gap-2 border-b border-gray-200 mb-4">
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className={`px-6 py-3 font-semibold text-sm transition-all duration-300 border-b-2
                                            ${activeTab === 'description'
                                                ? 'border-gray-900 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Description
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`px-6 py-3 font-semibold text-sm transition-all duration-300 border-b-2
                                            ${activeTab === 'details'
                                                ? 'border-gray-900 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Details
                                    </button>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl min-h-[120px]">
                                    {activeTab === 'description' ? (
                                        <div className="text-gray-700 leading-relaxed">
                                            <p>{product?.description || 'No description available.'}</p>
                                        </div>
                                    ) : (
                                        <div className="text-gray-700 leading-relaxed">
                                            <p>{product?.details || 'No details available.'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
                    <ProductGrid sortedProductByPrice={sortedProductByPrice} />
                </div>
            </div>
        </>
    );
}

