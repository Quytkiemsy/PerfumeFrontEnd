// app/checkout/CheckoutForm.tsx
'use client';

import { useCartStore } from '@/app/store/cartStore';
import { orderApi } from '@/app/util/orderApi';
import { sendRequest } from '@/app/util/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock, CreditCard, FileText, Mail, MapPin, Package, Phone, Shield, ShoppingBag, Tag, Truck, User, ChevronDown, Home, Plus } from 'lucide-react';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface ProductStockInfo {
    variantId: number;
    requestedQuantity: number;
    availableStock: number;
    available: boolean;
    message?: string;
}

interface StockAvailabilityResponse {
    allAvailable: boolean;
    products: ProductStockInfo[];
}


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
    const router = useRouter();

    // Saved addresses state
    const [savedAddresses, setSavedAddresses] = useState<IAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [showAddressSelector, setShowAddressSelector] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    // Stock reservation states
    const [isReserved, setIsReserved] = useState(false);
    const [reservationError, setReservationError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(15 * 60); // 15 minutes in seconds
    const [isReserving, setIsReserving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReleasingReservation, setIsReleasingReservation] = useState(false);
    const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);
    const isReservedRef = useRef(false); // Track reservation state for cleanup

    // Get userId helper
    const getUserId = useCallback(() => {
        return session?.user?.username || localStorage.getItem('guestId') || '';
    }, [session?.user?.username]);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.username) {
            fetchCart(session.user.username);
        } else {
            fetchCart(localStorage.getItem('guestId') || '');
        }
    }, [session?.user?.username, fetchCart]);

    // Redirect to home if cart is empty
    useEffect(() => {
        // Skip redirect if checkout was successful
        if (isCheckoutSuccess) return;
        
        if (hasHydrated && items.length === 0) {
            toast.error('Giỏ hàng trống! Vui lòng thêm sản phẩm.');
            router.push('/');
        }
    }, [hasHydrated, items.length, router, isCheckoutSuccess]);

    // Fetch saved addresses for logged-in users
    useEffect(() => {
        const fetchAddresses = async () => {
            if (status === "authenticated" && session?.accessToken) {
                setIsLoadingAddresses(true);
                try {
                    const res = await sendRequest<IBackendRes<IAddress[]>>({
                        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses`,
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${session.accessToken}`
                        }
                    });
                    
                    if (res.data && Array.isArray(res.data)) {
                        setSavedAddresses(res.data);
                        
                        // Auto-select default address if exists
                        const defaultAddress = res.data.find(addr => addr.isDefault);
                        if (defaultAddress) {
                            // Set state directly instead of calling handleSelectAddress to avoid toast during initial load
                            setSelectedAddressId(defaultAddress.id);
                            setFormData(prev => ({
                                ...prev,
                                fullName: defaultAddress.fullName,
                                phone: defaultAddress.phone,
                                email: defaultAddress.email || '',
                                address: `${defaultAddress.addressDetail}${defaultAddress.ward ? ', ' + defaultAddress.ward : ''}${defaultAddress.district ? ', ' + defaultAddress.district : ''}${defaultAddress.province ? ', ' + defaultAddress.province : ''}`,
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                } finally {
                    setIsLoadingAddresses(false);
                }
            }
        };

        fetchAddresses();
    }, [status, session?.accessToken]);

    // Handle selecting a saved address
    const handleSelectAddress = (address: IAddress) => {
        setSelectedAddressId(address.id);
        setFormData(prev => ({
            ...prev,
            fullName: address.fullName,
            phone: address.phone,
            email: address.email || '',
            address: `${address.addressDetail}${address.ward ? ', ' + address.ward : ''}${address.district ? ', ' + address.district : ''}${address.province ? ', ' + address.province : ''}`,
        }));
        setShowAddressSelector(false);
        toast.success('Đã chọn địa chỉ giao hàng');
    };

    // Clear selected address and form
    const handleClearAddress = () => {
        setSelectedAddressId(null);
        setFormData(prev => ({
            ...prev,
            fullName: '',
            phone: '',
            address: '',
        }));
    };

    // Reserve stock when entering checkout page
    useEffect(() => {
        const reserveStock = async () => {
            if (!items || items.length === 0 || isReserved || isReserving) return;

            setIsReserving(true);
            setReservationError(null);

            try {
                const userId = getUserId();
                const cartItems = items.map(item => ({
                    quantity: item.quantity,
                    perfumeVariants: {
                        id: item.perfumeVariants?.id
                    }
                }));

                // Use orderApi for reserve stock
                const res = await orderApi.reserveStock(
                    userId,
                    cartItems,
                );

                if (res.statusCode === 200) {
                    setIsReserved(true);
                    isReservedRef.current = true;
                    setCountdown(30); // Reset countdown to 15 minutes
                    toast.success("Đã giữ hàng thành công! Bạn có 15 phút để hoàn tất đơn hàng.");
                } else if (res.statusCode === 409) {
                    setReservationError("Sản phẩm vừa hết, quay lại giỏ hàng");
                    toast.error("Sản phẩm vừa hết, vui lòng quay lại giỏ hàng!");
                } else {
                    throw new Error('Failed to reserve stock');
                }
            } catch (error) {
                console.error('Error reserving stock:', error);
                setReservationError("Có lỗi xảy ra khi giữ hàng");
                toast.error("Có lỗi xảy ra khi giữ hàng!");
            } finally {
                setIsReserving(false);
            }
        };

        if (hasHydrated && items.length > 0 && !isReserved && !isReserving) {
            reserveStock();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasHydrated, items.length]);

    // Countdown timer
    useEffect(() => {
        if (isReserved && countdown > 0) {
            countdownRef.current = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }

        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        };
    }, [isReserved]);

    // Handle countdown expiration
    useEffect(() => {
        if (isReserved && countdown === 0) {
            // Time's up - release reservation
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
            
            const userId = getUserId();
            orderApi.releaseReservation(userId)
                .then(() => console.log('Reservation released due to timeout'))
                .catch(console.error);
            
            setIsReserved(false);
            isReservedRef.current = false;
            setReservationError("Thời gian giữ hàng đã hết, vui lòng thử lại");
            toast.error("Thời gian giữ hàng đã hết!");
        }
    }, [countdown, isReserved, getUserId]);

    // Release reservation on unmount
    useEffect(() => {
        const userId = getUserId();
        
        return () => {
            // Use ref to check if reservation is active (more reliable than state)
            if (isReservedRef.current) {
                // Fire and forget - release reservation using orderApi
                orderApi.releaseReservation(userId)
                    .then(() => console.log('Reservation released on unmount'))
                    .catch(console.error);
            }
        };
    }, [getUserId]);

    // Manual release reservation function
    const handleReleaseReservation = async () => {
        if (!isReserved) return;
        
        setIsReleasingReservation(true);
        try {
            const userId = getUserId();
            const res = await orderApi.releaseReservation(userId);
            
            if (res.statusCode === 200 || !res.error) {
                // Stop countdown timer
                if (countdownRef.current) {
                    clearInterval(countdownRef.current);
                }
                setIsReserved(false);
                isReservedRef.current = false;
                setCountdown(0);
                toast.success("Đã hủy giữ hàng thành công!");
                router.push('/cart');
            } else {
                toast.error("Có lỗi xảy ra khi hủy giữ hàng!");
            }
        } catch (error) {
            console.error('Error releasing reservation:', error);
            toast.error("Có lỗi xảy ra khi hủy giữ hàng!");
        } finally {
            setIsReleasingReservation(false);
        }
    };

    // Handle back to cart (with reservation release)
    const handleBackToCart = async () => {
        if (isReserved) {
            await handleReleaseReservation();
        } else {
            router.push('/cart');
        }
    };

    // Format countdown display
    const formatCountdown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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

        // Check if reservation is valid
        if (!isReserved) {
            toast.error("Vui lòng đợi hệ thống giữ hàng!");
            return;
        }

        if (countdown <= 0) {
            toast.error("Thời gian giữ hàng đã hết, vui lòng thử lại!");
            router.push('/cart');
            return;
        }

        const result = formSchema.safeParse(formData);
        if (!result.success) {
            setFormErrors(result.error.format());
            toast.error("Vui lòng kiểm tra lại thông tin!");
            return;
        }
        setFormErrors({});
        setIsSubmitting(true);

        // Xử lý submit đơn hàng với double-check và pessimistic lock
        const newOrder = {
            status: 'PENDING',
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

        try {
            // Use orderApi for creating order with double-check + pessimistic lock
            const res = await orderApi.createOrderNew(
                newOrder,
                session?.accessToken || null
            );

            if (res.statusCode === 409) {
                // Out of stock - conflict
                toast.error("Sản phẩm đã hết hàng, vui lòng quay lại giỏ hàng!");
                setIsReserved(false);
                isReservedRef.current = false;
                router.push('/cart');
                return;
            }

            if (res.error) {
                toast.error(res.message || "Lỗi khi lưu đơn hàng");
                return;
            }

            // Success - stop countdown timer
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
            setIsReserved(false); // Prevent cleanup from releasing reservation (already handled by backend)
            isReservedRef.current = false;
            setIsCheckoutSuccess(true);

            // Redirect to order confirmation page first
            if (res.data && formData.paymentMethod === 'BANK') {
                router.push(`/qr/${res.data.id}`);
            } else {
                if (session?.accessToken) {
                    router.push(`/my-orders`);
                } else if (res.data && res.data.id) {
                    router.push(`/my-orders/${res?.data.id}`);
                }
            }
            
            // Clear cart after redirect (with slight delay to ensure navigation starts)
             handleClearCart();
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error("Có lỗi xảy ra khi đặt hàng!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const shippingFee = 30000;
    const total = items.reduce((sum, item) => {
        if (!item.perfumeVariants?.product) return sum;
        return sum + ((item.perfumeVariants?.price ?? 0) * item.quantity);
    }, 0) + shippingFee;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <div className="mb-4">
                    <Button
                        variant="ghost"
                        onClick={handleBackToCart}
                        disabled={isReleasingReservation}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        {isReleasingReservation ? (
                            <>
                                <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                                <span>Đang hủy giữ hàng...</span>
                            </>
                        ) : (
                            <>
                                <ArrowLeft className="w-4 h-4" />
                                <span>Quay lại giỏ hàng</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">Thanh toán</h1>
                            <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
                        </div>

                        {/* Reservation Status */}
                        {isReserving && (
                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl">
                                <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                <span className="font-medium">Đang giữ hàng...</span>
                            </div>
                        )}

                        {isReserved && countdown > 0 && (
                            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold ${countdown <= 60
                                ? 'bg-red-50 text-red-700 animate-pulse'
                                : countdown <= 180
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'bg-green-50 text-green-700'
                                }`}>
                                <Clock className="w-5 h-5" />
                                <span>Giữ hàng: {formatCountdown(countdown)}</span>
                            </div>
                        )}

                        {reservationError && (
                            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="font-medium">{reservationError}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push('/cart')}
                                    className="ml-2 border-red-300 text-red-700 hover:bg-red-100"
                                >
                                    Quay lại giỏ hàng
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cart summary left - Sticky */}
                    <div className="lg:w-2/5 w-full">
                        <div className="sticky top-4">
                            <Card className="shadow-xl rounded-2xl overflow-hidden border-0">
                                {/* Header with gradient */}
                                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
                                    <div className="flex items-center gap-3 text-white">
                                        <ShoppingBag className="w-6 h-6" />
                                        <h2 className="text-xl font-bold">Đơn hàng của bạn</h2>
                                    </div>
                                    <p className="text-gray-300 text-sm mt-1">{items.length} sản phẩm</p>
                                </div>

                                <CardContent className="p-6">
                                    {!hasHydrated ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex gap-3 animate-pulse">
                                                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : items.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                                            <p className="text-gray-400 font-medium">Giỏ hàng trống</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                                            {items.map(item => (
                                                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                                                    <div className="relative">
                                                        <Image
                                                            src={`/api/image?filename=${item?.perfumeVariants?.product?.images?.[0]}`}
                                                            alt={item.perfumeVariants?.product?.name || 'Product'}
                                                            height={64}
                                                            width={64}
                                                            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200" />
                                                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-gray-800 line-clamp-1 text-sm">{item.perfumeVariants?.product?.name}</div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {item.perfumeVariants?.volume && (
                                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                                                    {item.perfumeVariants.volume}ml
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-sm bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent whitespace-nowrap">
                                                        {item.perfumeVariants ? (item.perfumeVariants?.price ?? 0).toLocaleString('vi-VN') : '0'}₫
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Summary */}
                                    <div className="border-t-2 border-gray-100 pt-4 mt-6 space-y-3">
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span className="font-medium">Tạm tính</span>
                                            <span className="font-semibold">{(total - shippingFee).toLocaleString('vi-VN')}₫</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Truck className="w-4 h-4" />
                                                <span className="font-medium">Phí vận chuyển</span>
                                            </div>
                                            <span className="font-semibold">{shippingFee.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                                            <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
                                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {total.toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>
                                    </div>

                                    {/* Trust badges */}
                                    <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span>Hàng chính hãng</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Shield className="w-4 h-4 text-blue-500" />
                                            <span>Thanh toán an toàn</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    {/* Checkout form right */}
                    <form onSubmit={handleSubmit} className="lg:w-3/5 w-full space-y-6">
                        {/* Shipping Information */}
                        <Card className="shadow-xl rounded-2xl overflow-hidden border-0">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
                                <div className="flex items-center gap-3 text-white">
                                    <User className="w-5 h-5" />
                                    <h2 className="text-xl font-bold">Thông tin giao hàng</h2>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-5">
                                {/* Saved Addresses Selector */}
                                {status === "authenticated" && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                <Home className="w-4 h-4" />
                                                Địa chỉ đã lưu
                                            </label>
                                            {selectedAddressId && (
                                                <button
                                                    type="button"
                                                    onClick={handleClearAddress}
                                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    Nhập địa chỉ mới
                                                </button>
                                            )}
                                        </div>
                                        
                                        {isLoadingAddresses ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                Đang tải địa chỉ...
                                            </div>
                                        ) : savedAddresses.length > 0 ? (
                                            <div className="space-y-2">
                                                {/* Collapsed View - Show selected or prompt */}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddressSelector(!showAddressSelector)}
                                                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedAddressId ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                            <MapPin className="w-5 h-5" />
                                                        </div>
                                                        <div className="text-left">
                                                            {selectedAddressId ? (
                                                                <>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {savedAddresses.find(a => a.id === selectedAddressId)?.fullName}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 line-clamp-1">
                                                                        {savedAddresses.find(a => a.id === selectedAddressId)?.addressDetail}
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p className="text-sm font-medium text-gray-700">Chọn địa chỉ giao hàng</p>
                                                                    <p className="text-xs text-gray-500">Bạn có {savedAddresses.length} địa chỉ đã lưu</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showAddressSelector ? 'rotate-180' : ''}`} />
                                                </button>

                                                {/* Expanded View - Address List */}
                                                {showAddressSelector && (
                                                    <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                                                        {savedAddresses.map((address) => (
                                                            <button
                                                                key={address.id}
                                                                type="button"
                                                                onClick={() => handleSelectAddress(address)}
                                                                className={`w-full p-4 text-left hover:bg-blue-50 transition-colors ${
                                                                    selectedAddressId === address.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="text-sm font-semibold text-gray-900">{address.fullName}</p>
                                                                            {address.isDefault && (
                                                                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                                                                    Mặc định
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                                            {address.addressDetail}
                                                                            {address.ward && `, ${address.ward}`}
                                                                            {address.district && `, ${address.district}`}
                                                                            {address.province && `, ${address.province}`}
                                                                        </p>
                                                                    </div>
                                                                    {selectedAddressId === address.id && (
                                                                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ))}
                                                        
                                                        {/* Add new address button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                router.push('/profile/addresses');
                                                            }}
                                                            className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-blue-600"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                            <span className="text-sm font-medium">Thêm địa chỉ mới</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-gray-50 rounded-xl text-center">
                                                <p className="text-sm text-gray-500 mb-2">Bạn chưa có địa chỉ nào được lưu</p>
                                                <button
                                                    type="button"
                                                    onClick={() => router.push('/profile/addresses')}
                                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Thêm địa chỉ mới
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* Divider */}
                                        <div className="relative py-2">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-xs">
                                                <span className="px-2 bg-white text-gray-500">hoặc nhập thông tin bên dưới</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <User className="w-4 h-4" />
                                            Họ và tên
                                        </label>
                                        <Input
                                            placeholder="Nhập họ và tên"
                                            name="fullName"
                                            value={formData.fullName || ''}
                                            onChange={handleChange}
                                            className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {formErrors?.fullName?._errors?.[0] && (
                                            <p className="text-xs text-red-600 flex items-center gap-1">
                                                <span>⚠️</span> {formErrors.fullName._errors[0]}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <Phone className="w-4 h-4" />
                                            Số điện thoại
                                        </label>
                                        <Input
                                            placeholder="Nhập số điện thoại"
                                            name="phone"
                                            value={formData.phone || ''}
                                            onChange={handleChange}
                                            className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {formErrors?.phone?._errors?.[0] && (
                                            <p className="text-xs text-red-600 flex items-center gap-1">
                                                <span>⚠️</span> {formErrors.phone._errors[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Mail className="w-4 h-4" />
                                        Email <span className="text-gray-400 text-xs font-normal">(không bắt buộc)</span>
                                    </label>
                                    <Input
                                        placeholder="your@email.com"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        type="email"
                                        className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {formErrors?.email?._errors?.[0] && (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <span>⚠️</span> {formErrors.email._errors[0]}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <MapPin className="w-4 h-4" />
                                        Địa chỉ nhận hàng
                                    </label>
                                    <Input
                                        placeholder="Số nhà, đường, phường, quận, thành phố"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {formErrors?.address?._errors?.[0] && (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <span>⚠️</span> {formErrors.address._errors[0]}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <FileText className="w-4 h-4" />
                                        Ghi chú <span className="text-gray-400 text-xs font-normal">(nếu có)</span>
                                    </label>
                                    <Input
                                        placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                                        name="note"
                                        value={formData.note || ''}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment & Shipping Methods */}
                        <Card className="shadow-xl rounded-2xl overflow-hidden border-0">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5">
                                <div className="flex items-center gap-3 text-white">
                                    <CreditCard className="w-5 h-5" />
                                    <h2 className="text-xl font-bold">Phương thức giao hàng & thanh toán</h2>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <Truck className="w-4 h-4" />
                                            Phương thức giao hàng
                                        </label>
                                        <select
                                            name="shippingMethod"
                                            value={formData.shippingMethod}
                                            onChange={handleChange}
                                            className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300"
                                        >
                                            <option value="STANDARD">🚚 Giao tiêu chuẩn (3-5 ngày)</option>
                                            <option value="EXPRESS">⚡ Giao nhanh (1-2 ngày)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <CreditCard className="w-4 h-4" />
                                            Hình thức thanh toán
                                        </label>
                                        <select
                                            name="paymentMethod"
                                            value={formData.paymentMethod}
                                            onChange={handleChange}
                                            className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300"
                                        >
                                            <option value="COD">💵 Thanh toán khi nhận hàng (COD)</option>
                                            <option value="BANK">🏦 Chuyển khoản ngân hàng</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Tag className="w-4 h-4" />
                                        Mã giảm giá <span className="text-gray-400 text-xs font-normal">(nếu có)</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Nhập mã giảm giá"
                                            name="promoCode"
                                            value={formData.promoCode || ''}
                                            onChange={handleChange}
                                            className="h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                        />
                                        <Button type="button" variant="outline" className="h-12 px-6 rounded-xl border-2 hover:bg-purple-50 hover:border-purple-500 transition-all duration-300">
                                            Áp dụng
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={!isReserved || isSubmitting || countdown <= 0 || !!reservationError}
                            className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Xác nhận đơn hàng
                                </>
                            )}
                        </Button>

                        {/* Security Notice */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                            <Shield className="w-4 h-4" />
                            <span>Thông tin của bạn được bảo mật và mã hóa</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

