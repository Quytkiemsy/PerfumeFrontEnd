import { IUser } from "./next-auth";

export { };

declare global {


    export interface ICartItem {
        id: number
        product?: IProductCart
        quantity: number
        totalPrice: number
        perfumeVariants?: IPerfumeVariant[];
        order?: Order;
    }

    export interface ShippingInfo {
        id: number;
        fullName: string;
        phoneNumber: string;
        email: string;
        address: string;
        note: string;
    }

    export interface Order {
        id: number;
        createdAt: string; // ISO date string
        createdBy: string;
        status: OrderStatus;
        totalPrice: string; // BigDecimal as string
        user?: IUser;
        shippingInfo?: ShippingInfo;
        items: ICartItem[];
        paymentMethod: PaymentMethod;
    }

    interface IOrder {
        id: number;
        createdAt: string;
        createdBy: string;
        status: string;
        totalPrice: number;
        user: IUser;
        shippingInfo: ShippingInfo;
        items: ICartItem[];
        paymentMethod: string;
    }


    // OrderStatus.ts
    export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';

    // PaymentMethod.ts
    export type PaymentMethod = string; // Or enum if you have defined it

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
        setUserId: (userId: string) => void
        mergeGuestToUserCart: (userId: string, guestId: string) => Promise<void>
    }
}
