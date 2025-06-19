import { sendRequest } from "@/app/util/api";

export const cartApi = {
    getCart: async (userId: string): Promise<ICartState> => {
        const response = await sendRequest<IBackendRes<ICartState>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/${userId}`,
            method: 'GET'
        });
        return response.data as ICartState;
    },

    addItem: async (userId: string, item: ICartItem): Promise<ICartState> => {
        const response = await sendRequest<IBackendRes<ICartState>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/${userId}/items`,
            method: 'POST',
            body: item
        });
        return response.data as ICartState;
    },

    updateQuantity: async (userId: string, productId: string, quantity: number, variantId: string): Promise<ICartState> => {
        const response = await sendRequest<IBackendRes<ICartState>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/${userId}/items`,
            method: 'PUT',
            queryParams: {
                productId: productId,
                quantity: quantity,
                variantId: variantId
            }
        });
        return response.data as ICartState;
    },

    removeItem: async (userId: string, productId: string, variantId: string): Promise<ICartState> => {
        const response = await sendRequest<IBackendRes<ICartState>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/${userId}/items`,
            method: 'DELETE',
            queryParams: {
                productId: productId,
                variantId: variantId
            }
        });
        return response.data as ICartState;
    },

    clearCart: async (userId: string): Promise<ICartState> => {
        const response = await sendRequest<IBackendRes<ICartState>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/${userId}`,
            method: 'DELETE'
        });
        return response.data as ICartState;
    },
};