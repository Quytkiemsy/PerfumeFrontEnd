import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'


type CartStore = ICartState & ICartActions

const calculateTotals = (items: ICartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: items.reduce((sum, item) => sum + (item?.product?.perfumeVariants?.price ?? 0) * item.quantity, 0),
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

        // Actions
        setHasHydrated: () => set({ hasHydrated: true }),

        addItem: (product: IProductCart, quantity = 1) => {
          const currentItems = get().items
          const existingItem = currentItems.find(item => item.product.id === product.id
            && item.product.perfumeVariants?.id === product.perfumeVariants?.id)

          let newItems: ICartItem[]

          if (existingItem) {
            // Update quantity của item có sẵn
            newItems = currentItems.map(item =>
              item.product.id === product.id
                && item.product.perfumeVariants?.id === product.perfumeVariants?.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          } else {
            // Thêm item mới
            const newItem: ICartItem = {
              id: Date.now(), // Simple ID generation
              product,
              quantity,
              totalPrice: 0
            }
            newItems = [...currentItems, newItem]
          }

          const totals = calculateTotals(newItems)
          set({
            items: newItems,
            ...totals
          })
        },

        removeItem: (product: IProductCart) => {
          const newItems = get().items.filter(item => item.product.id !== product.id
            && item.product.perfumeVariants?.id !== product.perfumeVariants?.id)
          const totals = calculateTotals(newItems)

          set({
            items: newItems,
            ...totals
          })
        },

        updateQuantity: (product: IProductCart, quantity: number) => {
          if (quantity <= 0) {
            get().removeItem(product)
            return
          }

          const newItems = get().items.map(item =>
            item.product.id === product.id
              && item.product.perfumeVariants?.id === product.perfumeVariants?.id
              ? { ...item, quantity }
              : item
          )

          const totals = calculateTotals(newItems)
          set({
            items: newItems,
            ...totals
          })
        },

        clearCart: () => {
          set({
            items: [],
            totalItems: 0,
            totalPrice: 0
          })
        },
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
