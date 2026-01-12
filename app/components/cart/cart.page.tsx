"use client"
import { CartItem } from "@/app/components/cart/cart.items"
import { useCartStore } from "@/app/store/cartStore"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect } from "react"

export default function CartPage() {
    const { items, totalItems, totalPrice, hasHydrated, clearCart, fetchCart } = useCartStore();
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === "authenticated" && session?.user?.username) {
            fetchCart(session.user.username);
        } else {
            fetchCart(localStorage.getItem('guestId') || '');
        }
    }, [session?.user?.username, fetchCart]);

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
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {items && items?.map(item => (
                                    <CartItem key={item.id} item={item} />
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
                                <Link href="/checkout">
                                    <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mt-4">
                                        Proceed to Checkout
                                        <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </Link>

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
