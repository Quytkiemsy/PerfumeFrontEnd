"use client"
import { CartItem } from "@/app/components/cart/cart.items"
import { useCartStore } from "@/app/store/cartStore"
import { sendRequest } from "@/app/util/api"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface ProductStockInfo {
    variantId: number;
    requestedQuantity: number;
    availableStock: number;
    available: boolean;
    message?: string;
}

interface StockAvailabilityResponse {
    allAvailable: boolean;
    products: ProductStockInfo[];
}

export default function CartPage() {
    const { items, totalItems, totalPrice, hasHydrated, clearCart, fetchCart } = useCartStore();
    const { data: session, status } = useSession();
    const [stockInfo, setStockInfo] = useState<StockAvailabilityResponse | null>(null);
    const [isCheckingStock, setIsCheckingStock] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.username) {
            fetchCart(session.user.username);
        } else {
            fetchCart(localStorage.getItem('guestId') || '');
        }
    }, [session?.user?.username, fetchCart]);

    // Check stock availability when items change
    useEffect(() => {
        const checkStock = async () => {
            if (!items || items.length === 0) return;

            setIsCheckingStock(true);
            try {
                const cartItems = items.map(item => ({
                    quantity: item.quantity,
                    perfumeVariants: {
                        id: item.perfumeVariants?.id
                    }
                }));

                const res = await sendRequest<IBackendRes<StockAvailabilityResponse>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/check-stock`,
                    method: 'POST',
                    body: cartItems,
                });

                if (res && res.statusCode === 200) {
                    setStockInfo(res.data || null);
                    if (!res.data?.allAvailable) {
                        toast.error("Một số sản phẩm trong giỏ hàng đã hết hoặc không đủ số lượng!");
                    }
                }
            } catch (error) {
                console.error('Error checking stock:', error);
            } finally {
                setIsCheckingStock(false);
            }
        };

        if (hasHydrated && items.length > 0) {
            checkStock();
        }
    }, [items, hasHydrated, session?.accessToken, status]);

    // Helper function to get stock status for a variant
    const getStockStatus = (variantId: number | undefined) => {
        if (!stockInfo || !variantId) return null;
        return stockInfo.products.find(p => p.variantId === variantId);
    };

    const handleClearCart = () => {
        if (session?.user?.username) {
            clearCart(session.user.username);
        } else {
            clearCart(localStorage.getItem('guestId') || '');
        }
    }

    // Loading state cho đến khi hydration hoàn thành
    if (!hasHydrated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <header className="sticky top-0 z-10 bg-white/95 shadow-sm border-b border-gray-200 backdrop-blur-md">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors group">
                                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Store
                            </Link>
                            <div className="text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                🛒 Shopping Cart
                            </div>
                        </div>
                    </div>
                </header>
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-8 w-1/3"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-white rounded-2xl shadow-md"></div>
                                ))}
                            </div>
                            <div className="lg:col-span-1">
                                <div className="h-64 bg-white rounded-2xl shadow-md"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Empty cart
    if (items && items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <header className="sticky top-0 z-10 bg-white/95 shadow-sm border-b border-gray-200 backdrop-blur-md">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors group">
                                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Store
                            </Link>
                            <div className="text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                🛒 Shopping Cart
                            </div>
                        </div>
                    </div>
                </header>
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center py-20">
                        <div className="mb-8">
                            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <span className="text-6xl">🛒</span>
                            </div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-3">
                                Your Cart is Empty
                            </h2>
                            <p className="text-gray-600 text-lg mb-8">
                                Discover our exquisite collection and add your favorite fragrances!
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-xl shadow-lg hover:from-gray-900 hover:to-black transition-all duration-300 font-bold transform hover:scale-105 active:scale-95"
                        >
                            Start Shopping
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <header className="sticky top-0 z-10 bg-white/95 shadow-sm border-b border-gray-200 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors group">
                            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Store
                        </Link>
                        <div className="text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            🛒 Shopping Cart
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
                            Your Shopping Cart
                        </h1>
                        <p className="text-gray-600 flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-sm font-semibold text-gray-700">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={() => handleClearCart()}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 w-fit self-end sm:self-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        {/* Inline Stock Checking Indicator */}
                        <div className="relative mb-2">
                            {isCheckingStock && (
                                <div className="absolute left-0 top-0 w-full flex items-center justify-center z-10">
                                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 shadow-sm">
                                        <div className="animate-spin w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                        <span className="text-xs text-blue-700">Đang kiểm tra tồn kho...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Stock Warning Banner (giữ lại, nhưng thu nhỏ margin) */}
                        {stockInfo && !stockInfo.allAvailable && (
                            <div className="mb-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-2">
                                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-yellow-800 text-sm">Một số sản phẩm không đủ số lượng</p>
                                    <p className="text-xs text-yellow-700 mt-0.5">
                                        Vui lòng điều chỉnh số lượng hoặc xóa sản phẩm hết hàng để tiếp tục thanh toán.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {items && items?.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        stockStatus={getStockStatus(item.perfumeVariants?.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary - Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">Order Summary</h2>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Items Count */}
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <span className="text-gray-600">Items ({totalItems})</span>
                                    <span className="font-semibold text-gray-900">₫ {totalPrice?.toLocaleString('en-US')}</span>
                                </div>

                                {/* Shipping */}
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>

                                {/* Promo Code */}
                                <div className="pb-4 border-b border-gray-100">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Promo code"
                                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                                        />
                                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm">
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                        ₫ {totalPrice?.toLocaleString('en-US')}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                {stockInfo && !stockInfo.allAvailable ? (
                                    <div className="mt-4">
                                        <button
                                            disabled
                                            className="w-full bg-gray-400 text-white py-4 px-6 rounded-xl text-lg font-bold cursor-not-allowed opacity-70"
                                        >
                                            Không thể thanh toán
                                        </button>
                                        <p className="text-center text-sm text-red-600 mt-2">
                                            Vui lòng điều chỉnh giỏ hàng trước khi thanh toán
                                        </p>
                                    </div>
                                ) : (
                                    <Link href="/checkout">
                                        <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mt-4">
                                            Proceed to Checkout
                                            <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    </Link>
                                )}

                                {/* Security Badge */}
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Secure Checkout
                                </div>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-xl">✨</span>
                                Benefits
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Free shipping on all orders
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    30-day return guarantee
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Authentic products guaranteed
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
