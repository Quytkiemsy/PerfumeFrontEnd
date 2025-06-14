'use client';
import { useCartStore } from '@/app/store/cartStore';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
const CounterShoppingBar = () => {
    const { totalItems: total, hasHydrated } = useCartStore()

    if (!hasHydrated) {
        return (
            <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                    0
                </span>
            </div>
        )
    }

    return (
        <div className="relative">
            <Link href="/cart" className="flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
            </Link>
            {total > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {total > 99 ? '99+' : total}
                </span>
            )}
        </div>
    )
}

export default CounterShoppingBar;

