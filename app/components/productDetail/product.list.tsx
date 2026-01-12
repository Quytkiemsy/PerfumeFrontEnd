import FilterProduct from '@/app/components/productDetail/filter.product';
import ProductCard from '@/app/components/productDetail/product.card';
import { sendRequest } from '@/app/util/api';
import Pagination from './product.pagination';


export default async function ListProduct({ searchParams, brands }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>, brands: IBrand[] }) {

    const queryParams: any = {
        page: 0,
        size: 8,
    };
    let filterArr: string[] = [];

    const params = await searchParams;
    if (params.page) {
        queryParams.page = parseInt(params.page as string, 10) - 1;
    }
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
    if (params.sex) {
        filterArr.push(`sex='${params.sex}'`);
    }
    if (params.tier) {
        filterArr.push(`tier='${params.tier}'`);
    }
    if (params.isNew) {
        filterArr.push(`isNew=true`);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="lg:container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-3">
                        ✨ Explore Our Collection
                    </h1>
                    <p className="text-gray-600 text-md">
                        Discover your signature scent from our curated selection
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filter */}
                    <div className="md:w-1/5 shrink-0">
                        <div className="sticky top-4">
                            <FilterProduct brands={brands} />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {products.length > 0 ? (
                            <>
                                <div className="mb-6 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Showing <span className="font-semibold text-gray-900">{products.length}</span> products
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <div 
                                            key={product.id}
                                            className="transform transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-4">
                                <div className="text-8xl mb-6">🔍</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
                                <p className="text-gray-600 text-center max-w-md">
                                    Try adjusting your filters or search criteria to find what you're looking for
                                </p>
                            </div>
                        )}
                        
                        {/* Pagination */}
                        {products.length > 0 && (
                            <div className="mt-12">
                                <Pagination 
                                    currentPage={res.data?.meta?.page as number} 
                                    totalPages={res.data?.meta?.pages as number} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}