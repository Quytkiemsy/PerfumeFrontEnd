import ProductDetail from "@/app/components/productDetail/product.detail";
import { sendRequest } from "@/app/util/api";
import type { Metadata } from "next";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/app/components/seo/JsonLd";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourperfumeshop.com';

// ISR Configuration - Revalidate every 60 seconds
export const revalidate = 60;

// Generate static params for popular products at build time
export async function generateStaticParams() {
    try {
        const res = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
            method: 'GET',
            queryParams: {
                page: 0,
                size: 100, // Pre-generate top 100 products
                sort: 'visitCount,desc', // Most visited products first
            },
        });

        const products = res.data?.result || [];
        
        return products.map((product) => ({
            slug: product.id.toString(),
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Dynamic params - allow pages not generated at build time
export const dynamicParams = true;

// Generate dynamic metadata for each product
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${slug}`;
    
    try {
        const res = await sendRequest<IBackendRes<IProduct>>({
            url: url,
            method: 'GET',
        });

        const product = res.data;

        if (!product) {
            return {
                title: 'Sản phẩm không tìm thấy',
                description: 'Sản phẩm bạn đang tìm kiếm không tồn tại.',
            };
        }

        const productName = product.name;
        const brandName = product.brand?.name || '';
        const description = product.description || `${productName} - Nước hoa chính hãng từ ${brandName}. Mua ngay với giá tốt nhất tại Perfume Shop.`;
        const productImage = product.images?.[0] ? `${BASE_URL}/api/image?filename=${product.images[0]}` : '/og-image.jpg';
        
        // Get min price for structured data
        const minPrice = product.perfumeVariants?.reduce((min, variant) => {
            return variant.price && variant.price < min ? variant.price : min;
        }, Infinity) || 0;

        return {
            title: `${productName} - ${brandName}`,
            description: description.substring(0, 160),
            keywords: [
                productName,
                brandName,
                'nước hoa',
                'nước hoa chính hãng',
                product.sex === 'MALE' ? 'nước hoa nam' : product.sex === 'FEMALE' ? 'nước hoa nữ' : 'nước hoa unisex',
                product.tier || '',
            ].filter(Boolean),
            openGraph: {
                title: `${productName} - ${brandName} | Perfume Shop`,
                description: description.substring(0, 160),
                url: `${BASE_URL}/product/${slug}`,
                siteName: 'Perfume Shop',
                locale: 'vi_VN',
                type: 'website',
                images: [
                    {
                        url: productImage,
                        width: 800,
                        height: 800,
                        alt: `${productName} - ${brandName}`,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${productName} - ${brandName}`,
                description: description.substring(0, 160),
                images: [productImage],
            },
            alternates: {
                canonical: `${BASE_URL}/product/${slug}`,
            },
            other: {
                'product:price:amount': minPrice.toString(),
                'product:price:currency': 'VND',
                'product:availability': product.perfumeVariants?.some(v => (v.stockQuantity || 0) > 0) ? 'in stock' : 'out of stock',
                'product:brand': brandName,
            },
        };
    } catch (error) {
        return {
            title: 'Sản phẩm - Perfume Shop',
            description: 'Khám phá nước hoa chính hãng cao cấp tại Perfume Shop.',
        };
    }
}

const Product = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${slug}`;
    
    // Fetch product with ISR caching
    const res = await sendRequest<IBackendRes<IProduct>>({
        url: url,
        method: 'GET',
        nextOption: {
            next: { 
                revalidate: 60, // Revalidate every 60 seconds
                tags: [`product-${slug}`] // Tag for on-demand revalidation
            }
        }
    });

    // Handle 404 for non-existent products
    if (!res.data || res.statusCode === 404) {
        notFound();
    }

    // Fetch related products with caching
    const sortedProductByPrice = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
        method: 'GET',
        queryParams: {
            page: 0,
            size: 4,
            sort: 'perfumeVariants.price,asc',
        },
        nextOption: {
            next: { 
                revalidate: 300, // Related products can be cached longer (5 minutes)
                tags: ['products-list']
            }
        }
    });

    const product = res.data as IProduct;
    
    // Breadcrumb items for structured data
    const breadcrumbItems = [
        { name: 'Trang chủ', url: BASE_URL },
        { name: 'Sản phẩm', url: `${BASE_URL}/product` },
        ...(product?.brand?.name ? [{ name: product.brand.name, url: `${BASE_URL}/product?brand=${encodeURIComponent(product.brand.name)}` }] : []),
        { name: product?.name || 'Chi tiết sản phẩm', url: `${BASE_URL}/product/${slug}` },
    ];

    return (
        <>
            {product && <ProductJsonLd product={product} />}
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <ProductDetail product={product} sortedProductByPrice={sortedProductByPrice.data?.result as IProduct[]} />
        </>
    );
}

export default Product;
