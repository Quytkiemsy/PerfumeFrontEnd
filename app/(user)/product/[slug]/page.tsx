import ProductDetail from "@/app/components/productDetail/product.detail";
import { sendRequest } from "@/app/util/api";

const Product = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${slug}`;
    const res = await sendRequest<IBackendRes<IProduct>>({
        url: url,
        method: 'GET',
    });

    const sortedProductByPrice = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
        method: 'GET',
        queryParams: {
            page: 0,
            size: 4,
            sort: 'perfumeVariants.price,asc',
        },
    });

    return (
        <ProductDetail product={res.data as IProduct} sortedProductByPrice={sortedProductByPrice.data?.result as IProduct[]} />
    );
}

export default Product;
