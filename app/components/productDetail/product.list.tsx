import FilterProduct from '@/app/components/productDetail/filter.product';
import ProductCard from '@/app/components/productDetail/product.card';
import { sendRequest } from '@/app/util/api';


export default async function ListProduct({ searchParams, brands }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>, brands: IBrand[] }) {

    const queryParams: any = {
        page: 0,
        size: 8,
    };
    let filterArr: string[] = [];
    const params = await searchParams;
    if (params.brand) {
        filterArr.push(`brand.name='${params.brand}'`);
    }
    if (params.volume && params.volume !== 'all') {
        if (params.volume !== '100+') {
            filterArr.push(`perfumeVariants.volume<='${params.volume}'`);
        } else {
            filterArr.push(`perfumeVariants.volume>='${params.volume}'`);
        }
    }
    if (params.priceFrom) {
        filterArr.push(`perfumeVariants.price>='${params.priceFrom}'`);
    }
    if (params.priceTo) {
        filterArr.push(`perfumeVariants.price<='${params.priceTo}'`);
    }
    if (filterArr.length > 0) {
        queryParams.filter = filterArr.join(' and ');
    }
    const res = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
        method: 'GET',
        queryParams: queryParams
    });
    const products = res.data?.result || [] as IProduct[];

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row">
                {/* Bộ lọc bên trái */}
                <FilterProduct brands={brands} />

                {/* Danh sách sản phẩm */}
                <div className="w-full md:w-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}