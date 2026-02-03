import { cartApi } from '@/app/util/cartApi';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';


type CartStore = ICartState & ICartActions


export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        items: [],
        totalItems: 0,
        totalPrice: 0,
        hasHydrated: false,
        isLoading: false,
        error: null,
        userId: '', // Assuming userId will be set later
        setUserId: (userId: string) => set({ userId }),

        // Actions
        setHasHydrated: () => set({ hasHydrated: true }),

        fetchCart: async (userId: string) => {
          set({ isLoading: true, error: null });
          try {
            const cart: ICartState = await cartApi.getCart(userId);
            set({ ...cart, isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cart';
            set({ error: errorMessage, isLoading: false });
          }
        },

        addItem: async (product: IProduct, userId: string, quantity = 1) => {
          set({ isLoading: true, error: null });
          try {
            const newItem: ICartItem = {
              id: Math.floor(Math.random() * 1000000).toString(), // Random ID generation as string
              perfumeVariants: product.perfumeVariants?.[0] || undefined,
              quantity,
              totalPrice: 0
            }
            const updatedCart = await cartApi.addItem(userId, newItem);
            set({ ...updatedCart, isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add item';
            set({ error: errorMessage, isLoading: false });
          }
        },

        removeItem: async (product: IProduct, userId: string, variantId: string) => {
          set({ isLoading: true, error: null });
          try {
            const updatedCart = await cartApi.removeItem(userId, String(product.id), variantId);
            set({ ...updatedCart, isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
            set({ error: errorMessage, isLoading: false });
          }
        },

        updateQuantity: async (product: IProduct, quantity: number, userId: string, variant: IPerfumeVariant) => {
          set({ isLoading: true, error: null });
          try {
            const updatedCart = await cartApi.updateQuantity(userId, String(product.id), quantity, String(variant.id));
            set({ ...updatedCart, isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add item';
            set({ error: errorMessage, isLoading: false });
          }
        },

        clearCart: async (userId: string) => {
          set({ isLoading: true, error: null });
          try {
            const clearCart = await cartApi.clearCart(userId);
            set({ ...clearCart, isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
            set({ error: errorMessage, isLoading: false });
          }
        },
        mergeGuestToUserCart: async (userId: string, guestId: string) => {
          set({ isLoading: true, error: null });
          try {
            const mergeCart = await cartApi.mergeGuestToUserCart(userId, guestId);
            set({ ...mergeCart, isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
            set({ error: errorMessage, isLoading: false });
          }
        }
      }),
      {
        name: 'cart-storage',
        storage: createJSONStorage(() => {
          // SSR safe storage
          if (typeof window !== 'undefined') {
            return localStorage
          }
          return {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
          }
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated()
        },
      }
    )
  )
)
