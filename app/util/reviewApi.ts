import { sendRequest } from "@/app/util/api";

export const reviewApi = {
    /**
     * Get reviews for a product
     * API: GET /api/v1/reviews/product/{productId}
     */
    getProductReviews: async (
        productId: number,
        queryParams?: Record<string, any>
    ): Promise<IBackendRes<IModelPaginate<IReview>>> => {
        const response = await sendRequest<IBackendRes<IModelPaginate<IReview>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/product/${productId}`,
            method: 'GET',
            queryParams,
        });
        return response;
    },

    /**
     * Get review stats for a product
     * API: GET /api/v1/reviews/product/{productId}/stats
     */
    getProductReviewStats: async (
        productId: number
    ): Promise<IBackendRes<IReviewStats>> => {
        const response = await sendRequest<IBackendRes<IReviewStats>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/product/${productId}/stats`,
            method: 'GET',
        });
        return response;
    },

    /**
     * Create a review
     * API: POST /api/v1/reviews
     */
    createReview: async (
        review: {
            productId: number;
            rating: number;
            title?: string;
            comment: string;
            images?: string[];
        },
        accessToken?: string
    ): Promise<IBackendRes<IReview>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IReview>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews`,
            method: 'POST',
            body: review,
            headers,
        });
        return response;
    },

    /**
     * Update a review
     * API: PUT /api/v1/reviews/{id}
     */
    updateReview: async (
        reviewId: number,
        review: Partial<IReview>,
        accessToken?: string
    ): Promise<IBackendRes<IReview>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IReview>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}`,
            method: 'PUT',
            body: review,
            headers,
        });
        return response;
    },

    /**
     * Delete a review
     * API: DELETE /api/v1/reviews/{id}
     */
    deleteReview: async (
        reviewId: number,
        accessToken?: string
    ): Promise<IBackendRes<void>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<void>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}`,
            method: 'DELETE',
            headers,
        });
        return response;
    },

    /**
     * Check if user can review a product
     * API: GET /api/v1/reviews/can-review/{productId}
     */
    canUserReview: async (
        productId: number,
        accessToken?: string
    ): Promise<IBackendRes<{ canReview: boolean; reason?: string }>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<{ canReview: boolean; reason?: string }>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/can-review/${productId}`,
            method: 'GET',
            headers,
        });
        return response;
    },

    /**
     * Mark review as helpful
     * API: POST /api/v1/reviews/{id}/helpful
     */
    markHelpful: async (
        reviewId: number
    ): Promise<IBackendRes<void>> => {
        const response = await sendRequest<IBackendRes<void>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}/helpful`,
            method: 'POST',
        });
        return response;
    },

    // ========== ADMIN APIS ==========

    /**
     * Get all reviews (Admin)
     * API: GET /api/v1/reviews
     */
    getAllReviews: async (
        queryParams?: Record<string, any>,
        accessToken?: string
    ): Promise<IBackendRes<IModelPaginate<IReview>>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IModelPaginate<IReview>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews`,
            method: 'GET',
            queryParams,
            headers,
        });
        return response;
    },

    /**
     * Approve review (Admin)
     * API: PUT /api/v1/reviews/{id}/approve
     */
    approveReview: async (
        reviewId: number,
        accessToken?: string
    ): Promise<IBackendRes<IReview>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IReview>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}/approve`,
            method: 'PUT',
            headers,
        });
        return response;
    },

    /**
     * Reject review (Admin)
     * API: PUT /api/v1/reviews/{id}/reject
     */
    rejectReview: async (
        reviewId: number,
        accessToken?: string
    ): Promise<IBackendRes<IReview>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IReview>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}/reject`,
            method: 'PUT',
            headers,
        });
        return response;
    },

    /**
     * Reply to review (Admin)
     * API: PUT /api/v1/reviews/{id}/reply
     */
    replyToReview: async (
        reviewId: number,
        reply: string,
        accessToken?: string
    ): Promise<IBackendRes<IReview>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IReview>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}/reply`,
            method: 'PUT',
            body: { reply },
            headers,
        });
        return response;
    },
};

export default reviewApi;
