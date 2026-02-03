import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourperfumeshop.com'

interface IProductSitemap {
    id: number;
    name: string;
    updatedAt?: string;
}

async function getProducts(): Promise<IProductSitemap[]> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?page=0&size=1000`,
            { next: { revalidate: 3600 } } // Revalidate every hour
        )
        if (!response.ok) return []
        const data = await response.json()
        return data?.data?.result || []
    } catch (error) {
        console.error('Error fetching products for sitemap:', error)
        return []
    }
}

async function getBrands(): Promise<IBrand[]> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands`,
            { next: { revalidate: 3600 } }
        )
        if (!response.ok) return []
        const data = await response.json()
        return data?.data?._embedded?.brands || []
    } catch (error) {
        console.error('Error fetching brands for sitemap:', error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getProducts()
    const brands = await getBrands()

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/product`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/cart`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/like`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ]

    // Product pages
    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${BASE_URL}/product/${product.id}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Brand filter pages
    const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
        url: `${BASE_URL}/product?brand=${encodeURIComponent(brand.name)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/product?sex=MALE`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/product?sex=FEMALE`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/product?sex=UNISEX`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/product?tier=LUXURY`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/product?tier=PREMIUM`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]

    return [...staticPages, ...productPages, ...brandPages, ...categoryPages]
}
