export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {

    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            page: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface IProduct {
        id: number;
        name: string;
        images: string[];
        description?: string;
        fitInfo?: string;
        details?: string;
        brand?: IBrand;
        fragranceTypes?: IFragranceTypes
        perfumeVariants?: IPerfumeVariant[]
        tier?: string;
        sex?: string;
        new?: boolean;
        visitCount?: number;
        averageRating?: number;
        totalReviews?: number;
        createdAt?: string;
        updatedAt?: string;
        createdBy?: string;
        updatedBy?: string;
    }

    interface IPerfumeVariant {
        id: number;
        variantType?: string;
        volume?: string;
        price?: number;
        stockQuantity?: number;
        product?: IProduct;
    }

    interface IFragranceTypes {
        id: number;
        name: string;
        description?: string;
    }

    interface IBrand {
        id: string;
        name: string;
        description?: string;
        origin?: string;
    }

    interface IModelPaginateRestJPA<T> {
        page: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        _embedded: {
            [key: string]: T[];
        }
    }

    export interface IImageUpload {
        fileName: string;
        uploadedAt: string;
    }

    // User & Profile Types
    interface IUser {
        id: string;
        email: string;
        name: string;
        username?: string;
        phoneNumber?: string;
        avatar?: string;
        role: 'USER' | 'ADMIN';
        gender?: 'MALE' | 'FEMALE' | 'OTHER';
        dateOfBirth?: string;
        status?: 'ACTIVE' | 'INACTIVE' | 'BANNED';
        addresses?: IAddress[];
        createdAt?: string;
        updatedAt?: string;
    }

    interface IAddress {
        id: number;
        fullName: string;
        phone: string;
        email?: string;
        province: string;
        district: string;
        ward: string;
        addressDetail: string;
        isDefault: boolean;
        userId?: string;
        createdAt?: string;
        updatedAt?: string;
    }

    // Order Types
    // interface IOrder {
    //     id: number;
    //     orderCode?: string;
    //     user?: IUser;
    //     userId?: string;
    //     customerName?: string;
    //     customerEmail?: string;
    //     customerPhone?: string;
    //     shippingAddress?: string;
    //     orderItems: IOrderItem[];
    //     totalAmount: number;
    //     status: OrderStatus;
    //     paymentMethod: PaymentMethod;
    //     paymentStatus?: PaymentStatus;
    //     notes?: string;
    //     createdAt: string;
    //     updatedAt?: string;
    // }

    interface IOrderItem {
        id: number;
        product?: IProduct;
        perfumeVariant?: IPerfumeVariant;
        quantity: number;
        price: number;
        subtotal?: number;
    }

    type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
    type PaymentMethod = 'BANK' | 'COD' | 'CREDIT_CARD' | 'MOMO' | 'VNPAY';
    type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

    // Review/Rating Types
    interface IReview {
        id: number;
        rating: number;
        title?: string;
        comment: string;
        images?: string[];
        user?: IUser;
        userId?: string;
        userName?: string;
        userAvatar?: string;
        product?: IProduct;
        productId?: number;
        variant?: IPerfumeVariant;
        helpfulCount?: number;
        verified?: boolean;
        status?: 'PENDING' | 'APPROVED' | 'REJECTED';
        adminReply?: string;
        createdAt?: string;
        updatedAt?: string;
    }

    interface IReviewStats {
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }

    // Cart Types
    // interface ICartState {
    //     id?: string;
    //     userId?: string;
    //     items: ICartItem[];
    //     totalItems: number;
    //     totalPrice: number;
    // }

    // interface ICartItem {
    //     id?: string;
    //     product: IProduct;
    //     perfumeVariant?: IPerfumeVariant;
    //     quantity: number;
    //     price?: number;
    // }

    // Notification Types
    interface INotification {
        id: number;
        title: string;
        message: string;
        type: 'ORDER' | 'PROMO' | 'SYSTEM' | 'REVIEW';
        isRead: boolean;
        userId?: string;
        link?: string;
        createdAt: string;
    }

}