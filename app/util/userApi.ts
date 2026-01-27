import { sendRequest } from "@/app/util/api";

export const userApi = {
    /**
     * Get user profile
     * API: GET /api/v1/users/profile
     */
    getProfile: async (accessToken?: string): Promise<IBackendRes<IUser>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/profile`,
            method: 'GET',
            headers,
        });
        return response;
    },

    /**
     * Update user profile
     * API: PUT /api/v1/users/profile
     */
    updateProfile: async (
        data: Partial<IUser>,
        accessToken?: string
    ): Promise<IBackendRes<IUser>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/profile`,
            method: 'PUT',
            body: data,
            headers,
        });
        return response;
    },

    /**
     * Change password
     * API: PUT /api/v1/users/change-password
     */
    changePassword: async (
        oldPassword: string,
        newPassword: string,
        accessToken?: string
    ): Promise<IBackendRes<void>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<void>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/change-password`,
            method: 'PUT',
            body: { oldPassword, newPassword },
            headers,
        });
        return response;
    },

    /**
     * Upload avatar
     * API: POST /api/v1/users/avatar
     */
    uploadAvatar: async (
        file: FormData,
        accessToken?: string
    ): Promise<IBackendRes<{ url: string }>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/avatar`,
            {
                method: 'POST',
                headers,
                body: file,
            }
        );
        return response.json();
    },

    // ========== ADMIN APIS ==========

    /**
     * Get all users (Admin)
     * API: GET /api/v1/users
     */
    getAllUsers: async (
        queryParams?: Record<string, any>,
        accessToken?: string
    ): Promise<IBackendRes<IModelPaginate<IUser>>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IModelPaginate<IUser>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
            method: 'GET',
            queryParams,
            headers,
        });
        return response;
    },

    /**
     * Get user by ID (Admin)
     * API: GET /api/v1/users/{id}
     */
    getUserById: async (
        userId: string,
        accessToken?: string
    ): Promise<IBackendRes<IUser>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`,
            method: 'GET',
            headers,
        });
        return response;
    },

    /**
     * Update user (Admin)
     * API: PUT /api/v1/users/{id}
     */
    updateUser: async (
        userId: string,
        data: Partial<IUser>,
        accessToken?: string
    ): Promise<IBackendRes<IUser>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`,
            method: 'PUT',
            body: data,
            headers,
        });
        return response;
    },

    /**
     * Delete user (Admin)
     * API: DELETE /api/v1/users/{id}
     */
    deleteUser: async (
        userId: string,
        accessToken?: string
    ): Promise<IBackendRes<void>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<void>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`,
            method: 'DELETE',
            headers,
        });
        return response;
    },

    /**
     * Toggle user status (Admin)
     * API: PUT /api/v1/users/{id}/toggle-status
     */
    toggleUserStatus: async (
        userId: string,
        accessToken?: string
    ): Promise<IBackendRes<IUser>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}/toggle-status`,
            method: 'PUT',
            headers,
        });
        return response;
    },
};

export default userApi;
