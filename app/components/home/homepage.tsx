import ProductGrid from "@/app/components/home/product.home";
import Image from "next/image";
import Link from "next/link";
import HeroBanner from "@/app/components/home/hero.banner";
import PhilosophySection from "@/app/components/home/philosophy.section";
import CategoryGrid from "@/app/components/home/category.grid";

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
                
                <HeroBanner luxuryProduct={luxuryProduct} />

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <PhilosophySection />

            {/* Categories Grid */}
            <CategoryGrid 
                menProduct={menProduct}
                womenProduct={womenProduct}
                unisexProduct={unisexProduct}
            />

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
