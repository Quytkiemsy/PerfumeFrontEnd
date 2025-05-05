import ProductDetail from "@/app/components/productDetail/product.detail";
import { sendRequest } from "@/app/util/api";

const Product = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const url1 = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${slug}`;
    const res = await sendRequest<IBackendRes<IProduct>>({
        url: url1,
        method: 'GET',
    });

    return (
        <ProductDetail product={res.data ?? null} />
    );
}

export default Product;
