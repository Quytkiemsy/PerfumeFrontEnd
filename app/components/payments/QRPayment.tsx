'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { usePaymentWebSocket } from '../hooks/usePaymentWebSocket';
import { QRPaymentRequest } from '../types/payment';
import { createQRPayment } from '@/app/util/paymentApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/components/hooks/LoadingProvider';

interface BankInfo {
    bankName?: string;
    accountName?: string;
    accountNo?: string;
    bankCode?: string;
    message?: string;
}

const QRPayment: React.FC<{ order: IOrder }> = ({ order }) => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'waiting' | 'success' | 'timeout' | 'error' | 'failed'>('idle');
    const [paymentResult, setPaymentResult] = useState<{ amount: number; transactionId: string } | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(5 * 60); // 5 minutes in seconds
    const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
    const router = useRouter();
    const { startLoading } = useLoading();

    const { isConnected, connectionStatus } = usePaymentWebSocket({
        paymentId,
        onPaymentSuccess: (data) => {
            setStatus('success');
            setPaymentResult(data);
            toast.success('Thanh toán thành công!');
        },
        onPaymentTimeout: () => {
            setStatus('timeout');
            toast.error('Hết thời gian thanh toán!');
        },
        onPaymentFailed: (error) => {
            setStatus('failed');
            setErrorMessage(error);
            toast.error(`Thanh toán thất bại: ${error}`);
        },
        onConnected: () => {
            console.log('Connected to payment WebSocket');
        }
    });

    // Countdown timer
    useEffect(() => {
        if (status !== 'waiting') return;
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [status]);

    const handleCreatePayment = useCallback(async () => {
        if (!order.totalPrice) {
            toast.error('Số tiền không chính xác vui lòng kiểm tra lại!');
            return;
        }

        setStatus('loading');
        setTimeLeft(5 * 60);

        try {
            const request: QRPaymentRequest = {
                amount: parseInt(order.totalPrice.toString(), 10),
                orderId: order.id
            };

            const response = await createQRPayment(request);

            setQrCode(response.qrCode);
            setPaymentId(response.paymentId);
            setBankInfo({
                bankName: response.bankName,
                accountName: response.accountName,
                accountNo: response.accountNo,
                bankCode: response.bankCode,
                message: response.message
            });
            setStatus('waiting');

        } catch (error: any) {
            console.error('Error creating payment:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Không thể tạo mã QR');
            toast.error(error.message);
        }
    }, [order.totalPrice, order.id]);

    const handleReset = () => {
        setQrCode(null);
        setPaymentId(null);
        setStatus('idle');
        setPaymentResult(null);
        setErrorMessage('');
        setTimeLeft(5 * 60);
        setBankInfo(null);
    };

    const handleRetry = () => {
        handleReset();
        handleCreatePayment();
    };

    const handleRedirect = () => {
        handleReset();
        startLoading();
        router.push("/my-orders");
    };

    const handleCancel = () => {
        handleReset();
        router.push("/my-orders");
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        handleCreatePayment();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 flex items-center justify-center">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-4xl w-full">
                {/* Glass Card */}
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Header */}
                    <div className="relative px-8 py-6 bg-gradient-to-r from-violet-600/80 to-purple-600/80">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-50"></div>
                        <div className="relative flex items-center justify-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                Thanh Toán QR
                            </h2>
                        </div>
                        <p className="relative text-center text-white/70 text-sm mt-2">
                            Quét mã để hoàn tất giao dịch
                        </p>
                        <p className="relative text-center text-white/50 text-s mt-1 font-light">
                        Trong trường hợp không bạn đã chuyển khoản nhưng không hiển thị thông tin chuyển khoản thành công (Sau 5 phút)
                        , hãy kiểm tra lại tại <a href={`/my-orders/${order.id}`} className="text-purple-300 hover:text-purple-200 underline underline-offset-2 transition-colors">ĐƠN HÀNG CỦA TÔI</a> hoặc liên hệ bộ phận hỗ trợ.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Loading State */}
                        {status === 'loading' && (
                            <div className="text-center py-12">
                                <div className="relative inline-flex">
                                    <div className="w-20 h-20 rounded-full border-4 border-purple-500/30"></div>
                                    <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
                                    <div className="absolute inset-2 w-16 h-16 rounded-full border-4 border-transparent border-t-violet-400 animate-spin animate-reverse"></div>
                                </div>
                                <p className="mt-6 text-white/80 font-medium">Đang tạo mã QR...</p>
                                <p className="text-white/50 text-sm mt-2">Vui lòng đợi trong giây lát</p>
                            </div>
                        )}

                        {/* Waiting State */}
                        {status === 'waiting' && qrCode && (
                            <div className="space-y-6">
                                {/* QR Code + Bank Info Row */}
                                <div className="flex flex-col md:flex-row gap-6 items-stretch">
                                    {/* Left: QR Code */}
                                    <div className="flex flex-col items-center space-y-4 md:w-1/2">
                                        {/* QR Code Container */}
                                        <div className="relative inline-block group">
                                            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                                            <div className="relative bg-white p-4 rounded-2xl shadow-2xl">
                                                <img
                                                    src={qrCode}
                                                    alt="QR Code"
                                                    className="w-48 h-48 mx-auto rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        {/* Amount Info */}
                                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 w-full text-center">
                                            <p className="text-white/60 text-sm mb-1">Số tiền thanh toán</p>
                                            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                                                {formatCurrency(parseFloat(order.totalPrice.toString()))}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Bank Info */}
                                    {bankInfo && (
                                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-3 md:w-1/2 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-3">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span className="text-white font-semibold">Thông tin chuyển khoản</span>
                                            </div>
                                            
                                            {bankInfo.bankName && (
                                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                    <span className="text-white/60 text-sm">Ngân hàng</span>
                                                    <span className="text-white font-medium">{bankInfo.bankName}</span>
                                                </div>
                                            )}
                                            
                                            {bankInfo.accountName && (
                                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                    <span className="text-white/60 text-sm">Chủ tài khoản</span>
                                                    <span className="text-white font-medium">{bankInfo.accountName}</span>
                                                </div>
                                            )}
                                            
                                            {bankInfo.accountNo && (
                                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                    <span className="text-white/60 text-sm">Số tài khoản</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-mono font-semibold bg-white/10 px-3 py-1 rounded-lg">
                                                            {bankInfo.accountNo}
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(bankInfo.accountNo || '');
                                                                toast.success('Đã sao chép số tài khoản!');
                                                            }}
                                                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                                            title="Sao chép"
                                                        >
                                                            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {bankInfo.message && (
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-white/60 text-sm">Nội dung CK</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-yellow-400 font-medium text-sm break-all">{bankInfo.message}</span>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(bankInfo.message || '');
                                                                toast.success('Đã sao chép nội dung!');
                                                            }}
                                                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                                                            title="Sao chép"
                                                        >
                                                            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Timer */}
                                <div className="flex items-center justify-center gap-4">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                                        timeLeft <= 60 ? 'bg-red-500/20 border-red-500/30' : 'bg-white/5 border-white/10'
                                    } border backdrop-blur-sm`}>
                                        <svg className={`w-5 h-5 ${timeLeft <= 60 ? 'text-red-400' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className={`font-mono font-bold text-lg ${timeLeft <= 60 ? 'text-red-400' : 'text-white'}`}>
                                            {formatTime(timeLeft)}
                                        </span>
                                    </div>
                                </div>

                                {/* Connection Status */}
                                <div className="flex items-center justify-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                        connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                                        connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                                        'bg-red-500'
                                    }`}></div>
                                    <span className="text-white/70 text-sm">
                                        {connectionStatus === 'connected' ? 'Đang chờ thanh toán...' :
                                         connectionStatus === 'connecting' ? 'Đang kết nối...' :
                                         'Mất kết nối'}
                                    </span>
                                </div>

                                {/* Waiting Animation */}
                                <div className="flex justify-center gap-1.5">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 0.15}s` }}
                                        ></div>
                                    ))}
                                </div>

                                {/* Cancel Button */}
                                <button
                                    onClick={handleCancel}
                                    className="text-white/50 hover:text-white/80 text-sm transition-colors duration-200 underline underline-offset-4"
                                >
                                    Hủy thanh toán
                                </button>
                            </div>
                        )}

                        {/* Success State */}
                        {status === 'success' && paymentResult && (
                            <div className="text-center space-y-6 py-4">
                                {/* Success Icon */}
                                <div className="relative inline-flex">
                                    <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                                    <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                        <svg className="w-12 h-12 text-white animate-[checkmark_0.5s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-green-400 mb-2">
                                        Thanh toán thành công!
                                    </h3>
                                    <p className="text-white/60 text-sm">Giao dịch đã được xác nhận</p>
                                </div>

                                {/* Transaction Details */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 space-y-4 border border-white/10">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-white/60 text-sm">Số tiền</span>
                                        <span className="text-xl font-bold text-green-400">
                                            {formatCurrency(paymentResult.amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/60 text-sm">Mã giao dịch</span>
                                        <span className="text-sm font-mono font-semibold text-white bg-white/10 px-3 py-1 rounded-lg">
                                            {paymentResult.transactionId}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRedirect}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200"
                                >
                                    Xem đơn hàng
                                </button>
                            </div>
                        )}

                        {/* Timeout State */}
                        {status === 'timeout' && (
                            <div className="text-center space-y-6 py-4">
                                <div className="relative inline-flex">
                                    <div className="absolute inset-0 bg-yellow-500 rounded-full blur-2xl opacity-30"></div>
                                    <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                                        Hết thời gian chờ
                                    </h3>
                                    <p className="text-white/60">
                                        Thanh toán đã quá thời gian cho phép
                                    </p>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                                    <p className="text-sm text-yellow-200">
                                        Vui lòng thử lại hoặc chọn phương thức thanh toán khác
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 border border-white/10"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        onClick={handleRetry}
                                        className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-200"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Failed State */}
                        {status === 'failed' && (
                            <div className="text-center space-y-6 py-4">
                                <div className="relative inline-flex">
                                    <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-30"></div>
                                    <div className="relative w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-red-400 mb-2">
                                        Thanh toán thất bại
                                    </h3>
                                    <p className="text-white/60">
                                        {errorMessage || 'Giao dịch không thể hoàn tất'}
                                    </p>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                    <p className="text-sm text-red-200">
                                        Vui lòng kiểm tra lại thông tin và thử lại
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 border border-white/10"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        onClick={handleRetry}
                                        className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-200"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {status === 'error' && (
                            <div className="text-center space-y-6 py-4">
                                <div className="relative inline-flex">
                                    <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-30"></div>
                                    <div className="relative w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-red-400 mb-2">
                                        Có lỗi xảy ra
                                    </h3>
                                    <p className="text-white/60">
                                        {errorMessage || 'Không thể tạo mã QR thanh toán'}
                                    </p>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                    <p className="text-sm text-red-200">
                                        Vui lòng kiểm tra kết nối và thử lại
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 border border-white/10"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        onClick={handleRetry}
                                        className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-200"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-white/5 border-t border-white/10">
                        <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Giao dịch được bảo mật</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes checkmark {
                    0% { stroke-dashoffset: 50; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-reverse {
                    animation-direction: reverse;
                }
            `}</style>
        </div>
    );
};

export default QRPayment;


