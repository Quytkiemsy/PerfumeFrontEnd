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
     * Export products to CSV file
     * API: GET /api/v1/admin/products/export/csv
     */
    exportProductsCSV: async (accessToken: string): Promise<Blob> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products/export/csv`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );
        if (!response.ok) {
            throw new Error('Failed to export products');
        }
        return response.blob();
    },

    /**
     * Download CSV template for import
     * API: GET /api/v1/admin/products/template/csv
     */
    downloadCSVTemplate: async (accessToken: string): Promise<Blob> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products/template/csv`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );
        if (!response.ok) {
            throw new Error('Failed to download template');
        }
        return response.blob();
    },

    /**
     * Import products from CSV file
     * API: POST /api/v1/admin/products/import/csv
     */
    importProductsCSV: async (
        file: File,
        accessToken: string
    ): Promise<IBackendRes<{ messages: string[]; totalProcessed: number }>> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products/import/csv`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            }
        );
        return response.json();
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
