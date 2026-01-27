import { sendRequest } from "@/app/util/api";

export const productApi = {
    /**
     * Increment visit count for a product
     * API: POST /api/v1/products/{id}/visit
     */
    incrementVisitCount: async (productId: number): Promise<IBackendRes<{ visitCount: number }>> => {
        const response = await sendRequest<IBackendRes<{ visitCount: number }>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}/visit`,
            method: 'POST',
        });
        return response;
    },

    /**
     * Get product visit count
     * API: GET /api/v1/products/{id}/visit-count
     */
    getVisitCount: async (productId: number): Promise<IBackendRes<{ visitCount: number }>> => {
        const response = await sendRequest<IBackendRes<{ visitCount: number }>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}/visit-count`,
            method: 'GET',
        });
        return response;
    },

    /**
     * Get popular products (by visit count)
     * API: GET /api/v1/products/popular
     */
    getPopularProducts: async (limit: number = 10): Promise<IBackendRes<IProduct[]>> => {
        const response = await sendRequest<IBackendRes<IProduct[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/popular`,
            method: 'GET',
            queryParams: { limit },
        });
        return response;
    },

    /**
     * Get top rated products
     * API: GET /api/v1/products/top-rated
     */
    getTopRatedProducts: async (limit: number = 10): Promise<IBackendRes<IProduct[]>> => {
        const response = await sendRequest<IBackendRes<IProduct[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/top-rated`,
            method: 'GET',
            queryParams: { limit },
        });
        return response;
    },
};

export default productApi;
