export { };

declare global {


    export interface ICartItem {
        id: number
        product: IProductCart
        quantity: number
        totalPrice: number
    }

    export interface ICartState {
        items: ICartItem[]
        totalItems: number
        totalPrice: number
        isLoading: boolean
        error: string | null
        hasHydrated: boolean
    }

    export interface ICartActions {
        addItem: (product: IProductCart, quantity?: number) => void
        removeItem: (product: IProductCart) => void
        updateQuantity: (product: IProductCart, quantity: number) => void
        clearCart: () => void
        syncWithServer?: () => void
        setHasHydrated: () => void
    }
}
