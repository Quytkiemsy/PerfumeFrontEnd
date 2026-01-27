import { sendRequest } from "@/app/util/api";

export const addressApi = {
    /**
     * Get all addresses for user
     * API: GET /api/v1/addresses
     */
    getAddresses: async (accessToken?: string): Promise<IBackendRes<IAddress[]>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IAddress[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses`,
            method: 'GET',
            headers,
        });
        return response;
    },

    /**
     * Get address by ID
     * API: GET /api/v1/addresses/{id}
     */
    getAddressById: async (
        addressId: number,
        accessToken?: string
    ): Promise<IBackendRes<IAddress>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IAddress>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses/${addressId}`,
            method: 'GET',
            headers,
        });
        return response;
    },

    /**
     * Create new address
     * API: POST /api/v1/addresses
     */
    createAddress: async (
        address: Omit<IAddress, 'id' | 'createdAt' | 'updatedAt'>,
        accessToken?: string
    ): Promise<IBackendRes<IAddress>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IAddress>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses`,
            method: 'POST',
            body: address,
            headers,
        });
        return response;
    },

    /**
     * Update address
     * API: PUT /api/v1/addresses/{id}
     */
    updateAddress: async (
        addressId: number,
        address: Partial<IAddress>,
        accessToken?: string
    ): Promise<IBackendRes<IAddress>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IAddress>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses/${addressId}`,
            method: 'PUT',
            body: address,
            headers,
        });
        return response;
    },

    /**
     * Delete address
     * API: DELETE /api/v1/addresses/{id}
     */
    deleteAddress: async (
        addressId: number,
        accessToken?: string
    ): Promise<IBackendRes<void>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<void>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses/${addressId}`,
            method: 'DELETE',
            headers,
        });
        return response;
    },

    /**
     * Set default address
     * API: PUT /api/v1/addresses/{id}/set-default
     */
    setDefaultAddress: async (
        addressId: number,
        accessToken?: string
    ): Promise<IBackendRes<IAddress>> => {
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await sendRequest<IBackendRes<IAddress>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses/${addressId}/set-default`,
            method: 'PUT',
            headers,
        });
        return response;
    },
};

export default addressApi;
