'use client'
import React, { useEffect, useState } from 'react';
import { usePaymentWebSocket } from '../hooks/usePaymentWebSocket';
import { QRPaymentRequest } from '../types/payment';
import { createQRPayment } from '@/app/util/paymentApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const QRPayment: React.FC<{ order: IOrder }> = ({ order }) => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'waiting' | 'success' | 'timeout' | 'error'>('idle');
    const [paymentResult, setPaymentResult] = useState<{ amount: number; transactionId: string } | null>(null);
    const router = useRouter();

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

        } catch (error) {
            console.error('Error creating payment:', error);
            setStatus('error');
            alert('Có lỗi xảy ra khi tạo thanh toán');
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
        router.push("/my-orders");
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
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Thanh toán QR</h2>


            {status === 'loading' && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Đang tạo mã QR...</p>
                </div>
            )}

            {status === 'waiting' && qrCode && (
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">Quét mã QR để thanh toán</h3>
                    <img src={qrCode} alt="QR Code" className="mx-auto max-w-full h-auto" />
                    <p className="text-sm text-gray-600">
                        Số tiền: <span className="font-semibold">{formatCurrency(parseFloat(order.totalPrice.toString()))}</span>
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full"></div>
                        <p className="text-sm text-blue-600">
                            {isConnected ? 'Đang chờ thanh toán...' : 'Đang kết nối...'}
                        </p>
                    </div>
                    <p className="text-xs text-gray-500">
                        Sẽ tự động hủy sau 5 phút
                    </p>
                </div>
            )}

            {status === 'success' && paymentResult && (
                <div className="text-center space-y-4">
                    <div className="text-green-600">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-green-600">Thanh toán thành công!</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>Số tiền: <span className="font-semibold">{formatCurrency(paymentResult.amount)}</span></p>
                        <p>Mã giao dịch: <span className="font-semibold">{paymentResult.transactionId}</span></p>
                    </div>
                    <button
                        onClick={handleRedirect}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                    >
                        Về trang Orders
                    </button>
                </div>
            )}

            {status === 'timeout' && (
                <div className="text-center space-y-4">
                    <div className="text-yellow-600">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-600">Hết thời gian chờ</h3>
                    <p className="text-sm text-gray-600">
                        Thanh toán đã quá thời gian cho phép (5 phút)
                    </p>
                </div>
            )}

            {status === 'error' && (
                <div className="text-center space-y-4">
                    <div className="text-red-600">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-red-600">Có lỗi xảy ra</h3>
                    <p className="text-sm text-gray-600">
                        Không thể tạo mã QR thanh toán
                    </p>
                </div>
            )}
        </div>
    );
};

export default QRPayment;