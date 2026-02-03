import CartPage from '@/app/components/cart/cart.page';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Giỏ Hàng',
    description: 'Xem và quản lý giỏ hàng của bạn tại Perfume Shop. Thanh toán dễ dàng, giao hàng nhanh chóng.',
    robots: {
        index: false,
        follow: false,
    },
};

const Page = () => {
    return (
        <CartPage />
    );
}

export default Page;
