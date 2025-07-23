// app/checkout/CheckoutForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/app/store/cartStore';
import { useSession } from "next-auth/react"
import Image from 'next/image'



interface FormData {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    note: string;
    shippingMethod: string;
    paymentMethod: string;
    promoCode: string;
}

export default function CheckoutForm() {
    const { items, totalItems, totalPrice, hasHydrated, clearCart, fetchCart } = useCartStore();
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        note: '',
        shippingMethod: 'standard',
        paymentMethod: 'cod',
        promoCode: ''
    });
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === "authenticated" && session?.user?.username) {
            fetchCart(session.user.username);
        } else {
            fetchCart(localStorage.getItem('guestId') || '');
        }
    }, [session?.user?.username, fetchCart]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Xử lý submit đơn hàng
        console.log('Order submitted:', formData);
    };

    const total = items.reduce((sum, item) => sum + ((item.product.perfumeVariant?.price ?? 0) * item.quantity), 0);

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Cart summary left */}
            <div className="md:w-1/3 w-full">
                <Card className="mb-4">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-bold mb-3">Đơn hàng của bạn</h2>
                        {!hasHydrated ? (
                            <div className="text-center text-gray-400 py-8">Đang tải giỏ hàng...</div>
                        ) : items.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">Giỏ hàng trống</div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {items.map(item => (
                                    <li key={item.id} className="flex items-center gap-3 py-3">
                                        <Image
                                            src={`/api/image?filename=${item?.product?.images?.[0]}`}
                                            alt="Close up"
                                            height={20}
                                            width={20}
                                            className="w-14 h-14 rounded object-cover border" />
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm line-clamp-1">{item.product.name}</div>
                                            <div className="text-xs text-gray-500">{item.product.perfumeVariant?.volume ? `Dung tích: ${item.product.perfumeVariant?.volume}ml` : ''}</div>
                                            <div className="text-xs text-gray-500">Số lượng: {item.quantity}</div>
                                        </div>
                                        <div className="font-bold text-sm text-black whitespace-nowrap">{(item.product.perfumeVariant?.price ?? 0).toLocaleString('vi-VN')}₫</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="border-t pt-3 mt-3 flex justify-between items-center">
                            <span className="font-semibold">Tổng cộng</span>
                            <span className="text-lg font-bold text-primary">{total.toLocaleString('vi-VN')}₫</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Checkout form right */}
            <form onSubmit={handleSubmit} className="md:w-2/3 w-full space-y-6">
                <Card>
                    <CardContent className="space-y-4 p-6">
                        <h2 className="text-lg font-bold mb-2">Thông tin giao hàng</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Họ và tên"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                placeholder="Số điện thoại"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                placeholder="Email (không bắt buộc)"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                className="md:col-span-2"
                            />
                            <Input
                                placeholder="Địa chỉ nhận hàng"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="md:col-span-2"
                            />
                        </div>
                        <Input
                            placeholder="Ghi chú (nếu có)"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4 p-6">
                        <h2 className="text-lg font-bold mb-2">Phương thức giao hàng & thanh toán</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold">Phương thức giao hàng</label>
                                <select
                                    name="shippingMethod"
                                    value={formData.shippingMethod}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2 mt-1"
                                >
                                    <option value="standard">Giao tiêu chuẩn</option>
                                    <option value="express">Giao nhanh</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-semibold">Hình thức thanh toán</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2 mt-1"
                                >
                                    <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                                    <option value="bank">Chuyển khoản ngân hàng</option>
                                    <option value="momo">Ví điện tử Momo</option>
                                </select>
                            </div>
                        </div>
                        <Input
                            placeholder="Mã giảm giá (nếu có)"
                            name="promoCode"
                            value={formData.promoCode}
                            onChange={handleChange}
                        />
                    </CardContent>
                </Card>

                <Button type="submit" className="w-full text-lg py-3">Xác nhận đơn hàng</Button>
            </form>
        </div>
    );
}
