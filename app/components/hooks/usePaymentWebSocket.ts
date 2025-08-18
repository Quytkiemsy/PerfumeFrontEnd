import { useEffect, useRef, useState } from 'react';
import { WebSocketMessage } from '../types/payment';

interface UsePaymentWebSocketProps {
    paymentId: string | null;
    onPaymentSuccess: (data: { amount: number; transactionId: string }) => void;
    onPaymentTimeout: () => void;
    onConnected?: () => void;
}

export const usePaymentWebSocket = ({
    paymentId,
    onPaymentSuccess,
    onPaymentTimeout,
    onConnected
}: UsePaymentWebSocketProps) => {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!paymentId) return;

        // Connect to WebSocket
        const wsUrl = `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/ws/payment/${paymentId}`;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);

                switch (message.type) {
                    case 'connected':
                        onConnected?.();
                        // Set client-side timeout as backup
                        timeoutRef.current = setTimeout(() => {
                            onPaymentTimeout();
                            disconnect();
                        }, 5 * 60 * 1000); // 5 minutes
                        break;

                    case 'payment_success':
                        if (message.amount && message.transactionId) {
                            onPaymentSuccess({
                                amount: message.amount,
                                transactionId: message.transactionId
                            });
                        }
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                        disconnect();
                        break;

                    case 'payment_timeout':
                        onPaymentTimeout();
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                        disconnect();
                        break;
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.current.onclose = (event) => {
            setIsConnected(false);
            console.log(
                'WebSocket disconnected',
                'code:', event.code,
                'reason:', event.reason,
                'wasClean:', event.wasClean
            );
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };

        return () => {
            disconnect();
        };
    }, [paymentId]);

    const disconnect = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (ws.current) {
            ws.current.close();
            ws.current = null;
        }
        setIsConnected(false);
    };

    return { isConnected, disconnect };
};