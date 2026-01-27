import { sendRequest } from "@/app/util/api";

interface CartItemRequest {
    quantity: number;
    perfumeVariants: {
        id: number | undefined;
    };
}

interface ProductStockInfo {
    variantId: number;
    requestedQuantity: number;
    availableStock: number;
    available: boolean;
    message?: string;
}

interface StockAvailabilityResponse {
    allAvailable: boolean;
    products: ProductStockInfo[];
}

export const orderApi = {
    /**
     * Check stock availability for cart items
     * API: POST /api/v1/orders/check-stock
     */
    checkStock: async (items: CartItemRequest[]): Promise<IBackendRes<StockAvailabilityResponse>> => {
        const response = await sendRequest<IBackendRes<StockAvailabilityResponse>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/check-stock`,
            method: 'POST',
            body: items,
        });
        return response;
    },

    /**
     * Reserve stock when user enters checkout page
     * API: POST /api/v1/orders/reserve?userId={userId}
     */
    reserveStock: async (
        userId: string,
        items: CartItemRequest[]
    ): Promise<IBackendRes<void>> => {
        const headers: Record<string, string> = {};

        const response = await sendRequest<IBackendRes<void>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/reserve`,
            method: 'POST',
            body: items,
            queryParams: {
                userId: userId
            },
            headers,
        });
        return response;
    },

    /**
     * Release stock reservation when user leaves checkout or cancels
     * API: DELETE /api/v1/orders/reserve/{userId}
     */
    releaseReservation: async (
        userId: string
    ): Promise<IBackendRes<void>> => {
        const headers: Record<string, string> = {};

        const response = await sendRequest<IBackendRes<void>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/reserve/${encodeURIComponent(userId)}`,
            method: 'DELETE',
            headers,
        });
        return response;
    },

    /**
     * Create new order with stock validation and pessimistic locking
     * API: POST /api/v1/orders/create-new
     */
    createOrderNew: async (
        order: any,
        accessToken?: string | null
    ): Promise<IBackendRes<IOrder>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }


        const response = await sendRequest<IBackendRes<IOrder>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/create-new`,
            method: 'POST',
            body: order,
            headers,
        });
        return response;
    },

    /**
     * Cancel an order (new version - restores stock)
     * API: POST /api/v1/orders/{orderId}/cancel
     */
    cancelOrderNew: async (
        orderId: number
    ): Promise<IBackendRes<void>> => {
        const headers: Record<string, string> = {};

        const response = await sendRequest<IBackendRes<void>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${orderId}/cancel`,
            method: 'POST',
            headers,
        });
        return response;
    },

    /**
     * Cancel an order (legacy version)
     * API: DELETE /api/v1/orders/{id}
     */
    cancelOrder: async (
        orderId: number
    ): Promise<IBackendRes<IOrder>> => {
        const headers: Record<string, string> = {};

        const response = await sendRequest<IBackendRes<IOrder>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${orderId}`,
            method: 'DELETE',
            headers,
        });
        return response;
    },

    /**
     * Get order by ID
     * API: GET /api/v1/orders/{id}
     */
    getOrderById: async (
        orderId: number
    ): Promise<IBackendRes<IOrder>> => {
        const headers: Record<string, string> = {};

        const response = await sendRequest<IBackendRes<IOrder>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${orderId}`,
            method: 'GET',
            headers,
        });
        return response;
    },

    /**
     * Get all orders for current user
     * API: GET /api/v1/orders
     */
    getOrders: async (
        queryParams?: Record<string, any>
    ): Promise<IBackendRes<any>> => {
        const headers: Record<string, string> = {};

        const response = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
            method: 'GET',
            headers,
            queryParams,
        });
        return response;
    },

    // ========== ADMIN APIS ==========

    /**
     * Get all orders (Admin)
     * API: GET /api/v1/orders/admin
     */
    getAllOrdersAdmin: async (
        queryParams?: Record<string, any>,
        accessToken?: string
    ): Promise<IBackendRes<IModelPaginate<IOrder>>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await sendRequest<IBackendRes<IModelPaginate<IOrder>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/admin`,
            method: 'GET',
            headers,
            queryParams,
        });
        return response;
    },

    /**
     * Update order status (Admin)
     * API: PUT /api/v1/orders/{id}/status
     */
    updateOrderStatus: async (
        orderId: number,
        status: OrderStatus,
        accessToken?: string
    ): Promise<IBackendRes<IOrder>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await sendRequest<IBackendRes<IOrder>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${orderId}/status`,
            method: 'PUT',
            body: { status },
            headers,
        });
        return response;
    },
};

export default orderApi;
