'use client';

import { ArrowBigRightDash, Calendar, Captions, ChevronDown, ChevronUp, CreditCard, Eye, Mail, MapPin, Package, Phone, User } from 'lucide-react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const statusList: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPING', 'CANCELLED'];

const OrdersPage: React.FC<{ orders: IOrder[] }> = ({ orders }) => {
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const router = useRouter();

    const toggleOrderExpansion = (orderId: number) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'PAID':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'SHIPPING':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING':
                return 'Chưa thanh toán';
            case 'PAID':
                return 'Đã thanh toán';
            case 'SHIPPING':
                return 'Đang giao hàng';
            case 'DELIVERED':
                return 'Đã giao hàng';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case 'credit_card':
                return 'Thẻ tín dụng';
            case 'bank_transfer':
                return 'Chuyển khoản';
            case 'cash_on_delivery':
                return 'Thanh toán khi nhận hàng';
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

    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter(order => order.status === statusFilter);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Đơn hàng của tôi</h1>
                    <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${statusFilter === 'all'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Tất cả
                        </button>
                        {statusList.map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${statusFilter === status
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {getStatusText(status)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders && filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                            {/* Order Header */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-indigo-100 p-3 rounded-xl">
                                            <Package className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                Đơn hàng #{order.id}
                                            </h3>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(order.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                        {
                                            order.paymentMethod === 'BANK' && order.status === 'PENDING' && (
                                                <button
                                                    onClick={() => router.push(`/qr/${order.id}`)}
                                                    className="flex items-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full"
                                                >
                                                    <ArrowBigRightDash className="w-5 h-5" />
                                                    <span>Đi đến thanh toán</span>
                                                </button>
                                            )
                                        }
                                        <button
                                            onClick={() => toggleOrderExpansion(order.id)}
                                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                                        >
                                            {expandedOrders.has(order.id) ? (
                                                <ChevronUp className="h-5 w-5 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">Khách hàng:</span>
                                        <span className="font-medium">{order?.shippingInfo?.fullName}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CreditCard className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">Thanh toán:</span>
                                        <span className="font-medium">{getPaymentMethodText(order.paymentMethod)}</span>
                                    </div>
                                    {
                                        order?.transactionId && (
                                            <div className="flex items-center space-x-2">
                                                <Captions className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600">Mã thanh toán</span>
                                                <span className="font-medium">{order?.transactionId}</span>
                                            </div>
                                        )
                                    }
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600">Tổng tiền:</span>
                                        <span className="font-bold text-lg text-indigo-600">{formatPrice(order.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedOrders.has(order.id) && (
                                <div className="p-6 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Shipping Info */}
                                        <div className="bg-white rounded-lg p-6 shadow-sm">
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                                                Thông tin giao hàng
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Họ tên:</span>
                                                    <span className="ml-2 font-medium">{order.shippingInfo.fullName}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="h-4 w-4 text-gray-400 mr-1" />
                                                    <span className="text-gray-600">SĐT:</span>
                                                    <span className="ml-2 font-medium">{order.shippingInfo.phoneNumber}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Mail className="h-4 w-4 text-gray-400 mr-1" />
                                                    <span className="text-gray-600">Email:</span>
                                                    <span className="ml-2 font-medium">{order.shippingInfo.email}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Địa chỉ:</span>
                                                    <p className="mt-1 font-medium">{order.shippingInfo.address}</p>
                                                </div>
                                                {order.shippingInfo.note && (
                                                    <div>
                                                        <span className="text-gray-600">Ghi chú:</span>
                                                        <p className="mt-1 font-medium italic">{order.shippingInfo.note}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="bg-white rounded-lg p-6 shadow-sm">
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                <Eye className="h-5 w-5 text-indigo-600 mr-2" />
                                                Sản phẩm đã đặt
                                            </h4>
                                            <div className="space-y-4">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                                        {item?.perfumeVariants && (
                                                            <Image
                                                                src={`/api/image?filename=${item?.perfumeVariants?.product?.images?.[0]}`}
                                                                alt={item?.perfumeVariants?.product?.name ?? 'Sản phẩm không xác định'}
                                                                width={40}
                                                                height={40}
                                                                className="w-10 h-10 rounded-lg object-cover" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-medium text-gray-900 truncate">
                                                                {item?.perfumeVariants?.product?.name || 'Sản phẩm không xác định'}
                                                            </h5>
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                {item?.perfumeVariants &&
                                                                    <div key={item?.perfumeVariants?.id}>
                                                                        {item?.perfumeVariants?.variantType} - {item?.perfumeVariants?.volume}ml
                                                                    </div>
                                                                }
                                                            </div>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <span className="text-sm text-gray-600">
                                                                    Số lượng: {item.quantity}
                                                                </span>
                                                                <span className="font-semibold text-indigo-600">
                                                                    {formatPrice(item.perfumeVariants ? (item.perfumeVariants.price ?? 0) * item.quantity : 0)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredOrders && filteredOrders.length === 0 && (
                    <div className="text-center py-16">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Không có đơn hàng nào</h3>
                        <p className="text-gray-600">Bạn chưa có đơn hàng nào với trạng thái này.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;