'use client'

import { useCartStore } from '@/app/store/cartStore'
import { sendRequest } from '@/app/util/api'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'

interface ProductStockInfo {
    variantId: number;
    requestedQuantity: number;
    availableStock: number;
    available: boolean;
    message?: string;
}

interface CartItemProps {
    item: ICartItem;
    stockStatus?: ProductStockInfo | null;
}

export function CartItem({ item, stockStatus }: CartItemProps) {
    const { updateQuantity, removeItem, addItem, fetchCart, swapVariant } = useCartStore()
    const { data: session, status } = useSession();

    // State for variant/volume selection
    const currentVariant = item.perfumeVariants;
    const product = currentVariant?.product;

    const [fullProduct, setFullProduct] = useState<IProduct | null>(null);
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);
    const [selectedType, setSelectedType] = useState<string>(currentVariant?.variantType ?? '');
    const [selectedVolume, setSelectedVolume] = useState<string>(currentVariant?.volume ?? '');
    const [isChangingVariant, setIsChangingVariant] = useState(false);

    // Fetch full product data (with all variants) from DB
    const fetchFullProduct = useCallback(async () => {
        const productId = product?.id;
        if (!productId) return;

        setIsLoadingVariants(true);
        try {
            const res = await sendRequest<IBackendRes<IProduct>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`,
                method: 'GET',
            });
            if (res?.data) {
                setFullProduct(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch product variants:', error);
        } finally {
            setIsLoadingVariants(false);
        }
    }, [product?.id]);

    useEffect(() => {
        fetchFullProduct();
    }, [fetchFullProduct]);

    const allVariants = fullProduct?.perfumeVariants ?? [];

    // Get unique variant types
    const availableTypes = [...new Set(allVariants.map(v => v.variantType).filter(Boolean))] as string[];

    // Get volumes for the selected type
    const volumesForType = allVariants.filter(v => v.variantType === selectedType);


    // Sync state when item changes externally
    useEffect(() => {
        setSelectedType(currentVariant?.variantType ?? '');
        setSelectedVolume(currentVariant?.volume ?? '');
    }, [currentVariant?.id]);

    // Handle variant change (type or volume)
    const handleVariantChange = async (newType: string, newVolume: string) => {
        const newVariant = allVariants.find(v => v.variantType === newType && v.volume === newVolume);
        if (!newVariant || !product || newVariant.id === currentVariant?.id) return;

        if ((newVariant.stockQuantity ?? 0) === 0) {
            toast.error('Dung tích này đã hết hàng!');
            // Reset selection
            setSelectedType(currentVariant?.variantType ?? '');
            setSelectedVolume(currentVariant?.volume ?? '');
            return;
        }

        setIsChangingVariant(true);
        try {
            const userId = session?.user?.username || localStorage.getItem('guestId') || '';

            // Swap variant in one atomic operation (no intermediate re-render)
            await swapVariant(userId, product, String(currentVariant?.id), newVariant, item.quantity);

            toast.success('Đã thay đổi dung tích!');
        } catch (error) {
            toast.error('Không thể thay đổi dung tích. Vui lòng thử lại.');
            // Reset selection on error
            setSelectedType(currentVariant?.variantType ?? '');
            setSelectedVolume(currentVariant?.volume ?? '');
        } finally {
            setIsChangingVariant(false);
        }
    };

    // Auto-adjust quantity if exceeds available stock
    useEffect(() => {
        if (stockStatus && !stockStatus.available && stockStatus.availableStock > 0) {
            // Only auto-adjust if stock is available but quantity is too high
            if (item.quantity > stockStatus.availableStock) {
                handleQuantityChange(stockStatus.availableStock);
            }
        }
    }, [stockStatus]);

    const handleQuantityChange = (newQuantity: number) => {
        // Prevent increasing if at or above available stock
        if (stockStatus && newQuantity > stockStatus.availableStock) {
            return;
        }

        if (session?.user?.username && item.perfumeVariants?.product) {
            updateQuantity(item.perfumeVariants?.product, newQuantity, session?.user?.username ?? '', item.perfumeVariants);
        } else {
            const guestId = localStorage.getItem('guestId') || '';
            if (!item.perfumeVariants?.product) return;
            updateQuantity(item.perfumeVariants?.product, newQuantity, guestId, item.perfumeVariants);
        }
    }

    const handleRemove = () => {
        if (session?.user?.username && item.perfumeVariants?.product) {
            removeItem(item.perfumeVariants?.product, session?.user?.username ?? '', String(item?.perfumeVariants?.id));
        } else {
            const guestId = localStorage.getItem('guestId') || '';
            if (!item.perfumeVariants?.product) return;
            removeItem(item.perfumeVariants?.product, guestId, String(item?.perfumeVariants?.id));
        }
    }

    const itemTotal = (item?.perfumeVariants?.price ?? 0) * item.quantity;

    // Determine stock status display
    const isOutOfStock = stockStatus?.availableStock === 0;
    const isLowStock = stockStatus && stockStatus.availableStock > 0 && stockStatus.availableStock < 5;
    const isOverQuantity = stockStatus && !stockStatus.available && stockStatus.availableStock > 0;
    console.log('Stock status for item:', item);
    return (
        <div className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 border-b border-gray-200 w-full ${isOutOfStock ? 'bg-red-50/50' : ''} ${isChangingVariant ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="relative w-16 h-16 flex-shrink-0 mx-auto sm:mx-0">
                <Image
                    src={`/api/image?filename=${item?.perfumeVariants?.product?.images?.[0]}`}
                    alt="Close up"
                    fill
                    className={`object-cover rounded-md ${isOutOfStock ? 'opacity-50' : ''}`} />
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
                        <span className="text-white text-xs font-bold">Hết hàng</span>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                    {item?.perfumeVariants?.product?.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">₫{(item?.perfumeVariants?.price?.toLocaleString('en-US') ?? 0)} mỗi cái</p>

                {/* Variant Type & Volume Selector */}
                {allVariants.length > 0 ? (
                    <div className="mt-2 space-y-2">
                        {/* Variant Type Selector */}
                        {availableTypes.length > 1 && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Loại</label>
                                <div className="flex gap-1.5 flex-wrap">
                                    {availableTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setSelectedType(type);
                                                // Auto-select first available volume for new type
                                                const firstVolumeForType = allVariants.find(v => v.variantType === type && (v.stockQuantity ?? 0) > 0);
                                                const newVol = firstVolumeForType?.volume ?? allVariants.find(v => v.variantType === type)?.volume ?? '';
                                                setSelectedVolume(newVol);
                                                if (newVol) {
                                                    handleVariantChange(type, newVol);
                                                }
                                            }}
                                            className={`py-1 px-3 rounded-lg font-medium text-xs transition-all duration-200
                                                ${type === selectedType
                                                    ? 'bg-gray-800 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {type === 'FULLBOTTLE' ? '🍾 Full Bottle' : '💧 Decant'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Volume Selector */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Dung tích</label>
                            <div className="flex gap-1.5 flex-wrap">
                                {volumesForType.map((variant, i) => {
                                    const isSelected = selectedVolume === variant.volume;
                                    const isVariantOutOfStock = (variant.stockQuantity ?? 0) === 0;

                                    return (
                                        <button
                                            key={i}
                                            disabled={isVariantOutOfStock}
                                            onClick={() => {
                                                if (variant.volume && variant.volume !== currentVariant?.volume) {
                                                    setSelectedVolume(variant.volume);
                                                    handleVariantChange(selectedType, variant.volume);
                                                }
                                            }}
                                            className={`relative py-1 px-3 rounded-lg font-medium text-xs transition-all duration-200
                                                ${isSelected
                                                    ? 'bg-gray-800 text-white shadow-sm ring-1 ring-gray-400'
                                                    : isVariantOutOfStock
                                                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {variant?.volume}ml
                                            {isVariantOutOfStock && (
                                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs sm:text-sm text-gray-500">Dung tích: {item?.perfumeVariants?.volume ?? 0} ml</p>
                )}

                {/* Stock Quantity Display */}
                {stockStatus && (
                    <p className={`text-xs sm:text-sm mt-0.5 font-medium ${stockStatus.availableStock === 0
                        ? 'text-gray-400'
                        : stockStatus.availableStock < 5
                            ? 'text-red-600'
                            : stockStatus.availableStock < 10
                                ? 'text-orange-600'
                                : 'text-green-600'
                        }`}>
                        {stockStatus.availableStock === 0 ? (
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Hết hàng
                            </span>
                        ) : stockStatus.availableStock < 5 ? (
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Chỉ còn {stockStatus.availableStock} trong kho!
                            </span>
                        ) : stockStatus.availableStock < 10 ? (
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Còn {stockStatus.availableStock} trong kho
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Còn {stockStatus.availableStock} trong kho
                            </span>
                        )}
                    </p>
                )}

                {/* Warning Badge for Over Quantity */}
                {isOverQuantity && (
                    <div className="mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full animate-pulse">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Vượt quá số lượng cho phép!
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={isOutOfStock}
                    className={`w-8 h-8 flex items-center justify-center border rounded text-lg transition-colors
                        ${isOutOfStock
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'border-gray-300 hover:bg-gray-50'}`}
                >
                    -
                </button>
                <span className={`w-8 text-center font-medium ${isOutOfStock ? 'text-gray-400' : ''}`}>
                    {item.quantity}
                </span>
                <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isOutOfStock || !!(stockStatus && item.quantity >= stockStatus.availableStock)}
                    className={`w-8 h-8 flex items-center justify-center border rounded text-lg transition-colors
                        ${isOutOfStock || (stockStatus && item.quantity >= stockStatus.availableStock)
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'border-gray-300 hover:bg-gray-50'}`}
                >
                    +
                </button>
            </div>

            <div className="text-right min-w-[90px] sm:min-w-[100px] mt-2 sm:mt-0">
                <p className={`font-semibold text-sm sm:text-base ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                    ₫ {itemTotal.toLocaleString('en-US')}
                </p>
                <button
                    onClick={handleRemove}
                    className="text-red-500 text-xs sm:text-sm hover:text-red-700 hover:underline mt-1"
                >
                    Remove
                </button>
            </div>
        </div>
    )
}