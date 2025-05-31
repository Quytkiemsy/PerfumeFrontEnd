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
        createdAt: string;
        updatedAt: string;
        createdBy?: string;
        updatedBy?: string;
    }

    interface IPerfumeVariant {
        id: number;
        variantType?: string;
        volume?: string;
        price?: number;
        stockQuantity?: number;
    }

    interface IFragranceTypes {
        id: number;
        name: string;
        description?: string;
    }

    interface IBrand {
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
}