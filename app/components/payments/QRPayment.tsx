'use client'
import React, { useEffect, useState } from 'react';
import { usePaymentWebSocket } from '../hooks/usePaymentWebSocket';
import { QRPaymentRequest } from '../types/payment';
import { createQRPayment } from '@/app/util/paymentApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/components/hooks/LoadingProvider';

const QRPayment: React.FC<{ order: IOrder }> = ({ order }) => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'waiting' | 'success' | 'timeout' | 'error'>('idle');
    const [paymentResult, setPaymentResult] = useState<{ amount: number; transactionId: string } | null>(null);
    const router = useRouter();
    const { startLoading } = useLoading();

    const { isConnected } = usePaymentWebSocket({
        paymentId,
        onPaymentSuccess: (data) => {
            setStatus('success');
            setPaymentResult(data);
        },
        onPaymentTimeout: () => {
            setStatus('timeout');
        },
        onConnected: () => {
            console.log('Connected to payment WebSocket');
        }
    });

    const handleCreatePayment = async () => {

        if (!order.totalPrice) {
            toast.error('Số tiền không chính xác vui lòng kiểm tra lại !!!');
            return;
        }

        setStatus('loading');

        try {
            const request: QRPaymentRequest = {
                amount: parseInt(order.totalPrice.toString(), 10),
                orderId: order.id
            };

            const response = await createQRPayment(request);

            setQrCode(response.qrCode);
            setPaymentId(response.paymentId);
            setStatus('waiting');

        } catch (error: any) {
            console.error('Error creating payment:', error);
            setStatus('error');
            toast.error(error.message);
            router.push("/my-orders");
        }
    };

    const handleReset = () => {
        setQrCode(null);
        setPaymentId(null);
        setStatus('idle');
        setPaymentResult(null);
    };

    const handleRedirect = () => {
        // Reset state and redirect to the orders page
        handleReset();
        startLoading();
        setTimeout(() => {
            router.push("/my-orders");
        }, 3000);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    useEffect(() => {
        handleCreatePayment();
    }, [order.totalPrice])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-lg mx-auto">
                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <h2 className="text-3xl font-bold text-white text-center tracking-tight">
                            Thanh toán QR
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Loading State */}
                        {status === 'loading' && (
                            <div className="text-center py-12">
                                <div className="relative inline-flex">
                                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
                                </div>
                                <p className="mt-6 text-gray-600 font-medium">Đang tạo mã QR...</p>
                            </div>
                        )}

                        {/* Waiting State */}
                        {status === 'waiting' && qrCode && (
                            <div className="text-center space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Quét mã QR để thanh toán
                                </h3>

                                {/* QR Code Container */}
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                                    <div className="relative bg-white p-6 rounded-2xl shadow-lg">
                                        <img
                                            src={qrCode}
                                            alt="QR Code"
                                            className="w-64 h-64 mx-auto rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Amount Info */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
                                    <p className="text-sm text-gray-600 mb-1">Số tiền thanh toán</p>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {formatCurrency(parseFloat(order.totalPrice.toString()))}
                                    </p>
                                </div>

                                {/* Status Indicator */}
                                <div className="flex items-center justify-center space-x-3 bg-blue-50 rounded-full px-6 py-3">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-400"></div>
                                    </div>
                                    <p className="text-sm font-medium text-blue-700">
                                        {isConnected ? 'Đang chờ thanh toán...' : 'Đang kết nối...'}
                                    </p>
                                </div>

                                {/* Timer Warning */}
                                <div className="flex items-center justify-center space-x-2 text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-xs">Sẽ tự động hủy sau 5 phút</p>
                                </div>
                            </div>
                        )}

                        {/* Success State */}
                        {status === 'success' && paymentResult && (
                            <div className="text-center space-y-6 py-8">
                                <div className="relative inline-flex">
                                    <div className="absolute inset-0 bg-green-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                                    <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-4">
                                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                                        Thanh toán thành công!
                                    </h3>
                                    <p className="text-gray-500 text-sm">Giao dịch đã được xác nhận</p>
                                </div>

                                {/* Transaction Details */}
                                <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-left">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                        <span className="text-sm text-gray-600">Số tiền</span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {formatCurrency(paymentResult.amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Mã giao dịch</span>
                                        <span className="text-sm font-mono font-semibold text-gray-900">
                                            {paymentResult.transactionId}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRedirect}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200"
                                >
                                    Về trang Orders
                                </button>
                            </div>
                        )}

                        {/* Timeout State */}
                        {status === 'timeout' && (
                            <div className="text-center space-y-6 py-8">
                                <div className="relative inline-flex">
                                    <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-50"></div>
                                    <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4">
                                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-yellow-600 mb-2">
                                        Hết thời gian chờ
                                    </h3>
                                    <p className="text-gray-600">
                                        Thanh toán đã quá thời gian cho phép (5 phút)
                                    </p>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                    <p className="text-sm text-yellow-800">
                                        Vui lòng thử lại hoặc chọn phương thức thanh toán khác
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {status === 'error' && (
                            <div className="text-center space-y-6 py-8">
                                <div className="relative inline-flex">
                                    <div className="absolute inset-0 bg-red-200 rounded-full blur-2xl opacity-50"></div>
                                    <div className="relative bg-gradient-to-br from-red-400 to-rose-500 rounded-full p-4">
                                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-red-600 mb-2">
                                        Có lỗi xảy ra
                                    </h3>
                                    <p className="text-gray-600">
                                        Không thể tạo mã QR thanh toán
                                    </p>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <p className="text-sm text-red-800">
                                        Vui lòng kiểm tra kết nối và thử lại
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRPayment;


