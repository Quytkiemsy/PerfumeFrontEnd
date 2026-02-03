// app/checkout/page.tsx

import CheckoutForm from "@/app/components/cart/checkout.form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thanh Toán',
    description: 'Hoàn tất đơn hàng của bạn tại Perfume Shop. Thanh toán an toàn, bảo mật.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function CheckoutPage() {
    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Thanh toán đơn hàng</h1>
            <CheckoutForm />
        </div>
    );
}