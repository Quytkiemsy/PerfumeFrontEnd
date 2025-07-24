'use client'

import { useCartStore } from '@/app/store/cartStore'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface CartItemProps {
    item: ICartItem
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore()
    const { data: session, status } = useSession();

    const handleQuantityChange = (newQuantity: number) => {
        if (session?.user?.username && item.product) {
            updateQuantity(item.product, newQuantity, session?.user?.username ?? '');
        } else {
            const guestId = localStorage.getItem('guestId') || '';
            if (!item.product) return; // Ensure product exists before updating
            updateQuantity(item.product, newQuantity, guestId);
        }
    }

    const handleRemove = () => {
        if (session?.user?.username && item.product) {
            removeItem(item.product, session?.user?.username ?? '', String(item?.product?.perfumeVariant?.id));
        } else {
            const guestId = localStorage.getItem('guestId') || '';
            if (!item.product) return; // Ensure product exists before updating
            removeItem(item.product, guestId, String(item?.product?.perfumeVariant?.id));
        }
    }

    const itemTotal = (item?.product?.perfumeVariant?.price ?? 0) * item.quantity

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border-b border-gray-200 w-full">
            <div className="relative w-16 h-16 flex-shrink-0 mx-auto sm:mx-0">
                <Image
                    src={`/api/image?filename=${item?.product?.images?.[0]}`}
                    alt="Close up"
                    fill
                    className="object-cover rounded-md" />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item?.product?.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500">₫{(item?.product?.perfumeVariant?.price?.toLocaleString('en-US') ?? 0)} mỗi cái</p>
                <p className="text-xs sm:text-sm text-gray-500">Dung tích: {item?.product?.perfumeVariant?.volume ?? 0} ml</p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-lg"
                >
                    -
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-lg"
                >
                    +
                </button>
            </div>

            <div className="text-right min-w-[90px] sm:min-w-[100px] mt-2 sm:mt-0">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">₫ {itemTotal.toLocaleString('en-US')}</p>
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