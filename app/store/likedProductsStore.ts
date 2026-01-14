import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface LikedProductsState {
  likedProducts: IProduct[];
  setLikedProducts: (products: IProduct[]) => void;
  addLikedProduct: (product: IProduct) => void;
  removeLikedProduct: (productId: string | number) => void;
}

export const useLikedProductsStore = create<LikedProductsState>()(
  devtools(
    persist(
      (set, get) => ({
        likedProducts: [],
        setLikedProducts: (products: IProduct[]) => set({ likedProducts: products }),
        addLikedProduct: (product: IProduct) => set((state) => {
          if (state.likedProducts.some((p) => p.id === product.id)) return {};
          return { likedProducts: [...state.likedProducts, product] };
        }),
        removeLikedProduct: (productId: string | number) => set((state) => ({
          likedProducts: state.likedProducts.filter((p) => p.id !== productId)
        })),
      }),
      {
        name: 'liked-products-storage',
        storage: createJSONStorage(() => {
          if (typeof window !== 'undefined') {
            return localStorage;
          }
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }),
      }
    )
  )
);
