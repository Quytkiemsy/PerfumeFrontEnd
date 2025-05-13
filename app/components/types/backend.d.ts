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
            current: number;
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
        brand?: {
            name: string;
            description?: string;
            origin?: string;
        }
        fragranceTypes?: {
            name: string;
            description?: string;
        }
        perfumeVariants?: {
            id: number;
            variantType?: string;
            volume?: string;
            price?: number;
            stockQuantity?: number;
        }[]
        createdAt: string;
        updatedAt: string;
        createdBy?: string;
        updatedBy?: string;
    }

}