export interface QRPaymentRequest {
    amount: number;
    orderId: number;
}

export interface QRPaymentResponse {
    paymentId: string;
    qrCode: string;
    bankName?: string;
    accountName?: string;
    accountNo?: string;
    bankCode?: string;
    message?: string;
    amount?: number;
}

export interface WebSocketMessage {
    type: 'connected' | 'payment_success' | 'payment_timeout' | 'payment_failed' | 'pong';
    paymentId?: string;
    amount?: number;
    transactionId?: string;
    error?: string;
}