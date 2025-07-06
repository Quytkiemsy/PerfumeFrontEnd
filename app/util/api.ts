import queryString from 'query-string';
import slugify from 'slugify';

export const sendRequest = async <T>(props: IRequest) => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options: any = {
        method: method,
        // by default setting the content-type to be json type
        headers: new Headers({ 'content-type': 'application/json', ...headers }),
        body: body ? JSON.stringify(body) : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                // to be able to access error status when you catch the error 
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};

export const sendRequestFile = async <T>(props: IRequest) => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options: any = {
        method: method,
        // by default setting the content-type to be json type
        headers: new Headers({ ...headers }),
        body: body ? body : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                // to be able to access error status when you catch the error 
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};

export const fetchDefaultImage = (type: string) => {
    if (type === 'github') {
        return '/user/default-github.png';
    } else if (type === 'GOOGLE') {
        return '/user/default-google.png';
    } else {
        return '/user/default-user.png';
    }
}


export const convertToSlug = (text: string) => {
    if (!text) return '';
    return slugify(text,
        {
            lower: true,
            locale: 'vi'

        })
}

export const getMinPrice = (variants: IPerfumeVariant[]): number => {
    return Math.min(...variants.map((v) => v.price).filter((price): price is number => price !== undefined));
};

export const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const VOLUMES_OPTIONS = ['20', '50', '100', '100+']

export const SEX_OPTIONS = ['MEN', 'WOMEN', 'UNISEX']

export const TIERS_OPTIONS = ['BASIC', 'PREMIUM', 'LUXURY']

export const FRAGRANCE_TYPES_OPTIONS = [
    'Floral',
    'Woody',
    'Oriental',
    'Fresh',
    'Gourmand'
];