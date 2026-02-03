// JSON-LD Structured Data Components for SEO
import React from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourperfumeshop.com';

// Organization Schema
export function OrganizationJsonLd() {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Perfume Shop',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        description: 'Cửa hàng nước hoa chính hãng cao cấp hàng đầu Việt Nam',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+84-xxx-xxx-xxx', // Replace with actual phone
            contactType: 'customer service',
            availableLanguage: ['Vietnamese', 'English'],
        },
        sameAs: [
            // Add your social media links
            // 'https://www.facebook.com/yourpage',
            // 'https://www.instagram.com/yourpage',
        ],
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Ho Chi Minh City',
            addressCountry: 'VN',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
    );
}

// Website Schema with Search Action
export function WebsiteJsonLd() {
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Perfume Shop',
        url: BASE_URL,
        description: 'Cửa hàng nước hoa chính hãng cao cấp hàng đầu Việt Nam',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/product?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
    );
}

// Product Schema
interface ProductJsonLdProps {
    product: IProduct;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
    const minPrice = product.perfumeVariants?.reduce((min, variant) => {
        return variant.price && variant.price < min ? variant.price : min;
    }, Infinity) || 0;

    const maxPrice = product.perfumeVariants?.reduce((max, variant) => {
        return variant.price && variant.price > max ? variant.price : max;
    }, 0) || 0;

    const inStock = product.perfumeVariants?.some(v => (v.stockQuantity || 0) > 0);

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || `${product.name} - Nước hoa chính hãng từ ${product.brand?.name}`,
        image: product.images?.map(img => `${BASE_URL}/api/image?filename=${img}`) || [],
        brand: {
            '@type': 'Brand',
            name: product.brand?.name || 'Unknown',
        },
        sku: product.id.toString(),
        mpn: product.id.toString(),
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'VND',
            lowPrice: minPrice,
            highPrice: maxPrice,
            offerCount: product.perfumeVariants?.length || 0,
            availability: inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'Perfume Shop',
            },
        },
        ...(product.averageRating && product.totalReviews && product.totalReviews > 0 && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.averageRating,
                reviewCount: product.totalReviews,
                bestRating: 5,
                worstRating: 1,
            },
        }),
        category: 'Perfume',
        url: `${BASE_URL}/product/${product.id}`,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
    );
}

// Breadcrumb Schema
interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbJsonLdProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
    );
}

// ItemList Schema for Product Lists
interface ItemListJsonLdProps {
    products: IProduct[];
    listName?: string;
}

export function ItemListJsonLd({ products, listName = 'Danh sách sản phẩm' }: ItemListJsonLdProps) {
    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: listName,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 10).map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Product',
                name: product.name,
                url: `${BASE_URL}/product/${product.id}`,
                image: product.images?.[0] ? `${BASE_URL}/api/image?filename=${product.images[0]}` : undefined,
                brand: {
                    '@type': 'Brand',
                    name: product.brand?.name || 'Unknown',
                },
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
    );
}

// Local Business Schema (if you have physical store)
export function LocalBusinessJsonLd() {
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'Perfume Shop',
        description: 'Cửa hàng nước hoa chính hãng cao cấp',
        url: BASE_URL,
        telephone: '+84-xxx-xxx-xxx', // Replace with actual phone
        priceRange: '$$',
        image: `${BASE_URL}/logo.png`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Your Street Address', // Replace
            addressLocality: 'Ho Chi Minh City',
            addressRegion: 'HCM',
            postalCode: '700000',
            addressCountry: 'VN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 10.8231, // Replace with actual coordinates
            longitude: 106.6297,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '21:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday', 'Sunday'],
                opens: '10:00',
                closes: '22:00',
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
    );
}

// FAQ Schema
interface FAQItem {
    question: string;
    answer: string;
}

interface FAQJsonLdProps {
    faqs: FAQItem[];
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
    );
}
