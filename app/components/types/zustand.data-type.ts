export { };

declare global {


    export interface ICartItem {
        id: number
        product: IProductCart
        quantity: number
        totalPrice: number
    }

    export interface ICartState {
        userId: string,
        items: ICartItem[]
        totalItems: number
        totalPrice: number
        isLoading: boolean
        error: string | null
        hasHydrated: boolean
    }

    export interface ICartActions {
        addItem: (product: IProductCart, userId: string, quantity?: number) => void
        removeItem: (product: IProductCart, userId: string, variantId: string) => void
        updateQuantity: (product: IProductCart, quantity: number, userId: string) => void
        clearCart: (userId: string) => void
        syncWithServer?: () => void
        setHasHydrated: () => void
        fetchCart: (userId: string) => Promise<void>
    }
}
