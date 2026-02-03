import ListProduct from '@/app/components/productDetail/product.list';
import { sendRequest } from '../../util/api';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourperfumeshop.com';

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate dynamic metadata based on search/filter params
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    
    let title = 'Tất Cả Sản Phẩm';
    let description = 'Khám phá bộ sưu tập nước hoa chính hãng cao cấp từ các thương hiệu nổi tiếng thế giới.';
    const keywords: string[] = ['nước hoa', 'nước hoa chính hãng', 'perfume'];
    
    // Build title and description based on filters
    if (params.brand) {
        const brandName = Array.isArray(params.brand) ? params.brand[0] : params.brand;
        title = `Nước Hoa ${brandName}`;
        description = `Khám phá bộ sưu tập nước hoa ${brandName} chính hãng. Đa dạng mùi hương, giá tốt nhất tại Perfume Shop.`;
        keywords.push(brandName, `nước hoa ${brandName}`);
    }
    
    if (params.sex) {
        const sexMap: { [key: string]: string } = {
            'MALE': 'Nam',
            'FEMALE': 'Nữ',
            'UNISEX': 'Unisex',
        };
        const sexValue = Array.isArray(params.sex) ? params.sex[0] : params.sex;
        const sexLabel = sexMap[sexValue.toUpperCase()] || sexValue;
        
        if (params.brand) {
            title += ` - ${sexLabel}`;
        } else {
            title = `Nước Hoa ${sexLabel}`;
            description = `Bộ sưu tập nước hoa ${sexLabel.toLowerCase()} chính hãng. Đa dạng thương hiệu cao cấp tại Perfume Shop.`;
        }
        keywords.push(`nước hoa ${sexLabel.toLowerCase()}`);
    }
    
    if (params.tier) {
        const tierValue = Array.isArray(params.tier) ? params.tier[0] : params.tier;
        if (tierValue.toUpperCase() === 'LUXURY') {
            title = params.brand || params.sex ? `${title} - Luxury` : 'Nước Hoa Luxury Cao Cấp';
            description = 'Bộ sưu tập nước hoa luxury cao cấp từ các thương hiệu danh tiếng nhất thế giới.';
            keywords.push('nước hoa luxury', 'nước hoa cao cấp');
        } else if (tierValue.toUpperCase() === 'PREMIUM') {
            title = params.brand || params.sex ? `${title} - Premium` : 'Nước Hoa Premium';
            keywords.push('nước hoa premium');
        }
    }

    // Build canonical URL
    const urlParams = new URLSearchParams();
    if (params.brand) urlParams.set('brand', Array.isArray(params.brand) ? params.brand[0] : params.brand);
    if (params.sex) urlParams.set('sex', Array.isArray(params.sex) ? params.sex[0] : params.sex);
    if (params.tier) urlParams.set('tier', Array.isArray(params.tier) ? params.tier[0] : params.tier);
    
    const canonicalUrl = urlParams.toString() ? `${BASE_URL}/product?${urlParams.toString()}` : `${BASE_URL}/product`;

    return {
        title,
        description,
        keywords,
        openGraph: {
            title: `${title} | Perfume Shop`,
            description,
            url: canonicalUrl,
            siteName: 'Perfume Shop',
            locale: 'vi_VN',
            type: 'website',
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | Perfume Shop`,
            description,
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

const Page = async ({ searchParams }: PageProps) => {

    const res = await sendRequest<IBackendRes<IModelPaginateRestJPA<IBrand>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands`,
        method: 'GET',
    });

    const brands = res.data?._embedded.brands || [] as IBrand[];


    return (
        <>
            <ListProduct searchParams={searchParams} brands={brands} />
        </>
    );
}

export default Page;
