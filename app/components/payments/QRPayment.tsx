'use client'
import React, { useState } from 'react';
import { usePaymentWebSocket } from '../hooks/usePaymentWebSocket';
import { QRPaymentRequest } from '../types/payment';
import { createQRPayment } from '@/app/util/paymentApi';

const QRPayment: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'waiting' | 'success' | 'timeout' | 'error'>('idle');
    const [paymentResult, setPaymentResult] = useState<{ amount: number; transactionId: string } | null>(null);

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

    const handleCreatePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount) {
            alert('Vui lòng nhập đủ thông tin');
            return;
        }

        setStatus('loading');

        try {
            const request: QRPaymentRequest = {
                amount: parseInt(amount)
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
        setAmount('');
        setQrCode(null);
        setPaymentId(null);
        setStatus('idle');
        setPaymentResult(null);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Thanh toán QR</h2>

            {status === 'idle' && (
                <form onSubmit={handleCreatePayment} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Số tiền (VNĐ)
                        </label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập số tiền"
                            required
                        />
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Tạo mã QR
                    </button>
                </form>
            )}

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
                        Số tiền: <span className="font-semibold">{formatCurrency(parseFloat(amount))}</span>
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
                        onClick={handleReset}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                    >
                        Tạo thanh toán mới
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
                    <button
                        onClick={handleReset}
                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
                    >
                        Thử lại
                    </button>
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
                    <button
                        onClick={handleReset}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                    >
                        Thử lại
                    </button>
                </div>
            )}
        </div>
    );
};

export default QRPayment;