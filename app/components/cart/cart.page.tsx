"use client"
import { CartItem } from "@/app/components/cart/cart.items"
import { authOptions } from "@/app/lib/auth/authOptions"
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
        }
    }, [session?.user?.username, fetchCart]);

    // Loading state cho đến khi hydration hoàn thành
    if (!hasHydrated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
                <header className="bg-white/90 shadow-sm border-b border-gray-200 backdrop-blur">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center h-16">
                            <Link href="/" className="text-gray-700 hover:text-black font-medium transition-colors">
                                ← Back to Store
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-6"></div>
                        <div className="bg-white/80 rounded-xl p-6 shadow-md">
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                                ))}
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
            <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
                <header className="bg-white/90 shadow-sm border-b border-gray-200 backdrop-blur">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center h-16">
                            <Link href="/" className="text-gray-700 hover:text-black font-medium transition-colors">
                                ← Back to Store
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
                    <div className="text-center py-16">
                        <div className="mb-6">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
                                <span className="text-4xl text-gray-400">🛒</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
                            <p className="text-gray-500">Add some products to get started!</p>
                        </div>
                        <Link
                            href="/"
                            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg shadow hover:bg-black transition-colors font-semibold tracking-wide"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <header className="bg-white/90 shadow-sm border-b border-gray-200 backdrop-blur">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <Link href="/" className="text-gray-700 hover:text-black font-medium transition-colors">
                            ← Back to Store
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Shopping Cart <span className="text-gray-400 font-normal">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    </h1>
                    <button
                        onClick={() => clearCart(session?.user?.username ?? '')}
                        className="text-gray-500 hover:text-black font-medium hover:underline transition-colors px-2 py-1 rounded w-fit self-end sm:self-auto"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="bg-white/90 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {items && items?.map(item => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Cart Total */}
                    <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50/80">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                            <span className="text-base sm:text-lg font-medium text-gray-900">
                                Subtotal <span className="text-gray-400">({totalItems} items):</span>
                            </span>
                            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
                                ₫ {totalPrice?.toLocaleString('en-US')}
                            </span>
                        </div>

                        <button className="w-full bg-gray-900 text-white py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg font-semibold hover:bg-black transition-colors shadow">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
