// app/checkout/CheckoutForm.tsx
'use client';

import { useCartStore } from '@/app/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { sendRequest } from '@/app/util/api';

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

const formSchema = z.object({
    fullName: z.string().min(2, 'Vui lòng nhập họ tên'),
    phone: z.string().min(9, 'Vui lòng nhập số điện thoại hợp lệ'),
    email: z.string().email('Email không hợp lệ'),
    address: z.string().min(5, 'Vui lòng nhập địa chỉ'),
    note: z.string().optional(),
    shippingMethod: z.enum(['STANDARD', 'EXPRESS'], { errorMap: () => ({ message: 'Chọn phương thức giao hàng' }) }),
    paymentMethod: z.enum(['COD', 'BANK', 'MOMO'], { errorMap: () => ({ message: 'Chọn hình thức thanh toán' }) }),
    promoCode: z.string().optional(),
});

export default function CheckoutForm() {
    const { items, hasHydrated, fetchCart, clearCart } = useCartStore();
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        note: '',
        shippingMethod: 'STANDARD',
        paymentMethod: 'COD',
        promoCode: '',
    });
    const { data: session, status } = useSession();
    const [formErrors, setFormErrors] = useState<any>({});

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

    const handleClearCart = () => {
        if (session?.user?.username) {
            clearCart(session.user.username);
        } else {
            clearCart(localStorage.getItem('guestId') || '');
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = formSchema.safeParse(formData);
        if (!result.success) {
            setFormErrors(result.error.format());
            toast.error("Vui lòng kiểm tra lại thông tin!");
            return;
        }
        setFormErrors({});
        // Xử lý submit đơn hàng
        const newOrder = {
            status: 'PAID',
            totalPrice: items.reduce((sum, item) => {
                if (!item.perfumeVariants?.product) return sum;
                return sum + ((item.perfumeVariants?.price ?? 0) * item.quantity);
            }, 0) + shippingFee,
            user: {
                username: session?.user?.username,
            },
            shippingInfo: {
                fullName: formData.fullName,
                phoneNumber: formData.phone,
                email: formData.email,
                address: formData.address,
                note: formData.note,
            },
            items: items.map(item => ({
                quantity: item.quantity,
                totalPrice: (item.perfumeVariants?.price ?? 0) * item.quantity,
                productId: item.perfumeVariants?.product?.id,
                perfumeVariants: {
                    id: item.perfumeVariants?.id
                }

            })),
            shippingMethod: formData.shippingMethod,
            paymentMethod: formData.paymentMethod,
        };
        console.log('Order submitted:', newOrder);


        // call api to save the product
        const requestOptions: any = {
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
            method: 'POST',
            body: newOrder,
        };
        if (status === 'authenticated' && session?.accessToken) {
            requestOptions.headers = {
                'Authorization': `Bearer ${session.accessToken}`
            };
        }
        const res = await sendRequest<IBackendRes<IProduct>>(requestOptions);
        if (res.error) {
            toast.error("Lỗi khi lưu đơn hàng");
            return;
        } else {
            toast.success("Lưu đơn hàng thành công");
        }
        // Clear cart after successful order
        handleClearCart();
    };

    const shippingFee = 30000;
    const total = items.reduce((sum, item) => {
        if (!item.perfumeVariants?.product) return sum;
        return sum + ((item.perfumeVariants?.price ?? 0) * item.quantity);
    }, 0) + shippingFee;

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
                                            src={`/api/image?filename=${item?.perfumeVariants?.product?.images?.[0]}`}
                                            alt="Close up"
                                            height={20}
                                            width={20}
                                            className="w-14 h-14 rounded object-cover border" />
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm line-clamp-1">{item.perfumeVariants?.product?.name}</div>
                                            <div className="text-xs text-gray-500">{item.perfumeVariants?.volume ? `Dung tích: ${item.perfumeVariants?.volume}ml` : ''}</div>
                                            <div className="text-xs text-gray-500">Số lượng: {item.quantity}</div>
                                        </div>
                                        <div className="font-bold text-sm text-black whitespace-nowrap">
                                            {item.perfumeVariants ? (item.perfumeVariants?.price ?? 0).toLocaleString('vi-VN') : '0'}₫
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="border-t pt-3 mt-3 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Tạm tính</span>
                                <span className="text-base font-bold text-black">{(total - shippingFee).toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Phí vận chuyển</span>
                                <span className="text-base font-bold text-black">{shippingFee.toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Tổng cộng</span>
                                <span className="text-lg font-bold text-primary">{total.toLocaleString('vi-VN')}₫</span>
                            </div>
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
                            />
                            {formErrors?.fullName?._errors?.[0] && (
                                <p className="text-xs text-red-600 mt-1">{formErrors.fullName._errors[0]}</p>
                            )}
                            <Input
                                placeholder="Số điện thoại"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {formErrors?.phone?._errors?.[0] && (
                                <p className="text-xs text-red-600 mt-1">{formErrors.phone._errors[0]}</p>
                            )}
                            <Input
                                placeholder="Email (không bắt buộc)"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                className="md:col-span-2"
                            />
                            {formErrors?.email?._errors?.[0] && (
                                <p className="text-xs text-red-600 mt-1">{formErrors.email._errors[0]}</p>
                            )}
                            <Input
                                placeholder="Địa chỉ nhận hàng"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="md:col-span-2"
                            />
                            {formErrors?.address?._errors?.[0] && (
                                <p className="text-xs text-red-600 mt-1">{formErrors.address._errors[0]}</p>
                            )}
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
                                    <option value="STANDARD">Giao tiêu chuẩn</option>
                                    <option value="EXPRESS">Giao nhanh</option>
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
                                    <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                                    <option value="BANK">Chuyển khoản ngân hàng</option>
                                    <option value="MOMO">Ví điện tử Momo</option>
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
