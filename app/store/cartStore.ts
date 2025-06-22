import { cartApi } from '@/app/util/cartApi'
import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { toast } from "react-hot-toast";


type CartStore = ICartState & ICartActions

const calculateTotals = (items: ICartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: items.reduce((sum, item) => sum + (item?.product?.perfumeVariant?.price ?? 0) * item.quantity, 0),
})

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

        addItem: async (product: IProductCart, userId: string, quantity = 1) => {
          set({ isLoading: true, error: null });
          try {
            const newItem: ICartItem = {
              id: Date.now(), // Simple ID generation
              product,
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

        removeItem: async (product: IProductCart, userId: string, variantId: string) => {
          set({ isLoading: true, error: null });
          try {
            const updatedCart = await cartApi.removeItem(userId, String(product.id), variantId);
            set({ ...updatedCart, isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
            set({ error: errorMessage, isLoading: false });
          }
        },

        updateQuantity: async (product: IProductCart, quantity: number, userId: string) => {
          set({ isLoading: true, error: null });
          try {
            const updatedCart = await cartApi.updateQuantity(userId, String(product.id), quantity, String(product.perfumeVariant?.id) ?? '');
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
