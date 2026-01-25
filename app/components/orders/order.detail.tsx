'use client';

import { sendRequest } from '@/app/util/api';
import { orderApi } from '@/app/util/orderApi';
import {
    AlertCircle,
    ArrowBigRightDash,
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Mail,
    MapPin,
    Package,
    Phone,
    Replace,
    Truck,
    User,
    XCircle
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLoading } from '@/app/components/hooks/LoadingProvider';

interface IOrderProps {
    order: IOrder;
}

const OrderDetailPage: React.FC<IOrderProps> = ({ order }: IOrderProps) => {
    const router = useRouter();
    const [showDialog, setShowDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const { startLoading } = useLoading();
    const getStatusConfig = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon: Clock,
                    text: 'Chờ xử lý'
                };
            case 'PAID':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: CheckCircle,
                    text: 'Đã thanh toán'
                };
            case 'SHIPPING':
                return {
                    color: 'bg-purple-100 text-purple-800 border-purple-200',
                    icon: Truck,
                    text: 'Đang giao hàng'
                };
            case 'DELIVERED':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: CheckCircle,
                    text: 'Đã giao hàng'
                };
            case 'CANCELLED':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: XCircle,
                    text: 'Đã hủy'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: AlertCircle,
                    text: status
                };
        }
    };

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case 'credit_card':
                return 'Thẻ tín dụng';
            case 'bank_transfer':
                return 'Chuyển khoản ngân hàng';
            case 'cash_on_delivery':
                return 'Thanh toán khi nhận hàng';
            case 'e_wallet':
                return 'Ví điện tử';
            default:
                return method;
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;


    const handleChangePayment = (order: IOrder) => {
        setOrderId(order.id);
        setPaymentMethod(order.paymentMethod);
        setShowDialog(true);
    };

    const confirmChangePayment = async () => {
        if (orderId != null) {

            // call api to save the product
            const res = await sendRequest<IBackendRes<IOrder>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
                method: 'PUT',
                body: {
                    id: orderId,
                    paymentMethod: paymentMethod === 'BANK' ? 'COD' : 'BANK'
                }
            });
            setShowDialog(false);
            setOrderId(null);
            if (res.error as any) {
                toast.error(res.message);
                return;
            } else {
                toast.success("Change phương thức thanh toán sản phẩm thành công");
                // refresh list data
                router.refresh()
            }
        }
    };

    const cancelChangePayment = () => {
        setShowDialog(false);
        setOrderId(null);
    };


    const handleCancelOrder = (order: IOrder) => {
        setOrderId(order.id);
        setShowCancelDialog(true);
    };

    const confirmCancelOrder = async () => {
        if (orderId != null) {
            try {
                // Use cancelOrderNew API - restores stock automatically
                const res = await orderApi.cancelOrderNew(orderId);
                
                setShowCancelDialog(false);
                setOrderId(null);
                
                if (res.error) {
                    toast.error(res.message || "Có lỗi xảy ra khi hủy đơn hàng");
                    return;
                }
                
                toast.success("Hủy đơn hàng thành công! Số lượng sản phẩm đã được hoàn lại.");
                // refresh list data
                router.refresh();
            } catch (error) {
                console.error('Error cancelling order:', error);
                toast.error("Có lỗi xảy ra khi hủy đơn hàng");
                setShowCancelDialog(false);
                setOrderId(null);
            }
        }
    };

    const cancelDialog = () => {
        setShowCancelDialog(false);
        setOrderId(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Chi tiết đơn hàng
                            </h1>
                            <p className="text-sm text-gray-500">Thông tin chi tiết về đơn hàng #{order.id}</p>
                        </div>
                    </div>
                </div>

                {/* Order Status & Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-indigo-100 p-3 rounded-xl">
                                <Package className="h-8 w-8 text-indigo-600" />
                            </div>
                            <div>
                                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusConfig.color} mb-2`}>
                                    <StatusIcon className="h-4 w-4 mr-2" />
                                    {statusConfig.text}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>Đặt hàng vào {formatDate(order.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
                            <p className="text-3xl font-bold text-indigo-600">{formatPrice(order.totalPrice)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-600">Khách hàng</p>
                                <p className="font-medium">{order?.user?.username}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 col-span-2">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                            <p className="font-medium">{getPaymentMethodText(order.paymentMethod)}</p>
                            <button
                                onClick={() => handleChangePayment(order)}
                                className="flex items-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full"
                            >
                                <Replace className="w-5 h-5" />
                                <span>{order.paymentMethod === 'BANK' ? 'COD' : 'BANK'}</span>
                            </button>
                            {
                                order.paymentMethod === 'BANK' && order.status === 'PENDING' && (
                                    <button
                                        onClick={() => {
                                            // đợi 3 giây trước khi chuyển hướng
                                            startLoading();
                                            setTimeout(() => {
                                                router.push(`/qr/${order.id}`)
                                            }, 3000);
                                        }}
                                        className="flex items-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full"
                                    >
                                        <ArrowBigRightDash className="w-5 h-5" />
                                        <span>Đi đến thanh toán</span>
                                    </button>
                                )
                            }
                        </div>
                        <div className="flex items-center space-x-3">
                            <Package className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-600">Số lượng sản phẩm</p>
                                <p className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Sản phẩm đã đặt</h3>
                            <div className="space-y-6">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                        {item?.perfumeVariants?.product?.images && (
                                            <Image
                                                src={`/api/image?filename=${item?.perfumeVariants?.product?.images?.[0]}`}
                                                alt={item?.perfumeVariants?.product?.name ?? 'Sản phẩm không xác định'}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-lg object-cover" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 mb-2">
                                                {item?.perfumeVariants?.product?.name || 'Sản phẩm không xác định'}
                                            </h4>
                                            {item?.perfumeVariants?.product?.description && (
                                                <p className="text-sm text-gray-600 mb-3">{item?.perfumeVariants?.product?.description}</p>
                                            )}

                                            <div className="space-y-2">
                                                {item?.perfumeVariants && (

                                                    <div key={item?.perfumeVariants.id} className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="px-2 py-1 bg-white rounded text-xs font-medium">
                                                                {item?.perfumeVariants?.variantType}
                                                            </span>
                                                            <span className="text-gray-600">{item?.perfumeVariants.volume}ml</span>
                                                        </div>
                                                        <span className="font-medium">{formatPrice(item?.perfumeVariants.price as number)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                                                <span className="text-sm text-gray-600">
                                                    Số lượng: <span className="font-medium">{item.quantity}</span>
                                                </span>
                                                <span className="text-lg font-bold text-indigo-600">
                                                    {formatPrice(item.perfumeVariants ? (item.perfumeVariants.price ?? 0) * item.quantity : 0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {
                            order?.status === 'PENDING' && (
                                <div className='flex justify-center'>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="m-3 "
                                        onClick={() => handleCancelOrder(order)}
                                    >
                                        Hủy đơn hàng
                                    </Button>
                                </div>
                            )
                        }
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                                Thông tin giao hàng
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Họ và tên</p>
                                    <p className="font-medium text-gray-900">{order.shippingInfo.fullName}</p>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-600">Số điện thoại</p>
                                        <p className="font-medium text-gray-900">{order.shippingInfo.phoneNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900">{order.shippingInfo.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Địa chỉ giao hàng</p>
                                    <p className="font-medium text-gray-900">{order.shippingInfo.address}</p>
                                </div>

                                {order.shippingInfo.note && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Ghi chú</p>
                                        <p className="font-medium text-gray-900 italic bg-yellow-50 p-3 rounded-lg">
                                            "{order.shippingInfo.note}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Tóm tắt đơn hàng</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tạm tính</span>
                                    <span className="font-medium">{formatPrice(order.totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Phí vận chuyển</span>
                                    <span className="font-medium text-green-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Giảm giá</span>
                                    <span className="font-medium">-₫0</span>
                                </div>
                                <hr className="my-3" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Tổng cộng</span>
                                    <span className="text-indigo-600">{formatPrice(order.totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Confirm Dialog */}
            <Dialog open={showDialog} onOpenChange={cancelChangePayment}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Xác nhận THAY ĐỔI phương thức thanh toán</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn thay đổi phương thức thanh toán không?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={cancelChangePayment}>Hủy</Button>
                        <Button variant="destructive" onClick={confirmChangePayment}>Xác nhận</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/*  Cancel Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={cancelDialog}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Xác nhận HỦY đơn hàng</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn hủy đơn hàng này không?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={cancelDialog}>Hủy</Button>
                        <Button variant="destructive" onClick={confirmCancelOrder}>Xác nhận</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrderDetailPage;