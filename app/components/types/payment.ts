export interface QRPaymentRequest {
    amount: number;
}

export interface QRPaymentResponse {
    paymentId: string;
    qrCode: string;
}

export interface WebSocketMessage {
    type: 'connected' | 'payment_success' | 'payment_timeout';
    paymentId: string;
    amount?: number;
    transactionId?: string;
}