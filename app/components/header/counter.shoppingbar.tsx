'use client';
import { useCartStore } from '@/app/store/cartStore';
import { ShoppingCart } from 'lucide-react';
import { useSession } from "next-auth/react"
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Link from 'next/link';
const CounterShoppingBar = () => {
    const { totalItems: total, hasHydrated, fetchCart, setUserId } = useCartStore();
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === "authenticated" && session?.user?.username) {
            fetchCart(session.user.username);
        } else {
            let guestId = localStorage.getItem('guestId')
            if (!guestId) {
                guestId = uuidv4()
                localStorage.setItem('guestId', guestId as string)
            }
            setUserId(guestId as string)
            fetchCart(guestId as string);
        }
    }, [session?.user?.username, fetchCart]);

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

