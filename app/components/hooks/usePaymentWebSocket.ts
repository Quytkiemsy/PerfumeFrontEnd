import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketMessage } from '../types/payment';

interface UsePaymentWebSocketProps {
    paymentId: string | null;
    onPaymentSuccess: (data: { amount: number; transactionId: string }) => void;
    onPaymentTimeout: () => void;
    onPaymentFailed?: (error: string) => void;
    onConnected?: () => void;
}

export const usePaymentWebSocket = ({
    paymentId,
    onPaymentSuccess,
    onPaymentTimeout,
    onPaymentFailed,
    onConnected
}: UsePaymentWebSocketProps) => {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 3;
    const isCleanupRef = useRef(false);

    // Store callbacks in refs to avoid dependency issues
    const onPaymentSuccessRef = useRef(onPaymentSuccess);
    const onPaymentTimeoutRef = useRef(onPaymentTimeout);
    const onPaymentFailedRef = useRef(onPaymentFailed);
    const onConnectedRef = useRef(onConnected);

    // Update refs when callbacks change
    useEffect(() => {
        onPaymentSuccessRef.current = onPaymentSuccess;
        onPaymentTimeoutRef.current = onPaymentTimeout;
        onPaymentFailedRef.current = onPaymentFailed;
        onConnectedRef.current = onConnected;
    }, [onPaymentSuccess, onPaymentTimeout, onPaymentFailed, onConnected]);

    const cleanup = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
        }
    }, []);

    const disconnect = useCallback(() => {
        isCleanupRef.current = true;
        cleanup();
        
        if (ws.current) {
            ws.current.close(1000, 'Client disconnect');
            ws.current = null;
        }
        setIsConnected(false);
        setConnectionStatus('disconnected');
    }, [cleanup]);

    const startPingInterval = useCallback(() => {
        // Clear existing interval
        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
        }
        
        // Send ping every 25 seconds to keep connection alive
        pingIntervalRef.current = setInterval(() => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: 'ping' }));
            }
        }, 25000);
    }, []);

    useEffect(() => {
        if (!paymentId) return;

        // Prevent multiple connections
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            return;
        }

        isCleanupRef.current = false;
        reconnectAttempts.current = 0;
        
        const connect = () => {
            if (isCleanupRef.current) return;
            
            // Close existing connection if any
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }

            setConnectionStatus('connecting');
            
            const wsUrl = `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/ws/payment/${paymentId}`;
            console.log('Connecting to WebSocket:', wsUrl);
            
            try {
                ws.current = new WebSocket(wsUrl);
            } catch (error) {
                console.error('Failed to create WebSocket:', error);
                setConnectionStatus('disconnected');
                return;
            }

            ws.current.onopen = () => {
                if (isCleanupRef.current) {
                    ws.current?.close();
                    return;
                }
                setIsConnected(true);
                setConnectionStatus('connected');
                reconnectAttempts.current = 0;
                console.log('WebSocket connected for payment:', paymentId);
            };

            ws.current.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);

                    switch (message.type) {
                        case 'connected':
                            onConnectedRef.current?.();
                            startPingInterval();
                            // Set client-side timeout as backup
                            timeoutRef.current = setTimeout(() => {
                                onPaymentTimeoutRef.current();
                                disconnect();
                            }, 5 * 60 * 1000); // 5 minutes
                            break;

                        case 'payment_success':
                            if (message.amount !== undefined && message.transactionId) {
                                onPaymentSuccessRef.current({
                                    amount: message.amount,
                                    transactionId: message.transactionId
                                });
                            }
                            cleanup();
                            break;

                        case 'payment_failed':
                            onPaymentFailedRef.current?.(message.error || 'Payment failed');
                            cleanup();
                            break;

                        case 'payment_timeout':
                            onPaymentTimeoutRef.current();
                            cleanup();
                            break;

                        case 'pong':
                            // Server responded to ping, connection is alive
                            break;
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.current.onclose = (event) => {
                setIsConnected(false);
                setConnectionStatus('disconnected');
                console.log(
                    'WebSocket disconnected',
                    'code:', event.code,
                    'reason:', event.reason,
                    'wasClean:', event.wasClean
                );

                // Auto reconnect if not clean close and not intentional
                if (!event.wasClean && !isCleanupRef.current && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++;
                    console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
                    setTimeout(() => {
                        connect();
                    }, 2000 * reconnectAttempts.current); // Exponential backoff
                }
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setIsConnected(false);
            };
        };

        connect();

        return () => {
            disconnect();
        };
    }, [paymentId, disconnect, cleanup, startPingInterval]);

    return { isConnected, connectionStatus, disconnect };
};