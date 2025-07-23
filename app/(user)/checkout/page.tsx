// app/checkout/page.tsx

import CheckoutForm from "@/app/components/cart/checkout.form";

export default function CheckoutPage() {
    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Thanh toán đơn hàng</h1>
            <CheckoutForm />
        </div>
    );
}