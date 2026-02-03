import ProductGrid from "@/app/components/home/product.home";
import Image from "next/image";
import Link from "next/link";

interface IProductProps {
    luxuryProduct: IProduct;
    menProduct: IProduct;
    womenProduct: IProduct;
    unisexProduct: IProduct;
    calvinKleinProduct: IProduct;
    chanelProduct: IProduct;
    diorProduct: IProduct;
    versaceProduct: IProduct;
    tomFordProduct: IProduct;
    sortedProductByPrice: IProduct[];
}

const imageSizes = {
    banner: "100vw",
    twoCol: "(max-width: 768px) 100vw, 50vw",
    threeCol: "(max-width: 768px) 100vw, 33vw",
};

const Homepage = async ({ luxuryProduct, menProduct, womenProduct, unisexProduct, calvinKleinProduct,
    chanelProduct, diorProduct, versaceProduct, tomFordProduct, sortedProductByPrice }: IProductProps) => {
    return (
        <div className="bg-gradient-to-b from-white via-gray-50 to-white">
            {/* Hero Banner */}
            <section className="relative w-full h-[90vh] overflow-hidden group">
                <Image
                    src={`/api/image?filename=${luxuryProduct?.images[0]}`}
                    alt={`${luxuryProduct?.name} - Nước hoa luxury cao cấp từ ${luxuryProduct?.brand?.name || 'thương hiệu nổi tiếng'}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    sizes={imageSizes.banner}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                    <span className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-white/30 animate-pulse">
                        ✨ New Collection 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl leading-tight">
                        Not a Mirage
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-2xl">
                        Discover our exquisite collection of premium fragrances
                    </p>
                    <Link 
                        href={`/product?tier=LUXURY`} 
                        className="group/btn px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-2xl transform hover:scale-105 active:scale-95"
                    >
                        <span className="flex items-center gap-2">
                            Explore Luxury Collection
                            <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </Link>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="max-w-6xl mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
                    Being Natural is #1. We're #2.
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                    We believe in sustainable luxury. Every fragrance tells a story of elegance and responsibility.
                </p>
            </section>

            {/* Categories Grid */}
            <section className="max-w-7xl mx-auto px-4 pb-20">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Shop by Category</h3>
                    <p className="text-gray-600">Find your perfect scent</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Men Category */}
                    <Link href={`/product?sex=MALE`} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                        <div className="relative aspect-[3/4]">
                            <Image
                                src={`/api/image?filename=${menProduct?.images[0]}`}
                                alt={`${menProduct?.name} - Nước hoa nam chính hãng từ ${menProduct?.brand?.name || 'thương hiệu cao cấp'}`}
                                fill
                                priority
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes={imageSizes.threeCol}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            
                            {/* Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-xs font-bold shadow-lg">
                                    👨 For Men
                                </span>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                                <h4 className="text-2xl font-bold mb-2">Men's Collection</h4>
                                <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Bold & sophisticated fragrances
                                </p>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                                    Explore Now
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Women Category */}
                    <Link href={`/product?sex=FEMALE`} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                        <div className="relative aspect-[3/4]">
                            <Image
                                src={`/api/image?filename=${womenProduct?.images[0]}`}
                                alt={`${womenProduct?.name} - Nước hoa nữ chính hãng từ ${womenProduct?.brand?.name || 'thương hiệu cao cấp'}`}
                                fill
                                priority
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes={imageSizes.threeCol}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            
                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 bg-pink-500 text-white rounded-full text-xs font-bold shadow-lg">
                                    👩 For Women
                                </span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                                <h4 className="text-2xl font-bold mb-2">Women's Collection</h4>
                                <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Elegant & captivating scents
                                </p>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                                    Explore Now
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Unisex Category */}
                    <Link href={`/product?sex=UNISEX`} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                        <div className="relative aspect-[3/4]">
                            <Image
                                src={`/api/image?filename=${unisexProduct?.images[0]}`}
                                alt={`${unisexProduct?.name} - Nước hoa unisex chính hãng từ ${unisexProduct?.brand?.name || 'thương hiệu cao cấp'}`}
                                fill
                                priority
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes={imageSizes.threeCol}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            
                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 bg-purple-500 text-white rounded-full text-xs font-bold shadow-lg">
                                    👥 Unisex
                                </span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                                <h4 className="text-2xl font-bold mb-2">Unisex Collection</h4>
                                <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Timeless fragrances for everyone
                                </p>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                                    Explore Now
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Featured Brands - 2 Column */}
            <section className="max-w-7xl mx-auto px-4 pb-20">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Premium Brands</h3>
                    <p className="text-gray-600">Curated selection from world-class designers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Calvin Klein */}
                    <Link href={`/product?brand=Vintage+Vibe`} className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="relative h-[500px]">
                            <Image
                                src={`/api/image?filename=${calvinKleinProduct?.images[0]}`}
                                alt={calvinKleinProduct?.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes={imageSizes.twoCol}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent"></div>
                            
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                                <div className="transform transition-all duration-500 group-hover:-translate-y-4">
                                    <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Calvin Klein</h2>
                                    <p className="text-lg text-gray-200 mb-6">Minimalist elegance</p>
                                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-xl">
                                        View Collection
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Chanel */}
                    <Link href={`/product?brand=Chanel`} className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="relative h-[500px]">
                            <Image
                                src={`/api/image?filename=${chanelProduct?.images[0]}`}
                                alt={chanelProduct?.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes={imageSizes.twoCol}
                            />
                            <div className="absolute inset-0 bg-gradient-to-bl from-black/60 via-black/30 to-transparent"></div>
                            
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                                <div className="transform transition-all duration-500 group-hover:-translate-y-4">
                                    <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Chanel</h2>
                                    <p className="text-lg text-gray-200 mb-6">Timeless luxury</p>
                                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-xl">
                                        View Collection
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Designer Showcase - 3 Column */}
            <section className="max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Dior */}
                    <Link href={`/product?brand=Dior`} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                        <div className="relative h-[400px]">
                            <Image
                                src={`/api/image?filename=${diorProduct?.images[0]}`}
                                alt={diorProduct?.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes={imageSizes.threeCol}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-3xl font-bold mb-2">Dior</h3>
                                <p className="text-sm text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    French sophistication
                                </p>
                                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                                    Discover →
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Versace */}
                    <Link href={`/product?brand=Versace`} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                        <div className="relative h-[400px]">
                            <Image
                                src={`/api/image?filename=${versaceProduct?.images[0]}`}
                                alt={versaceProduct?.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes={imageSizes.threeCol}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-3xl font-bold mb-2">Versace</h3>
                                <p className="text-sm text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Italian glamour
                                </p>
                                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                                    Discover →
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Tom Ford */}
                    <Link href={`/product?brand=Tom+Ford`} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                        <div className="relative h-[400px]">
                            <Image
                                src={`/api/image?filename=${tomFordProduct?.images[0]}`}
                                alt={tomFordProduct?.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes={imageSizes.threeCol}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-3xl font-bold mb-2">Tom Ford</h3>
                                <p className="text-sm text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Modern luxury
                                </p>
                                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                                    Discover →
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Product Grid */}
            {/* <ProductGrid sortedProductByPrice={sortedProductByPrice} /> */}
        </div>
    );
};

export default Homepage;
